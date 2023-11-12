import {Block, common} from "blockly";
import arduinoGenerator from "../../../generators/arduino/arduino";
import { serial_init } from "./serial_init";

const blockName = "board_serial_print_int";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Enviar por conexión Serial el número: %1 (S. Línea %2)",
    "args0": [
      {
        "type": "input_value",
        "name": "NUMBER",
        "check": "Number"
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
    "tooltip": "Imprime por la conexión Serial un número.",
    "helpUrl": "",
    "style": "communication_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const numberToPrint = arduinoGenerator.valueToCode(block, 'NUMBER', arduinoGenerator.ORDER_ATOMIC) || '0';
    const newLine = block.getFieldValue("NEWLINE") == 'TRUE';
        
    serial_init();

    const printFunction = newLine ? "println" : "print";
    const code = `Serial.${printFunction}(${numberToPrint});`
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;