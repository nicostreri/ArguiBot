import arduinoToolbox from "./arduinoToolbox";
import { Theme, Themes } from "blockly";

const COLOURS = {
  lightBlue: "#4c97ff",
  lightGreen: "#5ba55b",
  violet: "#5b67a5",
  orange: "#b6780b",
  dark: "#2e2e2f",
  white: "#ffffff",
  darkRed: "#871918"
}

export default {
    media: "media/",
    grid: {
      spacing: 40,
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
        multi_shield_blocks: { colourPrimary: COLOURS.darkRed },
      },
      categoryStyles: {
        decisions_category: { colour: COLOURS.lightBlue },
        repetitions_category: { colour: COLOURS.lightGreen },
        math_category: { colour: COLOURS.violet },
        board_category: { colour: COLOURS.orange },
        multi_shield_category: { colour: COLOURS.darkRed },
      },
      componentStyles: {
        toolboxBackgroundColour: COLOURS.dark,
        toolboxForegroundColour: COLOURS.white
      }
    })
  };