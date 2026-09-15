// automation/scripts/fetch-wcl-statistics.mjs
// 用于自动化抓取 Warcraft Logs (WCL) 官方原始统计与顶尖选手实战数据
// 运行命令：ego-browser nodejs < automation/scripts/fetch-wcl-statistics.mjs

import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.env.PWD || "/Users/wuwanzhu/Documents/wow";
const outputFile = "/Users/wuwanzhu/Documents/wow/automation/data/wcl-statistics-latest.json";

console.log("Starting WCL statistics and rankings fetch...");

const task = await taskSpace("wcl-data-fetch");
try {
  const page = task.page("p1");

  // 1. 抓取 Zone 53 史诗难度全职业 DPS 分位统计
  console.log("Navigating to WCL Zone 53 Statistics (Class Balance)...");
  await page.goto("https://www.warcraftlogs.com/zone/statistics/53");
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

  // 2. 抓取代表性首领（3470 Nek'zali）顶尖击杀战报
  console.log("Navigating to WCL Zone 53 Boss 3470 Character Rankings...");
  await page.goto("https://www.warcraftlogs.com/zone/rankings/53?metric=dps&boss=3470");
  await page.waitForLoadState("load", { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(3000);

  const topParses = await page.evaluate(() => {
    const table = document.querySelector("#rankings-table, table.dataTable");
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
          ilvl: parseInt(tds[3], 10) || 0,
          dps: parseFloat(tds[4].replace(/,/g, "")) || 0,
          date: tds[5],
          duration: tds[6],
          reportUrl: report
        });
      }
    }
    return rows;
  });

  const payload = {
    updatedAt: new Date().toISOString().slice(0, 10),
    source: "Warcraft Logs",
    zoneId: 53,
    difficulty: "Mythic",
    gameVersion: "12.1.0",
    totalDpsSpecs: statisticsData.results?.length || 0,
    specStatistics: statisticsData.results || [],
    representativeBoss: {
      bossId: 3470,
      bossName: "Nek'zali the Soulcoiler",
      bossNameCn: "缚魂者 内克扎里",
      topParses
    }
  };

  await fs.writeFile(outputFile, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`Successfully saved WCL statistics to ${outputFile}`);
} finally {
  await task.finish({ keep: [] });
}
