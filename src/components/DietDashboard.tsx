import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

interface DietDashboardProps {
  dietStats: { name: string; avg: string }[];
}

const DietDashboard: React.FC<DietDashboardProps> = ({ dietStats }) => {
  const sorted = [...dietStats].sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">📊 Ranking de Dieta</h2>

      <div className="w-full h-96">
        <ResponsiveContainer>
          <BarChart data={sorted}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-30} textAnchor="end" height={70} />
            <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="avg" fill="#4ade80">
              <LabelList dataKey="avg" position="top" formatter={(v) => `${v}%`} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow rounded-xl p-4">
        <h3 className="text-xl font-semibold mb-3">Lista de Alunos</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Aluno</th>
              <th className="p-2 text-right">Média de Dieta</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-2">{d.name}</td>
                <td className="p-2 text-right font-semibold">{d.avg}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DietDashboard;
