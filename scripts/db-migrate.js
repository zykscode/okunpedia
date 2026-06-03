import cp from 'node:child_process';

const res = cp.spawnSync('pnpm', ['run', 'db:migrate'], {
  stdio: 'inherit',
  shell: true,
});
process.exit(res.status ?? 0);
