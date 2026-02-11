import { format, parse, startOfDay, endOfDay, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, isAfter, differenceInDays } from 'date-fns';
import { de } from 'date-fns/locale';

// Format helpers
export const formatDate = (dateString: string): string => {
  const date = parse(dateString, 'yyyy-MM-dd', new Date());
  return format(date, 'PPP', { locale: de });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'PPpp', { locale: de });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'HH:mm', { locale: de });
};

// Date conversion helpers
export const getTodayString = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};

export const getDateString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const getWeekDays = (): string[] => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => getDateString(addDays(weekStart, i)));
};

export const getMonthDays = (date: Date = new Date()): string[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  
  return eachDayOfInterval({
    start: monthStart,
    end: monthEnd,
  }).map(d => getDateString(d));
};

export const getWeekDaysWithLabels = (): { date: string; label: string; isToday: boolean }[] => {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const days = [];

  for (let i = 0; i < 7; i++) {
    const date = addDays(weekStart, i);
    const dateStr = getDateString(date);
    days.push({
      date: dateStr,
      label: format(date, 'EEE', { locale: de }),
      isToday: isToday(date),
    });
  }

  return days;
};

export const getMonthDaysGrid = (date: Date = new Date()): (string | null)[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(monthStart);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  
  const gridStart = startOfDay(weekStart);
  const gridEnd = endOfDay(endOfWeek(monthEnd, { weekStartsOn: 1 }));

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  
  return days.map(d => {
    if (isAfter(d, monthEnd) || isBefore(d, monthStart)) {
      return null;
    }
    return getDateString(d);
  });
};

// Streak calculation
export const calculateStreak = (completions: Map<string, boolean>, endDate: string): number => {
  let streak = 0;
  let date = new Date(endDate);

  while (completions.get(getDateString(date))) {
    streak++;
    date = addDays(date, -1);
  }

  return streak;
};

export const calculateLongestStreak = (completions: Map<string, boolean>, allDates: string[]): number => {
  let maxStreak = 0;
  let currentStreak = 0;

  for (const dateStr of allDates) {
    if (completions.get(dateStr)) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return maxStreak;
};

// Period calculations
export const getLastNDays = (n: number): string[] => {
  const days = [];
  const today = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    days.push(getDateString(addDays(today, -i)));
  }

  return days;
};

export const getLastNMonths = (n: number): string[] => {
  const months = [];
  const today = new Date();
  
  for (let i = 0; i < n; i++) {
    const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
    months.push(format(date, 'yyyy-MM', { locale: de }));
  }

  return months;
};

// Comparison helpers
export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

export const isDateInWeek = (date: string, weekDate: string): boolean => {
  const checkDate = new Date(date);
  const weekDateObj = new Date(weekDate);
  const weekStart = startOfWeek(weekDateObj, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  
  return isAfter(checkDate, startOfDay(weekStart)) && isBefore(checkDate, endOfDay(weekEnd));
};

export const isDateInMonth = (date: string, monthDate: string): boolean => {
  const checkDate = new Date(date);
  const dateObj = new Date(monthDate);
  const monthStart = startOfMonth(dateObj);
  const monthEnd = endOfMonth(monthStart);
  
  return isAfter(checkDate, startOfDay(monthStart)) && isBefore(checkDate, endOfDay(monthEnd));
};

export const daysSinceDate = (dateStr: string): number => {
  const date = new Date(dateStr);
  return differenceInDays(new Date(), date);
};
