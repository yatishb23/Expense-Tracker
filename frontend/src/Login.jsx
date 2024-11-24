import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error("Both email and password are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/user", {
        method: "POST",
        body: JSON.stringify({ username: email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200 || response.status === 409) {
        toast.success("Login successful!");
        if (onLogin) onLogin();
        setTimeout(() => {
          navigate(`/expenses?username=${email}`);
        }, 1500); 
      } else if (response.status === 401) {
        toast.error("Incorrect email or password.");
      } else {
        toast.error(data.msg || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to login. Please check your connection and try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <ToastContainer position="top-right" autoClose={2000} />
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <LockOutlined
          sx={{
            m: 1,
            bgcolor: "secondary.main",
            padding: 1,
            borderRadius: "50%",
            color: "white",
          }}
        />
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link
              to="/signup"
              variant="body2"
              style={{
                color: "#1976d2",
              }}
            >
              {"Don't have an account? Create one"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
