// src/pages/Settings.js
import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, TextField, Button,
  Switch, FormControlLabel, Divider, Grid, useTheme, Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { useThemeMode } from "../contexts/ThemeContext";

const SectionCard = ({ title, description, children }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  return (
    <Card sx={{ borderRadius: "16px", mb: 2.5 }}>
      <CardContent sx={{ p: 3 }}>
        <Box mb={2.5}>
          <Typography fontWeight={700} fontSize={15}>{title}</Typography>
          {description && (
            <Typography fontSize={13} color="text.secondary" mt={0.3}>{description}</Typography>
          )}
        </Box>
        <Divider sx={{ mb: 2.5, borderColor: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)" }} />
        {children}
      </CardContent>
    </Card>
  );
};

export default function Settings() {
  const { toggleDark, isDark } = useThemeMode();
  const [saved, setSaved] = useState(false);
  const theme = useTheme();

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px", fontSize: 14,
      bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "#f8f9fc",
      "& fieldset": { borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
      "&:hover fieldset": { borderColor: "#6366f1" },
      "&.Mui-focused fieldset": { borderColor: "#6366f1" },
    },
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box maxWidth={720}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box mb={3}>
          <Typography variant="h4" fontWeight={800}>Settings</Typography>
          <Typography color="text.secondary" fontSize={14} mt={0.5}>
            Manage your account and application preferences
          </Typography>
        </Box>

        {saved && (
          <Alert severity="success" sx={{ mb: 2.5, borderRadius: "10px", fontSize: 13 }}>
            Settings saved successfully!
          </Alert>
        )}

        {/* Appearance */}
        <SectionCard title="Appearance" description="Customize how the dashboard looks">
          <FormControlLabel
            control={
              <Switch
                checked={isDark}
                onChange={toggleDark}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#6366f1" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#6366f1" },
                }}
              />
            }
            label={
              <Box>
                <Typography fontSize={14} fontWeight={600}>Dark Mode</Typography>
                <Typography fontSize={12} color="text.secondary">Switch between light and dark theme</Typography>
              </Box>
            }
          />
        </SectionCard>

        {/* Profile */}
        <SectionCard title="Profile Information" description="Update your personal details">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography fontSize={13} fontWeight={700} mb={0.8}>Display Name</Typography>
              <TextField fullWidth size="small" placeholder="Your display name" sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontSize={13} fontWeight={700} mb={0.8}>Email Address</Typography>
              <TextField fullWidth size="small" placeholder="your@email.com" type="email" sx={inputSx} />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Security */}
        <SectionCard title="Security" description="Manage your password and authentication">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography fontSize={13} fontWeight={700} mb={0.8}>Current Password</Typography>
              <TextField fullWidth size="small" type="password" placeholder="••••••••" sx={inputSx} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography fontSize={13} fontWeight={700} mb={0.8}>New Password</Typography>
              <TextField fullWidth size="small" type="password" placeholder="••••••••" sx={inputSx} />
            </Grid>
          </Grid>
        </SectionCard>

        {/* Notifications */}
        <SectionCard title="Notifications" description="Configure your notification preferences">
          {[
            { label: "New user registrations", desc: "Get notified when a new user signs up" },
            { label: "System alerts", desc: "Receive alerts about system status changes" },
            { label: "Weekly reports", desc: "Receive a summary report every Monday" },
          ].map((item) => (
            <Box key={item.label} mb={1.5}>
              <FormControlLabel
                control={
                  <Switch
                    defaultChecked
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#6366f1" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#6366f1" },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography fontSize={14} fontWeight={600}>{item.label}</Typography>
                    <Typography fontSize={12} color="text.secondary">{item.desc}</Typography>
                  </Box>
                }
              />
            </Box>
          ))}
        </SectionCard>

        <Box display="flex" gap={1.5}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              borderRadius: "10px", fontWeight: 700, px: 3,
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 6px 16px rgba(99,102,241,0.3)",
              textTransform: "none",
              "&:hover": { background: "linear-gradient(135deg, #4f46e5, #4338ca)" },
            }}
          >
            Save Changes
          </Button>
          <Button
            variant="outlined"
            sx={{
              borderRadius: "10px", fontWeight: 700, px: 3,
              borderColor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)",
              color: "text.secondary", textTransform: "none",
              "&:hover": { borderColor: "#6366f1", color: "#6366f1" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}
