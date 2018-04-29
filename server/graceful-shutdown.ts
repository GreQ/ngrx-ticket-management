export function gracefulShutdown(app) {
  // Shutdown gracefully...
  process.on('uncaughtException', err => {
    console.log('something terribly wrong happened', err);
    app.close(() => process.exit(1));
  });

  return app;
}
