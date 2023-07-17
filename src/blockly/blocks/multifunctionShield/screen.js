export const init = (block, arduinoGenerator) => {
    // Includes
    arduinoGenerator.addInclude("multi_shield_screen_lib", "#include <MultifunctionDisplay.h>");

    // Reserve pins
    arduinoGenerator.reservePin(block, "4", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_latch");
    arduinoGenerator.reservePin(block, "7", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_clk");
    arduinoGenerator.reservePin(block, "8", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_data");

    //Instance
    arduinoGenerator.addVariable("multi_shield_screen_var", `MultifunctionDisplay display(4, 7, 8);`, false);

    //Yield code
    arduinoGenerator.addYield("multi_shield_screen_yield", `display.refresh();\n`, false);
}