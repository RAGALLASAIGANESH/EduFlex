import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const topics = [
    "React", "Node.js", "Python", "AI", "Data Science",
    "Design", "Marketing", "Physics", "History", "Math",
    "Biology", "Chemistry", "Finance", "Music", "Art"
];

const TopicCloud = () => {
    const navigate = useNavigate();

    // Distribute topics in a sphere-like coordinate system
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        const newPositions = topics.map((_, i) => {
            const phi = Math.acos(-1 + (2 * i) / topics.length);
            const theta = Math.sqrt(topics.length * Math.PI) * phi;

            return {
                x: 150 * Math.cos(theta) * Math.sin(phi),
                y: 150 * Math.sin(theta) * Math.sin(phi),
                z: 150 * Math.cos(phi)
            };
        });
        setPositions(newPositions);
    }, []);

    return (
        <div style={styles.container}>
            <motion.div
                style={styles.scene}
                animate={{ rotateY: 360, rotateX: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
                {positions.map((pos, i) => (
                    <motion.div
                        key={topics[i]}
                        style={{
                            ...styles.tag,
                            transform: `translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`
                        }}
                        whileHover={{ scale: 1.5, color: "#fff", background: "#f00", zIndex: 100 }}
                        onClick={() => navigate("/learn", { state: { topic: topics[i] } })}
                    >
                        {topics[i]}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

const styles = {
    container: {
        width: "400px",
        height: "400px",
        perspective: "1000px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    scene: {
        width: "100%",
        height: "100%",
        transformStyle: "preserve-3d",
        position: "relative"
    },
    tag: {
        position: "absolute",
        left: "50%",
        top: "50%",
        padding: "8px 16px",
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(5px)",
        borderRadius: "20px",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        border: "1px solid rgba(255,255,255,0.2)",
    }
};

export default TopicCloud;
