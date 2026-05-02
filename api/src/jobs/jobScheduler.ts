import cron from "node-cron";
import { aliveOtpJob } from "./aliveOtpJob.js";

let scheduledJobs: cron.ScheduledTask[] = [];

export function initializeJobs() {
  try {
    // Schedule the job to run every day at midnight (00:00)
    // Cron expression: "0 0 * * *" means every day at midnight
    const job = cron.schedule("0 0 * * *", async () => {
      console.log(`[${new Date().toISOString()}] Running daily aliveOtpJob...`);
      await aliveOtpJob();
    });

    scheduledJobs.push(job);
    console.log("[Job Scheduler] Daily aliveOtpJob scheduled successfully");

    // Optional: Run the job immediately on startup for testing
    console.log("[Job Scheduler] Running aliveOtpJob on server startup...");
    aliveOtpJob().catch((err) =>
      console.error("Error running aliveOtpJob on startup:", err)
    );
  } catch (error) {
    console.error("[Job Scheduler] Error initializing jobs:", error);
  }
}

export function stopJobs() {
  scheduledJobs.forEach((job) => job.stop());
  console.log("[Job Scheduler] All jobs stopped");
}
