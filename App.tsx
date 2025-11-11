import React, { useState, useMemo, useEffect } from 'react';
import { AttendanceRecord, Student } from './types';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentDetailModal from './components/StudentDetailModal';
import { Header } from './components/Header';
import DietDashboard from './components/DietDashboard';

const App: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [view, setView] = useState<'dashboard' | 'students' | 'dietas'>('dashboard');
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

        const newRecords = rows.map((row: string[]) => {
          const rawDate = row[0]; // Carimbo de data/hora (A)
          const treinoDate = row[3]; // Data do treino (D)
          const raw = (rawDate || treinoDate || "").trim();

          const parseDate = (dateStr: string | undefined): Date | null => {
            if (!dateStr) return null;
            const s = dateStr.trim();

            // Formato brasileiro dd/mm/yyyy ou dd/mm/yyyy hh:mm:ss
            if (s.includes('/')) {
              const [datePart, timePart] = s.split(' ');
              const [day, month, year] = datePart.split(/[\/\-]/).map(Number);
              const [hour, minute, second] = timePart ? timePart.split(':').map(Number) : [0, 0, 0];
              const d = new Date(year, month - 1, day, hour, minute, second || 0);
              return isNaN(d.getTime()) ? null : d;
            }

            const d = new Date(s);
            return isNaN(d.getTime()) ? null : d;
          };

          const parsedDate = parseDate(raw);

          return {
            fullName: row[1] || "Desconhecido",  // Nome do aluno (B)
            trained: row[2] || "Não informado",   // Treinou hoje? (C)
            trainingDate: row[3] || "Sem data",   // Data do treino (D)
            email: row[5] || "sem_email",         // Endereço de e-mail (F)
            diet: row[6] || "0",                  // Fez a dieta hoje? (G)
            responseDate: parsedDate,             // Data convertida
          };
        }).filter(Boolean) as AttendanceRecord[];

        setRecords(newRecords);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, []);

  // Média de dieta por aluno
  const dietStats = useMemo(() => {
    const stats: { [name: string]: { total: number; count: number } } = {};
    records.forEach(r => {
      const name = r.fullName.trim();
      const dietValue = parseFloat(r.diet.replace('%', '').trim()) || 0;
      if (!stats[name]) stats[name] = { total: 0, count: 0 };
      stats[name].total += dietValue;
      stats[name].count += 1;
    });
    return Object.entries(stats).map(([name, data]) => ({
      name,
      avg: (data.total / data.count).toFixed(1)
    }));
  }, [records]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header view={view} setView={setView} />
      <main className="p-4">
        {view === 'dashboard' && <Dashboard records={records} />}
        {view === 'students' && (
          <StudentList records={records} onSelect={setSelectedStudent} />
        )}
        {view === 'dietas' && <DietDashboard dietStats={dietStats} />}
      </main>
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          records={records.filter(r => r.fullName === selectedStudent.name)}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default App;
