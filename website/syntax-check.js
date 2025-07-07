#!/usr/bin/env node
/**
 * Syntax checker for JSX files
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errors = [];

function checkJSXSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    // Basic syntax checks
    const issues = [];
    
    // Check for balanced braces
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      issues.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
    }
    
    // Check for balanced parentheses
    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      issues.push(`Unbalanced parentheses: ${openParens} open, ${closeParens} close`);
    }
    
    // Check for balanced JSX tags (simplified)
    const openTags = (content.match(/<[A-Za-z][^>]*>/g) || []).length;
    const closeTags = (content.match(/<\/[A-Za-z][^>]*>/g) || []).length;
    const selfClosing = (content.match(/<[A-Za-z][^>]*\/>/g) || []).length;
    
    // Check for common JSX errors
    if (content.includes('class=') && !content.includes('className=')) {
      issues.push('Found "class=" instead of "className="');
    }
    
    if (content.includes('for=') && !content.includes('htmlFor=')) {
      issues.push('Found "for=" instead of "htmlFor="');
    }
    
    // Check for export
    if (!content.includes('export default') && !content.includes('export {')) {
      issues.push('No export found');
    }
    
    if (issues.length > 0) {
      console.log(`\n❌ ${fileName}:`);
      issues.forEach(issue => console.log(`   - ${issue}`));
      errors.push(...issues.map(issue => `${fileName}: ${issue}`));
    } else {
      console.log(`✅ ${fileName}`);
    }
    
  } catch (e) {
    console.log(`❌ Error reading ${filePath}: ${e.message}`);
    errors.push(`Failed to read ${filePath}`);
  }
}

console.log('🔍 Checking JSX Syntax...\n');

// Get all JSX files
const jsxFiles = [
  'src/App.jsx',
  'src/main.jsx',
  ...fs.readdirSync(path.join(__dirname, 'src/components'))
    .filter(f => f.endsWith('.jsx'))
    .map(f => `src/components/${f}`)
];

jsxFiles.forEach(file => {
  checkJSXSyntax(path.join(__dirname, file));
});

// Check test files if they exist
const testDir = path.join(__dirname, 'src/__tests__');
if (fs.existsSync(testDir)) {
  console.log('\n🧪 Checking test files...\n');
  fs.readdirSync(testDir)
    .filter(f => f.endsWith('.jsx') || f.endsWith('.js'))
    .forEach(file => {
      checkJSXSyntax(path.join(testDir, file));
    });
}

console.log('\n' + '='.repeat(50));
if (errors.length === 0) {
  console.log('✅ No syntax errors found!');
} else {
  console.log(`\n❌ Found ${errors.length} potential issue(s).`);
  console.log('\nNote: These are basic checks. Run "npm run build" for complete validation.');
}