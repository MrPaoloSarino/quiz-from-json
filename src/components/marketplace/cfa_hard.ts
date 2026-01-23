import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';

// Helper to generate questions
const createQuestion = (q: string, opts: string[], ans: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
});

// CFA Level 1-3 Hard Questions - Comprehensive 100 Items
const cfaEthicsQuestions: QuizQuestion[] = [
    createQuestion("According to CFA Institute Standard I(B) Independence and Objectivity, which situation would MOST likely compromise a member's independence?", ["Accepting a modest lunch from a client", "Receiving stock as compensation from an issuer being analyzed", "Attending an industry conference sponsored by a company", "Using research from an approved external provider"], "Receiving stock as compensation from an issuer being analyzed"),
    createQuestion("Under CFA Institute Standard III(B) Fair Dealing, when a firm changes its recommendation, it should:", ["Notify its largest clients first", "Disseminate the information to all clients simultaneously", "Contact institutional clients before retail clients", "Wait until all analysts agree before releasing"], "Disseminate the information to all clients simultaneously"),
    createQuestion("Which action would MOST likely violate Standard VI(B) Priority of Transactions?", ["A portfolio manager buying shares after client orders are filled", "An analyst disclosing personal holdings to the compliance department", "A broker executing a block trade for a pension fund", "An advisor recommending a stock they personally own with full disclosure"], "A portfolio manager buying shares after client orders are filled"),
    createQuestion("According to Standard V(A) Diligence and Reasonable Basis, an analyst must:", ["Only use primary research sources", "Have a reasonable and adequate basis for recommendations", "Update all models daily", "Never rely on third-party research"], "Have a reasonable and adequate basis for recommendations"),
    createQuestion("Soft dollar arrangements are MOST likely acceptable when:", ["Used to pay for office rent", "The research directly benefits clients", "Used to compensate the analyst personally", "Applied to reduce the firm's operating costs"], "The research directly benefits clients"),
    createQuestion("Under GIPS standards, which is required for composite construction?", ["Including all discretionary portfolios with similar strategies", "Only including the top-performing portfolios", "Excluding portfolios below a certain size", "Including only fee-paying clients"], "Including all discretionary portfolios with similar strategies"),
    createQuestion("A CFA charterholder discovers their firm is engaged in unethical practices. Their FIRST action should be:", ["Report immediately to the SEC", "Resign from the firm", "Attempt to remedy the situation through internal channels", "Notify the media"], "Attempt to remedy the situation through internal channels"),
    createQuestion("Which statement about the Asset Manager Code of Professional Conduct is LEAST accurate?", ["It requires managers to act in the best interest of clients", "It mandates specific compensation structures", "It promotes fair dealing among clients", "It requires disclosure of conflicts of interest"], "It mandates specific compensation structures"),
];

const cfaQuantitativeQuestions: QuizQuestion[] = [
    createQuestion("A stock has an expected return of 12% and a standard deviation of 20%. Assuming returns are normally distributed, the probability of a return less than -8% is closest to:", ["2.5%", "5%", "16%", "32%"], "16%"),
    createQuestion("The coefficient of variation is MOST useful when comparing:", ["Investments with different expected returns", "Investments with the same expected return", "Risk-free and risky investments only", "Only equity investments"], "Investments with different expected returns"),
    createQuestion("A time series exhibits a unit root. This indicates the series is:", ["Stationary", "Mean-reverting", "Non-stationary", "Heteroskedastic"], "Non-stationary"),
    createQuestion("In multiple regression, a high R-squared combined with insignificant t-statistics for coefficients suggests:", ["Perfect model specification", "Multicollinearity", "Heteroskedasticity", "Serial correlation"], "Multicollinearity"),
    createQuestion("The Durbin-Watson statistic is used to detect:", ["Multicollinearity", "Heteroskedasticity", "Serial correlation", "Non-normality"], "Serial correlation"),
    createQuestion("An analyst runs a regression and finds all residuals are positive for low fitted values and negative for high fitted values. This pattern suggests:", ["Multicollinearity", "Heteroskedasticity", "Model misspecification", "Serial correlation"], "Model misspecification"),
    createQuestion("Monte Carlo simulation is MOST appropriately used for:", ["Calculating a sample mean", "Valuing path-dependent options", "Testing for unit roots", "Constructing confidence intervals"], "Valuing path-dependent options"),
    createQuestion("The probability of a Type I error is also known as:", ["Power of the test", "Significance level (alpha)", "Beta risk", "Confidence level"], "Significance level (alpha)"),
    createQuestion("For a lognormally distributed variable, which statement is MOST accurate?", ["The variable can take any real value", "The natural log of the variable is normally distributed", "The mean equals the median", "Skewness is zero"], "The natural log of the variable is normally distributed"),
    createQuestion("In hypothesis testing, failing to reject a false null hypothesis is a:", ["Type I error", "Type II error", "Correct decision", "Power of the test"], "Type II error"),
];

