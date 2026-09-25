port module Main exposing (main)

import Browser
import Browser.Events
import Decoders exposing (..)
import Dict exposing (Dict)
import Encoders exposing (..)
import Helpers exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Html.Keyed as Keyed
import Json.Decode as Decode exposing (Decoder)
import Json.Encode as Encode
import Types exposing (..)



-- MAIN


main : Program Flags Model Msg
main =
    Browser.element
        { init = init
        , update = updateWithMatchups
        , subscriptions = subscriptions
        , view = view
        }



-- PORTS


port requestCalculation : Encode.Value -> Cmd msg


port receiveCalculation : (Decode.Value -> msg) -> Sub msg


port requestPokemonList : Int -> Cmd msg


port receivePokemonList : (Decode.Value -> msg) -> Sub msg


port requestMoveList : Int -> Cmd msg


port receiveMoveList : (Decode.Value -> msg) -> Sub msg


port requestItemList : Int -> Cmd msg


port receiveItemList : (Decode.Value -> msg) -> Sub msg


port requestAbilityList : Int -> Cmd msg


port receiveAbilityList : (Decode.Value -> msg) -> Sub msg


port requestNatureList : () -> Cmd msg


port receiveNatureList : (Decode.Value -> msg) -> Sub msg


port saveToLocalStorage : Encode.Value -> Cmd msg



-- Report a decode failure to the browser console (see index.js) instead of dropping it silently


port logError : String -> Cmd msg


port loadFromLocalStorage : (Decode.Value -> msg) -> Sub msg


port requestTrainerData : String -> Cmd msg


port receiveTrainerData : (Decode.Value -> msg) -> Sub msg


port requestAvailableGames : () -> Cmd msg


port receiveAvailableGames : (Decode.Value -> msg) -> Sub msg



-- Learnset ports


port requestLearnset : { species : String, generation : Int, isAttacker : Bool } -> Cmd msg


port receiveLearnset : (Decode.Value -> msg) -> Sub msg



-- Box matchup ports


port requestBoxMatchup : Encode.Value -> Cmd msg


port receiveBoxMatchup : (Decode.Value -> msg) -> Sub msg



-- Team matchup ports (reuses same calculation logic)


port requestTeamMatchup : Encode.Value -> Cmd msg


port receiveTeamMatchup : (Decode.Value -> msg) -> Sub msg


init : Flags -> ( Model, Cmd Msg )
init flags =
    let
        initialGen =
            9

        initialGame =
            "Scarlet/Violet"

        initialModel =
            { generation = initialGen
            , attacker = defaultAttacker
            , defender = defaultDefender
            , field = defaultField
            , result = Nothing
            , pokemonList = []
            , moveList = []
            , itemList = []
            , abilityList = []
            , natureList = []
            , attackerLearnset = Nothing
            , defenderLearnset = Nothing
            , loading = True
            , selectedMoveSource = AttackerMove
            , selectedMoveIndex = 0
            , trainerEncounters = []
            , filteredEncounters = []
            , selectedTrainerIndex = 0
            , trainerSearchQuery = ""
            , selectedGame = initialGame
            , availableGames = []
            , team = []
            , box = []
            , attackerSource = Nothing
            , dragState = Nothing
            , settingsLoaded = False
            , allGameData = Dict.empty

            -- UI collapse states - collapsed by default for cleaner look
            , fieldCollapsed = True
            , battleStateCollapsed = True
            , attackerBaseStatsCollapsed = False
            , defenderBaseStatsCollapsed = False
            , boxCollapsed = True
            , defenderEditMode = False
            , openDropdown = Nothing
            , dropdownHighlightIndex = 0
            , showResetConfirmDialog = False
            , showColorCodeHelp = False
            , levelCap = Nothing
            , boxMatchupResults = Dict.empty
            , teamMatchupResults = Dict.empty
            , colorCodeEnabled = False
            , boxSort = SortBoxOrder
            , dragOverTarget = Nothing
            , boxView = BoxGrid
            , boardResults = Dict.empty
            , teamBoardResults = Dict.empty
            }
    in
    ( initialModel
    , Cmd.batch
        [ requestPokemonList initialGen
        , requestMoveList initialGen
        , requestItemList initialGen
        , requestAbilityList initialGen
        , requestNatureList ()
        , requestAvailableGames ()
        , requestTrainerData initialGame
        ]
    )



-- UPDATE


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
    | ReceivedCalculation Decode.Value
    | ReceivedPokemonList Decode.Value
    | ReceivedMoveList Decode.Value
    | ReceivedItemList Decode.Value
    | ReceivedAbilityList Decode.Value
    | ReceivedNatureList Decode.Value
    | ReceivedLearnset Decode.Value
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
    | LoadedSettings Decode.Value
      -- Trainer data messages
    | ReceivedAvailableGames Decode.Value
    | ReceivedTrainerData Decode.Value
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
    | SwitchDefenderForm String -- Switch current defender to a different form
    | SwitchTeamPokemonForm Int String -- team index, target form name
    | SwitchBoxPokemonForm Int String -- box index, target form name
      -- Drag and drop
    | DragStart PokemonSource
    | DragEnd
    | DragOverTarget DropTarget
    | DropOn DropTarget
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
    | CloseAllDropdowns
      -- Reset game data
    | RequestResetGameData
    | ConfirmResetGameData
    | CancelResetGameData
      -- Level cap for ROM hacks
    | SetLevelCap (Maybe Int)
    | ApplyLevelCapToAll
      -- Box matchup calculations (Color Code) and box sorting
    | ToggleColorCode
    | SetBoxSort BoxSort
    | SetBoxView BoxView
    | SelectPairing PokemonSource Int -- roster Pokemon vs the opponent team member at this index
    | ReceivedBoxMatchupResult Decode.Value
    | ReceivedTeamMatchupResult Decode.Value
      -- Color code help modal
    | ShowColorCodeHelp
    | HideColorCodeHelp
      -- Keyboard events
    | KeyPressed String



-- Helper function to get box Pokemon border color based on matchup results


getBoxPokemonBorderColor : Maybe BoxMatchupResult -> String
getBoxPokemonBorderColor maybeResult =
    case maybeResult of
        Nothing ->
            "border-transparent"

        Just result ->
            matchupTierBorder (matchupTier result)


matchupTierBorder : MatchupTier -> String
matchupTierBorder tier =
    case tier of
        TradeOHKOs ->
            -- Teal, distinct from the green selection border
            "border-teal-400"

        MaybeTradeOHKOs ->
            "border-orange-500"

        GetsOHKOd ->
            "border-red-500"

        AlwaysOHKOs ->
            "border-yellow-400"

        MightOHKO ->
            "border-yellow-600"

        NoOHKO ->
            "border-transparent"


{-| Wraps `update` so the matchup colors and the matchup board stay current.
Color Code compares every team/box Pokemon with the current defender; the board
compares them with every Pokemon on the opponent's team. Whenever an input to
either changes (roster, defender or opponent team, field, generation, species
data) the affected results are re-requested, instead of each handler having to
remember to. Results are keyed by list index, so entries past the end of a
shrunk list are dropped.
-}
updateWithMatchups : Msg -> Model -> ( Model, Cmd Msg )
updateWithMatchups msg model =
    let
        ( newModel, cmd ) =
            update msg model

        rosterChanged =
            newModel.team /= model.team || newModel.box /= model.box

        sharedChanged =
            rosterChanged
                || newModel.field
                /= model.field
                || newModel.generation
                /= model.generation
                || newModel.pokemonList
                /= model.pokemonList

        wantColors =
            newModel.colorCodeEnabled

        colorInputsChanged =
            sharedChanged
                || newModel.defender
                /= model.defender
                || (wantColors && not model.colorCodeEnabled)

        wantBoard =
            newModel.boxView == BoxBoard && not newModel.boxCollapsed

        boardInputsChanged =
            sharedChanged
                || opponentTeam newModel
                /= opponentTeam model
                || (wantBoard && not (model.boxView == BoxBoard && not model.boxCollapsed))

        opponentCount =
            List.length (opponentTeam newModel)

        -- Without a valid defender there is nothing to compare against, so old colors are cleared
        keepColor i list =
            hasValidDefender newModel && i < List.length list

        keepBoard ( i, j ) list =
            i < List.length list && j < opponentCount

        pruned =
            { newModel
                | boxMatchupResults = Dict.filter (\i _ -> keepColor i newModel.box) newModel.boxMatchupResults
                , teamMatchupResults = Dict.filter (\i _ -> keepColor i newModel.team) newModel.teamMatchupResults
                , boardResults = Dict.filter (\key _ -> keepBoard key newModel.box) newModel.boardResults
                , teamBoardResults = Dict.filter (\key _ -> keepBoard key newModel.team) newModel.teamBoardResults
            }
    in
    ( pruned
    , Cmd.batch
        [ cmd
        , if wantColors && colorInputsChanged then
            matchupCommands pruned

          else
            Cmd.none
        , if wantBoard && boardInputsChanged then
            boardCommands pruned

          else
            Cmd.none
        ]
    )


{-| One matchup request per team and box Pokemon against the current defender.
-}
matchupCommands : Model -> Cmd Msg
matchupCommands model =
    if hasValidDefender model then
        Cmd.batch
            (List.indexedMap (matchupRequest model requestBoxMatchup Nothing model.defender) model.box
                ++ List.indexedMap (matchupRequest model requestTeamMatchup Nothing model.defender) model.team
            )

    else
        Cmd.none


{-| One request per team/box Pokemon per opponent team member, for the matchup board.
-}
boardCommands : Model -> Cmd Msg
boardCommands model =
    let
        isKnown opponent =
            List.any (\p -> p.name == opponent.species) model.pokemonList

        against j opponent =
            if isKnown opponent then
                List.indexedMap (matchupRequest model requestBoxMatchup (Just j) opponent) model.box
                    ++ List.indexedMap (matchupRequest model requestTeamMatchup (Just j) opponent) model.team

            else
                []
    in
    Cmd.batch (List.concat (List.indexedMap against (opponentTeam model)))


matchupRequest : Model -> (Encode.Value -> Cmd Msg) -> Maybe Int -> PokemonState -> Int -> PokemonState -> Cmd Msg
matchupRequest model port_ defenderIndex defender index pokemon =
    port_
        (Encode.object
            [ ( "generation", Encode.int model.generation )
            , ( "boxIndex", Encode.int index )
            , ( "defenderIndex", Maybe.map Encode.int defenderIndex |> Maybe.withDefault Encode.null )
            , ( "attacker", encodePokemon pokemon )
            , ( "defender", encodePokemon defender )
            , ( "field", encodeField model.field )
            ]
        )


hasValidDefender : Model -> Bool
hasValidDefender model =
    not (String.isEmpty model.defender.species)
        && List.any (\p -> p.name == model.defender.species) model.pokemonList



-- Helper function to check if a form name is a regional variant (not a battle form)
-- Helper function to filter out regional forms from a list (keep only battle forms)
-- Helper function to get a shorter display name for forms
-- e.g., "Charizard-Mega-X" → "Mega X", "Rotom-Wash" → "Wash", "Charizard" → "Base"


getFormDisplayName : String -> String
getFormDisplayName formName =
    case String.split "-" formName of
        [ _ ] ->
            -- No hyphen, this is the base form
            "Base"

        [ _, suffix ] ->
            -- One hyphen: "Rotom-Wash" → "Wash"
            suffix

        [ _, suffix1, suffix2 ] ->
            -- Two hyphens: "Charizard-Mega-X" → "Mega X"
            suffix1 ++ " " ++ suffix2

        _ ->
            -- Fallback: just use the whole name
            formName



-- Auto-trigger helper functions for abilities and items


applyAbilityAutoTriggers : Model -> String -> Model
applyAbilityAutoTriggers model ability =
    let
        field =
            model.field
    in
    case ability of
        "Drought" ->
            { model | field = { field | weather = "Sun" } }

        "Drizzle" ->
            { model | field = { field | weather = "Rain" } }

        "Sand Stream" ->
            { model | field = { field | weather = "Sand" } }

        "Snow Warning" ->
            { model | field = { field | weather = "Snow" } }

        "Air Lock" ->
            { model | field = { field | weather = "None" } }

        "Cloud Nine" ->
            { model | field = { field | weather = "None" } }

        _ ->
            model


applyItemAutoTriggers : Model -> String -> Bool -> Model
applyItemAutoTriggers model item isAttacker =
    case item of
        "Flame Orb" ->
            if isAttacker then
                let
                    attacker =
                        model.attacker
                in
                { model | attacker = { attacker | status = "Burn" } }

            else
                let
                    defender =
                        model.defender
                in
                { model | defender = { defender | status = "Burn" } }

        "Toxic Orb" ->
            if isAttacker then
                let
                    attacker =
                        model.attacker
                in
                { model | attacker = { attacker | status = "Poison" } }

            else
                let
                    defender =
                        model.defender
                in
                { model | defender = { defender | status = "Poison" } }

        _ ->
            model



-- Helper function to update model and trigger calculation if both Pokemon are selected


{-| Apply a team/box change (see the roster helpers in Helpers.elm) and save it.
-}
applyRoster : (Roster -> Roster) -> Model -> ( Model, Cmd Msg )
applyRoster change model =
    let
        roster =
            change { team = model.team, box = model.box, attackerSource = model.attackerSource }

        newModel =
            { model | team = roster.team, box = roster.box, attackerSource = roster.attackerSource }
    in
    ( newModel, saveToLocalStorage (encodeSettings newModel) )


updateAndCalculate : (Model -> Model) -> Model -> ( Model, Cmd Msg )
updateAndCalculate updateFn model =
    let
        updatedModel =
            updateFn model

        -- Auto-save attacker to source if it exists
        modelWithAutoSave =
            case updatedModel.attackerSource of
                Just (FromTeam index) ->
                    let
                        newTeam =
                            List.indexedMap
                                (\i p ->
                                    if i == index then
                                        updatedModel.attacker

                                    else
                                        p
                                )
                                updatedModel.team
                    in
                    { updatedModel | team = newTeam }

                Just (FromBox index) ->
                    let
                        newBox =
                            List.indexedMap
                                (\i p ->
                                    if i == index then
                                        updatedModel.attacker

                                    else
                                        p
                                )
                                updatedModel.box
                    in
                    { updatedModel | box = newBox }

                Nothing ->
                    updatedModel

        newModel =
            modelWithAutoSave

        -- Check if a species name exists in the Pokemon list
        isValidSpecies speciesName =
            List.any (\p -> p.name == speciesName) newModel.pokemonList

        -- Only calculate if both species are non-empty AND valid Pokemon names
        shouldCalc =
            not (String.isEmpty newModel.attacker.species)
                && not (String.isEmpty newModel.defender.species)
                && isValidSpecies newModel.attacker.species
                && isValidSpecies newModel.defender.species

        -- Always save to localStorage to persist session state
        saveCmd =
            saveToLocalStorage (encodeSettings newModel)
    in
    if shouldCalc then
        ( newModel, Cmd.batch [ requestCalculation (encodeCalculationRequest newModel), saveCmd ] )

    else
        ( newModel, saveCmd )


