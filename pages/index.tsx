import { useEffect, useState } from "react";
import ABCJS from "abcjs";

export default function Home() {
  const [abcNotation, setAbcNotation] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/data/c_major_scales_exercise_01.json");

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
                capo: 0
              }
            ]
          });
        }
      } catch (error) {
        console.error("Error loading JSON:", error);
      }
    }

    fetchData();
  }, []);

  const playMusic = () => {
    const synth = new ABCJS.synth.CreateSynth();
    synth
      .init({
        visualObj: ABCJS.renderAbc("abc-container", abcNotation)[0],
        options: { soundFontUrl: "https://paulrosen.github.io/abcjs/audio" }
      })
      .then(() => synth.start())
      .catch((err) => console.error("Playback error:", err));
  };

  return (
    <div style={{ textAlign: "center", padding: "50px 20px" }}>
      <h1>C Major Scale - ABC Notation Test</h1>
      <h2>Guitar Tablature</h2>
      <div id="abc-container"></div>
      <button className="play-button" onClick={playMusic}>
        Play Music
      </button>
    </div>
  );
}