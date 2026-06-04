---
name: Urban Athletic Premium
colors:
  surface: '#faf8ff'
  surface-dim: '#d1d8ff'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f2ff'
  surface-container: '#ebedff'
  surface-container-high: '#e4e7ff'
  surface-container-highest: '#dce1ff'
  on-surface: '#001550'
  on-surface-variant: '#44474f'
  inverse-surface: '#002780'
  inverse-on-surface: '#eff0ff'
  outline: '#75777f'
  outline-variant: '#c5c6d0'
  surface-tint: '#495e8a'
  primary: '#00020a'
  on-primary: '#ffffff'
  primary-container: '#001b44'
  on-primary-container: '#7084b3'
  inverse-primary: '#b1c6f9'
  secondary: '#074ce1'
  on-secondary: '#ffffff'
  secondary-container: '#3768fb'
  on-secondary-container: '#fffbff'
  tertiary: '#00020e'
  on-tertiary: '#ffffff'
  tertiary-container: '#001751'
  on-tertiary-container: '#6380df'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#b1c6f9'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#314671'
  secondary-fixed: '#dce1ff'
  secondary-fixed-dim: '#b6c4ff'
  on-secondary-fixed: '#001550'
  on-secondary-fixed-variant: '#003ab3'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b5c4ff'
  on-tertiary-fixed: '#00164e'
  on-tertiary-fixed-variant: '#1d3f9c'
  background: '#faf8ff'
  on-background: '#001550'
  surface-variant: '#dce1ff'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is engineered for the high-end sneaker enthusiast and the busy urban professional. It prioritizes a **Corporate Modern** aesthetic infused with **Subtle Glassmorphism** to evoke a sense of clinical precision and athletic energy. 

The visual narrative focuses on "The Restoration Detail." Like a high-performance vehicle or a limited-edition sneaker, the UI is structured, breathable, and premium. The update to a deeper, more monochromatic blue palette shifts the tone from "clinical/fresh" to "midnight/high-tech," emphasizing prestige and the high-value nature of the footwear being serviced. The emotional response should be one of reliability, elite craftsmanship, and modern sophistication.

## Colors

The palette is anchored in a professional **Navy Blue** (#001B44) to establish trust and authority. A vibrant **Electric Blue** (#074CE1) serves as the primary action color, providing the "sporty" energy required for a sneaker-centric brand. A **Deep Cobalt** (#073290) is used for sophisticated accents and depth, replacing lighter sky-blue tones for a more authoritative presence.

The background and neutral surfaces are derived from a **Blue-Tinted Neutral** (#053CB6), creating a "Midnight Canvas" effect. This ensures that even the "white" spaces feel integrated into the brand's premium blue hierarchy. Semantic colors for errors or warnings should be integrated with muted tones to prevent them from clashing with the intense blue-on-blue layering.

## Typography

This design system employs a dual-font strategy to balance impact with readability. **Montserrat** is used for all headlines; its geometric, bold structure mirrors urban architecture and athletic branding. High-level headings use tight letter-spacing and heavy weights to command attention.

**Plus Jakarta Sans** is used for body text and UI labels. Its soft curves and modern proportions provide a "welcoming" contrast to the aggressive headers, ensuring that long-form information and service descriptions remain highly legible and professional. All labels use a slightly tighter weight or uppercase styling to distinguish them from standard body copy.

## Layout & Spacing

The design system follows a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is built on an 8px base unit, ensuring all components and gaps are multiples of 8 to maintain mathematical harmony.

- **Desktop:** 12 columns with 24px gutters and 48px side margins. Content is centered with a max-width of 1280px.
- **Mobile:** 4 columns with 16px gutters and 16px side margins. 
- **Vertical Rhythm:** Use "Stack" variables to define distance between logical blocks. Large sections (e.g., Hero to Features) use `stack-lg`, while internal card elements use `stack-sm`.

## Elevation & Depth

To achieve the "premium" feel, the design system utilizes a combination of **Ambient Shadows** and **Glassmorphism**, now optimized for a darker blue environment.

1.  **Surfaces:** Main backgrounds utilize the neutral blue-tinted values. Secondary surfaces (like floating navigation or pricing tiers) use a "Glass" effect: 70% opacity white or light-blue with a 12px backdrop blur and a thin 1px border (#FFFFFF 20%).
2.  **Shadows:** Use extra-diffused shadows with a strong Navy Blue tint (#001B44 at 15% opacity). On the new darker backgrounds, shadows should be slightly more opaque to remain visible.
3.  **Hierarchy:**
    *   *Level 0 (Flat):* Primary background.
    *   *Level 1 (Raised):* Cards and inputs. Subtle 1px border + soft 4px blur shadow.
    *   *Level 2 (Floating):* Modals, dropdowns, and navigation bars. Deep 20px blur shadow.

## Shapes

The shape language is consistently **Rounded (Level 2)**. This mimics the organic yet structured form of premium sneakers. 

- **Cards/Containers:** Use a 1rem (16px) corner radius.
- **Buttons:** Use a 0.5rem (8px) radius for a professional "blocky" feel, or fully pill-shaped (rounded-full) for "sporty" call-to-action elements like "Book Now."
- **Inputs:** Maintain a consistent 8px radius to match the button language.
- **Visual Elements:** Avoid sharp 90-degree angles in the UI; even thin borders or dividers should have capped, rounded ends.

## Components

### Buttons
- **Primary:** Electric Blue background, white text, bold weight. Subtle glow shadow on hover.
- **Secondary:** Ghost style with Navy Blue border and Navy Blue text.
- **Tertiary:** Deep Cobalt background with white text for high-contrast, low-priority actions (e.g., "Add Protection").

### Cards
Cards are the primary vessel for service offerings. They should feature a 1px soft border and a Level 1 shadow. Image containers within cards should have a slightly smaller radius (12px) than the parent card (16px) to create a nested "inner margin" look.

### Input Fields
Inputs should use a very light-blue-tinted fill with a 1px border that turns Electric Blue on focus. Labels should be placed above the field in `label-md` styling.

### Chips & Status Indicators
Used for "Sneaker Type" (e.g., Leather, Suede, Knit). These are small, pill-shaped elements with a Deep Cobalt background and white or light-blue text.

### Interactive Lists
For service selection (e.g., Deep Clean, Sole Whitening), use list items with a subtle background hover state and a right-aligned Electric Blue chevron.

### Navigation Bar
A glassmorphic top-bar that remains sticky. It uses a 1px bottom border and high backdrop blur to ensure legibility over scrolling content.