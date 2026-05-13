import QRCode from "qrcode";

interface QROptions {
  fgColor?: string;
  bgColor?: string;
  size?: number;
}

export async function generateQRDataURL(
  url: string,
  options: QROptions = {}
): Promise<string> {
  const { fgColor = "#000000", bgColor = "#FFFFFF", size = 300 } = options;
  return QRCode.toDataURL(url, {
    color: { dark: fgColor, light: bgColor },
    width: size,
    margin: 2,
    errorCorrectionLevel: "H",
  });
}

export async function generateQRBuffer(
  url: string,
  options: QROptions = {}
): Promise<Buffer> {
  const { fgColor = "#000000", bgColor = "#FFFFFF", size = 300 } = options;
  return QRCode.toBuffer(url, {
    color: { dark: fgColor, light: bgColor },
    width: size,
    margin: 2,
    errorCorrectionLevel: "H",
  });
}