{-| Get the message to dispatch when Enter is pressed on a dropdown.

Returns Nothing if no dropdown is open or if there are no options.

-}
getEnterKeyMessage : Model -> Maybe Msg
getEnterKeyMessage model =
    case model.openDropdown of
        Nothing ->
            Nothing

        Just dropdownId ->
            case dropdownId of
                AttackerMoveDropdown index ->
                    let
                        move =
                            List.drop index model.attacker.moves |> List.head |> Maybe.withDefault defaultMove

                        isExactMatch =
                            List.any (\m -> m.name == move.name) model.moveList

                        filteredMoves =
                            getFilteredMoveList model.attackerLearnset model.moveList
                                |> List.filter
                                    (\m ->
                                        String.isEmpty move.name
                                            || isExactMatch
                                            || String.contains (String.toLower move.name) (String.toLower m.name)
                                    )

                        clampedHighlight =
                            Basics.min model.dropdownHighlightIndex (List.length filteredMoves - 1)
                                |> Basics.max 0
                    in
                    List.drop clampedHighlight filteredMoves
                        |> List.head
                        |> Maybe.map (\m -> SetAttackerMove index m.name)

                DefenderMoveDropdown index ->
                    let
                        move =
                            List.drop index model.defender.moves |> List.head |> Maybe.withDefault defaultMove

                        isExactMatch =
                            List.any (\m -> m.name == move.name) model.moveList

                        filteredMoves =
                            getFilteredMoveList model.defenderLearnset model.moveList
                                |> List.filter
                                    (\m ->
                                        String.isEmpty move.name
                                            || isExactMatch
                                            || String.contains (String.toLower move.name) (String.toLower m.name)
                                    )

                        clampedHighlight =
                            Basics.min model.dropdownHighlightIndex (List.length filteredMoves - 1)
                                |> Basics.max 0
                    in
                    List.drop clampedHighlight filteredMoves
                        |> List.head
                        |> Maybe.map (\m -> SetDefenderMove index m.name)

                AttackerAbilityDropdown ->
                    let
                        isExactMatch =
                            List.any (\a -> a == model.attacker.ability) model.abilityList

                        filteredAbilities =
                            getFilteredAbilityList model.attacker.species model.pokemonList model.abilityList
                                |> List.filter
                                    (\a ->
                                        String.isEmpty model.attacker.ability
                                            || isExactMatch
                                            || String.contains (String.toLower model.attacker.ability) (String.toLower a)
                                    )

                        clampedHighlight =
                            Basics.min model.dropdownHighlightIndex (List.length filteredAbilities - 1)
                                |> Basics.max 0
                    in
                    List.drop clampedHighlight filteredAbilities
                        |> List.head
                        |> Maybe.map SetAttackerAbility

                DefenderAbilityDropdown ->
                    let
                        isExactMatch =
                            List.any (\a -> a == model.defender.ability) model.abilityList

                        filteredAbilities =
                            getFilteredAbilityList model.defender.species model.pokemonList model.abilityList
                                |> List.filter
                                    (\a ->
                                        String.isEmpty model.defender.ability
                                            || isExactMatch
                                            || String.contains (String.toLower model.defender.ability) (String.toLower a)
                                    )

                        clampedHighlight =
                            Basics.min model.dropdownHighlightIndex (List.length filteredAbilities - 1)
                                |> Basics.max 0
                    in
                    List.drop clampedHighlight filteredAbilities
                        |> List.head
                        |> Maybe.map SetDefenderAbility

                AttackerItemDropdown ->
                    let
                        isExactMatch =
                            List.any (\item -> item == model.attacker.item) model.itemList

                        filteredItems =
                            getFilteredItemList model.itemList
                                |> List.filter
                                    (\item ->
                                        String.isEmpty model.attacker.item
                                            || isExactMatch
                                            || String.contains (String.toLower model.attacker.item) (String.toLower item)
                                    )

                        clampedHighlight =
                            Basics.min model.dropdownHighlightIndex (List.length filteredItems - 1)
                                |> Basics.max 0
                    in
                    List.drop clampedHighlight filteredItems
                        |> List.head
                        |> Maybe.map SetAttackerItem

                DefenderItemDropdown ->
                    let
                        isExactMatch =
                            List.any (\item -> item == model.defender.item) model.itemList

                        filteredItems =
                            getFilteredItemList model.itemList
                                |> List.filter
                                    (\item ->
                                        String.isEmpty model.defender.item
                                            || isExactMatch
                                            || String.contains (String.toLower model.defender.item) (String.toLower item)
                                    )

                        clampedHighlight =
                            Basics.min model.dropdownHighlightIndex (List.length filteredItems - 1)
                                |> Basics.max 0
                    in
                    List.drop clampedHighlight filteredItems
                        |> List.head
                        |> Maybe.map SetDefenderItem

                -- Evolution/Form dropdowns and Field Conditions - Enter not supported for toggle-style dropdowns
                TeamEvolutionDropdown _ ->
                    Nothing

                BoxEvolutionDropdown _ ->
                    Nothing

                TeamFormDropdown _ ->
                    Nothing

                BoxFormDropdown _ ->
                    Nothing

                FieldConditionsAttackerDropdown ->
                    Nothing

                FieldConditionsBothDropdown ->
                    Nothing

                FieldConditionsDefenderDropdown ->
                    Nothing


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        SetGeneration gen ->
            ( { model | generation = gen, loading = True }
            , Cmd.batch
                [ requestPokemonList gen
                , requestMoveList gen
                , requestItemList gen
                , requestAbilityList gen
                ]
            )

        SetAttackerSpecies species ->
            -- When species changes, clear attackerSource to break auto-save link
            -- This prevents overwriting the original Pokemon when "catching" a new one
            -- Also reset all fields to defaults when species changes (UX improvement)
            let
                speciesChanged =
                    species /= model.attacker.species

                newSource =
                    if speciesChanged then
                        Nothing

                    else
                        model.attackerSource

                -- Get default ability for the new species
                defaultAbility =
                    getDefaultAbilityForSpecies species model.pokemonList

                ( updatedModel, calcCmd ) =
                    updateAndCalculate
                        (\m ->
                            let
                                attacker =
                                    m.attacker

                                -- Reset all fields when species changes
                                newAttacker =
                                    if speciesChanged then
                                        { attacker
                                            | species = species
                                            , ability = defaultAbility
                                            , item = ""
                                            , nature = "Hardy"
                                            , evs = { hp = 0, atk = 0, def = 0, spa = 0, spd = 0, spe = 0 }
                                            , ivs = defaultIVs
                                            , moves =
                                                [ defaultMove
                                                , defaultMove
                                                , defaultMove
                                                , defaultMove
                                                ]
                                        }

                                    else
                                        { attacker | species = species }
                            in
                            { m | attacker = newAttacker, attackerSource = newSource }
                        )
                        model

                learnsetCmd =
                    if not (String.isEmpty species) then
                        requestLearnset { species = species, generation = model.generation, isAttacker = True }

                    else
                        Cmd.none
            in
            ( updatedModel, Cmd.batch [ calcCmd, learnsetCmd ] )

        SetDefenderSpecies species ->
            let
                -- Get default ability for the new species
                defaultAbility =
                    getDefaultAbilityForSpecies species model.pokemonList

                ( updatedModel, calcCmd ) =
                    updateAndCalculate
                        (\m ->
                            let
                                defender =
                                    m.defender

                                -- Only update ability if species actually changed
                                newAbility =
                                    if species /= m.defender.species then
                                        defaultAbility

                                    else
                                        defender.ability
                            in
                            { m | defender = { defender | species = species, ability = newAbility } }
                        )
                        model

                learnsetCmd =
                    if not (String.isEmpty species) then
                        requestLearnset { species = species, generation = model.generation, isAttacker = False }

                    else
                        Cmd.none
            in
            ( updatedModel, Cmd.batch [ calcCmd, learnsetCmd ] )

        SetAttackerLevel level ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker
                    in
                    { m | attacker = { attacker | level = level } }
                )
                model

        SetDefenderLevel level ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender
                    in
                    { m | defender = { defender | level = level } }
                )
                model

        SetAttackerNature nature ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker
                    in
                    { m | attacker = { attacker | nature = nature } }
                )
                model

        SetDefenderNature nature ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender
                    in
                    { m | defender = { defender | nature = nature } }
                )
                model

        SetAttackerAbility ability ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        -- Only close dropdown if user selected an exact match (from dropdown)
                        isExactMatch =
                            List.member ability m.abilityList

                        newDropdown =
                            if isExactMatch then
                                Nothing

                            else
                                m.openDropdown

                        modelWithAbility =
                            { m | attacker = { attacker | ability = ability }, openDropdown = newDropdown }
                    in
                    applyAbilityAutoTriggers modelWithAbility ability
                )
                model

        SetDefenderAbility ability ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        -- Only close dropdown if user selected an exact match (from dropdown)
                        isExactMatch =
                            List.member ability m.abilityList

                        newDropdown =
                            if isExactMatch then
                                Nothing

                            else
                                m.openDropdown

                        modelWithAbility =
                            { m | defender = { defender | ability = ability }, openDropdown = newDropdown }
                    in
                    applyAbilityAutoTriggers modelWithAbility ability
                )
                model

        SetAttackerItem item ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        -- Only close dropdown if user selected an exact match (from dropdown)
                        isExactMatch =
                            List.member item m.itemList

                        newDropdown =
                            if isExactMatch then
                                Nothing

                            else
                                m.openDropdown

                        modelWithItem =
                            { m | attacker = { attacker | item = item }, openDropdown = newDropdown }
                    in
                    applyItemAutoTriggers modelWithItem item True
                )
                model

        SetDefenderItem item ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        -- Only close dropdown if user selected an exact match (from dropdown)
                        isExactMatch =
                            List.member item m.itemList

                        newDropdown =
                            if isExactMatch then
                                Nothing

                            else
                                m.openDropdown

                        modelWithItem =
                            { m | defender = { defender | item = item }, openDropdown = newDropdown }
                    in
                    applyItemAutoTriggers modelWithItem item False
                )
                model

        SetAttackerStatus status ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker
                    in
                    { m | attacker = { attacker | status = status } }
                )
                model

        SetDefenderStatus status ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender
                    in
                    { m | defender = { defender | status = status } }
                )
                model

        SetAttackerMove index moveName ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        moves =
                            List.indexedMap
                                (\i mv ->
                                    if i == index then
                                        { mv | name = moveName }

                                    else
                                        mv
                                )
                                attacker.moves

                        -- Only close dropdown if user selected an exact match (from dropdown)
                        -- Keep open if user is still typing (partial match)
                        isExactMatch =
                            List.any (\mv -> mv.name == moveName) m.moveList

                        newDropdown =
                            if isExactMatch then
                                Nothing

                            else
                                m.openDropdown
                    in
                    { m
                        | attacker = { attacker | moves = moves }
                        , openDropdown = newDropdown
                    }
                )
                model

        SetDefenderMove index moveName ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        moves =
                            List.indexedMap
                                (\i mv ->
                                    if i == index then
                                        { mv | name = moveName }

                                    else
                                        mv
                                )
                                defender.moves

                        -- Only close dropdown if user selected an exact match (from dropdown)
                        isExactMatch =
                            List.any (\mv -> mv.name == moveName) m.moveList

                        newDropdown =
                            if isExactMatch then
                                Nothing

                            else
                                m.openDropdown
                    in
                    { m
                        | defender = { defender | moves = moves }
                        , openDropdown = newDropdown
                    }
                )
                model

        SetFieldWeather weather ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field
                    in
                    { m | field = { field | weather = weather } }
                )
                model

        SetFieldTerrain terrain ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field
                    in
                    { m | field = { field | terrain = terrain } }
                )
                model

        SetFieldGameType gameType ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field
                    in
                    { m | field = { field | gameType = gameType } }
                )
                model

        SetFieldGravity isGravity ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field
                    in
                    { m | field = { field | isGravity = isGravity } }
                )
                model

        Calculate ->
            let
                isValidSpecies speciesName =
                    List.any (\p -> p.name == speciesName) model.pokemonList

                shouldCalc =
                    not (String.isEmpty model.attacker.species)
                        && not (String.isEmpty model.defender.species)
                        && isValidSpecies model.attacker.species
                        && isValidSpecies model.defender.species
            in
            if shouldCalc then
                ( model, requestCalculation (encodeCalculationRequest model) )

            else
                ( model, Cmd.none )

        ReceivedCalculation value ->
            case Decode.decodeValue calculationResultDecoder value of
                Ok result ->
                    let
                        -- Find the index of the highest damage move
                        findHighestDamageIndex : List MoveResult -> Int
                        findHighestDamageIndex results =
                            results
                                |> List.indexedMap
                                    (\i r ->
                                        if String.isEmpty r.moveName || r.moveName == "(No Move)" then
                                            ( i, 0 )

                                        else
                                            ( i, Tuple.second r.damage )
                                    )
                                |> List.sortBy (\( _, dmg ) -> negate dmg)
                                |> List.head
                                |> Maybe.map Tuple.first
                                |> Maybe.withDefault 0

                        -- Auto-select highest damage move from faster Pokemon
                        attackerFaster =
                            result.attackerSpeed > result.defenderSpeed

                        ( newSource, newIndex ) =
                            if attackerFaster then
                                ( AttackerMove, findHighestDamageIndex result.attackerResults )

                            else
                                ( DefenderMove, findHighestDamageIndex result.defenderResults )
                    in
                    ( { model
                        | result = Just result
                        , selectedMoveSource = newSource
                        , selectedMoveIndex = newIndex
                      }
                    , Cmd.none
                    )

                Err err ->
                    ( model, logError ("ReceivedCalculation: " ++ Decode.errorToString err) )

        ReceivedPokemonList value ->
            case Decode.decodeValue pokemonListDecoder value of
                Ok pokemonList ->
                    let
                        newModel =
                            { model | pokemonList = pokemonList, loading = False }

                        -- Check if species exists in the new Pokemon list
                        isValidSpecies speciesName =
                            List.any (\p -> p.name == speciesName) pokemonList

                        -- Trigger calculation if we have valid species (handles race condition with trainer data)
                        shouldCalc =
                            not (String.isEmpty newModel.attacker.species)
                                && not (String.isEmpty newModel.defender.species)
                                && isValidSpecies newModel.attacker.species
                                && isValidSpecies newModel.defender.species
                    in
                    if shouldCalc then
                        ( newModel, requestCalculation (encodeCalculationRequest newModel) )

                    else
                        ( newModel, Cmd.none )

                Err err ->
                    ( { model | loading = False }, logError ("ReceivedPokemonList: " ++ Decode.errorToString err) )

        ReceivedMoveList value ->
            case Decode.decodeValue moveListDecoder value of
                Ok moveList ->
                    ( { model | moveList = moveList }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedMoveList: " ++ Decode.errorToString err) )

        ReceivedItemList value ->
            case Decode.decodeValue itemListDecoder value of
                Ok itemList ->
                    ( { model | itemList = itemList }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedItemList: " ++ Decode.errorToString err) )

        ReceivedAbilityList value ->
            case Decode.decodeValue abilityListDecoder value of
                Ok abilityList ->
                    ( { model | abilityList = abilityList }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedAbilityList: " ++ Decode.errorToString err) )

        ReceivedNatureList value ->
            case Decode.decodeValue natureListDecoder value of
                Ok natureList ->
                    ( { model | natureList = natureList }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedNatureList: " ++ Decode.errorToString err) )

        ReceivedLearnset value ->
            case Decode.decodeValue learnsetDecoder value of
                Ok learnset ->
                    if learnset.isAttacker then
                        ( { model | attackerLearnset = Just learnset }, Cmd.none )

                    else
                        ( { model | defenderLearnset = Just learnset }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedLearnset: " ++ Decode.errorToString err) )

        SetAttackerEV statName value ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        evs =
                            attacker.evs

                        clampedValue =
                            clamp 0 252 value

                        -- For Gen 1, sync spa and spd when either is changed
                        newEvs =
                            if m.generation == 1 && (statName == "spa" || statName == "spd") then
                                updateStat "spa" clampedValue evs
                                    |> updateStat "spd" clampedValue

                            else
                                updateStat statName clampedValue evs
                    in
                    { m | attacker = { attacker | evs = newEvs } }
                )
                model

        SetDefenderEV statName value ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        evs =
                            defender.evs

                        clampedValue =
                            clamp 0 252 value

                        -- For Gen 1, sync spa and spd when either is changed
                        newEvs =
                            if m.generation == 1 && (statName == "spa" || statName == "spd") then
                                updateStat "spa" clampedValue evs
                                    |> updateStat "spd" clampedValue

                            else
                                updateStat statName clampedValue evs
                    in
                    { m | defender = { defender | evs = newEvs } }
                )
                model

        SetAttackerIV statName value ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        ivs =
                            attacker.ivs

                        clampedValue =
                            clamp 0 31 value

                        -- For Gen 1, sync spa and spd when either is changed
                        newIvs =
                            if m.generation == 1 && (statName == "spa" || statName == "spd") then
                                updateStat "spa" clampedValue ivs
                                    |> updateStat "spd" clampedValue

                            else
                                updateStat statName clampedValue ivs
                    in
                    { m | attacker = { attacker | ivs = newIvs } }
                )
                model

        SetDefenderIV statName value ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        ivs =
                            defender.ivs

                        clampedValue =
                            clamp 0 31 value

                        -- For Gen 1, sync spa and spd when either is changed
                        newIvs =
                            if m.generation == 1 && (statName == "spa" || statName == "spd") then
                                updateStat "spa" clampedValue ivs
                                    |> updateStat "spd" clampedValue

                            else
                                updateStat statName clampedValue ivs
                    in
                    { m | defender = { defender | ivs = newIvs } }
                )
                model

        SetAttackerTeraType teraType ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker
                    in
                    { m | attacker = { attacker | teraType = teraType } }
                )
                model

        SetDefenderTeraType teraType ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender
                    in
                    { m | defender = { defender | teraType = teraType } }
                )
                model

        SetAttackerBoost statName value ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        boosts =
                            attacker.boosts

                        clampedValue =
                            clamp -6 6 value

                        newBoosts =
                            updateStat statName clampedValue boosts
                    in
                    { m | attacker = { attacker | boosts = newBoosts } }
                )
                model

        SetDefenderBoost statName value ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        boosts =
                            defender.boosts

                        clampedValue =
                            clamp -6 6 value

                        newBoosts =
                            updateStat statName clampedValue boosts
                    in
                    { m | defender = { defender | boosts = newBoosts } }
                )
                model

        SetAttackerCurHP hp ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        clampedHP =
                            clamp 0 100 hp
                    in
                    { m | attacker = { attacker | curHP = clampedHP } }
                )
                model

        SetDefenderCurHP hp ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        clampedHP =
                            clamp 0 100 hp
                    in
                    { m | defender = { defender | curHP = clampedHP } }
                )
                model

        SetAttackerMoveCrit index isCrit ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        moves =
                            List.indexedMap
                                (\i mv ->
                                    if i == index then
                                        { mv | isCrit = isCrit }

                                    else
                                        mv
                                )
                                attacker.moves
                    in
                    { m | attacker = { attacker | moves = moves } }
                )
                model

        SetAttackerMoveHits index hits ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker

                        clampedHits =
                            clamp 1 10 hits

                        moves =
                            List.indexedMap
                                (\i mv ->
                                    if i == index then
                                        { mv | hits = clampedHits }

                                    else
                                        mv
                                )
                                attacker.moves
                    in
                    { m | attacker = { attacker | moves = moves } }
                )
                model

        SetDefenderMoveCrit index isCrit ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        moves =
                            List.indexedMap
                                (\i mv ->
                                    if i == index then
                                        { mv | isCrit = isCrit }

                                    else
                                        mv
                                )
                                defender.moves
                    in
                    { m | defender = { defender | moves = moves } }
                )
                model

        SetDefenderMoveHits index hits ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender

                        clampedHits =
                            clamp 1 10 hits

                        moves =
                            List.indexedMap
                                (\i mv ->
                                    if i == index then
                                        { mv | hits = clampedHits }

                                    else
                                        mv
                                )
                                defender.moves
                    in
                    { m | defender = { defender | moves = moves } }
                )
                model

        -- Attacker side condition handlers
        SetAttackerSideReflect val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        attackerSide =
                            field.attackerSide
                    in
                    { m | field = { field | attackerSide = { attackerSide | isReflect = val } } }
                )
                model

        SetAttackerSideLightScreen val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        attackerSide =
                            field.attackerSide
                    in
                    { m | field = { field | attackerSide = { attackerSide | isLightScreen = val } } }
                )
                model

        SetAttackerSideAuroraVeil val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        attackerSide =
                            field.attackerSide
                    in
                    { m | field = { field | attackerSide = { attackerSide | isAuroraVeil = val } } }
                )
                model

        SetAttackerSideTailwind val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        attackerSide =
                            field.attackerSide
                    in
                    { m | field = { field | attackerSide = { attackerSide | isTailwind = val } } }
                )
                model

        SetAttackerSideHelpingHand val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        attackerSide =
                            field.attackerSide
                    in
                    { m | field = { field | attackerSide = { attackerSide | isHelpingHand = val } } }
                )
                model

        SetAttackerSideSpikes val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        attackerSide =
                            field.attackerSide

                        clampedVal =
                            clamp 0 3 val
                    in
                    { m | field = { field | attackerSide = { attackerSide | spikes = clampedVal } } }
                )
                model

        SetAttackerSideStealthRock val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        attackerSide =
                            field.attackerSide
                    in
                    { m | field = { field | attackerSide = { attackerSide | isSteathRock = val } } }
                )
                model

        -- Defender side condition handlers
        SetDefenderSideReflect val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        defenderSide =
                            field.defenderSide
                    in
                    { m | field = { field | defenderSide = { defenderSide | isReflect = val } } }
                )
                model

        SetDefenderSideLightScreen val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        defenderSide =
                            field.defenderSide
                    in
                    { m | field = { field | defenderSide = { defenderSide | isLightScreen = val } } }
                )
                model

        SetDefenderSideAuroraVeil val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        defenderSide =
                            field.defenderSide
                    in
                    { m | field = { field | defenderSide = { defenderSide | isAuroraVeil = val } } }
                )
                model

        SetDefenderSideTailwind val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        defenderSide =
                            field.defenderSide
                    in
                    { m | field = { field | defenderSide = { defenderSide | isTailwind = val } } }
                )
                model

        SetDefenderSideHelpingHand val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        defenderSide =
                            field.defenderSide
                    in
                    { m | field = { field | defenderSide = { defenderSide | isHelpingHand = val } } }
                )
                model

        SetDefenderSideSpikes val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        defenderSide =
                            field.defenderSide

                        clampedVal =
                            clamp 0 3 val
                    in
                    { m | field = { field | defenderSide = { defenderSide | spikes = clampedVal } } }
                )
                model

        SetDefenderSideStealthRock val ->
            updateAndCalculate
                (\m ->
                    let
                        field =
                            m.field

                        defenderSide =
                            field.defenderSide
                    in
                    { m | field = { field | defenderSide = { defenderSide | isSteathRock = val } } }
                )
                model

        SetAttackerDynamax val ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker
                    in
                    { m | attacker = { attacker | isDynamaxed = val } }
                )
                model

        SetDefenderDynamax val ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender
                    in
                    { m | defender = { defender | isDynamaxed = val } }
                )
                model

        SelectMove source index ->
            ( { model | selectedMoveSource = source, selectedMoveIndex = clamp 0 3 index }, Cmd.none )

        LoadedSettings value ->
            case Decode.decodeValue settingsDecoder value of
                Ok settings ->
                    let
                        game =
                            settings.currentGame

                        gen =
                            gameToGeneration game

                        -- Get current game's saved data
                        maybeGameData =
                            Dict.get game settings.gameData

                        -- Load from game data or use defaults
                        loadedTeam =
                            maybeGameData |> Maybe.map .team |> Maybe.withDefault []

                        loadedBox =
                            maybeGameData |> Maybe.map .box |> Maybe.withDefault []

                        loadedAttackerSource =
                            maybeGameData |> Maybe.andThen .attackerSource

                        loadedAttacker =
                            maybeGameData |> Maybe.andThen .attacker |> Maybe.withDefault model.attacker

                        loadedDefender =
                            maybeGameData |> Maybe.andThen .defender |> Maybe.withDefault model.defender

                        loadedTrainerIndex =
                            maybeGameData |> Maybe.map .selectedTrainerIndex |> Maybe.withDefault 0

                        loadedLevelCap =
                            maybeGameData |> Maybe.andThen .levelCap
                    in
                    ( { model
                        | generation = gen
                        , selectedGame = game
                        , loading = True
                        , team = loadedTeam
                        , box = loadedBox
                        , attackerSource = loadedAttackerSource
                        , attacker = loadedAttacker
                        , defender = loadedDefender
                        , selectedTrainerIndex = loadedTrainerIndex
                        , levelCap = loadedLevelCap
                        , settingsLoaded = True
                        , allGameData = settings.gameData
                      }
                    , Cmd.batch
                        [ requestPokemonList gen
                        , requestMoveList gen
                        , requestItemList gen
                        , requestAbilityList gen
                        , requestTrainerData game
                        , if not (String.isEmpty loadedAttacker.species) then
                            requestLearnset { species = loadedAttacker.species, generation = gen, isAttacker = True }

                          else
                            Cmd.none
                        , if not (String.isEmpty loadedDefender.species) then
                            requestLearnset { species = loadedDefender.species, generation = gen, isAttacker = False }

                          else
                            Cmd.none
                        ]
                    )

                Err err ->
                    ( model, logError ("LoadedSettings: " ++ Decode.errorToString err) )

        ReceivedAvailableGames value ->
            case Decode.decodeValue availableGamesDecoder value of
                Ok games ->
                    ( { model | availableGames = games }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedAvailableGames: " ++ Decode.errorToString err) )

        ReceivedTrainerData value ->
            case Decode.decodeValue trainerDataDecoder value of
                Ok encounters ->
                    let
                        filtered =
                            filterEncounters model.trainerSearchQuery encounters

                        -- Calculate default level cap from first gym leader's ace
                        defaultLevelCap =
                            if model.settingsLoaded then
                                model.levelCap

                            else
                                -- Find first gym leader (usually around index 2-5 in most games)
                                encounters
                                    |> List.filter (\e -> String.contains "Leader" e.trainerClass || String.contains "Gym" e.trainerClass)
                                    |> List.head
                                    |> Maybe.andThen (\gymLeader -> List.maximum (List.map .level gymLeader.team))

                        -- Only set defaults if we haven't loaded settings
                        ( newAttacker, newDefender, newTrainerIndex ) =
                            if model.settingsLoaded then
                                -- Keep the loaded values
                                ( model.attacker, model.defender, model.selectedTrainerIndex )

                            else
                                -- Set defaults based on first trainer
                                case List.head encounters of
                                    Just firstEncounter ->
                                        case List.head firstEncounter.team of
                                            Just rivalPokemon ->
                                                let
                                                    -- Get player's starter based on rival's Pokemon
                                                    playerStarter =
                                                        getPlayerStarterFromRival model.generation rivalPokemon.species

                                                    -- Create attacker state for player's starter
                                                    attacker =
                                                        createStarterPokemonState model.generation playerStarter

                                                    -- Create defender state from rival's Pokemon
                                                    defender =
                                                        trainerPokemonToState rivalPokemon
                                                in
                                                ( attacker, defender, 0 )

                                            Nothing ->
                                                ( model.attacker, model.defender, 0 )

                                    Nothing ->
                                        ( model.attacker, model.defender, 0 )

                        newModel =
                            { model
                                | trainerEncounters = encounters
                                , filteredEncounters = filtered
                                , selectedTrainerIndex = newTrainerIndex
                                , attacker = newAttacker
                                , defender = newDefender
                                , levelCap = defaultLevelCap
                            }

                        -- Check if species exists in Pokemon list
                        isValidSpecies speciesName =
                            List.any (\p -> p.name == speciesName) newModel.pokemonList
                    in
                    -- Trigger calculation with new Pokemon (only if Pokemon list is loaded)
                    if
                        not (String.isEmpty newAttacker.species)
                            && not (String.isEmpty newDefender.species)
                            && isValidSpecies newAttacker.species
                            && isValidSpecies newDefender.species
                    then
                        ( newModel, requestCalculation (encodeCalculationRequest newModel) )

                    else
                        ( newModel, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedTrainerData: " ++ Decode.errorToString err) )

        SetSelectedGame game ->
            let
                -- Map game to generation
                newGen =
                    gameToGeneration game

                -- Update generation and reload data if generation changed
                genChanged =
                    newGen /= model.generation

                -- Save current game's data before switching
                currentGameData =
                    { team = model.team
                    , box = model.box
                    , attackerSource = model.attackerSource
                    , attacker = Just model.attacker
                    , defender = Just model.defender
                    , selectedTrainerIndex = model.selectedTrainerIndex
                    , levelCap = model.levelCap
                    }

                updatedAllGameData =
                    if String.isEmpty model.selectedGame then
                        model.allGameData

                    else
                        Dict.insert model.selectedGame currentGameData model.allGameData

                -- Load new game's saved data (or use defaults)
                maybeNewGameData =
                    Dict.get game updatedAllGameData

                newTeam =
                    maybeNewGameData |> Maybe.map .team |> Maybe.withDefault []

                newBox =
                    maybeNewGameData |> Maybe.map .box |> Maybe.withDefault []

                newAttackerSource =
                    maybeNewGameData |> Maybe.andThen .attackerSource

                -- Check if we have actual saved attacker/defender data
                hasSavedAttacker =
                    maybeNewGameData |> Maybe.andThen .attacker |> (/=) Nothing

                hasSavedDefender =
                    maybeNewGameData |> Maybe.andThen .defender |> (/=) Nothing

                -- Use saved attacker/defender if they exist, otherwise use defaults
                -- (GotTrainerData will calculate proper starters if settingsLoaded is False)
                newAttacker =
                    maybeNewGameData |> Maybe.andThen .attacker |> Maybe.withDefault defaultAttacker

                newDefender =
                    maybeNewGameData |> Maybe.andThen .defender |> Maybe.withDefault defaultDefender

                newTrainerIndex =
                    maybeNewGameData |> Maybe.map .selectedTrainerIndex |> Maybe.withDefault 0

                newLevelCap =
                    maybeNewGameData |> Maybe.andThen .levelCap

                -- Only set settingsLoaded if we have ACTUAL saved attacker/defender
                -- Otherwise GotTrainerData will calculate proper starters
                hasActualSavedData =
                    hasSavedAttacker && hasSavedDefender

                newModel =
                    { model
                        | selectedGame = game
                        , trainerEncounters = []
                        , filteredEncounters = []
                        , selectedTrainerIndex = newTrainerIndex
                        , trainerSearchQuery = ""
                        , generation = newGen
                        , loading = genChanged
                        , settingsLoaded = hasActualSavedData
                        , team = newTeam
                        , box = newBox
                        , attackerSource = newAttackerSource
                        , attacker = newAttacker
                        , defender = newDefender
                        , levelCap = newLevelCap
                        , allGameData = updatedAllGameData
                    }
            in
            ( newModel
            , if String.isEmpty game then
                Cmd.none

              else
                Cmd.batch
                    ([ requestTrainerData game
                     , saveToLocalStorage (encodeSettings newModel)
                     ]
                        ++ (if genChanged then
                                [ requestPokemonList newGen
                                , requestMoveList newGen
                                , requestItemList newGen
                                , requestAbilityList newGen
                                ]

                            else
                                []
                           )
                    )
            )

        SetTrainerSearchQuery query ->
            let
                filtered =
                    filterEncounters query model.trainerEncounters
            in
            ( { model
                | trainerSearchQuery = query
                , filteredEncounters = filtered
              }
            , Cmd.none
            )

        SelectTrainer index ->
            let
                newModel =
                    { model | selectedTrainerIndex = clamp 0 (List.length model.trainerEncounters - 1) index }
            in
            ( newModel, saveToLocalStorage (encodeSettings newModel) )

        SelectFromSearchResults encounter ->
            case findEncounterIndex encounter model.trainerEncounters of
                Just index ->
                    let
                        -- Same as Prev/Next: the trainer's lead becomes the defender
                        newDefender =
                            List.head encounter.team
                                |> Maybe.map trainerPokemonToState
                                |> Maybe.withDefault model.defender

                        newModel =
                            { model
                                | selectedTrainerIndex = index
                                , defender = newDefender
                                , trainerSearchQuery = ""
                                , filteredEncounters = model.trainerEncounters
                            }
                    in
                    updateAndCalculate (\m -> m) newModel
                        |> (\( m, cmd ) -> ( m, Cmd.batch [ cmd, saveToLocalStorage (encodeSettings m) ] ))

                Nothing ->
                    ( model, Cmd.none )

        CloseSearchDropdown ->
            ( { model
                | trainerSearchQuery = ""
                , filteredEncounters = model.trainerEncounters
              }
            , Cmd.none
            )

        NextTrainer ->
            let
                newIndex =
                    if model.selectedTrainerIndex < List.length model.trainerEncounters - 1 then
                        model.selectedTrainerIndex + 1

                    else
                        model.selectedTrainerIndex

                -- Get the new encounter and auto-select first Pokemon
                newEncounter =
                    model.trainerEncounters
                        |> List.drop newIndex
                        |> List.head

                newDefender =
                    case newEncounter of
                        Just encounter ->
                            case List.head encounter.team of
                                Just trainerPokemon ->
                                    trainerPokemonToState trainerPokemon

                                Nothing ->
                                    model.defender

                        Nothing ->
                            model.defender

                newModel =
                    { model | selectedTrainerIndex = newIndex, defender = newDefender }
            in
            updateAndCalculate (\m -> m) newModel
                |> (\( m, cmd ) -> ( m, Cmd.batch [ cmd, saveToLocalStorage (encodeSettings m) ] ))

        PrevTrainer ->
            let
                newIndex =
                    if model.selectedTrainerIndex > 0 then
                        model.selectedTrainerIndex - 1

                    else
                        0

                -- Get the new encounter and auto-select first Pokemon
                newEncounter =
                    model.trainerEncounters
                        |> List.drop newIndex
                        |> List.head

                newDefender =
                    case newEncounter of
                        Just encounter ->
                            case List.head encounter.team of
                                Just trainerPokemon ->
                                    trainerPokemonToState trainerPokemon

                                Nothing ->
                                    model.defender

                        Nothing ->
                            model.defender

                newModel =
                    { model | selectedTrainerIndex = newIndex, defender = newDefender }
            in
            updateAndCalculate (\m -> m) newModel
                |> (\( m, cmd ) -> ( m, Cmd.batch [ cmd, saveToLocalStorage (encodeSettings m) ] ))

        LoadTrainerToDefender pokemonIndex ->
            case getSelectedEncounter model of
                Just encounter ->
                    case List.head (List.drop pokemonIndex encounter.team) of
                        Just trainerPokemon ->
                            let
                                newDefender =
                                    trainerPokemonToState trainerPokemon
                            in
                            updateAndCalculate
                                (\m -> { m | defender = newDefender })
                                model

                        Nothing ->
                            ( model, Cmd.none )

                Nothing ->
                    ( model, Cmd.none )

        -- Team/Box management handlers (attacker only)
        AddToBox ->
            -- Only add if species name is valid (not partial/empty)
            let
                isValidSpecies =
                    List.any (\p -> p.name == model.attacker.species) model.pokemonList
            in
            if isValidSpecies then
                let
                    newBox =
                        model.box ++ [ model.attacker ]

                    newIndex =
                        List.length model.box

                    newModel =
                        { model | box = newBox, attackerSource = Just (FromBox newIndex) }
                in
                ( newModel, saveToLocalStorage (encodeSettings newModel) )

            else
                ( model, Cmd.none )

        LoadFromBox index ->
            case List.head (List.drop index model.box) of
                Just pokemon ->
                    let
                        newModel =
                            { model | attacker = pokemon, attackerSource = Just (FromBox index) }

                        ( updatedModel, calcCmd ) =
                            updateAndCalculate (\m -> m) newModel

                        learnsetCmd =
                            if not (String.isEmpty pokemon.species) then
                                requestLearnset { species = pokemon.species, generation = model.generation, isAttacker = True }

                            else
                                Cmd.none
                    in
                    ( updatedModel, Cmd.batch [ calcCmd, learnsetCmd ] )

                Nothing ->
                    ( model, Cmd.none )

        RemoveFromBox index ->
            let
                newBox =
                    List.take index model.box ++ List.drop (index + 1) model.box

                -- Update source if we're removing the current source or shifting indices
                newSource =
                    case model.attackerSource of
                        Just (FromBox sourceIndex) ->
                            if sourceIndex == index then
                                Nothing

                            else if sourceIndex > index then
                                Just (FromBox (sourceIndex - 1))

                            else
                                model.attackerSource

                        _ ->
                            model.attackerSource

                newModel =
                    { model | box = newBox, attackerSource = newSource }
            in
            ( newModel, saveToLocalStorage (encodeSettings newModel) )

        AddToTeam ->
            -- Only add if species name is valid (not partial/empty) and team not full
            let
                isValidSpecies =
                    List.any (\p -> p.name == model.attacker.species) model.pokemonList
            in
            if List.length model.team >= 6 then
                ( model, Cmd.none )

            else if isValidSpecies then
                let
                    newTeam =
                        model.team ++ [ model.attacker ]

                    newIndex =
                        List.length model.team

                    newModel =
                        { model | team = newTeam, attackerSource = Just (FromTeam newIndex) }
                in
                ( newModel, saveToLocalStorage (encodeSettings newModel) )

            else
                ( model, Cmd.none )

        LoadFromTeam index ->
            case List.head (List.drop index model.team) of
                Just pokemon ->
                    let
                        newModel =
                            { model | attacker = pokemon, attackerSource = Just (FromTeam index) }

                        ( updatedModel, calcCmd ) =
                            updateAndCalculate (\m -> m) newModel

                        learnsetCmd =
                            if not (String.isEmpty pokemon.species) then
                                requestLearnset { species = pokemon.species, generation = model.generation, isAttacker = True }

                            else
                                Cmd.none
                    in
                    ( updatedModel, Cmd.batch [ calcCmd, learnsetCmd ] )

                Nothing ->
                    ( model, Cmd.none )

        RemoveFromTeam index ->
            let
                newTeam =
                    List.take index model.team ++ List.drop (index + 1) model.team

                -- Update source if we're removing the current source or shifting indices
                newSource =
                    case model.attackerSource of
                        Just (FromTeam sourceIndex) ->
                            if sourceIndex == index then
                                Nothing

                            else if sourceIndex > index then
                                Just (FromTeam (sourceIndex - 1))

                            else
                                model.attackerSource

                        _ ->
                            model.attackerSource

                newModel =
                    { model | team = newTeam, attackerSource = newSource }
            in
            ( newModel, saveToLocalStorage (encodeSettings newModel) )

        MoveToTeam boxIndex ->
            applyRoster (moveToEnd (FromBox boxIndex) True) model

        MoveToBox teamIndex ->
            applyRoster (moveToEnd (FromTeam teamIndex) False) model

        -- Evolution handlers
        EvolvePokemonInBox boxIndex targetSpecies ->
            case List.head (List.drop boxIndex model.box) of
                Just pokemon ->
                    let
                        evolvedPokemon =
                            evolvePokemon model.pokemonList targetSpecies pokemon

                        newBox =
                            List.take boxIndex model.box
                                ++ [ evolvedPokemon ]
                                ++ List.drop (boxIndex + 1) model.box

                        -- If this was the source of the current attacker, update attacker too
                        newAttacker =
                            case model.attackerSource of
                                Just (FromBox sourceIndex) ->
                                    if sourceIndex == boxIndex then
                                        evolvedPokemon

                                    else
                                        model.attacker

                                _ ->
                                    model.attacker

                        newModel =
                            { model | box = newBox, attacker = newAttacker }
                    in
                    -- Recalculate so an evolved active attacker shows its new damage right away
                    updateAndCalculate (\_ -> newModel) model

                Nothing ->
                    ( model, Cmd.none )

        EvolvePokemonInTeam teamIndex targetSpecies ->
            case List.head (List.drop teamIndex model.team) of
                Just pokemon ->
                    let
                        evolvedPokemon =
                            evolvePokemon model.pokemonList targetSpecies pokemon

                        newTeam =
                            List.take teamIndex model.team
                                ++ [ evolvedPokemon ]
                                ++ List.drop (teamIndex + 1) model.team

                        -- If this was the source of the current attacker, update attacker too
                        newAttacker =
                            case model.attackerSource of
                                Just (FromTeam sourceIndex) ->
                                    if sourceIndex == teamIndex then
                                        evolvedPokemon

                                    else
                                        model.attacker

                                _ ->
                                    model.attacker

                        newModel =
                            { model | team = newTeam, attacker = newAttacker }
                    in
                    -- Recalculate so an evolved active attacker shows its new damage right away
                    updateAndCalculate (\_ -> newModel) model

                Nothing ->
                    ( model, Cmd.none )

        SwitchAttackerForm targetSpecies ->
            updateAndCalculate
                (\m ->
                    let
                        attacker =
                            m.attacker
                    in
                    { m | attacker = { attacker | species = targetSpecies } }
                )
                model

        SwitchDefenderForm targetSpecies ->
            updateAndCalculate
                (\m ->
                    let
                        defender =
                            m.defender
                    in
                    { m | defender = { defender | species = targetSpecies } }
                )
                model

        SwitchTeamPokemonForm teamIndex targetSpecies ->
            case List.head (List.drop teamIndex model.team) of
                Just pokemon ->
                    let
                        updatedPokemon =
                            { pokemon | species = targetSpecies }

                        newTeam =
                            List.take teamIndex model.team
                                ++ [ updatedPokemon ]
                                ++ List.drop (teamIndex + 1) model.team

                        -- If this was the source of the current attacker, update attacker too
                        newAttacker =
                            case model.attackerSource of
                                Just (FromTeam sourceIndex) ->
                                    if sourceIndex == teamIndex then
                                        updatedPokemon

                                    else
                                        model.attacker

                                _ ->
                                    model.attacker

                        newModel =
                            { model | team = newTeam, attacker = newAttacker }
                    in
                    ( newModel, saveToLocalStorage (encodeSettings newModel) )

                Nothing ->
                    ( model, Cmd.none )

        SwitchBoxPokemonForm boxIndex targetSpecies ->
            case List.head (List.drop boxIndex model.box) of
                Just pokemon ->
                    let
                        updatedPokemon =
                            { pokemon | species = targetSpecies }

                        newBox =
                            List.take boxIndex model.box
                                ++ [ updatedPokemon ]
                                ++ List.drop (boxIndex + 1) model.box

                        -- If this was the source of the current attacker, update attacker too
                        newAttacker =
                            case model.attackerSource of
                                Just (FromBox sourceIndex) ->
                                    if sourceIndex == boxIndex then
                                        updatedPokemon

                                    else
                                        model.attacker

                                _ ->
                                    model.attacker

                        newModel =
                            { model | box = newBox, attacker = newAttacker }
                    in
                    ( newModel, saveToLocalStorage (encodeSettings newModel) )

                Nothing ->
                    ( model, Cmd.none )

        -- Drag and drop handlers
        DragStart source ->
            ( { model | dragState = Just source, dragOverTarget = Nothing }, Cmd.none )

        DragEnd ->
            ( { model | dragState = Nothing, dragOverTarget = Nothing }, Cmd.none )

        DragOverTarget target ->
            if model.dragOverTarget == Just target then
                ( model, Cmd.none )

            else
                ( { model | dragOverTarget = Just target }, Cmd.none )

        DropOn target ->
            case model.dragState of
                Just source ->
                    applyRoster (dropPokemon source target)
                        { model | dragState = Nothing, dragOverTarget = Nothing }

                Nothing ->
                    ( { model | dragOverTarget = Nothing }, Cmd.none )

        ToggleFieldCollapsed ->
            ( { model | fieldCollapsed = not model.fieldCollapsed }, Cmd.none )

        ToggleBattleStateCollapsed ->
            ( { model | battleStateCollapsed = not model.battleStateCollapsed }, Cmd.none )

        ToggleAttackerBaseStatsCollapsed ->
            ( { model | attackerBaseStatsCollapsed = not model.attackerBaseStatsCollapsed }, Cmd.none )

        ToggleDefenderBaseStatsCollapsed ->
            ( { model | defenderBaseStatsCollapsed = not model.defenderBaseStatsCollapsed }, Cmd.none )

        ToggleBoxCollapsed ->
            ( { model | boxCollapsed = not model.boxCollapsed }, Cmd.none )

        ToggleDefenderEditMode ->
            ( { model | defenderEditMode = not model.defenderEditMode }, Cmd.none )

        ToggleDropdown dropdownId ->
            let
                ( newOpenDropdown, newHighlightIndex ) =
                    if model.openDropdown == Just dropdownId then
                        ( Nothing, 0 )

                    else
                        ( Just dropdownId, 0 )
            in
            ( { model | openDropdown = newOpenDropdown, dropdownHighlightIndex = newHighlightIndex }, Cmd.none )

        OpenDropdown dropdownId ->
            ( { model | openDropdown = Just dropdownId, dropdownHighlightIndex = 0 }, Cmd.none )

        CloseDropdown ->
            ( { model | openDropdown = Nothing }, Cmd.none )

        CloseAllDropdowns ->
            ( { model
                | openDropdown = Nothing
                , dropdownHighlightIndex = 0
              }
            , Cmd.none
            )

        RequestResetGameData ->
            ( { model | showResetConfirmDialog = True }, Cmd.none )

        CancelResetGameData ->
            ( { model | showResetConfirmDialog = False }, Cmd.none )

        ConfirmResetGameData ->
            let
                -- Calculate proper starters from first trainer encounter
                ( newAttacker, newDefender ) =
                    case List.head model.trainerEncounters of
                        Just firstEncounter ->
                            case List.head firstEncounter.team of
                                Just rivalPokemon ->
                                    let
                                        playerStarter =
                                            getPlayerStarterFromRival model.generation rivalPokemon.species

                                        attacker =
                                            createStarterPokemonState model.generation playerStarter

                                        defender =
                                            trainerPokemonToState rivalPokemon
                                    in
                                    ( attacker, defender )

                                Nothing ->
                                    ( defaultAttacker, defaultDefender )

                        Nothing ->
                            ( defaultAttacker, defaultDefender )

                -- Reset to default empty state for current game
                emptyGameData =
                    { team = []
                    , box = []
                    , attackerSource = Nothing
                    , attacker = Nothing
                    , defender = Nothing
                    , selectedTrainerIndex = 0
                    , levelCap = Nothing
                    }

                -- Update the game data dict with empty data for current game
                updatedAllGameData =
                    Dict.insert model.selectedGame emptyGameData model.allGameData

                -- Reset model to defaults with proper starters
                resetModel =
                    { model
                        | team = []
                        , box = []
                        , attackerSource = Nothing
                        , attacker = newAttacker
                        , defender = newDefender
                        , selectedTrainerIndex = 0
                        , allGameData = updatedAllGameData
                        , showResetConfirmDialog = False
                        , settingsLoaded = False
                    }
            in
            ( resetModel
            , Cmd.batch
                [ saveToLocalStorage (encodeSettings resetModel)
                , requestCalculation (encodeCalculationRequest resetModel)
                ]
            )

        SetLevelCap maybeCap ->
            ( { model | levelCap = maybeCap }, Cmd.none )

        ApplyLevelCapToAll ->
            case model.levelCap of
                Nothing ->
                    ( model, Cmd.none )

                Just cap ->
                    let
                        -- Set level for all team Pokemon
                        updatedTeam =
                            List.map (\p -> { p | level = cap }) model.team

                        -- Set level for all box Pokemon
                        updatedBox =
                            List.map (\p -> { p | level = cap }) model.box

                        -- Also update attacker if loaded from team/box
                        updatedAttacker =
                            case model.attackerSource of
                                Just _ ->
                                    let
                                        currentAttacker =
                                            model.attacker
                                    in
                                    { currentAttacker | level = cap }

                                Nothing ->
                                    model.attacker
                    in
                    updateAndCalculate
                        (\m ->
                            { m
                                | team = updatedTeam
                                , box = updatedBox
                                , attacker = updatedAttacker
                            }
                        )
                        model

        ToggleColorCode ->
            -- Turning it on requests matchups (see updateWithMatchups); turning it off clears the colors
            if model.colorCodeEnabled then
                ( { model
                    | colorCodeEnabled = False
                    , boxMatchupResults = Dict.empty
                    , teamMatchupResults = Dict.empty
                    , boxSort =
                        if model.boxSort == SortMatchup then
                            SortBoxOrder

                        else
                            model.boxSort
                  }
                , Cmd.none
                )

            else
                ( { model | colorCodeEnabled = True }, Cmd.none )

        SetBoxSort sort ->
            -- Sorting by matchup needs matchup results, so it turns Color Code on
            ( { model
                | boxSort = sort
                , colorCodeEnabled = model.colorCodeEnabled || sort == SortMatchup
              }
            , Cmd.none
            )

        SetBoxView boxView ->
            ( { model | boxView = boxView }, Cmd.none )

        SelectPairing source opponentIndex ->
            let
                ( withDefender, defenderCmd ) =
                    update (LoadTrainerToDefender opponentIndex) model

                loadMsg =
                    case source of
                        FromTeam i ->
                            LoadFromTeam i

                        FromBox i ->
                            LoadFromBox i

                ( withAttacker, attackerCmd ) =
                    update loadMsg withDefender
            in
            ( withAttacker, Cmd.batch [ defenderCmd, attackerCmd ] )

        ReceivedBoxMatchupResult value ->
            case Decode.decodeValue boxMatchupResultDecoder value of
                Ok result ->
                    case result.defenderIndex of
                        Just j ->
                            ( { model | boardResults = Dict.insert ( result.boxIndex, j ) result model.boardResults }, Cmd.none )

                        Nothing ->
                            ( { model | boxMatchupResults = Dict.insert result.boxIndex result model.boxMatchupResults }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedBoxMatchupResult: " ++ Decode.errorToString err) )

        ReceivedTeamMatchupResult value ->
            case Decode.decodeValue boxMatchupResultDecoder value of
                Ok result ->
                    case result.defenderIndex of
                        Just j ->
                            ( { model | teamBoardResults = Dict.insert ( result.boxIndex, j ) result model.teamBoardResults }, Cmd.none )

                        Nothing ->
                            ( { model | teamMatchupResults = Dict.insert result.boxIndex result model.teamMatchupResults }, Cmd.none )

                Err err ->
                    ( model, logError ("ReceivedTeamMatchupResult: " ++ Decode.errorToString err) )

        ShowColorCodeHelp ->
            ( { model | showColorCodeHelp = True }, Cmd.none )

        HideColorCodeHelp ->
            ( { model | showColorCodeHelp = False }, Cmd.none )

        KeyPressed key ->
            case key of
                "Escape" ->
                    -- Close any open dropdown
                    ( { model
                        | openDropdown = Nothing
                        , dropdownHighlightIndex = 0
                      }
                    , Cmd.none
                    )

                "ArrowDown" ->
                    -- Move highlight down in dropdown
                    ( { model | dropdownHighlightIndex = model.dropdownHighlightIndex + 1 }, Cmd.none )

                "ArrowUp" ->
                    -- Move highlight up in dropdown
                    ( { model | dropdownHighlightIndex = Basics.max 0 (model.dropdownHighlightIndex - 1) }, Cmd.none )

                "Enter" ->
                    -- Select highlighted item from dropdown
                    case getEnterKeyMessage model of
                        Just selectMsg ->
                            update selectMsg model

                        Nothing ->
                            ( model, Cmd.none )

                "Tab" ->
                    -- Tab selects highlighted item (like Enter) for muscle memory
                    case getEnterKeyMessage model of
                        Just selectMsg ->
                            update selectMsg model

                        Nothing ->
                            ( model, Cmd.none )

                _ ->
                    ( model, Cmd.none )



-- Determine player's starter based on rival's Pokemon
-- Gen 1-2: Rival picks type advantage (Charmander beats Bulbasaur)
-- Gen 3+: Rival picks type weakness (but we still work backwards from their Pokemon)
-- Create a starter Pokemon state for level 5 with appropriate stats


createStarterPokemonState : Int -> String -> PokemonState
createStarterPokemonState generation species =
    let
        -- For Gen 1-2, DVs are 0-15 and spa must equal spd
        -- We use 8 as a reasonable default (converts to ~16 IV)
        defaultDv =
            8

        -- For Gen 3+, use moderate IVs
        defaultIv =
            15

        ivs =
            if generation <= 2 then
                { hp = defaultDv * 2
                , atk = defaultDv * 2
                , def = defaultDv * 2
                , spa = defaultDv * 2
                , spd = defaultDv * 2 -- Must match spa for Gen 1-2
                , spe = defaultDv * 2
                }

            else
                { hp = defaultIv
                , atk = defaultIv
                , def = defaultIv
                , spa = defaultIv
                , spd = defaultIv
                , spe = defaultIv
                }

        -- Get basic starting moves for the starter
        moves =
            getStarterMoves species
    in
    { species = species
    , level = 5
    , nature = "Hardy"
    , ability = ""
    , item = ""
    , evs = { hp = 0, atk = 0, def = 0, spa = 0, spd = 0, spe = 0 }
    , ivs = ivs
    , boosts = defaultStats
    , status = ""
    , curHP = 100
    , teraType = ""
    , isDynamaxed = False
    , moves = moves
    }


getSelectedEncounter : Model -> Maybe TrainerEncounter
getSelectedEncounter model =
    model.trainerEncounters
        |> List.drop model.selectedTrainerIndex
        |> List.head



-- Find the index of an encounter in the full trainer list
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ receiveCalculation ReceivedCalculation
        , receivePokemonList ReceivedPokemonList
        , receiveMoveList ReceivedMoveList
        , receiveItemList ReceivedItemList
        , receiveAbilityList ReceivedAbilityList
        , receiveNatureList ReceivedNatureList
        , receiveLearnset ReceivedLearnset
        , loadFromLocalStorage LoadedSettings
        , receiveAvailableGames ReceivedAvailableGames
        , receiveTrainerData ReceivedTrainerData
        , receiveBoxMatchup ReceivedBoxMatchupResult
        , receiveTeamMatchup ReceivedTeamMatchupResult

        -- Keyboard events (only subscribe when a dropdown is open)
        , if model.openDropdown /= Nothing then
            Browser.Events.onKeyDown (Decode.map KeyPressed keyDecoder)

          else
            Sub.none
        ]


keyDecoder : Decoder String
keyDecoder =
    Decode.field "key" Decode.string



-- VIEW


view : Model -> Html Msg
view model =
    div [ class "mx-auto w-full max-w-[1600px] p-3 flex flex-col gap-3 lg:h-screen lg:overflow-hidden" ]
        [ -- Backdrop for click-outside to close dropdowns
          if model.openDropdown /= Nothing then
            div
                [ class "fixed inset-0 z-40"
                , onClick CloseAllDropdowns
                ]
                []

          else
            text ""

        -- Reset confirmation dialog
        , if model.showResetConfirmDialog then
            div
                [ class "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                , onClick CancelResetGameData
                ]
                [ div
                    [ class "bg-base-200 p-6 rounded-lg shadow-xl max-w-md"
                    , Html.Events.stopPropagationOn "click" (Decode.succeed ( CancelResetGameData, True ))
                    ]
                    [ h3 [ class "text-lg font-bold mb-4" ] [ text "⚠️ Reset Game Data?" ]
                    , p [ class "mb-4 text-sm" ]
                        [ text "This will permanently delete all data for "
                        , span [ class "font-semibold" ] [ text model.selectedGame ]
                        , text ", including:"
                        ]
                    , ul [ class "list-disc list-inside mb-4 text-sm space-y-1" ]
                        [ li [] [ text "All Pokemon in your team" ]
                        , li [] [ text "All Pokemon in your box" ]
                        , li [] [ text "Current trainer progress" ]
                        , li [] [ text "Current attacker and defender" ]
                        ]
                    , p [ class "mb-4 text-sm font-semibold text-error" ]
                        [ text "This action cannot be undone!" ]
                    , div [ class "flex gap-2 justify-end" ]
                        [ button
                            [ onClick CancelResetGameData
                            , class "btn btn-sm btn-ghost"
                            ]
                            [ text "Cancel" ]
                        , button
                            [ onClick ConfirmResetGameData
                            , class "btn btn-sm btn-error"
                            ]
                            [ text "Yes, Reset Game Data" ]
                        ]
                    ]
                ]

          else
            text ""

        -- Color code help modal
        , if model.showColorCodeHelp then
            div
                [ class "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                , onClick HideColorCodeHelp
                ]
                [ div
                    [ class "bg-base-200 p-6 rounded-lg shadow-xl max-w-md"
                    , Html.Events.stopPropagationOn "click" (Decode.succeed ( HideColorCodeHelp, True ))
                    ]
                    [ h3 [ class "text-lg font-bold mb-4" ] [ text "Color Coding Guide" ]
                    , div [ class "space-y-2 text-sm" ]
                        [ div [ class "flex items-center gap-2" ]
                            [ span [ class "w-4 h-4 bg-teal-400 rounded" ] []
                            , text "Teal - Both can OHKO each other"
                            ]
                        , div [ class "flex items-center gap-2" ]
                            [ span [ class "w-4 h-4 bg-orange-500 rounded" ] []
                            , text "Orange - Both might OHKO each other"
                            ]
                        , div [ class "flex items-center gap-2" ]
                            [ span [ class "w-4 h-4 bg-red-500 rounded" ] []
                            , text "Red - Gets OHKO'd by defender"
                            ]
                        , div [ class "flex items-center gap-2" ]
                            [ span [ class "w-4 h-4 bg-yellow-400 rounded" ] []
                            , text "Yellow - Can OHKO defender"
                            ]
                        , div [ class "flex items-center gap-2" ]
                            [ span [ class "w-4 h-4 bg-yellow-600 rounded" ] []
                            , text "Dark Yellow - Might OHKO defender"
                            ]
                        ]
                    , div [ class "flex justify-end mt-4" ]
                        [ button
                            [ onClick HideColorCodeHelp
                            , class "btn btn-sm btn-primary"
                            ]
                            [ text "Got it!" ]
                        ]
                    ]
                ]

          else
            text ""
        , viewHeader model
        , viewMain model
        ]



-- Helper for collapsible sections


viewCollapsibleSection : String -> Bool -> Msg -> Html Msg -> Html Msg
viewCollapsibleSection title isCollapsed toggleMsg content =
    div [ class "card bg-base-200 p-3" ]
        [ button
            [ onClick toggleMsg
            , class "flex items-center justify-between w-full text-left"
            ]
            [ h3 [ class "text-sm font-semibold text-primary" ] [ text title ]
            , span [ class "text-base-content/60" ]
                [ text
                    (if isCollapsed then
                        "▼"

                     else
                        "▲"
                    )
                ]
            ]
        , if isCollapsed then
            text ""

          else
            div [ class "mt-3 pt-3 border-t border-base-300" ] [ content ]
        ]



-- Helper function to get background gradient based on weather and terrain


getWeatherTerrainGradient : String -> String -> String
getWeatherTerrainGradient weather terrain =
    let
        weatherColor =
            case weather of
                "Sun" ->
                    "rgba(255, 165, 0, 0.15)"

                -- Orange for sun
                "Rain" ->
                    "rgba(100, 149, 237, 0.15)"

                -- Blue for rain
                "Sand" ->
                    "rgba(210, 180, 140, 0.15)"

                -- Tan for sand
                "Snow" ->
                    "rgba(173, 216, 230, 0.15)"

                -- Light blue for snow
                _ ->
                    ""

        terrainColor =
            case terrain of
                "Electric" ->
                    "rgba(255, 215, 0, 0.15)"

                -- Yellow for electric
                "Grassy" ->
                    "rgba(34, 139, 34, 0.15)"

                -- Green for grassy
                "Psychic" ->
                    "rgba(219, 112, 147, 0.15)"

                -- Pink for psychic
                "Misty" ->
                    "rgba(255, 182, 193, 0.15)"

                -- Light pink for misty
                _ ->
                    ""
    in
    if not (String.isEmpty weather) && not (String.isEmpty terrain) then
        "linear-gradient(to bottom, " ++ weatherColor ++ ", " ++ terrainColor ++ ")"

    else if not (String.isEmpty weather) then
        "linear-gradient(to bottom, " ++ weatherColor ++ ", " ++ weatherColor ++ ")"

    else if not (String.isEmpty terrain) then
        "linear-gradient(to bottom, " ++ terrainColor ++ ", " ++ terrainColor ++ ")"

    else
        ""



-- Field conditions content (for collapsible) - Tags/Pills UI
-- Format, Weather, and Terrain have been moved to the damage results panel


viewFieldConditionsContent : Model -> Html Msg
viewFieldConditionsContent model =
    div [ class "flex flex-col gap-3" ]
        [ -- Three columns layout: Attacker | Both | Defender
          div [ class "flex gap-2" ]
            [ -- Attacker column
              div [ class "flex-1 flex flex-col gap-2" ]
                [ -- Attacker pills
                  div [ class "flex flex-wrap gap-1 min-h-[2rem]" ]
                    (viewAttackerConditionPills model)

                -- Attacker dropdown
                , viewFieldConditionDropdown
                    "Attacker"
                    FieldConditionsAttackerDropdown
                    model.openDropdown
                    model.dropdownHighlightIndex
                    (getAttackerConditionOptions model)
                ]

            -- Both/Field column
            , div [ class "flex-1 flex flex-col gap-2" ]
                [ -- Both pills
                  div [ class "flex flex-wrap gap-1 min-h-[2rem]" ]
                    (viewBothConditionPills model)

                -- Both dropdown
                , viewFieldConditionDropdown
                    "Both"
                    FieldConditionsBothDropdown
                    model.openDropdown
                    model.dropdownHighlightIndex
                    (getBothConditionOptions model)
                ]

            -- Defender column
            , div [ class "flex-1 flex flex-col gap-2" ]
                [ -- Defender pills
                  div [ class "flex flex-wrap gap-1 min-h-[2rem]" ]
                    (viewDefenderConditionPills model)

                -- Defender dropdown
                , viewFieldConditionDropdown
                    "Defender"
                    FieldConditionsDefenderDropdown
                    model.openDropdown
                    model.dropdownHighlightIndex
                    (getDefenderConditionOptions model)
                ]
            ]
        ]



-- Helper to render a field condition dropdown button with menu


viewFieldConditionDropdown : String -> DropdownId -> Maybe DropdownId -> Int -> List ( String, Msg, Bool ) -> Html Msg
viewFieldConditionDropdown label dropdownId openDropdown highlightIndex options =
    div [ class "relative flex-1" ]
        [ button
            [ onClick (ToggleDropdown dropdownId)
            , class "btn btn-xs btn-outline btn-primary w-full"
            ]
            [ text ("+ " ++ label) ]

        -- Dropdown menu
        , if openDropdown == Just dropdownId then
            let
                clampedHighlight =
                    Basics.min highlightIndex (List.length options - 1)
                        |> Basics.max 0
            in
            div
                [ class "absolute top-full left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow-lg z-50 max-h-60 overflow-y-auto"
                ]
                (options
                    |> List.indexedMap
                        (\itemIndex ( optionLabel, msg, isActive ) ->
                            button
                                [ onClick msg
                                , class
                                    ("w-full text-left px-2 py-1 text-xs rounded "
                                        ++ (if isActive then
                                                "bg-success text-success-content"

                                            else if itemIndex == clampedHighlight then
                                                "bg-primary text-primary-content"

                                            else
                                                "hover:bg-base-300"
                                           )
                                    )
                                ]
                                [ text optionLabel ]
                        )
                )

          else
            text ""
        ]



-- Get attacker side condition options as (label, msg, isActive) tuples


getAttackerConditionOptions : Model -> List ( String, Msg, Bool )
getAttackerConditionOptions model =
    [ ( "Reflect", SetAttackerSideReflect (not model.field.attackerSide.isReflect), model.field.attackerSide.isReflect )
    , ( "Light Screen", SetAttackerSideLightScreen (not model.field.attackerSide.isLightScreen), model.field.attackerSide.isLightScreen )
    , ( "Aurora Veil", SetAttackerSideAuroraVeil (not model.field.attackerSide.isAuroraVeil), model.field.attackerSide.isAuroraVeil )
    , ( "Tailwind", SetAttackerSideTailwind (not model.field.attackerSide.isTailwind), model.field.attackerSide.isTailwind )
    , ( "Helping Hand", SetAttackerSideHelpingHand (not model.field.attackerSide.isHelpingHand), model.field.attackerSide.isHelpingHand )
    , ( "Stealth Rock", SetAttackerSideStealthRock (not model.field.attackerSide.isSteathRock), model.field.attackerSide.isSteathRock )
    , ( "Spikes (1)"
      , SetAttackerSideSpikes
            (if model.field.attackerSide.spikes == 1 then
                0

             else
                1
            )
      , model.field.attackerSide.spikes == 1
      )
    , ( "Spikes (2)"
      , SetAttackerSideSpikes
            (if model.field.attackerSide.spikes == 2 then
                0

             else
                2
            )
      , model.field.attackerSide.spikes == 2
      )
    , ( "Spikes (3)"
      , SetAttackerSideSpikes
            (if model.field.attackerSide.spikes == 3 then
                0

             else
                3
            )
      , model.field.attackerSide.spikes == 3
      )
    ]



-- Get "both" (field-wide) condition options


getBothConditionOptions : Model -> List ( String, Msg, Bool )
getBothConditionOptions model =
    [ ( "Gravity", SetFieldGravity (not model.field.isGravity), model.field.isGravity )
    ]



-- Get defender side condition options


getDefenderConditionOptions : Model -> List ( String, Msg, Bool )
getDefenderConditionOptions model =
    [ ( "Reflect", SetDefenderSideReflect (not model.field.defenderSide.isReflect), model.field.defenderSide.isReflect )
    , ( "Light Screen", SetDefenderSideLightScreen (not model.field.defenderSide.isLightScreen), model.field.defenderSide.isLightScreen )
    , ( "Aurora Veil", SetDefenderSideAuroraVeil (not model.field.defenderSide.isAuroraVeil), model.field.defenderSide.isAuroraVeil )
    , ( "Tailwind", SetDefenderSideTailwind (not model.field.defenderSide.isTailwind), model.field.defenderSide.isTailwind )
    , ( "Helping Hand", SetDefenderSideHelpingHand (not model.field.defenderSide.isHelpingHand), model.field.defenderSide.isHelpingHand )
    , ( "Stealth Rock", SetDefenderSideStealthRock (not model.field.defenderSide.isSteathRock), model.field.defenderSide.isSteathRock )
    , ( "Spikes (1)"
      , SetDefenderSideSpikes
            (if model.field.defenderSide.spikes == 1 then
                0

             else
                1
            )
      , model.field.defenderSide.spikes == 1
      )
    , ( "Spikes (2)"
      , SetDefenderSideSpikes
            (if model.field.defenderSide.spikes == 2 then
                0

             else
                2
            )
      , model.field.defenderSide.spikes == 2
      )
    , ( "Spikes (3)"
      , SetDefenderSideSpikes
            (if model.field.defenderSide.spikes == 3 then
                0

             else
                3
            )
      , model.field.defenderSide.spikes == 3
      )
    ]



-- Show pills for all active field conditions
-- Weather and terrain are now shown in the top damage results panel, not here
-- Pills for attacker side conditions (no (A) suffix needed since column makes it clear)


viewAttackerConditionPills : Model -> List (Html Msg)
viewAttackerConditionPills model =
    [ if model.field.attackerSide.isReflect then
        Just (viewConditionPill "Reflect" (SetAttackerSideReflect False))

      else
        Nothing
    , if model.field.attackerSide.isLightScreen then
        Just (viewConditionPill "Light Screen" (SetAttackerSideLightScreen False))

      else
        Nothing
    , if model.field.attackerSide.isAuroraVeil then
        Just (viewConditionPill "Aurora Veil" (SetAttackerSideAuroraVeil False))

      else
        Nothing
    , if model.field.attackerSide.isTailwind then
        Just (viewConditionPill "Tailwind" (SetAttackerSideTailwind False))

      else
        Nothing
    , if model.field.attackerSide.isHelpingHand then
        Just (viewConditionPill "Helping Hand" (SetAttackerSideHelpingHand False))

      else
        Nothing
    , if model.field.attackerSide.isSteathRock then
        Just (viewConditionPill "Stealth Rock" (SetAttackerSideStealthRock False))

      else
        Nothing
    , if model.field.attackerSide.spikes > 0 then
        Just (viewConditionPill ("Spikes " ++ String.fromInt model.field.attackerSide.spikes) (SetAttackerSideSpikes 0))

      else
        Nothing
    ]
        |> List.filterMap identity



-- Pills for field-wide conditions (both sides)


viewBothConditionPills : Model -> List (Html Msg)
viewBothConditionPills model =
    if model.field.isGravity then
        [ viewConditionPill "Gravity" (SetFieldGravity False) ]

    else
        []



-- Pills for defender side conditions (no (D) suffix needed since column makes it clear)


viewDefenderConditionPills : Model -> List (Html Msg)
viewDefenderConditionPills model =
    [ if model.field.defenderSide.isReflect then
        Just (viewConditionPill "Reflect" (SetDefenderSideReflect False))

      else
        Nothing
    , if model.field.defenderSide.isLightScreen then
        Just (viewConditionPill "Light Screen" (SetDefenderSideLightScreen False))

      else
        Nothing
    , if model.field.defenderSide.isAuroraVeil then
        Just (viewConditionPill "Aurora Veil" (SetDefenderSideAuroraVeil False))

      else
        Nothing
    , if model.field.defenderSide.isTailwind then
        Just (viewConditionPill "Tailwind" (SetDefenderSideTailwind False))

      else
        Nothing
    , if model.field.defenderSide.isHelpingHand then
        Just (viewConditionPill "Helping Hand" (SetDefenderSideHelpingHand False))

      else
        Nothing
    , if model.field.defenderSide.isSteathRock then
        Just (viewConditionPill "Stealth Rock" (SetDefenderSideStealthRock False))

      else
        Nothing
    , if model.field.defenderSide.spikes > 0 then
        Just (viewConditionPill ("Spikes " ++ String.fromInt model.field.defenderSide.spikes) (SetDefenderSideSpikes 0))

      else
        Nothing
    ]
        |> List.filterMap identity



-- Render a single condition pill with X button


viewConditionPill : String -> Msg -> Html Msg
viewConditionPill label removeMsg =
    div [ class "badge badge-primary gap-1 py-3 px-2" ]
        [ span [ class "text-xs" ] [ text label ]
        , button
            [ onClick removeMsg
            , class "text-xs font-bold hover:text-error ml-1"
            , title "Remove condition"
            ]
            [ text "×" ]
        ]


{-| Team as 6 fixed slots, like the in-game party. Drag a team Pokemon onto another

slot to swap them (to line the team up with the opponent's), or drag a box Pokemon

onto a slot to swap it in.

-}
viewTeamPanel : Model -> Html Msg
viewTeamPanel model =
    let
        slot i =
            case List.head (List.drop i model.team) of
                Just pokemon ->
                    viewRosterTile model (FromTeam i) pokemon

                Nothing ->
                    div
                        (class
                            ("min-h-14 rounded-md border border-dashed "
                                ++ (if model.dragOverTarget == Just (TeamSlot i) then
                                        "border-info bg-info/10"

                                    else
                                        "border-base-content/20"
                                   )
                            )
                            :: dropTargetAttributes (TeamSlot i)
                        )
                        []
    in
    div (class "flex flex-col gap-2" :: dropTargetAttributes TeamArea)
        [ div [ class "flex items-center gap-2" ]
            [ h3 [ class "text-sm font-semibold text-primary" ] [ text "Team" ]
            , span [ class "text-xs text-base-content/60 tabular-nums" ] [ text (String.fromInt (List.length model.team) ++ "/6") ]
            , div [ class "flex-1" ] []
            , if List.length model.team < 6 then
                button [ onClick AddToTeam, class "btn btn-xs btn-outline btn-primary" ] [ text "+ Add" ]

              else
                text ""
            ]
        , div [ class "grid grid-cols-6 gap-1.5" ] (List.map slot (List.range 0 5))
        ]


viewColorCodeLegend : Html msg
viewColorCodeLegend =
    let
        item tier swatch =
            span [ class "inline-flex items-center gap-1" ]
                [ span [ class ("inline-block w-2.5 h-2.5 rounded-sm border-2 " ++ swatch) ] []
                , text (matchupTierLabel tier)
                ]
    in
    div [ class "flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-base-content/60" ]
        [ item AlwaysOHKOs "border-yellow-400"
        , item MightOHKO "border-yellow-600"
        , item TradeOHKOs "border-teal-400"
        , item MaybeTradeOHKOs "border-orange-500"
        , item GetsOHKOd "border-red-500"
        ]


{-| One team or box Pokemon: its box icon and level. The border shows (in order)

the loaded attacker, the slot being dragged over, or the Color Code matchup.

-}
viewRosterTile : Model -> PokemonSource -> PokemonState -> Html Msg
viewRosterTile model source pokemon =
    let
        ( target, matchup, loadMsg ) =
            case source of
                FromTeam i ->
                    ( TeamSlot i, Dict.get i model.teamMatchupResults, LoadFromTeam i )

                FromBox i ->
                    ( BoxSlot i, Dict.get i model.boxMatchupResults, LoadFromBox i )

        isLoaded =
            model.attackerSource == Just source

        isDragOver =
            model.dragOverTarget == Just target && model.dragState /= Just source

        stateClasses =
            if isDragOver then
                "border-info bg-info/10"

            else if isLoaded then
                "border-primary bg-primary/10"

            else
                getBoxPokemonBorderColor matchup ++ " hover:border-primary/60"

        speed =
            speedStat model.generation model.pokemonList model.natureList pokemon

        description =
            String.join " · "
                ([ pokemon.species
                 , "L" ++ String.fromInt pokemon.level
                 , "Spe " ++ String.fromInt speed
                 ]
                    ++ (matchup |> Maybe.map (\m -> [ matchupTierLabel (matchupTier m) ]) |> Maybe.withDefault [])
                )

        heightClass =
            case source of
                FromTeam _ ->
                    "min-h-14"

                FromBox _ ->
                    "min-h-12"
    in
    button
        ([ class ("relative flex flex-col items-center justify-center gap-0.5 rounded-md border-2 bg-base-300 pt-1 pb-0.5 cursor-grab active:cursor-grabbing " ++ heightClass ++ " " ++ stateClasses)
         , onClick loadMsg
         , title description
         , attribute "aria-label" description
         , draggable "true"
         , attribute "data-roster-drag" ""
         , on "dragstart" (Decode.succeed (DragStart source))
         , on "dragend" (Decode.succeed DragEnd)
         ]
            ++ dropTargetAttributes target
        )
        [ viewPokemonIcon model.pokemonList pokemon.species
        , span [ class "text-[10px] leading-none text-base-content/60 tabular-nums" ] [ text (String.fromInt pokemon.level) ]
        ]


{-| dragover/drop handlers for a drop target. They stop propagation so dropping on

a slot doesn't also count as dropping on the surrounding team/box area.

-}
dropTargetAttributes : DropTarget -> List (Attribute Msg)
dropTargetAttributes target =
    [ Html.Events.custom "dragover" (Decode.succeed { message = DragOverTarget target, stopPropagation = True, preventDefault = True })
    , Html.Events.custom "drop" (Decode.succeed { message = DropOn target, stopPropagation = True, preventDefault = True })
    ]


{-| Showdown's 40x30 box icon for a species (from pokemonicons-sheet.png).
-}
viewPokemonIcon : List PokemonData -> String -> Html msg
viewPokemonIcon pokemonList species =
    let
        ( x, y ) =
            pokemonList
                |> List.filter (\p -> p.name == species)
                |> List.head
                |> Maybe.map (\p -> ( p.iconX, p.iconY ))
                |> Maybe.withDefault ( 0, 0 )
    in
    span
        [ class "block shrink-0"
        , style "width" "40px"
        , style "height" "30px"
        , style "image-rendering" "pixelated"
        , style "background" "url(https://play.pokemonshowdown.com/sprites/pokemonicons-sheet.png) no-repeat"
        , style "background-position" (String.fromInt x ++ "px " ++ String.fromInt y ++ "px")
        , attribute "aria-hidden" "true"
        ]
        []


{-| The loaded attacker's team/box actions (evolve, send, release), shown once at

the top of Loadout instead of on every team/box row.

-}
viewLoadedPokemonBar : Model -> Html Msg
viewLoadedPokemonBar model =
    let
        roster =
            { team = model.team, box = model.box, attackerSource = model.attackerSource }

        loaded =
            model.attackerSource
                |> Maybe.andThen (\source -> rosterGet source roster |> Maybe.map (Tuple.pair source))
    in
    case loaded of
        Nothing ->
            div [ class "flex items-center gap-2 rounded-md bg-base-300 px-2 py-2 mb-3 text-xs text-base-content/60" ]
                [ text "This Pokemon isn't in your team or box. Use + Add in Team or + Add to Box to save it." ]

        Just ( source, pokemon ) ->
            let
                ( location, evolveMsg, dropdownId ) =
                    case source of
                        FromTeam i ->
                            ( "Team slot " ++ String.fromInt (i + 1), EvolvePokemonInTeam i, TeamEvolutionDropdown i )

                        FromBox i ->
                            ( "Box", EvolvePokemonInBox i, BoxEvolutionDropdown i )

                evos =
                    model.pokemonList
                        |> List.filter (\p -> p.name == pokemon.species)
                        |> List.head
                        |> Maybe.map .evos
                        |> Maybe.withDefault []

                evolveControl =
                    case evos of
                        [] ->
                            text ""

                        [ evo ] ->
                            button [ class "btn btn-xs btn-outline btn-success", onClick (evolveMsg evo) ] [ text ("Evolve → " ++ evo) ]

                        _ ->
                            div [ class "relative" ]
                                [ button
                                    [ class "btn btn-xs btn-outline btn-success"
                                    , stopPropagationOn "click" (Decode.succeed ( ToggleDropdown dropdownId, True ))
                                    ]
                                    [ text "Evolve ▾" ]
                                , if model.openDropdown == Just dropdownId then
                                    div [ class "absolute z-50 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow-lg" ]
                                        (List.map
                                            (\evo ->
                                                div
                                                    [ class "px-3 py-2 hover:bg-base-200 cursor-pointer text-xs whitespace-nowrap"
                                                    , stopPropagationOn "click" (Decode.succeed ( evolveMsg evo, True ))
                                                    ]
                                                    [ text ("→ " ++ evo) ]
                                            )
                                            evos
                                        )

                                  else
                                    text ""
                                ]

                sendControl =
                    case source of
                        FromTeam i ->
                            button [ class "btn btn-xs btn-outline", onClick (MoveToBox i) ] [ text "Send to Box" ]

                        FromBox i ->
                            button
                                [ class "btn btn-xs btn-outline"
                                , onClick (MoveToTeam i)
                                , disabled (List.length model.team >= 6)
                                , title
                                    (if List.length model.team >= 6 then
                                        "Team is full. Drag this Pokemon onto a team slot to swap."

                                     else
                                        "Add to the end of the team"
                                    )
                                ]
                                [ text "Send to Team" ]

                releaseMsg =
                    case source of
                        FromTeam i ->
                            RemoveFromTeam i

                        FromBox i ->
                            RemoveFromBox i
            in
            div [ class "flex flex-wrap items-center gap-2 rounded-md bg-base-300 px-2 py-1.5 mb-3" ]
                [ viewPokemonIcon model.pokemonList pokemon.species
                , span [ class "text-sm font-medium" ] [ text pokemon.species ]
                , span [ class "text-xs text-base-content/60 tabular-nums" ] [ text ("L" ++ String.fromInt pokemon.level) ]
                , span [ class "text-xs text-base-content/60" ] [ text location ]
                , div [ class "ml-auto flex flex-wrap items-center gap-1" ]
                    [ evolveControl
                    , sendControl
                    , button [ class "btn btn-xs btn-ghost text-error", onClick releaseMsg ] [ text "Release" ]
                    ]
                ]



-- Loadout section (Level + Item + Moves)


viewLoadoutSection : Model -> Html Msg
viewLoadoutSection model =
    div [ class "card bg-base-200 p-4" ]
        [ h3 [ class "text-sm font-semibold text-primary mb-3" ] [ text "Loadout" ]

        -- Loaded Pokemon: team/box actions (evolve, send, release)
        , viewLoadedPokemonBar model

        -- Level
        , div [ class "mb-3 flex items-center gap-2" ]
            [ span [ class "label-text text-xs" ] [ text "Level" ]
            , input
                [ type_ "number"
                , value (String.fromInt model.attacker.level)
                , onInput (\v -> SetAttackerLevel (Maybe.withDefault 50 (String.toInt v)))
                , class "input input-bordered input-xs w-20"
                , Html.Attributes.min "1"
                , Html.Attributes.max "100"
                ]
                []
            ]

        -- Form switching buttons
        , let
            attackerData =
                List.filter (\p -> p.name == model.attacker.species) model.pokemonList
                    |> List.head

            -- Get all available forms for this Pokemon (including current form)
            allForms =
                case attackerData of
                    Just data ->
                        case data.baseSpecies of
                            Just baseName ->
                                -- This is an alternate form - look up the base species
                                case List.filter (\p -> p.name == baseName) model.pokemonList |> List.head of
                                    Just baseData ->
                                        -- Include base form + all other forms (including current)
                                        baseName :: baseData.otherFormes

                                    Nothing ->
                                        model.attacker.species :: data.otherFormes

                            Nothing ->
                                -- This is a base form - include self + otherFormes
                                model.attacker.species :: data.otherFormes

                    Nothing ->
                        []

            -- Filter out regional forms
            battleForms =
                getNonRegionalForms allForms
          in
          if List.length battleForms > 1 then
            div [ class "mb-3" ]
                [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "Form" ] ]
                , div [ class "flex flex-wrap gap-1" ]
                    (battleForms
                        |> List.map
                            (\form ->
                                let
                                    isSelected =
                                        form == model.attacker.species
                                in
                                button
                                    [ class
                                        (if isSelected then
                                            "btn btn-xs btn-info"

                                         else
                                            "btn btn-xs btn-outline btn-info"
                                        )
                                    , onClick (SwitchAttackerForm form)
                                    ]
                                    [ text (getFormDisplayName form) ]
                            )
                    )
                ]

          else
            text ""

        -- Item
        , div [ class "mb-3" ]
            [ if model.generation >= 2 then
                let
                    -- Check if current input is an exact match to any item (user hasn't started typing yet)
                    isExactMatch =
                        List.any (\item -> item == model.attacker.item) model.itemList

                    filteredItems =
                        getFilteredItemList model.itemList
                            |> List.filter
                                (\item ->
                                    -- Show all if empty or exact match, otherwise filter by typing
                                    String.isEmpty model.attacker.item
                                        || isExactMatch
                                        || String.contains (String.toLower model.attacker.item) (String.toLower item)
                                )
                in
                div [ class "form-control relative" ]
                    [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "Item" ] ]
                    , div [ class "flex gap-1" ]
                        [ input
                            [ type_ "text"
                            , value model.attacker.item
                            , onInput SetAttackerItem
                            , placeholder "Search Item..."
                            , class "input input-bordered input-xs flex-1"
                            , onFocus (ToggleDropdown AttackerItemDropdown)
                            ]
                            []
                        ]

                    -- Custom dropdown
                    , if model.openDropdown == Just AttackerItemDropdown then
                        let
                            clampedHighlight =
                                Basics.min model.dropdownHighlightIndex (List.length filteredItems - 1)
                                    |> Basics.max 0
                        in
                        div
                            [ class "absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-base-100 border border-base-300 rounded shadow-lg"
                            ]
                            (filteredItems
                                |> List.indexedMap
                                    (\itemIndex item ->
                                        div
                                            [ class
                                                ("px-3 py-2 cursor-pointer text-xs "
                                                    ++ (if itemIndex == clampedHighlight then
                                                            "bg-primary text-primary-content"

                                                        else
                                                            "hover:bg-base-200"
                                                       )
                                                )
                                            , onClick (SetAttackerItem item)
                                            ]
                                            [ text item ]
                                    )
                            )

                      else
                        text ""
                    ]

              else
                text ""
            ]

        -- Moves (2x2 grid)
        , div [ class "grid grid-cols-2 gap-2" ]
            (List.indexedMap
                (\index move ->
                    let
                        moveData =
                            List.filter (\m -> m.name == move.name) model.moveList
                                |> List.head
                    in
                    div [ class "form-control relative" ]
                        [ div [ class "flex gap-1" ]
                            [ input
                                [ type_ "text"
                                , value move.name
                                , onInput (SetAttackerMove index)
                                , placeholder ("Move " ++ String.fromInt (index + 1))
                                , class "input input-bordered input-xs flex-1"
                                , onFocus (ToggleDropdown (AttackerMoveDropdown index))
                                ]
                                []
                            ]

                        -- Custom dropdown
                        , if model.openDropdown == Just (AttackerMoveDropdown index) then
                            let
                                -- Check if current input is an exact match to any move (user hasn't started typing yet)
                                isExactMatch =
                                    List.any (\m -> m.name == move.name) model.moveList

                                filteredMoves =
                                    getFilteredMoveList model.attackerLearnset model.moveList
                                        |> List.filter
                                            (\m ->
                                                -- Show all if empty or exact match, otherwise filter by typing
                                                String.isEmpty move.name
                                                    || isExactMatch
                                                    || String.contains (String.toLower move.name) (String.toLower m.name)
                                            )

                                -- Clamp highlight index to valid range
                                clampedHighlight =
                                    Basics.min model.dropdownHighlightIndex (List.length filteredMoves - 1)
                                        |> Basics.max 0
                            in
                            div
                                [ class "absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-base-100 border border-base-300 rounded shadow-lg"
                                , id ("dropdown-attacker-move-" ++ String.fromInt index)
                                ]
                                (filteredMoves
                                    |> List.indexedMap
                                        (\itemIndex m ->
                                            div
                                                [ class
                                                    ("px-3 py-2 cursor-pointer text-xs "
                                                        ++ (if itemIndex == clampedHighlight then
                                                                "bg-primary text-primary-content"

                                                            else
                                                                "hover:bg-base-200"
                                                           )
                                                    )
                                                , onClick (SetAttackerMove index m.name)
                                                , id ("dropdown-item-" ++ String.fromInt itemIndex)
                                                ]
                                                [ text (m.name ++ getMoveSource model.attackerLearnset m.name) ]
                                        )
                                )

                          else
                            text ""
                        , case moveData of
                            Just data ->
                                let
                                    effectiveType =
                                        getEffectiveMoveType move.name data.moveType model.attacker.ability

                                    typeDisplay =
                                        if effectiveType /= data.moveType then
                                            effectiveType ++ " (" ++ data.moveType ++ " → " ++ effectiveType ++ ")"

                                        else
                                            effectiveType
                                in
                                div [ class "text-xs text-base-content/60 mt-1 px-1" ]
                                    [ text
                                        (typeDisplay
                                            ++ " • "
                                            ++ data.category
                                            ++ " • BP: "
                                            ++ (if data.basePower > 0 then
                                                    String.fromInt data.basePower

                                                else
                                                    "—"
                                               )
                                            ++ " • Acc: "
                                            ++ (if data.accuracy > 0 && data.accuracy <= 100 then
                                                    String.fromInt data.accuracy ++ "%"

                                                else
                                                    "—"
                                               )
                                        )
                                    ]

                            Nothing ->
                                text ""
                        ]
                )
                model.attacker.moves
            )

        -- Level cap section (for ROM hacks)
        , div [ class "mt-4 pt-3 border-t border-base-300" ]
            [ div [ class "text-xs font-semibold text-primary mb-2" ] [ text "Level Cap" ]
            , div [ class "flex items-center gap-2" ]
                [ input
                    [ type_ "number"
                    , value (Maybe.map String.fromInt model.levelCap |> Maybe.withDefault "")
                    , onInput
                        (\v ->
                            if String.isEmpty v then
                                SetLevelCap Nothing

                            else
                                SetLevelCap (String.toInt v)
                        )
                    , placeholder "No cap"
                    , Html.Attributes.min "1"
                    , Html.Attributes.max "100"
                    , class "input input-bordered input-xs w-20"
                    ]
                    []
                , button
                    [ onClick ApplyLevelCapToAll
                    , class "btn btn-xs btn-primary flex-1"
                    , disabled (model.levelCap == Nothing)
                    , title "Apply to All"
                    ]
                    [ text "Apply to All" ]
                ]
            ]
        ]



-- Battle State content for collapsible section (shows both attacker and defender side-by-side)


viewBattleStatesContent : Model -> Html Msg
viewBattleStatesContent model =
    div [ class "grid grid-cols-1 lg:grid-cols-2 gap-4" ]
        [ viewBattleStateSection "Attacker" model.attacker model.generation model.pokemonList True
        , viewBattleStateSection "Defender" model.defender model.generation model.pokemonList False
        ]



-- Battle State section (HP, Status, Boosts, Tera)


viewBattleStateSection : String -> PokemonState -> Int -> List PokemonData -> Bool -> Html Msg
viewBattleStateSection title pokemon generation pokemonList isAttacker =
    div [ class "card bg-base-200 p-4" ]
        [ h3 [ class "text-sm font-semibold text-primary mb-3" ] [ text "Battle State" ]

        -- HP
        , div [ class "mb-3" ]
            [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "HP" ] ]
            , div [ class "flex items-center gap-2" ]
                [ input
                    [ type_ "range"
                    , Html.Attributes.min "0"
                    , Html.Attributes.max "100"
                    , value (String.fromInt pokemon.curHP)
                    , onInput
                        (\v ->
                            if isAttacker then
                                SetAttackerCurHP (Maybe.withDefault 100 (String.toInt v))

                            else
                                SetDefenderCurHP (Maybe.withDefault 100 (String.toInt v))
                        )
                    , class "range range-xs range-primary flex-1"
                    ]
                    []
                , span [ class "text-xs w-16 text-right" ] [ text (String.fromInt pokemon.curHP ++ "%") ]
                ]
            , div [ class "text-xs text-base-content/60 mt-1" ]
                [ text ("≈ " ++ String.fromInt (calculateCurrentHP pokemon pokemonList) ++ " / " ++ String.fromInt (calculateMaxHP pokemon pokemonList) ++ " HP")
                ]
            ]

        -- Status
        , div [ class "mb-3 flex items-center gap-2" ]
            [ span [ class "label-text text-xs" ] [ text "Status" ]
            , select
                [ onInput
                    (if isAttacker then
                        SetAttackerStatus

                     else
                        SetDefenderStatus
                    )
                , class "select select-bordered select-xs w-32"
                ]
                [ option [ value "", selected (pokemon.status == "") ] [ text "Healthy" ]
                , option [ value "Paralysis", selected (pokemon.status == "Paralysis") ] [ text "Paralysis" ]
                , option [ value "Poison", selected (pokemon.status == "Poison") ] [ text "Poison" ]
                , option [ value "Burn", selected (pokemon.status == "Burn") ] [ text "Burn" ]
                , option [ value "Sleep", selected (pokemon.status == "Sleep") ] [ text "Sleep" ]
                , option [ value "Freeze", selected (pokemon.status == "Freeze") ] [ text "Freeze" ]
                ]
            ]

        -- Tera Type (Gen 9 only)
        , if generation >= 9 then
            div [ class "mb-3 flex items-center gap-2" ]
                [ span [ class "label-text text-xs" ] [ text "Tera Type" ]
                , input
                    [ type_ "text"
                    , value pokemon.teraType
                    , onInput
                        (if isAttacker then
                            SetAttackerTeraType

                         else
                            SetDefenderTeraType
                        )
                    , list (title ++ "TeraTypeList")
                    , placeholder "None"
                    , class "input input-bordered input-xs w-32"
                    ]
                    []
                , datalist [ id (title ++ "TeraTypeList") ]
                    (List.map (\t -> option [ value t ] []) [ "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy" ])
                ]

          else
            text ""

        -- Stat Boosts (compact grid)
        , div []
            [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "Stat Boosts" ] ]
            , div [ class "grid grid-cols-3 gap-1" ]
                (List.map
                    (\( statName, statLabel, getValue ) ->
                        div [ class "form-control" ]
                            [ label [ class "label py-0" ] [ span [ class "label-text text-xs" ] [ text statLabel ] ]
                            , select
                                [ onInput
                                    (\v ->
                                        if isAttacker then
                                            SetAttackerBoost statName (Maybe.withDefault 0 (String.toInt v))

                                        else
                                            SetDefenderBoost statName (Maybe.withDefault 0 (String.toInt v))
                                    )
                                , class "select select-bordered select-xs w-full"
                                ]
                                (List.map
                                    (\i ->
                                        option
                                            [ value (String.fromInt i)
                                            , selected (getValue pokemon.boosts == i)
                                            ]
                                            [ text
                                                (if i > 0 then
                                                    "+" ++ String.fromInt i

                                                 else
                                                    String.fromInt i
                                                )
                                            ]
                                    )
                                    (List.reverse (List.range -6 6))
                                )
                            ]
                    )
                    [ ( "atk", "Atk", .atk )
                    , ( "def", "Def", .def )
                    , ( "spa", "SpA", .spa )
                    , ( "spd", "SpD", .spd )
                    , ( "spe", "Spe", .spe )
                    ]
                )
            ]
        ]



