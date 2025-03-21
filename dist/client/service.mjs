// 服务层
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
dotenv.config();
const client = new ChatOpenAI({
    model: "Qwen/QwQ-32B",
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL,
    },
});
const inputText = "你是什么类型的人工智能？具体一点，使用中文回答";
const completion = await client.invoke(inputText);
const result = completion.content;
const __filename = new URL(import.meta.url).pathname;
const __dirname = dirname(__filename);
writeFileSync(join(__dirname, "result.md"), result.toString());
