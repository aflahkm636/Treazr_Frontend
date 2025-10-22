export const getLastNDates = (n) => {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    dates.push(d.toISOString().split("T")[0]); // YYYY-MM-DD
  }
  return dates;
};
