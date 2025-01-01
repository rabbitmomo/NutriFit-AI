import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "../css/header.css";

const Header = () => {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h5" component="div">
          NutriFit AI
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
