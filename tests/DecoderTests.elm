module DecoderTests exposing (..)

import Decoders exposing (boxMatchupResultDecoder)
import Expect
import Json.Decode as Decode
import Test exposing (..)


{-| Tests for the port decoders that carry calculation results back from
index.js.

The matchup result is used for two things: Color Code (one result per
team/box Pokemon against the current defender) and the matchup board (one
result per Pokemon per opponent team member). They share a port and are told
apart by `defenderIndex`, which index.js sends as null for Color Code
requests. If that field were decoded wrongly, board results would overwrite
the Color Code results (or vice versa) and the tints would be for the wrong
opponent.

-}
suite : Test
suite =
    describe "boxMatchupResultDecoder"
        [ test "decodes a Color Code result (defenderIndex null)" <|
            \_ ->
                Decode.decodeString boxMatchupResultDecoder (resultJson "null")
                    |> Result.map (\r -> ( r.boxIndex, r.defenderIndex, r.bestDamagePercent ))
                    |> Expect.equal (Ok ( 3, Nothing, 42.5 ))
        , test "decodes a matchup board result (defenderIndex set)" <|
            \_ ->
                Decode.decodeString boxMatchupResultDecoder (resultJson "5")
                    |> Result.map .defenderIndex
                    |> Expect.equal (Ok (Just 5))
        , test "tolerates a payload without defenderIndex at all" <|
            \_ ->
                Decode.decodeString boxMatchupResultDecoder (resultJsonWithout "defenderIndex")
                    |> Result.map .defenderIndex
                    |> Expect.equal (Ok Nothing)
        , test "reads the OHKO flags" <|
            \_ ->
                Decode.decodeString boxMatchupResultDecoder (resultJson "null")
                    |> Result.map (\r -> ( r.canOHKO, r.mightOHKO, ( r.getsOHKOd, r.mightGetOHKOd ) ))
                    |> Expect.equal (Ok ( False, True, ( False, False ) ))
        ]


resultJson : String -> String
resultJson defenderIndex =
    """{ "boxIndex": 3, "defenderIndex": """
        ++ defenderIndex
        ++ """, "attackerSpeed": 40, "defenderSpeed": 35,
            "canOHKO": false, "mightOHKO": true, "getsOHKOd": false, "mightGetOHKOd": false,
            "isHardCounter": false, "isWall": true, "bestDamagePercent": 42.5, "worstDamageTaken": 18 }"""


resultJsonWithout : String -> String
resultJsonWithout _ =
    """{ "boxIndex": 3, "attackerSpeed": 40, "defenderSpeed": 35,
        "canOHKO": false, "mightOHKO": true, "getsOHKOd": false, "mightGetOHKOd": false,
        "isHardCounter": false, "isWall": true, "bestDamagePercent": 42.5, "worstDamageTaken": 18 }"""
