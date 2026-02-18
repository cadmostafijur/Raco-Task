# Marketplace Workflow — UI/UX Design Documentation

## 1. Design System

### Color Palette
- **Primary (Indigo):** #6366F1 — CTAs, links, active states
- **Accent (Emerald):** Success states, completed items
- **Background:** Light #FAFAFA / Dark #0C0C0F
- **Muted:** #71717A — Secondary text
- **Danger:** #EF4444 — Errors, reject
- **Success:** #22C55E — Accept, completed

### Status Colors
| Status      | Color   | Usage                    |
|-------------|---------|--------------------------|
| OPEN        | Emerald | Available projects       |
| REQUESTED   | Amber   | Pending assignment       |
| ASSIGNED    | Blue    | Solver allocated         |
| IN_PROGRESS | Indigo  | Active work              |
| SUBMITTED   | Violet  | Awaiting review          |
| COMPLETED   | Green   | Done                     |
| REJECTED    | Red     | Needs resubmission       |

### Typography
- **Font:** Inter (system fallback)
- **Scale:** 12px (caption) → 48px (display)
- **Weights:** 400 (body), 500 (medium), 600 (semibold), 700 (bold)

### Spacing
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

### Border Radius
- sm: 6px | md: 8px | lg: 12px | xl: 16px

### Shadows
- **Card:** 0 1px 3px rgba(0,0,0,0.1)
- **Card Hover:** 0 4px 6px rgba(0,0,0,0.1)
- **Soft:** 0 2px 15px rgba(0,0,0,0.07)

---

## 2. Layout Structure

### App Shell
- **Navbar:** Sticky, blur on scroll, role badge, profile dropdown
- **Sidebar:** Desktop only, 256px, collapsible on mobile
- **Main:** Flex-1, responsive padding

### Page Sections
- Hero (landing): Full viewport, gradient background
- Content: Container max-w-7xl, py-8
- Cards: Grid 1/2/3 columns responsive

---

## 3. Component Breakdown

### Button
- Variants: default, destructive, outline, secondary, ghost, link
- Sizes: default, sm, lg, icon
- Micro: hover lift (-translate-y-0.5), scale on tap

### Card
- Base: rounded-xl, border, shadow
- Hover: shadow grow, border primary tint, lift

### Badge
- Status-based colors
- Rounded-full, px-2.5, py-0.5

### FileUpload
- Drag & drop zone
- ZIP icon, progress bar
- Success/error states with animation

### LifecycleVisualization
- Horizontal timeline
- Animated step indicators
- Current step highlight with glow

---

## 4. Animation Strategy

- **Page enter:** fade + slide up (0.3s)
- **List items:** Stagger 0.05s per item
- **Buttons:** Scale 1.02 hover, 0.98 tap
- **Cards:** Y -2px hover
- **Loading:** Spinner or skeleton shimmer

---

## 5. UX Improvements

- Clear role distinction via badges and dashboard routing
- Empty states with CTAs
- Loading skeletons instead of spinners where appropriate
- Inline validation on forms
- Error messages with retry context

---

## 6. Accessibility

- Semantic HTML (nav, main, section)
- Focus-visible ring on interactive elements
- Sufficient color contrast (WCAG AA)
- Label associations for form inputs

---

## 7. Mobile Responsiveness

- Navbar: Hamburger menu < 768px
- Sidebar: Hidden on mobile, content full-width
- Grids: 1 col mobile, 2 tablet, 3 desktop
- Touch targets: min 44px
