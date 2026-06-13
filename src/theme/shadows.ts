/**
 * IoPet Shadow & Glow System
 * Subtle depth + violet glow effects for dark tech aesthetic
 */

export const Shadows = {
  none: {
    boxShadow: 'none',
    elevation: 0,
  },
  sm: {
    boxShadow: '0px 2px 4px rgba(0,0,0,0.3)',
    elevation: 2,
  },
  md: {
    boxShadow: '0px 4px 8px rgba(0,0,0,0.4)',
    elevation: 4,
  },
  lg: {
    boxShadow: '0px 8px 16px rgba(0,0,0,0.5)',
    elevation: 8,
  },
  // Violet glow — for primary elements
  glowPrimary: {
    boxShadow: '0px 4px 12px rgba(122,63,255,0.5)',
    elevation: 6,
  },
  glowPrimaryStrong: {
    boxShadow: '0px 6px 20px rgba(122,63,255,0.7)',
    elevation: 10,
  },
  // Cyan glow — for accent / online states
  glowCyan: {
    boxShadow: '0px 0px 10px rgba(34,211,238,0.6)',
    elevation: 5,
  },
  // Alert glow — for error states
  glowError: {
    boxShadow: '0px 0px 10px rgba(239,68,68,0.5)',
    elevation: 5,
  },
} as const;
