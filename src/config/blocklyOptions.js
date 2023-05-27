import arduinoToolbox from "./arduinoToolbox";
import { Theme, Themes } from "blockly";

const COLOURS = {
  lightBlue: "#4c97ff",
  lightGreen: "#5ba55b",
  violet: "#5b67a5",
  orange: "#ffab19"
}

export default {
    media: "media/",
    grid: {
      spacing: 25,
      length: 3,
      colour: "#ccc",
      snap: true,
    },
    move: {
      wheel: true
    },
    zoom: {
      controls: true
    },
    toolbox: arduinoToolbox,
    theme: Theme.defineTheme('stTheme', {
      base: Themes.Classic,
      blockStyles: {
        logic_blocks: { colourPrimary: COLOURS.lightBlue },
        board_blocks: { colourPrimary: COLOURS.orange },
      },
      categoryStyles: {
        decisions_category: { colour: COLOURS.lightBlue },
        repetitions_category: { colour: COLOURS.lightGreen },
        math_category: { colour: COLOURS.violet },
        board_category: { colour: COLOURS.orange }
      }
    })
  };