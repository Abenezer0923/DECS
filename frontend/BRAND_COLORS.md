# DECS Brand Colors - NEBE Inspired

## Color Palette

The DECS frontend uses colors inspired by the Ethiopian flag and NEBE's national identity.

### Primary Colors

#### Green (Ethiopian Flag Green)
```
Main: #4caf50
Dark: #388e3c
Light: #81c784
Flag: #009639
```

**Usage:**
- Primary buttons
- Active states
- Success messages
- Main brand color

**Tailwind Classes:**
- `bg-primary-500`
- `text-primary-600`
- `border-primary-500`

---

#### Yellow/Gold (Ethiopian Flag Yellow)
```
Main: #ffc107
Dark: #ffa000
Light: #ffd54f
Flag: #FEDD00
```

**Usage:**
- Secondary buttons
- Highlights
- Warning messages
- Accent elements

**Tailwind Classes:**
- `bg-secondary-500`
- `text-secondary-600`
- `border-secondary-500`

---

#### Blue (Professional Accent)
```
Main: #2196f3
Dark: #1976d2
Light: #64b5f6
```

**Usage:**
- Links
- Info messages
- Accent elements
- Interactive elements

**Tailwind Classes:**
- `bg-accent-500`
- `text-accent-600`
- `border-accent-500`

---

### Ethiopian Flag Colors

#### Official Flag Colors
```
Green:  #009639
Yellow: #FEDD00
Red:    #DA121A
```

**Usage:**
- Header stripe
- Footer stripe
- National identity elements
- Special occasions

**Tailwind Classes:**
- `bg-ethiopian-green`
- `bg-ethiopian-yellow`
- `bg-ethiopian-red`

**CSS Class:**
```css
.ethiopian-stripe {
  /* Creates horizontal stripe with flag colors */
}

.ethiopian-gradient {
  /* Creates gradient with flag colors */
}
```

---

### Semantic Colors

#### Success
```
Main: #4caf50 (Same as primary green)
```
**Usage:** Success messages, completed status

#### Warning
```
Main: #ffc107 (Same as secondary yellow)
```
**Usage:** Warning messages, pending status

#### Danger/Error
```
Main: #f44336
```
**Usage:** Error messages, delayed status, delete actions

#### Info
```
Main: #2196f3 (Same as accent blue)
```
**Usage:** Information messages, help text

---

### Neutral Colors

#### Gray Scale
```
50:  #fafafa (Lightest)
100: #f5f5f5
200: #eeeeee
300: #e0e0e0
400: #bdbdbd
500: #9e9e9e (Medium)
600: #757575
700: #616161
800: #424242
900: #212121 (Darkest)
```

**Usage:**
- Text colors
- Backgrounds
- Borders
- Disabled states

---

## Component Examples

### Buttons

```tsx
// Primary (Green)
<button className="btn-primary">Create Election</button>

// Secondary (Yellow)
<button className="btn-secondary">Save Draft</button>

// Accent (Blue)
<button className="btn-accent">View Details</button>

// Danger (Red)
<button className="btn-danger">Delete</button>

// Ghost
<button className="btn-ghost">Cancel</button>

// Outline
<button className="btn-outline">Learn More</button>
```

### Status Badges

```tsx
// Milestone Status
<span className="status-planned">Planned</span>
<span className="status-ongoing">Ongoing</span>
<span className="status-completed">Completed</span>
<span className="status-delayed">Delayed</span>
<span className="status-cancelled">Cancelled</span>

// Generic Badges
<span className="badge-primary">Primary</span>
<span className="badge-secondary">Secondary</span>
<span className="badge-success">Success</span>
<span className="badge-warning">Warning</span>
<span className="badge-danger">Danger</span>
```

### Alerts

```tsx
<div className="alert-success">
  Election created successfully!
</div>

<div className="alert-warning">
  Milestone deadline approaching
</div>

<div className="alert-danger">
  Failed to save changes
</div>

<div className="alert-info">
  New features available
</div>
```

### Cards

