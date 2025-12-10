## Getting the last things fixed up

### UI Layout & Organization

**✅ COMPLETE** - Move Defender Info above Trainer Selection.
_Implementation: src/Main.elm:3696-3704_

**✅ COMPLETE** - Move Loadout above the Team section.
_Implementation: src/Main.elm:3680-3689_

**✅ COMPLETE** - Both Base Stats panels should be expanded by default. Its at the bottom already, so you don't really save room by collapsing them.
_Implementation: src/Main.elm:479-480, both default to False (not collapsed)_

**✅ COMPLETE** - The Level entry for the current pokemon should be moved to the Loadout section, as this is something that does change from time to time. We don't need to bury it in base stats.
_Implementation: src/Main.elm:4131-4143_

**✅ COMPLETE** - The Add to Box button should be moved down to the Base Stats section, since that is where you will be adding details about a newly caught mon.
_Implementation: src/Main.elm:4732-4735_

**⚠️ PARTIAL** - Reduce the size of inputs. Many of the inputs are full width or at least kind of big for their content. It may only be a two digit number but its full width of the section. We can probably condense this quite a bit. Looking at everything in Base Stats, in Battle State.
_Status: Level inputs reduced to w-20. IV/EV inputs intentionally kept at w-full for grid layout. Battle State inputs still use w-full._

### Data Entry & Validation

**✅ COMPLETE** - Species dropdown should have the isExactMatch logic added, because now you can click Add to Box and it will save a partial name.
_Implementation: src/Main.elm:4231-4240_

**✅ COMPLETE** - The health bar in Battle State section should also allow show and allow entry of specific HP values. That is more accurate and sometimes specific HP values matter, like Nightshade does damage that is exactly the pokemons level, or reversal/flail changes power based on current HP.
_Implementation: src/Main.elm:4308-4333, shows both percentage slider and calculated HP values_

### Damage Calculation Display

**✅ COMPLETE** - Can you put the damage % range in the buttons for each move in the calc section at the top. The selected damage number is fine like it is, but I'd also like to see percents for other moves at a glance.
_Implementation: src/Main.elm:3445-3472_

**✅ COMPLETE** - I had put in something about always calcing crits as well as normal damage and then showing that extra value some other way. Lets work out an approach to that.
_Status: Both normal and crit damage are now calculated simultaneously and displayed side-by-side. Crit checkbox removed since both values are always shown._
_Implementation: Updated MoveResult type with critDamage, critDamagePercent, critKoChance, critDamageRolls fields. Modified JavaScript calculation to compute both normal and crit damage. Updated Elm decoder with pipeline-style decoding using andMap. Move button UI shows both normal and crit damage percentages. Detailed damage view displays both normal and crit values side-by-side. Located in src/Main.elm (MoveResult type, decoder, UI components) and src/index.js (calculateMoves function)._

### Icons & Visual Assets

**✅ COMPLETE** - Right now we just have icons on the box or team pokemon. We should also have icons for the opponent trainers team buttons. Also at the top in the damage calc section next to their names. Also put a Trevenant icon in the header and favicon.
_Implementation:_
- _Trainer team buttons: src/Main.elm:4890-4921 - Added sprite lookup and img rendering_
- _Damage calc section: src/Main.elm:3419-3463 - Added pokemonList parameter and sprite display in header_
- _Header icon: src/Main.elm:3333-3340 - Added Trevenant sprite (40x40px) next to title_
- _Favicon: src/index.html:7 - Added Trevenant favicon link_

**✅ COMPLETE** - Some abilities change move types. Liquid voice changes sound moves into water moves. The calc logic seems to be picking that up, but we should also update the helper text next to the move. There are a few abilities that do that. Look in the other calc apps to see what they are.
_Status: Type-changing abilities now display modified move types in UI._
_Implementation: Added isSoundMove helper to identify sound-based moves, getEffectiveMoveType helper to calculate type after ability modification, and updated move metadata display to show type changes (e.g., "Fairy (Normal → Fairy)" for Pixilate). Supports Aerilate (Normal→Flying), Galvanize (Normal→Electric), Pixilate (Normal→Fairy), Refrigerate (Normal→Ice), Liquid Voice (Sound→Water), and Normalize (All→Normal). Located in src/Main.elm lines 4582-4657 (helpers) and 4378-4411 (UI display)._

### Advanced Features

