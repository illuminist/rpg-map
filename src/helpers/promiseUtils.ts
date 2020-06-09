export const sleep = (time: number = 0): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, time))
