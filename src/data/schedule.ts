// Sampled verbatim from the "Workout Schedule" table on
// https://efn.co.ke/fitness-studio/ ("Stay on Track, Stay Fit").
// This is the exact static schedule the live site currently hardcodes —
// the thing Phase 1 of the Encore proposal replaces with a DB-backed,
// staff-editable version. Kept here as the seed data for that migration.

export interface ScheduleSession {
  time: string;
  label: string; // "Morning" | "Evening" | a fixed time like "9am"
  className: string;
}

export interface ScheduleDay {
  day: string;
  sessions: ScheduleSession[];
}

export const schedule: ScheduleDay[] = [
  { day: 'Monday', sessions: [
    { time: '6am – 7am', label: 'Morning', className: 'Aerobics' },
    { time: '6pm – 7pm', label: 'Evening', className: 'Hiit' },
  ]},
  { day: 'Tuesday', sessions: [
    { time: '6am – 7am', label: 'Morning', className: 'CrossFit' },
    { time: '6pm – 7pm', label: 'Evening', className: 'Katabox' },
  ]},
  { day: 'Wednesday', sessions: [
    { time: '6am – 7am', label: 'Morning', className: 'Circuit' },
    { time: '6pm – 7pm', label: 'Evening', className: 'Circuit' },
  ]},
  { day: 'Thursday', sessions: [
    { time: '6am – 7am', label: 'Morning', className: 'Aerobics / Vitalis' },
    { time: '6pm – 7pm', label: 'Evening', className: 'Steps' },
  ]},
  { day: 'Friday', sessions: [
    { time: '6am – 7am', label: 'Morning', className: 'Zumba' },
    { time: '6pm – 7pm', label: 'Evening', className: 'CrossFit' },
  ]},
  { day: 'Saturday', sessions: [
    { time: '9am', label: '', className: 'Bootcamp' },
    { time: '11am – 4pm', label: '', className: 'Yoga/Boxing' },
  ]},
];
