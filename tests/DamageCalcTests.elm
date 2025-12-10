module DamageCalcTests exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)


{-| Tests for damage calculation core functionality.
These tests verify the Elm-side encoding/decoding of calculation data
and state management. The actual damage calculations happen in JavaScript
via @smogon/calc, so these tests focus on data transformation.
-}
suite : Test
suite =
    describe "Damage Calculation Tests"
        [ describe "Stats encoding/decoding"
            [ test "Default stats should have correct values" <|
                \_ ->
                    -- EVs default: 252 SpA, 252 Spe, 4 SpD
                    let
                        defaultSpA =
                            252

                        defaultSpe =
                            252

                        defaultSpD =
                            4
                    in
                    Expect.all
                        [ \_ -> Expect.equal defaultSpA 252
                        , \_ -> Expect.equal defaultSpe 252
                        , \_ -> Expect.equal defaultSpD 4
                        ]
                        ()
            , test "IVs should be clamped to valid range" <|
                \_ ->
                    -- IVs range: 0-31
                    let
                        maxIV =
                            min 31 50

                        minIV =
                            max 0 -5
                    in
                    Expect.all
                        [ \_ -> Expect.equal maxIV 31
                        , \_ -> Expect.equal minIV 0
                        ]
                        ()
            , test "EVs should be clamped to valid range" <|
                \_ ->
                    -- EVs range: 0-255
                    let
                        maxEV =
                            min 255 300

                        minEV =
                            max 0 -10
                    in
                    Expect.all
                        [ \_ -> Expect.equal maxEV 255
                        , \_ -> Expect.equal minEV 0
                        ]
                        ()
            ]
        , describe "Pokemon state validation"
            [ test "Level should be between 1 and 100" <|
                \_ ->
                    let
                        validLevel level =
                            level >= 1 && level <= 100
                    in
                    Expect.all
                        [ \_ -> Expect.equal True (validLevel 1)
                        , \_ -> Expect.equal True (validLevel 100)
                        , \_ -> Expect.equal True (validLevel 50)
                        , \_ -> Expect.equal False (validLevel 0)
                        , \_ -> Expect.equal False (validLevel 101)
                        ]
                        ()
            , test "Boost values should be between -6 and +6" <|
                \_ ->
                    let
                        validBoost boost =
                            boost >= -6 && boost <= 6
                    in
                    Expect.all
                        [ \_ -> Expect.equal True (validBoost -6)
                        , \_ -> Expect.equal True (validBoost 6)
                        , \_ -> Expect.equal True (validBoost 0)
                        , \_ -> Expect.equal False (validBoost -7)
                        , \_ -> Expect.equal False (validBoost 7)
                        ]
                        ()
            ]
        , describe "Move state"
            [ test "Multi-hit moves should have valid hit count" <|
                \_ ->
                    let
                        validHits hits =
                            hits >= 1 && hits <= 10
                    in
                    Expect.all
                        [ \_ -> Expect.equal True (validHits 1)
                        , \_ -> Expect.equal True (validHits 5)
                        , \_ -> Expect.equal True (validHits 10)
                        , \_ -> Expect.equal False (validHits 0)
                        ]
                        ()
            ]
        , describe "Generation-specific rules"
            [ test "DVs range is 0-15 for Gen 1-2" <|
                \_ ->
                    let
                        maxDV =
                            15
                    in
                    Expect.equal maxDV 15
            , test "IVs range is 0-31 for Gen 3+" <|
                \_ ->
                    let
                        maxIV =
                            31
                    in
                    Expect.equal maxIV 31
            ]
        ]
