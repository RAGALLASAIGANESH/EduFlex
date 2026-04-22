import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import API from "../services/api";

const Flashcards = ({ topic }) => {
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (topic) {
            fetchCards();
        }
    }, [topic]);

    const fetchCards = async () => {
        setLoading(true);
        try {
            const res = await API.post("/ai/flashcards", { topic });
            setCards(res.data);
            setCurrentIndex(0);
            setIsFlipped(false);
        } catch (error) {
            console.error("Failed to fetch flashcards", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 200);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 200);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: 20 }}>Generating Flashcards...</div>;
    if (cards.length === 0) return null;

    return (
        <div style={styles.container}>
            <div style={styles.cardScene} onClick={handleFlip}>
                <motion.div
                    style={styles.card}
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, animationDirection: "normal" }}
                >
                    <div style={styles.cardFront}>
                        <h3>{cards[currentIndex].front}</h3>
                        <span style={styles.hint}>(Click to flip)</span>
                    </div>
                    <div style={styles.cardBack}>
                        <p>{cards[currentIndex].back}</p>
                    </div>
                </motion.div>
            </div>

            <div style={styles.controls}>
                <button onClick={prevCard} style={styles.navBtn}><ChevronLeft /></button>
                <span style={styles.counter}>{currentIndex + 1} / {cards.length}</span>
                <button onClick={nextCard} style={styles.navBtn}><ChevronRight /></button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "20px",
        margin: "30px 0"
    },
    cardScene: {
        width: "300px",
        height: "200px",
        perspective: "1000px",
        cursor: "pointer"
    },
    card: {
        width: "100%",
        height: "100%",
        position: "relative",
        transformStyle: "preserve-3d",
        borderRadius: "15px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    cardFront: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px",
        padding: "20px",
        textAlign: "center"
    },
    cardBack: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backfaceVisibility: "hidden",
        background: "white",
        color: "#333",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "15px",
        transform: "rotateY(180deg)",
        border: "1px solid #ddd",
        padding: "20px",
        textAlign: "center",
        fontSize: "16px",
        lineHeight: "1.5"
    },
    hint: {
        fontSize: "12px",
        opacity: 0.8,
        marginTop: "10px"
    },
    controls: {
        display: "flex",
        alignItems: "center",
        gap: "20px"
    },
    navBtn: {
        padding: "10px",
        borderRadius: "50%",
        border: "1px solid #ddd",
        background: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.2s"
    },
    counter: {
        fontSize: "16px",
        fontWeight: "bold",
        color: "#4b5563"
    }
};

export default Flashcards;
