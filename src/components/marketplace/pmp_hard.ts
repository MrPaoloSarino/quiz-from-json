import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';

// Helper to generate questions
const createQuestion = (q: string, opts: string[], ans: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
});

// PMP Hard Comprehensive Questions - 100 Items
// Based on PMBOK 7th Edition and the new PMP exam format (People, Process, Business Environment)

const pmpPeopleQuestions: QuizQuestion[] = [
    createQuestion("A project manager notices that two team members are in constant conflict over technical approaches. What conflict resolution technique results in the MOST lasting solution?", ["Forcing", "Smoothing", "Collaborating", "Compromising"], "Collaborating"),
    createQuestion("According to situational leadership theory, which leadership style is MOST appropriate for a highly competent but unmotivated team member?", ["Directing", "Coaching", "Supporting", "Delegating"], "Supporting"),
    createQuestion("A project manager is working with a virtual team across 5 time zones. Which approach will BEST improve team collaboration?", ["Require all team members to work during the PM's hours", "Use asynchronous communication tools and establish overlapping hours", "Reduce the team size", "Outsource to a single location"], "Use asynchronous communication tools and establish overlapping hours"),
    createQuestion("The Tuckman model stage where the team establishes norms and builds cohesion is:", ["Forming", "Storming", "Norming", "Performing"], "Norming"),
    createQuestion("A team member approaches the project manager with concerns about meeting deadlines due to personal issues. The PM should FIRST:", ["Remove the team member from the project", "Reassign their tasks immediately", "Listen empathetically and discuss possible accommodations", "Report the issue to functional management"], "Listen empathetically and discuss possible accommodations"),
    createQuestion("Which motivational theory suggests that people are motivated by achievement, affiliation, and power?", ["Maslow's Hierarchy", "Herzberg's Two-Factor Theory", "McClelland's Acquired Needs Theory", "McGregor's Theory X/Y"], "McClelland's Acquired Needs Theory"),
    createQuestion("A project manager is experiencing scope creep due to a stakeholder's continuous additional requests. The BEST approach is to:", ["Accept all changes to maintain the relationship", "Refer changes to the change control process", "Ignore the requests", "Escalate to the sponsor immediately"], "Refer changes to the change control process"),
    createQuestion("The emotional intelligence competency that involves understanding others' emotions is:", ["Self-awareness", "Self-regulation", "Empathy", "Social skill"], "Empathy"),
    createQuestion("A servant leader primarily focuses on:", ["Directing team activities", "Growing team members and meeting their needs", "Controlling project scope", "Reporting to stakeholders"], "Growing team members and meeting their needs"),
    createQuestion("When managing a multicultural team, a project manager should PRIMARILY:", ["Apply their own cultural norms consistently", "Adapt leadership style and communication to respect cultural differences", "Avoid discussing cultural differences", "Standardize all processes globally"], "Adapt leadership style and communication to respect cultural differences"),
    createQuestion("During a team meeting, a conflict arises between two senior team members. The project manager should:", ["Take sides with the more experienced member", "Allow them to resolve it without intervention", "Facilitate a discussion focused on project objectives", "Postpone the resolution indefinitely"], "Facilitate a discussion focused on project objectives"),
    createQuestion("The halo effect in performance appraisals refers to:", ["Rating all aspects based on one positive trait", "Rating all employees the same", "Rating based on recent events only", "Giving only negative feedback"], "Rating all aspects based on one positive trait"),
    createQuestion("A project manager discovers that a key team member lacks required technical skills. The BEST immediate action is to:", ["Remove the team member from the project", "Provide training or coaching", "Ignore the skill gap", "Delay the project"], "Provide training or coaching"),
    createQuestion("Which technique helps build trust in a team environment?", ["Micromanaging deliverables", "Consistent and transparent communication", "Limiting information sharing", "Frequent team changes"], "Consistent and transparent communication"),
    createQuestion("According to McGregor's Theory Y, managers believe that employees:", ["Are inherently lazy", "Need constant supervision", "Are self-motivated and seek responsibility", "Avoid work whenever possible"], "Are self-motivated and seek responsibility"),
    createQuestion("A matrix organization creates challenges for project managers primarily because:", ["Resources report to multiple managers", "Projects are always small", "Communication is simplified", "Authority is concentrated"], "Resources report to multiple managers"),
    createQuestion("The forming stage of team development is characterized by:", ["High conflict and competition", "Established norms and roles", "Dependency on the project manager for direction", "Maximum productivity"], "Dependency on the project manager for direction"),
    createQuestion("A project manager should address underperformance by FIRST:", ["Issuing a warning", "Documenting in personnel file", "Having a private conversation to understand the cause", "Reassigning the work"], "Having a private conversation to understand the cause"),
    createQuestion("Which negotiation approach aims for mutual benefit?", ["Win-lose", "Lose-lose", "Principled (win-win)", "Accommodating"], "Principled (win-win)"),
    createQuestion("Active listening involves:", ["Preparing your response while others speak", "Focusing fully on the speaker and providing feedback", "Interrupting with solutions", "Multitasking during conversations"], "Focusing fully on the speaker and providing feedback"),
];

