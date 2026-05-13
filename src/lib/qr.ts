import QRCode from "qrcode";

export type DotStyle = "square" | "round";

interface QROptions {
  fgColor?: string;
  bgColor?: string;
  size?: number;
  dotStyle?: DotStyle;
  logoUrl?: string;
}

function buildSVG(
  url: string,
  { fgColor = "#000000", bgColor = "#FFFFFF", size = 300, dotStyle = "square", logoUrl }: QROptions
): string {
  const qr = QRCode.create(url, { errorCorrectionLevel: "H" });
  const count = qr.modules.size;
  const margin = 4;
  const cell = (size - margin * 2) / count;

  let dots = "";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!qr.modules.get(row, col)) continue;
      const x = margin + col * cell;
      const y = margin + row * cell;
      if (dotStyle === "round") {
        const cx = x + cell / 2;
        const cy = y + cell / 2;
        const r = (cell / 2) * 0.85;
        dots += `<circle cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="${r.toFixed(2)}" fill="${fgColor}"/>`;
      } else {
        dots += `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="${fgColor}"/>`;
      }
    }
  }

  let logoEl = "";
  if (logoUrl) {
    const logoSize = size * 0.22;
    const lx = (size - logoSize) / 2;
    const ly = (size - logoSize) / 2;
    const pad = 4;
    logoEl = `
      <rect x="${(lx - pad).toFixed(2)}" y="${(ly - pad).toFixed(2)}" width="${(logoSize + pad * 2).toFixed(2)}" height="${(logoSize + pad * 2).toFixed(2)}" rx="6" fill="${bgColor}"/>
      <image href="${logoUrl}" x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" width="${logoSize.toFixed(2)}" height="${logoSize.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bgColor}"/>
  ${dots}
  ${logoEl}
</svg>`;
}

export function generateQRSVGString(url: string, options: QROptions = {}): string {
  return buildSVG(url, options);
}

export function generateQRDataURL(url: string, options: QROptions = {}): string {
  const svg = buildSVG(url, options);
  const encoded = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${encoded}`;
}

export function generateQRSVGBuffer(url: string, options: QROptions = {}): Buffer {
  return Buffer.from(buildSVG(url, options));
}
