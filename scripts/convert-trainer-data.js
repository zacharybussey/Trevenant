/**
 * Convert VanillaNuzlockeCalc trainer data to Trevenant universal format
 *
 * This script reads the JS files from VanillaNuzlockeCalc and converts them
 * to our JSON format that can be loaded by the Elm app.
 */

const fs = require('fs');
const path = require('path');

// Game file mappings
const gameFiles = {
    'Gen1': {
        'RedBlue.js': 'Red/Blue',
        'Yellow.js': 'Yellow'
    },
    'Gen2': {
        'GS.js': 'Gold/Silver',
        'Crystal.js': 'Crystal'
    },
    'Gen3': {
        'RS.js': 'Ruby/Sapphire',
        'Emerald.js': 'Emerald',
        'FRLG.js': 'FireRed/LeafGreen'
    },
    'Gen4': {
        'DP.js': 'Diamond/Pearl',
        'Plat.js': 'Platinum',
        'HGSS.js': 'HeartGold/SoulSilver'
    },
    'Gen5': {
        'BW.js': 'Black/White',
        'B2W2.js': 'Black2/White2'
    },
    'Gen6': {
        'XY.js': 'X/Y',
        'ORAS.js': 'OmegaRuby/AlphaSapphire'
    },
    'Gen7': {
        'SM.js': 'Sun/Moon',
        'USUM.js': 'UltraSun/UltraMoon'
    },
    'Gen8': {
        'SS.js': 'Sword/Shield',
        'BDSP.js': 'BrilliantDiamond/ShiningPearl'
    },
    'Gen9': {
        'SV.js': 'Scarlet/Violet'
    }
};

// Generation number mapping
const gameToGen = {
    'Red/Blue': 1,
    'Yellow': 1,
    'Gold/Silver': 2,
    'Crystal': 2,
    'Ruby/Sapphire': 3,
    'Emerald': 3,
    'FireRed/LeafGreen': 3,
    'Diamond/Pearl': 4,
    'Platinum': 4,
    'HeartGold/SoulSilver': 4,
    'Black/White': 5,
    'Black2/White2': 5,
    'X/Y': 6,
    'OmegaRuby/AlphaSapphire': 6,
    'Sun/Moon': 7,
    'UltraSun/UltraMoon': 7,
    'Sword/Shield': 8,
    'BrilliantDiamond/ShiningPearl': 8,
    'Scarlet/Violet': 9
};

/**
 * Parse a trainer label to extract components
 * Format variations:
 * - "Rival 3 | Bulbasaur | Cerulean City | Red/Blue" (4 parts with starter variant)
 * - "Gym Leader Brock | Pewter City | Red/Blue" (3 parts)
 * - "Gym Leader Kabu | SWSH" (2 parts)
 */
function parseTrainerLabel(label, defaultGame) {
    const parts = label.split('|').map(s => s.trim());

    let trainerClass = '';
    let trainerName = '';
    let location = '';
    let game = defaultGame;
    let variant = ''; // Starter variant like "Bulbasaur"
    let isDouble = false;
    let isTriple = false;
    let isRotation = false;

    // Check for battle type indicators
    if (label.toLowerCase().includes('double')) {
        isDouble = true;
    }
    if (label.toLowerCase().includes('triple')) {
        isTriple = true;
    }
    if (label.toLowerCase().includes('rotation')) {
        isRotation = true;
    }

    // Common trainer class patterns to extract
    const classPatterns = [
        'Gym Leader', 'Elite Four', 'Champion', 'Rival', 'Team Rocket',
        'Team Aqua', 'Team Magma', 'Team Galactic', 'Team Plasma', 'Team Flare',
        'Team Skull', 'Team Yell', 'Team Star', 'Pokémon Trainer', 'Trainer',
        'Leader', 'Admin', 'Boss', 'Grunt', 'Scientist', 'Youngster', 'Lass',
        'Bug Catcher', 'Hiker', 'Fisherman', 'Swimmer', 'Beauty', 'Camper',
        'Picnicker', 'Pokémon Breeder', 'Ace Trainer', 'Veteran', 'Psychic',
        'Hex Maniac', 'Black Belt', 'Battle Girl', 'Pokéfan', 'Tuber',
        'Café Master', 'Sordward', 'Shielbert'
    ];

    // Starter Pokemon names (for detecting variants)
    const starters = [
        'Bulbasaur', 'Charmander', 'Squirtle', 'Pikachu',
        'Chikorita', 'Cyndaquil', 'Totodile',
        'Treecko', 'Torchic', 'Mudkip',
        'Turtwig', 'Chimchar', 'Piplup',
        'Snivy', 'Tepig', 'Oshawott',
        'Chespin', 'Fennekin', 'Froakie',
        'Rowlet', 'Litten', 'Popplio',
        'Grookey', 'Scorbunny', 'Sobble',
        'Sprigatito', 'Fuecoco', 'Quaxly',
        'Eevee'
    ];

    if (parts.length === 1) {
        trainerName = parts[0];
    } else if (parts.length === 2) {
        trainerName = parts[0];
        // Second part could be game abbrev or location
        if (parts[1].length <= 10 && !parts[1].includes(' ')) {
            game = parts[1];
        } else {
            location = parts[1];
        }
    } else if (parts.length === 3) {
        trainerName = parts[0];
        location = parts[1];
        game = parts[2];
    } else if (parts.length >= 4) {
        // Check if second part is a starter variant
        if (starters.includes(parts[1])) {
            trainerName = parts[0];
            variant = parts[1];
            location = parts[2];
            game = parts[3];
        } else {
            // Assume it's "Class Name | Encounter# | Location | Game"
            trainerName = parts[0];
            location = parts[2];
            game = parts[3];
        }
    }

    // Extract trainer class from name
    let fullName = trainerName;
    for (const pattern of classPatterns) {
        if (fullName.startsWith(pattern + ' ')) {
            trainerClass = pattern;
            trainerName = fullName.substring(pattern.length + 1).trim();
            break;
        } else if (fullName === pattern) {
            trainerClass = pattern;
            trainerName = pattern;
            break;
        }
    }

    // Extract encounter number from trainer name (e.g., "3" from "Rival 3")
    const numMatch = trainerName.match(/^(\d+)$/);
    if (numMatch) {
        // If it's just a number, format as "#N" (the class will be shown separately)
        trainerName = '#' + numMatch[1];
    }

    // If variant exists, append it to make unique
    if (variant) {
        trainerName = trainerName + ' (' + variant + ')';
    }

    return {
        trainerClass,
        trainerName: trainerName || 'Unknown',
        location,
        game,
        isDouble,
        isTriple,
        isRotation
    };
}

