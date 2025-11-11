import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import StudentList from "./components/StudentList";
import StudentDetailModal from "./components/StudentDetailModal";
import DietDashboard from "./components/DietDashboard";
import { Header } from "./components/Header";

const App: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [view, setView] = useState<"dashboard" | "students" | "diet">("dashboard");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const SHEET_ID = "1MdDoijE28-1ZH37EdL446H-u5IgqdmbZwYjGt20qPps";
    const API_KEY = "AIzaSyAyIXDSpOqgxzU4jBR86Lqb__CidW84dZg";
    const RANGE = "Dados!A:G";

    const fetchData = async () => {
      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`
        );
        const json = await res.json();

        if (!json.values || !Array.isArray(json.values)) {
          console.error("Nenhum dado encontrado na planilha.");
          setRecords([]);
          return;
        }

        const rows = json.values.slice(1);
        const newRecords = rows.map((row: string[]) => {
          const rawDate = row[0];
          const rawTreinoDate = row[3];
          const parsedDate = new Date(rawDate || rawTreinoDate);

          return {
            fullName: row[1] || "Desconhecido",
            trained: row[2] || "Não informado",
            trainingDate: row[3] || "Sem data",
            email: row[5] || "sem_email",
            diet: row[6] || "Não informado",
            dietPercent: Number((row[6] || "0").replace("%", "")) || 0,
            responseDate: isNaN(parsedDate.getTime()) ? null : parsedDate,
          };
        });

        setRecords(newRecords);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Navegação */}
      <div className="flex justify-center gap-4 p-4">
        <button
          onClick={() => setView("dashboard")}
          className={`px-4 py-2 rounded-lg ${
            view === "dashboard" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView("students")}
          className={`px-4 py-2 rounded-lg ${
            view === "students" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Alunos
        </button>
        <button
          onClick={() => setView("diet")}
          className={`px-4 py-2 rounded-lg ${
            view === "diet" ? "bg-blue-600 text-white" : "bg-white border"
          }`}
        >
          Dieta
        </button>
      </div>

      {/* Exibição condicional */}
      {loading ? (
        <div className="text-center text-gray-500 p-6">🔄 Carregando dados...</div>
      ) : records.length === 0 ? (
        <div className="text-center text-gray-500 p-6">⚠️ Nenhum dado encontrado.</div>
      ) : (
        <>
          {view === "dashboard" && <Dashboard records={records} />}
          {view === "students" && (
            <StudentList records={records} onSelect={setSelectedStudent} />
          )}
          {view === "diet" && <DietDashboard records={records} />}
        </>
      )}

      {/* Modal de detalhes */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default App;
