import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "logic_compare";

/** 
 * JSON block definition
 * @ignore Custom block
*/

/**
 * Map from Blockly operator to Arduino(C++) operator
 */
const OPERATOR_MAP = {
    'EQ': '==',
    'NEQ': '!=',
    'LT': '<',
    'LTE': '<=',
    'GT': '>',
    'GTE': '>='
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let operator = OPERATOR_MAP[block.getFieldValue("OP")];
    let order = (operator == "==" || operator == "!=") ? arduinoGenerator.ORDER_EQUALITY : arduinoGenerator.ORDER_RELATIONAL;
    let left = arduinoGenerator.valueToCode(block, "A", order);
    let right = arduinoGenerator.valueToCode(block, "B", order);

    let code = `${left} ${operator} ${right}`;
    return [code, order];
};

// Block registration
arduinoGenerator.forBlock[blockName] = blockToArduino;
