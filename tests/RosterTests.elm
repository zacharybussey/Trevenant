module RosterTests exposing (..)

import Expect
import Helpers exposing (..)
import Test exposing (..)
import Types exposing (..)


{-| Tests for team/box drag-and-drop, box sorting and the Speed stat.

During a run the player lines their 6 up against the opponent's 6 and swaps box
Pokemon in and out constantly. These tests pin down the drop rules (occupied slot
swaps, empty slot/area appends, full team is respected) and, just as important,
that the loaded attacker keeps pointing at the same Pokemon after it moves.
Otherwise edits in Loadout would be auto-saved onto the wrong team/box slot.

-}
suite : Test
suite =
    describe "Roster"
        [ describe "dropPokemon"
            [ test "team onto team slot swaps them (reorder)" <|
                \_ ->
                    dropPokemon (FromTeam 0) (TeamSlot 2) (roster [ "A", "B", "C" ] [] Nothing)
                        |> .team
                        |> names
                        |> Expect.equal [ "C", "B", "A" ]
            , test "box onto occupied team slot swaps the two" <|
                \_ ->
                    let
                        result =
                            dropPokemon (FromBox 1) (TeamSlot 1) (roster [ "A", "B", "C" ] [ "X", "Y", "Z" ] Nothing)
                    in
                    ( names result.team, names result.box )
                        |> Expect.equal ( [ "A", "Y", "C" ], [ "X", "B", "Z" ] )
            , test "box onto a full team's slot still swaps" <|
                \_ ->
                    let
                        result =
                            dropPokemon (FromBox 0) (TeamSlot 5) (roster [ "A", "B", "C", "D", "E", "F" ] [ "X" ] Nothing)
                    in
                    ( names result.team, names result.box )
                        |> Expect.equal ( [ "A", "B", "C", "D", "E", "X" ], [ "F" ] )
            , test "box onto empty team slot appends to the team" <|
                \_ ->
                    let
                        result =
                            dropPokemon (FromBox 0) (TeamSlot 4) (roster [ "A", "B" ] [ "X", "Y" ] Nothing)
                    in
                    ( names result.team, names result.box )
                        |> Expect.equal ( [ "A", "B", "X" ], [ "Y" ] )
            , test "box onto the team area of a full team does nothing" <|
                \_ ->
                    let
                        start =
                            roster [ "A", "B", "C", "D", "E", "F" ] [ "X" ] Nothing
                    in
                    dropPokemon (FromBox 0) TeamArea start
                        |> Expect.equal start
            , test "team onto box area moves it to the end of the box" <|
                \_ ->
                    let
                        result =
                            dropPokemon (FromTeam 0) BoxArea (roster [ "A", "B" ] [ "X" ] Nothing)
                    in
                    ( names result.team, names result.box )
                        |> Expect.equal ( [ "B" ], [ "X", "A" ] )
            , test "team onto team area leaves it in place" <|
                \_ ->
                    let
                        start =
                            roster [ "A", "B" ] [ "X" ] Nothing
                    in
                    dropPokemon (FromTeam 0) TeamArea start
                        |> Expect.equal start
            , test "box onto box slot swaps within the box" <|
                \_ ->
                    dropPokemon (FromBox 0) (BoxSlot 2) (roster [] [ "X", "Y", "Z" ] Nothing)
                        |> .box
                        |> names
                        |> Expect.equal [ "Z", "Y", "X" ]
            ]
        , describe "loaded attacker follows its Pokemon"
            [ test "through a team swap" <|
                \_ ->
                    dropPokemon (FromTeam 0) (TeamSlot 2) (roster [ "A", "B", "C" ] [] (Just (FromTeam 0)))
                        |> .attackerSource
                        |> Expect.equal (Just (FromTeam 2))
            , test "when it is the swap target" <|
                \_ ->
                    dropPokemon (FromBox 0) (TeamSlot 1) (roster [ "A", "B" ] [ "X" ] (Just (FromTeam 1)))
                        |> .attackerSource
                        |> Expect.equal (Just (FromBox 0))
            , test "when a Pokemon before it leaves the box" <|
                \_ ->
                    dropPokemon (FromBox 0) TeamArea (roster [ "A" ] [ "X", "Y", "Z" ] (Just (FromBox 2)))
                        |> .attackerSource
                        |> Expect.equal (Just (FromBox 1))
            , test "when it is moved to the end of the team" <|
                \_ ->
                    moveToEnd (FromBox 1) True (roster [ "A", "B" ] [ "X", "Y" ] (Just (FromBox 1)))
                        |> .attackerSource
                        |> Expect.equal (Just (FromTeam 2))
            , test "unaffected by an unrelated swap" <|
                \_ ->
                    dropPokemon (FromTeam 0) (TeamSlot 1) (roster [ "A", "B", "C" ] [] (Just (FromTeam 2)))
                        |> .attackerSource
                        |> Expect.equal (Just (FromTeam 2))
            ]
        , describe "sortBox"
            [ test "box order keeps real indices" <|
                \_ ->
                    sortBox SortBoxOrder (always 0) (always Nothing) (List.map (mon 5) [ "X", "Y" ])
                        |> List.map Tuple.first
                        |> Expect.equal [ 0, 1 ]
            , test "level sorts highest first, ties keep box order" <|
                \_ ->
                    sortBox SortLevel (always 0) (always Nothing) [ mon 5 "X", mon 9 "Y", mon 5 "Z", mon 12 "W" ]
                        |> List.map (Tuple.second >> .species)
                        |> Expect.equal [ "W", "Y", "X", "Z" ]
            , test "speed sorts fastest first" <|
                \_ ->
                    sortBox SortSpeed (\p -> p.level) (always Nothing) [ mon 5 "X", mon 9 "Y" ]
                        |> List.map (Tuple.second >> .species)
                        |> Expect.equal [ "Y", "X" ]
            , test "matchup puts safe OHKOs first and Pokemon that get OHKO'd last" <|
                \_ ->
                    let
                        results i =
                            case i of
                                0 ->
                                    Just (matchupResult { canOHKO = False, mightOHKO = False, getsOHKOd = True, mightGetOHKOd = True } 0)

                                1 ->
                                    Just (matchupResult { canOHKO = True, mightOHKO = True, getsOHKOd = False, mightGetOHKOd = False } 100)

                                2 ->
                                    Just (matchupResult { canOHKO = True, mightOHKO = True, getsOHKOd = True, mightGetOHKOd = True } 100)

                                _ ->
                                    Nothing
                    in
                    sortBox SortMatchup (always 0) results (List.map (mon 5) [ "Loses", "Wins", "Trades", "Unknown" ])
                        |> List.map (Tuple.second >> .species)
                        |> Expect.equal [ "Wins", "Trades", "Loses", "Unknown" ]
            , test "matchup breaks ties by best damage" <|
                \_ ->
                    let
                        neutral damage =
                            Just (matchupResult { canOHKO = False, mightOHKO = False, getsOHKOd = False, mightGetOHKOd = False } damage)

                        results i =
                            if i == 0 then
                                neutral 30

                            else
                                neutral 70
                    in
                    sortBox SortMatchup (always 0) results (List.map (mon 5) [ "Weaker", "Stronger" ])
                        |> List.map (Tuple.second >> .species)
                        |> Expect.equal [ "Stronger", "Weaker" ]
            ]
        , describe "speedStat"
            [ test "Gen 9 neutral nature" <|
                \_ ->
                    -- Garchomp base 102, L50, 31 IV, 252 EV: floor((204+31+63)*50/100)+5 = 154
                    speedStat 9 [ species "Garchomp" 102 ] natures (garchomp "Hardy")
                        |> Expect.equal 154
            , test "Gen 9 +Spe nature" <|
                \_ ->
                    speedStat 9 [ species "Garchomp" 102 ] natures (garchomp "Jolly")
                        |> Expect.equal 169
            , test "Gen 9 -Spe nature" <|
                \_ ->
                    speedStat 9 [ species "Garchomp" 102 ] natures (garchomp "Brave")
                        |> Expect.equal 138
            , test "unknown species is 0" <|
                \_ ->
                    speedStat 9 [] natures (garchomp "Hardy")
                        |> Expect.equal 0
            ]
        ]


