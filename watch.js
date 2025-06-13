import chokidar from 'chokidar';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('👀 Watching for changes...');
console.log('Files being watched: posts/, templates/, build.js');

// Initial build
console.log('🔨 Initial build...');
try {
  await execAsync('npm run build');
  console.log('✅ Initial build complete');
} catch (error) {
  console.error('❌ Initial build failed:', error.message);
}

// Watch for changes
const watcher = chokidar.watch(['posts/**/*.md', 'templates/**/*.html', 'build.js'], {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

let isBuilding = false;

watcher.on('change', async (path) => {
  if (isBuilding) return;
  
  console.log(`📝 File changed: ${path}`);
  isBuilding = true;
  
  try {
    console.log('🔨 Rebuilding...');
    await execAsync('npm run build');
    console.log('✅ Rebuild complete');
  } catch (error) {
    console.error('❌ Rebuild failed:', error.message);
  } finally {
    isBuilding = false;
  }
});

watcher.on('add', async (path) => {
  if (isBuilding) return;
  
  console.log(`➕ New file added: ${path}`);
  isBuilding = true;
  
  try {
    console.log('🔨 Rebuilding...');
    await execAsync('npm run build');
    console.log('✅ Rebuild complete');
  } catch (error) {
    console.error('❌ Rebuild failed:', error.message);
  } finally {
    isBuilding = false;
  }
});

console.log('Ready! Make changes to your posts or templates and watch the magic happen! ✨');
console.log('Press Ctrl+C to stop watching');
