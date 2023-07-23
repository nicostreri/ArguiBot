import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_delay";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Esperar por  %1 milisegundos",
    "args0": [
        {
            "type": "field_number",
            "name": "TIME",
            "value": 1000,
            "min": 1,
            "precision": 1
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Detiene el programa temporalmente",
    "helpUrl": "",
    "style": "board_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let delayTime = block.getFieldValue("TIME");
    return `delay(${delayTime});\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
