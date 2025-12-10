module Encoders exposing (..)

import Dict
import Json.Encode as Encode
import Types exposing (..)


-- SETTINGS ENCODERS


encodeSettings : Model -> Encode.Value
encodeSettings model =
    let
        -- Create current game's save data
        currentGameData =
            { team = model.team
            , box = model.box
            , attackerSource = model.attackerSource
            , attacker = Just model.attacker
            , defender = Just model.defender
            , selectedTrainerIndex = model.selectedTrainerIndex
            , levelCap = model.levelCap
            }

        -- Update allGameData with current game's data
        updatedGameData =
            if String.isEmpty model.selectedGame then
                model.allGameData

            else
                Dict.insert model.selectedGame currentGameData model.allGameData
    in
    Encode.object
        [ ( "currentGame", Encode.string model.selectedGame )
        , ( "gameData", Encode.dict identity encodeGameSaveData updatedGameData )
        ]


encodeGameSaveData : GameSaveData -> Encode.Value
encodeGameSaveData data =
    Encode.object
        [ ( "team", Encode.list encodePokemon data.team )
        , ( "box", Encode.list encodePokemon data.box )
        , ( "attackerSource", encodePokemonSource data.attackerSource )
        , ( "attacker"
          , case data.attacker of
                Just pokemon ->
                    encodePokemon pokemon

                Nothing ->
                    Encode.null
          )
        , ( "defender"
          , case data.defender of
                Just pokemon ->
                    encodePokemon pokemon

                Nothing ->
                    Encode.null
          )
        , ( "selectedTrainerIndex", Encode.int data.selectedTrainerIndex )
        , ( "levelCap"
          , case data.levelCap of
                Just cap ->
                    Encode.int cap

                Nothing ->
                    Encode.null
          )
        ]


encodePokemonSource : Maybe PokemonSource -> Encode.Value
encodePokemonSource maybeSource =
    case maybeSource of
        Just (FromTeam index) ->
            Encode.object
                [ ( "type", Encode.string "team" )
                , ( "index", Encode.int index )
                ]

        Just (FromBox index) ->
            Encode.object
                [ ( "type", Encode.string "box" )
                , ( "index", Encode.int index )
                ]

        Nothing ->
            Encode.null


-- CALCULATION REQUEST ENCODER


encodeCalculationRequest : Model -> Encode.Value
encodeCalculationRequest model =
    Encode.object
        [ ( "generation", Encode.int model.generation )
        , ( "attacker", encodePokemon model.attacker )
        , ( "defender", encodePokemon model.defender )
        , ( "moves", Encode.list encodeMove model.attacker.moves )
        , ( "field", encodeField model.field )
        ]


-- POKEMON STATE ENCODERS


encodePokemon : PokemonState -> Encode.Value
encodePokemon pokemon =
    Encode.object
        [ ( "species", Encode.string pokemon.species )
        , ( "level", Encode.int pokemon.level )
        , ( "nature", Encode.string pokemon.nature )
        , ( "ability", Encode.string pokemon.ability )
        , ( "item", Encode.string pokemon.item )
        , ( "evs", encodeStats pokemon.evs )
        , ( "ivs", encodeStats pokemon.ivs )
        , ( "boosts", encodeStats pokemon.boosts )
        , ( "status", Encode.string pokemon.status )
        , ( "curHP", Encode.int pokemon.curHP )
        , ( "teraType", Encode.string pokemon.teraType )
        , ( "isDynamaxed", Encode.bool pokemon.isDynamaxed )
        , ( "moves", Encode.list encodeMove pokemon.moves )
        ]


encodeStats : Stats -> Encode.Value
encodeStats stats =
    Encode.object
        [ ( "hp", Encode.int stats.hp )
        , ( "atk", Encode.int stats.atk )
        , ( "def", Encode.int stats.def )
        , ( "spa", Encode.int stats.spa )
        , ( "spd", Encode.int stats.spd )
        , ( "spe", Encode.int stats.spe )
        ]


encodeMove : MoveState -> Encode.Value
encodeMove move =
    Encode.object
        [ ( "name", Encode.string move.name )
        , ( "isCrit", Encode.bool move.isCrit )
        , ( "hits", Encode.int move.hits )
        ]


-- FIELD STATE ENCODERS


encodeField : FieldState -> Encode.Value
encodeField field =
    Encode.object
        [ ( "gameType", Encode.string field.gameType )
        , ( "weather", Encode.string field.weather )
        , ( "terrain", Encode.string field.terrain )
        , ( "isGravity", Encode.bool field.isGravity )
        , ( "attackerSide", encodeSideConditions field.attackerSide )
        , ( "defenderSide", encodeSideConditions field.defenderSide )
        ]


encodeSideConditions : SideConditions -> Encode.Value
encodeSideConditions side =
    Encode.object
        [ ( "isReflect", Encode.bool side.isReflect )
        , ( "isLightScreen", Encode.bool side.isLightScreen )
        , ( "isAuroraVeil", Encode.bool side.isAuroraVeil )
        , ( "isTailwind", Encode.bool side.isTailwind )
        , ( "isHelpingHand", Encode.bool side.isHelpingHand )
        , ( "spikes", Encode.int side.spikes )
        , ( "isSR", Encode.bool side.isSteathRock )
        ]
