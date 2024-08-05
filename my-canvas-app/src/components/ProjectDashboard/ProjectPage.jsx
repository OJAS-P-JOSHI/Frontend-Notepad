import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProjectPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [canvasObjects, setCanvasObjects] = useState([]);
    const [newCanvasObject, setNewCanvasObject] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjectDetails(projectId);
        fetchCanvasObjects(projectId);
    }, [projectId]);

    const fetchProjectDetails = async (projectId) => {
        try {
            const response = await fetch(`/api/projects/${projectId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProject(data);
        } catch (error) {
            console.error('Error fetching project details:', error);
            setError(error.message);
        }
    };

    const fetchCanvasObjects = async (projectId) => {
        try {
            const response = await fetch(`/api/projects/${projectId}/canvas-objects`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCanvasObjects(data);
        } catch (error) {
            console.error('Error fetching canvas objects:', error);
            setError(error.message);
        }
    };

    const handleCreateCanvasObject = async () => {
        try {
            const response = await fetch(`/api/projects/${projectId}/canvas-objects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: newCanvasObject }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setCanvasObjects([...canvasObjects, data]);
            setNewCanvasObject("");
        } catch (error) {
            console.error('Error creating canvas object:', error);
            setError(error.message);
        }
    };

    const handleDeleteCanvasObject = async (canvasObjectId) => {
        try {
            await fetch(`/api/projects/${projectId}/canvas-objects/${canvasObjectId}`, {
                method: 'DELETE',
            });
            setCanvasObjects(canvasObjects.filter((object) => object._id !== canvasObjectId));
        } catch (error) {
            console.error('Error deleting canvas object:', error);
            setError(error.message);
        }
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    if (!project) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4">{project.name}</h1>
            <div className="mt-4 p-4 border rounded">
                <h2 className="text-2xl font-bold mb-2">Canvas Objects</h2>
                <div className="flex justify-between items-center mb-4">
                    <input
                        type="text"
                        className="border p-2 w-full mr-2"
                        placeholder="New canvas object data"
                        value={newCanvasObject}
                        onChange={(e) => setNewCanvasObject(e.target.value)}
                    />
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleCreateCanvasObject}
                    >
                        Add Canvas Object
                    </button>
                </div>
                <ul>
                    {canvasObjects.length > 0 ? (
                        canvasObjects.map((object) => (
                            <li key={object._id} className="flex justify-between items-center p-2 border mb-2">
                                {object.data}
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleDeleteCanvasObject(object._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))
                    ) : (
                        <li>No canvas objects available.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ProjectPage;
