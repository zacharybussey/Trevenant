module Decoders exposing (..)

import Dict exposing (Dict)
import Json.Decode as Decode exposing (Decoder)
import Types exposing (..)


-- SETTINGS DECODERS


settingsDecoder : Decoder Settings
settingsDecoder =
    Decode.map2 Settings
        (Decode.oneOf [ Decode.field "currentGame" Decode.string, Decode.field "game" Decode.string ])
        (Decode.oneOf [ Decode.field "gameData" (Decode.dict gameSaveDataDecoder), Decode.succeed Dict.empty ])


gameSaveDataDecoder : Decoder GameSaveData
gameSaveDataDecoder =
    Decode.map7 GameSaveData
        (Decode.oneOf [ Decode.field "team" (Decode.list pokemonDecoder), Decode.succeed [] ])
        (Decode.oneOf [ Decode.field "box" (Decode.list pokemonDecoder), Decode.succeed [] ])
        (Decode.oneOf [ Decode.field "attackerSource" pokemonSourceDecoder, Decode.succeed Nothing ])
        (Decode.oneOf [ Decode.field "attacker" (Decode.map Just pokemonDecoder), Decode.succeed Nothing ])
        (Decode.oneOf [ Decode.field "defender" (Decode.map Just pokemonDecoder), Decode.succeed Nothing ])
        (Decode.oneOf [ Decode.field "selectedTrainerIndex" Decode.int, Decode.succeed 0 ])
        (Decode.oneOf [ Decode.field "levelCap" (Decode.map Just Decode.int), Decode.succeed Nothing ])


pokemonSourceDecoder : Decoder (Maybe PokemonSource)
pokemonSourceDecoder =
    Decode.oneOf
        [ Decode.map2
            (\sourceType index ->
                case sourceType of
                    "team" ->
                        Just (FromTeam index)

                    "box" ->
                        Just (FromBox index)

                    _ ->
                        Nothing
            )
            (Decode.field "type" Decode.string)
            (Decode.field "index" Decode.int)
        , Decode.succeed Nothing
        ]


-- CALCULATION RESULT DECODERS


moveResultDecoder : Decoder MoveResult
moveResultDecoder =
    Decode.succeed MoveResult
        |> andMap (Decode.field "moveName" Decode.string)
        |> andMap (Decode.field "damage" (Decode.map2 Tuple.pair (Decode.index 0 Decode.int) (Decode.index 1 Decode.int)))
        |> andMap (Decode.field "damagePercent" (Decode.map2 Tuple.pair (Decode.index 0 Decode.float) (Decode.index 1 Decode.float)))
        |> andMap (Decode.field "critDamage" (Decode.map2 Tuple.pair (Decode.index 0 Decode.int) (Decode.index 1 Decode.int)))
        |> andMap (Decode.field "critDamagePercent" (Decode.map2 Tuple.pair (Decode.index 0 Decode.float) (Decode.index 1 Decode.float)))
        |> andMap (Decode.field "description" Decode.string)
        |> andMap (Decode.field "koChance" Decode.string)
        |> andMap (Decode.field "critKoChance" Decode.string)
        |> andMap (Decode.field "damageRolls" (Decode.list Decode.int))
        |> andMap (Decode.field "critDamageRolls" (Decode.list Decode.int))


calculationResultDecoder : Decoder CalculationResult
calculationResultDecoder =
    Decode.map4 CalculationResult
        (Decode.field "attackerResults" (Decode.list moveResultDecoder))
        (Decode.field "defenderResults" (Decode.list moveResultDecoder))
        (Decode.field "attackerSpeed" Decode.int)
        (Decode.field "defenderSpeed" Decode.int)


