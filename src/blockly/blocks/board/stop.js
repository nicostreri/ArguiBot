import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_stop";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Detener el programa",
    "previousStatement": null,
    "tooltip": "Finaliza la ejecución del programa actual.",
    "helpUrl": "",
    "style": "board_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let code = `do { delay(10); } while (true);`;
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
