import { DropdownOption } from "@/interfaces";

/**
 * Calculate the approximate end time for speaking a given text based on the speaking speed.
 */
export const calculateEndTime = (text: string, startTime: string): string => {
  function timeToSeconds(time: string): number {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  function secondsToTime(seconds: number): string {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  // Estimate speaking speed - 150 words per minute (2.5 words per second)
  // Approximate 5 characters per word (including spaces and punctuation)
  const avgCharsPerSecond = 2.5 * 5;

  const numOfChars = text.length;

  const estimatedTimeInSeconds = numOfChars / avgCharsPerSecond;

  const startInSeconds = timeToSeconds(startTime);

  const endInSeconds = startInSeconds + estimatedTimeInSeconds;

  return secondsToTime(endInSeconds);
};

/**
 * Convert time string into seconds
 */
export const convertTimetoSeconds = (time: string): number => {
  var arr = time.split(":");
  var seconds = +arr[0] * 60 * 60 + +arr[1] * 60 + +arr[2];
  return seconds;
};

/**
 * Find and returns the parent dropdown menu/option.
 */
export const findParentDropdownOption = (
  subItemId: string,
  dropdownOptions: DropdownOption[],
) => {
  for (const dropdownOption of dropdownOptions) {
    const subItem = dropdownOption.subItems.find(
      (item) => item.id === subItemId,
    );
    if (subItem) {
      return dropdownOption;
    }
  }
  return null;
};
