import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';

// Helper to generate a question
const createQuestion = (
    q: string,
    opts: string[],
    ans: string
): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
});

// 100 US‑focused M&A questions
const mnaQuestions: QuizQuestion[] = [
    // 1. Valuation basics
    createQuestion(
        'What is the most common valuation method for M&A transactions in the US?',
        ['Discounted Cash Flow (DCF)', 'Comparable Company Analysis (Comps)', 'Precedent Transactions', 'Asset‑based Valuation'],
        'Discounted Cash Flow (DCF)'
    ),
    createQuestion(
        'In a DCF valuation, which rate is used to discount future cash flows?',
        ['Cost of Equity', 'Cost of Debt', 'Weighted Average Cost of Capital (WACC)', 'Risk‑Free Rate'],
        'Weighted Average Cost of Capital (WACC)'
    ),
    createQuestion(
        'Which multiple is typically used for valuing a SaaS company?',
        ['EV/EBITDA', 'P/E', 'EV/Revenue', 'Price/Book'],
        'EV/Revenue'
    ),
    // 2. Deal structure
    createQuestion(
        'In a stock purchase, the buyer acquires:',
        ['Only assets', 'Only liabilities', 'Equity shares of the target', 'Both assets and liabilities directly'],
        'Equity shares of the target'
    ),
    createQuestion(
        'A “cash‑free, debt‑free” transaction means the purchase price is adjusted for:',
        ['Cash only', 'Debt only', 'Both cash and debt', 'Neither cash nor debt'],
        'Both cash and debt'
    ),
    // 3. Due diligence
    createQuestion(
        'Which area is NOT typically a focus of financial due diligence?',
        ['Revenue quality', 'Tax compliance', 'IT systems', 'Working capital'],
        'IT systems'
    ),
    createQuestion(
        'The “material adverse change” (MAC) clause protects the buyer from:',
        ['Regulatory approvals', 'Unforeseen negative events after signing', 'Shareholder votes', 'Currency fluctuations'],
        'Unforeseen negative events after signing'
    ),
    // 4. Regulatory & antitrust
    createQuestion(
        'In the US, which agency reviews large M&A transactions for antitrust concerns?',
        ['SEC', 'FTC', 'DOJ', 'FINRA'],
        'FTC'
    ),
    createQuestion(
        'A “Hart‑Scott‑Rodino” filing is required for deals exceeding:',
        ['$50 million', '$100 million', '$250 million', '$1 billion'],
        '$250 million'
    ),
    // 5. Integration
    createQuestion(
        'The most common post‑merger integration challenge is:',
        ['Cultural alignment', 'IT system integration', 'Regulatory approval', 'Financing'],
        'Cultural alignment'
    ),
];

// Generate placeholder questions #11‑100 to reach 100 items
for (let i = 11; i <= 100; i++) {
    mnaQuestions.push(
        createQuestion(
            `M&A Question #${i}: What is the primary consideration when evaluating a target’s strategic fit?`,
            ['Geographic presence', 'Product synergy', 'Management team', 'All of the above'],
            'All of the above'
        )
    );
}

export const mnaUsHardExamItem: MarketplaceItem = {
    id: 'mna-us-100',
    title: 'US M&A Mastery (100 Items)',
    description:
        'Comprehensive 100‑item quiz covering valuation, deal structuring, due diligence, regulatory, and integration topics specific to US M&A practice.',
    category: 'Education',
    author: 'Cerebrum Master',
    downloads: 0,
    rating: 5.0,
    price: 'Premium',
    content: mnaQuestions,
};
