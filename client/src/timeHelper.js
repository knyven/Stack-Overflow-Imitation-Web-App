// Array of month names to be used for formatting date.
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Calculates the time elapsed since a given date, and formats it into a human-readable string.
 *
 * @param {Date} date - The date from the past to measure against the current date.
 * @param {string} [type='question'] - The type of post (either 'question' or 'answer') to determine the action word.
 * @returns {Object} An object containing the formatted time string and a boolean indicating if "ago" should be appended.
 */
export const timeSince = (date, type = "question") => {
  // Check if 'date' is a valid Date object
  if (!(date instanceof Date)) {
    console.error("Invalid date passed to timeSince:", date);
    return { time: "Unknown time", addAgo: false };
  }

  const now = new Date(); // Current date and time
  const secondsPast = (now.getTime() - date.getTime()) / 1000; // Calculate the time difference in seconds

  // Determine the action word based on the type.
  let actionWord;
  switch (type) {
    case "question":
      actionWord = "asked";
      break;
    case "answer":
      actionWord = "answered";
      break;
    case "comment":
      actionWord = "commented";
      break;
    default:
      console.error("Invalid type passed to timeSince:", type);
      return { time: "Unknown time", addAgo: false };
  }

  // Check elapsed time and format it.
  if (secondsPast < 60) {
    return {
      time: `${actionWord} ${Math.round(secondsPast)} seconds`,
      addAgo: true,
    };
  }
  if (secondsPast < 3600) {
    return {
      time: `${actionWord} ${Math.round(secondsPast / 60)} minutes`,
      addAgo: true,
    };
  }
  if (secondsPast <= 86400) {
    return {
      time: `${actionWord} ${Math.round(secondsPast / 3600)} hours`,
      addAgo: true,
    };
  }

  // If more than a day has passed, format the date and time.
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear(); // Extracting the year
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return {
    time: `${actionWord} on ${month} ${day}, ${year} at ${hours}:${minutes}`,
    addAgo: false,
  };
};
