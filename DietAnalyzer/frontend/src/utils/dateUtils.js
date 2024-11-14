import { format, addDays, subDays } from 'date-fns';

export const formatDate = (date) => {
  return format(date, 'MMM dd, yyyy');
};

export const getNextDay = (date) => {
  return addDays(date, 1);
};

export const getPreviousDay = (date) => {
  return subDays(date, 1);
};

export const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};