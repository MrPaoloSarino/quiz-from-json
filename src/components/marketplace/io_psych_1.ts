import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';

const createQuestion = (q: string, opts: string[], ans: string, explanation?: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
    explanation,
});

const ioPsych1Questions: QuizQuestion[] = [
    createQuestion(
        "A set of propositions that explains or predicts how individuals and groups behave in various organizational structures and situations is known as:",
        ["Structural theory", "Organizational theory", "Motivational theory", "Psychological theory"],
        "Organizational theory",
        "Organizational theory is the broad academic field dedicated to understanding and explaining how organizations function and how individuals and groups behave within them."
    ),
    createQuestion(
        "This organizational theory primarily emphasizes the work itself and processes, often neglecting the human or worker element.",
        ["Classical", "Neoclassical", "Contingency", "Open systems"],
        "Classical",
        "Classical organizational theories, like scientific management, focused almost exclusively on the mechanics of work, structure, and efficiency, largely ignoring the social and psychological needs of the workers."
    ),
    createQuestion(
        "Under which framework is the organization perceived as a machine, with a belief that there is one single best method to perform any job?",
        ["Administrative", "Scientific Management", "Bureaucratic", "Neoclassical"],
        "Scientific Management",
        "Scientific Management, pioneered by Frederick Taylor, is famous for its \"one best way\" approach. It treated the organization like a machine and aimed to standardize every job for maximum efficiency."
    ),
    createQuestion(
        "This principle allows an organization to capitalize on employee strengths by training them for specific tasks and duties pertinent to their assigned roles.",
        ["Delegation of authority", "Division of labor", "Span of control", "Centralization"],
        "Division of labor",
        "Division of labor is the principle of breaking down complex jobs into smaller, specialized tasks. This allows employees to become highly proficient in their specific roles, thus capitalizing on their strengths."
    ),
    createQuestion(
        "What term describes the number of subordinates that a single supervisor is responsible for?",
        ["Delegation of authority", "Division of labor", "Span of control", "Centralization"],
        "Span of control",
        "Span of control is the specific management term for the number of subordinates who report directly to a supervisor."
    ),
    createQuestion(
        "Neoclassical theory asserts that management must acknowledge the presence of informal organizations. It also recognizes that employees often belong to both formal and informal groups.",
        ["Both statements are false", "Both statements are true", "The first statement is true", "The second statement is true"],
        "Both statements are true",
        "Neoclassical theory was a response to classical theory. It acknowledged that informal groups and social relationships exist within the formal organization and that these informal structures significantly influence employee behavior. Both statements are true tenets of this theory."
    ),
    createQuestion(
        "A group of coworkers from different departments who join together to campaign for a better company-wide recycling program form what kind of group?",
        ["Interest group", "Command group", "Task group", "Formal group"],
        "Interest group",
        "An interest group is an informal group that forms because members have a common goal or interest they want to pursue, such as advocating for a company-wide recycling program."
    ),
    createQuestion(
        "This theory posits that there is no single best way to structure an organization or make decisions; instead, the optimal course of action is dependent on situational factors.",
        ["Motivation", "Contingency", "Open Systems", "Classical"],
        "Contingency",
        "Contingency theory's central message is \"it depends.\" It posits that there is no single best way to structure or manage an organization; the best approach is contingent on situational factors like the external environment and technology."
    ),
    createQuestion(
        "Which theory maintains that an organization is significantly influenced by its external environment?",
        ["Motivation", "Systems", "Contingency", "Classical"],
        "Systems",
        "Systems theory views an organization as an \"open system\" that constantly interacts with and is influenced by its external environment (e.g., competitors, customers, economic conditions)."
    ),
    createQuestion(
        "A manager who holds high expectations for her team, believing it will lead to increased motivation and better performance, is demonstrating the:",
        ["Rosenthal effect", "Pygmalion effect", "Both a & b", "None of the above"],
        "Both a & b",
        "The Pygmalion effect and the Rosenthal effect are two names for the same phenomenon: a self-fulfilling prophecy where holding high expectations of someone can lead to an improvement in their performance."
    ),
    createQuestion(
        "An employee with a high need for achievement would likely be most satisfied in a job that:",
        ["is easy", "is challenging", "influences other people", "involves working with others"],
        "is challenging",
        "According to McClelland's theory, people with a high need for achievement are most motivated by tasks that are moderately challenging, allowing them to feel a sense of personal accomplishment."
    ),
    createQuestion(
        "According to Job Characteristics Theory, for employees to be motivated, their job should ideally:",
        ["be standardized and routine", "lack feedback mechanisms", "allow for autonomy", "involve working on small parts rather than a whole process"],
        "allow for autonomy",
        "The Job Characteristics Theory identifies autonomy as a core job dimension that fosters motivation. Autonomy is the degree to which a job gives an employee the freedom and discretion to decide how to do their work."
    ),
    createQuestion(
        "Which of the following is a primary criticism of Classical theory?",
        ["It is concerned with informal groups.", "It disregards the influence of external factors on behavior.", "It does not value the human element.", "Communication is not two-way."],
        "It does not value the human element.",
        "A major criticism of classical theory is its mechanistic view, which treated workers like cogs in a machine and largely disregarded human elements like morale, satisfaction, and social needs."
    ),
    createQuestion(
        "The idea that an employee should receive orders from, and be accountable to, only one superior is known as:",
        ["Unity of command", "Unity of direction", "Centralization", "Esprit de corps"],
        "Unity of command",
        "Unity of command is a classical management principle stating that an employee should receive orders from and be accountable to only one supervisor to avoid confusion and conflicting directives."
    ),
    createQuestion(
        "An organization that follows this theory can lead to worker dissatisfaction and lack of motivation due to overly simplified, repetitive, and unchallenging tasks.",
        ["Contingency", "Bureaucracy", "Administrative", "Open systems"],
        "Administrative",
        "Administrative theory, with its strong emphasis on the division of labor, can lead to jobs that are overly simplified and repetitive. This lack of challenge can cause workers to become dissatisfied and unmotivated. (Note: The provided answer key says C for Q15 which is Administrative)"
    ),
    createQuestion(
        "Which function is primarily responsible for achieving the main objectives of the organization?",
        ["Linear function", "Staff function", "Line function", "Authority function"],
        "Line function",
        "A line function refers to a department or role that is directly involved in achieving the organization's main goals (e.g., production, sales). A staff function supports the line functions (e.g., HR, accounting)."
    ),
    createQuestion(
        "Which of the following is NOT a core function of an organizational structure?",
        ["It shows the arrangement of positions and hierarchy.", "It describes roles, responsibilities, and lines of command.", "It is not used as a tool for organizational change.", "It provides clarity and efficiency for employees."],
        "It is not used as a tool for organizational change.",
        "This statement is incorrect. Altering the organizational structure is a primary and common tool used by management to implement strategic changes and adapt the organization to new challenges."
    ),
    createQuestion(
        "The two essential processes that form the basis of organizational structures are:",
        ["span of control and unity of command", "span of control and coordination", "division of labor and coordination", "division of labor and unity of command"],
        "division of labor and coordination",
        "Building any organizational structure involves two fundamental processes: first, dividing the overall work into specific jobs (division of labor), and second, creating ways to link and coordinate those jobs (coordination)."
    ),
    createQuestion(
        "In a situation where job activities are highly complex, a company would most likely standardize:",
        ["outputs", "skills", "processes", "goals"],
        "skills",
        "When job activities are highly complex (e.g., surgery), you cannot standardize the process or the output. Instead, organizations standardize the required skills by hiring people who have undergone extensive, standardized training and certification."
    ),
    createQuestion(
        "An organization characterized by formally defined roles, a high degree of rule-adherence, and resistance to change is considered:",
        ["Traditional", "Nontraditional", "Organismic", "Mid Traditional"],
        "Traditional",
        "A traditional (or mechanistic) organization is defined by its rigidity, high degree of formalization (many rules), strict hierarchy, and resistance to change."
    ),
    createQuestion(
        "The number of authority levels within a specific organization is referred to as the:",
        ["Span of control", "Chain of command", "Division of labor", "Centralization"],
        "Chain of command",
        "The chain of command is the line of authority extending from the top to the bottom of the organization, clarifying who reports to whom. The number of levels in this chain determines the organizational height."
    ),
    createQuestion(
        "A flat organizational structure is defined by a:",
        ["Long chain of command & narrow span of control", "Short chain of command & narrow span of control", "Long chain of command & wide span of control", "Short chain of command & wide span of control"],
        "Short chain of command & wide span of control",
        "A flat organizational structure is characterized by having few layers of management (a short chain of command) and a large number of employees reporting to each manager (a wide span of control)."
    ),
    createQuestion(
        "A company is organized into a production department, a sales department, and a finance department. This is an example of what kind of structure?",
        ["Divisional", "Functional", "Matrix", "Team-based"],
        "Functional",
        "A functional structure is one where the organization is divided into departments based on the business functions they perform, such as production, sales, and finance."
    ),
    createQuestion(
        "In which organizational structure do employees report to both a functional manager and a project manager?",
        ["Divisional", "Matrix", "Team-based", "Project-based"],
        "Matrix",
        "A matrix structure is unique because it combines functional and project-based structures. This results in employees having two managers: their regular functional manager and a manager for the specific project they are working on."
    ),
    createQuestion(
        "The degree to which decision-making power is concentrated at the highest levels of an organization is known as:",
        ["Chain of command", "Centralization", "Decentralization", "Span of Control"],
        "Centralization",
        "Centralization refers to the degree to which decision-making authority is concentrated at the top levels of an organization. In highly centralized structures, top managers make all the key decisions."
    ),
    createQuestion(
        "Which of these structures is most associated with centralized decision-making?",
        ["Bureaucracy", "Team-based", "Matrix", "None of the above"],
        "Bureaucracy",
        "Bureaucracy, with its emphasis on a clear hierarchy, formal rules, and top-down authority, is the structure most associated with centralized decision-making."
    ),
    createQuestion(
        "A key weakness of this structure is reduced communication between departments, even though it fosters skill specialization.",
        ["Divisional", "Functional", "Matrix", "Team-based"],
        "Functional",
        "A key weakness of the functional structure is that it creates \"silos.\" While it promotes expertise within a function, it can lead to poor communication and coordination between different departments."
    ),
    createQuestion(
        "What is a common disadvantage of flat organizational structures?",
        ["They offer few promotional opportunities.", "There is a duplication of area expertise.", "They can become “top heavy.”", "They are less suited for routine tasks."],
        "They offer few promotional opportunities.",
        "Because flat structures have very few layers of management, there is a limited \"corporate ladder\" for employees to climb, resulting in fewer opportunities for promotion."
    ),
    createQuestion(
        "An advantage of a divisional structure is that it:",
        ["eliminates the duplication of functions.", "exposes specialists to others within the same specialty.", "ensures greater accountability for each division.", "All of the above"],
        "ensures greater accountability for each division.",
        "A divisional structure groups the organization into semi-autonomous units (e.g., based on product or region). This makes each division's manager directly responsible for its performance, ensuring clear accountability."
    ),
    createQuestion(
        "One significant drawback of this structure is the confusion and potential conflict that can arise from reporting to two different bosses.",
        ["Divisional", "Matrix", "Functional", "Team-based"],
        "Matrix",
        "The main disadvantage of a matrix structure is the dual-reporting system. Having two bosses can create role conflict, power struggles, and confusion for employees."
    ),
    createQuestion(
        "A new startup with a small number of employees who are directly supervised by the owners has what kind of organizational structure?",
        ["Simple", "Functional", "Divisional", "Tall"],
        "Simple",
        "A simple structure is common in startups and is characterized by low departmentalization, high centralization of authority (usually with the owner), and little formalization."
    ),
    createQuestion(
        "What graphically depicts the various levels of authority and the number of employees reporting to each position in an organization?",
        ["organigram", "organizational chart", "organizational picture", "two of the options are correct"],
        "two of the options are correct",
        "An organizational chart, which is also called an organigram, is the graphical diagram that illustrates the structure, hierarchy, and reporting relationships within an organization."
    ),
    createQuestion(
        "A structure characterized by a narrow span of control, high formalization, and high centralization is known as:",
        ["mechanistic", "organismic", "mechanic", "organic"],
        "mechanistic",
        "A mechanistic structure is one that is rigid and machine-like. It is characterized by high formalization (many rules), high centralization (top-down decisions), and narrow spans of control."
    ),
    createQuestion(
        "The optimal structure for an organization is dependent on its external environment. For dynamic environments, a mechanistic structure is more suitable.",
        ["The first statement is false", "The second statement is false", "Both statements are not false", "Both statements are false"],
        "The second statement is false",
        "The first statement is true; structure should match the environment. However, the second statement is false. A dynamic environment requires a flexible, organic structure. A rigid, mechanistic structure is suitable for a stable environment."
    ),
    createQuestion(
        "The more complex the environment, the more __________ the organization should be.",
        ["centralized", "decentralized", "rigid", "none of the above"],
        "decentralized",
        "As the external environment becomes more complex and uncertain, top managers cannot process all the necessary information. Therefore, the organization must become more decentralized, pushing decision-making authority down to lower-level employees who are closer to the problems."
    ),
    createQuestion(
        "If an organization operates in a diverse environment, what structure should it ideally employ?",
        ["functional", "divisional", "matrix", "project-based"],
        "divisional",
        "A divisional structure is ideal for a diverse environment because it allows the organization to create separate divisions to handle different segments (e.g., different product lines or geographic regions), enabling each to adapt to its specific circumstances."
    ),
    createQuestion(
        "An organization's strategy is dependent on its structure.",
        ["this is least likely false", "this is least likely true", "this is sometimes true", "this is sometimes false"],
        "this is least likely false",
        "\"Least likely false\" means it is most likely true. The classic strategic principle \"structure follows strategy\" holds that an organization's structure is designed or modified to support the execution of its chosen strategy."
    ),
    createQuestion(
        "The process by which organizations transition from their present state to a more effective one, often by changing structure, technology, or processes, is called:",
        ["Organizational change", "Organizational development", "Organizational transformation", "Organizational transition"],
        "Organizational change",
        "Organizational change is the general term for the process by which an organization moves from its current state to a desired future state to increase its effectiveness."
    ),
    createQuestion(
        "What is the key difference between organizational change and organizational development?",
        ["Org change is holistic; org development is focused on specific areas.", "Org change is a longer process than org development.", "Org change focuses on specific situations; org development is holistic.", "Org change is more concerned with individual employee growth."],
        "Org change focuses on specific situations; org development is holistic.",
        "Organizational change often refers to a specific, finite project or initiative. Organizational Development (OD) is a broader, long-term, and holistic approach focused on improving the overall health and effectiveness of the organization through planned interventions."
    ),
    createQuestion(
        "When a growing company alters its hierarchy and structural characteristics, shifting from a flat to a taller structure, it is undergoing what type of change?",
        ["Merger", "Structural", "Developmental", "Incremental"],
        "Structural",
        "This is a structural change because it involves altering the fundamental architecture of the organization, specifically its hierarchy and reporting relationships."
    ),
    createQuestion(
        "A company lays off employees to remain financially viable. This action is what kind of organizational change?",
        ["Downsizing", "Upsizing", "De-merger", "Incremental"],
        "Downsizing",
        "Downsizing is the specific term for an organizational change that involves reducing the size of the workforce, typically to cut costs and improve financial viability."
    ),
    createQuestion(
        "A manager presents data on declining sales to her team to create a sense of urgency for change. According to Lewin's model, this is the __________ stage.",
        ["defreezing", "unfreezing", "moving", "changing"],
        "unfreezing",
        "In Lewin's three-stage model, unfreezing is the first stage. Its goal is to create motivation for change by making people realize that the current state is no longer sustainable. Presenting data on declining sales achieves this by creating a sense of urgency."
    ),
    createQuestion(
        "What is the correct sequence of Kurt Lewin's three stages of change?",
        ["Freezing, Defreezing, Refreezing", "Unfreezing, Changing, Refreezing", "Unfreezing, Refreezing, Changing", "Defreezing, Changing, Freezing"],
        "Unfreezing, Changing, Refreezing",
        "The correct sequence of Lewin's model is: 1) Unfreezing: Preparing for change. 2) Changing: Implementing the change. 3) Refreezing: Solidifying the change and making it permanent."
    ),
    createQuestion(
        "A group of two or more people who interact, influence each other, and are mutually accountable for achieving common goals is called a:",
        ["Friend group", "Team", "Family", "None of the above"],
        "Team",
        "While all groups involve interaction, a team is specifically defined by the presence of mutual accountability and a shared commitment to achieving a common goal."
    ),
    createQuestion(
        "In which stage of team development do members establish roles and work to ease tension from the prior stage?",
        ["Forming", "Norming", "Storming", "Performing"],
        "Norming",
        "After the conflict of the storming stage, the norming stage is when the team establishes its rules, roles, and norms for working together. Cohesion and a sense of shared purpose begin to develop."
    ),
    createQuestion(
        "This stage of team development is marked by disagreements and resistance to team roles among group members.",
        ["Forming", "Storming", "Norming", "Adjourning"],
        "Storming",
        "The storming stage of team development is characterized by conflict and disagreement as team members assert their individual personalities and jockey for position and roles within the team."
    ),
    createQuestion(
        "The additional costs associated with team development and maintenance, rather than direct task work, are known as:",
        ["Process losses", "Brook’s Law", "Social inhibition", "Resource losses"],
        "Process losses",
        "Process losses are the time and energy spent on activities that don't directly contribute to the task, such as coordinating efforts, resolving conflicts, and team maintenance. These are the inherent costs of working in a team."
    ),
    createQuestion(
        "The tendency for individuals to exert less effort when working in a team compared to when working alone is called:",
        ["Social inhibition", "Social loafing", "Social facilitation", "Social compensation"],
        "Social loafing",
        "Social loafing is the tendency for individuals to reduce their effort when they are working as part of a group compared to when they are working alone."
    ),
    createQuestion(
        "Groupthink is most likely to happen when:",
        ["the group is not isolated", "the group lacks cohesion", "there is pressure to make a quick decision", "the group allows for dissenters"],
        "there is pressure to make a quick decision",
        "Groupthink is a dysfunctional decision-making process that occurs when a cohesive group's desire for unanimity overrides critical thinking. It is more likely to happen when the group is under high stress or pressure to make a quick decision."
    ),
    createQuestion(
        "A team formed for a single, one-time output that disbands upon completion of the task is a:",
        ["Project team", "Parallel team", "Work team", "Management team"],
        "Project team",
        "A project team is a temporary team formed to complete a specific, one-time project. The team disbands after the project is finished."
    ),
    createQuestion(
        "Teams composed of members from different departments within an organization are called:",
        ["parallel teams", "cross-functional teams", "both a & b", "none of the above"],
        "cross-functional teams",
        "Cross-functional teams are explicitly composed of members drawn from different departments or functional areas within an organization to bring diverse perspectives to a project."
    ),
    createQuestion(
        "This arises when one individual perceives that another person is obstructing their goals or rights, leading to a psychological and behavioral reaction.",
        ["Conflict", "Problem", "Dispute", "All of the above"],
        "Conflict",
        "Conflict is the process that begins when one party perceives that another party has negatively affected something the first party cares about. It involves a perception of opposition or obstruction."
    ),
    createQuestion(
        "When a neutral third party is needed to make a binding decision for conflicting parties, the process is called:",
        ["Mediation", "Arbitration", "Moderation", "Both a & b"],
        "Arbitration",
        "Arbitration is a conflict resolution process where a neutral third party hears both sides and makes a decision. This decision is typically binding, meaning the parties have agreed in advance to accept it."
    ),
    createQuestion(
        "The conflict style where both parties achieve their desired outcomes, representing a \"win-win\" situation, is known as:",
        ["Compromising", "Collaborative", "Accommodating", "Forcing"],
        "Collaborative",
        "The collaborative conflict style is the ideal \"win-win\" approach. Both parties work together to find a creative solution that fully satisfies everyone's goals."
    ),
    createQuestion(
        "Which conflict style typically involves negotiation and bargaining?",
        ["Compromising", "Accommodating", "Collaborative", "Forcing"],
        "Compromising",
        "The compromising style involves negotiation and bargaining, where each party agrees to give up something in order to arrive at a mutually acceptable middle-ground solution. It is a \"lose-lose\" or \"partial win-partial win\" situation."
    ),
    createQuestion(
        "All of the following are reasons for joining a group EXCEPT:",
        ["identification", "physical proximity", "assignment", "social proximity"],
        "social proximity",
        "People join groups for many reasons, including assignment (being put in a group), physical proximity (being near others), and identification (a sense of belonging). \"Social proximity\" is not a standard term used to describe a reason for joining a group."
    ),
    createQuestion(
        "A __________ group is more likely to have better performance.",
        ["homogenous", "heterogenous", "slightly heterogenous", "uniform"],
        "slightly heterogenous",
        "Research suggests that a slightly heterogeneous group often performs best. It has enough diversity to bring in new ideas and perspectives but not so much diversity that it leads to constant conflict and communication breakdowns."
    ),
    createQuestion(
        "Which of the following is NOT considered a fundamental business element?",
        ["market", "money", "people", "environment"],
        "environment",
        "The three fundamental internal elements of a business are often considered its market (customers), money (capital), and people (employees). The environment is a critical external factor that affects the business."
    ),
    createQuestion(
        "To succeed, a business must identify and cater to its:",
        ["market", "people", "money", "environment"],
        "market",
        "A business cannot exist without a market—a group of customers with a need or desire for its product or service and the ability to pay for it."
    ),
    createQuestion(
        "This element is crucial as it makes the business function and operate.",
        ["market", "people", "money", "environment"],
        "money",
        "Money, or capital, is the essential financial resource that allows a business to operate—to pay for people, equipment, and materials."
    ),
    createQuestion(
        "The utilization of individuals to achieve organizational objectives is known as:",
        ["human resource development", "human resource management", "both a & b", "none of the above"],
        "human resource management",
        "Human Resource Management (HRM) is the formal term for the process of utilizing an organization's people to achieve its strategic objectives."
    ),
    createQuestion(
        "The process of ensuring an organization has the right number of employees with the right competencies in the right jobs is called:",
        ["HR planning", "workforce planning", "staffing", "recruiting"],
        "HR planning",
        "HR planning is the strategic process of forecasting the organization's future need for employees (demand) and determining if the current workforce can meet that need (supply)."
    ),
    createQuestion(
        "This process where the HR department identifies the organization's current and future hiring needs through supply and demand forecasting is:",
        ["HR planning", "employee planning", "staff planning", "all of the above"],
        "all of the above",
        "HR planning, employee planning, and staff planning are all interchangeable terms for the same process of forecasting and planning for an organization's talent needs."
    ),
    createQuestion(
        "This refers to the process of choosing an individual with the appropriate qualifications and competencies for a specific job.",
        ["staffing", "selection", "recruitment", "hiring"],
        "selection",
        "Selection is the specific step in the staffing process where you choose the most qualified individual for a job from the pool of candidates generated during recruitment."
    ),
    createQuestion(
        "This system helps managers monitor and evaluate an employee's work.",
        ["HR planning", "HR evaluation", "employee evaluation", "performance management"],
        "performance management",
        "Performance management is the continuous process that includes setting performance goals, monitoring progress, providing feedback, and evaluating an employee's contributions to the organization."
    ),
    createQuestion(
        "Which of the following is NOT an internal recruitment method?",
        ["use of HR database", "job posting & bidding", "employee referral", "none of the above"],
        "none of the above",
        "All the options listed are internal recruitment methods. A job posting is for current employees, an HR database contains information on current employees, and an employee referral program uses current employees to find candidates. Therefore, none of them are external methods."
    ),
    createQuestion(
        "Financial rewards like paid vacations, sick leave, and medical insurance are considered:",
        ["core compensation", "indirect financial compensation", "employee benefits", "two options are correct"],
        "two options are correct",
        "Paid vacations and medical insurance are forms of employee benefits. Benefits are also a type of indirect financial compensation. Therefore, two of the options are correct."
    ),
    createQuestion(
        "All of the following are functions of Human Resource Management EXCEPT:",
        ["staffing", "training", "employee and labor relations", "compensation"],
        "training",
        "The primary functions of HRM are typically categorized as Staffing, Human Resource Development (HRD), Compensation, and Employee and Labor Relations. Training is a key activity within the broader function of HRD."
    ),
    createQuestion(
        "Human Resource Development (HRD) is a major HRM function focused on improving employee performance and organizational effectiveness.",
        ["The first statement is true", "The second statement is true", "Both statements are true", "Both statements are false"],
        "Both statements are true",
        "Both statements are true. Human Resource Development (HRD) is a major HRM function that focuses on learning and development activities designed to improve both individual employee performance and overall organizational effectiveness."
    ),
    createQuestion(
        "Which of the following is a function of HRD?",
        ["training", "career development", "performance management", "all of the above"],
        "all of the above",
        "The function of Human Resource Development (HRD) encompasses a range of activities including training for current jobs, career development for future roles, and performance management to align employee efforts with organizational goals."
    ),
    createQuestion(
        "The planned effort by an organization to facilitate employees' learning of job-related behaviors is called:",
        ["training", "orientation", "onboarding", "all of the above"],
        "training",
        "Training is the specific, planned effort by an organization to provide employees with the job-related knowledge, skills, and behaviors needed to perform their current job effectively."
    ),
    createQuestion(
        "This process aims to provide new employees with the necessary information to function effectively and to initiate their emotional attachment to the organization.",
        ["employee orientation", "mentoring", "training", "none of the above"],
        "employee orientation",
        "Employee orientation is the initial process of providing new employees with the basic information they need about the company, its culture, and their job so they can function effectively and begin to feel like part of the organization."
    ),
    createQuestion(
        "What is the first step in developing an employee training system?",
        ["needs analysis", "organizational analysis", "task analysis", "person analysis"],
        "needs analysis",
        "The first step in any effective training program is a needs analysis. This determines if training is the right solution, what content needs to be taught (task analysis), and which employees need the training (person analysis)."
    ),
    createQuestion(
        "According to Kirkpatrick's model, what is the correct chronological order of the four levels for evaluating training effectiveness?",
        ["Learning, Reaction, Behavior, Results", "Reaction, Learning, Behavior, Results", "Behavior, Learning, Reaction, Results", "Reaction, Behavior, Learning, Results"],
        "Reaction, Learning, Behavior, Results",
        "Kirkpatrick's model for evaluating training effectiveness follows a specific order: Level 1 is Reaction (did they like it?), Level 2 is Learning (did they learn it?), Level 3 is Behavior (are they using it?), and Level 4 is Results (did it impact the organization?)."
    ),
    createQuestion(
        "An employee is told that in addition to her current duties, she will now also work in the kitchen and as a cashier, rotating these jobs every two weeks. This is an example of:",
        ["job enlargement", "job rotation", "job enrichment", "job addition"],
        "job rotation",
        "Job rotation involves systematically moving an employee from one job to another to increase their range of skills. The employee is rotating through three different jobs every two weeks."
    ),
    createQuestion(
        "A social media manager, initially responsible only for replying to inquiries, is now also tasked with content creation and advertising campaigns. This is an example of:",
        ["job enlargement", "job enrichment", "job rotation", "job addition"],
        "job enlargement",
        "Job enlargement means adding more tasks at the same level of responsibility to an employee's job (horizontal loading). The manager's job was enlarged to include content creation and advertising, in addition to her original task of replying to inquiries."
    ),
    createQuestion(
        "The lifelong series of activities that contribute to a person's career exploration, establishment, success, and fulfillment is known as:",
        ["career planning", "career management", "career development", "career retention"],
        "career development",
        "Career development is the broad, lifelong process that encompasses all the activities and experiences that contribute to a person's career path, including personal planning and organizational management."
    ),
    createQuestion(
        "This process enables employees to better understand and develop their skills and interests for use both within the organization and after they leave.",
        ["career planning", "career management", "career development", "career retention"],
        "career planning",
        "Career planning is the process from the employee's perspective. It involves an individual assessing their own interests and skills and setting goals for their career path."
    ),
    createQuestion(
        "Improving hygiene factors, according to Herzberg's Two-Factor Theory, will:",
        ["increase job satisfaction", "decrease job satisfaction", "neutralize job dissatisfaction", "increase job dissatisfaction"],
        "neutralize job dissatisfaction",
        "In Herzberg's Two-Factor Theory, hygiene factors (like pay and working conditions) do not create satisfaction. Their absence causes dissatisfaction. Therefore, improving hygiene factors can only eliminate or neutralize dissatisfaction."
    ),
    createQuestion(
        "All of the following are considered hygiene factors EXCEPT for:",
        ["Pay", "Achievement", "Working conditions", "Work schedule"],
        "Achievement",
        "In Herzberg's theory, achievement is a motivator, an intrinsic factor related to the work itself that leads to satisfaction. Pay, working conditions, and schedule are all extrinsic hygiene factors that can cause dissatisfaction if they are poor."
    ),
    createQuestion(
        "According to ERG Theory:",
        ["Only I is true", "I & III are true", "I & II are true", "Only III is true"],
        "I & III are true",
        "ERG theory has three levels: Existence, Relatedness, and Growth (I is true). A key feature is the frustration-regression principle, which states that if a person is frustrated in their attempt to satisfy a higher-level need, they may regress and focus on a lower-level need (III is true). It does not require strict hierarchical progression (II is false)."
    ),
    createQuestion(
        "The ERG theory of motivation was developed as a modification of:",
        ["Hierarchy of Needs", "Two-Factor Theory", "Discrepancy Theory", "Job Characteristics Theory"],
        "Hierarchy of Needs",
        "Clayton Alderfer's ERG theory was developed as a modification of Maslow's Hierarchy of Needs, condensing Maslow's five levels into the three categories of Existence, Relatedness, and Growth."
    ),
    createQuestion(
        "When an employee's expectations about a job, formed during the hiring process, do not match the reality of the job, the result is likely to be:",
        ["satisfaction and motivation", "dissatisfaction and demotivation", "dissatisfaction and motivation", "neutrality"],
        "dissatisfaction and demotivation",
        "When the reality of a job does not match the expectations an employee formed during the recruitment process, it leads to disillusionment, which in turn causes job dissatisfaction and a decline in motivation."
    ),
    createQuestion(
        "The principle that states all activities with a shared objective should be overseen by one manager using a single plan is called:",
        ["unity of direction", "unity of command", "one command", "one direction"],
        "unity of direction",
        "Unity of direction is a management principle stating that all activities aimed at the same objective should be organized under one manager with one plan. This ensures coordinated effort."
    ),
    createQuestion(
        "Which of the following is NOT a principle of management based on administrative theory?",
        ["Employees should be assigned to tasks they can excel at.", "Everyone in the organization must follow the rules.", "Fair pay is crucial for employee satisfaction.", "Decision-making should be centralized for efficiency."],
        "Decision-making should be centralized for efficiency.",
        "Henri Fayol's principle of Centralization states that the degree of centralization should be appropriate for the specific organization and situation; it is not a rule that it should always be centralized for efficiency. The other options are consistent with his principles of Division of Work, Discipline, and Remuneration."
    ),
    createQuestion(
        "A manager who meticulously monitors her team to ensure plans and instructions are followed is performing which function of management?",
        ["organizing", "controlling", "commanding", "directing"],
        "controlling",
        "Controlling is the management function that involves monitoring activities to ensure they are being accomplished as planned and correcting any significant deviations."
    ),
    createQuestion(
        "Which of the following is NOT part of Henri Fayol's functions of management?",
        ["organizing", "directing", "commanding", "controlling"],
        "directing",
        "Henri Fayol's original five functions of management were Planning, Organizing, Commanding, Coordinating, and Controlling. \"Directing\" is a more modern term often used to describe leading or commanding, but it was not one of his original five terms."
    ),
    createQuestion(
        "The production department in a manufacturing company typically has what kind of function?",
        ["Line function", "Staff function", "Linear function", "Employee function"],
        "Line function",
        "A line function is directly involved in achieving the primary objectives of the organization. In a manufacturing company, the production department is a core line function because it creates the product."
    ),
    createQuestion(
        "A group of colleagues who regularly meet for coffee after work form what kind of group?",
        ["formal group", "friendship group", "interest group", "task group"],
        "friendship group",
        "A friendship group is an informal group that forms because the members share common characteristics and enjoy each other's company."
    ),
    createQuestion(
        "The difference between tall and flat organizational structures is that:",
        ["Flat structures offer many promotional opportunities, while tall structures do not.", "Tall structures offer many promotional opportunities, while flat structures do not.", "There may be inadequate supervision in tall structures, while there is in flat structures.", "None of the above."],
        "Tall structures offer many promotional opportunities, while flat structures do not.",
        "Tall structures have many hierarchical levels, which creates more steps on the \"corporate ladder\" and thus more opportunities for promotion. Flat structures have very few levels, limiting promotional paths."
    ),
    createQuestion(
        "Which of these is an advantage of a divisional structure?",
        ["It eliminates duplication of functions.", "It ensures greater accountability for each division as they function like separate entities.", "It exposes specialists to others within the same specialty.", "All of the above."],
        "It ensures greater accountability for each division as they function like separate entities.",
        "In a divisional structure, the organization is broken into semi-autonomous units. The performance of each unit can be measured separately, which creates clear accountability for the division managers."
    ),
    createQuestion(
        "A team formed from members of different departments is known as a:",
        ["parallel team", "cross-functional team", "management team", "work team"],
        "cross-functional team",
        "A cross-functional team is, by definition, a team composed of members from different functional areas or departments of the organization."
    ),
    createQuestion(
        "The arbitration process can be:",
        ["only binding", "only non-binding", "either binding or non-binding", "is never required by an organization"],
        "either binding or non-binding",
        "Arbitration can be either binding (where the parties agree beforehand to accept the arbitrator's decision as final) or non-binding (where the decision is merely a recommendation)."
    ),
    createQuestion(
        "The best conflict style, which aims for a \"win-win\" outcome where both sides get what they want, is:",
        ["Compromising", "Accommodating", "Collaborative", "Forcing"],
        "Collaborative",
        "The collaborative style is considered the best conflict-handling style because it is a \"win-win\" approach. It focuses on problem-solving to find a solution that fully satisfies the concerns of both parties."
    ),
    createQuestion(
        "In a situation where Donato and Bianca perform the same task next to each other, and this causes Bianca's productivity to decrease, this is an example of:",
        ["social inhibition", "coaction", "social facilitation", "audience effects"],
        "social inhibition",
        "Social inhibition is the tendency for an individual's performance to worsen when they are in the presence of others. Bianca's productivity decreased when working alongside Donato. Coaction is simply the term for the situation of working alongside others."
    ),
    createQuestion(
        "This theory suggests that workers and their organization are like a machine.",
        ["Scientific Management", "Neoclassical", "Administrative", "Bureaucratic"],
        "Scientific Management",
        "Scientific Management is the theory that most strongly promotes the idea of an organization as a machine, where processes are standardized and workers are seen as interchangeable parts designed for maximum efficiency."
    ),
    createQuestion(
        "The purpose of this theory is to assist organizations in creating the most effective structures to achieve their goals.",
        ["Classical", "Neoclassical", "Contingency", "Open systems"],
        "Classical",
        "The provided answer key says A for Q97 which is Classical. The purpose of classical theory is to assist organizations in creating the most effective structures to achieve their goals."
    ),
    createQuestion(
        "The scalar function pertains to the vertical growth of an organization, while the functional process deals with its horizontal growth.",
        ["The first statement is least likely true.", "The second statement is least likely true.", "Both statements are least likely false.", "Both statements are least likely true."],
        "Both statements are least likely true.",
        "\"Least likely false\" means both statements are likely true. The scalar function refers to the vertical hierarchy (chain of command). The functional process refers to the horizontal differentiation of the organization into specialized departments."
    ),
    createQuestion(
        "An ideal span of control, according to Lyndall Urwick, should consist of a maximum of ___ members at higher levels and around ___ members at lower levels.",
        ["4; 8-12", "4; 6-10", "5; 8-12", "5; 6-10"],
        "4; 8-12",
        "Classical theorist Lyndall Urwick provided specific guidelines for the span of control, suggesting an ideal of 4 subordinates for higher-level managers and a range of 8-12 for lower-level supervisors."
    ),
    createQuestion(
        "All of the following environmental factors can affect an organization EXCEPT:",
        ["internal communication policies", "demographic factors", "economic factors", "natural factors"],
        "internal communication policies",
        "Internal communication policies are an internal organizational factor. Demographic, economic, and natural factors are all elements of the external environment that can impact an organization."
    ),
];

export const ioPsych1MarketplaceItem: MarketplaceItem = {
    id: 'io-psych-set-a-100',
    title: 'IO Psych 1 - BLEPP 2025 (100 Items)',
    description: 'Comprehensive 100-item BLEPP Test Bank for Industrial-Organizational Psychology (Set A). Covers Organizational Theory, Motivation, Team Development, HRM, HRD, Conflict Management, and more. Includes detailed explanations.',
    category: 'Education',
    author: 'Kid Asuncion / BLEPP 2025',
    downloads: 0,
    rating: 5.0,
    price: 'Free',
    content: ioPsych1Questions
};
