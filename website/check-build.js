#!/usr/bin/env node
/**
 * Build checker for DeepOptimizer website
 * Validates that all required files exist and have correct structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const errors = [];
const warnings = [];

// Check required files
const requiredFiles = [
  'index.html',
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'src/main.jsx',
  'src/App.jsx',
  'src/index.css',
];

const requiredComponents = [
  'src/components/Navigation.jsx',
  'src/components/Hero.jsx',
  'src/components/Features.jsx',
  'src/components/LiveDemo.jsx',
  'src/components/CodeExamples.jsx',
  'src/components/About.jsx',
  'src/components/Footer.jsx',
];

console.log('🔍 Checking DeepOptimizer Website Build...\n');

// Check required files
console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    errors.push(`Missing required file: ${file}`);
    console.log(`  ❌ ${file} - MISSING`);
  }
});

// Check components
console.log('\n🧩 Checking components...');
requiredComponents.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
    
    // Check for basic React structure
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('export default')) {
      warnings.push(`${file} might be missing default export`);
    }
    if (!content.includes('return')) {
      warnings.push(`${file} might be missing return statement`);
    }
  } else {
    errors.push(`Missing component: ${file}`);
    console.log(`  ❌ ${file} - MISSING`);
  }
});

// Check package.json
console.log('\n📦 Checking package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  // Check scripts
  const requiredScripts = ['dev', 'build', 'preview'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`  ✅ Script: ${script}`);
    } else {
      errors.push(`Missing script: ${script}`);
      console.log(`  ❌ Script: ${script} - MISSING`);
    }
  });
  
  // Check dependencies
  const requiredDeps = ['react', 'react-dom', 'react-router-dom'];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`  ✅ Dependency: ${dep}`);
    } else {
      errors.push(`Missing dependency: ${dep}`);
      console.log(`  ❌ Dependency: ${dep} - MISSING`);
    }
  });
} catch (e) {
  errors.push('Failed to parse package.json');
}

// Check index.html
console.log('\n📄 Checking index.html...');
try {
  const indexHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  if (indexHtml.includes('<div id="root">')) {
    console.log('  ✅ Root element found');
  } else {
    errors.push('Missing root element in index.html');
    console.log('  ❌ Root element missing');
  }
  
  if (indexHtml.includes('src="/src/main.jsx"')) {
    console.log('  ✅ Main script reference found');
  } else {
    warnings.push('Main script reference might be incorrect');
    console.log('  ⚠️  Main script reference might be incorrect');
  }
} catch (e) {
  errors.push('Failed to read index.html');
}

// Summary
console.log('\n' + '='.repeat(50));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ All checks passed! The website should build successfully.');
  console.log('\nTo build the website:');
  console.log('  1. npm install');
  console.log('  2. npm run build');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ Found ${errors.length} error(s):`);
    errors.forEach(error => console.log(`  - ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
    warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  console.log('\nPlease fix these issues before building.');
}

process.exit(errors.length > 0 ? 1 : 0);