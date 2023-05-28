import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_digital_read";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Leer el estado del",
    "inputsInline": true,
    "output": "Boolean",
    "previousStatement": null,
    "nextStatement": null,
    "style": "board_blocks",
    "tooltip": "Lee el estado actual de un PIN digital del controlador.",
    "helpUrl": "",
    "extensions": ["add_digital_pin_extension"]
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const pin = block.getFieldValue("DIGITALPIN");

    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.INPUT, "digitalRead");
    arduinoGenerator.addSetup('pin_mode_' + pin, `pinMode(${pin}, INPUT);`, false);

    const code = `digitalRead(${pin})`;
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
