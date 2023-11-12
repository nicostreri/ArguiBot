import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "math_ardu_map";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": "math_ardu_map",
    "message0": "Mapear el número %1 desde el rango [ %2 - %3 ] al rango [ %4 - %5 ]",
    "args0": [
      {
        "type": "input_value",
        "name": "VALUE",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "FROMLOW",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "FROMHIGH",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "TOLOW",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "TOHIGH",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "output": "Number",
    "colour": 230,
    "tooltip": "Dado un número del primer rango, lo asocia con un número del segundo rango.",
    "helpUrl": ""
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let value = arduinoGenerator.valueToCode(block, 'VALUE', arduinoGenerator.ORDER_NONE);
    let fromLow = arduinoGenerator.valueToCode(block, 'FROMLOW', arduinoGenerator.ORDER_NONE);
    let fromHigh = arduinoGenerator.valueToCode(block, 'FROMHIGH', arduinoGenerator.ORDER_NONE);
    let toLow = arduinoGenerator.valueToCode(block, 'TOLOW', arduinoGenerator.ORDER_NONE);
    let toHigh = arduinoGenerator.valueToCode(block, 'TOHIGH', arduinoGenerator.ORDER_NONE);

    let code = `map(${value}, ${fromLow}, ${fromHigh}, ${toLow}, ${toHigh})`;
    return [code, arduinoGenerator.ORDER_UNARY_POSTFIX];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
