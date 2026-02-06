import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';

const createQuestion = (q: string, opts: string[], ans: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
});

// CFA Beginner Fundamentals - 100 Items
// Original beginner-focused questions designed to require:
// - concept identification (The What)
// - application of a rule/formula (The How)
// plus plausible single-error distractors and light red herrings.

const ethics: QuizQuestion[] = [
    createQuestion(
        "An analyst is offered a paid speaking slot ($500) by a small-cap issuer they currently cover. The event is next month and the analyst’s report is due tomorrow. Which action BEST preserves independence and objectivity?",
        [
            'Accept the payment because it is modest',
            'Accept but disclose to clients in the report footnote',
            'Decline or seek firm approval and ensure compensation does not create a conflict',
            'Accept if the issuer is not currently recommended',
        ],
        'Decline or seek firm approval and ensure compensation does not create a conflict'
    ),
    createQuestion(
        "A portfolio manager learns from a friend (a company employee) that a major product recall will be announced tomorrow. The manager has not traded yet. What should the manager do FIRST under the prohibition on material nonpublic information?",
        [
            'Sell the position immediately before the market closes',
            'Place the security on the restricted list and inform compliance',
            'Tell only the largest clients so they can protect themselves',
            'Wait for confirmation from another source and then trade',
        ],
        'Place the security on the restricted list and inform compliance'
    ),
    createQuestion(
        "A client states: “I need $20,000 per year in withdrawals for 10 years and I cannot tolerate a year with negative returns.” Which recommendation is MOST suitable?",
        [
            '100% equities because long horizons reduce risk',
            'A diversified portfolio emphasizing capital preservation and liquidity',
            'A concentrated growth stock portfolio to “beat inflation”',
            'Any portfolio is suitable as long as expected return is high',
        ],
        'A diversified portfolio emphasizing capital preservation and liquidity'
    ),
    createQuestion(
        "A firm is changing a recommendation from “Buy” to “Sell.” The research director wants to email top clients first “as a courtesy.” Under fair dealing, the firm should:",
        [
            'Email top clients first, then retail clients later',
            'Release the change to all clients at the same time through the normal distribution channel',
            'Post the change only on social media to make it public',
            'Wait until markets close so no one can trade on it',
        ],
        'Release the change to all clients at the same time through the normal distribution channel'
    ),
    createQuestion(
        "A marketing flyer shows a 3-year annualized return of 12% for a strategy, but the calculation excludes one losing month due to a “data glitch.” This is MOST likely:",
        ['Acceptable if the disclosure is in small print', 'Misrepresentation', 'Permissible if returns are “typical”', 'Allowed if the strategy is proprietary'],
        'Misrepresentation'
    ),
    createQuestion(
        "A member writes: “Guaranteed alpha with zero risk” in a client pitch deck. Even if the member believes it is true, this statement is MOST likely a violation because it:",
        ['Is a promise that cannot be supported and is misleading', 'Is acceptable if backtests exist', 'Is allowed if the client signs a waiver', 'Is permitted in private meetings only'],
        'Is a promise that cannot be supported and is misleading'
    ),
    createQuestion(
        "An employee is asked to leave a firm and is told to delete all work files. The employee has a personal notebook containing a model template they created at work. Under duties to employer, the employee should MOST likely:",
        [
            'Keep the template because it is “general knowledge”',
            'Take the template if the firm has not copyrighted it',
            'Return or leave all records and models that belong to the employer',
            'Email the template to a new employer for safekeeping',
        ],
        'Return or leave all records and models that belong to the employer'
    ),
    createQuestion(
        "A manager can allocate a limited number of shares from an IPO. All clients want some. Which allocation policy BEST supports fairness?",
        ['Allocate only to the highest-fee clients', 'Allocate pro rata based on a documented, consistent policy', 'Allocate to friends and family first', 'Allocate randomly without documentation'],
        'Allocate pro rata based on a documented, consistent policy'
    ),
    createQuestion(
        "A research report includes third-party data. The data provider has a known history of occasional errors. What is the analyst’s BEST action to meet diligence and reasonable basis?",
        [
            'Use the data with no checks because it is widely used',
            'Perform reasonable checks/validation and document the basis for reliance',
            'Avoid third-party data entirely in all cases',
            'Only disclose the provider’s name and skip validation',
        ],
        'Perform reasonable checks/validation and document the basis for reliance'
    ),
    createQuestion(
        "Which action is MOST likely a violation of priority of transactions?",
        [
            'Buying for a personal account BEFORE placing the same order for clients when both orders are ready',
            'Disclosing personal holdings to compliance',
            'Trading after client orders are fully executed and allocated',
            'Recommending a security you own with full disclosure',
        ],
        'Buying for a personal account BEFORE placing the same order for clients when both orders are ready'
    ),
];

