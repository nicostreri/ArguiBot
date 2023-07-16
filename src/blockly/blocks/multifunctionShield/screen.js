import { Names } from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";
let GVar;

/**
 * Generate display_refresh template
 * @param {*} vars 
 * @returns 
 */
const getRefreshFunctionTemplate = (vars) => {
    return [
        'void ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '() {',
        '   noInterrupts();',
        `   ${vars.currSeg} = (${vars.currSeg} > 2) ? 0 : ${vars.currSeg} + 1;`,
        `   digitalWrite(${vars.latchPin}, LOW);`,
        `   shiftOut(${vars.dataPin}, ${vars.clkPin}, MSBFIRST, ${vars.rawSeg}[${vars.currSeg}]);`,
        `   shiftOut(${vars.dataPin}, ${vars.clkPin}, MSBFIRST, ${vars.segSel}[${vars.currSeg}]);`,
        `   digitalWrite(${vars.latchPin}, HIGH);`,
        '   interrupts();',
        '}'
    ].join('\n');
}

const init = (block, arduinoGenerator) => {
    // Initialize only once
    if(arduinoGenerator.getFlag("multi_shield_screen_init")) return;
    arduinoGenerator.addFlag("multi_shield_screen_init", "initialized");

    // Includes
    arduinoGenerator.addInclude("timer_one_lib", "#include <TimerOne.h>", "https://github.com/PaulStoffregen/TimerOne");

    // Global variables
    const latchPin = arduinoGenerator.nameDB_.getDistinctName('LATCH_DIO', Names.NameType.DEVELOPER_VARIABLE);
    const clkPin = arduinoGenerator.nameDB_.getDistinctName('CLK_DIO', Names.NameType.DEVELOPER_VARIABLE);
    const dataPin = arduinoGenerator.nameDB_.getDistinctName('DATA_DIO', Names.NameType.DEVELOPER_VARIABLE);
    const currSeg = arduinoGenerator.nameDB_.getDistinctName('current_segment', Names.NameType.DEVELOPER_VARIABLE);
    const rawSeg = arduinoGenerator.nameDB_.getDistinctName('display_raw_segment', Names.NameType.DEVELOPER_VARIABLE);
    const segMap = arduinoGenerator.nameDB_.getDistinctName('SEG_MAP', Names.NameType.DEVELOPER_VARIABLE);
    const segSel = arduinoGenerator.nameDB_.getDistinctName('SEG_SEL', Names.NameType.DEVELOPER_VARIABLE);
    GVar = {latchPin, clkPin, dataPin, currSeg, rawSeg, segMap, segSel}
    
    arduinoGenerator.addVariable(latchPin, `#define ${latchPin} 4`, false);
    arduinoGenerator.addVariable(clkPin, `#define ${clkPin} 7`, false);
    arduinoGenerator.addVariable(dataPin, `#define ${dataPin} 8`, false);
    arduinoGenerator.addVariable(currSeg, `volatile uint8_t ${currSeg} = 0;`, false);
    arduinoGenerator.addVariable(rawSeg, `uint8_t ${rawSeg}[] = {0xff, 0xff, 0xff, 0xff};`, false);
    arduinoGenerator.addVariable(segMap, `const uint8_t ${segMap}[] = {0xC0,0xF9,0xA4,0xB0,0x99,0x92,0x82,0xF8,0X80,0X90};`, false);
    arduinoGenerator.addVariable(segSel, `const uint8_t ${segSel}[] = {0xf1, 0xf2, 0xf4, 0xf8};`, false);

    // Reserve pins
    arduinoGenerator.reservePin(block, "4", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_latch");
    arduinoGenerator.reservePin(block, "7", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_clk");
    arduinoGenerator.reservePin(block, "8", arduinoGenerator.PinTypes.CIRCUIT, "multi_shield_screen_data");

    // Helper functions
    const displayRefreshFunction = arduinoGenerator.addFunction('multi_shield_display_refresh', getRefreshFunctionTemplate(GVar));

    // Setup code
    arduinoGenerator.addSetup('pin_mode_4', `pinMode(${latchPin}, OUTPUT);`, false);
    arduinoGenerator.addSetup('pin_mode_7', `pinMode(${clkPin}, OUTPUT);`, false);
    arduinoGenerator.addSetup('pin_mode_8', `pinMode(${dataPin}, OUTPUT);`, false);
    arduinoGenerator.addSetup("multi_shield_screen_setup", `Timer1.initialize();\n  Timer1.attachInterrupt(${displayRefreshFunction}, 500);\n`, false);
}

const getVars = () => {
    return GVar;
}

export {
    init,
    getVars
}