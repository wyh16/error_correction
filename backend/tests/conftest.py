"""
pytest 配置 — 确保 backend/ 在 sys.path 中，以便 import config 等模块。
"""

import sys
import os

# 将 backend/ 目录加入 sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)
