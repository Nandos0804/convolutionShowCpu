import * as Tone from "tone";

import Csound from "@csound/browser";

import { createDevice, MessageEvent } from "@rnbo/js";

import jsonRNBO from "./src/patch.export.json";

let WAContext = window.AudioContext || window.webkitAudioContext;
let context = new WAContext();
let csound = null;
let initialized = false;
let mic, recorder, player;
import csd from "./src/main.csd?raw";
let resources = ["./src/large.wav"];

export async function pingTone() {
  if (!initialized) {
    const mic = new Tone.UserMedia().toDestination();
    mic.open();
    initialized = true;
    const convolver = new Tone.Convolver(String(resources[0])).toDestination();
    mic.fan(convolver);
  }
}

// this is the JS function to run Csound
export async function pingCsound() {
  if (csound == null) {
    const csound = await Csound();
    const fileUrl = resources[0];
    const f = await fetch(fileUrl);
    const fName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
    const path = `${fName}`;
    const buffer = await f.arrayBuffer();
    await csound.fs.writeFile(path, new Uint8Array(buffer));
    await csound.compileCsdText(csd);
    await csound.start();
  }
}

const setup = async () => {
  let patcher = jsonRNBO;

  let device = await createDevice({ context, patcher });

  device.parameters.forEach((parameter) => {
    console.log(parameter.id);
  });

  const gain = device.parametersById.get("gain");

  gain.value = 0.5;

  device.node.connect(context.destination);

  // Assuming you have a RNBO device already, and an audio context as well
  const handleSuccess = (stream) => {
    const source = context.createMediaStreamSource(stream);
    source.connect(device.node);
  };
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(handleSuccess);
};

export async function pingRNBO() {
  setup();
}
