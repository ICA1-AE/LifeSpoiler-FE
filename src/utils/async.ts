// Utility function to add delay between async operations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Process items in parallel with rate limiting
export async function processInParallelWithRateLimit<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  delayMs: number = 300
): Promise<R[]> {
  let lastCallTime = 0;
  
  // Create an array of processor functions with rate limiting
  const processors = items.map((item, index) => async () => {
    // Calculate delay needed since last API call
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;
    const delayNeeded = Math.max(0, delayMs - timeSinceLastCall);
    
    if (delayNeeded > 0) {
      await delay(delayNeeded);
    }
    
    lastCallTime = Date.now();
    return processor(item, index);
  });
  
  // Process all items in parallel with rate limiting
  const results = await Promise.all(processors.map(proc => proc()));
  return results;
}