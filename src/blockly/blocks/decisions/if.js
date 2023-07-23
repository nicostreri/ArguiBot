import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "controls_if";
const blockName2 = "controls_ifelse";

/** 
 * JSON block definition
 * @ignore Custom blocks.
*/

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function(forceElse, block) {
    let condition = arduinoGenerator.valueToCode(block, 'IF0', arduinoGenerator.ORDER_NONE) || 'false';
    let branch = arduinoGenerator.statementToCode(block, 'DO0');
    var code = 'if (' + condition + ') {\n' + branch + '}';

    for(let i = 1; i <= block.elseifCount_; i++) {
        condition = arduinoGenerator.valueToCode(block, 'IF' + i, arduinoGenerator.ORDER_NONE) || 'false';
        branch = arduinoGenerator.statementToCode(block, 'DO' + i);
        code += ' else if (' + condition + ') {\n' + branch + '}';
    }
    if (block.elseCount_ || forceElse) {
        branch = arduinoGenerator.statementToCode(block, 'ELSE');
        code += ' else {\n' + branch + '}';
    }
    return code + '\n';
};

// Block registration
arduinoGenerator[blockName] = (block) => blockToArduino(false, block);
arduinoGenerator[blockName2] = (block) => blockToArduino(true, block);
