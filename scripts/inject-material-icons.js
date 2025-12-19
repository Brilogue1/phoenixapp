#!/usr/bin/env node

/**
 * Post-build script to inject Material Icons font into HTML files
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const distDir = 'dist-web';
const materialIconsLink = '<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />';

function injectMaterialIcons(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      injectMaterialIcons(fullPath);
    } else if (entry.name.endsWith('.html')) {
      let html = readFileSync(fullPath, 'utf8');
      
      // Only inject if not already present
      if (!html.includes('Material+Icons')) {
        html = html.replace('</head>', `${materialIconsLink}</head>`);
        writeFileSync(fullPath, html);
        console.log(`✓ Injected Material Icons into ${fullPath}`);
      }
    }
  }
}

console.log('Injecting Material Icons font into HTML files...');
injectMaterialIcons(distDir);
console.log('Done!');
