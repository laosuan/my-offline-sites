import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";

/**
 * 从各种格式的 YouTube URL 中提取视频 ID
 * 支持: youtube.com/watch?v=xxx, youtu.be/xxx, youtube.com/shorts/xxx,
 *       youtube.com/embed/xxx, m.youtube.com/watch?v=xxx
 */
export function extractVideoId(url: string): string | null {
  const trimmed = url.trim();

  // 直接是 11 位视频 ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
    /(?:m\.youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

export interface SubtitleEntry {
  text: string;
  offset: number; // milliseconds
  duration: number; // milliseconds
}

export interface LanguageOption {
  code: string;
  label: string;
  isAuto: boolean;
}

// 语言代码到中文名称的映射
const LANGUAGE_NAMES: Record<string, string> = {
  zh: "中文（简体）",
  "zh-Hans": "中文（简体）",
  "zh-CN": "中文（简体）",
  "zh-Hant": "中文（繁体）",
  "zh-TW": "中文（繁体）",
  "zh-HK": "中文（香港）",
  en: "英语",
  "en-US": "英语（美国）",
  "en-GB": "英语（英国）",
  ja: "日语",
  ko: "韩语",
  fr: "法语",
  de: "德语",
  es: "西班牙语",
  "es-419": "西班牙语（拉丁美洲）",
  pt: "葡萄牙语",
  "pt-BR": "葡萄牙语（巴西）",
  ru: "俄语",
  ar: "阿拉伯语",
  hi: "印地语",
  it: "意大利语",
  nl: "荷兰语",
  pl: "波兰语",
  tr: "土耳其语",
  vi: "越南语",
  th: "泰语",
  id: "印度尼西亚语",
  ms: "马来语",
  uk: "乌克兰语",
  cs: "捷克语",
  sv: "瑞典语",
  da: "丹麦语",
  fi: "芬兰语",
  no: "挪威语",
  ro: "罗马尼亚语",
  hu: "匈牙利语",
  el: "希腊语",
  he: "希伯来语",
  bg: "保加利亚语",
  hr: "克罗地亚语",
  sk: "斯洛伐克语",
  sl: "斯洛文尼亚语",
  sr: "塞尔维亚语",
  ca: "加泰罗尼亚语",
  lt: "立陶宛语",
  lv: "拉脱维亚语",
  et: "爱沙尼亚语",
  fa: "波斯语",
  bn: "孟加拉语",
  ta: "泰米尔语",
  te: "泰卢固语",
  ml: "马拉雅拉姆语",
  mr: "马拉地语",
  ur: "乌尔都语",
};

function getLanguageLabel(code: string): string {
  return LANGUAGE_NAMES[code] || code;
}

const BROWSER_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/**
 * 构建请求头，可选附带 Cookie
 */
function buildHeaders(extra: Record<string, string> = {}, cookie?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": BROWSER_UA,
    "Accept-Language": "en-US,en;q=0.9",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    ...extra,
  };
  if (cookie) {
    headers["Cookie"] = cookie;
  }
  return headers;
}

/**
 * 从 YouTube 页面 HTML 提取 Innertube 上下文
 */
async function getInnertubeContext(videoId: string, cookie?: string): Promise<{
  apiKey: string;
  clientVersion: string;
  visitorData: string;
  html: string;
  isLoginRequired: boolean;
}> {
  const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
    headers: buildHeaders({}, cookie),
  });

  const html = await response.text();

  const apiKey =
    html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1] || "AIzaSyAO_FJ2SlqU8Q4STtV1yaaNkFki-Ry_oCo";
  const clientVersion =
    html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1] || "2.20260101.01.00";
  const visitorData = html.match(/"visitorData":"([^"]+)"/)?.[1] || "";

  // 检测是否需要登录（bot 检测 / 受限视频）
  const isLoginRequired =
    html.includes('"status":"LOGIN_REQUIRED"') ||
    (html.includes("LOGIN_REQUIRED") && html.includes("bot"));

  return { apiKey, clientVersion, visitorData, html, isLoginRequired };
}

/**
 * 从 HTML 中提取字幕轨道列表
 */
