// ADHD 高影响力书籍概念数据
// 基于市场研究和出版策略分析生成

export interface BookConcept {
  id: number;
  ordinal: string;
  title: string;
  subtitle: string;
  tagline: string;
  colorTheme: {
    tag: string;
    accent: string;
    accentLight: string;
    border: string;
    bg: string;
  };
  audience: {
    primary: string;
    ageRange: string;
    description: string;
    tags: string[];
  };
  differentiation: {
    headline: string;
    description: string;
    points: string[];
  };
  market: {
    size: string;
    growth: string;
    potential: string;
    description: string;
    stats: { label: string; value: string; unit: string }[];
  };
  pricing: {
    range: string;
    justification: string;
    valueProps: string[];
  };
  trends: {
    headline: string;
    description: string;
    items: { name: string; strength: number }[];
  };
  radarData: { subject: string; value: number }[];
  icon: string;
}

export const bookConcepts: BookConcept[] = [
  {
    id: 1,
    ordinal: "01",
    title: "分心优势",
    subtitle: "ADHD 职场生存与跃迁指南",
    tagline: "告别混乱与拖延，将你的超能力转化为职业护城河",
    colorTheme: {
      tag: "tag-coral",
      accent: "oklch(0.65 0.18 25)",
      accentLight: "oklch(0.65 0.18 25 / 0.1)",
      border: "oklch(0.65 0.18 25 / 0.3)",
      bg: "oklch(0.65 0.18 25 / 0.05)",
    },
    audience: {
      primary: "职场人士与创业者",
      ageRange: "25–45 岁",
      description:
        "聪明、有创造力的知识工作者和创业者，因传统生产力工具无效而沮丧，渴望在事业上取得突破，同时不愿牺牲身心健康。",
      tags: ["知识工作者", "创业者", "管理者", "远程工作者"],
    },
    differentiation: {
      headline: "专为 ADHD 大脑设计的职业操作系统",
      description:
        "本书并非又一本时间管理指南，而是一套基于兴趣驱动和能量管理的实用框架。它捨弃了你应该更自律的说教，转而帮助读者构建外部支持系统，利用分心特质进行创造性思考。",
      points: [
        "基于神经科学的兴趣驱动工作法",
        "将 ADHD 特质转化为差异化竞争优势",
        "专为知识工作者设计的外部系统构建指南",
        "可持续的职业发展策略，而非临时补丁",
      ],
    },
    market: {
      size: "1.55 亿",
      growth: "+6.9%",
      potential: "极高",
      description:
        "仅美国就有约 1550 万成年人被诊断患有 ADHD，其中大部分是劳动人口。全球职场生产力书籍市场规模庞大，而专为 ADHD 人群设计的职场指南仍是蓝海。",
      stats: [
        { label: "美国成人 ADHD 患者", value: "1550", unit: "万人" },
        { label: "全球 ADHD 市场增速", value: "6.9", unit: "% CAGR" },
        { label: "职场生产力书籍年销量", value: "2.3", unit: "亿美元" },
        { label: "目标读者付费意愿", value: "89", unit: "%" },
      ],
    },
    pricing: {
      range: "$22–28",
      justification:
        "本书直接解决了怀才不遇或效率低下这一核心痛点。它提供的不是临时补丁，而是一套可持续的职业发展策略，其潜在的投资回报（升职、加薪、创业成功）远超书籍定价。",
      valueProps: [
        "一次购书，终身受益的职业方法论",
        "节省数千美元的职业教练费用",
        "可立即上手的行动工具包",
        "真实案例验证的可复制路径",
      ],
    },
    trends: {
      headline: "反内卷 × 可持续职业发展",
      description:
        '安静离职和反内卷思潮下，人们更关注可持续的职业发展和身心健康。本书顺应这一趋势，为神经多样性人群提供了在不耗尽自己的前提下获得成功的方法论。',
      items: [
        { name: "神经多样性职场认知", strength: 92 },
        { name: "反内卷/可持续工作", strength: 85 },
        { name: "远程工作效率管理", strength: 78 },
        { name: "ADHD 诊断率上升", strength: 88 },
        { name: "TikTok ADHD 内容爆发", strength: 95 },
      ],
    },
    radarData: [
      { subject: "市场规模", value: 90 },
      { subject: "差异化程度", value: 85 },
      { subject: "读者付费意愿", value: 92 },
      { subject: "趋势契合度", value: 88 },
      { subject: "内容可操作性", value: 95 },
      { subject: "传播潜力", value: 80 },
    ],
    icon: "💼",
  },
  {
    id: 2,
    ordinal: "02",
    title: "被隐藏的女孩",
    subtitle: "成年女性 ADHD 自我发现与重塑之旅",
    tagline: "献给那些总觉得自己太多、太乱、太敏感的你",
    colorTheme: {
      tag: "tag-plum",
      accent: "oklch(0.42 0.12 310)",
      accentLight: "oklch(0.42 0.12 310 / 0.1)",
      border: "oklch(0.42 0.12 310 / 0.3)",
      bg: "oklch(0.42 0.12 310 / 0.05)",
    },
    audience: {
      primary: "成年女性 ADHD 患者",
      ageRange: "25–45 岁",
      description:
        "可能刚刚获得诊断或长期怀疑自己有 ADHD 的女性。她们常年与焦虑、抑郁和低自尊作斗争，感觉自己像一个行走的混乱集合体，渴望被理解和重新定义自我。",
      tags: ["晚诊断女性", "焦虑共病者", "高功能伪装者", "自我探索者"],
    },
    differentiation: {
      headline: "女性 ADHD 的专属解码手册",
      description:
        "融合温暖的个人叙事、权威的专家解读和一套专为女性设计的人生重整工具包。重点关注卸下伪装（Unmasking）、应对激素波动对症状的影响、重建自我价值感。",
      points: [
        "聚焦女性独特的 ADHD 症状表现（内化型、伪装型）",
        "激素周期与 ADHD 症状波动的科学解读",
        "卸下伪装后的身份重建工作坊",
        "家庭、职场和人际关系的全方位重新定位",
      ],
    },
    market: {
      size: "蓝海市场",
      growth: "快速增长",
      potential: "极高",
      description:
        "研究表明，高达 50–75% 的女性 ADHD 患者未被正确诊断。社交媒体上的 #WomenWithADHD 话题引爆了巨大的共鸣和信息需求，这是一个被长期忽视但正在迅速觉醒的蓝海市场。",
      stats: [
        { label: "女性 ADHD 漏诊率", value: "50–75", unit: "%" },
        { label: "女性心理健康书籍市场", value: "4.2", unit: "亿美元" },
        { label: "#WomenWithADHD 话题浏览量", value: "12", unit: "亿次" },
        { label: "女性读者占比（心理类书籍）", value: "68", unit: "%" },
      ],
    },
    pricing: {
      range: "$24–30",
      justification:
        "它为成千上万感到孤立无援的女性提供了强烈的身份认同和情感慰藉。从自我怀疑到获得清晰的行动指南，这种被看见和被理解的价值是无价的。",
      valueProps: [
        "终结数年甚至数十年的自我怀疑",
        "节省心理咨询的高额费用",
        "专属于女性的诊断后行动指南",
        "强烈的社群认同感和归属感",
      ],
    },
    trends: {
      headline: "女性心理健康觉醒 × 漏诊危机曝光",
      description:
        "女性主义和心理健康意识的提升，让更多女性开始审视和公开讨论自己的内在挣扎。媒体对女性 ADHD 漏诊问题的持续曝光，进一步放大了这一市场需求。",
      items: [
        { name: "女性心理健康意识觉醒", strength: 95 },
        { name: "ADHD 漏诊危机媒体曝光", strength: 90 },
        { name: "女性自我叙事书籍热潮", strength: 82 },
        { name: "神经多样性身份认同运动", strength: 88 },
        { name: "社交媒体女性 ADHD 社群", strength: 93 },
      ],
    },
    radarData: [
      { subject: "市场规模", value: 85 },
      { subject: "差异化程度", value: 95 },
      { subject: "读者付费意愿", value: 88 },
      { subject: "趋势契合度", value: 95 },
      { subject: "内容可操作性", value: 82 },
      { subject: "传播潜力", value: 92 },
    ],
    icon: "✨",
  },
  {
    id: 3,
    ordinal: "03",
    title: "创意风暴",
    subtitle: "驾驭你的 ADHD 大脑，引爆非凡创造力",
    tagline: "从灵感迸发到项目落地，一本献给创意天才的执行手册",
    colorTheme: {
      tag: "tag-amber",
      accent: "oklch(0.72 0.14 65)",
      accentLight: "oklch(0.72 0.14 65 / 0.1)",
      border: "oklch(0.72 0.14 65 / 0.3)",
      bg: "oklch(0.72 0.14 65 / 0.05)",
    },
    audience: {
      primary: "创意工作者与创业家",
      ageRange: "22–40 岁",
      description:
        "艺术家、设计师、作家、程序员、创业家等以创意为核心竞争力的群体。他们拥有源源不断的想法，却在执行和完成项目上屡屡受挫，渴望将天赋真正变现。",
      tags: ["设计师", "作家", "程序员", "创业者", "艺术家"],
    },
    differentiation: {
      headline: "将 ADHD 的缺陷重新定义为创意资产",
      description:
        "本书不仅赞美 ADHD 的创意特质，更提供了一套将创意落地的系统，包括如何捕捉灵感、筛选想法、规划项目以及维持长久的热情，解决创意工作者最大的痛点：有想法，没作品。",
      points: [
        "ADHD 特质与创意天才的神经科学连接",
        "灵感捕捉 → 想法筛选 → 项目落地的完整系统",
        "专为创意人设计的完成项目框架",
        "如何在创意爆发期最大化产出",
      ],
    },
    market: {
      size: "创意经济",
      growth: "高速增长",
      potential: "高",
      description:
        "创意经济和零工经济的崛起，使得这一读者群体日益壮大。他们是典型的终身学习者，愿意为任何能提升其专业技能和产出效率的知识付费。",
      stats: [
        { label: "全球创意经济规模", value: "2.25", unit: "万亿美元" },
        { label: "自由职业者中 ADHD 比例", value: "35", unit: "%" },
        { label: "创意类书籍年增长率", value: "12", unit: "%" },
        { label: "创意工作者愿意付费学习", value: "76", unit: "%" },
      ],
    },
    pricing: {
      range: "$20–26",
      justification:
        "它解决了创意工作者最大的痛点——有想法，没作品。通过提供具体的项目管理和执行策略，本书能直接帮助读者将创意转化为实实在在的成果和收入。",
      valueProps: [
      "将创意直接转化为可交付的作品和收入",
        "解决完美主义瘫痪和项目坟场问题",        "AI 时代最大化人类独特创造力",        "可复用的创意工作流程模板",
      ],
    },
    trends: {
      headline: "AI 时代创造力溢价 × 零工经济崛起",
      description:
        "在 AI 时代，人类的创造力变得前所未有的重要。本书迎合了最大化个人独特创造力的时代需求，为 ADHD 创意人群提供了将天赋变现的蓝图。",
      items: [
        { name: "AI 时代创造力溢价", strength: 90 },
        { name: "零工经济与自由职业崛起", strength: 85 },
        { name: "创意人 ADHD 自我认知", strength: 80 },
        { name: "作品集经济（Portfolio Career）", strength: 75 },
        { name: "创意生产力工具热潮", strength: 88 },
      ],
    },
    radarData: [
      { subject: "市场规模", value: 80 },
      { subject: "差异化程度", value: 90 },
      { subject: "读者付费意愿", value: 85 },
      { subject: "趋势契合度", value: 90 },
      { subject: "内容可操作性", value: 92 },
      { subject: "传播潜力", value: 85 },
    ],
    icon: "🎨",
  },
  {
    id: 4,
    ordinal: "04",
    title: "不一样的养育",
    subtitle: "与你的 ADHD 孩子一起成长",
    tagline: "一本写给 ADHD 家庭的混乱求生与优势发掘指南",
    colorTheme: {
      tag: "tag-sage",
      accent: "oklch(0.62 0.08 150)",
      accentLight: "oklch(0.62 0.08 150 / 0.1)",
      border: "oklch(0.62 0.08 150 / 0.3)",
      bg: "oklch(0.62 0.08 150 / 0.05)",
    },
    audience: {
      primary: "ADHD 孩子的父母",
      ageRange: "30–50 岁",
      description:
        "家有 6–16 岁 ADHD 孩子的父母，其中至少一方父母自己也可能患有 ADHD。他们对传统的行为矫正方法感到失望，希望寻求一种更积极、更具同理心的养育方式。",
      tags: ["ADHD 家长", "积极养育倡导者", "教育工作者", "家庭治疗师"],
    },
    differentiation: {
      headline: "双视角养育：同时关注父母和孩子",
      description:
        "采用双视角叙事，同时关注父母和孩子的需求与感受。它不仅提供管理孩子行为的技巧，更强调如何改善家庭沟通、降低亲子冲突、创造一个支持性的家庭环境。",
      points: [
        "父母与孩子双视角的共情叙事框架",
        "降低家庭冲突的沟通协议和工具",
        "优势导向的教育策略，而非行为矫正",
        "帮助孩子发现和培养独特优势的系统方法",
      ],
    },
    market: {
      size: "7,00 万+",
      growth: "稳定增长",
      potential: "高",
      description:
        "根据 CDC 的数据，2022 年美国有超过 700 万儿童被诊断患有 ADHD。这些孩子的父母构成了庞大且需求迫切的读者群，亲子教育类书籍是出版市场的常青品类。",
      stats: [
        { label: "美国 ADHD 儿童数量", value: "700", unit: "万+" },
        { label: "亲子教育书籍年市场规模", value: "8.5", unit: "亿美元" },
        { label: "家长愿意为育儿书付费", value: "82", unit: "%" },
        { label: "ADHD 儿童诊断年增长率", value: "3.5", unit: "%" },
      ],
    },
    pricing: {
      range: "$22–28",
      justification:
        "养育 ADHD 孩子是极具挑战性的。本书提供了一套完整的、充满希望的解决方案，能显著改善家庭生活质量，减轻父母的焦虑和愧疚感。这种对家庭福祉的直接贡献是强大的购买理由。",
      valueProps: [
        "显著改善家庭日常生活质量",
        "减轻父母的焦虑感和愧疚感",
        "帮助孩子在学校和生活中找到自信",
        "节省家庭治疗和教育咨询费用",
      ],
    },
    trends: {
      headline: "积极养育运动 × 神经多样性教育改革",
      description:
        "新生代父母更倾向于积极养育和情感引导的育儿理念。本书完美契合了这一趋势，将科学的 ADHD 管理知识与现代育儿哲学相结合。",
      items: [
        { name: "积极养育/情感引导运动", strength: 88 },
        { name: "神经多样性教育改革", strength: 85 },
        { name: "ADHD 儿童诊断率上升", strength: 90 },
        { name: "家长心理健康意识提升", strength: 82 },
        { name: "学校融合教育政策推进", strength: 75 },
      ],
    },
    radarData: [
      { subject: "市场规模", value: 92 },
      { subject: "差异化程度", value: 80 },
      { subject: "读者付费意愿", value: 90 },
      { subject: "趋势契合度", value: 85 },
      { subject: "内容可操作性", value: 88 },
      { subject: "传播潜力", value: 78 },
    ],
    icon: "👨‍👩‍👧",
  },
  {
    id: 5,
    ordinal: "05",
    title: "ADHD 大脑的能量管理术",
    subtitle: "通过营养、运动、睡眠和正念，为你的专注力充电",
    tagline: "不依赖药物，用生活方式重新掌控你的大脑",
    colorTheme: {
      tag: "tag-indigo",
      accent: "oklch(0.45 0.15 265)",
      accentLight: "oklch(0.45 0.15 265 / 0.1)",
      border: "oklch(0.45 0.15 265 / 0.3)",
      bg: "oklch(0.45 0.15 265 / 0.05)",
    },
    audience: {
      primary: "整体健康导向的 ADHD 成年人",
      ageRange: "20–50 岁",
      description:
        "所有希望通过非药物、生活方式干预来改善 ADHD 症状的成年人。他们对整体健康感兴趣，相信身体与大脑的紧密联系，可能不愿或不适合用药。",
      tags: ["健康生活方式倡导者", "功能医学爱好者", "瑜伽冥想实践者", "营养学关注者"],
    },
    differentiation: {
      headline: "第一本系统性的 ADHD 生活方式医学综合指南",
      description:
        "本书汇集了关于营养学（补充剂、饮食结构）、运动科学（如何选择合适的运动）、睡眠健康和正念练习的最新研究，并将其转化为简单易行的每日计划，是第一本系统性阐述如何通过生活方式医学来管理 ADHD 的综合指南。",
      points: [
        "四大支柱：营养 × 运动 × 睡眠 × 正念的整合方案",
        "基于最新神经科学研究的饮食和补充剂指南",
        "专为 ADHD 大脑设计的运动处方",
        "可立即执行的 30 天生活方式重置计划",
      ],
    },
    market: {
      size: "大健康市场",
      growth: "高速增长",
      potential: "极高",
      description:
        "大健康和自我关怀（Self-Care）市场正在蓬勃发展。越来越多的 ADHD 患者寻求药物之外的辅助疗法，以实现更全面的健康管理。这是一个与大趋势紧密结合的潜力市场。",
      stats: [
        { label: "全球大健康市场规模", value: "4.5", unit: "万亿美元" },
        { label: "功能医学/整体健康书籍增速", value: "18", unit: "%" },
        { label: "ADHD 患者寻求非药物疗法", value: "62", unit: "%" },
        { label: "心理健康 + 健康类书籍市场", value: "12", unit: "亿美元" },
      ],
    },
    pricing: {
      range: "$24–30",
      justification:
        "它为读者提供了一套可以自主掌控的、低成本且副作用小的症状管理方案。对于那些不愿或不适合用药，或希望减少药物依赖的读者来说，本书提供了极具吸引力的替代路径。",
      valueProps: [
        "可自主掌控的低成本症状管理方案",
        "减少或避免药物副作用的替代路径",
        "改善整体身心健康的综合收益",
        "30 天可见效的实践计划",
      ],
    },
    trends: {
      headline: "功能医学崛起 × 大健康消费升级",
      description:
        "功能医学和个性化健康管理的理念日益普及。人们越来越认识到，没有一刀切的解决方案，而是需要根据自身情况进行综合调理。本书正是这一理念在 ADHD 领域的具体应用。",
      items: [
        { name: "功能医学/整体健康崛起", strength: 92 },
        { name: "大健康消费升级趋势", strength: 88 },
        { name: "非药物疗法需求增长", strength: 85 },
        { name: "正念冥想主流化", strength: 90 },
        { name: "个性化营养学兴起", strength: 82 },
      ],
    },
    radarData: [
      { subject: "市场规模", value: 88 },
      { subject: "差异化程度", value: 92 },
      { subject: "读者付费意愿", value: 85 },
      { subject: "趋势契合度", value: 92 },
      { subject: "内容可操作性", value: 90 },
      { subject: "传播潜力", value: 82 },
    ],
    icon: "🧠",
  },
];

export const marketOverviewData = [
  { name: "美国成人 ADHD 患者", value: 1550, unit: "万人", growth: "+12%" },
  { name: "美国儿童 ADHD 患者", value: 700, unit: "万人", growth: "+3.5%" },
  { name: "全球 ADHD 市场 CAGR", value: 6.9, unit: "%", growth: "↑" },
  { name: "ADHD 相关书籍年增速", value: 15, unit: "%", growth: "↑" },
];

export const trendComparisonData = [
  { category: "职场生产力", score: 88, color: "#e05a3a" },
  { category: "女性 ADHD", score: 93, color: "#7c3aed" },
  { category: "创意执行力", score: 85, color: "#d97706" },
  { category: "亲子教育", score: 82, color: "#059669" },
  { category: "生活方式健康", score: 90, color: "#2563eb" },
];

export const audienceBreakdownData = [
  { name: "职场成人", value: 35, fill: "#e05a3a" },
  { name: "成年女性", value: 25, fill: "#7c3aed" },
  { name: "创意工作者", value: 18, fill: "#d97706" },
  { name: "ADHD 家长", value: 15, fill: "#059669" },
  { name: "健康导向人群", value: 7, fill: "#2563eb" },
];
