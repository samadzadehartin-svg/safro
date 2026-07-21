import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const source = path.join(root, 'public');
const output = path.join(root, 'dist');

if (!existsSync(source)) {
  throw new Error('Missing public directory.');
}

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });

const deploymentInfo = {
  app: 'safro-uiux',
  version: '8.4-immersive-20260721',
  gitCommit: process.env.VERCEL_GIT_COMMIT_SHA || null,
  gitBranch: process.env.VERCEL_GIT_COMMIT_REF || null,
  builtAt: new Date().toISOString(),
};

await writeFile(
  path.join(output, 'deploy-version.json'),
  JSON.stringify(deploymentInfo, null, 2) + '\n',
  'utf8',
);

console.log(`Prepared static Vercel output in ${output}`);
console.log(`Safro version: ${deploymentInfo.version}`);
