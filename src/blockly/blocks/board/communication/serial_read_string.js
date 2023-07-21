import {Block, common} from "blockly";
import arduinoGenerator from "../../../generators/arduino/arduino";
import { serial_init } from "./serial_init";

const blockName = "board_serial_read_string";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Leer texto desde conexión Serial",
    "output": "String",
    "style": "communication_blocks",
    "tooltip": "Lee de los datos disponibles en la conexión Serial la próximo cadena de texto válida.",
    "helpUrl": "",
    "extensions": ["serial_read_on_check_block"]
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    serial_init();

    const code = "Serial.readString()";
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