const cfaEconomicsQuestions: QuizQuestion[] = [
    createQuestion("Under the Mundell-Fleming model with flexible exchange rates and perfect capital mobility, fiscal policy is:", ["Highly effective", "Completely ineffective", "Moderately effective", "Depends on trade balance"], "Completely ineffective"),
    createQuestion("The sacrifice ratio measures:", ["The cost of reducing inflation in terms of lost output", "The trade-off between unemployment and inflation", "The ratio of government debt to GDP", "The cost of currency intervention"], "The cost of reducing inflation in terms of lost output"),
    createQuestion("According to covered interest rate parity, if the domestic interest rate exceeds the foreign rate, the domestic currency should:", ["Trade at a forward premium", "Trade at a forward discount", "Appreciate in the spot market", "Remain unchanged"], "Trade at a forward discount"),
    createQuestion("Real Business Cycle theory attributes economic fluctuations primarily to:", ["Monetary policy shocks", "Technology and productivity shocks", "Government spending changes", "Consumer sentiment"], "Technology and productivity shocks"),
    createQuestion("The neutral interest rate is BEST described as:", ["The Fed funds rate", "The rate that neither stimulates nor restricts economic growth", "The yield on 10-year Treasuries", "The average historical interest rate"], "The rate that neither stimulates nor restricts economic growth"),
    createQuestion("Ricardian equivalence suggests that:", ["Government deficits crowd out private investment", "Consumers view government bonds as net wealth", "Tax cuts financed by borrowing have no effect on consumption", "Monetary policy is more effective than fiscal policy"], "Tax cuts financed by borrowing have no effect on consumption"),
    createQuestion("A country with a current account deficit MUST have:", ["A capital account surplus", "A fiscal deficit", "High inflation", "Trade barriers"], "A capital account surplus"),
    createQuestion("The J-curve effect describes:", ["Long-run improvement in trade balance following currency depreciation", "Initial worsening then improvement of trade balance after depreciation", "The relationship between interest rates and bond prices", "The yield curve shape during recession"], "Initial worsening then improvement of trade balance after depreciation"),
    createQuestion("Hyperinflation is typically caused by:", ["Supply shocks", "Excessive private sector borrowing", "Governments financing deficits by printing money", "Trade deficits"], "Governments financing deficits by printing money"),
    createQuestion("The Taylor Rule prescribes the target interest rate based on:", ["Only inflation", "Inflation and output gap", "Unemployment only", "Exchange rates and inflation"], "Inflation and output gap"),
];