boxMatchupResultDecoder : Decoder BoxMatchupResult
boxMatchupResultDecoder =
    Decode.succeed BoxMatchupResult
        |> andMap (Decode.field "boxIndex" Decode.int)
        |> andMap (Decode.field "attackerSpeed" Decode.int)
        |> andMap (Decode.field "defenderSpeed" Decode.int)
        |> andMap (Decode.field "canOHKO" Decode.bool)
        |> andMap (Decode.field "mightOHKO" Decode.bool)
        |> andMap (Decode.field "getsOHKOd" Decode.bool)
        |> andMap (Decode.field "mightGetOHKOd" Decode.bool)
        |> andMap (Decode.field "isHardCounter" Decode.bool)
        |> andMap (Decode.field "isWall" Decode.bool)
        |> andMap (Decode.field "bestDamagePercent" Decode.float)
        |> andMap (Decode.field "worstDamageTaken" Decode.float)


-- POKEMON DATA DECODERS


pokemonListDecoder : Decoder (List PokemonData)
pokemonListDecoder =
    Decode.field "pokemon"
        (Decode.list pokemonDataDecoder)


pokemonDataDecoder : Decoder PokemonData
pokemonDataDecoder =
    Decode.succeed PokemonData
        |> andMap (Decode.field "name" Decode.string)
        |> andMap (Decode.field "types" (Decode.list Decode.string))
        |> andMap (Decode.field "baseStats" statsDecoder)
        |> andMap (Decode.field "abilities" (Decode.list Decode.string))
        |> andMap (Decode.field "weightkg" Decode.float)
        |> andMap (Decode.field "prevo" (Decode.nullable Decode.string))
        |> andMap (Decode.field "evos" (Decode.list Decode.string))
        |> andMap (Decode.field "nfe" Decode.bool)
        |> andMap (Decode.field "baseSpecies" (Decode.nullable Decode.string))
        |> andMap (Decode.field "forme" Decode.string)
        |> andMap (Decode.field "otherFormes" (Decode.list Decode.string))
        |> andMap (Decode.field "spriteUrl" Decode.string)
        |> andMap (Decode.field "spriteWidth" Decode.int)
        |> andMap (Decode.field "spriteHeight" Decode.int)
        |> andMap (Decode.field "isPixelated" Decode.bool)


statsDecoder : Decoder Stats
statsDecoder =
    Decode.map6 Stats
        (Decode.field "hp" Decode.int)
        (Decode.field "atk" Decode.int)
        (Decode.field "def" Decode.int)
        (Decode.field "spa" Decode.int)
        (Decode.field "spd" Decode.int)
        (Decode.field "spe" Decode.int)


-- POKEMON STATE DECODERS


moveStateDecoder : Decoder MoveState
moveStateDecoder =
    Decode.map3 MoveState
        (Decode.field "name" Decode.string)
        (Decode.field "isCrit" Decode.bool)
        (Decode.field "hits" Decode.int)


pokemonDecoder : Decoder PokemonState
pokemonDecoder =
    Decode.succeed PokemonState
        |> Decode.andThen (\f -> Decode.map f (Decode.field "species" Decode.string))
        |> Decode.andThen (\f -> Decode.map f (Decode.field "level" Decode.int))
        |> Decode.andThen (\f -> Decode.map f (Decode.field "nature" Decode.string))
        |> Decode.andThen (\f -> Decode.map f (Decode.field "ability" Decode.string))
        |> Decode.andThen (\f -> Decode.map f (Decode.field "item" Decode.string))
        |> Decode.andThen (\f -> Decode.map f (Decode.oneOf [ Decode.field "evs" statsDecoder, Decode.succeed defaultStats ]))
        |> Decode.andThen (\f -> Decode.map f (Decode.oneOf [ Decode.field "ivs" statsDecoder, Decode.succeed defaultIVs ]))
        |> Decode.andThen (\f -> Decode.map f (Decode.oneOf [ Decode.field "boosts" statsDecoder, Decode.succeed defaultStats ]))
        |> Decode.andThen (\f -> Decode.map f (Decode.field "status" Decode.string))
        |> Decode.andThen (\f -> Decode.map f (Decode.field "curHP" Decode.int))
        |> Decode.andThen (\f -> Decode.map f (Decode.oneOf [ Decode.field "teraType" Decode.string, Decode.succeed "" ]))
        |> Decode.andThen (\f -> Decode.map f (Decode.oneOf [ Decode.field "isDynamaxed" Decode.bool, Decode.succeed False ]))
        |> Decode.andThen (\f -> Decode.map f (Decode.field "moves" (Decode.list moveStateDecoder)))


