module.exports = (name, regUrl) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Fluid Fintec - Registration</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background: #f4f7fb;
    font-family: 'Helvetica', Arial, sans-serif;
  }

  .container {
    max-width: 620px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
    overflow: hidden;
  }

  .header {
    background: linear-gradient(135deg, #0d6efd, #4ea8ff);
    padding: 40px 20px;
    text-align: center;
    color: #ffffff;
  }

  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .content {
    padding: 30px 35px;
    color: #333333;
    font-size: 16px;
    line-height: 1.7;
  }

  .content p {
    margin-bottom: 18px;
  }

  .btn-wrapper {
    text-align: center;
    margin: 32px 0;
  }

  .btn {
    background: linear-gradient(135deg, #0d6efd, #4ea8ff);
    padding: 14px 28px;
    border-radius: 8px;
    color: #ffffff !important;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
    box-shadow: 0 4px 12px rgba(0,123,255,0.3);
  }

  .note {
    background: #fff5f5;
    border-left: 4px solid #ff4d4d;
    padding: 12px 15px;
    font-size: 14px;
    color: #cc0000;
    margin: 20px 0;
    border-radius: 6px;
  }

  .footer {
    text-align: center;
    padding: 20px 10px;
    font-size: 14px;
    color: #666666;
    margin-top: 20px;
  }

  .footer h4 {
    margin: 5px 0;
    font-weight: 600;
  }

  @media only screen and (max-width: 480px) {
    .container {
      margin: 20px;
    }
    .content {
      padding: 20px;
    }
  }
</style>
</head>

<body>

<div class="container">
  <div class="header">
    <h1>Fluid Fintec Registration</h1>
  </div>

  <div class="content">
    <p>Hi <strong>${name}</strong>,</p>

    <p>
      Welcome to <strong>Fluid Fintec</strong>! Click the button below to complete your registration.
    </p>

    <div class="btn-wrapper">
      <a class="btn" href="${regUrl}">Complete Registration</a>
    </div>

    <div class="note">
      <strong>Note:</strong> This link is valid for only <strong>30 minutes</strong>. Please make sure to register before it expires.
    </div>

    <p>If you did not request this, please ignore this email.</p>
<div class="footer">
    <h4>Fluid Fintec</h4>
    Madisson, New Jersey<br/>
    Ireland
  </div>
  </div>

  
</div>

</body>
</html>

`
