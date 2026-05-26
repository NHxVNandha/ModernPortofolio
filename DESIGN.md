---
name: Synthetic Intelligence
colors:
  surface: '#0e1322'
  surface-dim: '#0e1322'
  surface-bright: '#343949'
  surface-container-lowest: '#090e1c'
  surface-container-low: '#161b2b'
  surface-container: '#1a1f2f'
  surface-container-high: '#25293a'
  surface-container-highest: '#2f3445'
  on-surface: '#dee1f7'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dee1f7'
  inverse-on-surface: '#2b3040'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb786'
  on-tertiary: '#502400'
  tertiary-container: '#df7412'
  on-tertiary-container: '#461f00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#0e1322'
  on-background: '#dee1f7'
  surface-variant: '#2f3445'
  surface-deep: '#050505'
  glass-stroke: rgba(255, 255, 255, 0.1)
  glow-blue: rgba(59, 130, 246, 0.5)
  glow-emerald: rgba(16, 185, 129, 0.4)
typography:
  display-xl:
    fontFamily: geist
    fontSize: 72px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: geist
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-code:
    fontFamily: jetbrainsMono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 80px
  margin-mobile: 20px
  bento-gap: 16px
---

## Brand & Style

This design system is engineered for a high-end software developer portfolio, blending the precision of a premium SaaS product with a futuristic, developer-centric aesthetic. The brand personality is sophisticated, innovative, and highly technical, yet approachable through refined interactions.

The visual style is **Glassmorphism** integrated with a **Modern / Corporate** structure. It utilizes deep, layered backgrounds to create a sense of infinite space, punctuated by high-vibrancy "electric" accents that represent code execution and digital energy. The interface prioritizes clean information hierarchy using bento-grid layouts, ensuring that complex technical expertise is presented in a digestible, modern format.

## Colors

The palette is anchored in a dual-tone dark mode environment. The primary background (`surface-deep`) provides a foundation of absolute black, while the primary neutral (`#0A0F1E`) acts as the "elevated" surface for containers and sections.

**Accents & Interaction:**
- **Electric Blue (#3B82F6):** Used for primary actions, active states, and technical highlights.
- **Emerald Green (#10B981):** Reserved for secondary call-to-outs, success states, and "live" project indicators.
- **Glows:** Utilize the named glow colors for box-shadows and text-shadows to simulate light emission from interactive elements.

## Typography

The typographic system utilizes a trio of typefaces to establish technical authority. **Geist** is used for display and headline roles to provide a sharp, geometric developer vibe. **Inter** handles body text for maximum legibility across long-form project descriptions. **JetBrains Mono** is introduced for labels, tags, and code snippets to reinforce the software engineering context.

Headlines should use tight letter-spacing and high weights to feel impactful against the dark background. For mobile, display sizes scale down aggressively to maintain layout integrity within bento-style cards.

## Layout & Spacing

The layout follows a **Bento Grid** philosophy, where content is partitioned into distinct, rounded modules of varying sizes. This system uses a 12-column fluid grid for desktop and a single-column stack for mobile.

**Grid Rules:**
- **Desktop:** 12-columns, 24px gutters. Use the `bento-gap` for spacing between cards within a section.
- **Tablet:** 6-columns, 16px gutters.
- **Mobile:** 1-column with 20px side margins.

Containers should utilize dynamic padding based on their size; larger bento cards receive 40px internal padding, while smaller utility cards use 24px.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional shadows. Surfaces do not "float" with black shadows; instead, they use background blurs and light-colored borders to separate from the background.

- **Base Layer:** `#050505` (Static background).
- **Mantle Layer:** `#0A0F1E` with a subtle 1px border of `glass-stroke`.
- **Glass Layer:** Semi-transparent background (alpha 0.4) with a `backdrop-filter: blur(20px)`. This is used for navigation bars and featured bento cards.
- **Glow Elevation:** When an element is hovered, a soft outer glow using `glow-blue` or `glow-emerald` is applied to suggest a physical light source behind the component.

## Shapes

The shape language is defined by large, friendly radii that contrast with the technical typography. 

- **Cards:** Use `rounded-2xl` (1.5rem / 24px) to create the signature bento-box appearance.
- **Buttons & Chips:** Are strictly pill-shaped (full radius) to emphasize their interactive nature.
- **Inputs:** Follow the `rounded-lg` (1rem) standard for a balanced, modern form feel.

## Components

### Buttons
Primary buttons are pill-shaped with a solid `primary-color` fill. On hover, they should trigger a `15px` blur glow of the same color. Secondary buttons use the `glass-stroke` border and a backdrop blur.

### Bento Cards
Cards are the primary container. They feature a `1px` stroke (white at 10% opacity) and a subtle gradient background from top-left to bottom-right. On hover, the border opacity increases to 30%.

### Chips / Tags
Use **JetBrains Mono** for the text within chips. Chips should have a subtle background tint of the accent color (e.g., Blue at 10% opacity) and no border.

### Input Fields
Inputs are dark-filled with a subtle `1px` border. When focused, the border transitions to `primary-color` and a very faint glow is applied to the entire input field.

### Transitions
All hover states and layout changes must use a `0.3s cubic-bezier(0.4, 0, 0.2, 1)` transition to ensure the "premium SaaS" feel.