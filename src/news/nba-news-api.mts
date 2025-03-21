import { ProcessedNews } from "../types/news.mjs"
/**
 * 获取当前日期，格式为 YYYY-MM-DD
 * @returns {string} 当前日期字符串
 */
const getTodayDate = (): string => {
    return new Date().toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).replace(/\//g, "-"); // 将日期格式转换为 YYYY-MM-DD
};

/**
 * 根据页码获取新闻数据
 * @param {number} pageNo - 页码
 * @returns {Promise<any>} 返回获取到的新闻数据
 * @throws {Error} 如果请求失败，抛出 HTTP 错误
 */
const fetchPage = async (pageNo: number): Promise<any> => {
    const timestamp = Date.now();
    const pageSize = 20;
    const url = `https://api.nba.cn/cms/v2/web/column/modules/list?app_key=tiKB2tNdncnZFPOi&app_version=1.1.0&channel=NBA&device_id=2306c0556044351c12c914f146a4f0c4&install_id=311330763&last_player_time=&last_tag_time=&last_team_time=&module_id=9999999&network=N%2FA&os_type=3&os_version=1.0.0&page_no=${pageNo}&page_size=${pageSize}&page_type=2&sign=sign_v2&sign2=F6F1143C9F33663A9B9C46ED856C84A70F5A662E0F386EE91E3C762A6CC072B6&t=${timestamp}`
    
    const result = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    
    if (!result.ok) {
        throw new Error(`HTTP error! status: ${result.status}`);
    }
    
    return await result.json();
};

/**
 * 清洗 HTML 内容，移除不需要的标签和空段落
 * @param {string} html - 原始 HTML 内容
 * @returns {string} 清洗后的 HTML 内容
 */
const cleanHtmlContent = (html: string): string => {
    return html
        // 移除 img 标签（包括自闭合标签）
        .replace(/<img[^>]*\/?>/g, '')
        // 移除 video 标签及其内容
        .replace(/<video[^>]*>.*?<\/video>/g, '')
        // 移除单独的 video 开始和结束标签（以防标签不配对的情况）
        .replace(/<video[^>]*>/g, '')
        .replace(/<\/video>/g, '')
        // 移除 source 标签及其内容
        .replace(/<source[^>]*>.*?<\/source>/g, '')
        // 移除单独的 source 标签（以防标签不配对的情况）
        .replace(/<source[^>]*>/g, '')
        .replace(/<\/source>/g, '')
        // 移除空的 p 标签（只包含空白字符的段落）
        .replace(/<p>\s*<\/p>/g, '')
        // 移除连续的换行和空格
        .replace(/\n\s*\n/g, '\n')
        // 修剪开头和结尾的空白字符
        .trim();
};

/**
 * 处理获取到的新闻数据
 * @param {any} data - 获取到的原始新闻数据
 * @returns {Array<ProcessedNews>} 处理后的新闻数据数组
 */
const processNewsData = (data: any): Array<ProcessedNews> => {
    return data.data[0].contents.map((item: any) => {
        return {
            id: item.id,
            title: item.title,
            date: item.published_at,
            content: cleanHtmlContent(item.article.origin),
        };
    });
};

/**
 * 筛选与湖人相关的新闻
 * @param {Array<ProcessedNews>} news - 新闻数据数组
 * @param {string} today - 今天的日期字符串
 * @returns {Array<ProcessedNews>} 筛选后的湖人新闻数组
 *
 * 该函数将筛选出标题中包含"湖人"或湖人球员、教练、管理层名称的新闻，并且发布日期为今天的新闻。
 */
const filterLakersNews = (news: Array<ProcessedNews>, today: string): Array<ProcessedNews> => {
    // 湖人球员、教练和管理层的名称
    const lakersPlayers = [
        "里夫斯",
        "东契奇",
        "詹姆斯",
        "八村塁",
        "海斯",
        "文森特",
        "克内克特",
        "古德温",
        "雷迪什",
        "范德比尔特",
        "克洛克",
        "米尔顿",
        "莱恩",
        "杰米森",
        "布朗尼·詹姆斯",
        "莫里斯",
        "克勒贝尔",
        "芬尼-史密斯",
    ];
    const lakersCoach = "雷迪克";
    const lakersManagement = "佩林卡";

    return news.filter((item) => {
        // 检查标题中是否包含"湖人"或球员、教练、管理层的名称
        const includesLakersRelatedTerms = item.title.includes("湖人") ||
            lakersPlayers.some((player) => item.title.includes(player)) ||
            item.title.includes(lakersCoach) ||
            item.title.includes(lakersManagement);
        return includesLakersRelatedTerms && item.date.startsWith(today);
    });
};

/**
 * 主函数：获取湖人新闻
 * @returns {Promise<Array<ProcessedNews> | { error: string }>} 返回湖人新闻数组或错误信息
 */
export async function getLakersNews(): Promise<Array<ProcessedNews> | { error: string }> {
    const today = getTodayDate();
    try {
        const [dataPage1, dataPage2] = await Promise.all([
            fetchPage(1),
            fetchPage(2),
        ]);
        const allNews = [
            ...processNewsData(dataPage1),
            ...processNewsData(dataPage2),
        ];
        const lakersNews = filterLakersNews(allNews, today);
        return lakersNews;
    } catch (error) {
        console.error("Error fetching Lakers news:", error);
        return { error: "无法获取湖人新闻，请稍后再试。" }; // 返回错误信息
    }
}

// 调用函数并输出结果
// const news = await getLakersNews();
// console.log(news);