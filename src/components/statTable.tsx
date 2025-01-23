import React from "react";
import { ScrollableTableProps } from "@/types/ScrollableTable";

const ScrollableTable: React.FC<ScrollableTableProps> = ({ data, months }) => {
  const totalRow = data.reduce((totals, row) => {
    months.forEach((month) => {
      totals[month] = (totals[month] || 0) + (row.monthlyData[month] || 0);
    });
    return totals;
  }, {} as { [key: string]: number });

  const totalSum = Object.values(totalRow).reduce((sum, val) => sum + val, 0);
  const averagePerMonth =
    data.reduce((sum, row) => sum + row.averagePerMonth, 0) / data.length;

  return (
    <div className="overflow-auto max-w-full max-h-[500px] ">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `200px 100px 150px repeat(${months.length}, minmax(100px, 1fr))`,
        }}
      >
        {/* Заголовок таблицы */}
        <div
          className="font-bold text-center p-2 border rounded-md border-[#428DC2] bg-blue-900 text-white  sticky top-0 z-20"
        >
          Name
        </div>
        <div
          className="font-bold text-center p-2 border rounded-md border-[#428DC2] bg-blue-900 text-white  sticky top-0 z-20"
        >
          Total
        </div>
        <div
          className="font-bold text-center p-2 border rounded-md border-[#428DC2] bg-blue-900 text-white  sticky top-0 z-20"
        >
          Average per month
        </div>
        {months.map((month) => (
          <div
            key={month}
            className="font-bold text-center p-2 border rounded-md border-[#428DC2] bg-blue-900 text-white  sticky top-0 z-20"
          >
            {month}
          </div>
        ))}

        {/* Итоговая строка (Amount) */}
        <div
          className="font-semibold text-center p-2 border rounded-md border-[#428DC2] dark:bg-gray-900 bg-gray-200 sticky top-[64px] z-10"
        >
          Amount
        </div>
        <div
          className="font-semibold text-center p-2 border rounded-md border-[#428DC2]  dark:bg-gray-900 bg-gray-200 sticky top-[64px] z-10"
        >
          {totalSum}
        </div>
        <div
          className="font-semibold text-center p-2 border rounded-md border-[#428DC2]  dark:bg-gray-900 bg-gray-200 sticky top-[64px] z-10"
        >
          {averagePerMonth.toFixed(1)}
        </div>
        {months.map((month) => (
          <div
            key={`total-${month}`}
            className="font-semibold text-center p-2 border rounded-md border-[#428DC2]  dark:bg-gray-900 bg-gray-200 sticky top-[64px] z-10"
          >
            {totalRow[month] || 0}
          </div>
        ))}

        {/* Данные */}
        {data.map((row) => (
          <React.Fragment key={row.name}>
            <div className="text-center text-sm p-2 border rounded-md border-gray-500">{row.name}</div>
            <div className="text-center p-2 border rounded-md border-gray-500">{row.total}</div>
            <div className="text-center p-2 border rounded-md border-gray-500">
              {row.averagePerMonth.toFixed(1)}
            </div>
            {months.map((month) => (
              <div
                key={`${row.name}-${month}`}
                className="text-center p-2 border rounded-md border-gray-500"
              >
                {row.monthlyData[month] || 0}
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ScrollableTable;
