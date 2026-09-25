module Helpers exposing (..)

import Types exposing (..)



-- VALIDATION HELPERS
-- FORMATTING HELPERS
-- STATS HELPERS
-- GAME/GENERATION HELPERS
-- STARTER POKEMON HELPERS
-- TRAINER HELPERS


findEncounterIndex : TrainerEncounter -> List TrainerEncounter -> Maybe Int
findEncounterIndex target encounters =
    encounters
        |> List.indexedMap Tuple.pair
        |> List.filter (\( _, encounter ) -> encounter.id == target.id)
        |> List.head
        |> Maybe.map Tuple.first



-- EVOLUTION HELPERS


{-| Evolve a Pokemon into targetSpecies, keeping everything the player set up
(level, nature, IVs/EVs, item, moves). An evolved mon keeps its moveset in game,

so clearing moves here forced players to re-enter all four after every evolution.

The ability is carried over by slot: if the evolution can have the current ability

it is kept, otherwise the ability in the same slot (1 / 2 / hidden) of the evolved

species is used, matching how abilities transfer on evolution in the games. Falls

back to the evolution's first ability, or the current ability if no data is loaded.

-}
evolvePokemon : List PokemonData -> String -> PokemonState -> PokemonState
evolvePokemon pokemonList targetSpecies pokemon =
    let
        abilitiesOf name =
            pokemonList
                |> List.filter (\p -> p.name == name)
                |> List.head
                |> Maybe.map .abilities
                |> Maybe.withDefault []

        fromAbilities =
            abilitiesOf pokemon.species

        toAbilities =
            abilitiesOf targetSpecies

        slotIndex =
            fromAbilities
                |> List.indexedMap Tuple.pair
                |> List.filter (\( _, a ) -> a == pokemon.ability)
                |> List.head
                |> Maybe.map Tuple.first

        newAbility =
            if List.isEmpty toAbilities || List.member pokemon.ability toAbilities then
                pokemon.ability

            else
                case slotIndex |> Maybe.andThen (\i -> List.head (List.drop i toAbilities)) of
                    Just ability ->
                        ability

                    Nothing ->
                        List.head toAbilities |> Maybe.withDefault pokemon.ability
    in
    { pokemon | species = targetSpecies, ability = newAbility }


{-| Whether Terastallization exists in this game. It's a Gen 9 mechanic, but
ROM hacks on the Gen 9 engine don't necessarily have it: Black Pearl doesn't.
-}
gameHasTera : String -> Int -> Bool
gameHasTera game generation =
    generation >= 9 && game /= "Black Pearl"



-- BATTLE STATE HELPERS


{-| Everything that only lasts for one battle: stat stages, status, current
HP, Tera and Dynamax. Level, item, moves, nature and stats stay.
-}
clearBattleState : PokemonState -> PokemonState
clearBattleState pokemon =
    { pokemon
        | boosts = defaultStats
        , status = ""
        , curHP = 100
        , teraType = ""
        , isDynamaxed = False
    }


{-| A trainer's Pokemon holding its own Mega Stone battles as the Mega form:
the species switches and the Mega's ability replaces the base one. Any other
item, or a stone for a different species, changes nothing. Applied wherever a
trainer's Pokemon becomes the defender, including the matchup board columns,
so Color Code and the board see the same Pokemon the calc does.
-}
applyMegaStone : List MegaStone -> List PokemonData -> PokemonState -> PokemonState
applyMegaStone stones pokemonList pokemon =
    let
        matches stone =
            String.toLower stone.item == String.toLower pokemon.item && stone.from == pokemon.species
    in
    case List.head (List.filter matches stones) of
        Just stone ->
            let
                megaAbility =
                    pokemonList
                        |> List.filter (\p -> p.name == stone.to)
                        |> List.head
                        |> Maybe.andThen (.abilities >> List.head)
                        |> Maybe.withDefault pokemon.ability
            in
            { pokemon | species = stone.to, ability = megaAbility }

        Nothing ->
            pokemon



