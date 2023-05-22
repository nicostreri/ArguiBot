import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino";

const blockName = "logic_ternary";

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
    let order = arduinoGenerator.ORDER_CONDITIONAL;
    let condition = arduinoGenerator.valueToCode(block, "IF", order) || 'false';
    let thenValue = arduinoGenerator.valueToCode(block, "THEN", order) || 'null';
    let elseValue = arduinoGenerator.valueToCode(block, "ELSE", order) || 'null';

    let code = `${condition} ? ${thenValue} : ${elseValue}`;
    return [code, order];
};

// Block registration
arduinoGenerator[blockName] = blockToArduino;
