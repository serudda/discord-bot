import fs from 'fs';
import path from 'path';

// Function to recursively get all .ts and .js files in a directory
export const getFilesRecursively = (dir: string): Array<string> => {
  let results: Array<string> = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat?.isDirectory()) {
      // Recursively search subdirectories
      results = results.concat(getFilesRecursively(filePath));
    } else if (file.endsWith('.ts') || file.endsWith('.js')) {
      results.push(filePath);
    }
  });

  return results;
};
