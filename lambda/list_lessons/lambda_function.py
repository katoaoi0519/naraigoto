import os, json
import boto3
from decimal import Decimal

dynamodb = boto3.resource("dynamodb")
LESSONS = dynamodb.Table(os.getenv("LESSONS_TABLE", "Lessons"))

HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
}

def _decimal_to_native(obj):
    if isinstance(obj, list):
        return [_decimal_to_native(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _decimal_to_native(v) for k, v in obj.items()}
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def _resp(code, body):
    return {
        "statusCode": code,
        "headers": HEADERS,
        "body": json.dumps(_decimal_to_native(body), ensure_ascii=False)
    }

def lambda_handler(event, _):
    method = (event.get("requestContext") or {}).get("http", {}).get("method", "GET").upper()
    if method == "OPTIONS":
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    resp = LESSONS.scan(Limit=50)
    items = resp.get("Items", [])

    fixed = []
    for x in items:
        if "lessonsId" in x and "lessonId" not in x:
            x["lessonId"] = x["lessonsId"]
            del x["lessonsId"]
        fixed.append(x)

    return _resp(200, fixed)



