import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_digital_read";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Estado actual del %1 (LI* %2)",
    "args0":[
        {"type": "input_dummy", "name": "PD_0"},
        {"type": "field_checkbox", "name": "INVERTED", "checked": false}
    ],
    "inputsInline": true,
    "output": "Boolean",
    "style": "board_blocks",
    "tooltip": "Lee el estado actual de un PIN digital del controlador. Habilitar LI si el dispositivo conectado al pin trabaja con lógica invertida.",
    "helpUrl": "",
    "extensions": ["insert_pin_fields_extension"]
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const pin = block.getFieldValue("DIGITALPIN_0");
    const inverted = block.getFieldValue("INVERTED") == "TRUE";
    
    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.INPUT, "digitalRead");
    arduinoGenerator.addSetup('pin_mode_' + pin, `pinMode(${pin}, INPUT);`, false);

    let code = `digitalRead(${pin})`;
    if(inverted) code = "!" + code;
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
