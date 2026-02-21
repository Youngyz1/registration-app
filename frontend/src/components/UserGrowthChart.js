// src/components/UserGrowthChart.js
import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, Typography, Box, ToggleButtonGroup, ToggleButton, useTheme } from "@mui/material";

const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";
  if (!active || !payload?.length) return null;
  return (
    <Box
      sx={{
        bgcolor: dark ? "#1e2235" : "#fff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: "10px",
        px: 2,
        py: 1.5,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}
    >
      <Typography fontSize={12} fontWeight={700} color="text.secondary" mb={0.5}>
        {label}
      </Typography>
      {payload.map((p) => (
        <Typography key={p.name} fontSize={14} fontWeight={700} color="#6366f1">
          {p.value} users
        </Typography>
      ))}
    </Box>
  );
};

export default function UserGrowthChart({ users }) {
  const [chartType, setChartType] = useState("area");
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const grouped = {};
  (users || []).forEach((user) => {
    const date = new Date(user.created_at);
    const month = date.toLocaleString("default", { month: "short", year: "2-digit" });
    grouped[month] = (grouped[month] || 0) + 1;
  });

  const chartData = Object.keys(grouped).map((month) => ({
    month,
    users: grouped[month],
  }));

  const gridColor = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const axisColor = dark ? "rgba(255,255,255,0.3)" : "#94a3b8";

  return (
    <Card sx={{ borderRadius: "16px", height: "100%" }}>
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              User Growth
            </Typography>
            <Typography fontSize={12} color="text.secondary">
              New registrations over time
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={chartType}
            exclusive
            onChange={(_, v) => v && setChartType(v)}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                fontSize: 11,
                fontWeight: 700,
                px: 1.5,
                py: 0.4,
                border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                color: "text.secondary",
                "&.Mui-selected": {
                  bgcolor: "#6366f1",
                  color: "#fff",
                  "&:hover": { bgcolor: "#4f46e5" },
                },
              },
            }}
          >
            <ToggleButton value="area">Area</ToggleButton>
            <ToggleButton value="bar">Bar</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <ResponsiveContainer width="100%" height={260}>
          {chartType === "area" ? (
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                stroke="#6366f1"
                fill="url(#colorUsers)"
                strokeWidth={2.5}
                dot={{ fill: "#6366f1", r: 4, strokeWidth: 2, stroke: dark ? "#1a1d27" : "#fff" }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={40} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
