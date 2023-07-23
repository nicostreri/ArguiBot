import { Events, Extensions } from "blockly";

/**
 * Based on https://github.com/google/blockly/blob/9efc0d7dd0cd975da25a633760abe0a0ad753415/blocks/loops.ts#L337C6-L337C6
 */
const checkVariableInitializationMixin = {

    isInitializationBlock: function (block, varIDToCheck){
      if (!block.disabled && block.type && block.type.startsWith("variables_set_")) {
        //Check var id
        const blockVarID = block.getField("VAR").getValue();
        if(blockVarID == varIDToCheck){
          return true;
        }
      }
      return false;
    },
    
    getClosestInitialization: function (startBlock, varIDToCheck) {
        let block = startBlock;
        do {
            if(this.isInitializationBlock(block, varIDToCheck)) return block;
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

    checkOnSetup: function(varIDToCheck){
      const rootBlock = this.getRootBlock();
      if(rootBlock.type != "board_setup_loop") return null;

      let block = rootBlock.getInputTargetBlock("SETUP");
      if(!block) return null;

      do{
        if(this.isInitializationBlock(block, varIDToCheck)) return block;
        block = block.getNextBlock();
      }while(block);
      return null;
    },

    checkInitialization: function(){
      const varIDToCheck = this.getField("VAR").getValue();

      //searches the block tree for the closest initialization of the variable
      const nearestStatementBlock = this.getNearestStatementBlock();
      if(nearestStatementBlock && !!this.getClosestInitialization(nearestStatementBlock.getParent(), varIDToCheck)){
        return true;
      }

      // look for the initialization of the variable in the Arduino setup
      if(this.checkOnSetup(varIDToCheck)) return true;

      return false;
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
      if (!ws.isDragging || ws.isDragging() || (e.type !== Events.BLOCK_MOVE && e.type !== Events.BLOCK_CHANGE)) {
        return;
      }

      const initialized = this.checkInitialization();
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