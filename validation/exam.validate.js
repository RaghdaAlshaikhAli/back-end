const validator = require('validator');

// Exams validation
const examsValidation = (level,course_id, user_id,full_mark, date,time,duration) => {
  const errors = {};

  if (validator.isEmpty(level)) errors.level = 'Level is required';
  if (validator.isEmpty(course_id)) errors.course_id = 'Course ID is required';
  if (validator.isEmpty(user_id)) errors.user_id = 'User ID is required';
  if (typeof full_mark !== 'number') {
    errors.full_mark = 'Full Mark must be a number';
  } else if (!Number.isInteger(full_mark)) {
    errors.full_mark = 'Full Mark must be an integer';
  }

  if (validator.isEmpty(date)) errors.date ="Date is required"
  if (validator.isEmpty(time)) errors.time ="Time is required"
if (typeof duration !== 'number') {
    errors.duration = 'Duration must be a number';
  } else if (!Number.isInteger(duration)) {
    errors.duration = 'Duration must be an integer';
  } 
return {errors,isValid: Object.keys(errors).length === 0};
};
  // question validation
const questionValidation = (question_type, question, mark, options, answer) => {
    const errors = {};
  
    if (validator.isEmpty(question_type)) errors.question_type = "Question Type is required";
    if (validator.isEmpty(question)) errors.question = "Question is required";
  
    if (typeof mark !== 'number') {
      errors.mark = 'Mark must be a number';
    } else if (!Number.isInteger(mark)) {
      errors.mark = 'Mark must be an integer';
    } else if (mark < 0) {
      errors.mark = 'Mark cannot be negative';
    }
  
    if (validator.isEmpty(answer)) errors.answer = "Answer is required";
  
    return { errors, isValid: Object.keys(errors).length === 0 };
  };
  
module.exports = {examsValidation, questionValidation};