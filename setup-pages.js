import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.join(process.cwd(), 'project', 'next-app', 'src', 'components');
const appDir = path.join(process.cwd(), 'project', 'next-app', 'src', 'app');

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    const fullPath = path.join(componentsDir, file);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (!content.startsWith('"use client";') && !content.startsWith("'use client';")) {
      fs.writeFileSync(fullPath, '"use client";\n' + content);
    }
  }
});

const pages = [
  { path: '', comp: 'Home' },
  { path: 'explore', comp: 'Explore' },
  { path: 'about', comp: 'About' },
  { path: 'contact', comp: 'Contact' },
  { path: 'admin', comp: 'Admin' },
  { path: 'privacy-policy', comp: 'Privacy' },
  { path: 'terms-of-service', comp: 'Terms' },
  { path: 'shipping-policy', comp: 'Shipping' },
  { path: 'return-refund-policy', comp: 'Return' }
];

pages.forEach(p => {
  const dir = p.path ? path.join(appDir, p.path) : appDir;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'page.tsx');
  fs.writeFileSync(file, `import ${p.comp} from '@/components/${p.comp}';\n\nexport default function Page() {\n  return <${p.comp} />;\n}\n`);
});

console.log('Pages setup complete.');
