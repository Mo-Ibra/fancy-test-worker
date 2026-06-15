"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import {
  Pipette,
  Copy,
  Sparkles,
  RefreshCw,
  Grid3x3,
  Eye,
} from "lucide-react";
import { useT } from "@/context/TranslationProvider";
import { Color, ColorFormat, extractPalette, PaletteSize } from "@/funcs/image-tools/ColorPickerToolFuncs";
import DropZone from "@/components/image-tools/color-picker/DropZone";
import BreadCrumb from "@/components/BreadCrumb";
import Header from "@/components/Header";
import RelatedTools from "@/components/image-tools/RelatedTools";
import EyedropperCanvas from "@/components/image-tools/color-picker/EyedropperCanvas";
import ColorDetail from "@/components/image-tools/color-picker/ColorDetail";
import ColorCard from "@/components/image-tools/color-picker/ColorCard";
import HowToUse from "@/sections/HowToUse";
import FAQ from "@/sections/FAQ";
import Examples from "@/sections/Examples";

export default function ColorPickerTool() {
  const t = useT("image-tools/ColorPickerTool.json");

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [palette, setPalette] = useState<Color[]>([]);
  const [picked, setPicked] = useState<Color | null>(null);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [paletteSize, setPaletteSize] = useState<PaletteSize>(8);
  const [activeTab, setActiveTab] = useState<"palette" | "eyedropper">("palette");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      // Downsample for speed (max 200px for palette extraction)
      const scale = Math.min(1, 200 / Math.max(img.naturalWidth, img.naturalHeight));
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
      setImageSrc(url);
      setPalette(extractPalette(canvas, paletteSize));
      setPicked(null);
    };
    img.src = url;
  }, [paletteSize]);

  // Re-extract when palette size changes
  useEffect(() => {
    if (!imageSrc) return;
    const canvas = canvasRef.current;
    if (!canvas || canvas.width === 0) return;
    setPalette(extractPalette(canvas, paletteSize));
  }, [paletteSize, imageSrc]);

  const reset = () => { setImageSrc(null); setPalette([]); setPicked(null); };

  const copyAllHex = () => {
    const all = palette.map((c) =>
      format === "hex" ? c.hex : format === "rgb" ? c.rgb : c.hsl
    ).join(", ");
    navigator.clipboard.writeText(all);
  };

  // CSS gradient from palette
  const gradientCss = useMemo(() => {
    if (!palette.length) return "";
    return `linear-gradient(90deg, ${palette.map((c) => c.hex).join(", ")})`;
  }, [palette]);

  return (
    <section className="relative bg-background min-h-screen py-16 overflow-hidden">

      {/* Hidden extraction canvas */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-10 container mx-auto px-6">

        {/* Breadcrumb */}
        <BreadCrumb tKey="image-tools/ColorPickerTool.json" href="/image-tools" />

        {/* Header */}
        <Header tKey="image-tools/ColorPickerTool.json" />

        {!imageSrc ? (
          <div className="max-w-2xl mx-auto">
            <DropZone onFile={loadFile} />
            <p className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> {t("dropzone.privacyNote")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left: settings + detail ── */}
            <div className="flex flex-col gap-5">

              {/* Format selector */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.format")}</p>
                <div className="flex gap-1 p-1 rounded-xl border border-border bg-card">
                  {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => (
                    <button key={f} onClick={() => setFormat(f)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 ${format === f ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Palette size */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{t("options.paletteSize")}</p>
                <div className="grid grid-cols-4 gap-2">
                  {([6, 8, 12, 16] as PaletteSize[]).map((n) => (
                    <button key={n} onClick={() => setPaletteSize(n)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all duration-200 ${paletteSize === n ? "bg-blue-500 border-blue-500 text-white" : "border-border bg-card text-muted-foreground hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-500"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Palette strip */}
              {palette.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{t("options.gradientPreview")}</p>
                  <div className="h-8 rounded-xl shadow-sm border border-white/10" style={{ background: gradientCss }} />
                  <button onClick={copyAllHex}
                    className="mt-2 w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border bg-card text-xs font-semibold text-muted-foreground hover:text-blue-500 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200">
                    <Copy className="w-3.5 h-3.5" /> {t("options.copyAllValues", { format: format.toUpperCase() })}
                  </button>
                </div>
              )}

              {/* Picked color detail */}
              {picked && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                    <Pipette className="w-3.5 h-3.5" /> {t("options.pickedColor")}
                  </p>
                  <ColorDetail color={picked} />
                </div>
              )}

              {/* Actions */}
              <button onClick={reset}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-all duration-200">
                <RefreshCw className="w-4 h-4" /> {t("options.uploadNewImage")}
              </button>
            </div>

            {/* ── Right: tabs ── */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Tab bar */}
              <div className="flex gap-1 p-1 rounded-xl border border-border bg-card self-start">
                {[
                  { key: "palette", icon: Grid3x3, label: t("tabs.palette") },
                  { key: "eyedropper", icon: Pipette, label: t("tabs.eyedropper") },
                ].map(({ key, icon: Icon, label }) => (
                  <button key={key} onClick={() => setActiveTab(key as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${activeTab === key ? "bg-blue-500 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                    <Icon className="w-3.5 h-3.5" /> {label}
                  </button>
                ))}
              </div>

              {/* Palette tab */}
              {activeTab === "palette" && (
                <div>
                  <div className={`grid gap-3 ${paletteSize <= 8 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-4"}`}>
                    {palette.map((color, i) => (
                      <ColorCard
                        key={color.hex + i}
                        color={color}
                        format={format}
                        index={i}
                      />
                    ))}
                  </div>

                  {/* Color list / table */}
                  <div className="mt-5 rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("options.allValues")}</span>
                      <span className="text-xs text-muted-foreground/60">{t("options.colorsCount", { count: palette.length })}</span>
                    </div>
                    <div className="divide-y divide-border">
                      {palette.map((color, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 dark:hover:bg-muted/10 transition-colors group">
                          <div className="w-8 h-8 rounded-lg shrink-0 border border-white/10 shadow-sm" style={{ background: color.hex }} />
                          <div className="flex-1 min-w-0 grid grid-cols-3 gap-2">
                            {(["hex", "rgb", "hsl"] as ColorFormat[]).map((f) => {
                              const val = f === "hex" ? color.hex : f === "rgb" ? color.rgb : color.hsl;
                              return (
                                <button key={f} onClick={() => navigator.clipboard.writeText(val)}
                                  className="flex items-center gap-1.5 text-left hover:text-blue-500 transition-colors group/cell">
                                  <span className="text-[10px] font-bold uppercase text-muted-foreground w-6">{f}</span>
                                  <span className="text-xs font-mono text-foreground truncate group-hover/cell:text-blue-500">{val}</span>
                                </button>
                              );
                            })}
                          </div>
                          <Copy className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shrink-0"
                            onClick={() => {
                              const val = format === "hex" ? color.hex : format === "rgb" ? color.rgb : color.hsl;
                              navigator.clipboard.writeText(val);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Eyedropper tab */}
              {activeTab === "eyedropper" && (
                <div className="flex flex-col gap-4">
                  <EyedropperCanvas src={imageSrc} onPick={setPicked} />
                  {!picked && (
                    <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                      <Pipette className="w-4 h-4" /> {t("eyedropper.clickToPick")}
                    </div>
                  )}
                  {picked && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 flex items-center gap-2">
                        <Eye className="w-3.5 h-3.5" /> {t("options.pickedColor")}
                      </p>
                      <ColorDetail color={picked} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <HowToUse tKey="image-tools/ColorPickerTool.json" count={4} />
        <FAQ tKey="image-tools/ColorPickerTool.json" />
        <Examples tKey="image-tools/ColorPickerTool.json" />

        {/* Related tools */}
        <RelatedTools />
      </div>
    </section>
  );
}