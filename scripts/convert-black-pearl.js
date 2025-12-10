/**
 * Convert Black Pearl trainer data from Showdown-like text format to Trevenant JSON format
 *
 * The input format is:
 *   Species TrainerName (Species) @ Item
 *   Level: X
 *   Ability: Y
 *   EVs: 0 Hp / 0 Atk / 0 Def / 0 SpA  / 0 SpD / 0 Spe
 *   IVs: 15 Hp / 15 Atk / 15 Def / 15 SpA  / 15 SpD / 15 Spe
 *   Nature Nature
 *   - Move1
 *   - Move2
 *   ...
 *   (blank line separates Pokemon)
 */

const fs = require('fs');
const path = require('path');

// Species name mappings from Black Pearl format to smogon/calc format
const speciesNameMappings = {
    // Alolan forms
    'Meowth Alolan': 'Meowth-Alola',
    'Persian Alolan': 'Persian-Alola',
    'Rattata Alolan': 'Rattata-Alola',
    'Raticate Alolan': 'Raticate-Alola',
    'Raichu Alolan': 'Raichu-Alola',
    'Sandshrew Alolan': 'Sandshrew-Alola',
    'Sandslash Alolan': 'Sandslash-Alola',
    'Vulpix Alolan': 'Vulpix-Alola',
    'Ninetales Alolan': 'Ninetales-Alola',
    'Diglett Alolan': 'Diglett-Alola',
    'Dugtrio Alolan': 'Dugtrio-Alola',
    'Geodude Alolan': 'Geodude-Alola',
    'Graveler Alolan': 'Graveler-Alola',
    'Golem Alolan': 'Golem-Alola',
    'Grimer Alolan': 'Grimer-Alola',
    'Muk Alolan': 'Muk-Alola',
    'Exeggutor Alolan': 'Exeggutor-Alola',
    'Marowak Alolan': 'Marowak-Alola',

    // Galarian forms
    'Meowth Galarian': 'Meowth-Galar',
    'Ponyta Galarian': 'Ponyta-Galar',
    'Rapidash Galarian': 'Rapidash-Galar',
    'Slowpoke Galarian': 'Slowpoke-Galar',
    'Slowbro Galarian': 'Slowbro-Galar',
    'Slowking Galarian': 'Slowking-Galar',
    'Farfetchd Galarian': "Farfetch'd-Galar",
    "Farfetch'd Galarian": "Farfetch'd-Galar",
    'Weezing Galarian': 'Weezing-Galar',
    'Mr. Mime Galarian': 'Mr. Mime-Galar',
    'Mr Mime Galarian': 'Mr. Mime-Galar',
    'Articuno Galarian': 'Articuno-Galar',
    'Zapdos Galarian': 'Zapdos-Galar',
    'Moltres Galarian': 'Moltres-Galar',
    'Corsola Galarian': 'Corsola-Galar',
    'Zigzagoon Galarian': 'Zigzagoon-Galar',
    'Linoone Galarian': 'Linoone-Galar',
    'Darumaka Galarian': 'Darumaka-Galar',
    'Darmanitan Galarian': 'Darmanitan-Galar',
    'Darmanitan Galarian Zen': 'Darmanitan-Galar-Zen',
    'Yamask Galarian': 'Yamask-Galar',
    'Stunfisk Galarian': 'Stunfisk-Galar',

    // Hisuian forms
    'Growlithe Hisuian': 'Growlithe-Hisui',
    'Arcanine Hisuian': 'Arcanine-Hisui',
    'Voltorb Hisuian': 'Voltorb-Hisui',
    'Electrode Hisuian': 'Electrode-Hisui',
    'Typhlosion Hisuian': 'Typhlosion-Hisui',
    'Qwilfish Hisuian': 'Qwilfish-Hisui',
    'Sneasel Hisuian': 'Sneasel-Hisui',
    'Samurott Hisuian': 'Samurott-Hisui',
    'Lilligant Hisuian': 'Lilligant-Hisui',
    'Zorua Hisuian': 'Zorua-Hisui',
    'Zoroark Hisuian': 'Zoroark-Hisui',
    'Braviary Hisuian': 'Braviary-Hisui',
    'Sliggoo Hisuian': 'Sliggoo-Hisui',
    'Goodra Hisuian': 'Goodra-Hisui',
    'Avalugg Hisuian': 'Avalugg-Hisui',
    'Decidueye Hisuian': 'Decidueye-Hisui',

    // Paldean forms
    'Tauros Paldean Combat Breed': 'Tauros-Paldea-Combat',
    'Tauros Paldean Blaze Breed': 'Tauros-Paldea-Blaze',
    'Tauros Paldean Aqua Breed': 'Tauros-Paldea-Aqua',
    'Tauros Paldean': 'Tauros-Paldea-Combat',
    'Wooper Paldean': 'Wooper-Paldea',

    // Punctuation fixes
    'Mr Mime': 'Mr. Mime',
    'Mr Rime': 'Mr. Rime',
    'Mime Jr': 'Mime Jr.',
    'Farfetchd': "Farfetch'd",
    'Sirfetchd': "Sirfetch'd",

    // Hyphenated names
    'Kommo O': 'Kommo-o',
    'Kommo-O': 'Kommo-o',
    'Porygon Z': 'Porygon-Z',
    'Porygon2': 'Porygon2',
    'Ho Oh': 'Ho-Oh',
    'Ho-oh': 'Ho-Oh',
    'Jangmo O': 'Jangmo-o',
    'Jangmo-O': 'Jangmo-o',
    'Hakamo O': 'Hakamo-o',
    'Hakamo-O': 'Hakamo-o',
    'Type Null': 'Type: Null',

    // Rotom forms
    'Rotom Heat': 'Rotom-Heat',
    'Rotom Wash': 'Rotom-Wash',
    'Rotom Mow': 'Rotom-Mow',
    'Rotom Fan': 'Rotom-Fan',
    'Rotom Frost': 'Rotom-Frost',

    // Oricorio forms
    'Oricorio Baile': 'Oricorio-Baile',
    'Oricorio Pompom': 'Oricorio-Pom-Pom',
    'Oricorio Pom Pom': 'Oricorio-Pom-Pom',
    'Oricorio Pau': "Oricorio-Pa'u",
    'Oricorio Sensu': 'Oricorio-Sensu',

    // Lycanroc forms
    'Lycanroc Midday': 'Lycanroc',
    'Lycanroc Midnight': 'Lycanroc-Midnight',
    'Lycanroc Dusk': 'Lycanroc-Dusk',

    // Toxtricity forms
    'Toxtricity Amped': 'Toxtricity',
    'Toxtricity Low Key': 'Toxtricity-Low-Key',

    // Urshifu forms
    'Urshifu Single Strike': 'Urshifu',
    'Urshifu Rapid Strike': 'Urshifu-Rapid-Strike',

    // Indeedee forms
    'Indeedee Male': 'Indeedee',
    'Indeedee M': 'Indeedee',
    'Indeedee Female': 'Indeedee-F',
    'Indeedee F': 'Indeedee-F',

    // Basculegion forms
    'Basculegion Male': 'Basculegion',
    'Basculegion M': 'Basculegion',
    'Basculegion Female': 'Basculegion-F',
    'Basculegion F': 'Basculegion-F',

    // Oinkologne forms
    'Oinkologne Male': 'Oinkologne',
    'Oinkologne M': 'Oinkologne',
    'Oinkologne Female': 'Oinkologne-F',
    'Oinkologne F': 'Oinkologne-F',

    // Deerling/Sawsbuck forms
    'Deerling Summer': 'Deerling',
    'Deerling Spring': 'Deerling',
    'Deerling Autumn': 'Deerling',
    'Deerling Winter': 'Deerling',
    'Sawsbuck Summer': 'Sawsbuck',
    'Sawsbuck Spring': 'Sawsbuck',
    'Sawsbuck Autumn': 'Sawsbuck',
    'Sawsbuck Winter': 'Sawsbuck',

    // Vivillon forms (all map to base Vivillon)
    'Vivillon Sun': 'Vivillon',
    'Vivillon Meadow': 'Vivillon',
    'Vivillon Polar': 'Vivillon',
    'Vivillon Fancy': 'Vivillon-Fancy',

    // Paradox Pokemon with spaces
    'Iron Bundle': 'Iron Bundle',
    'Iron Hands': 'Iron Hands',
    'Iron Jugulis': 'Iron Jugulis',
    'Iron Moth': 'Iron Moth',
    'Iron Thorns': 'Iron Thorns',
    'Iron Valiant': 'Iron Valiant',
    'Iron Leaves': 'Iron Leaves',
    'Iron Boulder': 'Iron Boulder',
    'Iron Crown': 'Iron Crown',
    'Brute Bonnet': 'Brute Bonnet',
    'Sandy Shocks': 'Sandy Shocks',
    'Scream Tail': 'Scream Tail',
    'Flutter Mane': 'Flutter Mane',
    'Slither Wing': 'Slither Wing',
    'Roaring Moon': 'Roaring Moon',
    'Walking Wake': 'Walking Wake',
    'Gouging Fire': 'Gouging Fire',
    'Raging Bolt': 'Raging Bolt',
    'Great Tusk': 'Great Tusk',

    // Aegislash forms (base form is Aegislash-Blade in @smogon/calc)
    'Aegislash': 'Aegislash-Blade',
    'Aegislash Shield': 'Aegislash-Shield',
    'Aegislash Blade': 'Aegislash-Blade',

    // Ursaluna forms
    'Ursaluna Bloodmoon': 'Ursaluna-Bloodmoon',
    'Ursaluna Blood Moon': 'Ursaluna-Bloodmoon',
};

