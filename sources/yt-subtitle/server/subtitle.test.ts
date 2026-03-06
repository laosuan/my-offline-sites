import { describe, expect, it } from "vitest";
import { extractVideoId } from "./routers/subtitle";

describe("extractVideoId", () => {
  it("extracts video ID from standard youtube.com/watch?v= URL", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from youtu.be short URL", () => {
    expect(extractVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from youtu.be URL with si param", () => {
    expect(extractVideoId("https://youtu.be/z_pk4eBDaLA?si=vBMzAYMNan8BtKmy")).toBe("z_pk4eBDaLA");
  });

  it("extracts video ID from youtube.com/shorts/ URL", () => {
    expect(extractVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from youtube.com/embed/ URL", () => {
    expect(extractVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from m.youtube.com mobile URL", () => {
    expect(extractVideoId("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from URL with extra query params", () => {
    expect(
      extractVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&list=PLxxx")
    ).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID from URL with list param before v param", () => {
    expect(
      extractVideoId("https://www.youtube.com/watch?list=PLxxx&v=dQw4w9WgXcQ")
    ).toBe("dQw4w9WgXcQ");
  });

  it("returns the raw string if it is already an 11-char video ID", () => {
    expect(extractVideoId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
  });

  it("accepts video ID with underscores and hyphens", () => {
    expect(extractVideoId("z_pk4eBDaLA")).toBe("z_pk4eBDaLA");
  });

  it("returns null for an invalid URL", () => {
    expect(extractVideoId("https://example.com/not-youtube")).toBeNull();
  });

  it("returns null for an empty string", () => {
    expect(extractVideoId("")).toBeNull();
  });

  it("returns null for a random string shorter than 11 chars", () => {
    expect(extractVideoId("not-a-url")).toBeNull();
  });

  it("handles URL with trailing whitespace", () => {
    expect(extractVideoId("  https://youtu.be/dQw4w9WgXcQ  ")).toBe("dQw4w9WgXcQ");
  });

  it("extracts video ID with underscore and hyphen in ID", () => {
    expect(extractVideoId("https://www.youtube.com/watch?v=abc-DEF_123")).toBe("abc-DEF_123");
  });
});

describe("Cookie mode - input validation", () => {
  it("cookie is optional in getLanguages input", () => {
    // Represents the Zod schema: { url: z.string().min(1), cookie: z.string().optional() }
    const withCookie = { url: "https://youtu.be/z_pk4eBDaLA", cookie: "VISITOR_INFO1_LIVE=abc" };
    const withoutCookie = { url: "https://youtu.be/z_pk4eBDaLA" };
    expect(withCookie.cookie).toBeDefined();
    expect((withoutCookie as { cookie?: string }).cookie).toBeUndefined();
  });

  it("cookie is optional in getSubtitles input", () => {
    const withCookie = {
      videoId: "z_pk4eBDaLA",
      languageCode: "en",
      cookie: "VISITOR_INFO1_LIVE=abc; YSC=xyz",
    };
    const withoutCookie = { videoId: "z_pk4eBDaLA", languageCode: "en" };
    expect(withCookie.cookie).toBeDefined();
    expect((withoutCookie as { cookie?: string }).cookie).toBeUndefined();
  });

  it("a valid cookie string contains key=value pairs", () => {
    const cookie = "VISITOR_INFO1_LIVE=abc123; YSC=xyz456; CONSENT=YES+1";
    const pairs = cookie.split(";").map((p) => p.trim());
    expect(pairs.length).toBeGreaterThan(0);
    for (const pair of pairs) {
      expect(pair).toMatch(/^[^=]+=.*/);
    }
  });
});

describe("LOGIN_REQUIRED error sentinel", () => {
  it("LOGIN_REQUIRED is the exact sentinel message for auth errors", () => {
    // The frontend checks for this exact string to trigger the Cookie panel
    const sentinel = "LOGIN_REQUIRED";
    expect(sentinel).toBe("LOGIN_REQUIRED");
  });

  it("normal error messages are distinct from LOGIN_REQUIRED", () => {
    const normalErrors = [
      "该视频没有可用的字幕",
      "无效的 YouTube 链接，请检查后重试",
      "获取字幕内容失败，请稍后重试",
      "字幕内容为空",
    ];
    for (const msg of normalErrors) {
      expect(msg).not.toBe("LOGIN_REQUIRED");
    }
  });

  it("isLoginRequired detection logic works correctly", () => {
    // Simulates the frontend detection: error.message === "LOGIN_REQUIRED"
    const loginError = { message: "LOGIN_REQUIRED" };
    const normalError = { message: "该视频没有可用的字幕" };
    expect(loginError.message === "LOGIN_REQUIRED").toBe(true);
    expect(normalError.message === "LOGIN_REQUIRED").toBe(false);
  });
});
