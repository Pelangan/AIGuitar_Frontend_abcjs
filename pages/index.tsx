import { useEffect, useState } from "react";
import ABCJS from "abcjs";
import 'abcjs/abcjs-audio.css';

export default function Home() {
  const [abcNotation, setAbcNotation] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/data/c_major_scales_exercise_03.json");

        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }

        const data = await response.json();
        setAbcNotation(data.abc_notation);

        if (data.abc_notation) {
          ABCJS.renderAbc("abc-container", data.abc_notation, {
            responsive: "resize",
            scale: 1.2,
            add_classes: true,
            paddingtop: 20,
            tablature: [
              {
                instrument: "guitar",
                label: "Guitar",
                tuning: ["E,", "A,", "D", "G", "B", "e"],
                capo: 0,
              },
            ],
          });
        }
      } catch (error) {
        console.error("Error loading JSON:", error);
      }
    }

    fetchData();
  }, []);

  class CursorControl {
    onStart: () => void;
    onEvent: (ev: any) => void;
    onFinished: () => void;

    constructor() {
      this.onStart = function() {
        var svg = document.querySelector("#abc-container svg");
        if (svg) {
          var cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
          cursor.setAttribute("class", "abcjs-cursor");
          cursor.setAttributeNS(null, "x1", "0");
          cursor.setAttributeNS(null, "y1", "0");
          cursor.setAttributeNS(null, "x2", "0");
          cursor.setAttributeNS(null, "y2", "0");
          svg.appendChild(cursor);
        }
      };
      this.onEvent = function(ev) {
        var cursor = document.querySelector("#abc-container svg .abcjs-cursor");
        if (cursor) {
          cursor.setAttribute("x1", ev.left);
          cursor.setAttribute("x2", ev.left);
          cursor.setAttribute("y1", ev.top);
          cursor.setAttribute("y2", ev.top + ev.height);
        }
      };
      this.onFinished = function() {
        var cursor = document.querySelector("#abc-container svg .abcjs-cursor");
        if (cursor) {
          cursor.setAttribute("x1", "0");
          cursor.setAttribute("x2", "0");
          cursor.setAttribute("y1", "0");
          cursor.setAttribute("y2", "0");
        }
      };
    }
  }

  const cursorControl = new CursorControl();

  const playMusic = () => {
    console.log("Attempting to play music...");

    if (!ABCJS.synth.supportsAudio()) {
      console.error("Audio is not supported in this browser.");
      return;
    }

    const synthControl = new ABCJS.synth.SynthController();
    synthControl.load("#audio", cursorControl, {
      displayLoop: true,
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayWarp: true,
    });

    const visualObj = ABCJS.renderAbc("abc-container", abcNotation)[0];

    const audioContext = new AudioContext();
    audioContext.resume()
      .then(() => console.log("AudioContext resumed successfully."))
      .catch((err) => console.error("Error resuming AudioContext:", err));

    const synth = new ABCJS.synth.CreateSynth();

    synth
      .init({
        visualObj: visualObj,
        audioContext: audioContext,
        options: {
          soundFontUrl: "/soundfonts",
          program: 0,
        },
      })
      .then(() => {
        console.log("Synth initialized, playing music...");
        synthControl.setTune(visualObj, true).then(() => {
          synthControl.play();
          console.log("Playback started successfully!");
        });
      })
      .catch((err) => console.error("Playback error:", err));
  };

  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <h1>C Major Scale - ABC Notation Test</h1>
      <h2>Guitar Tablature</h2>
      <div id="abc-container"></div>
      <div id="audio"></div>
      <button className="play-button" onClick={playMusic}>
        Play Music
      </button>
    </div>
  );
}
