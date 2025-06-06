import bcrypt from "bcrypt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  currentPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(currentPassword, hashedPassword);
}

export function emailHTMLTemplate(body: string): string {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email from [Kavach App]</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      background-color: #ffffff;
      margin: 40px auto;
      padding: 20px;
      border-radius: 8px;
      width: 90%;
      max-width: 600px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
    }
    .header h1 {
      margin: 0;
      color: #333;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Kavach App</h1>
      <h2>A Smart Crime & Safety Dashboard.</h2>
    </div>

    ${body}

    <div class="footer">
      &copy; 2025 Kavach App. All rights reserved.
    </div>
  </div>
</body>
</html>

    `;
}
