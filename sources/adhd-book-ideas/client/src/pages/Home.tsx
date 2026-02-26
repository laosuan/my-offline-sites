/**
 * ADHD 高影响力书籍创意生成器 — 主页面
 * 设计风格：编辑设计 × 斯堪的纳维亚极简主义
 * 色彩：奶油白底 + 深墨色文字 + 珊瑚红 + 靛蓝强调
 * 字体：Playfair Display (标题) + DM Sans (正文) + DM Mono (数字)
 */

import { useState, useEffect, useRef } from "react";
import { bookConcepts, trendComparisonData, audienceBreakdownData } from "@/lib/bookData";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const HERO_BG = "https://private-us-east-1.manuscdn.com/sessionFile/35Szd5nDUntbIjy2cZcPRz/sandbox/rMd77XsW1uhQyRMxxL3VYh-img-1_1772092604000_na1fn_YWRoZC1oZXJvLWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvMzVTemQ1bkRVbnRiSWp5MmNaY1BSei9zYW5kYm94L3JNZDc3WHNXMXVoUXlSTXh4TDNWWWgtaW1nLTFfMTc3MjA5MjYwNDAwMF9uYTFmbl9ZV1JvWkMxb1pYSnZMV0puLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=EVpuKg16n1J1S9EGFNnXUHbY7V6919bI60uXlNQVPBJtOHGZVQtCTYm-Gk2wdvKiEH3cBS~U947HDizkjb7keamrNWEt7L0FVdoBUqgpoJe~p~an5~8umyXZ-X6-70L28O~pR2s6gJtdTjU9lj5Oq-93y0Rq7uiRDNh5VmYrJIc5jUR3T7vxckyodZQQdzLJ0zBdncDDkKgUF2MnMgj4PHpY6D0MZ7n9hSDhk37Gy-5225XUO59fgaipxS572ifMnsTcLTN42FyGDQhFworUqlwMybQajFQllVNmotqfCAO3JX3RTVFj2C1mjK57HkoTRLoEcVVc0ZJnbsKAdhpCig__";

// 使用 IntersectionObserver 实现滚动动画
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// 计数动画 Hook
function useCountUp(target: number, duration = 1200, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, inView]);
  return count;
}

// 书籍封面模拟组件
function BookCover({ book, size = "md" }: { book: typeof bookConcepts[0]; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-20 h-28",
    md: "w-28 h-40",
    lg: "w-36 h-52"
  };
  const bgColors = [
    "from-rose-800 to-rose-600",
    "from-violet-900 to-violet-700",
    "from-amber-700 to-amber-500",
    "from-emerald-800 to-emerald-600",
    "from-blue-900 to-blue-700",
  ];
  return (
    <div className={`${sizeClasses[size]} relative rounded-sm shadow-xl overflow-hidden flex-shrink-0`}
      style={{ boxShadow: "4px 4px 12px rgba(0,0,0,0.3), inset -2px 0 4px rgba(0,0,0,0.2)" }}>
      <div className={`absolute inset-0 bg-gradient-to-br ${bgColors[book.id - 1]}`} />
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        <div className="text-white/30 font-mono-custom text-xs font-bold">{book.ordinal}</div>
        <div>
          <div className="text-white text-xs font-display font-bold leading-tight mb-1"
            style={{ fontFamily: "'Playfair Display', serif", fontSize: "0.6rem" }}>
            {book.title}
          </div>
          <div className="w-4 h-0.5 bg-white/60" />
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 w-1 bg-black/20" />
    </div>
  );
}

// 趋势强度条
function TrendBar({ name, strength, color, delay = 0 }: { name: string; strength: number; color: string; delay?: number }) {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm text-foreground/70 font-body">{name}</span>
        <span className="font-mono-custom text-xs font-medium" style={{ color }}>{strength}%</span>
      </div>
      <div className="h-1.5 bg-border rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: inView ? `${strength}%` : "0%",
            backgroundColor: color,
            transitionDelay: `${delay}ms`
          }}
        />
      </div>
    </div>
  );
}

