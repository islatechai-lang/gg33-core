# GG33 Frosted UI Design Guidelines

## Design Approach
**Frosted UI Design System** - A glass morphism-based design language inspired by Whop's design system, featuring 12-step Radix color scales, subtle gradients, and modern visual hierarchy optimized for dark mode.

---

## Color System

### 12-Step Radix Color Scales
Using Radix color system with 12 steps for precise theming:

**Gray Scale (Foundation)**
- `gray-1`: Darkest (app background)
- `gray-2`: Card backgrounds, elevated surfaces
- `gray-3`: Hover states, active surfaces
- `gray-4`: Pressed states
- `gray-5`: Borders, separators
- `gray-6`: Secondary borders
- `gray-7-8`: Muted elements
- `gray-9`: Placeholder text
- `gray-10`: Secondary text, captions
- `gray-11`: Body text
- `gray-12`: Headings, primary text

**Amber/Gold (Primary Accent)**
- `amber-9`: Main accent, CTAs
- `amber-10`: Hover state
- `amber-11`: Text on light backgrounds
- `amber-a2-a4`: Subtle backgrounds

**Semantic Colors**
- **Green** (`green-9/11`): Success, positive actions
- **Red** (`red-9/11`): Error, destructive actions
- **Violet** (`violet-8/a2`): Secondary accents
- **Blue** (`blue-9/11`): Information states

---

## Typography Scale

Using numeric utility classes:
- `text-0`: 11px - Tiny labels, captions
- `text-1`: 12px - Small labels, secondary info
- `text-2`: 14px - Body text
- `text-3`: 16px - Larger body, descriptions
- `text-4`: 18px - Subheadings, card titles
- `text-5`: 20px - Section titles
- `text-6`: 24px - Page section headings
- `text-7`: 32px - Page headings
- `text-8`: 48px - Hero text
- `text-9`: 64px - Display text

---

## Component Variants

### Cards
- `variant="default"`: Gray background with border
- `variant="frosted"`: Glass morphism with blur
- `variant="glass"`: Lighter glass effect
- `variant="glow"`: Amber glow for emphasis
- `variant="elevated"`: Shadow with hover lift

### Buttons
- `variant="default"`: Standard primary
- `variant="gold"`: Golden gradient CTAs
- `variant="hero"`: Large gold for hero sections
- `variant="glass"`: Glass morphism
- `variant="outline"`: Border-only
- `variant="ghost"`: Transparent hover
- `variant="glow"`: Amber glow effect

### Badges
- `variant="default"`: Primary colored
- `variant="secondary"`: Muted gray
- `variant="outline"`: Border only
- `variant="success"`: Green
- `variant="warning"`: Amber
- Color modifiers: `color="amber"`, `color="green"`, etc.

### Inputs
- `variant="default"`: Standard input
- `variant="frosted"`: Glass morphism input
- `variant="cosmic"`: Glow effect on focus

---

## Gradient Classes

- `.gradient-text`: Amber to gold text gradient
- `.bg-gold-gradient`: Gold button gradient
- `.glass`: Glass morphism background
- `.frosted-card`: Frosted glass card
- `.shadow-glow`: Amber glow shadow

---

## Spacing System

**Consistent Padding:**
- Cards: `p-4` to `p-6`
- Sections: `py-12` to `py-20`
- Component gaps: `gap-2`, `gap-4`, `gap-6`

**Container:**
- Max width: `max-w-6xl` (primary content)
- Margins: `mx-auto px-4`

---

## Animation Classes

- `.animate-fade-in`: Fade in on mount
- `.animate-slide-up`: Slide up entrance
- `.animate-scale-in`: Scale up entrance

---

## Best Practices

1. **Color Usage**: Use semantic tokens over hardcoded values
2. **Cards**: Prefer Card variants over custom bg styling
3. **Text Hierarchy**: `gray-10` → `gray-11` → `gray-12`
4. **Glass Effects**: Use sparingly for visual interest
5. **Gold Accent**: Reserve for primary actions only
6. **Borders**: Use `gray-5` for subtle borders
7. **Hover States**: Built into Button/Badge components

---

## Dark Mode Notes

App uses dark-first design:
- Dark backgrounds (gray-1 to gray-3)
- Light text (gray-11 to gray-12)
- Vibrant accents (amber, violet)
- Colors adapt via CSS variables