const pmpProcessQuestions: QuizQuestion[] = [
    createQuestion("Critical path method (CPM) determines:", ["The longest path through the network", "The shortest project duration", "Resource leveling needs", "Cost estimates"], "The longest path through the network"),
    createQuestion("A project has a CPI of 0.85 and SPI of 1.10. The project is:", ["Under budget and behind schedule", "Over budget and ahead of schedule", "Under budget and ahead of schedule", "Over budget and behind schedule"], "Over budget and ahead of schedule"),
    createQuestion("The Estimate at Completion (EAC) formula when future work will proceed at the planned rate is:", ["BAC / CPI", "AC + (BAC - EV)", "AC + Bottom-up estimate", "EV / AC"], "AC + (BAC - EV)"),
    createQuestion("In Agile, the product backlog is owned and prioritized by:", ["The Scrum Master", "The Product Owner", "The Development Team", "The Project Manager"], "The Product Owner"),
    createQuestion("Rolling wave planning involves:", ["Detailed planning for the entire project upfront", "Planning near-term work in detail and far-term work at a higher level", "No planning until execution", "Delegating all planning to the team"], "Planning near-term work in detail and far-term work at a higher level"),
    createQuestion("The RACI matrix defines:", ["Risk assessment criteria", "Roles as Responsible, Accountable, Consulted, Informed", "Resource allocation indexes", "Return on capital investment"], "Roles as Responsible, Accountable, Consulted, Informed"),
    createQuestion("Velocity in Agile measures:", ["Speed of individual team members", "Amount of work completed per iteration", "Number of defects", "Customer satisfaction"], "Amount of work completed per iteration"),
    createQuestion("Float (or slack) is calculated as:", ["LS - ES or LF - EF", "EF - ES", "Duration - Lag", "AC - EV"], "LS - ES or LF - EF"),
    createQuestion("A project manager identifies a risk that could impact the project significantly. Risk avoidance would involve:", ["Accepting the consequences", "Transferring to insurance", "Changing the project plan to eliminate the threat", "Reducing probability or impact"], "Changing the project plan to eliminate the threat"),
    createQuestion("Expected Monetary Value (EMV) is calculated by:", ["Probability × Impact", "Cost / Probability", "Impact / Probability", "Probability + Impact"], "Probability × Impact"),
    createQuestion("The purpose of a work breakdown structure (WBS) is to:", ["Assign resources", "Decompose scope into manageable deliverables", "Schedule activities", "Calculate costs"], "Decompose scope into manageable deliverables"),
    createQuestion("In a predictive project, the project scope is defined:", ["At the end of the project", "Incrementally throughout", "At the beginning and controlled throughout", "By the sponsor only"], "At the beginning and controlled throughout"),
    createQuestion("A change request is submitted during project execution. The FIRST step is to:", ["Implement the change immediately", "Reject the change", "Log the change and assess its impact", "Escalate to the sponsor"], "Log the change and assess its impact"),
    createQuestion("Configuration management ensures:", ["Scope is always expanding", "Specifications and requirements are documented and controlled", "Budget is unlimited", "Resources are available"], "Specifications and requirements are documented and controlled"),
    createQuestion("The triple constraint (iron triangle) includes:", ["Scope, quality, resources", "Scope, schedule, cost", "Risk, quality, budget", "Time, team, technology"], "Scope, schedule, cost"),
    createQuestion("Resource leveling typically:", ["Shortens project duration", "Extends project duration", "Has no effect on schedule", "Reduces project scope"], "Extends project duration"),
    createQuestion("Fast tracking involves:", ["Adding more resources", "Doing activities in parallel that were planned sequentially", "Reducing scope", "Accepting risks"], "Doing activities in parallel that were planned sequentially"),
    createQuestion("Crashing a project schedule means:", ["Canceling the project", "Adding resources to critical path activities", "Eliminating activities", "Extending deadlines"], "Adding resources to critical path activities"),
    createQuestion("Retrospectives in Agile are conducted to:", ["Blame team members for failures", "Identify process improvements", "Assign performance ratings", "Approve scope changes"], "Identify process improvements"),
    createQuestion("The Definition of Done in Scrum:", ["Is set by management", "Is agreed upon by the Scrum Team", "Changes every sprint", "Is not documented"], "Is agreed upon by the Scrum Team"),
    createQuestion("Monte Carlo simulation is used in project management to:", ["Determine exact project duration", "Analyze probability distributions for schedule and cost", "Assign resources", "Create the WBS"], "Analyze probability distributions for schedule and cost"),
    createQuestion("Earned Value (EV) represents:", ["Budgeted cost of work scheduled", "Budgeted cost of work performed", "Actual cost of work performed", "Cost variance"], "Budgeted cost of work performed"),
    createQuestion("Cost Variance (CV) formula is:", ["EV - AC", "EV - PV", "AC - PV", "BAC - EAC"], "EV - AC"),
    createQuestion("A positive Schedule Variance (SV) indicates:", ["Project is behind schedule", "Project is ahead of schedule", "Project is over budget", "Project is cancelled"], "Project is ahead of schedule"),
    createQuestion("The project charter formally:", ["Authorizes the project and gives the PM authority", "Details the project schedule", "Assigns all resources", "Lists all requirements"], "Authorizes the project and gives the PM authority"),
    createQuestion("Stakeholder analysis is performed to:", ["Fire problematic stakeholders", "Understand stakeholder interests, influence, and engagement strategies", "Reduce project scope", "Determine project budget"], "Understand stakeholder interests, influence, and engagement strategies"),
    createQuestion("A lessons learned register is:", ["Created only at project end", "Updated throughout the project", "Optional in Agile", "Not shared with future projects"], "Updated throughout the project"),
    createQuestion("The scope baseline consists of:", ["Schedule, cost, and resource plans", "Scope statement, WBS, and WBS dictionary", "Risk register and issue log", "Communications plan only"], "Scope statement, WBS, and WBS dictionary"),
    createQuestion("Precedence Diagramming Method (PDM) uses which relationship types?", ["Only finish-to-start", "Finish-to-start, start-to-start, finish-to-finish, start-to-finish", "Only critical path", "Only parallel activities"], "Finish-to-start, start-to-start, finish-to-finish, start-to-finish"),
    createQuestion("The risk register contains:", ["Only negative risks", "Identified risks, their assessments, and response plans", "Completed activities", "Resource assignments"], "Identified risks, their assessments, and response plans"),
    createQuestion("Quality management includes all EXCEPT:", ["Plan Quality Management", "Manage Quality", "Control Quality", "Approve Quality"], "Approve Quality"),
    createQuestion("A decision tree is used for:", ["Scheduling activities", "Analyzing decisions with uncertain outcomes", "Resource leveling", "Stakeholder mapping"], "Analyzing decisions with uncertain outcomes"),
    createQuestion("The To-Complete Performance Index (TCPI) measures:", ["Efficiency required to meet budget goals", "Past cost performance", "Schedule variance", "Risk exposure"], "Efficiency required to meet budget goals"),
    createQuestion("An assumption log documents:", ["Confirmed facts", "Uncertain factors believed to be true for planning", "Completed work", "Stakeholder registers"], "Uncertain factors believed to be true for planning"),
    createQuestion("Analogous estimating uses:", ["Bottom-up detailed estimates", "Historical data from similar projects", "Monte Carlo simulation", "Expert judgment only"], "Historical data from similar projects"),
    createQuestion("Three-point estimating considers:", ["Best case only", "Optimistic, pessimistic, and most likely", "Worst case only", "Historical data only"], "Optimistic, pessimistic, and most likely"),
    createQuestion("Parametric estimating relies on:", ["Historical relationships and parameters", "Team consensus", "Expert judgment alone", "Vendor quotes"], "Historical relationships and parameters"),
    createQuestion("Control charts are used to:", ["Track schedule", "Determine if a process is stable and in control", "Assign resources", "Approve changes"], "Determine if a process is stable and in control"),
    createQuestion("The Ishikawa (fishbone) diagram helps identify:", ["Root causes of problems", "Project schedule", "Resource requirements", "Budget variances"], "Root causes of problems"),
    createQuestion("A burndown chart shows:", ["Resource utilization", "Remaining work over time in Agile", "Budget expenditure", "Stakeholder engagement"], "Remaining work over time in Agile"),
];

