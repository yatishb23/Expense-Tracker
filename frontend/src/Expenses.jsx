import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  AppBar,
  Toolbar,
} from "@mui/material";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar } from "react-chartjs-2";
import { Add, Delete } from "@mui/icons-material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

export default function Expenses() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); 
  const username = searchParams.get("username");
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!username) return;

    fetch(`http://localhost:4000/userExpenses?username=${username}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch expenses");
        }
        const json = await res.json();
        setExpenses(json.expenses || []);
      })
      .catch((error) => {
        console.error("Error fetching expenses:", error);
      });
  }, [username]);

  const addExpense = (e) => {
    e.preventDefault();
    if (description && amount && date) {
      const newExpense = {
        expenseId: uuidv4(),
        username: username,
        description,
        amount: parseFloat(amount),
        date: new Date(date),
      };
      setExpenses([...expenses, newExpense]);
      setDescription("");
      setAmount("");
      setDate("");
      fetch("http://localhost:4000/expenses", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          expenseId: newExpense.expenseId,
          description: newExpense.description,
          amount: newExpense.amount,
          date: new Date(date).toISOString(),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter((expense) => expense.expenseId !== id));

    fetch(`http://localhost:4000/expenses/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete expense");
        }
      })
      .catch((error) => {
        console.error("Error deleting expense:", error);
      });
  };

  const logout = () => {
    navigate("/login"); 
  };

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  return (
    <Box maxWidth="lg" mx="auto" p={3}>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Expense Tracker
          </Typography>
          <Typography variant="body1" sx={{ marginRight: 2 }}>
            {username}
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <form onSubmit={addExpense}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<Add />}
              >
                Add Expense
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
        <Typography variant="h6">Total Expenses</Typography>
        <Typography variant="h4" color="primary">
          ₹ {totalExpenses.toFixed(2)}
        </Typography>
      </Paper>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.expenseId}>
                <TableCell>{expense.description}</TableCell>
                <TableCell>
                  {new Date(expense.date).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  ₹{expense.amount.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="error"
                    onClick={() => removeExpense(expense.expenseId)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper elevation={3} sx={{ marginTop: 4, padding: 2, marginBottom: 4 }}>
        <Bar
          data={{
            labels: expenses.map((expense) =>
              new Date(expense.date).toLocaleString("default", { month: "long" })
            ),
            datasets: [
              {
                label: "Expenses",
                data: expenses.map((expense) => expense.amount),
              },
            ],
          }}
        />
      </Paper>
    </Box>
  );
}
