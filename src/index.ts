import { Worker } from 'worker_threads';

const n = process.argv[2] || 500;

const runService = (workerData: { n: number }) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('./dist/worker.js', {
            workerData
        });

        worker.on('message', resolve);
        worker.on('error', reject);
        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });
    });
}

const run = async () => {
    let timer = 0;
    const interval = setInterval(() => {
        timer++;
        console.log(`[${timer}s] Worker is working...`);
    }, 1000);

    const result = await runService({ n: +n });
    clearInterval(interval);
    console.log(result);
}

run().catch(error => console.error(error));