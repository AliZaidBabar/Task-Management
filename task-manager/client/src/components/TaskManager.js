import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskUploadForm from './TaskUploadForm';
import { RiEdit2Line, RiDeleteBin2Line } from 'react-icons/ri';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [uploadFormVisible, setUploadFormVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [editedStatus, setEditedStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');


  // Fetch tasks function

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token'); // Get the JWT token from local storage
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: {
          Authorization: `Bearer ${token}` // Send the token in the Authorization header
        }
      });
      setTasks(response.data.tasks);
    } catch (error) {
      setError('Error fetching tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
    const name = localStorage.getItem('username'); // Retrieve user's name from local storage
    const role = localStorage.getItem('role'); // Retrieve user's role from local storage
    setUserName(name);
    setUserRole(role);
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedStatus(task.status);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${editingTask._id}`,
        {
          title: editedTitle,
          description: editedDescription,
          status: editedStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Error updating task');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Error deleting task');
    }
  };

  const handleUploadFormCancel = () => {
    setUploadFormVisible(false);
  };
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    localStorage.removeItem('username'); // Remove username from local storage
    localStorage.removeItem('role'); // Remove role from local storage
    window.location.href = '/login'; // Redirect to the login page
};

  // Filter tasks by title
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

    // Function to handle task upload
    const handleTaskUpload = () => {
      setUploadFormVisible(true);
    };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-bold">Task Management System</h2>
          <button
            onClick={handleLogout}
            className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>


        <h1 className="text-2xl font-bold text-center mb-4">
          Welcome {userName} <span className='text-xl font-semibold '>({userRole})</span>
        </h1>

        <div className="flex justify-between mb-4">
          <div className="w-1/4">
            <input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            {localStorage.getItem('role') === 'admin' && (
              <button
                onClick={handleTaskUpload}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
              >
                Upload Task
              </button>
            )}
            {uploadFormVisible && (
              <TaskUploadForm
                onUpload={() => {
                  setUploadFormVisible(false);
                  fetchTasks();
                }}
                onCancel={handleUploadFormCancel}
              />
            )}
          </div>
        </div>


        <div>



          {filteredTasks.length === 0 ? (
            <p className="text-center">No tasks</p>
          ) : (
            <ul>
              {filteredTasks.map((task) => (
                <li key={task._id} className="bg-white shadow-md rounded-lg p-4 mb-4 transition duration-300 ease-in-out hover:shadow-lg">
                  {editingTask && editingTask._id === task._id ? (
                    <div>
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        className="w-full mb-2 px-3 py-1 border rounded-lg focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        className="w-full mb-2 px-3 py-1 border rounded-lg focus:outline-none focus:border-blue-500"
                      ></textarea>
                      <select
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        className="w-full mb-2 px-3 py-1 border rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                      <button
                        onClick={handleUpdate}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mr-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditingTask(null)}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold">{task.title}</h3>
                      <p className="mb-2">{task.description}</p>
                      <p className="mb-2">Status: {task.status}</p>
                      {localStorage.getItem('role') === 'admin' && (
                        <div>
                          <button
                            onClick={() => handleEdit(task)}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out mr-2"
                          >
                            <RiEdit2Line className="inline-block mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                          >
                            <RiDeleteBin2Line className="inline-block mr-1" /> Delete
                          </button>
                        </div>
                      )}
                      {localStorage.getItem('role') === 'manager' && (
                        <button
                          onClick={() => handleEdit(task)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                        >
                          <RiEdit2Line className="inline-block mr-1" /> Edit
                        </button>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
