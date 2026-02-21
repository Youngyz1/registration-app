// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Grid, Box, Typography, Card, CardContent, Chip,
  TextField, InputAdornment, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Select, MenuItem, FormControl,
  useTheme, Skeleton, Avatar,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  PieChart, Pie, Cell, Legend, Tooltip as ReTooltip,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import StatCard from "../components/StatCard";
import UserGrowthChart from "../components/UserGrowthChart";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [inactiveUsers, setInactiveUsers] = useState(0);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const rowsPerPage = 6;

  // Wait for auth to resolve before doing anything
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) return;

    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        const usersData = response.data.map((u) => ({
          ...u,
          is_active: u.is_active !== undefined ? u.is_active : true,
        }));
        setUsers(usersData);
        setTotalUsers(usersData.length);
        const activeCount = usersData.filter((u) => u.is_active).length;
        setActiveUsers(activeCount);
        setInactiveUsers(usersData.length - activeCount);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [authLoading, isAuthenticated]);

  // While auth is still checking, show nothing (prevents flicker/redirect)
  if (authLoading) return null;

  // Not logged in → go to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Filtered table data
  const filtered = users.filter((u) => {
    const matchSearch =
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.is_active) ||
      (statusFilter === "inactive" && !u.is_active);
    return matchSearch && matchStatus;
  });
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const pieData = [
    { name: "Active", value: activeUsers },
    { name: "Inactive", value: inactiveUsers },
  ];
  const PIE_COLORS = ["#6366f1", "#ef4444"];

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayData = dayLabels.map((day) => ({ day, count: 0 }));
  users.forEach((u) => {
    const d = new Date(u.created_at).getDay();
    dayData[d].count += 1;
  });

  const gridColor = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  const axisColor = dark ? "rgba(255,255,255,0.3)" : "#94a3b8";

  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <Box sx={{
        bgcolor: dark ? "#1e2235" : "#fff",
        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: "10px", px: 2, py: 1.5,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      }}>
        <Typography fontSize={13} fontWeight={700} color={payload[0].payload.fill}>
          {payload[0].name}: {payload[0].value}
        </Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Page Header */}
      <motion.div {...fadeUp(0)}>
        <Box mb={3} display="flex" alignItems="flex-end" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight={800}>Dashboard</Typography>
            <Typography color="text.secondary" fontSize={14} mt={0.5}>
              Welcome back — here's what's happening today.
            </Typography>
          </Box>
          <Chip
            label="Live"
            size="small"
            sx={{
              bgcolor: "rgba(16,185,129,0.12)",
              color: "#10b981",
              fontWeight: 700,
              fontSize: 11,
              "& .MuiChip-label": { px: 1.5 },
            }}
          />
        </Box>
      </motion.div>

      {/* Stat Cards */}
      <Grid container spacing={2.5} mb={3}>
        {[
          {
            title: "Total Users",
            value: totalUsers,
            icon: "👥",
            color: "primary",
            subtitle: "Registered accounts",
            onClick: () => navigate("/users"),
          },
          {
            title: "Active Users",
            value: activeUsers,
            icon: "✅",
            color: "success",
            subtitle: "Currently active",
            trend: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
          },
          {
            title: "Inactive Users",
            value: inactiveUsers,
            icon: "⛔",
            color: "error",
            subtitle: "Pending activation",
          },
        ].map((card, i) => (
          <Grid item xs={12} md={4} key={card.title}>
            <motion.div {...fadeUp(i * 0.08)}>
              <StatCard {...card} loading={loading} />
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} md={8}>
          <motion.div {...fadeUp(0.15)} style={{ height: "100%" }}>
            <UserGrowthChart users={users} />
          </motion.div>
        </Grid>

        <Grid item xs={12} md={4}>
          <motion.div {...fadeUp(0.2)}>
            <Card sx={{ borderRadius: "16px", height: "100%" }}>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Typography variant="h6" fontWeight={700} mb={0.5}>User Status</Typography>
                <Typography fontSize={12} color="text.secondary" mb={1}>
                  Active vs Inactive breakdown
                </Typography>

                {loading ? (
                  <Skeleton variant="circular" width={180} height={180} sx={{ mx: "auto", mt: 2 }} />
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={4}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />
                        ))}
                      </Pie>
                      <ReTooltip content={<CustomPieTooltip />} />
                      <Legend
                        formatter={(val) => (
                          <span style={{ fontSize: 12, fontWeight: 600, color: theme.palette.text.secondary }}>
                            {val}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}

                <Box display="flex" gap={1} mt={1}>
                  {[
                    { label: "Active", value: activeUsers, color: "#6366f1" },
                    { label: "Inactive", value: inactiveUsers, color: "#ef4444" },
                  ].map((s) => (
                    <Box
                      key={s.label}
                      flex={1}
                      sx={{
                        textAlign: "center",
                        bgcolor: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        borderRadius: "10px",
                        py: 1,
                      }}
                    >
                      <Typography fontSize={18} fontWeight={800} color={s.color}>
                        {s.value}
                      </Typography>
                      <Typography fontSize={11} color="text.secondary" fontWeight={600}>
                        {s.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Signups by Day */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12}>
          <motion.div {...fadeUp(0.25)}>
            <Card sx={{ borderRadius: "16px" }}>
              <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
                <Box mb={2}>
                  <Typography variant="h6" fontWeight={700}>Signups by Day of Week</Typography>
                  <Typography fontSize={12} color="text.secondary">
                    Which days users register most
                  </Typography>
                </Box>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={dayData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="day" stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis stroke={axisColor} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <ReTooltip
                      formatter={(v) => [v, "signups"]}
                      contentStyle={{
                        borderRadius: 10,
                        border: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                        background: dark ? "#1e2235" : "#fff",
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Users Table */}
      <motion.div {...fadeUp(0.3)}>
        <Card sx={{ borderRadius: "16px" }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 0 } }}>
            <Box
              display="flex" alignItems="center" justifyContent="space-between"
              flexWrap="wrap" gap={1.5} mb={2}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>Recent Users</Typography>
                <Typography fontSize={12} color="text.secondary">
                  {filtered.length} user{filtered.length !== 1 ? "s" : ""} found
                </Typography>
              </Box>

              <Box display="flex" gap={1.5} flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  sx={{
                    width: 200,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "10px", fontSize: 13,
                      bgcolor: dark ? "rgba(255,255,255,0.04)" : "#f8f9fc",
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <Select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
                    sx={{
                      borderRadius: "10px", fontSize: 13,
                      bgcolor: dark ? "rgba(255,255,255,0.04)" : "#f8f9fc",
                    }}
                  >
                    <MenuItem value="all" sx={{ fontSize: 13 }}>All Status</MenuItem>
                    <MenuItem value="active" sx={{ fontSize: 13 }}>Active</MenuItem>
                    <MenuItem value="inactive" sx={{ fontSize: 13 }}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ "& th": { borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` } }}>
                    {["User", "Email", "Status", "Joined"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          fontSize: 11, fontWeight: 700, letterSpacing: "0.07em",
                          textTransform: "uppercase", color: "text.secondary",
                          py: 1.5, bgcolor: "transparent",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          {[1, 2, 3, 4].map((c) => (
                            <TableCell key={c}><Skeleton height={24} /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    : paginated.map((user) => (
                        <TableRow
                          key={user.id}
                          sx={{
                            "&:hover": { bgcolor: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" },
                            transition: "background 0.15s",
                            "& td": { border: "none", py: 1.5 },
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1.5}>
                              <Avatar
                                sx={{
                                  width: 32, height: 32,
                                  bgcolor: `hsl(${(user.username?.charCodeAt(0) || 0) * 47 % 360}, 65%, 55%)`,
                                  fontSize: 13, fontWeight: 700,
                                }}
                              >
                                {user.username?.[0]?.toUpperCase()}
                              </Avatar>
                              <Typography fontSize={14} fontWeight={600}>
                                {user.username}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                            <Typography fontSize={13} color="text.secondary">
                              {user.email}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Chip
                              label={user.is_active ? "Active" : "Inactive"}
                              size="small"
                              icon={
                                user.is_active
                                  ? <CheckCircleIcon sx={{ fontSize: "14px !important" }} />
                                  : <CancelIcon sx={{ fontSize: "14px !important" }} />
                              }
                              sx={{
                                fontSize: 11, fontWeight: 700, height: 24,
                                bgcolor: user.is_active ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                                color: user.is_active ? "#10b981" : "#ef4444",
                                "& .MuiChip-icon": {
                                  color: user.is_active ? "#10b981" : "#ef4444", ml: 0.5,
                                },
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Typography fontSize={13} color="text.secondary">
                              {new Date(user.created_at).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}

                  {!loading && paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4, border: "none" }}>
                        <Typography color="text.secondary" fontSize={14}>
                          No users match your filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={filtered.length}
              page={page}
              onPageChange={(_, p) => setPage(p)}
              rowsPerPage={rowsPerPage}
              rowsPerPageOptions={[]}
              sx={{
                borderTop: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
                "& .MuiTablePagination-displayedRows": { fontSize: 12 },
              }}
            />
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}