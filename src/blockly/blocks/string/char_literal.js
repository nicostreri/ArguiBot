import { Block, common, Extensions } from "blockly";
import arduinoGenerator from "./../../generators/arduino/arduino";

const blockName = "char_literal";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "\"%1\"",
    "args0": [
        {
            "type": "field_input",
            "name": "CHAR",
            "text": "A"
        }
    ],
    "output": "Char",
    "tooltip": "Un carácter.",
    "helpUrl": "",
    "style": "string_blocks",
    "extensions": ["char_validator"]
};

Extensions.register('char_validator', function() {
    // Add custom validation.
    this.getField('CHAR').setValidator(function(newValue) {
        // Force a char.
        if(!newValue) return null;
        if(typeof newValue != "string") return null;

        if(newValue.length == 1){
            if(newValue[0] == '\\') return "\\\\";
            if(newValue[0] == "'") return "\\'";
            return newValue;
        }
        if(newValue.length == 2 && newValue[0] == '\\') return newValue;

        return null;
    });
});

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    const char = block.getFieldValue("CHAR");

    const code = `'${char}'`;
    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator[blockName] = blockToArduino;