
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Student } from '../types';
import { X } from './icons';

interface StudentDetailModalProps {
  student: Student;
  averagePresence: number;
  onClose: () => void;
}

const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ student, averagePresence, onClose }) => {
  const chartData = [
    { name: student.fullName.split(" ")[0], "% Presença": parseFloat(student.presencePercentage.toFixed(1)) },
    { name: 'Média Geral', "% Presença": parseFloat(averagePresence.toFixed(1)) },
  ];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 z-10 p-4 sm:p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{student.fullName}</h3>
            <p className="text-sm text-gray-400">{student.email}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-300">Total de Presenças</p>
              <p className="text-2xl font-bold">{student.score}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-300">% de Presença</p>
              <p className="text-2xl font-bold">{student.presencePercentage.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <p className="text-sm text-gray-300">Status</p>
              <p className={`text-2xl font-bold ${student.status === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>
                {student.status === 'good' ? 'Bom' : 'Atenção'}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Comparativo de Presença</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <XAxis type="number" stroke="#a0aec0" domain={[0, 100]}/>
                <YAxis type="category" dataKey="name" stroke="#a0aec0" width={80} />
                <Tooltip cursor={{fill: 'rgba(129, 140, 248, 0.1)'}} contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }}/>
                <Legend />
                <Bar dataKey="% Presença" fill="#818cf8" barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-2">Histórico de Presença</h4>
            <div className="max-h-60 overflow-y-auto bg-gray-900/50 p-3 rounded-lg">
              <ul className="space-y-2">
                {student.history.map((date, index) => (
                  <li key={index} className="text-gray-300 text-sm p-2 bg-gray-700 rounded-md">
                    {date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
