DynamoDB Setup (MVP Read Model)

Tables:

- ParentReviews: PK lessonsId (S) / SK createdAt (S), GSI byTarget (targetKey, createdAt)
- ChildReviews: PK lessonsId (S) / SK createdAt (S), GSI byTarget (targetKey, createdAt)
- Likes: PK userId (S) / SK schoolId (S), GSI bySchool (schoolId)

Create tables (PowerShell, one command per line):

```powershell
cd "C:\Users\0622d\OneDrive - OUMail (Osaka University)\就活\aws\bootcamp\naraigoto"

aws dynamodb create-table --cli-input-json file://database/dynamodb/tables/parent_reviews.json
aws dynamodb create-table --cli-input-json file://database/dynamodb/tables/child_reviews.json
aws dynamodb create-table --cli-input-json file://database/dynamodb/tables/likes.json

aws dynamodb wait table-exists --table-name ParentReviews
aws dynamodb wait table-exists --table-name ChildReviews
aws dynamodb wait table-exists --table-name Likes
```

Seed data:

```powershell
aws dynamodb batch-write-item --request-items file://database/dynamodb/seed/seed.json
```

Clean up (delete):

```powershell
aws dynamodb delete-table --table-name ParentReviews
aws dynamodb delete-table --table-name ChildReviews
aws dynamodb delete-table --table-name Likes
```

Notes:

- Ensure your AWS profile/region are configured (e.g., `$env:AWS_PROFILE`, `$env:AWS_REGION`).
- `targetKey` is `school#<id>` or `instructor#<id>` to support `byTarget` queries.
- Aligns with GROUP15_IMPLEMENTATION_TODO.md Phase 2 SoR/Read Model.


