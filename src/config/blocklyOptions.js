import arduinoToolbox from "./arduinoToolbox";

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
  };