# Joya-React Deployment & HTTPS Troubleshooting Guide

This document details the critical security and authentication challenges encountered while connecting a modern React SPA hosted on **Vercel** with a decoupled Express REST API hosted on **AWS EC2**, along with their complete solutions.

---

## 🚨 Error 1: Browser Mixed Content Block (`blocked:mixed-content`)

### 🔴 Problem
When opening the React SPA on Vercel (`https://joya-pink.vercel.app`), API requests to the backend EC2 server failed to load listings, displaying the following error in the browser Network tab:
```text
(blocked:mixed-content)
```

### 🔍 Cause
Modern web browsers enforce strict **Mixed Content security policies**. An encrypted site loaded over **HTTPS** (`https://...`) is forbidden from making unencrypted **HTTP** (`http://...`) requests to external servers. Because the Vercel frontend was served over HTTPS while the backend EC2 IP was plain HTTP (`http://13.49.127.108:3000`), the browser automatically blocked every outgoing API call.

### 🛠️ Solution: Free Domain & Nginx Reverse Proxy with Let's Encrypt SSL

1. **Free Subdomain via DuckDNS**:
   - Created a free domain `joya-pink.duckdns.org` pointing to EC2 IP `13.49.127.108`.

2. **Nginx Reverse Proxy on EC2**:
   - Configured Nginx to proxy incoming traffic on port 80/443 to the local Docker container (`http://127.0.0.1:3000`):
     ```nginx
     server {
         listen 80;
         server_name joya-pink.duckdns.org;

         location / {
             proxy_pass http://127.0.0.1:3000;
             proxy_http_version 1.1;
             proxy_set_header Upgrade $http_upgrade;
             proxy_set_header Connection 'upgrade';
             proxy_set_header Host $host;
             proxy_set_header X-Real-IP $remote_addr;
             proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
             proxy_set_header X-Forwarded-Proto $scheme;
         }
     }
     ```

3. **Free SSL Certificate via Certbot**:
   - Installed Certbot and generated a Let's Encrypt SSL certificate for `joya-pink.duckdns.org`:
     ```bash
     sudo certbot --nginx -d joya-pink.duckdns.org
     ```
   - Enabled SSL redirect in Nginx so all `http://` traffic redirects to `https://`.

4. **Updated Vercel Environment Variable**:
   - Set `VITE_API_BASE_URL=https://joya-pink.duckdns.org` in Vercel settings.

---

## 🚨 Error 2: Session Cookie Drop in Cross-Site Authentication

### 🔴 Problem
Users logged in successfully on Vercel (`https://joya-pink.vercel.app`), but upon page refresh or navigation, the navbar reset to logged-out state. Checking browser storage revealed no session cookies were saved.

### 🔍 Cause
1. **Cross-Site Context**: The frontend (`vercel.app`) and backend (`duckdns.org`) run on separate root domains, making all session cookies **Cross-Site**.
2. **Cookie Security Policy**: Browser security standards dictate that cross-site cookies must set `SameSite=None` and `Secure=true`.
3. **HTTP Restriction**: Cookies with `Secure=true` will **only** be saved by browsers if sent over a secure **HTTPS** connection.
4. **Proxy Awareness**: When Express runs behind a reverse proxy (Nginx), it does not consider connection secure unless `app.set("trust proxy", 1)` is enabled.

### 🛠️ Solution: Express Configuration & Production Cookie Settings

1. **Enable Trust Proxy in Express (`app.js`)**:
   - Configured Express to trust Nginx headers (`X-Forwarded-Proto`):
     ```javascript
     if (process.env.NODE_ENV === "production") {
       app.set("trust proxy", 1);
     }
     ```

2. **Update Session Cookie Configuration (`app.js`)**:
   - Dynamically set `secure: true` and `sameSite: "none"` in production:
     ```javascript
     cookie: {
       expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
       maxAge: 7 * 24 * 60 * 60 * 1000,
       httpOnly: true,
       secure: process.env.NODE_ENV === "production",
       sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
     }
     ```

3. **EC2 Production Environment Variables (`/home/ubuntu/.env`)**:
   - Updated environment variables on EC2:
     ```env
     NODE_ENV=production
     BASE_URL=https://joya-pink.vercel.app
     CORS_ORIGIN=https://joya-pink.vercel.app
     ```

4. **Vite Axios Client Setup (`src/api/axios.ts`)**:
   - Configured `withCredentials: true` so Axios sends cross-domain cookies:
     ```typescript
     export const api = axios.create({
       baseURL: import.meta.env.VITE_API_BASE_URL
         ? `${import.meta.env.VITE_API_BASE_URL}/api`
         : "/api",
       withCredentials: true,
     });
     ```

---

## 🎯 Verification Result
With HTTPS established via DuckDNS + Certbot on EC2 and `SameSite=None; Secure` cookies configured with `trust proxy`, both Vercel frontend and EC2 backend seamlessly communicate with persistent authentication!