/**
 * Convert DVs (Gen 1-2) to IVs
 * DV range: 0-15, IV range: 0-31
 * Approximation: IV ≈ DV * 2
 */
function dvsToIvs(dvs) {
    if (!dvs) return { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

    return {
        hp: Math.min(31, (dvs.hp || 0) * 2),
        atk: Math.min(31, (dvs.at || dvs.atk || 0) * 2),
        def: Math.min(31, (dvs.df || dvs.def || 0) * 2),
        spa: Math.min(31, (dvs.sl || dvs.sa || dvs.spa || 0) * 2),
        spd: Math.min(31, (dvs.sd || dvs.spd || 0) * 2),
        spe: Math.min(31, (dvs.sp || dvs.spe || 0) * 2)
    };
}

/**
 * Normalize IVs to our format
 */
function normalizeIvs(ivs) {
    if (!ivs) return { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };

    return {
        hp: ivs.hp || 0,
        atk: ivs.at || ivs.atk || 0,
        def: ivs.df || ivs.def || 0,
        spa: ivs.sa || ivs.spa || 0,
        spd: ivs.sd || ivs.spd || 0,
        spe: ivs.sp || ivs.spe || 0
    };
}

/**
 * Normalize EVs to our format
 */
function normalizeEvs(evs) {
    if (!evs) return { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

    return {
        hp: evs.hp || 0,
        atk: evs.at || evs.atk || 0,
        def: evs.df || evs.def || 0,
        spa: evs.sa || evs.spa || 0,
        spd: evs.sd || evs.spd || 0,
        spe: evs.sp || evs.spe || 0
    };
}

/**
 * Convert a single game file
 */
function convertGameFile(filePath, gameName, generation) {
    console.log(`Converting ${gameName} from ${filePath}...`);

    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract the variable name and data
    const varMatch = content.match(/var\s+(\w+)\s*=\s*\{/);
    if (!varMatch) {
        console.error(`  Could not find data variable in ${filePath}`);
        return [];
    }

    // Use eval to parse the JS object (careful - only use on trusted files)
    let data;
    try {
        // Create a sandboxed eval with unique temp file to avoid require cache
        const evalContent = content + `\nmodule.exports = ${varMatch[1]};`;
        const tempFile = path.join(__dirname, `_temp_eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.js`);
        fs.writeFileSync(tempFile, evalContent);

        // Clear require cache if it exists
        delete require.cache[require.resolve(tempFile)];

        data = require(tempFile);
        fs.unlinkSync(tempFile);
    } catch (error) {
        console.error(`  Error parsing ${filePath}:`, error.message);
        return [];
    }

    // Convert the data structure
    // Original format: { "PokemonSpecies": { "TrainerLabel": { pokemon data } } }
    // Target format: array of TrainerEncounter objects

    const encounters = new Map(); // Map of trainer label to encounter data
    let encounterId = 0;

    for (const [species, trainers] of Object.entries(data)) {
        for (const [trainerLabel, pokemonData] of Object.entries(trainers)) {
            // Strip (1), (2), etc. suffixes that indicate multiple Pokemon on same team
            // These suffixes are used when a trainer has multiple of the same species
            // Example: "Lass 1 | R3 | Red/Blue (1)" and "Lass 1 | R3 | Red/Blue (2)"
            // should both map to the same encounter
            const encounterKey = trainerLabel.replace(/\s*\(\d+\)\s*$/, '').trim();

            // Get or create encounter
            if (!encounters.has(encounterKey)) {
                const parsed = parseTrainerLabel(encounterKey, gameName);
                encounters.set(encounterKey, {
                    id: `${gameName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${encounterId++}`,
                    trainerClass: parsed.trainerClass,
                    trainerName: parsed.trainerName,
                    location: parsed.location,
                    game: gameName,
                    isDouble: parsed.isDouble,
                    isTriple: parsed.isTriple,
                    isRotation: parsed.isRotation,
                    team: [],
                    _sortIndex: pokemonData.index || '999999999999' // Store original index for sorting
                });
            }

            const encounter = encounters.get(encounterKey);

            // Convert Pokemon data
            const pokemon = {
                species: species,
                level: pokemonData.level || 1,
                ability: pokemonData.ability || '',
                item: pokemonData.item || '',
                nature: pokemonData.nature || 'Hardy',
                ivs: generation <= 2 ? dvsToIvs(pokemonData.dvs) : normalizeIvs(pokemonData.ivs),
                evs: normalizeEvs(pokemonData.evs),
                moves: pokemonData.moves || ['No Move', 'No Move', 'No Move', 'No Move']
            };

            // Clean up ability/item "None" values
            if (pokemon.ability === 'None' || pokemon.ability === 'none') {
                pokemon.ability = '';
            }
            if (pokemon.item === 'None' || pokemon.item === 'none') {
                pokemon.item = '';
            }

            encounter.team.push(pokemon);
        }
    }

    // Convert map to array
    let result = Array.from(encounters.values());

    // Filter out TEST trainers
    result = result.filter(encounter => {
        const name = encounter.trainerName.toLowerCase();
        return !name.includes('test') && !name.startsWith('test');
    });

    // Sort each team by level descending
    result.forEach(encounter => {
        encounter.team.sort((a, b) => b.level - a.level);
    });

    // Sort encounters by their original index (to maintain game progression order)
    // The index encodes the order trainers appear in the game
    result.sort((a, b) => {
        const aIdx = a._sortIndex || '999999999999';
        const bIdx = b._sortIndex || '999999999999';
        return aIdx.localeCompare(bIdx);
    });

    // Re-assign sequential IDs after sorting and remove internal _sortIndex
    result.forEach((encounter, idx) => {
        encounter.id = `${gameName.toLowerCase().replace(/[^a-z0-9]/g, '')}-${idx}`;
        delete encounter._sortIndex;
    });

    console.log(`  Converted ${result.length} encounters with ${result.reduce((sum, e) => sum + e.team.length, 0)} Pokemon`);

    return result;
}

/**
 * Main conversion function
 */
function main() {
    const vanillaCalcPath = path.join(__dirname, '..', 'VanillaNuzlockeCalc', 'js', 'data', 'sets', 'games');
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'trainers');

    // Create output directory
    if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
    }

    const allGames = {};

    // Process each generation
    for (const [genFolder, files] of Object.entries(gameFiles)) {
        const genPath = path.join(vanillaCalcPath, genFolder);

        if (!fs.existsSync(genPath)) {
            console.log(`Skipping ${genFolder} - directory not found`);
            continue;
        }

        for (const [fileName, gameName] of Object.entries(files)) {
            const filePath = path.join(genPath, fileName);

            if (!fs.existsSync(filePath)) {
                console.log(`Skipping ${gameName} - file not found: ${filePath}`);
                continue;
            }

            const generation = gameToGen[gameName];
            const encounters = convertGameFile(filePath, gameName, generation);

            if (encounters.length > 0) {
                allGames[gameName] = encounters;

                // Write individual game file
                const gameFileName = gameName.replace(/[^a-zA-Z0-9]/g, '_') + '.json';
                fs.writeFileSync(
                    path.join(outputPath, gameFileName),
                    JSON.stringify({ game: gameName, generation, encounters }, null, 2)
                );
            }
        }
    }

    // Write combined index file
    const index = {
        games: Object.keys(allGames),
        totalEncounters: Object.values(allGames).reduce((sum, arr) => sum + arr.length, 0),
        totalPokemon: Object.values(allGames).reduce((sum, arr) =>
            sum + arr.reduce((s, e) => s + e.team.length, 0), 0)
    };

    fs.writeFileSync(
        path.join(outputPath, 'index.json'),
        JSON.stringify(index, null, 2)
    );

    console.log('\n=== Conversion Complete ===');
    console.log(`Games converted: ${index.games.length}`);
    console.log(`Total encounters: ${index.totalEncounters}`);
    console.log(`Total Pokemon: ${index.totalPokemon}`);
    console.log(`Output directory: ${outputPath}`);
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { convertGameFile, parseTrainerLabel };
