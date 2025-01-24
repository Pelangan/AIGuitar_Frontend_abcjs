'use client';

import { useEffect } from "react";
import ABCJS from 'abcjs';

const GuitarTablature = () => {
  useEffect(() => {
    console.log("Initializing ABCJS...");
    const testNotation = `X: 1
T: Simple Scale
M: 4/4
L: 1/8
K: C treble
C D E F G A B c |`;

    ABCJS.renderAbc("abc-container", testNotation, {
      responsive: "resize",
      scale: 1.5,
      staffwidth: 800
    });
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>C Major Scale - ABC Notation Test</h1>
      <div id="abc-container" style={{ width: "800px", margin: "0 auto", border: "1px solid black", padding: "20px", minHeight: "200px" }}></div>
    </div>
  );
};

export default GuitarTablature;