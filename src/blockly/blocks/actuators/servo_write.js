import {Block, common, Names} from "blockly";
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

export const init = (block, pin) => {
    //Required libs
    arduinoGenerator.addInclude("servo_lib", "#include <Servo.h>");

    //Reserve pin
    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.PWM, "actuator_servo");
    
    //Instance
    const varName = "servo_" + pin;
    const instanceName = arduinoGenerator.nameDB_.getName(varName, Names.NameType.DEVELOPER_VARIABLE);
    arduinoGenerator.addVariable(instanceName, `Servo ${instanceName};`, false);
    arduinoGenerator.addSetup(varName, `${instanceName}.attach(${pin});`, false);
    return instanceName;
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
    const instanceName = init(block, pin);

    let code = `${instanceName}.attach(${pin});\n`;
    code += `${instanceName}.write(${degree});`;
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
