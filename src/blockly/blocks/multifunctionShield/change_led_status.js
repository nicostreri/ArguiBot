import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "multi_shield_change_led_status";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "Cambiar el LED %1 a %2",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "LEDID",
            "options": [ ["1", "LED1"], ["2", "LED2"], ["3", "LED3"], ["4", "LED4"] ]
        },
        {
            "type": "field_dropdown",
            "name": "STATUS",
            "options": [ ["Encendido", "ON"], ["Apagado", "OFF"] ]
        }
    ],
    "previousStatement": null,
    "nextStatement": null,
    "tooltip": "Permite cambiar el estado de un LED, es decir, encenderlo o apagarlo.",
    "helpUrl": "",
    "style": "multi_shield_blocks"
}

/**
 * Multifunction Shield pin assignment
 */
const LEDtoPINmap = {
    "LED1": 13,
    "LED2": 12,
    "LED3": 11,
    "LED4": 10
};

const StatusToValuePINmap = {
    "ON": "LOW",
    "OFF": "HIGH"
};
  
/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const LEDId = block.getFieldValue("LEDID");
    const status = block.getFieldValue("STATUS");

    const LEDPin = LEDtoPINmap[LEDId];
    const statusPin = StatusToValuePINmap[status];

    arduinoGenerator.reservePin(block, LEDPin, arduinoGenerator.PinTypes.OUTPUT, "MSchangeLEDStatus");
    arduinoGenerator.addSetup('pin_mode_' + LEDPin, `pinMode(${LEDPin}, OUTPUT);`, false);
    arduinoGenerator.addSetup('ms_led_init_' + LEDId, `digitalWrite(${LEDPin}, HIGH);`, false);
    
    return `digitalWrite(${LEDPin}, ${statusPin});\n`;
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;