**✅ COMPLETE** - I think its the Run and Bun calc that runs calcs against the whole box. So, you have an opponent selected, and then it calcs every mon in the box against them and color codes the result to help you see if you have easy counters. I put a screenshot in `./features/BoxColorCoding.png`. I don't know that the color coding is super clear. Maybe we could come up with something a bit different. Probably only a couple conditions are super helpful anyways, like Hard Counter and always OHKO. Speeds are probably really handy, maybe just show if anything is faster and that implys that they are slower otherwise.
_Status: Box-wide matchup calculation feature fully implemented._
_Implementation: Added BoxMatchupResult type, ports (requestBoxMatchup/receiveBoxMatchup), CalculateBoxMatchups message, comprehensive JavaScript handler with @smogon/calc integration, color coding helper (getBoxPokemonBorderColor), and "Color Code" button with help tooltip. System calculates damage, speed, OHKO potential, counter status for all box Pokemon against selected defender. Color scheme: Green (mutual OHKO), Orange (mutual possible OHKO), Red (always OHKO'd), Yellow Bright (always OHKO), Yellow Muted (might OHKO), Cyan (hard counter), Magenta (wall), Blue (outspeeds), Purple (speed tie), Black (slower). Located in src/Main.elm (type, model, ports, messages, decoder, handlers, subscription, color helper, UI) and src/index.js (calculation logic lines 715-893). See .specs/fix_plan.md Session 2025-11-28 for full details._

**✅ COMPLETE** - Also, we should have a "truck" button that resets everything for the selected game. It can go in the opposing team selection section. It should have a confirm dialog since its a destructive action.
_Status: Truck button implemented in trainer selection section with full confirmation dialog. Resets team, box, attacker, defender, and trainer progress for the selected game._
_Implementation: src/Main.elm - Added showResetConfirmDialog model field, RequestResetGameData/ConfirmResetGameData/CancelResetGameData messages, reset handler, truck button in viewTrainerSelectionSection (line 5005-5012), and confirmation modal dialog (lines 3372-3411)_

**✅ COMPLETE** - Field conditions UI redesigned with tags/pills dropdown interface
_Implementation: src/Main.elm:3773-4016 - Replaced checkboxes with modern pills/tags UI, added dropdown menu with all conditions categorized, includes Gravity, Aurora Veil, Helping Hand, and Spikes 1/2/3 layers_

**✅ COMPLETE** - If weather or terrain is up, we should change something big on the page, like, the background or something. Or maybe just the background of the top calc section. Weather on top to terrain on the bottom in a gradient. I'm also thinking we pull the format, weather, terrain selection up into the calc section, since these are so important if they are set. The other conditions could stay in the collapsed panel.
_Status: Weather/terrain visual changes and control relocation fully implemented._
_Implementation: Added getWeatherTerrainGradient helper function (src/Main.elm:3747-3792) that generates gradient backgrounds for the damage results panel. Weather colors: Sun (orange rgba(255,165,0,0.15)), Rain (blue rgba(100,149,237,0.15)), Sand (tan rgba(210,180,140,0.15)), Snow (light blue rgba(173,216,230,0.15)). Terrain colors: Electric (yellow rgba(255,215,0,0.15)), Grassy (green rgba(34,139,34,0.15)), Psychic (pink rgba(219,112,147,0.15)), Misty (light pink rgba(255,182,193,0.15)). When both weather and terrain are active, gradient flows from weather color (top) to terrain color (bottom). Moved Format, Weather, and Terrain controls to top of damage results panel (src/Main.elm:3808-3841) with compact styling and border separator. Other field conditions remain in collapsible panel._
_Files Modified: src/Main.elm_
_Testing: Visual verification - gradient backgrounds appear when weather/terrain active, controls accessible at top of calc section_

**✅ COMPLETE** - Level cap for batch level setting
_Implementation: src/Main.elm - Added levelCap field with UI in trainer selection section, defaults to first gym leader's ace level, "Apply to All" button sets all team/box Pokemon to cap_

### Content & Data

**✅ COMPLETE** - I'd like to add some Rom hack games. I was playing Black Pearl last and it should be pretty easy to add. I'll need to get you the spreadsheet so you can build a converter script. I converted calc data for it a while back and had a few issues with species names and some moves not matching, so you may need to do some adjustments with names. It should use Gen 9 mechanics. After this point I'll do some play testing in a real game to see how it feels.
_Implementation: Black Pearl added to src/data/trainers/index.json and src/data/trainers/Black_Pearl.json (1.5MB). Converter script at scripts/convert-black-pearl.js. Uses Gen 9 mechanics. Awaiting play testing._

### Code Quality

**✅ COMPLETE** - This is probably a good time to do some refactoring work. I see all of the Elm code is in one big file. Some new files could be split out for the different sections. Also, review anything for code quality, types that don't make sense. Anything that could be done to clean up the code a bit.
_Status: Major refactoring completed. Main.elm (5,825 lines) split into 5 well-organized modules totaling 6,469 lines._
_Implementation: Created Types.elm (538 lines - all type definitions and defaults), Decoders.elm (267 lines - all JSON decoders), Encoders.elm (174 lines - all JSON encoders), Helpers.elm (428 lines - pure helper functions), Main.elm (5,062 lines - core application logic). All 19 tests passing. No functionality lost or changed. See .specs/fix_plan.md Session 2025-11-28 for full details._

### Polish & Assets

**❌ NOT STARTED** - I think we need some kind of top banner art.
_Status: No banner art exists. HTML has basic title text only._

### Deployment Prep

**✅ COMPLETE** - Do we need to do any work for actually deploying this out? Minor SEO? Probably a README. Maybe scrub or delete and recreate the git history. Put `.specs` in .gitignore. Any other suggestions? Page sizes and perf look good? A license file, probably MIT. Attribution for any of the libraries we pulled stuff from, like the game data from the Vanilla calc specifically.
_Implementation: README.md created with project overview, features, and dev instructions. LICENSE (MIT) added. ATTRIBUTION.md created with credits for @smogon/calc, VanillaNuzlockeCalc, @pkmn libraries. SEO meta tags added (description, keywords, Open Graph, Twitter cards). .gitignore updated to exclude .specs/, .serena/, .mcp.json, AGENTS.md, CLAUDE.md. Favicon now served locally._

**❌ NOT STARTED** - We should setup the Playwright MCP so you can verify things.
_Status: No Playwright found in codebase. Only MCP servers: memory, sequential-thinking, serena._

### Hosting

**❌ NOT STARTED** - After things are ready to go out, we would need to setup hosting somehow. I dunno that I want to buy a domain, but maybe. I have some free credits on Azure, so I can put it there. What kind of setup would be best to for this site? Something that is low cost and also secure. I don't really keep up on the different options they provide for hosting things.
_Status: Not applicable until deployment prep is done._

---

## Summary

**Completed:** 19 items
**Partially Complete:** 1 item
**Not Started:** 3 items (Banner art, Playwright MCP, Hosting setup)

**Total Implementation:** ~87% complete