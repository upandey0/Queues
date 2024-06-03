import { Worker, RedisConnection } from 'bullmq';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';

// Create a Redis connection instance
const redisConnection = new RedisConnection({
  host: process.env.REDIS_HOST || 'localhost',
  port: 6379,
});

// Create the Worker instance and pass the RedisConnection instance
const worker = new Worker(
  'csv-credit',
  async (job) => {
    // Get the file data from the job
    const fileData = job.data.file;

    // Assuming the file is saved in the 'uploads' directory
    const filePath = path.join('uploads', fileData.filename);

    const results = [];

    // fs.createReadStream(filePath)
    //   .pipe(csvParser({ extension: path.extname(filePath) })) // Specify the file extension
    //   .on('data', (data) => {
    //     results.push(data);
    //   })
    //   .on('end', () => {
    //     console.log('CSV Stream ended');
    //   });

    // console.log(results[0]);

    // Clean up the uploaded file
    fs.unlinkSync(filePath);

    // Mark the job as completed
    return { status: 'completed' };
  },
  { connection: redisConnection }
);

// Start the worker
worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed`, err);
});

// Log when the worker is ready
worker.on('active', () => {
  console.log('Worker is active and processing jobs');
});

export default worker;