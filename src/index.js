import { Elm } from './Main.elm';
import { calculate, Pokemon, Move, Field, Generations } from '@smogon/calc';
import { Dex } from '@pkmn/dex';
import { Sprites } from '@pkmn/img';
import trainerIndex from './data/trainers/index.json';

// Initialize Elm application
const app = Elm.Main.init({
    node: document.getElementById('app'),
    flags: {
        // Initial flags can be passed here
        generations: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
});

// Port: Calculate damage
// Receives calculation request from Elm, returns results for all moves in both directions
app.ports.requestCalculation.subscribe(function(data) {
    console.log('Calculation request received:', data);
    try {
        const { generation, attacker, defender, moves, field } = data;

        // Create Pokemon objects
        const attackerPokemon = new Pokemon(generation, attacker.species, {
            level: attacker.level,
            nature: attacker.nature,
            ability: attacker.ability,
            item: attacker.item,
            evs: attacker.evs,
            ivs: attacker.ivs,
            boosts: attacker.boosts,
            status: attacker.status,
            curHP: attacker.curHP,
            teraType: attacker.teraType,
            isDynamaxed: attacker.isDynamaxed
        });

        const defenderPokemon = new Pokemon(generation, defender.species, {
            level: defender.level,
            nature: defender.nature,
            ability: defender.ability,
            item: defender.item,
            evs: defender.evs,
            ivs: defender.ivs,
            boosts: defender.boosts,
            status: defender.status,
            curHP: defender.curHP,
            teraType: defender.teraType,
            isDynamaxed: defender.isDynamaxed
        });

        // Create Field object if provided
        let fieldObj = undefined;
        if (field) {
            fieldObj = new Field({
                gameType: field.gameType,
                weather: field.weather,
                terrain: field.terrain,
                isGravity: field.isGravity,
                attackerSide: field.attackerSide,
                defenderSide: field.defenderSide
            });
        }

        // Helper function to calculate moves and return results with percentages
        function calculateMoves(attackingPokemon, defendingPokemon, moveList, targetMaxHP) {
            return moveList.map(moveData => {
                if (!moveData.name || moveData.name === "") {
                    return {
                        moveName: "(No Move)",
                        damage: [0, 0],
                        damagePercent: [0, 0],
                        critDamage: [0, 0],
                        critDamagePercent: [0, 0],
                        description: "",
                        koChance: "",
                        critKoChance: "",
                        damageRolls: [],
                        critDamageRolls: []
                    };
                }

                try {
                    // Calculate normal damage (non-crit)
                    const normalMoveObj = new Move(generation, moveData.name, {
                        isCrit: false,
                        hits: moveData.hits
                    });
                    const normalResult = calculate(generation, attackingPokemon, defendingPokemon, normalMoveObj, fieldObj);
                    const normalDamageRange = normalResult.range();
                    const normalMinPercent = targetMaxHP > 0 ? (normalDamageRange[0] / targetMaxHP) * 100 : 0;
                    const normalMaxPercent = targetMaxHP > 0 ? (normalDamageRange[1] / targetMaxHP) * 100 : 0;

                    // Get normal damage rolls
                    let normalDamageRolls = [];
                    if (normalResult.damage) {
                        if (Array.isArray(normalResult.damage)) {
                            normalDamageRolls = normalResult.damage.flat();
                        } else {
                            normalDamageRolls = [normalResult.damage];
                        }
                    }

                    // Get normal KO chance
                    let normalKoChanceText = "";
                    try {
                        const kochance = normalResult.kochance();
                        if (kochance && kochance.text) {
                            normalKoChanceText = kochance.text;
                        }
                    } catch (e) {
                        // KO chance not available
                    }

                    // Calculate crit damage
                    const critMoveObj = new Move(generation, moveData.name, {
                        isCrit: true,
                        hits: moveData.hits
                    });
                    const critResult = calculate(generation, attackingPokemon, defendingPokemon, critMoveObj, fieldObj);
                    const critDamageRange = critResult.range();
                    const critMinPercent = targetMaxHP > 0 ? (critDamageRange[0] / targetMaxHP) * 100 : 0;
                    const critMaxPercent = targetMaxHP > 0 ? (critDamageRange[1] / targetMaxHP) * 100 : 0;

                    // Get crit damage rolls
                    let critDamageRolls = [];
                    if (critResult.damage) {
                        if (Array.isArray(critResult.damage)) {
                            critDamageRolls = critResult.damage.flat();
                        } else {
                            critDamageRolls = [critResult.damage];
                        }
                    }

                    // Get crit KO chance
                    let critKoChanceText = "";
                    try {
                        const kochance = critResult.kochance();
                        if (kochance && kochance.text) {
                            critKoChanceText = kochance.text;
                        }
                    } catch (e) {
                        // KO chance not available
                    }

                    return {
                        moveName: moveData.name,
                        damage: normalDamageRange,
                        damagePercent: [normalMinPercent, normalMaxPercent],
                        critDamage: critDamageRange,
                        critDamagePercent: [critMinPercent, critMaxPercent],
                        description: normalResult.fullDesc(),
                        koChance: normalKoChanceText,
                        critKoChance: critKoChanceText,
                        damageRolls: normalDamageRolls,
                        critDamageRolls: critDamageRolls
                    };
                } catch (moveError) {
                    console.error('Error calculating move:', moveData.name, moveError);
                    return {
                        moveName: moveData.name,
                        damage: [0, 0],
                        damagePercent: [0, 0],
                        critDamage: [0, 0],
                        critDamagePercent: [0, 0],
                        description: "Error: " + moveError.message,
                        koChance: "",
                        critKoChance: "",
                        damageRolls: [],
                        critDamageRolls: []
                    };
                }
            });
        }

        // Get max HP for both Pokemon
        const defenderMaxHP = defenderPokemon.maxHP();
        const attackerMaxHP = attackerPokemon.maxHP();

        // Calculate effective speed with boosts and field conditions
        function getEffectiveSpeed(pokemon, pokemonData, side) {
            let speed = pokemon.stats.spe;

            // Apply stat boost multipliers
            const boost = pokemonData.boosts.spe || 0;
            if (boost > 0) {
                speed = Math.floor(speed * (2 + boost) / 2);
            } else if (boost < 0) {
                speed = Math.floor(speed * 2 / (2 - boost));
            }

            // Apply Tailwind (doubles speed)
            if (side && side.isTailwind) {
                speed = speed * 2;
            }

            // Apply paralysis (quarters speed in Gen 7+, halves in earlier gens)
            if (pokemonData.status === 'par') {
                if (generation >= 7) {
                    speed = Math.floor(speed / 2);
                } else {
                    speed = Math.floor(speed / 4);
                }
            }

            return speed;
        }

        const attackerSpeed = getEffectiveSpeed(attackerPokemon, attacker, field ? field.attackerSide : null);
        const defenderSpeed = getEffectiveSpeed(defenderPokemon, defender, field ? field.defenderSide : null);

        // Calculate attacker's moves vs defender
        const attackerResults = calculateMoves(attackerPokemon, defenderPokemon, moves, defenderMaxHP);

        // Calculate defender's moves vs attacker
        const defenderResults = calculateMoves(defenderPokemon, attackerPokemon, defender.moves, attackerMaxHP);

        // Send results back to Elm
        const response = {
            success: true,
            attackerResults: attackerResults,
            defenderResults: defenderResults,
            attackerSpeed: attackerSpeed,
            defenderSpeed: defenderSpeed
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
                isPixelated: spriteInfo.pixelated || false
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

        app.ports.receiveItemList.send({
            success: true,
            generation: generation,
            items: items
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

// Port: Get learnset for a Pokemon species
app.ports.requestLearnset.subscribe(async function(data) {
    try {
        const { species, generation, isAttacker } = data;
        const dex = Dex.forGen(generation);

        // Get species data to check for base form (for Megas, regional forms, etc.)
        const speciesData = dex.species.get(species.toLowerCase());

        // Use base species for learnset lookup (Charizard-Mega-X -> Charizard)
        const learnsetSpecies = speciesData && speciesData.baseSpecies
            ? speciesData.baseSpecies.toLowerCase()
            : species.toLowerCase();

        // Get learnset for the base species (async operation!)
        const speciesLearnset = await dex.learnsets.get(learnsetSpecies);

        // Also get pre-evolution's learnset to inherit egg moves
        let prevoLearnset = null;
        if (speciesData && speciesData.prevo) {
            prevoLearnset = await dex.learnsets.get(speciesData.prevo.toLowerCase());
        }

        // Organize moves by source type
        const organized = {
            species: species,
            levelup: [],
            tm: [],
            tutor: [],
            egg: [],
            other: [],
            isAttacker: isAttacker
        };

        if (speciesLearnset && speciesLearnset.learnset) {

            // Each move has sources like ["8L1", "8E", "8T", "7L1"]
            for (const [moveId, sources] of Object.entries(speciesLearnset.learnset)) {
                // Convert move ID to proper name
                const move = dex.moves.get(moveId);
                if (!move) continue;

                const moveName = move.name;
                let addedToCategory = false;

                // First, scan all sources for this generation to find what's available
                let levelSource = null;
                let hasTM = false;
                let hasTutor = false;
                let hasEgg = false;

                for (const source of sources) {
                    if (!source.startsWith(String(generation))) continue;

                    const sourceType = source.charAt(1);
                    if (sourceType === 'L' && !levelSource) {
                        levelSource = source; // Keep the first level source
                    } else if (sourceType === 'M') {
                        hasTM = true;
                    } else if (sourceType === 'T') {
                        hasTutor = true;
                    } else if (sourceType === 'E') {
                        hasEgg = true;
                    }
                }

                // Now add to the highest priority category (Level > TM > Tutor > Egg)
                if (levelSource && !organized.levelup.some(([name, _]) => name === moveName)) {
                    const levelStr = levelSource.substring(2); // Remove "9L" prefix
                    const level = parseInt(levelStr) || 0;
                    organized.levelup.push([moveName, level]);
                    addedToCategory = true;
                } else if (hasTM && !organized.tm.includes(moveName)) {
                    organized.tm.push(moveName);
                    addedToCategory = true;
                } else if (hasTutor && !organized.tutor.includes(moveName)) {
                    organized.tutor.push(moveName);
                    addedToCategory = true;
                } else if (hasEgg && !organized.egg.includes(moveName)) {
                    organized.egg.push(moveName);
                    addedToCategory = true;
                }

                // If move available in this gen but not categorized, add to "other"
                if (!addedToCategory && sources.some(s => s.startsWith(String(generation)))) {
                    if (!organized.other.includes(moveName)) {
                        organized.other.push(moveName);
                    }
                }
            }
        }

        // Check if we need to fall back to earlier generation BEFORE adding pre-evo egg moves
        // (Don't count egg moves in this check since we haven't filtered them by generation yet)
        const totalFound = organized.levelup.length + organized.tm.length + organized.tutor.length + organized.other.length;
        let activeGeneration = generation; // Track which generation we're actually using
        if (totalFound === 0 && speciesLearnset && speciesLearnset.learnset) {

            // Try generations in reverse order (most recent first)
            for (let fallbackGen = generation - 1; fallbackGen >= 1; fallbackGen--) {
                for (const [moveId, sources] of Object.entries(speciesLearnset.learnset)) {
                    const move = dex.moves.get(moveId);
                    if (!move) continue;

                    const moveName = move.name;
                    let addedToCategory = false;

                    // Scan all sources for this fallback generation
                    let levelSource = null;
                    let hasTM = false;
                    let hasTutor = false;
                    let hasEgg = false;

                    for (const source of sources) {
                        if (!source.startsWith(String(fallbackGen))) continue;

                        const sourceType = source.charAt(1);
                        if (sourceType === 'L' && !levelSource) {
                            levelSource = source;
                        } else if (sourceType === 'M') {
                            hasTM = true;
                        } else if (sourceType === 'T') {
                            hasTutor = true;
                        } else if (sourceType === 'E') {
                            hasEgg = true;
                        }
                    }

                    // Add to highest priority category
                    if (levelSource && !organized.levelup.some(([name, _]) => name === moveName)) {
                        const levelStr = levelSource.substring(2);
                        const level = parseInt(levelStr) || 0;
                        organized.levelup.push([moveName, level]);
                        addedToCategory = true;
                    } else if (hasTM && !organized.tm.includes(moveName)) {
                        organized.tm.push(moveName);
                        addedToCategory = true;
                    } else if (hasTutor && !organized.tutor.includes(moveName)) {
                        organized.tutor.push(moveName);
                        addedToCategory = true;
                    } else if (hasEgg && !organized.egg.includes(moveName)) {
                        organized.egg.push(moveName);
                        addedToCategory = true;
                    }

                    if (!addedToCategory && sources.some(s => s.startsWith(String(fallbackGen)))) {
                        if (!organized.other.includes(moveName)) {
                            organized.other.push(moveName);
                        }
                    }
                }

                // If we found moves, use this generation
                const foundInFallback = organized.levelup.length + organized.tm.length + organized.tutor.length + organized.other.length;
                if (foundInFallback > 0) {
                    activeGeneration = fallbackGen; // Remember which gen we're using
                    break;
                }
            }
        }

        // Now add egg moves from pre-evolution using the active generation
        if (prevoLearnset && prevoLearnset.learnset) {
            for (const [moveId, sources] of Object.entries(prevoLearnset.learnset)) {
                const move = dex.moves.get(moveId);
                if (!move) continue;

                const moveName = move.name;

                // Only add egg moves from the active generation
                for (const source of sources) {
                    if (!source.startsWith(String(activeGeneration))) continue;
                    const sourceType = source.charAt(1);
                    if (sourceType === 'E' && !organized.egg.includes(moveName)) {
                        organized.egg.push(moveName);
                        break; // Only add once per move
                    }
                }
            }
        }

        app.ports.receiveLearnset.send(organized);
    } catch (error) {
        console.error('Error loading learnset for', data.species, ':', error);
        // Send empty learnset on error
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

// Port: Calculate box matchup for a single Pokemon vs the current defender
app.ports.requestBoxMatchup.subscribe(function(data) {
    try {
        const { generation, boxIndex, attacker, defender, field } = data;

        // Create Pokemon objects
        const attackerPokemon = new Pokemon(generation, attacker.species, {
            level: attacker.level,
            nature: attacker.nature,
            ability: attacker.ability,
            item: attacker.item,
            evs: attacker.evs,
            ivs: attacker.ivs,
            boosts: attacker.boosts,
            status: attacker.status,
            curHP: attacker.curHP,
            teraType: attacker.teraType,
            isDynamaxed: attacker.isDynamaxed
        });

        const defenderPokemon = new Pokemon(generation, defender.species, {
            level: defender.level,
            nature: defender.nature,
            ability: defender.ability,
            item: defender.item,
            evs: defender.evs,
            ivs: defender.ivs,
            boosts: defender.boosts,
            status: defender.status,
            curHP: defender.curHP,
            teraType: defender.teraType,
            isDynamaxed: defender.isDynamaxed
        });

        // Create Field object
        let fieldObj = undefined;
        if (field) {
            fieldObj = new Field({
                gameType: field.gameType,
                weather: field.weather,
                terrain: field.terrain,
                isGravity: field.isGravity,
                attackerSide: field.attackerSide,
                defenderSide: field.defenderSide
            });
        }

        // Get max HP for both Pokemon
        const defenderMaxHP = defenderPokemon.maxHP();
        const attackerMaxHP = attackerPokemon.maxHP();

        // Calculate effective speed
        function getEffectiveSpeed(pokemon, pokemonData, side) {
            let speed = pokemon.stats.spe;

            // Apply stat boost multipliers
            const boost = pokemonData.boosts.spe || 0;
            if (boost > 0) {
                speed = Math.floor(speed * (2 + boost) / 2);
            } else if (boost < 0) {
                speed = Math.floor(speed * 2 / (2 - boost));
            }

            // Apply Tailwind
            if (side && side.isTailwind) {
                speed = speed * 2;
            }

            // Apply paralysis
            if (pokemonData.status === 'par') {
                if (generation >= 7) {
                    speed = Math.floor(speed / 2);
                } else {
                    speed = Math.floor(speed / 4);
                }
            }

            return speed;
        }

        const attackerSpeed = getEffectiveSpeed(attackerPokemon, attacker, field ? field.attackerSide : null);
        const defenderSpeed = getEffectiveSpeed(defenderPokemon, defender, field ? field.defenderSide : null);

        // Calculate attacker's damage to defender (best move)
        let bestDamagePercent = 0;
        let canOHKO = false;
        let mightOHKO = false;

        for (const moveData of attacker.moves) {
            if (!moveData.name || moveData.name === "") continue;

            try {
                const moveObj = new Move(generation, moveData.name, {
                    isCrit: false,
                    hits: moveData.hits
                });
                const result = calculate(generation, attackerPokemon, defenderPokemon, moveObj, fieldObj);
                const damageRange = result.range();
                const maxPercent = defenderMaxHP > 0 ? (damageRange[1] / defenderMaxHP) * 100 : 0;
                const minPercent = defenderMaxHP > 0 ? (damageRange[0] / defenderMaxHP) * 100 : 0;

                // Track best damage
                if (maxPercent > bestDamagePercent) {
                    bestDamagePercent = maxPercent;
                }

                // Check OHKO potential
                if (minPercent >= 100) {
                    canOHKO = true;
                }
                if (maxPercent >= 100) {
                    mightOHKO = true;
                }
            } catch (e) {
                // Skip invalid moves
            }
        }

        // Calculate defender's damage to attacker (worst damage taken)
        let worstDamageTaken = 0;
        let getsOHKOd = false;
        let mightGetOHKOd = false;

        for (const moveData of defender.moves) {
            if (!moveData.name || moveData.name === "") continue;

            try {
                const moveObj = new Move(generation, moveData.name, {
                    isCrit: false,
                    hits: moveData.hits
                });
                const result = calculate(generation, defenderPokemon, attackerPokemon, moveObj, fieldObj);
                const damageRange = result.range();
                const maxPercent = attackerMaxHP > 0 ? (damageRange[1] / attackerMaxHP) * 100 : 0;
                const minPercent = attackerMaxHP > 0 ? (damageRange[0] / attackerMaxHP) * 100 : 0;

                // Track worst damage taken
                if (maxPercent > worstDamageTaken) {
                    worstDamageTaken = maxPercent;
                }

                // Check if we get OHKO'd
                if (minPercent >= 100) {
                    getsOHKOd = true;
                }
                if (maxPercent >= 100) {
                    mightGetOHKOd = true;
                }
            } catch (e) {
                // Skip invalid moves
            }
        }

        // Determine matchup classifications
        // Hard Counter: Gets 4HKO'd at worst (takes <= 25% damage) and might OHKO
        const isHardCounter = worstDamageTaken <= 25 && mightOHKO;

        // Wall: Gets 4HKO'd at worst and does more damage than it takes
        const isWall = worstDamageTaken <= 25 && bestDamagePercent > worstDamageTaken;

        const response = {
            boxIndex: boxIndex,
            attackerSpeed: attackerSpeed,
            defenderSpeed: defenderSpeed,
            canOHKO: canOHKO,
            mightOHKO: mightOHKO,
            getsOHKOd: getsOHKOd,
            mightGetOHKOd: mightGetOHKOd,
            isHardCounter: isHardCounter,
            isWall: isWall,
            bestDamagePercent: bestDamagePercent,
            worstDamageTaken: worstDamageTaken
        };

        app.ports.receiveBoxMatchup.send(response);
    } catch (error) {
        console.error('Box matchup calculation error:', error);
    }
});

// Port: Calculate team matchup (same logic as box, different receive port)
app.ports.requestTeamMatchup.subscribe(function(data) {
    try {
        const { generation, boxIndex, attacker, defender, field } = data;

        // Create Pokemon objects
        const attackerPokemon = new Pokemon(generation, attacker.species, {
            level: attacker.level,
            nature: attacker.nature,
            ability: attacker.ability,
            item: attacker.item,
            evs: attacker.evs,
            ivs: attacker.ivs,
            boosts: attacker.boosts,
            status: attacker.status,
            curHP: attacker.curHP,
            teraType: attacker.teraType,
            isDynamaxed: attacker.isDynamaxed
        });

        const defenderPokemon = new Pokemon(generation, defender.species, {
            level: defender.level,
            nature: defender.nature,
            ability: defender.ability,
            item: defender.item,
            evs: defender.evs,
            ivs: defender.ivs,
            boosts: defender.boosts,
            status: defender.status,
            curHP: defender.curHP,
            teraType: defender.teraType,
            isDynamaxed: defender.isDynamaxed
        });

        // Create Field object
        let fieldObj = undefined;
        if (field) {
            fieldObj = new Field({
                gameType: field.gameType,
                weather: field.weather,
                terrain: field.terrain,
                isGravity: field.isGravity,
                attackerSide: field.attackerSide,
                defenderSide: field.defenderSide
            });
        }

        // Get max HP for both Pokemon
        const defenderMaxHP = defenderPokemon.maxHP();
        const attackerMaxHP = attackerPokemon.maxHP();

        // Calculate effective speed
        function getEffectiveSpeed(pokemon, pokemonData, side) {
            let speed = pokemon.stats.spe;

            // Apply stat boost multipliers
            const boost = pokemonData.boosts.spe || 0;
            if (boost > 0) {
                speed = Math.floor(speed * (2 + boost) / 2);
            } else if (boost < 0) {
                speed = Math.floor(speed * 2 / (2 - boost));
            }

            // Apply Tailwind
            if (side && side.isTailwind) {
                speed = speed * 2;
            }

            // Apply paralysis
            if (pokemonData.status === 'par') {
                if (generation >= 7) {
                    speed = Math.floor(speed / 2);
                } else {
                    speed = Math.floor(speed / 4);
                }
            }

            return speed;
        }

        const attackerSpeed = getEffectiveSpeed(attackerPokemon, attacker, field ? field.attackerSide : null);
        const defenderSpeed = getEffectiveSpeed(defenderPokemon, defender, field ? field.defenderSide : null);

        // Calculate attacker's damage to defender (best move)
        let bestDamagePercent = 0;
        let canOHKO = false;
        let mightOHKO = false;

        for (const moveData of attacker.moves) {
            if (!moveData.name || moveData.name === "") continue;

            try {
                const moveObj = new Move(generation, moveData.name, {
                    isCrit: false,
                    hits: moveData.hits
                });
                const result = calculate(generation, attackerPokemon, defenderPokemon, moveObj, fieldObj);
                const damageRange = result.range();
                const maxPercent = defenderMaxHP > 0 ? (damageRange[1] / defenderMaxHP) * 100 : 0;
                const minPercent = defenderMaxHP > 0 ? (damageRange[0] / defenderMaxHP) * 100 : 0;

                // Track best damage
                if (maxPercent > bestDamagePercent) {
                    bestDamagePercent = maxPercent;
                }

                // Check OHKO potential
                if (minPercent >= 100) {
                    canOHKO = true;
                }
                if (maxPercent >= 100) {
                    mightOHKO = true;
                }
            } catch (e) {
                // Skip invalid moves
            }
        }

        // Calculate defender's damage to attacker (worst damage taken)
        let worstDamageTaken = 0;
        let getsOHKOd = false;
        let mightGetOHKOd = false;

        for (const moveData of defender.moves) {
            if (!moveData.name || moveData.name === "") continue;

            try {
                const moveObj = new Move(generation, moveData.name, {
                    isCrit: false,
                    hits: moveData.hits
                });
                const result = calculate(generation, defenderPokemon, attackerPokemon, moveObj, fieldObj);
                const damageRange = result.range();
                const maxPercent = attackerMaxHP > 0 ? (damageRange[1] / attackerMaxHP) * 100 : 0;
                const minPercent = attackerMaxHP > 0 ? (damageRange[0] / attackerMaxHP) * 100 : 0;

                // Track worst damage taken
                if (maxPercent > worstDamageTaken) {
                    worstDamageTaken = maxPercent;
                }

                // Check if we get OHKO'd
                if (minPercent >= 100) {
                    getsOHKOd = true;
                }
                if (maxPercent >= 100) {
                    mightGetOHKOd = true;
                }
            } catch (e) {
                // Skip invalid moves
            }
        }

        // Determine matchup classifications
        const isHardCounter = worstDamageTaken <= 25 && mightOHKO;
        const isWall = worstDamageTaken <= 25 && bestDamagePercent > worstDamageTaken;

        const response = {
            boxIndex: boxIndex,
            attackerSpeed: attackerSpeed,
            defenderSpeed: defenderSpeed,
            canOHKO: canOHKO,
            mightOHKO: mightOHKO,
            getsOHKOd: getsOHKOd,
            mightGetOHKOd: mightGetOHKOd,
            isHardCounter: isHardCounter,
            isWall: isWall,
            bestDamagePercent: bestDamagePercent,
            worstDamageTaken: worstDamageTaken
        };

        app.ports.receiveTeamMatchup.send(response);
    } catch (error) {
        console.error('Team matchup calculation error:', error);
    }
});

console.log('Trevenant initialized with @smogon/calc');