const quant: QuizQuestion[] = [
    createQuestion(
        "A deposit offers 6% nominal interest compounded monthly. Ignoring taxes, what is the effective annual rate (EAR) closest to?",
        ['6.00%', '6.17%', '6.36%', '7.20%'],
        '6.17%'
    ),
    createQuestion(
        "You will receive $5,000 one year from now. The discount rate is 8% per year. What is the present value closest to? (Red herring: your bank charges a $2 monthly account fee.)",
        ['$4,000', '$4,630', '$5,400', '$5,800'],
        '$4,630'
    ),
    createQuestion(
        "Two assets have returns with covariance 0.018 and standard deviations 0.15 and 0.20. The correlation is closest to:",
        ['0.30', '0.60', '0.90', '1.20'],
        '0.60'
    ),
    createQuestion(
        "A fair coin is flipped twice. What is the probability of getting exactly one head?",
        ['0.25', '0.50', '0.75', '1.00'],
        '0.50'
    ),
    createQuestion(
        "A sample mean is 52 and the population mean is 50. The sampling distribution of the mean has standard error 1.0. The z-statistic is:",
        ['-2', '0', '2', '52'],
        '2'
    ),
    createQuestion(
        "In a simple linear regression $y = a + bx$, the estimated slope $b$ is 1.5. Which interpretation is MOST accurate?",
        [
            'A one-unit increase in x is associated with an average 1.5-unit increase in y',
            'A one-unit increase in y causes x to increase by 1.5',
            'The correlation between x and y is 1.5',
            'The intercept must be 1.5',
        ],
        'A one-unit increase in x is associated with an average 1.5-unit increase in y'
    ),
    createQuestion(
        "A manager says: “Because the p-value is 0.03, the null hypothesis is TRUE.” Which statement is correct?",
        [
            'The statement is correct; p-values prove the null is true',
            'The statement is incorrect; a small p-value provides evidence against the null',
            'The statement is correct only if the sample is large',
            'The statement is correct only if the test is one-tailed',
        ],
        'The statement is incorrect; a small p-value provides evidence against the null'
    ),
    createQuestion(
        "Which is NOT a common cause of multicollinearity in multiple regression?",
        ['Including two highly related variables', 'Using trend variables together with time', 'Increasing the sample size', 'Using a dummy variable trap'],
        'Increasing the sample size'
    ),
    createQuestion(
        "A dataset has mean 10. The sum of squared deviations from the mean is 90 for n = 10 observations. The sample variance is:",
        ['9', '10', '90', '100'],
        '10'
    ),
    createQuestion(
        "An investment’s returns are “right-skewed.” Which is MOST consistent with right skewness?",
        ['Mean < median', 'Mean = median', 'Mean > median', 'Skewness equals zero'],
        'Mean > median'
    ),
];

