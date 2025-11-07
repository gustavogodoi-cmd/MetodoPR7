import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AttendanceRecord, Student, TimeSeriesData } from './types';
import { generateInitialData, generateNewRecord } from './services/mockDataService';
import { TOTAL_CLASSES } from './constants';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentDetailModal from './components/StudentDetailModal';
import { Header } from './components/Header';

const App: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [view, setView] = useState<'dashboard' | 'students'>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
  const SHEET_ID = "1MdDoijE28-1ZH37EdL446H-u5IgqdmbZwYjGt20qPps";
  const API_KEY = "AIzaSyAyIXDSpOqgxzU4jBR86Lqb__CidW84dZg";
  const RANGE = "Dados"!A:E"; // ajuste o nome da aba se for diferente

  const fetchData = async () => {
    try {
      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
      );
      const json = await res.json();

      if (!json.values) {
        console.error("Nenhum dado encontrado na planilha.");
        return;
      }

      // Estrutura esperada: [Timestamp, Nome, Email, Presente]
      const rows = json.values.slice(1); // ignora cabeçalho

      const newRecords = rows.map((row: string[]) => ({
        fullName: row[1] || "Desconhecido",
        email: row[2] || "sem_email",
        responseDate: new Date(row[0]),
      }));

      setRecords(newRecords);
    } catch (error) {
      console.error("Erro ao buscar dados da planilha:", error);
    }
  };

  fetchData();

  // Atualiza a cada 60 segundos (opcional)
  const interval = setInterval(fetchData, 60000);
  return () => clearInterval(interval);
}, []);

  const addNewRecord = useCallback(() => {
    const newRecord = generateNewRecord();
    setRecords(prevRecords => [...prevRecords, newRecord].sort((a, b) => a.responseDate.getTime() - b.responseDate.getTime()));
  }, []);

  const processedData = useMemo(() => {
    const studentData: { [key: string]: { score: number; history: Date[] } } = {};

    for (const record of records) {
      if (!studentData[record.email]) {
        studentData[record.email] = { score: 0, history: [] };
      }
      studentData[record.email].score += 1;
      studentData[record.email].history.push(record.responseDate);
    }

    // FIX: Explicitly type the return of the map function to 'Student' to prevent type widening on the 'status' property.
    const students: Student[] = Object.entries(studentData).map(([email, data]): Student => {
      const fullName = records.find(r => r.email === email)?.fullName || 'N/A';
      const presencePercentage = (data.score / TOTAL_CLASSES) * 100;
      return {
        fullName,
        email,
        score: data.score,
        presencePercentage,
        status: presencePercentage >= 75 ? 'good' : 'low',
        history: data.history.sort((a, b) => b.getTime() - a.getTime()),
      };
    }).sort((a, b) => b.score - a.score);

    const totalPresences = records.length;
    const totalStudents = students.length;
    const averagePresence = totalStudents > 0 ? students.reduce((acc, s) => acc + s.presencePercentage, 0) / totalStudents : 0;
    
    const top5Students = students.slice(0, 5);
    
    const presencesOverTime: { [key: string]: number } = {};
    records.forEach(record => {
        const dateStr = record.responseDate.toISOString().split('T')[0];
        if (!presencesOverTime[dateStr]) {
            presencesOverTime[dateStr] = 0;
        }
        presencesOverTime[dateStr]++;
    });

    const timeSeriesData: TimeSeriesData[] = Object.entries(presencesOverTime)
      .map(([date, presences]) => ({ date, presences }))
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    return {
      students,
      totalPresences,
      totalStudents,
      averagePresence,
      top5Students,
      timeSeriesData,
    };
  }, [records]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header 
        onAddNewRecord={addNewRecord} 
        currentView={view} 
        onSetView={setView}
      />
      <main className="p-4 sm:p-6 md:p-8">
        {view === 'dashboard' && (
          <Dashboard
            totalPresences={processedData.totalPresences}
            averagePresence={processedData.averagePresence}
            totalStudents={processedData.totalStudents}
            topStudents={processedData.top5Students}
            studentsData={processedData.students}
            timeSeriesData={processedData.timeSeriesData}
            onStudentClick={(student) => setSelectedStudent(student)}
          />
        )}
        {view === 'students' && (
          <StudentList
            students={processedData.students}
            onStudentClick={(student) => setSelectedStudent(student)}
          />
        )}
      </main>
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          averagePresence={processedData.averagePresence}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default App;