// Move name corrections (from Black Pearl format to smogon/calc format)
const moveNameMappings = {
    'Thundershock': 'Thunder Shock',
    'Vicegrip': 'Vise Grip',
    'Vise Grip': 'Vise Grip',
    'Doubleslap': 'Double Slap',
    'Thunderpunch': 'Thunder Punch',
    'Firepunch': 'Fire Punch',
    'Icepunch': 'Ice Punch',
    'Solarbeam': 'Solar Beam',
    'Dragonbreath': 'Dragon Breath',
    'Extremespeed': 'Extreme Speed',
    'Ancientpower': 'Ancient Power',
    'Shadowball': 'Shadow Ball',
    'Mudslap': 'Mud-Slap',
    'Mud-Slap': 'Mud-Slap',
    'Mud Slap': 'Mud-Slap',
    'Highhorsepower': 'High Horsepower',
    'Power-up Punch': 'Power-Up Punch',
    'Power-Up-Punch': 'Power-Up Punch',
    'Willowisp': 'Will-O-Wisp',
    'Will-o-wisp': 'Will-O-Wisp',
    'Will-O-wisp': 'Will-O-Wisp',
    'Babydoll Eyes': 'Baby-Doll Eyes',
    'Baby Doll Eyes': 'Baby-Doll Eyes',
    'Grassknot': 'Grass Knot',
    'Knockoff': 'Knock Off',
    'Softboiled': 'Soft-Boiled',
    'Soft Boiled': 'Soft-Boiled',
    'Selfdestruct': 'Self-Destruct',
    'Self Destruct': 'Self-Destruct',
    'Doubleedge': 'Double-Edge',
    'Double Edge': 'Double-Edge',
    'Freezedry': 'Freeze-Dry',
    'Freeze Dry': 'Freeze-Dry',
    'Xscissor': 'X-Scissor',
    'X Scissor': 'X-Scissor',
    'Uturn': 'U-turn',
    'U Turn': 'U-turn',
    'U-Turn': 'U-turn',
    'Vcreate': 'V-create',
    'V Create': 'V-create',
    'V-Create': 'V-create',
    'Hi Jump Kick': 'High Jump Kick',
    'Topsy Turvy': 'Topsy-Turvy',
    'Kings Shield': "King's Shield",
    "King's Shield": "King's Shield",
    'Faint Attack': 'Feint Attack',
};

