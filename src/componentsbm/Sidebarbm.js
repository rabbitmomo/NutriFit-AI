import React from "react";
import { Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../css/sidebar.css";

const Sidebarbm = () => {
  const routes = [
    { path: "/bm/userpage", label: "Halaman Pengguna" },  
    { path: "/bm/userpage", label: "Halaman Pengguna" },  
    { path: "/bm/weekly", label: "Rancangan Mingguan" },           
    { path: "/bm/recipe", label: "Resipi" },              
    { path: "/bm/exercise", label: "Latihan" },           
    { path: "/bm/nutrition", label: "Pemakanan" },       
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
        },
      }}
      className="sidebar"
    >
      <List>
        {routes.map((route) => (
          <ListItem button key={route.path}>
            <Box
              sx={{
                width: "100%",
                padding: "10px 20px",
                minHeight: "28px",
              }}
            >
              <Link
                to={route.path}
                style={{ textDecoration: "none", color: "black" }}
              >
                <ListItemText
                  primary={route.label}
                  sx={{ fontSize: "16px" }}
                />
              </Link>
            </Box>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebarbm;
