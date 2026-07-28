export const AF_BREAKPOINTS = {
  mobileMax: '767.98px',
  tabletMax: '1023.98px',
  desktopMin: '1024px',
} as const;

/**
 * El renderer adaptativo responde al espacio disponible, no al dispositivo de
 * entrada. Una tablet táctil conserva así el layout tablet desde 768 px en vez
 * de degradarse al shell móvil sólo por exponer un puntero coarse.
 */
export const AF_MOBILE_MEDIA_QUERY = `(max-width: ${AF_BREAKPOINTS.mobileMax})`;
