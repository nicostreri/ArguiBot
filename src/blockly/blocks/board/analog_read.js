import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_analog_read";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Estado actual del %1",
    "args0":[
        {"type": "input_dummy", "name": "PA_0"}
    ],
    "inputsInline": true,
    "output": "Number",
    "style": "board_blocks",
    "tooltip": "Lee el estado actual de un PIN analógico del controlador.",
    "helpUrl": "",
    "extensions": ["insert_pin_fields_extension"]
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const pin = block.getFieldValue("ANALOGPIN_0");

    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.INPUT, "analogRead");
    arduinoGenerator.addSetup('pin_mode_' + pin, `pinMode(${pin}, INPUT);`, false);

    const code = `analogRead(${pin})`;
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
