import { useState, useEffect } from "react";
import API from "../services/api";
import Loader from "../components/Loader";
import TypingText from "../components/TypingText";
import TopicCard from "../components/TopicCard";
import GraphvizDiagram from "../components/GraphvizDiagram";
import VideoEmbed from "../components/VideoEmbed";
import Quiz from "../components/Quiz";
import ChatTutor from "../components/ChatTutor";
import Flashcards from "../components/Flashcards";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Mic, MicOff } from "lucide-react";

export default function Learn() {
  const [topic, setTopic] = useState("");
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.topic) {
      setTopic(location.state.topic);
      generate(location.state.topic);
    }
  }, [location.state]);

  // Get learning style from local storage or default to visual
  const [learningStyle, setLearningStyle] = useState(localStorage.getItem("learningStyle") || "visual");
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (isListening) {
      window.speechSynthesis.cancel();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice control is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      console.log("Voice Command:", transcript);

      if (transcript.includes("generate")) {
        const newTopic = transcript.replace("generate", "").replace("content", "").trim();
        if (newTopic) {
          setTopic(newTopic);
          generate(newTopic);
        }
      } else if (transcript.includes("read") || transcript.includes("listen")) {
        if (contentData?.content) speakContent(contentData.content);
      } else if (transcript.includes("stop")) {
        window.speechSynthesis.cancel();
      }
    };

    recognition.start();
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("content-to-pdf");
    if (!element) return;

    // Hide non-printable elements for PDF
    const toggles = document.querySelector(".mode-toggle-pdf");
    if (toggles) toggles.style.display = "none";

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    // Restore elements
    if (toggles) toggles.style.display = "flex";

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${topic || "Lesson"}_Guide.pdf`);
  };

  const generate = async (t) => {
    const useTopic = t || topic;
    if (!useTopic) {
      setError("Please enter a topic");
      return;
    }
    setLoading(true);
    setContentData(null);
    setError("");
    setShowFlashcards(false); // Reset flashcards view

    try {
      console.log("Sending request with:", { topic: useTopic, learningStyle });
      const res = await API.post("/ai/generate", { topic: useTopic, learningStyle });
      console.log("Response received:", res.data);

      setContentData(res.data);

    } catch (error) {
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to generate content";
      setError(errorMsg);
      console.error("Full error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizComplete = (score) => {
    console.log("Quiz completed with score:", score);
  };

  const speakContent = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support text-to-speech.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🤖 AI Learning Engine</h2>

      <div style={styles.controls}>
        <select
          value={learningStyle}
          onChange={(e) => {
            setLearningStyle(e.target.value);
            localStorage.setItem("learningStyle", e.target.value);
          }}
          style={styles.select}
        >
          <option value="visual">Visual (Diagrams & Videos)</option>
          <option value="auditory">Auditory (Podcast & TTS)</option>
          <option value="reading">Reading (Detailed Notes)</option>
          <option value="kinesthetic">Kinesthetic (Hands-on)</option>
        </select>
      </div>

      {error && <div style={styles.errorBox}>{error}</div>}

      <div style={styles.inputGroup}>
        <input
          style={styles.input}
          placeholder="Enter any topic..."
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && generate()}
        />
        <button style={styles.micBtn} onClick={toggleListening} title="Voice Command">
          {isListening ? <MicOff color="white" /> : <Mic color="white" />}
        </button>
        <button style={styles.genBtn} onClick={() => generate()}>Generate</button>
      </div>

      <h4>Popular Topics</h4>
      <div style={styles.topicContainer}>
        {["DSA", "OS", "DBMS", "AI", "CN"].map(t => (
          <TopicCard key={t} topic={t} onClick={() => { setTopic(t); generate(t); }} />
        ))}
      </div>

      {loading && <Loader />}

      {contentData && (
        <div style={styles.contentBox} id="content-to-pdf">

          {/* Mode Toggles & PDF Button */}
          <div style={styles.headerRow} className="mode-toggle-pdf">
            <div style={styles.modeToggle}>
              <button
                onClick={() => setShowFlashcards(false)}
                style={{ ...styles.toggleBtn, background: !showFlashcards ? "#e0e7ff" : "transparent", fontWeight: !showFlashcards ? "bold" : "normal" }}
              >
                📖 Learn
              </button>
              <button
                onClick={() => setShowFlashcards(true)}
                style={{ ...styles.toggleBtn, background: showFlashcards ? "#e0e7ff" : "transparent", fontWeight: showFlashcards ? "bold" : "normal" }}
              >
                📇 Flashcards
              </button>
            </div>
            <button onClick={handleExportPDF} style={styles.pdfBtn}>
              📄 Save PDF
            </button>
          </div>

          {showFlashcards ? (
            <Flashcards topic={topic || "Learning"} />
          ) : (
            <>
              {/* Main Content */}
              <TypingText text={contentData.content || (typeof contentData === 'string' ? contentData : "")} />

              {/* Visuals */}
              {learningStyle === "visual" && contentData.visuals?.graphviz && (
                <div style={{ marginTop: 20 }}>
                  <h3>Visual Diagram</h3>
                  <GraphvizDiagram chart={contentData.visuals.graphviz} />
                </div>
              )}

              {learningStyle === "visual" && contentData.videoSearchQuery && (
                <VideoEmbed query={contentData.videoSearchQuery} />
              )}

              {/* Auditory Controls */}
              {learningStyle === "auditory" && (
                <button
                  onClick={() => speakContent(contentData.content)}
                  style={{ ...styles.genBtn, marginTop: 20, background: "#10b981" }}
                >
                  🔊 Listen to this Guide
                </button>
              )}

              {/* Kinesthetic Project Mode */}
              {learningStyle === "kinesthetic" && contentData.project ? (
                <div style={styles.projectBox}>
                  <div style={styles.projectHeader}>
                    <h3>🚀 Mini-Project: {contentData.project.title}</h3>
                    <p>{contentData.project.description}</p>
                  </div>

                  <div style={styles.stepsContainer}>
                    {contentData.project.steps.map((step, i) => (
                      <div key={i} style={styles.stepCard}>
                        <div style={styles.stepBadge}>Step {step.step}</div>
                        <h4 style={styles.stepAction}>{step.action}</h4>
                        {step.code && (
                          <pre style={styles.codeBlock}>
                            <code>{step.code}</code>
                          </pre>
                        )}
                        <p style={styles.stepExplain}>💡 {step.explanation}</p>
                      </div>
                    ))}
                  </div>

                  {contentData.project.challenge && (
                    <div style={styles.challengeBox}>
                      <h4>🏆 Final Challenge</h4>
                      <p>{contentData.project.challenge}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Kinesthetic Fallback (if old data or error) */
                learningStyle === "kinesthetic" && contentData.practicalTasks && (
                  <div style={{ marginTop: 20, background: "#fff", padding: 15, borderRadius: 8 }}>
                    <h3>🛠️ Hands-on Tasks</h3>
                    <ul style={{ paddingLeft: 20 }}>
                      {contentData.practicalTasks.map((task, i) => (
                        <li key={i} style={{ marginBottom: 10 }}>
                          <input type="checkbox" style={{ marginRight: 10 }} />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              {/* Quiz Section */}
              {contentData.quiz && contentData.quiz.length > 0 && (
                <div style={{ marginTop: 40, borderTop: "2px dashed #eee", paddingTop: 20 }}>
                  <h3>📝 Knowledge Check</h3>
                  <Quiz questions={contentData.quiz} onComplete={handleQuizComplete} />
                </div>
              )}
            </>
          )}

          {/* Chat Tutor Always Available */}
          <ChatTutor topic={topic || "Learning"} />

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "60px 20px",
    maxWidth: "1000px",
    margin: "0 auto",
    minHeight: "calc(100vh - 80px)"
  },
  controls: {
    marginBottom: 20
  },
  select: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "16px",
    width: "100%",
    maxWidth: "300px"
  },
  errorBox: {
    background: "#fee2e2",
    border: "1px solid #fca5a5",
    color: "#dc2626",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 14
  },
  inputGroup: {
    display: "flex",
    gap: 12,
    marginBottom: 40
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    fontSize: 15,
    border: "2px solid #e5e7eb",
    borderRadius: 10,
    outline: "none",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
  },
  genBtn: {
    padding: "14px 32px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: 15,
    fontWeight: "600",
    boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease"
  },
  micBtn: {
    padding: "14px",
    background: "#ef4444",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)"
  },
  topicContainer: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginBottom: 40
  },
  contentBox: {
    marginTop: 40,
    padding: 30,
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    borderRadius: 12,
    lineHeight: 1.8,
    color: "#1f2937",
    border: "1px solid #e0e7ff",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    position: "relative"
  },
  modeToggle: {
    display: "flex",
    gap: "10px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "10px"
  },
  toggleBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    color: "#4f46e5",
    transition: "all 0.2s"
  },
  pdfBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px"
  },
  projectBox: {
    padding: "20px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
  },
  projectHeader: {
    borderBottom: "2px solid #f3f4f6",
    paddingBottom: "15px",
    marginBottom: "20px"
  },
  stepsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },
  stepCard: {
    background: "#f8fafc",
    padding: "20px",
    borderRadius: "10px",
    borderLeft: "4px solid #4f46e5"
  },
  stepBadge: {
    fontSize: "12px",
    fontWeight: "bold",
    color: "#4f46e5",
    textTransform: "uppercase",
    marginBottom: "5px"
  },
  stepAction: {
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 10px 0",
    color: "#1e293b"
  },
  codeBlock: {
    background: "#1e293b",
    color: "#f8fafc",
    padding: "15px",
    borderRadius: "8px",
    overflowX: "auto",
    fontFamily: "monospace",
    fontSize: "14px",
    margin: "10px 0"
  },
  stepExplain: {
    color: "#64748b",
    fontStyle: "italic",
    margin: "10px 0 0 0"
  },
  challengeBox: {
    marginTop: "30px",
    padding: "20px",
    background: "#fff7ed",
    border: "1px solid #ffedd5",
    borderRadius: "12px",
    borderLeft: "4px solid #f97316"
  }
};
