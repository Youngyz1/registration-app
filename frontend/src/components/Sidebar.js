// src/components/Sidebar.js
import React, { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import BoltIcon from "@mui/icons-material/Bolt";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 248;
const collapsedWidth = 72;

const menuItems = [
  { label: "Dashboard", icon: <DashboardIcon fontSize="small" />, path: "/dashboard" },
  { label: "Users", icon: <PeopleIcon fontSize="small" />, path: "/users" },
  { label: "Settings", icon: <SettingsIcon fontSize="small" />, path: "/settings" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const bg = dark ? "#13151f" : "#1e1b4b";
  const activeBg = "rgba(99,102,241,0.22)";
  const hoverBg = "rgba(99,102,241,0.1)";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          transition: "width 0.25s cubic-bezier(0.4,0,0.2,1)",
          overflowX: "hidden",
          backgroundColor: bg,
          borderRight: "none",
          boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Logo Row */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: collapsed ? 0 : 2.5,
          py: 2.5,
          minHeight: 64,
        }}
      >
        {!collapsed && (
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BoltIcon sx={{ color: "#fff", fontSize: 18 }} />
            </Box>
            <Typography
              fontWeight={800}
              fontSize={17}
              sx={{
                color: "#fff",
                letterSpacing: "-0.3px",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              AdminPanel
            </Typography>
          </Box>
        )}
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          size="small"
          sx={{
            color: "rgba(255,255,255,0.5)",
            "&:hover": { color: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
            ml: collapsed ? "auto" : 0,
            mr: collapsed ? "auto" : 0,
          }}
        >
          {collapsed ? <MenuIcon fontSize="small" /> : <ChevronLeftIcon fontSize="small" />}
        </IconButton>
      </Box>

      {/* Divider */}
      <Box sx={{ mx: 2, height: 1, bgcolor: "rgba(255,255,255,0.07)", mb: 1.5 }} />

      {/* Nav Label */}
      {!collapsed && (
        <Typography
          sx={{
            px: 2.5,
            pb: 1,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.3)",
          }}
        >
          Main Menu
        </Typography>
      )}

      {/* Nav Items */}
      <List sx={{ px: 1.5, flex: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          const btn = (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: "10px",
                mb: 0.5,
                py: 1.2,
                px: collapsed ? 0 : 1.5,
                justifyContent: collapsed ? "center" : "flex-start",
                backgroundColor: active ? activeBg : "transparent",
                transition: "all 0.18s",
                position: "relative",
                "&:hover": { backgroundColor: active ? activeBg : hoverBg },
                ...(active && {
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "20%",
                    height: "60%",
                    width: 3,
                    borderRadius: "0 3px 3px 0",
                    backgroundColor: "#6366f1",
                  },
                }),
              }}
            >
              <ListItemIcon
                sx={{
                  color: active ? "#a5b4fc" : "rgba(255,255,255,0.45)",
                  minWidth: collapsed ? 0 : 36,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    color: active ? "#e0e7ff" : "rgba(255,255,255,0.6)",
                  }}
                />
              )}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip title={item.label} placement="right" key={item.label}>
              {btn}
            </Tooltip>
          ) : (
            btn
          );
        })}
      </List>

      {/* Bottom version tag */}
      {!collapsed && (
        <Box sx={{ px: 2.5, py: 2 }}>
          <Box
            sx={{
              borderRadius: "10px",
              px: 1.5,
              py: 1,
              bgcolor: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.2)",
            }}
          >
            <Typography fontSize={11} color="rgba(255,255,255,0.4)" fontWeight={600}>
              Version 2.0
            </Typography>
            <Typography fontSize={11} color="rgba(255,255,255,0.3)">
              Enterprise Edition
            </Typography>
          </Box>
        </Box>
      )}
    </Drawer>
  );
}
