import React, { useState } from 'react';
import axios from 'axios';
import { RiUpload2Line } from 'react-icons/ri'; // Import upload icon from react-icons

const TaskUploadForm = ({ onUpload, onCancel }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('To Do');
    const [error, setError] = useState('');

    const handleUpload = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');

            const response = await axios.post(
                'http://localhost:5000/api/tasks',
                {
                    title,
                    description,
                    status
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log('API request successful:', response.data);

            setTitle('');
            setDescription('');
            setStatus('To Do');
            setError('');

            if (typeof onUpload === 'function') {
                onUpload();
            }
        } catch (error) {
            console.error('Error uploading task:', error);
            setError('Error uploading task');
        }
    };

    const handleCancel = () => {
        if (typeof onCancel === 'function') {
            onCancel();
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Upload Task</h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleUpload}>
                <div className="mb-4">
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="Title" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                    />
                </div>
                <div className="mb-4">
                    <textarea 
                        name="description" 
                        placeholder="Description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                    ></textarea>
                </div>
                <div className="mb-4">
                    <select 
                        name="status" 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)} 
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                    >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button 
                        type="button" 
                        onClick={handleCancel} 
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out flex items-center"
                    >
                        <RiUpload2Line className="mr-2" /> Upload Task
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskUploadForm;
