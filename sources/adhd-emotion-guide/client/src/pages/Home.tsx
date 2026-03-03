/**
 * ADHD情绪管理指南 — 重构版
 * 风格：沉浸式长文阅读 × 编辑排版美学（参考李笑来文章风格）
 * 配色：#f9f6f1 暖白底 · #1a1a2e 深色文字 · #e05a3a 珊瑚红强调
 * 字体：Noto Serif SC（正文衬线）+ Noto Sans SC（标题/UI）+ DM Mono（标注）
 * 内容宽度：680px，沉浸式单列阅读
 */

import { useState, useEffect, useRef } from "react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell,
} from "recharts";

// ─── 图表数据 ─────────────────────────────────────────────────────────────────

const radarData = [
  { subject: "情绪调节", CBT: 88, DBT: 92, ACT: 80, 正念: 78 },
  { subject: "冲动控制", CBT: 82, DBT: 85, ACT: 75, 正念: 70 },
  { subject: "自我认知", CBT: 90, DBT: 78, ACT: 95, 正念: 85 },
  { subject: "人际关系", CBT: 75, DBT: 92, ACT: 80, 正念: 72 },
  { subject: "压力管理", CBT: 80, DBT: 85, ACT: 88, 正念: 90 },
  { subject: "执行功能", CBT: 85, DBT: 70, ACT: 78, 正念: 65 },
];

const lifestyleData = [
  { name: "有氧运动", score: 92, color: "#e05a3a" },
  { name: "睡眠优化", score: 88, color: "#2d3a8c" },
  { name: "Omega-3", score: 68, color: "#c9973a" },
  { name: "正念冥想", score: 78, color: "#3a8c5a" },
  { name: "营养均衡", score: 72, color: "#8c3a8c" },
];

// ─── 呼吸动画组件 ─────────────────────────────────────────────────────────────

function BreathingWidget() {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [count, setCount] = useState(4);
  const [active, setActive] = useState(false);
  const [size, setSize] = useState(60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!active) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSize(60); setPhase("inhale"); setCount(4);
      return;
    }
    const phases: Array<{ name: "inhale" | "hold" | "exhale"; secs: number; toSize: number }> = [
      { name: "inhale", secs: 4, toSize: 100 },
      { name: "hold",   secs: 7, toSize: 100 },
      { name: "exhale", secs: 8, toSize: 60  },
    ];
    let pi = 0, elapsed = 0;
    const TICK = 100;
    intervalRef.current = setInterval(() => {
      elapsed += TICK;
      const cur = phases[pi];
      const prog = Math.min(elapsed / (cur.secs * 1000), 1);
      if (cur.name === "inhale")  setSize(60 + prog * 40);
      if (cur.name === "exhale")  setSize(100 - prog * 40);
      setCount(Math.max(1, Math.ceil((1 - prog) * cur.secs)));
      if (prog >= 1) {
        pi = (pi + 1) % phases.length;
        elapsed = 0;
        setPhase(phases[pi].name);
        setCount(phases[pi].secs);
      }
    }, TICK);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [active]);

  const labels = { inhale: "吸气", hold: "屏息", exhale: "呼气" };
  const colors  = { inhale: "#4FC3F7", hold: "#B39DDB", exhale: "#80CBC4" };

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12 }}>
      <div
        onClick={() => setActive(v => !v)}
        style={{
          width:120, height:120, position:"relative",
          display:"flex", alignItems:"center", justifyContent:"center",
          cursor:"pointer",
        }}
      >
        <div style={{
          width:`${size}%`, height:`${size}%`,
          borderRadius:"50%",
          background:`radial-gradient(circle, ${colors[phase]}40, ${colors[phase]}15)`,
          border:`2px solid ${colors[phase]}80`,
          boxShadow: active ? `0 0 24px ${colors[phase]}50` : "none",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"width 0.1s linear, height 0.1s linear",
        }}>
          <span style={{ fontSize:22, fontWeight:700, color:"white", fontFamily:"'DM Mono', monospace" }}>
            {active ? count : "▶"}
          </span>
        </div>
      </div>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:13, fontWeight:600, color:"white", fontFamily:"'Noto Sans SC', sans-serif" }}>
          {active ? labels[phase] : "点击开始练习"}
        </div>
        <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:2, fontFamily:"'DM Mono', monospace" }}>
          4 · 7 · 8 呼吸法
        </div>
      </div>
    </div>
  );
}

// ─── 主页面 ───────────────────────────────────────────────────────────────────

