# ファイル: lambda_function.py
import json, time, uuid, os
import boto3

dynamodb = boto3.resource("dynamodb")
BOOKINGS = dynamodb.Table(os.getenv("BOOKINGS_TABLE", "Bookings"))
HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def lambda_handler(event, _):
    try:
        method = (event.get("requestContext") or {}).get("http", {}).get("method") or event.get("httpMethod")
        if method and method.upper() == "OPTIONS":
            return {"statusCode": 204, "headers": HEADERS, "body": ""}

        body = json.loads(event.get("body") or "{}")

        # 最低限の入力チェック（足りなければ 400）
        for k in ("userId", "lessonId"):
            if k not in body or not body[k]:
                return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"ok": False, "error": f"Missing field: {k}"}, ensure_ascii=False)}

        item = {
            "bookingId": str(uuid.uuid4()),
            "userId": body["userId"],
            "lessonId": body["lessonId"],
            "schedule": body.get("schedule","2025-09-30T17:00:00Z"),
            "status": "reserved",
            "consumedTickets": body.get("consumedTickets", 1),
            "createdAt": int(time.time())
        }
        BOOKINGS.put_item(Item=item)

        return {"statusCode": 201, "headers": HEADERS, "body": json.dumps({"ok": True, "booking": item}, ensure_ascii=False)}

    except Exception as e:
        return {"statusCode": 500, "headers": HEADERS, "body": json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False)}
