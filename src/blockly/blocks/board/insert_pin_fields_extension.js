import {Extensions, FieldDropdown} from "blockly";

function insertPINs(block, insertionKey, fieldKey, title, pinList){
    let insertedPins = [];
    for(let i = 0; i < 10; i++){
        let input = block.getInput(insertionKey + i);
        if(!input) break;

        const name = fieldKey + i;
        input.appendField(title)
            .appendField(new FieldDropdown(function() {
                const fieldDropdownData = (block.workspace.currentBoard) ? block.workspace.currentBoard[pinList] : [["1", "1"]];
                return fieldDropdownData;
            }), name);
        insertedPins.push(name);
    }
    return insertedPins;
}

Extensions.register('insert_pin_fields_extension',function() {
    const digitalPINs = insertPINs(this, "PD_", 'DIGITALPIN_', "PIN digital", "digitalPins");
    const analogPINs = insertPINs(this, "PA_", 'ANALOGPIN_', "PIN analógico", "analogPins");
    const pwmPINs = insertPINs(this, "PW_", 'PWMPIN_', "PIN PWM", "pwmPins");

    const PINfields = digitalPINs.concat(analogPINs, pwmPINs);

    this.setOnChange(function(changeEvent) {
        if(changeEvent.type != "change") return;
        this.updateWarning();
    });

    this.mixin({
        updateWarning: function(){
            for(let fieldName of PINfields){
                const field = this.getField(fieldName);
                const fieldValue = field.getValue();
                const dataArray = field.getOptions(true);
            
                let currentValuePresent = false;
                for (let i = 0; i < dataArray.length; i++) {
                    if (fieldValue == dataArray[i][1]) {
                        currentValuePresent = true;
                    }
                }
                // If the old value is not present any more, add a warning to the block.
                if (!currentValuePresent) {
                    this.setWarningText(`El PIN ${fieldValue} no está disponible en la placa seleccionada.`, fieldName);
                } else {
                    this.setWarningText(null, fieldName);
                }
            }
        },
        
        updatePIN: function() {
            for(let fieldName of PINfields){
                const field = this.getField(fieldName);
                field.getOptions(false); //Re-generate pins
                this.updateWarning();
            }
        }
    });
});