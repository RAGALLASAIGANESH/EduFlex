import { motion } from "framer-motion";

export default function TopicCard({ topic, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(topic)}
      whileHover={{ scale: 1.08, y: -5 }}
      whileTap={{ scale: 0.95 }}
      style={{
        padding: "12px 24px",
        borderRadius: 10,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: 14,
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
        transition: "all 0.3s ease"
      }}
    >
      {topic}
    </motion.button>
  );
}
