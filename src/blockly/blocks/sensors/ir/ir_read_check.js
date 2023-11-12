import {Block, common} from "blockly";
import arduinoGenerator from "../../../generators/arduino/arduino";

const blockName = "sensor_ir_read_check";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Si se recibieron datos por IR en el %1 hacer %2",
    "args0": [
        { "type": "input_dummy", "name": "PD_0" },
        { "type": "input_statement", "name": "DO" }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Comprueba si se recibieron datos por el módulo infrarojo. En caso que SI, ejecuta el código interno.",
    "helpUrl": "",
    "style": "sensors_blocks",
    "extensions": ["insert_pin_fields_extension"]
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @note due to library limitations only one check block should be used
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const alreadyInitiated = arduinoGenerator.getFlag("ir_read_check");
    if(alreadyInitiated){
        block.setWarningText("Este bloque solo puede ser usado una vez en el programa.", "ir_read_check_message");
        return "";
    }else{
        arduinoGenerator.addFlag("ir_read_check", true);
        block.setWarningText(null, "ir_read_check_message");
    }

    const pin = block.getFieldValue("DIGITALPIN_0");
    const doCode = arduinoGenerator.statementToCode(block, 'DO');

    // Includes
    arduinoGenerator.addInclude("ir_lib", "#define DECODE_NEC\n#include <IRremote.hpp>");

    // Reserve pins
    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.INPUT, "ir_pin");

    //Setup
    arduinoGenerator.addSetup("ir_lib_setup", `IrReceiver.begin(${pin});`, false);
    
    let code = `if (IrReceiver.decode()) {\n`;
    code += doCode;
    code += `IrReceiver.resume();\n}`;
    return code + '\n';
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;