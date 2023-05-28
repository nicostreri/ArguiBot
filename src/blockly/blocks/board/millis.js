import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_millis";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Tiempo desde el arranque (milisegundos)",
    "output": "Number",
    "tooltip": "Obtiene la cantidad de milisegundos que transcurrieron desde el encendido de la placa Arduino.",
    "helpUrl": "",
    "style": "board_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let code = "millis()";
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
