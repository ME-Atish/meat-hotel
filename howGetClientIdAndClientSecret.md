# How to Get `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

Follow these steps to create Google OAuth credentials from the [Google Cloud Console](https://console.cloud.google.com/).

---

## 1. Create a New Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Sign in with your Google account.
3. Click on the **project dropdown** at the top.
4. Click **New Project**.
5. Enter a **Project Name** (e.g., `My OAuth App`) and click **Create**.

---

## 2. Enable the Google OAuth API
1. With your new project selected, go to the **Navigation Menu** → **APIs & Services** → **Library**.
2. Search for **Google+ API** or **Google People API** (depending on your needs).
3. Click on the API and then click **Enable**.

---

## 3. Configure OAuth Consent Screen
1. Go to **APIs & Services** → **OAuth consent screen**.
2. Choose **External** if you want public access, or **Internal** if for your organization only.
3. Fill in:
   - **App name**
   - **User support email**
   - **Developer contact email**
4. Click **Save and Continue** until finished.

---

## 4. Create OAuth Credentials
1. Go to **APIs & Services** → **Credentials**.
2. Click **Create Credentials** → **OAuth Client ID**.
3. Choose **Web application** as the application type.
4. Enter a **Name** (e.g., `My Web App`).
5. In **Authorized JavaScript origins**, add your domain (e.g., `http://localhost:3000`).
6. In **Authorized redirect URIs**, add the OAuth callback URL (e.g., `http://localhost:3000/auth/google/callback`).
7. Click **Create**.

---

## 5. Get Your Credentials
After creation, you will see:
- **Client ID** → `GOOGLE_CLIENT_ID`
- **Client Secret** → `GOOGLE_CLIENT_SECRET`
