import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "math_modulo";

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
    let order = arduinoGenerator.ORDER_MULTIPLICATIVE;
    let dividend = arduinoGenerator.valueToCode(block, 'DIVIDEND', order) || '0';
    let divisor = arduinoGenerator.valueToCode(block, 'DIVISOR', order) || '0';
    let code = `${dividend} % ${divisor}`;
    return [code, order];
};

// Block registration
arduinoGenerator.forBlock[blockName] = blockToArduino;
