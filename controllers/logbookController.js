import { 
  createNewRow, 
  getAllLogs, 
  updateLog,
  deleteLog,
} from "../services/logbookService.js";

export const addNewEntry = async (req, res) => {
  try {
    const data = req.body;
    const newObj = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== '') {
        newObj[key] = data[key];
      }
    });

    const newData = await createNewRow(newObj);
    res.status(201).json(newData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEntireLogBook = async (req, res) => {
  try {
    const data = await getAllLogs();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const modifyEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const newObj = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== '') {
        newObj[key] = data[key];
      }
    });
    const updatedData = await updateLog(id, newObj);
    if (!updatedData || updatedData.length === 0) {
      return res.status(404).json({ error: "Data not found" });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteLog(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

