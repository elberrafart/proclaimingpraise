"use client";

import { useEffect, useState } from "react";
import { X, Copy, Check, Download, QrCode } from "lucide-react";
import QRCode from "qrcode";

interface Props {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}

export function EventSharePanel({ eventId, eventTitle, onClose }: Props) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/events/${eventId}`;

  useEffect(() => {
    QRCode.toDataURL(publicUrl, {
      width: 280,
      margin: 2,
      color: { dark: "#1a1a1a", light: "#ffffff" },
    }).then(setQrDataUrl);
  }, [publicUrl]);

  function handleCopy() {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr-${eventTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-charcoal rounded-xl transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <QrCode className="w-5 h-5 text-gold" />
          <h3 className="font-[family-name:var(--font-display)] text-xl text-charcoal">
            Share Event
          </h3>
        </div>
        <p className="text-charcoal/50 text-sm mb-6 truncate">{eventTitle}</p>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="QR code"
              className="w-48 h-48 rounded-xl border border-warm-gray"
            />
          ) : (
            <div className="w-48 h-48 rounded-xl border border-warm-gray bg-warm-white animate-pulse" />
          )}
        </div>

        {/* URL copy row */}
        <div className="flex items-center gap-2 mb-4">
          <input
            readOnly
            value={publicUrl}
            className="flex-1 px-3 py-2 bg-warm-white border border-warm-gray rounded-xl text-xs text-charcoal/70 truncate focus:outline-none"
          />
          <button
            onClick={handleCopy}
            className="p-2 text-charcoal/50 hover:text-gold border border-warm-gray rounded-xl transition-colors shrink-0"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-charcoal text-white text-sm font-medium rounded-xl hover:bg-charcoal/80 transition-colors disabled:opacity-40"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      </div>
    </div>
  );
}
