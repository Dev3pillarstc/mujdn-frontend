# Temporary Role Assignments API

Base URL: `http://localhost:7107/api/TemporaryRoleAssignments`

Auth requirements:

- Authenticated user
- User must have `DEPARTMENT_MANAGER` role
- Backend also validates that the caller is the actual department manager for the target employee scope

## Purpose

This API lets a department manager assign a temporary role to one of their employees for a date range.

`FkRoleId` is optional:

- On create: if omitted, backend defaults it to `DEPARTMENT_MANAGER`
- On update: if omitted, backend keeps the existing role

Date format: `YYYY-MM-DD`

## Response Wrapper

All endpoints return the standard API wrapper:

```json
{
  "data": {},
  "error": null
}
```

## Model

```json
{
  "fkUserProfileId": 3,
  "fkRoleId": "man4ag3r-f53f-4ef9-1ca7b455f8e4",
  "dateFrom": "2026-04-03",
  "dateTo": "2026-04-10",
  "userFullNameAr": "Employee 1",
  "userFullNameEn": "emp1",
  "roleName": "DEPARTMENT_MANAGER",
  "isCurrentlyActive": true,
  "id": 1,
  "concurrencyUpdateVersion": "AAAAAAACGyU="
}
```

Field notes:

- `fkUserProfileId`: target employee profile id
- `fkRoleId`: temporary role id
- `dateFrom`: assignment start date
- `dateTo`: assignment end date
- `concurrencyUpdateVersion`: required for update

## Endpoints

### 1. Get With Paging

`POST /GetWithPaging?PageNumber=1&PageSize=11`

Use this for the table/grid screen.

Request body filters are optional:

```json
{
  "fkUserProfileId": 3,
  "fkRoleId": "man4ag3r-f53f-4ef9-1ca7b455f8e4",
  "dateFrom": "2026-04-01",
  "dateTo": "2026-04-30"
}
```

Empty filter body:

```json
{}
```

Sample:

```bash
curl -X 'POST' \
  'http://localhost:7107/api/TemporaryRoleAssignments/GetWithPaging?PageNumber=1&PageSize=11' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{}'
```

Sample response:

```json
{
  "data": {
    "list": [
      {
        "fkUserProfileId": 3,
        "fkRoleId": "man4ag3r-f53f-4ef9-1ca7b455f8e4",
        "dateFrom": "2026-04-03",
        "dateTo": "2026-04-10",
        "userFullNameAr": "Employee 1",
        "userFullNameEn": "emp1",
        "roleName": "DEPARTMENT_MANAGER",
        "isCurrentlyActive": true,
        "id": 1,
        "concurrencyUpdateVersion": "AAAAAAACGyU="
      }
    ],
    "paginationInfo": {
      "currentPage": 1,
      "pageSize": 11,
      "totalPages": 1,
      "totalItems": 1
    }
  },
  "error": null
}
```

### 2. Get By Id

`GET /{id}`

Sample:

```bash
curl -X 'GET' \
  'http://localhost:7107/api/TemporaryRoleAssignments/1' \
  -H 'accept: */*'
```

### 3. Create

`POST /`

Sample with explicit role:

```bash
curl -X 'POST' \
  'http://localhost:7107/api/TemporaryRoleAssignments' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "fkUserProfileId": 3,
    "dateFrom": "2026-04-12",
    "dateTo": "2026-04-20"
  }'
```

Sample using default role:

```bash
curl -X 'POST' \
  'http://localhost:7107/api/TemporaryRoleAssignments' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "fkUserProfileId": 3,
    "dateFrom": "2026-04-12",
    "dateTo": "2026-04-20"
  }'
```

### 4. Update

`PUT /`

Sample:

```bash
curl -X 'PUT' \
  'http://localhost:7107/api/TemporaryRoleAssignments' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "id": 1,
    "fkUserProfileId": 3,
    "dateFrom": "2026-04-12",
    "dateTo": "2026-04-25",
    "concurrencyUpdateVersion": "AAAAAAACGyU="
  }'
```

### 5. Delete

`DELETE /{id}`

Sample:

```bash
curl -X 'DELETE' \
  'http://localhost:7107/api/TemporaryRoleAssignments/1' \
  -H 'accept: */*'
```

## Frontend Validation Rules

### Create

- Required: `fkUserProfileId`, `dateFrom`, `dateTo`
- Optional: `fkRoleId`
- If `fkRoleId` is empty, backend defaults it to `DEPARTMENT_MANAGER`

### Update

- `id` is required
- `concurrencyUpdateVersion` is required
- Future record:
  - full update allowed
- Started and still active record:
  - only `dateTo` can be changed
  - `fkUserProfileId` cannot change
  - `fkRoleId` cannot change
  - `dateFrom` cannot change
  - new `dateTo` must be after today
- Past record or record ending today:
  - update is not allowed

### Delete

- Delete is allowed only if `dateFrom > today`
- If `dateFrom <= today`, delete is not allowed

## Recommended Frontend Behavior

- Use `POST /GetWithPaging` for the listing screen
- Keep `id` and `concurrencyUpdateVersion` in the row model for edit
- Disable delete button when `dateFrom <= today`
- If `dateFrom <= today` and `dateTo > today`, allow editing `dateTo` only
- If creating without a role picker in the first UI version, omit `fkRoleId`

## Common Failure Cases

- User is outside the manager's department scope
- Manager tries to assign a role to themself
- Invalid or inactive role id
- Overlapping assignment for the same employee and same role
- `dateTo < dateFrom`
- Update blocked because the record is already past or already started
- Delete blocked because the record already started
- Concurrency conflict on update
