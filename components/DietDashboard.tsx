import React from "react";

interface DietData {
  fullName: string;
  dietPercent: number;
}

interface Props {
  records: DietData[];
}

const DietDashboard: React.FC<Props> = ({ records }) => {
  if (!records || records.length === 0) {
    return (
      <div className="p-4 text-center text-gray-600">
        Nenhum dado de dieta disponível.
      </div>
    );
  }

  const average =
    records.reduce((acc, r) => acc + (r.dietPercent || 0), 0) / records.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Relatório de Dieta dos Alunos
        </h2>
        <p className="text-gray-600 mb-6">
          Média geral de adesão à dieta:{" "}
          <strong>{average.toFixed(1)}%</strong>
        </p>

        <table className="w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Aluno</th>
              <th className="border border-gray-300 p-2 text-center">
                % Dieta
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2">{r.fullName}</td>
                <td className="border border-gray-300 p-2 text-center">
                  {r.dietPercent ? `${r.dietPercent}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DietDashboard;
