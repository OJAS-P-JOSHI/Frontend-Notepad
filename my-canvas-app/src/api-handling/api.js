import { dark } from "@mui/material/styles/createPalette";
import axios from "axios";

export const getCanvas = async (setShapes) => {
  try {
    const response = await axios.get(
      "/api/projects/666eaa99ee1218318d338e71/canvas"
    );
    console.log(response.data);
    if (response.data) {
      const getShapes = response.data.map((shape) => {
        return shape.value;
      });
      setShapes(getShapes);
      console.log(getShapes);
    }
  } catch (error) {
    console.error(error);
  }
};

export const handleSave = async (shapes) => {
  try {
    const canvasObjectList = shapes.map((shape) => {
      return {
        value: shape,
      };
    });
    console.log(canvasObjectList);
    const save = await axios.post(
      "/api/projects/666eaa99ee1218318d338e71/listOfCanvas",
      canvasObjectList
    );
    console.log(save.data);
  } catch (error) {
    console.log(error);
  }
};
