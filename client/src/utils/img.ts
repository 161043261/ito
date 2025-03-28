export function genBase64(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d')!;
  const randColor = () =>
    '#' +
    Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0');
  for (let i = 0; i < 4; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    ctx.fillStyle = randColor();
    ctx.fillRect(col * 100, row * 100, 100, 100);
  }
  return canvas.toDataURL('image/png');
}
