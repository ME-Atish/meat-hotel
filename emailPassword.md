## Password Of Email

for get password of email and use it in login with email follow this steps:

## If you're using Gmail

- You **must enable 2FA on your account**
- Then create an **App Password** at: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
- Use that App Password as the `pass` in your transporter config

## If you're using other services


### ✅ Check if your email provider supports SMTP

Most major services (Outlook, Yahoo, Zoho, etc.) provide SMTP access. You’ll need:

- **SMTP host** (e.g., `smtp.mail.yahoo.com`)
- **SMTP port** (usually `465` for SSL or `587` for TLS)
- **Authentication credentials** (your email and password or app-specific credentials)

### 🔐 Enable access for third-party apps

Some providers block non-browser access by default. Look for settings like:

- “Allow less secure apps” (for older providers)
- “Generate app password” (for accounts with 2FA)
- “Enable SMTP access”

