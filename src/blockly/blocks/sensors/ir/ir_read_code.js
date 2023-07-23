import {Block, common} from "blockly";
import arduinoGenerator from "../../../generators/arduino/arduino";

const blockName = "sensor_ir_read_code";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Código recibido por IR",
    "output": "Number",
    "style": "sensors_blocks",
    "tooltip": "Lee el último código IR recibido.",
    "helpUrl": "",
    "extensions": ["ir_read_on_check_block"]
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {

    const code = "IrReceiver.decodedIRData.command";
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
