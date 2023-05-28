import {Block, common} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "controls_flow_statements";

/** 
 * JSON block definition
 * @ignore Custom block
*/

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    let flow = block.getFieldValue("FLOW");
    switch(flow){
        case "CONTINUE": return "continue;\n";
        case "BREAK": return "break;\n";
    }
};

// Block registration
arduinoGenerator[blockName] = blockToArduino;
