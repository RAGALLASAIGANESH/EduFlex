import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    q: "When learning something new, you prefer:",
    options: {
      visual: "Diagrams and flowcharts",
      auditory: "Listening to explanations",
      reading: "Reading notes or books",
      kinesthetic: "Hands-on practice"
    }
  },
  {
    q: "You remember best when:",
    options: {
      visual: "You see it",
      auditory: "You hear it",
      reading: "You read it",
      kinesthetic: "You do it"
    }
  },
  {
    q: "In a class, you like:",
    options: {
      visual: "Slides & visuals",
      auditory: "Lectures",
      reading: "Handouts",
      kinesthetic: "Activities"
    }
  }
];

export default function Onboarding() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState({
    visual: 0,
    auditory: 0,
    reading: 0,
    kinesthetic: 0
  });

  const navigate = useNavigate();

  const answer = (type) => {
    const updatedScore = {
      ...score,
      [type]: score[type] + 1
    };

    setScore(updatedScore);

    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      const learningStyle = Object.keys(updatedScore).reduce((a, b) =>
        updatedScore[a] > updatedScore[b] ? a : b
      );

      localStorage.setItem("learningStyle", learningStyle);
      navigate("/learn");
    }
  };

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.card}
      >
        <h2>{questions[index].q}</h2>

        {Object.entries(questions[index].options).map(([key, value]) => (
          <button
            key={key}
            style={styles.btn}
            onClick={() => answer(key)}
          >
            {value}
          </button>
        ))}
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg,#eef2ff,#f8fafc)",
    fontFamily: "sans-serif"
  },
  card: {
    background: "white",
    padding: 30,
    borderRadius: 12,
    width: 420,
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,.12)"
  },
  btn: {
    width: "100%",
    padding: 12,
    marginTop: 12,
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontSize: 15
  }
};
