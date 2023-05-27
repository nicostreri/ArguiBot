import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino";

const blockName = "math_arithmetic";

/** 
 * JSON block definition
 * @ignore Custom block
*/

/**
 * Map Blockly to Arduino (C++)
 */
const OPERATOR_MAP = {
    "ADD": ['+', arduinoGenerator.ORDER_ADDITIVE],
    "MINUS": ['-', arduinoGenerator.ORDER_ADDITIVE],
    "MULTIPLY": ['*', arduinoGenerator.ORDER_MULTIPLICATIVE],
    "DIVIDE": ['/', arduinoGenerator.ORDER_MULTIPLICATIVE]
};

const powerToArduino = function(block) {
    let order = arduinoGenerator.ORDER_NONE;
    let base = arduinoGenerator.valueToCode(block, 'A', order) || '0';
    let exponent = arduinoGenerator.valueToCode(block, 'B', order) || '0';
 
    let code = `pow(${base}, ${exponent})`;
    return [code, arduinoGenerator.ORDER_UNARY_POSTFIX];
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let blocklyOperator = block.getFieldValue("OP");
    if(blocklyOperator == "POWER") return powerToArduino(block);

    let tuple = OPERATOR_MAP[blocklyOperator];
    let operator = tuple[0];
    let order = tuple[1];
    let left = arduinoGenerator.valueToCode(block, 'A', order) || '0';
    let right = arduinoGenerator.valueToCode(block, 'B', order) || '0';
 
    let code = `${left} ${operator} ${right}`;
    return [code, order];
};

// Block registration
arduinoGenerator[blockName] = blockToArduino;
