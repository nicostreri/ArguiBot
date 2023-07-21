import { Events, Extensions } from "blockly";

/**
 * Based on https://github.com/google/blockly/blob/9efc0d7dd0cd975da25a633760abe0a0ad753415/blocks/loops.ts#L337C6-L337C6
 */
const checkVariableInitializationMixin = {
    
    getClosestInitialization: function (startBlock, varIDToCheck) {
        let block = startBlock;
        do {
            if (!block.disabled && block.type && block.type.startsWith("variables_set_")) {
              //Check var id
              const blockVarID = block.getField("VAR").getValue();
              if(blockVarID == varIDToCheck){
                return block;
              }
            }
            block = block.getParent();
        } while (block);
        return null;
    },

    getNearestStatementBlock: function () {
      let block = this;
      do {
        block = block.getSurroundParent();
      } while( block && block.getPreviousBlock() == null);
      return block;
    },
  
    /**
     * Called whenever anything on the workspace changes.
     * Add a warning if this variable block is not initialized.
     */
    onchange: function (e) {
      const ws = this.workspace;
      // Don't change state if:
      //   * It's at the start of a drag.
      //   * It's not a move event.
      if (this.disabled || !ws.isDragging || ws.isDragging() || (e.type !== Events.BLOCK_MOVE && e.type !== Events.BLOCK_CHANGE)) {
        return;
      }
      const varIDToCheck = this.getField("VAR").getValue();

      const nearestStatementBlock = this.getNearestStatementBlock();
      console.log(nearestStatementBlock);
      let initialized = false;
      if(nearestStatementBlock){
        initialized = !!this.getClosestInitialization(nearestStatementBlock.getParent(), varIDToCheck);
      }
    
      this.setWarningText(
        initialized ? null : "Se debe guardar un valor en la variable antes de usarla."
      );
      if (!this.isInFlyout) {
        const group = Events.getGroup();
        // Makes it so the move and the disable event get undone together.
        Events.setGroup(e.group);
        this.setEnabled(initialized);
        Events.setGroup(group);
      }
    }
};
  
Extensions.registerMixin('check_var_initialization', checkVariableInitializationMixin);