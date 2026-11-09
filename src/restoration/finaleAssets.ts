export const finaleAssets = ['/art/finale-hall.webp', '/art/finale-core.webp', '/art/finale-team.webp'];
export function prefetchFinale() { finaleAssets.forEach(src => { const image = new Image(); image.src = src; }); }
