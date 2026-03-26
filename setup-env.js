#!/usr/bin/env node

/**
 * Helper script to create .env file for EmailJS configuration
 * 
 * Usage:
 * 1. Get your EmailJS credentials (see QUICK_SETUP_EMAILJS.md)
 * 2. Run: node setup-env.js
 * 3. Enter your credentials when prompted
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n📧 EmailJS Environment Setup\n');
  console.log('Please enter your EmailJS credentials.');
  console.log('If you need help getting these, see QUICK_SETUP_EMAILJS.md\n');

  const serviceId = await question('EmailJS Service ID: ');
  const templateId = await question('EmailJS Template ID: ');
  const publicKey = await question('EmailJS Public Key: ');

  if (!serviceId || !templateId || !publicKey) {
    console.log('\n❌ Error: All fields are required!');
    rl.close();
    process.exit(1);
  }

  const envContent = `# EmailJS Configuration
# Generated automatically - do not commit this file to version control
VITE_EMAILJS_SERVICE_ID=${serviceId.trim()}
VITE_EMAILJS_TEMPLATE_ID=${templateId.trim()}
VITE_EMAILJS_PUBLIC_KEY=${publicKey.trim()}

# Supabase Configuration (Optional - for database storage)
# Uncomment and fill in if you want to use Supabase
# VITE_SUPABASE_URL=https://your-project-id.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key-here
`;

  const envPath = '.env';
  
  if (existsSync(envPath)) {
    const overwrite = await question(`\n⚠️  .env file already exists. Overwrite? (y/N): `);
    if (overwrite.toLowerCase() !== 'y') {
      console.log('\n❌ Cancelled. No changes made.');
      rl.close();
      process.exit(0);
    }
  }

  writeFileSync(envPath, envContent);
  console.log(`\n✅ Created ${envPath} file successfully!`);
  console.log('\n📝 Next steps:');
  console.log('   1. Restart your development server (Ctrl+C, then npm run dev)');
  console.log('   2. Test the contact form at http://localhost:5173/contact');
  console.log('   3. Check your email inbox for test messages\n');

  rl.close();
}

setup().catch((error) => {
  console.error('\n❌ Error:', error.message);
  rl.close();
  process.exit(1);
});
