/**
 * Normalize a Pokemon species name to match smogon/calc format
 */
function normalizeSpeciesName(name) {
    if (!name) return name;

    // Check exact species name mappings first
    if (speciesNameMappings[name]) {
        return speciesNameMappings[name];
    }

    // Handle forms that are already hyphenated but might have wrong region suffix
    // e.g., "Grimer-Alola" is already correct

    // Handle "Pokemon Regional" pattern dynamically
    const regionalPatterns = [
        { pattern: /^(.+?)\s+Alolan$/, suffix: '-Alola' },
        { pattern: /^(.+?)\s+Galarian$/, suffix: '-Galar' },
        { pattern: /^(.+?)\s+Hisuian$/, suffix: '-Hisui' },
        { pattern: /^(.+?)\s+Paldean$/, suffix: '-Paldea' },
    ];

    for (const { pattern, suffix } of regionalPatterns) {
        const match = name.match(pattern);
        if (match) {
            return match[1] + suffix;
        }
    }

    // Handle specific complex forms
    if (name.includes('Paldean')) {
        if (name.includes('Combat')) return 'Tauros-Paldea-Combat';
        if (name.includes('Blaze')) return 'Tauros-Paldea-Blaze';
        if (name.includes('Aqua')) return 'Tauros-Paldea-Aqua';
    }

    return name;
}

