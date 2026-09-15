// automation/scripts/fetch-wcl-mplus-statistics.mjs
// 用于自动化抓取 Warcraft Logs (WCL) 官方大秘境 (Zone 55) 统计与顶尖限时记录
// 运行命令：ego-browser nodejs < automation/scripts/fetch-wcl-mplus-statistics.mjs

import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.env.PWD || "/Users/wuwanzhu/Documents/wow";
const outputFile = "/Users/wuwanzhu/Documents/wow/automation/data/wcl-mplus-statistics-latest.json";

console.log("Starting WCL Mythic+ (Zone 55) statistics and rankings fetch...");

const task = await taskSpace("wcl-mplus-fetch");
try {
  const page = task.page("p1");

  // 1. 抓取 Zone 55 大秘境全专精积分分位统计 (Highcharts 箱形图)
  console.log("Navigating to WCL Zone 55 Statistics (Points Statistics)...");
  await page.goto("https://www.warcraftlogs.com/zone/statistics/55");
  await page.waitForLoadState("load", { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const title = await page.title();
  if (title.includes("Human Verification") || title.includes("One Quick Check")) {
    console.log("Handling Cloudflare verification...");
    await page.click("loc=role:button[name='I am a human and not a bot']").catch(() => {});
    await page.waitForTimeout(4000);
  }

  const statisticsData = await page.evaluate(() => {
    const chart = window.Highcharts?.charts?.find(c => c && c.series && c.series.length > 0);
    if (!chart) return { error: "Highcharts instance not found" };

    const boxSeries = chart.series[0];
    const outlierSeries = chart.series[1];

    const results = [];
    if (boxSeries && boxSeries.data) {
      for (let i = 0; i < boxSeries.data.length; i++) {
        const d = boxSeries.data[i];
        const outlier = outlierSeries?.data?.[i];
        const rawName = (d.name || d.category || "").trim();
        results.push({
          rawName,
          key: rawName.toLowerCase().replace(/\s+/g, "-"),
          median: Math.round((d.median || d.y || 0) * 10) / 10,
          q1: Math.round((d.q1 || 0) * 10) / 10,
          q3: Math.round((d.q3 || 0) * 10) / 10,
          low: Math.round((d.low || 0) * 10) / 10,
          high: Math.round((d.high || 0) * 10) / 10,
          max: outlier ? Math.round((outlier.y || 0) * 10) / 10 : Math.round((d.high || 0) * 10) / 10,
          iqr: Math.round(((d.q3 || 0) - (d.q1 || 0)) * 10) / 10,
          spread: Math.round(((d.high || 0) - (d.low || 0)) * 10) / 10
        });
      }
    }

    results.sort((a, b) => b.median - a.median);
    return { results };
  });

  // 2. 抓取代表性地下城（毒牙祭坛 Boss 12993）顶尖限时队伍战报
  console.log("Navigating to WCL Zone 55 Boss 12993 (Altar of Fangs) Rankings...");
  await page.goto("https://www.warcraftlogs.com/zone/rankings/55?boss=12993");
  await page.waitForLoadState("load", { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const topRuns = await page.evaluate(() => {
    // 寻找包含 Rankings 的主要表格
    const table = document.querySelector("#DataTables_Table_0, table.players-table, table.dataTable");
    if (!table) return [];

    const rows = [];
    const trs = Array.from(table.querySelectorAll("tbody tr")).slice(0, 8);
    for (const tr of trs) {
      const tds = Array.from(tr.querySelectorAll("td")).map(td => td.innerText.trim().replace(/\s+/g, " "));
      const report = tr.querySelector("a[href*='/reports/']")?.href || "";
      if (tds.length >= 7) {
        rows.push({
          rank: parseInt(tds[0], 10) || 0,
          player: tds[1],
          keyLevel: parseInt(tds[3], 10) || 0,
          date: tds[4],
          duration: tds[5],
          points: parseFloat(tds[6]) || 0,
          reportUrl: report
        });
      }
    }
    return rows;
  });

  const payload = {
    updatedAt: new Date().toISOString().slice(0, 10),
    source: "Warcraft Logs",
    zoneId: 55,
    mode: "Mythic+",
    season: "Midnight Season 2",
    gameVersion: "12.1.0",
    totalSpecs: statisticsData.results?.length || 0,
    specStatistics: statisticsData.results || [],
    representativeDungeon: {
      bossId: 12993,
      dungeonSlug: "altar-of-fangs",
      dungeonNameCn: "毒牙祭坛",
      dungeonNameEn: "Altar of Fangs",
      topRuns
    }
  };

  await fs.writeFile(outputFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Successfully saved WCL Mythic+ statistics to ${outputFile}`);
} finally {
  await task.finish({ keep: [] });
}
