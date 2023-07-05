
// Validate exam data
const validateExamData = (req, res, next) => {
    const { level, full_mark, date, time, duration } = req.body;
    if (!level || !full_mark || !date || !time || !duration) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    next();
  };
  
  // Validate question data
  const validateQuestionData = (req, res, next) => {
    const { question_type, question, mark, options, answer } = req.body;
    if (!question_type || !question || !mark || !options || !answer) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    next();
  };
  
  module.exports = {
    validateExamData,
    validateQuestionData
  };
  