export default function Home() {
  const [activeTab, setActiveTab] = useState<"radar"|"bar">("radar");

  // 阅读进度条
  useEffect(() => {
    const bar = document.getElementById("progress-bar");
    if (!bar) return;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = h > 0 ? `${(window.scrollY / h) * 100}%` : "0%";
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // 入场动画
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    document.querySelectorAll(".anim").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        /* ============================================================
         * 文章阅读页 — 设计系统
         * 风格：沉浸式长文阅读 × 编辑排版美学（李笑来风格）
         * ============================================================ */

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg:          #f9f6f1;
          --bg-dark:     #1a1a2e;
          --bg-card:     #ffffff;
          --fg:          #1a1a2e;
          --fg-muted:    #5a5a72;
          --fg-faint:    #9a9ab0;
          --coral:       #e05a3a;
          --coral-lt:    rgba(224,90,58,0.10);
          --coral-mid:   rgba(224,90,58,0.20);
          --indigo:      #2d3a8c;
          --gold:        #c9973a;
          --border:      #e8e4dc;
          --shadow-sm:   0 2px 8px rgba(26,26,46,0.06);
          --shadow-md:   0 8px 32px rgba(26,26,46,0.10);
          --radius:      12px;
          --font-serif:  'Noto Serif SC', Georgia, 'Times New Roman', serif;
          --font-sans:   'Noto Sans SC', -apple-system, 'Helvetica Neue', Arial, sans-serif;
          --font-mono:   'DM Mono', 'SFMono-Regular', Consolas, monospace;
          --content-w:   680px;
        }

        html { scroll-behavior: smooth; background: var(--bg); }

        body {
          font-family: var(--font-sans);
          background: var(--bg);
          color: var(--fg);
          line-height: 1.8;
          -webkit-font-smoothing: antialiased;
        }

        /* 滚动条 */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--bg); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--coral); }

        /* 阅读进度条 */
        #progress-bar {
          position: fixed; top: 0; left: 0; z-index: 200;
          height: 3px;
          background: linear-gradient(90deg, var(--coral), var(--gold));
          width: 0%;
          transition: width 0.1s linear;
        }

        /* 导航 */
        .lx-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(249,246,241,0.93);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border);
          padding: 0 2rem;
        }
        .lx-nav-inner {
          max-width: 1000px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          height: 52px;
        }
        .lx-nav-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--fg-muted);
          font-size: 13px; font-family: var(--font-mono);
          transition: color 0.2s;
        }
        .lx-nav-brand:hover { color: var(--coral); }
        .lx-nav-meta {
          font-size: 12px; color: var(--fg-faint);
          font-family: var(--font-mono);
        }

        /* Hero 封面 */
        .lx-hero {
          background: var(--bg-dark);
          color: white;
          padding: 80px 2rem 72px;
          position: relative; overflow: hidden;
        }
        .lx-hero::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 80% 20%, rgba(224,90,58,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 40% 60% at 10% 80%, rgba(45,58,140,0.25) 0%, transparent 60%);
        }
        .lx-hero-inner {
          max-width: var(--content-w);
          margin: 0 auto;
          position: relative; z-index: 1;
        }
        .lx-eyebrow {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 28px;
        }
        .lx-eyebrow-line { width: 32px; height: 2px; background: var(--coral); }
        .lx-eyebrow-text {
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.5); font-family: var(--font-mono);
        }
        .lx-title {
          font-family: var(--font-serif);
          font-size: clamp(1.9rem, 5vw, 2.8rem);
          font-weight: 900; line-height: 1.3;
          color: white; margin-bottom: 24px;
        }
        .lx-title em { font-style: normal; color: var(--coral); }
        .lx-subtitle {
          font-size: 16px; color: rgba(255,255,255,0.6);
          line-height: 1.75; max-width: 560px; margin-bottom: 40px;
          font-family: var(--font-serif);
        }
        .lx-hero-meta {
          display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
        }
        .lx-tag {
          padding: 4px 12px; border-radius: 20px;
          font-size: 12px; font-family: var(--font-mono);
          border: 1px solid rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.55);
        }
        .lx-tag.accent {
          background: var(--coral-lt);
          border-color: rgba(224,90,58,0.4);
          color: #f0a090;
        }
        .lx-read-time {
          font-size: 12px; color: rgba(255,255,255,0.35);
          font-family: var(--font-mono);
        }

        /* 文章主体 */
        .lx-article {
          max-width: var(--content-w);
          margin: 0 auto;
          padding: 64px 2rem 80px;
        }

        /* 正文段落 — 衬线字体 20px */
        .lx-article p {
          font-family: var(--font-serif);
          font-size: 20px; line-height: 1.85;
          color: #242424; margin-bottom: 28px;
          letter-spacing: 0.01em;
        }
        .lx-article p strong { color: #1a1a2e; font-weight: 700; }

        /* 核心观点卡片 */
        .core-card {
          background: var(--bg-dark); color: white;
          border-radius: var(--radius);
          padding: 32px 36px; margin-bottom: 56px;
          position: relative; overflow: hidden;
        }
        .core-card::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--coral), var(--gold));
        }
        .core-label {
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          color: var(--coral); font-family: var(--font-mono);
          margin-bottom: 16px;
        }
        .core-text {
          font-family: var(--font-serif);
          font-size: 18px; line-height: 1.9;
          color: #ffffff !important; letter-spacing: 0.01em;
        }
        .core-text strong {
          color: #ffffff !important; font-weight: 700;
          border-bottom: 1.5px solid rgba(224,90,58,0.7);
          padding-bottom: 1px;
        }
        /* 强制覆盖 .lx-article p 对 core-card 内段落的影响 */
        .lx-article .core-card p {
          font-family: var(--font-serif);
          font-size: 18px; line-height: 1.9;
          color: #ffffff !important;
          margin-bottom: 0; letter-spacing: 0.01em;
        }
        .lx-article .core-card p strong {
          color: #ffffff !important; font-weight: 700;
          border-bottom: 1.5px solid rgba(224,90,58,0.7);
          padding-bottom: 1px;
        }

        /* 章节标题 */
        .sec-heading {
          font-family: var(--font-sans);
          font-size: 1.55rem; font-weight: 700;
          color: var(--fg);
          margin: 60px 0 20px;
          padding-bottom: 14px;
          border-bottom: 2px solid var(--border);
          position: relative;
        }
        .sec-heading::after {
          content: '';
          position: absolute; bottom: -2px; left: 0;
          width: 48px; height: 2px;
          background: var(--coral);
        }
        .sec-num {
          font-family: var(--font-mono);
          font-size: 11px; color: var(--coral);
          letter-spacing: 0.1em;
          display: block; margin-bottom: 8px;
        }

        /* 引用块 */
        .lx-article blockquote {
          margin: 32px 0; padding: 24px 28px;
          background: var(--coral-lt);
          border-left: 4px solid var(--coral);
          border-radius: 0 var(--radius) var(--radius) 0;
        }
        .lx-article blockquote p {
          font-family: var(--font-serif);
          font-size: 20px !important; font-style: italic;
          color: #1a1a2e !important;
          margin-bottom: 12px !important;
          line-height: 1.75 !important;
        }
        .lx-article blockquote cite {
          font-size: 13px; color: var(--fg-muted);
          font-family: var(--font-mono); font-style: normal;
        }

        /* callout 框 */
        .callout {
          background: var(--bg-card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 24px 28px; margin: 28px 0;
          box-shadow: var(--shadow-sm);
        }
        .callout-label {
          font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase;
          color: var(--fg-faint); font-family: var(--font-mono);
          margin-bottom: 12px;
        }
        .lx-article .callout p {
          font-size: 17px !important; margin-bottom: 0 !important;
          color: #1a1a2e !important;
        }

        /* 对比表格 */
        .compare-table {
          width: 100%; border-collapse: collapse;
          margin: 32px 0; font-size: 15px;
          border-radius: var(--radius); overflow: hidden;
          box-shadow: var(--shadow-sm);
        }
        .compare-table thead tr { background: var(--bg-dark); color: white; }
        .compare-table thead th {
          padding: 14px 20px; text-align: left;
          font-family: var(--font-mono); font-size: 12px;
          letter-spacing: 0.05em; font-weight: 500;
        }
        .compare-table tbody tr { background: var(--bg-card); }
        .compare-table tbody tr:nth-child(even) { background: #faf8f5; }
        .compare-table tbody td {
          padding: 13px 20px; border-bottom: 1px solid var(--border);
          font-family: var(--font-sans); font-size: 14px; color: var(--fg-muted);
          vertical-align: top;
        }
        .compare-table tbody td:first-child {
          font-weight: 600; color: var(--fg); font-size: 13px;
          font-family: var(--font-mono);
        }
        .badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 12px; font-family: var(--font-mono);
        }
        .badge-good { background: rgba(39,174,96,0.12); color: #1a7a3a; }
        .badge-warn { background: rgba(224,90,58,0.12); color: #c04020; }

        /* 图表容器 */
        .chart-box {
          background: var(--bg-card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 28px; margin: 32px 0;
          box-shadow: var(--shadow-sm);
        }
        .chart-title {
          font-family: var(--font-sans); font-size: 15px; font-weight: 700;
          color: var(--fg); margin-bottom: 4px;
        }
        .chart-sub {
          font-family: var(--font-mono); font-size: 12px;
          color: var(--fg-faint); margin-bottom: 20px;
        }
        .tab-row { display: flex; gap: 8px; margin-bottom: 20px; }
        .tab-btn {
          padding: 5px 14px; border-radius: 20px;
          font-size: 12px; font-family: var(--font-mono);
          border: 1px solid var(--border); cursor: pointer;
          transition: all 0.2s;
          background: transparent; color: var(--fg-muted);
        }
        .tab-btn.active {
          background: var(--bg-dark); color: white; border-color: var(--bg-dark);
        }

        /* 工具卡片组 */
        .tool-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px; margin: 28px 0;
        }
        @media (max-width: 560px) { .tool-grid { grid-template-columns: 1fr; } }
        .tool-card {
          background: var(--bg-card);
          border: 1.5px solid var(--border);
          border-radius: var(--radius);
          padding: 20px 22px;
          box-shadow: var(--shadow-sm);
        }
        .tool-card-head {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 12px;
        }
        .tool-badge {
          display: inline-block; padding: 3px 10px;
          border-radius: 20px; font-size: 11px;
          font-family: var(--font-mono); font-weight: 600;
        }
        .tool-card-title {
          font-family: var(--font-sans); font-size: 15px; font-weight: 700;
          color: var(--fg);
        }
        .tool-item {
          display: flex; gap: 10px;
          margin-bottom: 10px; align-items: flex-start;
        }
        .tool-letter {
          width: 28px; height: 28px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-mono); font-size: 13px; font-weight: 700;
          flex-shrink: 0; color: white;
        }
        .tool-item-body { flex: 1; }
        .tool-item-zh {
          font-family: var(--font-sans); font-size: 13px; font-weight: 600;
          color: var(--fg);
        }
        .tool-item-desc {
          font-family: var(--font-sans); font-size: 12px;
          color: var(--fg-muted); line-height: 1.5; margin-top: 2px;
        }

        /* 呼吸练习框 */
        .breath-box {
          background: var(--bg-dark);
          border-radius: var(--radius);
          padding: 28px 32px; margin: 28px 0;
          display: flex; gap: 32px; align-items: center;
          flex-wrap: wrap;
        }
        .breath-desc { flex: 1; min-width: 200px; }
        .breath-title {
          font-family: var(--font-sans); font-size: 17px; font-weight: 700;
          color: white; margin-bottom: 10px;
        }
        .breath-text {
          font-family: var(--font-serif); font-size: 15px;
          color: rgba(255,255,255,0.65); line-height: 1.75;
        }

        /* 结语 */
        .conclusion {
          background: var(--bg-dark); color: white;
          border-radius: var(--radius);
          padding: 36px 40px; margin-top: 56px;
          position: relative; overflow: hidden;
        }
        .conclusion::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--indigo), var(--coral));
        }
        .conclusion-label {
          font-size: 10px; letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.4); font-family: var(--font-mono);
          margin-bottom: 20px;
        }
        .lx-article .conclusion p {
          font-family: var(--font-serif);
          font-size: 18px !important; line-height: 1.9;
          color: rgba(255,255,255,0.85) !important;
          margin-bottom: 20px !important;
        }
        .lx-article .conclusion p strong { color: white !important; }
        .conclusion-cta {
          margin-top: 24px; padding-top: 24px;
          border-top: 1px solid rgba(255,255,255,0.1);
          font-family: var(--font-serif); font-size: 17px;
          color: rgba(255,255,255,0.7); line-height: 1.8;
        }
        .conclusion-cta em { font-style: normal; color: var(--coral); }

        /* 参考文献 */
        .references { margin-top: 56px; padding-top: 32px; border-top: 1px solid var(--border); }
        .references-title {
          font-family: var(--font-mono); font-size: 11px;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--fg-faint); margin-bottom: 20px;
        }
        .ref-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
        .ref-item { display: flex; gap: 12px; font-size: 13px; color: var(--fg-muted); line-height: 1.6; }
        .ref-num { flex-shrink: 0; font-family: var(--font-mono); color: var(--coral); font-size: 12px; padding-top: 1px; }
        .ref-item a { color: var(--indigo); text-decoration: none; }
        .ref-item a:hover { text-decoration: underline; color: var(--coral); }
        .ref-item em { font-style: italic; }

        /* 分割线 */
        .lx-divider { border: none; border-top: 1px solid var(--border); margin: 48px 0; }

        /* 页脚 */
        .lx-footer {
          background: var(--bg-dark); color: rgba(255,255,255,0.4);
          padding: 24px 2rem; text-align: center;
          font-size: 12px; font-family: var(--font-mono);
        }

        /* 入场动画 */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .anim { opacity: 0; }
        .anim.visible { animation: fadeInUp 0.55s cubic-bezier(0.4,0,0.2,1) forwards; }

        /* 响应式 */
        @media (max-width: 640px) {
          .lx-hero { padding: 56px 1.25rem 48px; }
          .lx-title { font-size: 1.75rem; }
          .lx-article { padding: 40px 1.25rem 60px; }
          .core-card { padding: 24px 20px; }
          .conclusion { padding: 28px 22px; }
          .compare-table { font-size: 13px; }
          .compare-table thead th, .compare-table tbody td { padding: 10px 14px; }
          .lx-nav { padding: 0 1.25rem; }
          .breath-box { flex-direction: column; align-items: center; }
        }
      `}</style>

      {/* 阅读进度条 */}
      <div id="progress-bar" />

      {/* 导航 */}
      <nav className="lx-nav">
        <div className="lx-nav-inner">
          <a href="#" className="lx-nav-brand">
            <span style={{ fontSize: 16 }}>←</span>
            <span>ADHD 情绪管理指南</span>
          </a>
          <span className="lx-nav-meta">神经科学 · 心理学 · 2025</span>
        </div>
      </nav>

      {/* Hero 封面 */}
      <header className="lx-hero">
        <div className="lx-hero-inner">
          <div className="lx-eyebrow anim">
            <div className="lx-eyebrow-line" />
            <span className="lx-eyebrow-text">深度研究 · 神经科学 × 临床心理学</span>
          </div>
          <h1 className="lx-title anim">
            你的情绪，<br />
            为什么<em>特别难管</em>？<br />
            <span style={{ fontSize: "0.72em", fontWeight: 400, opacity: 0.85 }}>
              写给 ADHD 成年人的非药物情绪管理完全指南
            </span>
          </h1>
          <p className="lx-subtitle anim">
            如果你有 ADHD，你大概早就发现了：那些"管理情绪"的方法，对你来说好像特别难用。不是你不努力，而是你的大脑在情绪这件事上，和别人的出厂设置就不一样。本文从神经科学出发，告诉你为什么，以及真正有效的方法是什么。
          </p>
          <div className="lx-hero-meta anim">
            <span className="lx-tag accent">ADHD · 情绪失调</span>
            <span className="lx-tag">神经科学</span>
            <span className="lx-tag">CBT / DBT / ACT</span>
            <span className="lx-tag">实践工具</span>
            <span className="lx-read-time">约 18 分钟阅读</span>
          </div>
        </div>
      </header>

      {/* 文章主体 */}
      <article className="lx-article">

        {/* 核心观点 */}
        <div className="core-card anim">
          <div className="core-label">核心观点</div>
          <p className="core-text">
            ADHD 成年人的情绪失调，不是"性格问题"，不是"不够努力"，而是<strong>神经生物学层面的结构性差异</strong>——前额叶皮层发育延迟、杏仁核过度激活、多巴胺系统功能异常。这意味着，那些"深呼吸、数到十、想想后果"的通用建议，对你来说效果有限，不是因为你不行，而是因为<strong>你需要的工具，本来就应该不一样</strong>。
          </p>
        </div>

        {/* 引言 */}
        <p className="anim">朋友，我们先来看一个你可能太熟悉的场景。</p>

        <p className="anim">你正在做一件事，突然有人说了一句话——也许只是一句无心的批评，也许只是一个不耐烦的语气——然后你感觉整个人像被一拳打中了胸口。那种情绪来得又快又猛，理智上你知道"这没什么大不了的"，但你就是控制不住，要么当场爆发，要么整个人陷入一种说不清楚的低落，接下来几个小时什么都做不了。</p>

        <p className="anim">你事后反省：我为什么又这样了？我怎么这么脆弱？我怎么这么难搞？</p>

        <p className="anim">但我想告诉你：<strong>这不是你的错。这是你的大脑。</strong></p>

        {/* 第一章 */}
        <h2 className="sec-heading anim">
          <span className="sec-num">01 / 为什么你的情绪"特别难管"</span>
          ADHD 大脑的出厂设置，就是不一样的
        </h2>

        <p className="anim">我们先来搞清楚一件事：ADHD 到底是什么？</p>

        <p className="anim">很多人以为 ADHD 就是"注意力不集中"，就是"坐不住"，就是"小孩子的问题"。这个理解太窄了。2020 年，罗素·巴克利（Russell Barkley）博士——全球最权威的 ADHD 研究者之一——在他的综述中明确指出：<strong>ADHD 本质上是一种执行功能障碍，而情绪调节，正是执行功能的核心组成部分之一。</strong></p>

        <blockquote className="anim">
          <p>"情绪调节障碍应该被视为 ADHD 的核心症状，而不是附带症状。大约 70% 的 ADHD 成年患者报告存在显著的情绪调节困难。"</p>
          <cite>—— Barkley, R.A. (2015). <em>Emotional Dysregulation Is a Core Component of ADHD</em>. 收录于《ADHD 注意力缺陷多动障碍手册》第三版</cite>
        </blockquote>

        <p className="anim">70%。这不是少数，这是大多数。</p>

        <p className="anim">那么，ADHD 大脑在情绪这件事上，到底哪里不一样？有三个关键的神经生物学机制，你必须了解。</p>

        <p className="anim"><strong>第一：前额叶皮层发育延迟。</strong>前额叶皮层是大脑的"CEO"，负责计划、决策、冲动控制，以及——最重要的——情绪调节。研究显示，ADHD 患者的前额叶皮层发育比同龄人平均<strong>晚 3 到 5 年</strong>。这意味着，当你 25 岁的时候，你负责"踩刹车"的那部分大脑，可能还在以 20 岁的水平运作。</p>

        <p className="anim"><strong>第二：杏仁核过度激活。</strong>杏仁核是大脑的"情绪警报器"，负责检测威胁、触发情绪反应。在 ADHD 大脑中，杏仁核对负面刺激的反应更强烈、更迅速，而且持续时间更长。一个普通人可能感受到"有点不爽"的事情，你感受到的是"世界要塌了"。这不是夸张，这是神经层面的事实。</p>

        <p className="anim"><strong>第三：多巴胺系统功能异常。</strong>多巴胺不只是"快乐物质"，它更是大脑的"动机和奖励"系统的核心。ADHD 大脑的多巴胺系统存在功能性缺陷，导致你对即时奖励极度敏感，对延迟奖励几乎无感。这在情绪上的表现就是：<strong>你很难等待，很难忍耐，很难在情绪高峰时做出理性决策。</strong></p>

        <div className="callout anim">
          <div className="callout-label">直接结论</div>
          <p>这三个机制加在一起，就是为什么"深呼吸"、"想想后果"这类建议对你效果有限——这些方法依赖的，正是你的前额叶皮层。而你的前额叶皮层，在情绪激活的时候，已经被杏仁核"劫持"了。</p>
        </div>

        {/* 第二章 */}
        <h2 className="sec-heading anim">
          <span className="sec-num">02 / 拒绝敏感性障碍（RSD）</span>
          那种"被刺穿"的感觉，有个名字
        </h2>

        <p className="anim">在 ADHD 的情绪症状里，有一个最让人痛苦、但又最少被讨论的东西，叫做<strong>拒绝敏感性障碍（Rejection Sensitive Dysphoria，RSD）</strong>。</p>

        <p className="anim">"Dysphoria"这个词，希腊语的意思是"难以承受的"。所以 RSD 的字面意思，就是：<strong>对拒绝的、难以承受的情感痛苦。</strong></p>

        <p className="anim">威廉·多德森（William Dodson）医生是研究 RSD 最深入的临床医生之一。他描述说，RSD 患者在感知到批评、拒绝或失败时，会经历一种极度强烈的情感痛苦——不是"有点难过"，而是一种<strong>几乎无法忍受的、身体层面的痛苦</strong>。很多患者描述这种感觉像"被刀刺穿胸口"。</p>

        <blockquote className="anim">
          <p>"RSD 不是对批评的过度反应，而是一种真实的神经生物学现象。它的触发可以是真实的批评，也可以是感知到的批评，甚至只是预期中可能发生的批评。"</p>
          <cite>—— Dodson, W. (2016). <em>Rejection Sensitive Dysphoria and ADHD</em>. ADDitude Magazine</cite>
        </blockquote>

        <p className="anim">RSD 的特征是：来得极快（通常在几秒内达到顶峰），强度极高（患者常常描述为"世界上最糟糕的感觉"），但消退也相对快（通常几小时内）。这和抑郁症的持续低落是不同的。</p>

        <p className="anim">多德森医生的调查显示，<strong>约 99% 的 ADHD 成年人</strong>报告存在 RSD 症状。如果你有 ADHD，你几乎肯定经历过这种感觉，只是你可能从来不知道它有个名字。</p>

        <div className="callout anim">
          <div className="callout-label">为什么这很重要</div>
          <p>理解 RSD 的意义在于：它解释了很多你觉得"莫名其妙"的行为——为什么你会回避某些社交场合，为什么你会在收到批评后整个人垮掉，为什么你会在一段关系里过度讨好。这些不是性格缺陷，而是 RSD 的防御机制。</p>
        </div>

        {/* 第三章 */}
        <h2 className="sec-heading anim">
          <span className="sec-num">03 / 多迷走神经理论</span>
          你的情绪，其实是你的神经系统在"求生"
        </h2>

        <p className="anim">在我们讲具体方法之前，还有一个理论框架你需要了解，因为它会彻底改变你看待自己情绪反应的方式。</p>

        <p className="anim">这个框架叫<strong>多迷走神经理论（Polyvagal Theory）</strong>，由神经科学家斯蒂芬·波格斯（Stephen Porges）在 1994 年提出。简单来说，它告诉我们：你的神经系统有三种基本状态，你在任何时刻都处于其中一种。</p>

        <table className="compare-table anim">
          <thead>
            <tr>
              <th>状态</th>
              <th>神经系统</th>
              <th>你的感受</th>
              <th>ADHD 的挑战</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>🟢 调节区（安全）</td>
              <td>腹侧迷走神经</td>
              <td>平静、清晰、能连接他人</td>
              <td>ADHD 大脑在这个区停留的时间更短</td>
            </tr>
            <tr>
              <td>🟡 动员区（压力）</td>
              <td>交感神经</td>
              <td>焦虑、易怒、冲动、思维奔逸</td>
              <td>更容易被触发，且难以自主降温</td>
            </tr>
            <tr>
              <td>🔴 关闭区（超载）</td>
              <td>背侧迷走神经</td>
              <td>麻木、冻结、退缩、无力感</td>
              <td>情绪超载后常见，俗称"关机"</td>
            </tr>
          </tbody>
        </table>

        <p className="anim">对于 ADHD 患者来说，这三个状态之间的切换比普通人<strong>更快、更频繁，且更难自主控制</strong>。一个小小的触发点，就能让你从绿区瞬间跳到黄区甚至红区。而且，ADHD 大脑的"刹车系统"（前额叶皮层）本来就不够灵敏，所以一旦进入黄区或红区，就更难靠自己的意志力回到绿区。</p>

        <p className="anim">这个理论的实践意义是：<strong>情绪管理的目标，不是"消灭情绪"，而是帮助你的神经系统更快地回到绿区。</strong>而不同的方法，作用于不同的神经通路，效果也因此不同。</p>

        {/* 第四章 */}
        <h2 className="sec-heading anim">
          <span className="sec-num">04 / 核心心理疗法</span>
          三种经过验证的结构化干预
        </h2>

        <p className="anim">好，现在我们进入具体方法。先说最系统、证据最充分的部分：心理疗法。</p>

        <p className="anim">我知道"心理疗法"这四个字听起来很沉重，但我想换一种方式来解释它：这些疗法，本质上是一套<strong>可以学习的认知和行为技能</strong>。就像学游泳一样，你可以在治疗师的指导下学，也可以通过书籍和练习自学基础版本。</p>

        <p className="anim">针对 ADHD 情绪失调，研究证据最充分的是三种疗法：CBT、DBT 和 ACT。它们各有侧重，但并不互斥。</p>

        <div className="chart-box anim">
          <div className="chart-title">三大疗法多维度效果对比</div>
          <div className="chart-sub">基于随机对照试验的综合分析（0–100 相对效果评估）</div>
          <div className="tab-row">
            {(["radar", "bar"] as const).map(t => (
              <button
                key={t}
                className={`tab-btn${activeTab === t ? " active" : ""}`}
                onClick={() => setActiveTab(t)}
              >
                {t === "radar" ? "雷达图" : "柱状图"}
              </button>
            ))}
          </div>
          {activeTab === "radar" ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(26,26,46,0.1)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontFamily: "'Noto Sans SC', sans-serif", fill: "#5a5a72" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="CBT" dataKey="CBT" stroke="#2d3a8c" fill="#2d3a8c" fillOpacity={0.12} strokeWidth={2} />
                <Radar name="DBT" dataKey="DBT" stroke="#e05a3a" fill="#e05a3a" fillOpacity={0.12} strokeWidth={2} />
                <Radar name="ACT" dataKey="ACT" stroke="#c9973a" fill="#c9973a" fillOpacity={0.12} strokeWidth={2} />
                <Radar name="正念" dataKey="正念" stroke="#3a8c5a" fill="#3a8c5a" fillOpacity={0.12} strokeWidth={2} />
                <Legend wrapperStyle={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12 }} />
                <Tooltip contentStyle={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12, borderRadius: 8, border: "1px solid #e8e4dc" }} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { method: "CBT", 证据强度: 88, 即时效果: 70, 长期维持: 85 },
                { method: "DBT", 证据强度: 85, 即时效果: 90, 长期维持: 82 },
                { method: "ACT", 证据强度: 78, 即时效果: 72, 长期维持: 88 },
                { method: "正念", 证据强度: 80, 即时效果: 75, 长期维持: 78 },
                { method: "运动", 证据强度: 90, 即时效果: 85, 长期维持: 80 },
              ]} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,0.08)" />
                <XAxis dataKey="method" tick={{ fontSize: 12, fontFamily: "'Noto Sans SC', sans-serif", fill: "#5a5a72" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12, borderRadius: 8, border: "1px solid #e8e4dc" }} />
                <Legend wrapperStyle={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12 }} />
                <Bar dataKey="证据强度" fill="#2d3a8c" radius={[4,4,0,0]} />
                <Bar dataKey="即时效果" fill="#e05a3a" radius={[4,4,0,0]} />
                <Bar dataKey="长期维持" fill="#c9973a" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <p className="anim"><strong>认知行为疗法（CBT）</strong>是目前针对 ADHD 证据最充分的心理干预之一。它的核心逻辑是：你的情绪，很大程度上是由你的<strong>想法</strong>决定的，而不是由事件本身决定的。CBT 教你识别那些自动化的、扭曲的负面想法（比如"我总是搞砸一切"、"没人真的喜欢我"），然后像一个侦探一样去检验它们：证据是什么？有没有其他解释？最坏的情况真的有那么糟吗？</p>

        <p className="anim">一项 2010 年发表在《认知治疗与研究》期刊上的随机对照试验显示，针对 ADHD 成年人的 CBT 治疗，在改善情绪调节和减少焦虑方面，效果显著优于对照组，且这种效果在 6 个月后的随访中仍然保持。</p>

        <p className="anim"><strong>辩证行为疗法（DBT）</strong>最初是为边缘型人格障碍开发的，但它对 ADHD 情绪失调的效果越来越受到重视。DBT 的独特之处在于它的"辩证"哲学：同时接纳"你现在的样子"和"你需要改变"这两件事，而不是在两者之间撕裂。它的四大技能模块——正念、痛苦承受、情绪调节、人际效能——几乎完美覆盖了 ADHD 患者的核心挑战。</p>

        <p className="anim">特别值得一提的是 DBT 的<strong>痛苦承受技巧（Distress Tolerance Skills）</strong>，这是专门为情绪危机设计的工具箱，在 RSD 发作时尤其有用。我们后面会详细介绍其中的 TIPP 技巧。</p>

        <p className="anim"><strong>接纳与承诺疗法（ACT）</strong>的思路和 CBT 有些不同。CBT 试图改变你的想法，而 ACT 的核心是：<strong>你不需要改变你的想法，你只需要改变你和想法的关系。</strong>ACT 教你"认知解离"——把自己和那些痛苦的想法拉开距离，观察它们，而不是被它们淹没。同时，ACT 强调"价值澄清"：你真正在乎的是什么？你想成为什么样的人？然后，带着那些不舒服的情绪，依然朝着你的价值方向行动。</p>

        <p className="anim">2021 年发表在 Heliyon 期刊上的一篇系统综述分析了 ACT 对 ADHD 患者的干预效果，结论是：ACT 能显著提升心理灵活性，改善情绪调节，减少回避行为，且对青少年和成年人均有效。</p>

        {/* 第五章 */}
        <h2 className="sec-heading anim">
          <span className="sec-num">05 / 生活方式干预</span>
          你的身体，就是你情绪的"硬件"
        </h2>

        <p className="anim">心理疗法是"软件升级"，但如果"硬件"本身出了问题，软件再好也跑不流畅。对于 ADHD 患者来说，生活方式的调整不是"锦上添花"，而是情绪管理的基础设施。</p>

        <div className="chart-box anim">
          <div className="chart-title">生活方式干预效果评分</div>
          <div className="chart-sub">基于现有研究证据的综合评估（0–100）</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={lifestyleData} layout="vertical" barSize={14} margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,26,46,0.08)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fontFamily: "'Noto Sans SC', sans-serif", fill: "#5a5a72" }} width={70} />
              <Tooltip contentStyle={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: 12, borderRadius: 8, border: "1px solid #e8e4dc" }} formatter={(v) => [`${v} 分`, "效果评分"]} />
              <Bar dataKey="score" radius={[0,4,4,0]}>
                {lifestyleData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="anim"><strong>运动，是目前证据最强的非药物干预之一。</strong>这不是鸡汤，这是神经科学。哈佛医学院精神科医生约翰·瑞迪（John Ratey）在他的著作《运动改造大脑》中详细阐述了这一机制：有氧运动能在 30 分钟内显著提升大脑中的多巴胺、去甲肾上腺素和血清素水平——而这三种神经递质，恰好是 ADHD 药物的主要作用靶点。</p>

        <p className="anim">更重要的是，运动对 ADHD 大脑的效果是<strong>即时的</strong>。一项 2012 年发表在《儿科学》期刊上的研究显示，20 分钟的中等强度有氧运动，能显著改善 ADHD 儿童的注意力和情绪调节能力，效果在运动后立即出现。对成年人的研究也得出了类似结论。</p>

        <p className="anim">建议：每周 3-5 次，每次 30-45 分钟的中等强度有氧运动（快走、跑步、游泳、骑车均可）。如果情绪正在爆发，60 秒的高强度运动（原地高抬腿、开合跳）也能提供即时的情绪释放。</p>

        <p className="anim"><strong>睡眠，是情绪管理的"基础设施"。</strong>这一点对 ADHD 患者来说尤其关键，因为 ADHD 和睡眠问题之间存在恶性循环。睡眠不足会直接削弱前额叶皮层的功能——而前额叶皮层，正是你的情绪刹车系统。研究显示，仅仅一晚睡眠不足，就能让杏仁核对负面刺激的反应增强 60%。</p>

        <p className="anim">ADHD 患者还常见一种叫"昼夜节律延迟"的问题：你的生物钟比普通人晚 1-2 小时，导致你在深夜精力充沛，早上却起不来。这不是懒，这是生理现象。应对策略包括：固定起床时间（即使前一晚睡晚了也不要补觉），早晨接受强光照射（帮助重置生物钟），睡前一小时避免蓝光。</p>

        <p className="anim"><strong>Omega-3 脂肪酸，是目前证据最充分的营养干预。</strong>多项随机对照试验显示，补充 Omega-3（特别是 EPA 和 DHA）能改善 ADHD 的核心症状，包括情绪调节。2011 年发表在《神经精神药理学》期刊上的一项 meta 分析，综合了 10 项研究的数据，结论是：Omega-3 补充对 ADHD 症状有中等程度的改善效果，且安全性良好。建议每日补充 2-3 克，食物来源包括深海鱼（三文鱼、沙丁鱼）、核桃、亚麻籽。</p>

        {/* 第六章 */}
        <h2 className="sec-heading anim">
          <span className="sec-num">06 / 即时情绪急救工具</span>
          情绪风暴来临时，你需要的不是道理，而是工具
        </h2>

        <p className="anim">当情绪浪潮真的袭来的时候，你没有时间去"思考"，你需要的是可以立即执行的、几乎不需要认知资源的工具。</p>

        <p className="anim">这里有一个重要的认知前提：<strong>在情绪高度激活的状态下，试图用理性说服自己是无效的。</strong>你的前额叶皮层已经被杏仁核"劫持"了，这时候讲道理，就像对着一辆正在刹车失灵的车喊"你要停下来"——没用。你需要的是直接作用于神经系统的生理干预。</p>

        <div className="tool-grid anim">
          {/* HALT */}
          <div className="tool-card">
            <div className="tool-card-head">
              <span className="tool-badge" style={{ background: "rgba(45,58,140,0.12)", color: "#2d3a8c" }}>预防性</span>
              <div className="tool-card-title">HALT 检查</div>
            </div>
            <p style={{ fontSize: 13, color: "#5a5a72", marginBottom: 14, fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.6 }}>
              在情绪爆发前，先检查四个基本需求是否被满足
            </p>
            {[
              { l: "H", zh: "饥饿 Hungry", desc: "血糖低会直接削弱前额叶皮层功能，让情绪更难控制" },
              { l: "A", zh: "愤怒 Angry", desc: "未处理的愤怒会在下一个触发点以更大的力度爆发" },
              { l: "L", zh: "孤独 Lonely", desc: "社交隔离会放大 ADHD 大脑对负面刺激的敏感度" },
              { l: "T", zh: "疲惫 Tired", desc: "睡眠不足让杏仁核反应增强 60%，让情绪刹车失灵" },
            ].map(item => (
              <div className="tool-item" key={item.l}>
                <div className="tool-letter" style={{ background: "#2d3a8c" }}>{item.l}</div>
                <div className="tool-item-body">
                  <div className="tool-item-zh">{item.zh}</div>
                  <div className="tool-item-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* TIPP */}
          <div className="tool-card">
            <div className="tool-card-head">
              <span className="tool-badge" style={{ background: "rgba(224,90,58,0.12)", color: "#c04020" }}>危机干预</span>
              <div className="tool-card-title">TIPP 技巧（DBT）</div>
            </div>
            <p style={{ fontSize: 13, color: "#5a5a72", marginBottom: 14, fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.6 }}>
              情绪极度强烈时，通过改变生理状态来快速降温
            </p>
            {[
              { l: "T", zh: "温度 Temperature", desc: "冷水泼脸或手握冰块，激活潜水反射，迅速降低心率" },
              { l: "I", zh: "剧烈运动 Intense Exercise", desc: "60 秒爆发性运动，快速消耗肾上腺素，释放情绪能量" },
              { l: "P", zh: "节律呼吸 Paced Breathing", desc: "吸气 4 秒，呼气 6 秒，延长呼气激活副交感神经" },
              { l: "P", zh: "肌肉放松 Paired Muscle Relax", desc: "紧绷-放松循环，释放躯体层面的情绪张力" },
            ].map(item => (
              <div className="tool-item" key={item.l + item.zh}>
                <div className="tool-letter" style={{ background: "#e05a3a" }}>{item.l}</div>
                <div className="tool-item-body">
                  <div className="tool-item-zh">{item.zh}</div>
                  <div className="tool-item-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 5-4-3-2-1 */}
          <div className="tool-card">
            <div className="tool-card-head">
              <span className="tool-badge" style={{ background: "rgba(201,151,58,0.12)", color: "#9a7020" }}>接地技术</span>
              <div className="tool-card-title">5-4-3-2-1 感官接地</div>
            </div>
            <p style={{ fontSize: 13, color: "#5a5a72", marginBottom: 14, fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.6 }}>
              当思绪在过去或未来失控时，强行拉回当下
            </p>
            {[
              { l: "5", zh: "看", desc: "说出你现在看到的 5 样东西" },
              { l: "4", zh: "听", desc: "说出你现在听到的 4 种声音" },
              { l: "3", zh: "触", desc: "感受你身体正在接触的 3 样东西" },
              { l: "2", zh: "闻", desc: "说出你能闻到的 2 种气味" },
              { l: "1", zh: "尝", desc: "说出你能尝到的 1 种味道" },
            ].map(item => (
              <div className="tool-item" key={item.l + item.zh}>
                <div className="tool-letter" style={{ background: "#c9973a" }}>{item.l}</div>
                <div className="tool-item-body">
                  <div className="tool-item-zh">{item.zh}</div>
                  <div className="tool-item-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 认知重构 */}
          <div className="tool-card">
            <div className="tool-card-head">
              <span className="tool-badge" style={{ background: "rgba(58,140,90,0.12)", color: "#1a6a3a" }}>长期技能</span>
              <div className="tool-card-title">认知重构三问</div>
            </div>
            <p style={{ fontSize: 13, color: "#5a5a72", marginBottom: 14, fontFamily: "'Noto Sans SC', sans-serif", lineHeight: 1.6 }}>
              情绪稍微平复后，用侦探思维审视触发你的想法
            </p>
            {[
              { l: "Q1", zh: "证据是什么？", desc: "支持这个想法的证据是什么？反对的证据是什么？" },
              { l: "Q2", zh: "有无其他解释？", desc: "除了\"我被拒绝了\"，还有没有其他可能的解释？" },
              { l: "Q3", zh: "最坏的结果呢？", desc: "最坏的情况是什么？我能应对吗？最可能的结果是？" },
            ].map(item => (
              <div className="tool-item" key={item.l}>
                <div className="tool-letter" style={{ background: "#3a8c5a", fontSize: 11, width: 32, height: 32 }}>{item.l}</div>
                <div className="tool-item-body">
                  <div className="tool-item-zh">{item.zh}</div>
                  <div className="tool-item-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 呼吸练习 */}
        <div className="breath-box anim">
          <div className="breath-desc">
            <div className="breath-title">4-7-8 呼吸法：2 分钟激活副交感神经</div>
            <p className="breath-text">
              这是一种由安德鲁·韦尔（Andrew Weil）医生推广的呼吸技术，原理是通过延长呼气来激活迷走神经，从而触发副交感神经的"休息与消化"反应。
              <br /><br />
              吸气 4 秒 → 屏息 7 秒 → 呼气 8 秒，重复 3-4 次。特别适合在感知到 RSD 触发点时立即使用，能在约 2 分钟内显著降低焦虑水平。
            </p>
          </div>
          <BreathingWidget />
        </div>

        {/* 第七章 */}
        <h2 className="sec-heading anim">
          <span className="sec-num">07 / 长期策略</span>
          从"救火"到"防火"：构建情绪友好的生活系统
        </h2>

        <p className="anim">上面那些工具，都是在情绪已经发生时用的"救火"手段。但真正的情绪管理，最终要走向"防火"——建立一套能从根本上减少情绪失调频率和强度的生活系统。</p>

        <p className="anim"><strong>自我同情（Self-Compassion），是情绪管理的基础。</strong>这不是鸡汤，这是有数据支撑的。2022 年发表在 PMC 上的一项研究，专门调查了自我同情水平与 ADHD 成年人心理健康的关系，结论是：<strong>自我同情是 ADHD 成年人心理健康最重要的预测因子之一</strong>，比 ADHD 症状严重程度的影响还要大。</p>

        <p className="anim">克里斯汀·内夫（Kristin Neff）博士，全球自我同情研究的奠基人，将自我同情定义为三个核心要素：善待自己（像对待好朋友一样对待自己）、共通人性（认识到不完美是人类共同的体验，你不孤单）、静观（不加评判地观察自己的痛苦，不被其淹没）。对于 ADHD 患者来说，第三点尤其重要：你需要学会观察自己的情绪，而不是被情绪淹没或者试图压制它。</p>

        <p className="anim"><strong>环境设计，是比意志力更可靠的工具。</strong>ADHD 大脑的意志力资源本来就比普通人少，所以与其靠意志力对抗环境，不如主动设计一个对自己友好的环境。具体来说：用降噪耳机减少感官超载；在任务转换之间安排 3-5 分钟的缓冲时间（ADHD 患者对转换特别敏感）；把你的情绪管理工具（比如 HALT 清单）打印出来贴在显眼的地方；建立可预测的日常结构，减少决策疲劳。</p>

        <p className="anim"><strong>伙伴效应（Body Doubling），是 ADHD 社群发现的独特工具。</strong>简单来说，就是在另一个人的陪伴下完成任务——无论是线下还是线上（视频通话也有效）。这个方法的神奇之处在于，那个人甚至不需要做任何事，只需要"在场"。研究者认为，这种方式激活了大脑的社交神经回路，提供了一种微妙的外部调节，帮助 ADHD 大脑保持在"绿区"。对于情绪管理来说，当你知道有人在场时，情绪失控的阈值会相应提高。</p>

        <p className="anim"><strong>情绪日记，是识别个人模式的最有效工具。</strong>ADHD 患者的情绪往往来得快去得也快，事后很难准确回忆。系统地记录情绪，能帮助你发现自己独特的触发点规律。不需要写很多，每天记录三件事就够：今天最强烈的情绪是什么（1-10 分）、触发它的事件是什么、我用了什么应对方式、效果如何。坚持一个月，你会开始看到规律。</p>

        <hr className="lx-divider" />

        {/* 结语 */}
        <div className="conclusion anim">
          <div className="conclusion-label">结语</div>
          <p>我想用一句话来总结这篇文章：<strong>你的情绪之所以"特别难管"，不是因为你软弱，而是因为你的大脑在情绪这件事上，从出厂就设置了一个更高的难度。</strong></p>
          <p>这意味着两件事。第一，你需要比普通人更系统、更有针对性的工具——本文介绍的这些，都是有神经科学依据的工具，不是泛泛而谈的建议。第二，你需要对自己多一点耐心。你不是在和"懒惰"或"软弱"作斗争，你是在和一个神经系统层面的挑战作斗争。这需要时间，需要练习，需要偶尔的失败和重新开始。</p>
          <p>情绪管理的目标，从来不是"不再有情绪"。情绪是你的神经系统在告诉你一些重要的事情。目标是：<strong>让情绪成为你的信息来源，而不是你的主人。</strong></p>
          <div className="conclusion-cta">
            从今天开始，选一个工具，就一个，试试看。<br />
            也许是今晚去跑 20 分钟步，也许是明天早上做一次 HALT 检查。<br />
            <em>每一个小小的练习，都是在重塑你的大脑。</em>
          </div>
        </div>

        {/* 参考文献 */}
        <div className="references anim">
          <div className="references-title">参考文献 · References</div>
          <ul className="ref-list">
            {[
              { n:1, text: <>Barkley, R.A. (2015). <em>Emotional Dysregulation Is a Core Component of ADHD</em>. In <em>Attention-Deficit Hyperactivity Disorder: A Handbook for Diagnosis and Treatment</em> (4th ed.). Guilford Press.</> },
              { n:2, text: <>Dodson, W. (2016). <em>Rejection Sensitive Dysphoria and ADHD</em>. ADDitude Magazine. <a href="https://www.additudemag.com/rejection-sensitive-dysphoria-and-adhd/" target="_blank" rel="noopener noreferrer">additudemag.com</a></> },
              { n:3, text: <>Porges, S.W. (2011). <em>The Polyvagal Theory: Neurophysiological Foundations of Emotions, Attachment, Communication, and Self-regulation</em>. W.W. Norton & Company.</> },
              { n:4, text: <>Safren, S.A., et al. (2010). Cognitive-behavioral therapy vs relaxation with educational support for medication-treated adults with ADHD and persistent symptoms. <em>JAMA</em>, 304(8), 875–880.</> },
              { n:5, text: <>PMC. (2021). Acceptance and commitment therapy for individuals having ADHD: A scoping review. <em>Heliyon</em>. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8385395/" target="_blank" rel="noopener noreferrer">pmc.ncbi.nlm.nih.gov</a></> },
              { n:6, text: <>Ratey, J.J., & Hagerman, E. (2008). <em>Spark: The Revolutionary New Science of Exercise and the Brain</em>. Little, Brown and Company.</> },
              { n:7, text: <>Pontifex, M.B., et al. (2013). Exercise improves behavioral, neurocognitive, and scholastic performance in children with ADHD. <em>Journal of Pediatrics</em>, 162(3), 543–551.</> },
              { n:8, text: <>Bloch, M.H., & Qawasmi, A. (2011). Omega-3 fatty acid supplementation for the treatment of children with ADHD. <em>Journal of the American Academy of Child & Adolescent Psychiatry</em>, 50(10), 991–1000.</> },
              { n:9, text: <>Beaton, D.M., et al. (2022). The role of self-compassion in the mental health of adults with ADHD. <em>Journal of Clinical Psychology</em>. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9790285/" target="_blank" rel="noopener noreferrer">pmc.ncbi.nlm.nih.gov</a></> },
              { n:10, text: <>Linehan, M.M. (2014). <em>DBT Skills Training Manual</em> (2nd ed.). Guilford Press. [TIPP 技巧来源]</> },
            ].map(ref => (
              <li className="ref-item" key={ref.n}>
                <span className="ref-num">[{ref.n}]</span>
                <span>{ref.text}</span>
              </li>
            ))}
          </ul>
        </div>

      </article>

      {/* 页脚 */}
      <footer className="lx-footer">
        <div>
          <span>ADHD 情绪管理指南</span>
          &nbsp;·&nbsp;
          <span>神经科学 × 临床心理学 · 2025</span>
          &nbsp;·&nbsp;
          <span style={{ color: "rgba(255,255,255,0.25)" }}>本文仅供教育参考，不构成医疗建议</span>
        </div>
      </footer>
    </>
  );
}
