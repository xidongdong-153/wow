// automation/scripts/fetch-spec-data.mjs
// 使用方法：ego-browser nodejs < automation/scripts/fetch-spec-data.mjs

const targetSpec = process.env.WOW_SPEC || "unholy";
const targetClass = process.env.WOW_CLASS || "death-knight";

console.log(`Starting data fetch for ${targetSpec} ${targetClass}...`);

const task = await taskSpace("spec-data-fetch");
const page = task.page("p1");

const overviewUrl = `https://www.archon.gg/wow/builds/${targetSpec}/${targetClass}/mythic-plus/overview/10/all-dungeons/this-week`;
await page.goto(overviewUrl);
await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(2000);

let title = await page.title();
if (title.includes("Human Verification") || title.includes("One Quick Check")) {
  console.log("Passing human challenge...");
  await page.click("loc=role:button[name='I am a human and not a bot']").catch(() => {});
  await page.waitForLoadState("load", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(3000);
}

const statsAndBuild = await page.evaluate(() => {
  const statText = Array.from(document.querySelectorAll('div, section')).find(el => el.innerText && el.innerText.includes('Stats'))?.innerText || "";
  const heroText = Array.from(document.querySelectorAll('div, section')).find(el => el.innerText && el.innerText.includes('Hero Talents'))?.innerText || "";
  return { statText: statText.slice(0, 1000), heroText: heroText.slice(0, 1000) };
});

// 可选截图落盘
const saveShot = process.env.SAVE_SCREENSHOT === "1";
if (saveShot) {
  const targetDir = `/Users/wuwanzhu/Documents/wow/classes/${targetClass}/${targetSpec}/assets`;
  await import("node:fs/promises").then(fs => fs.mkdir(targetDir, { recursive: true }));
  const shotPath = `${targetDir}/overview.png`;
  await page.screenshot({ path: shotPath });
  console.log(`Screenshot saved to: ${shotPath}`);
}

console.log("Fetched data:", JSON.stringify(statsAndBuild, null, 2));

await task.finish({ keep: [] });
console.log("Fetch task completed.");
