import React, { useState } from "react";
import { motion } from "framer-motion";

const Quiz = ({ questions, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleAnswer = (optionIndex) => {
        if (optionIndex === questions[currentQuestion].correct) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setShowResult(true);
            onComplete(score + (optionIndex === questions[currentQuestion].correct ? 1 : 0));
        }
    };

    if (showResult) {
        return (
            <div style={styles.resultContainer}>
                <h3>Quiz Completed!</h3>
                <p>Your Score: {score} / {questions.length}</p>
                <p>{score / questions.length > 0.7 ? "Great job! Keep up with your current learning style." : "You might want to try a different learning style for this topic."}</p>
            </div>
        );
    }

    return (
        <div style={styles.quizContainer}>
            <h3>Question {currentQuestion + 1}/{questions.length}</h3>
            <p style={styles.question}>{questions[currentQuestion].question}</p>
            <div style={styles.options}>
                {questions[currentQuestion].options.map((option, index) => (
                    <button
                        key={index}
                        style={styles.optionButton}
                        onClick={() => handleAnswer(index)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

const styles = {
    quizContainer: {
        padding: "20px",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginTop: "20px"
    },
    question: {
        fontSize: "18px",
        marginBottom: "20px"
    },
    options: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    optionButton: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        background: "#f9f9f9",
        cursor: "pointer",
        textAlign: "left",
        color: "#333"
    },
    resultContainer: {
        textAlign: "center",
        padding: "40px",
        background: "#f0fdf4",
        borderRadius: "8px",
        border: "1px solid #bbf7d0",
        color: "#166534"
    }
};

export default Quiz;
