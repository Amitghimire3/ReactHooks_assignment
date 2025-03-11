import React, { useReducer, useMemo, useRef, useEffect, useContext, useCallback } from "react";
import ThemeContext from "./ThemeContext"; // Import the context for theme

// Define initial state for tasks
const initialState = {
  tasks: [],
  filter: "all", // 'all', 'completed', or 'incomplete'
};

// Define actions
const ADD_TASK = "ADD_TASK";
const DELETE_TASK = "DELETE_TASK";
const UPDATE_TASK = "UPDATE_TASK";
const TOGGLE_COMPLETED = "TOGGLE_COMPLETED"; // Action for toggling task completion
const SET_FILTER = "SET_FILTER";

// Reducer function to manage tasks state
function taskReducer(state, action) {
  switch (action.type) {
    case ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case DELETE_TASK:
      console.log("Deleting task with ID:", action.payload); // Log task ID being deleted
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload.updates } : task
        ),
      };
    case TOGGLE_COMPLETED:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload ? { ...task, completed: !task.completed } : task
        ),
      };
    case SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };
    default:
      return state;
  }
}

function TaskManager() {
  // Use useReducer instead of useState
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { tasks, filter } = state;

  const { theme, toggleTheme } = useContext(ThemeContext);  // Use theme context

  // useRef to store reference to task input field
  const taskInputRef = useRef(null);

  const [task, setTask] = React.useState("");  // Local state for task title input
  const [description, setDescription] = React.useState("");  // Local state for description input

  // Focus on the task input field when the component mounts
  useEffect(() => {
    if (taskInputRef.current) {
      taskInputRef.current.focus();
    }
  }, []);

  // Add Task
  const handleAddTask = useCallback(() => {
    if (task.trim() === "" || description.trim() === "") {
      alert("Both Task Title and Description are required!");
      return;
    }

    const newTask = { id: Date.now(), title: task, description, completed: false };
    dispatch({ type: ADD_TASK, payload: newTask });

    setTask("");
    setDescription("");
  }, [task, description]); // Re-create the function only when task or description change

  // Delete Task with logging
  const handleDeleteTask = useCallback((id) => {
    console.log("Deleting task with ID:", id); // Log task ID before dispatching delete
    dispatch({ type: DELETE_TASK, payload: id });
  }, []); // Function will be memoized and only re-created when necessary

  // Toggle Task Completion
  const handleToggleCompletion = useCallback((id) => {
    dispatch({ type: TOGGLE_COMPLETED, payload: id });
  }, []); // Function will be memoized and only re-created when necessary

  // Update Task
  const handleUpdateTask = useCallback((id, updatedDescription) => {
    dispatch({
      type: UPDATE_TASK,
      payload: {
        id,
        updates: { description: updatedDescription },
      },
    });
  }, []); // Function will be memoized and only re-created when necessary

  // Set Filter
  const handleFilterChange = (filterValue) => {
    dispatch({ type: SET_FILTER, payload: filterValue });
  };

  // Optimize task filtering using useMemo
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "completed":
        return tasks.filter((task) => task.completed);
      case "incomplete":
        return tasks.filter((task) => !task.completed);
      default:
        return tasks; // Show all tasks
    }
  }, [tasks, filter]); // Recompute only when tasks or filter change

  return (
    <div className={theme === "dark" ? "dark-theme" : "light-theme"}>
      <h2>Task Manager</h2>

      <input
        ref={taskInputRef}
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter task title"
        className="task-input"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description"
        className="task-input"
      />
      <button onClick={handleAddTask}>Add Task</button>

      {/* Filter Buttons */}
      <button onClick={() => handleFilterChange("all")}>Show All</button>
      <button onClick={() => handleFilterChange("completed")}>Show Completed</button>
      <button onClick={() => handleFilterChange("incomplete")}>Show Incomplete</button>

      {/* Theme Toggle Button */}
      <button onClick={toggleTheme}>Switch to {theme === "light" ? "Dark" : "Light"} Mode</button>

      <ul>
        {filteredTasks.map((t) => (
          <li
            key={t.id}
            className={t.completed ? "completed" : "incomplete"} // Apply completed or incomplete class
          >
            <strong>{t.title}</strong> - {t.description}
            <button onClick={() => handleToggleCompletion(t.id)}>
              {t.completed ? "Mark as Incomplete" : "Mark as Completed"}
            </button>
            <button onClick={() => handleDeleteTask(t.id)}>Delete</button>
            <button onClick={() => handleUpdateTask(t.id, "Updated description")}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
// end of code