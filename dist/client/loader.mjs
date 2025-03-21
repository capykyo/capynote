// web loader
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
const loader = new CheerioWebBaseLoader("https://api.nba.cn/cms/v2/web/column/modules/list?app_key=tiKB2tNdncnZFPOi&app_version=1.1.0&channel=NBA&device_id=f0a492c51123d1c5dbdd17e87cbf87d9&install_id=311330763&last_player_time=&last_tag_time=&last_team_time=&module_id=9999999&network=N%2FA&os_type=3&os_version=1.0.0&page_no=2&page_size=20&page_type=2&sign=sign_v2&sign2=9D0308450199CBD946F18D239E91909FFFB967A331242B948C806DBD6358B244&t=1742050692348");
const docs = await loader.load();
console.log(docs);
