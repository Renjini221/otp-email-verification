let generatedOTP = "";

exports.handler = async (event) => {
  const { otp } = JSON.parse(event.body);

  if (otp === generatedOTP) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } else {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false })
    };
  }
};
