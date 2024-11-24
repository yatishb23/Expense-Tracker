import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Expenses from "./Expenses";

export default function App() {

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/expenses" element={<Expenses/>}/>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
