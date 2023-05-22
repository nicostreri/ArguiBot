import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino";

const blockName = "logic_operation";

/** 
 * JSON block definition
 * @ignore Custom block
*/

/**
 * Map Blockly operator to Arduino (C++) operator
 */
const OPERATOR_MAP = {
    "AND": "&&",
    "OR": "||"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let operator = OPERATOR_MAP[block.getFieldValue("OP")];
    let order = (operator == "&&") ? arduinoGenerator.ORDER_LOGICAL_AND : arduinoGenerator.ORDER_LOGICAL_OR;
    let left = arduinoGenerator.valueToCode(block, "A", order) || "false";
    let right = arduinoGenerator.valueToCode(block, "B", order) || "false";

    let code = `${left} ${operator} ${right}`;
    console.log(code);
    return [code, order];
};

// Block registration
arduinoGenerator[blockName] = blockToArduino;