const economics: QuizQuestion[] = [
    createQuestion(
        "Demand for coffee increases due to a health study (assume supply unchanged). What happens to equilibrium price and quantity?",
        ['Price down, quantity down', 'Price up, quantity up', 'Price up, quantity down', 'Price down, quantity up'],
        'Price up, quantity up'
    ),
    createQuestion(
        "If price elasticity of demand is -0.4, demand is BEST described as:",
        ['Elastic', 'Inelastic', 'Unit elastic', 'Perfectly elastic'],
        'Inelastic'
    ),
    createQuestion(
        "A country’s CPI rises 5% and nominal wages rise 3% over the year. Real wages MOST likely:",
        ['Increase about 8%', 'Increase about 2%', 'Decrease about 2%', 'Do not change'],
        'Decrease about 2%'
    ),
    createQuestion(
        "Which is included in GDP using the expenditure approach?",
        ['Purchases of existing homes', 'Intermediate goods used in production', 'Government spending on public services', 'Transfer payments such as unemployment benefits'],
        'Government spending on public services'
    ),
    createQuestion(
        "A central bank wants to reduce inflation quickly. Which action is MOST consistent with contractionary monetary policy?",
        ['Buy government bonds', 'Lower the policy rate', 'Sell government bonds', 'Reduce reserve requirements'],
        'Sell government bonds'
    ),
    createQuestion(
        "If the domestic currency appreciates sharply, and everything else is unchanged, net exports are MOST likely to:",
        ['Increase because imports get cheaper', 'Decrease because exports become more expensive to foreigners', 'Increase because exports become cheaper', 'Stay unchanged by definition'],
        'Decrease because exports become more expensive to foreigners'
    ),
    createQuestion(
        "Country A can produce 10 shirts or 5 laptops per day. Country B can produce 6 shirts or 6 laptops per day. Which statement is MOST accurate?",
        ['A has comparative advantage in laptops', 'B has comparative advantage in laptops', 'A has comparative advantage in shirts', 'Neither has comparative advantage'],
        'B has comparative advantage in laptops'
    ),
    createQuestion(
        "Which statement is MOST accurate about the short-run Phillips curve?",
        [
            'It suggests a short-run trade-off between inflation and unemployment',
            'It implies inflation and unemployment always move together',
            'It is vertical in the short run',
            'It applies only to real GDP growth',
        ],
        'It suggests a short-run trade-off between inflation and unemployment'
    ),
    createQuestion(
        "A “budget deficit” means the government’s:",
        ['Assets exceed liabilities', 'Spending exceeds revenues over a period', 'Exports exceed imports', 'Tax rate exceeds growth rate'],
        'Spending exceeds revenues over a period'
    ),
    createQuestion(
        "Which is NOT typically a leading indicator of the business cycle?",
        ['New orders', 'Consumer expectations', 'Unemployment rate', 'Building permits'],
        'Unemployment rate'
    ),
];

const fsa: QuizQuestion[] = [
    createQuestion(
        "A firm has assets of $1,200, liabilities of $700, and issued no preferred stock. Shareholders’ equity is:",
        ['$400', '$500', '$700', '$1,900'],
        '$500'
    ),
    createQuestion(
        "A company reports net income of $100 but cash flow from operations (CFO) of $40. Which is the MOST plausible beginner explanation?",
        [
            'The company is unprofitable',
            'Working capital increased, reducing CFO relative to net income',
            'Depreciation was extremely high, reducing CFO',
            'CFO cannot be lower than net income',
        ],
        'Working capital increased, reducing CFO relative to net income'
    ),
    createQuestion(
        "A firm switches from FIFO to LIFO during a period of rising prices. All else equal, cost of goods sold (COGS) and ending inventory will MOST likely:",
        ['COGS down, inventory up', 'COGS up, inventory down', 'COGS up, inventory up', 'COGS down, inventory down'],
        'COGS up, inventory down'
    ),
    createQuestion(
        "A machine costs $50,000 and has 5-year life with zero salvage. Using straight-line depreciation, annual depreciation is:",
        ['$5,000', '$10,000', '$25,000', '$50,000'],
        '$10,000'
    ),
    createQuestion(
        "Current ratio is defined as:",
        ['Current assets / current liabilities', 'Current liabilities / current assets', 'Total assets / total liabilities', 'EBIT / interest expense'],
        'Current assets / current liabilities'
    ),
    createQuestion(
        "Which item is MOST likely an “accrual” that increases net income but does not increase cash today?",
        ['Cash collected from customers', 'Depreciation expense', 'Revenue recognized on credit sales (accounts receivable increases)', 'Payment to suppliers'],
        'Revenue recognized on credit sales (accounts receivable increases)'
    ),
    createQuestion(
        "A firm receives $12,000 in cash for a 12-month subscription service to start next month. On the date of receipt, the firm should MOST likely record:",
        ['Revenue of $12,000', 'Deferred revenue (liability) of $12,000', 'Expense of $12,000', 'Equity decrease of $12,000'],
        'Deferred revenue (liability) of $12,000'
    ),
    createQuestion(
        "A bond is issued at a discount. Over time, under effective interest method, interest expense is generally:",
        ['Less than the coupon payment', 'Equal to the coupon payment', 'Greater than the coupon payment', 'Zero until maturity'],
        'Greater than the coupon payment'
    ),
    createQuestion(
        "Gross profit margin is MOST directly affected by changes in:",
        ['Selling and administrative expenses', 'Cost of goods sold relative to sales', 'Interest expense', 'Income taxes'],
        'Cost of goods sold relative to sales'
    ),
    createQuestion(
        "Which is NOT typically a cash flow from operating activities under the indirect method?",
        ['Net income', 'Increase in accounts receivable', 'Purchase of equipment', 'Depreciation'],
        'Purchase of equipment'
    ),
];