names : List PokemonState -> List String
names =
    List.map .species


mon : Int -> String -> PokemonState
mon level name =
    { defaultPokemon | species = name, level = level }


roster : List String -> List String -> Maybe PokemonSource -> Roster
roster team box source =
    { team = List.map (mon 5) team, box = List.map (mon 5) box, attackerSource = source }


matchupResult : { canOHKO : Bool, mightOHKO : Bool, getsOHKOd : Bool, mightGetOHKOd : Bool } -> Float -> BoxMatchupResult
matchupResult flags damage =
    { boxIndex = 0
    , attackerSpeed = 0
    , defenderSpeed = 0
    , canOHKO = flags.canOHKO
    , mightOHKO = flags.mightOHKO
    , getsOHKOd = flags.getsOHKOd
    , mightGetOHKOd = flags.mightGetOHKOd
    , isHardCounter = False
    , isWall = False
    , bestDamagePercent = damage
    , worstDamageTaken = 0
    , defenderIndex = Nothing
    }


garchomp : String -> PokemonState
garchomp nature =
    { defaultPokemon
        | species = "Garchomp"
        , level = 50
        , nature = nature
        , ivs = { defaultStats | spe = 31 }
        , evs = { defaultStats | spe = 252 }
    }


natures : List NatureData
natures =
    [ { name = "Hardy", plus = "atk", minus = "atk" }
    , { name = "Jolly", plus = "spe", minus = "spa" }
    , { name = "Brave", plus = "atk", minus = "spe" }
    ]


species : String -> Int -> PokemonData
species name baseSpe =
    { name = name
    , types = []
    , baseStats = { defaultStats | spe = baseSpe }
    , abilities = []
    , weightkg = 0
    , prevo = Nothing
    , evos = []
    , nfe = False
    , baseSpecies = Nothing
    , forme = ""
    , otherFormes = []
    , spriteUrl = ""
    , spriteWidth = 0
    , spriteHeight = 0
    , isPixelated = False
    , iconX = 0
    , iconY = 0
    }
