import * as Blockly from 'blockly';
import { blocks, unregisterProcedureBlocks } from '@blockly/block-shareable-procedures';
import arduinoGenerator from '../../generators/arduino/arduino';

unregisterProcedureBlocks();
Blockly.common.defineBlocks(blocks);
delete Blockly.Blocks['procedures_defreturn'];
delete Blockly.Blocks['procedures_ifreturn'];


/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
export const defBlockToArduino = function (block) {
    const preferedName = block.getProcedureModel().getName();
    const branch = arduinoGenerator.statementToCode(block, 'STACK');

    const code = `void ${arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_}(){\n ${branch} }\n`
    arduinoGenerator.addUserFunction(preferedName, code);
    return null;
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
export const callBlockToArduino = function (block) {
    const generatedName = arduinoGenerator.getUserFunctionName(block.getProcedureModel().getName());
    return `${generatedName}();\n`;
};

// Block registration
arduinoGenerator.forBlock['procedures_defnoreturn'] = defBlockToArduino;
arduinoGenerator.forBlock['procedures_callnoreturn'] = callBlockToArduino;