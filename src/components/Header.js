import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "../css/header.css";

const Header = () => {
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
          style={{ height: "40px", marginRight: "10px" }}
        />
        <Typography variant="h5" component="div">
          NutriFit AI
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;