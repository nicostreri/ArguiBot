/**
 * Based on work of:
 *  - Project SenseBox Ardublockly https://github.com/sensebox/ardublockly
 *
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 * 
 * @fileoverview Implements the required data for functions for selecting
 *     amongst different Arduino boards.
 */

/**
 * Helper function to generate an array of pins (each an array of length 2) for
 * the digital IO.
 * @param {!integer} pinStart Start number for the IOs pin list to generate.
 * @param {!integer} pinEnd Last inclusive number for the list to generate.
 * @return {!array} Two dimensional array with the name and value for the
 *     digital IO pins.
 */
function generateDigitalIo(pinStart, pinEnd) {
    let digitalIo = [];
    for (let i = pinStart; i < (pinEnd + 1); i++) {
        digitalIo.push([i.toString(), i.toString()]);
    }
    return digitalIo;
};

/**
 * Helper function to generate an array of pins (each an array of length 2) for
 * the analogue IO.
 * @param {!integer} pinStart Start number for the IOs pin list to generate.
 * @param {!integer} pinEnd Last inclusive number for the list to generate.
 * @return {!array} Two dimensional array with the name and value for the
 *     analogue IO pins.
 */
function generateAnalogIo(pinStart, pinEnd) {
    let analogIo = [];
    for (let i = pinStart; i < (pinEnd + 1); i++) {
        analogIo.push(['A' + i.toString(), 'A' + i.toString()]);
    }
    return analogIo;
};

/**
 * Creates a new Board Profile copying all the attributes from an existing
 * profile, with the exception of the name, and optionally the description and
 * compiler flag.
 * @param {!string} name_ Mandatory new name of the new board profile.
 * @param {string=} description Optional new description of the new profile.
 * @param {string=} compilerFlag Optional new description of the new profile.
 * @return {!Object} Duplicated object with the different argument data.
 */
function duplicateBoardProfile(originalBoard, name_, description, compilerFlag) {
    return {
        name: name_,
        description: description || originalBoard.description,
        compilerFlag: compilerFlag || originalBoard.compilerFlag,
        analogPins: originalBoard.analogPins,
        digitalPins: originalBoard.digitalPins,
        pwmPins: originalBoard.pwmPins,
        serial: originalBoard.serial,
        serialPins: originalBoard.serialPins,
        serialSpeed: originalBoard.serialSpeed,
        spi: originalBoard.spi,
        spiPins: originalBoard.spiPins,
        spiClockDivide: originalBoard.spiClockDivide,
        i2c: originalBoard.i2c,
        i2cPins: originalBoard.i2cPins,
        i2cSpeed: originalBoard.i2cSpeed,
        builtinLed: originalBoard.builtinLed,
        interrupt: originalBoard.interrupt
    }
};

/** Object to contain all Arduino board profiles. */
const Profiles = new Object();

/** Arduino Uno board profile. */
Profiles["arduino:avr:uno"] = {
    name: 'Arduino Uno',
    description: 'Arduino Uno standard compatible board',
    compilerFlag: 'arduino:avr:uno',
    analogPins: generateAnalogIo(0, 5),
    digitalPins: generateDigitalIo(0, 13).concat(generateAnalogIo(0, 5)),
    pwmPins: [['3', '3'], ['5', '5'], ['6', '6'], ['9', '9'], ['10', '10'], ['11', '11']],
    serial: [['serial', 'Serial']],
    serialPins: { Serial: [['RX', '0'], ['TX', '1']] },
    serialSpeed: [['300', '300'], ['600', '600'], ['1200', '1200'],
                    ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
                    ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
                    ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
                    ['115200', '115200']],
    spi: [['SPI', 'SPI']],
    spiPins: { SPI: [['MOSI', '11'], ['MISO', '12'], ['SCK', '13']] },
    spiClockDivide: [['2 (8MHz)', 'SPI_CLOCK_DIV2'],
                    ['4 (4MHz)', 'SPI_CLOCK_DIV4'],
                    ['8 (2MHz)', 'SPI_CLOCK_DIV8'],
                    ['16 (1MHz)', 'SPI_CLOCK_DIV16'],
                    ['32 (500KHz)', 'SPI_CLOCK_DIV32'],
                    ['64 (250KHz)', 'SPI_CLOCK_DIV64'],
                    ['128 (125KHz)', 'SPI_CLOCK_DIV128']],
    i2c: [['I2C', 'Wire']],
    i2cPins: { Wire: [['SDA', 'A4'], ['SCL', 'A5']] },
    i2cSpeed: [['100kHz', '100000L'], ['400kHz', '400000L']],
    builtinLed: [['BUILTIN_1', '13']],
    interrupt: [['interrupt0', '2'], ['interrupt1', '3']]
};

