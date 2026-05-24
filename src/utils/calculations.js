/**
 * Calculate all ROI metrics for a given scenario.
 */
export function calculateROI({ initialInvestment, monthlyRevenue, monthlyCosts, period }) {
  const monthlyNetProfit = monthlyRevenue - monthlyCosts;
  const totalNetProfit = monthlyNetProfit * period - initialInvestment;
  const roi = initialInvestment > 0 ? (totalNetProfit / initialInvestment) * 100 : 0;

  let paybackPeriod;
  if (monthlyNetProfit <= 0) {
    paybackPeriod = null; // "Never"
  } else {
    paybackPeriod = Math.ceil(initialInvestment / monthlyNetProfit);
  }

  return { monthlyNetProfit, totalNetProfit, roi, paybackPeriod };
}

/**
 * Build an array of { month, cashFlow } data points for the chart.
 */
export function buildChartData({ initialInvestment, monthlyRevenue, monthlyCosts, period }) {
  const monthlyNetProfit = monthlyRevenue - monthlyCosts;
  const data = [];
  for (let month = 1; month <= period; month++) {
    data.push({
      month,
      cashFlow: monthlyNetProfit * month - initialInvestment,
    });
  }
  return data;
}

/**
 * Format a number as a dollar string with commas, e.g. $1,234,567
 */
export function formatDollars(value) {
  return '$' + Math.round(value).toLocaleString('en-US');
}

/**
 * Validate a single scenario's inputs.
 * Returns an object with a key per field; value is an error string or null.
 * Also returns an `isValid` boolean — true only when all fields are error-free.
 *
 * Rules:
 *   - All numeric fields must be valid numbers > 0
 *   - initialInvestment must be >= 1000
 *   - monthlyRevenue must be > monthlyCosts
 */
export function validateScenario({ initialInvestment, monthlyRevenue, monthlyCosts, period }) {
  const errors = {
    initialInvestment: null,
    monthlyRevenue: null,
    monthlyCosts: null,
    period: null,
  };

  // initialInvestment
  if (initialInvestment === '' || initialInvestment === null || isNaN(initialInvestment)) {
    errors.initialInvestment = 'Please enter a valid number.';
  } else if (initialInvestment <= 0) {
    errors.initialInvestment = 'Initial investment must be greater than $0.';
  } else if (initialInvestment < 1000) {
    errors.initialInvestment = 'Initial investment must be at least $1,000.';
  }

  // monthlyRevenue
  if (monthlyRevenue === '' || monthlyRevenue === null || isNaN(monthlyRevenue)) {
    errors.monthlyRevenue = 'Please enter a valid number.';
  } else if (monthlyRevenue <= 0) {
    errors.monthlyRevenue = 'Monthly revenue must be greater than $0.';
  }

  // monthlyCosts
  if (monthlyCosts === '' || monthlyCosts === null || isNaN(monthlyCosts)) {
    errors.monthlyCosts = 'Please enter a valid number.';
  } else if (monthlyCosts <= 0) {
    errors.monthlyCosts = 'Monthly costs must be greater than $0.';
  }

  // Cross-field: revenue must exceed costs (only check if both are individually valid)
  if (!errors.monthlyRevenue && !errors.monthlyCosts && monthlyRevenue <= monthlyCosts) {
    errors.monthlyRevenue = 'Monthly revenue must be greater than monthly costs.';
  }

  const isValid = Object.values(errors).every((e) => e === null);
  return { errors, isValid };
}
