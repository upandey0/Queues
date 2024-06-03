import { Queue } from 'bullmq';

const fileQueue = new Queue('csv-credit');

console.log('Producer')

const pushInQueue = async (fileData) => {
  const newItem = await fileQueue.add('data', { file: fileData });
  console.log(newItem.id);
};

export default pushInQueue;