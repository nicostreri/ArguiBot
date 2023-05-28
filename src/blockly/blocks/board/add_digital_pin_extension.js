import {Extensions, FieldDropdown} from "blockly";
import { getSelected } from "../../generators/arduino/boards";

Extensions.register('add_digital_pin_extension',function() {
    this.appendDummyInput()
        .appendField("PIN digital")
        .appendField(new FieldDropdown(function() {
            return getSelected().digitalPins 
        }), 'DIGITALPIN');
    
    this.setOnChange(function(changeEvent) {
        if(changeEvent.type != "change") return;
        this.updateWarning();
    });

    this.mixin({
        updateWarning: function(){
            const field = this.getField("DIGITALPIN");
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
                this.setWarningText(`El PIN ${fieldValue} no está disponible en la placa seleccionada.`, 'bPin');
            } else {
                this.setWarningText(null, 'bPin');
            }
        },
        
        updatePIN: function() {
            const field = this.getField("DIGITALPIN");
            field.getOptions(false); //Re-generate pins
            this.updateWarning();
        }
    });
});