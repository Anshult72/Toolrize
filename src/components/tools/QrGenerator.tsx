"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "qrcode";

export default function QrGenerator() {
  const [qrType, setQrType] = useState<"url" | "text" | "wifi" | "phone">("url");
  
  // Custom states
  const [url, setUrl] = useState<string>("https://toolrize.com");
  const [text, setText] = useState<string>("Hello from Toolrize!");
  const [phone, setPhone] = useState<string>("+91 ");
  
  // WiFi states
  const [ssid, setSsid] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [encryption, setEncryption] = useState<string>("WPA");

  const [qrSize, setQrSize] = useState<number>(300);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generatePayload = () => {
    switch (qrType) {
      case "url":
        return url;
      case "text":
        return text;
      case "phone":
        return `tel:${phone}`;
      case "wifi":
        return `WIFI:S:${ssid};T:${encryption};P:${password};;`;
      default:
        return "";
    }
  };

  const generateQrCode = async () => {
    setProcessing(true);
    setError(null);
    const payload = generatePayload();

    if (!payload.trim()) {
      setError("Please input a valid payload before generating.");
      setProcessing(false);
      return;
    }

    try {
      const canvas = canvasRef.current || document.createElement("canvas");
      await QRCode.toCanvas(canvas, payload, {
        width: qrSize,
        margin: 2,
        color: {
          dark: "#1a1a1a",
          light: "#ffffff",
        },
      });

      const urlPng = canvas.toDataURL("image/png");
      setQrUrl(urlPng);
    } catch (err: any) {
      setError("Failed to compile QR code. Please check your inputs.");
    } finally {
      setProcessing(false);
    }
  };

  // Re-generate QR whenever values or type change
  useEffect(() => {
    generateQrCode();
  }, [qrType, url, text, phone, ssid, password, encryption, qrSize]);

  const downloadQr = () => {
    if (!qrUrl) return;
    const link = document.createElement("a");
    link.href = qrUrl;
    link.download = `toolrize_qr_${qrType}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-border/70 p-6 sm:p-8 shadow-xs">
      {/* Selector Tabs */}
      <div className="flex flex-wrap gap-2.5 mb-6 border-b border-border/40 pb-4">
        {[
          { id: "url", label: "🔗 Website URL", placeholder: "https://example.com" },
          { id: "text", label: "✍️ Plain Text", placeholder: "Your custom message here" },
          { id: "wifi", label: "📶 WiFi Network", placeholder: "Connect instantly" },
          { id: "phone", label: "📞 Phone Call", placeholder: "Dial number" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setQrType(tab.id as any)}
            className={`px-4.5 py-2.5 rounded-xl text-[13px] font-bold border transition-all cursor-pointer ${
              qrType === tab.id
                ? "bg-foreground text-white border-foreground"
                : "bg-surface/40 text-muted border-border hover:border-border-hover hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Input Details Column */}
        <div className="md:col-span-2 space-y-4 border-r border-border/40 pr-0 md:pr-6">
          <h3 className="font-heading text-[15px] font-extrabold text-foreground">
            Configure QR Credentials
          </h3>

          {/* Dynamic input rendering */}
          {qrType === "url" && (
            <div>
              <label htmlFor="url-input" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
                Target URL:
              </label>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px]"
              />
            </div>
          )}

          {qrType === "text" && (
            <div>
              <label htmlFor="text-input" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
                Plain Text Payload:
              </label>
              <textarea
                id="text-input"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message, notes or digital info here..."
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px] resize-none"
              />
            </div>
          )}

          {qrType === "phone" && (
            <div>
              <label htmlFor="phone-input" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
                Telephone Number:
              </label>
              <input
                id="phone-input"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 9999999999"
                className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px]"
              />
            </div>
          )}

          {qrType === "wifi" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="ssid-input" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
                  WiFi Network Name (SSID):
                </label>
                <input
                  id="ssid-input"
                  type="text"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="MyHomeWiFi"
                  className="w-full px-3.5 py-2.5 bg-white border border-border rounded-xl font-bold text-[14px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="wifi-pass" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
                    Password:
                  </label>
                  <input
                    id="wifi-pass"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="WPA Password"
                    className="w-full px-3.5 py-2 bg-white border border-border rounded-xl font-bold text-[14px]"
                  />
                </div>
                <div>
                  <label htmlFor="wifi-enc" className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
                    Encryption:
                  </label>
                  <select
                    id="wifi-enc"
                    value={encryption}
                    onChange={(e) => setEncryption(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-border rounded-xl font-bold text-[14px] h-[38px]"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Size configuration */}
          <div className="pt-4 border-t border-border/40">
            <span className="block text-[12px] font-extrabold text-foreground mb-1.5 uppercase tracking-wider">
              QR Resolution:
            </span>
            <div className="flex gap-2">
              {[200, 300, 400, 600].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setQrSize(size)}
                  className={`px-3.5 py-1.5 rounded-lg text-[12px] font-bold border transition-all cursor-pointer ${
                    qrSize === size
                      ? "bg-foreground text-white border-foreground"
                      : "bg-white text-muted border-border hover:border-border-hover"
                  }`}
                >
                  {size} x {size} px
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output/Display Column */}
        <div className="md:col-span-1 flex flex-col items-center justify-between">
          <div className="w-full flex flex-col items-center">
            <span className="text-[11px] font-extrabold uppercase text-muted-light block mb-4 self-start">
              QR Code Preview
            </span>
            
            <div className="p-4 bg-white border border-border/60 rounded-3xl shadow-sm flex items-center justify-center min-h-[190px] w-[190px] h-[190px] relative overflow-hidden">
              <canvas ref={canvasRef} className="hidden" />
              {processing ? (
                <span className="animate-spin text-[28px]">⚙️</span>
              ) : qrUrl ? (
                <img src={qrUrl} alt="Generated QR Code" className="w-full h-full object-contain rounded-md" />
              ) : (
                <span className="text-[12px] font-bold text-muted-light">Configuring...</span>
              )}
            </div>
          </div>

          <div className="w-full mt-6">
            <button
              type="button"
              onClick={downloadQr}
              disabled={!qrUrl}
              className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[13.5px] font-bold rounded-xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              📥 Download QR Code (PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
