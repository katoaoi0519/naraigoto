import os, json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
LIKES = dynamodb.Table(os.getenv('LIKES_TABLE', 'Likes'))

HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
}

def _resp(code, body):
    return {"statusCode": code, "headers": HEADERS, "body": json.dumps(body, ensure_ascii=False)}

def lambda_handler(event, _):
    method = (event.get('requestContext') or {}).get('http', {}).get('method') or event.get('httpMethod')
    if method and method.upper() == 'OPTIONS':
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    pp = event.get('pathParameters') or {}
    user_id = None
    if isinstance(pp, dict):
        user_id = pp.get('userId') or pp.get('id')
    if not user_id:
        q = event.get('queryStringParameters') or {}
        if isinstance(q, dict):
            user_id = q.get('userId')
    if not user_id:
        return _resp(400, {"ok": False, "error": "userId required"})

    try:
        r = LIKES.query(IndexName=os.getenv('LIKES_USER_INDEX', ''), KeyConditionExpression=Key('userId').eq(user_id))
        items = r.get('Items', [])
    except Exception:
        # No GSI, use direct query on PK (works as PK is userId)
        r = LIKES.query(KeyConditionExpression=Key('userId').eq(user_id))
        items = r.get('Items', [])

    return _resp(200, {"ok": True, "likes": items})


