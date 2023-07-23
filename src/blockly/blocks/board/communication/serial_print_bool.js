import {Block, common} from "blockly";
import arduinoGenerator from "../../../generators/arduino/arduino";
import { serial_init } from "./serial_init";

const blockName = "board_serial_print_bool";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Enviar por conexión Serial el valor lógico: %1 (S. Línea %2)",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "Boolean"
      },
      {
        "type": "field_checkbox",
        "name": "NEWLINE",
        "checked": false
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Imprime por la conexión Serial un valor lógico (SI / NO).",
    "helpUrl": "",
    "style": "communication_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const logicToPrint = arduinoGenerator.valueToCode(block, 'VALUE', arduinoGenerator.ORDER_ATOMIC) || 'false';
    const newLine = block.getFieldValue("NEWLINE") == 'TRUE';
        
    serial_init();

    const printFunction = newLine ? "println" : "print";
    const code = `Serial.${printFunction}( (${logicToPrint}) ? "Si" : "No");`
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;