# get_reviews.py
# -*- coding: utf-8 -*-
import json, os, boto3
from boto3.dynamodb.conditions import Key

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
    qs = event.get("queryStringParameters") or {}
    lesson_id = (qs.get("lessonId") if isinstance(qs, dict) else None)
    if not lesson_id:
        return _res(400, {"error":"lessonId required"})

    parents = parent_table.query(
        KeyConditionExpression=Key('lessonId').eq(lesson_id),
        ScanIndexForward=False, Limit=20
    ).get('Items', [])

    children = child_table.query(
        KeyConditionExpression=Key('lessonId').eq(lesson_id),
        ScanIndexForward=False, Limit=20
    ).get('Items', [])

    return _res(200, {"parents": parents, "children": children})
