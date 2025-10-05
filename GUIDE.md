# 🌊 Lunar Tides Simulation - User Guide

## Quick Start

Your simulation is now running at **http://localhost:3000**

## What You're Seeing

### Main Elements

1. **Earth (Blue Sphere)** - The center of our simulation
   - Solid land with oceans
   - Rotates slowly on its axis
   - Blue atmospheric glow

2. **Moon (Small Grey Sphere)** - Orbiting Earth
   - Can be dragged with your mouse
   - Shows realistic gravitational effects
   - Has a label above it

3. **Ocean Layer** - The blue, shimmering surface
   - Deforms to show tidal bulges
   - Waves animate continuously
   - Changes color based on tide height

4. **Green Arrow** - Gravitational force indicator
   - Points from Earth toward the Moon
   - Shows direction of tidal pull

5. **Tidal Labels** - Red and teal markers
   - "High Tide" (red) - appears on near and far sides
   - "Low Tide" (teal) - appears on the sides

## How to Interact

### Camera Controls
```
🖱️ Left Click + Drag     → Rotate camera
🖱️ Right Click + Drag    → Pan camera
🖱️ Scroll Wheel          → Zoom in/out
```

### Moon Controls
```
🖱️ Click Moon + Drag     → Move Moon around Earth
📱 Touch Moon + Drag      → (Mobile) Move Moon
```

### UI Panel (Bottom Center)

#### Moon Distance Slider
- **Range**: 3 to 8 units
- **Effect**: Closer Moon = stronger tides
- **Real-world**: Moon's actual distance varies (perigee/apogee)

#### Tide Strength Slider  
- **Range**: 0.5× to 2.0×
- **Effect**: Exaggerates or minimizes the tidal bulge
- **Use**: Educational emphasis

#### Rotation Speed Slider
- **Range**: 0 to 2.0×
- **Effect**: How fast Earth spins
- **Use**: Show daily tidal cycle

#### Start Moon Orbit Button
- Click to make the Moon orbit automatically
- Click again to stop
- Earth's tides follow the Moon's movement

#### Toggle Sun Button
- Shows/hides a yellow Sun sphere
- Demonstrates **spring tides** (Sun + Moon aligned)
- Demonstrates **neap tides** (Sun ⊥ Moon)

## Understanding the Physics

### Why Two Tidal Bulges?

**Common Misconception**: "The Moon only pulls water toward it"

**Reality**: There are TWO bulges!

1. **Near-side bulge** 
   - Water closest to Moon feels stronger gravity
   - Gets pulled toward the Moon

2. **Far-side bulge**
   - The solid Earth is pulled toward the Moon MORE than the water on the opposite side
   - Water "left behind" creates a bulge

### High vs Low Tides

- **High Tide**: Occurs where the bulges are
  - Once facing the Moon
  - Once on the opposite side
  - That's why most places get 2 high tides per day!

- **Low Tide**: Occurs at 90° from the Moon
  - Water is "pulled away" to form the bulges
  - Also happens twice per day

### Spring and Neap Tides

When you enable the Sun:

**Spring Tides** (Extra high and extra low)
- Sun and Moon aligned (full moon or new moon)
- Gravitational forces ADD together
- Occurs twice per month

**Neap Tides** (Moderate tides)
- Sun and Moon at 90° angle (quarter moons)
- Gravitational forces PARTIALLY CANCEL
- Occurs twice per month

## Experiments to Try

### Experiment 1: Distance Matters
1. Drag Moon very close to Earth (distance = 3)
2. Watch the huge tidal bulges
3. Move it far away (distance = 8)
4. See how tides diminish

**Lesson**: Gravitational force decreases with distance squared

### Experiment 2: Daily Tides
1. Click "Start Moon Orbit"
2. Increase Earth's rotation speed to 2.0
3. Watch as each point on Earth experiences:
   - High tide (facing Moon)
   - Low tide (90° from Moon)
   - High tide (opposite Moon)
   - Low tide (90° from Moon)

