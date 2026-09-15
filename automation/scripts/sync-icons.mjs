import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT_DIR = process.cwd();
const ASSETS_DIR = path.join(ROOT_DIR, 'assets');
const ICONS_DIR = path.join(ASSETS_DIR, 'icons');
const MANIFEST_PATH = path.join(ASSETS_DIR, 'manifests', 'icons.json');
const BLUEPRINTS_DIR = path.join(ROOT_DIR, 'automation', 'data', 'talent-blueprints');
const SPELL_TRANSLATIONS_PATH = path.join(ROOT_DIR, 'automation', 'data', 'spell-translations.json');
const TMP_DIR = path.join(ROOT_DIR, 'tmp', 'icon-downloads');

const CLASSES = [
  { slug: 'death-knight', blizzIcon: 'classicon_deathknight', nameCn: '死亡骑士' },
  { slug: 'demon-hunter', blizzIcon: 'classicon_demonhunter', nameCn: '恶魔猎手' },
  { slug: 'druid', blizzIcon: 'classicon_druid', nameCn: '德鲁伊' },
  { slug: 'evoker', blizzIcon: 'classicon_evoker', nameCn: '唤魔师' },
  { slug: 'hunter', blizzIcon: 'classicon_hunter', nameCn: '猎人' },
  { slug: 'mage', blizzIcon: 'classicon_mage', nameCn: '法师' },
  { slug: 'monk', blizzIcon: 'classicon_monk', nameCn: '武僧' },
  { slug: 'paladin', blizzIcon: 'classicon_paladin', nameCn: '圣骑士' },
  { slug: 'priest', blizzIcon: 'classicon_priest', nameCn: '牧师' },
  { slug: 'rogue', blizzIcon: 'classicon_rogue', nameCn: '潜行者' },
  { slug: 'shaman', blizzIcon: 'classicon_shaman', nameCn: '萨满祭司' },
  { slug: 'warlock', blizzIcon: 'classicon_warlock', nameCn: '术士' },
  { slug: 'warrior', blizzIcon: 'classicon_warrior', nameCn: '战士' }
];

