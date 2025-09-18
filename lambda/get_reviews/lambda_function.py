# get_reviews.py
# -*- coding: utf-8 -*-
import json, os, boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
PARENT_TBL = os.environ['PARENT_REVIEWS_TABLE']
CHILD_TBL  = os.environ['CHILD_REVIEWS_TABLE']
parent_table = dynamodb.Table(PARENT_TBL)
child_table  = dynamodb.Table(CHILD_TBL)

PARAM_NAME   = 'lessonsId'
DDB_KEY_NAME = 'lessonsId'

HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "GET,OPTIONS"
}

def _decimal_to_native(obj):
    """dict/listを再帰的に走査し、Decimalをint/floatへ変換"""
    if isinstance(obj, list):
        return [_decimal_to_native(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _decimal_to_native(v) for k, v in obj.items()}
    if isinstance(obj, Decimal):
        # 整数ならintに、そうでなければfloatに
        return int(obj) if obj % 1 == 0 else float(obj)
        # ※すべてfloatにしたいなら: return float(obj)
    return obj

def _res(code, body):
    safe_body = _decimal_to_native(body)
    return {
        "statusCode": code,
        "headers": HEADERS,
        "body": json.dumps(safe_body, ensure_ascii=False)
    }

def _get_param(event):
    # pathParameters 優先（/lessons/{lessonId}/reviews など）
    pp = event.get("pathParameters") or {}
    if isinstance(pp, dict):
        if pp.get("lessonId"):
            return pp["lessonId"]
        if pp.get(PARAM_NAME):
            return pp[PARAM_NAME]
    qs = event.get("queryStringParameters") or {}
    if isinstance(qs, dict) and PARAM_NAME in qs:
        return qs[PARAM_NAME]
    body = event.get("body")
    if body:
        try:
            payload = json.loads(body) if isinstance(body, str) else body
            if isinstance(payload, dict) and PARAM_NAME in payload:
                return payload[PARAM_NAME]
        except Exception:
            pass
    return None

def _query_latest(table, lessons_id, limit=20):
    resp = table.query(
        KeyConditionExpression=Key(DDB_KEY_NAME).eq(lessons_id),
        ScanIndexForward=False,
        Limit=limit
    )
    return resp.get('Items', [])

def lambda_handler(event, _ctx):
    method = (event.get("requestContext") or {}).get("http", {}).get("method", "GET").upper()
    if method == "OPTIONS":
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    lessons_id = _get_param(event)
    if not lessons_id:
        return _res(400, {"error": f"{PARAM_NAME} required"})

    try:
        parents  = _query_latest(parent_table, lessons_id, limit=20)
        children = _query_latest(child_table, lessons_id, limit=20)
        return _res(200, {"parents": parents, "children": children})
    except Exception as e:
        print(f"[get_reviews] error: {e}")
        return _res(500, {"error": "internal_error", "message": str(e)})