// /** Arduino Nano board profile (ATmega328p). */
// Blockly.Arduino.Boards.profiles.nano_328 = {
//   name: 'Arduino Nano 328',
//   description: 'Arduino Nano with ATmega328 board',
//   compilerFlag: 'arduino:avr:nano:cpu=atmega328',
//   analogPins: Blockly.Arduino.Boards.generateAnalogIo(0, 7),
//   digitalPins: Blockly.Arduino.Boards.generateDigitalIo(0, 13).concat(
//                    Blockly.Arduino.Boards.generateAnalogIo(0, 7)),
//   pwmPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].pwmPins,
//   serial: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serial,
//   serialPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialPins,
//   serialSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialSpeed,
//   spi: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spi,
//   spiPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiPins,
//   spiClockDivide: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiClockDivide,
//   i2c: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2c,
//   i2cPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cPins,
//   i2cSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cSpeed,
//   builtinLed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].builtinLed,
//   interrupt: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].interrupt
// };
// Blockly.Arduino.Boards.profiles.nano_168 =
//     Blockly.Arduino.Boards.duplicateBoardProfile(
//         Blockly.Arduino.Boards.profiles.nano_328,
//         'Arduino Nano 168',
//         'Arduino Nano with ATmega168 compatible board',
//         'arduino:avr:nano:cpu=atmega168');

// /** Arduino Duemilanove boards profile (ATmega168p, ATmega328p). */
// Blockly.Arduino.Boards.profiles.duemilanove_168p = {
//   name: 'Arduino Nano 168p',
//   description: 'Arduino Duemilanove with ATmega168p compatible board',
//   compilerFlag: 'arduino:avr:diecimila:cpu=atmega168',
//   analogPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].analogPins,
//   digitalPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].digitalPins,
//   pwmPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].pwmPins,
//   serial: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serial,
//   serialPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialPins,
//   serialSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialSpeed,
//   spi: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spi,
//   spiPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiPins,
//   spiClockDivide: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiClockDivide,
//   i2c: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2c,
//   i2cPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cPins,
//   i2cSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cSpeed,
//   builtinLed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].builtinLed,
//   interrupt: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].interrupt
// };
// Blockly.Arduino.Boards.profiles.duemilanove_328p =
//     Blockly.Arduino.Boards.duplicateBoardProfile(
//         Blockly.Arduino.Boards.profiles.duemilanove_168p,
//         'Arduino Duemilanove 328p',
//         'Arduino Duemilanove with ATmega328p compatible board',
//         'arduino:avr:diecimila');

// /** Arduino Mega board profile. */
Profiles["arduino:avr:mega"] = {
  name: 'Arduino Mega',
  description: 'Arduino Mega-compatible board',
  compilerFlag: 'arduino:avr:mega',
  analogPins: generateAnalogIo(0, 15),
  //TODO: Check if the Mega can use analogue pins as digital, it would be
  //      logical but it is not clear on the arduino.cc website
  digitalPins: generateDigitalIo(0, 53),
  pwmPins: generateDigitalIo(2, 13).concat(generateDigitalIo(44, 46)),
  serial: [['serial', 'Serial'], ['serial_1', 'Serial1'],
           ['serial_2', 'Serial2'], ['serial_3', 'Serial3']],
  serialPins: {
    Serial: [['TX', '0'], ['RX', '1']],
    Serial1: [['TX', '18'], ['TX', '19']],
    Serial2: [['TX', '16'], ['TX', '17']],
    Serial3: [['TX', '14'], ['TX', '15']]
  },
  serialSpeed: Profiles["arduino:avr:uno"].serialSpeed,
  spi: [['SPI', 'SPI']],
  spiPins: { SPI: [['MOSI', '51'], ['MISO', '50'], ['SCK', '52']] },
  //TODO: confirm the clock divides are the same for the DUE and UNO
  spiClockDivide: Profiles["arduino:avr:uno"].spiClockDivide,
  i2c: [['I2C', 'Wire']],
  i2cPins: { Wire: [['SDA', '20'], ['SCL', '21']] },
  i2cSpeed: [['100kHz', '100000L'], ['400kHz', '400000L']],
  builtinLed: Profiles["arduino:avr:uno"].builtinLed,
  interrupt: [['interrupt0', '2'], ['interrupt1', '3'], ['interrupt2', '21'],
              ['interrupt3', '20'], ['interrupt4', '19'], ['interrupt5', '18']]
};

