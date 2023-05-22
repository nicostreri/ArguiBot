import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino";

const blockName = "math_number";
const blockName2 = "logic_boolean";

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


/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const booleanblockToArduino = function (block) {
    let blockValue = block.getFieldValue('BOOL');
    let code = (blockValue == 'TRUE') ? 'true' : 'false';
    return [code, arduinoGenerator.ORDER_ATOMIC];
};


// Block registration
arduinoGenerator[blockName] = numberblockToArduino;
arduinoGenerator[blockName2] = booleanblockToArduino;