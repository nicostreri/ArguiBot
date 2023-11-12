import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./screen";

const blockName = "multi_shield_display_write_float";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Mostrar en la pantalla el número real %1",
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
    "tooltip": "Muestra un número real en la pantalla. Solo puede mostrar números entre 0 y 999, debido al tamaño de la pantalla.",
    "helpUrl": ""
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const instanceName = init(block, arduinoGenerator);
    let order = arduinoGenerator.ORDER_NONE;
    let value = arduinoGenerator.valueToCode(block, 'VALUETOSHOW', order) || '0';

    return `${instanceName}.write((float) (${value}));\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
