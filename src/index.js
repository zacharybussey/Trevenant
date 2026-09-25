import { Elm } from './Main.elm';
import { calculate, Pokemon, Move, Field, Generations, toID } from '@smogon/calc';
import { Dex } from '@pkmn/dex';
import { Sprites, Icons } from '@pkmn/img';
import trainerIndex from './data/trainers/index.json';

// Initialize Elm application
const app = Elm.Main.init({
    node: document.getElementById('app'),
    flags: {
        // Initial flags can be passed here
        generations: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
});

// Showdown-style exports write an empty held item as "@ None". @smogon/calc treats
// any non-empty item as real and, in Gen 7+, dereferences its data for every move
// (Knock Off check), so an item of "None" made every move against that Pokemon
// throw and show 0 damage. Map the "no item" spellings to no item at the boundary.
function normalizeItem(item) {
    const id = toID(item || '');
    return id === '' || id === 'none' || id === 'noitem' ? undefined : item;
}

// The HP slider in the UI is a percentage (0-100), but @smogon/calc expects absolute HP.
// Passing the percentage straight through meant the calc clamped it to max HP (so most
// slider positions looked like full HP) and 0 was treated as "unset" (also full HP), so
// KO chances and HP-based moves (Flail, Reversal, Eruption, Water Spout...) never changed.
// Convert using the same floor(maxHP * pct / 100) as the UI's "≈ X / Y HP" readout, with
// a minimum of 1 HP since a fainted Pokemon has nothing to calculate.
function applyCurrentHP(pokemon, percent) {
    const maxHP = pokemon.rawStats.hp;
    const pct = Math.min(100, Math.max(0, Number.isFinite(percent) ? percent : 100));
    pokemon.originalCurHP = Math.max(1, Math.floor(maxHP * pct / 100));
    return pokemon;
}

// ---- Shared calc setup ------------------------------------------------------
// The damage calc, the box matchups and the team matchups all build the same
// @smogon/calc objects from the same Elm-encoded records (see Encoders.elm).

function buildPokemon(generation, data) {
    const pokemon = new Pokemon(generation, data.species, {
        level: data.level,
        nature: data.nature,
        ability: data.ability,
        item: normalizeItem(data.item),
        evs: data.evs,
        ivs: data.ivs,
        boosts: data.boosts,
        status: data.status,
        teraType: data.teraType,
        isDynamaxed: data.isDynamaxed
    });
    applyCurrentHP(pokemon, data.curHP);
    return pokemon;
}

function buildField(field) {
    if (!field) return undefined;
    return new Field({
        gameType: field.gameType,
        weather: field.weather,
        terrain: field.terrain,
        isGravity: field.isGravity,
        attackerSide: field.attackerSide,
        defenderSide: field.defenderSide
    });
}

// Speed after stat stages, Tailwind and paralysis (halved in Gen 7+, quartered before).
function effectiveSpeed(generation, pokemon, data, side) {
    let speed = pokemon.stats.spe;
    const boost = data.boosts.spe || 0;
    if (boost > 0) {
        speed = Math.floor(speed * (2 + boost) / 2);
    } else if (boost < 0) {
        speed = Math.floor(speed * 2 / (2 - boost));
    }
    if (side && side.isTailwind) {
        speed = speed * 2;
    }
    if (data.status === 'par') {
        speed = Math.floor(speed / (generation >= 7 ? 2 : 4));
    }
    return speed;
}

// One move's damage: [min, max], as % of the defender's max HP, and every roll.
function damageOf(generation, attacker, defender, move, field) {
    const result = calculate(generation, attacker, defender, move, field);
    const range = result.range();
    const maxHP = defender.maxHP();
    const percent = hp => (maxHP > 0 ? (hp / maxHP) * 100 : 0);
    return {
        result,
        range,
        percent: [percent(range[0]), percent(range[1])],
        rolls: !result.damage ? [] : Array.isArray(result.damage) ? result.damage.flat() : [result.damage]
    };
}

function koChanceText(result) {
    try {
        const ko = result.kochance(false); // err=false: no throw on 0-damage (immune) moves
        return ko && ko.text ? ko.text : '';
    } catch (e) {
        return ''; // KO chance isn't available for every calculation
    }
}

const EMPTY_MOVE_RESULT = {
    moveName: '(No Move)',
    damage: [0, 0],
    damagePercent: [0, 0],
    critDamage: [0, 0],
    critDamagePercent: [0, 0],
    description: '',
    koChance: '',
    critKoChance: '',
    damageRolls: [],
    critDamageRolls: []
};

// Normal and crit damage for one move slot, in the shape Decoders.moveResultDecoder expects.
function moveResult(generation, attacker, defender, moveData, field) {
    if (!moveData.name) {
        return EMPTY_MOVE_RESULT;
    }
    try {
        const withCrit = isCrit => damageOf(generation, attacker, defender, new Move(generation, moveData.name, { isCrit, hits: moveData.hits }), field);
        const normal = withCrit(false);
        const crit = withCrit(true);
        return {
            moveName: moveData.name,
            damage: normal.range,
            damagePercent: normal.percent,
            critDamage: crit.range,
            critDamagePercent: crit.percent,
            description: normal.result.fullDesc("%", false), // err=false, see koChanceText
            koChance: koChanceText(normal.result),
            critKoChance: koChanceText(crit.result),
            damageRolls: normal.rolls,
            critDamageRolls: crit.rolls
        };
    } catch (moveError) {
        console.error('Error calculating move:', moveData.name, moveError);
        return { ...EMPTY_MOVE_RESULT, moveName: moveData.name, description: 'Error: ' + moveError.message };
    }
}

// Port: Calculate damage
// Receives calculation request from Elm, returns results for all moves in both directions
app.ports.requestCalculation.subscribe(function(data) {
    console.log('Calculation request received:', data);
    try {
        const { generation, attacker, defender, moves, field } = data;
        const attackerPokemon = buildPokemon(generation, attacker);
        const defenderPokemon = buildPokemon(generation, defender);
        const fieldObj = buildField(field);

        const response = {
            success: true,
            attackerResults: moves.map(move => moveResult(generation, attackerPokemon, defenderPokemon, move, fieldObj)),
            defenderResults: defender.moves.map(move => moveResult(generation, defenderPokemon, attackerPokemon, move, fieldObj)),
            attackerSpeed: effectiveSpeed(generation, attackerPokemon, attacker, field ? field.attackerSide : null),
            defenderSpeed: effectiveSpeed(generation, defenderPokemon, defender, field ? field.defenderSide : null)
        };
        console.log('Sending calculation response:', response);
        app.ports.receiveCalculation.send(response);
    } catch (error) {
        console.error('Calculation error:', error);
        app.ports.receiveCalculation.send({
            success: false,
            attackerResults: [],
            defenderResults: [],
            attackerSpeed: 0,
            defenderSpeed: 0,
            error: error.message
        });
    }
});

// Port: Get Pokemon data for a generation
app.ports.requestPokemonList.subscribe(function(generation) {
    try {
        const gen = Generations.get(generation);

        // Use @pkmn/dex for evolution data (not available in @smogon/calc)
        const dex = Dex.forGen(generation);

        const species = Array.from(gen.species).map(s => {
            // Get extended data from @pkmn/dex for evolution info
            const dexSpecies = dex.species.get(s.name);

            // Get sprite URL from @pkmn/img
            const spriteInfo = Sprites.getPokemon(s.name.toLowerCase().replace(/[^a-z0-9]/g, ''), {
                gen: `gen${generation}`
            });
            const iconInfo = Icons.getPokemon(s.name);

            return {
                name: s.name,
                types: s.types,
                baseStats: s.baseStats,
                // Abilities don't exist in Gen 1-2, so safely handle undefined
                // Use @pkmn/dex for full abilities list (0, 1, H, S) - @smogon/calc only has default ability
                abilities: dexSpecies?.abilities ? [dexSpecies.abilities['0'], dexSpecies.abilities['1'], dexSpecies.abilities['H'], dexSpecies.abilities['S']].filter(a => a) : [],
                weightkg: s.weightkg,
                // Evolution data from @pkmn/dex
                prevo: dexSpecies?.prevo || null,
                evos: dexSpecies?.evos || [],
                nfe: dexSpecies?.nfe || false,
                // Form data
                baseSpecies: s.baseSpecies || null,
                forme: s.forme || "",
                otherFormes: s.otherFormes || [],
                // Sprite data from @pkmn/img
                spriteUrl: spriteInfo.url,
                spriteWidth: spriteInfo.w,
                spriteHeight: spriteInfo.h,
                isPixelated: spriteInfo.pixelated || false,
                // 40x30 box icon: offset into Showdown's pokemonicons-sheet.png (negative px)
                iconX: iconInfo.left,
                iconY: iconInfo.top
            };
        });

        app.ports.receivePokemonList.send({
            success: true,
            generation: generation,
            pokemon: species
        });
    } catch (error) {
        console.error('Error loading Pokemon list for gen', generation, ':', error);
        app.ports.receivePokemonList.send({
            success: false,
            generation: generation,
            pokemon: [],
            error: error.message
        });
    }
});

// Port: Get moves for a generation
app.ports.requestMoveList.subscribe(function(generation) {
    try {
        const gen = Generations.get(generation);
        const moves = Array.from(gen.moves).map(m => {
            // Get full move data from @pkmn/dex (which has accuracy), not @smogon/calc
            const dexMove = Dex.moves.get(m.name);
            const accuracy = dexMove?.accuracy;

            return {
                name: m.name,
                type: m.type || 'Normal',
                category: m.category || 'Status',
                basePower: typeof m.basePower === 'number' ? m.basePower : 0,
                // accuracy: number (0-100) = normal accuracy, true = can't miss (use 0)
                accuracy: typeof accuracy === 'number' ? accuracy : (accuracy === true ? 0 : 100),
                isMultihit: m.multihit !== undefined && m.multihit !== null
            };
        });

        app.ports.receiveMoveList.send({
            success: true,
            generation: generation,
            moves: moves
        });
    } catch (error) {
        app.ports.receiveMoveList.send({
            success: false,
            generation: generation,
            moves: [],
            error: error.message
        });
    }
});

// Port: Get items for a generation
app.ports.requestItemList.subscribe(function(generation) {
    try {
        const gen = Generations.get(generation);
        const items = Array.from(gen.items).map(i => i.name);

        // Mega Stones from @pkmn/dex (item.megaStone maps base species -> Mega form), limited to
        // Mega forms the calc knows in this generation. Elm switches a trainer's Pokemon to its
        // Mega form when it holds the matching stone (Helpers.applyMegaStone).
        const megaStones = Dex.forGen(generation).items.all()
            .flatMap(i => i.megaStone ? Object.entries(i.megaStone).map(([from, to]) => ({ item: i.name, from, to })) : [])
            .filter(s => gen.species.get(toID(s.to)));

        app.ports.receiveItemList.send({
            success: true,
            generation: generation,
            items: items,
            megaStones: megaStones
        });
    } catch (error) {
        app.ports.receiveItemList.send({
            success: false,
            generation: generation,
            items: [],
            error: error.message
        });
    }
});

// Port: Get abilities for a generation
app.ports.requestAbilityList.subscribe(function(generation) {
    try {
        const gen = Generations.get(generation);
        const abilities = Array.from(gen.abilities).map(a => a.name);

        app.ports.receiveAbilityList.send({
            success: true,
            generation: generation,
            abilities: abilities
        });
    } catch (error) {
        app.ports.receiveAbilityList.send({
            success: false,
            generation: generation,
            abilities: [],
            error: error.message
        });
    }
});

// Port: Get natures
app.ports.requestNatureList.subscribe(function(_) {
    try {
        const gen = Generations.get(9); // Natures are consistent across gens
        const natures = Array.from(gen.natures).map(n => ({
            name: n.name,
            plus: n.plus,
            minus: n.minus
        }));

        app.ports.receiveNatureList.send({
            success: true,
            natures: natures
        });
    } catch (error) {
        app.ports.receiveNatureList.send({
            success: false,
            natures: [],
            error: error.message
        });
    }
});

// ---- Learnsets ----------------------------------------------------------------

// Add every move `learnset` teaches in generation `gen` to `organized`, filed under
// its highest-priority source: Level > TM > Tutor > Egg, else "other". A move already
// filed under a category is not filed there again. Sources look like "9L45" (Gen 9,
// level 45), "8M" (TM), "8T" (tutor), "8E" (egg).
function addLearnsetMoves(dex, learnset, gen, organized) {
    const prefix = String(gen);
    for (const [moveId, sources] of Object.entries(learnset)) {
        const move = dex.moves.get(moveId);
        if (!move) continue;
        const moveName = move.name;

        let levelSource = null;
        let hasTM = false;
        let hasTutor = false;
        let hasEgg = false;
        for (const source of sources) {
            if (!source.startsWith(prefix)) continue;
            const sourceType = source.charAt(1);
            if (sourceType === 'L' && !levelSource) {
                levelSource = source; // keep the first (lowest) level
            } else if (sourceType === 'M') {
                hasTM = true;
            } else if (sourceType === 'T') {
                hasTutor = true;
            } else if (sourceType === 'E') {
                hasEgg = true;
            }
        }

        if (levelSource && !organized.levelup.some(([name]) => name === moveName)) {
            organized.levelup.push([moveName, parseInt(levelSource.substring(2)) || 0]);
        } else if (hasTM && !organized.tm.includes(moveName)) {
            organized.tm.push(moveName);
        } else if (hasTutor && !organized.tutor.includes(moveName)) {
            organized.tutor.push(moveName);
        } else if (hasEgg && !organized.egg.includes(moveName)) {
            organized.egg.push(moveName);
        } else if (sources.some(s => s.startsWith(prefix)) && !organized.other.includes(moveName)) {
            organized.other.push(moveName);
        }
    }
}

// Port: Get learnset for a Pokemon species
app.ports.requestLearnset.subscribe(async function(data) {
    try {
        const { species, generation, isAttacker } = data;
        const dex = Dex.forGen(generation);
        const speciesData = dex.species.get(species.toLowerCase());

        // Megas and other forms share their base species' learnset (Charizard-Mega-X -> Charizard)
        const learnsetSpecies = speciesData && speciesData.baseSpecies
            ? speciesData.baseSpecies.toLowerCase()
            : species.toLowerCase();

        // @pkmn/dex learnsets are loaded lazily: these must be awaited
        const speciesLearnset = await dex.learnsets.get(learnsetSpecies);
        const prevoLearnset = speciesData && speciesData.prevo
            ? await dex.learnsets.get(speciesData.prevo.toLowerCase())
            : null;

        const organized = { species, levelup: [], tm: [], tutor: [], egg: [], other: [], isAttacker };
        const learnset = speciesLearnset && speciesLearnset.learnset;
        // Egg moves don't count here: they're added per generation below
        const movesFound = () => organized.levelup.length + organized.tm.length + organized.tutor.length + organized.other.length;

        let activeGeneration = generation;
        if (learnset) {
            addLearnsetMoves(dex, learnset, generation, organized);
            // A species with no data for this generation falls back to the newest earlier one that has some
            for (let gen = generation - 1; gen >= 1 && movesFound() === 0; gen--) {
                addLearnsetMoves(dex, learnset, gen, organized);
                if (movesFound() > 0) {
                    activeGeneration = gen;
                }
            }
        }

        // Egg moves are inherited from the pre-evolution (Ferroseed's show for Ferrothorn),
        // taken from the generation actually used above
        if (prevoLearnset && prevoLearnset.learnset) {
            const eggPrefix = String(activeGeneration) + 'E';
            for (const [moveId, sources] of Object.entries(prevoLearnset.learnset)) {
                const move = dex.moves.get(moveId);
                if (move && sources.some(s => s.startsWith(eggPrefix)) && !organized.egg.includes(move.name)) {
                    organized.egg.push(move.name);
                }
            }
        }

        app.ports.receiveLearnset.send(organized);
    } catch (error) {
        console.error('Error loading learnset for', data.species, ':', error);
        app.ports.receiveLearnset.send({
            species: data.species,
            levelup: [],
            tm: [],
            tutor: [],
            egg: [],
            other: [],
            isAttacker: data.isAttacker
        });
    }
});

// Port: Decode failures from Elm (a port payload that didn't match its decoder)
app.ports.logError.subscribe(function(message) {
    console.error(message);
});

// Port: Save settings to localStorage
app.ports.saveToLocalStorage.subscribe(function(data) {
    try {
        localStorage.setItem('trevenant-settings', JSON.stringify(data));
    } catch (error) {
        console.error('Failed to save settings to localStorage:', error);
    }
});

// Load settings from localStorage on startup
try {
    const stored = localStorage.getItem('trevenant-settings');
    if (stored) {
        const settings = JSON.parse(stored);
        // Send to Elm after a small delay to ensure ports are ready
        setTimeout(function() {
            app.ports.loadFromLocalStorage.send(settings);
        }, 0);
    }
} catch (error) {
    console.error('Failed to load settings from localStorage:', error);
}

// Cache for loaded trainer data
const trainerDataCache = new Map();

// Dynamic import map for trainer data files
const trainerDataImports = {
    'Red/Blue': () => import('./data/trainers/Red_Blue.json'),
    'Yellow': () => import('./data/trainers/Yellow.json'),
    'Gold/Silver': () => import('./data/trainers/Gold_Silver.json'),
    'Crystal': () => import('./data/trainers/Crystal.json'),
    'Ruby/Sapphire': () => import('./data/trainers/Ruby_Sapphire.json'),
    'Emerald': () => import('./data/trainers/Emerald.json'),
    'FireRed/LeafGreen': () => import('./data/trainers/FireRed_LeafGreen.json'),
    'Diamond/Pearl': () => import('./data/trainers/Diamond_Pearl.json'),
    'Platinum': () => import('./data/trainers/Platinum.json'),
    'HeartGold/SoulSilver': () => import('./data/trainers/HeartGold_SoulSilver.json'),
    'Black/White': () => import('./data/trainers/Black_White.json'),
    'Black2/White2': () => import('./data/trainers/Black2_White2.json'),
    'X/Y': () => import('./data/trainers/X_Y.json'),
    'OmegaRuby/AlphaSapphire': () => import('./data/trainers/OmegaRuby_AlphaSapphire.json'),
    'Sun/Moon': () => import('./data/trainers/Sun_Moon.json'),
    'UltraSun/UltraMoon': () => import('./data/trainers/UltraSun_UltraMoon.json'),
    'Sword/Shield': () => import('./data/trainers/Sword_Shield.json'),
    'BrilliantDiamond/ShiningPearl': () => import('./data/trainers/BrilliantDiamond_ShiningPearl.json'),
    'Scarlet/Violet': () => import('./data/trainers/Scarlet_Violet.json'),
    'Black Pearl': () => import('./data/trainers/Black_Pearl.json')
};

// Port: Get available games for trainer data
app.ports.requestAvailableGames.subscribe(function(_) {
    console.log('Requested available games');
    try {
        console.log('Available games:', trainerIndex.games);
        app.ports.receiveAvailableGames.send({
            success: true,
            games: trainerIndex.games
        });
    } catch (error) {
        console.error('Error getting available games:', error);
        app.ports.receiveAvailableGames.send({
            success: false,
            games: [],
            error: error.message
        });
    }
});

console.log('Trainer data ports registered. Available games:', trainerIndex.games);

// Port: Get trainer data for a specific game
app.ports.requestTrainerData.subscribe(function(game) {
    console.log('Requested trainer data for:', game);

    // Check cache first
    if (trainerDataCache.has(game)) {
        console.log('Using cached data for:', game);
        app.ports.receiveTrainerData.send({
            success: true,
            game: game,
            encounters: trainerDataCache.get(game)
        });
        return;
    }

    // Load data dynamically
    const importFn = trainerDataImports[game];
    if (!importFn) {
        console.error('Unknown game:', game);
        app.ports.receiveTrainerData.send({
            success: false,
            game: game,
            encounters: [],
            error: `Unknown game: ${game}`
        });
        return;
    }

    // Use promise chain instead of async/await for better Elm port compatibility
    importFn()
        .then(function(module) {
            const data = module.default || module;
            const encounters = data.encounters || [];

            console.log('Loaded', encounters.length, 'encounters for', game);
            if (encounters.length > 0) {
                console.log('First encounter:', encounters[0].trainerName, 'with', encounters[0].team?.[0]?.species);
            }

            // Cache for future use
            trainerDataCache.set(game, encounters);

            app.ports.receiveTrainerData.send({
                success: true,
                game: game,
                encounters: encounters
            });
        })
        .catch(function(error) {
            console.error('Error loading trainer data:', error);
            app.ports.receiveTrainerData.send({
                success: false,
                game: game,
                encounters: [],
                error: error.message
            });
        });
});

// ---- Color Code matchups ----------------------------------------------------

// Best case across a side's moves (non-crit): highest max-roll %, and whether the
// worst roll (guaranteed) or the best roll (possible) reaches a OHKO.
function bestDamage(generation, attacker, defender, moves, field) {
    let best = 0;
    let guaranteedOHKO = false;
    let possibleOHKO = false;
    for (const moveData of moves) {
        if (!moveData.name) continue;
        try {
            const { percent } = damageOf(generation, attacker, defender, new Move(generation, moveData.name, { isCrit: false, hits: moveData.hits }), field);
            best = Math.max(best, percent[1]);
            if (percent[0] >= 100) guaranteedOHKO = true;
            if (percent[1] >= 100) possibleOHKO = true;
        } catch (e) {
            // Skip moves the calc can't handle
        }
    }
    return { best, guaranteedOHKO, possibleOHKO };
}

// One team/box Pokemon against the current defender, in the shape
// Decoders.boxMatchupResultDecoder expects. boxIndex is echoed back so Elm can
// file the result under the right team/box slot.
function calculateMatchup(data) {
    const { generation, boxIndex, attacker, defender, field } = data;
    const attackerPokemon = buildPokemon(generation, attacker);
    const defenderPokemon = buildPokemon(generation, defender);
    const fieldObj = buildField(field);

    const dealt = bestDamage(generation, attackerPokemon, defenderPokemon, attacker.moves, fieldObj);
    const taken = bestDamage(generation, defenderPokemon, attackerPokemon, defender.moves, fieldObj);

    return {
        boxIndex: boxIndex,
        // Matchup board requests say which opponent-team member this is against; Color Code requests don't
        defenderIndex: data.defenderIndex === undefined ? null : data.defenderIndex,
        attackerSpeed: effectiveSpeed(generation, attackerPokemon, attacker, field ? field.attackerSide : null),
        defenderSpeed: effectiveSpeed(generation, defenderPokemon, defender, field ? field.defenderSide : null),
        canOHKO: dealt.guaranteedOHKO,
        mightOHKO: dealt.possibleOHKO,
        getsOHKOd: taken.guaranteedOHKO,
        mightGetOHKOd: taken.possibleOHKO,
        // Hard counter: takes at most 25% (4HKO'd at worst) and might OHKO back
        isHardCounter: taken.best <= 25 && dealt.possibleOHKO,
        // Wall: takes at most 25% and deals more than it takes
        isWall: taken.best <= 25 && dealt.best > taken.best,
        bestDamagePercent: dealt.best,
        worstDamageTaken: taken.best
    };
}

// Port: Calculate box matchup for a single Pokemon vs the current defender
app.ports.requestBoxMatchup.subscribe(function(data) {
    try {
        app.ports.receiveBoxMatchup.send(calculateMatchup(data));
    } catch (error) {
        console.error('Box matchup calculation error:', error);
    }
});

// Port: Calculate team matchup (same calculation, different receive port)
app.ports.requestTeamMatchup.subscribe(function(data) {
    try {
        app.ports.receiveTeamMatchup.send(calculateMatchup(data));
    } catch (error) {
        console.error('Team matchup calculation error:', error);
    }
});

// Team/box drag-and-drop: Firefox only starts an HTML5 drag when the dragstart handler
// puts data on the dataTransfer, which Elm's event handlers can't do. Elm tracks the
// dragged Pokemon itself; this just makes the drag start and shows a "move" cursor.
document.addEventListener('dragstart', function(event) {
    if (event.target instanceof Element && event.target.closest('[data-roster-drag]')) {
        event.dataTransfer.setData('text/plain', '');
        event.dataTransfer.effectAllowed = 'move';
    }
});

console.log('Trevenant initialized with @smogon/calc');
