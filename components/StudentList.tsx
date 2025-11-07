import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { Download } from './icons';

interface StudentListProps {
  students: Student[];
  onStudentClick: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onStudentClick }) => {
  const [nameFilter, setNameFilter] = useState('');
  const [minPresenceFilter, setMinPresenceFilter] = useState(0);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const nameMatch = student.fullName.toLowerCase().includes(nameFilter.toLowerCase());
      const presenceMatch = student.presencePercentage >= minPresenceFilter;
      return nameMatch && presenceMatch;
    });
  }, [students, nameFilter, minPresenceFilter]);

  const handleExportCSV = () => {
    if (filteredStudents.length === 0) {
      alert("Nenhum dado para exportar com os filtros atuais.");
      return;
    }

    const headers = ["Nome Completo", "Email", "% Presença", "Status"];
    const rows = filteredStudents.map(student => [
      `"${student.fullName}"`,
      `"${student.email}"`,
      student.presencePercentage.toFixed(2),
      `"${student.status === 'good' ? 'Presença boa' : 'Abaixo da meta'}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lista_alunos_filtrada.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Lista de Alunos</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={nameFilter}
          onChange={e => setNameFilter(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:col-span-1"
        />
        <div className="md:col-span-1">
          <label htmlFor="presence-filter" className="block text-sm font-medium text-gray-300 mb-1">
            Presença mínima: {minPresenceFilter}%
          </label>
          <input
            id="presence-filter"
            type="range"
            min="0"
            max="100"
            value={minPresenceFilter}
            onChange={e => setMinPresenceFilter(Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
        <div className="md:col-span-1 flex items-end">
            <button
                onClick={handleExportCSV}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
                aria-label="Exportar lista de alunos para CSV"
            >
                <Download className="w-5 h-5" />
                <span>Exportar CSV</span>
            </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-3">Nome Completo</th>
              <th className="p-3 text-center">% Presença</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr 
                key={student.email} 
                className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onStudentClick(student)}
              >
                <td className="p-3 font-medium">{student.fullName}</td>
                <td className="p-3 text-center">
                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div 
                            className={`h-2.5 rounded-full ${student.status === 'good' ? 'bg-green-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${Math.min(student.presencePercentage, 100)}%` }}>
                        </div>
                    </div>
                    <span className="text-xs mt-1 block">{student.presencePercentage.toFixed(1)}%</span>
                </td>
                <td className="p-3 text-center">
                  {student.status === 'good' ? (
                    <span className="flex items-center justify-center gap-1 text-green-400">
                      ✅
                      <span className="hidden sm:inline">Presença boa</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-1 text-yellow-400">
                      ⚠️
                      <span className="hidden sm:inline">Abaixo da meta</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            Nenhum aluno encontrado com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;