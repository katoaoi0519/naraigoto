# post_review.py
# -*- coding: utf-8 -*-
import json, os, uuid
from datetime import datetime, timezone
import boto3

dynamodb = boto3.resource('dynamodb')
PARENT_TBL = os.environ['PARENT_REVIEWS_TABLE']
CHILD_TBL  = os.environ['CHILD_REVIEWS_TABLE']
parent_table = dynamodb.Table(PARENT_TBL)
child_table  = dynamodb.Table(CHILD_TBL)

def _res(code, body):
    return {
        "statusCode": code,
        "headers": {"Content-Type":"application/json; charset=utf-8"},
        "body": json.dumps(body, ensure_ascii=False)
    }

def lambda_handler(event, _ctx):
    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return _res(400, {"error":"invalid json"})

    role = (body.get("role") or "").lower()
    if role not in ("parent","child"):
        return _res(400, {"error":"role must be 'parent' or 'child'"})

    for k in ("lessonId","userId","rating"):
        if body.get(k) in (None,""):
            return _res(400, {"error": f"Missing field: {k}"})

    item = {
        "lessonId": body["lessonId"],
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "reviewId": str(uuid.uuid4()),
        "userId": body["userId"],
        "rating": int(body["rating"]),
        "comment": body.get("comment",""),
        "role": role,
        "helpfulCount": 0,
        "status": "approved"
    }
    (parent_table if role=="parent" else child_table).put_item(Item=item)
    return _res(201, {"ok": True, "review": item})
