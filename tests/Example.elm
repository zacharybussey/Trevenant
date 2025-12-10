module Example exposing (..)

import Expect exposing (Expectation)
import Test exposing (..)


suite : Test
suite =
    describe "Basic tests"
        [ test "addition works" <|
            \_ ->
                Expect.equal (2 + 2) 4
        ]