const corpFin: QuizQuestion[] = [
    createQuestion(
        "A project requires an initial outlay of $100,000 and is expected to generate $30,000 per year for 4 years. If the discount rate is 10%, the NPV is closest to: (PV annuity factor 10%,4 ≈ 3.17)",
        ['-$5,000', '+$20,000', '-$20,000', '+$5,000'],
        '-$5,000'
    ),
    createQuestion(
        "A firm is choosing between two mutually exclusive projects. Which decision rule is generally BEST when projects differ in scale?",
        ['Choose the higher IRR', 'Choose the higher NPV', 'Choose the shorter payback', 'Choose the higher accounting profit'],
        'Choose the higher NPV'
    ),
    createQuestion(
        "WACC is MOST appropriately used to discount:",
        ['Any project regardless of risk', 'Projects with risk similar to the firm’s existing operations', 'Only risk-free cash flows', 'Only equity cash flows'],
        'Projects with risk similar to the firm’s existing operations'
    ),
    createQuestion(
        "If a firm increases financial leverage (more debt), holding business risk constant, equity beta will MOST likely:",
        ['Decrease', 'Increase', 'Stay the same', 'Become negative'],
        'Increase'
    ),
    createQuestion(
        "A company repurchases shares using excess cash. All else equal, which ratio is MOST likely to increase due purely to fewer shares outstanding?",
        ['Earnings per share (EPS)', 'Total assets', 'Revenue', 'Operating margin'],
        'Earnings per share (EPS)'
    ),
    createQuestion(
        "Net working capital (NWC) is defined as:",
        ['Total assets minus total liabilities', 'Current assets minus current liabilities', 'Cash minus debt', 'Revenue minus expenses'],
        'Current assets minus current liabilities'
    ),
    createQuestion(
        "A firm considers two financing options: (1) issue debt at 7% pre-tax, (2) issue equity with expected return 11%. If the tax rate is 30%, the after-tax cost of debt is closest to:",
        ['4.9%', '7.0%', '8.4%', '11.0%'],
        '4.9%'
    ),
    createQuestion(
        "Operating leverage is HIGHER when a firm has:",
        ['More variable costs relative to fixed costs', 'More fixed costs relative to variable costs', 'No fixed costs', 'No variable costs'],
        'More fixed costs relative to variable costs'
    ),
    createQuestion(
        "A firm’s break-even quantity is 10,000 units. Fixed costs are $200,000 and price is $50. Variable cost per unit is closest to:",
        ['$20', '$30', '$40', '$50'],
        '$30'
    ),
    createQuestion(
        "CAPM estimates the cost of equity as: (Red herring: inflation is 2% this year.)",
        ['Risk-free rate + beta × (market risk premium)', 'Risk-free rate + beta × firm size', 'Dividend yield + growth + tax rate', 'Risk-free rate − beta × (market risk premium)'],
        'Risk-free rate + beta × (market risk premium)'
    ),
];

