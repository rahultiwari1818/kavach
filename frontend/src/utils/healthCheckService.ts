import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

let healthCheckInterval: NodeJS.Timeout | null = null;

/**
 * Start the daily health check task
 * Calls the backend health endpoint every day at a specified interval
 */
export function startDailyHealthCheck() {
  if (healthCheckInterval) {
    console.log("[HealthCheck] Daily health check is already running");
    return;
  }

  // Call health check immediately on start
  performHealthCheck();

  // Set up interval to run every 24 hours (86400000 ms)
  healthCheckInterval = setInterval(() => {
    performHealthCheck();
  }, 24 * 60 * 60 * 1000); // 24 hours in milliseconds

  console.log("[HealthCheck] Daily health check started");
}

/**
 * Stop the daily health check task
 */
export function stopDailyHealthCheck() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
    console.log("[HealthCheck] Daily health check stopped");
  }
}

/**
 * Perform a single health check API call
 */
async function performHealthCheck() {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000, // 10 second timeout
    });

    console.log(`[${new Date().toISOString()}] Health Check Success:`, response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `[${new Date().toISOString()}] Health Check Failed:`,
        error.message
      );
    } else {
      console.error(
        `[${new Date().toISOString()}] Health Check Error:`,
        error
      );
    }
  }
}

/**
 * Manual health check - can be called anytime to check server status
 */
export async function manualHealthCheck() {
  return performHealthCheck();
}
