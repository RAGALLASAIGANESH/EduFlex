import React, { useState, useRef, useEffect } from "react";
import API from "../services/api";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ChatTutor = ({ topic }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "ai", text: `Hi! I'm your AI Tutor. Ask me anything about "${topic}"!` }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = { role: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await API.post("/ai/chat", { message: input, topic });
            const aiMsg = { role: "ai", text: res.data.reply };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't connect. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                style={styles.floatBtn}
            >
                <MessageCircle size={28} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        style={styles.chatWindow}
                    >
                        <div style={styles.header}>
                            <span>🤖 AI Tutor</span>
                            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={styles.messages}>
                            {messages.map((m, i) => (
                                <div key={i} style={{ ...styles.message, alignSelf: m.role === "user" ? "flex-end" : "flex-start", background: m.role === "user" ? "#4f46e5" : "#f3f4f6", color: m.role === "user" ? "#fff" : "#1f2937" }}>
                                    {m.text}
                                </div>
                            ))}
                            {loading && <div style={styles.typing}>Thinking...</div>}
                            <div ref={messagesEndRef} />
                        </div>

                        <div style={styles.inputArea}>
                            <input
                                style={styles.input}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Ask me anything..."
                            />
                            <button onClick={sendMessage} style={styles.sendBtn} disabled={loading}>
                                <Send size={20} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const styles = {
    floatBtn: {
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        color: "white",
        border: "none",
        boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
        cursor: "pointer",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    chatWindow: {
        position: "fixed",
        bottom: "100px",
        right: "30px",
        width: "350px",
        height: "500px",
        background: "white",
        borderRadius: "15px",
        boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        border: "1px solid #e5e7eb"
    },
    header: {
        padding: "15px",
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontWeight: "bold"
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        color: "white",
        cursor: "pointer"
    },
    messages: {
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    message: {
        maxWidth: "80%",
        padding: "10px 14px",
        borderRadius: "12px",
        fontSize: "14px",
        lineHeight: "1.4"
    },
    typing: {
        alignSelf: "flex-start",
        fontSize: "12px",
        color: "#6b7280",
        marginLeft: "10px"
    },
    inputArea: {
        padding: "15px",
        borderTop: "1px solid #e5e7eb",
        display: "flex",
        gap: "10px"
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ddd",
        outline: "none"
    },
    sendBtn: {
        background: "#4f46e5",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
};

export default ChatTutor;
