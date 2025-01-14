import { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";

function App() {
  const TODO = "TODO";
  const DOING = "DOING";
  const DONE = "DONE";
  const [value, setValue] = useState("");
  const [task, setTask] = useState([]);
  const [dragTask, setDragTask] = useState(null);
  const [updateItem, setUpdateItem] = useState(null);

  // Fetch tasks from localStorage when the component mounts
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTask(JSON.parse(savedTasks)); // Set the state to the saved tasks
    }
  }, []);

  // Save tasks to localStorage whenever the task state changes
  useEffect(() => {
    if (task.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(task));
    }
  }, [task]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (updateItem) {
        const obj = {
          title: value,
          id: updateItem.id,
          status: updateItem.status,
        };
        const copyTask = [...task];
        const filterList = copyTask.filter((item) => item.id !== updateItem.id);
        setTask((preTask) => [...filterList, obj]);
        setUpdateItem(null);
      } else {
        const obj = {
          title: value,
          status: TODO,
          id: Date.now(),
        };
        setTask((preTask) => [...preTask, obj]);
      }
      setValue("");
    }
  };

  // This function helps to set the task that is being dragged
  const handleDrag = (e, tasks) => {
    setDragTask(tasks);
  };

  const handleDragNDrop = (status) => {
    const copyTask = [...task];
    const updatedTask = copyTask.map((item) => {
      if (item.id === dragTask.id) {
        item.status = status;
      }
      return item;
    });
    setTask(updatedTask);
    setDragTask(null);
  };

  // Handle the drop event by checking the status of the drop target
  const handleOnDrop = (e) => {
    const status = e.target.getAttribute("data-status");
    if (status) {
      handleDragNDrop(status);
    }
  };

  // Prevent the default behavior of drag over to allow dropping
  const handleOnDragOver = (e) => {
    e.preventDefault();
  };

  const updateItems = (tasks) => {
    setValue(tasks.title);
    setUpdateItem(tasks);
  };

  const handleDelete = (tasks) => {
    const copyTask = [...task];
    const updatedTask = copyTask.filter((item) => item.id !== tasks.id);
    setTask(updatedTask);
  };

  return (
    <div className="App">
      <header className="bg-blue-600 p-4 text-white text-center">
        <h1 className="text-3xl font-bold">Kanban Board</h1>
      </header>
      <main>
        <div className="flex flex-col p-2 justify-center items-center mb-2">
          <h1 className="text-2xl text-blue-400 font-bold">Task Manager</h1>
          <input
            type="text"
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type here to add task "
            className="border-2 mt-2 w-[50%] rounded-md border-blue-300 p-2 outline-blue-300"
          />
        </div>

        <div className="flex gap-2 w-[96%] mx-auto">
          {/* Todo field */}
          <div
            className="w-[33%]"
            onDrop={handleOnDrop}
            onDragOver={handleOnDragOver}
            data-status={TODO}
          >
            <div className="bg-blue-200 p-2 font-bold">
              <h1 className="flex justify-center">Todo</h1>
            </div>

            {task.length > 0 &&
              task.map(
                (tasks) =>
                  tasks.status === TODO && (
                    <div
                      key={tasks.id}
                      draggable
                      onDrag={(e) => handleDrag(e, tasks)}
                      className="transform shadow-xl flex-wrap scale-90 cursor-grab hover:transform hover:scale-100 w-full mx-auto flex items-center m-2 border-2 p-2 rounded-md border-blue-200 justify-between"
                    >
                      <p className="flex-grow break-words">{tasks.title}</p>
                      <div className="flex justify-between overflow-hidden">
                        <span
                          onClick={() => updateItems(tasks)}
                          className="p-2 hover:cursor-pointer hover:bg-green-400 hover:rounded-full "
                        >
                          <FaEdit />
                        </span>
                        <span
                          onClick={() => handleDelete(tasks)}
                          className="p-2 hover:cursor-pointer hover:bg-red-500 hover:rounded-full "
                        >
                          <RiDeleteBin6Fill />
                        </span>
                      </div>
                    </div>
                  )
              )}
          </div>

          {/* Doing field */}
          <div
            className="w-[33%]"
            data-status={DOING}
            onDrop={handleOnDrop}
            onDragOver={handleOnDragOver}
          >
            <div className="bg-blue-200 p-2 font-bold">
              <h1 className="flex justify-center">Progress</h1>
            </div>
            {task.length > 0 &&
              task.map(
                (tasks) =>
                  tasks.status === DOING && (
                    <div
                      key={tasks.id}
                      draggable
                      onDrag={(e) => handleDrag(e, tasks)}
                      className="transform shadow-xl flex-wrap scale-90 cursor-grab hover:transform hover:scale-100 w-full mx-auto flex items-center m-2 border-2 p-2 rounded-md border-blue-200 justify-between"
                    >
                      <p className="flex-grow break-words">{tasks.title}</p>
                      <div className="flex justify-between overflow-hidden">
                        <span
                          onClick={() => updateItems(tasks)}
                          className="p-2 hover:cursor-pointer hover:bg-green-400 hover:rounded-full "
                        >
                          <FaEdit />
                        </span>
                        <span
                          onClick={() => handleDelete(tasks)}
                          className="p-2 hover:cursor-pointer hover:bg-red-500 hover:rounded-full "
                        >
                          <RiDeleteBin6Fill />
                        </span>
                      </div>
                    </div>
                  )
              )}
          </div>

          {/* Done field */}
          <div
            className="w-[33%]"
            onDrop={handleOnDrop}
            onDragOver={handleOnDragOver}
            data-status={DONE}
          >
            <div className="bg-blue-200 p-2 font-bold">
              <h1 className="flex justify-center">Done</h1>
            </div>
            {task.length > 0 &&
              task.map(
                (tasks) =>
                  tasks.status === DONE && (
                    <div
                      key={tasks.id}
                      draggable
                      onDrag={(e) => handleDrag(e, tasks)}
                      className="transform shadow-xl flex-wrap scale-90 cursor-grab hover:transform hover:scale-100 w-full mx-auto flex items-center m-2 border-2 p-2 rounded-md border-blue-200 justify-between"
                    >
                      <p className="flex-grow break-words">{tasks.title}</p>
                      <div className="flex justify-between overflow-hidden">
                        <span
                          onClick={() => updateItems(tasks)}
                          className="p-2 hover:cursor-pointer hover:bg-green-400 hover:rounded-full "
                        >
                          <FaEdit />
                        </span>
                        <span
                          onClick={() => handleDelete(tasks)}
                          className="p-2 hover:cursor-pointer hover:bg-red-500 hover:rounded-full "
                        >
                          <RiDeleteBin6Fill />
                        </span>
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
