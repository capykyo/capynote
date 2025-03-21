// 获取湖人新闻，将新闻转换为markdown格式输出到docs/新闻/日报/{date:YYYY-MM-DD}laker-news.md
import { getLakersNews } from "../api/nba-news-api.mjs";
import matter from "gray-matter";
import fs from "fs";
/**
 * 格式化日期为 `YYYY-MM-DD` 本地时间
 * @param {string} date - 原始日期字符串
 * @returns {string} 格式化后的本地日期字符串
 */
function dateFormat(date) {
    const dateObj = new Date(date);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    // 使用 toLocaleDateString 获取本地日期格式
    const localDate = dateObj.toLocaleDateString('zh-CN', options);
    // 将本地日期格式转换为 YYYY-MM-DD
    const [year, month, day] = localDate.split('/');
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}
/**
 * 过滤掉 HTML 中的 img、video 和 source 标签
 * @param {string} element - 原始 HTML 字符串
 * @returns {string} 过滤后的字符串
 */
function elementFilter(element) {
    return element
        .replace(/<img[^>]*>?/g, "")
        .replace(/<video[^>]*>?/g, "")
        .replace(/<source[^>]*>?/g, "")
        .replace(/<\/img>/g, "")
        .replace(/<\/video>/g, "")
        .replace(/<\/source>/g, "");
}
/**
 * 生成湖人新闻的 Markdown 文件
 * @returns {Promise<void>} 无返回值
 */
export default async function lakerNewGenerator() {
    try {
        const news = await getLakersNews();
        if ("error" in news) {
            console.error(news.error);
            return; // 退出函数
        }
        console.log(news);
        if (Array.isArray(news)) {
            for (const newItem of news) {
                const frontmatter = {
                    layout: "doc",
                    title: newItem.title,
                    description: newItem.title,
                    date: dateFormat(newItem.date),
                    author: "laker-news",
                    head: [["meta", { name: "keywords", content: "laker-news" }]],
                };
                const content = `${elementFilter(newItem.content)}`;
                const filePath = `docs/新闻/日报/Laker/${dateFormat(newItem.date)}-laker-news-${newItem.id}.md`;
                const fileContent = matter.stringify(content, frontmatter);
                // 写入文件
                fs.writeFileSync(filePath, fileContent);
                // 输出成功信息
                console.log(`成功生成文件: ${filePath}`);
            }
        }
    }
    catch (error) {
        console.error("生成湖人新闻时发生错误:", error);
    }
}
