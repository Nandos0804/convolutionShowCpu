import "./style.css";
import { pingTone, pingCsound, pingRNBO } from "./audio.js";

// Ensure the DOM is fully loaded before attaching the event listener
document.addEventListener("DOMContentLoaded", () => {
  const startToneButton = document.getElementById("startTone");
  if (startToneButton) {
    startToneButton.addEventListener("click", pingTone);
  }
  const startCsoundButton = document.getElementById("startCsound");
  if (startCsoundButton) {
    startCsoundButton.addEventListener("click", pingCsound);
  }
  const startRNBO = document.getElementById("startRNBO");
  if (startRNBO) {
    startRNBO.addEventListener("click", pingRNBO);
  }
});
