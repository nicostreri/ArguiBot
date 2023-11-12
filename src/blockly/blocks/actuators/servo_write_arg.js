import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./servo_write";

const blockName = "servo_write_arg";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Mover a %1 grados el Servo en el %2",
    "args0": [
        {
            "type": "input_value",
            "name": "DEGREE",
            "check": "Number"
        },
        { "type": "input_dummy", "name": "PW_0" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Cambia la posición de un Servo a los grados especificados, permite parametrizar el grado.",
    "helpUrl": "",
    "style": "actuators_blocks",
    "extensions": ["insert_pin_fields_extension"]
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
export const blockToArduino = function (block) {
    //Block data
    const degree = arduinoGenerator.valueToCode(block, "DEGREE", arduinoGenerator.ORDER_ATOMIC);
    const pin = block.getFieldValue("PWMPIN_0");
    const instanceName = init(block, pin);

    let code = `${instanceName}.attach(${pin});\n`;
    code += `${instanceName}.write( min( max(${degree}, 0), 180) );`;
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