-- Helper to calculate max HP based on stats


calculateMaxHP : PokemonState -> List PokemonData -> Int
calculateMaxHP pokemon pokemonList =
    -- HP formula: floor((2 * Base + IV + floor(EV / 4)) * Level / 100) + Level + 10
    let
        speciesData =
            List.filter (\p -> p.name == pokemon.species) pokemonList
                |> List.head

        baseHP =
            case speciesData of
                Just data ->
                    data.baseStats.hp

                Nothing ->
                    100

        -- Default if species not found
        iv =
            pokemon.ivs.hp

        ev =
            pokemon.evs.hp

        level =
            pokemon.level
    in
    floor (toFloat ((2 * baseHP + iv + (ev // 4)) * level) / 100) + level + 10



-- Helper to calculate current HP from percentage


calculateCurrentHP : PokemonState -> List PokemonData -> Int
calculateCurrentHP pokemon pokemonList =
    let
        maxHP =
            calculateMaxHP pokemon pokemonList

        percentage =
            toFloat pokemon.curHP / 100
    in
    floor (toFloat maxHP * percentage)



-- Helper to check if a move is a sound-based move


isSoundMove : String -> Bool
isSoundMove moveName =
    List.member moveName
        [ "Boomburst"
        , "Bug Buzz"
        , "Chatter"
        , "Clanging Scales"
        , "Clangorous Soul"
        , "Clangorous Soulblaze"
        , "Confide"
        , "Disarming Voice"
        , "Echoed Voice"
        , "Grass Whistle"
        , "Growl"
        , "Heal Bell"
        , "Hyper Voice"
        , "Metal Sound"
        , "Noble Roar"
        , "Overdrive"
        , "Parting Shot"
        , "Perish Song"
        , "Relic Song"
        , "Roar"
        , "Round"
        , "Screech"
        , "Shadow Panic"
        , "Sing"
        , "Snarl"
        , "Snore"
        , "Sparkling Aria"
        , "Supersonic"
        , "Throat Chop"
        , "Uproar"
        ]



-- Helper to get the effective move type after applying type-changing abilities


getEffectiveMoveType : String -> String -> String -> String
getEffectiveMoveType moveName moveType ability =
    case ability of
        "Aerilate" ->
            if moveType == "Normal" then
                "Flying"

            else
                moveType

        "Galvanize" ->
            if moveType == "Normal" then
                "Electric"

            else
                moveType

        "Pixilate" ->
            if moveType == "Normal" then
                "Fairy"

            else
                moveType

        "Refrigerate" ->
            if moveType == "Normal" then
                "Ice"

            else
                moveType

        "Liquid Voice" ->
            if isSoundMove moveName then
                "Water"

            else
                moveType

        "Normalize" ->
            "Normal"

        _ ->
            moveType



-- Helper to get the default (first) ability for a species


getDefaultAbilityForSpecies : String -> List PokemonData -> String
getDefaultAbilityForSpecies speciesName pokemonList =
    let
        speciesData =
            List.filter (\p -> p.name == speciesName) pokemonList
                |> List.head
    in
    case speciesData of
        Just data ->
            List.head data.abilities |> Maybe.withDefault ""

        Nothing ->
            ""



-- Helper to get filtered ability list (Pokemon's actual abilities first, then others)


getFilteredAbilityList : String -> List PokemonData -> List String -> List String
getFilteredAbilityList speciesName pokemonList allAbilities =
    let
        speciesData =
            List.filter (\p -> p.name == speciesName) pokemonList
                |> List.head

        actualAbilities =
            case speciesData of
                Just data ->
                    data.abilities

                Nothing ->
                    []

        otherAbilities =
            List.filter (\a -> not (List.member a actualAbilities)) allAbilities
    in
    actualAbilities ++ otherAbilities



-- Helper to get filtered move list (Learnset moves first, organized by source, then all others)


getFilteredMoveList : Maybe LearnsetData -> List MoveData -> List MoveData
getFilteredMoveList maybeLearnset allMoves =
    case maybeLearnset of
        Just learnset ->
            let
                -- Sort level-up moves by learn level, then extract just the names
                sortedLevelupMoves =
                    learnset.levelup
                        |> List.sortBy Tuple.second
                        |> List.map Tuple.first

                -- Get all learnable move names in category order (levelup sorted by level!)
                learnableMoves =
                    sortedLevelupMoves ++ learnset.tm ++ learnset.tutor ++ learnset.egg ++ learnset.other

                -- Map over learnable moves to preserve category order
                learnableMovesData =
                    learnableMoves
                        |> List.filterMap
                            (\moveName ->
                                List.filter (\m -> m.name == moveName) allMoves
                                    |> List.head
                            )

                -- Then all other moves
                otherMovesData =
                    List.filter (\m -> not (List.member m.name learnableMoves)) allMoves
            in
            learnableMovesData ++ otherMovesData

        Nothing ->
            allMoves



-- Helper to get move source indicator


getMoveSource : Maybe LearnsetData -> String -> String
getMoveSource maybeLearnset moveName =
    case maybeLearnset of
        Just learnset ->
            let
                -- Check if move is in levelup (now a list of tuples)
                levelupMove =
                    List.filter (\( name, _ ) -> name == moveName) learnset.levelup
                        |> List.head
            in
            case levelupMove of
                Just ( _, level ) ->
                    if level == 0 then
                        " [Evolve]"

                    else
                        " [Level " ++ String.fromInt level ++ "]"

                Nothing ->
                    if List.member moveName learnset.tm then
                        " [TM]"

                    else if List.member moveName learnset.tutor then
                        " [Tutor]"

                    else if List.member moveName learnset.egg then
                        " [Egg]"

                    else if List.member moveName learnset.other then
                        " [Other]"

                    else
                        ""

        Nothing ->
            ""



-- ITEM SORTING FOR NUZLOCKE
-- Priority items grouped by usefulness for in-game/Nuzlocke play


{-| Choice items - powerful but lock you into one move
-}
choiceItems : List String
choiceItems =
    [ "Choice Band"
    , "Choice Specs"
    , "Choice Scarf"
    ]


{-| Utility items - general survivability and status
-}
utilityItems : List String
utilityItems =
    [ "Leftovers"
    , "Focus Sash"
    , "Eviolite"
    , "Rocky Helmet"
    , "Assault Vest"
    , "Black Sludge"
    , "Air Balloon"
    , "Shell Bell"
    , "Focus Band"
    , "Lum Berry"
    , "Sitrus Berry"
    , "Safety Goggles"
    , "Bright Powder"
    , "Quick Claw"
    , "Shed Shell"
    , "Wide Lens"
    , "Scope Lens"
    , "Clear Amulet"
    , "Covert Cloak"
    ]


{-| Damage boosting items - general offense
-}
damageBoostItems : List String
damageBoostItems =
    [ "Life Orb"
    , "Expert Belt"
    , "Muscle Band"
    , "Wise Glasses"
    , "Metronome"
    , "Weakness Policy"
    , "Loaded Dice"
    , "Punching Glove"
    ]


{-| Type-specific damage boosters
-}
typeBoostItems : List String
typeBoostItems =
    [ "Charcoal"
    , "Mystic Water"
    , "Miracle Seed"
    , "Magnet"
    , "Never-Melt Ice"
    , "Soft Sand"
    , "Sharp Beak"
    , "Poison Barb"
    , "Twisted Spoon"
    , "Spell Tag"
    , "Dragon Fang"
    , "Black Belt"
    , "Silk Scarf"
    , "Hard Stone"
    , "Metal Coat"
    , "Silver Powder"
    , "Black Glasses"
    , "Fairy Feather"
    ]


{-| Status-inducing items (for Guts, Facade, etc.)
-}
statusItems : List String
statusItems =
    [ "Flame Orb"
    , "Toxic Orb"
    ]


{-| Useful berries for competitive/Nuzlocke
-}
usefulBerries : List String
usefulBerries =
    [ "Sitrus Berry"
    , "Lum Berry"
    , "Oran Berry"
    , "Yache Berry"
    , "Occa Berry"
    , "Passho Berry"
    , "Wacan Berry"
    , "Rindo Berry"
    , "Shuca Berry"
    , "Coba Berry"
    , "Chople Berry"
    , "Colbur Berry"
    , "Babiri Berry"
    , "Roseli Berry"
    , "Chilan Berry"
    , "Haban Berry"
    , "Kasib Berry"
    , "Payapa Berry"
    , "Tanga Berry"
    , "Charti Berry"
    , "Kebia Berry"
    ]


{-| Species-specific items that boost particular Pokemon
-}
speciesSpecificItems : List String
speciesSpecificItems =
    [ "Light Ball" -- Pikachu
    , "Thick Club" -- Cubone/Marowak
    , "Soul Dew" -- Latios/Latias (pre-Gen 7)
    , "Metal Powder" -- Ditto
    , "Quick Powder" -- Ditto
    , "Stick" -- Farfetch'd
    , "Leek" -- Farfetch'd (Gen 8+)
    , "Lucky Punch" -- Chansey
    , "Deep Sea Scale" -- Clamperl
    , "Deep Sea Tooth" -- Clamperl
    , "Adamant Orb" -- Dialga
    , "Lustrous Orb" -- Palkia
    , "Griseous Orb" -- Giratina
    , "Griseous Core" -- Giratina (SV)
    , "Adamant Crystal" -- Dialga (SV)
    , "Lustrous Globe" -- Palkia (SV)
    , "Rusted Sword" -- Zacian
    , "Rusted Shield" -- Zamazenta
    , "Booster Energy" -- Paradox Pokemon
    ]


{-| All priority items in order
-}
allPriorityItems : List String
allPriorityItems =
    choiceItems
        ++ utilityItems
        ++ damageBoostItems
        ++ statusItems
        ++ typeBoostItems
        ++ usefulBerries
        ++ speciesSpecificItems


{-| Get filtered and sorted item list for dropdowns.
Priority items appear first (in category order), then remaining items alphabetically.
-}
getFilteredItemList : List String -> List String
getFilteredItemList allItems =
    let
        -- Get priority items that exist in the current generation's item list
        availablePriorityItems =
            allPriorityItems
                |> List.filter (\item -> List.member item allItems)

        -- Get remaining items (not in priority list), sorted alphabetically
        remainingItems =
            allItems
                |> List.filter (\item -> not (List.member item availablePriorityItems))
                |> List.sort
    in
    availablePriorityItems ++ remainingItems



-- Base Stats content (for collapsible section)


viewBaseStatsContent : PokemonState -> List PokemonData -> List String -> List NatureData -> Int -> Bool -> Maybe DropdownId -> Int -> Html Msg
viewBaseStatsContent pokemon pokemonList abilityList natureList generation isAttacker openDropdown highlightIndex =
    div [ class "flex flex-col gap-3" ]
        [ -- Species
          div [ class "form-control" ]
            [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "Species" ] ]
            , input
                [ type_ "text"
                , value pokemon.species
                , onInput
                    (if isAttacker then
                        SetAttackerSpecies

                     else
                        SetDefenderSpecies
                    )
                , list
                    (if isAttacker then
                        "attackerSpeciesList"

                     else
                        "defenderSpeciesList"
                    )
                , placeholder "Search Pokemon..."
                , class "input input-bordered input-xs w-full"
                ]
                []
            , Keyed.node "datalist"
                [ id
                    (if isAttacker then
                        "attackerSpeciesList"

                     else
                        "defenderSpeciesList"
                    )
                ]
                (List.map (\p -> ( p.name, option [ value p.name ] [] )) pokemonList)
            ]

        -- Level (Defender only - Attacker level is in Loadout section)
        , if not isAttacker then
            div [ class "flex items-center gap-2" ]
                [ span [ class "label-text text-xs" ] [ text "Level" ]
                , input
                    [ type_ "number"
                    , value (String.fromInt pokemon.level)
                    , onInput (\v -> SetDefenderLevel (Maybe.withDefault 50 (String.toInt v)))
                    , Html.Attributes.min "1"
                    , Html.Attributes.max "100"
                    , class "input input-bordered input-xs w-20"
                    ]
                    []
                ]

          else
            text ""

        -- Nature (Gen 3+)
        , if generation >= 3 then
            div [ class "form-control" ]
                [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "Nature" ] ]
                , select
                    [ onInput
                        (if isAttacker then
                            SetAttackerNature

                         else
                            SetDefenderNature
                        )
                    , class "select select-bordered select-xs w-full"
                    ]
                    (List.map
                        (\n ->
                            option [ value n.name, selected (pokemon.nature == n.name) ]
                                [ text
                                    (n.name
                                        ++ (if n.plus /= "" && n.minus /= "" then
                                                " (+" ++ n.plus ++ "/-" ++ n.minus ++ ")"

                                            else
                                                ""
                                           )
                                    )
                                ]
                        )
                        natureList
                    )
                ]

          else
            text ""

        -- Ability (Gen 3+)
        , if generation >= 3 then
            let
                dropdownId =
                    if isAttacker then
                        AttackerAbilityDropdown

                    else
                        DefenderAbilityDropdown

                -- Check if current input is an exact match to any ability (user hasn't started typing yet)
                isExactMatch =
                    List.any (\a -> a == pokemon.ability) abilityList

                filteredAbilities =
                    getFilteredAbilityList pokemon.species pokemonList abilityList
                        |> List.filter
                            (\a ->
                                -- Show all if empty or exact match, otherwise filter by typing
                                String.isEmpty pokemon.ability
                                    || isExactMatch
                                    || String.contains (String.toLower pokemon.ability) (String.toLower a)
                            )
            in
            div [ class "form-control relative" ]
                [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "Ability" ] ]
                , div [ class "flex gap-1" ]
                    [ input
                        [ type_ "text"
                        , value pokemon.ability
                        , onInput
                            (if isAttacker then
                                SetAttackerAbility

                             else
                                SetDefenderAbility
                            )
                        , placeholder "Search Ability..."
                        , class "input input-bordered input-xs flex-1"
                        , onFocus (ToggleDropdown dropdownId)
                        ]
                        []
                    ]

                -- Custom dropdown
                , if openDropdown == Just dropdownId then
                    let
                        clampedHighlight =
                            Basics.min highlightIndex (List.length filteredAbilities - 1)
                                |> Basics.max 0
                    in
                    div
                        [ class "absolute z-50 mt-1 w-full max-h-60 overflow-y-auto bg-base-100 border border-base-300 rounded shadow-lg"
                        ]
                        (filteredAbilities
                            |> List.indexedMap
                                (\itemIndex a ->
                                    div
                                        [ class
                                            ("px-3 py-2 cursor-pointer text-xs "
                                                ++ (if itemIndex == clampedHighlight then
                                                        "bg-primary text-primary-content"

                                                    else
                                                        "hover:bg-base-200"
                                                   )
                                            )
                                        , onClick
                                            (if isAttacker then
                                                SetAttackerAbility a

                                             else
                                                SetDefenderAbility a
                                            )
                                        ]
                                        [ text a ]
                                )
                        )

                  else
                    text ""
                ]

          else
            text ""

        -- EVs
        , viewEVsCompact pokemon generation isAttacker

        -- IVs
        , viewIVsCompact pokemon generation isAttacker

        -- Add to Box button (Attacker only)
        , if isAttacker then
            button [ onClick AddToBox, class "btn btn-sm btn-primary w-full mt-4" ] [ text "+ Add to Box" ]

          else
            text ""
        ]


