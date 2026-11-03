// u=1 is the attachment; both displacement and its gradient vanish at the root.
export function clothOffset(u, time, gust, amplitude = 8, speed = 1.5) {
  const free = Math.max(0, Math.min(1, 1 - u));
  const phase = time * speed - free * 2.8;
  return free * free * (amplitude * (Math.sin(phase) + 0.18 * Math.sin(phase * 1.55 + 0.8)) * (1 + gust * 0.55) - gust * 3);
}

// Adjacent strips share their boundary displacement, with a continuous shear.
// Integer x boundaries and zero x displacement avoid gaps and double-painted alpha.
// Draw the WHOLE original layer: attachment pixels are not cropped away.
export function drawWindCloth(ctx, image, { width, height, root, span = root, direction = -1, time, gust, amplitude = 8, speed = 1.5 }) {
  const offset = (x) => clothOffset(1 - Math.max(0, (x - root) * direction) / span, time, gust, amplitude, speed);
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const start = direction < 0 ? 0 : Math.floor(root);
  const end = direction < 0 ? Math.ceil(root) : width;
  if (start > 0) ctx.drawImage(image, 0, 0, start, height, 0, 0, start, height);
  if (end < width) ctx.drawImage(image, end, 0, width - end, height, end, 0, width - end, height);
  for (let x = start; x < end; x += 2) {
    const w = Math.min(2, end - x);
    const y = offset(x);
    const slope = (offset(x + w) - y) / w;
    ctx.save();
    ctx.transform(1, slope, 0, 1, 0, y - slope * x);
    ctx.drawImage(image, x, 0, w, height, x, 0, w, height);
    ctx.restore();
  }
  ctx.restore();
}
