import { useState } from 'react';
import { formatDollars } from '../utils/calculations';

/**
 * BreakdownTable
 * Props:
 *   scenario        — { initialInvestment, monthlyRevenue, monthlyCosts, period }
 *   label           — heading string, e.g. "Scenario 1"
 *   accentColor     — CSS color for the header bar
 */
export default function BreakdownTable({ scenario, label, accentColor }) {
  const [visible, setVisible] = useState(false);

  const { initialInvestment, monthlyRevenue, monthlyCosts, period } = scenario;
  const monthlyNetProfit = monthlyRevenue - monthlyCosts;

  // Build one row per month
  const rows = [];
  let breakEvenMonth = null;
  for (let month = 1; month <= period; month++) {
    const cumulative = monthlyNetProfit * month - initialInvestment;
    if (breakEvenMonth === null && cumulative >= 0) {
      breakEvenMonth = month;
    }
    rows.push({ month, monthlyRevenue, monthlyCosts, monthlyNetProfit, cumulative });
  }

  return (
    <div className="breakdown-wrapper">
      {/* Toggle button */}
      <button
        className="btn btn--toggle"
        style={{ borderColor: accentColor, color: accentColor }}
        onClick={() => setVisible((v) => !v)}
      >
        {visible ? '▲ Hide Table' : '▼ Show Monthly Breakdown'}
        {label ? ` — ${label}` : ''}
      </button>

      {/* Table (collapsed by default) */}
      {visible && (
        <div className="breakdown-table-card">
          <div className="breakdown-table-header" style={{ background: accentColor }}>
            Monthly Breakdown — {label}
          </div>
          <div className="breakdown-table-scroll">
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Monthly Revenue</th>
                  <th>Monthly Costs</th>
                  <th>Net Profit</th>
                  <th>Cumulative Cash Flow</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ month, monthlyNetProfit, cumulative }) => {
                  const isBreakEven = month === breakEvenMonth;
                  const rowClass = isBreakEven
                    ? 'row-breakeven'
                    : month % 2 === 0
                    ? 'row-even'
                    : 'row-odd';
                  return (
                    <tr key={month} className={rowClass}>
                      <td className="col-month">
                        {month}
                        {isBreakEven && (
                          <span className="breakeven-badge">Break-even</span>
                        )}
                      </td>
                      <td>{formatDollars(monthlyRevenue)}</td>
                      <td>{formatDollars(monthlyCosts)}</td>
                      <td className={monthlyNetProfit >= 0 ? 'val-positive' : 'val-negative'}>
                        {formatDollars(monthlyNetProfit)}
                      </td>
                      <td className={cumulative >= 0 ? 'val-positive' : 'val-negative'}>
                        {formatDollars(cumulative)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
