#!/usr/bin/env node
// automation/scripts/lookup-term.mjs
// 魔兽世界国服官方简中译名权威检索工具
// 避免大模型意译、直译或繁中转换错误，直接从国服权威数据源抓取官方客户端标准文本
//
// 用法示例:
//   node automation/scripts/lookup-term.mjs dungeon "The Blinding Vale"
//   node automation/scripts/lookup-term.mjs dungeon "Murder Row"
//   node automation/scripts/lookup-term.mjs list-season-dungeons 12.1

import https from "node:https";

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept-Language": "zh-CN,zh;q=0.9"
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchHtml(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => resolve(data));
    }).on("error", reject);
  });
}

// 常见官方地下城与副本中英文静态权威映射对照（优先本地秒查）
const KNOWN_INSTANCES = {
  // Midnight Season 2
  "the blinding vale": { nameCn: "夺目谷", id: 1309, type: "dungeon", expansion: "至暗之夜" },
  "murder row": { nameCn: "密谋小径", id: 1304, type: "dungeon", expansion: "至暗之夜" },
  "den of nalorakk": { nameCn: "纳洛拉克的洞穴", id: 1311, type: "dungeon", expansion: "至暗之夜" },
  "altar of fangs": { nameCn: "毒牙祭坛", id: 1322, type: "dungeon", expansion: "至暗之夜" },
  "voidscar arena": { nameCn: "虚空之痕竞技场", id: 1313, type: "dungeon", expansion: "至暗之夜" },
  "ruby life pools": { nameCn: "红玉新生法池", id: 1202, type: "dungeon", expansion: "巨龙时代" },
  "kings' rest": { nameCn: "诸王之眠", id: 1041, type: "dungeon", expansion: "争霸艾泽拉斯" },
  "kings rest": { nameCn: "诸王之眠", id: 1041, type: "dungeon", expansion: "争霸艾泽拉斯" },
  "temple of sethraliss": { nameCn: "塞塔里斯神庙", id: 1030, type: "dungeon", expansion: "争霸艾泽拉斯" },

  // Midnight 其他地下城与团本
  "the dawnspire": { nameCn: "晨曦尖塔", id: 1307, type: "dungeon", expansion: "至暗之夜" },
  "amani crypts": { nameCn: "阿曼尼地穴", id: 1308, type: "dungeon", expansion: "至暗之夜" },
  "freightrunner's run": { nameCn: "运货快道", id: 1310, type: "dungeon", expansion: "至暗之夜" },
  "freightrunners run": { nameCn: "运货快道", id: 1310, type: "dungeon", expansion: "至暗之夜" },
  "the venomous abyss": { nameCn: "烈毒之渊", id: 1320, type: "raid", expansion: "至暗之夜" }
};

async function lookupDungeon(term) {
  const normalized = term.trim().toLowerCase();
  if (KNOWN_INSTANCES[normalized]) {
    const item = KNOWN_INSTANCES[normalized];
    console.log("--------------------------------------------------");
    console.log(`检索词: "${term}" (本地权威词典直接命中)`);
    console.log(`国服官方译名: ${item.nameCn}`);
    console.log(`副本编号 (ID): ${item.id}`);
    console.log(`副本类型: ${item.type}`);
    console.log(`所属版本: ${item.expansion}`);
    console.log(`权威数据源直达: https://db.damijing.com/instance/${item.id}`);
    console.log("--------------------------------------------------");
    return;
  }

  // 若本地词典未命中，通过大米网数据库动态查询
  console.log(`本地词典未收录，正在连接国服正式服数据库动态检索: ${term}...`);
  try {
    const searchUrl = `https://db.damijing.com/version/12.1`;
    const html = await fetchHtml(searchUrl);
    const instanceMatches = [...html.matchAll(/href="\/instance\/([0-9]+)"[^>]*>([^<]+)<\/a>/g)];
    const found = instanceMatches.find(m => m[2].toLowerCase().includes(normalized));

    if (found) {
      console.log("--------------------------------------------------");
      console.log(`检索词: "${term}"`);
      console.log(`国服官方译名: ${found[2]}`);
      console.log(`副本编号 (ID): ${found[1]}`);
      console.log(`权威数据源直达: https://db.damijing.com/instance/${found[1]}`);
      console.log("--------------------------------------------------");
    } else {
      console.log(`未在大米网 12.1 数据库中直接找到匹配项。`);
      console.log(`建议操作: 使用 web_search 查询: site:db.damijing.com/instance "${term}" 或 site:wow.blizzard.cn "${term}"`);
    }
  } catch (error) {
    console.error(`在线查询失败: ${error.message}`);
  }
}

function listSeasonDungeons(season) {
  console.log("==================================================");
  console.log(`魔兽世界 Midnight Season 2 官方大秘境 8 地下城池标准列表:`);
  console.log("==================================================");
  const s2List = [
    { en: "The Blinding Vale", cn: "夺目谷", id: 1309, tag: "新本 (至暗之夜)" },
    { en: "Murder Row", cn: "密谋小径", id: 1304, tag: "新本 (至暗之夜)" },
    { en: "Den of Nalorakk", cn: "纳洛拉克的洞穴", id: 1311, tag: "新本 (至暗之夜)" },
    { en: "Altar of Fangs", cn: "毒牙祭坛", id: 1322, tag: "新本 (至暗之夜)" },
    { en: "Voidscar Arena", cn: "虚空之痕竞技场", id: 1313, tag: "新本 (至暗之夜)" },
    { en: "Ruby Life Pools", cn: "红玉新生法池", id: 1202, tag: "经典回归 (巨龙时代)" },
    { en: "Kings' Rest", cn: "诸王之眠", id: 1041, tag: "经典回归 (争霸艾泽拉斯)" },
    { en: "Temple of Sethraliss", cn: "塞塔里斯神庙", id: 1030, tag: "经典回归 (争霸艾泽拉斯)" }
  ];

  s2List.forEach((item, idx) => {
    console.log(`${idx + 1}. ${item.cn.padEnd(10)} | ${item.en.padEnd(24)} | ID: ${item.id} | ${item.tag}`);
  });
  console.log("==================================================");
  console.log("官方出处: 暴雪蓝贴《Midnight Season 2 is Now Live》");
}

const args = process.argv.slice(2);
const action = args[0];
const param = args[1];

if (action === "dungeon" && param) {
  await lookupDungeon(param);
} else if (action === "list-season-dungeons") {
  listSeasonDungeons(param || "12.1");
} else {
  console.log("魔兽世界官方译名与赛季轮换查询脚本");
  console.log("用法:");
  console.log("  node automation/scripts/lookup-term.mjs dungeon <英文名称>");
  console.log("  node automation/scripts/lookup-term.mjs list-season-dungeons [版本号]");
}
