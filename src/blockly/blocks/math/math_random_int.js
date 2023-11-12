import {Block, common, Names} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "math_random_int";

/** 
 * JSON block definition
 * @ignore Custom block
*/

/**
 * Helper functions
 */
const randomFunctionTemplate = [
    'long ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '(long min, long max) {',
    '  if (min > max) {',
    '    // Swap min and max to ensure min is smaller.',
    '    int temp = min;',
    '    min = max;',
    '    max = temp;',
    '  }',
    '  return random(min, max + 1);',
    '}'
].join('\n');

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    //Pre requisites
    arduinoGenerator.addSetup("math_random_init_seed", "randomSeed(analogRead(0));", false);
    let mathRandomFunction = arduinoGenerator.addFunction('math_random', randomFunctionTemplate);

    //Block to code
    let order = arduinoGenerator.ORDER_NONE;
    let from = arduinoGenerator.valueToCode(block, 'FROM', order) || '0';
    let to = arduinoGenerator.valueToCode(block, 'TO', order) || '0';

    let code = `${mathRandomFunction}(${from}, ${to})`;
    return [code, arduinoGenerator.ORDER_UNARY_POSTFIX];
};

// Block registration
arduinoGenerator.forBlock[blockName] = blockToArduino;
