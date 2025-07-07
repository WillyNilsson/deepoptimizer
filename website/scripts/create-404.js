#!/usr/bin/env node
/**
 * Creates a 404.html file for GitHub Pages SPA support
 * This copies the built index.html to 404.html
 */

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distPath = join(process.cwd(), 'dist');
const indexPath = join(distPath, 'index.html');
const notFoundPath = join(distPath, '404.html');

try {
  const indexContent = readFileSync(indexPath, 'utf8');
  writeFileSync(notFoundPath, indexContent);
  console.log('✅ Created 404.html for GitHub Pages SPA support');
} catch (error) {
  console.error('❌ Failed to create 404.html:', error.message);
  process.exit(1);
}