-- ROSTER HELPERS (team / box)


rosterGet : PokemonSource -> Roster -> Maybe PokemonState
rosterGet source roster =
    case source of
        FromTeam i ->
            List.head (List.drop i roster.team)

        FromBox i ->
            List.head (List.drop i roster.box)


listSet : Int -> a -> List a -> List a
listSet index value list =
    List.indexedMap
        (\i x ->
            if i == index then
                value

            else
                x
        )
        list


listRemove : Int -> List a -> List a
listRemove index list =
    List.take index list ++ List.drop (index + 1) list


rosterSet : PokemonSource -> PokemonState -> Roster -> Roster
rosterSet source pokemon roster =
    case source of
        FromTeam i ->
            { roster | team = listSet i pokemon roster.team }

        FromBox i ->
            { roster | box = listSet i pokemon roster.box }


{-| Swap the Pokemon at two roster positions (team or box, any combination).

The loaded attacker follows its Pokemon to the new position.

-}
swapInRoster : PokemonSource -> PokemonSource -> Roster -> Roster
swapInRoster a b roster =
    case ( rosterGet a roster, rosterGet b roster ) of
        ( Just pokemonA, Just pokemonB ) ->
            if a == b then
                roster

            else
                let
                    swapped =
                        roster |> rosterSet a pokemonB |> rosterSet b pokemonA
                in
                { swapped
                    | attackerSource =
                        if roster.attackerSource == Just a then
                            Just b

                        else if roster.attackerSource == Just b then
                            Just a

                        else
                            roster.attackerSource
                }

        _ ->
            roster


{-| Remove the Pokemon at `from` and append it to the end of the team or box.

Moving into a full team (6) from the box does nothing. Indices after the removed

Pokemon shift down, and the loaded attacker keeps pointing at the same Pokemon.

-}
moveToEnd : PokemonSource -> Bool -> Roster -> Roster
moveToEnd from toTeam roster =
    case rosterGet from roster of
        Nothing ->
            roster

        Just pokemon ->
            let
                removed =
                    case from of
                        FromTeam i ->
                            { roster | team = listRemove i roster.team }

                        FromBox i ->
                            { roster | box = listRemove i roster.box }

                destination =
                    if toTeam then
                        FromTeam (List.length removed.team)

                    else
                        FromBox (List.length removed.box)

                shift source =
                    case ( from, source ) of
                        ( FromTeam removedIndex, FromTeam i ) ->
                            if i > removedIndex then
                                FromTeam (i - 1)

                            else
                                source

                        ( FromBox removedIndex, FromBox i ) ->
                            if i > removedIndex then
                                FromBox (i - 1)

                            else
                                source

                        _ ->
                            source

                appended =
                    if toTeam then
                        { removed | team = removed.team ++ [ pokemon ] }

                    else
                        { removed | box = removed.box ++ [ pokemon ] }
            in
            if toTeam && List.length removed.team >= 6 then
                roster

            else
                { appended
                    | attackerSource =
                        roster.attackerSource
                            |> Maybe.map
                                (\source ->
                                    if source == from then
                                        destination

                                    else
                                        shift source
                                )
                }


{-| True when `toTeam` names the list the Pokemon at `from` is already in.
-}
isInList : PokemonSource -> Bool -> Bool
isInList from toTeam =
    case from of
        FromTeam _ ->
            toTeam

        FromBox _ ->
            not toTeam