const equity: QuizQuestion[] = [
    createQuestion(
        "A stock has price $40 and expected EPS next year of $4. The forward P/E is:",
        ['5', '10', '20', '40'],
        '10'
    ),
    createQuestion(
        "A company just paid a dividend of $2.00. Dividends are expected to grow at 4% forever and the required return is 9%. The value per share is closest to:",
        ['$40.0', '$41.6', '$44.0', '$50.0'],
        '$41.6'
    ),
    createQuestion(
        "Sustainable growth rate is MOST commonly approximated as:",
        ['ROE × retention ratio', 'ROA × payout ratio', 'Net margin × turnover', 'Dividend yield × inflation'],
        'ROE × retention ratio'
    ),
    createQuestion(
        "Enterprise value (EV) is MOST commonly computed as market value of equity + debt −:",
        ['Inventory', 'Cash', 'Revenue', 'Accounts receivable'],
        'Cash'
    ),
    createQuestion(
        "A stock’s beta is 1.2. Market return is 8% and risk-free rate is 3%. Expected return from CAPM is closest to:",
        ['6%', '9%', '10%', '11%'],
        '9%'
    ),
    createQuestion(
        "Which statement is MOST consistent with semi-strong form market efficiency?",
        [
            'Prices reflect all publicly available information',
            'Insiders can never earn abnormal returns',
            'Technical analysis always works',
            'Only historical prices are reflected',
        ],
        'Prices reflect all publicly available information'
    ),
    createQuestion(
        "A company issues new shares at fair value to fund growth. If earnings do not increase immediately, EPS will MOST likely:",
        ['Increase', 'Decrease', 'Stay the same by definition', 'Become negative automatically'],
        'Decrease'
    ),
    createQuestion(
        "A firm’s dividend payout ratio is 30%. The retention ratio is:",
        ['30%', '70%', '100%', '130%'],
        '70%'
    ),
    createQuestion(
        "An analyst compares two firms using P/B ratios. This approach is MOST appropriate when firms have:",
        ['Negative book value', 'Similar accounting policies and business models', 'No assets', 'No revenues'],
        'Similar accounting policies and business models'
    ),
    createQuestion(
        "Which item is MOST likely a red flag for low earnings quality?",
        ['CFO consistently exceeds net income', 'Large one-time gains drive net income', 'Stable margins and stable accruals', 'Conservative revenue recognition'],
        'Large one-time gains drive net income'
    ),
];

const fixedIncome: QuizQuestion[] = [
    createQuestion(
        "A plain-vanilla bond’s price will MOST likely fall when market yields:",
        ['Fall', 'Rise', 'Stay constant', 'Equal the coupon rate'],
        'Rise'
    ),
    createQuestion(
        "A 5-year bond has modified duration of 4.2. If yield increases by 50 bps (0.50%), the approximate percentage price change is closest to:",
        ['-2.1%', '-4.2%', '+2.1%', '+4.2%'],
        '-2.1%'
    ),
    createQuestion(
        "If the yield curve is upward sloping, then (in general) long-term rates are:",
        ['Lower than short-term rates', 'Higher than short-term rates', 'Equal to short-term rates', 'Negative'],
        'Higher than short-term rates'
    ),
    createQuestion(
        "A bond has a “clean price” of 98 and accrued interest of 1.2 (per 100 par). The “dirty price” is:",
        ['96.8', '98.0', '99.2', '100.0'],
        '99.2'
    ),
    createQuestion(
        "Credit spread is BEST defined as the yield difference between:",
        ['Two government bonds of different maturities', 'A corporate bond and a comparable risk-free benchmark', 'Two stocks in the same industry', 'Inflation and real GDP growth'],
        'A corporate bond and a comparable risk-free benchmark'
    ),
    createQuestion(
        "Holding all else equal, a bond with higher convexity will have:",
        ['More accurate duration-only price estimates for large yield changes', 'Less price sensitivity to yield changes', 'More price gain when yields fall and less price loss when yields rise', 'A higher coupon rate by definition'],
        'More price gain when yields fall and less price loss when yields rise'
    ),
    createQuestion(
        "Which security has the MOST reinvestment risk?",
        ['Zero-coupon bond', 'High-coupon bond', 'T-bill', 'Floating-rate note'],
        'High-coupon bond'
    ),
    createQuestion(
        "A bond rated BBB is MOST commonly considered:",
        ['Investment grade', 'Speculative grade (junk)', 'Risk-free', 'Equity-like'],
        'Investment grade'
    ),
    createQuestion(
        "If a bond is trading at a premium, its coupon rate is MOST likely:",
        ['Less than the market yield', 'Equal to the market yield', 'Greater than the market yield', 'Zero'],
        'Greater than the market yield'
    ),
    createQuestion(
        "Which statement is MOST accurate about callable bonds?",
        ['They usually have lower yields than comparable non-callable bonds', 'They have negative convexity when rates fall enough', 'They eliminate reinvestment risk for the investor', 'Their price rises without limit when yields fall'],
        'They have negative convexity when rates fall enough'
    ),
];