viewEVsCompact : PokemonState -> Int -> Bool -> Html Msg
viewEVsCompact pokemon generation isAttacker =
    div []
        [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "EVs" ] ]
        , div [ class "grid grid-cols-6 gap-1" ]
            (List.map
                (\( statName, statLabel, getValue ) ->
                    div [ class "form-control" ]
                        [ label [ class "label py-0" ] [ span [ class "label-text text-xs" ] [ text statLabel ] ]
                        , input
                            [ type_ "number"
                            , value (String.fromInt (getValue pokemon.evs))
                            , onInput
                                (\v ->
                                    if isAttacker then
                                        SetAttackerEV statName (Maybe.withDefault 0 (String.toInt v))

                                    else
                                        SetDefenderEV statName (Maybe.withDefault 0 (String.toInt v))
                                )
                            , Html.Attributes.min "0"
                            , Html.Attributes.max "252"
                            , class "input input-bordered input-xs w-full text-center"
                            ]
                            []
                        ]
                )
                [ ( "hp", "HP", .hp )
                , ( "atk", "Atk", .atk )
                , ( "def", "Def", .def )
                , ( "spa", "SpA", .spa )
                , ( "spd", "SpD", .spd )
                , ( "spe", "Spe", .spe )
                ]
            )
        ]


