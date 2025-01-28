'use client';

import { useEffect, useRef, useState } from "react";
import ABCJS from 'abcjs';
import 'abcjs/abcjs-audio.css';

const GuitarTablature = () => {
  const [abcNotation, setAbcNotation] = useState("");
  const visualObjRef = useRef<any>(null);

  // Define cursorControl at the component level
  const cursorControl = new (class CursorControl {
    onStart: () => void;
    onEvent: (ev: any) => void;
    onFinished: () => void;

    constructor() {
      this.onStart = function() {
        const svg = document.querySelector("#abc-container svg");
        if (svg) {
          const cursor = document.createElementNS("http://www.w3.org/2000/svg", "line");
          cursor.setAttribute("class", "abcjs-cursor");
          cursor.setAttributeNS(null, "x1", "0");
          cursor.setAttributeNS(null, "y1", "0");
          cursor.setAttributeNS(null, "x2", "0");
          cursor.setAttributeNS(null, "y2", "0");
          svg.appendChild(cursor);
        }
      };
      this.onEvent = function(ev) {
        const cursor = document.querySelector("#abc-container svg .abcjs-cursor");
        if (cursor) {
          cursor.setAttribute("x1", ev.left);
          cursor.setAttribute("x2", ev.left);
          cursor.setAttribute("y1", ev.top);
          cursor.setAttribute("y2", ev.top + ev.height);
        }
      };
      this.onFinished = function() {
        const cursor = document.querySelector("#abc-container svg .abcjs-cursor");
        if (cursor) {
          cursor.setAttribute("x1", "0");
          cursor.setAttribute("x2", "0");
          cursor.setAttribute("y1", "0");
          cursor.setAttribute("y2", "0");
        }
      };
    }
  })();

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

    const audioContext = new AudioContext();
    audioContext.resume()
      .then(() => console.log("AudioContext resumed successfully."))
      .catch((err) => console.error("Error resuming AudioContext:", err));

    const synth = new ABCJS.synth.CreateSynth();

    synth
      .init({
        visualObj: visualObjRef.current,
        audioContext: audioContext,
        millisecondsPerMeasure: 2000,
        options: {
          soundFontUrl: "/soundfonts",
          program: 0,
        },
      })
      .then(() => {
        console.log("Synth initialized, playing music...");
        console.log("Visual Object:", visualObjRef.current);
        synthControl.setTune(visualObjRef.current, true).then(() => {
          synthControl.play();
          console.log("Playback started successfully!");
        });
      })
      .catch((err) => console.error("Playback error:", err));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/c_major_scales_exercise_03.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }
        const data = await response.json();
        setAbcNotation(data.abc_notation);

        const visualObj = ABCJS.renderAbc("abc-container", data.abc_notation, {
          responsive: "resize",
          scale: 1.5,
          staffwidth: 800,
          tablature: [{
            instrument: "guitar",
            label: "Guitar",
            tuning: ["E,", "A,", "D", "G", "B", "e"],
            capo: 0
          }],
        })[0];

        visualObjRef.current = visualObj;

        // SVG manipulation for better visibility
        const svg = document.querySelector("#abc-container svg");
        if (svg) {
          const groups = svg.querySelectorAll("g");
          if (groups.length > 1) {
            groups[1].setAttribute("transform", "translate(0, -20)"); // Adjust space
          }

          const clef = svg.querySelector("[data-name='staff-extra clef']");
          const timeSignature = svg.querySelector("[data-name='staff-extra time-signature']");
          const notes = svg.querySelectorAll("[data-name='note']");

          if (clef) clef.setAttribute("transform", "translate(0, 0)");
          if (timeSignature) timeSignature.setAttribute("transform", "translate(0, 0)");
          notes.forEach(note => note.setAttribute("transform", "translate(0, 0)"));

          // Extend all bar lines and note lines
          const allPaths = svg.querySelectorAll("path");
          if (allPaths) {
            allPaths.forEach(path => {
              const d = path.getAttribute("d");
              if (d && d.includes("202.23")) {
                const x = d.split(" ")[1];  // Get x coordinate
                path.setAttribute("stroke", "black");
                path.setAttribute("stroke-width", "1");
                path.setAttribute("d", `M ${x} 202.23 L ${x} 82.23`);
              }
            });
          }
        }
      } catch (error) {
        console.error("Error loading JSON:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <h1>C Major Scale - ABC Notation Test</h1>
      <h2>Guitar Tablature</h2>
      <div id="abc-container" style={{ width: "800px", margin: "0 auto", border: "1px solid black", padding: "20px", minHeight: "200px" }}></div>
      <div id="audio"></div>
      <button className="play-button" onClick={playMusic}>
        Play Music
      </button>
    </div>
  );
};

export default GuitarTablature;