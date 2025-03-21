export type ProcessedNews = {
    id: number;          // 新闻的唯一标识符
    title: string;       // 新闻标题
    date: string;        // 新闻发布日期，格式为 YYYY-MM-DD
    content: string;     // 新闻内容
};

type Article = {
    id: number;                  // 文章的唯一标识符
    news_id: string;             // 新闻的 ID
    title: string;               // 文章标题
    thumbnail: string;           // 缩略图 URL
    thumbnail_2x: string;        // 2x 缩略图 URL
    thumbnail_y: string;         // 竖版缩略图 URL
    thumbnail_y_2x: string;      // 竖版 2x 缩略图 URL
    abstract: string;            // 文章摘要
    publish_time: string;        // 发布时间
    atype: number;               // 文章类型
    duration: number;            // 视频时长（如果适用）
    like_num: number;            // 点赞数
    liked: boolean;              // 是否已点赞
    collect_num: number;         // 收藏数
    collected: boolean;          // 是否已收藏
    source: string;              // 来源
    column_tag: string;          // 栏目标签
    tag_id: number;              // 标签 ID
    cid: number;                 // 分类 ID
    editor: string;              // 编辑者
    origin: string;              // 原始内容（HTML 格式）
    lock_at: string;             // 锁定时间
    seq: number;                 // 序列号
    ext: object[];               // 扩展信息（具体结构未提供）
    publishing_platform: number;  // 发布平台
    video_orientation: number;    // 视频方向
    video_width: number;          // 视频宽度
    video_height: number;         // 视频高度
    user_id: number;              // 用户 ID
    video_attributes: string;      // 视频属性
    reply_num: number;            // 回复数
    reply_switch: boolean;        // 回复开关
    rating: number;               // 评分
    player_id: number;            // 球员 ID
    action_type: string;          // 动作类型
};

export type Content = {
    id: number;                  // 内容的唯一标识符
    module_id: number;           // 模块 ID
    news_id: string;             // 新闻 ID
    title: string;               // 内容标题
    show_title: boolean;         // 是否显示标题
    position: number;            // 位置
    status: number;              // 状态
    content_type: number;        // 内容类型
    publish_type: number;        // 发布类型
    published_at: string;        // 发布时间
    expired_at: string;          // 过期时间
    created_at: string;          // 创建时间
    updated_at: string;          // 更新时间
    article: Article;            // 文章内容
};