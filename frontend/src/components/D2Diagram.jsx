import React, { useState, useEffect } from "react";

const D2Diagram = ({ chart }) => {
    const [svgContent, setSvgContent] = useState(null);
    const [error, setError] = useState(false);
    const [debugText, setDebugText] = useState("");

    useEffect(() => {
        if (!chart) return;

        // Use the Kroki public API to render D2 graphs natively
        const fetchSvg = async () => {
            try {
                console.log("SENDING TO KROKI:", chart);
                const response = await fetch('https://kroki.io/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        diagram_source: chart,
                        diagram_type: 'd2',
                        output_format: 'svg'
                    })
                });

                if (response.ok) {
                    const text = await response.text();
                    setSvgContent(text);
                } else {
                    const errText = await response.text();
                    console.error("Failed to render D2 chart:", response.status, errText);
                    setDebugText(`Kroki Error: ${response.status} - ${errText}`);
                    setError(true);
                }
            } catch (err) {
                console.error("Error communicating with Kroki:", err);
                setDebugText(`Network Error: ${err.message}`);
                setError(true);
            }
        };

        fetchSvg();
    }, [chart]);

    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'left', background: '#ffebee', padding: '10px', borderRadius: '5px' }}>
                <h4>Failed to render diagram.</h4>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{debugText}</pre>
                <hr />
                <strong>Raw Diagram Code:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '12px' }}>{chart}</pre>
            </div>
        );
    }

    if (!svgContent) return <div style={{ textAlign: 'center', color: '#666' }}>Rendering advanced diagram...</div>;

    // We get raw SVG XML back from Kroki
    return (
        <div
            className="d2-chart"
            style={{ width: '100%', overflowX: 'auto', textAlign: 'center', margin: '20px 0', background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    );
};

export default D2Diagram;