const cfaFinancialReportingQuestions: QuizQuestion[] = [
    createQuestion("Under IFRS, an impairment loss on a held-to-maturity debt security:", ["Cannot be reversed", "Can be reversed through profit or loss", "Can only be reversed through OCI", "Must be reversed within one year"], "Can be reversed through profit or loss"),
    createQuestion("A company capitalizes interest during construction. This will MOST likely:", ["Decrease asset turnover in the short term", "Increase asset turnover in the short term", "Have no effect on asset turnover", "Decrease both numerator and denominator equally"], "Decrease asset turnover in the short term"),
    createQuestion("Under the temporal method for translating foreign subsidiaries, which items are translated at historical rates?", ["Current assets", "Fixed assets and equity", "Liabilities", "Revenue"], "Fixed assets and equity"),
    createQuestion("A company changes from LIFO to FIFO for inventory valuation. This change:", ["Requires retrospective application under IFRS", "Is reported prospectively under US GAAP", "Does not require disclosure", "Is prohibited under IFRS"], "Requires retrospective application under IFRS"),
    createQuestion("Operating lease classification under IFRS 16 results in:", ["No right-of-use asset on balance sheet", "Higher EBIT compared to finance lease", "Right-of-use asset and lease liability recognition", "Off-balance sheet treatment"], "Right-of-use asset and lease liability recognition"),
    createQuestion("Comprehensive income includes net income plus:", ["Dividends paid", "Other comprehensive income items", "Capital contributions", "Share buybacks"], "Other comprehensive income items"),
    createQuestion("A bond issued at a discount will have interest expense that:", ["Equals the coupon payment", "Is less than the coupon payment", "Exceeds the coupon payment", "Decreases over the life of the bond"], "Exceeds the coupon payment"),
    createQuestion("Under pension accounting, the projected benefit obligation (PBO) measures:", ["Benefits earned to date at current salary", "Benefits earned to date at projected future salary", "Only vested benefits", "Benefits for retirees only"], "Benefits earned to date at projected future salary"),
    createQuestion("Deferred tax assets are MOST likely to arise from:", ["Accelerated depreciation for tax", "Prepaid expenses", "Warranty provisions", "Installment sales"], "Warranty provisions"),
    createQuestion("The quality of earnings is LOWEST when:", ["Cash flow from operations exceeds net income", "Net income is driven by non-recurring items", "Revenue growth matches cash collection", "Conservative accounting policies are used"], "Net income is driven by non-recurring items"),
];

const cfaCorporateFinanceQuestions: QuizQuestion[] = [
    createQuestion("According to Modigliani-Miller with taxes, the value of a levered firm equals the unlevered value plus:", ["Interest payments", "Tax shield from debt", "Bankruptcy costs", "Agency costs"], "Tax shield from debt"),
    createQuestion("The pecking order theory suggests firms prefer financing in which order?", ["Debt, equity, retained earnings", "Retained earnings, debt, equity", "Equity, debt, retained earnings", "Equity, retained earnings, debt"], "Retained earnings, debt, equity"),
    createQuestion("In a leveraged buyout (LBO), returns to equity investors are enhanced by:", ["Using significant debt financing", "Minimizing operational improvements", "Avoiding synergies", "Retaining existing management only"], "Using significant debt financing"),
    createQuestion("The weighted average cost of capital (WACC) is MOST appropriately used to evaluate:", ["Projects with similar risk to the firm's average", "All capital budgeting projects", "Only equity-financed projects", "Only high-risk projects"], "Projects with similar risk to the firm's average"),
    createQuestion("A company's target capital structure minimizes:", ["The cost of equity", "The cost of debt", "The weighted average cost of capital", "Financial leverage"], "The weighted average cost of capital"),
    createQuestion("Dividend irrelevance theory assumes:", ["No taxes or transaction costs", "High tax rates on dividends", "Investor preference for dividends", "Market inefficiency"], "No taxes or transaction costs"),
    createQuestion("In an acquisition, the acquirer's stock price is MOST likely to increase when:", ["The deal is paid entirely in cash", "Significant synergies are expected", "A premium above market price is paid", "The target is larger than the acquirer"], "Significant synergies are expected"),
    createQuestion("Economic Value Added (EVA) is calculated as:", ["Net income minus dividends", "NOPAT minus capital charge", "Revenue minus all costs", "Gross profit minus depreciation"], "NOPAT minus capital charge"),
    createQuestion("Agency costs of equity include:", ["Monitoring costs and bonding costs", "Interest expense", "Dividend payments", "Depreciation expense"], "Monitoring costs and bonding costs"),
    createQuestion("The marginal cost of capital curve typically:", ["Slopes downward continuously", "Is flat throughout", "Slopes upward as capital needs increase", "Is U-shaped"], "Slopes upward as capital needs increase"),
];

