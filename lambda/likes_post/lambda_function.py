import os, json
import boto3

dynamodb = boto3.resource('dynamodb')
LIKES = dynamodb.Table(os.getenv('LIKES_TABLE', 'Likes'))

HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "content-type,authorization,x-api-key",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def lambda_handler(event, _):
    method = (event.get('requestContext') or {}).get('http', {}).get('method') or event.get('httpMethod')
    if method and method.upper() == 'OPTIONS':
        return {"statusCode": 204, "headers": HEADERS, "body": ""}

    b = json.loads(event.get('body') or '{}')
    for k in ('userId', 'schoolId'):
        if not b.get(k):
            return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"ok": False, "error": f"Missing field: {k}"}, ensure_ascii=False)}

    try:
        LIKES.put_item(
            Item={"userId": b['userId'], "schoolId": b['schoolId']},
            ConditionExpression="attribute_not_exists(userId) AND attribute_not_exists(schoolId)"
        )
        return {"statusCode": 201, "headers": HEADERS, "body": json.dumps({"ok": True}, ensure_ascii=False)}
    except LIKES.meta.client.exceptions.ConditionalCheckFailedException:
        return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True, "message": "already liked"}, ensure_ascii=False)}
    except Exception as e:
        return {"statusCode": 500, "headers": HEADERS, "body": json.dumps({"ok": False, "error": str(e)}, ensure_ascii=False)}


