import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { GradeComponent } from '../types/models';
import { CHART_COLORS } from '../constants';

interface GradeChartProps {
  components: GradeComponent[];
}

/**
 * Component for visualizing grade breakdown in a pie chart
 */
const GradeChart: React.FC<GradeChartProps> = ({ components }) => {
  if (components.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No grade components to display
        </p>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = components.map(component => ({
    name: component.name,
    value: component.weight,
    isCompleted: component.isCompleted,
    score: component.score,
    maxScore: component.maxScore,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium">{data.name}</p>
          <p>Weight: {data.value}%</p>
          {data.isCompleted ? (
            <p>Score: {data.score} / {data.maxScore} ({((data.score / data.maxScore) * 100).toFixed(1)}%)</p>
          ) : (
            <p>Status: Not completed</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            nameKey="name"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isCompleted ? CHART_COLORS.COMPLETED : CHART_COLORS.REMAINING}
                opacity={entry.isCompleted ? 1 : 0.7}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GradeChart;