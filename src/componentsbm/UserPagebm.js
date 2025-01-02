import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, InputBase, Box, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

import "../css/userpage.css";

const UserPagebm = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
  const [latestData, setLatestData] = useState(null);
  const [translatedTexts, setTranslatedTexts] = useState({
    userPreferences: '',
    tellMe: '',
    typeMessage: '',
    sendButton: '',
    loading: '',
    analysisComplete: '',
    errorFetchingData: '',
    user: '',
    aiResponse: '',
    userPrefData: '',
    goToWeekly: '',
    waitingForTranslation: 'Sedang menunggu semasa terjemahan...' // Default translation in progress message
  });
  const [isTranslated, setIsTranslated] = useState(false);  // New state for translation status

  const navigate = useNavigate();
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Translate text to Bahasa Malaysia (BM)
  const bm = async (text) => {
    try {
      const response = await axios.post("https://protected-citadel-60147-8c18822cbed9.herokuapp.com/translate-to-bm", {
        text: text
      });
      return response.data.translatedText || text;
    } catch (err) {
      console.error("Translation error", err);
      return text;
    }
  };

  // Translate the text content dynamically
  const translateText = async (text) => {
    return await bm(text);
  };

  // Translate static text content for the page
  const translateStaticText = async () => {
    const translatedTexts = {
      userPreferences: await translateText("User Preferences"),
      tellMe: await translateText("Tell me anything about your meal and workout preferences!"),
      typeMessage: await translateText("Type a message"),
      sendButton: await translateText("Send"),
      loading: await translateText("Loading..."),
      analysisComplete: await translateText("Analysis complete. Fetching User Preference data analyzed by AI..."),
      errorFetchingData: await translateText("Error fetching data."),
      user: await translateText("User"),
      aiResponse: await translateText("AI Response"),
      userPrefData: await translateText("User Preference Data Analyzed by AI"),
      goToWeekly: await translateText("Go to Weekly Page"),
      waitingForTranslation: await translateText("Sedang menunggu semasa terjemahan...") // Translation in progress
    };

    // Capitalize the words 'User' and 'AI Response' if they exist
    translatedTexts.user = translatedTexts.user.toUpperCase();
    translatedTexts.aiResponse = translatedTexts.aiResponse.toUpperCase();

    setTranslatedTexts(translatedTexts);
    setIsTranslated(true);  // Set translation to complete
  };

  useEffect(() => {
    translateStaticText(); // Translate all static text on component mount
  }, []);

  // Handle submit event
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
        { sender: "Bot", text: translatedTexts.analysisComplete },
      ]);

      fetchLatestData();
    } catch (err) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Bot", text: translatedTexts.errorFetchingData },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch latest data from the server
  const fetchLatestData = async () => {
    try {
      const response = await axios.get(
        "https://protected-citadel-60147-8c18822cbed9.herokuapp.com/latest-data"
      );

      const latestData = typeof response.data === "string"
        ? JSON.parse(response.data)
        : response.data;

      setLatestData(latestData);

      // Translate the key and value before setting the messages
      const translatedMessages = await Promise.all(
        Object.entries(latestData.data || {}).map(async ([key, value]) => {
          const translatedKey = await translateText(key);
          const translatedValue = Array.isArray(value)
            ? await Promise.all(value.map(async (v) => await translateText(v)))
            : await translateText(value.toString());

          return {
            key: translatedKey,
            value: Array.isArray(value) ? translatedValue.join(", ") : translatedValue
          };
        })
      );

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "Bot",
          text: (
            <div>
              <Typography variant="h6">{translatedTexts.userPrefData}</Typography>
              {translatedMessages.map(({ key, value }) => (
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
                    {value}
                  </Typography>
                </div>
              ))}

              <div style={{ marginTop: "16px" }}>
                <Link to="/weekly" style={{ color: "blue", textDecoration: "underline" }}>
                  {translatedTexts.goToWeekly}
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
        { sender: "Bot", text: translatedTexts.errorFetchingData },
      ]);
    }
  };

  // Handle key press event (Enter key)
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
    <div className="container">
      {!isTranslated ? (
        <Box sx={{ textAlign: "center", marginTop: 5 }}>
          <Typography variant="h6">{translatedTexts.waitingForTranslation}</Typography>
        </Box>
      ) : (
        <>
          <h1>{translatedTexts.userPreferences}</h1>
          <div className="chat-container">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`message ${message.sender === "User" ? "user" : "bot"}`}
                >
                  <div className="message-bubble">
                    {message.sender === "User" ? (
                      <>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {translatedTexts.user}:
                        </Typography>
                        {message.text}
                      </>
                    ) : (
                      <>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {translatedTexts.aiResponse}:
                        </Typography>
                        <Typography>{message.text}</Typography>
                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <Box sx={{ textAlign: "center", marginTop: 5 }}>
                <Typography variant="h6">{translatedTexts.tellMe}</Typography>
              </Box>
            )}

            {loading && (
              <div className="loading">
                <Typography>{translatedTexts.loading}</Typography>
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
                placeholder={translatedTexts.typeMessage}
                disabled={loading}
                className="input-field"
              />
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="send-button"
                variant="contained"
              >
                {translatedTexts.sendButton}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default UserPagebm;
