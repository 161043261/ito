export function genBase64Img(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;
  const [r, g, b] = Array.from({length: 3}, () => Math.floor(Math.random() * 256));
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, 1, 1);
  const base64 = canvas.toDataURL('image/png');
  return base64;
}

