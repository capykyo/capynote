// 生成index.md补充list列表
// 提取出docs目录下，所有md文件中frontmatter的type字段为 recommendation 的文件
// 并按照date字段降序排序
// 将文件名作为list列表的item，补充到index.md后面
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// 确保从项目根目录读取
const rootDirectory = path.resolve(process.cwd(), "./docs");

/**
 * 格式化日期为 `YYYY-MM-DD`
 * @param dateString - 原始日期字符串
 * @returns 格式化后的日期字符串
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 推荐文章的元数据接口
 */
interface RecommendationMeta {
  /** 文章标题 */
  title: string;
  /** 发布日期（显示用，格式化后的） */
  date: string;
  /** 原始日期（用于排序） */
  rawDate: string;
  /** 文章链接 */
  link: string;
  /** 文章描述 */
  description: string;
}

/** 默认排除的目录 */
const DEFAULT_EXCLUDE_DIRS = [
  '.vitepress',
  'components',
  'utils',
  'types',
  'public'
];

/**
 * 获取目录下的推荐文章列表
 * 
 * @description
 * 递归扫描指定目录下的所有 Markdown 文件，提取其 frontmatter 信息。
 * 仅返回 type 为 "recommendation" 且包含必要字段的文章。
 * 最终结果按日期降序排序。
 * 
 * @param dirPath - 要扫描的目录路径
 * @param excludeDirs - 要排除的目录列表，默认为 DEFAULT_EXCLUDE_DIRS
 * @returns 包含文章元数据的数组，按日期降序排序
 * 
 * @example
 * ```typescript
 * // 使用默认排除目录
 * const articles = getRecommendationFilesWithFrontmatter('./docs');
 * 
 * // 自定义排除目录
 * const articles = getRecommendationFilesWithFrontmatter('./docs', ['private', 'drafts']);
 * ```
 */
function getRecommendationFilesWithFrontmatter(
  dirPath: string, 
  excludeDirs: string[] = DEFAULT_EXCLUDE_DIRS
): RecommendationMeta[] {
  // 递归读取目录下的所有文件
  const files = fs.readdirSync(dirPath, { 
    withFileTypes: true, 
    recursive: true 
  });
  
  const recommendationFiles: RecommendationMeta[] = [];

  // 遍历所有文件
  files.forEach((file) => {
    // 检查文件路径是否在排除目录中
    const relativePath = path.relative(dirPath, file.path || '');
    const isInExcludedDir = excludeDirs.some(dir => 
      relativePath.split(path.sep).includes(dir)
    );

    if (isInExcludedDir) {
      return;
    }

    // 只处理 Markdown 文件
    if (!file.isFile() || !file.name.endsWith('.md')) {
      return;
    }

    try {
      const filePath = path.join(file.path || dirPath, file.name);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      // 验证必要的 frontmatter 字段
      if (
        data.type === 'recommendation' &&
        typeof data.title === 'string' &&
        data.title.trim() !== '' &&
        (data.date instanceof Date || typeof data.date === 'string') &&
        typeof data.description === 'string' &&
        data.description.trim() !== ''
      ) {
        const rawDate = data.date instanceof Date 
          ? data.date.toISOString().split('T')[0] 
          : data.date;
          
        recommendationFiles.push({
          title: data.title.trim(),
          date: formatDate(rawDate),
          rawDate,
          link: `./${path.relative(dirPath, filePath)}`,
          description: data.description.trim()
        });
      }
    } catch (error) {
      console.warn(`处理文件 ${file.name} 时出错:`, error);
    }
  });

  // 按日期降序排序，使用原始日期进行排序
  return recommendationFiles.sort((a, b) => 
    new Date(b.rawDate).getTime() - new Date(a.rawDate).getTime()
  );
}

/**
 * 生成 index.md 的内容
 * @param recommendationFiles - 包含 frontmatter 的文件列表
 * @returns 生成的 Markdown 内容
 */
function generateIndexContent(
  recommendationFiles: RecommendationMeta[]
): string {
  let content = "<script setup>\n";
  content += "import Card from './components/Card.vue';\n";
  content += "</script>\n\n";
  recommendationFiles.forEach((file) => {
    // 将link中的.md去掉
    let link = file.link.replace(".md", "");
    content += `<Card title="${file.title}" description="${file.description}" link="${link}" date="${file.date}" />\n`;
  });
  return content;
}

/**
 * 写入 index.md 文件
 * @param dirPath - 目标目录路径
 */
function writeIndexFile(dirPath: string): void {
  const recommendationFiles = getRecommendationFilesWithFrontmatter(dirPath);
  
  if (recommendationFiles.length > 0) {
    const indexContent = generateIndexContent(recommendationFiles);

    const indexFilePath = path.join(dirPath, "index.md");
    const fileContent = fs.readFileSync(indexFilePath, "utf-8");
    const frontmatter = matter(fileContent);
    const frontmatterString = matter.stringify("", frontmatter.data);
    // console.log(frontmatterString);

    const newContent = `${frontmatterString}\n\n${indexContent}`;
    // console.log(newContent);

    fs.writeFileSync(indexFilePath, newContent, "utf-8");
    console.log(`index.md 文件已生成：${indexFilePath}`);
  }
}

// 从项目根目录开始处理
writeIndexFile(rootDirectory);
