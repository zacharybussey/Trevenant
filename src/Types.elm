module Types exposing (..)

import Dict exposing (Dict)



-- CORE MODEL TYPES


type alias Flags =
    { generations : List Int
    }


type alias Model =
    { generation : Int
    , attacker : PokemonState
    , defender : PokemonState
    , field : FieldState
    , result : Maybe CalculationResult
    , pokemonList : List PokemonData
    , moveList : List MoveData
    , itemList : List String
    , abilityList : List String
    , natureList : List NatureData
    , attackerLearnset : Maybe LearnsetData
    , defenderLearnset : Maybe LearnsetData
    , loading : Bool
    , selectedMoveSource : MoveSource
    , selectedMoveIndex : Int
    , trainerEncounters : List TrainerEncounter
    , filteredEncounters : List TrainerEncounter
    , selectedTrainerIndex : Int
    , trainerSearchQuery : String
    , selectedGame : String
    , availableGames : List String
    , team : List PokemonState
    , box : List PokemonState
    , attackerSource : Maybe PokemonSource
    , dragState : Maybe PokemonSource
    , settingsLoaded : Bool
    , allGameData : Dict String GameSaveData

    -- UI collapse states for redesign
    -- The Battle & Field pane under the damage strip (screens, hazards, stat stages, status, HP)
    , battlePaneOpen : Bool
    , attackerBaseStatsCollapsed : Bool
    , defenderBaseStatsCollapsed : Bool
    , defenderEditMode : Bool

    -- Dropdown states for custom dropdowns
    , openDropdown : Maybe DropdownId
    , dropdownHighlightIndex : Int

    -- Reset confirmation dialog
    , showResetConfirmDialog : Bool

    -- Level cap for ROM hacks
    , levelCap : Maybe Int

    -- Box matchup results
    , boxMatchupResults : Dict Int BoxMatchupResult

    -- Team matchup results (same structure as box)
    , teamMatchupResults : Dict Int BoxMatchupResult

    -- Color Code toggle: while on, matchups recalculate whenever the team, box, defender or field changes
    , colorCodeEnabled : Bool

    -- Display order of the box grid (does not change the stored box order)
    , boxSort : BoxSort

    -- Slot currently under a dragged Pokemon, for drop highlighting
    , dragOverTarget : Maybe DropTarget

    -- Box panel: icon grid or the matchup board
    , boxView : BoxView

    -- Matchup board results keyed by ( box index, opponent team index ) / ( team index, opponent team index )
    , boardResults : Dict ( Int, Int ) BoxMatchupResult
    , teamBoardResults : Dict ( Int, Int ) BoxMatchupResult

    -- Mega Stones known to the current generation (see applyMegaStone)
    , megaStones : List MegaStone
    }


type BoxView
    = BoxGrid
    | BoxBoard


{-| A Mega Stone: holding `item` turns species `from` into `to` (e.g.
Charizardite X: Charizard -> Charizard-Mega-X). Sent by index.js with the
item list for the current generation.
-}
type alias MegaStone =
    { item : String
    , from : String
    , to : String
    }


{-| Color Code category of a team/box Pokemon against the current defender.
Single source for both the border colors and the "Matchup" box sort.
-}
type MatchupTier
    = TradeOHKOs -- both sides OHKO each other (teal)
    | MaybeTradeOHKOs -- both sides might OHKO each other (orange)
    | GetsOHKOd -- gets or might get OHKO'd (red)
    | AlwaysOHKOs -- always OHKOs and is safe (yellow)
    | MightOHKO -- might OHKO and is safe (muted yellow)
    | NoOHKO -- nobody is OHKO'd


type BoxSort
    = SortBoxOrder
    | SortMatchup
    | SortLevel
    | SortSpeed


{-| Where a dragged team/box Pokemon was dropped. Slots swap with whatever is
there; the areas (empty space around the slots) append to the end.
-}
type DropTarget
    = TeamSlot Int
    | BoxSlot Int
    | TeamArea
    | BoxArea