const cfaEquityQuestions: QuizQuestion[] = [
    createQuestion("In the H-model for dividend discount valuation, the assumption is that:", ["Growth rate changes instantly", "Growth rate declines linearly to a stable rate", "Growth rate remains constant", "No dividends are paid initially"], "Growth rate declines linearly to a stable rate"),
    createQuestion("Enterprise Value (EV) is calculated as:", ["Market cap minus net debt", "Market cap plus net debt", "Book value of equity plus debt", "Market cap only"], "Market cap plus net debt"),
    createQuestion("A stock with a beta of 1.5 in a market with expected return of 10% and risk-free rate of 2% has an expected return of:", ["10%", "12%", "14%", "16%"], "14%"),
    createQuestion("The justified P/E ratio using the Gordon growth model is:", ["(1 - b) / (r - g)", "(1 + g) / (r - g)", "D1 / (P0 × r)", "E1 / (r - g)"], "(1 - b) / (r - g)"),
    createQuestion("Residual income valuation is MOST appropriate for:", ["Companies with negative book value", "Companies with predictable earnings and book value", "Start-up companies", "Cyclical companies"], "Companies with predictable earnings and book value"),
    createQuestion("Sum-of-the-parts valuation is MOST appropriate for:", ["Single-segment companies", "Conglomerates with diverse business units", "Start-up companies", "Declining industries"], "Conglomerates with diverse business units"),
    createQuestion("The sustainable growth rate equals:", ["ROE × retention ratio", "ROE × dividend payout", "Net income / equity", "Revenue growth rate"], "ROE × retention ratio"),
    createQuestion("Free cash flow to equity (FCFE) equals FCF to the firm minus:", ["Dividends", "Net borrowing and interest after tax", "Only capital expenditures", "Interest expense before tax minus net borrowing"], "Interest expense before tax minus net borrowing"),
    createQuestion("Porter's Five Forces analysis does NOT directly include:", ["Threat of new entrants", "Bargaining power of suppliers", "Macroeconomic conditions", "Competitive rivalry"], "Macroeconomic conditions"),
    createQuestion("A company trading below its asset-based value is MOST likely:", ["Overvalued", "A potential acquisition target", "Highly profitable", "In a growth industry"], "A potential acquisition target"),
];

const cfaFixedIncomeQuestions: QuizQuestion[] = [
    createQuestion("The option-adjusted spread (OAS) removes the effect of:", ["Credit risk", "Embedded options on spread", "Liquidity risk", "Interest rate risk"], "Embedded options on spread"),
    createQuestion("Effective duration is preferred over modified duration for bonds with:", ["No embedded options", "Fixed coupon payments", "Embedded options", "Zero coupons"], "Embedded options"),
    createQuestion("A bond's convexity measure indicates:", ["The linear relationship between yield and price", "How duration changes as yields change", "The credit spread over treasuries", "The accrued interest"], "How duration changes as yields change"),
    createQuestion("Key rate duration measures sensitivity to:", ["Parallel yield curve shifts", "Non-parallel yield curve changes", "Credit spread changes", "Currency movements"], "Non-parallel yield curve changes"),
    createQuestion("The Z-spread is calculated relative to:", ["The risk-free spot rate curve", "The government par curve", "A single benchmark yield", "LIBOR"], "The risk-free spot rate curve"),
    createQuestion("Negative convexity is a characteristic of:", ["Zero-coupon bonds", "Callable bonds when rates fall significantly", "Putable bonds", "Non-callable government bonds"], "Callable bonds when rates fall significantly"),
    createQuestion("In a riding the yield curve strategy, an investor profits when:", ["The yield curve remains unchanged", "Rates rise unexpectedly", "The yield curve inverts", "Credit spreads widen"], "The yield curve remains unchanged"),
    createQuestion("Credit default swaps (CDS) allow investors to:", ["Transfer interest rate risk", "Transfer credit risk", "Eliminate currency risk", "Reduce duration"], "Transfer credit risk"),
    createQuestion("The bootstrapping method is used to derive:", ["Forward rates from future rates", "Spot rates from par rates", "Par rates from spot rates", "Yield to maturity"], "Spot rates from par rates"),
    createQuestion("For a putable bond, as interest rates rise, the value of the put option:", ["Decreases", "Increases", "Remains unchanged", "Becomes negative"], "Increases"),
];

