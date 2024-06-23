import axios from 'axios';

export const getCanvas = async () => {
    try {
        const response = await axios.get('/api/projects/666b28a1de93cb0b21650e09/canvas');
        console.log(response.data);
    } catch (error) {
        console.error(error);
        
    }
}