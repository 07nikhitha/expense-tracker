const Report = require('../models/report');

// GET all reports
exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate('user');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST create a new report
exports.createReport = async (req, res) => {
    try {
      const { details, userId } = req.body;
  
      const report = new Report({
        details: JSON.stringify(details),  // Store details as a string
        user: userId
      });
  
      await report.save();
  
      res.status(201).json({ message: 'Report generated and saved successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error generating report' });
    }
  };
  
// GET all reports by user ID
exports.getUserReports = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reports = await Report.find({ user: userId }).sort({ generatedDate: -1 }); // Sort by date
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reports' });
  }
};