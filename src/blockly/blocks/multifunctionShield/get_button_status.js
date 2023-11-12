import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "multi_shield_get_button_status";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "¿Está el botón %1 presionado?",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "BUTTON",
            "options": [ ["1", "BT1"], ["2", "BT2"], ["3", "BT3"] ]
        }
    ],
    "output": "Boolean",
    "tooltip": "Obtiene el estado de una botón. Verdadero indica que el botón está presionado, Falso el caso contrario.",
    "helpUrl": "",
    "style": "multi_shield_blocks",
};

/**
 * Multifunction Shield pin assignment
 */
const ButtonIDToPINmap = {
    "BT1": "A1",
    "BT2": "A2",
    "BT3": "A3"
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const buttonID = block.getFieldValue("BUTTON");
    const buttonPIN = ButtonIDToPINmap[buttonID];

    arduinoGenerator.reservePin(block, buttonPIN, arduinoGenerator.PinTypes.INPUT, "getButtonStatus");
    arduinoGenerator.addSetup('pin_mode_' + buttonPIN, `pinMode(${buttonPIN}, INPUT_PULLUP);`, true);

    const code = `!digitalRead(${buttonPIN})`;
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
