// automation/scripts/generate-news-md.mjs
// 将抓取的每日情报结构化数据 (news-latest.json) 渲染生成标准的 Markdown 知识库文章
// 严格遵守 xdd-plain-docs 规范：严禁 emoji、纯事实驱动、权威数据对齐

import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.env.PWD || "/Users/wuwanzhu/Documents/wow";
const targetDate = process.argv[2] || process.env.NEWS_DATE || "2026-09-15";
const jsonPath = path.join(rootDir, `automation/data/news-${targetDate}.json`);
const fallbackPath = path.join(rootDir, "automation/data/news-latest.json");

let rawData = null;
try {
  rawData = await fs.readFile(jsonPath, "utf-8");
} catch {
  rawData = await fs.readFile(fallbackPath, "utf-8");
}

const data = JSON.parse(rawData);

function renderMarkdown(d) {
  const month = d.date.slice(0, 7);
  const sourcesYaml = (d.sourcesRegistry || []).map(s => `  - name: ${s.topic} (${s.platform})\n    url: ${s.url}`).join("\n");

  const lines = [];

  // 1. YAML Front Matter
  lines.push("---");
  lines.push(`title: ${d.date} 每日资讯与热点汇总`);
  lines.push(`description: ${d.leadStory?.dungeonNameCn || "高层"}限时突破全阵容解构、在线热修全职业影响、团本竞速与全职业生态`);
  lines.push("category: news");
  lines.push("docType: daily-digest");
  lines.push(`gameVersion: ${d.gameVersion}`);
  lines.push(`season: ${d.season}`);
  lines.push(`date: ${d.date}`);
  lines.push(`hotfixStatus: ${d.hotfixStatus}`);
  lines.push(`sampleSize: ${d.sampleSize}`);
  lines.push("sources:");
  lines.push(sourcesYaml);
  lines.push("tags:");
  lines.push("  - news");
  lines.push("  - mythic-plus");
  lines.push("  - raid");
  lines.push(`  - ${d.gameVersion.slice(0, 4)}`);
  lines.push("---");
  lines.push("");

  // 主标题
  lines.push(`# ${d.date} 每日资讯与热点汇总`);
  lines.push("");

  // 01 晨间头版导引
  lines.push("## 01 晨间头版导引 (今天的艾泽拉斯)");
  lines.push("");
  for (const b of d.heroQuiet.bullets) {
    lines.push(`- **核心导读**：${b}`);
  }
  lines.push("");
  lines.push(`${d.heroQuiet.meta}。`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // 02 今日大秘境突破战报与全阵容解构
  lines.push("## 02 今日大秘境突破战报与全阵容解构");
  lines.push("");
  const lead = d.leadStory;
  lines.push(`### 主头条：${lead.title}`);
  lines.push("");
  lines.push(lead.summary);
  lines.push("");
  lines.push("#### 核心指标");
  lines.push(`- 通关耗时：${lead.metrics.clearTime} (${lead.metrics.timeRemaining})`);
  lines.push(`- 钥石积分：${lead.metrics.score} (${lead.metrics.scoreCert})`);
  lines.push(`- 关键战术：${lead.metrics.tactics} (${lead.metrics.tacticsDetail})`);
  lines.push("");
  lines.push("#### 队伍 5 专精角色协同解构");
  lines.push("| 职责位 | 专精 | 角色图标 | 全程秒伤 | 核心战术协同职责 |");
  lines.push("| :--- | :--- | :--- | :--- | :--- |");
  for (const member of lead.lineup) {
    const iconSlug = `${member.classSlug}-${member.specSlug}`;
    const dpsVal = member.dps || "—";
    lines.push(`| ${member.roleLabel} | ${member.specName} | ${iconSlug} | ${dpsVal} | ${member.duty} |`);
  }
  lines.push("");
  lines.push(`出处直达：[${lead.dungeonNameCn} ${lead.keyLevel} 级限时日志](${lead.sourceUrl})`);
  lines.push("");

  // 副情报
  if (d.sideIntel && d.sideIntel.length > 0) {
    for (let i = 0; i < d.sideIntel.length; i++) {
      const side = d.sideIntel[i];
      lines.push(`### 副速递 ${i + 1}：${side.title}`);
      lines.push("");
      lines.push(side.summary);
      lines.push("");
      if (side.rosterSummary) {
        lines.push("- **通关阵容与全程表现**：");
        for (const r of side.rosterSummary) {
          const dpsStr = r.dps ? `（全程秒伤 ${r.dps}）` : "";
          lines.push(`  - ${r.roleText}${dpsStr}：${r.note || "主力输出与攻坚"}`);
        }
      }
      lines.push(`- 出处直达：[${side.tag}](${side.sourceUrl})`);
      lines.push("");
    }
  }
  lines.push("---");
  lines.push("");

  // 03 暴雪官方在线热修速报
  lines.push("## 03 暴雪官方在线热修速报");
  lines.push("");
  const hx = d.hotfix;
  lines.push(`**${hx.headline}**`);
  lines.push("");
  lines.push(hx.summary);
  lines.push("");
  lines.push("### 核心机制修正卡片");
  for (let i = 0; i < hx.cards.length; i++) {
    const c = hx.cards[i];
    lines.push(`${i + 1}. **${c.target} (${c.type})**：${c.detail}`);
  }
  lines.push("");
  lines.push(`### 职业机制校准清单\n- ${hx.classFixes}`);
  lines.push("");
  lines.push(`出处直达：[暴雪官方社区论坛在线热修公告](${hx.sourceUrl})`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // 04 全职业天梯异动与黑马专精观察
  lines.push("## 04 全职业天梯异动与黑马专精观察");
  lines.push("");
  const mr = d.metaRankings;
  lines.push(`- 监控口径：${mr.sampleSize} · 钥石区间 ${mr.keyRange} · ${mr.monitoredSpecs}`);
  lines.push("");
  lines.push("### 全职业天梯异动榜 (95th 分位)");
  lines.push("| 排名 | 专精 | 梯队 | 95th 评分 | 趋势 | 战术定位 |");
  lines.push("| :--- | :--- | :--- | :--- | :--- | :--- |");
  for (const row of mr.table) {
    lines.push(`| ${row.rank} | ${row.specName} | ${row.tier} | ${row.score} | ${row.trend} | ${row.roleTag} |`);
  }
  lines.push("");
  lines.push(`**编辑部速评**：${mr.editorialNote}`);
  lines.push("");

  const sp = mr.spotlight;
  lines.push(`### 黑马流派深度观察：${sp.specName} (${sp.score})`);
  lines.push("");
  lines.push(sp.description);
  lines.push("");
  for (const m of sp.metrics) {
    lines.push(`- **${m.label}**：${m.val}`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // 05 史诗团本全职业首领战分布
  lines.push(`## 05 史诗团本全职业首领战分布 (${d.raidEcosystem.raidNameCn})`);
  lines.push("");
  const rd = d.raidEcosystem;
  lines.push(`- 竞速榜首：${rd.speedLeader} · 统计口径：${rd.dataset}`);
  lines.push("");
  lines.push(`### ${rd.bossNameCn} 95th 分位秒伤统计 (Top 8 专精)`);
  lines.push("| 排名 | 专精 | 95th 秒伤 | 相对比例 | 机制特征 |");
  lines.push("| :--- | :--- | :--- | :--- | :--- |");
  const charFeatures = {
    "demonology": "纯单体持续压制，暴君爆发窗口与虚空易伤对齐",
    "retribution": "1 分钟短爆发全覆盖转阶段，自由祝福解缓速",
    "arms": "斩杀期强力抬升团队秒伤基准",
    "marksmanship": "远距离转火高机动，不受近战跑位惩罚",
    "arcane": "双冰箱规避环境致死点名，爆发期点杀触须",
    "frost": "副手结算修复后单体秒伤净增 8.3K",
    "enhancement": "风怒图腾使小队近战收益大幅增加",
    "unholy": "反魔法领域（AMZ）为团战硬性魔法减伤基石"
  };
  for (const bar of rd.dpsBars) {
    const feat = charFeatures[bar.specSlug] || "主力首领战输出";
    lines.push(`| ${bar.rank} | ${bar.specName} | ${bar.dps} | ${bar.percentage}% | ${feat} |`);
  }
  lines.push("");

  lines.push("### 关键战术专精解析");
  for (let i = 0; i < rd.tacticalCards.length; i++) {
    const card = rd.tacticalCards[i];
    lines.push(`${i + 1}. **${card.tag} (${card.subtitle})**：${card.summary}`);
  }
  lines.push("");
  lines.push(`出处直达：[WCL 尾王首领战秒伤统计](${rd.sourceUrl})`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // 06 今日简报流
  lines.push("## 06 今日简报流");
  lines.push("");
  for (const item of d.streamList) {
    lines.push(`- **${item.time}**：${item.content}（来源：${item.source}）`);
  }
  lines.push("");
  lines.push("---");
  lines.push("");

  // 07 引用出处与验证源汇总
  lines.push("## 07 引用出处与验证源汇总");
  lines.push("");
  lines.push("| 序号 | 资讯主题 | 数据源平台 | 权威直达 URL |");
  lines.push("| :--- | :--- | :--- | :--- |");
  for (const s of d.sourcesRegistry) {
    lines.push(`| ${s.id} | ${s.topic} | ${s.platform} | \`${s.url}\` |`);
  }
  lines.push("");

  return lines.join("\n");
}

const markdownContent = renderMarkdown(data);
const monthDir = path.join(rootDir, "news", data.date.slice(0, 7));
await fs.mkdir(monthDir, { recursive: true });

const targetMdPath = path.join(monthDir, `${data.date}.md`);
await fs.writeFile(targetMdPath, markdownContent, "utf-8");
console.log(`Successfully generated news markdown: ${targetMdPath}`);