const SPECS = [
  { specId: 62, slug: 'arcane', nameCn: '奥术', classSlug: 'mage', iconName: 'spell_holy_magicalsentry', role: 'dps' },
  { specId: 63, slug: 'fire', nameCn: '火焰', classSlug: 'mage', iconName: 'spell_fire_firebolt02', role: 'dps' },
  { specId: 64, slug: 'frost', nameCn: '冰霜', classSlug: 'mage', iconName: 'spell_frost_frostbolt02', role: 'dps' },
  { specId: 65, slug: 'holy', nameCn: '神圣', classSlug: 'paladin', iconName: 'spell_holy_holybolt', role: 'healer' },
  { specId: 66, slug: 'protection', nameCn: '防护', classSlug: 'paladin', iconName: 'ability_paladin_shieldofthetemplar', role: 'tank' },
  { specId: 70, slug: 'retribution', nameCn: '惩戒', classSlug: 'paladin', iconName: 'spell_holy_auraoflight', role: 'dps' },
  { specId: 71, slug: 'arms', nameCn: '武器', classSlug: 'warrior', iconName: 'ability_warrior_savageblow', role: 'dps' },
  { specId: 72, slug: 'fury', nameCn: '狂暴', classSlug: 'warrior', iconName: 'ability_warrior_innerrage', role: 'dps' },
  { specId: 73, slug: 'protection', nameCn: '防护', classSlug: 'warrior', iconName: 'ability_warrior_defensivestance', role: 'tank' },
  { specId: 102, slug: 'balance', nameCn: '平衡', classSlug: 'druid', iconName: 'spell_nature_starfall', role: 'dps' },
  { specId: 103, slug: 'feral', nameCn: '野性', classSlug: 'druid', iconName: 'ability_druid_catform', role: 'dps' },
  { specId: 104, slug: 'guardian', nameCn: '守护', classSlug: 'druid', iconName: 'ability_racial_bearform', role: 'tank' },
  { specId: 105, slug: 'restoration', nameCn: '恢复', classSlug: 'druid', iconName: 'spell_nature_healingtouch', role: 'healer' },
  { specId: 250, slug: 'blood', nameCn: '鲜血', classSlug: 'death-knight', iconName: 'spell_deathknight_bloodpresence', role: 'tank' },
  { specId: 251, slug: 'frost', nameCn: '冰霜', classSlug: 'death-knight', iconName: 'spell_deathknight_frostpresence', role: 'dps' },
  { specId: 252, slug: 'unholy', nameCn: '邪恶', classSlug: 'death-knight', iconName: 'spell_deathknight_unholypresence', role: 'dps' },
  { specId: 253, slug: 'beast-mastery', nameCn: '野兽控制', classSlug: 'hunter', iconName: 'ability_hunter_bestialdiscipline', role: 'dps' },
  { specId: 254, slug: 'marksmanship', nameCn: '射击', classSlug: 'hunter', iconName: 'ability_hunter_focusedaim', role: 'dps' },
  { specId: 255, slug: 'survival', nameCn: '生存', classSlug: 'hunter', iconName: 'ability_hunter_camouflage', role: 'dps' },
  { specId: 256, slug: 'discipline', nameCn: '戒律', classSlug: 'priest', iconName: 'spell_holy_powerwordshield', role: 'healer' },
  { specId: 257, slug: 'holy', nameCn: '神圣', classSlug: 'priest', iconName: 'spell_holy_guardianspirit', role: 'healer' },
  { specId: 258, slug: 'shadow', nameCn: '暗影', classSlug: 'priest', iconName: 'spell_shadow_shadowwordpain', role: 'dps' },
  { specId: 259, slug: 'assassination', nameCn: '刺杀', classSlug: 'rogue', iconName: 'ability_rogue_deadlybrew', role: 'dps' },
  { specId: 260, slug: 'outlaw', nameCn: '狂徒', classSlug: 'rogue', iconName: 'ability_rogue_waylay', role: 'dps' },
  { specId: 261, slug: 'subtlety', nameCn: '敏锐', classSlug: 'rogue', iconName: 'ability_stealth', role: 'dps' },
  { specId: 262, slug: 'elemental', nameCn: '元素', classSlug: 'shaman', iconName: 'spell_nature_lightning', role: 'dps' },
  { specId: 263, slug: 'enhancement', nameCn: '增强', classSlug: 'shaman', iconName: 'spell_shaman_improvedstormstrike', role: 'dps' },
  { specId: 264, slug: 'restoration', nameCn: '恢复', classSlug: 'shaman', iconName: 'spell_nature_magicimmunity', role: 'healer' },
  { specId: 265, slug: 'affliction', nameCn: '痛苦', classSlug: 'warlock', iconName: 'spell_shadow_deathcoil', role: 'dps' },
  { specId: 266, slug: 'demonology', nameCn: '恶魔学识', classSlug: 'warlock', iconName: 'spell_shadow_metamorphosis', role: 'dps' },
  { specId: 267, slug: 'destruction', nameCn: '毁灭', classSlug: 'warlock', iconName: 'spell_shadow_rainoffire', role: 'dps' },
  { specId: 268, slug: 'brewmaster', nameCn: '酒仙', classSlug: 'monk', iconName: 'spell_monk_brewmaster_spec', role: 'tank' },
  { specId: 269, slug: 'windwalker', nameCn: '踏风', classSlug: 'monk', iconName: 'spell_monk_windwalker_spec', role: 'dps' },
  { specId: 270, slug: 'mistweaver', nameCn: '织雾', classSlug: 'monk', iconName: 'spell_monk_mistweaver_spec', role: 'healer' },
  { specId: 577, slug: 'havoc', nameCn: '浩劫', classSlug: 'demon-hunter', iconName: 'ability_demonhunter_specdps', role: 'dps' },
  { specId: 581, slug: 'vengeance', nameCn: '复仇', classSlug: 'demon-hunter', iconName: 'ability_demonhunter_spectank', role: 'tank' },
  { specId: 1467, slug: 'devastation', nameCn: '湮灭', classSlug: 'evoker', iconName: 'classicon_evoker_devastation', role: 'dps' },
  { specId: 1468, slug: 'preservation', nameCn: '恩瀛', classSlug: 'evoker', iconName: 'classicon_evoker_preservation', role: 'healer' },
  { specId: 1473, slug: 'augmentation', nameCn: '增辉', classSlug: 'evoker', iconName: 'classicon_evoker_augmentation', role: 'dps' }
];

const ROLES = [
  { slug: 'tank', nameCn: '坦克', iconName: 'inv_shield_06' },
  { slug: 'healer', nameCn: '治疗', iconName: 'spell_holy_renew' },
  { slug: 'dps', nameCn: '伤害输出', iconName: 'ability_dualwield' }
];

