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

def _pick_lesson_id(event):
    pp = event.get("pathParameters") or {}
    if isinstance(pp, dict):
        if pp.get("lessonId"):
            return pp["lessonId"]
        if pp.get("lessonsId"):
            return pp["lessonsId"]
    raw_path = (event.get("rawPath") or event.get("path") or "").strip("/")
    if raw_path:
        return raw_path.split("/")[-1]
    return None

def lambda_handler(event, _):
    method = (event.get("requestContext") or {}).get("http", {}).get("method", "GET").upper()
    if method == "OPTIONS":
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    lesson_id = _pick_lesson_id(event)
    if not lesson_id:
        return _resp(400, {"error": "lessonId required"})

    r = LESSONS.get_item(Key={"lessonId": lesson_id})
    item = r.get("Item")
    if not item:
        return _resp(404, {"error": "Not Found"})
    if "lessonsId" in item and "lessonId" not in item:
        item["lessonId"] = item["lessonsId"]
        del item["lessonsId"]
    return _resp(200, item)

