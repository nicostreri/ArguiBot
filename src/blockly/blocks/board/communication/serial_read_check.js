import {Block, common} from "blockly";
import arduinoGenerator from "../../../generators/arduino/arduino";
import { serial_init } from "./serial_init";

const blockName = "board_serial_read_check";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Si se recibieron datos por la conexión Serial %1 hacer %2",
    "args0": [
        { "type": "input_dummy" },
        { "type": "input_statement", "name": "DO" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Comprueba si se recibieron datos por la conexión Serial. En caso que SI, ejecuta el código interno.",
    "helpUrl": "",
    "style": "communication_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const doCode = arduinoGenerator.statementToCode(block, 'DO');
    
    serial_init();
    
    const code = 'if (Serial.available()) {\n' + doCode + '}';
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;