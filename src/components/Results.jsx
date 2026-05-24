import { formatDollars } from '../utils/calculations';

/**
 * Results — shows one scenario's key metrics in a card.
 * Props:
 *   label        — e.g. "Scenario 1"
 *   metrics      — { roi, paybackPeriod, totalNetProfit, monthlyNetProfit }
 *   accentColor  — CSS color string for the heading bar
 */
export default function Results({ label, metrics, accentColor }) {
  const { roi, paybackPeriod, totalNetProfit, monthlyNetProfit } = metrics;

  const roiPositive = roi >= 0;
  const profitPositive = totalNetProfit >= 0;

  return (
    <div className="results-card">
      <div className="results-card-header" style={{ background: accentColor }}>
        {label} — Results
      </div>
      <div className="results-card-body">
        <div className="metric">
          <span className="metric-label">ROI</span>
          <span className={`metric-value ${roiPositive ? 'positive' : 'negative'}`}>
            {roi.toFixed(1)}%
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Payback Period</span>
          <span className="metric-value">
            {paybackPeriod === null ? 'Never' : `${paybackPeriod} months`}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Total Net Profit</span>
          <span className={`metric-value ${profitPositive ? 'positive' : 'negative'}`}>
            {formatDollars(totalNetProfit)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Monthly Net Profit</span>
          <span className={`metric-value ${monthlyNetProfit >= 0 ? 'positive' : 'negative'}`}>
            {formatDollars(monthlyNetProfit)}
          </span>
        </div>
      </div>
    </div>
  );
}
