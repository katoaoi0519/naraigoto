# -*- coding: utf-8 -*-
# post_reviews.py
import json, os, uuid, boto3, base64, sys, traceback
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation

# --------- Helpers ---------
PARAM_NAME   = 'lessonsId'   # 受け取り名
DDB_KEY_NAME = 'lessonsId'   # DynamoDB PK 名

def _now_iso():
    return datetime.now(timezone.utc).isoformat(timespec='milliseconds').replace('+00:00', 'Z')

def _decimal_to_native(obj):
    """DynamoDBのDecimalをJSONに出せる型(int/float)へ再帰的に変換"""
    if isinstance(obj, list):
        return [_decimal_to_native(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _decimal_to_native(v) for k, v in obj.items()}
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    return obj

def _res(code, body, cors=True):
    headers = {"Content-Type": "application/json; charset=utf-8"}
    if cors:
        headers.update({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST",
            "Access-Control-Allow-Headers": "Content-Type,Authorization"
        })
    try:
        body_json = json.dumps(_decimal_to_native(body), ensure_ascii=False)
    except Exception as e:
        # 返却時に落ちないようフォールバック
        code = 500
        body_json = json.dumps({"error": "response_serialize_error", "message": str(e)})
    return {"statusCode": code, "headers": headers, "body": body_json}

def _parse_body(event):
    body = event.get("body")
    if body is None:
        return None
    if event.get("isBase64Encoded"):
        try:
            body = base64.b64decode(body).decode("utf-8")
        except Exception:
            return None
    try:
        return json.loads(body) if isinstance(body, str) else body
    except Exception:
        return None

def _validate(payload):
    errs = []
    lessons_id = payload.get(PARAM_NAME)
    user_id    = payload.get("userId")
    rating     = payload.get("rating")
    comment    = payload.get("comment")
    role       = payload.get("role")

    if not lessons_id:
        errs.append(f"{PARAM_NAME} required")
    if not user_id:
        errs.append("userId required")

    # rating → Decimal へ（float直入れNG対策）
    rating_dec = None
    try:
        rating_dec = Decimal(str(rating))
    except (InvalidOperation, TypeError, ValueError):
        errs.append("rating must be a number between 1 and 5")
    if rating_dec is not None and not (Decimal("1") <= rating_dec <= Decimal("5")):
        errs.append("rating must be between 1 and 5")

    if not isinstance(comment, str) or not comment.strip():
        errs.append("comment required")
    elif len(comment) > 1000:
        errs.append("comment too long (<=1000)")

    if role not in ("parent", "child"):
        errs.append("role must be 'parent' or 'child'")

    return errs, {
        "lessons_id": lessons_id,
        "user_id": user_id,
        "rating_dec": rating_dec,
        "comment": comment.strip() if isinstance(comment, str) else comment,
        "role": role
    }

# --------- Handler ---------
def lambda_handler(event, _ctx):
    try:
        # ログ（長すぎ回避のため先頭だけ）
        try:
            print("[post_reviews] event head:", json.dumps(event)[:2000])
        except Exception:
            print("[post_reviews] event logging skipped")

        # 環境変数（未設定で落ちないようにここで取得）
        parent_tbl_name = os.environ.get('PARENT_REVIEWS_TABLE')
        child_tbl_name  = os.environ.get('CHILD_REVIEWS_TABLE')
        if not parent_tbl_name or not child_tbl_name:
            return _res(500, {"error": "env_missing",
                              "message": "PARENT_REVIEWS_TABLE/CHILD_REVIEWS_TABLE not set"})

        dynamodb = boto3.resource('dynamodb')
        parent_table = dynamodb.Table(parent_tbl_name)
        child_table  = dynamodb.Table(child_tbl_name)

        # 事前フライト（必要なら）
        if event.get("httpMethod") == "OPTIONS":
            return _res(200, {"ok": True})

        payload = _parse_body(event)
        if not payload or not isinstance(payload, dict):
            return _res(400, {"error": "invalid_json"})

        errs, vals = _validate(payload)
        if errs:
            return _res(400, {"error": "validation_error", "details": errs})

        item = {
            DDB_KEY_NAME: vals["lessons_id"],  # PK
            "createdAt":  _now_iso(),          # SK
            "reviewId":   str(uuid.uuid4()),
            "userId":     vals["user_id"],
            "rating":     vals["rating_dec"],  # Decimal で保存
            "comment":    vals["comment"],
            "role":       vals["role"]
        }

        table = parent_table if vals["role"] == "parent" else child_table
        # 重複防止（reviewId ユニーク）
        table.put_item(
            Item=item,
            ConditionExpression="attribute_not_exists(reviewId)"
        )

        return _res(201, {"message": "created", "item": item})

    except Exception as e:
        print("[post_reviews] EX:", e)
        print("[post_reviews] TRACE:", "".join(traceback.format_exception(*sys.exc_info()))[:4000])
        return _res(500, {"error": "internal_error", "message": f"{e.__class__.__name__}: {e}"})

