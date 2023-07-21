import { Names } from "blockly";

export const init = (block, arduinoGenerator, compatibilityMode = false) => {
    // Includes
    arduinoGenerator.addInclude("multi_shield_screen_lib", "#include <MultifunctionDisplay.h>");

    // Reserve pins
    arduinoGenerator.reservePin(block, "4", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_latch");
    arduinoGenerator.reservePin(block, "7", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_clk");
    arduinoGenerator.reservePin(block, "8", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_data");

    //Instance
    const instanceName = arduinoGenerator.nameDB_.getName("display", Names.NameType.DEVELOPER_VARIABLE);
    arduinoGenerator.addVariable(instanceName, `MultifunctionDisplay ${instanceName}(4, 7, 8);`, false);

    //Refresh code
    if(compatibilityMode){
        //Yield code
        arduinoGenerator.addYield("multi_shield_screen_yield", `${instanceName}.refresh();\n`, true);
        arduinoGenerator.addSetup("multi_shield_screen_setup", "", true);
        arduinoGenerator.addInclude("timer_one_lib", "", "", true);
    }else{
        let setupCode = "Timer1.initialize();\n";
        setupCode += `Timer1.attachInterrupt([]() {${instanceName}.refresh();}, 500);\n`;
        arduinoGenerator.addSetup("multi_shield_screen_setup", setupCode, false);
        arduinoGenerator.addInclude("timer_one_lib", "#include <TimerOne.h>", "", false);        
    }
    
    return instanceName;
}