module TrainerDataTests exposing (..)

import Expect
import Helpers exposing (..)
import Test exposing (..)
import Types exposing (..)


{-| Tests for trainer data: game → generation mapping, trainer search, encounter
lookup and converting a trainer's Pokemon into a calc-ready defender.

These exercise the real functions in Helpers.elm. The game names must match
src/data/trainers/index.json exactly, or the app would load Gen 9 data for a
Gen 5 game; and the trainer → defender conversion is what every trainer battle
in the app is calculated from.

-}
suite : Test
suite =
    describe "Trainer data"
        [ describe "gameToGeneration"
            [ test "maps every game in index.json to its generation" <|
                \_ ->
                    [ ( "Red/Blue", 1 )
                    , ( "Yellow", 1 )
                    , ( "Gold/Silver", 2 )
                    , ( "Crystal", 2 )
                    , ( "Ruby/Sapphire", 3 )
                    , ( "Emerald", 3 )
                    , ( "FireRed/LeafGreen", 3 )
                    , ( "Diamond/Pearl", 4 )
                    , ( "Platinum", 4 )
                    , ( "HeartGold/SoulSilver", 4 )
                    , ( "Black/White", 5 )
                    , ( "Black2/White2", 5 )
                    , ( "X/Y", 6 )
                    , ( "OmegaRuby/AlphaSapphire", 6 )
                    , ( "Sun/Moon", 7 )
                    , ( "UltraSun/UltraMoon", 7 )
                    , ( "Sword/Shield", 8 )
                    , ( "BrilliantDiamond/ShiningPearl", 8 )
                    , ( "Scarlet/Violet", 9 )
                    , ( "Black Pearl", 9 )
                    ]
                        |> List.map (\( game, gen ) -> ( game, gameToGeneration game ))
                        |> Expect.equalLists
                            [ ( "Red/Blue", 1 )
                            , ( "Yellow", 1 )
                            , ( "Gold/Silver", 2 )
                            , ( "Crystal", 2 )
                            , ( "Ruby/Sapphire", 3 )
                            , ( "Emerald", 3 )
                            , ( "FireRed/LeafGreen", 3 )
                            , ( "Diamond/Pearl", 4 )
                            , ( "Platinum", 4 )
                            , ( "HeartGold/SoulSilver", 4 )
                            , ( "Black/White", 5 )
                            , ( "Black2/White2", 5 )
                            , ( "X/Y", 6 )
                            , ( "OmegaRuby/AlphaSapphire", 6 )
                            , ( "Sun/Moon", 7 )
                            , ( "UltraSun/UltraMoon", 7 )
                            , ( "Sword/Shield", 8 )
                            , ( "BrilliantDiamond/ShiningPearl", 8 )
                            , ( "Scarlet/Violet", 9 )
                            , ( "Black Pearl", 9 )
                            ]
            ]
        , describe "gameHasTera"
            [ test "Scarlet/Violet has Tera" <|
                \_ -> Expect.equal True (gameHasTera "Scarlet/Violet" 9)
            , test "Black Pearl runs on the Gen 9 engine but has no Tera" <|
                \_ -> Expect.equal False (gameHasTera "Black Pearl" 9)
            , test "earlier generations have no Tera" <|
                \_ -> Expect.equal False (gameHasTera "Sword/Shield" 8)
            ]
        , describe "filterEncounters"
            [ test "empty query keeps every encounter" <|
                \_ ->
                    filterEncounters "" encounters
                        |> Expect.equal encounters
            , test "matches trainer name, ignoring case" <|
                \_ ->
                    filterEncounters "BROCK" encounters
                        |> List.map .id
                        |> Expect.equal [ "brock" ]
            , test "matches trainer class" <|
                \_ ->
                    filterEncounters "leader" encounters
                        |> List.map .id
                        |> Expect.equal [ "brock", "misty" ]
            , test "matches location" <|
                \_ ->
                    filterEncounters "cerulean" encounters
                        |> List.map .id
                        |> Expect.equal [ "misty" ]
            , test "matches a species on the trainer's team" <|
                \_ ->
                    filterEncounters "onix" encounters
                        |> List.map .id
                        |> Expect.equal [ "brock" ]
            , test "no match gives an empty list" <|
                \_ ->
                    filterEncounters "giovanni" encounters
                        |> Expect.equal []
            ]
        , describe "findEncounterIndex"
            [ test "finds an encounter by id in the full list" <|
                \_ ->
                    findEncounterIndex (encounter "misty" "Leader" "Misty" "Cerulean City" []) encounters
                        |> Expect.equal (Just 2)
            , test "Nothing when the encounter isn't in the list" <|
                \_ ->
                    findEncounterIndex (encounter "sabrina" "Leader" "Sabrina" "Saffron City" []) encounters
                        |> Expect.equal Nothing
            ]
        , describe "trainerPokemonToState"
            [ test "carries species, level, ability, item, nature, IVs and EVs" <|
                \_ ->
                    let
                        state =
                            trainerPokemonToState geodude
                    in
                    Expect.all
                        [ \s -> Expect.equal "Geodude" s.species
                        , \s -> Expect.equal 12 s.level
                        , \s -> Expect.equal "Sturdy" s.ability
                        , \s -> Expect.equal "Oran Berry" s.item
                        , \s -> Expect.equal "Adamant" s.nature
                        , \s -> Expect.equal geodude.ivs s.ivs
                        , \s -> Expect.equal geodude.evs s.evs
                        ]
                        state
            , test "starts at full HP with no boosts or status" <|
                \_ ->
                    let
                        state =
                            trainerPokemonToState geodude
                    in
                    ( state.curHP, state.boosts, state.status )
                        |> Expect.equal ( 100, defaultStats, "" )
            , test "pads the moveset to four slots" <|
                \_ ->
                    trainerPokemonToState { geodude | moves = [ "Tackle" ] }
                        |> .moves
                        |> List.map .name
                        |> Expect.equal [ "Tackle", "", "", "" ]
            , test "keeps only the first four moves" <|
                \_ ->
                    trainerPokemonToState { geodude | moves = [ "A", "B", "C", "D", "E" ] }
                        |> .moves
                        |> List.map .name
                        |> Expect.equal [ "A", "B", "C", "D" ]
            , test "treats \"No Move\" from the trainer data as an empty slot" <|
                \_ ->
                    trainerPokemonToState { geodude | moves = [ "Tackle", "No Move", "Rock Throw", "No Move" ] }
                        |> .moves
                        |> List.map .name
                        |> Expect.equal [ "Tackle", "", "Rock Throw", "" ]
            , test "defaults a missing nature to Hardy" <|
                \_ ->
                    trainerPokemonToState { geodude | nature = "" }
                        |> .nature
                        |> Expect.equal "Hardy"
            ]
        ]


geodude : TrainerPokemon
geodude =
    { species = "Geodude"
    , level = 12
    , ability = "Sturdy"
    , item = "Oran Berry"
    , nature = "Adamant"
    , ivs = { defaultStats | hp = 20, atk = 25, def = 31 }
    , evs = { defaultStats | atk = 8 }
    , moves = [ "Tackle", "Defense Curl", "Rock Throw", "Rock Polish" ]
    }


encounter : String -> String -> String -> String -> List String -> TrainerEncounter
encounter id trainerClass trainerName location team =
    { id = id
    , trainerClass = trainerClass
    , trainerName = trainerName
    , location = location
    , game = "Red/Blue"
    , isDouble = False
    , team = List.map (\species -> { geodude | species = species }) team
    }


encounters : List TrainerEncounter
encounters =
    [ encounter "rival1" "Rival" "Blue" "Pallet Town" [ "Squirtle" ]
    , encounter "brock" "Leader" "Brock" "Pewter City" [ "Geodude", "Onix" ]
    , encounter "misty" "Leader" "Misty" "Cerulean City" [ "Staryu", "Starmie" ]
    ]
