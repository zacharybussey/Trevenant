# Trevenant

A Pokemon damage calculator designed for Nuzlockes, with complete trainer encounter data for all mainline games.

I wanted to build a better calc which was tailored to how I found myself using a calc during a Nuzlocke.
This was mainly to capture a new Pokemon, enter its stats and moves, add it to the box.  Then, when planning a fight
or in the middle one of one, explore different options and iterate quickly on different senarios.

I couldn't find a calc that did all of that well, so I built one.  It will be improved upon and refined further.
I'm hoping that this is helpful now and inspires new approaches to how calcs are approached in the future.

## Features

- **Trainer Encounter Data** - Complete rosters for all trainers in mainline Pokemon games (Gen 1-9)
- **Box Matchup Analysis** - Color-coded display showing how your entire box matches up against selected opponents
- **Weather & Terrain Visualization** - Dynamic backgrounds that reflect active field conditions
- **Crit Damage Display** - Shows both normal and critical hit damage simultaneously
- **Move Learnset Filtering** - Prioritizes moves your Pokemon can actually learn
- **Auto-Triggers** - Weather abilities and status items automatically set conditions
- **ROM Hack Support** - Includes data for select ROM hacks (Black Pearl)

## Tech Stack

- **Elm** - Frontend application
- **@smogon/calc** - Damage calculation engine
- **@pkmn/dex** - Pokemon data (learnsets, evolutions)
- **@pkmn/img** - Pokemon sprites
- **TailwindCSS + DaisyUI** - Styling

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
npm install
```

### Run Development Server

```bash
npm start
```

The app will be available at `http://localhost:1234`.

### Run Tests

```bash
npm test
```

### Type Check

```bash
npm run typecheck
```

### Production Build

```bash
npm run build:prod
```

Output goes to `dist/`.

## Project Structure

```
src/
  Main.elm      - Core application logic
  Types.elm     - Type definitions
  Decoders.elm  - JSON decoders
  Encoders.elm  - JSON encoders
  Helpers.elm   - Pure helper functions
  index.js      - JavaScript interop (ports, @smogon/calc)
  index.html    - Entry point
  styles.css    - TailwindCSS styles
  data/
    trainers/   - Trainer encounter data (JSON)
tests/
  DamageCalcTests.elm
  TrainerDataTests.elm
```

## Acknowledgments

See [ATTRIBUTION.md](ATTRIBUTION.md) for full credits.

- **@smogon/calc** - Damage calculation engine by Honko and contributors
- **VanillaNuzlockeCalc** - Trainer data by Honko and contributors
- **@pkmn** - Pokemon data and sprites

## License

MIT - See [LICENSE](LICENSE)
