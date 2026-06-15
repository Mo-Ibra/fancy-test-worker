import { Device } from "@/funcs/seo-tools/SEPRPreviewToolFuncs";
import { Monitor, Smartphone } from "lucide-react";

export default function DeviceToggle({ device, setDevice, t }: { device: Device; setDevice: (device: Device) => void; t: any }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("livePreview.title")}</p>
      <div className="flex gap-1.5">
        {([
          { k: "desktop" as Device, icon: Monitor, label: t("device.desktop") },
          { k: "mobile" as Device, icon: Smartphone, label: t("device.mobile") },
        ]).map(({ k, icon: Icon, label }) => (
          <button key={k} onClick={() => setDevice(k)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${device === k ? "bg-blue-500 border-blue-500 text-white shadow-sm" : "border-border bg-card text-muted-foreground hover:border-blue-200"
              }`}>
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>
    </div>
  )
}