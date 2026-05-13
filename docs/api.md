# Task Tracker API

Base URL for local development:

```text
http://localhost:3000
```

## Task Schema

```json
{
  "id": "string",
  "title": "string, 1-200 characters",
  "description": "string, optional",
  "status": "todo | in_progress | done",
  "createdAt": "ISO 8601 datetime string",
  "updatedAt": "ISO 8601 datetime string"
}
```

## `GET /tasks`

Returns all tasks currently stored in memory.

### Request Body

No request body.

### Response

Status: `200 OK`

```json
[
  {
    "id": "4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631",
    "title": "Write API documentation",
    "description": "Document every task endpoint",
    "status": "todo",
    "createdAt": "2026-05-13T10:00:00.000Z",
    "updatedAt": "2026-05-13T10:00:00.000Z"
  }
]
```

### Error Responses

This endpoint does not define route-specific error responses.

### Example

```bash
curl http://localhost:3000/tasks
```

Expected response:

```json
[]
```

## `POST /tasks`

Creates a task and stores it in memory.

### Request Body

```json
{
  "title": "string, required, 1-200 characters",
  "description": "string, optional",
  "status": "todo | in_progress | done, optional, defaults to todo"
}
```

Unknown fields are rejected.

### Response

Status: `201 Created`

```json
{
  "id": "4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631",
  "title": "Write API documentation",
  "description": "Document every task endpoint",
  "status": "todo",
  "createdAt": "2026-05-13T10:00:00.000Z",
  "updatedAt": "2026-05-13T10:00:00.000Z"
}
```

### Error Responses

Status: `400 Bad Request`

```json
{
  "error": "Invalid task payload",
  "details": []
}
```

Returned when the body fails validation, including missing `title`, empty
`title`, `title` longer than 200 characters, invalid `status`, or unknown
fields.

Status: `400 Bad Request`

```json
{
  "error": "Invalid JSON"
}
```

Returned when the request body contains malformed JSON.

### Example

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Write API documentation",
    "description": "Document every task endpoint",
    "status": "todo"
  }'
```

Expected response:

```json
{
  "id": "4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631",
  "title": "Write API documentation",
  "description": "Document every task endpoint",
  "status": "todo",
  "createdAt": "2026-05-13T10:00:00.000Z",
  "updatedAt": "2026-05-13T10:00:00.000Z"
}
```

## `GET /tasks/:id`

Returns one task by ID.

### Request Body

No request body.

### Response

Status: `200 OK`

```json
{
  "id": "4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631",
  "title": "Write API documentation",
  "description": "Document every task endpoint",
  "status": "todo",
  "createdAt": "2026-05-13T10:00:00.000Z",
  "updatedAt": "2026-05-13T10:00:00.000Z"
}
```

### Error Responses

Status: `404 Not Found`

```json
{
  "error": "Task not found"
}
```

Returned when no task exists for `:id`.

### Example

```bash
curl http://localhost:3000/tasks/4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631
```

Expected response:

```json
{
  "id": "4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631",
  "title": "Write API documentation",
  "description": "Document every task endpoint",
  "status": "todo",
  "createdAt": "2026-05-13T10:00:00.000Z",
  "updatedAt": "2026-05-13T10:00:00.000Z"
}
```

## `PUT /tasks/:id`

Updates one or more fields on an existing task.

### Request Body

```json
{
  "title": "string, optional, 1-200 characters",
  "description": "string, optional",
  "status": "todo | in_progress | done, optional"
}
```

At least one field is required. Unknown fields are rejected.

### Response

Status: `200 OK`

```json
{
  "id": "4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631",
  "title": "Publish API documentation",
  "description": "Document every task endpoint",
  "status": "done",
  "createdAt": "2026-05-13T10:00:00.000Z",
  "updatedAt": "2026-05-13T10:05:00.000Z"
}
```

### Error Responses

Status: `400 Bad Request`

```json
{
  "error": "Invalid task payload",
  "details": []
}
```

Returned when the body fails validation, including an empty body, empty `title`,
`title` longer than 200 characters, invalid `status`, or unknown fields.

Status: `400 Bad Request`

```json
{
  "error": "Invalid JSON"
}
```

Returned when the request body contains malformed JSON.

Status: `404 Not Found`

```json
{
  "error": "Task not found"
}
```

Returned when no task exists for `:id`.

### Example

```bash
curl -X PUT http://localhost:3000/tasks/4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Publish API documentation",
    "status": "done"
  }'
```

Expected response:

```json
{
  "id": "4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631",
  "title": "Publish API documentation",
  "description": "Document every task endpoint",
  "status": "done",
  "createdAt": "2026-05-13T10:00:00.000Z",
  "updatedAt": "2026-05-13T10:05:00.000Z"
}
```

## `DELETE /tasks/:id`

Deletes one task by ID.

### Request Body

No request body.

### Response

Status: `204 No Content`

The response body is empty.

### Error Responses

Status: `404 Not Found`

```json
{
  "error": "Task not found"
}
```

Returned when no task exists for `:id`.

### Example

```bash
curl -X DELETE http://localhost:3000/tasks/4df3f25f-0bb5-4ac3-b6f5-06bdf63ad631
```

Expected response:

```text
HTTP/1.1 204 No Content
```
