/**
 * GridPlay CSS Variables & Global Styles
 * 
 * Maps design tokens to CSS custom properties for use in components.
 * Provides consistent theming across the application.
 */

// CSS Variable names
export const cssVars = {
  // Colors
  colorPrimary: '--gp-color-primary',
  colorPrimaryHover: '--gp-color-primary-hover',
  colorPrimaryLight: '--gp-color-primary-light',
  colorSecondary: '--gp-color-secondary',
  colorSecondaryHover: '--gp-color-secondary-hover',
  colorAccent: '--gp-color-accent',
  colorAccentHover: '--gp-color-accent-hover',
  
  // Surface colors
  colorBg: '--gp-color-bg',
  colorSurface: '--gp-color-surface',
  colorSurfaceElevated: '--gp-color-surface-elevated',
  colorCard: '--gp-color-card',
  colorBorder: '--gp-color-border',
  colorBorderHover: '--gp-color-border-hover',
  
  // Text colors
  colorTextPrimary: '--gp-color-text-primary',
  colorTextSecondary: '--gp-color-text-secondary',
  colorTextTertiary: '--gp-color-text-tertiary',
  colorTextInverse: '--gp-color-text-inverse',
  
  // Semantic colors
  colorSuccess: '--gp-color-success',
  colorSuccessBg: '--gp-color-success-bg',
  colorSuccessBorder: '--gp-color-success-border',
  colorError: '--gp-color-error',
  colorErrorBg: '--gp-color-error-bg',
  colorErrorBorder: '--gp-color-error-border',
  colorWarning: '--gp-color-warning',
  colorWarningBg: '--gp-color-warning-bg',
  colorWarningBorder: '--gp-color-warning-border',
  colorInfo: '--gp-color-info',
  colorInfoBg: '--gp-color-info-bg',
  colorInfoBorder: '--gp-color-info-border',
  
  // Spacing
  spacingUnit: '--gp-spacing-unit',
  spacing1: '--gp-spacing-1',
  spacing2: '--gp-spacing-2',
  spacing3: '--gp-spacing-3',
  spacing4: '--gp-spacing-4',
  spacing5: '--gp-spacing-5',
  spacing6: '--gp-spacing-6',
  spacing8: '--gp-spacing-8',
  spacing10: '--gp-spacing-10',
  spacing12: '--gp-spacing-12',
  spacing16: '--gp-spacing-16',
  
  // Typography
  fontFamilySans: '--gp-font-family-sans',
  fontFamilyMono: '--gp-font-family-mono',
  fontFamilyDisplay: '--gp-font-family-display',
  fontSizeXs: '--gp-font-size-xs',
  fontSizeSm: '--gp-font-size-sm',
  fontSizeBase: '--gp-font-size-base',
  fontSizeLg: '--gp-font-size-lg',
  fontSizeXl: '--gp-font-size-xl',
  fontSize2xl: '--gp-font-size-2xl',
  fontSize3xl: '--gp-font-size-3xl',
  fontSize4xl: '--gp-font-size-4xl',
  fontSize5xl: '--gp-font-size-5xl',
  fontWeightNormal: '--gp-font-weight-normal',
  fontWeightMedium: '--gp-font-weight-medium',
  fontWeightSemibold: '--gp-font-weight-semibold',
  fontWeightBold: '--gp-font-weight-bold',
  lineHeightTight: '--gp-line-height-tight',
  lineHeightNormal: '--gp-line-height-normal',
  lineHeightRelaxed: '--gp-line-height-relaxed',
  
  // Border radius
  radiusSm: '--gp-radius-sm',
  radiusMd: '--gp-radius-md',
  radiusLg: '--gp-radius-lg',
  radiusXl: '--gp-radius-xl',
  radius2xl: '--gp-radius-2xl',
  radiusFull: '--gp-radius-full',
  
  // Shadows
  shadowSm: '--gp-shadow-sm',
  shadowMd: '--gp-shadow-md',
  shadowLg: '--gp-shadow-lg',
  shadowXl: '--gp-shadow-xl',
  shadowPrimary: '--gp-shadow-primary',
  shadowAccent: '--gp-shadow-accent',
  shadowGlow: '--gp-shadow-glow',
  
  // Transitions
  transitionFast: '--gp-transition-fast',
  transitionNormal: '--gp-transition-normal',
  transitionSlow: '--gp-transition-slow',
  transitionSpring: '--gp-transition-spring',
  
  // Layout
  sidebarWidth: '--gp-sidebar-width',
  sidebarCollapsedWidth: '--gp-sidebar-collapsed-width',
  headerHeight: '--gp-header-height',
  maxContentWidth: '--gp-max-content-width',
  
  // Z-index
  zDropdown: '--gp-z-dropdown',
  zSticky: '--gp-z-sticky',
  zModal: '--gp-z-modal',
  zPopover: '--gp-z-popover',
  zTooltip: '--gp-z-tooltip',
  zToast: '--gp-z-toast',
} as const;

