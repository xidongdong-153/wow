// automation/scripts/hero-talent-constants.mjs
// 魔兽世界国服官方英雄天赋中英文标准对照表

export const HERO_TALENT_MAP = {
  // 战士 Warrior
  "SLAYER": "屠戮者",
  "COLOSSUS": "巨神",
  "MOUNTAIN THANE": "山丘领主",

  // 圣骑士 Paladin
  "HERALD OF THE SUN": "太阳先锋",
  "TEMPLAR": "圣殿骑士",
  "LIGHTSMITH": "铸光者",

  // 死亡骑士 Death Knight
  "SAN'LAYN": "萨莱茵",
  "RIDER OF THE APOCALYPSE": "天启骑士",
  "DEATHBRINGER": "死亡使者",

  // 猎人 Hunter
  "DARK RANGER": "黑暗游侠",
  "PACK LEADER": "兽群领袖",
  "SENTINEL": "哨兵",

  // 恶魔猎手 Demon Hunter
  "ALDRACHI REAVER": "奥达奇收割者",
  "FEL-SCARRED": "邪痕狂徒",

  // 德鲁伊 Druid
  "ELUNE'S CHOSEN": "艾露恩之选",
  "KEEPER OF THE GROVE": "丛林守护者",
  "WILDSTALKER": "荒野追猎者",
  "DRUID OF THE CLAW": "利爪德鲁伊",

  // 法师 Mage
  "SPELLSLINGER": "魔导士",
  "SUNFURY": "日怒",
  "FROSTFIRE": "霜火",

  // 武僧 Monk
  "CONDUIT OF THE CELESTIALS": "天神御尊",
  "MASTER OF HARMONY": "祥和大师",
  "SHADO-PAN": "影踪派",

  // 牧师 Priest
  "ARCHON": "执政官",
  "ORACLE": "神谕者",
  "VOIDWEAVER": "虚空编织者",

  // 潜行者 Rogue
  "DEATHSTALKER": "死亡行者",
  "FATEBOUND": "命运宿敌",
  "TRICKSTER": "欺诈者",

  // 萨满祭司 Shaman
  "STORMBRINGER": "风暴使者",
  "FARSEER": "先知",
  "TOTEMIC": "图腾巨擘",

  // 术士 Warlock
  "DIABOLIST": "恶魔修习者",
  "HELLCALLER": "唤魔者",
  "SOUL HARVESTER": "灵魂收割者",

  // 唤魔师 Evoker
  "CHRONOWARDEN": "时空守卫",
  "FLAMESHAPER": "塑焰者",
  "SCALECOMMANDER": "鳞长"
};

export function getHeroTalentCn(nameEn) {
  if (!nameEn) return "通用加点";
  const clean = nameEn.toUpperCase().trim();
  return HERO_TALENT_MAP[clean] || nameEn;
}
