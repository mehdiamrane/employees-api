export const logCronExecution = (message: string): void => {
  const timestamp = new Date().toISOString();
  console.log(`[CRON ${timestamp}] ${message}`);
};

export const logServerStatus = (port: number): void => {
  console.log(`JSON Server is running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
};
