export const dateOnlyConvertor = function (model: any) {
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
