import { processNextJob } from "../src/lib/jobs";

async function loop() {
  while (true) {
    try {
      const job = await processNextJob();

      if (!job) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("[worker] job processing failed", error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

loop().catch((error) => {
  console.error("[worker] fatal error", error);
  process.exit(1);
});
