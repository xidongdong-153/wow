// automation/scripts/spec-constants.mjs
// 魔兽世界全职业与专精中英文映射字典与元数据

export const SPEC_MAP = {
  // 死亡骑士 Death Knight
  "unholy-death-knight": { nameCn: "邪恶死亡骑士", specCn: "邪DK", classCn: "死亡骑士", role: "dps", type: "melee", classSlug: "death-knight", specSlug: "unholy" },
  "frost-death-knight": { nameCn: "冰霜死亡骑士", specCn: "冰DK", classCn: "死亡骑士", role: "dps", type: "melee", classSlug: "death-knight", specSlug: "frost" },
  "blood-death-knight": { nameCn: "鲜血死亡骑士", specCn: "血DK", classCn: "死亡骑士", role: "tank", type: "tank", classSlug: "death-knight", specSlug: "blood" },

  // 圣骑士 Paladin
  "retribution-paladin": { nameCn: "惩戒圣骑士", specCn: "惩戒骑", classCn: "圣骑士", role: "dps", type: "melee", classSlug: "paladin", specSlug: "retribution" },
  "protection-paladin": { nameCn: "防护圣骑士", specCn: "防骑", classCn: "圣骑士", role: "tank", type: "tank", classSlug: "paladin", specSlug: "protection" },
  "holy-paladin": { nameCn: "神圣圣骑士", specCn: "奶骑", classCn: "圣骑士", role: "healer", type: "healer", classSlug: "paladin", specSlug: "holy" },

  // 战士 Warrior
  "arms-warrior": { nameCn: "武器战士", specCn: "武器战", classCn: "战士", role: "dps", type: "melee", classSlug: "warrior", specSlug: "arms" },
  "fury-warrior": { nameCn: "狂暴战士", specCn: "狂暴战", classCn: "战士", role: "dps", type: "melee", classSlug: "warrior", specSlug: "fury" },
  "protection-warrior": { nameCn: "防护战士", specCn: "防战", classCn: "战士", role: "tank", type: "tank", classSlug: "warrior", specSlug: "protection" },

  // 潜行者 Rogue
  "assassination-rogue": { nameCn: "奇袭潜行者", specCn: "奇袭贼", classCn: "潜行者", role: "dps", type: "melee", classSlug: "rogue", specSlug: "assassination" },
  "outlaw-rogue": { nameCn: "狂徒潜行者", specCn: "狂徒贼", classCn: "潜行者", role: "dps", type: "melee", classSlug: "rogue", specSlug: "outlaw" },
  "subtlety-rogue": { nameCn: "敏锐潜行者", specCn: "敏锐贼", classCn: "潜行者", role: "dps", type: "melee", classSlug: "rogue", specSlug: "subtlety" },

  // 法师 Mage
  "arcane-mage": { nameCn: "奥术法师", specCn: "奥法", classCn: "法师", role: "dps", type: "ranged", classSlug: "mage", specSlug: "arcane" },
  "fire-mage": { nameCn: "火焰法师", specCn: "火法", classCn: "法师", role: "dps", type: "ranged", classSlug: "mage", specSlug: "fire" },
  "frost-mage": { nameCn: "冰霜法师", specCn: "冰法", classCn: "法师", role: "dps", type: "ranged", classSlug: "mage", specSlug: "frost" },

  // 萨满祭司 Shaman
  "elemental-shaman": { nameCn: "元素萨满祭司", specCn: "元素萨", classCn: "萨满祭司", role: "dps", type: "ranged", classSlug: "shaman", specSlug: "elemental" },
  "enhancement-shaman": { nameCn: "增强萨满祭司", specCn: "增强萨", classCn: "萨满祭司", role: "dps", type: "melee", classSlug: "shaman", specSlug: "enhancement" },
  "restoration-shaman": { nameCn: "恢复萨满祭司", specCn: "奶萨", classCn: "萨满祭司", role: "healer", type: "healer", classSlug: "shaman", specSlug: "restoration" },

  // 德鲁伊 Druid
  "balance-druid": { nameCn: "平衡德鲁伊", specCn: "鸟德", classCn: "德鲁伊", role: "dps", type: "ranged", classSlug: "druid", specSlug: "balance" },
  "feral-druid": { nameCn: "野性德鲁伊", specCn: "野德", classCn: "德鲁伊", role: "dps", type: "melee", classSlug: "druid", specSlug: "feral" },
  "guardian-druid": { nameCn: "守护德鲁伊", specCn: "熊德", classCn: "德鲁伊", role: "tank", type: "tank", classSlug: "druid", specSlug: "guardian" },
  "restoration-druid": { nameCn: "恢复德鲁伊", specCn: "奶德", classCn: "德鲁伊", role: "healer", type: "healer", classSlug: "druid", specSlug: "restoration" },

  // 术士 Warlock
  "demonology-warlock": { nameCn: "恶魔学识术士", specCn: "恶魔术", classCn: "术士", role: "dps", type: "ranged", classSlug: "warlock", specSlug: "demonology" },
  "destruction-warlock": { nameCn: "毁灭术士", specCn: "毁灭术", classCn: "术士", role: "dps", type: "ranged", classSlug: "warlock", specSlug: "destruction" },
  "affliction-warlock": { nameCn: "痛苦术士", specCn: "痛苦术", classCn: "术士", role: "dps", type: "ranged", classSlug: "warlock", specSlug: "affliction" },

  // 猎人 Hunter
  "beast-mastery-hunter": { nameCn: "野兽控制猎人", specCn: "兽王猎", classCn: "猎人", role: "dps", type: "ranged", classSlug: "hunter", specSlug: "beast-mastery" },
  "marksmanship-hunter": { nameCn: "射击猎人", specCn: "射击猎", classCn: "猎人", role: "dps", type: "ranged", classSlug: "hunter", specSlug: "marksmanship" },
  "survival-hunter": { nameCn: "生存猎人", specCn: "生存猎", classCn: "猎人", role: "dps", type: "melee", classSlug: "hunter", specSlug: "survival" },

  // 武僧 Monk
  "windwalker-monk": { nameCn: "踏风武僧", specCn: "踏风", classCn: "武僧", role: "dps", type: "melee", classSlug: "monk", specSlug: "windwalker" },
  "brewmaster-monk": { nameCn: "酒仙武僧", specCn: "酒仙", classCn: "武僧", role: "tank", type: "tank", classSlug: "monk", specSlug: "brewmaster" },
  "mistweaver-monk": { nameCn: "织雾武僧", specCn: "织雾", classCn: "武僧", role: "healer", type: "healer", classSlug: "monk", specSlug: "mistweaver" },

  // 牧师 Priest
  "shadow-priest": { nameCn: "暗影牧师", specCn: "暗牧", classCn: "牧师", role: "dps", type: "ranged", classSlug: "priest", specSlug: "shadow" },
  "holy-priest": { nameCn: "神圣牧师", specCn: "神牧", classCn: "牧师", role: "healer", type: "healer", classSlug: "priest", specSlug: "holy" },
  "discipline-priest": { nameCn: "戒律牧师", specCn: "戒律牧", classCn: "牧师", role: "healer", type: "healer", classSlug: "priest", specSlug: "discipline" },

  // 恶魔猎手 Demon Hunter
  "havoc-demon-hunter": { nameCn: "浩劫恶魔猎手", specCn: "浩劫", classCn: "恶魔猎手", role: "dps", type: "melee", classSlug: "demon-hunter", specSlug: "havoc" },
  "vengeance-demon-hunter": { nameCn: "复仇恶魔猎手", specCn: "复仇", classCn: "恶魔猎手", role: "tank", type: "tank", classSlug: "demon-hunter", specSlug: "vengeance" },
  "devourer-demon-hunter": { nameCn: "噬灭恶魔猎手", specCn: "噬灭", classCn: "恶魔猎手", role: "dps", type: "melee", classSlug: "demon-hunter", specSlug: "devourer" },

  // 唤魔师 Evoker
  "devastation-evoker": { nameCn: "湮灭唤魔师", specCn: "湮灭龙", classCn: "唤魔师", role: "dps", type: "ranged", classSlug: "evoker", specSlug: "devastation" },
  "augmentation-evoker": { nameCn: "增辉唤魔师", specCn: "增辉龙", classCn: "唤魔师", role: "dps", type: "ranged", classSlug: "evoker", specSlug: "augmentation" },
  "preservation-evoker": { nameCn: "恩护唤魔师", specCn: "奶龙", classCn: "唤魔师", role: "healer", type: "healer", classSlug: "evoker", specSlug: "preservation" }
};
