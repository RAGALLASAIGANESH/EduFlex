import { motion } from "framer-motion";

export default function Loader({ text = "🤖 AI is thinking..." }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={styles.box}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
        style={styles.spinner}
      />
      <motion.p
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={styles.text}
      >
        {text}
      </motion.p>
    </motion.div>
  );
}

const styles = {
  box: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40
  },
  spinner: {
    width: 50,
    height: 50,
    border: "4px solid #e0e7ff",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    marginBottom: 20
  },
  text: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "500",
    margin: 0
  }
};