viewIVsCompact : PokemonState -> Int -> Bool -> Html Msg
viewIVsCompact pokemon generation isAttacker =
    let
        maxIV =
            if generation <= 2 then
                15

            else
                31

        label_ =
            if generation <= 2 then
                "DVs"

            else
                "IVs"
    in
    div []
        [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text label_ ] ]
        , div [ class "grid grid-cols-6 gap-1" ]
            (List.map
                (\( statName, statLabel, getValue ) ->
                    div [ class "form-control" ]
                        [ label [ class "label py-0" ] [ span [ class "label-text text-xs" ] [ text statLabel ] ]
                        , input
                            [ type_ "number"
                            , value (String.fromInt (Basics.min maxIV (getValue pokemon.ivs)))
                            , onInput
                                (\v ->
                                    if isAttacker then
                                        SetAttackerIV statName (Maybe.withDefault maxIV (String.toInt v))

                                    else
                                        SetDefenderIV statName (Maybe.withDefault maxIV (String.toInt v))
                                )
                            , Html.Attributes.min "0"
                            , Html.Attributes.max (String.fromInt maxIV)
                            , class "input input-bordered input-xs w-full text-center"
                            ]
                            []
                        ]
                )
                [ ( "hp", "HP", .hp )
                , ( "atk", "Atk", .atk )
                , ( "def", "Def", .def )
                , ( "spa", "SpA", .spa )
                , ( "spd", "SpD", .spd )
                , ( "spe", "Spe", .spe )
                ]
            )
        ]



