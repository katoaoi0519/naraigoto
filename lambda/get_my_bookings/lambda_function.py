import os, json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
BOOKINGS = dynamodb.Table(os.getenv("BOOKINGS_TABLE", "Bookings"))

HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
}

def _resp(code, body):
    return {"statusCode": code, "headers": HEADERS, "body": json.dumps(body, ensure_ascii=False)}

def lambda_handler(event, _):
    method = (event.get("requestContext") or {}).get("http", {}).get("method") or event.get("httpMethod")
    if method and method.upper() == "OPTIONS":
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    q = event.get("queryStringParameters") or {}
    user_id = None
    if isinstance(q, dict):
        user_id = q.get("userId") or q.get("uid")
    if not user_id:
        # 将来的には認証トークン(JWT)から抽出
        return _resp(400, {"ok": False, "error": "userId required (query)"})

    # まずは GSI: userId-index がある場合を優先
    try:
        r = BOOKINGS.query(
            IndexName=os.getenv("BOOKINGS_USER_INDEX", "userId-index"),
            KeyConditionExpression=Key("userId").eq(user_id),
            Limit=100,
            ScanIndexForward=False
        )
        items = r.get("Items", [])
    except Exception:
        # フォールバック: 全件スキャン（デモ用途）
        r = BOOKINGS.scan(Limit=200)
        items = [it for it in r.get("Items", []) if it.get("userId") == user_id]

    return _resp(200, {"ok": True, "bookings": items})


