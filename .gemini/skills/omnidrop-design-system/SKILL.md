---
name: Omnidrop Design System
description: Omnidrop Design System guidelines for brand, colors, typography, layout, spacing, elevation, shapes, and components.
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daea'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eefe'
  surface-container-high: '#e2e8f8'
  surface-container-highest: '#dce2f3'
  on-surface: '#151c27'
  on-surface-variant: '#404944'
  inverse-surface: '#2a313d'
  inverse-on-surface: '#ebf1ff'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#476800'
  on-secondary: '#ffffff'
  secondary-container: '#bcf063'
  on-secondary-container: '#4b6d00'
  tertiary: '#25312f'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b4745'
  on-tertiary-container: '#a8b5b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#bff365'
  secondary-fixed-dim: '#a4d64c'
  on-secondary-fixed: '#131f00'
  on-secondary-fixed-variant: '#354e00'
  tertiary-fixed: '#d8e5e2'
  tertiary-fixed-dim: '#bcc9c6'
  on-tertiary-fixed: '#121e1c'
  on-tertiary-fixed-variant: '#3d4947'
  background: '#f9f9ff'
  on-background: '#151c27'
  surface-variant: '#dce2f3'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered to evoke a sense of organic freshness paired with logistical precision. It targets health-conscious urban professionals who value quality and efficiency. 

The aesthetic is a hybrid of **Modern Minimalism** and **Tactile Professionalism**. It utilizes expansive white space to denote cleanliness, while layering vibrant organic greens to signal life and vitality. The interface focuses on high-quality product imagery as the hero, supported by a UI that feels reliable and "unfussy." The emotional response should be one of relief and trust—conveying that the user's nourishment is in capable, sophisticated hands.

## Colors

The palette is rooted in the natural world, transitioning from deep shadows to bright sunlight.

- **Primary (Deep Forest):** Used for core branding, primary buttons, and navigation backgrounds to establish authority and depth.
- **Secondary (Vibrant Lime):** A high-visibility accent used for "Add to Cart" actions, badges, and nutritional highlights. It signifies energy and ripeness.
- **Surface & Backgrounds:** The interface relies on a "Super White" (#FFFFFF) base for all cards and containers, contrasted against a very light cool grey (#F9FAFB) for the main page background to define structure.
- **Status & Feedback:** Success states leverage the secondary lime; warnings use a soft amber; errors use a muted terracotta to maintain the organic feel without appearing overly aggressive.

## Typography

The typographic hierarchy prioritizes scan-ability and warmth. **Montserrat** provides a geometric, confident personality for all major headings and product titles. **Inter** handles the heavy lifting of product descriptions, quantities, and pricing due to its exceptional legibility at small sizes.

For mobile, headlines are aggressively scaled down to ensure product names remain visible above the fold. Weight is used strategically: SemiBold and Bold for pricing and navigation, while Regular is reserved for long-form nutritional information or instructional text.

## Layout & Spacing

This design system utilizes a **8px soft-grid system**. All margins and paddings must be multiples of 8 to ensure visual harmony and mathematical balance.

- **Desktop:** A 12-column grid with 24px gutters and 40px side margins. Cards typically span 3 or 4 columns.
- **Tablet:** An 8-column grid with 16px gutters.
- **Mobile:** A 4-column grid with 16px margins. Vertical rhythm is emphasized here to facilitate easy thumb-scrolling.

Product grids should maintain generous vertical white space (40px+) between sections (e.g., "Seasonal Fruits" vs "Dairy") to prevent the interface from feeling cluttered or overwhelming.

## Elevation & Depth

To maintain a "Fresh" look, this design system avoids heavy shadows. Instead, it uses **Tonal Layering** and **Low-Contrast Outlines**.

1.  **Level 0 (Background):** Solid #F9FAFB.
2.  **Level 1 (Cards/Containers):** Solid #FFFFFF with a 1px border in #E5E7EB. No shadow.
3.  **Level 2 (Hover/Active):** Solid #FFFFFF with a subtle, very diffused ambient shadow (Y: 4px, Blur: 12px, Opacity: 4%, Color: #064E3B).
4.  **Level 3 (Modals/Overlays):** Elevated with a more pronounced shadow and a 40% opacity backdrop blur to keep the user focused on the immediate task.

## Shapes

The shape language is approachable and modern. A consistent radius of **8px (Base)** is applied to standard standard product cards and input fields. Larger containers and promotional banners use **16px (Large)**, while primary call-to-action buttons use a **24px (Pill)** or fully rounded shape to distinguish them from informational elements.

Iconography should follow this logic, utilizing rounded caps and joins rather than sharp angles.

## Components

- **Buttons:** Primary buttons are pill-shaped, filled with Deep Forest green (#064E3B) and white text. Secondary buttons use a transparent background with a 1px Forest green border. "Add" buttons use the Vibrant Lime (#BEF264) for high conversion.
- **Product Cards:** These are the heart of the system. They feature a white background, a 1px light grey border, and 16px internal padding. Images must be high-resolution on transparent or neutral backgrounds.
- **Chips:** Used for dietary tags (e.g., "Organic", "Gluten-Free"). These use the Tertiary mint background (#F0FDFA) with Forest Green text and 12px rounding.
- **Inputs:** Search bars and form fields use an 8px radius with a subtle grey border that turns Forest Green on focus.
- **Basket/Cart:** A persistent floating or docked element that uses the Secondary Lime color for the quantity badge to create a sense of progress and fulfillment.
- **Quantity Selector:** A horizontal component with a light grey background and circular +/- buttons, emphasizing tactile feedback.
