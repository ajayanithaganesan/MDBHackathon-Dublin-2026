import json
from datetime import datetime, timezone

INCIDENTS_VALIDATOR = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "incidentNumber", "title", "description", "service",
            "environment", "severity", "status", "rootCause", "resolution"
        ],
        "properties": {
            "incidentNumber": {
                "bsonType": "string",
                "pattern": "^INC-[0-9]{4}-[0-9]{4,}$",
                "description": "Unique incident ID (e.g., INC-2026-0001)"
            },
            "title": {"bsonType": "string"},
            "description": {"bsonType": "string"},
            "service": {"bsonType": "string"},
            "environment": {
                "bsonType": "string",
                "enum": ["Production", "Staging", "Development", "DR"]
            },
            "severity": {
                "bsonType": "string",
                "enum": ["Critical", "High", "Medium", "Low"]
            },
            "symptoms": {
                "bsonType": "array",
                "items": {"bsonType": "string"}
            },
            "errorMessage": {"bsonType": ["string", "null"]},
            "rootCause": {"bsonType": "string"},
            "resolution": {"bsonType": "string"},
            "resolutionSummary": {"bsonType": "string"},
            "status": {
                "bsonType": "string",
                "enum": ["resolved", "investigating", "mitigated"]
            },
            "createdAt": {"bsonType": "date"},
            "resolvedAt": {"bsonType": "date"},
            "embedding": {
                "bsonType": "array",
                "items": {"bsonType": "double"}
            }
        }
    }
}

COUNTERS_VALIDATOR = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["_id", "sequence"],
        "properties": {
            "_id": {"bsonType": "string"},
            "sequence": {"bsonType": ["int", "long"]},
            "year": {"bsonType": ["int", "long"]},
            "updatedAt": {"bsonType": "date"}
        }
    }
}

FEEDBACK_VALIDATOR = {
    "$jsonSchema": {
        "bsonType": "object",
        "required": ["incidentNumber", "rating", "retrievedIncidents"],
        "properties": {
            "incidentNumber": {"bsonType": "string"},
            "rating": {
                "bsonType": "string",
                "enum": ["helpful", "not_helpful"]
            },
            "comment": {"bsonType": "string"},
            "retrievedIncidents": {
                "bsonType": "array",
                "items": {"bsonType": "string"}
            },
            "createdAt": {"bsonType": "date"}
        }
    }
}


def get_next_incident_number(db, target_year=None):
    """
    Atomic counter generator using find_one_and_update with $inc and upsert
    """
    if target_year is None:
        target_year = datetime.now(timezone.utc).year

    counter_id = f"incident_{target_year}"
    counters = db["counters"]

    # MongoDB pymongo find_one_and_update
    from pymongo import ReturnDocument
    result = counters.find_one_and_update(
        {"_id": counter_id},
        {
            "$inc": {"sequence": 1},
            "$set": {"year": target_year, "updatedAt": datetime.now(timezone.utc)}
        },
        upsert=True,
        return_document=ReturnDocument.AFTER
    )
    seq = result.get("sequence", 1)
    return f"INC-{target_year}-{seq:04d}"


def set_incident_counter(db, starting_sequence, target_year=None):
    if target_year is None:
        target_year = datetime.now(timezone.utc).year

    counter_id = f"incident_{target_year}"
    db["counters"].update_one(
        {"_id": counter_id},
        {
            "$set": {
                "sequence": starting_sequence,
                "year": target_year,
                "updatedAt": datetime.now(timezone.utc)
            }
        },
        upsert=True
    )
