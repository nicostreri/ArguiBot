import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./servo_write";

const blockName = "servo_write_detach";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Mover a %1 grados el Servo en el %2 y luego desasociar",
    "args0": [
        {
            "type": "field_number",
            "name": "DEGREE",
            "value": 90,
            "min": 0,
            "max": 180,
            "precision": 1
        },
        { "type": "input_dummy", "name": "PW_0" }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Cambia la posición de un Servo a los grados especificados y luego lo desasocia del pin.",
    "helpUrl": "",
    "style": "actuators_blocks",
    "extensions": ["insert_pin_fields_extension"]
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const degree = block.getFieldValue('DEGREE');
    const pin = block.getFieldValue("PWMPIN_0");
    const instanceName = init(block, pin);

    let code = `${instanceName}.attach(${pin});\n`;
    code += `${instanceName}.write(${degree});\n`;
    code += `delay(250);\n`;
    code += `${instanceName}.detach();`
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
