import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Brain, Zap, Target, BookOpen, Users, TrendingUp } from "lucide-react";
import TopicCloud from "../components/TopicCloud";

export default function Home() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Get personalized explanations powered by advanced AI technology"
    },
    {
      icon: Target,
      title: "Learning Styles",
      description: "Content adapted to your preferred learning style - visual, auditory, reading, or kinesthetic"
    },
    {
      icon: Zap,
      title: "Instant Content",
      description: "Generate comprehensive learning materials in seconds for any topic"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your learning journey with a complete history of topics studied"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <motion.section
        style={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={styles.heroContent}
        >
          <h1 style={styles.title}>
            <span style={styles.gradient}>EduFlex</span>
            <br />
            Learn Smarter, Not Harder
          </h1>
          <p style={styles.subtitle}>
            Transform your learning with AI-powered, personalized educational content tailored to your unique learning style
          </p>

          <motion.div
            style={styles.ctaButtons}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link to="/onboarding">
              <motion.button
                style={styles.primaryBtn}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(37, 99, 235, 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start Learning Now
              </motion.button>
            </Link>
            <motion.a
              href="#features"
              style={styles.secondaryBtn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </motion.div>

        {/* 3D Topic Cloud */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={styles.cloudContainer}
        >
          <TopicCloud />
        </motion.div>

        {/* Animated Background Elements */}
        <motion.div
          style={styles.bgOrb1}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          style={styles.bgOrb2}
          animate={{
            y: [0, 30, 0],
            x: [0, -20, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.section>

      {/* Features Section */}
      <motion.section
        id="features"
        style={styles.featuresSection}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 style={styles.sectionTitle} variants={itemVariants}>
          Why Choose EduFlex?
        </motion.h2>

        <motion.div style={styles.featuresGrid} variants={containerVariants}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                style={styles.featureCard}
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)" }}
              >
                <motion.div
                  style={styles.iconContainer}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Icon size={32} color="#2563eb" />
                </motion.div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDesc}>{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section
        style={styles.howItWorks}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <h2 style={styles.sectionTitle}>How It Works</h2>

        <motion.div style={styles.stepsContainer} variants={containerVariants}>
          {[
            { num: "1", title: "Take the Quiz", desc: "Discover your learning style in just 3 questions" },
            { num: "2", title: "Pick a Topic", desc: "Search for any subject you want to learn" },
            { num: "3", title: "Get Content", desc: "AI generates personalized learning material instantly" },
            { num: "4", title: "Track Progress", desc: "Monitor all your learning in one place" }
          ].map((step, index) => (
            <motion.div
              key={index}
              style={styles.step}
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                style={styles.stepNumber}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                {step.num}
              </motion.div>
              <h3 style={styles.stepTitle}>{step.title}</h3>
              <p style={styles.stepDesc}>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        style={styles.ctaSection}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
      >
        <h2 style={styles.ctaTitle}>Ready to Transform Your Learning?</h2>
        <p style={styles.ctaSubtitle}>Join thousands of learners using AI-powered personalized education</p>
        <Link to="/onboarding">
          <motion.button
            style={styles.ctaBtn}
            whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(37, 99, 235, 0.4)" }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Free
          </motion.button>
        </Link>
      </motion.section>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#f8fafc",
    minHeight: "100vh"
  },
  hero: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between", // Changed for side-by-side layout
    position: "relative",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)",
    backgroundSize: "400% 400%",
    padding: "40px 5%", // Adjusted padding
    overflow: "hidden",
    flexWrap: "wrap", // For mobile responsiveness
    gap: "40px"
  },
  heroContent: {
    textAlign: "left", // Left align for split view
    zIndex: 2,
    position: "relative",
    maxWidth: "600px",
    flex: 1
  },
  cloudContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    minWidth: "300px"
  },
  title: {
    fontSize: "clamp(40px, 8vw, 80px)",
    fontWeight: "800",
    color: "white",
    margin: "0 0 30px 0",
    lineHeight: "1.2",
    textShadow: "0 10px 30px rgba(0, 0, 0, 0.3)"
  },
  gradient: {
    background: "linear-gradient(45deg, #ffd700, #ffed4e)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  subtitle: {
    fontSize: "clamp(18px, 4vw, 24px)",
    color: "rgba(255, 255, 255, 0.95)",
    marginBottom: "40px",
    maxWidth: "600px",
    margin: "0 auto 40px",
    lineHeight: "1.6"
  },
  ctaButtons: {
    display: "flex",
    gap: "20px",
    justifyContent: "flex-start", // Left align buttons
    flexWrap: "wrap"
  },
  primaryBtn: {
    padding: "16px 40px",
    fontSize: "18px",
    fontWeight: "600",
    background: "white",
    color: "#2563eb",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease"
  },
  secondaryBtn: {
    padding: "16px 40px",
    fontSize: "18px",
    fontWeight: "600",
    background: "transparent",
    color: "white",
    border: "2px solid white",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    textDecoration: "none",
    display: "inline-block"
  },
  bgOrb1: {
    position: "absolute",
    width: "500px",
    height: "500px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    top: "-100px",
    right: "-100px",
    zIndex: 0,
    filter: "blur(40px)"
  },
  bgOrb2: {
    position: "absolute",
    width: "400px",
    height: "400px",
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "50%",
    bottom: "-100px",
    left: "-100px",
    zIndex: 0,
    filter: "blur(40px)"
  },
  featuresSection: {
    padding: "80px 20px",
    backgroundColor: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  sectionTitle: {
    fontSize: "clamp(32px, 6vw, 48px)",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "60px",
    textAlign: "center"
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    width: "100%"
  },
  featureCard: {
    padding: "40px",
    borderRadius: "16px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer"
  },
  iconContainer: {
    width: "70px",
    height: "70px",
    background: "#eff6ff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    cursor: "pointer"
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "12px"
  },
  featureDesc: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6"
  },
  howItWorks: {
    padding: "80px 20px",
    backgroundColor: "#f8fafc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  stepsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "30px",
    maxWidth: "1200px",
    width: "100%",
    marginTop: "40px"
  },
  step: {
    padding: "40px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
    transition: "all 0.3s ease"
  },
  stepNumber: {
    width: "60px",
    height: "60px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    fontSize: "28px",
    fontWeight: "700",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    cursor: "pointer"
  },
  stepTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "12px"
  },
  stepDesc: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6"
  },
  ctaSection: {
    padding: "80px 20px",
    backgroundColor: "white",
    textAlign: "center"
  },
  ctaTitle: {
    fontSize: "clamp(32px, 6vw, 48px)",
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: "20px"
  },
  ctaSubtitle: {
    fontSize: "18px",
    color: "#6b7280",
    marginBottom: "40px",
    maxWidth: "600px",
    margin: "0 auto 40px"
  },
  ctaBtn: {
    padding: "16px 50px",
    fontSize: "18px",
    fontWeight: "600",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
    transition: "all 0.3s ease"
  }
};
