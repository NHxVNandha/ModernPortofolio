---
name: Cherish Bite Style
colors:
  surface: '#fdf8f5'
  surface-dim: '#ded9d6'
  surface-bright: '#fdf8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f3f0'
  surface-container: '#f2edea'
  surface-container-high: '#ece7e4'
  surface-container-highest: '#e6e2df'
  on-surface: '#1c1b1a'
  on-surface-variant: '#504441'
  inverse-surface: '#32302e'
  inverse-on-surface: '#f5f0ed'
  outline: '#827470'
  outline-variant: '#d4c3be'
  surface-tint: '#75584d'
  primary: '#72564c'
  on-primary: '#ffffff'
  primary-container: '#8d6e63'
  on-primary-container: '#fffcff'
  inverse-primary: '#e4beb2'
  secondary: '#805062'
  on-secondary: '#ffffff'
  secondary-container: '#fec1d6'
  on-secondary-container: '#7b4c5e'
  tertiary: '#705937'
  on-tertiary: '#ffffff'
  tertiary-container: '#8a714e'
  on-tertiary-container: '#fffdff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbce'
  primary-fixed-dim: '#e4beb2'
  on-primary-fixed: '#2b160f'
  on-primary-fixed-variant: '#5b4137'
  secondary-fixed: '#ffd9e4'
  secondary-fixed-dim: '#f2b6cb'
  on-secondary-fixed: '#330f1f'
  on-secondary-fixed-variant: '#65394b'
  tertiary-fixed: '#feddb3'
  tertiary-fixed-dim: '#e1c299'
  on-tertiary-fixed: '#281801'
  on-tertiary-fixed-variant: '#584324'
  background: '#fdf8f5'
  on-background: '#1c1b1a'
  surface-variant: '#e6e2df'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
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
  xs: 0.5rem
  sm: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  2xl: 4rem
  gutter: 1.5rem
  margin-mobile: 1rem
  margin-desktop: 5rem
  max-width: 1200px
---

## Brand & Style

The design system is built upon the "Sweet Minimalist" aesthetic, drawing heavy inspiration from modern Korean cafe culture. It prioritizes a sense of calm, curated indulgence through the use of generous negative space, soft-focus imagery, and a tactile, friendly UI. The emotional goal is to make the user feel as though they are stepping into a boutique patisserie—a space that is warm, personal, and meticulously crafted.

The style blends **Minimalism** with **Soft Tactile** elements. It avoids the clinical coldness of traditional tech minimalism by introducing organic roundedness and a palette that mimics natural ingredients like cream, cocoa, and fruit. Every interaction should feel smooth and intentional, mirroring the experience of enjoying a premium, bite-sized dessert.

## Colors

The color palette is culinary-inspired, designed to evoke flavor and comfort. 

- **Primary (Milk Chocolate):** Used for typography, primary buttons, and structural elements to provide grounding and sophistication.
- **Secondary (Soft Pink):** An accent color used sparingly for highlights, special offers, or playful micro-interactions to emphasize the "sweet" nature of the brand.
- **Tertiary (Caramel):** Used for decorative elements, icon accents, and secondary actions.
- **Neutral (Cream & Beige):** These serve as the foundation of the UI. Cream is the primary background to ensure a soft, low-strain reading experience, while Beige is used for subtle section nesting and container differentiation.

All interactive states should use a slightly darkened version of these pastels to maintain accessibility without breaking the soft aesthetic.

## Typography

This design system utilizes a high-contrast typographic pairing to balance tradition with modernity. 

**Playfair Display** is reserved for headlines and editorial moments. Its high-contrast serifs evoke the "premium" aspect of the brand. For large display text, use tighter letter-spacing to create a fashionable, magazine-like feel.

**Montserrat** provides a clean, geometric counterpoint for body copy and labels. Its open apertures ensure legibility even at small sizes, maintaining the "modern" and "clean" requirement of the brand. Body text should always use a generous line height (1.6) to support the airy, spacious layout philosophy.

## Layout & Spacing

The layout philosophy centers on a **Fixed Grid with Fluid Padding**. Content is contained within a 1200px maximum width to maintain a sense of curation and focus. 

- **Desktop:** 12-column grid with 24px (1.5rem) gutters. Use large outer margins (80px+) to create the "premium boutique" feel.
- **Mobile:** 4-column grid with 16px (1rem) gutters.
- **Rhythm:** Spacing follows an 8px base unit. For section vertical spacing, lean toward `xl` (3rem) or `2xl` (4rem) to ensure the design feels "airy" and never cramped. 

Avoid dense information clusters. If a section feels crowded, increase the padding rather than reducing font sizes.

## Elevation & Depth

To maintain the soft, friendly tone, this design system avoids harsh, dark shadows. Instead, it uses **Ambient Tonal Depth**:

1.  **Tonal Layering:** Depth is primarily communicated through subtle background shifts (e.g., a Beige card sitting on a Cream background).
2.  **Soft Shadows:** When elevation is required (like for a floating cart or a primary button), use "Diffusion Shadows"—very large blur radii (20px+) with extremely low opacity (5-10%) using the Primary Chocolate color rather than pure black. This creates a "glow" rather than a hard shadow.
3.  **Backdrop Blurs:** For overlays and navigation bars, use a light background blur (8px-12px) with 80% opacity Cream to maintain the "Glassmorphism" influence typical of modern aesthetic apps.

## Shapes

The shape language is the core of the "friendly and cozy" feel. All interactive and container elements use significantly rounded corners.

- **Standard Elements (Buttons, Inputs):** Use `rounded-lg` (1rem / 16px).
- **Cards & Image Containers:** Use `rounded-xl` (1.5rem / 24px) or higher (up to 32px) to mimic the soft edges of a dessert or a pastry box.
- **Icon Containers & Chips:** Use pill-shaping (full rounding) to contrast against the structured grid.

Avoid sharp corners entirely, as they conflict with the "warm and sweet" brand personality.

## Components

### Buttons
Primary buttons should be Milk Chocolate with Cream text, featuring a 2xl corner radius. Secondary buttons should use a Caramel border with Caramel text. Avoid "Ghost" buttons; instead, use tonal backgrounds (e.g., a Soft Pink background for a subtle secondary action).

### Cards
Cards are the primary vehicle for dessert displays. They should have no border, a subtle Beige background, and 24px–32px corner radii. Images within cards should always occupy the top portion and inherit the top corner radius.

### Input Fields
Inputs use a Cream-to-Beige fill with a very thin (1px) Milk Chocolate border at low opacity (20%). On focus, the border opacity increases, and a soft Caramel outer glow appears.

### Chips & Tags
Used for flavors (e.g., "Gluten-Free," "New"). These should be pill-shaped, using the Soft Pink or Caramel colors with dark chocolate text.

### Lists & Menus
List items should have generous vertical padding (16px+) and use a subtle Milk Chocolate divider line with only 10% opacity to keep the look "clean."

### Dessert Gallery (Specialty Component)
A masonry or horizontal-scroll gallery for "Bite-Sized" categories, using slightly alternating card heights to give a playful, artisanal feel to the catalog.