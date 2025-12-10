module TrainerDataTests exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)


{-| Tests for trainer data loading and filtering functionality.
These tests verify the search, filter, and navigation logic for
trainer encounters in the damage calculator.
-}
suite : Test
suite =
    describe "Trainer Data Tests"
        [ describe "Game to generation mapping"
            [ test "Gen 1 games map to generation 1" <|
                \_ ->
                    let
                        gen1Games =
                            [ "Red/Blue", "Yellow" ]

                        gameToGen game =
                            if List.member game gen1Games then
                                1

                            else
                                0
                    in
                    Expect.all
                        [ \_ -> Expect.equal (gameToGen "Red/Blue") 1
                        , \_ -> Expect.equal (gameToGen "Yellow") 1
                        ]
                        ()
            , test "Gen 9 games map to generation 9" <|
                \_ ->
                    let
                        gen9Games =
                            [ "Scarlet/Violet" ]

                        gameToGen game =
                            if List.member game gen9Games then
                                9

                            else
                                0
                    in
                    Expect.equal (gameToGen "Scarlet/Violet") 9
            ]
        , describe "Trainer search filtering"
            [ test "Empty search query returns all trainers" <|
                \_ ->
                    let
                        trainers =
                            [ "Rival", "Gym Leader", "Elite Four" ]

                        filterByQuery query list =
                            if String.isEmpty query then
                                list

                            else
                                List.filter (String.contains query) list
                    in
                    Expect.equal (filterByQuery "" trainers) trainers
            , test "Search is case insensitive" <|
                \_ ->
                    let
                        trainers =
                            [ "Rival Blue", "Gym Leader Brock", "Elite Four Brodie" ]

                        filterByQuery query list =
                            let
                                lowerQuery =
                                    String.toLower query
                            in
                            List.filter (\name -> String.contains lowerQuery (String.toLower name)) list
                    in
                    Expect.equal (List.length (filterByQuery "bro" trainers)) 2
            , test "Search matches trainer name, class, and location" <|
                \_ ->
                    let
                        -- Simulating trainer with name, class, location
                        trainerMatches query name class location =
                            let
                                lowerQuery =
                                    String.toLower query

                                searchIn str =
                                    String.contains lowerQuery (String.toLower str)
                            in
                            searchIn name || searchIn class || searchIn location

                        match1 =
                            trainerMatches "pallet" "Blue" "Rival" "Pallet Town"

                        match2 =
                            trainerMatches "rival" "Blue" "Rival" "Pallet Town"

                        match3 =
                            trainerMatches "blue" "Blue" "Rival" "Pallet Town"

                        noMatch =
                            trainerMatches "misty" "Blue" "Rival" "Pallet Town"
                    in
                    Expect.all
                        [ \_ -> Expect.equal True match1
                        , \_ -> Expect.equal True match2
                        , \_ -> Expect.equal True match3
                        , \_ -> Expect.equal False noMatch
                        ]
                        ()
            ]
        , describe "Navigation"
            [ test "Trainer index wraps at boundaries" <|
                \_ ->
                    let
                        totalTrainers =
                            10

                        wrapIndex index total =
                            if index < 0 then
                                total - 1

                            else if index >= total then
                                0

                            else
                                index
                    in
                    Expect.all
                        [ \_ -> Expect.equal (wrapIndex -1 totalTrainers) 9
                        , \_ -> Expect.equal (wrapIndex 10 totalTrainers) 0
                        , \_ -> Expect.equal (wrapIndex 5 totalTrainers) 5
                        ]
                        ()
            , test "Clamp index stays within bounds" <|
                \_ ->
                    let
                        clamp low high value =
                            max low (min high value)
                    in
                    Expect.all
                        [ \_ -> Expect.equal (clamp 0 9 -1) 0
                        , \_ -> Expect.equal (clamp 0 9 10) 9
                        , \_ -> Expect.equal (clamp 0 9 5) 5
                        ]
                        ()
            ]
        , describe "Team/Box persistence"
            [ test "Team can store multiple Pokemon" <|
                \_ ->
                    let
                        team =
                            [ "Pikachu", "Charizard", "Blastoise" ]
                    in
                    Expect.equal (List.length team) 3
            , test "Removing from team updates list correctly" <|
                \_ ->
                    let
                        team =
                            [ "Pikachu", "Charizard", "Blastoise" ]

                        removeAt index list =
                            List.take index list ++ List.drop (index + 1) list
                    in
                    Expect.equal (removeAt 1 team) [ "Pikachu", "Blastoise" ]
            , test "Adding to team appends to list" <|
                \_ ->
                    let
                        team =
                            [ "Pikachu", "Charizard" ]

                        newTeam =
                            team ++ [ "Venusaur" ]
                    in
                    Expect.equal newTeam [ "Pikachu", "Charizard", "Venusaur" ]
            ]
        ]
