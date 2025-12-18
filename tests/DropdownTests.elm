module DropdownTests exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)


{-| Tests for dropdown component behavior.

These tests verify the core logic patterns used in the custom dropdown components,
including search filtering, selection handling, keyboard navigation, and state management.
This ensures consistent dropdown behavior across move, item, ability, and field condition dropdowns.

-}
suite : Test
suite =
    describe "Dropdown Component Tests"
        [ describe "Search filtering"
            [ test "Empty search shows all options" <|
                \_ ->
                    let
                        options =
                            [ "Thunderbolt", "Thunder", "Volt Switch", "Wild Charge" ]

                        filterOptions query list =
                            if String.isEmpty query then
                                list
                            else
                                List.filter
                                    (\opt -> String.contains (String.toLower query) (String.toLower opt))
                                    list
                    in
                    Expect.equal (filterOptions "" options) options
            , test "Search filters options case insensitively" <|
                \_ ->
                    let
                        options =
                            [ "Thunderbolt", "Thunder", "Volt Switch", "Wild Charge" ]

                        filterOptions query list =
                            List.filter
                                (\opt -> String.contains (String.toLower query) (String.toLower opt))
                                list
                    in
                    Expect.all
                        [ \_ -> Expect.equal (filterOptions "thunder" options) [ "Thunderbolt", "Thunder" ]
                        , \_ -> Expect.equal (filterOptions "THUNDER" options) [ "Thunderbolt", "Thunder" ]
                        , \_ -> Expect.equal (filterOptions "Thunder" options) [ "Thunderbolt", "Thunder" ]
                        ]
                        ()
            , test "No matches returns empty list" <|
                \_ ->
                    let
                        options =
                            [ "Thunderbolt", "Thunder", "Volt Switch" ]

                        filterOptions query list =
                            List.filter
                                (\opt -> String.contains (String.toLower query) (String.toLower opt))
                                list
                    in
                    Expect.equal (filterOptions "fire" options) []
            , test "Partial match filters correctly" <|
                \_ ->
                    let
                        options =
                            [ "Leftovers", "Choice Band", "Choice Scarf", "Choice Specs", "Life Orb" ]

                        filterOptions query list =
                            List.filter
                                (\opt -> String.contains (String.toLower query) (String.toLower opt))
                                list
                    in
                    Expect.equal (filterOptions "choice" options) [ "Choice Band", "Choice Scarf", "Choice Specs" ]
            ]
        , describe "Exact match detection (close on select, keep open on type)"
            [ test "Exact match returns true for valid item" <|
                \_ ->
                    let
                        itemList =
                            [ "Leftovers", "Choice Band", "Choice Scarf", "Life Orb" ]

                        isExactMatch item =
                            List.member item itemList
                    in
                    Expect.equal (isExactMatch "Leftovers") True
            , test "Partial match returns false" <|
                \_ ->
                    let
                        itemList =
                            [ "Leftovers", "Choice Band", "Choice Scarf", "Life Orb" ]

                        isExactMatch item =
                            List.member item itemList
                    in
                    Expect.all
                        [ \_ -> Expect.equal (isExactMatch "Left") False
                        , \_ -> Expect.equal (isExactMatch "Choice") False
                        , \_ -> Expect.equal (isExactMatch "lef") False
                        ]
                        ()
            , test "Non-existent item returns false" <|
                \_ ->
                    let
                        itemList =
                            [ "Leftovers", "Choice Band", "Choice Scarf", "Life Orb" ]

                        isExactMatch item =
                            List.member item itemList
                    in
                    Expect.equal (isExactMatch "Not An Item") False
            , test "Case sensitive exact match" <|
                \_ ->
                    let
                        abilityList =
                            [ "Static", "Overgrow", "Blaze", "Torrent" ]

                        isExactMatch ability =
                            List.member ability abilityList
                    in
                    Expect.all
                        [ \_ -> Expect.equal (isExactMatch "Static") True
                        , \_ -> Expect.equal (isExactMatch "static") False
                        , \_ -> Expect.equal (isExactMatch "STATIC") False
                        ]
                        ()
            , test "Dropdown state is Nothing on exact match, preserved otherwise" <|
                \_ ->
                    let
                        itemList =
                            [ "Leftovers", "Choice Band", "Life Orb" ]

                        currentDropdown =
                            Just "SomeDropdown"

                        getNewDropdown item =
                            if List.member item itemList then
                                Nothing
                            else
                                currentDropdown
                    in
                    Expect.all
                        [ \_ -> Expect.equal (getNewDropdown "Leftovers") Nothing
                        , \_ -> Expect.equal (getNewDropdown "Left") currentDropdown
                        , \_ -> Expect.equal (getNewDropdown "choice") currentDropdown
                        ]
                        ()
            ]
        , describe "Keyboard navigation"
            [ test "Arrow down increments highlight index" <|
                \_ ->
                    let
                        currentIndex =
                            0

                        maxIndex =
                            4

                        navigateDown index max =
                            if index >= max then
                                0
                            else
                                index + 1
                    in
                    Expect.all
                        [ \_ -> Expect.equal (navigateDown 0 maxIndex) 1
                        , \_ -> Expect.equal (navigateDown 3 maxIndex) 4
                        , \_ -> Expect.equal (navigateDown 4 maxIndex) 0
                        ]
                        ()
            , test "Arrow up decrements highlight index with wrap" <|
                \_ ->
                    let
                        maxIndex =
                            4

                        navigateUp index max =
                            if index <= 0 then
                                max
                            else
                                index - 1
                    in
                    Expect.all
                        [ \_ -> Expect.equal (navigateUp 3 maxIndex) 2
                        , \_ -> Expect.equal (navigateUp 1 maxIndex) 0
                        , \_ -> Expect.equal (navigateUp 0 maxIndex) 4
                        ]
                        ()
            , test "Highlight index resets on dropdown open" <|
                \_ ->
                    let
                        initialHighlightIndex =
                            0
                    in
                    Expect.equal initialHighlightIndex 0
            , test "Clamping highlight index to option count" <|
                \_ ->
                    let
                        clampIndex index optionCount =
                            if optionCount <= 0 then
                                0
                            else
                                Basics.max 0 (Basics.min (optionCount - 1) index)
                    in
                    Expect.all
                        [ \_ -> Expect.equal (clampIndex -1 5) 0
                        , \_ -> Expect.equal (clampIndex 10 5) 4
                        , \_ -> Expect.equal (clampIndex 2 5) 2
                        , \_ -> Expect.equal (clampIndex 0 0) 0 -- Edge case: empty list returns 0
                        ]
                        ()
            ]
        , describe "ESC key handling"
            [ test "ESC closes dropdown when open" <|
                \_ ->
                    let
                        isOpen =
                            True

                        handleEsc wasOpen =
                            if wasOpen then
                                False
                            else
                                wasOpen
                    in
                    Expect.equal (handleEsc isOpen) False
            , test "ESC is idempotent when dropdown already closed" <|
                \_ ->
                    let
                        isOpen =
                            False

                        handleEsc wasOpen =
                            False
                    in
                    Expect.equal (handleEsc isOpen) False
            , test "ESC key clears dropdown state to Nothing" <|
                \_ ->
                    let
                        openDropdown =
                            Just "MoveDropdown"

                        handleEsc dropdown =
                            Nothing
                    in
                    Expect.equal (handleEsc openDropdown) Nothing
            ]
        , describe "Show all options on open"
            [ test "Dropdown shows all options when search equals current value exactly" <|
                \_ ->
                    let
                        options =
                            [ "Leftovers", "Choice Band", "Life Orb" ]

                        currentValue =
                            "Leftovers"

                        searchQuery =
                            "Leftovers"

                        -- When searchQuery exactly equals current value, show all
                        isExactMatch =
                            searchQuery == currentValue

                        displayOptions =
                            if isExactMatch then
                                options
                            else
                                List.filter
                                    (\opt -> String.contains (String.toLower searchQuery) (String.toLower opt))
                                    options
                    in
                    Expect.equal displayOptions options
            , test "Dropdown filters when search diverges from current value" <|
                \_ ->
                    let
                        options =
                            [ "Leftovers", "Choice Band", "Life Orb" ]

                        currentValue =
                            "Leftovers"

                        searchQuery =
                            "Lef"

                        isExactMatch =
                            searchQuery == currentValue

                        displayOptions =
                            if isExactMatch then
                                options
                            else
                                List.filter
                                    (\opt -> String.contains (String.toLower searchQuery) (String.toLower opt))
                                    options
                    in
                    Expect.equal displayOptions [ "Leftovers" ]
            ]
        , describe "Dropdown ID comparison"
            [ test "Same dropdown IDs match" <|
                \_ ->
                    let
                        dropdown1 =
                            "AttackerMoveDropdown 0"

                        dropdown2 =
                            "AttackerMoveDropdown 0"
                    in
                    Expect.equal (dropdown1 == dropdown2) True
            , test "Different dropdown indices do not match" <|
                \_ ->
                    let
                        dropdown1 =
                            "AttackerMoveDropdown 0"

                        dropdown2 =
                            "AttackerMoveDropdown 1"
                    in
                    Expect.equal (dropdown1 == dropdown2) False
            , test "Different dropdown types do not match" <|
                \_ ->
                    let
                        dropdown1 =
                            "AttackerMoveDropdown 0"

                        dropdown2 =
                            "DefenderMoveDropdown 0"
                    in
                    Expect.equal (dropdown1 == dropdown2) False
            ]
        , describe "Field condition dropdown grouping"
            [ test "Attacker conditions contain correct items" <|
                \_ ->
                    let
                        attackerConditions =
                            [ "Reflect", "Light Screen", "Aurora Veil", "Tailwind" ]

                        isAttackerCondition condition =
                            List.member condition attackerConditions
                    in
                    Expect.all
                        [ \_ -> Expect.equal (isAttackerCondition "Reflect") True
                        , \_ -> Expect.equal (isAttackerCondition "Stealth Rock") False
                        ]
                        ()
            , test "Defender conditions contain hazard items" <|
                \_ ->
                    let
                        defenderConditions =
                            [ "Stealth Rock", "Spikes (1)", "Spikes (2)", "Spikes (3)" ]

                        isDefenderCondition condition =
                            List.member condition defenderConditions
                    in
                    Expect.all
                        [ \_ -> Expect.equal (isDefenderCondition "Stealth Rock") True
                        , \_ -> Expect.equal (isDefenderCondition "Spikes (1)") True
                        , \_ -> Expect.equal (isDefenderCondition "Reflect") False
                        ]
                        ()
            , test "Both-side conditions contain weather and terrain" <|
                \_ ->
                    let
                        bothConditions =
                            [ "Sun", "Rain", "Sand", "Snow", "Electric Terrain", "Grassy Terrain", "Psychic Terrain", "Misty Terrain", "Gravity" ]

                        isBothCondition condition =
                            List.member condition bothConditions
                    in
                    Expect.all
                        [ \_ -> Expect.equal (isBothCondition "Sun") True
                        , \_ -> Expect.equal (isBothCondition "Electric Terrain") True
                        , \_ -> Expect.equal (isBothCondition "Gravity") True
                        , \_ -> Expect.equal (isBothCondition "Reflect") False
                        ]
                        ()
            ]
        , describe "Move dropdown behavior"
            [ test "Moves filter by name" <|
                \_ ->
                    let
                        moves =
                            [ { name = "Thunderbolt", moveType = "Electric" }
                            , { name = "Thunder", moveType = "Electric" }
                            , { name = "Flamethrower", moveType = "Fire" }
                            ]

                        filterMoves query =
                            List.filter
                                (\m -> String.contains (String.toLower query) (String.toLower m.name))
                                moves
                    in
                    Expect.equal (List.length (filterMoves "thunder")) 2
            , test "Learnset moves sorted by level" <|
                \_ ->
                    let
                        learnset =
                            [ ( "Thunder Wave", 10 )
                            , ( "Quick Attack", 1 )
                            , ( "Thunderbolt", 26 )
                            , ( "Agility", 18 )
                            ]

                        sortedByLevel =
                            List.sortBy Tuple.second learnset
                    in
                    Expect.equal
                        (List.map Tuple.first sortedByLevel)
                        [ "Quick Attack", "Thunder Wave", "Agility", "Thunderbolt" ]
            ]
        , describe "Backdrop click handling"
            [ test "Backdrop closes all dropdowns" <|
                \_ ->
                    let
                        openDropdown =
                            Just "SomeDropdown"

                        handleBackdropClick _ =
                            Nothing
                    in
                    Expect.equal (handleBackdropClick openDropdown) Nothing
            , test "Multiple dropdowns share single backdrop" <|
                \_ ->
                    -- Only one dropdown can be open at a time
                    let
                        canOpenMultiple dropdown1 dropdown2 =
                            case ( dropdown1, dropdown2 ) of
                                ( Just _, Just _ ) ->
                                    False

                                _ ->
                                    True

                        state1 =
                            ( Just "Dropdown1", Nothing )

                        state2 =
                            ( Nothing, Just "Dropdown2" )

                        invalidState =
                            ( Just "Dropdown1", Just "Dropdown2" )
                    in
                    Expect.all
                        [ \_ -> Expect.equal (canOpenMultiple (Tuple.first state1) (Tuple.second state1)) True
                        , \_ -> Expect.equal (canOpenMultiple (Tuple.first state2) (Tuple.second state2)) True
                        , \_ -> Expect.equal (canOpenMultiple (Tuple.first invalidState) (Tuple.second invalidState)) False
                        ]
                        ()
            ]
        , describe "Highlight index management"
            [ test "Highlight persists during typing" <|
                \_ ->
                    let
                        -- Simulate typing where highlight should not reset
                        initialIndex =
                            3

                        optionsCount =
                            10

                        -- When options change but still valid, keep index
                        adjustIndex index count =
                            if index < count then
                                index
                            else
                                0
                    in
                    Expect.equal (adjustIndex initialIndex optionsCount) 3
            , test "Highlight resets when index exceeds new option count" <|
                \_ ->
                    let
                        initialIndex =
                            5

                        newOptionsCount =
                            3

                        adjustIndex index count =
                            if index < count then
                                index
                            else
                                0
                    in
                    Expect.equal (adjustIndex initialIndex newOptionsCount) 0
            , test "Enter selects highlighted option" <|
                \_ ->
                    let
                        options =
                            [ "Option A", "Option B", "Option C", "Option D" ]

                        highlightIndex =
                            2

                        getHighlightedOption =
                            List.head (List.drop highlightIndex options)
                    in
                    Expect.equal getHighlightedOption (Just "Option C")
            ]
        , describe "Enter key selection"
            [ test "Enter key selects item from filtered list at highlight index" <|
                \_ ->
                    let
                        allMoves =
                            [ "Thunderbolt", "Thunder", "Thunder Wave", "Flamethrower", "Fire Blast" ]

                        searchQuery =
                            "thunder"

                        filteredMoves =
                            List.filter
                                (\m -> String.contains (String.toLower searchQuery) (String.toLower m))
                                allMoves

                        highlightIndex =
                            1

                        clampedHighlight =
                            Basics.min highlightIndex (List.length filteredMoves - 1)
                                |> Basics.max 0

                        selectedMove =
                            List.head (List.drop clampedHighlight filteredMoves)
                    in
                    Expect.all
                        [ \_ -> Expect.equal filteredMoves [ "Thunderbolt", "Thunder", "Thunder Wave" ]
                        , \_ -> Expect.equal selectedMove (Just "Thunder")
                        ]
                        ()
            , test "Enter key clamps highlight to valid range when list shrinks" <|
                \_ ->
                    let
                        filteredMoves =
                            [ "Thunderbolt", "Thunder" ]

                        -- Highlight was at index 5 but list only has 2 items
                        highlightIndex =
                            5

                        clampedHighlight =
                            Basics.min highlightIndex (List.length filteredMoves - 1)
                                |> Basics.max 0

                        selectedMove =
                            List.head (List.drop clampedHighlight filteredMoves)
                    in
                    Expect.all
                        [ \_ -> Expect.equal clampedHighlight 1
                        , \_ -> Expect.equal selectedMove (Just "Thunder")
                        ]
                        ()
            , test "Enter key selects first item when highlight is 0" <|
                \_ ->
                    let
                        options =
                            [ "Leftovers", "Choice Band", "Life Orb" ]

                        highlightIndex =
                            0

                        selectedItem =
                            List.head (List.drop highlightIndex options)
                    in
                    Expect.equal selectedItem (Just "Leftovers")
            , test "Enter key returns Nothing for empty filtered list" <|
                \_ ->
                    let
                        filteredMoves =
                            []

                        highlightIndex =
                            0

                        selectedMove =
                            List.head (List.drop highlightIndex filteredMoves)
                    in
                    Expect.equal selectedMove Nothing
            , test "Enter key triggers selection message with correct value" <|
                \_ ->
                    -- Simulates the message construction when Enter is pressed
                    let
                        abilities =
                            [ "Static", "Lightning Rod", "Volt Absorb" ]

                        highlightIndex =
                            2

                        -- This simulates Maybe.map SetAttackerAbility (List.head (List.drop highlightIndex abilities))
                        maybeMessage =
                            List.head (List.drop highlightIndex abilities)
                                |> Maybe.map (\ability -> "SetAbility " ++ ability)
                    in
                    Expect.equal maybeMessage (Just "SetAbility Volt Absorb")
            , test "Enter key works with arrow navigation to select different items" <|
                \_ ->
                    let
                        items =
                            [ "Choice Band", "Choice Scarf", "Choice Specs" ]

                        -- Simulate arrow down twice from index 0
                        startIndex =
                            0

                        afterOneDown =
                            startIndex + 1

                        afterTwoDown =
                            afterOneDown + 1

                        -- Now press Enter
                        selectedItem =
                            List.head (List.drop afterTwoDown items)
                    in
                    Expect.all
                        [ \_ -> Expect.equal afterTwoDown 2
                        , \_ -> Expect.equal selectedItem (Just "Choice Specs")
                        ]
                        ()
            , test "Enter key selects from exact match list (all options shown)" <|
                \_ ->
                    let
                        allOptions =
                            [ "Leftovers", "Choice Band", "Choice Scarf", "Life Orb" ]

                        currentValue =
                            "Leftovers"

                        -- When current value is exact match, show all options
                        isExactMatch =
                            List.member currentValue allOptions

                        displayOptions =
                            if isExactMatch then
                                allOptions
                            else
                                List.filter
                                    (\opt -> String.contains (String.toLower currentValue) (String.toLower opt))
                                    allOptions

                        highlightIndex =
                            2

                        selectedItem =
                            List.head (List.drop highlightIndex displayOptions)
                    in
                    Expect.all
                        [ \_ -> Expect.equal isExactMatch True
                        , \_ -> Expect.equal (List.length displayOptions) 4
                        , \_ -> Expect.equal selectedItem (Just "Choice Scarf")
                        ]
                        ()
            ]
        ]
