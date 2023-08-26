const getTodaysDate = () => {
  // Get today's date
  let todaysDate = new Date();
  const offset = todaysDate.getTimezoneOffset(); // this is to handle timezone differences
  todaysDate = new Date(todaysDate.getTime() - offset * 60 * 1000);
  todaysDate = todaysDate.toISOString().split('T')[0];

  return todaysDate;
};

module.exports = { getTodaysDate };
