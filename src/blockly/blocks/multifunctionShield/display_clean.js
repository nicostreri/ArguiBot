import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init, getVars } from "./screen";

const blockName = "multi_shield_display_clean";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Borrar contenido de la pantalla",
    "previousStatement": null,
    "nextStatement": null,
    "style": "display_blocks",
    "tooltip": "",
    "helpUrl": ""
};

/**
 * Generate display_clean template
 * @param {*} vars 
 * @returns 
 */
const getDisplayClean = (vars) => {
    return [
        'void ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '() {',
        '   noInterrupts();',
        `   ${vars.rawSeg}[0] = 0xff;`,
        `   ${vars.rawSeg}[1] = 0xff;`,
        `   ${vars.rawSeg}[2] = 0xff;`,
        `   ${vars.rawSeg}[3] = 0xff;`,
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
    const cleanDisplayFunction = arduinoGenerator.addFunction('multi_shield_display_clean', getDisplayClean(getVars()));

    return `${cleanDisplayFunction}();\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
