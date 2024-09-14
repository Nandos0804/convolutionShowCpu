// IMPORT STATEMENT
import * as Tone from "tone";
import Csound from "@csound/browser";
import { createDevice, MessageEvent } from "@rnbo/js";
import jsonRNBO from "./src/patch.export.json";
import csd from "./src/main.csd?raw";

// VARIABLE
let oldText = "";
let initialized = false;
let csound = null;
let device, source, mic, convolver;
let resources = ["./src/large.wav"];


// TONEJS IMPLEMENTATION

export async function pingTone() {
  await Tone.start();
  changeButton(document.getElementById("startTone"));
  if (initialized) {
    mic.close();
    convolver.dispose();
    initialized = false;
    return;
  }
  mic = new Tone.UserMedia().toDestination();
  mic.open();
  convolver = new Tone.Convolver(String(resources[0])).toDestination();
  mic.fan(convolver);
  initialized = true;
}

// CSOUND IMPLEMENTATION
export async function pingCsound() {
  changeButton(document.getElementById("startCsound"));
  if (csound != null) {
    csound.destroy();
    csound = null;
    return;
  }
  csound = await Csound();
  const fileUrl = resources[0];
  const f = await fetch(fileUrl);
  const fName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
  const path = `${fName}`;
  const buffer = await f.arrayBuffer();
  await csound.fs.writeFile(path, new Uint8Array(buffer));
  await csound.compileCsdText(csd);
  await csound.start();
}

//  RNBO IMPLEMENTATION

export async function pingRNBO() {
  changeButton(document.getElementById("startRNBO"));

  if (device != null) {
    device.node.disconnect();
    source.disconnect();
    device = null;
    source = null;
    return;
  }

  let patcher = jsonRNBO;
  let WAContext = window.AudioContext || window.webkitAudioContext;
  let context = new WAContext();
  context.resume();
  device = await createDevice({ context, patcher });

  device.parameters.forEach((parameter) => {
    console.log(parameter.id);
  });

  const gain = device.parametersById.get("gain");

  gain.value = 0.5;

  device.node.connect(context.destination);

  const handleSuccess = (stream) => {
    source = context.createMediaStreamSource(stream);
    source.connect(device.node);
  };
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
}

function changeButton(button) {
  if (button.innerHTML != "Stop!") {
    oldText = button.innerHTML;
    button.innerHTML = "Stop!";
    button.classList.remove("btn-primary");
    button.classList.add("btn-danger");
  } else {
    button.innerHTML = oldText;
    button.classList.add("btn-primary");
    button.classList.remove("btn-danger");
  }
}
