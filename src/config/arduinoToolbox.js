export default {
    kind: "categoryToolbox",
    contents: [
        {
            kind: "category",
            name: "Toma de Decisión",
            categorystyle: "decisions_category",
            contents: [
                { kind: "label", text: "Estructuras de Control"},
                { kind: "block", type: "controls_if"},
                { kind: "block", type: "controls_ifelse"},

                { kind: "label", text: "Valores Literales"},
                { kind: "block", type: "logic_boolean", fields: {"BOOL": "TRUE"}},
                { kind: "block", type: "logic_boolean", fields: {"BOOL": "FALSE"}},
                
                { kind: "label", text: "Comparadores de Valores"},
                { kind: "block", type: "logic_compare", fields: {"OP": "EQ"}},
                { kind: "block", type: "logic_compare", fields: {"OP": "LT"}},
                { kind: "block", type: "logic_compare", fields: {"OP": "GT"}},

                { kind: "label", text: "Operadores Lógicos"},
                { kind: "block", type: "logic_operation", fields: {"OP": "AND"}},
                { kind: "block", type: "logic_operation", fields: {"OP": "OR"}},
                { kind: "block", type: "logic_negate"},

                { kind: "label", text: "Bloques extras (Nivel avanzado)"},
                { kind: "block", type: "logic_ternary"}, 
            ]
        },
        {
            kind: "category",
            name: "Repeticiones",
            categorystyle: "repetitions_category",
            contents: [
                { kind: "label", text: "Estructuras de Control (bucles)"},
                { kind: "block", type: "controls_repeat"},
                { kind: "block", type: "controls_whileUntil"},

                { kind: "label", text: "Control de Repeticiones (bucles - Nivel Avanzado)"},
                { kind: "block", type: "controls_flow_statements", fields: {"FLOW": "BREAK"}},
                { kind: "block", type: "controls_flow_statements", fields: {"FLOW": "CONTINUE"}},
            ]
        },
        {
            kind: "category",
            name: "Números y Matemática",
            categorystyle: "math_category",
            contents: [
                { kind: "label", text: "Valores Literales"},
                { kind: "block", type: "math_number"},
                
                { kind: "label", text: "Operaciones Matemáticas"},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "ADD"}},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "MINUS"}},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "MULTIPLY"}},
                { kind: "block", type: "math_arithmetic", fields: {"OP": "DIVIDE"}},
                { kind: "block", type: "math_modulo"},
                { kind: "block", type: "math_single"},

                { kind: "label", text: "Operaciones con números"},
                { kind: "block", type: "math_random_int", "inputs": {
                    "FROM": {block: { type: "math_number", fields: {"NUM": 1}}},
                    "TO":   {block: { type: "math_number", fields: {"NUM": 10}}}
                }},
                { kind: "block", type: "math_ardu_map"}
            ]
        },
        {
            kind: "category",
            name: "Texto",
            categorystyle: "string_category",
            contents: [
                { kind: "label", text: "Valores Literales"},
                { kind: "block", type: "string_literal"},
            ]
        },
        {
            kind: "category",
            name: "Placa Arduino",
            categorystyle: "board_category",
            contents: [
                { kind: "label", text: "Controlador"},
                { kind: "block", type: "board_delay"},
                { kind: "block", type: "board_millis"},
                { kind: "block", type: "board_wait_for"},
                { kind: "block", type: "board_stop"},

                { kind: "label", text: "Control de PIN digital"},
                { kind: "block", type: "board_digital_write"},
                { kind: "block", type: "board_digital_read"},

                { kind: "label", text: "Control de PIN analógico"},
                { kind: "block", type: "board_analog_write"},
                { kind: "block", type: "board_analog_read"}
            ]
        },
        {
            kind: "category",
            name: "Conexión Serial",
            categorystyle: "communication_category",
            contents: [
                { kind: "label", text: "Envío de Datos"},
                { kind: "block", type: "board_serial_print_string"},
                { kind: "block", type: "board_serial_print_int"},
                { kind: "block", type: "board_serial_print_bool"},
                
                { kind: "label", text: "Recepción de Datos"},
                { kind: "block", type: "board_serial_read_check"},
                { kind: "block", type: "board_serial_read_int"},
                { kind: "block", type: "board_serial_read_float"},
                { kind: "block", type: "board_serial_read_string"}
            ]
        },
        {
            kind: "category",
            name: "Shield Multifunción",
            categorystyle: "multi_shield_category",
            contents: [
                { kind: "label", text: "Pantalla"},
                { kind: "block", type: "multi_shield_display_clean"},
                { kind: "block", type: "multi_shield_display_write_int"},
                { kind: "block", type: "multi_shield_display_write_float"},
                { kind: "block", type: "multi_shield_display_write_bool"},
                { kind: "block", type: "multi_shield_display_write"},
                
                { kind: "label", text: "Otros Sensores y Actuadores"},
                { kind: "block", type: "multi_shield_change_led_status"},
                { kind: "block", type: "multi_shield_get_button_status"},
                { kind: "block", type: "multi_shield_buzzer_tone", "inputs": {
                    "FREQ": {block: { type: "math_number", fields: {"NUM": 400}}},
                    "TIME":   {block: { type: "math_number", fields: {"NUM": 1000}}}
                }}
            ]
        },
        {
            kind: "category",
            name: "Sensores",
            categorystyle: "sensors_category",
            contents: [
                { kind: "block", type: "sensor_ultrasonic_HCSR04"},
                { kind: "block", type: "sensor_dht11"}
            ]
        },
        {
            kind: "category",
            name: "Actuadores",
            categorystyle: "actuators_category",
            contents: [
                { kind: "label", text: "Control de Servomotor"},
                { kind: "block", type: "servo_write"},
                { kind: "block", type: "servo_write_detach"},
                { kind: "block", type: "servo_detach"},
                { kind: "block", type: "servo_write_arg"}
            ]
        },
        {
            kind: "category",
            name: "Variables",
            categorystyle: "variables_category",
            custom: "VARIABLE"
        },
    ]
}