-- MOVE DATA DECODERS


moveListDecoder : Decoder (List MoveData)
moveListDecoder =
    Decode.field "moves"
        (Decode.list
            (Decode.map6 MoveData
                (Decode.field "name" Decode.string)
                (Decode.field "type" Decode.string)
                (Decode.field "category" Decode.string)
                (Decode.field "basePower" Decode.int)
                (Decode.field "accuracy" Decode.int)
                (Decode.field "isMultihit" Decode.bool)
            )
        )


-- ITEM AND ABILITY DECODERS


itemListDecoder : Decoder (List String)
itemListDecoder =
    Decode.field "items" (Decode.list Decode.string)


abilityListDecoder : Decoder (List String)
abilityListDecoder =
    Decode.field "abilities" (Decode.list Decode.string)


-- NATURE DECODERS


natureListDecoder : Decoder (List NatureData)
natureListDecoder =
    Decode.field "natures"
        (Decode.list
            (Decode.map3 NatureData
                (Decode.field "name" Decode.string)
                (Decode.oneOf [ Decode.field "plus" Decode.string, Decode.succeed "" ])
                (Decode.oneOf [ Decode.field "minus" Decode.string, Decode.succeed "" ])
            )
        )


-- LEARNSET DECODERS


learnsetDecoder : Decoder LearnsetData
learnsetDecoder =
    Decode.map7 LearnsetData
        (Decode.field "species" Decode.string)
        (Decode.field "levelup" (Decode.list (Decode.map2 Tuple.pair (Decode.index 0 Decode.string) (Decode.index 1 Decode.int))))
        (Decode.field "tm" (Decode.list Decode.string))
        (Decode.field "tutor" (Decode.list Decode.string))
        (Decode.field "egg" (Decode.list Decode.string))
        (Decode.field "other" (Decode.list Decode.string))
        (Decode.field "isAttacker" Decode.bool)


-- TRAINER DATA DECODERS


availableGamesDecoder : Decoder (List String)
availableGamesDecoder =
    Decode.field "games" (Decode.list Decode.string)


trainerPokemonDecoder : Decoder TrainerPokemon
trainerPokemonDecoder =
    Decode.map8 TrainerPokemon
        (Decode.field "species" Decode.string)
        (Decode.field "level" Decode.int)
        (Decode.oneOf [ Decode.field "ability" Decode.string, Decode.succeed "" ])
        (Decode.oneOf [ Decode.field "item" Decode.string, Decode.succeed "" ])
        (Decode.oneOf [ Decode.field "nature" Decode.string, Decode.succeed "Hardy" ])
        (Decode.oneOf [ Decode.field "ivs" statsDecoder, Decode.succeed defaultIVs ])
        (Decode.oneOf [ Decode.field "evs" statsDecoder, Decode.succeed defaultStats ])
        (Decode.field "moves" (Decode.list Decode.string))


trainerEncounterDecoder : Decoder TrainerEncounter
trainerEncounterDecoder =
    Decode.map7 TrainerEncounter
        (Decode.field "id" Decode.string)
        (Decode.oneOf [ Decode.field "trainerClass" Decode.string, Decode.succeed "" ])
        (Decode.field "trainerName" Decode.string)
        (Decode.oneOf [ Decode.field "location" Decode.string, Decode.succeed "" ])
        (Decode.field "game" Decode.string)
        (Decode.oneOf [ Decode.field "isDouble" Decode.bool, Decode.succeed False ])
        (Decode.field "team" (Decode.list trainerPokemonDecoder))


trainerDataDecoder : Decoder (List TrainerEncounter)
trainerDataDecoder =
    Decode.field "encounters" (Decode.list trainerEncounterDecoder)


-- HELPER


andMap : Decoder a -> Decoder (a -> b) -> Decoder b
andMap =
    Decode.map2 (|>)
