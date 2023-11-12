import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "controls_whileUntil";

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
    let mode = block.getFieldValue("MODE");
    let defaultCondition = (mode == "WHILE") ? 'false' : 'true'; 
    let condition = arduinoGenerator.valueToCode(block, 'BOOL', arduinoGenerator.ORDER_NONE) || defaultCondition;
    let branch = arduinoGenerator.statementToCode(block, 'DO');
    branch = arduinoGenerator.addLoopTrap(branch, block.id);

    if(mode == "UNTIL"){
        condition = `!(${condition})`;
    }

    return 'while (' + condition + ') {\n' + branch + '}\n';
};

// Block registration
arduinoGenerator.forBlock[blockName] = blockToArduino;
