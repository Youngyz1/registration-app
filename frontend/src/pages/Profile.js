// src/pages/Profile.js
import React from "react";
import { Box, Typography, Card, CardContent, Avatar, useTheme } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  return (
    <Box maxWidth={480}>
      <Typography variant="h4" fontWeight={800} mb={3}>Profile</Typography>

      <Card sx={{ borderRadius: "16px" }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              sx={{
                width: 56, height: 56,
                bgcolor: "#6366f1",
                fontSize: 22, fontWeight: 700,
              }}
            >
              {user?.username?.[0]?.toUpperCase() || "A"}
            </Avatar>
            <Box>
              <Typography fontWeight={700} fontSize={16}>{user?.username}</Typography>
              <Typography fontSize={13} color="text.secondary">{user?.email}</Typography>
            </Box>
          </Box>

          <Box sx={{ borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`, pt: 2 }}>
            <Typography fontSize={12} color="text.secondary" fontWeight={700} mb={0.5}>ROLE</Typography>
            <Typography fontSize={14}>Administrator</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}