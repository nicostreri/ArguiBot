import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "math_single";

/** 
 * JSON block definition
 * @ignore Custom block
*/

const mathFunctionsToArduino = (template) => {
    return (block) => {
        let order = arduinoGenerator.ORDER_NONE;
        let value = arduinoGenerator.valueToCode(block, 'NUM', order) || '0';
        let code = template.replace("%value%", value);
        return [code, arduinoGenerator.ORDER_UNARY_POSTFIX];
    }
};

const negToArduino = (block) => {
    let order = arduinoGenerator.ORDER_ATOMIC;
    let value = arduinoGenerator.valueToCode(block, 'NUM', order) || '0';
    let code = `-${value}`;
    return [code, arduinoGenerator.ORDER_UNARY_POSTFIX];
};

const OPERATOR_MAP = {
    "ROOT": mathFunctionsToArduino("sqrt(%value%)"),
    "ABS": mathFunctionsToArduino("abs(%value%)"),
    "NEG": negToArduino,
    "LN": mathFunctionsToArduino("log(%value%)"),
    "LOG10": mathFunctionsToArduino("log10(%value%)"),
    "EXP": mathFunctionsToArduino("pow(M_E, %value%)"),
    "POW10": mathFunctionsToArduino("pow(10, %value%)")
};


/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let operatorHandler = OPERATOR_MAP[block.getFieldValue("OP")];
    return operatorHandler(block);
};

// Block registration
arduinoGenerator[blockName] = blockToArduino;