function extractCaptionTracksFromHtml(html: string): Array<{
  languageCode: string;
  name?: string;
  kind?: string;
  baseUrl: string;
}> {
  const parts = html.split('"captions":');
  if (parts.length <= 1) return [];

  try {
    // 找到 captions 对象的结束位置
    let depth = 0;
    let start = -1;
    let end = -1;
    for (let i = 0; i < parts[1].length; i++) {
      if (parts[1][i] === "{") {
        if (depth === 0) start = i;
        depth++;
      } else if (parts[1][i] === "}") {
        depth--;
        if (depth === 0) {
          end = i + 1;
          break;
        }
      }
    }
    if (start === -1 || end === -1) return [];

    const captionsJson = JSON.parse(parts[1].slice(start, end));
    const rawTracks = captionsJson?.playerCaptionsTracklistRenderer?.captionTracks;
    if (!rawTracks || rawTracks.length === 0) return [];

    return rawTracks.map((t: {
      languageCode: string;
      name?: { simpleText?: string };
      kind?: string;
      baseUrl: string;
    }) => ({
      languageCode: t.languageCode,
      name: t.name?.simpleText,
      kind: t.kind,
      baseUrl: t.baseUrl,
    }));
  } catch {
    return [];
  }
}

/**
 * 通过 Innertube /next API 获取字幕面板的 continuation params
 */
async function fetchTranscriptContinuationParams(
  videoId: string,
  apiKey: string,
  clientVersion: string,
  visitorData: string,
  cookie?: string
): Promise<string | undefined> {
  const nextResponse = await fetch(
    `https://www.youtube.com/youtubei/v1/next?key=${apiKey}&prettyPrint=false`,
    {
      method: "POST",
      headers: buildHeaders({
        "Content-Type": "application/json",
        "X-YouTube-Client-Name": "1",
        "X-YouTube-Client-Version": clientVersion,
        "X-Goog-Visitor-Id": visitorData,
        Origin: "https://www.youtube.com",
        Referer: `https://www.youtube.com/watch?v=${videoId}`,
      }, cookie),
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion,
            visitorData,
            hl: "en",
            gl: "US",
          },
        },
        videoId,
      }),
    }
  );

  const nextData = await nextResponse.json() as {
    engagementPanels?: Array<{
      engagementPanelSectionListRenderer?: {
        panelIdentifier?: string;
        content?: {
          continuationItemRenderer?: {
            continuationEndpoint?: {
              getTranscriptEndpoint?: {
                params?: string;
              };
            };
          };
        };
      };
    }>;
  };

  const panels = nextData?.engagementPanels || [];
  const transcriptPanel = panels.find(
    (p) =>
      p?.engagementPanelSectionListRenderer?.panelIdentifier ===
      "engagement-panel-searchable-transcript"
  );

  return transcriptPanel?.engagementPanelSectionListRenderer?.content
    ?.continuationItemRenderer?.continuationEndpoint?.getTranscriptEndpoint?.params;
}

/**
 * 通过 get_transcript API 获取字幕内容（需要 Cookie 才能解锁受限视频）
 */
async function fetchTranscriptViaGetTranscript(
  videoId: string,
  params: string,
  apiKey: string,
  clientVersion: string,
  visitorData: string,
  cookie?: string
): Promise<SubtitleEntry[]> {
  const transcriptResp = await fetch(
    `https://www.youtube.com/youtubei/v1/get_transcript?key=${apiKey}&prettyPrint=false`,
    {
      method: "POST",
      headers: buildHeaders({
        "Content-Type": "application/json",
        "X-YouTube-Client-Name": "1",
        "X-YouTube-Client-Version": clientVersion,
        "X-Goog-Visitor-Id": visitorData,
        Origin: "https://www.youtube.com",
        Referer: `https://www.youtube.com/watch?v=${videoId}`,
      }, cookie),
      body: JSON.stringify({
        context: {
          client: {
            clientName: "WEB",
            clientVersion,
            visitorData,
            hl: "en",
            gl: "US",
          },
        },
        params,
      }),
    }
  );

  const transcriptData = await transcriptResp.json() as {
    actions?: Array<{
      updateEngagementPanelAction?: {
        content?: {
          transcriptRenderer?: {
            content?: {
              transcriptSearchPanelRenderer?: {
                body?: {
                  transcriptSegmentListRenderer?: {
                    initialSegments?: Array<{
                      transcriptSegmentRenderer?: {
                        startMs?: string;
                        endMs?: string;
                        snippet?: {
                          runs?: Array<{ text?: string }>;
                        };
                      };
                    }>;
                  };
                };
              };
            };
          };
        };
      };
    }>;
    error?: { code?: number; message?: string; status?: string };
  };

  if (transcriptData.error) {
    const status = transcriptData.error.status;
    if (status === "FAILED_PRECONDITION" || status === "UNAUTHENTICATED") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "LOGIN_REQUIRED",
      });
    }
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "无法获取字幕内容",
    });
  }

  const content =
    transcriptData?.actions?.[0]?.updateEngagementPanelAction?.content;
  const segments =
    content?.transcriptRenderer?.content?.transcriptSearchPanelRenderer
      ?.body?.transcriptSegmentListRenderer?.initialSegments;

  if (!segments || segments.length === 0) {
    return [];
  }

  return segments
    .map((s) => {
      const seg = s.transcriptSegmentRenderer;
      if (!seg) return null;
      const text = seg.snippet?.runs?.map((r) => r.text || "").join("") || "";
      const offset = parseInt(seg.startMs || "0");
      const duration = parseInt(seg.endMs || "0") - offset;
      return { text: text.trim(), offset, duration };
    })
    .filter((e): e is SubtitleEntry => e !== null && e.text.length > 0);
}

