import os, json
import boto3

dynamodb = boto3.resource("dynamodb")
BOOKINGS = dynamodb.Table(os.getenv("BOOKINGS_TABLE", "Bookings"))

HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def _resp(code, body):
    return {"statusCode": code, "headers": HEADERS, "body": json.dumps(body, ensure_ascii=False)}

def lambda_handler(event, _):
    method = (event.get("requestContext") or {}).get("http", {}).get("method") or event.get("httpMethod")
    if method and method.upper() == "OPTIONS":
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    pp = event.get("pathParameters") or {}
    booking_id = None
    if isinstance(pp, dict):
        booking_id = pp.get("id") or pp.get("bookingId")
    if not booking_id:
        return _resp(400, {"ok": False, "error": "bookingId required (path)"})

    try:
        r = BOOKINGS.update_item(
            Key={"bookingId": booking_id},
            UpdateExpression="SET #s = :c",
            ConditionExpression="#s = :r",
            ExpressionAttributeNames={"#s": "status"},
            ExpressionAttributeValues={":c": "canceled", ":r": "reserved"},
            ReturnValues="ALL_NEW"
        )
        return _resp(200, {"ok": True, "booking": r.get("Attributes", {})})
    except BOOKINGS.meta.client.exceptions.ConditionalCheckFailedException:
        return _resp(409, {"ok": False, "error": "Only reserved bookings can be canceled"})
    except Exception as e:
        return _resp(500, {"ok": False, "error": str(e)})


