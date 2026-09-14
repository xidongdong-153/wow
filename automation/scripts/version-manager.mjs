#!/usr/bin/env node
// automation/scripts/version-manager.mjs
// 魔兽世界版本与蓝贴时效管理脚本
// 用法：
//   node automation/scripts/version-manager.mjs check
//   node automation/scripts/version-manager.mjs record-hotfix <patch-file-path>
//   node automation/scripts/version-manager.mjs mark-synced <class/spec>
//   node automation/scripts/version-manager.mjs tag-info

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "../../");
const VERSION_FILE = path.join(ROOT_DIR, "version.json");

async function readVersionConfig() {
  try {
    const raw = await fs.readFile(VERSION_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error(`无法读取 version.json: ${error.message}`);
    process.exit(1);
  }
}

async function writeVersionConfig(config) {
  try {
    await fs.writeFile(VERSION_FILE, JSON.stringify(config, null, 2) + "\n", "utf-8");
  } catch (error) {
    console.error(`无法写入 version.json: ${error.message}`);
    process.exit(1);
  }
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runCheck() {
  const config = await readVersionConfig();
  console.log("==================================================");
  console.log("知识库版本与蓝贴时效状态自检报告");
  console.log("==================================================");
  console.log(`基准版本: ${config.gameVersion} (${config.expansion} - ${config.season})`);
  console.log(`生效蓝贴: ${config.activeHotfix.date} (${config.activeHotfix.title})`);
  console.log(`建议标签: ${config.gitTag}`);
  console.log("--------------------------------------------------");

  let hasIssue = false;

  // 1. 补丁目录检查
  const patchMajor = config.gameVersion.split(".").slice(0, 2).join(".");
  const patchDir = path.join(ROOT_DIR, "patches", patchMajor);
  const patchDirOk = await fileExists(patchDir);
  console.log(`补丁目录 [patches/${patchMajor}]: ${patchDirOk ? "正常" : "缺失"}`);
  if (!patchDirOk) hasIssue = true;

  // 2. 活跃热修文件检查
  const hotfixFile = path.join(ROOT_DIR, config.activeHotfix.path);
  const hotfixFileOk = await fileExists(hotfixFile);
  console.log(`热修文档 [${config.activeHotfix.path}]: ${hotfixFileOk ? "正常" : "缺失"}`);
  if (!hotfixFileOk) hasIssue = true;

  // 3. 对应榜单文件检查
  const mplusRanking = path.join(ROOT_DIR, "rankings", "mythic-plus", `${config.activeHotfix.date}.md`);
  const raidRanking = path.join(ROOT_DIR, "rankings", "raid", `${config.activeHotfix.date}.md`);
  const mplusOk = await fileExists(mplusRanking);
  const raidOk = await fileExists(raidRanking);
  console.log(`大秘境榜单 [rankings/mythic-plus/${config.activeHotfix.date}.md]: ${mplusOk ? "已归档" : "未归档"}`);
  console.log(`团本天梯榜 [rankings/raid/${config.activeHotfix.date}.md]: ${raidOk ? "已归档" : "未归档"}`);
  if (!mplusOk || !raidOk) hasIssue = true;

  // 4. 专精时效状态检查
  console.log("--------------------------------------------------");
  console.log("维护专精时效状态列表:");
  const specEntries = Object.entries(config.specStatus || {});
  for (const [specKey, info] of specEntries) {
    const isAffected = config.activeHotfix.affectedSpecs.includes(specKey);
    const isAligned = info.hotfixAligned === config.activeHotfix.date;
    const statusText = info.status === "up-to-date" ? "已对齐" : "待审查";
    const flagText = isAffected ? "[受本次蓝贴影响]" : "[未受直接影响]";
    console.log(`  - ${specKey.padEnd(24)}: ${statusText} (对齐热修: ${info.hotfixAligned}) ${flagText}`);
    if (info.status !== "up-to-date") {
      hasIssue = true;
    }
  }

  console.log("==================================================");
  if (hasIssue) {
    console.log("检测结果: 存在未对齐或缺失项，请按以上提示补齐。");
  } else {
    console.log("检测结果: 全面同步完成，版本时效一致。");
  }
}

async function runRecordHotfix(patchRelPath) {
  if (!patchRelPath) {
    console.error("错误: 缺少补丁文件路径参数。");
    console.log("示例: node automation/scripts/version-manager.mjs record-hotfix patches/12.1/2026-09-14-tuning.md");
    process.exit(1);
  }

  const fullPath = path.resolve(ROOT_DIR, patchRelPath);
  if (!(await fileExists(fullPath))) {
    console.error(`错误: 指定的文件不存在: ${patchRelPath}`);
    process.exit(1);
  }

  const content = await fs.readFile(fullPath, "utf-8");
  const config = await readVersionConfig();

  // 提取标题与日期
  const titleMatch = content.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : path.basename(patchRelPath, ".md");

  const dateMatch = patchRelPath.match(/(\d{4}-\d{2}-\d{2})/);
  const hotfixDate = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0];

  // 智能推断受影响的专精列表（匹配常见职业专精词组）
  const candidates = [
    { key: "death-knight/unholy", keywords: ["邪恶死亡骑士", "邪DK", "Unholy", "萨莱茵", "天启骑士"] },
    { key: "death-knight/frost", keywords: ["冰霜死亡骑士", "冰DK", "Frost"] },
    { key: "paladin/retribution", keywords: ["惩戒圣骑士", "惩戒骑", "Retribution"] },
    { key: "warrior/arms", keywords: ["武器战", "Arms"] },
    { key: "shaman/elemental", keywords: ["元素萨", "Elemental"] }
  ];

  const affected = [];
  for (const item of candidates) {
    const matched = item.keywords.some(kw => content.includes(kw));
    if (matched) {
      affected.push(item.key);
    }
  }

  config.activeHotfix = {
    date: hotfixDate,
    title: title,
    path: path.relative(ROOT_DIR, fullPath),
    affectedSpecs: affected
  };

  const cleanDate = hotfixDate.replace(/-/g, "");
  config.gitTag = `v${config.gameVersion}-hotfix-${cleanDate}`;

  // 标记受影响的已维护专精为 needs-review
  for (const specKey of affected) {
    if (config.specStatus[specKey]) {
      if (config.specStatus[specKey].hotfixAligned !== hotfixDate) {
        config.specStatus[specKey].status = "needs-review";
      }
    }
  }

  config.dataSync.status = "needs-review";

  await writeVersionConfig(config);
  console.log(`成功接入蓝贴: ${title}`);
  console.log(`热修生效日期: ${hotfixDate}`);
  console.log(`受影响专精列表: ${affected.join(", ") || "无直接专精受影响"}`);
  console.log(`生成建议 Tag: ${config.gitTag}`);
  console.log("已更新 version.json。请检查并更新受影响专精的手法与指南。");
}

async function runMarkSynced(specKey) {
  if (!specKey) {
    console.error("错误: 缺少专精路径参数 (例如: death-knight/unholy)");
    process.exit(1);
  }

  const config = await readVersionConfig();
  if (!config.specStatus[specKey]) {
    config.specStatus[specKey] = {};
  }

  const today = new Date().toISOString().split("T")[0];
  config.specStatus[specKey].status = "up-to-date";
  config.specStatus[specKey].verifiedAt = today;
  config.specStatus[specKey].hotfixAligned = config.activeHotfix.date;

  // 检查是否全部专精已完成对齐
  const allSynced = Object.values(config.specStatus).every(item => item.status === "up-to-date");
  if (allSynced) {
    config.dataSync.status = "synchronized";
  }

  await writeVersionConfig(config);
  console.log(`专精 [${specKey}] 已标记为与热修 [${config.activeHotfix.date}] 对齐完成。`);
}

async function runTagInfo() {
  const config = await readVersionConfig();
  console.log("当前建议的 Git Tag 发布命令:");
  console.log(`git tag -a ${config.gitTag} -m "release(12.1): 对齐 ${config.activeHotfix.date} 蓝贴与榜单数据"`);
  console.log("");
  console.log("推送标签至远程仓库命令:");
  console.log(`git push origin ${config.gitTag}`);
}

function showHelp() {
  console.log("魔兽世界版本与蓝贴时效管理脚本");
  console.log("");
  console.log("可用命令:");
  console.log("  node automation/scripts/version-manager.mjs check");
  console.log("      检查当前版本、蓝贴、各专精与榜单的时效对齐状态");
  console.log("  node automation/scripts/version-manager.mjs record-hotfix <patch-file-path>");
  console.log("      录入新蓝贴，自动提取受影响专精并更新 version.json");
  console.log("  node automation/scripts/version-manager.mjs mark-synced <class/spec>");
  console.log("      标记指定专精的手法与配装已对齐最新热修");
  console.log("  node automation/scripts/version-manager.mjs tag-info");
  console.log("      输出当前建议的 Git Tag 命令");
}

const args = process.argv.slice(2);
const command = args[0];

switch (command) {
  case "check":
    await runCheck();
    break;
  case "record-hotfix":
    await runRecordHotfix(args[1]);
    break;
  case "mark-synced":
    await runMarkSynced(args[1]);
    break;
  case "tag-info":
    await runTagInfo();
    break;
  default:
    showHelp();
    break;
}