{-| The team, box and which of their Pokemon is loaded as the attacker.
Roster operations keep attackerSource pointing at the same Pokemon as it moves.
-}
type alias Roster =
    { team : List PokemonState
    , box : List PokemonState
    , attackerSource : Maybe PokemonSource
    }


type DropdownId
    = AttackerMoveDropdown Int
    | DefenderMoveDropdown Int
    | AttackerAbilityDropdown
    | DefenderAbilityDropdown
    | AttackerItemDropdown
    | DefenderItemDropdown
    | TeamEvolutionDropdown Int
    | BoxEvolutionDropdown Int
    | TeamFormDropdown Int
    | BoxFormDropdown Int
    | FieldConditionsAttackerDropdown
    | FieldConditionsBothDropdown
    | FieldConditionsDefenderDropdown


type PokemonSource
    = FromTeam Int
    | FromBox Int


type MoveSource
    = AttackerMove
    | DefenderMove


type Role
    = Attacker
    | Defender



-- POKEMON TYPES


type alias PokemonState =
    { species : String
    , level : Int
    , nature : String
    , ability : String
    , item : String
    , evs : Stats
    , ivs : Stats
    , boosts : Stats
    , status : String
    , curHP : Int
    , teraType : String
    , isDynamaxed : Bool
    , moves : List MoveState
    }


type alias MoveState =
    { name : String
    , isCrit : Bool
    , hits : Int
    }


type alias Stats =
    { hp : Int
    , atk : Int
    , def : Int
    , spa : Int
    , spd : Int
    , spe : Int
    }



-- FIELD TYPES


type alias FieldState =
    { gameType : String
    , weather : String
    , terrain : String
    , isGravity : Bool
    , attackerSide : SideConditions
    , defenderSide : SideConditions
    }


type alias SideConditions =
    { isReflect : Bool
    , isLightScreen : Bool
    , isAuroraVeil : Bool
    , isTailwind : Bool
    , isHelpingHand : Bool
    , spikes : Int
    , isSteathRock : Bool
    }



-- CALCULATION RESULT TYPES


type alias MoveResult =
    { moveName : String
    , damage : ( Int, Int )
    , damagePercent : ( Float, Float )
    , critDamage : ( Int, Int )
    , critDamagePercent : ( Float, Float )
    , description : String
    , koChance : String
    , critKoChance : String
    , damageRolls : List Int
    , critDamageRolls : List Int
    }


type alias CalculationResult =
    { attackerResults : List MoveResult
    , defenderResults : List MoveResult
    , attackerSpeed : Int
    , defenderSpeed : Int
    }


type alias BoxMatchupResult =
    { boxIndex : Int
    , attackerSpeed : Int
    , defenderSpeed : Int
    , canOHKO : Bool
    , mightOHKO : Bool
    , getsOHKOd : Bool
    , mightGetOHKOd : Bool
    , isHardCounter : Bool
    , isWall : Bool
    , bestDamagePercent : Float
    , worstDamageTaken : Float

    -- Set for matchup-board requests: which of the opponent's team this was calculated against
    , defenderIndex : Maybe Int
    }



-- DATA TYPES


type alias PokemonData =
    { name : String
    , types : List String
    , baseStats : Stats
    , abilities : List String
    , weightkg : Float
    , prevo : Maybe String
    , evos : List String
    , nfe : Bool
    , baseSpecies : Maybe String
    , forme : String
    , otherFormes : List String
    , spriteUrl : String
    , spriteWidth : Int
    , spriteHeight : Int
    , isPixelated : Bool

    -- Offset of this species' 40x30 icon in Showdown's pokemonicons-sheet.png (team/box grid)
    , iconX : Int
    , iconY : Int
    }


type alias MoveData =
    { name : String
    , moveType : String
    , category : String
    , basePower : Int
    , accuracy : Int
    , isMultihit : Bool
    }


