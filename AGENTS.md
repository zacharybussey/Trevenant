## Important Notes

- **Parcel Build Commands**: DO NOT run `npm run build` or `parcel build` commands. Only the user should run these commands directly.
- **Type Checking**: Use `npm run typecheck` to verify Elm compilation without creating build artifacts.

## WSL Development Setup

- WSL is optional. Build, typecheck and tests all work natively on Windows.
- See `WSL_SETUP.md` for complete setup instructions
- VSCode Extension: Install `ms-vscode-remote.remote-wsl`
- Open project in WSL: Run `code .` from WSL terminal or use "WSL: Open Folder in WSL..." command
- All development commands should be run in WSL terminal for best performance
- Project location: Recommended to use WSL file system (`~/projects/trevenant`) instead of `/mnt/c/` for better performance

## Dependencies

- **@pkmn/dex**: Provides evolution chain data (evos, prevo) not available in @smogon/calc. Required for the requestPokemonList handler in src/index.js. Install with `npm install @pkmn/dex`.

## Dev Server

- Run `npm start` to start the Parcel dev server
- The server hot-reloads on file changes
- User should manage the server themselves (don't start/stop via Claude)

## Building

- Use `npm run typecheck` to verify Elm type checking and compilation
- Run `npm run format` (elm-format, installed as a devDependency) after editing any .elm file; `npm run format:check` fails if anything is unformatted
- Do NOT run `npm run build` while the dev server is running (causes file locking issues on Windows)
- The dev server will automatically rebuild on file changes

## Trainer Data Conversion

- Run `node scripts/convert-trainer-data.js` to convert VanillaNuzlockeCalc data to JSON format
- Output goes to `src/data/trainers/*.json`
- Source data is in `VanillaNuzlockeCalc/js/data/sets/games/`

## Testing

- Tests are in the `./tests/` directory
- Run tests with `npm test`
- Test framework: elm-test (elm-explorations/test 2.2.0)
- Test files:
  - TrainerDataTests.elm - gameToGeneration, trainer search, encounter lookup, trainer → defender conversion
  - BattleStateTests.elm - clearBattleState and applyMegaStone
  - DecoderTests.elm - port result decoders (matchup result defenderIndex routing)
  - DropdownTests.elm - re-implements dropdown logic inline (does not import the app); convert when the helpers are extracted
- Tests must import and exercise the real modules (Helpers, Types). Tests that re-implement the logic inside the test pass no matter what the app does.
  - EvolutionTests.elm - Evolving keeps moves/IVs/etc. and maps ability by slot
  - RosterTests.elm - Team/box drag-drop swaps, box sorting, Speed stat
- Elm compiler is 0.19.2 (`elm` devDependency, `elm-version` in elm.json) with elm-test 0.19.2-1. parcel-transformer-elm still declares a peer dependency on elm ^0.19.1-5, which the 0.19.2 prerelease tag does not satisfy, so package.json has an `overrides` entry pointing it at the root `elm`. Keep that override until parcel-transformer-elm updates its peer range.
- `npm test` works on Windows. The old ENOENT failure was caused by a compiled `elm.js` committed in the repo root: Windows `which("elm")` checks the current directory with PATHEXT (.JS), so elm-test "ran" elm.js instead of the compiler. Never write compiled Elm output to the repo root (both names are now gitignored).

## Code layout

- One definition per helper: shared pure functions live in `src/Helpers.elm`, types in `src/Types.elm`. `Main.elm` imports both with `exposing (..)`; a duplicate definition in Main.elm silently shadows the Helpers one, so never copy a helper into Main.elm.
- Decode failures on any port are reported through the `logError` port to the browser console. Check the console first when data seems to be missing.
- `src/index.js`: `buildPokemon`/`buildField`/`damageOf` are the single place @smogon/calc objects are built; all three calc ports use them.

## Layout

- The page is a one-screen workspace at `md` (768px) and up (`md:h-screen`, no page scroll; the user runs it in roughly half a monitor, sometimes under 1024px): toolbar, damage strip, then Team+Box (left) and Opponent / Defender / Loadout / collapsibles (right, scrolls on its own). Keep new right-column content inside that column; anything that must stay visible while browsing the box belongs in the damage strip. Field conditions and battle state live in the Battle & Field pane (toolbar toggle, opens under the strip).
- Box panel has two views: Icons (BoxGrid: icon tiles, sort, Color Code vs the current defender) and Matchups (BoxBoard: every team/box Pokemon vs every Pokemon of the selected trainer). Board results reuse the matchup ports with a `defenderIndex` echo; see `updateWithMatchups` / `boardCommands` in Main.elm.
- Headless layout check: `node layout-check.mjs` in the scratch `h` folder builds a roster against Black Pearl Dan and reports page scroll, strip height, board cells and right-column overflow at 1280x1280 (see the puppeteer scripts there for the pattern: esbuild bundle of src/index.js + `npx elm make` output + PostCSS-built styles).

## Battle state and defenders

- `clearBattleState` / `startNewBattle`: stat stages, status, HP, Tera and Dynamax reset for everyone when the trainer changes. Anything that should persist across battles must not live in those fields.
- `defenderFromTrainer` is the only way a trainer entry becomes a defender (it applies Mega Stones). Don't call `trainerPokemonToState` directly from Main.elm.

## Key Features

**QualityOfLife Features (Completed 2025-11-25):**
- Auto-triggers: Weather abilities (Drought, Drizzle, etc.) and status items (Flame Orb, Toxic Orb) automatically set conditions
- Ability filtering: Pokemon's actual abilities appear first in dropdown (1-3 abilities at top)
- Move metadata: Displays Type, Category, Base Power, and Accuracy for each selected move
- Pokemon sprites: All team/box Pokemon display sprites from @pkmn/img
- Move learnset filtering: Shows Pokemon's learnable moves first, categorized by source (Level, TM, Tutor, Egg)
  - **CRITICAL**: The @pkmn/dex learnsets.get() method is async and MUST be awaited, otherwise it returns a Promise instead of data
  - Pre-evolution egg moves are inherited (e.g., Ferroseed's egg moves shown for Ferrothorn)
  - Mega evolutions and alternate forms use baseSpecies for learnset lookup
  - Move source notation format: "9L45" = Gen 9 Level 45, "8M" = Gen 8 TM, "8E" = Gen 8 Egg
  - Priority system prevents duplicates: Level > TM > Tutor > Egg (move only appears in highest priority category)
  - Generation fallback: If no moves found in current gen, searches backwards to earlier gens
  - Evolution moves (level 0) are labeled as [Evolve]

## Git / Deploy

- Work on `main` (remote `trevenant`). Pushing `main` deploys via the Azure Static Web Apps workflow (`npm run build:prod`, output `dist`).
- `archive/master-old` is a stale, unrelated local history; never push it.
