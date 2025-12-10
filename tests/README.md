# Trevenant Test Suite

This directory contains unit tests for the Trevenant Pokemon Damage Calculator.

## Test Files

### DamageCalcTests.elm
Tests for damage calculation core functionality:
- Stats encoding/decoding validation
- Pokemon state validation (level, boosts, EVs, IVs)
- Move state validation (hits, crits)
- Generation-specific rules (DVs vs IVs)

### TrainerDataTests.elm
Tests for trainer data loading and filtering:
- Game to generation mapping
- Trainer search filtering (name, class, location)
- Navigation index wrapping and clamping
- Team/Box persistence operations

### Example.elm
Basic test to verify the test infrastructure is working.

## Why These Tests Matter

### Data Validation
The damage calculator relies on precise data formatting. Tests ensure that:
- Stat values stay within valid ranges (EVs: 0-255, IVs: 0-31, DVs: 0-15)
- Generation-specific rules are applied correctly
- Pokemon state is always valid before calculations

### Search and Navigation
Trainer data searching and filtering is critical for usability:
- Case-insensitive search works correctly
- Filtering matches all relevant fields
- Navigation doesn't go out of bounds

### State Management
Team and Box persistence ensures users don't lose their data:
- Pokemon can be added and removed correctly
- State is properly serialized for localStorage

## Running Tests

```bash
npm test
```

Or with watch mode:
```bash
npx elm-test --watch
```

## Known Issues

There is a Windows-specific issue with elm-test (ENOENT error when creating output files). If you encounter this:
1. Try running as administrator
2. Check that elm-stuff directory has write permissions
3. Consider using WSL (Windows Subsystem for Linux)

## Test Dependencies

- elm-explorations/test: 2.2.0
- elm/random: 1.0.0 (for fuzz testing)
- elm/bytes: 1.0.8

## Architecture

The tests focus on Elm-side logic. The actual damage calculations happen in JavaScript via @smogon/calc, so those are tested separately. These tests validate:
- Data transformation and encoding
- State management
- UI logic (filtering, navigation, persistence)
