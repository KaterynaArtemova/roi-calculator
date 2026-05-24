/**
 * InputForm — renders one scenario's set of four input fields.
 * Props:
 *   label       — string shown as the card heading (e.g. "Scenario 1")
 *   values      — { initialInvestment, monthlyRevenue, monthlyCosts, period }
 *   onChange    — function(field, value) called when any field changes
 *   accentColor — CSS color string used for the heading bar
 *   errors      — { initialInvestment, monthlyRevenue, monthlyCosts, period }
 *                 each key is either null (no error) or an error string
 */
export default function InputForm({ label, values, onChange, accentColor, errors = {} }) {
  function handle(field) {
    return (e) => {
      const raw = e.target.value;
      onChange(field, field === 'period' ? Number(raw) : Number(raw));
    };
  }

  function inputClass(field) {
    return `field-input${errors[field] ? ' field-input--error' : ''}`;
  }

  return (
    <div className="input-card" style={{ '--accent': accentColor }}>
      <div className="input-card-header" style={{ background: accentColor }}>
        {label}
      </div>
      <div className="input-card-body">

        {/* Initial Investment */}
        <div className="field-group">
          <label className="field-label">
            Initial Investment ($)
            <input
              type="number"
              className={inputClass('initialInvestment')}
              min="0"
              value={values.initialInvestment}
              onChange={handle('initialInvestment')}
            />
          </label>
          {errors.initialInvestment && (
            <p className="field-error">{errors.initialInvestment}</p>
          )}
        </div>

        {/* Monthly Revenue */}
        <div className="field-group">
          <label className="field-label">
            Expected Monthly Revenue ($)
            <input
              type="number"
              className={inputClass('monthlyRevenue')}
              min="0"
              value={values.monthlyRevenue}
              onChange={handle('monthlyRevenue')}
            />
          </label>
          {errors.monthlyRevenue && (
            <p className="field-error">{errors.monthlyRevenue}</p>
          )}
        </div>

        {/* Monthly Costs */}
        <div className="field-group">
          <label className="field-label">
            Monthly Operating Costs ($)
            <input
              type="number"
              className={inputClass('monthlyCosts')}
              min="0"
              value={values.monthlyCosts}
              onChange={handle('monthlyCosts')}
            />
          </label>
          {errors.monthlyCosts && (
            <p className="field-error">{errors.monthlyCosts}</p>
          )}
        </div>

        {/* Period — dropdown, always valid */}
        <div className="field-group">
          <label className="field-label">
            Calculation Period (months)
            <select
              className="field-input"
              value={values.period}
              onChange={handle('period')}
            >
              <option value={12}>12 months</option>
              <option value={24}>24 months</option>
              <option value={36}>36 months</option>
            </select>
          </label>
        </div>

      </div>
    </div>
  );
}
