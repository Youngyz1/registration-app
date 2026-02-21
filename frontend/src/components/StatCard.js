// src/components/StatCard.js
import React from "react";
import { Card, CardContent, Typography, Box, Skeleton, useTheme } from "@mui/material";
import CountUp from "react-countup";
import { motion } from "framer-motion";

const gradients = {
  primary: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
  success: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  error: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
  warning: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
  info: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
};

const subtleBg = {
  primary: "rgba(99,102,241,0.08)",
  success: "rgba(16,185,129,0.08)",
  error: "rgba(239,68,68,0.08)",
  warning: "rgba(245,158,11,0.08)",
  info: "rgba(59,130,246,0.08)",
};

const textColors = {
  primary: "#6366f1",
  success: "#10b981",
  error: "#ef4444",
  warning: "#f59e0b",
  info: "#3b82f6",
};

export default function StatCard({
  title,
  value,
  color = "primary",
  icon,
  loading,
  children,
  onClick,
  subtitle,
  trend,
}) {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  if (loading) {
    return (
      <Card sx={{ borderRadius: "16px" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={40} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card
        onClick={onClick}
        sx={{
          cursor: onClick ? "pointer" : "default",
          borderRadius: "16px",
          overflow: "visible",
          position: "relative",
          border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
        }}
      >
        <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box>
              <Typography
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  fontSize: "2rem",
                  color: textColors[color] || textColors.primary,
                  lineHeight: 1,
                  mt: 0.5,
                }}
              >
                <CountUp end={value || 0} duration={1.4} separator="," />
              </Typography>
              {subtitle && (
                <Typography fontSize={12} color="text.secondary" mt={0.5}>
                  {subtitle}
                </Typography>
              )}
            </Box>

            {/* Icon bubble */}
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "14px",
                background: gradients[color] || gradients.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: `0 8px 20px ${textColors[color]}33`,
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>
          </Box>

          {/* Trend indicator */}
          {trend !== undefined && (
            <Box
              mt={1.5}
              display="flex"
              alignItems="center"
              gap={0.5}
              sx={{
                pt: 1.5,
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
              }}
            >
              <Typography
                fontSize={12}
                fontWeight={700}
                color={trend >= 0 ? "#10b981" : "#ef4444"}
              >
                {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                vs last month
              </Typography>
            </Box>
          )}

          {children && <Box mt={1.5}>{children}</Box>}
        </CardContent>
      </Card>
    </motion.div>
  );
}