/**
 * Normalize a move name to match smogon/calc format
 */
function normalizeMoveName(name) {
    if (!name) return name;

    // Check exact mappings first
    if (moveNameMappings[name]) {
        return moveNameMappings[name];
    }

    return name;
}

/**
 * Parse EVs/IVs string like "0 Hp / 0 Atk / 0 Def / 0 SpA  / 0 SpD / 0 Spe"
 */
function parseStats(line, prefix) {
    const defaults = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    if (!line.startsWith(prefix)) return defaults;

    const statsStr = line.substring(prefix.length).trim();
    const parts = statsStr.split('/').map(s => s.trim());

    const stats = { ...defaults };
    for (const part of parts) {
        const match = part.match(/(\d+)\s*(\w+)/);
        if (match) {
            const value = parseInt(match[1], 10);
            const statName = match[2].toLowerCase();

            if (statName === 'hp') stats.hp = value;
            else if (statName === 'atk' || statName === 'at') stats.atk = value;
            else if (statName === 'def' || statName === 'df') stats.def = value;
            else if (statName === 'spa' || statName === 'sa' || statName === 'spatk') stats.spa = value;
            else if (statName === 'spd' || statName === 'sd' || statName === 'spdef') stats.spd = value;
            else if (statName === 'spe' || statName === 'sp' || statName === 'spd' || statName === 'speed') stats.spe = value;
        }
    }

    return stats;
}

/**
 * Parse a single Pokemon block from the text format
 */
function parsePokemonBlock(lines) {
    if (lines.length === 0) return null;

    // First line format: "Species TrainerName (Species) @ Item"
    // or "Species TrainerName (Species) @" (no item)
    const firstLine = lines[0];

    // Parse first line to extract trainer name and item
    // Examples:
    // "Gible CynthiaRoute103 (Gible) @"
    // "Zubat GruntPetalburgWoods (Zubat) @ Black Glasses"
    // "Corsola Galarian Cindy1 (Corsola Galarian) @"

    let trainerName = '';
    let species = '';
    let item = '';

    // Find the part in parentheses (species name)
    const parenMatch = firstLine.match(/\(([^)]+)\)/);
    if (parenMatch) {
        species = parenMatch[1].trim();
    }

    // Find item after @
    const atIndex = firstLine.lastIndexOf('@');
    if (atIndex !== -1) {
        item = firstLine.substring(atIndex + 1).trim();
    }

    // Extract trainer name - it's between species and parentheses
    // The format is "Species TrainerName (Species) @ Item"
    // We need to find the trainer name between the first species occurrence and the parentheses
    const beforeParen = firstLine.substring(0, firstLine.indexOf('(')).trim();
    // The trainer name is what's left after removing the species from the beginning
    // But the species might be multi-word (e.g., "Corsola Galarian")
    // So we need to find where the trainer name starts

    // Strategy: The trainer name should match patterns like Calvin1, GruntPetalburgWoods, etc.
    // Let's find the last word before ( that looks like a trainer name
    const wordsBeforeParen = beforeParen.split(/\s+/);

    // Find the trainer name - it's typically the last contiguous "identifier" before the parenthesis
    // Trainer names often have numbers or are camelCase
    let trainerIdx = -1;
    for (let i = wordsBeforeParen.length - 1; i >= 0; i--) {
        const word = wordsBeforeParen[i];
        // Trainer names typically contain numbers, or are single words like "Joey", "Rick"
        // Regional form words like "Galarian", "Hisuian", "Alolan" are not trainer names
        if (!['Galarian', 'Hisuian', 'Alolan', 'Paldean', 'Breed', 'Combat', 'Blaze', 'Aqua'].includes(word)) {
            // This could be a trainer name if it doesn't match a known Pokemon
            // But since the format puts species at the start, trainer name should be after
            trainerIdx = i;
            break;
        }
    }

    if (trainerIdx > 0) {
        // Species is everything before trainer name
        const speciesWords = wordsBeforeParen.slice(0, trainerIdx);
        const speciesFromFirstLine = speciesWords.join(' ');
        // Use this species if it's more complete than what's in parens
        if (speciesFromFirstLine && speciesFromFirstLine.length >= species.length) {
            species = speciesFromFirstLine;
        }
        trainerName = wordsBeforeParen.slice(trainerIdx).join(' ');
    } else if (trainerIdx === 0 && wordsBeforeParen.length === 1) {
        // Just one word - could be trainer name or species
        // Check against the species in parentheses
        if (wordsBeforeParen[0] !== species) {
            trainerName = wordsBeforeParen[0];
        }
    }

    // Normalize species name
    species = normalizeSpeciesName(species);

    // Parse remaining lines
    let level = 1;
    let ability = '';
    let nature = 'Hardy';
    let evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
    let ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
    const moves = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.startsWith('Level:')) {
            level = parseInt(line.substring(6).trim(), 10) || 1;
        } else if (line.startsWith('Ability:')) {
            ability = line.substring(8).trim();
        } else if (line.startsWith('EVs:')) {
            evs = parseStats(line, 'EVs:');
        } else if (line.startsWith('IVs:')) {
            ivs = parseStats(line, 'IVs:');
        } else if (line.endsWith('Nature')) {
            nature = line.replace('Nature', '').trim();
        } else if (line.startsWith('- ')) {
            const moveName = normalizeMoveName(line.substring(2).trim());
            if (moveName) {
                moves.push(moveName);
            }
        }
    }

    // Pad moves to 4
    while (moves.length < 4) {
        moves.push('No Move');
    }

    return {
        trainerName,
        pokemon: {
            species,
            level,
            ability,
            item,
            nature,
            ivs,
            evs,
            moves: moves.slice(0, 4)
        }
    };
}

