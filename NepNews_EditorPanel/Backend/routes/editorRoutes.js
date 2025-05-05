const express = require('express');
const router = express.Router();
const Editor = require('../models/editorModel');

router.get('/', async (req, res) => {
  try {
    const editorData = await Editor.find();
    res.status(200).json(editorData);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving editor data' });
  }
});

router.post('/', async (req, res) => {
  const { title, content } = req.body;

  try {
    const newEditorData = new Editor({ title, content });
    await newEditorData.save();
    res.status(201).json(newEditorData);
  } catch (err) {
    res.status(500).json({ message: 'Error saving editor data' });
  }
});

module.exports = router;
