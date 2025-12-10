# UI Redesign - Nuzlocke-Optimized Layout

## Design Philosophy

The gameplay loop has two distinct phases:

1. **Data Entry Phase** - Catching something new, entering species, base stats, ability, level, etc.
2. **Fight Planning Phase** - Cycling through moves, items, team members, and battle state against opponents

This redesign optimizes for the fight planning phase while keeping data entry accessible but out of the way.

## Important Implementation Note

**Do not lose any existing features during implementation.** If a feature from the current UI is not explicitly placed in this design, STOP and ask where it belongs before proceeding. All current functionality must be preserved.

---

## Layout Structure

### Top: Damage Results (Split Left/Right)

```
┌──────────────────────────┬───────────────────────────┐
│  ATTACKER MOVES          │  DEFENDER MOVES           │
│  ┌────────┬────────┐     │     ┌────────┬────────┐  │
│  │ Move 1 │ Move 2 │     │     │ Move 1 │ Move 2 │  │
│  │ 45-52% │ 22-28% │     │     │ 18-22% │ 50-60% │  │
│  ├────────┼────────┤     │     ├────────┼────────┤  │
│  │ Move 3 │ Move 4 │     │     │ Move 3 │ Move 4 │  │
│  │ 0%     │ 33-40% │     │     │ 0%     │ 12-15% │  │
│  └────────┴────────┘     │     └────────┴────────┘  │
│  [Selected move detail]  │  [Selected move detail]   │
│  KO chance, damage rolls │  KO chance, damage rolls  │
└──────────────────────────┴───────────────────────────┘
```

- Moves split left/right to mirror the two-column layout below
- Always visible at top (consider sticky positioning)
- Click a move to see detailed KO chance and damage rolls
- Speed indicator shows who moves first

### Field Conditions