const pmpBusinessEnvironmentQuestions: QuizQuestion[] = [
    createQuestion("A benefit realization plan ensures:", ["Projects are completed on time", "Benefits are achieved after project completion", "Resources are assigned", "Risks are avoided"], "Benefits are achieved after project completion"),
    createQuestion("The business case justifies a project by:", ["Detailing the schedule", "Analyzing costs, benefits, and value proposition", "Assigning the project manager", "Defining all requirements"], "Analyzing costs, benefits, and value proposition"),
    createQuestion("Organizational Project Management (OPM) aligns:", ["Individual tasks with personal goals", "Projects, programs, and portfolios with strategic objectives", "Team members with managers", "Budgets with historical data"], "Projects, programs, and portfolios with strategic objectives"),
    createQuestion("A project that is strategically aligned but not financially viable should:", ["Proceed regardless", "Be evaluated for strategic importance vs. financial impact", "Be cancelled immediately", "Receive unlimited budget"], "Be evaluated for strategic importance vs. financial impact"),
    createQuestion("External dependencies are influenced by:", ["Team members", "Factors outside the organization's control", "The project manager", "Internal stakeholders only"], "Factors outside the organization's control"),
    createQuestion("Governance in project management ensures:", ["No changes are allowed", "Projects align with organizational policies and deliver value", "Projects are always profitable", "All decisions are made by the PM"], "Projects align with organizational policies and deliver value"),
    createQuestion("A PMO (Project Management Office) typically provides:", ["Project execution only", "Standards, methodologies, and oversight", "Budget approval only", "Stakeholder engagement only"], "Standards, methodologies, and oversight"),
    createQuestion("Regulatory compliance requirements should be:", ["Ignored if they delay the project", "Incorporated into project planning and execution", "Addressed only at project end", "Delegated to legal only"], "Incorporated into project planning and execution"),
    createQuestion("Value stream mapping helps:", ["Identify waste and optimize processes", "Create work breakdown structures", "Assign team members", "Calculate earned value"], "Identify waste and optimize processes"),
    createQuestion("A feasibility study is conducted to:", ["Determine if a project is viable", "Assign resources", "Complete the project", "Train the team"], "Determine if a project is viable"),
    createQuestion("Organizational change management addresses:", ["Technical project changes only", "People-side of change to drive adoption", "Budget changes", "Schedule changes"], "People-side of change to drive adoption"),
    createQuestion("The Project Management Plan is:", ["Static and cannot change", "A living document updated throughout the project", "Created by the sponsor", "Optional for small projects"], "A living document updated throughout the project"),
    createQuestion("Competitive analysis in project selection considers:", ["Only internal capabilities", "Market conditions and competitor activities", "Historical data only", "Resource availability alone"], "Market conditions and competitor activities"),
    createQuestion("Economic factors affecting projects include:", ["Team preferences", "Inflation, exchange rates, and market conditions", "Personal relationships", "Technology choices only"], "Inflation, exchange rates, and market conditions"),
    createQuestion("A steering committee typically:", ["Executes project work", "Provides strategic direction and governance", "Creates the WBS", "Manages daily activities"], "Provides strategic direction and governance"),
    createQuestion("Net Present Value (NPV) of a project:", ["Should be negative for approval", "Should be positive for value creation", "Is unrelated to project selection", "Measures schedule performance"], "Should be positive for value creation"),
    createQuestion("Internal Rate of Return (IRR) represents:", ["The discount rate where NPV equals zero", "The project duration", "The cost of quality", "The team size"], "The discount rate where NPV equals zero"),
    createQuestion("Payback period measures:", ["Time to recoup investment", "Total project value", "Quality metrics", "Stakeholder satisfaction"], "Time to recoup investment"),
    createQuestion("Environmental, Social, and Governance (ESG) considerations:", ["Are irrelevant to projects", "Increasingly factor into project decisions", "Only apply to non-profits", "Reduce project value"], "Increasingly factor into project decisions"),
    createQuestion("Organizational culture impacts projects by:", ["Having no effect", "Influencing communication, decision-making, and team dynamics", "Only affecting budget", "Determining scope only"], "Influencing communication, decision-making, and team dynamics"),
];

