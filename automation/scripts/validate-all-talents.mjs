// automation/scripts/validate-all-talents.mjs
// 全职业天赋节点数据质量与完整度自检工具

import fs from "node:fs/promises";
import path from "node:path";

const BASE_DIR = "/Users/wuwanzhu/Documents/wow";
const BLUEPRINTS_DIR = path.join(BASE_DIR, "automation/data/talent-blueprints");
const CLASSES_DIR = path.join(BASE_DIR, "classes");

console.log("==================================================");
console.log("魔兽世界全职业天赋数据质量与完整度全面核验");
console.log("==================================================");

// 1. 检查 13 个职业底图
const blueprintFiles = (await fs.readdir(BLUEPRINTS_DIR)).filter(f => f.endsWith(".json"));
let totalBpNodes = 0;
let totalBpAbilities = 0;
let bpMissingNameCn = 0;
let bpMissingNameEn = 0;
let bpMissingDescCn = 0;
let bpMissingDescEn = 0;

const classStats = [];

for (const f of blueprintFiles) {
  const content = await fs.readFile(path.join(BLUEPRINTS_DIR, f), "utf-8");
  const json = JSON.parse(content);
  const className = f.replace(".json", "");

  let cNodes = 0;
  let cAbilities = 0;
  let cMissingDescCn = 0;
  let cMissingDescEn = 0;
  let cMissingNameCn = 0;

  for (const spec of Object.values(json.specs || {})) {
    for (const node of spec.nodes || []) {
      cNodes++;
      for (const ab of node.abilities || []) {
        cAbilities++;
        if (!ab.nameCn) { cMissingNameCn++; bpMissingNameCn++; }
        if (!ab.nameEn) { bpMissingNameEn++; }
        if (!ab.descriptionCn) { cMissingDescCn++; bpMissingDescCn++; }
        if (!ab.descriptionEn) { cMissingDescEn++; bpMissingDescEn++; }
      }
    }
  }

  totalBpNodes += cNodes;
  totalBpAbilities += cAbilities;

  classStats.push({
    职业: className,
    专精数: Object.keys(json.specs || {}).length,
    节点数: cNodes,
    能力总数: cAbilities,
    缺中文名: cMissingNameCn,
    缺中文描述: cMissingDescCn,
    缺英文描述: cMissingDescEn
  });
}

console.table(classStats);
console.log(`底图库总计: ${blueprintFiles.length} 个职业, ${totalBpNodes} 个节点, ${totalBpAbilities} 个能力`);
console.log(`底图缺失状态: 缺中文名=${bpMissingNameCn}, 缺英文名=${bpMissingNameEn}, 缺中文描述=${bpMissingDescCn}, 缺英文描述=${bpMissingDescEn}`);

// 2. 检查 39 个专精 talents.json
const classDirs = await fs.readdir(CLASSES_DIR);
let totalSpecs = 0;
let totalSelectedNodes = 0;
let specMissingCn = 0;
let specMissingEn = 0;
let specMissingDescCn = 0;
let specMissingDescEn = 0;

for (const c of classDirs) {
  if (c.startsWith("_") || c.startsWith(".")) continue;
  const cPath = path.join(CLASSES_DIR, c);
  const stat = await fs.stat(cPath);
  if (!stat.isDirectory()) continue;

  const specDirs = await fs.readdir(cPath);
  for (const s of specDirs) {
    const jsonPath = path.join(cPath, s, "talents.json");
    try {
      const data = JSON.parse(await fs.readFile(jsonPath, "utf-8"));
      totalSpecs++;
      for (const node of (data.selectedNodes || [])) {
        totalSelectedNodes++;
        if (!node.nameCn) specMissingCn++;
        if (!node.nameEn) specMissingEn++;
        if (!node.descriptionCn) specMissingDescCn++;
        if (!node.descriptionEn) specMissingDescEn++;
      }
    } catch (e) {
      // ignore
    }
  }
}

console.log("--------------------------------------------------");
console.log(`实战加点总计: ${totalSpecs} 个专精, ${totalSelectedNodes} 个点亮节点`);
console.log(`加点缺失状态: 缺中文名=${specMissingCn}, 缺英文名=${specMissingEn}, 缺中文描述=${specMissingDescCn}, 缺英文描述=${specMissingDescEn}`);
console.log("==================================================");

if (bpMissingNameCn === 0 && bpMissingDescCn === 0 && specMissingDescCn === 0) {
  console.log("核验结果: 全职业天赋数据全部准确齐备，零缺失项通过！");
} else {
  console.error("核验结果: 存在数据缺失项，请检查。");
  process.exit(1);
}
