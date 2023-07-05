
const { Schema, model } = require("mongoose");

const examSchema = new Schema({
  level: { type: String, required: true },
  course_id: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // اختياري اذا تم ربطه باليوزر
  full_mark: { type: Number, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, required: true },
  createdAT: { type: Date, default: Date.now },
  questions: [
    {
      exam_id: { type: Schema.Types.ObjectId, ref: 'Exam'},
      question_type: { type: String, required: true },
      question: { type: String, required: true },
      mark: {
        type: Number,
        required: true,
        validate: {
          validator: function (val) {
            return val >= 0;
          },
          message: "There is no negative marks",
        },
      },
      images: [
        {
          type: String,
          trim: true,
          default: 'uploads/exam/default.png'
        }
      ],
      options: { type: [String],required: true, validate: [arrayLimit, 'The number of answers equal 4'] },
      answer: { type: String, required: [true, 'You must choose the answer'] },
    }
  ]
});

// Validation function for options array length
function arrayLimit(val) {
  return val.length === 4;
}

const Exam = model('Exam', examSchema);

module.exports = Exam;
