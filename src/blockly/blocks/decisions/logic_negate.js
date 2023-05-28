import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "logic_negate";

/** 
 * JSON block definition
 * @ignore Custom block
*/

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let order = arduinoGenerator.ORDER_UNARY_PREFIX;
    let value = arduinoGenerator.valueToCode(block, "BOOL", order) || "false";

    let code = "!" + value;
    return [code, order];
};

// Block registration
arduinoGenerator[blockName] = blockToArduino;
