# NarrativeFlow

A premium React story generator application with a cosmic fantasy manuscript aesthetic, featuring a three-panel layout with glassmorphism effects, animated space backgrounds, and an elegant parchment-styled writing interface.

## Features

- **Three-Panel Layout**: Left sidebar (story info), center panel (parchment story display), right sidebar (AI choices)
- **Animated Space Background**: Twinkling stars, nebula clouds, constellation lines, and floating sparkles
- **Glassmorphism Design**: Frosted glass effects on sidebars with backdrop blur
- **Parchment Texture**: Aged paper aesthetic for the main story display
- **Responsive Design**: Panels stack vertically on mobile devices
- **Interactive Elements**: Hover effects, smooth animations, and glow effects throughout
- **Story Management**: Start new stories, load saved stories, and manage your narratives
- **AI Co-Pilot**: Get AI-generated choices to continue your story
- **Story Actions**: Rewrite, expand, and continue your story with AI assistance
- **Settings**: Adjust creativity levels and point of view preferences

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Custom CSS animations

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── Background.tsx      # Animated space background
│   │   ├── LeftPanel.tsx       # Story info sidebar
│   │   ├── CenterPanel.tsx     # Main story display
│   │   ├── RightPanel.tsx      # AI choices sidebar
│   │   ├── GlassCard.tsx       # Reusable glassmorphism card
│   │   ├── Button.tsx          # Styled button component
│   │   └── Sparkle.tsx         # Floating sparkle decoration
│   ├── data/
│   │   └── mockData.ts         # Mock story data
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles and animations
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette:
- `cosmic.*` - Space and dark theme colors
- `amber.*` - Amber accent colors
- `bronze.*` - Bronze accent colors
- `parchment.*` - Parchment texture colors

### Fonts

The app uses:
- **Crimson Text** (serif) - For story text
- **Inter** (sans-serif) - For UI elements

Fonts are loaded from Google Fonts in `index.html`.

### Animations

Custom animations are defined in:
- `tailwind.config.js` - Keyframe definitions
- `src/index.css` - Animation implementations

## Browser Support

- Modern browsers with CSS `backdrop-filter` support
- Fallbacks provided for older browsers

## License

MIT