// /** Arduino Leonardo board profile. */
// Blockly.Arduino.Boards.profiles.leonardo = {
//   name: 'Arduino Leonardo',
//   description: 'Arduino Leonardo-compatible board',
//   compilerFlag: 'arduino:avr:leonardo',
//   analogPins: Blockly.Arduino.Boards.generateAnalogIo(0, 5).concat(
//                   [['A6', '4'], ['A7', '6'], ['A8', '8'], ['A9', '9'],
//                    ['A10', '10'], ['A11', '12']]),
//   digitalPins: Blockly.Arduino.Boards.generateDigitalIo(0, 13).concat(
//                    Blockly.Arduino.Boards.generateAnalogIo(0, 5)),
//   pwmPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].pwmPins.concat([['13', '13']]),
//   serial: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serial,
//   serialPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialPins,
//   serialSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialSpeed,
//   spi: [['SPI', 'SPI']],
//   spiPins: { SPI: [['MOSI', 'ICSP-4'], ['MISO', 'ICSP-1'], ['SCK', 'ICSP-3']] },
//   //TODO: confirm the clock divides are the same for the Leonardo and UNO
//   spiClockDivide: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiClockDivide,
//   i2c: [['I2C', 'Wire']],
//   i2cPins: { Wire: [['SDA', '2'], ['SCL', '3']] },
//   i2cSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cSpeed,
//   builtinLed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].builtinLed,
//   interrupt: [['interrupt0', '3'], ['interrupt1', '2'], ['interrupt2', '0'],
//               ['interrupt3', '1'], ['interrupt4', '17']]
// };

// /** Arduino Yun board processor and profile is identical to Leonardo. */
// Blockly.Arduino.Boards.profiles.yun =
//     Blockly.Arduino.Boards.duplicateBoardProfile(
//         Blockly.Arduino.Boards.profiles.leonardo,
//         'Arduino Yun',
//         'Arduino Yun compatible board');

// /** Atmel Xplained mini boards profile (atmega328p, atmega328pb, atmega168pb).*/
// Blockly.Arduino.Boards.profiles.atmel_atmega328p_xplained_mini = {
//   name: 'Atmel atmega328p Xplained mini',
//   description: 'Atmel Xplained mini board with atmega328p (Uno compatible)',
//   compilerFlag: 'atmel:avr:atmega328p_xplained_mini',
//   analogPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].analogPins,
//   digitalPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].digitalPins.concat(
//       [['20', '20']]),
//   pwmPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].pwmPins,
//   serial: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serial,
//   serialPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialPins,
//   serialSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialSpeed,
//   spi: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spi,
//   spiPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiPins,
//   spiClockDivide: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiClockDivide,
//   i2c: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2c,
//   i2cPins: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cPins,
//   i2cSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cSpeed,
//   builtinLed: [['BUILTIN_LED', '13']],
//   interrupt: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].interrupt,
//   builtinButton: [['BUILTIN_BUTTON', '20']]
// };
// Blockly.Arduino.Boards.profiles.atmel_atmega328pb_xplained_mini =
//     Blockly.Arduino.Boards.duplicateBoardProfile(
//         Blockly.Arduino.Boards.profiles.atmel_atmega328p_xplained_mini,
//         'Atmel atmega328pb Xplained mini',
//         'Atmel Xplained mini board with atmega328pb (Arduino Uno compatible)',
//         'atmel:avr:atmega328pb_xplained_mini');
// Blockly.Arduino.Boards.profiles.atmel_atmega168pb_xplained_mini =
//     Blockly.Arduino.Boards.duplicateBoardProfile(
//         Blockly.Arduino.Boards.profiles.atmel_atmega328p_xplained_mini,
//         'Atmel atmega168pb Xplained mini',
//         'Atmel Xplained mini board with atmega168pb (Arduino Uno compatible)',
//         'atmel:avr:atmega168pb_xplained_mini');

