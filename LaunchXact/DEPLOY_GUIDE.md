# LaunchXact Deployment Guide

## 1. Hosting Recommendation (VPS vs. Managed)

### **Do you need a VPS right now?**
**No, strictly speaking.**
For the **Waitlist Phase**, your application is lightweight. It connects to Supabase (Database) and Resend (Email), which are external services. The app itself just serves the UI and handles API requests.
- **Easiest Option**: **Vercel** (Free or Pro). It's zero-config for Next.js.
- **VPS Option**: Gives you full control, fixed pricing, and is better if you plan to host other backend services (like cron jobs, custom workers, or your own analytics) in the future.

### **Choosing a VPS Plan**
If you choose a VPS (e.g., Hetzner, DigitalOcean, AWS Lightsail) to be "future-proof" for the full website:

**Recommended Plan: 2 vCPU / 8 GB RAM**
*   **Why?**
    *   **Waitlist Phase**: This is overkill (which is good). It will run efficiently with 0% lag.
    *   **Full Website Phase**: Next.js is efficient. 8 GB of RAM is plenty for caching, database connection pools, and handling moderate-to-high traffic (10k-50k+ visitors/month) for a directory-style site.
    *   **Cost**: Usually ~$10-15/month.
*   **The 4 vCPU / 16 GB Plan**:
    *   This is typically for heavy computational apps (AI processing, video encoding) or massive scale (100k+ concurrent users). You likely won't need this until LaunchXact becomes very large.

---

## 2. Preparing for Deployment

### **Prerequisites on Local Machine**
1.  **Build Check**: Run `npm run build` locally to ensure there are no errors.
2.  **Environment Variables**: Have your `.env.local` values ready.

### **Required Environment Variables**
You will need to set these on your server:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

---

## 3. VPS Setup Instructions (Ubuntu)

If you proceed with the VPS, here is the standard "Production" setup using Node.js and PM2.

### **Step 1: System Updates**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip
```

### **Step 2: Install Node.js (v18 or v20)**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Verify installation
```

### **Step 3: Clone & Install**
```bash
git clone https://github.com/your-username/LaunchXact.git
cd LaunchXact
npm install
```

### **Step 4: Build**
```bash
# Create the production build
npm run build
```

### **Step 5: Setup PM2 (Process Manager)**
PM2 keeps your app running 24/7 and restarts it if it crashes.

```bash
sudo npm install -g pm2
pm2 start npm --name "launchxact" -- start
pm2 save
pm2 startup
```

### **Step 6: Nginx (Reverse Proxy)**
You shouldn't expose port 3000 directly. Use Nginx.

```bash
sudo apt install -y nginx
```

Edit config: `sudo nano /etc/nginx/sites-available/default`
```nginx
server {
    listen 80;
    server_name launchxact.com www.launchxact.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

### **Step 7: SSL (HTTPS)**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d launchxact.com -d www.launchxact.com
```

---

## 4. Final Polish Checklist

Before pushing code:
- [ ] **Console Logs**: Remove any `console.log` used for debugging (e.g., inside the submit handlers).
- [ ] **Metadata**: Ensure `layout.js` has the correct `title` and `description` for SEO.
- [ ] **Favicon**: Ensure you have a `favicon.ico` in the `app` or `public` folder.
- [ ] **Mobile Test**: Verify the new Hero animations look good on your phone.
