import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./screen";

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
    "tooltip": "Muestra un número decimal en la pantalla. Solo puede mostrar números entre 0 y 999, debido al tamaño de la pantalla.",
    "helpUrl": ""
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    init(block, arduinoGenerator);
    let order = arduinoGenerator.ORDER_NONE;
    let value = arduinoGenerator.valueToCode(block, 'VALUETOSHOW', order) || '0';

    return `display.write((float) (${value}));\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