-- Defender Info section (compact read-only or edit mode)


viewDefenderInfoSection : Model -> Html Msg
viewDefenderInfoSection model =
    div [ class "card bg-base-200 p-4" ]
        [ div [ class "flex items-center justify-between mb-3" ]
            [ h3 [ class "text-sm font-semibold text-primary" ] [ text "Defender Info" ]
            , button [ onClick ToggleDefenderEditMode, class "btn btn-xs btn-ghost" ]
                [ text
                    (if model.defenderEditMode then
                        "Done"

                     else
                        "Edit"
                    )
                ]
            ]
        , if model.defenderEditMode then
            -- Edit mode: show full inputs
            div [ class "flex flex-col gap-2" ]
                [ -- Species
                  div [ class "form-control" ]
                    [ input
                        [ type_ "text"
                        , value model.defender.species
                        , onInput SetDefenderSpecies
                        , list "defenderSpeciesListEdit"
                        , placeholder "Species"
                        , class "input input-bordered input-xs w-full"
                        ]
                        []
                    , Keyed.node "datalist"
                        [ id "defenderSpeciesListEdit" ]
                        (List.map (\p -> ( p.name, option [ value p.name ] [] )) model.pokemonList)
                    ]

                -- Form switching buttons (for Mega evolutions, etc.)
                , let
                    defenderData =
                        List.filter (\p -> p.name == model.defender.species) model.pokemonList
                            |> List.head

                    -- Get all available forms for this Pokemon (including current form)
                    allForms =
                        case defenderData of
                            Just data ->
                                case data.baseSpecies of
                                    Just baseName ->
                                        -- This is an alternate form - look up the base species
                                        case List.filter (\p -> p.name == baseName) model.pokemonList |> List.head of
                                            Just baseData ->
                                                -- Include base form + all other forms (including current)
                                                baseName :: baseData.otherFormes

                                            Nothing ->
                                                model.defender.species :: data.otherFormes

                                    Nothing ->
                                        -- This is a base form - include self + otherFormes
                                        model.defender.species :: data.otherFormes

                            Nothing ->
                                []

                    -- Filter out regional forms
                    battleForms =
                        getNonRegionalForms allForms
                  in
                  if List.length battleForms > 1 then
                    div []
                        [ label [ class "label py-1" ] [ span [ class "label-text text-xs" ] [ text "Form" ] ]
                        , div [ class "flex flex-wrap gap-1" ]
                            (battleForms
                                |> List.map
                                    (\form ->
                                        let
                                            isSelected =
                                                form == model.defender.species
                                        in
                                        button
                                            [ class
                                                (if isSelected then
                                                    "btn btn-xs btn-info"

                                                 else
                                                    "btn btn-xs btn-outline btn-info"
                                                )
                                            , onClick (SwitchDefenderForm form)
                                            ]
                                            [ text (getFormDisplayName form) ]
                                    )
                            )
                        ]

                  else
                    text ""

                -- Level
                , div [ class "form-control" ]
                    [ input
                        [ type_ "number"
                        , value (String.fromInt model.defender.level)
                        , onInput (\v -> SetDefenderLevel (Maybe.withDefault 50 (String.toInt v)))
                        , placeholder "Level"
                        , class "input input-bordered input-xs w-full"
                        ]
                        []
                    ]

                -- Item (Gen 2+)
                , if model.generation >= 2 then
                    div [ class "form-control" ]
                        [ input
                            [ type_ "text"
                            , value model.defender.item
                            , onInput SetDefenderItem
                            , list "defenderItemListEdit"
                            , placeholder "Item"
                            , class "input input-bordered input-xs w-full"
                            ]
                            []
                        , Keyed.node "datalist"
                            [ id "defenderItemListEdit" ]
                            (List.map (\item -> ( item, option [ value item ] [] )) (getFilteredItemList model.itemList))
                        ]

                  else
                    text ""

                -- Moves
                , div [ class "grid grid-cols-2 gap-1" ]
                    (List.indexedMap
                        (\index move ->
                            input
                                [ type_ "text"
                                , value move.name
                                , onInput (SetDefenderMove index)
                                , list ("defenderMoveListEdit" ++ String.fromInt index)
                                , placeholder ("Move " ++ String.fromInt (index + 1))
                                , class "input input-bordered input-xs w-full"
                                ]
                                []
                        )
                        model.defender.moves
                    )
                ]

          else
            -- Read-only compact view
            let
                defenderData =
                    List.filter (\p -> p.name == model.defender.species) model.pokemonList
                        |> List.head

                allForms =
                    case defenderData of
                        Just data ->
                            case data.baseSpecies of
                                Just baseName ->
                                    case List.filter (\p -> p.name == baseName) model.pokemonList |> List.head of
                                        Just baseData ->
                                            baseName :: baseData.otherFormes

                                        Nothing ->
                                            model.defender.species :: data.otherFormes

                                Nothing ->
                                    model.defender.species :: data.otherFormes

                        Nothing ->
                            []

                battleForms =
                    getNonRegionalForms allForms
            in
            div [ class "text-xs" ]
                [ div [ class "font-medium text-base-content" ]
                    [ text (model.defender.species ++ " L" ++ String.fromInt model.defender.level) ]
                , if model.generation >= 3 && not (String.isEmpty model.defender.ability) then
                    div [ class "text-secondary" ] [ text model.defender.ability ]

                  else
                    text ""
                , if model.generation >= 2 && not (String.isEmpty model.defender.item) then
                    div [ class "text-warning" ] [ text model.defender.item ]

                  else
                    text ""
                , div [ class "text-base-content/60 mt-1" ]
                    [ text
                        (model.defender.moves
                            |> List.map .name
                            |> List.filter (not << String.isEmpty)
                            |> String.join ", "
                        )
                    ]
                , if List.length battleForms > 1 then
                    div [ class "flex flex-wrap gap-1 mt-2" ]
                        (battleForms
                            |> List.map
                                (\form ->
                                    let
                                        isSelected =
                                            form == model.defender.species
                                    in
                                    button
                                        [ class
                                            (if isSelected then
                                                "btn btn-xs btn-info"

                                             else
                                                "btn btn-xs btn-outline btn-info"
                                            )
                                        , onClick (SwitchDefenderForm form)
                                        ]
                                        [ text (getFormDisplayName form) ]
                                )
                        )

                  else
                    text ""
                ]
        ]


