// automation/scripts/fetch-all-talents.mjs
// 魔兽世界全职业 39 专精官方天赋数据全量抓取工具
// 使用方式:
//   ego-browser nodejs < automation/scripts/fetch-all-talents.mjs

import fs from "node:fs/promises";
import path from "node:path";

const BASE_DIR = "/Users/wuwanzhu/Documents/wow";
const DATA_FILE = path.join(BASE_DIR, "automation/data/talents-data.json");
const SPEC_MODULE = path.join(BASE_DIR, "automation/scripts/spec-constants.mjs");
const HERO_MODULE = path.join(BASE_DIR, "automation/scripts/hero-talent-constants.mjs");

const { SPEC_MAP } = await import(SPEC_MODULE);
const { getHeroTalentCn } = await import(HERO_MODULE);

console.log("==================================================");
console.log("启动魔兽世界全职业全专精天赋数据采集器");
console.log(`目标专精总数: ${Object.keys(SPEC_MAP).length}`);
console.log(`存储目标文件: ${DATA_FILE}`);
console.log("==================================================");

// 读取已有缓存
let existingData = {};
try {
  const content = await fs.readFile(DATA_FILE, "utf-8");
  existingData = JSON.parse(content);
} catch (e) {
  existingData = {};
}

const task = await taskSpace("all-spec-talents-fetch");
const page = task.page("p1");

let successCount = 0;
let skippedCount = 0;
let failCount = 0;

const specList = Object.entries(SPEC_MAP);

for (let i = 0; i < specList.length; i++) {
  const [specKey, specInfo] = specList[i];
  const { classSlug, specSlug, nameCn, specCn, classCn, role, type } = specInfo;

  // 检查是否已抓取完整数据
  if (existingData[specKey] && existingData[specKey].heroTalents && existingData[specKey].heroTalents.length > 0) {
    console.log(`[${i + 1}/${specList.length}] ${nameCn} (${specKey}): 已存在本地数据，跳过.`);
    skippedCount++;
    continue;
  }

  const url = `https://www.archon.gg/wow/builds/${specSlug}/${classSlug}/mythic-plus/talents/10/all-dungeons/this-week`;
  console.log(`[${i + 1}/${specList.length}] 抓取: ${nameCn} -> ${url}`);

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 });
    await page.waitForTimeout(2000);

    let title = await page.title();
    if (title.includes("Human Verification") || title.includes("One Quick Check")) {
      console.log("  遇到验证挑战，正在尝试自动放行...");
      await page.click("loc=role:button[name='I am a human and not a bot']").catch(() => {});
      await page.waitForTimeout(3500);
      title = await page.title();
    }

    if (title.includes("404") || title.includes("Page not found")) {
      console.warn(`  [警告] 页面 404: ${url}`);
      failCount++;
      continue;
    }

    const scraped = await page.evaluate(() => {
      const text = document.body.innerText;
      
      // 1. Parses
      const parseMatch = text.match(/Total Parses:\s*([\d,]+)/i);
      const totalParses = parseMatch ? parseMatch[1] : "";

      // 2. Hero Talents (格式: 1. SLAYER: 303.2K 99.8%)
      const heroTalents = [];
      const heroRegex = /(\d+)\.\s*([A-Z\s']+):\s*([\d.]+K)[\s\S]*?([\d.]+%)/gi;
      let match;
      while ((match = heroRegex.exec(text)) !== null) {
        heroTalents.push({
          rank: parseInt(match[1]),
          nameEn: match[2].trim(),
          dpsOrHps: match[3],
          popularity: match[4]
        });
      }

      // 3. Recommended Build
      const popMatch = text.match(/Spec & Hero Popularity\s*([\d.]+%)/i);
      const keyMatch = text.match(/Keystone Level\s*(\+?\d+)/i);
      const dpsMatch = text.match(/(DPS|HPS)\s*([\d.]+k)/i);

      // 4. Wowhead Export Link
      const wowheadLink = Array.from(document.querySelectorAll('a[href*="wowhead.com/talent-calc"]')).map(a => a.href)[0] || "";

      return {
        totalParses,
        heroTalents,
        recommended: {
          popularity: popMatch ? popMatch[1] : "",
          keyLevel: keyMatch ? keyMatch[1] : "",
          metric: dpsMatch ? `${dpsMatch[1]}: ${dpsMatch[2]}` : "",
          wowheadUrl: wowheadLink
        }
      };
    });

    // 补充国服中文名
    const formattedHeroTalents = scraped.heroTalents.map(h => ({
      ...h,
      nameCn: getHeroTalentCn(h.nameEn)
    }));

    const resultRecord = {
      specKey,
      classSlug,
      specSlug,
      nameCn,
      specCn,
      classCn,
      role,
      type,
      fetchedAt: new Date().toISOString().split("T")[0],
      totalParses: scraped.totalParses,
      heroTalents: formattedHeroTalents,
      recommended: {
        ...scraped.recommended,
        heroTreeCn: formattedHeroTalents[0]?.nameCn || ""
      }
    };

    existingData[specKey] = resultRecord;
    // 增量落盘
    await fs.writeFile(DATA_FILE, JSON.stringify(existingData, null, 2), "utf-8");
    console.log(`  成功解析: 样本量 ${scraped.totalParses} | 英雄天赋: ${formattedHeroTalents.map(h => `${h.nameCn}(${h.popularity})`).join(", ")} | 推荐限时: ${scraped.recommended.keyLevel}`);
    successCount++;

  } catch (err) {
    console.error(`  抓取失败 (${nameCn}): ${err.message}`);
    failCount++;
  }
}

await task.finish({ keep: [] });

console.log("==================================================");
console.log(`全职业天赋抓取完成! 成功: ${successCount}, 跳过: ${skippedCount}, 失败: ${failCount}`);
console.log(`数据文件: ${DATA_FILE}`);
console.log("==================================================");
