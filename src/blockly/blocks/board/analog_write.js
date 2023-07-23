import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_analog_write";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Generar en el %1 el valor %2",
    "args0": [
        { "type": "input_dummy", "name": "PW_0"},
        { "type": "input_value", "name": "VALUETOWRITE", "check": "Number"},
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "style": "board_blocks",
    "tooltip": "Permite generar un valor PWM en un pin con capacidad PWM.",
    "helpUrl": "",
    "extensions": ["insert_pin_fields_extension"]
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const value = arduinoGenerator.valueToCode(block, "VALUETOWRITE", arduinoGenerator.ORDER_ATOMIC);
    const pin = block.getFieldValue("PWMPIN_0");

    //TODO check range

    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.OUTPUT, "analogWrite");
    arduinoGenerator.addSetup('pin_mode_' + pin, `pinMode(${pin}, OUTPUT);`, false);

    return `analogWrite(${pin}, min( max(${value}, 0), 255) );\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
