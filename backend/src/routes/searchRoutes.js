/**
 * Search API Routes — Person 2
 *
 * POST /api/incidents/search
 *   Body: current incident (title, description, service, environment, severity,
 *         symptoms[], errorMessage | error_message)
 *   Returns: normalized query + hybrid search intelligence + ranked matches
 *
 * This endpoint is the retrieval layer consumed by:
 *   - Person 3's `/api/ai/troubleshoot` (uses `matches` as grounded context)
 *   - Person 4's Evidence Cards / Search Intelligence panel
 */

import { Router } from "express";
import { hybridSearch } from "../services/searchService.js";

const router = Router();

function hasSearchableContent(body = {}) {
  if (Array.isArray(body.symptoms) && body.symptoms.length > 0) return true;
  if (typeof body.symptoms === "string" && body.symptoms.trim()) return true;
  return Boolean(
    String(body.description || "").trim() ||
      String(body.title || "").trim() ||
      String(body.errorMessage || body.error_message || "").trim()
  );
}

router.post("/incidents/search", async (req, res, next) => {
  try {
    if (!hasSearchableContent(req.body)) {
      return res.status(400).json({
        error: "At least one of title, description, symptoms, or errorMessage is required."
      });
    }

    const topK = req.body.top_k ?? req.body.topK;
    const result = await hybridSearch(req.body, { topK });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

export default router;
