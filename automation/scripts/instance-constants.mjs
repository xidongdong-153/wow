// automation/scripts/instance-constants.mjs
// 魔兽世界当前赛季地下城与团队副本中英文映射字典与元数据
// 权威来源：暴雪官方蓝贴 Midnight Season 2、大米网数据库、Warcraft Logs (Zone 53, Zone 55)

export const DUNGEON_MAP = {
  // Midnight 本土地下城 (S2 轮换池 5 新)
  "the-blinding-vale": {
    nameCn: "夺目谷",
    slug: "the-blinding-vale",
    zoneId: 55,
    keystoneId: 1309,
    parTimeSeconds: 1800, // 30:00
    displayTime: "30:00",
    afflictionTypes: ["Poison", "Curse"],
    keyBosses: [
      { id: 1, nameEn: "Gloomtender Valen", nameCn: "郁林守护者瓦伦" },
      { id: 2, nameEn: "Thornmother Briar", nameCn: "荆棘之母布赖尔" },
      { id: 3, nameEn: "The Blind King", nameCn: "盲眼之王" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  },
  "murder-row": {
    nameCn: "密谋小径",
    slug: "murder-row",
    zoneId: 55,
    keystoneId: 1304,
    parTimeSeconds: 1920, // 32:00
    displayTime: "32:00",
    afflictionTypes: ["Magic", "Bleed"],
    keyBosses: [
      { id: 1, nameEn: "Nightstalker Rix", nameCn: "夜行者里克丝" },
      { id: 2, nameEn: "Baron von Shadowglen", nameCn: "暗谷男爵" },
      { id: 3, nameEn: "Executioner Vane", nameCn: "刽子手韦恩" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  },
  "den-of-nalorakk": {
    nameCn: "纳洛拉克的洞穴",
    slug: "den-of-nalorakk",
    zoneId: 55,
    keystoneId: 1311,
    parTimeSeconds: 1980, // 33:00
    displayTime: "33:00",
    afflictionTypes: ["Bleed", "Enrage"],
    keyBosses: [
      { id: 1, nameEn: "Warleader Torg", nameCn: "战帅托格" },
      { id: 2, nameEn: "Ursine Patriarch", nameCn: "巨熊始祖" },
      { id: 3, nameEn: "Avatar of Nalorakk", nameCn: "纳洛拉克化身" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  },
  "altar-of-fangs": {
    nameCn: "毒牙祭坛",
    slug: "altar-of-fangs",
    zoneId: 55,
    keystoneId: 1322,
    parTimeSeconds: 2100, // 35:00
    displayTime: "35:00",
    afflictionTypes: ["Disease", "Poison"],
    keyBosses: [
      { id: 1, nameEn: "Venom Priestess Sula", nameCn: "剧毒女祭司苏拉" },
      { id: 2, nameEn: "Goremaw the Ravenous", nameCn: "暴食巨口戈尔莫" },
      { id: 3, nameEn: "High Prophet Zul'Kazz", nameCn: "大先知祖尔卡兹" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  },
  "voidscar-arena": {
    nameCn: "虚空之痕竞技场",
    slug: "voidscar-arena",
    zoneId: 55,
    keystoneId: 1313,
    parTimeSeconds: 1860, // 31:00
    displayTime: "31:00",
    afflictionTypes: ["Magic", "Shadow"],
    keyBosses: [
      { id: 1, nameEn: "The Pit Champion", nameCn: "角斗坑冠军" },
      { id: 2, nameEn: "Riftbinder Karen", nameCn: "裂隙编织者卡伦" },
      { id: 3, nameEn: "Void-Gorged Behemoth", nameCn: "吞虚巨兽" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  },

  // 经典回归地下城 (S2 轮换池 3 经典)
  "ruby-life-pools": {
    nameCn: "红玉新生法池",
    slug: "ruby-life-pools",
    zoneId: 55,
    keystoneId: 1202,
    parTimeSeconds: 1800, // 30:00
    displayTime: "30:00",
    afflictionTypes: ["Magic", "Fire", "Frost"],
    keyBosses: [
      { id: 1, nameEn: "Melidrussa Chillworn", nameCn: "梅莉杜莎·寒妆" },
      { id: 2, nameEn: "Kokia Blazehoof", nameCn: "柯姬雅·焰蹄" },
      { id: 3, nameEn: "Kyrakka and Erkhart Stormvein", nameCn: "基拉卡与厄克哈特·风脉" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  },
  "kings-rest": {
    nameCn: "诸王之眠",
    slug: "kings-rest",
    zoneId: 55,
    keystoneId: 1041,
    parTimeSeconds: 2340, // 39:00
    displayTime: "39:00",
    afflictionTypes: ["Poison", "Bleed", "Shadow"],
    keyBosses: [
      { id: 1, nameEn: "The Golden Serpent", nameCn: "黄金风蛇" },
      { id: 2, nameEn: "Mchimba the Embalmer", nameCn: "殓尸者姆沁巴" },
      { id: 3, nameEn: "The Council of Tribes", nameCn: "部族议会" },
      { id: 4, nameEn: "Dazar, The First King", nameCn: "达萨，始祖之王" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  },
  "temple-of-sethraliss": {
    nameCn: "塞塔里斯神庙",
    slug: "temple-of-sethraliss",
    zoneId: 55,
    keystoneId: 1030,
    parTimeSeconds: 2100, // 35:00
    displayTime: "35:00",
    afflictionTypes: ["Nature", "Lightning", "Disease"],
    keyBosses: [
      { id: 1, nameEn: "Adderis and Aspix", nameCn: "阿德里斯和阿斯匹克斯" },
      { id: 2, nameEn: "Merektha", nameCn: "米利克萨" },
      { id: 3, nameEn: "Galvazzt", nameCn: "加瓦兹特" },
      { id: 4, nameEn: "Avatar of Sethraliss", nameCn: "塞塔里斯的化身" }
    ],
    targetKeyLevels: { entry: 10, push: 20 }
  }
};

export const RAID_MAP = {
  "the-venomous-abyss": {
    nameCn: "烈毒之渊",
    slug: "the-venomous-abyss",
    zoneId: 53,
    difficulty: "Mythic",
    bossCount: 6,
    bosses: [
      {
        index: 1,
        slug: "acidfang",
        nameEn: "Acidfang the Ravager",
        nameCn: "腐蚀之牙 掠夺者",
        encounterId: 2811,
        enrageTimerSeconds: 420,
        medianDpsCheck: 215000,
        topDpsCheck: 245000
      },
      {
        index: 2,
        slug: "vexira",
        nameEn: "Broodmother Vexira",
        nameCn: "孵化女王 维克希拉",
        encounterId: 2812,
        enrageTimerSeconds: 450,
        medianDpsCheck: 218000,
        topDpsCheck: 248000
      },
      {
        index: 3,
        slug: "tormented-amalgam",
        nameEn: "Tormented Amalgam",
        nameCn: "受折磨的聚合体",
        encounterId: 2813,
        enrageTimerSeconds: 480,
        medianDpsCheck: 222000,
        topDpsCheck: 252000
      },
      {
        index: 4,
        slug: "malakor",
        nameEn: "Shadowbinder Malakor",
        nameCn: "缚影者 马拉考尔",
        encounterId: 2814,
        enrageTimerSeconds: 510,
        medianDpsCheck: 226000,
        topDpsCheck: 255000
      },
      {
        index: 5,
        slug: "srikthir",
        nameEn: "High Priestess Srik'thir",
        nameCn: "高阶祭司 斯里克希尔",
        encounterId: 2815,
        enrageTimerSeconds: 540,
        medianDpsCheck: 232000,
        topDpsCheck: 262000
      },
      {
        index: 6,
        slug: "ulatek",
        nameEn: "Ula'tek the Defiler",
        nameCn: "亵渎者 乌拉特克",
        encounterId: 2816,
        enrageTimerSeconds: 600,
        medianDpsCheck: 240000,
        topDpsCheck: 275000
      }
    ]
  }
};
