import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AttendanceRecord, Student, TimeSeriesData } from './types';
import { generateNewRecord } from './services/mockDataService';
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
    const RANGE = "Dados!A:G"; // 7 colunas

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

        const rows = json.values.slice(1); // ignora cabeçalho

        const newRecords = rows
          .map((row: string[]) => {
            const rawDate = row[0]; // Carimbo de data/hora
            const rawTreinoDate = row[3]; // Data do treino
            const parsedDate = new Date(rawDate || rawTreinoDate);

            if (isNaN(parsedDate.getTime())) {
              console.warn("⚠️ Data inválida ignorada:", rawDate, rawTreinoDate);
              return null;
            }

            return {
              fullName: row[1] || "Desconhecido",        // Nome do aluno
              trained: row[2] || "Não informado",         // Treinou hoje?
              trainingDate: row[3] || "Sem data",         // Data do treino
              email: row[5] || "sem_email",               // Endereço de e-mail
              diet: row[6] || "Não informado",            // Fez a dieta hoje?
              responseDate: parsedDate,                   // Data convertida
            };
          })
          .filter((record): record is AttendanceRecord => record !== null);

        console.log("📄 Dados da planilha recebidos:", json.values);
        console.log("✅ Registros convertidos:", newRecords);

        setRecords(newRecords);
      } catch (error) {
        console.error("Erro ao buscar dados da planilha:", error);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const addNewRecord = useCallback(() => {
    const newRecord = generateNewRecord();
    setRecords(prevRecords =>
      [...prevRecords, newRecord].sort(
        (a, b) => a.responseDate.getTime() - b.responseDate.getTime()
      )
    );
  }, []);

  const processedData = useMemo(() => {
    const studentData: { [key: string]: { presences: number; history: Date[]; trainedDays: number; dietDays: number } } = {};

    for (const record of records) {
      const email = record.email;
      if (!studentData[email]) {
        studentData[email] = { presences: 0, trainedDays: 0, dietDays: 0, history: [] };
      }

      if (record.trained?.toLowerCase() === "sim") {
        studentData[email].trainedDays += 1;
      }

      if (record.diet?.toLowerCase() === "sim") {
        studentData[email].dietDays += 1;
      }

      studentData[email].presences += 1;
      studentData[email].history.push(record.responseDate);
    }

    const students: Student[] = Object.entries(studentData)
      .map(([email, data]): Student => {
        const fullName = records.find(r => r.email === email)?.fullName || 'N/A';
        const presencePercentage = (data.presences / TOTAL_CLASSES) * 100;
        return {
          fullName,
          email,
          score: data.presences,
          presencePercentage,
          status: presencePercentage >= 75 ? 'good' : 'low',
          history: data.history.sort((a, b) => b.getTime() - a.getTime()),
        };
      })
      .sort((a, b) => b.score - a.score);

    const totalStudents = students.length;
    const totalPresences = records.length;

    const totalTrainedToday = records.filter(r => r.trained?.toLowerCase() === "sim").length;
    const totalDietToday = records.filter(r => r.diet?.toLowerCase() === "sim").length;

    const averagePresence =
      totalStudents > 0
        ? students.reduce((acc, s) => acc + s.presencePercentage, 0) /
          totalStudents
        : 0;

    const top5Students = students.slice(0, 5);

    const presencesOverTime: { [key: string]: number } = {};
    records.forEach(record => {
      if (!record.responseDate) return;
      const dateStr = record.responseDate.toISOString().split('T')[0];
      if (!presencesOverTime[dateStr]) {
        presencesOverTime[dateStr] = 0;
      }
      presencesOverTime[dateStr]++;
    });

    const timeSeriesData: TimeSeriesData[] = Object.entries(presencesOverTime)
      .map(([date, presences]) => ({ date, presences }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      students,
      totalStudents,
      totalPresences,
      totalTrainedToday,
      totalDietToday,
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
            totalStudents={processedData.totalStudents}
            averagePresence={processedData.averagePresence}
            totalTrainedToday={processedData.totalTrainedToday}
            totalDietToday={processedData.totalDietToday}
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