const cfaDerivativesQuestions: QuizQuestion[] = [
    createQuestion("Put-call parity for European options states:", ["C + X/(1+r)^T = P + S", "C + S = P + X/(1+r)^T", "C - P = S - X/(1+r)^T", "C × P = S × X"], "C - P = S - X/(1+r)^T"),
    createQuestion("A protective put strategy is equivalent to:", ["Short stock plus short call", "Long call plus lending", "Long stock plus long put", "Short put plus short call"], "Long stock plus long put"),
    createQuestion("Delta hedging requires:", ["Static positioning", "Continuous rebalancing as underlying price changes", "No adjustment once established", "Only at expiration"], "Continuous rebalancing as underlying price changes"),
    createQuestion("The value of a forward contract at initiation is:", ["The spot price", "The forward price", "Zero", "The cost of carry"], "Zero"),
    createQuestion("In an interest rate swap, the party receiving fixed and paying floating benefits when:", ["Rates rise", "Rates fall", "The yield curve flattens", "Credit spreads widen"], "Rates fall"),
    createQuestion("Gamma measures:", ["The rate of change of delta", "The sensitivity to time", "The sensitivity to volatility", "The rate of change of theta"], "The rate of change of delta"),
    createQuestion("A covered call strategy is MOST appropriate when the investor expects:", ["Large price increase", "Large price decrease", "Stable to modestly rising prices", "High volatility"], "Stable to modestly rising prices"),
    createQuestion("Vega measures an option's sensitivity to:", ["Changes in the underlying price", "Changes in volatility", "Time decay", "Interest rate changes"], "Changes in volatility"),
    createQuestion("The cost of carry model for futures prices assumes:", ["No storage costs or convenience yield", "Arbitrage opportunities exist", "Markets are inefficient", "Interest rates are zero"], "No storage costs or convenience yield"),
    createQuestion("A collar strategy combines:", ["Long put and long call", "Long put and short call with the same strike", "Long put and short call with different strikes", "Two long calls"], "Long put and short call with different strikes"),
];

const cfaPortfolioManagementQuestions: QuizQuestion[] = [
    createQuestion("The Sharpe ratio measures:", ["Total risk-adjusted return", "Systematic risk-adjusted return", "Absolute return", "Downside deviation"], "Total risk-adjusted return"),
    createQuestion("The information ratio measures:", ["Active return per unit of tracking risk", "Total return per unit of total risk", "Excess return over the risk-free rate", "Return attributed to market timing"], "Active return per unit of tracking risk"),
    createQuestion("Strategic asset allocation is BEST described as:", ["Daily rebalancing based on market conditions", "Long-term target weights based on investor objectives", "Tactical shifts based on short-term views", "Active security selection"], "Long-term target weights based on investor objectives"),
    createQuestion("The efficient frontier represents portfolios that:", ["Maximize return for a given level of risk", "Minimize risk regardless of return", "Have the highest Sharpe ratio", "Are equally weighted"], "Maximize return for a given level of risk"),
    createQuestion("Core-satellite investing combines:", ["Passive core with active satellite positions", "All active management", "All passive management", "Only alternative investments"], "Passive core with active satellite positions"),
    createQuestion("Risk budgeting involves:", ["Allocating capital based on expected return only", "Allocating risk to various strategies/positions", "Ignoring correlation between assets", "Maximizing leverage"], "Allocating risk to various strategies/positions"),
    createQuestion("Tactical asset allocation involves:", ["Permanent allocation shifts", "Short-term deviations from strategic weights", "Only rebalancing to original weights", "Passive index tracking"], "Short-term deviations from strategic weights"),
    createQuestion("The Treynor ratio differs from the Sharpe ratio by using:", ["Total volatility", "Systematic risk (beta)", "Downside deviation", "Tracking error"], "Systematic risk (beta)"),
    createQuestion("Liability-driven investing (LDI) is MOST relevant for:", ["Individual retail investors", "Pension funds with defined benefit obligations", "Hedge funds", "Venture capital funds"], "Pension funds with defined benefit obligations"),
    createQuestion("Factor investing systematically targets:", ["Random stock selection", "Specific risk premiums like value, momentum, size", "Only large-cap stocks", "Dividend-paying stocks only"], "Specific risk premiums like value, momentum, size"),
];

