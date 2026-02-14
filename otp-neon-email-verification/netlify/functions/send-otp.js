const nodemailer = require("nodemailer");
const { Client } = require("pg");

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS otp_codes (
        email TEXT PRIMARY KEY,
        otp TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      INSERT INTO otp_codes (email, otp)
      VALUES ($1, $2)
      ON CONFLICT (email)
      DO UPDATE SET otp = EXCLUDED.otp, created_at = CURRENT_TIMESTAMP;
    `, [email, otp]);

    await client.end();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${otp}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "OTP Sent Successfully" })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error sending OTP" })
    };
  }
};
