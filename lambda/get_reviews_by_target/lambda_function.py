import os, json
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
PARENT_TBL = os.environ.get('PARENT_REVIEWS_TABLE', 'ParentReviews')
CHILD_TBL  = os.environ.get('CHILD_REVIEWS_TABLE', 'ChildReviews')
parent_table = dynamodb.Table(PARENT_TBL)
child_table  = dynamodb.Table(CHILD_TBL)

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
    return {"statusCode": code, "headers": HEADERS, "body": json.dumps(_decimal_to_native(body), ensure_ascii=False)}

def lambda_handler(event, _):
    method = (event.get('requestContext') or {}).get('http', {}).get('method') or event.get('httpMethod')
    if method and method.upper() == 'OPTIONS':
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    q = event.get('queryStringParameters') or {}
    target_type = (q.get('targetType') if isinstance(q, dict) else None) or 'school'
    target_id = (q.get('targetId') if isinstance(q, dict) else None)
    if not target_id:
        return _resp(400, {"error": "targetId required"})

    key = f"{target_type}#{target_id}"

    parents = parent_table.query(
        IndexName='byTarget',
        KeyConditionExpression=Key('targetKey').eq(key),
        ScanIndexForward=False,
        Limit=50
    ).get('Items', [])

    children = child_table.query(
        IndexName='byTarget',
        KeyConditionExpression=Key('targetKey').eq(key),
        ScanIndexForward=False,
        Limit=50
    ).get('Items', [])

    return _resp(200, {"targetType": target_type, "targetId": target_id, "parents": parents, "children": children})


