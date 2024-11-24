import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function Signup({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!email || !password || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/user", {
        method: "POST",
        body: JSON.stringify({
          username: email,
          password:password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 409) {
        alert("User already exists. Please log in.");
        navigate("/login");
      } else if (response.status === 201) {
        alert("Sign up successful!");
        if (onSignUp) onSignUp();
        navigate("/login");
      } else {
        alert(data.msg || "An error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to sign up. Please check your connection and try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
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
        <Typography component="h1" variant="h5">
          Create an Account
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={handleSubmit}>
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Link
              to="/login"
              style={{
                color: "#1976d2",
              }}
            >
              {"Already have an account? Log In"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
