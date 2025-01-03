import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, Divider } from "@mui/material";
import { Language, Home } from "@mui/icons-material"; // Icons
import { useNavigate } from "react-router-dom";
import "../css/header.css";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null); 
  const [language, setLanguage] = useState('en'); 
  const navigate = useNavigate(); 

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    handleMenuClose();
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
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Toolbar>
        {/* Logo */}
        <img
          src="/logo.png"
          alt="NutriFit AI Logo"
          style={{ height: "65px", marginRight: "10px" }}
        />

        {/* Title */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          NutriFit AI
        </Typography>

        {/* Home Button */}
        <Button
          startIcon={<Home />}
          sx={{
            textTransform: "none",
            color: "black",
            fontSize: "18px",
            marginRight: "20px",
            fontWeight: "bold",
          }}
          onClick={() => navigate(language === 'en' ? '/' : '/bm')}
        >
          Home
        </Button>

        <Button
          startIcon={<Language />}
          color="inherit"
          onClick={handleMenuOpen}
          sx={{
            textTransform: "none",
            fontSize: "18px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          {language === 'en' ? 'English' : 'Bahasa Melayu'}
        </Button>

        {/* Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{
            "& .MuiPaper-root": {
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              backgroundColor: "#ffffff", // Set the background to white
              minWidth: "150px",
            },
          }}
        >
          <MenuItem
            onClick={() => handleLanguageChange('en')}
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "black",
              "&:hover": { backgroundColor: "#ffccbc" },
            }}
          >
            <Language fontSize="small" sx={{ marginRight: "8px" }} />
            English
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => handleLanguageChange('bm')}
            sx={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "black",
              "&:hover": { backgroundColor: "#ffccbc" },
            }}
          >
            <Language fontSize="small" sx={{ marginRight: "8px" }} />
            Bahasa Melayu
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
