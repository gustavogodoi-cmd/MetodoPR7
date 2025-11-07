
import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Student, TimeSeriesData } from '../types';
import Card from './Card';
import { Users, CheckCircle, Percent, Award } from './icons';

interface DashboardProps {
  totalPresences: number;
  averagePresence: number;
  totalStudents: number;
  topStudents: Student[];
  studentsData: Student[];
  timeSeriesData: TimeSeriesData[];
  onStudentClick: (student: Student) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  totalPresences,
  averagePresence,
  totalStudents,
  topStudents,
  studentsData,
  timeSeriesData,
  onStudentClick
}) => {
  const chartData = studentsData.map(s => ({
    name: s.fullName.split(' ')[0],
    "% Presença": parseFloat(s.presencePercentage.toFixed(1)),
  })).sort((a,b) => b["% Presença"] - a["% Presença"]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 text-white p-2 border border-gray-600 rounded">
          <p className="font-bold">{label}</p>
          <p className="text-indigo-400">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total de Presenças" value={totalPresences.toString()} icon={<CheckCircle className="w-8 h-8 text-green-400" />} />
        <Card title="Média Geral de Presença" value={`${averagePresence.toFixed(1)}%`} icon={<Percent className="w-8 h-8 text-blue-400" />} />
        <Card title="Alunos Ativos" value={totalStudents.toString()} icon={<Users className="w-8 h-8 text-yellow-400" />} />
        <Card title="Aluno Destaque" value={topStudents.length > 0 ? topStudents[0].fullName : 'N/A'} icon={<Award className="w-8 h-8 text-indigo-400" />} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Presença por Aluno (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="name" stroke="#a0aec0" fontSize={12} />
              <YAxis stroke="#a0aec0" fontSize={12} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(129, 140, 248, 0.1)'}} />
              <Legend />
              <Bar dataKey="% Presença" fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Top 5 Alunos Mais Assíduos</h3>
          <ul className="space-y-3">
            {topStudents.map((student, index) => (
              <li key={student.email} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-700 cursor-pointer" onClick={() => onStudentClick(student)}>
                <div className="flex items-center">
                  <span className={`font-bold mr-3 ${index < 3 ? 'text-yellow-400' : 'text-gray-400'}`}>{index + 1}</span>
                  <p>{student.fullName}</p>
                </div>
                <span className="font-semibold text-indigo-400">{student.presencePercentage.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
       <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Evolução da Presença</h3>
           <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#4a5568"/>
                 <XAxis dataKey="date" stroke="#a0aec0" fontSize={12} tickFormatter={(str) => new Date(str).toLocaleDateString('pt-BR', {month: 'short', day: 'numeric'})} />
                 <YAxis stroke="#a0aec0" fontSize={12} />
                 <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4a5568' }} labelStyle={{color: '#e5e7eb'}} />
                 <Legend />
                 <Line type="monotone" dataKey="presences" name="Presenças" stroke="#818cf8" strokeWidth={2} dot={{r: 2}} activeDot={{r: 6}} />
            </LineChart>
           </ResponsiveContainer>
       </div>
    </div>
  );
};

export default Dashboard;
