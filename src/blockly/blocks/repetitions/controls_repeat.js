import {Block, common, Names} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "controls_repeat";

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
    let times = Number(block.getFieldValue('TIMES'));
    let branch = arduinoGenerator.statementToCode(block, 'DO');
    branch = arduinoGenerator.addLoopTrap(branch, block.id);

    let i = arduinoGenerator.nameDB_.getDistinctName('count', Names.NameType.DEVELOPER_VARIABLE);
    let code = `for(int ${i} = 0; ${i} < ${times}; ${i}++) {\n`;
    code += branch + "}\n";
    return code;
};

// Block registration
arduinoGenerator.forBlock[blockName] = blockToArduino;
