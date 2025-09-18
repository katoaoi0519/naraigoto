import os
import json
import boto3

dynamodb = boto3.resource('dynamodb')
LIKES = dynamodb.Table(os.getenv('LIKES_TABLE', 'Likes'))

HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "DELETE,OPTIONS"
}

def lambda_handler(event, _):
    method = (event.get('requestContext') or {}).get('http', {}).get('method') or event.get('httpMethod')
    if method and method.upper() == 'OPTIONS':
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    pp = event.get('pathParameters') or {}
    user_id = None
    school_id = None
    if isinstance(pp, dict):
        user_id = pp.get('userId')
        school_id = pp.get('schoolId') or pp.get('id')
    if not user_id or not school_id:
        # fallback from body
        try:
            b = json.loads(event.get('body') or '{}')
        except Exception:
            b = {}
        user_id = user_id or b.get('userId')
        school_id = school_id or b.get('schoolId')
    if not user_id or not school_id:
        return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"ok": False, "error": "userId and schoolId required"}, ensure_ascii=False)}

    try:
        LIKES.delete_item(Key={"userId": user_id, "schoolId": school_id})
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True}, ensure_ascii=False)}
    except Exception as e:
        return {"statusCode": 500, "headers": HEADERS, "body": json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False)}


