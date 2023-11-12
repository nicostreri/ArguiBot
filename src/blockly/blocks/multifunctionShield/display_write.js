import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./screen";

const blockName = "multi_shield_display_write";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Mostrar en la pantalla %1 %2 %3 %4",
    "args0": [
      { "type": "field_sevensegment", "name": "D1" },
      { "type": "field_sevensegment", "name": "D2" },
      { "type": "field_sevensegment", "name": "D3" },
      { "type": "field_sevensegment", "name": "D4" },
    ],
    "previousStatement": null,
    "nextStatement": null,
    "style": "multi_shield_blocks",
    "tooltip": "Muestra en la pantalla los dígitos dibujados por el usuario.",
    "helpUrl": ""
};

const segmentToBin = (segmentValue) => {
    const keys = ["g", "f", "e", "d", "c", "b", "a"];
    let bin = "0b1";
    for(let k of keys){
        bin += segmentValue[k] ? "0" : "1";
    }
    return bin;
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const instanceName = init(block, arduinoGenerator);
    const d1 = segmentToBin(block.getFieldValue("D1"));
    const d2 = segmentToBin(block.getFieldValue("D2"));
    const d3 = segmentToBin(block.getFieldValue("D3"));
    const d4 = segmentToBin(block.getFieldValue("D4"));
    
    return `${instanceName}.write(${d1}, ${d2}, ${d3}, ${d4});\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
