import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectDashboard = () => {
    const [projects, setProjects] = useState([]);
    const [newProjectName, setNewProjectName] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError(error.message);
        }
    };

    const handleCreateProject = async () => {
        try {
            const response = await fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: newProjectName }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProjects([...projects, data]);
            setNewProjectName("");
            navigate(`/project/${data._id}`); // Navigate to the new project page
        } catch (error) {
            console.error('Error creating project:', error);
            setError(error.message);
        }
    };

    const handleDeleteProject = async (projectId) => {
        try {
            await fetch(`/api/projects/${projectId}`, {
                method: 'DELETE',
            });
            setProjects(projects.filter((project) => project._id !== projectId));
        } catch (error) {
            console.error('Error deleting project:', error);
            setError(error.message);
        }
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">Project Dashboard</h1>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    className="border p-2 w-full mr-2"
                    placeholder="New project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={handleCreateProject}
                >
                    Create Project
                </button>
            </div>
            <hr className="mb-4" />
            <ul>
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <li key={project._id} className="flex justify-between items-center p-2 border mb-2">
                            <span className="cursor-pointer" onClick={() => navigate(`/project/${project._id}`)}>
                                {project.name}
                            </span>
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => handleDeleteProject(project._id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))
                ) : (
                    <li>No projects available.</li>
                )}
            </ul>
        </div>
    );
};

export default ProjectDashboard;
