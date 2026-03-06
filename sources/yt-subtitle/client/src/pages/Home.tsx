import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Cookie,
  ExternalLink,
  Loader2,
  Search,
  Youtube,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import MemphisBackground from "@/components/MemphisBackground";
import SubtitleList from "@/components/SubtitleList";

interface LanguageOption {
  code: string;
  label: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [submittedUrl, setSubmittedUrl] = useState("");
  const [selectedLang, setSelectedLang] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Cookie mode
  const [cookie, setCookie] = useState("");
  const [submittedCookie, setSubmittedCookie] = useState("");
  const [showCookiePanel, setShowCookiePanel] = useState(false);
  const [needsCookie, setNeedsCookie] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const subtitleSectionRef = useRef<HTMLDivElement>(null);

  // Fetch languages
  const {
    data: langData,
    isLoading: isLoadingLangs,
    error: langError,
  } = trpc.subtitle.getLanguages.useQuery(
    { url: submittedUrl, cookie: submittedCookie || undefined },
    {
      enabled: submittedUrl.length > 0,
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch subtitles
  const {
    data: subtitleData,
    isLoading: isLoadingSubtitles,
    error: subtitleError,
  } = trpc.subtitle.getSubtitles.useQuery(
    { videoId, languageCode: selectedLang, cookie: submittedCookie || undefined },
    {
      enabled: videoId.length > 0 && selectedLang.length > 0,
      retry: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // When languages load, auto-select first
  const prevLangDataRef = useRef<typeof langData>(undefined);
  if (langData && langData !== prevLangDataRef.current) {
    prevLangDataRef.current = langData;
    if (langData.languages.length > 0 && langData.videoId) {
      setVideoId(langData.videoId);
      setSelectedLang(langData.languages[0].code);
      setNeedsCookie(false);
    }
  }

  // Detect LOGIN_REQUIRED error
  const isLoginRequired =
    (langError as { message?: string } | null)?.message === "LOGIN_REQUIRED" ||
    (subtitleError as { message?: string } | null)?.message === "LOGIN_REQUIRED";

  if (isLoginRequired && !needsCookie) {
    setNeedsCookie(true);
    setShowCookiePanel(true);
  }

  // Scroll to subtitle section when subtitles load
  const prevSubtitleRef = useRef<typeof subtitleData>(undefined);
  if (subtitleData && subtitleData !== prevSubtitleRef.current) {
    prevSubtitleRef.current = subtitleData;
    setTimeout(() => {
      subtitleSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = url.trim();
      if (!trimmed) return;
      setSelectedLang("");
      setVideoId("");
      setNeedsCookie(false);
      prevLangDataRef.current = undefined;
      prevSubtitleRef.current = undefined;
      setSubmittedUrl(trimmed);
      inputRef.current?.blur();
    },
    [url]
  );

  const handleCookieSubmit = useCallback(() => {
    const trimmed = cookie.trim();
    if (!trimmed) return;
    setSelectedLang("");
    setVideoId("");
    setNeedsCookie(false);
    prevLangDataRef.current = undefined;
    prevSubtitleRef.current = undefined;
    setSubmittedCookie(trimmed);
    // Re-trigger query by re-setting submitted url
    setSubmittedUrl((prev) => prev + " ");
    setTimeout(() => setSubmittedUrl((prev) => prev.trim()), 10);
  }, [cookie]);

  const handleLangSelect = useCallback((code: string) => {
    setSelectedLang(code);
    setIsLangOpen(false);
  }, []);

  const selectedLangLabel =
    langData?.languages.find((l: LanguageOption) => l.code === selectedLang)?.label || "";

  const isLoading = isLoadingLangs || isLoadingSubtitles;
  const displayError = isLoginRequired ? null : (langError || subtitleError);
  const errorMessage =
    (displayError as { message?: string } | null)?.message ||
    (displayError instanceof Error ? displayError.message : null) ||
    "发生未知错误，请重试";

  return (
    <div className="min-h-screen relative" style={{ background: "oklch(0.96 0.04 45)" }}>
      <MemphisBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-10 pb-6 px-5 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <div
              className="flex items-center justify-center rounded-2xl border-2 border-black"
              style={{
                width: 48,
                height: 48,
                background: "oklch(0.72 0.18 30)",
                boxShadow: "3px 3px 0 black",
              }}
            >
              <Youtube size={24} color="white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "oklch(0.45 0 0)" }}
              >
                字幕提取器
              </span>
              <span
                className="text-xl font-black uppercase tracking-tight leading-none"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.10 0 0)" }}
              >
                SubGrab
              </span>
            </div>
          </div>

          <h1
            className="text-3xl font-black uppercase leading-tight mb-2"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.10 0 0)",
              textShadow: "3px 3px 0 oklch(0.85 0.12 290)",
              letterSpacing: "-0.02em",
            }}
          >
            YouTube
            <br />
            字幕提取
          </h1>
          <p className="text-sm font-medium" style={{ color: "oklch(0.40 0 0)" }}>
            粘贴链接 · 选语言 · 滑动多选 · 一键复制
          </p>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 pb-10 flex flex-col gap-5 max-w-lg mx-auto w-full">
          {/* Input card */}
          <div className="memphis-card p-4">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label
                htmlFor="yt-url"
                className="text-xs font-black uppercase tracking-wider"
                style={{ color: "oklch(0.45 0 0)" }}
              >
                YouTube 视频链接
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="yt-url"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  placeholder="https://youtube.com/watch?v=..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-xl border-2 border-black text-sm font-medium bg-white focus:outline-none focus:ring-0 transition-shadow"
                  style={{ fontFamily: "'Space Grotesk', monospace" }}
                  onFocus={(e) => (e.target.style.boxShadow = "3px 3px 0 oklch(0.12 0 0)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                <button
                  type="submit"
                  disabled={!url.trim() || isLoading}
                  className="memphis-btn px-4 py-2.5 flex items-center gap-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "oklch(0.12 0 0)", color: "white" }}
                >
                  {isLoading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Search size={16} />
                  )}
                  <span className="hidden sm:inline">提取</span>
                </button>
              </div>

              {/* Quick examples */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs font-bold" style={{ color: "oklch(0.55 0 0)" }}>
                  支持格式:
                </span>
                {["youtube.com/watch?v=", "youtu.be/", "youtube.com/shorts/"].map((fmt) => (
                  <span
                    key={fmt}
                    className="text-xs px-2 py-0.5 rounded-full border border-black/20 font-mono"
                    style={{ background: "oklch(0.93 0.06 45)", color: "oklch(0.35 0 0)" }}
                  >
                    {fmt}
                  </span>
                ))}
              </div>
            </form>
          </div>

          {/* Cookie panel - shown when LOGIN_REQUIRED or manually toggled */}
          {(needsCookie || showCookiePanel) && (
            <div
              className="memphis-card p-4 flex flex-col gap-3"
              style={{
                borderColor: "oklch(0.65 0.15 260)",
                boxShadow: "5px 5px 0 oklch(0.65 0.15 260)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-xl border-2 border-black flex items-center justify-center shrink-0"
                    style={{ background: "oklch(0.85 0.12 290)" }}
                  >
                    <Cookie size={15} strokeWidth={2.5} />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider">
                    {needsCookie ? "该视频需要登录验证" : "Cookie 辅助模式"}
                  </span>
                </div>
                {!needsCookie && (
                  <button
                    onClick={() => setShowCookiePanel(false)}
                    className="text-xs font-bold px-2 py-1 rounded-lg border border-black/20 hover:bg-black/5"
                  >
                    收起
                  </button>
                )}
              </div>

              {needsCookie && (
                <div
                  className="rounded-xl border-2 border-black p-3 text-sm"
                  style={{ background: "oklch(0.97 0.04 290)" }}
                >
                  <p className="font-bold mb-1" style={{ color: "oklch(0.25 0 0)" }}>
                    YouTube 要求登录才能访问此视频的字幕
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "oklch(0.45 0 0)" }}>
                    请提供你的 YouTube Cookie，系统将以你的身份请求字幕数据。Cookie 仅用于本次请求，不会被存储。
                  </p>
                </div>
              )}

              {/* How to get cookie */}
              <details className="group">
                <summary
                  className="flex items-center gap-1.5 text-xs font-bold cursor-pointer select-none"
                  style={{ color: "oklch(0.45 0 0)" }}
                >
                  <span className="group-open:hidden">▶</span>
                  <span className="hidden group-open:inline">▼</span>
                  如何获取 YouTube Cookie？
                </summary>
                <div
                  className="mt-2 rounded-xl border border-black/15 p-3 text-xs leading-relaxed flex flex-col gap-2"
                  style={{ background: "oklch(0.98 0.02 45)", color: "oklch(0.35 0 0)" }}
                >
                  <p className="font-bold">方法一：使用浏览器开发者工具</p>
                  <ol className="list-decimal list-inside flex flex-col gap-1 pl-1">
                    <li>在浏览器中登录 YouTube</li>
                    <li>
                      按 <kbd className="px-1 py-0.5 rounded border border-black/20 bg-white font-mono">F12</kbd> 打开开发者工具
                    </li>
                    <li>切换到「Network（网络）」标签</li>
                    <li>刷新页面，点击任意 youtube.com 请求</li>
                    <li>在「Headers」中找到「Cookie」字段</li>
                    <li>复制整行 Cookie 值粘贴到下方</li>
                  </ol>
                  <p className="font-bold mt-1">方法二：使用 EditThisCookie 扩展</p>
                  <p>安装浏览器扩展「EditThisCookie」，访问 YouTube 后导出所有 Cookie 为 Header String 格式。</p>
                  <a
                    href="https://chromewebstore.google.com/detail/editthiscookie/fngmhnnpilhplaeedifhccceomclgfbg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold underline"
                    style={{ color: "oklch(0.50 0.15 260)" }}
                  >
                    <ExternalLink size={11} />
                    Chrome 扩展商店
                  </a>
                </div>
              </details>

              {/* Cookie input */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold" style={{ color: "oklch(0.45 0 0)" }}>
                  粘贴 Cookie 字符串
                </label>
                <textarea
                  rows={3}
                  placeholder="VISITOR_INFO1_LIVE=xxx; YSC=xxx; CONSENT=xxx; ..."
                  value={cookie}
                  onChange={(e) => setCookie(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border-2 border-black text-xs font-mono bg-white focus:outline-none resize-none"
                  style={{ lineHeight: "1.5" }}
                  onFocus={(e) => (e.target.style.boxShadow = "3px 3px 0 oklch(0.65 0.15 260)")}
                  onBlur={(e) => (e.target.style.boxShadow = "none")}
                />
                <button
                  onClick={handleCookieSubmit}
                  disabled={!cookie.trim() || isLoading}
                  className="memphis-btn py-2.5 flex items-center justify-center gap-2 text-sm font-black disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "oklch(0.65 0.15 260)", color: "white" }}
                >
                  {isLoading ? <Loader2 size={15} className="animate-spin" /> : <Cookie size={15} />}
                  使用 Cookie 重新提取
                </button>
              </div>
            </div>
          )}

          {/* Toggle cookie panel button (when no error) */}
          {!needsCookie && !showCookiePanel && submittedUrl && (
            <button
              onClick={() => setShowCookiePanel(true)}
              className="flex items-center justify-center gap-2 text-xs font-bold py-2 rounded-xl border-2 border-dashed border-black/30 hover:border-black/60 transition-colors"
              style={{ color: "oklch(0.50 0 0)" }}
            >
              <Cookie size={13} />
              视频需要登录？点击提供 Cookie
              <ChevronDown size={13} />
            </button>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="memphis-card p-6 flex flex-col items-center gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center animate-spin"
                  style={{ background: "oklch(0.88 0.10 160)", borderTopColor: "transparent" }}
                />
                <div className="flex flex-col">
                  <span className="font-black text-sm uppercase tracking-wide">
                    {isLoadingLangs ? "正在解析字幕语言..." : "正在加载字幕内容..."}
                  </span>
                  <span className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>
                    请稍等片刻
                  </span>
                </div>
              </div>
              <div className="w-full flex flex-col gap-2 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-10 rounded-xl animate-pulse"
                    style={{ background: "oklch(0.92 0.03 45)", width: `${85 - i * 5}%` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {displayError && !isLoading && (
            <div
              className="memphis-card p-4 flex items-start gap-3"
              style={{
                borderColor: "oklch(0.55 0.22 25)",
                boxShadow: "5px 5px 0 oklch(0.55 0.22 25)",
              }}
            >
              <div
                className="shrink-0 w-9 h-9 rounded-xl border-2 border-black flex items-center justify-center"
                style={{ background: "oklch(0.72 0.18 30)" }}
              >
                <AlertCircle size={18} color="white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-black text-sm uppercase tracking-wide text-black">
                  出错了
                </span>
                <span className="text-sm" style={{ color: "oklch(0.30 0 0)" }}>
                  {errorMessage}
                </span>
              </div>
            </div>
          )}

          {/* Language selector */}
          {langData && langData.languages.length > 0 && !isLoadingLangs && (
            <div className="memphis-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black uppercase tracking-wider"
                  style={{ color: "oklch(0.45 0 0)" }}
                >
                  字幕语言
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full border border-black/20 font-bold"
                  style={{ background: "oklch(0.88 0.10 160)" }}
                >
                  {langData.languages.length} 种可用
                </span>
              </div>

              <div className="relative">
                <button
                  onClick={() => setIsLangOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border-2 border-black bg-white text-sm font-bold transition-shadow"
                  style={{ boxShadow: isLangOpen ? "3px 3px 0 black" : "none" }}
                >
                  <span>{selectedLangLabel || "选择语言"}</span>
                  {isLangOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {isLangOpen && (
                  <div
                    className="absolute top-full left-0 right-0 mt-1 rounded-xl border-2 border-black bg-white overflow-hidden z-20"
                    style={{ boxShadow: "5px 5px 0 black", maxHeight: 220, overflowY: "auto" }}
                  >
                    {langData.languages.map((lang: LanguageOption) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangSelect(lang.code)}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-yellow-50 active:bg-yellow-100"
                        style={{
                          background:
                            selectedLang === lang.code ? "oklch(0.93 0.13 100)" : undefined,
                          fontWeight: selectedLang === lang.code ? 700 : 500,
                          borderBottom: "1px solid oklch(0.92 0 0)",
                        }}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subtitle list */}
          {subtitleData && subtitleData.entries.length > 0 && !isLoadingSubtitles && (
            <div ref={subtitleSectionRef} className="memphis-card p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-black uppercase tracking-wider"
                  style={{ color: "oklch(0.45 0 0)" }}
                >
                  字幕内容
                </span>
                <span
                  className="text-xs px-2 py-0.5 rounded-full border border-black/20 font-bold"
                  style={{ background: "oklch(0.85 0.12 290)" }}
                >
                  共 {subtitleData.entries.length} 句
                </span>
              </div>
              <SubtitleList entries={subtitleData.entries} />
            </div>
          )}

          {/* Empty state */}
          {subtitleData && subtitleData.entries.length === 0 && !isLoadingSubtitles && (
            <div className="memphis-card p-6 flex flex-col items-center gap-2 text-center">
              <div
                className="w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center mb-1"
                style={{ background: "oklch(0.93 0.13 100)" }}
              >
                <span className="text-2xl">📭</span>
              </div>
              <span className="font-black text-sm uppercase tracking-wide">该语言暂无字幕内容</span>
              <span className="text-xs" style={{ color: "oklch(0.55 0 0)" }}>
                请尝试切换其他语言
              </span>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center pb-6 px-4">
          <p className="text-xs font-medium" style={{ color: "oklch(0.60 0 0)" }}>
            SubGrab · 无需 API Key · Cookie 仅用于当次请求
          </p>
        </footer>
      </div>
    </div>
  );
}
