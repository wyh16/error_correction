# API 接口文档

错题本生成系统提供 RESTful API 接口，用于文件上传、OCR 解析、题目分割和错题本导出。

**Base URL**: `http://localhost:5001`

---

## 目录

- [概览](#概览)
- [接口列表](#接口列表)
  - [GET / — 主页](#get-——主页)
  - [GET /api/status — 系统状态](#get-apistatus——系统状态)
  - [POST /api/upload — 上传文件](#post-apiupload——上传文件)
  - [POST /api/split — 分割题目](#post-apisplit——分割题目)
  - [POST /api/export — 导出错题本](#post-apiexport——导出错题本)
  - [GET /api/questions — 获取题目列表](#get-apiquestions——获取题目列表)
  - [GET /preview — 预览页面](#get-preview——预览页面)
  - [GET /download/\<filename\> — 下载文件](#get-downloadfilename——下载文件)
- [数据结构](#数据结构)
- [调用流程](#调用流程)
- [错误处理](#错误处理)

---

## 概览

### 技术栈

- **框架**: Flask 3.1.2
- **状态管理**: LangGraph MemorySaver（基于 `thread_id` 的会话状态）
- **工作流**: LangGraph StateGraph，在 `split_questions` 和 `export` 节点前设置中断

### 典型调用流程

```
1. GET  /api/status          ← 检查系统配置
2. POST /api/upload           ← 上传文件，触发 prepare_input + ocr_parse
3. POST /api/split            ← 恢复工作流，执行 Agent 题目分割
4. POST /api/export           ← 注入选中题目 ID，执行导出
5. GET  /download/wrongbook.md ← 下载导出的错题本
```

### 通用响应格式

成功响应：
```json
{
  "success": true,
  "message": "操作描述",
  ...
}
```

错误响应：
```json
{
  "success": false,
  "error": "错误描述"
}
```

---

## 接口列表

### GET / — 主页

返回 Web 界面主页。

**请求**:
```
GET /
```

**响应**: HTML 页面（`templates/index.html`）

---

### GET /api/status — 系统状态

获取系统配置状态，检查各项外部服务是否已正确配置。

**请求**:
```
GET /api/status
```

**响应示例**:
```json
{
  "success": true,
  "status": {
    "paddleocr_configured": true,
    "deepseek_configured": true,
    "langsmith_enabled": false,
    "output_dirs": {
      "pages": "output/pages",
      "struct": "output/struct",
      "results": "results"
    }
  }
}
```

**响应字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `status.paddleocr_configured` | boolean | PaddleOCR API 是否已配置（检查 `PADDLEOCR_API_URL` 环境变量） |
| `status.deepseek_configured` | boolean | DeepSeek API 是否已配置（检查 `DEEPSEEK_API_KEY` 环境变量） |
| `status.langsmith_enabled` | boolean | LangSmith 追踪是否已启用 |
| `status.output_dirs` | object | 输出目录路径配置 |

---

### POST /api/upload — 上传文件

上传 PDF 或图片文件，系统自动执行预处理流程：

1. 保存上传文件到 `uploads/` 目录
2. 创建新的工作流会话（`thread_id`）
3. 执行 `prepare_input` 节点 — 将文件转换为标准化 PNG 图片
4. 执行 `ocr_parse` 节点 — 调用 PaddleOCR API 解析文档结构
5. 在 `split_questions` 节点前中断，等待用户触发

**请求**:
```
POST /api/upload
Content-Type: multipart/form-data
```

**请求参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `file` | File | 是 | 上传的文件（PDF 或图片） |

**支持的文件格式**: `.pdf`, `.png`, `.jpg`, `.jpeg`, `.bmp`, `.tiff`, `.webp`

**文件大小限制**: 50MB

**成功响应** (200):
```json
{
  "success": true,
  "message": "文件处理成功",
  "result": {
    "image_count": 3,
    "ocr_count": 3,
    "image_paths": [
      "output/pages/test_page_001.png",
      "output/pages/test_page_002.png",
      "output/pages/test_page_003.png"
    ]
  }
}
```

**响应字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `result.image_count` | number | 转换后的图片数量 |
| `result.ocr_count` | number | OCR 解析完成的图片数量 |
| `result.image_paths` | array | 标准化后的图片路径列表 |

**错误响应**:

| 状态码 | 错误 | 说明 |
|--------|------|------|
| 400 | `没有上传文件` | 请求中未包含文件 |
| 400 | `未选择文件` | 文件名为空 |
| 400 | `不支持的文件格式` | 文件扩展名不在允许列表中 |
| 413 | — | 文件超过 50MB 大小限制（Flask 自动返回） |
| 500 | `{错误详情}` | 服务端处理异常 |

**cURL 示例**:
```bash
curl -X POST http://localhost:5001/api/upload \
  -F "file=@/path/to/exam.pdf"
```

---

### POST /api/split — 分割题目

恢复工作流执行 Agent 题目分割。必须在 `/api/upload` 成功后调用。

**内部流程**:
1. 使用当前会话的 `thread_id` 恢复工作流
2. 执行 `split_questions` 节点 — DeepSeek Agent 分析 OCR 结果并分割题目
3. 在 `export` 节点前中断，等待用户选择题目

**请求**:
```
POST /api/split
```

无需请求体。

**成功响应** (200):
```json
{
  "success": true,
  "message": "成功分割 5 道题目",
  "questions": [
    {
      "question_id": "1",
      "question_type": "选择题",
      "content_blocks": [
        {
          "block_type": "text",
          "content": "下列关于函数的说法，正确的是（  ）",
          "bbox": [100, 200, 800, 250],
          "block_id": 1
        }
      ],
      "options": [
        "A. 函数的图像关于y轴对称",
        "B. 函数是增函数",
        "C. 函数的最小值为1",
        "D. 函数的周期为π"
      ],
      "has_formula": false,
      "has_image": false,
      "image_refs": []
    }
  ]
}
```

**错误响应**:

| 状态码 | 错误 | 说明 |
|--------|------|------|
| 400 | `请先上传文件` | 未先调用 `/api/upload` |
| 500 | `{错误详情}` | Agent 执行异常 |

**cURL 示例**:
```bash
curl -X POST http://localhost:5001/api/split
```

---

### POST /api/export — 导出错题本

注入用户选中的题目 ID，恢复工作流执行导出，生成 Markdown 格式的错题本。

**内部流程**:
1. 将 `selected_ids` 注入工作流状态
2. 恢复工作流执行 `export` 节点
3. 生成 `results/wrongbook.md` 文件

**请求**:
```
POST /api/export
Content-Type: application/json
```

**请求体**:
```json
{
  "selected_ids": ["1", "3", "5"]
}
```

**请求参数**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `selected_ids` | array of string | 是 | 要导出的题目 ID 列表 |

**成功响应** (200):
```json
{
  "success": true,
  "message": "错题本导出成功",
  "output_path": "results/wrongbook.md"
}
```

**错误响应**:

| 状态码 | 错误 | 说明 |
|--------|------|------|
| 400 | `未选择任何题目` | `selected_ids` 为空 |
| 400 | `请先分割题目` | 未先完成上传和分割流程 |
| 500 | `{错误详情}` | 导出处理异常 |

**cURL 示例**:
```bash
curl -X POST http://localhost:5001/api/export \
  -H "Content-Type: application/json" \
  -d '{"selected_ids": ["1", "2", "3"]}'
```

---

### GET /api/questions — 获取题目列表

从 `results/questions.json` 文件读取已分割的题目列表。可在 `/api/split` 成功后随时调用获取题目数据。

**请求**:
```
GET /api/questions
```

**成功响应** (200):
```json
{
  "success": true,
  "questions": [
    {
      "question_id": "1",
      "question_type": "选择题",
      "content_blocks": [...],
      "options": [...],
      "has_formula": true,
      "has_image": false,
      "image_refs": []
    }
  ]
}
```

**无数据时的响应**:
```json
{
  "success": true,
  "questions": [],
  "message": "暂无题目数据"
}
```

**cURL 示例**:
```bash
curl http://localhost:5001/api/questions
```

---

### GET /preview — 预览页面

返回 `results/preview.html` 的内容。如果预览文件不存在，返回 404。

**请求**:
```
GET /preview
```

**响应**: HTML 页面内容

**错误响应**:

| 状态码 | 说明 |
|--------|------|
| 404 | `预览文件不存在，请先分割题目` |

---

### GET /download/\<filename\> — 下载文件

从 `results/` 目录下载指定文件。

**请求**:
```
GET /download/<filename>
```

**路径参数**:

| 参数 | 说明 |
|------|------|
| `filename` | 要下载的文件名（如 `wrongbook.md`、`questions.json`） |

**响应**: 文件下载（`Content-Disposition: attachment`）

**常用下载路径**:
- `/download/wrongbook.md` — 错题本 Markdown 文件
- `/download/questions.json` — 题目 JSON 数据
- `/download/split_issues.jsonl` — 处理问题日志

**cURL 示例**:
```bash
curl -O http://localhost:5001/download/wrongbook.md
```

---

## 数据结构

### Question 对象

Agent 分割后返回的题目数据结构：

```json
{
  "question_id": "1",
  "question_type": "选择题",
  "content_blocks": [
    {
      "block_type": "text",
      "content": "题干内容...",
      "bbox": [x1, y1, x2, y2],
      "block_id": 1
    },
    {
      "block_type": "display_formula",
      "content": "x^2 + y^2 = r^2",
      "bbox": [x1, y1, x2, y2],
      "block_id": 2
    },
    {
      "block_type": "image",
      "content": "output/assets/figure_1.jpg",
      "bbox": [x1, y1, x2, y2],
      "block_id": 3
    }
  ],
  "options": ["A. 选项1", "B. 选项2", "C. 选项3", "D. 选项4"],
  "has_formula": true,
  "has_image": true,
  "image_refs": ["output/assets/figure_1.jpg"]
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| `question_id` | string | 题号标识 |
| `question_type` | string | 题型：`选择题` / `填空题` / `解答题` / `判断题` |
| `content_blocks` | array | 题目内容块列表，按 `block_id` 排序 |
| `options` | array | 选项列表（仅选择题有值） |
| `has_formula` | boolean | 是否包含数学公式 |
| `has_image` | boolean | 是否包含图片 |
| `image_refs` | array | 图片引用路径列表 |

### ContentBlock 对象

题目内容块的数据结构：

| 字段 | 类型 | 说明 |
|------|------|------|
| `block_type` | string | 块类型：`text` / `display_formula` / `inline_formula` / `image` |
| `content` | string | 块内容（文字、LaTeX 公式或图片路径） |
| `bbox` | array | 边界框坐标 `[x1, y1, x2, y2]` |
| `block_id` | number | 块在题目中的顺序编号 |

**block_type 取值说明**:

| 值 | 说明 | content 格式 |
|----|------|--------------|
| `text` | 纯文字内容 | 普通文本 |
| `display_formula` | 行间公式 | LaTeX 公式（不含 `$$`） |
| `inline_formula` | 行内公式 | LaTeX 公式（不含 `$`） |
| `image` | 图片引用 | 图片文件路径 |

### WorkflowState

LangGraph 工作流内部状态定义（`src/workflow.py`）：

| 字段 | 类型 | 说明 |
|------|------|------|
| `file_path` | string | 上传的原始文件路径 |
| `image_paths` | array | 标准化后的图片路径列表 |
| `ocr_results` | array | PaddleOCR 解析结果列表 |
| `questions` | array | Agent 分割后的题目列表 |
| `selected_ids` | array | 用户选中的题目 ID |
| `output_path` | string | 导出文件的路径 |

---

## 调用流程

### 完整流程示例（Python）

```python
import requests

BASE_URL = "http://localhost:5001"

# 1. 检查系统状态
status = requests.get(f"{BASE_URL}/api/status").json()
print("系统状态:", status["status"])

# 2. 上传文件
with open("exam.pdf", "rb") as f:
    resp = requests.post(f"{BASE_URL}/api/upload", files={"file": f})
upload_result = resp.json()
print(f"识别到 {upload_result['result']['image_count']} 页")

# 3. 分割题目
resp = requests.post(f"{BASE_URL}/api/split")
split_result = resp.json()
questions = split_result["questions"]
print(f"分割出 {len(questions)} 道题目")

# 4. 选择并导出
selected = [q["question_id"] for q in questions]  # 全选
resp = requests.post(
    f"{BASE_URL}/api/export",
    json={"selected_ids": selected}
)
print("导出结果:", resp.json()["message"])

# 5. 下载错题本
resp = requests.get(f"{BASE_URL}/download/wrongbook.md")
with open("wrongbook.md", "wb") as f:
    f.write(resp.content)
print("错题本已下载")
```

### 完整流程示例（cURL）

```bash
# 1. 检查系统状态
curl http://localhost:5001/api/status

# 2. 上传文件
curl -X POST http://localhost:5001/api/upload \
  -F "file=@exam.pdf"

# 3. 分割题目
curl -X POST http://localhost:5001/api/split

# 4. 导出错题本
curl -X POST http://localhost:5001/api/export \
  -H "Content-Type: application/json" \
  -d '{"selected_ids": ["1", "2", "3"]}'

# 5. 下载错题本
curl -O http://localhost:5001/download/wrongbook.md
```

---

## 错误处理

### HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 客户端错误（参数缺失、文件格式不支持等） |
| 404 | 资源不存在（预览文件未生成等） |
| 413 | 上传文件超过大小限制 |
| 500 | 服务端内部错误 |

### 常见错误场景

| 场景 | 错误信息 | 解决方法 |
|------|----------|----------|
| 未上传文件直接分割 | `请先上传文件` | 先调用 `/api/upload` |
| 未分割直接导出 | `请先分割题目` | 先调用 `/api/split` |
| 上传不支持的格式 | `不支持的文件格式` | 使用支持的格式上传 |
| 导出时未选题目 | `未选择任何题目` | `selected_ids` 不能为空 |
| API 密钥未配置 | 500 错误 | 检查 `.env` 中的 API 密钥 |

### 注意事项

1. **会话状态**: 系统使用全局 `thread_id` 管理会话，一次只能处理一个文件。新的上传会覆盖之前的会话状态。
2. **调用顺序**: 必须按 `upload → split → export` 的顺序调用，不能跳步。
3. **并发限制**: 当前实现使用全局变量管理会话，不支持多用户并发访问。生产环境部署需要改造为基于请求的会话管理。

---

*文档版本: v1.0.0*