// Generate CSS variable string for :root
export function generateCSSVariables(): string {
  const { colors, spacing, typography, borderRadius, shadows, transitions, gridSizes, zIndex } = require('./design-tokens');
  
  return `
:root {
  /* Primary Colors */
  ${cssVars.colorPrimary}: ${colors.primary[500]};
  ${cssVars.colorPrimaryHover}: ${colors.primary[600]};
  ${cssVars.colorPrimaryLight}: ${colors.primary[400]};
  
  /* Secondary Colors */
  ${cssVars.colorSecondary}: ${colors.secondary[800]};
  ${cssVars.colorSecondaryHover}: ${colors.secondary[700]};
  
  /* Accent Colors */
  ${cssVars.colorAccent}: ${colors.accent[500]};
  ${cssVars.colorAccentHover}: ${colors.accent[600]};
  
  /* Surface Colors (Dark Mode) */
  ${cssVars.colorBg}: ${colors.surface.base};
  ${cssVars.colorSurface}: ${colors.surface.elevated};
  ${cssVars.colorSurfaceElevated}: ${colors.surface.overlay};
  ${cssVars.colorCard}: ${colors.surface.card};
  ${cssVars.colorBorder}: ${colors.surface.border};
  ${cssVars.colorBorderHover}: ${colors.surface.borderHover};
  
  /* Text Colors */
  ${cssVars.colorTextPrimary}: ${colors.text.primary};
  ${cssVars.colorTextSecondary}: ${colors.text.secondary};
  ${cssVars.colorTextTertiary}: ${colors.text.tertiary};
  ${cssVars.colorTextInverse}: ${colors.text.inverse};
  
  /* Semantic Colors */
  ${cssVars.colorSuccess}: ${colors.success.main};
  ${cssVars.colorSuccessBg}: ${colors.success.bg};
  ${cssVars.colorSuccessBorder}: ${colors.success.border};
  ${cssVars.colorError}: ${colors.error.main};
  ${cssVars.colorErrorBg}: ${colors.error.bg};
  ${cssVars.colorErrorBorder}: ${colors.error.border};
  ${cssVars.colorWarning}: ${colors.warning.main};
  ${cssVars.colorWarningBg}: ${colors.warning.bg};
  ${cssVars.colorWarningBorder}: ${colors.warning.border};
  ${cssVars.colorInfo}: ${colors.info.main};
  ${cssVars.colorInfoBg}: ${colors.info.bg};
  ${cssVars.colorInfoBorder}: ${colors.info.border};
  
  /* Spacing */
  ${cssVars.spacingUnit}: ${spacing[4]};
  ${cssVars.spacing1}: ${spacing[1]};
  ${cssVars.spacing2}: ${spacing[2]};
  ${cssVars.spacing3}: ${spacing[3]};
  ${cssVars.spacing4}: ${spacing[4]};
  ${cssVars.spacing5}: ${spacing[5]};
  ${cssVars.spacing6}: ${spacing[6]};
  ${cssVars.spacing8}: ${spacing[8]};
  ${cssVars.spacing10}: ${spacing[10]};
  ${cssVars.spacing12}: ${spacing[12]};
  ${cssVars.spacing16}: ${spacing[16]};
  
  /* Typography */
  ${cssVars.fontFamilySans}: ${typography.fontFamilies.sans};
  ${cssVars.fontFamilyMono}: ${typography.fontFamilies.mono};
  ${cssVars.fontFamilyDisplay}: ${typography.fontFamilies.display};
  ${cssVars.fontSizeXs}: ${typography.fontSizes.xs};
  ${cssVars.fontSizeSm}: ${typography.fontSizes.sm};
  ${cssVars.fontSizeBase}: ${typography.fontSizes.base};
  ${cssVars.fontSizeLg}: ${typography.fontSizes.lg};
  ${cssVars.fontSizeXl}: ${typography.fontSizes.xl};
  ${cssVars.fontSize2xl}: ${typography.fontSizes['2xl']};
  ${cssVars.fontSize3xl}: ${typography.fontSizes['3xl']};
  ${cssVars.fontSize4xl}: ${typography.fontSizes['4xl']};
  ${cssVars.fontSize5xl}: ${typography.fontSizes['5xl']};
  ${cssVars.fontWeightNormal}: ${typography.fontWeights.normal};
  ${cssVars.fontWeightMedium}: ${typography.fontWeights.medium};
  ${cssVars.fontWeightSemibold}: ${typography.fontWeights.semibold};
  ${cssVars.fontWeightBold}: ${typography.fontWeights.bold};
  ${cssVars.lineHeightTight}: ${typography.lineHeights.tight};
  ${cssVars.lineHeightNormal}: ${typography.lineHeights.normal};
  ${cssVars.lineHeightRelaxed}: ${typography.lineHeights.relaxed};
  
  /* Border Radius */
  ${cssVars.radiusSm}: ${borderRadius.sm};
  ${cssVars.radiusMd}: ${borderRadius.md};
  ${cssVars.radiusLg}: ${borderRadius.lg};
  ${cssVars.radiusXl}: ${borderRadius.xl};
  ${cssVars.radius2xl}: ${borderRadius['2xl']};
  ${cssVars.radiusFull}: ${borderRadius.full};
  
  /* Shadows */
  ${cssVars.shadowSm}: ${shadows.sm};
  ${cssVars.shadowMd}: ${shadows.md};
  ${cssVars.shadowLg}: ${shadows.lg};
  ${cssVars.shadowXl}: ${shadows.xl};
  ${cssVars.shadowPrimary}: ${shadows.primary};
  ${cssVars.shadowAccent}: ${shadows.accent};
  ${cssVars.shadowGlow}: ${shadows.glow};
  
  /* Transitions */
  ${cssVars.transitionFast}: ${transitions.fast};
  ${cssVars.transitionNormal}: ${transitions.normal};
  ${cssVars.transitionSlow}: ${transitions.slow};
  ${cssVars.transitionSpring}: ${transitions.spring};
  
  /* Layout */
  ${cssVars.sidebarWidth}: ${gridSizes.sidebar};
  ${cssVars.sidebarCollapsedWidth}: ${gridSizes.sidebarCollapsed};
  ${cssVars.headerHeight}: ${gridSizes.header};
  ${cssVars.maxContentWidth}: ${gridSizes.maxContent};
  
  /* Z-Index */
  ${cssVars.zDropdown}: ${zIndex.dropdown};
  ${cssVars.zSticky}: ${zIndex.sticky};
  ${cssVars.zModal}: ${zIndex.modal};
  ${cssVars.zPopover}: ${zIndex.popover};
  ${cssVars.zTooltip}: ${zIndex.tooltip};
  ${cssVars.zToast}: ${zIndex.toast};
}
  `.trim();
}

