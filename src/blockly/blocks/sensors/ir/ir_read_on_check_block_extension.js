import { Events, Extensions } from "blockly";

const irReadOnCheckBlockMixin = {
    /**
     * Is this block enclosed (at any level) by a IR Read Check?
     *
     * @returns The nearest surrounding IR Read Check, or null if none.
     */
    getSurroundCheck: function () {
        let block = this;
        do {
            if ("sensor_ir_read_check" == block.type) {
                return block;
            }
            block = block.getSurroundParent();
        } while (block);
        return null;
    },
  
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if this block is not nested inside a sensor_ir_read_check block.
     */
    onchange: function (e) {
      const ws = this.workspace;
      // Don't change state if:
      //   * It's at the start of a drag.
      //   * It's not a move event.
      if (!ws.isDragging || ws.isDragging() || e.type !== Events.BLOCK_MOVE) {
        return;
      }
      const enabled = !!this.getSurroundCheck();
      this.setWarningText(
        enabled ? null : "Se debe comprobar que se recibieron datos por IR antes de usar el bloque."
      );
      if (!this.isInFlyout) {
        const group = Events.getGroup();
        // Makes it so the move and the disable event get undone together.
        Events.setGroup(e.group);
        this.setEnabled(enabled);
        Events.setGroup(group);
      }
    }
};
  
Extensions.registerMixin('ir_read_on_check_block', irReadOnCheckBlockMixin);