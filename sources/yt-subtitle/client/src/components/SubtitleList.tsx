import { useCallback, useRef, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { toast } from "sonner";

export interface SubtitleEntry {
  text: string;
  offset: number;
  duration: number;
}

interface SubtitleListProps {
  entries: SubtitleEntry[];
}

function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function SubtitleList({ entries }: SubtitleListProps) {
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [isCopied, setIsCopied] = useState(false);

  // Touch drag selection state
  const isDragging = useRef(false);
  const dragStartIndex = useRef<number | null>(null);
  const dragMode = useRef<"select" | "deselect">("select");
  const lastDragIndex = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getIndexFromTouch = useCallback((clientY: number): number | null => {
    if (!containerRef.current) return null;
    for (let i = 0; i < itemRefs.current.length; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        return i;
      }
    }
    return null;
  }, []);

  const applyDragSelection = useCallback(
    (startIdx: number, endIdx: number, mode: "select" | "deselect") => {
      const min = Math.min(startIdx, endIdx);
      const max = Math.max(startIdx, endIdx);
      setSelectedIndices((prev) => {
        const next = new Set(prev);
        for (let i = min; i <= max; i++) {
          if (mode === "select") next.add(i);
          else next.delete(i);
        }
        return next;
      });
    },
    []
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent, index: number) => {
      isDragging.current = true;
      dragStartIndex.current = index;
      lastDragIndex.current = index;
      dragMode.current = selectedIndices.has(index) ? "deselect" : "select";
      // Immediately toggle the tapped item
      setSelectedIndices((prev) => {
        const next = new Set(prev);
        if (dragMode.current === "select") next.add(index);
        else next.delete(index);
        return next;
      });
    },
    [selectedIndices]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || dragStartIndex.current === null) return;
      e.preventDefault();
      const touch = e.touches[0];
      const idx = getIndexFromTouch(touch.clientY);
      if (idx === null || idx === lastDragIndex.current) return;
      lastDragIndex.current = idx;
      applyDragSelection(dragStartIndex.current, idx, dragMode.current);
    },
    [getIndexFromTouch, applyDragSelection]
  );

  const handleTouchEnd = useCallback(() => {
    isDragging.current = false;
    dragStartIndex.current = null;
    lastDragIndex.current = null;
  }, []);

  // Mouse handlers for desktop
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      dragStartIndex.current = index;
      lastDragIndex.current = index;
      dragMode.current = selectedIndices.has(index) ? "deselect" : "select";
      setSelectedIndices((prev) => {
        const next = new Set(prev);
        if (dragMode.current === "select") next.add(index);
        else next.delete(index);
        return next;
      });
    },
    [selectedIndices]
  );

  const handleMouseEnter = useCallback(
    (index: number) => {
      if (!isDragging.current || dragStartIndex.current === null) return;
      if (index === lastDragIndex.current) return;
      lastDragIndex.current = index;
      applyDragSelection(dragStartIndex.current, index, dragMode.current);
    },
    [applyDragSelection]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
    dragStartIndex.current = null;
    lastDragIndex.current = null;
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIndices(new Set());
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIndices(new Set(entries.map((_, i) => i)));
  }, [entries]);

  const copySelected = useCallback(async () => {
    if (selectedIndices.size === 0) return;
    const sorted = Array.from(selectedIndices).sort((a, b) => a - b);
    const text = sorted.map((i) => entries[i].text).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      toast.success(`已复制 ${selectedIndices.size} 句字幕`, {
        description: text.length > 60 ? text.slice(0, 60) + "…" : text,
        duration: 2500,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("复制失败，请手动选择文本");
    }
  }, [selectedIndices, entries]);

  const hasSelection = selectedIndices.size > 0;

  return (
    <div className="flex flex-col gap-3">
      {/* Selection toolbar */}
      <div
        className="flex items-center justify-between px-4 py-2 rounded-xl border-2 border-black"
        style={{ background: "oklch(0.93 0.13 100)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-700 text-black">
            {hasSelection ? (
              <span className="font-bold">{selectedIndices.size} 句已选</span>
            ) : (
              <span className="text-black/60 font-medium">滑动选择字幕</span>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {hasSelection && (
            <button
              onClick={clearSelection}
              className="flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-black text-xs font-bold bg-white active:scale-95 transition-transform"
            >
              <X size={12} />
              清除
            </button>
          )}
          <button
            onClick={selectAll}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border-2 border-black text-xs font-bold bg-white active:scale-95 transition-transform"
          >
            全选
          </button>
          <button
            onClick={copySelected}
            disabled={!hasSelection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-black text-sm font-bold transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: hasSelection ? "oklch(0.12 0 0)" : "oklch(0.7 0 0)",
              color: "white",
              boxShadow: hasSelection ? "3px 3px 0 oklch(0.4 0 0)" : "none",
            }}
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            {isCopied ? "已复制!" : "复制"}
          </button>
        </div>
      </div>

      {/* Subtitle list */}
      <div
        ref={containerRef}
        className="flex flex-col gap-1.5 no-select"
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
        style={{ touchAction: "pan-y" }}
      >
        {entries.map((entry, index) => {
          const isSelected = selectedIndices.has(index);
          return (
            <div
              key={index}
              ref={(el) => { itemRefs.current[index] = el; }}
              onTouchStart={(e) => handleTouchStart(e, index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={(e) => handleMouseDown(e, index)}
              onMouseEnter={() => handleMouseEnter(index)}
              className="flex gap-3 items-start px-3 py-2.5 rounded-xl border-2 transition-all duration-100 cursor-pointer"
              style={{
                borderColor: isSelected ? "oklch(0.12 0 0)" : "oklch(0.85 0 0)",
                background: isSelected
                  ? "oklch(0.93 0.13 100)"
                  : "white",
                boxShadow: isSelected ? "3px 3px 0 oklch(0.12 0 0)" : "none",
                transform: isSelected ? "translate(-1px, -1px)" : "none",
              }}
            >
              {/* Timestamp */}
              <span
                className="shrink-0 text-xs font-bold mt-0.5 px-1.5 py-0.5 rounded-md border border-black/20"
                style={{
                  fontFamily: "'Space Grotesk', monospace",
                  background: isSelected ? "oklch(0.88 0.10 160)" : "oklch(0.95 0.02 45)",
                  color: "oklch(0.20 0 0)",
                  minWidth: "44px",
                  textAlign: "center",
                }}
              >
                {formatTime(entry.offset)}
              </span>
              {/* Text */}
              <span
                className="flex-1 text-sm leading-relaxed"
                style={{
                  color: "oklch(0.12 0 0)",
                  fontWeight: isSelected ? 600 : 400,
                }}
              >
                {entry.text}
              </span>
              {/* Selection indicator */}
              {isSelected && (
                <div
                  className="shrink-0 mt-0.5 rounded-full flex items-center justify-center"
                  style={{
                    width: 18,
                    height: 18,
                    background: "oklch(0.12 0 0)",
                    border: "2px solid oklch(0.12 0 0)",
                  }}
                >
                  <Check size={10} color="white" strokeWidth={3} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
