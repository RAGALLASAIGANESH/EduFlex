import { useEffect, useState } from "react";
import API from "../services/api";
import { motion } from "framer-motion";
import { BookOpen, Calendar, Trash2 } from "lucide-react";

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [dueReviews, setDueReviews] = useState([]);

  useEffect(() => {
    // Fetch History
    API.get("/progress")
      .then(res => {
        setHistory(res.data);
        calculateStreak(res.data);
      })
      .catch(() => console.error("Failed to load history"));

    // Fetch Due Reviews
    API.get("/progress/due")
      .then(res => {
        setDueReviews(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // prevent clicking card
    if (!window.confirm("Are you sure you want to delete this topic from your history?")) return;

    try {
      await API.delete(`/progress/${id}`);
      setHistory(prev => {
        const newHistory = prev.filter(item => item._id !== id);
        calculateStreak(newHistory);
        return newHistory;
      });
      setDueReviews(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      console.error("Failed to delete progress", err);
      alert("Failed to delete topic. Please try again.");
    }
  };

  const calculateStreak = (data) => {
    if (!data.length) return;

    const dates = [...new Set(data.map(item => new Date(item.createdAt).toDateString()))];
    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    if (dates.includes(today)) {
      currentStreak++;
      let checkDate = new Date();
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        if (dates.includes(checkDate.toDateString())) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else if (dates.includes(yesterdayStr)) {
      currentStreak++;
      let checkDate = new Date(yesterday);
      while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        if (dates.includes(checkDate.toDateString())) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

    setStreak(currentStreak);
  };



  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.header}
      >
        <h1 style={styles.title}>📚 Your Learning Journey</h1>
        <p style={styles.subtitle}>Track all your studied topics and progress</p>

        {streak > 0 && (
          <div style={styles.streakBadge}>
            🔥 {streak} Day Streak! Keep it up!
          </div>
        )}
      </motion.div>

      {/* Due Reviews Section */}
      {dueReviews.length > 0 && (
        <motion.div
          style={styles.alertBox}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <h3>⏰ Time to Review!</h3>
          <p>Spaced repetition helps you remember better. Review these topics now:</p>
          <div style={styles.reviewList}>
            {dueReviews.map((item, i) => (
              <span key={i} style={styles.reviewTag}>{item.topic}</span>
            ))}
          </div>
        </motion.div>
      )}

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={styles.loadingBox}
        >
          Loading your progress...
        </motion.div>
      ) : history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={styles.emptyBox}
        >
          <BookOpen size={48} color="#2563eb" />
          <h2>No topics yet</h2>
          <p>Start learning to see your progress here</p>
        </motion.div>
      ) : (
        <motion.div
          style={styles.grid}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {history.map((h, i) => (
            <motion.div
              key={i}
              style={styles.card}
              whileHover={{ y: -8, boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)" }}
            >
              <div style={styles.cardTop}>
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '5px' }}>
                  <h3 style={styles.topic}>{h.topic}</h3>
                  <span style={styles.badge}>{h.learningStyle || "visual"}</span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, h._id)}
                  style={styles.deleteBtn}
                  title="Delete Topic"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {h.score !== undefined && (
                <div style={{ fontSize: "14px", color: h.score >= 4 ? "#10b981" : "#f59e0b", fontWeight: "bold" }}>
                  Quiz Score: {h.score}/5
                </div>
              )}

              <div style={styles.cardBottom}>
                <Calendar size={16} color="#6b7280" />
                <small style={styles.date}>
                  {new Date(h.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </small>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "60px 20px",
    minHeight: "calc(100vh - 80px)",
    background: "#f8fafc"
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 50px",
    textAlign: "center"
  },
  title: {
    fontSize: "clamp(28px, 5vw, 40px)",
    fontWeight: "700",
    color: "#1f2937",
    margin: "0 0 10px"
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0
  },
  streakBadge: {
    display: "inline-block",
    marginTop: "15px",
    background: "#ffebd2",
    color: "#d97706",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
    border: "1px solid #fcd34d"
  },
  alertBox: {
    maxWidth: "800px",
    margin: "0 auto 40px",
    background: "#ecfdf5",
    border: "1px solid #10b981",
    borderRadius: "12px",
    padding: "20px",
    textAlign: "center",
    color: "#065f46"
  },
  reviewList: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginTop: "10px",
    flexWrap: "wrap"
  },
  reviewTag: {
    background: "white",
    padding: "5px 12px",
    borderRadius: "15px",
    border: "1px solid #10b981",
    fontSize: "14px",
    fontWeight: "bold"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e5e7eb",
    transition: "all 0.3s ease",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  cardTop: {
    display: "flex",
    alignItems: "start",
    justifyContent: "space-between",
    gap: "10px"
  },
  topic: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1f2937",
    margin: 0,
    flex: 1
  },
  badge: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    width: "fit-content"
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    padding: "8px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease",
    ":hover": {
      background: "#fee2e2"
    }
  },
  cardBottom: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  date: {
    fontSize: "13px",
    color: "#6b7280"
  },
  loadingBox: {
    textAlign: "center",
    padding: "60px 20px",
    fontSize: "18px",
    color: "#6b7280"
  },
  emptyBox: {
    textAlign: "center",
    padding: "80px 20px",
    background: "white",
    borderRadius: "12px",
    maxWidth: "400px",
    margin: "0 auto"
  }
};
