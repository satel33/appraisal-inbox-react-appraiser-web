import { DefinedRange } from 'materialui-daterange-picker';
import addDays from 'date-fns/addDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addWeeks from 'date-fns/addWeeks';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import startOfDay from 'date-fns/startOfDay';
import endOfDay from 'date-fns/endOfDay';

const getDefaultRanges = (date: Date): DefinedRange[] => [
  {
    label: 'Last Month',
    startDate: startOfMonth(addMonths(date, -1)),
    endDate: endOfMonth(addMonths(date, -1)),
  },
  {
    label: 'Last Week',
    startDate: startOfWeek(addWeeks(date, -1)),
    endDate: endOfWeek(addWeeks(date, -1)),
  },
  {
    label: 'Yesterday',
    startDate: addDays(date, -1),
    endDate: addDays(date, -1),
  },
  {
    label: 'Today',
    startDate: date,
    endDate: endOfDay(date),
  },
  {
    label: 'Tomorrow',
    startDate: addDays(date, 1),
    endDate: addDays(date, 1),
  },
  {
    label: 'This Week',
    startDate: startOfWeek(date),
    endDate: endOfWeek(date),
  },
  {
    label: 'This Month',
    startDate: startOfMonth(date),
    endDate: endOfMonth(date),
  },
];
export const defaultRanges = getDefaultRanges(startOfDay(new Date()));