{-| Toolbar: brand, game, and the field settings that change most often
(format, weather, terrain). Field Conditions proper (screens, hazards) live
in the collapsible card in the right column.
-}
viewHeader : Model -> Html Msg
viewHeader model =
    header [ class "card bg-base-200 px-4 py-2 flex flex-row flex-wrap items-center gap-3" ]
        [ div [ class "flex items-center gap-2 mr-2" ]
            [ img
                [ src "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/709.png"
                , class "w-8 h-8"
                ]
                []
            , h1 [ class "text-lg font-bold text-primary" ] [ text "Trevenant" ]
            ]
        , select [ onInput SetSelectedGame, class "select select-bordered select-xs w-44" ]
            (List.map
                (\game ->
                    option [ value game, selected (game == model.selectedGame) ] [ text game ]
                )
                model.availableGames
            )
        , viewToolbarSelect "Format" SetFieldGameType model.field.gameType [ ( "Singles", "Singles" ), ( "Doubles", "Doubles" ) ]
        , viewToolbarSelect "Weather" SetFieldWeather model.field.weather [ ( "", "None" ), ( "Sun", "Sun" ), ( "Rain", "Rain" ), ( "Sand", "Sand" ), ( "Snow", "Snow" ) ]
        , viewToolbarSelect "Terrain" SetFieldTerrain model.field.terrain [ ( "", "None" ), ( "Electric", "Electric" ), ( "Grassy", "Grassy" ), ( "Psychic", "Psychic" ), ( "Misty", "Misty" ) ]
        , div [ class "flex-1" ] []
        , button
            [ onClick RequestResetGameData
            , class "btn btn-xs btn-outline btn-error btn-square"
            , title "Reset all data for this game (team, box, progress)"
            ]
            [ text "🚚" ]
        ]


viewToolbarSelect : String -> (String -> Msg) -> String -> List ( String, String ) -> Html Msg
viewToolbarSelect labelText msg current options =
    div [ class "flex items-center gap-1" ]
        [ span [ class "text-xs text-base-content/60" ] [ text labelText ]
        , select [ onInput msg, class "select select-bordered select-xs w-24" ]
            (List.map (\( v, t ) -> option [ value v, selected (current == v) ] [ text t ]) options)
        ]


{-| One-screen workspace at desktop widths: damage strip on top, then the
roster (team + box) on the left and everything about the current matchup on
the right. The right column scrolls on its own, so opening Field Conditions
or Battle State never pushes the box off screen. Below `lg` it falls back to
a normal scrolling page.
-}
viewMain : Model -> Html Msg
viewMain model =
    main_ [ class "flex flex-col gap-3 lg:flex-1 lg:min-h-0" ]
        [ viewDamageStrip model
        , div [ class "grid grid-cols-1 lg:grid-cols-2 gap-3 lg:flex-1 lg:min-h-0" ]
            [ viewTeamBoxSection model
            , div [ class "flex flex-col gap-3 lg:min-h-0 lg:overflow-y-auto" ]
                [ viewOpponentSection model
                , viewDefenderInfoSection model
                , viewLoadoutSection model
                , viewCollapsibleSection "Field Conditions" model.fieldCollapsed ToggleFieldCollapsed (viewFieldConditionsContent model)
                , viewCollapsibleSection "Battle State" model.battleStateCollapsed ToggleBattleStateCollapsed (viewBattleStatesContent model)
                , viewCollapsibleSection "Attacker Stats" model.attackerBaseStatsCollapsed ToggleAttackerBaseStatsCollapsed (viewBaseStatsContent model.attacker model.pokemonList model.abilityList model.natureList model.generation True model.openDropdown model.dropdownHighlightIndex)
                , viewCollapsibleSection "Defender Stats" model.defenderBaseStatsCollapsed ToggleDefenderBaseStatsCollapsed (viewBaseStatsContent model.defender model.pokemonList model.abilityList model.natureList model.generation False model.openDropdown model.dropdownHighlightIndex)
                ]
            ]
        ]


{-| Compact damage results: each side's four moves as chips (name, %, KO) and
the selected move's full numbers in the middle. Fits in about 170px so the
numbers and the box are on screen together.
-}
viewDamageStrip : Model -> Html Msg
viewDamageStrip model =
    let
        gradient =
            getWeatherTerrainGradient model.field.weather model.field.terrain

        backgroundStyle =
            if String.isEmpty gradient then
                []

            else
                [ style "background" gradient ]
    in
    div ([ class "card bg-base-200 px-4 py-3" ] ++ backgroundStyle)
        [ case model.result of
            Nothing ->
                div [ class "text-center text-base-content/60 py-6 text-sm" ]
                    [ text "Select Pokemon and moves to see damage calculations" ]

            Just result ->
                div [ class "grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-start" ]
                    [ viewMoveChips model.pokemonList model.attacker result.attackerResults result.attackerSpeed result.defenderSpeed AttackerMove model.selectedMoveSource model.selectedMoveIndex
                    , viewDamageDetailsCenter result model.selectedMoveSource model.selectedMoveIndex model.attacker model.defender
                    , viewMoveChips model.pokemonList model.defender result.defenderResults result.defenderSpeed result.attackerSpeed DefenderMove model.selectedMoveSource model.selectedMoveIndex
                    ]
        ]


