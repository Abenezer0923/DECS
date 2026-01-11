import app from './app';
import { SchedulerService } from './services/schedulerService';

const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);

  // Initialize Cron Jobs
  SchedulerService.initCronJobs();
});