/**
 * Parse the entire Black Pearl text file
 */
function parseBlackPearlFile(content) {
    const lines = content.split('\n');
    const blocks = [];
    let currentBlock = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed === '') {
            if (currentBlock.length > 0) {
                blocks.push(currentBlock);
                currentBlock = [];
            }
        } else {
            currentBlock.push(trimmed);
        }
    }

    // Don't forget the last block
    if (currentBlock.length > 0) {
        blocks.push(currentBlock);
    }

    // Parse each block
    const pokemonByTrainer = new Map();

    for (const block of blocks) {
        const result = parsePokemonBlock(block);
        if (result && result.trainerName) {
            if (!pokemonByTrainer.has(result.trainerName)) {
                pokemonByTrainer.set(result.trainerName, []);
            }
            pokemonByTrainer.get(result.trainerName).push(result.pokemon);
        }
    }

    return pokemonByTrainer;
}

/**
 * Convert to Trevenant JSON format
 */
function convertToTrevenantFormat(pokemonByTrainer) {
    const gameName = 'Black Pearl';
    const generation = 9;
    const encounters = [];
    let id = 0;

    for (const [trainerName, team] of pokemonByTrainer.entries()) {
        // Sort team by level descending
        team.sort((a, b) => b.level - a.level);

        encounters.push({
            id: `blackpearl-${id++}`,
            trainerClass: '',
            trainerName: trainerName,
            location: '',
            game: gameName,
            isDouble: false,
            isTriple: false,
            isRotation: false,
            team: team
        });
    }

    return {
        game: gameName,
        generation,
        encounters
    };
}

/**
 * Validate the converted data against known species/moves
 */
function validateData(data, speciesSet, movesSet) {
    const issues = {
        unknownSpecies: new Set(),
        unknownMoves: new Set(),
        warnings: []
    };

    let totalPokemon = 0;
    let totalMoves = 0;

    for (const encounter of data.encounters) {
        for (const pokemon of encounter.team) {
            totalPokemon++;

            if (speciesSet && !speciesSet.has(pokemon.species)) {
                issues.unknownSpecies.add(pokemon.species);
            }

            for (const move of pokemon.moves) {
                if (move && move !== 'No Move') {
                    totalMoves++;
                    if (movesSet && !movesSet.has(move)) {
                        issues.unknownMoves.add(move);
                    }
                }
            }
        }
    }

    return {
        totalTrainers: data.encounters.length,
        totalPokemon,
        totalMoves,
        issues
    };
}

/**
 * Load species and moves from smogon/calc for validation
 */