function ensureDirs() {
  const dirs = [
    TMP_DIR,
    path.join(ICONS_DIR, 'classes'),
    path.join(ICONS_DIR, 'specs'),
    path.join(ICONS_DIR, 'roles'),
    path.join(ICONS_DIR, 'spells'),
    path.join(ICONS_DIR, 'talents', 'hero'),
    path.join(ICONS_DIR, 'items'),
    path.join(ICONS_DIR, 'avatars'),
    path.join(ICONS_DIR, 'ui'),
    path.join(ASSETS_DIR, 'manifests')
  ];
  for (const d of dirs) {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d, { recursive: true });
    }
  }
}

function categorizeIcon(iconName, isHero = false) {
  if (isHero) return 'talents/hero';
  const name = iconName.toLowerCase();
  if (name.startsWith('classicon_') || name.startsWith('ui-charactercreate-classes_')) {
    return 'classes';
  }
  if (name.startsWith('inv_') || name.startsWith('inv12_') || name.startsWith('item_')) {
    return 'items';
  }
  if (name.startsWith('achievement_') || name.startsWith('achievment_')) {
    return 'talents';
  }
  if (name.startsWith('race_') || name.startsWith('racial_') || name.startsWith('creatureportrait_')) {
    return 'avatars';
  }
  if (name.startsWith('ui_') || name.startsWith('expansionicon_') || name.startsWith('crest_')) {
    return 'ui';
  }
  return 'spells';
}

async function downloadToWebp(iconName, targetRelPath, customCdnUrl = null) {
  const targetAbsPath = path.join(ASSETS_DIR, targetRelPath);
  if (fs.existsSync(targetAbsPath) && fs.statSync(targetAbsPath).size > 100) {
    return { status: 'skipped', path: targetRelPath };
  }

  const tmpDownloadPath = path.join(TMP_DIR, `${iconName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${Date.now()}_tmp`);
  let downloadedBuffer = null;
  let sourceUrl = '';

  if (customCdnUrl) {
    sourceUrl = customCdnUrl;
    try {
      const res = await fetch(sourceUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh)' } });
      if (res.ok) {
        downloadedBuffer = Buffer.from(await res.arrayBuffer());
      }
    } catch {}
  } else {
    const urls = [
      `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`,
      `https://render.worldofwarcraft.com/us/icons/56/${iconName}.jpg`
    ];
    for (const url of urls) {
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh)' } });
        if (res.ok) {
          downloadedBuffer = Buffer.from(await res.arrayBuffer());
          sourceUrl = url;
          break;
        }
      } catch {}
    }
  }

  if (!downloadedBuffer || downloadedBuffer.length < 50) {
    return { status: 'failed', icon: iconName, error: 'Not found on CDNs' };
  }

  fs.writeFileSync(tmpDownloadPath, downloadedBuffer);

  try {
    const isPng = sourceUrl.endsWith('.png');
    if (isPng) {
      execSync(`/opt/homebrew/bin/cwebp -quiet -q 90 "${tmpDownloadPath}" -o "${targetAbsPath}"`);
    } else {
      execSync(`/opt/homebrew/bin/cwebp -quiet -q 85 "${tmpDownloadPath}" -o "${targetAbsPath}"`);
    }
    if (fs.existsSync(tmpDownloadPath)) fs.unlinkSync(tmpDownloadPath);
    return { status: 'downloaded', path: targetRelPath, size: fs.statSync(targetAbsPath).size };
  } catch (err) {
    if (fs.existsSync(tmpDownloadPath)) fs.unlinkSync(tmpDownloadPath);
    return { status: 'failed', icon: iconName, error: err.message };
  }
}

