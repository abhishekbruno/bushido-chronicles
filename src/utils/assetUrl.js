// Public-directory paths only. Vite manages imported assets and CSS URLs itself.
export function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}
