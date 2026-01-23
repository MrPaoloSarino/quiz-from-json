import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';


const createQuestion = (q: string, opts: string[], ans: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
});

const theoriesQuestions: QuizQuestion[] = [
    // 1. Filipino Psychology (Sikolohiyang Pilipino) - Approx 15
    createQuestion("Who is the Father of Sikolohiyang Pilipino?", ["Virgilio Enriquez", "Alfredo Lagmay", "Jaime Bulatao", "Zeus Salazar"], "Virgilio Enriquez"),
    createQuestion("The core value (kapwa) in Filipino Psychology refers to:", ["Self-identity", "Shared identity/Togetherness", "Independence", "Social status"], "Shared identity/Togetherness"),
    createQuestion("Which interaction level is considered the highest level of 'Hindi Ibang-tao'?", ["Pakikipagpalagayang-loob", "Pakikisama", "Pakikibagay", "Pakikipagkaisa"], "Pakikipagkaisa"),
    createQuestion("'Pakikiramdam' is strictly defined as:", ["Shared inner perception", "Smooth Interpersonal Relations", "Sensitivity to non-verbal cues", "Emotional blackmail"], "Shared inner perception"),
    createQuestion("The pivotal interpersonal value in SP is:", ["Pakikisama", "Hiya", "Pakikiramdam", "Utang na loob"], "Pakikiramdam"),
    createQuestion("Which is strictly an 'Ibang-tao' (Outsider) interaction?", ["Pakikipagpalagayang-loob", "Pakikisangkot", "Pakikitungo", "Pakikipagkaisa"], "Pakikitungo"),
    createQuestion("'Bahala na' was re-interpreted by Lagmay not as fatalism, but as:", ["Risk-taking and determination", "Laziness", "Leaving it to God only", "Submit to fate"], "Risk-taking and determination"),
    createQuestion("The concept of 'Hiya' in SP is best translated as:", ["Shame", "Sense of propriety", "Embarrassment", "Guilt"], "Sense of propriety"),
    createQuestion("Which is NOT a confrontative surface value in SP?", ["Bahala na", "Lakas ng loob", "Pakikibaka", "Pakikisama"], "Pakikisama"),
    createQuestion("'Utang na loob' in the correct Filipino context means:", ["Debt of gratitude", "Gratitude/Solidarity", "Burden of repayment", "Buying votes"], "Gratitude/Solidarity"),
    createQuestion("The method 'Pagtatanong-tanong' is characterized by:", ["Structured interviews", "Casual, informal questioning", "Written surveys", "Laboratory experiments"], "Casual, informal questioning"),
    createQuestion("One of the psychopathologies in SP, 'Bangungot', refers to:", ["Sudden unexplained death in sleep", "Talking in sleep", "Sleepwalking", "Night terrors"], "Sudden unexplained death in sleep"),
    createQuestion("'Amok' is traditionally associated with:", ["Social withdrawal", "Sudden outburst of violence", "Depression", "Anxiety"], "Sudden outburst of violence"),
    createQuestion("The 'Great Cultural Divide' involves:", ["Rich vs Poor", "Tagalog vs Bisaya", "Academic (Western) vs Indigenous Psychology", "Men vs Women"], "Academic (Western) vs Indigenous Psychology"),
    createQuestion("Which creates the bridge between 'Ibang-tao' and 'Hindi Ibang-tao'?", ["Pakikisama", "Pakikibagay", "Pakikisalamuha", "Pakikipagpalagayang-loob"], "Pakikisama"), // This is often debated, but usually transition point.

    // 2. Psychoanalytic (Freud) - Approx 15
    createQuestion("Freud's term for 'psychic energy' driven by the life instinct:", ["Thanatos", "Libido", "Aggression", "Cathexis"], "Libido"),
    createQuestion("The 'Moral Executive' of personality:", ["Id", "Ego", "Superego", "Conscious"], "Superego"),
    createQuestion("Which defense mechanism involves attributing one's own unacceptable impulses to another?", ["Displacement", "Projection", "Reaction Formation", "Sublimation"], "Projection"),
    createQuestion("The stage where the Oedipus Complex occurs:", ["Oral", "Anal", "Phallic", "Latency"], "Phallic"),
    createQuestion("Fixation at the Oral stage may result in:", ["Obsessiveness", "Sarcastic/Biting personality", "Sexual promiscuity", "Rigidity"], "Sarcastic/Biting personality"),
    createQuestion("The 'Reality Principle' governs the:", ["Id", "Ego", "Superego", "Unconscious"], "Ego"),
    createQuestion("Converting an unacceptable impulse into its opposite:", ["Repression", "Reaction Formation", "Denial", "Rationalization"], "Reaction Formation"),
    createQuestion("Freud believed anxiety is felt by the:", ["Id", "Ego", "Superego", "Body"], "Ego"),
    createQuestion("The latency period is characterized by:", ["Sexual explosion", "Dormant sexual feelings", "Conflict with parents", "Castration anxiety"], "Dormant sexual feelings"),
    createQuestion("'Parapraxes' are commonly known as:", ["Dreams", "Freudian Slips", "Neuroses", "Psychoses"], "Freudian Slips"),
    createQuestion("The goal of Psychoanalysis is:", ["To strengthen the Id", "To make the unconscious conscious", "To suppress the Superego", "To achieve self-actualization"], "To make the unconscious conscious"),
    createQuestion("Primary Process thinking is associated with:", ["Logic", "The Id", "The Ego", "Reality"], "The Id"),
    createQuestion("A woman angry at her boss goes home and yells at her dog. This is:", ["Projection", "Displacement", "Sublimation", "Regression"], "Displacement"),
    createQuestion("The most basic defense mechanism underlying all others:", ["Repression", "Denial", "Splitting", "Intellectualization"], "Repression"),
    createQuestion("Freud's seduction theory originally proposed:", ["Child sexual abuse was the cause of hysteria", "Fantasy causes hysteria", "Sex is not important", "Dreams are meaningless"], "Child sexual abuse was the cause of hysteria"),

    // 3. Neopsychoanalytic (Jung, Adler, Horney, etc) - Approx 20
    createQuestion("Jung's 'Collective Unconscious' contains:", ["Repressed memories", "Archetypes", "Personal complexes", "Learned behaviors"], "Archetypes"),
    createQuestion("The archetype representing the dark side of personality:", ["Persona", "Shadow", "Anima", "Self"], "Shadow"),
    createQuestion("Adler's 'Organ Inferiority' leads to:", ["Compensation", "Resignation", "Death instinct", "Sexual drive"], "Compensation"),
    createQuestion("Adler believed birth order influences personality. The 'First Born' is often:", ["Conservative and authoritarian", "Rebellious", "Dependent", "The peacemaker"], "Conservative and authoritarian"),
    createQuestion("Horney's 'Moving Against People' solution involves:", ["Compliance", "Aggression/Expansiveness", "Withdrawal", "Love"], "Aggression/Expansiveness"),
    createQuestion("Which theorist emphasized the 'Psychosocial' stages of development?", ["Freud", "Erikson", "Piaget", "Skinner"], "Erikson"),
    createQuestion("In Erikson's theory, the virtue gained in 'Autonomy vs Shame/Doubt' is:", ["Hope", "Will", "Purpose", "Competence"], "Will"),
    createQuestion("Sullivan's 'Epochs' are stages of:", ["Sexual development", "Interpersonal development", "Cognitive growth", "Moral reasoning"], "Interpersonal development"),
    createQuestion("Fromm's 'Productive Orientation' is the ideal. Which is a non-productive orientation?", ["Exploitative", "Creative", "Responsible", "Loving"], "Exploitative"),
    createQuestion("The 'Strange Situation' protocol (Ainsworth) assesses:", ["Intelligence", "Attachment styles", "Aggression", "Obedience"], "Attachment styles"),
    createQuestion("Jung's personality types (Introversion/Extraversion) became the basis for:", ["MMPI", "MBTI", "Rorschach", "Thematic Apperception Test"], "MBTI"),
    createQuestion("Adler's concept of 'Gemeinschaftsgefuhl' means:", ["Social Interest", "Inferiority Complex", "Style of Life", "Creative Power"], "Social Interest"),
    createQuestion("Horney disputed Freud's 'Penis Envy' with:", ["Womb Envy", "Breast Envy", "Power Envy", "Father Envy"], "Womb Envy"),
    createQuestion("Erikson's stage for old age:", ["Intimacy vs Isolation", "Generativity vs Stagnation", "Integrity vs Despair", "Industry vs Inferiority"], "Integrity vs Despair"),
    createQuestion("Murray's TAT is based on his theory of:", ["Psychogenic Needs", "Traits", "Operant Conditioning", "Self-Psychology"], "Psychogenic Needs"),
    createQuestion("Klein's Object Relations theory focuses on the relationship with:", ["The Father", "The Mother/Breast", "Siblings", "Society"], "The Mother/Breast"),
    createQuestion("Winnicott's 'Transitional Object' refers to:", ["A favorite toy/blanket", "The mother", "The father", "The therapist"], "A favorite toy/blanket"),
    createQuestion("Mahler's 'Separation-Individuation' phase involves:", ["Hatching", "Imprinting", "Latency", "Puberty"], "Hatching"),
    createQuestion("Kohut is associated with:", ["Self Psychology", "Ego Psychology", "Id Psychology", "Behaviorism"], "Self Psychology"),
    createQuestion("Bowlby is best known for:", ["Attachment Theory", "Social Learning", "Cognitive Maps", "Defense Mechanisms"], "Attachment Theory"),

    // 4. Humanistic / Existential - Approx 15
    createQuestion("Maslow's highest originally proposed need:", ["Self-Esteem", "Self-Actualization", "Self-Transcendence", "Love"], "Self-Actualization"),
    createQuestion("Rogers's therapy is called:", ["Rational Emotive Therapy", "Client-Centered Therapy", "Gestalt Therapy", "Psychoanalysis"], "Client-Centered Therapy"),
    createQuestion("The 'Phenomenal Field' refers to:", ["The objective world", "The individual's subjective reality", "The unconscious", "The environment"], "The individual's subjective reality"),
    createQuestion("Rollo May defined 'Dadsein' as:", ["Being-in-the-world", "The unconscious", "Anxiety", "Will to power"], "Being-in-the-world"),
    createQuestion("Viktor Frankl's Logotherapy focuses on:", ["Pleasure", "Power", "Meaning", "Behavior"], "Meaning"),
    createQuestion("Rogers believed the root of pathology is:", ["Incongruence between Self and Organism", "Sexual repression", "Bad learning", "Chemical imbalance"], "Incongruence between Self and Organism"),
    createQuestion("Maslow's 'Jonah Complex' is:", ["Fear of one's own greatness", "Fear of failure", "Fear of water", "Fear of authority"], "Fear of one's own greatness"),
    createQuestion("Existentialists believe anxiety is:", ["Pathological", "An inevitable part of the human condition", "Curable by drugs", "Caused by parents"], "An inevitable part of the human condition"),
    createQuestion("The 'Ideal Self' is:", ["Who you are", "Who you want to be", "Who others want you to be", "Who you were"], "Who you want to be"),
    createQuestion("Gestalt Therapy (Perls) focuses on:", ["Here and Now", "There and Then", "Analysis of transference", "Dream interpretation symbols"], "Here and Now"),
    createQuestion("Frankl found meaning even in:", ["Wealth", "Concentration camps", "Meditation", "Books"], "Concentration camps"),
    createQuestion("The 'Fully Functioning Person' is a concept by:", ["Maslow", "Rogers", "May", "Allport"], "Rogers"),
    createQuestion("Which is a defining characteristic of Self-Actualizers?", ["Need for privacy", "Conformity", "Lack of humor", "Dependent on others"], "Need for privacy"),
    createQuestion("May's 'Normal Anxiety' is:", ["Disproportionate to the threat", "Repressed", "Proportionate to the threat", "Paralyzing"], "Proportionate to the threat"),
    createQuestion("Humanism is often called the:", ["First Force", "Second Force", "Third Force", "Fourth Force"], "Third Force"),

    // 5. Behavioral / Social Learning - Approx 15
    createQuestion("Skinner's Operant Conditioning is based on:", ["Stimulus-Response", "Consequences of behavior", "Thinking", "Observation"], "Consequences of behavior"),
    createQuestion("Negative Reinforcement involves:", ["Giving a reward", "Removing an aversive stimulus", "Punishment", "Extinction"], "Removing an aversive stimulus"),
    createQuestion("Bandura's 'Bobo Doll' experiment demonstrated:", ["Classical Conditioning", "Observational Learning", "Operant Conditioning", "Insight Learning"], "Observational Learning"),
    createQuestion("Self-Efficacy creates:", ["Confidence in ability to perform", "Higher IQ", "Better memory", "More friends"], "Confidence in ability to perform"),
    createQuestion("In Pavlov's experiment, the Bell started as:", ["Unconditioned Stimulus", "Conditioned Stimulus", "Neutral Stimulus", "Conditioned Response"], "Neutral Stimulus"),
    createQuestion("Fixed-Ratio schedule produces:", ["Steady response rate", "Post-reinforcement pause", "Scalloped effect", "Low response rate"], "Post-reinforcement pause"),
    createQuestion("Which schedule of reinforcement is most resistant to extinction?", ["Fixed Interval", "Fixed Ratio", "Variable Ratio", "Continuous"], "Variable Ratio"),
    createQuestion("Rotter's Locus of Control refers to:", ["Internal vs External attribution", "Emotional stability", "Social skills", "Intelligence"], "Internal vs External attribution"),
    createQuestion("Mischel's 'Marshmallow Test' measured:", ["Sensitivity", "Delay of gratification", "Hunger", "Obedience"], "Delay of gratification"),
    createQuestion("Watson is associated with:", ["Little Albert", "Little Hans", "Bobo Doll", "Skinner Box"], "Little Albert"),
    createQuestion("Thorndike's 'Law of Effect' states:", ["Practice makes perfect", "Responses followed by satisfaction are repeated", "Intelligence is fixed", "Behavior is random"], "Responses followed by satisfaction are repeated"),
    createQuestion("Systematic Desensitization is based on:", ["Operant Conditioning", "Classical Conditioning (Counter-conditioning)", "Modeling", "Cognitive restructuring"], "Classical Conditioning (Counter-conditioning)"),
    createQuestion("Bandura's 'Triadic Reciprocal Causation' involves Behavior, Environment, and:", ["Person/Cognitive factors", "Genetics", "Fate", "Unconscious"], "Person/Cognitive factors"),
    createQuestion("Shaping involves:", ["Reinforcing successive approximations", "Punishing bad behavior", "Modeling", "Flooding"], "Reinforcing successive approximations"),
    createQuestion("Punishment aims to:", ["Increase behavior", "Decrease behavior", "Maintain behavior", "Ignore behavior"], "Decrease behavior"),

    // 6. Trait / Dispositional - Approx 10
    createQuestion("Allport's Common Traits are:", ["Unique to the individual", "Shared by a culture/group", "Cardinal traits", "Secondary traits"], "Shared by a culture/group"),
    createQuestion("Cattell identified how many Source Traits?", ["5", "16", "3", "10"], "16"),
    createQuestion("Eysenck's three dimensions (PEN model):", ["Psychoticism, Extraversion, Neuroticism", "Passive, Eager, Nice", "Power, Energy, Need", "Past, Ego, Now"], "Psychoticism, Extraversion, Neuroticism"),
    createQuestion("Which is NOT one of the Big Five?", ["Openness", "Conscientiousness", "Aggressiveness", "Agreeableness"], "Aggressiveness"),
    createQuestion("The 'Lexical Hypothesis' suggests:", ["Important traits are encoded in language", "Traits are biological", "Personality is learned", "Words don't matter"], "Important traits are encoded in language"),
    createQuestion("Neuroticism is essentially:", ["Mental illness", "Emotional Instability", "Creativity", "Intelligence"], "Emotional Instability"),
    createQuestion("McCrae and Costa are associated with:", ["16PF", "The Big Five (NEO-PI)", "PEN Model", "DiSC"], "The Big Five (NEO-PI)"),
    createQuestion("A 'Proprium' is Allport's term for:", ["The Ego/Self", "A property", "A trait", "A habit"], "The Ego/Self"),
    createQuestion("Factor Analysis is a method to:", ["Group related variables", "Measure IQ", "Test hypothesis", "Experiment"], "Group related variables"),
    createQuestion("Biology plays a strong role in Eysenck's theory. Introverts have:", ["High cortical arousal", "Low cortical arousal", "No arousal", "Sleepy brains"], "High cortical arousal"),

    // 7. Cognitive / Other - Approx 10
    createQuestion("Kelly's 'Personal Construct Theory' likens people to:", ["Scientists", "Animals", "Machines", "Gods"], "Scientists"),
    createQuestion("A 'construct' is:", ["A way of interpreting the world", "A building", "A heavily reinforced behavior", "A suppressed memory"], "A way of interpreting the world"),
    createQuestion("Beck's 'Cognitive Triad' of depression involves negative views of:", ["Self, World, Future", "Past, Present, Future", "Family, Friends, Enemies", "Work, Life, Love"], "Self, World, Future"),
    createQuestion("Ellis's REBT ABC model stands for:", ["Activating event, Belief, Consequence", "Antecedent, Behavior, Consequence", "Apple, Banana, Carrot", "Action, Benefit, Cost"], "Activating event, Belief, Consequence"),
    createQuestion("Fixed Role Therapy is a technique by:", ["Kelly", "Rogers", "Freud", "Skinner"], "Kelly"),
    createQuestion("Evolutionary Psychology focuses on:", ["Survival and Reproduction", "Self-Actualization", "Unconscious drives", "Learning"], "Survival and Reproduction"),
    createQuestion("Buss is a key figure in:", ["Evolutionary Psychology", "Humanism", "Behaviorism", "Psychoanalysis"], "Evolutionary Psychology"),
    createQuestion("'Flow' (Csikszentmihalyi) occurs when:", ["Challenge meets Skill", "Skill exceeds challenge", "Challenge exceeds skill", "One is sleeping"], "Challenge meets Skill"),
    createQuestion("Seligman is the father of:", ["Positive Psychology", "Negative Psychology", "Abnormal Psychology", "Industrial Psychology"], "Positive Psychology"),
    createQuestion("Learned Helplessness was discovered by:", ["Skinner", "Seligman", "Bandura", "Pavlov"], "Seligman"),
];

export const theoriesMarketplaceItem: MarketplaceItem = {
    id: 'theories-personality-100',
    title: 'Theories of Personality Mastery (100 Items)',
    description: 'Complete 100-item reviewer for TOP. Covers Freud, Jung, Adler, Humanistic, Behavioral, Trait, and Sikolohiyang Pilipino.',
    category: 'Education',
    author: 'Cerebrum Master',
    downloads: 65,
    rating: 4.8,
    price: 'Premium',
    content: theoriesQuestions
};
