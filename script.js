// DOM elements
const elements = {
  VIDEO_OUTPUT: document.getElementById("crtOutput"),
  OSD: document.getElementById("osd"),
  OSD_INPUT: document.getElementById("osdInput"),
  OSD_INPUT_3: document.getElementById("osdInput3"),
  OSD_INPUT_4: document.getElementById("osdInput4"),
  STATIC: document.getElementById("static"),
  POWER_SWITCH: document.getElementById("powerSwitch"),
  VHS_LED: document.getElementById("vhsLED"),
  VHS_FILTER: document.getElementById("vhsFilter"),
  VHS_FILTER_2: document.getElementById("vhsFilter2"),
  vhsButton: document.getElementById("vhsMode"),
  RESET_BUTTON: document.getElementById("reset"),
  NOISE_BUTTON: document.getElementById("noiseMode"),
  WHINE_BUTTON: document.getElementById("whineMode"),
  FLICKER_BUTTON: document.getElementById("flickerMode"),
  FLICKER_IMG: document.getElementById("flickering"),
  PLAY_LINK_BUTTON: document.getElementById("avInput"),
  INSTRUCTIONS_BUTTON: document.getElementById("instructions"),
  FILE_INPUT: document.getElementById("fileInput"),
  FILE_UPLOAD_BUTTON: document.getElementById("fileUpload"),
};

// Audio elements
const sounds = {
  DEGAUSS: new Audio("./audio/degauss.mp3"),
  CASSETTE_INSERT_SOUND: new Audio("./audio/cassette-insert.mp3"),
  VHS_NOISE_SOUND: new Audio("./audio/vhs-noise.mp3"),
  RF_NOISE_SOUND: new Audio("./audio/rf-noise.mp3"),
  CRT_WHINE: new Audio("./audio/whine.mp3"),
};

sounds.VHS_NOISE_SOUND.volume = 0.3;
sounds.RF_NOISE_SOUND.volume = 0.04;
sounds.CRT_WHINE.volume = 0.4;

let tvOff = true;
let s = 110,
  c = 110,
  b = 110,
  f = 0.6;
let vhsSettings = "sepia(0) grayscale(0) hue-rotate(0)";
let hideTimeoutId, timerInterval;
let vhsMode = false,
  rfNoise = false,
  crtWhineOn = false,
  crtFlicker = false;
let hours = 0,
  minutes = 0,
  seconds = 0;

// Helper functions
const playAudio = (audio) => audio.play();
const resetTimer = () => {
  hours = 0;
  minutes = 0;
  seconds = 0;
};
const handleAudioEnded = (audio) => {
  audio.currentTime = 0;
  audio.play();
};
const updateSettings = () => {
  elements.VIDEO_OUTPUT.style.filter = `saturate(${s}%) contrast(${c}%) brightness(${b}%) blur(${f}px) ${vhsSettings}`;
};
updateSettings();

const showOSDInput = () => {
  elements.OSD_INPUT.style.display = "block";
  clearTimeout(hideTimeoutId);
  hideTimeoutId = setTimeout(() => {
    elements.OSD_INPUT.style.display = "none";
  }, 3000);
};

const showOSD = () => {
  elements.OSD.innerText = `Saturation: ${s} Contrast: ${c} Brightness: ${b}`;
  if (!tvOff) {
    elements.OSD.style.display = "block";
    clearTimeout(hideTimeoutId);
    hideTimeoutId = setTimeout(() => {
      elements.OSD.style.display = "none";
    }, 2000);
  }
};

