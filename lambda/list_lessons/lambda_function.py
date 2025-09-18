import boto3
import json

dynamodb = boto3.resource("dynamodb")
LESSONS = dynamodb.Table("Lessons")

def lambda_handler(event, context):
    resp = LESSONS.scan(Limit=50)
    items = resp.get("Items", [])

    fixed = []
    for x in items:
        # lessonsId → lessonId に統一
        if "lessonsId" in x and "lessonId" not in x:
            x["lessonId"] = x["lessonsId"]
            del x["lessonsId"]
        fixed.append(x)

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json; charset=utf-8"
        },
        "body": json.dumps(fixed, ensure_ascii=False)
    }