```
┌──────────────────────────────────────────────────────┐
│  FIELD CONDITIONS                                    │
│  Weather: [None▼]  Terrain: [None▼]                 │
│  ┌─────────────────────┐  ┌───────────────────────┐ │
│  │ Attacker Side       │  │ Defender Side         │ │
│  │ □ Reflect □ L.Screen│  │ □ Reflect □ L.Screen  │ │
│  │ □ Tailwind □ Stealth│  │ □ Tailwind □ Stealth  │ │
│  └─────────────────────┘  └───────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

- Part of planning zone - important when relevant
- Collapsible to save space when not needed

### Main Two-Column Layout

```
┌──────────────────────────┬───────────────────────────┐
│  ATTACKER SIDE           │  DEFENDER SIDE            │
│                          │                           │
│  [Team & Box Selection]  │  [Trainer Selection]      │
│  [Loadout Controls]      │  [Defender Info]          │
│  [Battle State]          │  [Battle State]           │
│  [Base Stats - collapsed]│  [Base Stats - collapsed] │
│                          │                           │
└──────────────────────────┴───────────────────────────┘
```

Maintains familiar attacker-left, defender-right orientation.

---

## Section Details

### Team & Box Selection (Attacker Side)

```
┌────────────────────┐
│ TEAM & BOX         │
│ ● Pikachu    L25   │  ← Selected/loaded
│ ○ Geodude    L24   │
│ ○ Magikarp   L20   │
│ ─────────────────  │
│ Box: [+12 more ▼]  │
└────────────────────┘
```

- Quick one-click to load team member as attacker
- Visual indicator for currently loaded mon
- Evolution button on team members
- Drag/drop between team and box
- Box collapsed by default, expandable

### Trainer Selection (Defender Side)

```
┌─────────────────────┐
│ TRAINER SELECTION   │
│ [Route/Gym Filter▼] │
│ Bug Catcher Tim     │
│ ┌───┬───┬───┐      │
│ │Cat│Wee│Met│      │  ← Click to load as defender
│ └───┴───┴───┘      │
└─────────────────────┘
```

- Filter by route/gym/trainer type
- Show trainer's full team as clickable cards
- One-click loads Pokemon as defender

### Loadout Controls (Attacker Side)

```
┌────────────────────┐
│ LOADOUT            │
│ Item: [Leftovers▼] │
│ ┌──────┬──────┐    │
│ │Move 1│Move 2│    │
│ │[Thun▼│[Volt▼│    │
│ ├──────┼──────┤    │
│ │Move 3│Move 4│    │
│ │[Surf▼│[Gras▼│    │
│ └──────┴──────┘    │
└────────────────────┘
```

- Item dropdown
- 4 Move dropdowns (choose which moves the Pokemon knows)
- These are the pre-fight planning decisions you iterate on
- Positioned near team selection for tight planning loop

### Defender Info (Defender Side)

```
┌─────────────────────┐
│ DEFENDER INFO       │
│ Caterpie L8         │
│ Ability: Shield Dust│
│ Item: None          │
│ Moves: Tackle,      │
│        String Shot  │
│ [▼ Edit]            │
└─────────────────────┘
```

- Compact read-only view by default
- Shows species, level, ability, item, moves
- Expand to edit mode only when needed
- Opponent data is typically static in Nuzlocke

### Battle State (Both Sides)

```
┌────────────────────┐
│ BATTLE STATE       │
│ HP: [===----] 65%  │
│ Status: [None ▼]   │
│ Tera: [Electric▼]  │
│ ┌─────┬─────┬────┐ │
│ │Atk  │Def  │SpA │ │
│ │[+2] │[ 0] │[ 0]│ │
│ ├─────┼─────┼────┤ │
│ │SpD  │Spe  │Acc │ │
│ │[ 0] │[ 0] │[ 0]│ │
│ └─────┴─────┴────┘ │
└────────────────────┘
```

This section contains **temporary per-battle modifiers**:
- Current HP (slider or input)
- Status condition (Burn, Paralysis, etc.)
- Tera Type (and whether currently Tera'd)
- Stat boosts (-6 to +6 for Atk, Def, SpA, SpD, Spe, Acc, Eva)

These change during/between turns and are distinct from permanent stats.

### Base Stats (Both Sides, Collapsed by Default)

```
┌────────────────────┐
│ BASE STATS [▼]     │
│ Level: [25]        │
│ Nature: [Adamant▼] │
│ Ability: [Static▼] │
│                    │
│ EVs:               │
│ HP[0] Atk[252]... │
│                    │
│ IVs:               │
│ HP[31] Atk[31]... │
└────────────────────┘
```

- Collapsed by default - only needed during initial data entry
- Contains: Level, Nature, Ability, EVs, IVs
- Species selection (with base stat auto-fill)
- Expand when catching new Pokemon or fine-tuning

---

## Interaction Patterns

### Fight Planning Loop
1. Click team member → loads as attacker
2. Adjust item and moves in Loadout section
3. See damage results update in top bar
4. Click different trainer Pokemon → loads as defender
5. Tweak battle state (boosts, status) as needed
6. Repeat

### Data Entry Mode
1. Expand Base Stats section
2. Enter species (auto-fills base stats)
3. Set level, nature, EVs/IVs
4. Configure moves and item in Loadout
5. Add to team
6. Collapse Base Stats, return to planning

### Read-Only Defender
- Opponent stats shown in compact view
- Only expand to Edit when you need to correct data
- Trainer Pokemon data doesn't change during a run

---

## Feature Preservation Checklist

Before implementation, verify placement of all current features:

### Pokemon Data
- [ ] Species selection with autocomplete
- [ ] Level input
- [ ] Nature selection
- [ ] Ability selection
- [ ] Item selection
- [ ] Gender selection (if applicable)
- [ ] Types display

### Stats
- [ ] Base stats display
- [ ] EVs (all 6 stats)
- [ ] IVs (all 6 stats)
- [ ] Final calculated stats display
- [ ] Stat boosts (-6 to +6)

### Moves
- [ ] 4 move slots with autocomplete
- [ ] Crit toggle per move
- [ ] Hits count for multi-hit moves

### Battle State
- [ ] Current HP
- [ ] Status condition
- [ ] Tera Type

### Team/Box
- [ ] Team list (6 max)
- [ ] Box storage
- [ ] Drag and drop
- [ ] Evolution support
- [ ] Add/Remove from team

### Trainers
- [ ] Trainer encounter list
- [ ] Trainer Pokemon display
- [ ] Load trainer Pokemon as defender

### Field
- [ ] Weather
- [ ] Terrain
- [ ] Attacker side conditions (Reflect, Light Screen, etc.)
- [ ] Defender side conditions
- [ ] Entry hazards

### Results
- [ ] Damage range display
- [ ] Damage percentage
- [ ] KO chance calculation
- [ ] Damage rolls
- [ ] Speed comparison
- [ ] Move selection highlighting

### Other
- [ ] Generation selection
- [ ] Any import/export functionality
- [ ] Any persistence/save features

**If any feature is not accounted for in this design, stop and ask where it belongs.**

---

## Benefits for Nuzlocke Play

1. **Faster matchup cycling** - Click through team members quickly against same opponent
2. **Less visual clutter** - Opponent data is stable, hide it until needed
3. **Move-focused** - The 8 moves and their damage are front and center
4. **Planning controls grouped** - Item, moves, and team selection are adjacent
5. **Battle state accessible** - Boosts, status, Tera easily adjustable during planning
6. **Quick opponent switching** - Jump between trainer's Pokemon without scrolling
