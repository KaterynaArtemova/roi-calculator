import { useState } from 'react';
import InputForm from './components/InputForm';
import Results from './components/Results';
import CashFlowChart from './components/CashFlowChart';
import BreakdownTable from './components/BreakdownTable';
import { calculateROI, buildChartData, validateScenario } from './utils/calculations';
import './App.css';

// Theme: Corporate Blue (default)
const COLOR_1 = '#2563eb'; // blue — scenario 1
const COLOR_2 = '#f59e0b'; // amber — scenario 2

const DEFAULT_SCENARIO = {
  initialInvestment: 100000,
  monthlyRevenue: 15000,
  monthlyCosts: 5000,
  period: 12,
};

function App() {
  const [scenario1, setScenario1] = useState({ ...DEFAULT_SCENARIO });
  const [scenario2, setScenario2] = useState({ ...DEFAULT_SCENARIO, monthlyRevenue: 20000 });
  const [comparisonMode, setComparisonMode] = useState(false);

  function handleChange1(field, value) {
    setScenario1((prev) => ({ ...prev, [field]: value }));
  }

  function handleChange2(field, value) {
    setScenario2((prev) => ({ ...prev, [field]: value }));
  }

  function addScenario() {
    setComparisonMode(true);
  }

  function removeScenario() {
    setComparisonMode(false);
  }

  // ── Validation ────────────────────────────────────────
  const validation1 = validateScenario(scenario1);
  const validation2 = validateScenario(scenario2);

  // Results and chart are only shown when all active scenarios are valid
  const showResults = validation1.isValid && (!comparisonMode || validation2.isValid);

  // Safe fallback metrics/chart data (used while invalid to avoid crashes)
  const metrics1 = showResults ? calculateROI(scenario1) : null;
  const metrics2 = showResults && comparisonMode ? calculateROI(scenario2) : null;
  const chartData1 = showResults ? buildChartData(scenario1) : [];
  const chartData2 = showResults && comparisonMode ? buildChartData(scenario2) : null;

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1 className="app-title">ROI Calculator</h1>
        <p className="app-subtitle">Calculate and compare your business return on investment</p>
      </header>

      <main className="app-main">
        {/* ── INPUT SECTION ─────────────────────────────── */}
        <section className={`inputs-section ${comparisonMode ? 'inputs-section--comparison' : ''}`}>
          <InputForm
            label="Scenario 1"
            values={scenario1}
            onChange={handleChange1}
            accentColor={COLOR_1}
            errors={validation1.errors}
          />

          {comparisonMode ? (
            <div className="scenario2-wrapper">
              <InputForm
                label="Scenario 2"
                values={scenario2}
                onChange={handleChange2}
                accentColor={COLOR_2}
                errors={validation2.errors}
              />
              <button className="btn btn--remove" onClick={removeScenario}>
                ✕ Remove Scenario 2
              </button>
            </div>
          ) : (
            <div className="add-scenario-col">
              <button className="btn btn--add" onClick={addScenario}>
                + Add Scenario
              </button>
              <p className="add-scenario-hint">Compare two sets of numbers side by side</p>
            </div>
          )}
        </section>

        {/* ── RESULTS + CHART (only shown when valid) ───── */}
        {showResults ? (
          <>
            <section className={`results-section ${comparisonMode ? 'results-section--comparison' : ''}`}>
              <Results label="Scenario 1" metrics={metrics1} accentColor={COLOR_1} />
              {comparisonMode && (
                <Results label="Scenario 2" metrics={metrics2} accentColor={COLOR_2} />
              )}
            </section>

            <section className="chart-section">
              <CashFlowChart
                scenario1={chartData1}
                scenario2={chartData2}
                color1={COLOR_1}
                color2={COLOR_2}
                label1="Scenario 1"
                label2="Scenario 2"
              />
            </section>

            {/* ── MONTHLY BREAKDOWN TABLE(S) ───────────── */}
            <section className={`tables-section ${comparisonMode ? 'tables-section--comparison' : ''}`}>
              <BreakdownTable
                scenario={scenario1}
                label="Scenario 1"
                accentColor={COLOR_1}
              />
              {comparisonMode && (
                <BreakdownTable
                  scenario={scenario2}
                  label="Scenario 2"
                  accentColor={COLOR_2}
                />
              )}
            </section>
          </>
        ) : (
          <div className="validation-notice">
            <span className="validation-notice__icon">&#9888;</span>
            Please fix the errors above to see your results and chart.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
