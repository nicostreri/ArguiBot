import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "logic_boolean";

/** 
 * JSON block definition
 * @ignore Custom blocks
*/

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
arduinoGenerator[blockName] = booleanblockToArduino;