/**
 * 解析 JSON3 格式字幕
 */
function parseJson3Subtitles(json3Data: {
  events?: Array<{
    tStartMs?: number;
    dDurationMs?: number;
    segs?: Array<{ utf8?: string; tOffsetMs?: number }>;
  }>;
}): SubtitleEntry[] {
  const entries: SubtitleEntry[] = [];
  const events = json3Data.events || [];

  for (const event of events) {
    if (!event.segs) continue;
    const text = event.segs
      .map((s) => s.utf8 || "")
      .join("")
      .replace(/\n/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    if (text && text !== " ") {
      entries.push({
        text,
        offset: event.tStartMs || 0,
        duration: event.dDurationMs || 0,
      });
    }
  }

  return entries;
}

/**
 * 解析 VTT 格式字幕
 */
function parseVttSubtitles(vttContent: string): SubtitleEntry[] {
  const lines = vttContent.split("\n");
  const entries: SubtitleEntry[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    const timeMatch = line.match(
      /^(\d{2}:)?(\d{2}):(\d{2})\.(\d{3})\s+-->\s+(\d{2}:)?(\d{2}):(\d{2})\.(\d{3})/
    );
    if (timeMatch) {
      const startHours = timeMatch[1] ? parseInt(timeMatch[1]) : 0;
      const startMins = parseInt(timeMatch[2]);
      const startSecs = parseInt(timeMatch[3]);
      const startMs = parseInt(timeMatch[4]);
      const startOffset = (startHours * 3600 + startMins * 60 + startSecs) * 1000 + startMs;

      const endHours = timeMatch[5] ? parseInt(timeMatch[5]) : 0;
      const endMins = parseInt(timeMatch[6]);
      const endSecs = parseInt(timeMatch[7]);
      const endMs = parseInt(timeMatch[8]);
      const endOffset = (endHours * 3600 + endMins * 60 + endSecs) * 1000 + endMs;

      i++;
      const textLines: string[] = [];
      while (i < lines.length && lines[i].trim() !== "") {
        textLines.push(lines[i].trim());
        i++;
      }

      const text = textLines
        .join(" ")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();

      if (text) {
        entries.push({
          text,
          offset: startOffset,
          duration: endOffset - startOffset,
        });
      }
    } else {
      i++;
    }
  }

  return entries;
}

/**
 * 通过字幕 baseUrl 获取字幕内容
 */
async function fetchSubtitleContent(baseUrl: string, cookie?: string): Promise<SubtitleEntry[]> {
  const json3Url = baseUrl.includes("fmt=") ? baseUrl : `${baseUrl}&fmt=json3`;
  const response = await fetch(json3Url, {
    headers: buildHeaders({}, cookie),
  });

  if (!response.ok) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "获取字幕内容失败",
    });
  }

  const text = await response.text();

  if (!text || text.trim().length === 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "字幕内容为空",
    });
  }

  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("json") || text.trim().startsWith("{")) {
    try {
      const json3Data = JSON.parse(text);
      return parseJson3Subtitles(json3Data);
    } catch {
      // 继续尝试 VTT
    }
  }

  if (text.includes("WEBVTT") || text.includes("-->")) {
    return parseVttSubtitles(text);
  }

  // XML (ttml/srv 格式)
  const xmlMatches = Array.from(
    text.matchAll(/<text[^>]+start="([^"]+)"[^>]+dur="([^"]+)"[^>]*>([^<]*)<\/text>/g)
  );
  if (xmlMatches.length > 0) {
    return xmlMatches
      .map((m) => ({
        text: m[3]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .trim(),
        offset: Math.round(parseFloat(m[1]) * 1000),
        duration: Math.round(parseFloat(m[2]) * 1000),
      }))
      .filter((e) => e.text);
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "无法解析字幕格式",
  });
}

