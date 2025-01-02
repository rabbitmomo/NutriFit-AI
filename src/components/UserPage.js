import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, InputBase, Box, Typography} from "@mui/material"; 
import { useNavigate,Link } from "react-router-dom";  

import "../css/userpage.css"; 

const UserPage = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); 
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [latestData, setLatestData] = useState(null); 
  const navigate = useNavigate(); 

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (prompt.trim() === "") return; 

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "User", text: prompt },
    ]);
    setPrompt("");
    setLoading(true);
    setIsAnalysisComplete(false); 
    setLatestData(null);

    try {
      const { data } = await axios.post(
        "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/openai-supabase",
        { prompt }
      );
      setResponse(data.data);
      setIsAnalysisComplete(true); 
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: "Analysis complete. Fetching User Preference data analyzed by AI..." },
      ]);

      fetchLatestData();
    } catch (err) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: "Error fetching data." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLatestData = async () => {
    try {
      const response = await axios.get(
        "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-data"
      );
  
      const latestData = typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;
  
      setLatestData(latestData);
  
      console.log(latestData);
      console.log(latestData.data);
      console.log(typeof latestData);
  
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "Bot",
          text: (
            <div>
              <Typography variant="h6">User Preference Data Analyzed by AI</Typography>
              {Object.entries(latestData.data || {}).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "8px" }}>
                  <Typography
                    component="span"
                    style={{ fontWeight: "bold", color: "black" }}
                  >
                    {key}:
                  </Typography>
                  <Typography
                    component="span"
                    style={{ color: "gray", marginLeft: "8px" }}
                  >
                    {Array.isArray(value) ? value.join(", ") : value.toString()}
                  </Typography>
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                <Link to="/weekly" style={{ color: "blue", textDecoration: "underline" }}>
                  Go to Weekly Page
                </Link>
              </div>
            </div>
          ),
        },
      ]);
    } catch (err) {
      console.error("Error fetching the latest data:", err);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: "Error fetching the latest data." },
      ]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit(event);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
    <div className="container">
      <h1>User Preferences</h1>
      <div className="chat-container">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "User" ? "user" : "bot"
              }`}
            >
              <div className="message-bubble">
                {message.sender === "User" ? (
                  <>
                    <Typography sx={{ fontWeight: "bold" }}>User:</Typography>
                    {message.text}
                  </>
                ) : (
                  <>
                    <Typography sx={{ fontWeight: "bold" }}>
                      AI Response:
                    </Typography>
                    <Typography>{message.text}</Typography>
                    
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <Box sx={{ textAlign: "center", marginTop: 5 }}>
            <Typography variant="h6">
              Tell me anything about your meal and workout preferences!
            </Typography>
          </Box>
        )}

        {loading && (
          <div className="loading">
            <Typography>Loading...</Typography>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <InputBase
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyPress}
            ref={inputRef}
            placeholder="Type a message"
            disabled={loading}
            className="input-field"
          />
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="send-button"
            variant="contained"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
    </>
  );
};

export default UserPage;
