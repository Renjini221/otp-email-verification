const { Client } = require("pg");

exports.handler = async (event) => {
  try {
    const { email, otp } = JSON.parse(event.body);

    const client = new Client({
      connectionString: process.env.NETLIFY_DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    const result = await client.query(
      "SELECT otp FROM otp_codes WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      await client.end();
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false })
      };
    }

    const storedOtp = result.rows[0].otp;

    if (storedOtp === otp) {
      await client.query(
        "DELETE FROM otp_codes WHERE email = $1",
        [email]
      );
      await client.end();
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true })
      };
    }

    await client.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: false })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false })
    };
  }
};
