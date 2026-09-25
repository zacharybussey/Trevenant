module BattleStateTests exposing (..)

import Expect
import Helpers exposing (applyMegaStone, clearBattleState)
import Test exposing (..)
import Types exposing (..)


{-| Tests for per-battle state and Mega Stone defenders.

Stat stages, status and HP are per battle. A +3 left over from the last fight,
or worse, sitting on a stored team member, quietly skews every calc and the
Color Code until someone notices, so the reset must clear exactly the battle
fields and nothing else. A trainer's Pokemon holding its Mega Stone battles as
the Mega form; if the calc ran against the base form, every number for that
matchup would be wrong.

-}
suite : Test
suite =
    describe "Battle state"
        [ describe "clearBattleState"
            [ test "clears stages, status, HP, Tera and Dynamax" <|
                \_ ->
                    clearBattleState boosted
                        |> (\p -> ( p.boosts, ( p.status, p.curHP ), ( p.teraType, p.isDynamaxed ) ))
                        |> Expect.equal ( defaultStats, ( "", 100 ), ( "", False ) )
            , test "keeps species, level, item, moves, nature, IVs and EVs" <|
                \_ ->
                    clearBattleState boosted
                        |> (\p -> ( ( p.species, p.level, p.item ), ( p.moves, p.nature ), ( p.ivs, p.evs ) ))
                        |> Expect.equal ( ( "Pawmo", 21, "Leftovers" ), ( boosted.moves, "Jolly" ), ( boosted.ivs, boosted.evs ) )
            ]
        , describe "applyMegaStone"
            [ test "own Mega Stone switches to the Mega form and its ability" <|
                \_ ->
                    applyMegaStone stones pokemonList { charizard | item = "Charizardite X" }
                        |> (\p -> ( p.species, p.ability, p.item ))
                        |> Expect.equal ( "Charizard-Mega-X", "Tough Claws", "Charizardite X" )
            , test "item names match regardless of case" <|
                \_ ->
                    applyMegaStone stones pokemonList { charizard | item = "charizardite y" }
                        |> .species
                        |> Expect.equal "Charizard-Mega-Y"
            , test "a stone for another species does nothing" <|
                \_ ->
                    applyMegaStone stones pokemonList { charizard | item = "Venusaurite" }
                        |> Expect.equal { charizard | item = "Venusaurite" }
            , test "no item does nothing" <|
                \_ ->
                    applyMegaStone stones pokemonList charizard
                        |> Expect.equal charizard
            , test "keeps the base ability when the Mega form's data is missing" <|
                \_ ->
                    applyMegaStone stones [] { charizard | item = "Charizardite X" }
                        |> (\p -> ( p.species, p.ability ))
                        |> Expect.equal ( "Charizard-Mega-X", "Blaze" )
            ]
        ]


boosted : PokemonState
boosted =
    { defaultPokemon
        | species = "Pawmo"
        , level = 21
        , nature = "Jolly"
        , item = "Leftovers"
        , ivs = { defaultStats | spe = 31 }
        , evs = { defaultStats | atk = 40 }
        , boosts = { defaultStats | atk = 3, spe = -1 }
        , status = "Paralysis"
        , curHP = 35
        , teraType = "Electric"
        , isDynamaxed = True
        , moves = [ { name = "Nuzzle", isCrit = False, hits = 1 } ]
    }


charizard : PokemonState
charizard =
    { defaultPokemon | species = "Charizard", level = 50, ability = "Blaze" }


stones : List MegaStone
stones =
    [ { item = "Charizardite X", from = "Charizard", to = "Charizard-Mega-X" }
    , { item = "Charizardite Y", from = "Charizard", to = "Charizard-Mega-Y" }
    , { item = "Venusaurite", from = "Venusaur", to = "Venusaur-Mega" }
    ]


pokemonList : List PokemonData
pokemonList =
    [ species "Charizard-Mega-X" [ "Tough Claws" ]
    , species "Charizard-Mega-Y" [ "Drought" ]
    ]


species : String -> List String -> PokemonData
species name abilities =
    { name = name
    , types = []
    , baseStats = defaultStats
    , abilities = abilities
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
