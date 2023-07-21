import { Events, Extensions } from "blockly";

/**
 * Based on https://github.com/google/blockly/blob/9efc0d7dd0cd975da25a633760abe0a0ad753415/blocks/loops.ts#L337C6-L337C6
 */
const serialReadOnCheckBlockMixin = {
    /**
     * Is this block enclosed (at any level) by a loop?
     *
     * @returns The nearest surrounding loop, or null if none.
     */
    getSurroundLoop: function () {
        let block = this;
        do {
            if ("board_serial_read_check" == block.type) {
                return block;
            }
            block = block.getSurroundParent();
        } while (block);
        return null;
    },
  
    /**
     * Called whenever anything on the workspace changes.
     * Add warning if this flow block is not nested inside a loop.
     */
    onchange: function (e) {
      const ws = this.workspace;
      // Don't change state if:
      //   * It's at the start of a drag.
      //   * It's not a move event.
      if (!ws.isDragging || ws.isDragging() || e.type !== Events.BLOCK_MOVE) {
        return;
      }
      const enabled = !!this.getSurroundLoop();
      this.setWarningText(
        enabled ? null : "Se debe comprobar que se recibieron datos por la conexión Serial antes de usar el bloque."
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
  
Extensions.registerMixin('serial_read_on_check_block', serialReadOnCheckBlockMixin);