// /** ESP8266 for the Adafruit Huzzah. */
// Blockly.Arduino.Boards.profiles.esp8266_huzzah = {
//   name: 'Adafruit Feather HUZZAH',
//   description: 'Adafruit HUZZAH ESP8266 compatible board',
//   compilerFlag: 'esp8266:esp8266:generic',
//   analogPins: [['A0', 'A0']],
//   digitalPins: [['0', '0'], ['2', '2'], ['4', '4'], ['5', '5'], ['12', '12'],
//                 ['13', '13'], ['14', '14'], ['15', '15'], ['16', '16']],
//   pwmPins: [['2', '2']],
//   serial: [['serial', 'Serial']],
//   serialPins: { Serial: [['RX', 'RX'], ['TX', 'TX']] },
//   serialSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serial,
//   spi: [['SPI', 'SPI']],
//   spiPins: { SPI: [['MOSI', '13'], ['MISO', '12'], ['SCK', '14']] },
//   spiClockDivide: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiClockDivide,
//   i2c: [['I2C', 'Wire']],
//   i2cPins: { Wire: [['SDA', '4'], ['SCL', '5']] },
//   i2cSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cSpeed,
//   builtinLed: [['BUILTIN_1', '0']],
//   interrupt: [['interrupt0', '2'], ['interrupt1', '3']]
// };

// /** ESP8266 for the Wemos D1 R2. */
// Blockly.Arduino.Boards.profiles.esp8266_wemos_d1 = {
//   name: 'Wemos D1',
//   description: 'Wemos D1 R2 compatible board',
//   compilerFlag: 'esp8266:esp8266:generic',
//   analogPins: [['A0', 'A0']],
//   digitalPins: [['D0', 'D0'], ['D1', 'D1'], ['D2', 'D2'], ['D3', 'D3'],
//                 ['D4', 'D4'], ['D5', 'D5'], ['D6', 'D7'], ['D8', 'D8']],
//   pwmPins:  [['D1', 'D1'], ['D2', 'D2'], ['D3', 'D3'], ['D4', 'D4'],
//              ['D5', 'D5'], ['D6', 'D7'], ['D8', 'D8']],
//   serial: [['serial', 'Serial']],
//   serialPins: { Serial: [['RX', 'RX'], ['TX', 'TX']] },
//   serialSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].serialSpeed,
//   spi: [['SPI', 'SPI']],
//   spiPins: { SPI: [['MOSI', 'D7'], ['MISO', 'D6'], ['SCK', 'D5']] },
//   spiClockDivide: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].spiClockDivide,
//   i2c: [['I2C', 'Wire']],
//   i2cPins: { Wire: [['SDA', 'D2'], ['SCL', 'D1']] },
//   i2cSpeed: Blockly.Arduino.Boards.Profiles["arduino:avr:uno"].i2cSpeed,
//   builtinLed: [['BUILTIN_1', 'D4']],
//   interrupt: [['D0', 'D0'], ['D1', 'D1'], ['D2', 'D2'], ['D3', 'D3'],
//               ['D4', 'D4'], ['D5', 'D5'], ['D6', 'D7'], ['D8', 'D8']]
// };

/**
 * Changes the Arduino board profile selected, which trigger a refresh of the
 * blocks that use the profile.
 * @param {Blockly.Workspace} workspace Workspace to trigger the board change.
 * @param {string} newBoard Name of the new profile to set.
 * @returns {boolean} true if changed successfully
 */
function changeBoard(workspace, newBoard) {
    if(!newBoard) return false;
    if(workspace.currentBoard?.compilerFlag == newBoard) return true;
    
    if(Profiles[newBoard] === undefined) return false;
    workspace.currentBoard = Profiles[newBoard];

    // Update the pin out of all the blocks that uses them
    const blocks = workspace.getAllBlocks();
    for (let i = 0; i < blocks.length; i++) {
        const updateFields = blocks[i].updatePIN;
        if (updateFields) {
            updateFields.call(blocks[i]);
        }
    }
    return true;
};

/**
 * Refreshes the contents of a block Field Dropdown.
 * This is use to refresh the blocks after the board profile has been changed.
 * @param {!Blockly.Block} block Generated code.
 * @param {!string} fieldName Name of the block FieldDropdown to refresh.
 * @param {!string} boardKey Name of the board profile property to fetch.
 */
function refreshBlockFieldDropdown(block, fieldName, boardKey) {
    const field = block.getField(fieldName);
    const fieldValue = field.getValue();
    const dataArray = block.workspace.currentBoard[boardKey];
    field.menuGenerator_ = dataArray;

    let currentValuePresent = false;
    for (let i = 0; i < dataArray.length; i++) {
        if (fieldValue == dataArray[i][1]) {
            currentValuePresent = true;
        }
    }
    // If the old value is not present any more, add a warning to the block.
    if (!currentValuePresent) {
        block.setWarningText(`El PIN ${fieldValue} no está disponible en la placa seleccionada.`, 'bPin');
    } else {
        block.setWarningText(null, 'bPin');
    }
};

export {
    changeBoard,
    refreshBlockFieldDropdown
}