const updateTimerDisplay = () => {
  elements.OSD_INPUT_4.textContent = `${String(hours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (++seconds === 60) {
      seconds = 0;
      if (++minutes === 60) {
        minutes = 0;
        hours++;
      }
    }
    updateTimerDisplay();
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timerInterval);
};

const togglePower = () => {
  playAudio(new Audio("./audio/click.mp3"));
  if (elements.VIDEO_OUTPUT.style.display === "block") {
    elements.POWER_SWITCH.innerHTML = "Power On";
    tvOff = true;
    elements.STATIC.style.opacity = "1";
    elements.STATIC.style.pointerEvents = "auto";
    elements.VIDEO_OUTPUT.style.display = "none";
    elements.VIDEO_OUTPUT.src = "";
    elements.OSD.style.display = "none";
    elements.OSD_INPUT.style.display = "none";
    elements.OSD_INPUT_3.style.display = "none";
    elements.OSD_INPUT_4.style.display = "none";
    sounds.VHS_NOISE_SOUND.pause();
    sounds.RF_NOISE_SOUND.pause();
    sounds.CRT_WHINE.pause();
  } else {
    sounds.DEGAUSS.play();
    elements.POWER_SWITCH.innerHTML = "Power Off";
    tvOff = false;
    if (crtWhineOn) sounds.CRT_WHINE.play();
    showOSDInput();
    elements.STATIC.style.pointerEvents = "none";
    elements.VIDEO_OUTPUT.style.display = "block";
    elements.VIDEO_OUTPUT.src =
      "https://www.youtube.com/embed/videoseries?list=PLbiQ_Jf57CBWyu7z1UbCkWc79UNV4xitp&autoplay=1";
    elements.STATIC.style.opacity = rfNoise ? "0.05" : "0";
    if (rfNoise) sounds.RF_NOISE_SOUND.play();
    if (vhsMode) {
      resetTimer();
      elements.OSD_INPUT_3.style.display = "block";
      elements.OSD_INPUT_4.style.display = "block";
      sounds.VHS_NOISE_SOUND.play();
    }
    if (crtWhineOn) sounds.CRT_WHINE.play();
  }
};

const toggleVHSMode = () => {
  vhsMode = true;
  if (elements.VHS_FILTER.style.visibility === "visible") {
    elements.VHS_FILTER.style.visibility = "hidden";
    elements.VHS_FILTER_2.style.visibility = "hidden";
    s = 110;
    c = 110;
    b = 110;
    f = 0.6;
    vhsSettings = "sepia(0) grayscale(0) hue-rotate(0)";
    updateSettings();
    elements.OSD_INPUT_3.style.display = "none";
    elements.OSD_INPUT_4.style.display = "none";
    stopTimer();
    resetTimer();
    vhsMode = false;
    elements.VHS_LED.style.background = "black";
  } else {
    s = 130;
    c = 110;
    b = 120;
    f = 0.7;
    vhsSettings = "sepia(0.1) grayscale(0.1) hue-rotate(13deg)";
    updateSettings();
    elements.VHS_FILTER.style.visibility = "visible";
    elements.VHS_FILTER_2.style.visibility = "visible";
    if (!tvOff) {
      elements.OSD_INPUT_3.style.display = "flex";
      elements.OSD_INPUT_4.style.display = "block";
    }
    startTimer();
    elements.VHS_LED.style.background = "#1eff00";
  }
};

const setControlListeners = (control, condition, max) => {
  document.getElementById(control).addEventListener("click", () => {
    playAudio(new Audio("./audio/click.mp3"));
    condition();
    updateSettings();
    showOSD();
  });
};

// Event listeners
elements.POWER_SWITCH.addEventListener("click", togglePower);

const controlConditions = {
  saturationUp: () => {
    if (s < 200) s += 10;
  },
  contrastUp: () => {
    if (c < 200) c += 10;
  },
  brightnessUp: () => {
    if (b < 200) b += 10;
  },
  saturationDown: () => {
    if (s > 0) s -= 10;
  },
  contrastDown: () => {
    if (c > 0) c -= 10;
  },
  brightnessDown: () => {
    if (b > 0) b -= 10;
  },
};

Object.keys(controlConditions).forEach((control) =>
  setControlListeners(control, controlConditions[control])
);

elements.vhsButton.addEventListener("click", () => {
  playAudio(
    vhsMode
      ? new Audio("./audio/cassette-eject.mp3")
      : sounds.CASSETTE_INSERT_SOUND
  );
  if (!vhsMode) {
    sounds.VHS_NOISE_SOUND.play();
  } else {
    sounds.CASSETTE_INSERT_SOUND.pause();
    sounds.CASSETTE_INSERT_SOUND.currentTime = 0;
    sounds.VHS_NOISE_SOUND.pause();
    sounds.VHS_NOISE_SOUND.currentTime = 0;
  }
  toggleVHSMode();
});

elements.RESET_BUTTON.addEventListener("click", () => {
  playAudio(new Audio("./audio/click.mp3"));
  s = vhsMode ? 130 : 110;
  c = 110;
  b = vhsMode ? 120 : 110;
  f = vhsMode ? 0.7 : 0.6;
  updateSettings();
  showOSD();
});

elements.NOISE_BUTTON.addEventListener("click", () => {
  playAudio(new Audio("./audio/click.mp3"));
  if (!tvOff) {
    rfNoise = !rfNoise;
    elements.STATIC.style.opacity = rfNoise ? "0.05" : "0";
    if (rfNoise) {
      sounds.RF_NOISE_SOUND.play();
    } else {
      sounds.RF_NOISE_SOUND.pause();
      sounds.RF_NOISE_SOUND.currentTime = 0;
    }
  }
});

elements.WHINE_BUTTON.addEventListener("click", () => {
  playAudio(new Audio("./audio/click.mp3"));
  crtWhineOn = !crtWhineOn;
  if (crtWhineOn) {
    sounds.CRT_WHINE.play();
  } else {
    sounds.CRT_WHINE.pause();
  }
});

elements.FLICKER_BUTTON.addEventListener("click", () => {
  playAudio(new Audio("./audio/click.mp3"));
  if (confirm("Enable / Disable Flickering ? (Warning: Flashing Lights)")) {
    crtFlicker = !crtFlicker;
    elements.FLICKER_BUTTON.innerHTML = crtFlicker
      ? "Flicker Off"
      : "Flicker On";
    elements.FLICKER_IMG.style.display = crtFlicker ? "block" : "none";
  }
});

const commonPlaySetup = () => {
  elements.OSD_INPUT.style.display = "block";
  showOSDInput();
  elements.STATIC.style.pointerEvents = "none";
  elements.STATIC.style.opacity = "0";
  elements.VIDEO_OUTPUT.style.display = "block";
  tvOff = false;
  if (rfNoise) {
    elements.STATIC.style.opacity = "0.05";
    sounds.RF_NOISE_SOUND.play();
  }
  if (vhsMode) {
    resetTimer();
    elements.OSD_INPUT_3.style.display = "block";
    elements.OSD_INPUT_4.style.display = "block";
    sounds.VHS_NOISE_SOUND.play();
  }
  if (crtWhineOn) sounds.CRT_WHINE.play();
};

elements.PLAY_LINK_BUTTON.addEventListener("click", () => {
  elements.VIDEO_OUTPUT.src = document.getElementById("crtInput").value;
  commonPlaySetup();
  sounds.VHS_NOISE_SOUND.pause();
  elements.VHS_FILTER.style.visibility = "hidden";
  elements.VHS_FILTER_2.style.visibility = "hidden";
  elements.VHS_LED.style.background = "black";
  elements.POWER_SWITCH.innerHTML = "Power Off";
  elements.OSD_INPUT_3.style.display = "none";
  elements.OSD_INPUT_4.style.display = "none";
  s = 110;
  c = 110;
  b = 110;
  f = 0.6;
  vhsSettings = "sepia(0) grayscale(0) hue-rotate(0)";
  updateSettings();
  stopTimer();
  resetTimer();
  vhsMode = false;
  tvOff = false;
});

elements.INSTRUCTIONS_BUTTON.addEventListener("click", () => {
  alert(
    "To play a link from YouTube, or any other website that provides embeds, you have to do the following:" +
      "\n" +
      "\n" +
      "On YouTube for example, press the share button, and then embed, locate the part that says src (for source), it would usually be a video link, and copy and paste the contents in the quotation marks in the input field here, and press play." +
      "\n" +
      "\n" +
      "You can play with the picture settings by pressing the buttons under the screen, hover your mouse on each button to see a description of what they do." +
      "\n" +
      "\n" +
      "This CRT TV was coded entirely by Daniele63 at daniele63.com, you can contact me at daniele63web@hotmail.com." +
      "\n" +
      "\n" +
      "Visit the GitHub page if you want to save it locally on your machine: https://github.com/the-daniele/crt-tv/tree/main"
  );
});

elements.FILE_UPLOAD_BUTTON.addEventListener("click", () => {
  const file = elements.FILE_INPUT.files[0];
  if (file && file.type.startsWith("video/")) {
    elements.VIDEO_OUTPUT.src = URL.createObjectURL(file);
    commonPlaySetup();
    sounds.VHS_NOISE_SOUND.pause();
    elements.VHS_FILTER.style.visibility = "hidden";
    elements.VHS_FILTER_2.style.visibility = "hidden";
    elements.VHS_LED.style.background = "black";
    elements.POWER_SWITCH.innerHTML = "Power Off";
    elements.OSD_INPUT_3.style.display = "none";
    elements.OSD_INPUT_4.style.display = "none";
    s = 110;
    c = 110;
    b = 110;
    f = 0.6;
    vhsSettings = "sepia(0) grayscale(0) hue-rotate(0)";
    updateSettings();
    stopTimer();
    resetTimer();
    vhsMode = false;
    tvOff = false;
  } else {
    alert(
      file
        ? "Please select a video file."
        : "Please select a file before uploading."
    );
  }
});

// Audio event listeners
sounds.VHS_NOISE_SOUND.addEventListener("ended", () =>
  handleAudioEnded(sounds.VHS_NOISE_SOUND)
);
sounds.RF_NOISE_SOUND.addEventListener("ended", () =>
  handleAudioEnded(sounds.RF_NOISE_SOUND)
);
sounds.CRT_WHINE.addEventListener("ended", () =>
  handleAudioEnded(sounds.CRT_WHINE)
);
