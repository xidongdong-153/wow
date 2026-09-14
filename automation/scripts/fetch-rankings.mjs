// automation/scripts/fetch-rankings.mjs
// 用于自动化抓取 Archon / WCL 官方天梯排行榜，生成结构化 JSON 数据
// 运行命令：ego-browser nodejs < automation/scripts/fetch-rankings.mjs

import fs from "node:fs/promises";
import path from "node:path";
import { SPEC_MAP } from "./spec-constants.mjs";

const task = await taskSpace("rankings-fetch");
const page = task.page("p1");

async function checkChallenge() {
  const title = await page.title();
  if (title.includes("Human Verification") || title.includes("One Quick Check")) {
    console.log("Human verification detected, clicking...");
    await page.click("loc=role:button[name='I am a human and not a bot']").catch(() => {});
    await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }
}

async function extractTiersFromPage(url, mode = "default") {
  console.log(`Navigating to: ${url}`);
  await page.goto(url, { timeout: 30000 });
  await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await checkChallenge();

  if (mode === "Throughput") {
    console.log("Switching to Throughput tab...");
    await page.click("loc=role:button[name='Throughput']").catch(err => {
      console.warn("Could not click Throughput button:", err.message);
    });
    await page.waitForTimeout(2000);
  }

  const rawTiers = await page.evaluate(() => {
    const container = document.querySelector(".builds-tier-list-section__tiers");
    if (!container) return [];

    const children = Array.from(container.children);
    const tiers = [];
    let currentTier = null;

    for (const child of children) {
      if (child.classList.contains("builds-tier-list-section__tier-heading")) {
        const headingText = child.innerText.trim().replace(/\s+/g, " ");
        currentTier = {
          tier: headingText,
          specs: []
        };
        tiers.push(currentTier);
      } else if (child.classList.contains("builds-tier-list-section__specs") && currentTier) {
        const specLis = Array.from(child.querySelectorAll(".builds-tier-list-section__spec"));
        for (const li of specLis) {
          const a = li.querySelector("a");
          if (!a) continue;
          const href = a.getAttribute("href") || "";
          const img = a.querySelector("img");
          const alt = img ? img.getAttribute("alt") || "" : "";
          const text = a.innerText.trim().replace(/\s+/g, " ");
          
          let specSlug = "";
          let classSlug = "";
          const m = href.match(/\/wow\/builds\/([^\/]+)\/([^\/]+)\/(mythic-plus|raid)/);
          if (m) {
            specSlug = m[1];
            classSlug = m[2];
          }

          let score = null;
          let dps = null;
          let hps = null;

          const scoreMatch = text.match(/(\d+)\s*SCORE/);
          if (scoreMatch) score = parseInt(scoreMatch[1], 10);

          const dpsMatch = text.match(/([\d\.]+)K?\s*DPS/);
          if (dpsMatch) dps = parseFloat(dpsMatch[1]);

          const hpsMatch = text.match(/([\d\.]+)K?\s*HPS/);
          if (hpsMatch) hps = parseFloat(hpsMatch[1]);

          currentTier.specs.push({
            specSlug,
            classSlug,
            key: `${specSlug}-${classSlug}`,
            altName: alt,
            rawText: text,
            score,
            dps,
            hps,
            href
          });
        }
      }
    }
    return tiers;
  });

  return rawTiers;
}

// 1. 抓取大秘境数据 (DPS, Tank, Healer)
console.log("--- Fetching Mythic+ Rankings ---");
const mplusDps = await extractTiersFromPage("https://www.archon.gg/wow/tier-list/dps-rankings/mythic-plus/10/all-dungeons/this-week");
const mplusTank = await extractTiersFromPage("https://www.archon.gg/wow/tier-list/tank-rankings/mythic-plus/10/all-dungeons/this-week");
const mplusHealer = await extractTiersFromPage("https://www.archon.gg/wow/tier-list/healer-rankings/mythic-plus/10/all-dungeons/this-week");

// 2. 抓取团本数据 (DPS Throughput, DPS Popularity, Tank, Healer)
console.log("--- Fetching Raid Rankings ---");
const raidDpsThroughput = await extractTiersFromPage("https://www.archon.gg/wow/tier-list/dps-rankings/raid/mythic/all-bosses", "Throughput");
const raidDpsPopularity = await extractTiersFromPage("https://www.archon.gg/wow/tier-list/dps-rankings/raid/mythic/all-bosses", "default");
const raidTank = await extractTiersFromPage("https://www.archon.gg/wow/tier-list/tank-rankings/raid/mythic/all-bosses");
const raidHealer = await extractTiersFromPage("https://www.archon.gg/wow/tier-list/healer-rankings/raid/mythic/all-bosses");

const dataOutputDir = "/Users/wuwanzhu/Documents/wow/automation/data";
await fs.mkdir(dataOutputDir, { recursive: true });

const timestamp = new Date().toISOString();

const result = {
  fetchedAt: timestamp,
  season: "The War Within Season 2 / 12.1",
  mythicPlus: {
    dps: mplusDps,
    tank: mplusTank,
    healer: mplusHealer
  },
  raid: {
    dpsThroughput: raidDpsThroughput,
    dpsPopularity: raidDpsPopularity,
    tank: raidTank,
    healer: raidHealer
  }
};

await fs.writeFile(path.join(dataOutputDir, "rankings-latest.json"), JSON.stringify(result, null, 2), "utf-8");
console.log("Saved structured ranking data to automation/data/rankings-latest.json");

await task.finish({ keep: [] });
console.log("Rankings fetch finished successfully.");
