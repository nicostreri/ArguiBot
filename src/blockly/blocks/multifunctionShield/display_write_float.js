import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init, getVars } from "./screen";

const blockName = "multi_shield_display_write_float";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Mostrar en la pantalla el número decimal %1",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUETOSHOW",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "multi_shield_blocks",
    "tooltip": "",
    "helpUrl": ""
};

/**
 * Generate display_write_float template
 * @param {*} vars 
 * @returns 
 */
const getDisplayWriteFloat = (vars) => {
    return [
        'void ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '(float valueToShow) {',
        `   int leftSideOfDecimalPoint = (int) valueToShow;`,
        `   int temp = (int) (valueToShow * 10);`,
        `   int rightSideOfDecimalPoint = temp % 10;`,
        '   noInterrupts();',
        `   ${vars.rawSeg}[0] = ${vars.segMap}[(leftSideOfDecimalPoint / 100) % 10];`,
        `   ${vars.rawSeg}[1] = ${vars.segMap}[(leftSideOfDecimalPoint / 10) % 10];`,
        `   ${vars.rawSeg}[2] = (${vars.segMap}[leftSideOfDecimalPoint % 10]) & 0b01111111;`,
        `   ${vars.rawSeg}[3] = ${vars.segMap}[rightSideOfDecimalPoint];`,
        `   if (leftSideOfDecimalPoint < 100) ${vars.rawSeg}[0] = 0xff;`,
        `   if (leftSideOfDecimalPoint < 10) ${vars.rawSeg}[1] = 0xff;`,
        '   interrupts();',
        '}'
    ].join('\n');
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    init(block, arduinoGenerator);
    const writeFloatFunction = arduinoGenerator.addFunction('multi_shield_display_write_float', getDisplayWriteFloat(getVars()));
    let order = arduinoGenerator.ORDER_NONE;
    let value = arduinoGenerator.valueToCode(block, 'VALUETOSHOW', order) || '0';

    return `${writeFloatFunction}(${value});\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
