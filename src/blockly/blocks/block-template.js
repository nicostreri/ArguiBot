import {Block, common} from "blockly";
import arduinoGenerator from "../generators/arduino";

const blockName = "";

/** 
 * JSON block definition
*/
const jsonDefinition = {

};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
