import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino";

const blockName = "controls_delay";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": "controls_delay",
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
    "colour": 230,
    "tooltip": "Detiene el programa temporalmente",
    "helpUrl": ""
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
