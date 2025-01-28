import { useEffect, useRef } from 'react';

interface TabViewerProps {
  width?: number;
  height?: number;
}

const TabViewer: React.FC<TabViewerProps> = ({ width = 1200, height = 300 }) => {
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadTablature = async () => {
      try {
        const response = await fetch('./data/c_major_scale.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (!data || !data.measures || !Array.isArray(data.measures)) {
          console.warn("Invalid JSON structure - expected measures array");
          return;
        }

        renderTablature(data);
      } catch (error) {
        console.error("Error loading JSON:", error);
      }
    };

    const renderTablature = (data: any) => {
      if (!divRef.current) return;

      const div = divRef.current;
      div.innerHTML = '';
      
      try {
        // Calculate dimensions
        const BARS_PER_LINE = 3;
        const WIDTH_PER_BAR = 400;
        const HEIGHT_PER_LINE = 250;
        
        const totalMeasures = data.measures.length;
        const numberOfLines = Math.ceil(totalMeasures / BARS_PER_LINE);
        const totalWidth = WIDTH_PER_BAR * BARS_PER_LINE;
        const totalHeight = HEIGHT_PER_LINE * numberOfLines;
        
        // Initialize VexTab
        const VF = (window as any).Vex.Flow;
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        renderer.resize(totalWidth, totalHeight);
        
        const artist = new (window as any).Artist(10, 10, totalWidth, { scale: 0.8 });
        const tab = new (window as any).VexTab(artist);

        // Start with initial tabstave
        let vextabNotation = "tabstave notation=true key=C time=4/4\n";
        
        // Build notation
        data.measures.forEach((measure: any, index: number) => {
          let measureNotes = measure.notes.replace(/^notes\s+/, '');
          
          if (index % BARS_PER_LINE === 0) {
            vextabNotation += "notes ";
          }
          
          vextabNotation += `${measureNotes} | `;
          
          if ((index + 1) % BARS_PER_LINE === 0 && index < data.measures.length - 1) {
            vextabNotation += "\ntabstave notation=true\n";
          }
        });

        tab.parse(vextabNotation);
        artist.render(renderer);
        
      } catch (e) {
        console.error("VexTab error:", e);
      }
    };

    loadTablature();
  }, []);

  return (
    <div 
      ref={divRef} 
      style={{ 
        border: '1px solid black',
        padding: '20px',
        backgroundColor: 'white',
        display: 'inline-block'
      }}
    />
  );
};

export default TabViewer;
