"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Plugin,
} from "chart.js";
import { useMemo, useState } from "react";
import { Line } from "react-chartjs-2";

import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/domain";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

type AssetChartProps = {
  transactions: Transaction[];
  title?: string;
  accentColor?: string;
  backgroundColor?: string;
  lineColor?: string;
  buttonColor?: string;
  secondaryButtonColor?: string;
  showSecondaryButtonShadow?: boolean;
};

type RangeKey = "1m" | "3m" | "6m" | "1y" | "all";

const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "1m", label: "1 month" },
  { key: "3m", label: "3 months" },
  { key: "6m", label: "6 months" },
  { key: "1y", label: "1 year" },
  { key: "all", label: "All time" },
];

const RANGE_MONTHS: Record<Exclude<RangeKey, "all">, number> = {
  "1m": 1,
  "3m": 3,
  "6m": 6,
  "1y": 12,
};

const startOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

const startOfMonth = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), 1);

const endOfMonth = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth() + 1, 0);

const addMonthsAtMonthStart = (value: Date, months: number) =>
  new Date(value.getFullYear(), value.getMonth() + months, 1);

const toDateKey = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateRangeLabels = (start: Date, end: Date) => {
  const labels: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    labels.push(toDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return labels;
};

const createChartAreaBackgroundPlugin = (
  fillStyle: string,
): Plugin<"line"> => ({
  id: "chartAreaBackground",
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.fillRect(
      chartArea.left,
      chartArea.top,
      chartArea.width,
      chartArea.height,
    );
    ctx.restore();
  },
});

export default function AssetChart({
  transactions,
  title = "Net Cash Flow",
  lineColor,
}: AssetChartProps) {
  const [selectedRange, setSelectedRange] = useState<RangeKey>("1m");
  const [anchorMonth, setAnchorMonth] = useState<Date>(
    startOfMonth(new Date()),
  );

  const parsedTransactions = useMemo(
    () =>
      transactions
        .map((transaction) => {
          const transactionDate = new Date(transaction.date);
          return Number.isNaN(transactionDate.getTime())
            ? null
            : {
                ...transaction,
                parsedDate: startOfDay(transactionDate),
              };
        })
        .filter(
          (transaction): transaction is Transaction & { parsedDate: Date } =>
            transaction !== null,
        ),
    [transactions],
  );

  const earliestTransactionMonth = useMemo(() => {
    if (parsedTransactions.length === 0) {
      return startOfMonth(new Date());
    }

    const minTime = parsedTransactions.reduce(
      (acc, tx) => Math.min(acc, tx.parsedDate.getTime()),
      Infinity,
    );

    return startOfMonth(new Date(minTime));
  }, [parsedTransactions]);

  const latestTransactionMonth = useMemo(() => {
    if (parsedTransactions.length === 0) {
      return startOfMonth(new Date());
    }

    const maxTime = parsedTransactions.reduce(
      (acc, tx) => Math.max(acc, tx.parsedDate.getTime()),
      -Infinity,
    );

    return startOfMonth(new Date(maxTime));
  }, [parsedTransactions]);

  const { labels, netData, startDate, endDate } = useMemo(() => {
    const startDate =
      selectedRange === "all"
        ? earliestTransactionMonth
        : startOfMonth(
            addMonthsAtMonthStart(
              anchorMonth,
              -(RANGE_MONTHS[selectedRange] - 1),
            ),
          );

    const endDate =
      selectedRange === "all"
        ? endOfMonth(latestTransactionMonth)
        : endOfMonth(anchorMonth);

    const labelsInRange = getDateRangeLabels(startDate, endDate);
    const netByDate = new Map<string, number>();

    for (const transaction of parsedTransactions) {
      if (
        transaction.parsedDate < startDate ||
        transaction.parsedDate > endDate
      ) {
        continue;
      }

      const key = toDateKey(transaction.parsedDate);
      const currentValue = netByDate.get(key) ?? 0;
      const delta =
        transaction.type === "income"
          ? transaction.amount
          : -transaction.amount;

      netByDate.set(key, currentValue + delta);
    }

    const values = labelsInRange.map((label) =>
      netByDate.has(label) ? (netByDate.get(label) as number) : null,
    );

    return {
      labels: labelsInRange,
      netData: values,
      startDate,
      endDate,
    };
  }, [
    anchorMonth,
    earliestTransactionMonth,
    latestTransactionMonth,
    parsedTransactions,
    selectedRange,
  ]);

  const handleRangeChange = (range: RangeKey) => {
    setSelectedRange(range);

    if (range !== "all") {
      setAnchorMonth(startOfMonth(new Date()));
    }
  };

  const handleStep = (direction: "prev" | "next") => {
    if (selectedRange === "all") {
      return;
    }

    const stepMonths = RANGE_MONTHS[selectedRange];
    const delta = direction === "prev" ? -stepMonths : stepMonths;
    setAnchorMonth((prev) => addMonthsAtMonthStart(prev, delta));
  };

  const chartAreaBackground = "rgba(255,255,255,0.3)";

  const data: ChartData<"line"> = {
    labels,
    datasets: [
      {
        label: "Net Flow",
        data: netData,
        spanGaps: true,
        borderColor: lineColor ?? "#4F46E5",
        backgroundColor: lineColor ? `${lineColor}4D` : "rgba(79,70,229,0.3)", // 4D is ~0.3 opacity in hex
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const chartAreaBackgroundPlugin = useMemo(
    () => createChartAreaBackgroundPlugin(chartAreaBackground),
    [chartAreaBackground],
  );

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
          color: "rgba(255,255,255,0.7)",
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(255,255,255,0.7)",
        },
        grid: {
          color: "rgba(255,255,255,0.1)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
        text: title,
      },
    },
  };

  return (
    <div className="rounded-lg mt-8 p-4 glass">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={selectedRange === "all"}
          onClick={() => handleStep("prev")}
        >
          {"<"}
        </Button>
        <div className="text-center">
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-xs text-white/60">
            {toDateKey(startDate)} - {toDateKey(endDate)}
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={selectedRange === "all"}
          onClick={() => handleStep("next")}
        >
          {">"}
        </Button>
      </div>

      <div className="h-[350px]">
        <Line
          data={data}
          options={options}
          plugins={[chartAreaBackgroundPlugin]}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {RANGE_OPTIONS.map((range) => (
          <Button
            key={range.key}
            type="button"
            variant="ghost"
            size="sm"
            isActive={selectedRange === range.key}
            onClick={() => handleRangeChange(range.key)}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
