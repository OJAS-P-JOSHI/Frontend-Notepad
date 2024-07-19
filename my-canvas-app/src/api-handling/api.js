import axios from 'axios';

export const getCanvas = async (setShapes) => {
    try {
        const response = await axios.get('/api/projects/666b28a1de93cb0b21650e09/canvas');
        console.log(response.data);
        if(response.data) {
            const getShapes = response.data.map((shape) => {
                return shape.value;
            }); 
            setShapes(getShapes);
            console.log(getShapes);
        }

    } catch (error) {
        console.error(error);
        
    }
}

export const handleSave = async () => {
    
}