const derivatives: QuizQuestion[] = [
    createQuestion(
        "A stock is $100. The continuously compounded risk-free rate is 5% and there are no dividends. The 1-year forward price is closest to:",
        ['$95', '$100', '$105', '$110'],
        '$105'
    ),
    createQuestion(
        "A European call option has strike $50 and the stock price at expiration is $62. The call payoff is:",
        ['$0', '$12', '$50', '$62'],
        '$12'
    ),
    createQuestion(
        "Which position profits MOST when the underlying price falls significantly (all else equal)?",
        ['Long call', 'Long put', 'Short put', 'Covered call'],
        'Long put'
    ),
    createQuestion(
        "An option’s intrinsic value is BEST described as:",
        ['The part of the premium due to volatility', 'The immediate exercise value', 'Always equal to the option premium', 'Always zero before expiration'],
        'The immediate exercise value'
    ),
    createQuestion(
        "Put-call parity for European options (no dividends) implies that a synthetic long stock can be created by:",
        ['Long call + short put (same strike, maturity)', 'Long put + short call', 'Short call + short stock', 'Long bond + short call'],
        'Long call + short put (same strike, maturity)'
    ),
    createQuestion(
        "A U.S. importer must pay €1,000,000 in 90 days. Which hedge MOST directly reduces the risk of EUR appreciating vs USD?",
        ['Buy EUR forward', 'Sell EUR forward', 'Buy USD forward', 'Sell USD forward'],
        'Buy EUR forward'
    ),
    createQuestion(
        "In a plain-vanilla interest rate swap, the party that pays fixed and receives floating benefits MOST when rates:",
        ['Rise', 'Fall', 'Stay constant', 'Become negative'],
        'Rise'
    ),
    createQuestion(
        "Futures are marked to market. This feature MOST directly reduces:",
        ['Liquidity risk', 'Counterparty credit risk', 'Market risk', 'Reinvestment risk'],
        'Counterparty credit risk'
    ),
    createQuestion(
        "Delta of an option is BEST described as:",
        ['Sensitivity of option value to a small change in underlying price', 'Sensitivity to interest rates', 'Sensitivity to time decay', 'Probability the option expires in the money'],
        'Sensitivity of option value to a small change in underlying price'
    ),
    createQuestion(
        "Which statement about arbitrage is MOST accurate?",
        ['It requires forecasting future prices', 'It is risk-free profit from price inconsistencies (ignoring costs)', 'It is the same as speculation', 'It only exists in equity markets'],
        'It is risk-free profit from price inconsistencies (ignoring costs)'
    ),
];

const portfolio: QuizQuestion[] = [
    createQuestion(
        "Two assets each have 10% expected return and 15% standard deviation. If correlation is less than 1, combining them can MOST likely:",
        ['Increase return with the same risk always', 'Reduce portfolio risk through diversification', 'Eliminate all risk', 'Guarantee higher Sharpe ratio'],
        'Reduce portfolio risk through diversification'
    ),
    createQuestion(
        "Systematic risk is BEST described as risk that:",
        ['Can be diversified away completely', 'Affects the entire market', 'Is unique to one company', 'Only exists for bonds'],
        'Affects the entire market'
    ),
    createQuestion(
        "A portfolio has return 9%, risk-free rate 3%, and standard deviation 12%. The Sharpe ratio is closest to:",
        ['0.25', '0.50', '0.75', '1.00'],
        '0.50'
    ),
    createQuestion(
        "An investor’s IPS statement “cannot tolerate more than a 5% drawdown” MOST directly relates to:",
        ['Return objective', 'Risk tolerance constraint', 'Liquidity preference', 'Tax consideration'],
        'Risk tolerance constraint'
    ),
    createQuestion(
        "Rebalancing a portfolio back to target weights MOST commonly means:",
        ['Buying recent winners and selling losers', 'Selling some assets that rose above target and buying those below target', 'Avoiding trading to reduce costs', 'Switching to cash permanently'],
        'Selling some assets that rose above target and buying those below target'
    ),
    createQuestion(
        "Which statement is MOST accurate about the efficient frontier?",
        ['It contains portfolios with maximum return for each level of risk', 'It contains all possible portfolios', 'It contains only risk-free portfolios', 'It minimizes return for a given risk'],
        'It contains portfolios with maximum return for each level of risk'
    ),
    createQuestion(
        "Active management aims to:",
        ['Match an index return as closely as possible', 'Earn returns above a benchmark (after costs)', 'Eliminate all volatility', 'Remove currency exposure always'],
        'Earn returns above a benchmark (after costs)'
    ),
    createQuestion(
        "If two risky assets have correlation of -1, an investor can theoretically:",
        ['Eliminate risk with an appropriate combination', 'Double risk by combining them', 'Only reduce risk slightly', 'Not change risk at all'],
        'Eliminate risk with an appropriate combination'
    ),
    createQuestion(
        "Which is NOT a common constraint category in an IPS?",
        ['Liquidity', 'Time horizon', 'Legal/regulatory', 'Gross domestic product'],
        'Gross domestic product'
    ),
    createQuestion(
        "A portfolio’s beta is 0.8. Which statement is MOST accurate?",
        ['The portfolio is more volatile than the market', 'The portfolio has 80% of the market’s systematic risk', 'The portfolio’s total risk is 0.8', 'The portfolio’s expected return is 0.8%'],
        'The portfolio has 80% of the market’s systematic risk'
    ),
];

