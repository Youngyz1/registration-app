// src/components/Header.js
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  TextField,
  InputAdornment,
  Typography,
  Tooltip,
  Divider,
  useTheme,
  Switch,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useThemeMode } from "../contexts/ThemeContext";

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { logout, user } = useAuth();
  const { toggleDark, isDark } = useThemeMode();
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const handleLogout = () => {
    logout();
    navigate("/login");
    setAnchorEl(null);
  };

  const avatarColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
  const avatarColor = avatarColors[(user?.username?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: dark ? "#1a1d27" : "#ffffff",
        borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)"}`,
        color: theme.palette.text.primary,
        zIndex: theme.zIndex.drawer - 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, md: 3 }, minHeight: "64px !important" }}>
        {/* Search */}
        <TextField
          size="small"
          placeholder="Search anything..."
          variant="outlined"
          sx={{
            width: { xs: 180, sm: 280 },
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              fontSize: 13,
              backgroundColor: dark ? "rgba(255,255,255,0.05)" : "#f8f9fc",
              "& fieldset": { border: `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` },
              "&:hover fieldset": { borderColor: "#6366f1" },
              "&.Mui-focused fieldset": { borderColor: "#6366f1" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: theme.palette.text.secondary, fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />

        <Box display="flex" alignItems="center" gap={0.5}>
          {/* Dark mode toggle */}
          <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
            <IconButton
              onClick={toggleDark}
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": { color: "#6366f1", bgcolor: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)" },
              }}
            >
              {isDark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              size="small"
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": { color: "#6366f1", bgcolor: dark ? "rgba(99,102,241,0.1)" : "rgba(99,102,241,0.08)" },
              }}
            >
              <Badge
                badgeContent={3}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "#ef4444",
                    color: "#fff",
                    fontSize: 10,
                    minWidth: 16,
                    height: 16,
                  },
                }}
              >
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Vertical divider */}
          <Box sx={{ width: 1, height: 24, bgcolor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", mx: 1 }} />

          {/* Avatar + Name */}
          <Box
            display="flex"
            alignItems="center"
            gap={1.5}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              cursor: "pointer",
              px: 1.5,
              py: 0.5,
              borderRadius: "10px",
              transition: "background 0.15s",
              "&:hover": { bgcolor: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" },
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: avatarColor,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "A"}
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography fontSize={13} fontWeight={700} lineHeight={1.2} color="text.primary">
                {user?.username || "Admin"}
              </Typography>
              <Typography fontSize={11} color="text.secondary" lineHeight={1.2}>
                Administrator
              </Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 180,
                borderRadius: "12px",
                border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              },
            }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography fontSize={13} fontWeight={700}>
                {user?.username || "Admin"}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {user?.email || "admin@example.com"}
              </Typography>
            </Box>
            <Divider />
            <MenuItem
              onClick={() => { navigate("/profile"); setAnchorEl(null); }}
              sx={{ fontSize: 14, gap: 1.5, py: 1.2 }}
            >
              <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} /> Profile
            </MenuItem>
            <MenuItem
              onClick={handleLogout}
              sx={{ fontSize: 14, gap: 1.5, py: 1.2, color: "#ef4444" }}
            >
              <LogoutIcon fontSize="small" /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
