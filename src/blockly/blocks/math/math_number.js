import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino";

const blockName = "math_number";

/** 
 * JSON block definition
 * @ignore Custom blocks
*/

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const numberblockToArduino = function (block) {
    // Numeric value.
    let code = parseFloat(block.getFieldValue('NUM'));
    if (code == Infinity) {
        code = 'INT_MAX';
    } else if (code == -Infinity) {
        code = 'INT_MIN';
    }
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
arduinoGenerator[blockName] = numberblockToArduino;