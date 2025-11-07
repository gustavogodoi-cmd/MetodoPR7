
export interface AttendanceRecord {
  id: number;
  fullName: string;
  email: string;
  responseDate: Date;
}

export interface Student {
  fullName: string;
  email: string;
  score: number;
  presencePercentage: number;
  status: 'good' | 'low';
  history: Date[];
}

export interface TimeSeriesData {
  date: string;
  presences: number;
}
