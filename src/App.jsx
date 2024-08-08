import { useState, useEffect } from "react";
import Logo from "./assets/Logo.png";
import ClipBoard from "./assets/Clipboard.png";
import plus from "./assets/plus.png";
import trash from "./assets/trash.png";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    fetch("http://localhost:3500/todos")
      .then((response) => response.json())
      .then((data) => setTasks(data));
  }, []);

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        title: newTask,
        completed: false,
      };

      fetch("http://localhost:3500/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskObj),
      })
        .then((response) => response.json())
        .then((task) => {
          setTasks([...tasks, task]);
          setNewTask("");
        });
    }
  };

  const handleCompleteTask = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const completedTask = updatedTasks.find((task) => task.id === id);

    fetch(`http://localhost:3500/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completedTask),
    });
  };

  const handleDeleteTask = (id) => {
    fetch(`http://localhost:3500/todos/${id}`, {
      method: "DELETE",
    }).then(() => {
      const updatedTasks = tasks.filter((task) => task.id !== id);
      setTasks(updatedTasks);
    });
  };

  const handleInputChange = (e) => {
    setNewTask(e.target.value);
  };

  return (
    <>
      <header className='header'>
        <img src={Logo} alt='logo' className='logo' />
      </header>
      <main>
        <div className='InputDiv'>
          <input
            type='text'
            placeholder='Add a new task'
            value={newTask}
            onChange={handleInputChange}
          />
          <button type='button' onClick={handleAddTask}>
            Add <img src={plus} alt='Plus Img' />
          </button>
        </div>
        <div className='Tasks'>
          <div className='TasksCreated'>
            <p className='PCreated'>Tasks Created</p>
            <p>{tasks.length}</p>
          </div>
          <div className='TasksComplete'>
            <p className='PDone'>Tasks Completed</p>
            <p>
              {tasks.filter((task) => task.completed).length} out of{" "}
              {tasks.length}
            </p>
          </div>
        </div>
        {tasks.length === 0 ? (
          <div className='NoTaskDiv'>
            <img src={ClipBoard} alt='' />
            <p className='NoTask'>
              You don't have any tasks registered yet. Create tasks and organize
              your to-do items.
            </p>
          </div>
        ) : (
          <div className='TaskList'>
            {tasks.map((task) => (
              <div key={task.id} className='TaskItem'>
                <div className='TaskContent'>
                  <span className={task.completed ? "completed" : "notCompleted"}>
                    {task.title}
                  </span>{" "}
                  <input
                    className='Checked'
                    type='checkbox'
                    checked={task.completed}
                    onChange={() => handleCompleteTask(task.id)}
                  />
                </div>
                <img
                  src={trash}
                  alt='Delete'
                  className='DeleteButton'
                  onClick={() => handleDeleteTask(task.id)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default App;
