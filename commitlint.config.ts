const Configuration = {
  extends: ['@commitlint/config-conventional'],
  ignores: [
    (message: string): boolean =>
      message.startsWith('chore: bump') || message.startsWith('Updating'),
  ], // Ignore dependabot commits
};

export default Configuration;
