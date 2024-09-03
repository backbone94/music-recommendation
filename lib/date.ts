export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const today = new Date();
  const isToday =
    today.getFullYear() === year &&
    today.getMonth() === date.getMonth() &&
    today.getDate() === date.getDate();

  const isSameYear = today.getFullYear() === year;

  if (isToday) {
    return `${hours}:${minutes}`;
  } else if (isSameYear) {
    return `${month}/${day} ${hours}:${minutes}`;
  } else {
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
};
