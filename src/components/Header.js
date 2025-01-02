import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../css/header.css";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null); // State to manage the menu anchor
  const [language, setLanguage] = useState('en'); // State to manage the selected language
  const navigate = useNavigate(); // To navigate programmatically between routes

  // Function to handle menu opening
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Function to handle language selection
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    handleMenuClose();
    // Navigate based on the selected language
    if (lang === 'en') {
      navigate('/');
    } else {
      navigate('/bm');
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "#ff9e80",
      }}
    >
      <Toolbar>
        <img
          src="/logo.png"
          alt="NutriFit AI Logo"
          style={{ height: "65px", marginRight: "5px" }}
        />
        <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
          NutriFit AI
        </Typography>

        {/* Language selection button with black text */}
        <Button
          color="inherit"
          onClick={handleMenuOpen}
          sx={{
            textTransform: "none", 
            marginRight: "20px", 
            fontSize: "18px",  // Increase font size here
            fontWeight: "bold", // Optional: Make text bold
            color: "black" // Set the button text to black
          }}
        >
          {language === 'en' ? 'English' : 'Bahasa Melayu'}
        </Button>

        {/* Language selection menu with black text */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem 
            onClick={() => handleLanguageChange('en')} 
            sx={{
              fontSize: "16px", 
              fontWeight: "bold",  // Optional: Make text bold
              color: "black" // Set the menu item text to black
            }}  
          >
            English
          </MenuItem>
          <MenuItem 
            onClick={() => handleLanguageChange('bm')} 
            sx={{
              fontSize: "16px", 
              fontWeight: "bold",  // Optional: Make text bold
              color: "black" // Set the menu item text to black
            }}  
          >
            Bahasa Melayu
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
