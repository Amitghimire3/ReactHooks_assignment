import React from "react";
import './App.css';
import TaskManager from "./TaskManager";
import { ThemeProvider } from "./ThemeContext";  // Import ThemeProvider

function App() {
  return (
    <ThemeProvider>
      <div>
        <h1>React Task Manager</h1>
        <TaskManager />
      </div>
    </ThemeProvider>
  );
}

export default App;