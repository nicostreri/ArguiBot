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
        }
    ]
}