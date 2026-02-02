"""
错题本题目分割Agent
使用 LangChain create_agent + ToolStrategy 实现结构化输出
"""

import os
from dotenv import load_dotenv
from langchain.chat_models import init_chat_model
from langchain.agents import create_agent
from langchain.agents.structured_output import ToolStrategy

from .prompts import SYSTEM_PROMPT
from .schemas import QuestionSplitResult

load_dotenv()


def create_question_split_agent():
    """创建题目分割Agent

    使用 DeepSeek 模型 + ToolStrategy 结构化输出，
    直接返回 Pydantic 验证后的题目列表，无需通过工具保存文件。

    Returns:
        配置好的Agent实例
    """
    # 初始化模型（DeepSeek）
    model = init_chat_model(
        model="deepseek:deepseek-chat",
        temperature=0.1,  # 低温度以获得更确定性的输出
    )

    # 创建Agent：使用 ToolStrategy 强制结构化输出
    agent = create_agent(
        model=model,
        tools=[],  # 不需要工具，结构化输出由 ToolStrategy 处理
        system_prompt=SYSTEM_PROMPT,
        response_format=ToolStrategy(
            schema=QuestionSplitResult,
            handle_errors=True,  # 自动重试校验错误
        ),
    )

    return agent


# 导出agent实例（用于langgraph.json）
agent = create_question_split_agent()


if __name__ == "__main__":
    # 测试Agent创建
    print("Agent创建成功!")
