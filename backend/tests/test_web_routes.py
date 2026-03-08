"""
Flask 路由集成测试

使用 Flask test client + SQLite 内存数据库，验证 API 路由的请求/响应。
不依赖外部服务。

覆盖路由：
- GET  /api/status
- GET  /api/history
- GET  /api/search
- GET  /api/stats
- DELETE /api/question/<id>
"""

import json
import pytest
from unittest.mock import patch, MagicMock
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker

from db.models import Base
from db import crud


@pytest.fixture
def test_db():
    """内存数据库 + 建表"""
    engine = create_engine("sqlite:///:memory:", echo=False)

    @event.listens_for(engine, "connect")
    def set_sqlite_pragma(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()

    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


@pytest.fixture
def client(test_db):
    """Flask test client，用内存数据库替换 SessionLocal"""
    # 创建一个 context manager 代理，让 with SessionLocal() as db 使用 test_db
    class FakeSessionLocal:
        def __call__(self):
            return self

        def __enter__(self):
            return test_db

        def __exit__(self, *args):
            pass

    with patch("web_app.SessionLocal", FakeSessionLocal()):
        from web_app import app
        app.config["TESTING"] = True
        with app.test_client() as c:
            yield c


# ── /api/status ──────────────────────────────────────────


class TestStatusRoute:
    """GET /api/status"""

    def test_returns_success(self, client):
        resp = client.get("/api/status")
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        assert "status" in data

    def test_contains_model_info(self, client):
        resp = client.get("/api/status")
        status = resp.get_json()["status"]
        assert "available_models" in status
        assert isinstance(status["available_models"], list)
        assert len(status["available_models"]) >= 1


# ── /api/history ─────────────────────────────────────────


class TestHistoryRoute:
    """GET /api/history"""

    def test_empty_history(self, client):
        resp = client.get("/api/history")
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        assert data["items"] == []
        assert data["total"] == 0

    def test_pagination_params(self, client):
        resp = client.get("/api/history?page=1&page_size=5")
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["page"] == 1
        assert data["page_size"] == 5

    def test_invalid_date_format(self, client):
        resp = client.get("/api/history?start_date=not-a-date")
        assert resp.status_code == 400
        data = resp.get_json()
        assert data["success"] is False


# ── /api/search ──────────────────────────────────────────


class TestSearchRoute:
    """GET /api/search"""

    def test_requires_search_param(self, client):
        """无搜索条件应返回 400"""
        resp = client.get("/api/search")
        assert resp.status_code == 400
        data = resp.get_json()
        assert data["success"] is False

    def test_search_by_keyword(self, client):
        resp = client.get("/api/search?keyword=导数")
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        assert "items" in data

    def test_search_by_question_type(self, client):
        resp = client.get("/api/search?question_type=选择题")
        assert resp.status_code == 200
        assert resp.get_json()["success"] is True


# ── /api/stats ───────────────────────────────────────────


class TestStatsRoute:
    """GET /api/stats"""

    def test_empty_stats(self, client):
        resp = client.get("/api/stats")
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        assert data["total_tags"] == 0


# ── DELETE /api/question/<id> ────────────────────────────


class TestDeleteQuestionRoute:
    """DELETE /api/question/<id>"""

    def test_delete_nonexistent(self, client):
        resp = client.delete("/api/question/99999")
        assert resp.status_code == 404
        data = resp.get_json()
        assert data["success"] is False

    def test_delete_existing(self, client, test_db):
        """先入库再删除"""
        from db.crud import save_questions_to_db

        qs = [{
            "question_id": "1",
            "question_type": "选择题",
            "content_blocks": [{"block_type": "text", "content": "测试题目"}],
            "has_formula": False,
            "has_image": False,
        }]
        save_questions_to_db(test_db, qs, {
            "original_filename": "test.pdf",
            "subject": "数学",
        })

        # 查询刚插入的题目 ID
        from db.models import Question
        q = test_db.query(Question).first()
        assert q is not None

        resp = client.delete(f"/api/question/{q.id}")
        assert resp.status_code == 200
        assert resp.get_json()["success"] is True
