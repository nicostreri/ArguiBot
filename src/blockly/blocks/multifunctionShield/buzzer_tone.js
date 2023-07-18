import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "multi_shield_buzzer_tone";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Emitir tono con Frecuencia de %1 y Duración de %2 milisegundos",
    "args0": [
      {
        "type": "input_value",
        "name": "FREQ",
        "check": "Number"
      },
      {
        "type": "input_value",
        "name": "TIME",
        "check": "Number"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "style": "multi_shield_blocks",
    "tooltip": "Emite un tono utilizando el Buzzer de la placa multifunción.",
    "helpUrl": ""
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
  const freq = arduinoGenerator.valueToCode(block, 'FREQ', arduinoGenerator.ORDER_ATOMIC) || '0';
  const time = arduinoGenerator.valueToCode(block, 'TIME', arduinoGenerator.ORDER_ATOMIC) || '0';

  //Configure pin
  arduinoGenerator.reservePin(block, "3", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_buzzer");
  arduinoGenerator.addSetup('pin_mode_3', `pinMode(3, OUTPUT);\n  digitalWrite(3, HIGH);`, false);

  let code = `tone(3, ${freq}, ${time});\n`;
  code += `delay(${time});\n`;
  code += 'digitalWrite(3, HIGH);\n';
  return code;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