const alternatives: QuizQuestion[] = [
    createQuestion(
        "A REIT is MOST accurately described as a company that:",
        ['Issues government bonds', 'Owns or finances income-producing real estate and distributes most taxable income', 'Provides deposit insurance', 'Only invests in commodities futures'],
        'Owns or finances income-producing real estate and distributes most taxable income'
    ),
    createQuestion(
        "A private equity fund’s J-curve effect MOST commonly reflects:",
        ['Early negative returns due to fees and investment ramp-up followed by later gains', 'Immediate stable positive returns', 'Guaranteed returns from leverage', 'Lower volatility than bonds'],
        'Early negative returns due to fees and investment ramp-up followed by later gains'
    ),
    createQuestion(
        "A hedge fund database with only currently operating funds may overstate performance due to:",
        ['Backtesting', 'Survivorship bias', 'Currency hedging', 'Duration matching'],
        'Survivorship bias'
    ),
    createQuestion(
        "A property has net operating income (NOI) of $120,000 and a value of $2,000,000. The cap rate is:",
        ['3%', '6%', '12%', '16%'],
        '6%'
    ),
    createQuestion(
        "In commodities futures, “contango” means futures prices are generally:",
        ['Below spot prices', 'Above spot prices', 'Equal to spot prices', 'Always negative'],
        'Above spot prices'
    ),
    createQuestion(
        "Which alternative investment is MOST associated with high liquidity risk?",
        ['Listed REIT index fund', 'Short-term T-bill ETF', 'Direct investment in a private company', 'Large-cap equity index fund'],
        'Direct investment in a private company'
    ),
    createQuestion(
        "A common fee structure for hedge funds is BEST described as:",
        ['No fees', 'Management fee plus performance incentive fee', 'Only performance fee', 'Only transaction fees'],
        'Management fee plus performance incentive fee'
    ),
    createQuestion(
        "A key reason investors add alternatives to a traditional stock/bond portfolio is to:",
        ['Eliminate all risk', 'Improve diversification due to different return drivers', 'Guarantee higher return', 'Avoid all fees'],
        'Improve diversification due to different return drivers'
    ),
    createQuestion(
        "Which statement about venture capital is MOST accurate?",
        ['It typically invests in mature, cash-flow stable companies', 'It typically invests in early-stage companies with high growth potential', 'It guarantees principal protection', 'It is traded daily on major exchanges'],
        'It typically invests in early-stage companies with high growth potential'
    ),
    createQuestion(
        "Appraisal-based real estate returns often show artificially low volatility because of:",
        ['High-frequency trading', 'Return smoothing from infrequent appraisals', 'Daily mark-to-market accounting', 'Negative convexity'],
        'Return smoothing from infrequent appraisals'
    ),
];

const allQuestions: QuizQuestion[] = [
    ...ethics,
    ...quant,
    ...economics,
    ...fsa,
    ...corpFin,
    ...equity,
    ...fixedIncome,
    ...derivatives,
    ...portfolio,
    ...alternatives,
];

export const cfaBasicBeginnerItem: MarketplaceItem = {
    id: 'cfa-basic-beginner-100',
    title: 'CFA Exam - Beginner Fundamentals (100 Items)',
    description:
        'Beginner-friendly CFA-style fundamentals across the 10 core topic areas. Designed to build a strong foundation before harder sets. Questions include realistic red herrings and single-error distractors to test true understanding.',
    category: 'Education',
    author: 'Cerebrum Templates',
    downloads: 0,
    rating: 4.7,
    price: 'Free',
    content: allQuestions,
};
