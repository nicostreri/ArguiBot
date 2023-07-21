import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "sensor_ultrasonic_HCSR04";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Distancia actual S. de ultrasonido (TRIGGER en %1 ECHO en %2)",
    "args0":[
        {"type": "input_dummy", "name": "PD_0"},
        {"type": "input_dummy", "name": "PD_1"}
    ],
    "inputsInline": true,
    "output": "Number",
    "tooltip": "Obtiene la distancia medida por el sensor de ultrasonido HC-SR 04. El valor devuelto está en centímetros.",
    "helpUrl": "",
    "style": "sensors_blocks",
    "extensions": ["insert_pin_fields_extension"]
};

/**
 * Generate ultrasonicHCSR04_read template
 * @returns 
 */
const getUltrasonicHCSR04read = () => {
    return [
        'long ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '(int trigger, int echo) {',
        '   long t;',
        '   long d = 0;',
        '   for(int i=0; i<4; i++){',
        '       digitalWrite(trigger, LOW);',
        '       delayMicroseconds(2);',
        '       digitalWrite(trigger, HIGH);',
        '       delayMicroseconds(10);',
        '       digitalWrite(trigger, LOW);',
        '       t = pulseIn(echo, HIGH);',
        '       d += t / 29;',
        '       delay(20);',
        '   }',
        '   d = d/15;',
        '   return d;',
        '}'
    ].join('\n');
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const pinTRIGGER = block.getFieldValue("DIGITALPIN_0");
    const pinECHO = block.getFieldValue("DIGITALPIN_1");
    const readFunction = arduinoGenerator.addFunction('ultrasonicHCSR04_read', getUltrasonicHCSR04read());

    //PINs
    arduinoGenerator.reservePin(block, pinECHO, arduinoGenerator.PinTypes.CIRCUIT_INPUT, "ultrasonicHCSR04_read_echo");
    arduinoGenerator.reservePin(block, pinTRIGGER, arduinoGenerator.PinTypes.CIRCUIT_OUTPUT, "ultrasonicHCSR04_read_trigger");

    // Setup code
    arduinoGenerator.addSetup('pin_mode_' + pinECHO, `pinMode(${pinECHO}, INPUT);`, false);
    arduinoGenerator.addSetup('pin_mode_' + pinTRIGGER, 
        `pinMode(${pinTRIGGER}, OUTPUT);\n digitalWrite(${pinTRIGGER}, LOW);`,
        false
    );

    const code = `${readFunction}(${pinTRIGGER}, ${pinECHO})`;
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
