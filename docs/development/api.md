# API 文档

这是项目的API文档。

## 用户API

### 获取用户信息

```
GET /api/users/:id
```

**参数**

| 参数名 | 类型 | 描述 |
|-------|------|------|
| id    | string | 用户ID |

**响应**

```json
{
  "id": "123456",
  "username": "johndoe",
  "email": "john@example.com",
  "createdAt": "2023-01-01T00:00:00Z"
}
```

## 内容API

### 获取内容列表

```
GET /api/contents
```

**参数**

| 参数名 | 类型 | 描述 |
|-------|------|------|
| page  | number | 页码，默认1 |
| limit | number | 每页数量，默认10 |

**响应**

```json
{
  "total": 100,
  "items": [
    {
      "id": "1",
      "title": "内容标题",
      "summary": "内容摘要",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  ]
}
``` 