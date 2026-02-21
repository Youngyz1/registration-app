// src/pages/Register.js
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

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/login");
    } catch {
      setError("Registration failed. Username or email may already be taken.");
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
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: dark ? "#0f1117" : "#f3f4f8",
        display: "flex", alignItems: "center", justifyContent: "center",
        p: 2, position: "relative", overflow: "hidden",
      }}
    >
      <Box sx={{
        position: "absolute", top: "-10%", left: "-5%",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
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
              <Typography fontWeight={800} fontSize={18} lineHeight={1}>AdminPanel</Typography>
              <Typography fontSize={12} color="text.secondary">Enterprise Edition</Typography>
            </Box>
          </Box>

          <Typography variant="h5" fontWeight={800} mb={0.5}>Create account</Typography>
          <Typography color="text.secondary" fontSize={14} mb={3}>
            Get started with AdminPanel today
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px", fontSize: 13 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {[
              { label: "Username", value: username, setter: setUsername, type: "text", placeholder: "Choose a username" },
              { label: "Email Address", value: email, setter: setEmail, type: "email", placeholder: "Enter your email" },
            ].map(({ label, value, setter, type, placeholder }) => (
              <Box mb={2} key={label}>
                <Typography fontSize={13} fontWeight={700} mb={0.8}>{label}</Typography>
                <TextField
                  fullWidth size="small" type={type} placeholder={placeholder}
                  value={value} onChange={(e) => setter(e.target.value)}
                  required sx={inputSx}
                />
              </Box>
            ))}

            <Box mb={3}>
              <Typography fontSize={13} fontWeight={700} mb={0.8}>Password</Typography>
              <TextField
                fullWidth size="small"
                type={showPass ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required inputProps={{ maxLength: 72 }}
                helperText={<span style={{ fontSize: 11 }}>Maximum 72 characters</span>}
                sx={inputSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPass(!showPass)} edge="end" sx={{ color: "text.secondary" }}>
                        {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit" fullWidth variant="contained" disabled={loading}
              sx={{
                py: 1.3, borderRadius: "12px", fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg, #6366f1, #4f46e5)",
                boxShadow: "0 8px 20px rgba(99,102,241,0.35)", textTransform: "none",
                "&:hover": { background: "linear-gradient(135deg, #4f46e5, #4338ca)" },
                "&:disabled": { opacity: 0.7 },
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </Box>

          <Box textAlign="center" mt={2.5}>
            <Typography fontSize={13} color="text.secondary">
              Already have an account?{" "}
              <Link component={RouterLink} to="/login"
                sx={{ color: "#6366f1", fontWeight: 700, textDecoration: "none", "&:hover": { textDecoration: "underline" } }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}
