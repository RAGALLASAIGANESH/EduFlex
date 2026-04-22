import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
});

const MermaidDiagram = ({ chart }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (chart && containerRef.current) {
            mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart).then(({ svg }) => {
                containerRef.current.innerHTML = svg;
            });
        }
    }, [chart]);

    return <div ref={containerRef} className="mermaid-chart" style={{ width: '100%', overflowX: 'auto' }} />;
};

export default MermaidDiagram;