{-| One side of the damage strip: who, their effective Speed, and a 2x2 of
move chips. Results are rendered by index (not filtered) so the chip index
always matches `selectedMoveIndex`.
-}
viewMoveChips : List PokemonData -> PokemonState -> List MoveResult -> Int -> Int -> MoveSource -> MoveSource -> Int -> Html Msg
viewMoveChips pokemonList pokemon results mySpeed theirSpeed source selectedSource selectedIndex =
    let
        speedBadge =
            if mySpeed > theirSpeed then
                "badge-success"

            else if mySpeed < theirSpeed then
                "badge-error"

            else
                "badge-warning"

        percentClass =
            if source == AttackerMove then
                "text-success"

            else
                "text-warning"
    in
    div [ class "flex flex-col gap-1.5 min-w-0" ]
        [ div [ class "flex items-center gap-2 h-8 min-w-0" ]
            [ viewPokemonIcon pokemonList pokemon.species
            , span [ class "text-sm font-medium truncate" ] [ text pokemon.species ]
            , span [ class "text-xs text-base-content/60 tabular-nums" ] [ text ("L" ++ String.fromInt pokemon.level) ]
            , span [ class ("badge badge-xs font-mono whitespace-nowrap " ++ speedBadge), title "Effective Speed" ] [ text ("Spe " ++ String.fromInt mySpeed) ]
            ]
        , div [ class "grid grid-cols-2 gap-1" ]
            (List.indexedMap
                (\index result ->
                    let
                        isSelected =
                            selectedSource == source && selectedIndex == index

                        isEmpty =
                            result.moveName == "(No Move)" || String.isEmpty result.moveName
                    in
                    button
                        [ onClick (SelectMove source index)
                        , disabled isEmpty
                        , class
                            ("flex flex-col items-start rounded border-2 bg-base-300 px-2 py-1 text-left min-w-0 "
                                ++ (if isSelected then
                                        "border-primary"

                                    else
                                        "border-transparent hover:border-primary/60"
                                   )
                            )
                        ]
                        [ span
                            [ class
                                ("text-xs font-medium truncate w-full "
                                    ++ (if isEmpty then
                                            "text-base-content/40"

                                        else
                                            ""
                                       )
                                )
                            ]
                            [ text
                                (if isEmpty then
                                    "(No Move)"

                                 else
                                    result.moveName
                                )
                            ]
                        , span
                            [ class
                                ("text-xs font-mono tabular-nums "
                                    ++ (if isEmpty then
                                            "text-base-content/40"

                                        else
                                            percentClass
                                       )
                                )
                            ]
                            [ text
                                (if isEmpty then
                                    "—"

                                 else
                                    formatDamagePercent result.damagePercent
                                )
                            ]
                        , span [ class "text-[10px] text-base-content/60 truncate w-full" ]
                            [ text
                                (if String.isEmpty result.koChance then
                                    "\u{00A0}"

                                 else
                                    result.koChance
                                )
                            ]
                        ]
                )
                results
            )
        ]


viewDamageDetailsCenter : CalculationResult -> MoveSource -> Int -> PokemonState -> PokemonState -> Html Msg
viewDamageDetailsCenter result selectedSource selectedIndex attacker defender =
    let
        ( selectedResult, user, target ) =
            case selectedSource of
                AttackerMove ->
                    ( List.head (List.drop selectedIndex result.attackerResults), attacker, defender )

                DefenderMove ->
                    ( List.head (List.drop selectedIndex result.defenderResults), defender, attacker )

        rolls list =
            list |> List.map String.fromInt |> String.join ", "
    in
    div [ class "flex flex-col items-center justify-center text-center lg:min-w-[15rem] lg:pt-8" ]
        (case selectedResult of
            Just moveResult ->
                [ div [ class "text-[11px] text-base-content/60" ]
                    [ text (user.species ++ " · " ++ moveResult.moveName ++ " → " ++ target.species) ]
                , div [ class "text-2xl font-bold font-mono tabular-nums text-success leading-tight" ]
                    [ text (formatDamagePercent moveResult.damagePercent) ]
                , div [ class "text-xs text-success" ] [ text moveResult.koChance ]
                , div [ class "text-[10px] font-mono text-base-content/40 max-w-[15rem]" ] [ text (rolls moveResult.damageRolls) ]
                , div [ class "text-[10px] uppercase tracking-wider text-base-content/60 mt-1.5" ] [ text "Crit" ]
                , div [ class "text-lg font-bold font-mono tabular-nums text-warning leading-tight" ]
                    [ text (formatDamagePercent moveResult.critDamagePercent) ]
                , div [ class "text-xs text-warning" ] [ text moveResult.critKoChance ]
                , div [ class "text-[10px] font-mono text-warning/50 max-w-[15rem]" ] [ text (rolls moveResult.critDamageRolls) ]
                ]

            Nothing ->
                [ div [ class "text-xs text-base-content/60" ] [ text "Click a move" ] ]
        )


{-| Trainer navigation and the opponent's team as tiles. Clicking a tile loads
that Pokemon as the defender; the current defender is outlined in purple.
-}
viewOpponentSection : Model -> Html Msg
viewOpponentSection model =
    let
        encounter =
            getSelectedEncounter model
    in
    div [ class "card bg-base-200 p-4 flex flex-col gap-2" ]
        [ div [ class "flex items-center gap-2" ]
            [ h3 [ class "text-sm font-semibold text-primary" ] [ text "Opponent" ]
            , div [ class "flex-1" ] []
            , button [ onClick PrevTrainer, class "btn btn-xs btn-ghost" ] [ text "← Prev" ]
            , span [ class "text-xs text-base-content/60 tabular-nums" ]
                [ text
                    (String.fromInt (model.selectedTrainerIndex + 1)
                        ++ "/"
                        ++ String.fromInt (List.length model.trainerEncounters)
                    )
                ]
            , button [ onClick NextTrainer, class "btn btn-xs btn-ghost" ] [ text "Next →" ]
            ]
        , div [ class "form-control relative" ]
            [ input
                [ type_ "text"
                , value model.trainerSearchQuery
                , onInput SetTrainerSearchQuery
                , placeholder "Search trainers..."
                , class "input input-bordered input-xs w-full"
                ]
                []
            , if not (String.isEmpty model.trainerSearchQuery) && not (List.isEmpty model.filteredEncounters) then
                div [ class "absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded mt-1 max-h-48 overflow-y-auto z-10 shadow-lg" ]
                    (List.take 10 model.filteredEncounters
                        |> List.map
                            (\enc ->
                                button
                                    [ onClick (SelectFromSearchResults enc)
                                    , class "block w-full text-left p-2 hover:bg-base-300 text-xs"
                                    ]
                                    [ div [ class "font-medium" ] [ text (enc.trainerClass ++ " " ++ enc.trainerName) ]
                                    , div [ class "text-base-content/60" ] [ text enc.location ]
                                    ]
                            )
                    )

              else
                text ""
            ]
        , case encounter of
            Just enc ->
                div [ class "flex flex-col gap-2" ]
                    [ div [ class "text-sm" ]
                        [ span [ class "font-semibold text-base-content" ] [ text (String.trim (enc.trainerClass ++ " " ++ enc.trainerName)) ]
                        , if String.isEmpty enc.location then
                            text ""

                          else
                            span [ class "text-base-content/60" ] [ text (" · " ++ enc.location) ]
                        ]
                    , div [ class "grid grid-cols-6 gap-1.5" ]
                        (List.indexedMap (viewOpponentTile model) enc.team)
                    ]

            Nothing ->
                div [ class "text-xs text-base-content/60 text-center py-2" ] [ text "No trainer selected" ]
        ]


viewOpponentTile : Model -> Int -> TrainerPokemon -> Html Msg
viewOpponentTile model index trainerPokemon =
    let
        isCurrent =
            isCurrentDefender model trainerPokemon
    in
    button
        [ onClick (LoadTrainerToDefender index)
        , title (trainerPokemon.species ++ " L" ++ String.fromInt trainerPokemon.level)
        , class
            ("flex flex-col items-center justify-center gap-0.5 rounded-md border-2 bg-base-300 pt-1 pb-0.5 min-h-12 "
                ++ (if isCurrent then
                        "border-secondary bg-secondary/10"

                    else
                        "border-transparent hover:border-secondary/60"
                   )
            )
        ]
        [ viewPokemonIcon model.pokemonList trainerPokemon.species
        , span [ class "text-[10px] leading-none text-base-content/60 tabular-nums" ] [ text (String.fromInt trainerPokemon.level) ]
        ]


{-| The defender is a copy of a trainer's Pokemon, so "current" means same
species and level as the trainer entry.
-}
isCurrentDefender : Model -> TrainerPokemon -> Bool
isCurrentDefender model trainerPokemon =
    model.defender.species == trainerPokemon.species && model.defender.level == trainerPokemon.level


{-| The selected trainer's team as calc-ready states, in team order. Empty
when no trainer is selected (custom defender).
-}
opponentTeam : Model -> List PokemonState
opponentTeam model =
    getSelectedEncounter model
        |> Maybe.map (.team >> List.map trainerPokemonToState)
        |> Maybe.withDefault []


viewTeamBoxSection : Model -> Html Msg
viewTeamBoxSection model =
    div [ class "card bg-base-200 p-4 flex flex-col gap-4 lg:min-h-0 lg:h-full" ]
        [ viewTeamPanel model
        , viewBoxPanel model
        ]


{-| The box, as either a PC-style icon grid (sortable, Color Coded against
the current defender) or the matchup board (every team/box Pokemon against
every Pokemon on the opponent's team). Both fill the remaining height of the
roster card and scroll inside it.
-}
viewBoxPanel : Model -> Html Msg
viewBoxPanel model =
    let
        viewButton boxView labelText =
            button
                [ onClick (SetBoxView boxView)
                , class
                    ("join-item btn btn-xs "
                        ++ (if model.boxView == boxView then
                                "btn-active"

                            else
                                "btn-ghost"
                           )
                    )
                , attribute "aria-pressed"
                    (if model.boxView == boxView then
                        "true"

                     else
                        "false"
                    )
                ]
                [ text labelText ]
    in
    div (class "flex flex-col gap-2 lg:flex-1 lg:min-h-0" :: dropTargetAttributes BoxArea)
        [ div [ class "flex items-center gap-2 flex-wrap" ]
            [ button [ onClick ToggleBoxCollapsed, class "flex items-center gap-2 text-left" ]
                [ h3 [ class "text-sm font-semibold text-base-content/60" ] [ text "Box" ]
                , span [ class "text-xs text-base-content/60 tabular-nums" ] [ text (String.fromInt (List.length model.box)) ]
                , span [ class "text-xs text-base-content/60" ]
                    [ text
                        (if model.boxCollapsed then
                            "▼"

                         else
                            "▲"
                        )
                    ]
                ]
            , div [ class "join" ]
                [ viewButton BoxGrid "Grid"
                , viewButton BoxBoard "Board"
                ]
            , div [ class "flex-1" ] []
            , button
                [ onClick ToggleColorCode
                , class
                    (if model.colorCodeEnabled then
                        "btn btn-xs btn-info"

                     else
                        "btn btn-xs btn-outline btn-info"
                    )
                , attribute "aria-pressed"
                    (if model.colorCodeEnabled then
                        "true"

                     else
                        "false"
                    )
                , title
                    (if model.colorCodeEnabled then
                        "Turn off matchup colors"

                     else
                        "Color team and box by matchup against the current defender"
                    )
                ]
                [ text
                    (if model.colorCodeEnabled then
                        "Color Code: On"

                     else
                        "Color Code"
                    )
                ]
            , button [ class "btn btn-xs btn-ghost btn-circle", onClick ShowColorCodeHelp, attribute "aria-label" "What the colors mean" ] [ text "?" ]
            ]
        , if model.boxCollapsed then
            text ""

          else
            case model.boxView of
                BoxGrid ->
                    viewBoxGrid model

                BoxBoard ->
                    viewMatchupBoard model
        ]


viewBoxGrid : Model -> Html Msg
viewBoxGrid model =
    let
        sorted =
            sortBox model.boxSort
                (speedStat model.generation model.pokemonList model.natureList)
                (\i -> Dict.get i model.boxMatchupResults)
                model.box

        sortButton sort labelText =
            button
                [ onClick (SetBoxSort sort)
                , class
                    ("join-item btn btn-xs "
                        ++ (if model.boxSort == sort then
                                "btn-active"

                            else
                                "btn-ghost"
                           )
                    )
                , attribute "aria-pressed"
                    (if model.boxSort == sort then
                        "true"

                     else
                        "false"
                    )
                ]
                [ text labelText ]
    in
    div [ class "flex flex-col gap-2 lg:flex-1 lg:min-h-0" ]
        [ div [ class "flex items-center gap-2 flex-wrap" ]
            [ span [ class "text-xs text-base-content/60" ] [ text "Sort" ]
            , div [ class "join" ]
                [ sortButton SortBoxOrder "Box order"
                , sortButton SortMatchup "Matchup"
                , sortButton SortLevel "Level"
                , sortButton SortSpeed "Speed"
                ]
            ]
        , if List.isEmpty model.box then
            div [ class "text-xs text-base-content/60 text-center py-2" ] [ text "Box is empty. Use + Add to Box under Attacker Stats to save the current attacker." ]

          else
            div [ class "grid grid-cols-[repeat(auto-fill,minmax(3.25rem,1fr))] gap-1 p-0.5 overflow-y-auto max-h-60 lg:max-h-none lg:flex-1 lg:min-h-0 content-start" ]
                (List.map (\( i, pokemon ) -> viewRosterTile model (FromBox i) pokemon) sorted)
        , if model.colorCodeEnabled then
            viewColorCodeLegend

          else
            text ""
        ]


{-| Matchup board: rows are the team then the box, columns are the opponent's
team. Each cell is the best damage % that row deals over the worst % it takes,
tinted by Color Code tier. Clicking a cell loads that exact pairing.
-}
viewMatchupBoard : Model -> Html Msg
viewMatchupBoard model =
    let
        opponents =
            opponentTeam model

        rows =
            List.indexedMap (\i p -> ( FromTeam i, p )) model.team
                ++ List.indexedMap (\i p -> ( FromBox i, p )) model.box

        cellResult source j =
            case source of
                FromTeam i ->
                    Dict.get ( i, j ) model.teamBoardResults

                FromBox i ->
                    Dict.get ( i, j ) model.boardResults

        loadMsg source =
            case source of
                FromTeam i ->
                    LoadFromTeam i

                FromBox i ->
                    LoadFromBox i

        headerCell j opponent =
            th [ class "px-0.5 pb-1 font-normal align-bottom sticky top-0 bg-base-200 z-10" ]
                [ button
                    [ onClick (LoadTrainerToDefender j)
                    , class
                        ("flex flex-col items-center rounded px-1 py-0.5 w-full hover:bg-base-300 "
                            ++ (if List.any (\tp -> isCurrentDefender model tp) (getSelectedEncounter model |> Maybe.map .team |> Maybe.withDefault [] |> List.drop j |> List.take 1) then
                                    "text-secondary"

                                else
                                    ""
                               )
                        )
                    , title (opponent.species ++ " L" ++ String.fromInt opponent.level)
                    ]
                    [ viewPokemonIcon model.pokemonList opponent.species
                    , span [ class "text-[11px] leading-tight truncate max-w-[5.5rem]" ] [ text opponent.species ]
                    , span [ class "text-[10px] text-base-content/60 tabular-nums" ] [ text ("L" ++ String.fromInt opponent.level) ]
                    ]
                ]

        rowHeader source pokemon =
            th [ class "text-left font-normal pr-2 sticky left-0 bg-base-200 z-10" ]
                [ button
                    [ onClick (loadMsg source)
                    , class
                        ("flex items-center gap-1 rounded px-1 hover:bg-base-300 whitespace-nowrap "
                            ++ (if model.attackerSource == Just source then
                                    "text-primary"

                                else
                                    ""
                               )
                        )
                    , title ("Load " ++ pokemon.species ++ " as the attacker")
                    ]
                    [ span [ class "scale-75 -m-1" ] [ viewPokemonIcon model.pokemonList pokemon.species ]
                    , span [ class "text-xs" ] [ text pokemon.species ]
                    , span [ class "text-[10px] text-base-content/60 tabular-nums" ] [ text ("L" ++ String.fromInt pokemon.level) ]
                    ]
                ]

        cell source j opponent =
            td [ class "p-0" ]
                [ case cellResult source j of
                    Just r ->
                        let
                            isSelected =
                                model.attackerSource == Just source && model.defender.species == opponent.species && model.defender.level == opponent.level
                        in
                        button
                            [ onClick (SelectPairing source j)
                            , title (matchupTierLabel (matchupTier r) ++ " · deals " ++ String.fromInt (round r.bestDamagePercent) ++ "%, takes " ++ String.fromInt (round r.worstDamageTaken) ++ "%")
                            , class
                                ("w-full h-8 rounded border-2 font-mono text-[11px] tabular-nums flex items-center justify-center gap-0.5 "
                                    ++ matchupTierCellBackground (matchupTier r)
                                    ++ (if isSelected then
                                            " border-primary"

                                        else
                                            " border-transparent hover:border-primary/60"
                                       )
                                )
                            ]
                            [ span [] [ text (String.fromInt (round r.bestDamagePercent)) ]
                            , span [ class "text-base-content/40" ] [ text "/" ]
                            , span [ class "text-orange-400" ] [ text (String.fromInt (round r.worstDamageTaken)) ]
                            ]

                    Nothing ->
                        div [ class "w-full h-8 rounded bg-base-300/40 flex items-center justify-center text-[10px] text-base-content/40" ] [ text "…" ]
                ]

        row ( source, pokemon ) =
            tr [] (rowHeader source pokemon :: List.indexedMap (cell source) opponents)

        spacer =
            tr [] [ td [ colspan (List.length opponents + 1), class "h-2" ] [] ]
    in
    if List.isEmpty opponents then
        div [ class "text-xs text-base-content/60 text-center py-4" ] [ text "Pick a trainer to see the matchup board." ]

    else if List.isEmpty rows then
        div [ class "text-xs text-base-content/60 text-center py-4" ] [ text "Add Pokemon to your team or box to see matchups." ]

    else
        div [ class "flex flex-col gap-2 lg:flex-1 lg:min-h-0" ]
            [ div [ class "flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-base-content/60" ]
                (span [] [ text "Each cell: ", span [ class "text-base-content" ] [ text "best % dealt" ], text " / ", span [ class "text-orange-400" ] [ text "worst % taken" ] ]
                    :: List.map
                        (\tier ->
                            span [ class "inline-flex items-center gap-1" ]
                                [ span [ class ("inline-block w-2.5 h-2.5 rounded-sm " ++ matchupTierCellBackground tier) ] []
                                , text (matchupTierLabel tier)
                                ]
                        )
                        [ AlwaysOHKOs, MightOHKO, TradeOHKOs, MaybeTradeOHKOs, GetsOHKOd ]
                )
            , div [ class "overflow-auto max-h-96 lg:max-h-none lg:flex-1 lg:min-h-0" ]
                [ table [ class "border-separate border-spacing-0.5" ]
                    [ thead []
                        [ tr [] (th [ class "sticky left-0 top-0 bg-base-200 z-20" ] [] :: List.indexedMap headerCell opponents) ]
                    , tbody []
                        (List.map row (List.take (List.length model.team) rows)
                            ++ (if List.isEmpty model.team || List.isEmpty model.box then
                                    []

                                else
                                    [ spacer ]
                               )
                            ++ List.map row (List.drop (List.length model.team) rows)
                        )
                    ]
                ]
            ]


matchupTierCellBackground : MatchupTier -> String
matchupTierCellBackground tier =
    case tier of
        TradeOHKOs ->
            "bg-teal-400/25"

        MaybeTradeOHKOs ->
            "bg-orange-500/25"

        GetsOHKOd ->
            "bg-red-500/30"

        AlwaysOHKOs ->
            "bg-yellow-400/25"

        MightOHKO ->
            "bg-yellow-600/25"

        NoOHKO ->
            "bg-base-300"
