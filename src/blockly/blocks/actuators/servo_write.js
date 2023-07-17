import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "servo_write";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Mover a %1 grados el Servo en el %2",
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
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Cambia la posición de un Servo a los grados especificados.",
    "helpUrl": "",
    "style": "actuators_blocks",
    "extensions": ["insert_pin_fields_extension"]
};

export const init = (block, varName, pin) => {
    //Required libs
    arduinoGenerator.addInclude("servo_lib", "#include <Servo.h>");

    //Reserve pin
    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.PWM, "actuator_servo");
    
    //Instance
    arduinoGenerator.addVariable(varName, `Servo ${varName};`, false);
    arduinoGenerator.addSetup(varName, `${varName}.attach(${pin});`, false);
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
export const blockToArduino = function (block) {
    //Block data
    const degree = block.getFieldValue('DEGREE');
    const pin = block.getFieldValue("PWMPIN_0");
    const varName = "actuator_servo_" + pin;

    init(block, varName, pin);
    let code = `${varName}.attach(${pin});\n`;
    code += `${varName}.write(${degree});`;
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
