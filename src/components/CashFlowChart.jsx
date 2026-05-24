import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { formatDollars } from '../utils/calculations';

/**
 * Merges two scenario data arrays into a single array keyed by month.
 * scenario2Data is optional (comparison mode).
 */
function mergeData(scenario1Data, scenario2Data) {
  const map = {};
  scenario1Data.forEach(({ month, cashFlow }) => {
    map[month] = { month, s1: cashFlow };
  });
  if (scenario2Data) {
    scenario2Data.forEach(({ month, cashFlow }) => {
      if (map[month]) {
        map[month].s2 = cashFlow;
      } else {
        map[month] = { month, s2: cashFlow };
      }
    });
  }
  return Object.values(map).sort((a, b) => a.month - b.month);
}

function tooltipFormatter(value) {
  return [formatDollars(value), 'Cash Flow'];
}

/**
 * CashFlowChart
 * Props:
 *   scenario1      — array of { month, cashFlow }
 *   scenario2      — (optional) array of { month, cashFlow }
 *   color1         — line color for scenario 1
 *   color2         — line color for scenario 2
 *   label1         — legend label for scenario 1
 *   label2         — legend label for scenario 2
 */
export default function CashFlowChart({ scenario1, scenario2, color1, color2, label1, label2 }) {
  const data = mergeData(scenario1, scenario2 || null);
  const isComparison = Boolean(scenario2);

  // Determine a reasonable Y-axis tick formatter
  const tickFormatter = (v) => {
    if (Math.abs(v) >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (Math.abs(v) >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
    return `$${v}`;
  };

  return (
    <div className="chart-card">
      <div className="chart-title">Cumulative Cash Flow</div>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data} margin={{ top: 10, right: 24, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            label={{ value: 'Month', position: 'insideBottomRight', offset: -8, fontSize: 12 }}
            tick={{ fontSize: 12 }}
          />
          <YAxis tickFormatter={tickFormatter} tick={{ fontSize: 11 }} width={70} />
          <Tooltip
            formatter={(value, name) => [formatDollars(value), name]}
            contentStyle={{ fontSize: 13 }}
          />
          {isComparison && <Legend />}
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="5 5" label={{ value: 'Break-even', fontSize: 11, fill: '#6b7280' }} />
          <Line
            type="monotone"
            dataKey="s1"
            name={label1}
            stroke={color1}
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 5 }}
          />
          {isComparison && (
            <Line
              type="monotone"
              dataKey="s2"
              name={label2}
              stroke={color2}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              strokeDasharray="6 3"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
