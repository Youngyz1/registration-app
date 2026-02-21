// src/pages/Users.js
import React, { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Chip, CircularProgress,
  TextField, InputAdornment, Select, MenuItem, FormControl,
  Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, TablePagination, Avatar, useTheme, Grid, Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { motion } from "framer-motion";
import UserGrowthChart from "../components/UserGrowthChart";
import StatCard from "../components/StatCard";
import api from "../api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;
  const theme = useTheme();
  const dark = theme.palette.mode === "dark";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users");
        const usersData = response.data.map((user) => ({
          ...user,
          is_active: user.is_active !== undefined ? user.is_active : true,
        }));
        usersData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setUsers(usersData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
  const activeCount = users.filter((u) => u.is_active).length;
  const inactiveCount = users.length - activeCount;

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: "#6366f1" }} />
      </Box>
    );

  return (
    <Box>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Box mb={3}>
          <Typography variant="h4" fontWeight={800}>Users</Typography>
          <Typography color="text.secondary" fontSize={14} mt={0.5}>
            Manage and monitor all registered users
          </Typography>
        </Box>
      </motion.div>

      {/* Quick stats */}
      <Grid container spacing={2.5} mb={3}>
        <Grid item xs={12} sm={4}>
          <StatCard title="Total Users" value={users.length} icon="👥" color="primary" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Active" value={activeCount} icon="✅" color="success" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard title="Inactive" value={inactiveCount} icon="⛔" color="error" />
        </Grid>
      </Grid>

      {/* Growth Chart */}
      <Box mb={3}>
        <UserGrowthChart users={users} />
      </Box>

      {/* Users Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        <Card sx={{ borderRadius: "16px" }}>
          <CardContent sx={{ p: 2.5, "&:last-child": { pb: 0 } }}>
            {/* Toolbar */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              gap={1.5}
              mb={2.5}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>All Users</Typography>
                <Typography fontSize={12} color="text.secondary">
                  {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                </Typography>
              </Box>

              <Box display="flex" gap={1.5} flexWrap="wrap">
                <TextField
                  size="small"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                  sx={{
                    width: 240,
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
                <FormControl size="small">
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
                    {["#", "User", "Email", "Status", "Joined"].map((h) => (
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
                  {paginated.map((user, idx) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        "&:hover": { bgcolor: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" },
                        transition: "background 0.15s",
                        "& td": { border: "none", py: 1.5 },
                      }}
                    >
                      <TableCell>
                        <Typography fontSize={12} color="text.secondary" fontWeight={600}>
                          {page * rowsPerPage + idx + 1}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            sx={{
                              width: 34, height: 34,
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

                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 5, border: "none" }}>
                        <Typography color="text.secondary" fontSize={14}>
                          No users match your search
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
