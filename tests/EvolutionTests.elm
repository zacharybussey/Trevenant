module EvolutionTests exposing (..)

import Expect
import Helpers exposing (evolvePokemon)
import Test exposing (..)
import Types exposing (..)


{-| Tests for evolving a team/box Pokemon.

Evolving is a frequent action during a Nuzlocke run. The player has already entered
IVs, nature, item and the current moveset; in-game the moveset carries over, so the
calc must keep it too (previously all four moves were wiped on evolution). The
ability must also stay legal for the evolved species, otherwise damage would be
calculated with an ability the Pokemon cannot have.

-}
suite : Test
suite =
    describe "evolvePokemon"
        [ test "keeps moves, IVs, EVs, nature, level and item" <|
            \_ ->
                let
                    evolved =
                        evolvePokemon pokemonList "Charmeleon" charmander
                in
                Expect.all
                    [ \p -> Expect.equal "Charmeleon" p.species
                    , \p -> Expect.equal charmander.moves p.moves
                    , \p -> Expect.equal charmander.ivs p.ivs
                    , \p -> Expect.equal charmander.evs p.evs
                    , \p -> Expect.equal charmander.nature p.nature
                    , \p -> Expect.equal charmander.level p.level
                    , \p -> Expect.equal charmander.item p.item
                    ]
                    evolved
        , test "keeps the ability when the evolution can have it" <|
            \_ ->
                evolvePokemon pokemonList "Charmeleon" { charmander | ability = "Solar Power" }
                    |> .ability
                    |> Expect.equal "Solar Power"
        , test "maps the ability by slot when the evolution's ability differs" <|
            \_ ->
                -- Nincada slot 2 (Run Away) -> Ninjask slot 2 (Infiltrator)
                evolvePokemon pokemonList "Ninjask" { charmander | species = "Nincada", ability = "Run Away" }
                    |> .ability
                    |> Expect.equal "Infiltrator"
        , test "falls back to the evolution's first ability when the current one is unknown" <|
            \_ ->
                evolvePokemon pokemonList "Ninjask" { charmander | species = "Nincada", ability = "" }
                    |> .ability
                    |> Expect.equal "Speed Boost"
        , test "keeps the ability unchanged when species data isn't loaded" <|
            \_ ->
                evolvePokemon [] "Charmeleon" charmander
                    |> .ability
                    |> Expect.equal "Blaze"
        ]


charmander : PokemonState
charmander =
    { species = "Charmander"
    , level = 16
    , nature = "Adamant"
    , ability = "Blaze"
    , item = "Charcoal"
    , evs = { defaultStats | atk = 12 }
    , ivs = { hp = 20, atk = 31, def = 5, spa = 10, spd = 18, spe = 27 }
    , boosts = defaultStats
    , status = ""
    , curHP = 100
    , teraType = ""
    , isDynamaxed = False
    , moves =
        [ { name = "Ember", isCrit = False, hits = 1 }
        , { name = "Scratch", isCrit = False, hits = 1 }
        , { name = "Dragon Breath", isCrit = False, hits = 1 }
        , { name = "Smokescreen", isCrit = False, hits = 1 }
        ]
    }


pokemonList : List PokemonData
pokemonList =
    [ species "Charmander" [ "Blaze", "Solar Power" ]
    , species "Charmeleon" [ "Blaze", "Solar Power" ]
    , species "Nincada" [ "Compound Eyes", "Run Away" ]
    , species "Ninjask" [ "Speed Boost", "Infiltrator" ]
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
