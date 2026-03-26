# Dev Server Not Showing Website - Troubleshooting

If your website is not showing after restarting the dev server, follow these steps:

## Step 1: Check if Dev Server is Running

1. **Look at your terminal** - You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

2. **If you don't see this**, the server isn't running. Start it:
   ```bash
   cd project
   npm run dev
   ```

## Step 2: Check the Correct URL

- The website should be at: **http://localhost:5173/**
- Make sure you're using `http://` not `https://`
- Try refreshing the page (F5 or Ctrl+R)

## Step 3: Check for Errors

1. **Open Browser Console** (Press F12 → Console tab)
2. **Look for red error messages**
3. **Common errors:**
   - "Failed to fetch" - Server not running
   - "Cannot GET /" - Wrong URL
   - Module errors - Compilation issues

## Step 4: Check Terminal for Errors

Look in your terminal where you ran `npm run dev` for:
- ❌ Error messages (red text)
- ⚠️ Warnings (yellow text)
- ✅ "ready" message (green/good)

## Step 5: Common Issues & Fixes

### Issue: "Port 5173 already in use"

**Fix:**
```bash
# Windows - Find and kill the process
netstat -ano | findstr :5173
taskkill /PID <PID_NUMBER> /F

# Then restart:
npm run dev
```

### Issue: "Cannot find module" or Import Errors

**Fix:**
```bash
# Reinstall dependencies
npm install

# Then restart:
npm run dev
```

### Issue: TypeScript/Compilation Errors

**Fix:**
```bash
# Check for TypeScript errors
npm run typecheck

# Fix any errors shown, then restart:
npm run dev
```

### Issue: Blank White Page

**Possible causes:**
1. **JavaScript errors** - Check browser console (F12)
2. **Missing dependencies** - Run `npm install`
3. **Build cache issues** - Clear and restart:
   ```bash
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   npm run dev
   ```

### Issue: "ERR_CONNECTION_REFUSED"

**This means the server isn't running:**
1. Make sure you're in the `project` directory
2. Run `npm run dev`
3. Wait for "ready" message
4. Then open browser

## Step 6: Verify File Structure

Make sure you're in the correct directory:
```
project/
  ├── src/
  ├── package.json
  ├── vite.config.ts
  └── index.html
```

## Step 7: Try Different Browser

Sometimes browser cache causes issues:
1. Try a different browser (Chrome, Firefox, Edge)
2. Or clear browser cache (Ctrl+Shift+Delete)

## Step 8: Check Environment Variables

If you added a `.env` file:
1. Make sure it's in the `project/` directory
2. Restart the dev server after creating/modifying `.env`
3. Environment variables only load on server start

## Quick Reset

If nothing works, try a complete reset:

```bash
# Stop the server (Ctrl+C)

# Clear everything
cd project
rm -rf node_modules
rm -rf dist
rm package-lock.json

# Reinstall
npm install

# Start fresh
npm run dev
```

## Still Not Working?

1. **Check the exact error message** in:
   - Terminal output
   - Browser console (F12)
   
2. **Share the error** - Copy the full error message

3. **Verify you're in the right directory:**
   ```bash
   # Should show project files
   ls
   # or on Windows:
   dir
   ```

## Expected Behavior

When everything works, you should see:
- ✅ Terminal shows: "ready in xxx ms" and "Local: http://localhost:5173/"
- ✅ Browser shows your website (not blank page)
- ✅ No red errors in browser console
- ✅ Website loads and displays correctly
























