/**
 * Converts a duration in seconds to a readable format of seconds, minutes, or hours.
 */
export const formatDuration = (seconds: number) => {
  if (seconds < 60) {
    return `${seconds.toFixed(1)} ${seconds === 1 ? "second" : "seconds"}`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = parseFloat((seconds % 60).toFixed(1));
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"}${remainingSeconds > 0 ? ` ${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}` : ""}`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} ${hours === 1 ? "hour" : "hours"}${minutes > 0 ? ` ${minutes} ${minutes === 1 ? "minute" : "minutes"}` : ""}`;
  }
};
