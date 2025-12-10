module Helpers exposing (..)

import Types exposing (..)


-- VALIDATION HELPERS


isValidMove : String -> List MoveData -> Bool
isValidMove moveName moveList =
    if String.isEmpty moveName then
        False

    else
        List.any (\m -> m.name == moveName) moveList


isRegionalForm : String -> Bool
isRegionalForm formName =
    String.contains "-Alola" formName
        || String.contains "-Galar" formName
        || String.contains "-Hisui" formName
        || String.contains "-Paldea" formName


getNonRegionalForms : List String -> List String
getNonRegionalForms forms =
    List.filter (\f -> not (isRegionalForm f)) forms


-- FORMATTING HELPERS


formatDamagePercent : ( Float, Float ) -> String
formatDamagePercent ( minPercent, maxPercent ) =
    String.fromFloat (toFloat (round (minPercent * 10)) / 10)
        ++ "% - "
        ++ String.fromFloat (toFloat (round (maxPercent * 10)) / 10)
        ++ "%"


-- STATS HELPERS


updateStat : String -> Int -> Stats -> Stats
updateStat statName value stats =
    case statName of
        "hp" ->
            { stats | hp = value }

        "atk" ->
            { stats | atk = value }

        "def" ->
            { stats | def = value }

        "spa" ->
            { stats | spa = value }

        "spd" ->
            { stats | spd = value }

        "spe" ->
            { stats | spe = value }

        _ ->
            stats


-- GAME/GENERATION HELPERS


gameToGeneration : String -> Int
gameToGeneration game =
    case game of
        "Red/Blue" ->
            1

        "Yellow" ->
            1

        "Gold/Silver" ->
            2

        "Crystal" ->
            2

        "Ruby/Sapphire" ->
            3

        "Emerald" ->
            3

        "FireRed/LeafGreen" ->
            3

        "Diamond/Pearl" ->
            4

        "Platinum" ->
            4

        "HeartGold/SoulSilver" ->
            4

        "Black/White" ->
            5

        "Black 2/White 2" ->
            5

        "X/Y" ->
            6

        "Omega Ruby/Alpha Sapphire" ->
            6

        "Sun/Moon" ->
            7

        "Ultra Sun/Ultra Moon" ->
            7

        "Sword/Shield" ->
            8

        "Brilliant Diamond/Shining Pearl" ->
            8

        "Scarlet/Violet" ->
            9

        "Black Pearl" ->
            9

        _ ->
            9


-- STARTER POKEMON HELPERS


getPlayerStarterFromRival : Int -> String -> String
getPlayerStarterFromRival generation rivalStarter =
    case generation of
        1 ->
            case rivalStarter of
                "Charmander" ->
                    "Squirtle"

                "Squirtle" ->
                    "Bulbasaur"

                "Bulbasaur" ->
                    "Charmander"

                _ ->
                    "Bulbasaur"

        2 ->
            case rivalStarter of
                "Cyndaquil" ->
                    "Totodile"

                "Totodile" ->
                    "Chikorita"

                "Chikorita" ->
                    "Cyndaquil"

                _ ->
                    "Chikorita"

        3 ->
            case rivalStarter of
                "Torchic" ->
                    "Mudkip"

                "Mudkip" ->
                    "Treecko"

                "Treecko" ->
                    "Torchic"

                _ ->
                    "Treecko"

        4 ->
            case rivalStarter of
                "Chimchar" ->
                    "Piplup"

                "Piplup" ->
                    "Turtwig"

                "Turtwig" ->
                    "Chimchar"

                _ ->
                    "Turtwig"

        5 ->
            case rivalStarter of
                "Tepig" ->
                    "Oshawott"

                "Oshawott" ->
                    "Snivy"

                "Snivy" ->
                    "Tepig"

                _ ->
                    "Snivy"

        6 ->
            case rivalStarter of
                "Fennekin" ->
                    "Froakie"

                "Froakie" ->
                    "Chespin"

                "Chespin" ->
                    "Fennekin"

                _ ->
                    "Chespin"

        7 ->
            case rivalStarter of
                "Litten" ->
                    "Popplio"

                "Popplio" ->
                    "Rowlet"

                "Rowlet" ->
                    "Litten"

                _ ->
                    "Rowlet"

        8 ->
            case rivalStarter of
                "Scorbunny" ->
                    "Sobble"

                "Sobble" ->
                    "Grookey"

                "Grookey" ->
                    "Scorbunny"

                _ ->
                    "Grookey"

        9 ->
            case rivalStarter of
                "Fuecoco" ->
                    "Quaxly"

                "Quaxly" ->
                    "Sprigatito"

                "Sprigatito" ->
                    "Fuecoco"

                _ ->
                    "Sprigatito"

        _ ->
            "Bulbasaur"


getStarterMoves : String -> List MoveState
getStarterMoves species =
    let
        defaultMove =
            { name = "", isCrit = False, hits = 1 }
    in
    case species of
        -- Gen 1
        "Bulbasaur" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Charmander" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Squirtle" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 2
        "Chikorita" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Cyndaquil" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Totodile" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 3
        "Treecko" ->
            [ { name = "Pound", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Torchic" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Mudkip" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 4
        "Turtwig" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Chimchar" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Piplup" ->
            [ { name = "Pound", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 5
        "Snivy" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Tepig" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Oshawott" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 6
        "Chespin" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Fennekin" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Froakie" ->
            [ { name = "Pound", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 7
        "Rowlet" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Litten" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Popplio" ->
            [ { name = "Pound", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 8
        "Grookey" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Scorbunny" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Sobble" ->
            [ { name = "Pound", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        -- Gen 9
        "Sprigatito" ->
            [ { name = "Scratch", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Fuecoco" ->
            [ { name = "Tackle", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        "Quaxly" ->
            [ { name = "Pound", isCrit = False, hits = 1 }, defaultMove, defaultMove, defaultMove ]

        _ ->
            [ defaultMove, defaultMove, defaultMove, defaultMove ]


-- TRAINER HELPERS


filterEncounters : String -> List TrainerEncounter -> List TrainerEncounter
filterEncounters query encounters =
    if String.isEmpty query then
        []

    else
        let
            lowerQuery =
                String.toLower query
        in
        encounters
            |> List.filter
                (\encounter ->
                    String.contains lowerQuery (String.toLower encounter.trainerName)
                        || String.contains lowerQuery (String.toLower encounter.trainerClass)
                        || String.contains lowerQuery (String.toLower encounter.location)
                        || List.any (\p -> String.contains lowerQuery (String.toLower p.species)) encounter.team
                )


findEncounterIndex : TrainerEncounter -> List TrainerEncounter -> Maybe Int
findEncounterIndex target encounters =
    encounters
        |> List.indexedMap Tuple.pair
        |> List.filter (\( _, encounter ) -> encounter.id == target.id)
        |> List.head
        |> Maybe.map Tuple.first


trainerPokemonToState : TrainerPokemon -> PokemonState
trainerPokemonToState tp =
    { species = tp.species
    , level = tp.level
    , nature = tp.nature
    , ability = tp.ability
    , item = tp.item
    , evs = tp.evs
    , ivs = tp.ivs
    , boosts = defaultStats
    , status = ""
    , curHP = 100
    , teraType = ""
    , isDynamaxed = False
    , moves =
        tp.moves
            |> List.map (\moveName -> { name = moveName, isCrit = False, hits = 1 })
            |> (\movesList ->
                    movesList
                        ++ List.repeat (4 - List.length movesList) { name = "", isCrit = False, hits = 1 }
               )
            |> List.take 4
    }
