import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Database,
  FileSearch,
  LoaderCircle,
  Search,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";

const initialIncident = {
  title: "",
  description: "",
  service: "VMware Horizon",
  environment: "Production",
  severity: "High",
  errorMessage: ""
};

async function api(path, options) {
  let response;
  try {
    response = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
  } catch {
    throw new Error("The local API is not responding yet. Wait for it to finish starting, then retry.");
  }

  let result;
  try {
    const body = await response.text();
    result = body ? JSON.parse(body) : {};
  } catch {
    throw new Error(`The local API returned an unreadable response (${response.status}). Retry shortly.`);
  }
  if (!response.ok) throw new Error(result.error || "Request failed");
  return result;
}

function formatDate(value) {
  if (!value) return "Recently resolved";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function matchesSearchedIncident(incident, searchedIncident) {
  return Boolean(searchedIncident) && Object.keys(incident).every((field) => incident[field] === searchedIncident[field]);
}

function hasResolutionFields(incident, rootCause, resolution, databaseReady) {
  return databaseReady && Boolean(
    incident.title.trim() &&
    incident.description.trim() &&
    rootCause.trim() &&
    resolution.trim()
  );
}

function briefTag(brief, loading) {
  if (loading) return "GENERATING";
  if (!brief) return "LOCAL MODE";
  if (brief.confidence === "LOW") return "LOW CONFIDENCE";
  if (brief.mode === "evidence-only") return "EVIDENCE ONLY";
  return "LOCAL RAG";
}

function briefDescription(brief, loading) {
  if (loading) return "The on-device model is reviewing retrieved incident records.";
  if (!brief?.mode) return "Search the incident memory to retrieve relevant causes and fixes.";
  if (brief.confidence === "LOW") return `Confidence: LOW. Evidence: ${brief.evidenceDescription || "No strong historical matches."}`;
  const model = brief.mode === "evidence-only" ? "retrieved evidence only" : brief.mode;
  return `Generated on-device with ${model}. Verify each suggested check against the current environment.`;
}

function EvidenceBrief({ brief, briefLoading, selected, stats }) {
  const lowConfidence = brief?.confidence === "LOW";
  let heading = "Waiting for a match.";
  if (briefLoading) heading = "Reading related fixes…";
  else if (brief?.summary) heading = brief.summary;

  return (
    <aside className="evidence-panel">
      <div className="evidence-top"><span className="evidence-icon"><Sparkles size={16} /></span><span className="section-kicker">EVIDENCE BRIEF</span><span className="brief-tag">{briefTag(brief, briefLoading)}</span></div>
      <h3>{heading}</h3>
      <p className="evidence-copy">{briefDescription(brief, briefLoading)}</p>
      {brief?.recommendedAction && <div className={`recommended-action ${brief.confidence === "LOW" ? "is-low-confidence" : ""}`}><span>{brief.confidence === "LOW" ? "RECOMMENDED ACTION" : "NEXT ACTION"}</span><p>{brief.recommendedAction}</p></div>}
      {brief?.checks?.length > 0 && <ol className="brief-checks">{brief.checks.map((check, index) => <li key={`${index}-${check}`}>{check}</li>)}</ol>}
      {selected && <div className="evidence-source"><span className="source-bar" /><div><span>{lowConfidence ? "PARTIAL HISTORICAL EVIDENCE" : "HISTORICAL EVIDENCE"}</span><strong>{selected.incidentNumber} · {selected.service}</strong></div><CheckCircle2 size={16} /></div>}
      {brief?.confidence === "LOW" && brief?.humanVerification && <div className="brief-note low-confidence-note"><ShieldCheck size={14} /><span>⚠ Human verification recommended.</span></div>}
      {brief?.warning && <div className="brief-note"><ShieldCheck size={14} /><span>Local model unavailable; showing retrieved evidence without generation.</span></div>}
      {brief && !brief.warning && !lowConfidence && <div className="brief-note"><ShieldCheck size={14} /><span>Suggestions are grounded in retrieved MongoDB records. Verify before acting.</span></div>}
      <div className="evidence-foot"><span><Clock3 size={13} /> {stats.total} memories available</span><span><Database size={13} /> MONGODB</span></div>
    </aside>
  );
}

function App() {
  const [incident, setIncident] = useState(initialIncident);
  const [searchedIncident, setSearchedIncident] = useState(null);
  const [rootCause, setRootCause] = useState("");
  const [resolution, setResolution] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchMode, setSearchMode] = useState("text");
  const [strongMatch, setStrongMatch] = useState(false);
  const [brief, setBrief] = useState(null);
  const [briefLoading, setBriefLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, serviceCount: 0, helpful: 0, notHelpful: 0 });
  const [databaseReady, setDatabaseReady] = useState(false);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedbackBusy, setFeedbackBusy] = useState(false);
  const [savedIncident, setSavedIncident] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState("");

  const canResolveSearchedIncident = matchesSearchedIncident(incident, searchedIncident);
  const canSubmitResolution = hasResolutionFields(incident, rootCause, resolution, databaseReady);

  async function refreshStats() {
    const values = await api("/api/stats");
    setStats(values);
  }

  async function searchMemory() {
    const searchedReport = { ...incident };
    setSearching(true);
    setError("");
    setBrief(null);
    setBriefLoading(false);
    try {
      const query = `${searchedReport.title} ${searchedReport.description} ${searchedReport.errorMessage}`.trim();
      const { incidents, mode, strongMatch } = await api(`/api/incidents?q=${encodeURIComponent(query)}`);
      setSearchedIncident(searchedReport);
      setResults(incidents);
      setSearchMode(mode);
      setStrongMatch(strongMatch === true);
      setSelected((current) => incidents.find((item) => item.incidentNumber === current?.incidentNumber) || incidents[0] || null);
      setBriefLoading(true);
      const result = await api("/api/brief", {
        method: "POST",
        body: JSON.stringify({
          incident: searchedReport,
          strongMatch,
          retrievedIncidents: incidents.slice(0, 3).map((item) => item.incidentNumber)
        })
      });
      setBrief(result.brief);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSearching(false);
      setBriefLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    async function initialize() {
      let attempts = 0;
      while (active) {
        try {
          const health = await api("/api/health");
          const values = await api("/api/stats");
          if (active) {
            setDatabaseReady(health.status === "ok");
            setStats(values);
            setError("");
          }
          return;
        } catch (requestError) {
          attempts += 1;
          if (active && attempts === 20) {
            setError(`Waiting for the local API. ${requestError.message}`);
          }
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }
    initialize();
    return () => { active = false; };
  }, []);

  function updateIncident(event) {
    setIncident((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSearchedIncident(null);
    setResults([]);
    setSelected(null);
    setStrongMatch(false);
    setSearchMode("text");
    setRootCause("");
    setResolution("");
    setSavedIncident(null);
    setFeedback(null);
    setBrief(null);
  }

  async function resolveIncident(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const incidentToResolve = canResolveSearchedIncident ? searchedIncident : incident;
      const { incident: resolved } = await api("/api/incidents/resolve", {
        method: "POST",
        body: JSON.stringify({ ...incidentToResolve, rootCause, resolution, resolutionSummary: resolution })
      });
      setSavedIncident(resolved);
      setFeedback(null);
      setRootCause("");
      setResolution("");
      await refreshStats();
      await searchMemory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function sendFeedback(rating) {
    if (!savedIncident || feedbackBusy) return;
    setFeedbackBusy(true);
    try {
      await api("/api/feedback", {
        method: "POST",
        body: JSON.stringify({
          incidentNumber: savedIncident.incidentNumber,
          rating,
          retrievedIncidents: results.filter((item) => item.incidentNumber !== savedIncident.incidentNumber).map((item) => item.incidentNumber)
        })
      });
      setFeedback(rating);
      await refreshStats();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setFeedbackBusy(false);
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="OpsMemory home">
          <span className="brand-mark"><Activity size={19} strokeWidth={2.3} /></span>
          <span className="brand-name">ops<span>memory</span></span>
          <span className="brand-divider" />
          <span className="brand-context">INCIDENT INTELLIGENCE</span>
        </a>
        <div className="topbar-right">
          <div className={`connection-pill ${databaseReady ? "is-ready" : ""}`}>
            <span className="status-led" />
            <Database size={14} />
            <span>{databaseReady ? "MongoDB connected" : "Connecting"}</span>
          </div>
          <div className="workspace-select">LOCAL WORKSPACE <ChevronDown size={13} /></div>
          <span className="avatar">OM</span>
        </div>
      </header>

      <main id="top" className="workspace">
        <div className="page-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> OPERATIONS / MEMORY WORKSPACE</div>
            <h1>Investigate an incident<span className="heading-period">.</span></h1>
            <p className="page-subtitle">Find the fix your team already learned. Make the next one easier.</p>
          </div>
          <div className="heading-meta">
            <span className="meta-label">MEMORY INDEX</span>
            <span className="meta-value"><span className="meta-live" /> LIVE</span>
          </div>
        </div>

        <section className="metric-strip" aria-label="Memory statistics">
          <div className="metric"><span className="metric-icon"><Database size={16} /></span><span className="metric-label">Resolved memories</span><strong>{stats.total}</strong></div>
          <div className="metric"><span className="metric-icon mint"><FileSearch size={16} /></span><span className="metric-label">Services indexed</span><strong>{stats.serviceCount}</strong></div>
          <div className="metric"><span className="metric-icon amber"><ThumbsUp size={15} /></span><span className="metric-label">Helpful signals</span><strong>{stats.helpful}</strong></div>
          <div className="metric metric-note"><span className="metric-icon muted"><ShieldCheck size={16} /></span><span><strong>Grounded in your history</strong><small>Every match links to a saved resolution</small></span></div>
        </section>

        {error && <div className="error-banner" role="alert"><CircleAlert size={16} /> {error}</div>}

        <div className="work-grid">
          <section className="panel intake-panel">
            <div className="panel-heading">
              <div className="panel-title-wrap"><span className="step-index">01</span><div><span className="section-kicker">CURRENT INCIDENT</span><h2>What are you seeing?</h2></div></div>
              <span className="required-label"><span /> ACTIVE</span>
            </div>
            <form onSubmit={(event) => { event.preventDefault(); searchMemory(); }} className="incident-form">
              <label className="field-label" htmlFor="title">Incident title</label>
              <input id="title" name="title" value={incident.title} onChange={updateIncident} maxLength={160} required />
              <label className="field-label" htmlFor="description">Symptoms and context</label>
              <textarea id="description" name="description" value={incident.description} onChange={updateIncident} rows="4" maxLength={2000} required />
              <div className="field-grid">
                <label><span className="field-label">Service</span><select name="service" value={incident.service} onChange={updateIncident}><option>VMware Horizon</option><option>Windows GPO</option><option>Azure</option><option>DNS/VPN</option><option>Other</option></select></label>
                <label><span className="field-label">Severity</span><select name="severity" value={incident.severity} onChange={updateIncident}><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></label>
                <label><span className="field-label">Environment</span><select name="environment" value={incident.environment} onChange={updateIncident}><option>Production</option><option>Staging</option><option>Development</option><option>DR</option></select></label>
                <label><span className="field-label">Error code <span className="optional">OPTIONAL</span></span><input name="errorMessage" value={incident.errorMessage} onChange={updateIncident} maxLength={500} /></label>
              </div>
              <button className="primary-button search-button" type="submit" disabled={searching || !databaseReady}>
                {searching ? <LoaderCircle className="spin" size={17} /> : <Search size={17} />}
                <span>{searching ? "Searching memory" : "Find similar incidents"}</span>
                {!searching && <ArrowRight size={16} className="button-arrow" />}
              </button>
            </form>
            <div className="search-footnote"><Sparkles size={14} /> {searchMode === "local-hybrid" ? "On-device embeddings reranked with MongoDB text matches" : "Weighted MongoDB text search across titles, symptoms, causes, and fixes"}</div>
          </section>

          <section className="panel results-panel">
            <div className="panel-heading results-heading">
              <div className="panel-title-wrap"><span className="step-index">02</span><div><span className="section-kicker">HISTORICAL MEMORY</span><h2>Similar incidents <span className="count-badge">{results.length}</span></h2></div></div>
              <button className="icon-button" type="button" onClick={searchMemory} title="Refresh search" aria-label="Refresh search" disabled={!incident.title.trim() || !incident.description.trim() || searching}><ArrowDownRight size={17} /></button>
            </div>
            <div className="results-list" aria-live="polite">
              {results.length === 0 && !searching && <div className="empty-state"><Search size={22} /><strong>No matching memories yet</strong><span>Try a service name, symptom, or error code.</span></div>}
              {results.map((item, index) => (
                <button className={`result-row ${selected?.incidentNumber === item.incidentNumber ? "selected" : ""}`} type="button" key={item.incidentNumber} onClick={() => setSelected(item)}>
                  <span className="result-rank">{String(index + 1).padStart(2, "0")}</span>
                  <span className="result-copy"><span className="result-topline"><span className="incident-id">{item.incidentNumber}</span><span className={`severity-dot severity-${item.severity.toLowerCase()}`} />{item.severity}</span><strong>{item.title}</strong><span className="result-service">{item.service}<span />{formatDate(item.resolvedAt)}</span></span>
                  <ArrowRight size={15} className="result-arrow" />
                </button>
              ))}
            </div>
            {selected && <div className="selected-memory">
              <div className="selected-label"><CheckCircle2 size={15} /> {strongMatch ? "MATCHED RESOLUTION" : "PARTIAL HISTORICAL CONTEXT"} <span className="match-score">{searchMode === "local-hybrid" ? `HYBRID ${Math.round(Number(selected.score || 0) * 100)}%` : `TEXT SCORE ${Number(selected.score || 0).toFixed(1)}`}</span></div>
              <div className="memory-section"><span className="memory-label">{strongMatch ? "ROOT CAUSE" : "HISTORICAL ROOT CAUSE (VERIFY)"}</span><p>{selected.rootCause}</p></div>
              <div className="memory-section resolution-memory"><span className="memory-label">{strongMatch ? "WHAT FIXED IT" : "HISTORICAL RESOLUTION (VERIFY BEFORE USE)"}</span><p>{selected.resolution}</p></div>
            </div>}
          </section>

          <section className="panel resolve-panel">
            <div className="panel-heading">
              <div className="panel-title-wrap"><span className="step-index">03</span><div><span className="section-kicker">CLOSE THE LOOP</span><h2>Resolve &amp; remember</h2></div></div>
              <span className="memory-write"><Database size={13} /> {canResolveSearchedIncident ? "READY TO SAVE" : "SEARCH INCIDENT FIRST"}</span>
            </div>
            <form onSubmit={resolveIncident} className="resolve-form">
              <label className="field-label" htmlFor="rootCause">Root cause</label>
              <textarea id="rootCause" value={rootCause} onChange={(event) => setRootCause(event.target.value)} rows="2" maxLength={2000} placeholder="What was the underlying cause?" required />
              <label className="field-label" htmlFor="resolution">Resolution</label>
              <textarea id="resolution" value={resolution} onChange={(event) => setResolution(event.target.value)} rows="2" maxLength={3000} placeholder="What steps fixed the incident?" required />
              <button className="primary-button resolve-button" type="submit" disabled={saving || !canSubmitResolution}>
                {saving ? <LoaderCircle className="spin" size={17} /> : <Check size={17} />}
                <span>{saving ? "Saving resolution" : "Resolve & remember"}</span>
                {!saving && <ArrowRight size={16} className="button-arrow" />}
              </button>
            </form>
            {savedIncident && <output className="saved-confirmation">
              <div className="saved-id"><CheckCircle2 size={18} /><span>Saved to incident memory</span><strong>{savedIncident.incidentNumber}</strong></div>
              <div className="memory-loop"><span className="loop-line" /><span>Now searchable above</span><ArrowRight size={14} /></div>
              <div className="feedback-row"><span>{feedback ? "Thanks for the signal" : "Was this recommendation useful?"}</span><div className="feedback-actions">
                <button type="button" className={feedback === "helpful" ? "chosen" : ""} onClick={() => sendFeedback("helpful")} disabled={feedbackBusy || Boolean(feedback)} aria-label="Helpful"><ThumbsUp size={15} /></button>
                <button type="button" className={feedback === "not_helpful" ? "chosen" : ""} onClick={() => sendFeedback("not_helpful")} disabled={feedbackBusy || Boolean(feedback)} aria-label="Not helpful"><ThumbsDown size={15} /></button>
              </div></div>
            </output>}
          </section>

          <EvidenceBrief brief={brief} briefLoading={briefLoading} selected={selected} stats={stats} />
        </div>

        <footer className="footer-bar"><span>OPSMEMORY <i>LOCAL DEMO</i></span><span className="footer-center"><span className="status-led" /> All changes stored in MongoDB</span><span>BUILD 01 <span className="footer-separator">/</span> {new Date().getFullYear()}</span></footer>
      </main>
    </div>
  );
}

export default App;