import {Block, common} from "blockly";
import arduinoGenerator from "../../../generators/arduino/arduino";
import { serial_init } from "./serial_init";

const blockName = "board_serial_print_string";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Enviar por conexión Serial el texto: %1 (S. Línea %2)",
    "args0": [
      {
        "type": "field_input",
        "name": "TEXT",
        "text": "Hola a Todos!"
      },
      {
        "type": "field_checkbox",
        "name": "NEWLINE",
        "checked": false
      }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Imprime por la conexión Serial una cadena de texto.",
    "helpUrl": "",
    "style": "communication_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const text = block.getFieldValue("TEXT"); 
    const newLine = block.getFieldValue("NEWLINE") == 'TRUE';
        
    serial_init();

    const printFunction = newLine ? "println" : "print";
    const escapedText = arduinoGenerator.quote_(text);
    const code = `Serial.${printFunction}(${escapedText});`
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;