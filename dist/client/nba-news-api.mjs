export async function getLakersNews() {
    const timestamp = Date.now();
    const pageSize = 20;
    const today = new Date().toISOString().split('T')[0]; // 获取今天的日期，格式为 YYYY-MM-DD
    const fetchPage = async (pageNo) => {
        const url = `https://api.nba.cn/cms/v2/web/column/modules/list?app_key=tiKB2tNdncnZFPOi&app_version=1.1.0&channel=NBA&device_id=f0a492c51123d1c5dbdd17e87cbf87d9&install_id=311330763&last_player_time=&last_tag_time=&last_team_time=&module_id=9999999&network=N%2FA&os_type=3&os_version=1.0.0&page_no=${pageNo}&page_size=${pageSize}&page_type=2&sign=sign_v2&sign2=9D0308450199CBD946F18D239E91909FFFB967A331242B948C806DBD6358B244&t=${timestamp}`;
        const result = await fetch(url, {
            method: "GET",
            redirect: "follow",
        });
        if (!result.ok) {
            throw new Error(`HTTP error! status: ${result.status}`);
        }
        return await result.json();
    };
    try {
        const [dataPage1, dataPage2] = await Promise.all([
            fetchPage(1),
            fetchPage(2),
        ]);
        const allNews = [...dataPage1.data[0].contents, ...dataPage2.data[0].contents];
        const news = allNews.map((item) => {
            return {
                id: item.id,
                title: item.title,
                date: item.published_at,
                content: item.article.origin,
            };
        });
        // 从title中筛选出与湖人有关的新闻，并且published_at为今天
        const lakersNews = news.filter((item) => {
            return item.title.includes("湖人") && item.date.startsWith(today);
        });
        return lakersNews;
    }
    catch (error) {
        console.error("Error fetching Lakers news:", error);
        return { error: "无法获取湖人新闻，请稍后再试。" }; // 返回错误信息
    }
}
// 调用函数并输出结果
const news = await getLakersNews();
console.log(news);
