import {Block, common} from "blockly";
import arduinoGenerator from "./../../generators/arduino/arduino";

const blockName = "string_literal";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "%1",
    "args0": [
        {
            "type": "field_input",
            "name": "TEXT",
            "text": "Mi texto"
        }
    ],
    "output": "String",
    "tooltip": "Un texto.",
    "helpUrl": "",
    "style": "string_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const text = block.getFieldValue("TEXT"); 
    
    const escapedText = arduinoGenerator.quote_(text);
    const code = `String(${escapedText})`;
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;