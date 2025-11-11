import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DietDashboardProps {
  studentsData: {
    fullName: string;
    email: string;
    diet?: string;
  }[];
}

/**
 * DietDashboard — exibe um gráfico de barras com a porcentagem média de dieta dos alunos
 * e uma lista ordenada do ranking.
 */
const DietDashboard: React.FC<DietDashboardProps> = ({ studentsData }) => {
  // 🧮 Processa os dados e converte em número (ex: "80%" -> 80)
  const dietData = studentsData
    .map((student) => {
      let dietValue = 0;

      if (student.diet) {
        const clean = student.diet.toString().trim().replace("%", "");
        const parsed = parseFloat(clean);

        if (!isNaN(parsed)) {
          dietValue = parsed;
        } else {
          // Se for resposta textual (ex: "sim", "não"), trata como 100 ou 0
          const low = student.diet.toLowerCase();
          dietValue =
            low.includes("sim") || low.includes("100") ? 100 :
            low.includes("90") ? 90 :
            low.includes("80") ? 80 :
            low.includes("70") ? 70 :
            low.includes("60") ? 60 :
            low.includes("50") ? 50 :
            0;
        }
      }

      return {
        fullName: student.fullName,
        email: student.email,
        dietValue,
      };
    })
    .filter((s) => s.dietValue > 0);

  // 🔝 Ordena por maior porcentagem
  const ranked = [...dietData].sort((a, b) => b.dietValue - a.dietValue);

  // 📊 Dados para gráfico
  const chartData = ranked.map((r) => ({
    name: r.fullName.split(" ")[0], // só o primeiro nome no gráfico
    value: r.dietValue,
  }));

  // Média geral da dieta
  const avg =
    dietData.length > 0
      ? dietData.reduce((sum, s) => sum + s.dietValue, 0) / dietData.length
      : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-green-400">
        🥗 Desempenho na Dieta
      </h2>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-lg mb-3 text-gray-300">
            Média geral:{" "}
            <span className="font-semibold text-green-400">
              {avg.toFixed(1)}%
            </span>
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.1)" }}
                contentStyle={{
                  background: "#1f2937",
                  border: "1px solid #374151",
                  color: "#f9fafb",
                }}
              />
              <Bar dataKey="value" fill="#22c55e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <h3 className="text-lg mb-4 text-gray-300 font-semibold">
            🏆 Ranking de disciplina alimentar
          </h3>
          <ul className="space-y-2">
            {ranked.map((r, index) => (
              <li
                key={r.email}
                className="flex justify-between items-center border-b border-gray-700 pb-1"
              >
                <span className="text-gray-200">
                  {index + 1}. {r.fullName}
                </span>
                <span className="text-green-400 font-medium">
                  {r.dietValue}%
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default DietDashboard;