{-| Apply a drag-and-drop of the Pokemon at `from` onto `target`.

  - Dropping on an occupied slot swaps the two Pokemon. This covers reordering the
    team to line up with the opponent, and replacing a team member with a box
    Pokemon in one drag (the team member takes the box Pokemon's old spot).
  - Dropping on an empty team slot or the team area moves a box Pokemon to the end
    of the team, if the team has fewer than 6.
  - Dropping on the box area moves a team Pokemon to the end of the box.
  - Dropping into empty space of the list the Pokemon is already in does nothing.

-}
dropPokemon : PokemonSource -> DropTarget -> Roster -> Roster
dropPokemon from target roster =
    let
        toEnd toTeam =
            if isInList from toTeam then
                roster

            else
                moveToEnd from toTeam roster

        toSlot slot toTeam =
            case rosterGet slot roster of
                Just _ ->
                    swapInRoster from slot roster

                Nothing ->
                    toEnd toTeam
    in
    case target of
        TeamSlot i ->
            toSlot (FromTeam i) True

        BoxSlot i ->
            toSlot (FromBox i) False

        TeamArea ->
            toEnd True

        BoxArea ->
            toEnd False



-- MATCHUP HELPERS (Color Code)


matchupTier : BoxMatchupResult -> MatchupTier
matchupTier result =
    if result.canOHKO && result.getsOHKOd then
        TradeOHKOs

    else if result.mightOHKO && result.mightGetOHKOd then
        MaybeTradeOHKOs

    else if result.getsOHKOd || result.mightGetOHKOd then
        GetsOHKOd

    else if result.canOHKO then
        AlwaysOHKOs

    else if result.mightOHKO then
        MightOHKO

    else
        NoOHKO


{-| Best-first order for the Matchup sort: safe OHKOs first, then trades, then

neutral, and Pokemon that get OHKO'd last. Pokemon without a result sort last.

-}
matchupTierRank : Maybe BoxMatchupResult -> Int
matchupTierRank maybeResult =
    case Maybe.map matchupTier maybeResult of
        Just AlwaysOHKOs ->
            0

        Just MightOHKO ->
            1

        Just TradeOHKOs ->
            2

        Just NoOHKO ->
            3

        Just MaybeTradeOHKOs ->
            4

        Just GetsOHKOd ->
            5

        Nothing ->
            6


matchupTierLabel : MatchupTier -> String
matchupTierLabel tier =
    case tier of
        TradeOHKOs ->
            "Both OHKO each other"

        MaybeTradeOHKOs ->
            "Both might OHKO"

        GetsOHKOd ->
            "Gets OHKO'd"

        AlwaysOHKOs ->
            "Always OHKOs"

        MightOHKO ->
            "Might OHKO"

        NoOHKO ->
            "No OHKOs"



-- STAT HELPERS


{-| Unboosted Speed stat, used to sort the box by Speed.

Gen 3+ uses IVs, EVs and nature; Gen 1-2 use DVs (0-15) and stat experience.

-}
speedStat : Int -> List PokemonData -> List NatureData -> PokemonState -> Int
speedStat generation pokemonList natureList pokemon =
    case pokemonList |> List.filter (\p -> p.name == pokemon.species) |> List.head of
        Nothing ->
            0

        Just data ->
            let
                base =
                    data.baseStats.spe

                level =
                    pokemon.level
            in
            if generation <= 2 then
                let
                    statExpTerm =
                        floor (sqrt (toFloat (clamp 0 65535 pokemon.evs.spe))) // 4
                in
                ((2 * (base + clamp 0 15 pokemon.ivs.spe) + statExpTerm) * level) // 100 + 5

            else
                let
                    raw =
                        ((2 * base + pokemon.ivs.spe + pokemon.evs.spe // 4) * level) // 100 + 5

                    nature =
                        natureList |> List.filter (\n -> n.name == pokemon.nature) |> List.head
                in
                case nature of
                    Just n ->
                        if n.plus == "spe" && n.minus /= "spe" then
                            floor (toFloat raw * 1.1)

                        else if n.minus == "spe" && n.plus /= "spe" then
                            floor (toFloat raw * 0.9)

                        else
                            raw

                    Nothing ->
                        raw


{-| Box Pokemon paired with their real box index, in display order for the sort.

Sorting only changes the display; actions and drags still use the real index.

Ties keep box order.

-}
sortBox : BoxSort -> (PokemonState -> Int) -> (Int -> Maybe BoxMatchupResult) -> List PokemonState -> List ( Int, PokemonState )
sortBox sort speedOf matchupOf box =
    let
        indexed =
            List.indexedMap Tuple.pair box
    in
    case sort of
        SortBoxOrder ->
            indexed

        SortLevel ->
            List.sortBy (\( i, p ) -> ( negate p.level, i )) indexed

        SortSpeed ->
            List.sortBy (\( i, p ) -> ( negate (speedOf p), i )) indexed

        SortMatchup ->
            List.sortBy
                (\( i, _ ) ->
                    let
                        result =
                            matchupOf i
                    in
                    ( matchupTierRank result
                    , negate (result |> Maybe.map .bestDamagePercent |> Maybe.withDefault 0)
                    , i
                    )
                )
                indexed



-- Helper function to check if a move name exists in the move list


isValidMove : String -> List MoveData -> Bool
isValidMove moveName moveList =
    if String.isEmpty moveName then
        False

    else
        List.any (\move -> move.name == moveName) moveList


isRegionalForm : String -> Bool
isRegionalForm formName =
    String.contains "-Alola" formName
        || String.contains "-Galar" formName
        || String.contains "-Hisui" formName
        || String.contains "-Paldea" formName


getNonRegionalForms : List String -> List String
getNonRegionalForms forms =
    List.filter (\form -> not (isRegionalForm form)) forms


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

        "Black2/White2" ->
            5

        "X/Y" ->
            6

        "OmegaRuby/AlphaSapphire" ->
            6

        "Sun/Moon" ->
            7

        "UltraSun/UltraMoon" ->
            7

        "Sword/Shield" ->
            8

        "BrilliantDiamond/ShiningPearl" ->
            8

        "Scarlet/Violet" ->
            9

        "Black Pearl" ->
            9

        _ ->
            9


filterEncounters : String -> List TrainerEncounter -> List TrainerEncounter
filterEncounters query encounters =
    if String.isEmpty query then
        encounters

    else
        let
            lowerQuery =
                String.toLower query
        in
        List.filter
            (\encounter ->
                String.contains lowerQuery (String.toLower encounter.trainerName)
                    || String.contains lowerQuery (String.toLower encounter.trainerClass)
                    || String.contains lowerQuery (String.toLower encounter.location)
                    || List.any
                        (\pokemon ->
                            String.contains lowerQuery (String.toLower pokemon.species)
                        )
                        encounter.team
            )
            encounters


formatDamagePercent : ( Float, Float ) -> String
formatDamagePercent ( minP, maxP ) =
    String.fromFloat (toFloat (round (minP * 10)) / 10)
        ++ " - "
        ++ String.fromFloat (toFloat (round (maxP * 10)) / 10)
        ++ "%"


getPlayerStarterFromRival : Int -> String -> String
getPlayerStarterFromRival generation rivalPokemon =
    case generation of
        1 ->
            -- Gen 1: Rival picks type advantage
            case rivalPokemon of
                "Charmander" ->
                    "Bulbasaur"

                "Squirtle" ->
                    "Charmander"

                "Bulbasaur" ->
                    "Squirtle"

                "Charmeleon" ->
                    "Bulbasaur"

                "Wartortle" ->
                    "Charmander"

                "Ivysaur" ->
                    "Squirtle"

                "Charizard" ->
                    "Bulbasaur"

                "Blastoise" ->
                    "Charmander"

                "Venusaur" ->
                    "Squirtle"

                _ ->
                    "Bulbasaur"

        2 ->
            -- Gen 2: Rival picks type advantage
            case rivalPokemon of
                "Cyndaquil" ->
                    "Chikorita"

                "Totodile" ->
                    "Cyndaquil"

                "Chikorita" ->
                    "Totodile"

                "Quilava" ->
                    "Chikorita"

                "Croconaw" ->
                    "Cyndaquil"

                "Bayleef" ->
                    "Totodile"

                "Typhlosion" ->
                    "Chikorita"

                "Feraligatr" ->
                    "Cyndaquil"

                "Meganium" ->
                    "Totodile"

                _ ->
                    "Cyndaquil"

        3 ->
            -- Gen 3: Rival picks type weakness (in RSE/FRLG)
            case rivalPokemon of
                "Treecko" ->
                    "Mudkip"

                "Torchic" ->
                    "Treecko"

                "Mudkip" ->
                    "Torchic"

                "Grovyle" ->
                    "Mudkip"

                "Combusken" ->
                    "Treecko"

                "Marshtomp" ->
                    "Torchic"

                "Sceptile" ->
                    "Mudkip"

                "Blaziken" ->
                    "Treecko"

                "Swampert" ->
                    "Torchic"

                -- FRLG uses Gen 1 starters
                "Charmander" ->
                    "Bulbasaur"

                "Squirtle" ->
                    "Charmander"

                "Bulbasaur" ->
                    "Squirtle"

                "Charizard" ->
                    "Bulbasaur"

                "Blastoise" ->
                    "Charmander"

                "Venusaur" ->
                    "Squirtle"

                _ ->
                    "Treecko"

        4 ->
            -- Gen 4
            case rivalPokemon of
                "Turtwig" ->
                    "Chimchar"

                "Chimchar" ->
                    "Piplup"

                "Piplup" ->
                    "Turtwig"

                "Grotle" ->
                    "Chimchar"

                "Monferno" ->
                    "Piplup"

                "Prinplup" ->
                    "Turtwig"

                "Torterra" ->
                    "Chimchar"

                "Infernape" ->
                    "Piplup"

                "Empoleon" ->
                    "Turtwig"

                -- HGSS uses Gen 2 starters
                "Cyndaquil" ->
                    "Chikorita"

                "Totodile" ->
                    "Cyndaquil"

                "Chikorita" ->
                    "Totodile"

                _ ->
                    "Turtwig"

        5 ->
            case rivalPokemon of
                "Snivy" ->
                    "Tepig"

                "Tepig" ->
                    "Oshawott"

                "Oshawott" ->
                    "Snivy"

                "Servine" ->
                    "Tepig"

                "Pignite" ->
                    "Oshawott"

                "Dewott" ->
                    "Snivy"

                "Serperior" ->
                    "Tepig"

                "Emboar" ->
                    "Oshawott"

                "Samurott" ->
                    "Snivy"

                _ ->
                    "Snivy"

        6 ->
            case rivalPokemon of
                "Chespin" ->
                    "Fennekin"

                "Fennekin" ->
                    "Froakie"

                "Froakie" ->
                    "Chespin"

                "Quilladin" ->
                    "Fennekin"

                "Braixen" ->
                    "Froakie"

                "Frogadier" ->
                    "Chespin"

                "Chesnaught" ->
                    "Fennekin"

                "Delphox" ->
                    "Froakie"

                "Greninja" ->
                    "Chespin"

                -- ORAS
                "Treecko" ->
                    "Mudkip"

                "Torchic" ->
                    "Treecko"

                "Mudkip" ->
                    "Torchic"

                _ ->
                    "Chespin"

        7 ->
            case rivalPokemon of
                "Rowlet" ->
                    "Litten"

                "Litten" ->
                    "Popplio"

                "Popplio" ->
                    "Rowlet"

                "Dartrix" ->
                    "Litten"

                "Torracat" ->
                    "Popplio"

                "Brionne" ->
                    "Rowlet"

                "Decidueye" ->
                    "Litten"

                "Incineroar" ->
                    "Popplio"

                "Primarina" ->
                    "Rowlet"

                _ ->
                    "Rowlet"

        8 ->
            case rivalPokemon of
                "Grookey" ->
                    "Scorbunny"

                "Scorbunny" ->
                    "Sobble"

                "Sobble" ->
                    "Grookey"

                "Thwackey" ->
                    "Scorbunny"

                "Raboot" ->
                    "Sobble"

                "Drizzile" ->
                    "Grookey"

                "Rillaboom" ->
                    "Scorbunny"

                "Cinderace" ->
                    "Sobble"

                "Inteleon" ->
                    "Grookey"

                -- BDSP
                "Turtwig" ->
                    "Chimchar"

                "Chimchar" ->
                    "Piplup"

                "Piplup" ->
                    "Turtwig"

                _ ->
                    "Grookey"

        9 ->
            case rivalPokemon of
                "Sprigatito" ->
                    "Fuecoco"

                "Fuecoco" ->
                    "Quaxly"

                "Quaxly" ->
                    "Sprigatito"

                "Floragato" ->
                    "Fuecoco"

                "Crocalor" ->
                    "Quaxly"

                "Quaxwell" ->
                    "Sprigatito"

                "Meowscarada" ->
                    "Fuecoco"

                "Skeledirge" ->
                    "Quaxly"

                "Quaquaval" ->
                    "Sprigatito"

                -- Black Pearl ROM hack: Player gets Porygon vs Cynthia's Gible
                "Gible" ->
                    "Porygon"

                _ ->
                    "Sprigatito"

        _ ->
            "Pikachu"


getStarterMoves : String -> List MoveState
getStarterMoves species =
    let
        moveName1 =
            case species of
                -- Gen 1
                "Bulbasaur" ->
                    "Tackle"

                "Charmander" ->
                    "Scratch"

                "Squirtle" ->
                    "Tackle"

                -- Gen 2
                "Chikorita" ->
                    "Tackle"

                "Cyndaquil" ->
                    "Tackle"

                "Totodile" ->
                    "Scratch"

                -- Gen 3
                "Treecko" ->
                    "Pound"

                "Torchic" ->
                    "Scratch"

                "Mudkip" ->
                    "Tackle"

                -- Gen 4
                "Turtwig" ->
                    "Tackle"

                "Chimchar" ->
                    "Scratch"

                "Piplup" ->
                    "Pound"

                -- Gen 5
                "Snivy" ->
                    "Tackle"

                "Tepig" ->
                    "Tackle"

                "Oshawott" ->
                    "Tackle"

                -- Gen 6
                "Chespin" ->
                    "Tackle"

                "Fennekin" ->
                    "Scratch"

                "Froakie" ->
                    "Pound"

                -- Gen 7
                "Rowlet" ->
                    "Tackle"

                "Litten" ->
                    "Scratch"

                "Popplio" ->
                    "Pound"

                -- Gen 8
                "Grookey" ->
                    "Scratch"

                "Scorbunny" ->
                    "Tackle"

                "Sobble" ->
                    "Pound"

                -- Gen 9
                "Sprigatito" ->
                    "Scratch"

                "Fuecoco" ->
                    "Tackle"

                "Quaxly" ->
                    "Pound"

                _ ->
                    "Tackle"
    in
    [ { name = moveName1, isCrit = False, hits = 1 }
    , { name = "", isCrit = False, hits = 1 }
    , { name = "", isCrit = False, hits = 1 }
    , { name = "", isCrit = False, hits = 1 }
    ]


trainerPokemonToState : TrainerPokemon -> PokemonState
trainerPokemonToState pokemon =
    let
        -- Convert trainer's move list to MoveState list
        moves =
            List.take 4 pokemon.moves
                |> List.map
                    (\moveName ->
                        { name =
                            if moveName == "No Move" then
                                ""

                            else
                                moveName
                        , isCrit = False
                        , hits = 1
                        }
                    )

        -- Pad with empty moves if less than 4
        paddedMoves =
            moves ++ List.repeat (4 - List.length moves) defaultMove
    in
    { species = pokemon.species
    , level = pokemon.level
    , nature =
        if String.isEmpty pokemon.nature then
            "Hardy"

        else
            pokemon.nature
    , ability = pokemon.ability
    , item = pokemon.item
    , evs = pokemon.evs
    , ivs = pokemon.ivs
    , boosts = defaultStats
    , status = ""
    , curHP = 100
    , teraType = ""
    , isDynamaxed = False
    , moves = paddedMoves
    }