type alias NatureData =
    { name : String
    , plus : String
    , minus : String
    }


type alias LearnsetData =
    { species : String
    , levelup : List ( String, Int ) -- (move name, learn level)
    , tm : List String
    , tutor : List String
    , egg : List String
    , other : List String
    , isAttacker : Bool
    }



-- TRAINER TYPES


type alias TrainerPokemon =
    { species : String
    , level : Int
    , ability : String
    , item : String
    , nature : String
    , ivs : Stats
    , evs : Stats
    , moves : List String
    }


type alias TrainerEncounter =
    { id : String
    , trainerClass : String
    , trainerName : String
    , location : String
    , game : String
    , isDouble : Bool
    , team : List TrainerPokemon
    }



-- SETTINGS TYPES


type alias Settings =
    { currentGame : String
    , gameData : Dict String GameSaveData
    }


type alias GameSaveData =
    { team : List PokemonState
    , box : List PokemonState
    , attackerSource : Maybe PokemonSource
    , attacker : Maybe PokemonState
    , defender : Maybe PokemonState
    , selectedTrainerIndex : Int
    , levelCap : Maybe Int
    }



-- DEFAULT VALUES


defaultStats : Stats
defaultStats =
    { hp = 0
    , atk = 0
    , def = 0
    , spa = 0
    , spd = 0
    , spe = 0
    }


defaultIVs : Stats
defaultIVs =
    { hp = 31
    , atk = 31
    , def = 31
    , spa = 31
    , spd = 31
    , spe = 31
    }


defaultMove : MoveState
defaultMove =
    { name = ""
    , isCrit = False
    , hits = 1
    }


defaultPokemon : PokemonState
defaultPokemon =
    { species = ""
    , level = 50
    , nature = "Hardy"
    , ability = ""
    , item = ""
    , evs = defaultStats
    , ivs = defaultIVs
    , boosts = defaultStats
    , status = ""
    , curHP = 100
    , teraType = ""
    , isDynamaxed = False
    , moves = [ defaultMove, defaultMove, defaultMove, defaultMove ]
    }


defaultAttacker : PokemonState
defaultAttacker =
    { species = "Pikachu"
    , level = 50
    , nature = "Timid"
    , ability = "Static"
    , item = ""
    , evs = { hp = 0, atk = 0, def = 0, spa = 252, spd = 4, spe = 252 }
    , ivs = defaultIVs
    , boosts = defaultStats
    , status = ""
    , curHP = 100
    , teraType = ""
    , isDynamaxed = False
    , moves =
        [ { name = "Thunderbolt", isCrit = False, hits = 1 }
        , { name = "Volt Switch", isCrit = False, hits = 1 }
        , defaultMove
        , defaultMove
        ]
    }


defaultDefender : PokemonState
defaultDefender =
    { species = "Charizard"
    , level = 50
    , nature = "Modest"
    , ability = "Blaze"
    , item = ""
    , evs = { hp = 0, atk = 0, def = 0, spa = 252, spd = 4, spe = 252 }
    , ivs = defaultIVs
    , boosts = defaultStats
    , status = ""
    , curHP = 100
    , teraType = ""
    , isDynamaxed = False
    , moves =
        [ { name = "Flamethrower", isCrit = False, hits = 1 }
        , { name = "Air Slash", isCrit = False, hits = 1 }
        , { name = "Dragon Pulse", isCrit = False, hits = 1 }
        , defaultMove
        ]
    }


defaultSideConditions : SideConditions
defaultSideConditions =
    { isReflect = False
    , isLightScreen = False
    , isAuroraVeil = False
    , isTailwind = False
    , isHelpingHand = False
    , spikes = 0
    , isSteathRock = False
    }


defaultField : FieldState
defaultField =
    { gameType = "Singles"
    , weather = ""
    , terrain = ""
    , isGravity = False
    , attackerSide = defaultSideConditions
    , defenderSide = defaultSideConditions
    }
