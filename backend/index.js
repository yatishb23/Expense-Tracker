const express = require("express");
const cors = require("cors");
const Users = require("./db");
const createUser = require("./middleware/createUser");
const app = express();

app.use(cors({
  origin: '',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true,
}));

app.use(express.json());

const PORT = 4000;

app.get("/", (req, res) => {
  return res.json({
    msg: "Hello world"
  });
})

app.post("/user", async (req, res) => {
  const createPayload = req.body;
  
  console.log(createPayload);
  const parsePayload = createUser.createUser.safeParse(createPayload);
  if (!parsePayload.success) {
    return res.status(400).json({
      msg: "Invalid payload"
    });
  }

  try {
    const existingUser = await Users.Users.findOne({
      username: createPayload.username,
    });
    if (existingUser) {
      return res.status(409).json({ msg: "Username already exists" });
    }

    await Users.Users.create({
      username: createPayload.username,
      password: createPayload.password,
    });

    return res.status(201).json({ msg: "Sign-in Successful" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.get("/userExpenses/:username",async function(req,res){
  const username=req.params.username;
  try {
    const expenses = await Users.Expenses.find({ username: username });

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found for this user' });
    }

    res.json({ expenses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

app.delete("/expenses/:id" ,async function(req,res){
  const id = req.params.id; 
  try {
    await Users.Expenses.deleteOne({ expenseId: id }); 
    res.status(200).send({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to delete expense' });
  }
})

app.post("/expenses", async (req, res) => {
    try {
      const createPayload = req.body;
  
      await Users.Expenses.create({
        username: createPayload.username, 
        expenseId:createPayload.expenseId,
        description: createPayload.description,
        date: createPayload.date, 
        amount: createPayload.amount,
      });
      
      res.status(201).json({ message: "Expense added successfully" });
    } catch (error) {
      console.error("Error adding expense:", error);
      res.status(500).json({ message: "An error occurred while adding the expense" });
    }
  });
  


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