export const subtitleRouter = router({
  /**
   * 获取视频可用字幕语言列表
   * 支持普通视频和需要 Cookie 的受限视频
   */
  getLanguages: publicProcedure
    .input(z.object({
      url: z.string().min(1),
      cookie: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const videoId = extractVideoId(input.url);
      if (!videoId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "无效的 YouTube 链接，请检查后重试",
        });
      }

      try {
        const { apiKey, clientVersion, visitorData, html, isLoginRequired } =
          await getInnertubeContext(videoId, input.cookie);

        // 如果需要登录但没有提供 Cookie
        if (isLoginRequired && !input.cookie) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "LOGIN_REQUIRED",
          });
        }

        // 从 HTML 提取字幕轨道
        let captionTracks = extractCaptionTracksFromHtml(html);

        // 如果没有从 HTML 获取到，尝试通过 /next API
        let transcriptContinuationParams: string | undefined;
        if (captionTracks.length === 0) {
          transcriptContinuationParams = await fetchTranscriptContinuationParams(
            videoId, apiKey, clientVersion, visitorData, input.cookie
          );
        }

        const seen = new Set<string>();
        const languages: LanguageOption[] = [];

        for (const track of captionTracks) {
          const code = track.languageCode;
          if (!seen.has(code)) {
            seen.add(code);
            const isAuto = track.kind === "asr";
            const label = track.name
              ? `${track.name}${isAuto ? "（自动）" : ""}`
              : getLanguageLabel(code) + (isAuto ? "（自动）" : "");
            languages.push({ code, label, isAuto });
          }
        }

        // 如果有 continuation params 但没有轨道列表，添加默认英文选项
        if (languages.length === 0 && transcriptContinuationParams) {
          languages.push({ code: "en", label: "英语", isAuto: false });
        }

        if (languages.length === 0 && !transcriptContinuationParams) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "该视频没有可用的字幕",
          });
        }

        return {
          videoId,
          languages,
          hasContinuationParams: !!transcriptContinuationParams,
          continuationParams: transcriptContinuationParams,
        };
      } catch (err: unknown) {
        if (err instanceof TRPCError) throw err;
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取字幕语言列表失败，请稍后重试",
        });
      }
    }),

  /**
   * 获取指定语言的字幕内容
   * 支持普通视频和需要 Cookie 的受限视频
   */
  getSubtitles: publicProcedure
    .input(
      z.object({
        videoId: z.string().min(1),
        languageCode: z.string().min(1),
        continuationParams: z.string().optional(),
        cookie: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      try {
        const { apiKey, clientVersion, visitorData, html, isLoginRequired } =
          await getInnertubeContext(input.videoId, input.cookie);

        if (isLoginRequired && !input.cookie) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "LOGIN_REQUIRED",
          });
        }

        // 从 HTML 提取字幕轨道
        const captionTracks = extractCaptionTracksFromHtml(html);
        const track = captionTracks.find((t) => t.languageCode === input.languageCode);

        if (track?.baseUrl) {
          // 方式 1：直接通过 baseUrl 获取字幕
          const entries = await fetchSubtitleContent(track.baseUrl, input.cookie);
          return { entries };
        }

        // 方式 2：使用 continuation params 通过 get_transcript API
        let params = input.continuationParams;
        if (!params) {
          params = await fetchTranscriptContinuationParams(
            input.videoId, apiKey, clientVersion, visitorData, input.cookie
          );
        }

        if (!params) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `找不到语言代码为 "${input.languageCode}" 的字幕内容`,
          });
        }

        const entries = await fetchTranscriptViaGetTranscript(
          input.videoId, params, apiKey, clientVersion, visitorData, input.cookie
        );

        return { entries };
      } catch (err: unknown) {
        if (err instanceof TRPCError) throw err;
        const message = err instanceof Error ? err.message : String(err);
        if (message.includes("Could not find") || message.includes("No transcripts")) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `找不到语言代码为 "${input.languageCode}" 的字幕内容`,
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取字幕内容失败，请稍后重试",
        });
      }
    }),
});
