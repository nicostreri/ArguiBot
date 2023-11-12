import { Block, common } from "blockly";
import arduinoGenerator from "./../../generators/arduino/arduino";

const blockName = "char_to_ascii";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Obtener código ASCII %1",
    "args0": [
        {
            "type": "input_value",
            "name": "CHAR",
            "check": "Char"
        }
    ],
    "output": "Number",
    "tooltip": "Convierte un carácter al número ASCII correspondiente.",
    "helpUrl": "",
    "style": "string_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const char = arduinoGenerator.valueToCode(block, 'CHAR', arduinoGenerator.ORDER_ATOMIC);

    const code = `( (int) ${char})`;
    return [code, arduinoGenerator.ORDER_UNARY_PREFIX];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;