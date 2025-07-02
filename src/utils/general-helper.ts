export const genericDateOnlyConvertor = function (model: any) {
  if (!model) return model;

  Object.keys(model).forEach((key) => {
    const value = model[key];

    // Only transform if it's specifically a Date
    if (value instanceof Date) {
      const year = model[key].getFullYear();
      const month = `${model[key].getMonth() + 1}`.padStart(2, '0');
      const day = `${model[key].getDate()}`.padStart(2, '0');
      model[key] = `${year}-${month}-${day}`;
    }
  });

  return model;
};

export const toDateOnly = function (date: any) {
  date = new Date(date);
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const toDateTime = function (date: any) {
  date = date?.toString() ?? '';
  date = new Date(date);
  return date;
};

// create a function that takes a UTC date and returns the date in local time
export const toLocalTime = function (date: any) {
  date = new Date(date);
  return date.toLocaleString();
};
