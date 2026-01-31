# 错题本生成系统

基于 PaddleOCR + LangChain Agent 的智能错题本生成系统。上传试卷 PDF 或图片，自动识别文档结构、智能分割题目，导出为 Markdown 错题本。

## 环境部署

### 1. 安装依赖

需要 Python 3.11+。

```bash
pip install -r requirements.txt
```

如需处理 PDF 文件，还需安装 poppler：

```bash
# 通过 scoop
scoop install poppler

# 或通过 choco
choco install poppler
```

安装后重启终端，确保 `pdftoppm` 命令可用。

### 2. 配置环境变量

```bash
copy .env.example .env
```

编辑 `.env`，填写以下必需项：

```dotenv
# DeepSeek API（Agent 智能分割题目）
DEEPSEEK_API_KEY=your_key
DEEPSEEK_BASE_URL=https://api.deepseek.com

# PaddleOCR API（文档结构解析）
PADDLEOCR_API_URL=your_url
PADDLEOCR_API_TOKEN=your_token
```

可选配置见 `.env.example`。

### 3. 启动

```bash
python web_app.py
```

访问 **http://localhost:5001**，拖拽上传 PDF 或图片即可使用。

## 支持的文件格式

PDF(`.pdf`)、图片(`.jpg` `.jpeg` `.png` `.bmp` `.tiff` `.webp`)，单次上传限制 50 MB。

## 许可证

MIT License
