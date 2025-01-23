import { useEffect, useState } from "react";
import ABCJS from "abcjs";

const GuitarTablature = () => {
  const [abcNotation, setAbcNotation] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/data/exercise.json");

        if (!response.ok) {
          throw new Error(`Failed to fetch JSON: ${response.statusText}`);
        }

        const data = await response.json();
        setAbcNotation(data.abc_notation);

        if (data.abc_notation) {
          ABCJS.renderAbc("abc-container", data.abc_notation, {
            responsive: "resize",
            scale: 1.5,
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

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>C Major Scale - ABC Notation Test</h1>
      <div id="abc-container" style={{ border: "1px solid white", padding: "20px" }}></div>
    </div>
  );
};

export default GuitarTablature;