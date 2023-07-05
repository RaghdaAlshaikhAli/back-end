const examSchema = require("../model/exam.model");
const authMiddleware = require('../services/authExam.service');
const { examsValidation, questionValidation } = require('../validation/exam.validate');
const fs= require('fs')

// createExam
const createExam = (req, res) => {
  authMiddleware(req, res, () => { // اختياري لو مربوط باليوزر
  const { level, course_id, user_id, full_mark, date, time, duration,createdAT,} = req.body;

const { errors: examErrors, isValid: isExamValid  } = examsValidation(level, course_id, user_id, full_mark, date, time, duration);
if (!isExamValid) {
  return res.status(400).json({ errors: examErrors });
}

  const newExam = new examSchema({level, course_id, user_id, full_mark, date, time, duration, createdAT});

  newExam.save()
    .then((exam) => {
      res.status(201).send(exam);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
};

// getExams
const getExams = (req, res) => {
  examSchema
    .find({})
    .then((exams) => {
      res.status(200).send(exams);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};
// getExamsOnly
const getExamsOnly=(req,res)=>{
    examSchema
      .find({}, "-questions") 
      .then((exams) => {
        res.status(200).send(exams);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
}

// getQuestions
const getQuestions = (req, res) => {
  examSchema
    .find({}, "questions")
    .then((exams) => {
      res.status(200).send(exams);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

// createExamQuestion
const createExamQuestion = (req, res) => {
  authMiddleware(req, res, () => {
  const _id = req.params.id;
  const { question_type, question, mark, options, answer, images } = req.body;

  const { errors: questionErrors, isValid: isQuestionValid } = questionValidation(
    question_type,
    question,
    mark,
    options,
    answer
  );
  if (!isQuestionValid) {
    return res.status(400).json({ errors: questionErrors });
  }

  examSchema.findById(_id).then((exam) => {
      if (!exam) {
        return res.status(404).send("Exam not found.");
      }

      const newQuestions = {
        examID: _id,
        question_type,
        question,
        mark,
        images,
        options,
        answer,
      };
      exam.questions.push(newQuestions);
      return exam.save();
    })
    .then((updatedExam) => {
      res.status(201).send(updatedExam);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
};

// getExam
const getExam=(req,res)=>{
     const _id = req.params.id;
     examSchema.findById(_id).then((exam) => {
         if (!exam) {
           return res.status(404).send("Exam not found.");
         }
         res.status(200).send(exam);
       })
       .catch((error) => {
         res.status(500).send(error);
       });
}

// getexamOnly
const getexamOnly = (req, res) => {
  const {_id} = req.params.id;
  examSchema.findById(_id, "-questions").then((exam) => {
      if (!exam) {
        return res.status(404).send(`This ${_id} Exam not found.`);
      }
      res.status(200).send(exam);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

// getQuestion
const getQuestion = (req, res) => {
  const examId  = req.params.id;
  const questionId  = req.params.ida;
  examSchema.findById(examId , "questions")
    .then((exam) => {
      if (!exam) {
        return res.status(404).send("Exam not found.");
      }
      const question = exam.questions.id(questionId);
      if (!question) {
        return res.status(404).send("Question not found.");
      }
      res.status(200).send(question);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

// deleteExam
const deleteExam=(req,res)=>{
  authMiddleware(req, res, () => {
    const _id = req.params.id;
    examSchema
      .findByIdAndDelete(_id)
      .then((exam) => {
        if (!exam) {
          return res.status(404).send('Exam not found.');
        }
        res.status(200).send('Exam deleted successfully.');
      })
      .catch((error) => {
        res.status(500).send(error);
      });
    });
}

//deleteQuestion
const deleteQuestion = (req, res) => {
  authMiddleware(req, res, () => {
  const questionId = req.params.id;
  examSchema
    .updateOne(
      { "questions._id": questionId },
      { $pull: { questions: { _id: questionId } } }
    )
    .then((exam) => {
      if (!exam) {
        return res.status(404).send("question not found.");
      }
      res.status(200).send("question deleted successfully.");
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
};

// updateQuestion
const updateQuestion=(req,res)=>{
  authMiddleware(req, res, () => {
     const questionId = req.params.id;
     const updatedQuestion = req.body;
     
     examSchema
       .findOneAndUpdate(
         { "questions._id": questionId },
         { $set: { "questions.$": updatedQuestion } },
         { new: true , validator:true }
       )
       .then((updatedExam) => {
         if (!updatedExam) {
           return res.status(404).send(`This ${questionId} Question not found.`);
         }
         res.status(200).send(updatedExam);
       })
       .catch((error) => {
         res.status(500).send(error);
       });
      });
}

// updateExam
const updateExam = (req, res) => {
  authMiddleware(req, res, () => {
  const examId = req.params.id;
  const updatedExam = req.body;

  // const { errors: examErrors, isValid: isExamValid } = examsValidation(updatedExam.level, updatedExam.course_id, updatedExam.user_id, updatedExam.full_mark, updatedExam.date, updatedExam.time, updatedExam.duration);
  // if (!isExamValid) {
  //   return res.status(400).json({ errors: examErrors });
  // }

  examSchema
    .findByIdAndUpdate(examId, updatedExam, { new: true })
    .then((updatedExam) => {
      if (!updatedExam) {
        return res.status(404).send(`This ${examId} exam not found.`);
      }
      res.status(200).send(updatedExam);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
  });
};

// getExamWithAnswers
const getExamWithAnswers = (req, res) => {
  const _id = req.params.id;
  const userAnswers = req.body.answers; 
  examSchema
    .findById(_id)
    .then((exam) => {
      if (!exam) {
        return res.status(404).send("Exam not found.");
      }

      const questions = exam.questions;

      const results = questions.map((question, index) => {
        const correctAnswer = question.answer;
        const userAnswer = userAnswers[index];

        const isCorrect = correctAnswer === userAnswer;

        return {
          question: question.question,
          userAnswer,
          correctAnswer,
          isCorrect,
        };
      });

      res.status(200).send(results);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

const moment = require('moment');

// getSolvedExams اختياري
const getSolvedExams = (req, res) => {
  const user_id = req.params.user_id; 

  examSchema
    .find({ user_id })
    .populate("course_id")
    .then((exams) => {
      if (!exams) {
        return res.status(404).send("No exams found for the user.");
      }
      res.status(200).send(exams);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

// getUpcomingExams
const getUpcomingExams = (req, res) => {
  const user_id = req.params.user_id; 
  const currentDate = moment().toISOString();

  examSchema
    .find({ user_id, date: { $gt: currentDate } })
    .populate("course_id")
    .then((exams) => {
      if (!exams) {
        return res.status(404).send("No upcoming exams found for the user.");
      }
      res.status(200).send(exams);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

module.exports = {
  createExam,
  getExams,
  getExamsOnly,
  getQuestions,
  createExamQuestion,
  getExam,
  getexamOnly,
  getQuestion,
  deleteExam,
  deleteQuestion,
  updateQuestion,
  updateExam,
  getExamWithAnswers,
  getSolvedExams,
  getUpcomingExams
};