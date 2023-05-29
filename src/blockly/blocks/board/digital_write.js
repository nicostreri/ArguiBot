import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_digital_write";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Cambiar el %1 al estado %2",
    "args0": [
        { "type": "input_dummy", "name": "PD_0"},
        { "type": "field_dropdown", "name": "STATUS", "options": [["Alto","HIGH"], ["Bajo","LOW"]] },
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "style": "board_blocks",
    "tooltip": "Permite cambiar el estado actual de un PIN digital del controlador.",
    "helpUrl": "",
    "extensions": ["insert_pin_fields_extension"]
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const pinStatus = block.getFieldValue("STATUS");
    const pin = block.getFieldValue("DIGITALPIN_0");

    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.OUTPUT, "digitalWrite");
    arduinoGenerator.addSetup('pin_mode_' + pin, `pinMode(${pin}, OUTPUT);`, false);

    return `digitalWrite(${pin}, ${pinStatus});\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