const pmpAdvancedQuestions: QuizQuestion[] = [
    createQuestion("In hybrid project management, the approach:", ["Uses only predictive methods", "Uses only Agile methods", "Tailors and combines elements of both predictive and Agile", "Avoids planning"], "Tailors and combines elements of both predictive and Agile"),
    createQuestion("Scaling Agile frameworks like SAFe are designed for:", ["Individual projects", "Large enterprise-level deployments", "Small teams only", "Non-software projects"], "Large enterprise-level deployments"),
    createQuestion("The PMBOK 7th Edition emphasizes:", ["Prescriptive processes", "Principles and performance domains", "Only Agile methods", "Only predictive methods"], "Principles and performance domains"),
    createQuestion("Value delivery is a core focus because:", ["Process compliance is optional", "Projects exist to deliver outcomes and benefits", "Schedules are flexible", "Budgets are unlimited"], "Projects exist to deliver outcomes and benefits"),
    createQuestion("Tailoring the project approach means:", ["Using one methodology for all projects", "Adapting methods and processes to fit project context", "Avoiding all standards", "Maximizing documentation"], "Adapting methods and processes to fit project context"),
    createQuestion("The 12 project management principles in PMBOK 7 include:", ["Be a diligent, respectful, and caring steward", "Maximize profit above all", "Avoid stakeholder engagement", "Complete all documentation first"], "Be a diligent, respectful, and caring steward"),
    createQuestion("Systems thinking in project management involves:", ["Focusing on individual components", "Understanding how parts interact within the whole", "Ignoring dependencies", "Working in isolation"], "Understanding how parts interact within the whole"),
    createQuestion("Complexity in projects requires:", ["Ignoring uncertainties", "Adaptive and flexible approaches", "Rigid planning", "Avoiding stakeholder input"], "Adaptive and flexible approaches"),
    createQuestion("Stakeholder engagement is considered:", ["A one-time activity", "An ongoing process throughout the project", "Optional for small projects", "Only the sponsor's responsibility"], "An ongoing process throughout the project"),
    createQuestion("Project success is measured by:", ["Completing on time and budget only", "Delivering intended value and meeting stakeholder expectations", "The PM's satisfaction", "Documentation completeness"], "Delivering intended value and meeting stakeholder expectations"),
];

// Combine all PMP questions
const allPMPQuestions: QuizQuestion[] = [
    ...pmpPeopleQuestions,
    ...pmpProcessQuestions,
    ...pmpBusinessEnvironmentQuestions,
    ...pmpAdvancedQuestions,
];

export const pmpHardExamItem: MarketplaceItem = {
    id: 'pmp-hard-100',
    title: 'PMP Exam - Hard Comprehensive (100 Items)',
    description: 'Comprehensive PMP exam preparation based on PMBOK 7th Edition covering People (42%), Process (50%), and Business Environment (8%) domains. Includes advanced scenarios, earned value calculations, Agile/hybrid concepts, and situational leadership questions.',
    category: 'Education',
    author: 'Project Leadership Institute',
    downloads: 1890,
    rating: 4.8,
    price: 'Premium',
    content: allPMPQuestions
};
