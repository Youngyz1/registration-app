// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box, Typography, TextField, Button, Link,
  Alert, InputAdornment, IconButton, useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import BoltIcon from "@mui/icons-material/Bolt";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/dashboard", { replace: true });
    } catch {
      setError("Invalid username or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      fontSize: 14,
      bgcolor: dark ? "rgba(255,255,255,0.04)" : "#f8f9fc",
      "& fieldset": { borderColor: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
      "&:hover fieldset": { borderColor: "#6366f1" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1", borderWidth: 1.5 },
    },
    "& .MuiInputLabel-root.Mui-focused": { color: "#6366f1" },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: dark ? "#0f1117" : "#f3f4f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background blobs */}
      <Box sx={{
        position: "absolute", top: "-10%", right: "-5%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <Box sx={{
        position: "absolute", bottom: "-10%", left: "-5%",
        width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45 }}
        style={{ width: "100%", maxWidth: 420 }}
      >
        <Box
          sx={{
            bgcolor: dark ? "#1a1d27" : "#fff",
            borderRadius: "20px",
            p: 4,
            border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
            boxShadow: dark ? "0 24px 64px rgba(0,0,0,0.4)" : "0 24px 64px rgba(0,0,0,0.08)",
          }}
        >
          {/* Logo */}
          <Box display="flex" alignItems="center" gap={1.5} mb={3.5}>
            <Box sx={{
              width: 40, height: 40, borderRadius: "12px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
            }}>
              <BoltIcon sx={{ color: "#fff", fontSize: 22 }} />
            </Box>
            <Box>
              <Typography fontWeight={800} fontSize={18} lineHeight={1}>
                AdminPanel
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                Enterprise Edition
              </Typography>
            </Box>
          </Box>

          <Typography variant="h5" fontWeight={800} mb={0.5}>
            Welcome back
          </Typography>
          <Typography color="text.secondary" fontSize={14} mb={3}>
            Sign in to your account to continue
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2.5, borderRadius: "10px", fontSize: 13 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Box mb={2}>
              <Typography fontSize={13} fontWeight={700} mb={0.8} color="text.primary">
                Username
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                sx={inputSx}
              />
            </Box>

            <Box mb={3}>
              <Typography fontSize={13} fontWeight={700} mb={0.8} color="text.primary">
                Password
              </Typography>
              <TextField
                fullWidth
                size="small"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPass(!showPass)}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.3,
                borderRadius: "12px",
                fontSize: 14,
                fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 8px 20px rgba(99,102,241,0.35)",
                textTransform: "none",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5, #4338ca)",
                  boxShadow: "0 10px 24px rgba(99,102,241,0.45)",
                },
                "&:disabled": { opacity: 0.7 },
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>

          <Box textAlign="center" mt={2.5}>
            <Typography fontSize={13} color="text.secondary">
              Don't have an account?{" "}
              <Link
                component={RouterLink}
                to="/register"
                sx={{ color: "#6366f1", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
