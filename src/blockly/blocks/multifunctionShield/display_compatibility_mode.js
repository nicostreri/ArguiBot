import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./screen";

const blockName = "multi_shield_display_compatibility_mode";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Iniciar pantalla en Modo de Compatibilidad",
    "previousStatement": null,
    "nextStatement": null,
    "style": "multi_shield_blocks",
    "tooltip": "Inicializa la pantalla en Modo de Compatibilidad. No se utilizan interrupciones para evitar problemas con otras bibliotecas (Ejemplo: Servo.h).",
    "helpUrl": ""
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    init(block, arduinoGenerator, true);
    return "";
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
