import {Block, common, Names} from "blockly";
import arduinoGenerator from "../../generators/arduino/arduino";

const blockName = "sensor_dht11";

/** 
 * JSON block definition
*/
const jsonDefinition = {
    "type": blockName,
    "message0": "%1 actual del sensor DHT11 en %2",
    "args0": [
        {
            "type": "field_dropdown",
            "name": "DATA",
            "options": [ [ "Temperatura", "TEMP" ], [ "Humedad", "HUM" ] ]
        },
        { "type": "input_dummy", "name": "PD_0" }
    ],
    "inputsInline": false,
    "output": "Number",
    "tooltip": "Obtiene la temperatura o humedad leída por el sensor DHT11.",
    "helpUrl": "",
    "style": "sensors_blocks",
    "extensions": ["insert_pin_fields_extension"]
};

/**
 * Generate dht_temperature template
 * @returns 
 */
const getDHTTemperature = () => {
    return [
        'float ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '(DHT &sensor){',
        '   Timer1.stop();',
        '   float temp = sensor.readTemperature();',
        '   Timer1.start();',
        '   return temp;',
        '}'
    ].join('\n');
}

/**
 * Generate dht_humidity template
 * @returns 
 */
const getDHTHumidity = () => {
    return [
        'float ' + arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ + '(DHT &sensor){',
        '   Timer1.stop();',
        '   float humidity = sensor.readHumidity();',
        '   Timer1.start();',
        '   return humidity;',
        '}'
    ].join('\n');
}

/**
 * Handler in charge of converting the block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const blockToArduino = function (block) {
    //Block data
    const dataToRead = block.getFieldValue('DATA');
    const pin = block.getFieldValue("DIGITALPIN_0");

    //Required libs
    arduinoGenerator.addInclude("dht_lib", "#include <DHT.h>");
    
    //Reserve pin
    arduinoGenerator.reservePin(block, pin, arduinoGenerator.PinTypes.CIRCUIT, "sensor_dht11");
    
    //Instance
    const varName = arduinoGenerator.nameDB_.getName("sensor_dht11_" + pin, Names.NameType.DEVELOPER_VARIABLE);
    arduinoGenerator.addVariable(varName, `DHT ${varName}(${pin}, DHT11);`, false);
    arduinoGenerator.addSetup(varName, `${varName}.begin();`, false);

    let screenCompatibilityMode = arduinoGenerator.getFlag("multi_shield_screen_compatibility_mode");  
    if(screenCompatibilityMode == undefined) screenCompatibilityMode = true;

    let code = "";
    if(!screenCompatibilityMode){
        let wrapperReadFunction;
        //Add wrapper functions
        if(dataToRead == "TEMP"){
            wrapperReadFunction = arduinoGenerator.addFunction('dht_temperature', getDHTTemperature());
        }else{
            wrapperReadFunction = arduinoGenerator.addFunction('dht_humidity', getDHTHumidity());
        }
        code = `${wrapperReadFunction}(${varName})`;
    }else{
        const readFunction = (dataToRead == "TEMP") ? "readTemperature" : "readHumidity";
        code = `${varName}.${readFunction}()`;
    }

    return [code, arduinoGenerator.ORDER_ATOMIC];
};

// Block registration
common.defineBlocksWithJsonArray([jsonDefinition]);
arduinoGenerator.forBlock[blockName] = blockToArduino;
