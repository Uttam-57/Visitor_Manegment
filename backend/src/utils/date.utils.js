export const normalizeDateOnly = (input) => {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
};

export const startOfDay = (input) => {
  const date = normalizeDateOnly(input);
  return date;
};

export const endOfDay = (input) => {
  const date = normalizeDateOnly(input);
  if (!date) return null;
  const end = new Date(date);
  end.setDate(end.getDate() + 1);
  end.setMilliseconds(end.getMilliseconds() - 1);
  return end;
};

export const isSameDay = (left, right) => {
  const leftDate = normalizeDateOnly(left);
  const rightDate = normalizeDateOnly(right);
  if (!leftDate || !rightDate) return false;
  return leftDate.getTime() === rightDate.getTime();
};

export const diffDays = (left, right) => {
  const leftDate = normalizeDateOnly(left);
  const rightDate = normalizeDateOnly(right);
  if (!leftDate || !rightDate) return null;
  const diffMs = leftDate.getTime() - rightDate.getTime();
  return Math.floor(diffMs / (24 * 60 * 60 * 1000));
};

export const buildDateRangeFilter = (field, from, to) => {
  const filter = {};
  const fromDate = from ? normalizeDateOnly(from) : null;
  const toDate = to ? normalizeDateOnly(to) : null;

  if (!fromDate && !toDate) return filter;

  filter[field] = {};
  if (fromDate) filter[field].$gte = fromDate;
  if (toDate) filter[field].$lte = toDate;
  return filter;
};