async function runPool(items, limit, workerFn) {
  const results = [];
  let index = 0;
  const executing = [];

  for (const item of items) {
    const p = Promise.resolve().then(() => workerFn(item, index++));
    results.push(p);

    if (limit <= items.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(results);
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const maxLimit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

  console.log('Starting World of Warcraft icon sync...');
  ensureDirs();

  // 1. 读取 spell-translations.json
  const spellTranslations = JSON.parse(fs.readFileSync(SPELL_TRANSLATIONS_PATH, 'utf8'));
  const iconMetaMap = new Map();

  for (const [sId, data] of Object.entries(spellTranslations)) {
    if (!data.icon) continue;
    const key = data.icon.toLowerCase().trim();
    if (!iconMetaMap.has(key)) {
      iconMetaMap.set(key, {
        iconName: key,
        nameCn: data.nameCn || '',
        nameEn: data.nameEn || '',
        spellIds: [Number(sId)],
        isHero: false
      });
    } else {
      const existing = iconMetaMap.get(key);
      if (!existing.spellIds.includes(Number(sId))) {
        existing.spellIds.push(Number(sId));
      }
      if (!existing.nameCn && data.nameCn) existing.nameCn = data.nameCn;
      if (!existing.nameEn && data.nameEn) existing.nameEn = data.nameEn;
    }
  }

  // 2. 读取全职业蓝图
  if (fs.existsSync(BLUEPRINTS_DIR)) {
    const bpFiles = fs.readdirSync(BLUEPRINTS_DIR).filter(f => f.endsWith('.json'));
    for (const file of bpFiles) {
      const bpData = JSON.parse(fs.readFileSync(path.join(BLUEPRINTS_DIR, file), 'utf8'));
      const str = JSON.stringify(bpData);
      const matches = str.matchAll(/"icon":\s*"([^"]+)"/g);
      for (const m of matches) {
        const val = m[1].trim();
        if (!val) continue;
        if (val.startsWith('http')) {
          const heroMatch = val.match(/hero\/(\d+)_full\.png/);
          const heroId = heroMatch ? heroMatch[1] : `hero_${Date.now()}`;
          const key = `hero_${heroId}`;
          if (!iconMetaMap.has(key)) {
            iconMetaMap.set(key, {
              iconName: key,
              nameCn: `英雄天赋底图 (${heroId})`,
              nameEn: `Hero Talent Art (${heroId})`,
              customCdnUrl: val,
              isHero: true,
              spellIds: []
            });
          }
        } else {
          const key = val.toLowerCase();
          if (!iconMetaMap.has(key)) {
            iconMetaMap.set(key, {
              iconName: key,
              nameCn: '',
              nameEn: '',
              spellIds: [],
              isHero: false
            });
          }
        }
      }
    }
  }

  // 3. 注入职业原生图标
  for (const c of CLASSES) {
    const key = c.blizzIcon.toLowerCase();
    if (!iconMetaMap.has(key)) {
      iconMetaMap.set(key, {
        iconName: key,
        nameCn: `${c.nameCn}职业图标`,
        nameEn: `${c.slug} class icon`,
        spellIds: [],
        isHero: false
      });
    }
  }

  // 4. 注入专精图标
  for (const s of SPECS) {
    const key = s.iconName.toLowerCase();
    if (!iconMetaMap.has(key)) {
      iconMetaMap.set(key, {
        iconName: key,
        nameCn: `${s.classSlug} ${s.nameCn}专精图标`,
        nameEn: `${s.classSlug} ${s.slug} spec icon`,
        spellIds: [],
        isHero: false
      });
    }
  }

  // 5. 注入职责图标
  for (const r of ROLES) {
    const key = r.iconName.toLowerCase();
    if (!iconMetaMap.has(key)) {
      iconMetaMap.set(key, {
        iconName: key,
        nameCn: r.nameCn,
        nameEn: r.slug,
        spellIds: [],
        isHero: false
      });
    }
  }

  console.log(`Aggregated ${iconMetaMap.size} unique icon targets across full talent trees and spells.`);

  // 6. 构造下载清单与目标路径
  const downloadQueue = [];
  const manifestItems = [];

  for (const [key, meta] of iconMetaMap.entries()) {
    const cat = categorizeIcon(key, meta.isHero);
    const filename = `${key}.webp`;
    const relPath = path.join('icons', cat, filename);

    manifestItems.push({
      id: key,
      filename,
      path: relPath,
      category: cat.split('/')[0],
      subCategory: cat.includes('/') ? cat.split('/')[1] : null,
      nameCn: meta.nameCn,
      nameEn: meta.nameEn,
      spellIds: meta.spellIds,
      cdnFallbackUrl: meta.customCdnUrl || `https://wow.zamimg.com/images/wow/icons/large/${key}.jpg`
    });

    downloadQueue.push({
      iconName: key,
      relPath,
      customCdnUrl: meta.customCdnUrl || null
    });
  }

  const activeQueue = downloadQueue.slice(0, maxLimit);
  console.log(`Processing ${activeQueue.length} icons (Concurrency limit: 16)...`);

  if (!isDryRun) {
    let completed = 0;
    let failedCount = 0;
    let skippedCount = 0;
    let downloadedCount = 0;

    await runPool(activeQueue, 16, async (task) => {
      const res = await downloadToWebp(task.iconName, task.relPath, task.customCdnUrl);
      completed++;
      if (res.status === 'downloaded') downloadedCount++;
      else if (res.status === 'skipped') skippedCount++;
      else failedCount++;

      if (completed % 150 === 0 || completed === activeQueue.length) {
        console.log(`Progress: ${completed}/${activeQueue.length} (New: ${downloadedCount}, Exists: ${skippedCount}, Failed: ${failedCount})`);
      }
    });

    // 7. 生成快捷映射文件 (Classes 别名, Specs 别名, Roles 别名)
    const classesDir = path.join(ICONS_DIR, 'classes');
    for (const c of CLASSES) {
      const src = path.join(classesDir, `${c.blizzIcon}.webp`);
      const dest = path.join(classesDir, `${c.slug}.webp`);
      if (fs.existsSync(src) && !fs.existsSync(dest)) {
        try { fs.copyFileSync(src, dest); } catch {}
      }
    }

    const specsDir = path.join(ICONS_DIR, 'specs');
    for (const s of SPECS) {
      const possibleSrcs = [
        path.join(ASSETS_DIR, 'icons', 'spells', `${s.iconName}.webp`),
        path.join(ASSETS_DIR, 'icons', 'classes', `${s.iconName}.webp`),
        path.join(ASSETS_DIR, 'icons', 'talents', `${s.iconName}.webp`)
      ];
      const src = possibleSrcs.find(p => fs.existsSync(p));
      const dest = path.join(specsDir, `${s.classSlug}-${s.slug}.webp`);
      if (src && !fs.existsSync(dest)) {
        try { fs.copyFileSync(src, dest); } catch {}
      }
    }

    const rolesDir = path.join(ICONS_DIR, 'roles');
    for (const r of ROLES) {
      const possibleSrcs = [
        path.join(ASSETS_DIR, 'icons', 'items', `${r.iconName}.webp`),
        path.join(ASSETS_DIR, 'icons', 'spells', `${r.iconName}.webp`),
        path.join(ASSETS_DIR, 'icons', 'roles', `${r.iconName}.webp`)
      ];
      const src = possibleSrcs.find(p => fs.existsSync(p));
      const dest = path.join(rolesDir, `${r.slug}.webp`);
      if (src && !fs.existsSync(dest)) {
        try { fs.copyFileSync(src, dest); } catch {}
      }
    }
  }

  // 8. 构造实体映射表 (Entities)
  const entities = {
    classes: CLASSES.map(c => ({
      slug: c.slug,
      nameCn: c.nameCn,
      officialIcon: c.blizzIcon,
      path: `icons/classes/${c.slug}.webp`,
      officialPath: `icons/classes/${c.blizzIcon}.webp`
    })),
    specs: SPECS.map(s => ({
      specId: s.specId,
      slug: s.slug,
      nameCn: s.nameCn,
      classSlug: s.classSlug,
      role: s.role,
      officialIcon: s.iconName,
      path: `icons/specs/${s.classSlug}-${s.slug}.webp`,
      sourcePath: `icons/spells/${s.iconName}.webp`
    })),
    roles: ROLES.map(r => ({
      slug: r.slug,
      nameCn: r.nameCn,
      officialIcon: r.iconName,
      path: `icons/roles/${r.slug}.webp`
    }))
  };

  // 9. 保存 manifests/icons.json
  const manifestOutput = {
    version: '1.0.0',
    gameVersion: '12.1.0',
    generatedAt: new Date().toISOString(),
    totalIcons: manifestItems.length,
    entities,
    categories: {
      classes: manifestItems.filter(i => i.category === 'classes').length,
      roles: manifestItems.filter(i => i.category === 'roles').length,
      spells: manifestItems.filter(i => i.category === 'spells').length,
      talents: manifestItems.filter(i => i.category === 'talents').length,
      items: manifestItems.filter(i => i.category === 'items').length,
      avatars: manifestItems.filter(i => i.category === 'avatars').length,
      ui: manifestItems.filter(i => i.category === 'ui').length
    },
    icons: manifestItems
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifestOutput, null, 2), 'utf8');
  console.log(`Manifest saved successfully to ${MANIFEST_PATH}`);
  console.log('Category breakdown:', manifestOutput.categories);
}

main().catch(err => {
  console.error('Fatal error during icon sync:', err);
  process.exit(1);
});
