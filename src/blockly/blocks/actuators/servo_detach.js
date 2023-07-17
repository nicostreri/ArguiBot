import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
import { init } from "./servo_write";

const blockName = "servo_detach";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Desasociar el Servo conectado al %1",
    "args0": [
        { "type": "input_dummy", "name": "PW_0" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Desasocia un Servo conectado a un pin del microcontrolador.",
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
    const pin = block.getFieldValue("PWMPIN_0");
    const varName = "actuator_servo_" + pin;

    init(block, varName, pin);
    let code = `${varName}.detach();`;
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
