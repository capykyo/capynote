---
layout: doc
title: Cursor MCP 使用指南
description: 如何在 Cursor 中配置和使用 Model Context Protocol (MCP)
date: 2025-03-18
head:
  - - meta
    - name: keywords
      content: Cursor, MCP, AI辅助编程, 上下文协议
---

# Model Context Protocol

## 核心概念

- **Resources**：提供给模型的上下文资源，如代码文件、文档等
- **Tools**：模型可以调用的工具函数，如搜索代码库、执行命令等
- **Prompts**：预设的提示模板，用于特定的任务场景

## 项目级 MCP server

在项目根目录创建 `.cursor` 文件夹，并添加 `mcp.json` 配置文件：

```bash
- .cursor
 |------- mcp.json
```

## 配置 MCP 服务

1. 打开 Cursor 编辑器
2. 进入设置 -> MCP 选项
3. 开启 MCP 服务

## mcp.json 配置示例

```json
{
    "mcpServers": {
        "weather": {
            "command": "node",
            "args": [
                "/Users/kyo/code/MCP/weather/build/index.js"
            ]
        }
    }
}
```

## 最佳实践

- 为不同类型的项目创建特定的 MCP 配置模板
- 使用精确的资源过滤规则，避免无关文件干扰
- 创建常用任务的提示模板，提高工作效率
- 定期更新 MCP 服务以获取新功能