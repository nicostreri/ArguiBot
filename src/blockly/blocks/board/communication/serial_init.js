import arduinoGenerator from "../../../generators/arduino/arduino";

export const serial_init = () => {
    arduinoGenerator.addSetup("serial_init", "Serial.begin(9600);", false);
}