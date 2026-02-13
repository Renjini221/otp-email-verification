const nodemailer = require("nodemailer");

let generatedOTP = "";

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);

  generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${generatedOTP}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OTP Sent Successfully" })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Email Sending Failed" })
    };
  }
};
