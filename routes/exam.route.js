const express = require("express");
const router = express.Router();
const examsController = require("../controller/exam.controller");

router.post("/exams", examsController.createExam);
router.post("/exams/:id", examsController.createExamQuestion);
router.get("/exams", examsController.getExams);
router.get("/exam/:id", examsController.getExam);
router.get("/examsOnly", examsController.getExamsOnly);
router.get("/examOnly/:id", examsController.getexamOnly);
router.get("/questions", examsController.getQuestions);
router.get("/exam/:id/:ida", examsController.getQuestion);
router.delete("/exam/:id", examsController.deleteExam);
router.delete("/question/:id", examsController.deleteQuestion);
router.patch("/question/:id", examsController.updateQuestion);
router.patch("/exam/:id", examsController.updateExam);
router.post("/exam/:id/answers", examsController.getExamWithAnswers);

module.exports = router;