**Lesson**: Most coastal areas experience 2 high and 2 low tides daily

### Experiment 3: Spring vs Neap
1. Click "Toggle Sun"
2. Drag the Moon to align with the Sun (both on same side)
3. Notice STRONGER tides → **Spring Tide**
4. Drag the Moon 90° from the Sun
5. Notice WEAKER tides → **Neap Tide**

**Lesson**: Solar and lunar tides interact

### Experiment 4: Tidal Lag
1. Increase Earth rotation speed
2. Notice the ocean bulges stay aligned with the Moon
3. In reality, friction causes "tidal lag"

**Real-world note**: Actual high tide occurs ~30-60 min after the Moon is overhead

## Visual Cues

### Ocean Colors
- **Dark Blue**: Deep water (low tide regions)
- **Lighter Blue**: Shallow water (approaching high tide)
- **Brightest**: Highest tidal bulge points

### Wave Animation
- Subtle sine waves add realism
- Independent of tidal bulges
- Represents wind-driven surface waves

### Atmospheric Glow
- Blue halo around Earth
- Simulates light scattering in atmosphere
- Purely aesthetic

## Troubleshooting

### Textures Not Loading?
- The app uses procedural fallback textures
- You'll see simplified Earth/Moon if textures fail
- Doesn't affect tidal physics

### Performance Issues?
- Close other browser tabs
- Reduce window size
- Lower tide strength (less vertex calculations)

### Moon Won't Drag?
- Make sure to click directly on the Moon sphere
- Try zooming in closer
- Disable orbit mode if enabled

### Controls Feel Weird?
- Release all mouse buttons and try again
- Refresh the page if controls lock up
- On mobile, use one finger only

## Educational Tips

### For Teachers
- Have students predict where high tides occur
- Ask why there are TWO bulges (most get this wrong!)
- Demonstrate spring/neap tides with Sun toggle
- Show how distance affects tidal range

### For Students
- Try dragging the Moon BEHIND Earth (away from you)
- Notice the far-side bulge is still visible
- This proves it's not just "pulling water toward it"

### Key Concepts
1. **Differential Gravity**: Different parts of Earth experience different gravitational pull
2. **Tidal Force**: The DIFFERENCE in gravitational pull creates tides
3. **Centrifugal Force**: Earth-Moon system rotates around their common center of mass
4. **Superposition**: Multiple gravitational sources add together

## Advanced Features

### Keyboard Shortcuts (Future)
Currently controlled via UI, but you could add:
- `Space` - Toggle orbit
- `S` - Toggle Sun
- `R` - Reset camera
- `+/-` - Adjust tide strength

### API Integration (Future Ideas)
- Real-time Moon position data
- Actual tide predictions for your location
- ISS orbit visualization
- Other planetary tides (Jupiter's moons!)

## Fun Facts

🌊 **Highest tides on Earth**: Bay of Fundy, Canada (~16 meters!)

🌙 **Moon is moving away**: ~3.8 cm per year (tides were stronger in the past)

🌍 **Earth's rotation slowing**: Tidal friction adds ~1.7 milliseconds per century to day length

🪐 **Io's volcanism**: Jupiter's moon Io has extreme tidal heating → active volcanoes

⚡ **Tidal power**: Some countries generate electricity from tidal movements

## Next Steps

### Enhance Your Learning
- Research actual tidal charts for your nearest coast
- Compare simulation to real-world tide times
- Learn about tidal bores and resonance effects
- Study how coastline shape affects local tides

### Modify the Code
- Change ocean colors in the shader
- Add more planets or moons
- Implement real astronomical data
- Add tide height measurements

### Share Your Knowledge
- Show this to friends/family
- Use in presentations
- Explain why misconceptions exist
- Teach proper tidal physics

---

**Have fun exploring gravitational physics! 🚀🌊**

If you have questions, check the code comments in `src/main.js` - they explain the technical details.
