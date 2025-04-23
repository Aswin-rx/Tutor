// Script to run the seed courses file
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the seed file
const seedFilePath = path.join(__dirname, 'seedCourses.js');

console.log('Starting to seed sample courses...');

// Execute the seed file
exec(`node ${seedFilePath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing seed file: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Seed file stderr: ${stderr}`);
    return;
  }
  
  console.log(`Seed file output: ${stdout}`);
  console.log('Sample courses have been added successfully!');
});