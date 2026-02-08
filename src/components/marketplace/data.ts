import { QuizQuestion } from '@/types/quiz';
import { phBoardExamReviewers } from './ph_reviewer';
import { mnaUsHardExamItem } from './mna_us_hard';
import { grandMockExam } from './grand_mock';
import { psychAssessmentMarketplaceItem } from './psych_assessment';
import { psychAssessment1MarketplaceItem } from './psych_assessment_1';
import { theoriesMarketplaceItem } from './theories_of_personality';
import { abnormalPsychMarketplaceItem } from './abnormal_psych';
import { ioPsychMarketplaceItem } from './io_psych';
import { ioPsych1MarketplaceItem } from './io_psych_1';
import { devPsych1MarketplaceItem } from './dev_psych_1';
import { grandMock2026Item } from './grand_mock_2026';
import { cfaHardExamItem } from './cfa_hard';
import { pmpHardExamItem } from './pmp_hard';
import { cfaBasicBeginnerItem } from './cfa_basic_beginner';

export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    category: 'Education' | 'Programming' | 'Trivia' | 'Science' | 'General';
    author: string;
    downloads: number;
    rating: number;
    content: QuizQuestion[]; // For now, just quiz content
    price: 'Free' | 'Premium';
}

export const mockMarketplaceItems: MarketplaceItem[] = [
    grandMockExam,
    grandMock2026Item,
    cfaBasicBeginnerItem,
    cfaHardExamItem,
    pmpHardExamItem,
    psychAssessmentMarketplaceItem,
    psychAssessment1MarketplaceItem,
    theoriesMarketplaceItem,
    abnormalPsychMarketplaceItem,
    ioPsychMarketplaceItem,
    ioPsych1MarketplaceItem,
    devPsych1MarketplaceItem,
    mnaUsHardExamItem,
    ...phBoardExamReviewers,
    {
        id: '1',
        title: 'General Knowledge Basics',
        description: 'Test your knowledge on a wide variety of common topics.',
        category: 'General',
        author: 'Admin',
        downloads: 1205,
        rating: 4.5,
        price: 'Free',
        content: [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                answer: "Paris",
                type: "multiple"
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Mars", "Venus", "Jupiter", "Saturn"],
                answer: "Mars",
                type: "multiple"
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                answer: "William Shakespeare",
                type: "multiple"
            }
        ]
    },
    {
        id: '2',
        title: 'JavaScript Essentials',
        description: 'Core concepts every JS developer should know.',
        category: 'Programming',
        author: 'CodeMaster',
        downloads: 850,
        rating: 4.8,
        price: 'Free',
        content: [
            {
                question: "Which of the following is NOT a primitive type in JavaScript?",
                options: ["string", "number", "boolean", "object"],
                answer: "object",
                type: "multiple"
            },
            {
                question: "What defines a block scope variable?",
                options: ["var", "let", "const", "both let and const"],
                answer: "both let and const",
                type: "multiple"
            }
        ]
    },
    {
        id: '3',
        title: 'World Capitals',
        description: 'A challenging quiz about capitals around the world.',
        category: 'Education',
        author: 'GeoWiz',
        downloads: 500,
        rating: 4.2,
        price: 'Free',
        content: [
            {
                question: "Capital of Australia?",
                options: ["Sydney", "Melbourne", "Canberra", "Perth"],
                answer: "Canberra",
                type: "multiple"
            },
            {
                question: "Capital of Canada?",
                options: ["Toronto", "Vancouver", "Ottawa", "Montreal"],
                answer: "Ottawa",
                type: "multiple"
            }
        ]
    },
    {
        id: '4',
        title: 'Science Trivia',
        description: 'Fun facts about biology, chemistry, and physics.',
        category: 'Science',
        author: 'ScienceNerd',
        downloads: 320,
        rating: 4.6,
        price: 'Free',
        content: [
            {
                question: "What is the chemical symbol for Gold?",
                options: ["Au", "Ag", "Fe", "Cu"],
                answer: "Au",
                type: "multiple"
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Platinum"],
                answer: "Diamond",
                type: "multiple"
            }
        ]
    }
];
