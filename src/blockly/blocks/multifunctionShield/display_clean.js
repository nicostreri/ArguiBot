import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./screen";

const blockName = "multi_shield_display_clean";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Borrar contenido de la pantalla",
    "previousStatement": null,
    "nextStatement": null,
    "style": "multi_shield_blocks",
    "tooltip": "Eliminar todo el contenido mostrado en la pantalla y la apaga.",
    "helpUrl": ""
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const instanceName = init(block, arduinoGenerator);
    
    return `${instanceName}.clean();\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
