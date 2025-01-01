import React from "react";
import { Drawer, List, ListItem, ListItemText, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../css/sidebar.css";

const Sidebar = () => {
  const routes = [
    { path: "/userpage", label: "User Page" },
    { path: "/userpage", label: "User Page" },
    { path: "/weekly", label: "Weekly" },
    { path: "/recipe", label: "Recipe" },
    { path: "/exercise", label: "Exercise" },
    { path: "/nutrition", label: "Nutrition" },
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

export default Sidebar;
