const { sendContactEmail } = require("../services/contact");

module.exports.contactUsCtrl = async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;
    await sendContactEmail(firstName, lastName, email, message);
    res.status(200).json({ message: "email sended" });
  } catch (error) {
    res.status(404).json({ message: "failed to send", error: error.message });
  }
};
