# Hostinger Deployment Guide (No VPS)

This guide explains how to deploy LaunchXact on **Hostinger Shared, Cloud, or Business Hosting** using the **Node.js** feature.

> **⚠️ CRITICAL REQUIREMENT**
> You MUST have a plan that supports **Node.js** (e.g., Business Web Hosting, Cloud Startup, etc.).
> If you are on "Single Shared Hosting" or "Premium Shared Hosting", Node.js might NOT be available or very limited.
> **If you cannot find "Node.js" in your hPanel, you cannot deploy this app (because of the API routes) without upgrading or using Vercel.**

---

## **Step 1: Preparation (Local)**

1.  **Check `server.js`**: I have created a `server.js` file in your root folder. This is often required by Hostinger as the "Entry Point".
2.  **Verify `package.json`**: Ensure your `start` script is `"next start"` (Standard).
3.  **Zip the Project**:
    *   Select ALL files in your `LaunchXact` folder **EXCEPT**:
        *   `node_modules` (Do NOT upload this, it's huge)
        *   `.next` (Do NOT upload this, we build on server)
        *   `.git`
    *   Right-click -> Send to -> **Compressed (zipped) folder**. Name it `launchxact.zip`.

---

## **Step 2: Upload to Hostinger**

1.  Log in to **hPanel**.
2.  Go to **Websites** -> **Manage**.
3.  Search for **Files** -> **File Manager**.
4.  Navigate to `public_html` (or create a subfolder if deploying to a subdomain).
5.  **Upload** your `launchxact.zip`.
6.  **Right-click** the zip -> **Extract**.
7.  Ensure all files (like `package.json`, `app`, `public`, `server.js`) are directly in the folder you want (e.g., `public_html`), not inside a deeper subfolder.

---

## **Step 3: Setup Node.js Application**

1.  In hPanel, search for **Advanced** -> **Node.js**.
2.  **Create New Application**:
    *   **Node.js Version**: Choose **v18** or **v20** (Recommended).
    *   **Application Mode**: **Production**.
    *   **Application Root**: `public_html` (or where you extracted files).
    *   **Application URL**: Leave as default (your domain).
    *   **Application Startup File**: `server.js` (CRITICAL! Do not leave empty).
3.  Click **Create**.

---

## **Step 4: Install Dependencies & Build**

1.  Once created, you will see a button **"Enter NPM Install"** (or similar). Click it.
    *   *This runs `npm install` on the server. Wait for it to finish.*
2.  **Build the App**:
    *   Hostinger's UI might not have a "Build" button. You usually need to run the build command manually via SSH or the "Run NPM Script" feature if available.
    *   **Option A (SSH - Best)**:
        1.  In hPanel -> **Advanced** -> **SSH Access** -> Enable.
        2.  Copy the login command (e.g., `ssh u12345@1.2.3.4`).
        3.  Open your local terminal (Powershell), paste the command, type "yes" and your password.
        4.  Go to your folder: `cd public_html`
        5.  Run build: `npm run build`
    *   **Option B (Local Build - If SSH is too hard)**:
        1.  Run `npm run build` on your LOCAL computer.
        2.  This creates a `.next` folder.
        3.  Zip the `.next` folder.
        4.  Upload it to Hostinger and extract it, replacing the one on the server.

---

## **Step 5: Configure Environment Variables**

1.  In the **Node.js** section of hPanel, look for **Environment Variables**.
2.  Add the following (copy from your `.env.local`):
    *   `NEXT_PUBLIC_SUPABASE_URL` = (your value)
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your value)
    *   `RESEND_API_KEY` = (your value)
    *   `PORT` = `3000` (or whatever Hostinger assigns, usually handled automatically but good to set).

---

## **Step 6: Start the App**

1.  Go back to the **Node.js** page.
2.  Click **Restart** (or Start).
3.  Visit your website.

### **Troubleshooting**
*   **404 / 503 Errors**: Check the **Apache/Nginx** `.htaccess`. Hostinger usually creates one automatically when you set up Node.js. If not, you might need to manually set rewrite rules to proxy to the Node port.
*   **"Internal Server Error"**: Check `user-dirs/data/logs` or enable "Development" mode in Node.js settings to see errors.

---

### **Alternative: Vercel (Much Easier)**
If the steps above fail or seem too complex, simply:
1.  Push code to GitHub.
2.  Go to Vercel.com -> Import Project.
3.  Added Env Variables.
4.  Done. (And point your Hostinger Domain DNS to Vercel).
