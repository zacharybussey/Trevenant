## Important Notes

- **Parcel Build Commands**: DO NOT run `npm run build` or `parcel build` commands. Only the user should run these commands directly.
- **Type Checking**: Use `npm run typecheck` to verify Elm compilation without creating build artifacts.

## WSL Development Setup

- **WSL is recommended** for this project to avoid Windows-specific issues (file watching, elm-test ENOENT errors)
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
  - DropdownTests.elm - re-implements dropdown logic inline (does not import the app); convert when the helpers are extracted
- Tests must import and exercise the real modules (Helpers, Types). Tests that re-implement the logic inside the test pass no matter what the app does.
  - EvolutionTests.elm - Evolving keeps moves/IVs/etc. and maps ability by slot
  - RosterTests.elm - Team/box drag-drop swaps, box sorting, Speed stat
- Windows: plain `npm test` fails with ENOENT (elm-test can't spawn `elm` without the .cmd extension). Run `npx elm-test --compiler "$(cygpath -w $PWD/node_modules/.bin/elm.cmd)"` from Git Bash instead; this works without WSL.

## Code layout

- One definition per helper: shared pure functions live in `src/Helpers.elm`, types in `src/Types.elm`. `Main.elm` imports both with `exposing (..)`; a duplicate definition in Main.elm silently shadows the Helpers one, so never copy a helper into Main.elm.
- Decode failures on any port are reported through the `logError` port to the browser console. Check the console first when data seems to be missing.
- `src/index.js`: `buildPokemon`/`buildField`/`damageOf` are the single place @smogon/calc objects are built; all three calc ports use them.

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