function loadValidationData() {
    const speciesPath = path.join(__dirname, '..', 'damage-calc', 'calc', 'src', 'data', 'species.ts');
    const movesPath = path.join(__dirname, '..', 'damage-calc', 'calc', 'src', 'data', 'moves.ts');

    const speciesSet = new Set();
    const movesSet = new Set();

    try {
        const speciesContent = fs.readFileSync(speciesPath, 'utf-8');
        // Extract species names from the TypeScript file
        // Match both quoted and unquoted keys: "Pikachu:" or "'Mr. Mime':"
        // Pattern: start of object property (indented), followed by key (quoted or not), colon, opening brace
        const speciesMatches = speciesContent.matchAll(/^\s{2}(['"]?)([^'":,\n]+)\1\s*:\s*\{/gm);
        for (const match of speciesMatches) {
            const name = match[2].trim();
            // Filter out type annotations and other non-species entries
            if (name && !name.includes('types') && !name.includes('bs') && !name.includes('weightkg') &&
                !name.includes('nfe') && !name.includes('otherFormes') && !name.includes('baseSpecies') &&
                !name.includes('abilities') && !name.includes('gender') && name.length > 1) {
                speciesSet.add(name);
            }
        }
    } catch (e) {
        console.warn('Could not load species data for validation:', e.message);
    }

    try {
        const movesContent = fs.readFileSync(movesPath, 'utf-8');
        // Extract move names - both quoted 'Move Name': and unquoted MoveName:
        // Quoted names (multi-word): 'Aurora Beam': or "Aurora Beam":
        const quotedMoveMatches = movesContent.matchAll(/^\s{2}['"]([^'"]+)['"]\s*:\s*\{/gm);
        for (const match of quotedMoveMatches) {
            movesSet.add(match[1]);
        }
        // Unquoted single-word names: Absorb:
        const unquotedMoveMatches = movesContent.matchAll(/^\s{2}([A-Z][a-zA-Z0-9]*)\s*:\s*\{/gm);
        for (const match of unquotedMoveMatches) {
            const name = match[1];
            // Filter out type annotations
            if (name && name !== 'readonly' && name !== 'type' && name !== 'bp' &&
                name !== 'category' && name.length > 1) {
                movesSet.add(name);
            }
        }
    } catch (e) {
        console.warn('Could not load moves data for validation:', e.message);
    }

    return { speciesSet, movesSet };
}

/**
 * Main conversion function
 */
function main() {
    const inputPath = path.join(__dirname, '..', 'src', 'data', 'trainers', 'Black_Pearl.txt');
    const outputPath = path.join(__dirname, '..', 'src', 'data', 'trainers', 'Black_Pearl.json');

    console.log('=== Black Pearl Trainer Data Converter ===\n');

    // Read input file
    console.log(`Reading ${inputPath}...`);
    const content = fs.readFileSync(inputPath, 'utf-8');

    // Parse the file
    console.log('Parsing trainer data...');
    const pokemonByTrainer = parseBlackPearlFile(content);

    // Convert to Trevenant format
    console.log('Converting to Trevenant format...');
    const data = convertToTrevenantFormat(pokemonByTrainer);

    // Load validation data
    console.log('Loading validation data...');
    const { speciesSet, movesSet } = loadValidationData();

    // Validate
    console.log('Validating...');
    const validation = validateData(data, speciesSet, movesSet);

    // Write output
    console.log(`Writing ${outputPath}...`);
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

    // Print summary
    console.log('\n=== Conversion Complete ===');
    console.log(`Trainers: ${validation.totalTrainers}`);
    console.log(`Pokemon: ${validation.totalPokemon}`);
    console.log(`Moves: ${validation.totalMoves}`);

    if (validation.issues.unknownSpecies.size > 0) {
        console.log(`\n[WARNING] Unknown species (${validation.issues.unknownSpecies.size}):`);
        const sorted = Array.from(validation.issues.unknownSpecies).sort();
        sorted.forEach(s => console.log(`  - ${s}`));
    }

    if (validation.issues.unknownMoves.size > 0) {
        console.log(`\n[WARNING] Unknown moves (${validation.issues.unknownMoves.size}):`);
        const sorted = Array.from(validation.issues.unknownMoves).sort();
        sorted.forEach(m => console.log(`  - ${m}`));
    }

    console.log('\nDone!');
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { parseBlackPearlFile, convertToTrevenantFormat, normalizeSpeciesName, normalizeMoveName };
