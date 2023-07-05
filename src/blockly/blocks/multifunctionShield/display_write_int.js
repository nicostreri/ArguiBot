import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init, getVars } from "./screen";

const blockName = "multi_shield_display_write_int";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Mostrar en la pantalla el número %1",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUETOSHOW",
        "check": "Number"
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "display_blocks",
    "tooltip": "",
    "helpUrl": ""
};

/**
 * Generate display_write_int template
 * @param {*} vars 
 * @returns 
 */
const getDisplayWriteInt = (vars) => {
    return [
        'void ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '(int valueToShow) {',
        '   noInterrupts();',
        `   ${vars.rawSeg}[0] = ${vars.segMap}[valueToShow / 1000];`,
        `   ${vars.rawSeg}[1] = ${vars.segMap}[(valueToShow / 100) % 10];`,
        `   ${vars.rawSeg}[2] = ${vars.segMap}[(valueToShow / 10) % 10];`,
        `   ${vars.rawSeg}[3] = ${vars.segMap}[valueToShow % 10];`,
        `   if (valueToShow < 1000) ${vars.rawSeg}[0] = 0xff;`,
        `   if (valueToShow < 100) ${vars.rawSeg}[1] = 0xff;`,
        `   if (valueToShow < 10) ${vars.rawSeg}[2] = 0xff;`,
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
    const writeIntFunction = arduinoGenerator.addFunction('multi_shield_display_write_int', getDisplayWriteInt(getVars()));
    let order = arduinoGenerator.ORDER_NONE;
    let value = arduinoGenerator.valueToCode(block, 'VALUETOSHOW', order) || '0';

    return `${writeIntFunction}(${value});\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
