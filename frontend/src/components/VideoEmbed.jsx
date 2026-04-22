import React from "react";

const VideoEmbed = ({ query }) => {
    if (!query) return null;

    // Since we don't have a direct YouTube API key to get ID, we can link to search results
    // OR embed a generic search playlist if possible. 
    // A better free alternative is to embed a search link or use a known educational channel's search.
    // For this implementation, we will provide a direct "Watch on YouTube" card that looks like a video.

    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Recommended Video</h3>
            <div style={styles.videoLink}>
                <div style={styles.thumbnail}>
                    <span style={{ fontSize: 40 }}>▶️</span>
                </div>
                <div style={styles.info}>
                    <h4>Watch a video about: {query}</h4>
                    <a href={searchUrl} target="_blank" rel="noopener noreferrer" style={styles.link}>
                        Click to Search on YouTube
                    </a>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        margin: "20px 0",
        padding: "15px",
        background: "#f9f9f9",
        borderRadius: "10px",
        border: "1px solid #ddd"
    },
    title: {
        margin: "0 0 10px 0",
        fontSize: "16px",
        color: "#333"
    },
    videoLink: {
        display: "flex",
        gap: "15px",
        alignItems: "center",
        background: "#fff",
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
    },
    thumbnail: {
        width: "80px",
        height: "60px",
        background: "#eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px"
    },
    info: {
        flex: 1
    },
    link: {
        color: "#d93025",
        fontWeight: "bold",
        textDecoration: "none"
    }
};

export default VideoEmbed;
