import {Block, common, Blocks} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "board_setup_loop";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "message0": "Configuración Inicial %1 Repetir por siempre %2",
    "args0": [
        {
            "type": "input_statement",
            "name": "SETUP"
        },
        {
            "type": "input_statement",
            "name": "LOOP"
      }
    ],
    "tooltip": "Los bloques en \"Configuración Inicial\" se ejecutarán una sola vez al arranque, mientras que los bloques en \"Repetir por siempre\" se ejecutarán de forma repetida.",
    "helpUrl": "",
    "style": "board_blocks"
};

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let statements_setup = arduinoGenerator.statementToCode(block, 'SETUP');
    let statements_loop = arduinoGenerator.statementToCode(block, 'LOOP');
    arduinoGenerator.addSetup("user_setup", statements_setup);
    
    return statements_loop;
};

// // Block registration
Blocks[blockName] = {
    init: function() {
        this.jsonInit(jsonDefinition);
        this.setDeletable(false);
        this.setMovable(false);
        this.setEditable(false);
    }
};
arduinoGenerator[blockName] = blockToArduino;
