import * as Blockly from "blockly";
import './check_var_initialization_extension';
import './setters_getters_blocks';
import { getVariablesTypes } from "./setters_getters_blocks";

// Generator of the dynamic category "Variables"
const variablesCategoryCallback = function(workspace) {
    const types = getVariablesTypes();
    const blockList = [];
    const buttonList = [];

    const groupByType = workspace.getAllVariables().reduce((group, variable) => {
        const { type } = variable;
        group[type] = group[type] ?? [];
        group[type].push(variable);
        return group;
      }, {}
    );
      

    for(let t of types){
        //Add create variable button
        buttonList.push({ 
            kind: "button",
            text: "Crear variable para " + t.name + "...",
            callbackKey: "addVar" + t.key 
        });
    
        //if there are variables of the type add the use buttons
        if(groupByType[t.key]){
            blockList.push({ kind: "label", text: "Uso de Variables con " + t.name });
            blockList.push({ kind: "block", type: "variables_set_" + t.key });
            blockList.push({ kind: "block", type: "variables_get_" + t.key });
        }
    }

    let categoryList = [];
    categoryList.push({ kind: "label", text: "Creación de Variables" });
    categoryList = categoryList.concat(buttonList);
    if(blockList.length > 0){
        categoryList = categoryList.concat(blockList);
    }
    return categoryList;
};

export const initVariables = (workspace) => {
    workspace.registerToolboxCategoryCallback('VARIABLE', variablesCategoryCallback);
    for(let type of getVariablesTypes()){
        const buttonKey = "addVar" + type.key;
        workspace.registerButtonCallback(buttonKey, () => {
            Blockly.Variables.createVariableButtonHandler(workspace, null, type.key);
        });
    }
}