module Types exposing (..)

import Dict exposing (Dict)
import Json.Decode


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
    , dragState : Maybe DragState
    , settingsLoaded : Bool
    , allGameData : Dict String GameSaveData
    -- UI collapse states for redesign
    , fieldCollapsed : Bool
    , battleStateCollapsed : Bool
    , attackerBaseStatsCollapsed : Bool
    , defenderBaseStatsCollapsed : Bool
    , boxCollapsed : Bool
    , defenderEditMode : Bool
    -- Dropdown states for custom dropdowns
    , openDropdown : Maybe DropdownId
    -- Reset confirmation dialog
    , showResetConfirmDialog : Bool
    -- Level cap for ROM hacks
    , levelCap : Maybe Int
    -- Field conditions dropdown
    , fieldConditionsDropdownOpen : Bool
    -- Box matchup results
    , boxMatchupResults : Dict Int BoxMatchupResult
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


type PokemonSource
    = FromTeam Int
    | FromBox Int


type alias DragState =
    { source : DragSource
    , index : Int
    }


type DragSource
    = DragFromTeam
    | DragFromBox


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


-- MESSAGE TYPE


type Msg
    = SetGeneration Int
    | SetAttackerSpecies String
    | SetDefenderSpecies String
    | SetAttackerLevel Int
    | SetDefenderLevel Int
    | SetAttackerNature String
    | SetDefenderNature String
    | SetAttackerAbility String
    | SetDefenderAbility String
    | SetAttackerItem String
    | SetDefenderItem String
    | SetAttackerStatus String
    | SetDefenderStatus String
    | SetAttackerMove Int String
    | SetDefenderMove Int String
    | SetFieldWeather String
    | SetFieldTerrain String
    | SetFieldGameType String
    | SetFieldGravity Bool
    | Calculate
    | ReceivedCalculation Json.Decode.Value
    | ReceivedPokemonList Json.Decode.Value
    | ReceivedMoveList Json.Decode.Value
    | ReceivedItemList Json.Decode.Value
    | ReceivedAbilityList Json.Decode.Value
    | ReceivedNatureList Json.Decode.Value
    | ReceivedLearnset Json.Decode.Value
    | SetAttackerEV String Int
    | SetDefenderEV String Int
    | SetAttackerIV String Int
    | SetDefenderIV String Int
    | SetAttackerTeraType String
    | SetDefenderTeraType String
    | SetAttackerBoost String Int
    | SetDefenderBoost String Int
    | SetAttackerCurHP Int
    | SetDefenderCurHP Int
    | SetAttackerMoveCrit Int Bool
    | SetAttackerMoveHits Int Int
    | SetDefenderMoveCrit Int Bool
    | SetDefenderMoveHits Int Int
      -- Attacker side conditions
    | SetAttackerSideReflect Bool
    | SetAttackerSideLightScreen Bool
    | SetAttackerSideAuroraVeil Bool
    | SetAttackerSideTailwind Bool
    | SetAttackerSideHelpingHand Bool
    | SetAttackerSideSpikes Int
    | SetAttackerSideStealthRock Bool
      -- Defender side conditions
    | SetDefenderSideReflect Bool
    | SetDefenderSideLightScreen Bool
    | SetDefenderSideAuroraVeil Bool
    | SetDefenderSideTailwind Bool
    | SetDefenderSideHelpingHand Bool
    | SetDefenderSideSpikes Int
    | SetDefenderSideStealthRock Bool
    | SetAttackerDynamax Bool
    | SetDefenderDynamax Bool
    | SelectMove MoveSource Int
    | LoadedSettings Json.Decode.Value
      -- Trainer data messages
    | ReceivedAvailableGames Json.Decode.Value
    | ReceivedTrainerData Json.Decode.Value
    | SetSelectedGame String
    | SetTrainerSearchQuery String
    | SelectTrainer Int
    | SelectFromSearchResults TrainerEncounter
    | CloseSearchDropdown
    | NextTrainer
    | PrevTrainer
    | LoadTrainerToDefender Int
      -- Team/Box management (attacker only)
    | AddToBox
    | LoadFromBox Int
    | RemoveFromBox Int
    | AddToTeam
    | LoadFromTeam Int
    | RemoveFromTeam Int
    | MoveToTeam Int -- Move from box to team
    | MoveToBox Int -- Move from team to box
      -- Evolution and form switching
    | EvolvePokemonInBox Int String -- box index, target species name
    | EvolvePokemonInTeam Int String -- team index, target species name
    | SwitchAttackerForm String -- Switch current attacker to a different form
    | SwitchTeamPokemonForm Int String -- team index, target form name
    | SwitchBoxPokemonForm Int String -- box index, target form name
      -- Drag and drop
    | DragStart DragSource Int
    | DragEnd
    | DragOver
    | DropOnTeam
    | DropOnBox
      -- UI collapse toggles
    | ToggleFieldCollapsed
    | ToggleBattleStateCollapsed
    | ToggleAttackerBaseStatsCollapsed
    | ToggleDefenderBaseStatsCollapsed
    | ToggleBoxCollapsed
    | ToggleDefenderEditMode
      -- Dropdown toggles
    | ToggleDropdown DropdownId
    | OpenDropdown DropdownId
    | CloseDropdown
      -- Reset game data
    | RequestResetGameData
    | ConfirmResetGameData
    | CancelResetGameData
      -- Level cap for ROM hacks
    | SetLevelCap (Maybe Int)
    | ApplyLevelCapToAll
      -- Field conditions dropdown
    | ToggleFieldConditionsDropdown
      -- Box matchup calculations
    | CalculateBoxMatchups
    | ReceivedBoxMatchupResult Json.Decode.Value


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
