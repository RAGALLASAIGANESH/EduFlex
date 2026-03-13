import React, { useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { Map, CheckCircle, ArrowRight, BookOpen } from "lucide-react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

export default function Roadmap() {
    const [skill, setSkill] = useState("");
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const generateRoadmap = async () => {
        if (!skill.trim()) return;
        setLoading(true);
        setRoadmap(null);
        setError("");

        try {
            const res = await API.post("/ai/roadmap", { skill });
            setRoadmap(res.data);
        } catch (err) {
            setError("Failed to generate roadmap. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleLearnClick = (topic) => {
        navigate("/learn", { state: { topic } });
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.header}
            >
                <h1 style={styles.title}>🗺️ Career Roadmap Generator</h1>
                <p style={styles.subtitle}>Enter a skill or career goal, and we'll map out your path to mastery.</p>
            </motion.div>

            <div style={styles.inputGroup}>
                <input
                    style={styles.input}
                    placeholder="e.g. Full Stack Developer, Data Scientist, Graphic Design..."
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && generateRoadmap()}
                />
                <button style={styles.genBtn} onClick={generateRoadmap}>
                    Generate Path
                </button>
            </div>

            {loading && <Loader />}
            {error && <div style={styles.error}>{error}</div>}

            {roadmap && (
                <motion.div
                    style={styles.roadmapBox}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {roadmap.map((step, index) => (
                        <div key={index} style={styles.stepContainer}>
                            <div style={styles.stepIndicator}>
                                <div style={styles.circle}>{step.step}</div>
                                {index !== roadmap.length - 1 && <div style={styles.line}></div>}
                            </div>
                            <motion.div
                                style={styles.stepCard}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div style={styles.cardHeader}>
                                    <h3 style={styles.stepTitle}>{step.topic}</h3>
                                    <button
                                        style={styles.learnBtn}
                                        onClick={() => handleLearnClick(step.topic)}
                                        title="Learn this topic"
                                    >
                                        <BookOpen size={16} /> Start Learning
                                    </button>
                                </div>
                                <p style={styles.stepDesc}>{step.description}</p>

                                {step.subtopics && (
                                    <div style={styles.subtopicsGrid}>
                                        {step.subtopics.map((sub, i) => (
                                            <span
                                                key={i}
                                                style={styles.subtopicTag}
                                                onClick={() => handleLearnClick(sub)}
                                            >
                                                {sub}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: "60px 20px",
        maxWidth: "900px",
        margin: "0 auto",
        minHeight: "calc(100vh - 80px)"
    },
    header: {
        textAlign: "center",
        marginBottom: "40px"
    },
    title: {
        fontSize: "32px",
        color: "#1f2937",
        marginBottom: "10px"
    },
    subtitle: {
        color: "#6b7280",
        fontSize: "16px"
    },
    inputGroup: {
        display: "flex",
        gap: "12px",
        marginBottom: "40px",
        justifyContent: "center"
    },
    input: {
        padding: "14px",
        borderRadius: "10px",
        border: "2px solid #e5e7eb",
        width: "60%",
        fontSize: "16px",
        outline: "none"
    },
    genBtn: {
        padding: "14px 24px",
        background: "#4f46e5",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold"
    },
    error: {
        color: "red",
        textAlign: "center",
        marginBottom: "20px"
    },
    roadmapBox: {
        display: "flex",
        flexDirection: "column",
        gap: "0px"
    },
    stepContainer: {
        display: "flex",
        gap: "20px",
        position: "relative",
        paddingBottom: "30px"
    },
    stepIndicator: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    circle: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        background: "#4f46e5",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        zIndex: 2,
        flexShrink: 0
    },
    line: {
        width: "4px",
        flex: 1,
        background: "#e5e7eb",
        margin: "10px 0"
    },
    stepCard: {
        flex: 1,
        background: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        border: "1px solid #f3f4f6"
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "10px"
    },
    stepTitle: {
        margin: "0",
        color: "#1f2937",
        fontSize: "20px",
        fontWeight: "700"
    },
    learnBtn: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        background: "#eff6ff",
        color: "#2563eb",
        border: "none",
        padding: "8px 12px",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: "600",
        transition: "background 0.2s"
    },
    stepDesc: {
        margin: "0 0 15px 0",
        color: "#6b7280",
        lineHeight: "1.6"
    },
    subtopicsGrid: {
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginTop: "15px",
        paddingTop: "15px",
        borderTop: "1px dashed #e5e7eb"
    },
    subtopicTag: {
        background: "#f3f4f6",
        color: "#4b5563",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "13px",
        cursor: "pointer",
        transition: "all 0.2s",
        border: "1px solid transparent"
    }
};
