import {Block, common, Names} from "blockly";
import arduinoGenerator from "../generators/arduino/arduino";

export const getVariablesTypes = () => {
    return Object.freeze([
        {key: "Integer", name: "Número Entero", varName: "Entera", setType: "Number", getType: "Number", style: "math_blocks"},
        {key: "Float", name: "Número Real", varName: "Real", setType: "Number", getType: "Number", style: "math_blocks"},
        {key: "Bool", name: "Valor Lógico", varName: "Lógica", setType: "Boolean", getType: "Boolean", style: "logic_blocks"},
        {key: "String", name: "Texto", varName: "Texto", setType: "String", getType: "String", style: "string_blocks"}
    ]);
}

const generateGetterBlock = (t) => {
    const getterBlockName = "variables_get_" + t.key;
    const jsonDefinition = {
        "type": getterBlockName,
        "message0": "%1",
        "args0": [{
            "type": "field_variable",
            "name": "VAR",
            "variable": "miVariable" + t.varName,
            "variableTypes": [t.key],
            "defaultType": t.key
        }],
        "output": t.getType,
        "style": t.style,
        "tooltip": `Usar el ${t.name} almacenado en una variable.`,
        "helpUrl": "",
        "extensions": ["check_var_initialization"]
    };

    // Block registration
    common.defineBlocksWithJsonArray([jsonDefinition]);
    arduinoGenerator.forBlock[getterBlockName] = getBlockToArduino;
}

/**
 * Handler in charge of converting the getter block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const getBlockToArduino = function (block) {
    const varName = block.getFieldValue('VAR');
    const exportName = arduinoGenerator.nameDB_.getName(varName, Names.NameType.VARIABLE);

    return [exportName, arduinoGenerator.ORDER_ATOMIC];
};

const generateSetterBlock = (t) => {
    const setterBlockName = "variables_set_" + t.key;
    const jsonDefinition = {
        "type": setterBlockName,
        "message0": "Guardar en %1 el valor %2",
        "args0": [
            {
                "type": "field_variable",
                "name": "VAR",
                "variable": "miVariable" + t.varName,
                "variableTypes": [t.key],
                "defaultType": t.key
            },
            {
                "type": "input_value",
                "name": "VALUE",
                "check": t.setType
            }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "style": t.style,
        "tooltip": `Guardar un ${t.name} en una variable.`,
        "helpUrl": ""
    };

    // Block registration
    common.defineBlocksWithJsonArray([jsonDefinition]);
    arduinoGenerator.forBlock[setterBlockName] = setBlockToArduino;
}

/**
 * Handler in charge of converting the setter block into Arduino code.
 * @param {Block} block 
 * @return {string} Arduino code
 */
const setBlockToArduino = function (block) {
    const varName = block.getFieldValue('VAR');
    const exportName = arduinoGenerator.nameDB_.getName(varName, Names.NameType.VARIABLE);
    const value = arduinoGenerator.valueToCode(block, 'VALUE', arduinoGenerator.ORDER_ASSIGNMENT) || '0';

    const code = `${exportName} = ${value};`;
    return code + "\n";
};


for(let t of getVariablesTypes()){
    generateGetterBlock(t);
    generateSetterBlock(t);
}