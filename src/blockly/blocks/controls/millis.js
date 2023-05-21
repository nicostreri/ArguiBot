import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino";

const blockName = "controls_millis";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": "controls_millis",
    "message0": "Tiempo desde el arranque (milisegundos)",
    "output": "Number",
    "colour": 230,
    "tooltip": "Obtiene la cantidad de milisegundos que transcurrieron desde el encendido de la placa Arduino.",
    "helpUrl": ""
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
