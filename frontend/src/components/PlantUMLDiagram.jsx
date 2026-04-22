import React from "react";
import plantumlEncoder from "plantuml-encoder";

const PlantUMLDiagram = ({ chart }) => {
    if (!chart) return null;

    // Use the public PlantUML server to convert the string to an SVG image
    const encodedChart = plantumlEncoder.encode(chart);
    const url = `https://www.plantuml.com/plantuml/svg/${encodedChart}`;

    return (
        <div className="plantuml-chart" style={{ width: '100%', overflowX: 'auto', textAlign: 'center', margin: '20px 0' }}>
            <img src={url} alt="PlantUML Diagram" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
        </div>
    );
};

export default PlantUMLDiagram;
