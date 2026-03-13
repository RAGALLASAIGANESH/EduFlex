import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Send, Play, Briefcase, Award, AlertCircle } from "lucide-react";
import API from "../services/api";

export default function Interview() {
    const [role, setRole] = useState("");
    const [level, setLevel] = useState("Junior");
    const [questionData, setQuestionData] = useState(null);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);

    const synthesisRef = useRef(window.speechSynthesis);

    const handleStartInterview = async () => {
        if (!role) return;
        setLoading(true);
        setQuestionData(null);
        setFeedback(null);
        setAnswer("");

        try {
            const res = await API.post("/ai/interview/question", { role, level });
            setQuestionData(res.data);
            speak(res.data.question);
        } catch (error) {
            console.error("Failed to get question", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!answer) return;
        setLoading(true);

        try {
            const res = await API.post("/ai/interview/evaluate", {
                question: questionData.question,
                answer,
                role
            });
            setFeedback(res.data);
        } catch (error) {
            console.error("Evaluation failed", error);
        } finally {
            setLoading(false);
        }
    };

    // Voice Input Logic
    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            window.speechRecognition?.stop();
        } else {
            setIsListening(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.lang = "en-US";
                recognition.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    setAnswer((prev) => prev + " " + transcript);
                    setIsListening(false);
                };
                recognition.start();
            } else {
                alert("Browser does not support speech recognition.");
                setIsListening(false);
            }
        }
    };

    const speak = (text) => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            synthesisRef.current.speak(utterance);
        }
    };

    return (
        <div style={styles.container}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={styles.card}
            >
                <h1 style={styles.title}>🎙️ AI Interview Coach</h1>
                <p style={styles.subtitle}>Practice real interview questions with instant AI feedback.</p>

                {/* Setup Phase */}
                {!questionData && (
                    <div style={styles.setupBox}>
                        <div style={styles.inputGroup}>
                            <label>Target Role</label>
                            <input
                                type="text"
                                placeholder="e.g. React Developer, Product Manager"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label>Experience Level</label>
                            <select value={level} onChange={(e) => setLevel(e.target.value)} style={styles.select}>
                                <option>Intern</option>
                                <option>Junior</option>
                                <option>Mid-level</option>
                                <option>Senior</option>
                                <option>Lead</option>
                            </select>
                        </div>

                        <button
                            onClick={handleStartInterview}
                            disabled={loading || !role}
                            style={{ ...styles.primaryBtn, opacity: !role ? 0.5 : 1 }}
                        >
                            {loading ? "Generating..." : "Start Interview"}
                        </button>
                    </div>
                )}

                {/* Question Phase */}
                {questionData && !feedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={styles.questionBox}
                    >
                        <div style={styles.questionHeader}>
                            <Briefcase size={20} color="#2563eb" />
                            <h3>{level} {role} Question</h3>
                        </div>
                        <p style={styles.questionText}>"{questionData.question}"</p>
                        {questionData.hint && (
                            <p style={styles.hint}>💡 Hint: {questionData.hint}</p>
                        )}

                        <div style={styles.answerArea}>
                            <textarea
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Type your answer here or use the microphone..."
                                style={styles.textarea}
                            />
                            <div style={styles.controls}>
                                <button
                                    onClick={toggleListening}
                                    style={{ ...styles.iconBtn, background: isListening ? "#fee2e2" : "#f3f4f6" }}
                                >
                                    {isListening ? <MicOff color="#dc2626" /> : <Mic color="#4b5563" />}
                                </button>
                                <button onClick={handleSubmitAnswer} disabled={loading} style={styles.primaryBtn}>
                                    {loading ? "Evaluating..." : "Submit Answer"} <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Feedback Phase */}
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.feedbackBox}
                    >
                        <div style={styles.scoreCircle}>
                            <span style={styles.scoreNum}>{feedback.score}</span>
                            <span style={styles.scoreLabel}>/10</span>
                        </div>

                        <div style={styles.feedbackContent}>
                            <h3>Feedback</h3>
                            <p>{feedback.feedback}</p>

                            <div style={styles.betterAnswer}>
                                <h4>✨ Improved Answer:</h4>
                                <p>{feedback.improvedAnswer}</p>
                            </div>
                        </div>

                        <button onClick={handleStartInterview} style={styles.secondaryBtn}>
                            Next Question
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

const styles = {
    container: {
        padding: "40px 20px",
        minHeight: "100vh",
        background: "#f0f9ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start"
    },
    card: {
        background: "white",
        width: "100%",
        maxWidth: "800px",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.05)"
    },
    title: {
        textAlign: "center",
        color: "#1e293b",
        marginBottom: "10px"
    },
    subtitle: {
        textAlign: "center",
        color: "#64748b",
        marginBottom: "40px"
    },
    setupBox: {
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        maxWidth: "500px",
        margin: "0 auto"
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "16px"
    },
    select: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #cbd5e1",
        fontSize: "16px"
    },
    primaryBtn: {
        padding: "14px 24px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        transition: "background 0.2s"
    },
    questionBox: {
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    questionHeader: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#2563eb",
        fontWeight: "bold"
    },
    questionText: {
        fontSize: "24px",
        color: "#1e293b",
        fontWeight: "600",
        lineHeight: "1.4"
    },
    hint: {
        background: "#fff7ed",
        color: "#c2410c",
        padding: "10px",
        borderRadius: "8px",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    answerArea: {
        marginTop: "20px"
    },
    textarea: {
        width: "100%",
        height: "150px",
        padding: "15px",
        borderRadius: "12px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        fontFamily: "inherit",
        marginBottom: "15px",
        resize: "vertical"
    },
    controls: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    iconBtn: {
        padding: "12px",
        borderRadius: "50%",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s"
    },
    feedbackBox: {
        background: "#f8fafc",
        borderRadius: "16px",
        padding: "30px",
        border: "1px solid #e2e8f0",
        textAlign: "center"
    },
    scoreCircle: {
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "white",
        border: "4px solid #2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        margin: "0 auto 20px"
    },
    scoreNum: {
        fontSize: "28px",
        fontWeight: "800",
        color: "#2563eb"
    },
    scoreLabel: {
        fontSize: "12px",
        color: "#64748b"
    },
    betterAnswer: {
        background: "#ecfdf5",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        textAlign: "left",
        borderLeft: "4px solid #10b981"
    },
    secondaryBtn: {
        marginTop: "30px",
        padding: "12px 24px",
        background: "transparent",
        color: "#2563eb",
        border: "2px solid #2563eb",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background 0.2s"
    }
};