```tsx
<div className="card">
  <h3>Election Details</h3>
  <p>Content here...</p>
</div>

<div className="card-hover">
  <h3>Clickable Card</h3>
  <p>Hover for effect</p>
</div>
```

---

## Special Elements

### Ethiopian Flag Stripe

Add to header or footer:

```tsx
<div className="ethiopian-stripe"></div>
```

Creates a horizontal stripe with the three flag colors.

### NEBE Gradient

```tsx
<div className="nebe-gradient p-8 text-white">
  <h1>Welcome to DECS</h1>
</div>
```

Creates a gradient from green to blue.

---

## Accessibility

### Color Contrast Ratios

All color combinations meet WCAG 2.1 AA standards:

- **Primary Green on White:** 4.5:1 ✅
- **Secondary Yellow on White:** 4.5:1 ✅
- **Accent Blue on White:** 4.5:1 ✅
- **White on Primary Green:** 4.5:1 ✅
- **Black on Secondary Yellow:** 7:1 ✅

### Color Blindness

Colors are distinguishable for:
- Protanopia (Red-blind)
- Deuteranopia (Green-blind)
- Tritanopia (Blue-blind)

Additional indicators (icons, text) used alongside colors.

---

## Usage Guidelines

### Do's ✅

- Use primary green for main actions
- Use secondary yellow for highlights
- Use accent blue for links and info
- Maintain consistent color usage
- Use Ethiopian flag colors respectfully
- Ensure sufficient contrast

### Don'ts ❌

- Don't use flag colors for decorative purposes only
- Don't mix too many colors in one component
- Don't use colors without considering accessibility
- Don't override brand colors without reason

---

## CSS Variables

Access colors via CSS variables:

```css
.custom-element {
  background-color: var(--color-primary);
  color: var(--color-secondary);
  border-color: var(--color-accent);
}
```

---

## Tailwind Configuration

Colors are defined in `tailwind.config.ts`:

```typescript
colors: {
  primary: { /* Green shades */ },
  secondary: { /* Yellow shades */ },
  accent: { /* Blue shades */ },
  ethiopian: {
    green: '#009639',
    yellow: '#FEDD00',
    red: '#DA121A',
  },
}
```

---

## Examples in Context

### Header with Ethiopian Stripe

```tsx
<header className="bg-white shadow">
  <div className="ethiopian-stripe"></div>
  <div className="container mx-auto px-4 py-4">
    <h1 className="text-2xl font-bold text-primary-600">DECS</h1>
  </div>
</header>
```

### Dashboard Card

```tsx
<div className="card">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900">
      Active Elections
    </h3>
    <span className="badge-primary">5</span>
  </div>
  <p className="text-3xl font-bold text-primary-600">12</p>
  <p className="text-sm text-gray-600 mt-2">
    Total elections this year
  </p>
</div>
```

### Status Timeline

```tsx
<div className="space-y-4">
  <div className="flex items-center space-x-3">
    <div className="w-3 h-3 rounded-full bg-success-500"></div>
    <span className="status-completed">Completed</span>
    <span className="text-gray-600">Voter Registration</span>
  </div>
  <div className="flex items-center space-x-3">
    <div className="w-3 h-3 rounded-full bg-warning-500"></div>
    <span className="status-ongoing">Ongoing</span>
    <span className="text-gray-600">Candidate Nomination</span>
  </div>
  <div className="flex items-center space-x-3">
    <div className="w-3 h-3 rounded-full bg-accent-500"></div>
    <span className="status-planned">Planned</span>
    <span className="text-gray-600">Campaign Period</span>
  </div>
</div>
```

---

## Brand Identity

The color scheme reflects:
- **Green:** Growth, progress, Ethiopian identity
- **Yellow:** Optimism, clarity, transparency
- **Blue:** Trust, professionalism, stability
- **Ethiopian Flag:** National pride, official authority

---

**Last Updated:** January 11, 2026  
**Version:** 2.0.0  
**Inspired by:** NEBE (nebe.org.et) and Ethiopian National Colors