const cfaAlternativeInvestmentsQuestions: QuizQuestion[] = [
    createQuestion("The J-curve effect in private equity refers to:", ["Currency movements", "Initial negative returns followed by positive returns", "The yield curve shape", "Immediate positive returns"], "Initial negative returns followed by positive returns"),
    createQuestion("A fund of hedge funds provides:", ["Concentrated exposure", "Diversification across strategies and managers", "Direct investment in securities", "No fee layering"], "Diversification across strategies and managers"),
    createQuestion("Backfill bias in hedge fund returns causes:", ["Understated historical returns", "Overstated historical returns", "No effect on returns", "Lower volatility"], "Overstated historical returns"),
    createQuestion("The capitalization rate in real estate is calculated as:", ["NOI / Property Value", "Property Value / NOI", "Rental Income / Expenses", "Mortgage Payment / Property Value"], "NOI / Property Value"),
    createQuestion("Contango in commodity futures means:", ["Futures price < spot price", "Futures price > spot price", "Futures price = spot price", "Spot price is zero"], "Futures price > spot price"),
    createQuestion("Survivorship bias in hedge fund databases:", ["Understates returns", "Overstates returns", "Has no effect", "Understates volatility"], "Overstates returns"),
    createQuestion("The IRR is the preferred return measure for private equity because:", ["Cash flows are irregular and timing matters", "Returns are always positive", "It ignores the time value of money", "It is easier to calculate than MOIC"], "Cash flows are irregular and timing matters"),
    createQuestion("Real estate investment trusts (REITs) must distribute:", ["At least 90% of taxable income as dividends", "50% of income", "All capital gains", "No dividends required"], "At least 90% of taxable income as dividends"),
    createQuestion("A long-short equity hedge fund strategy aims to:", ["Bet only on rising stocks", "Reduce market exposure while profiting from stock selection", "Maximize leverage", "Track an index"], "Reduce market exposure while profiting from stock selection"),
    createQuestion("Drawdown measures:", ["Peak-to-trough decline in value", "Total return over a period", "Maximum gain", "Average return"], "Peak-to-trough decline in value"),
];

// Combine all CFA questions
const allCFAQuestions: QuizQuestion[] = [
    ...cfaEthicsQuestions,
    ...cfaQuantitativeQuestions,
    ...cfaEconomicsQuestions,
    ...cfaFinancialReportingQuestions,
    ...cfaCorporateFinanceQuestions,
    ...cfaEquityQuestions,
    ...cfaFixedIncomeQuestions,
    ...cfaDerivativesQuestions,
    ...cfaPortfolioManagementQuestions,
    ...cfaAlternativeInvestmentsQuestions,
];

export const cfaHardExamItem: MarketplaceItem = {
    id: 'cfa-hard-100',
    title: 'CFA Exam - Hard Level (100 Items)',
    description: 'Comprehensive CFA exam preparation covering all 10 topic areas: Ethics, Quantitative Methods, Economics, Financial Reporting, Corporate Finance, Equity, Fixed Income, Derivatives, Portfolio Management, and Alternative Investments. Designed for advanced candidates.',
    category: 'Education',
    author: 'Finance Pro Academy',
    downloads: 2150,
    rating: 4.9,
    price: 'Premium',
    content: allCFAQuestions
};