// 市场统计卡片
function StatCard({ label, value, unit, inView }: { label: string; value: string; unit: string; inView: boolean }) {
  return (
    <div className={`p-4 rounded-lg border border-border bg-card transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="font-mono-custom text-2xl font-bold text-foreground mb-1">{value}</div>
      <div className="text-xs text-muted-foreground font-body mb-1">{unit}</div>
      <div className="text-xs font-medium text-foreground/80 font-body leading-tight">{label}</div>
    </div>
  );
}

// 书籍详情卡片
function BookCard({ book, index }: { book: typeof bookConcepts[0]; index: number }) {
  const [activeTab, setActiveTab] = useState<"overview" | "market" | "trends" | "radar">("overview");
  const { ref, inView } = useInView();

  const accentColors = [
    "#e05a3a", "#7c3aed", "#d97706", "#059669", "#2563eb"
  ];
  const color = accentColors[index];

  const tabs = [
    { id: "overview", label: "概念概览" },
    { id: "market", label: "市场数据" },
    { id: "trends", label: "趋势分析" },
    { id: "radar", label: "综合评分" },
  ] as const;

  return (
    <div
      ref={ref}
      className={`book-card bg-card rounded-2xl border border-border overflow-hidden transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* 卡片顶部色条 */}
      <div className="h-1" style={{ backgroundColor: color }} />

      <div className="p-6 lg:p-8">
        {/* 书籍标题区 */}
        <div className="flex items-start gap-6 mb-6">
          <BookCover book={book} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono-custom text-4xl font-bold opacity-10 text-foreground select-none">{book.ordinal}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-body font-medium ${book.colorTheme.tag}`}>
                {book.audience.primary}
              </span>
            </div>
            <h2 className="font-display text-2xl lg:text-3xl font-bold text-foreground leading-tight mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {book.title}
            </h2>
            <p className="text-sm text-muted-foreground font-body mb-2">{book.subtitle}</p>
            <p className="text-sm italic text-foreground/60 font-display border-l-2 pl-3"
              style={{ borderColor: color, fontFamily: "'Playfair Display', serif" }}>
              {book.tagline}
            </p>
          </div>
        </div>

        {/* 标签页导航 */}
        <div className="flex gap-1 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-medium font-body transition-all duration-200 border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-current text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              style={{ borderBottomColor: activeTab === tab.id ? color : "transparent" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 目标读者 */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
                🎯 目标读者画像
              </h3>
              <div className="p-4 rounded-xl border border-border bg-secondary/30">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-display font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {book.audience.primary}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono-custom">{book.audience.ageRange}</span>
                </div>
                <p className="text-sm text-foreground/70 font-body leading-relaxed mb-3">{book.audience.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {book.audience.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-border/60 text-foreground/60 font-body">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 差异化定位 */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
                🥇 差异化定位
              </h3>
              <div className="p-4 rounded-xl border border-border bg-secondary/30">
                <p className="font-display font-semibold text-foreground mb-2 leading-snug"
                  style={{ fontFamily: "'Playfair Display', serif" }}>
                  {book.differentiation.headline}
                </p>
                <p className="text-sm text-foreground/70 font-body leading-relaxed mb-3">
                  {book.differentiation.description}
                </p>
                <ul className="space-y-1.5">
                  {book.differentiation.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-foreground/70 font-body">
                      <span className="mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 定价理由 */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-3">
                💰 定价区间与价值主张
              </h3>
              <div className="p-4 rounded-xl border border-border bg-secondary/30">
                <div className="flex items-center gap-4 mb-3">
                  <span className="font-mono-custom text-3xl font-bold" style={{ color }}>{book.pricing.range}</span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground font-body">建议零售价</span>
                </div>
                <p className="text-sm text-foreground/70 font-body leading-relaxed mb-3">{book.pricing.justification}</p>
                <div className="grid grid-cols-2 gap-2">
                  {book.pricing.valueProps.map((prop, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground/70 font-body">
                      <span className="text-base leading-none">✓</span>
                      <span>{prop}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "market" && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-4">
              📊 市场规模概览
            </h3>
            <div className="p-4 rounded-xl border border-border bg-secondary/30 mb-4">
              <div className="flex items-center gap-4 mb-3">
                <div>
                  <div className="font-mono-custom text-3xl font-bold" style={{ color }}>{book.market.size}</div>
                  <div className="text-xs text-muted-foreground font-body">潜在市场规模</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <div className="font-mono-custom text-xl font-bold text-emerald-600">{book.market.growth}</div>
                  <div className="text-xs text-muted-foreground font-body">年增长率</div>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <div className="font-mono-custom text-xl font-bold text-foreground">{book.market.potential}</div>
                  <div className="text-xs text-muted-foreground font-body">市场潜力</div>
                </div>
              </div>
              <p className="text-sm text-foreground/70 font-body leading-relaxed">{book.market.description}</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {book.market.stats.map((stat, i) => (
                <StatCard key={i} label={stat.label} value={stat.value} unit={stat.unit} inView={inView} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "trends" && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-2">
              🔥 当前趋势驱动力
            </h3>
            <p className="text-sm font-display font-semibold text-foreground mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              {book.trends.headline}
            </p>
            <p className="text-sm text-foreground/60 font-body leading-relaxed mb-5">{book.trends.description}</p>
            <div>
              {book.trends.items.map((item, i) => (
                <TrendBar key={i} name={item.name} strength={item.strength} color={color} delay={i * 80} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "radar" && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-4">
              综合潜力评分（满分 100）
            </h3>
            <div className="flex justify-center">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={book.radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                  <PolarGrid stroke="oklch(0.88 0.01 85)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fontFamily: "'DM Sans', sans-serif", fill: "oklch(0.52 0.02 260)" }}
                  />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name={book.title}
                    dataKey="value"
                    stroke={color}
                    fill={color}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {book.radarData.map((item) => (
                <div key={item.subject} className="text-center p-2 rounded-lg bg-secondary/40">
                  <div className="font-mono-custom text-lg font-bold" style={{ color }}>{item.value}</div>
                  <div className="text-xs text-muted-foreground font-body">{item.subject}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 市场概览图表区
function MarketOverview() {
  const { ref, inView } = useInView();

  return (
    <section ref={ref} className="py-16 bg-secondary/20">
      <div className="container">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-2">
            市场分析
          </p>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}>
            ADHD 出版市场全景
          </h2>
          <div className="w-12 h-1 mt-3" style={{ backgroundColor: "oklch(0.65 0.18 25)" }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 趋势对比柱状图 */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display font-semibold text-foreground mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              各概念趋势热度对比
            </h3>
            <p className="text-xs text-muted-foreground font-body mb-5">基于社交媒体、搜索量和出版数据综合评估</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendComparisonData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.004 286.32)" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fontFamily: "'DM Sans', sans-serif", fill: "oklch(0.52 0.02 260)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[70, 100]}
                  tick={{ fontSize: 10, fontFamily: "'DM Mono', monospace", fill: "oklch(0.52 0.02 260)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "1px solid oklch(0.88 0.01 85)",
                    backgroundColor: "white"
                  }}
                  formatter={(value) => [`${value}分`, "趋势热度"]}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {trendComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 受众分布饼图 */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="font-display font-semibold text-foreground mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              目标受众市场份额分布
            </h3>
            <p className="text-xs text-muted-foreground font-body mb-5">ADHD 相关书籍潜在读者群体构成估算</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={audienceBreakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {audienceBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "oklch(0.52 0.02 260)" }}>
                      {value}
                    </span>
                  )}
                />
                <Tooltip
                  contentStyle={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "12px",
                    borderRadius: "8px",
                    border: "1px solid oklch(0.88 0.01 85)",
                  }}
                  formatter={(value) => [`${value}%`, "市场份额"]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 关键市场数据 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {[
            { label: "美国成人 ADHD 患者", value: "1550万", sub: "潜在核心读者", color: "#e05a3a" },
            { label: "全球 ADHD 市场增速", value: "6.9%", sub: "年复合增长率", color: "#2563eb" },
            { label: "ADHD 相关书籍年增速", value: "15%", sub: "高于行业平均", color: "#059669" },
            { label: "女性 ADHD 漏诊率", value: "50-75%", sub: "蓝海市场机遇", color: "#7c3aed" },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-card rounded-xl border border-border p-5 transition-all duration-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-mono-custom text-2xl font-bold mb-1" style={{ color: item.color }}>
                {item.value}
              </div>
              <div className="text-xs text-muted-foreground font-body mb-1">{item.sub}</div>
              <div className="text-sm font-medium text-foreground font-body">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 主页面
export default function Home() {
  const [activeBook, setActiveBook] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="container">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "oklch(0.65 0.18 25)" }}>
                A
              </div>
              <span className="font-display font-semibold text-foreground text-sm"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                ADHD 书籍创意生成器
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {["概念总览", "市场分析", "5大概念"].map((item) => (
                <a key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                  {item}
                </a>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono-custom">
              资深出版策略师报告 · 2026
            </div>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center overflow-hidden">
        {/* 背景图 */}
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="书籍背景"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        <div className="container relative z-10 py-20">
          <div className="max-w-2xl">
            {/* 标签 */}
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <div className="h-px w-8" style={{ backgroundColor: "oklch(0.65 0.18 25)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body">
                出版策略分析报告
              </span>
            </div>

            {/* 主标题 */}
            <h1 className="font-display font-black text-5xl lg:text-7xl text-foreground leading-[0.95] mb-6 animate-fade-in-up"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              ADHD
              <br />
              <span style={{ color: "oklch(0.65 0.18 25)" }}>高影响力</span>
              <br />
              书籍创意
            </h1>

            <p className="text-lg text-foreground/60 font-body leading-relaxed mb-8 animate-fade-in-up delay-200">
              基于市场研究与出版策略分析，针对 ADHD 主题精心策划的 5 个旨在畅销的书籍概念，
              涵盖完整的受众画像、差异化定位与市场数据。
            </p>

            {/* 统计数字 */}
            <div className="flex items-center gap-8 animate-fade-in-up delay-300">
              {[
                { num: "5", label: "书籍概念" },
                { num: "6", label: "维度分析" },
                { num: "20+", label: "市场数据点" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="font-mono-custom text-3xl font-bold text-foreground">{item.num}</div>
                  <div className="text-xs text-muted-foreground font-body">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 装饰性书籍堆叠 */}
        <div className="absolute right-8 bottom-8 hidden lg:flex items-end gap-2 opacity-60">
          {bookConcepts.map((book) => (
            <BookCover key={book.id} book={book} size="sm" />
          ))}
        </div>
      </section>

      {/* 书籍概念快速导航 */}
      <section className="py-8 border-b border-border bg-card/50">
        <div className="container">
          <div className="flex items-center gap-4 overflow-x-auto pb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body flex-shrink-0">
              5 大概念
            </span>
            <div className="w-px h-4 bg-border flex-shrink-0" />
            {bookConcepts.map((book, i) => {
              const colors = ["#e05a3a", "#7c3aed", "#d97706", "#059669", "#2563eb"];
              return (
                <button
                  key={book.id}
                  onClick={() => {
                    setActiveBook(book.id);
                    document.getElementById(`book-${book.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 flex-shrink-0 font-body text-sm"
                  style={{
                    borderColor: activeBook === book.id ? colors[i] : "oklch(0.88 0.01 85)",
                    backgroundColor: activeBook === book.id ? `${colors[i]}15` : "transparent",
                    color: activeBook === book.id ? colors[i] : "oklch(0.52 0.02 260)"
                  }}
                >
                  <span className="font-mono-custom text-xs">{book.ordinal}</span>
                  <span>{book.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 市场概览 */}
      <MarketOverview />

      {/* 5 大书籍概念 */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground font-body mb-2">
              核心交付物
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-foreground"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              5 个高潜力书籍概念
            </h2>
            <div className="w-12 h-1 mt-3" style={{ backgroundColor: "oklch(0.65 0.18 25)" }} />
            <p className="mt-4 text-foreground/60 font-body max-w-xl">
              每个概念均经过完整的市场验证，包含目标读者画像、差异化定位、市场规模分析、
              定价策略和趋势驱动力，点击各标签页深入探索。
            </p>
          </div>

          <div className="space-y-8">
            {bookConcepts.map((book, index) => (
              <div key={book.id} id={`book-${book.id}`}>
                <BookCard book={book} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 策略总结 */}
      <section className="py-16 bg-foreground text-background">
        <div className="container">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-50 font-body mb-4">
              策略师结语
            </p>
            <h2 className="font-display text-3xl lg:text-4xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              ADHD 出版市场正处于
              <br />
              <span style={{ color: "oklch(0.75 0.18 25)" }}>黄金窗口期</span>
            </h2>
            <p className="text-background/70 font-body leading-relaxed mb-8">
              随着全球 ADHD 诊断率的持续上升、神经多样性运动的兴起，以及社交媒体对相关话题的持续放大，
              ADHD 相关书籍市场正迎来前所未有的增长机遇。上述五个概念覆盖了从职场、女性、创意、
              亲子到整体健康的完整生态，每一个都精准切入了一个被市场验证的细分需求。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: "📈", title: "市场时机", desc: "ADHD 诊断率年均增长 3-5%，读者基数持续扩大" },
                { icon: "🎯", title: "精准定位", desc: "每个概念针对独特细分市场，避免直接竞争" },
                { icon: "💡", title: "差异化优势", desc: "五个概念均有清晰的内容护城河和独特价值主张" },
              ].map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-background/10 bg-background/5">
                  <div className="text-2xl mb-3">{item.icon}</div>
                  <div className="font-display font-semibold mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.title}
                  </div>
                  <p className="text-sm text-background/60 font-body leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-sm flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: "oklch(0.65 0.18 25)" }}>
                A
              </div>
              <span className="text-sm text-muted-foreground font-body">
                ADHD 高影响力书籍创意生成器
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-body text-center">
              本报告由 Manus AI 资深出版策略师模式生成 · 数据来源：CDC、CHADD、Grand View Research · 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
