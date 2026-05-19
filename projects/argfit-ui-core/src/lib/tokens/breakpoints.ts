export const AF_BREAKPOINTS = {
  mobileMax: '767.98px',
  tabletMax: '1023.98px',
  desktopMin: '1024px',
} as const;

export const AF_MOBILE_MEDIA_QUERY =
  `(max-width: ${AF_BREAKPOINTS.mobileMax}), ` +
  `(hover: none) and (pointer: coarse) and (max-width: ${AF_BREAKPOINTS.tabletMax})`;
