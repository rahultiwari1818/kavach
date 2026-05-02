import { client } from "../config/redis.config.js";

// Generate a random 6-digit OTP
function generateRandomOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Daily job to store and delete TestAliveOtp in Redis
export async function aliveOtpJob() {
  try {
    const testOtp = generateRandomOTP();
    const redisKey = "TestAliveOtp";
    
    // Store the OTP in Redis with a 10-second expiration
    await client.setEx(redisKey, 10, testOtp);
    
    console.log(`[${new Date().toISOString()}] Stored TestAliveOtp in Redis: ${testOtp}`);
    
    // Verify it was stored
    const storedOtp = await client.get(redisKey);
    console.log(`[${new Date().toISOString()}] Verified TestAliveOtp in Redis: ${storedOtp}`);
    
    console.log(`[${new Date().toISOString()}] TestAliveOtp will auto-expire in 10 seconds`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error in aliveOtpJob:`, error);
  }
}
