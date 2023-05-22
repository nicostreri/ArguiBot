export default {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Control del Programa",
            categorystyle: "logic_category",
            contents: [
                { kind: "block", type: "controls_delay"},
                { kind: "block", type: "controls_millis"},

                { kind: "label", text: "Toma de decisión"},
                { kind: "block", type: "controls_if"},
                { kind: "block", type: "controls_ifelse"},

                { kind: "label", text: "Repeticiones"},
                { kind: "block", type: "controls_repeat"},
                { kind: "block", type: "controls_whileUntil"},
                { kind: "block", type: "controls_flow_statements", fields: {"FLOW": "BREAK"}},
                { kind: "block", type: "controls_flow_statements", fields: {"FLOW": "CONTINUE"}},
            ]
        },
        {
            kind: "category",
            name: "Operadores",
            contents: [
                { kind: "label", text: "Literales "},
                { kind: "block", type: "math_number"},
                { kind: "block", type: "logic_boolean"},

                { kind: "label", text: "Comparadores"},
                { kind: "block", type: "logic_compare", fields: {"OP": "EQ"}},
                { kind: "block", type: "logic_compare", fields: {"OP": "LT"}},
                { kind: "block", type: "logic_compare", fields: {"OP": "GT"}},

                { kind: "label", text: "Lógicos"},
                { kind: "block", type: "logic_operation", fields: {"OP": "AND"}},
                { kind: "block", type: "logic_operation", fields: {"OP": "OR"}},
                { kind: "block", type: "logic_negate"},
                { kind: "block", type: "logic_ternary"}, 

                { kind: "label", text: "Numéricos"},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "ADD"}},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "MINUS"}},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "MULTIPLY"}},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "DIVIDE"}},
                { kind: "block", type: "math_single"},
                { kind: "block", type: "math_modulo"},
                { kind: "block", type: "math_random_int", "inputs": {
                    "FROM": {block: { type: "math_number", fields: {"NUM": 1}}},
                    "TO":   {block: { type: "math_number", fields: {"NUM": 10}}}
                }},
                //TODO map() arduino function
            ]
        }
    ]
}
