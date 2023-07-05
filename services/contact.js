const nodemailer = require("nodemailer");
const mustache = require("mustache");
const fs = require("fs");
const path = require("path");
const smtpTransport = require("nodemailer-smtp-transport");
const templatePath = path.join(__dirname, "./contactTemplete.html");
const template = fs.readFileSync(templatePath, "utf8");

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "Gmail",
    auth: {
      user: process.env.APP_EMAIL_ADDRESS,
      pass: process.env.APP_EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })
);
const sendContactEmail = (firstName, lastName, email, message) => {
  const templateData = { firstName, lastName, email, message };
  const renderedTemplate = mustache.render(template, templateData);
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.APP_EMAIL_ADDRESS,
      to: "tahahamdy34@gmail.com",
      subject: "feedback",
      html: renderedTemplate,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Failed to send password reset email:", error);
        reject(error);
      } else {
        console.log("Password reset email sent:", info.response);
        resolve(info);
      }
    });
  });
};

module.exports.contactUsCtrl = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    await sendContactEmail(firstName, lastName, email, message);
    res.status(200).json({ message: "email sended" });
  } catch (error) {
    res.status(404).json({ message: "failed to send", error: error.message });
  }
};

module.exports = { sendContactEmail };
