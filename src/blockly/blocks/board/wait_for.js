import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_wait_for";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Esperar hasta que %1",
    "args0": [{
        "type": "input_value",
        "name": "CONDITION",
        "check": "Boolean"
    }],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Espera hasta que se cumple una condición.",
    "helpUrl": "",
    "style": "board_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const condition = arduinoGenerator.valueToCode(block, 'CONDITION', arduinoGenerator.ORDER_NONE) || 'true';
    let code = `do { delay(10); } while (!(${condition}));\n`;
    code += "delay(320);";
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
