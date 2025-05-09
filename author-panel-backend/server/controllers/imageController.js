// Upload image
exports.uploadImage = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ msg: 'No file uploaded' });
      }
      
      // Return the path to the uploaded file
      res.json({
        filePath: `/uploads/${req.file.filename}`
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  };