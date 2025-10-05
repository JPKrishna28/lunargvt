# 🌊 Lunar Tides Simulation

An interactive 3D visualization demonstrating how the Moon's gravitational pull causes tides on Earth, built with Three.js.

![Lunar Tides Simulation](https://img.shields.io/badge/Three.js-r160-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Functionality
- **Interactive 3D Earth** with realistic ocean deformation showing tidal bulges
- **Draggable Moon** - Move the Moon around Earth to see real-time tidal changes
- **Dynamic Ocean Shader** - Custom shader simulating tidal bulges and wave animations
- **Gravitational Force Visualization** - Green arrow showing the Moon's gravitational pull
- **Tidal Labels** - "High Tide" and "Low Tide" markers that follow the Moon's position

### Advanced Features
- **Automatic Moon Orbit** - Watch the Moon revolve around Earth with periodic tides
- **Sun Integration** - Toggle the Sun to simulate spring tides (aligned) and neap tides (perpendicular)
- **Adjustable Parameters**:
  - Moon distance (affects tidal strength)
  - Tide strength multiplier
  - Earth rotation speed
- **Realistic Lighting** - Directional sunlight with shadows
- **Atmospheric Effects** - Blue atmospheric glow around Earth
- **Starfield Background** - Thousands of procedurally generated stars

### User Interaction
- **Orbit Controls** - Rotate, zoom, and pan the camera
- **Mouse/Touch Drag** - Drag the Moon to any position around Earth
- **Responsive UI** - Works on desktop and mobile devices
- **Educational Labels** - Clear visual indicators and information panel

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd lunargvt
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## 🎮 How to Use

### Controls
- **Left Mouse Button + Drag** - Rotate camera around the scene
- **Right Mouse Button + Drag** - Pan the camera
- **Mouse Wheel** - Zoom in/out
- **Click & Drag Moon** - Move the Moon to change tidal forces

### UI Controls
- **Moon Distance Slider** - Adjust how far the Moon is from Earth (3-8 units)
- **Tide Strength Slider** - Amplify or reduce the tidal bulge effect (0.5-2.0x)
- **Rotation Speed Slider** - Control Earth's rotation speed (0-2.0x)
- **Start Moon Orbit Button** - Enable automatic orbital motion
- **Toggle Sun Button** - Show/hide the Sun to see combined gravitational effects

## 🌍 Physics Explained

### Tidal Forces
The simulation demonstrates how gravity creates **two** tidal bulges:

1. **Near-side bulge** - Water closest to the Moon is pulled more strongly
2. **Far-side bulge** - The Earth itself is pulled away from water on the opposite side

**High tides** occur where these bulges are located (facing toward and away from the Moon).

**Low tides** occur at the points perpendicular to the Moon's direction.

### Spring and Neap Tides
- **Spring Tides** - When Moon and Sun align (Sun visible), their gravitational forces combine for stronger tides
- **Neap Tides** - When Moon and Sun are at 90° (perpendicular), their forces partially cancel for weaker tides

## 🛠️ Technical Details

### Built With
- **Three.js** - 3D graphics library (v0.160.0)
- **Vite** - Build tool and dev server
- **WebGL Shaders** - Custom GLSL shaders for ocean deformation
- **OrbitControls** - Camera control system
- **CSS2DRenderer** - 2D labels in 3D space

### Custom Shader System
The ocean uses a vertex shader that:
- Calculates alignment between each ocean point and the Moon
- Applies quadratic displacement (creates two bulges)
- Adds Sun's influence when enabled
- Animates wave motion with sine/cosine functions

### Performance Optimizations
- Efficient geometry (128x128 sphere for ocean, 64x64 for Earth)
- Shadow mapping only for key objects
- Damped camera controls
- Responsive texture loading with fallbacks
- Optimized render loop with delta time

## 📁 Project Structure

```
lunargvt/
├── index.html           # Main HTML with UI overlay
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── src/
│   └── main.js          # Main application code
└── README.md            # This file
```

## 🎨 Customization

### Adjusting Tidal Strength
In `main.js`, modify the displacement calculation:
```javascript
float displacement = combinedTide * 0.15 * tideStrength + wave;
```
Change `0.15` to increase/decrease base tidal bulge size.

### Changing Ocean Colors
Modify the ocean shader's fragment shader:
```javascript
vec3 deepOcean = vec3(0.0, 0.2, 0.4);
vec3 shallowOcean = vec3(0.0, 0.4, 0.6);
```

### Adding More Celestial Bodies
Follow the `createMoon()` pattern to add additional bodies with gravitational influence.

## 🌐 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari (macOS/iOS)
- Opera

Requires WebGL support.

## 📚 Educational Use

This simulation is perfect for:
- Science classrooms teaching astronomy and oceanography
- Educational websites and museums
- Science communication and outreach
- Understanding gravitational physics visually

## 🐛 Known Issues

- Texture loading from CDN may fail on some networks (fallback to procedural textures)
- Mobile devices may experience lower frame rates on high-resolution displays

## 🤝 Contributing

Contributions are welcome! Some ideas:
- Add real-time date/time with accurate Moon phases
- Include Earth's axial tilt
- Add tidal range measurements
- Create preset camera positions
- Add sound effects

## 📄 License

MIT License - feel free to use this for educational purposes!

## 🙏 Acknowledgments

- Three.js community for excellent documentation
- NASA for planetary texture references
- OpenGL Shading Language documentation

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

**Enjoy exploring the tides! 🌊🌙**
