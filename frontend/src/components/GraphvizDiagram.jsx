import React, { useState, useEffect } from "react";
import pako from "pako";

const GraphvizDiagram = ({ chart }) => {
    const [svgUrl, setSvgUrl] = useState(null);
    const [error, setError] = useState(false);
    const [debugText, setDebugText] = useState("");

    useEffect(() => {
        if (!chart) return;

        try {
            // Kroki requires: Text -> UTF8 -> Deflate -> Base64 URL Safe
            const utf8Text = new TextEncoder().encode(chart);
            const compressed = pako.deflate(utf8Text);

            // Standard Base64
            let encodedString = btoa(String.fromCharCode.apply(null, compressed));

            // Make URL safe (replace +, /, and remove =)
            encodedString = encodedString.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

            const finalUrl = `https://kroki.io/graphviz/svg/${encodedString}`;
            setSvgUrl(finalUrl);
            setError(false);
        } catch (err) {
            console.error("Error compressing for Kroki:", err);
            setDebugText(`Compression Error: ${err.message}`);
            setError(true);
        }
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

    if (!svgUrl) return <div style={{ textAlign: 'center', color: '#666' }}>Rendering advanced diagram...</div>;

    // We can now directly use the Kroki generated image URL
    return (
        <div
            className="graphviz-chart"
            style={{ width: '100%', overflowX: 'auto', textAlign: 'center', margin: '20px 0', background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}
        >
            <img
                src={svgUrl}
                alt="Graphviz Diagram"
                style={{ maxWidth: '100%', height: 'auto' }}
                onError={(e) => {
                    setError(true);
                    setDebugText("Image failed to load from Kroki API.");
                }}
            />
        </div>
    );
};

export default GraphvizDiagram;