// CSS Variable helpers for use in components
export const vars = {
  color: {
    primary: `var(${cssVars.colorPrimary})`,
    primaryHover: `var(${cssVars.colorPrimaryHover})`,
    primaryLight: `var(${cssVars.colorPrimaryLight})`,
    secondary: `var(${cssVars.colorSecondary})`,
    secondaryHover: `var(${cssVars.colorSecondaryHover})`,
    accent: `var(${cssVars.colorAccent})`,
    accentHover: `var(${cssVars.colorAccentHover})`,
    bg: `var(${cssVars.colorBg})`,
    surface: `var(${cssVars.colorSurface})`,
    surfaceElevated: `var(${cssVars.colorSurfaceElevated})`,
    card: `var(${cssVars.colorCard})`,
    border: `var(${cssVars.colorBorder})`,
    borderHover: `var(${cssVars.colorBorderHover})`,
    textPrimary: `var(${cssVars.colorTextPrimary})`,
    textSecondary: `var(${cssVars.colorTextSecondary})`,
    textTertiary: `var(${cssVars.colorTextTertiary})`,
    textInverse: `var(${cssVars.colorTextInverse})`,
    success: `var(${cssVars.colorSuccess})`,
    successBg: `var(${cssVars.colorSuccessBg})`,
    successBorder: `var(${cssVars.colorSuccessBorder})`,
    error: `var(${cssVars.colorError})`,
    errorBg: `var(${cssVars.colorErrorBg})`,
    errorBorder: `var(${cssVars.colorErrorBorder})`,
    warning: `var(${cssVars.colorWarning})`,
    warningBg: `var(${cssVars.colorWarningBg})`,
    warningBorder: `var(${cssVars.colorWarningBorder})`,
    info: `var(${cssVars.colorInfo})`,
    infoBg: `var(${cssVars.colorInfoBg})`,
    infoBorder: `var(${cssVars.colorInfoBorder})`,
  },
  spacing: {
    unit: `var(${cssVars.spacingUnit})`,
    1: `var(${cssVars.spacing1})`,
    2: `var(${cssVars.spacing2})`,
    3: `var(${cssVars.spacing3})`,
    4: `var(${cssVars.spacing4})`,
    5: `var(${cssVars.spacing5})`,
    6: `var(${cssVars.spacing6})`,
    8: `var(${cssVars.spacing8})`,
    10: `var(${cssVars.spacing10})`,
    12: `var(${cssVars.spacing12})`,
    16: `var(${cssVars.spacing16})`,
  },
  font: {
    sans: `var(${cssVars.fontFamilySans})`,
    mono: `var(${cssVars.fontFamilyMono})`,
    display: `var(${cssVars.fontFamilyDisplay})`,
  },
  fontSize: {
    xs: `var(${cssVars.fontSizeXs})`,
    sm: `var(${cssVars.fontSizeSm})`,
    base: `var(${cssVars.fontSizeBase})`,
    lg: `var(${cssVars.fontSizeLg})`,
    xl: `var(${cssVars.fontSizeXl})`,
    '2xl': `var(${cssVars.fontSize2xl})`,
    '3xl': `var(${cssVars.fontSize3xl})`,
    '4xl': `var(${cssVars.fontSize4xl})`,
    '5xl': `var(${cssVars.fontSize5xl})`,
  },
  fontWeight: {
    normal: `var(${cssVars.fontWeightNormal})`,
    medium: `var(${cssVars.fontWeightMedium})`,
    semibold: `var(${cssVars.fontWeightSemibold})`,
    bold: `var(${cssVars.fontWeightBold})`,
  },
  lineHeight: {
    tight: `var(${cssVars.lineHeightTight})`,
    normal: `var(${cssVars.lineHeightNormal})`,
    relaxed: `var(${cssVars.lineHeightRelaxed})`,
  },
  radius: {
    sm: `var(${cssVars.radiusSm})`,
    md: `var(${cssVars.radiusMd})`,
    lg: `var(${cssVars.radiusLg})`,
    xl: `var(${cssVars.radiusXl})`,
    '2xl': `var(${cssVars.radius2xl})`,
    full: `var(${cssVars.radiusFull})`,
  },
  shadow: {
    sm: `var(${cssVars.shadowSm})`,
    md: `var(${cssVars.shadowMd})`,
    lg: `var(${cssVars.shadowLg})`,
    xl: `var(${cssVars.shadowXl})`,
    primary: `var(${cssVars.shadowPrimary})`,
    accent: `var(${cssVars.shadowAccent})`,
    glow: `var(${cssVars.shadowGlow})`,
  },
  transition: {
    fast: `var(${cssVars.transitionFast})`,
    normal: `var(${cssVars.transitionNormal})`,
    slow: `var(${cssVars.transitionSlow})`,
    spring: `var(${cssVars.transitionSpring})`,
  },
  layout: {
    sidebarWidth: `var(${cssVars.sidebarWidth})`,
    sidebarCollapsedWidth: `var(${cssVars.sidebarCollapsedWidth})`,
    headerHeight: `var(${cssVars.headerHeight})`,
    maxContentWidth: `var(${cssVars.maxContentWidth})`,
  },
  zIndex: {
    dropdown: `var(${cssVars.zDropdown})`,
    sticky: `var(${cssVars.zSticky})`,
    modal: `var(${cssVars.zModal})`,
    popover: `var(${cssVars.zPopover})`,
    tooltip: `var(${cssVars.zTooltip})`,
    toast: `var(${cssVars.zToast})`,
  },
} as const;