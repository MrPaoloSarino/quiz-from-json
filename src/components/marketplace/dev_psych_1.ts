import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';

const createQuestion = (q: string, opts: string[], ans: string, explanation?: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
    explanation,
});

const devPsych1Questions: QuizQuestion[] = [
    createQuestion(
        "John Locke, a prominent philosopher, famously described the infant's mind as a \"tabula rasa\" or blank slate, suggesting that all knowledge comes from experience. This viewpoint aligns with which philosophical stance?",
        ["Nativism", "Naturalism", "Empiricism", "Theorism"],
        "Empiricism",
        "Empiricism is the philosophical view that knowledge comes from experience. John Locke's \"tabula rasa\" or \"blank slate\" is the classic metaphor for this idea, suggesting we are not born with innate knowledge."
    ),
    createQuestion(
        "Which concept is central to the nativist perspective of language development, as proposed by Noam Chomsky?",
        ["Environmental reinforcement", "An innate, pre-wired language acquisition device", "Social imitation and modeling", "General cognitive learning mechanisms"],
        "An innate, pre-wired language acquisition device",
        "The nativist view, proposed by Noam Chomsky, argues that humans are born with a special, innate brain mechanism for learning language, which he called the \"language acquisition device\" (LAD)."
    ),
    createQuestion(
        "Miguel's parents are both renowned musicians, and he grew up in a house filled with musical instruments. From a young age, they enrolled him in piano and violin lessons. Miguel quickly excelled and is now a concert pianist. This scenario, where his parents provide an environment that complements his genetic predisposition, is an example of:",
        ["Active gene-environment correlation", "Evocative gene-environment correlation", "Passive gene-environment correlation", "Niche-picking"],
        "Passive gene-environment correlation",
        "Passive gene-environment correlation occurs when parents provide both the genes and an environment that suits those genes. Miguel's musical parents gave him musical genes and also created a musical household, without Miguel actively choosing it."
    ),
    createQuestion(
        "Contemporary developmental psychologists largely agree on the nature-nurture issue. Which statement best represents the current consensus?",
        ["Nature is unequivocally more influential, as proven by kinship studies.", "Nurture can override most genetic predispositions.", "The debate has shifted from \"which one\" to \"how\" they interact to influence development.", "Neither nature nor nurture plays a significant role after early childhood."],
        "The debate has shifted from \"which one\" to \"how\" they interact to influence development.",
        "Modern developmentalists agree that nature and nurture are both essential and cannot be separated. The focus of research has shifted from trying to determine which is more important to understanding how they interact to shape development."
    ),
    createQuestion(
        "Which statement about personality development is considered INCORRECT by most developmentalists?",
        ["Personality traits show a degree of heritability.", "A person's personality is fundamentally reshaped every few years.", "Non-shared environmental influences can be more powerful than shared ones.", "There is a component of stability to personality across the lifespan."],
        "A person's personality is fundamentally reshaped every few years.",
        "While personality can change, it also shows a great deal of stability across the lifespan, especially after young adulthood. The idea that it is \"fundamentally reshaped\" every few years is not supported by research."
    ),
    createQuestion(
        "A researcher wants to study how social media use affects self-esteem. She recruits a group of 13-year-olds, a group of 18-year-olds, and a group of 23-year-olds and surveys them all during the same week. What research design is she using?",
        ["Longitudinal", "Sequential", "Cross-sectional", "Microgenetic"],
        "Cross-sectional",
        "A cross-sectional design involves studying people from different age groups at the same single point in time. She is comparing 13-year-olds, 18-year-olds, and 23-year-olds all at once."
    ),
    createQuestion(
        "The researcher in the previous item finds that the 13-year-olds have the lowest self-esteem. She considers that this might not be due to age, but because this cohort grew up with different social media platforms and pressures than the older groups. This potential limitation of her study is known as:",
        ["Attrition", "Practice effects", "The cohort effect", "Non-representative sampling"],
        "The cohort effect",
        "The cohort effect is a major problem in cross-sectional studies. The differences between the age groups might not be due to age, but to the fact that they grew up in different time periods (cohorts) with different experiences (like different social media platforms)."
    ),
    createQuestion(
        "Longitudinal research is powerful but comes with its own set of challenges. Which of the following is NOT a typical limitation of the longitudinal design?",
        ["It is time-consuming and expensive.", "Participants may drop out over time (attrition).", "It is susceptible to cohort effects.", "Repeated testing can lead to practice effects."],
        "It is susceptible to cohort effects.",
        "Cohort effects are a problem for cross-sectional studies, which compare different cohorts. A longitudinal study avoids this problem by following the same cohort over time. The other options are all common limitations of longitudinal research."
    ),
    createQuestion(
        "If a researcher wants to investigate how individuals' political views change over their lifetime while also comparing different generations, the most appropriate research design would be:",
        ["Cross-sectional", "Longitudinal", "Sequential", "Case study"],
        "Sequential",
        "A sequential design is the best choice here. It combines the longitudinal and cross-sectional approaches by following several different age groups (cohorts) over time, which allows for the analysis of both individual change and generational differences."
    ),
    createQuestion(
        "A team is conducting a 10-year study on cognitive decline. After the first 5 years, they notice that the participants who dropped out of the study tended to have lower initial cognitive scores than those who remained. This specific issue is best described as:",
        ["General attrition", "A cross-generational effect", "Selective attrition", "A nonnormative influence"],
        "Selective attrition",
        "Attrition is when participants drop out. It becomes selective attrition when the people who drop out are different in a meaningful way from those who stay. In this case, those with lower cognitive scores dropped out, which could skew the final results."
    ),
    createQuestion(
        "An ethical principle requires that research participants be given as much information as possible about a study so they can make a reasoned decision about participating. This is known as:",
        ["Protection from harm", "Confidentiality", "Informed consent", "Deception"],
        "Informed consent",
        "Informed consent is the ethical principle that requires researchers to provide potential participants with all the necessary information about a study so they can make a free and reasoned decision about whether to participate."
    ),
    createQuestion(
        "Dr. Santos wants to study attachment in one-year-old infants. According to ethical guidelines for research with children, what must she obtain?",
        ["Only informed consent from the parents.", "Only assent from the infants.", "Informed consent from the parents and, if possible, assent from the infants.", "Approval from the school principal."],
        "Informed consent from the parents and, if possible, assent from the infants.",
        "For children who are too young to give legal consent, researchers must obtain informed consent from their parents or legal guardians. They must also obtain assent—the child's affirmative agreement to participate—to the extent that the child is capable of understanding."
    ),
    createQuestion(
        "According to Paul Baltes's life-span perspective, the principle that development involves both gains and losses is known as:",
        ["Lifelong development", "Multidimensionality", "Multidirectionality", "Plasticity"],
        "Multidirectionality",
        "The principle of multidirectionality states that development is not a simple upward path. Throughout life, some abilities may increase while others decrease. It involves both gains and losses."
    ),
    createQuestion(
        "Lolo Kiko, at 75, finds that while his reaction time has slowed, his knowledge of history and vocabulary has expanded. This illustrates that development is:",
        ["Multidirectional", "Contextual", "Lifelong", "Plastic"],
        "Multidirectional",
        "This is a perfect example of multidirectional development. Lolo Kiko's reaction time (a fluid ability) is declining, while his vocabulary (a crystallized ability) is expanding. Development involves simultaneous gains and losses."
    ),
    createQuestion(
        "Anja, a middle-aged manager, realizes she must now dedicate more of her time and energy to mentoring younger employees rather than just focusing on her own career advancement. This shift demonstrates which principle of development?",
        ["Development shows plasticity.", "Development is lifelong.", "Development is multidimensional.", "Development involves changing resource allocations."],
        "Development involves changing resource allocations.",
        "Paul Baltes's life-span perspective states that as we develop, we must change how we allocate our resources (e.g., time, energy, money). In middle age, the allocation often shifts from focusing on growth to maintaining skills and guiding the next generation."
    ),
    createQuestion(
        "The fact that a child's cognitive development is influenced by their physical brain maturation, their social interactions at school, and the cultural beliefs of their family shows that development is:",
        ["Plastic", "Multidimensional", "Multidirectional", "Lifelong"],
        "Multidimensional",
        "The principle of multidimensionality highlights that development is not a single process. It involves the interplay of biological, cognitive, and socioemotional dimensions."
    ),
    createQuestion(
        "Which of the following statements about developmental influences is TRUE?",
        ["The impact of poverty on development is primarily direct and easily mitigated.", "One's cultural background and socioeconomic status have a minimal effect on developmental pathways.", "The harm of poverty is often indirect, affecting factors like nutrition, healthcare access, and home environment.", "Gender roles are biologically determined and not subject to social influence."],
        "The harm of poverty is often indirect, affecting factors like nutrition, healthcare access, and home environment.",
        "The negative effects of poverty on development are often indirect. A lack of financial resources leads to secondary problems like poor nutrition, inadequate healthcare, high parental stress, and a less stimulating home environment, all of which harm development."
    ),
    createQuestion(
        "The global experience of the COVID-19 pandemic, which affected people of all ages across the world at a particular point in history, is an example of a:",
        ["Normative age-graded influence", "Normative history-graded influence", "Nonnormative life event", "Cohort effect"],
        "Normative history-graded influence",
        "A normative history-graded influence is an event that affects most people in a specific generation or cohort at the same time. The COVID-19 pandemic is a major historical event that shaped the development of people worldwide."
    ),
    createQuestion(
        "Winning the lottery, experiencing a severe childhood illness, or having a parent die at a young age are all examples of:",
        ["Normative history-graded influences", "Normative age-graded influences", "Nonnormative life events", "Chronosystem influences"],
        "Nonnormative life events",
        "Nonnormative life events are unusual events that have a major impact on an individual's life but are not experienced by most people. They are unpredictable and can be positive (winning the lottery) or negative (a severe illness)."
    ),
    createQuestion(
        "In the Philippines, turning 18 is a major milestone associated with legal adulthood and a debut celebration for women. This societal expectation is an example of a(n):",
        ["Nonnormative influence", "Age norm", "Historical generation", "Exosystem influence"],
        "Age norm",
        "An age norm is a social expectation of what people should be doing or how they should behave at a certain age. The debut at 18 is a strong cultural age norm in the Philippines that marks a transition to adulthood."
    ),
    createQuestion(
        "A theory in developmental psychology serves to:",
        ["Generate hypotheses that can be tested by research.", "Provide a framework for organizing and interpreting observations.", "Offer guidance for practical application.", "All of the above."],
        "All of the above.",
        "A good psychological theory serves all these purposes: it organizes observations, generates testable hypotheses for research, and provides a framework for practical applications like therapy or education."
    ),
    createQuestion(
        "Behaviorism, as championed by B.F. Skinner, posits that development is the result of:",
        ["The resolution of unconscious conflicts.", "Learning through observation and imitation.", "A series of predictable stages.", "Operant conditioning, where behavior is shaped by its consequences."],
        "Operant conditioning, where behavior is shaped by its consequences.",
        "Behaviorism, particularly Skinner's theory, views development as the result of operant conditioning. Behaviors are learned and shaped by their consequences: reinforcement increases a behavior, while punishment decreases it."
    ),
    createQuestion(
        "A mother tells her son, \"If you finish all your vegetables, you can have dessert.\"",
        ["Negative punishment", "Positive reinforcement", "Negative reinforcement", "Positive punishment"],
        "Positive reinforcement",
        "Positive reinforcement involves adding a desirable stimulus (dessert) to increase the likelihood of a behavior (eating vegetables)."
    ),
    createQuestion(
        "To stop his son's whining, a father gives in and buys him the candy he is demanding. The father's behavior of \"giving in\" is being strengthened because it removes the annoying stimulus (the whining). For the father, this is an example of:",
        ["Positive reinforcement", "Negative reinforcement", "Positive punishment", "Negative punishment"],
        "Negative reinforcement",
        "For the father, his behavior (giving in) is strengthened because it removes an unpleasant stimulus (the whining). The removal of an aversive stimulus to increase a behavior is negative reinforcement."
    ),
    createQuestion(
        "Earning a \"star\" for every five books read is an example of which reinforcement schedule?",
        ["Fixed-interval", "Fixed-ratio", "Variable-interval", "Variable-ratio"],
        "Fixed-ratio",
        "A fixed-ratio schedule provides reinforcement after a specific, unchanging number of responses. The star is given for every five books read—a fixed ratio."
    ),
    createQuestion(
        "A fisherman who catches fish at unpredictable times is being reinforced on a:",
        ["Fixed-interval schedule", "Fixed-ratio schedule", "Variable-interval schedule", "Variable-ratio schedule"],
        "Variable-interval schedule",
        "A variable-interval schedule provides reinforcement after an unpredictable amount of time has passed. The fisherman doesn't know when the next fish will bite; the reinforcement comes at random time intervals."
    ),
    createQuestion(
        "Little Albert was conditioned to fear a white rat. Later, he also showed fear of a rabbit, a dog, and a fur coat. This phenomenon is called:",
        ["Stimulus discrimination", "Spontaneous recovery", "Extinction", "Stimulus generalization"],
        "Stimulus generalization",
        "Stimulus generalization is when a conditioned response (fear) to a specific stimulus (a white rat) is also triggered by other, similar stimuli (a rabbit, a fur coat)."
    ),
    createQuestion(
        "According to Bandura's social cognitive theory, a child's belief in their own ability to perform a task successfully is known as:",
        ["Reciprocal determinism", "Self-esteem", "Self-efficacy", "Motivation"],
        "Self-efficacy",
        "Self-efficacy is a central concept in Bandura's theory. It is a person's belief in their own ability to succeed in a specific situation or accomplish a task."
    ),
    createQuestion(
        "In Bandura's model of observational learning, for a behavior to be imitated, the observer must first be able to remember what they saw. This mediational process is called:",
        ["Attention", "Retention", "Reproduction", "Motivation"],
        "Retention",
        "According to Bandura, for observational learning to occur, the person must be able to remember the observed behavior. This step, which involves mentally storing the information, is called retention."
    ),
    createQuestion(
        "According to Erikson, a successful resolution of the psychosocial crisis in infancy (Trust vs. Mistrust) leads to the virtue of:",
        ["Will", "Hope", "Purpose", "Fidelity"],
        "Hope",
        "In Erikson's theory, successfully resolving the first psychosocial crisis of Trust vs. Mistrust during infancy leads to the development of the virtue of hope."
    ),
    createQuestion(
        "A two-year-old insists on picking out her own clothes, no matter how mismatched they are. According to Erikson, she is in which stage of development?",
        ["Trust vs. Mistrust", "Autonomy vs. Shame and Doubt", "Initiative vs. Guilt", "Industry vs. Inferiority"],
        "Autonomy vs. Shame and Doubt",
        "Erikson's second stage, Autonomy vs. Shame and Doubt, occurs during toddlerhood. The child is focused on developing a sense of personal control and independence, such as by choosing their own clothes."
    ),
    createQuestion(
        "An adolescent who is struggling to figure out who they are, what they believe in, and what they want to do with their life is in Erikson's stage of:",
        ["Initiative vs. Guilt", "Industry vs. Inferiority", "Identity vs. Role Confusion", "Intimacy vs. Isolation"],
        "Identity vs. Role Confusion",
        "Identity vs. Role Confusion is Erikson's fifth stage and the central crisis of adolescence. It involves the struggle to form a clear and stable sense of self, including one's values, beliefs, and life goals."
    ),
    createQuestion(
        "According to Erikson, a middle-aged adult who focuses on mentoring the next generation and contributing to the betterment of society is expressing:",
        ["Intimacy", "Identity", "Generativity", "Integrity"],
        "Generativity",
        "Generativity vs. Stagnation is the crisis of middle adulthood. Generativity involves creating or nurturing things that will outlast the self, such as mentoring younger people, contributing to society, or raising children."
    ),
    createQuestion(
        "A person in late adulthood who looks back on their life with a sense of regret and missed opportunities is experiencing what Erikson called:",
        ["Stagnation", "Despair", "Isolation", "Role Confusion"],
        "Despair",
        "Despair is the negative outcome of Erikson's final stage, Integrity vs. Despair. It occurs when a person in late adulthood looks back on their life with regret, believing they made wrong decisions or didn't live a meaningful life."
    ),
    createQuestion(
        "The core pathology that can arise from an unresolved crisis of Generativity vs. Stagnation, characterized by a self-indulgent lack of care for others, is:",
        ["Disdain", "Rejectivity", "Fanaticism", "Promiscuity"],
        "Rejectivity",
        "According to Erikson, the core pathology of the Generativity vs. Stagnation stage is rejectivity. This is a self-centered unwillingness to care for or include others, which is the opposite of the inclusive nature of generativity."
    ),
    createQuestion(
        "A child who can think logically about tangible events and has mastered conservation but cannot yet think in abstract terms is in which of Piaget's stages?",
        ["Sensorimotor", "Preoperational", "Concrete Operational", "Formal Operational"],
        "Concrete Operational",
        "A child in the Concrete Operational stage (around ages 7-11) can think logically about concrete, real-world events and understands concepts like conservation. However, they cannot yet reason about abstract or hypothetical ideas."
    ),
    createQuestion(
        "A young child genuinely believes that the moon follows them when they walk at night. This is an example of:",
        ["Centration", "Animism", "Egocentrism", "Conservation"],
        "Animism",
        "Animism is the preoperational child's belief that inanimate objects have thoughts, feelings, and intentions, just like living things."
    ),
    createQuestion(
        "A preoperational child is shown two identical balls of clay. One is then rolled into a long, thin sausage shape. The child insists that the sausage shape has more clay. This demonstrates a lack of:",
        ["Object permanence", "Conservation", "Reversibility", "More than one option is correct"],
        "More than one option is correct",
        "The child's failure to understand that the amount of clay is the same shows a lack of conservation. This is due to limitations like centration (focusing only on the length) and a lack of reversibility (the ability to mentally reverse the action of rolling out the clay). Therefore, more than one option (Conservation and Reversibility) is correct."
    ),
    createQuestion(
        "The ability to arrange items along a quantitative dimension, such as lining up sticks from shortest to longest, is called:",
        ["Class inclusion", "Seriation", "Transitive inference", "Inductive reasoning"],
        "Seriation",
        "Seriation is the ability, which develops in the concrete operational stage, to order items along a quantitative dimension, such as putting sticks in order from shortest to longest."
    ),
    createQuestion(
        "An adolescent says, \"Nobody understands what I'm going through! My situation is completely unique.\"",
        ["The imaginary audience", "The personal fable", "Hypothetical-deductive reasoning", "Perceived invulnerability"],
        "The personal fable",
        "The personal fable is a form of adolescent egocentrism where the teen believes that their feelings and experiences are so unique that no one else could possibly understand them."
    ),
    createQuestion(
        "Which of the following is a key cognitive advance of the concrete operational stage?",
        ["Abstract thinking", "Transductive reasoning", "Decentration", "Animism"],
        "Decentration",
        "A key cognitive achievement of the concrete operational stage is decentration. This is the ability to focus on more than one aspect of a problem at a time, which is what allows a child to solve conservation tasks."
    ),
    createQuestion(
        "\"All men are mortal. Socrates is a man. Therefore, Socrates is mortal.\" This type of logic, which moves from a general premise to a specific conclusion, is called:",
        ["Inductive reasoning", "Deductive reasoning", "Transductive reasoning", "Analogical reasoning"],
        "Deductive reasoning",
        "Deductive reasoning starts with a general rule or premise and moves to a specific, logical conclusion. It is a hallmark of the formal operational stage."
    ),
    createQuestion(
        "Which statement reflects a major criticism of Piaget's theory of cognitive development?",
        ["He overestimated the cognitive abilities of infants and young children.", "His stages are not as universal or discrete as he suggested.", "He placed too much emphasis on social and cultural factors.", "His research methods were overly reliant on standardized tests."],
        "His stages are not as universal or discrete as he suggested.",
        "A major criticism of Piaget's theory is that cognitive development is more gradual and continuous than his distinct stages suggest. Research has also shown that the timing of these stages can be influenced by culture and experience, making them less universal."
    ),
    createQuestion(
        "According to Piaget, the process of changing one's existing mental structures to better fit new information is called:",
        ["Assimilation", "Organization", "Equilibration", "Accommodation"],
        "Accommodation",
        "Accommodation is Piaget's term for the process of modifying an existing schema (mental structure) to better fit new information. It involves changing your understanding to accommodate new evidence."
    ),
    createQuestion(
        "The \"A-not-B error\" is a phenomenon where an infant continues to search for a hidden object in the first location (A) where it was found, even after seeing it being hidden in a new location (B). This is characteristic of which sensorimotor substage?",
        ["Primary Circular Reactions", "Secondary Circular Reactions", "Coordination of Secondary Schemes", "Tertiary Circular Reactions"],
        "Coordination of Secondary Schemes",
        "The A-not-B error is a classic sign of Piaget's sensorimotor substage 4, Coordination of Secondary Schemes (around 8-12 months). The infant has object permanence but still searches where they last found the object, not where they just saw it being hidden."
    ),
    createQuestion(
        "According to Vygotsky, the range of tasks that a child can perform with the help of a more skilled partner but cannot yet perform alone is called the:",
        ["Zone of Proximal Development (ZPD)", "Scaffolding range", "Zone of Minimal Competence", "Collaborative Learning Area"],
        "Zone of Proximal Development (ZPD)",
        "According to Vygotsky, the Zone of Proximal Development (ZPD) is the gap between what a child can accomplish independently and what they can achieve with guidance from a more skilled person."
    ),
    createQuestion(
        "A teacher breaks down a complex math problem into smaller, manageable steps and provides prompts to help a student solve it. This technique is known as:",
        ["Scaffolding", "Private speech", "Guided participation", "Reciprocal teaching"],
        "Scaffolding",
        "Scaffolding is Vygotsky's term for the teaching technique where a more knowledgeable person adjusts the level of support they provide to fit the child's current performance level. Breaking down a problem and giving prompts are forms of scaffolding."
    ),
    createQuestion(
        "Unlike Piaget, who saw a child's \"egocentric speech\" as a sign of immaturity, Vygotsky viewed it (as \"private speech\") as:",
        ["A sign of cognitive confusion.", "A tool for self-guidance and problem-solving.", "A precursor to social speech.", "A result of insecure attachment."],
        "A tool for self-guidance and problem-solving.",
        "Vygotsky believed that private speech (a child talking to themselves) is not a sign of immaturity but a crucial tool for self-regulation. Children use it to guide their thinking and behavior, and it eventually becomes internalized as silent inner thought."
    ),
    createQuestion(
        "In Bronfenbrenner's bioecological model, the connections and interactions between a child's immediate settings (e.g., the relationship between their home and school life) constitute the:",
        ["Microsystem", "Mesosystem", "Exosystem", "Macrosystem"],
        "Mesosystem",
        "In Bronfenbrenner's model, the mesosystem is made up of the interconnections between the different microsystems in a person's life. The relationship between a child's home life and their school life is a classic example."
    ),
    createQuestion(
        "A father's stressful job, which he never discusses at home, causes him to be irritable with his children. The father's workplace is part of the children's:",
        ["Microsystem", "Mesosystem", "Exosystem", "Macrosystem"],
        "Exosystem",
        "The exosystem includes settings that the child does not directly participate in but that still affect them indirectly. The father's stressful job affects his mood, which in turn affects his parenting, thus the workplace is part of the child's exosystem."
    ),
    createQuestion(
        "Gelu explains that hitting is wrong because \"Mommy will get mad and put me in time-out.\" According to Kohlberg, Gelu is at what level of moral reasoning?",
        ["Preconventional", "Conventional", "Postconventional", "Unconventional"],
        "Preconventional",
        "According to Kohlberg, the preconventional level of morality is based on self-interest and avoiding punishment or gaining rewards. Gelu's reason for not hitting is to avoid being put in time-out, which is Stage 1 reasoning."
    ),
    createQuestion(
        "Coi believes that laws should be obeyed to maintain social order and harmony, stating, \"If everyone broke the law, society would be chaos.\" This reflects which of Kohlberg's stages?",
        ["Stage 2: Instrumental Purpose Orientation", "Stage 3: \"Good Boy-Good Girl\" Orientation", "Stage 4: Social-Order-Maintaining Orientation", "Stage 5: Social Contract Orientation"],
        "Stage 4: Social-Order-Maintaining Orientation",
        "This reflects Stage 4: Social-Order-Maintaining Orientation. At this stage, moral reasoning is based on upholding the law and maintaining social order for the good of all society. The focus is on duty and following established rules."
    ),
    createQuestion(
        "A major criticism of Kohlberg's theory, particularly from Carol Gilligan, is that:",
        ["The stages are not culturally universal.", "It is biased against women, favoring a justice orientation over a care orientation.", "The dilemmas are too simplistic for adults.", "It does not account for the role of emotion in morality."],
        "It is biased against women, favoring a justice orientation over a care orientation.",
        "Carol Gilligan's primary criticism of Kohlberg's theory was that it was based on research with males and prioritized a \"justice orientation\" (based on rules and rights). She argued that it devalued the \"care orientation\" (based on relationships and responsibility), which she proposed was more common in females."
    ),
    createQuestion(
        "A period during which an organism is particularly receptive to certain kinds of environmental stimuli, and during which development of a particular skill is most likely, is called a(n):",
        ["Critical period", "Optimal period", "Sensitive period", "Vulnerable period"],
        "Sensitive period",
        "A sensitive period is a time in development when a person is particularly open to certain experiences and learning is easiest. While learning can still happen outside this period, it is much more difficult. It is a more flexible concept than a critical period."
    ),
    createQuestion(
        "According to Bowlby's attachment theory, which of the following is TRUE?",
        ["Attachment is primarily a learned behavior based on feeding.", "The infant-caregiver bond serves a crucial evolutionary purpose of ensuring survival.", "A disruption in early attachment has no long-term consequences.", "Infants can form equally strong primary attachments to any adult."],
        "The infant-caregiver bond serves a crucial evolutionary purpose of ensuring survival.",
        "Bowlby's attachment theory is an evolutionary theory. It posits that the strong bond between an infant and caregiver is an innate, adaptive behavior that evolved because it increases the infant's chances of survival by keeping them safe and protected."
    ),
    createQuestion(
        "Stranger anxiety, which typically emerges in the second half of the first year, is generally considered:",
        ["A sign of a developing disorganized attachment.", "An abnormal developmental milestone that requires intervention.", "A normal developmental indicator of cognitive maturation and attachment formation.", "A result of having too few social interactions."],
        "A normal developmental indicator of cognitive maturation and attachment formation.",
        "The development of stranger anxiety is a normal and healthy sign. It shows that the infant has formed a strong attachment to their primary caregiver and has developed the cognitive ability to distinguish familiar people from unfamiliar ones."
    ),
    createQuestion(
        "An adolescent who has not yet experienced a crisis or made any commitments regarding their identity is in which of Marcia's identity statuses?",
        ["Moratorium", "Foreclosure", "Achievement", "Diffusion"],
        "Diffusion",
        "In Marcia's framework, identity diffusion is the status where an adolescent has not yet explored different identity options (no crisis) and has not made any commitments to a set of values or a future path."
    ),
    createQuestion(
        "\"My parents are both doctors, so I'm going to be a doctor too. I've never really thought about anything else.\"",
        ["Identity Diffusion", "Identity Foreclosure", "Identity Moratorium", "Identity Achievement"],
        "Identity Foreclosure",
        "Identity foreclosure is the status of a person who has made a commitment without going through a period of exploration or crisis. They have simply accepted the identity and values given to them by their parents or culture."
    ),
    createQuestion(
        "A one-year-old child discovers that shaking a rattle produces a noise. He then purposefully and repeatedly shakes the rattle to hear the sound again. This is an example of a:",
        ["Primary circular reaction", "Secondary circular reaction", "Tertiary circular reaction", "Mental representation"],
        "Secondary circular reaction",
        "A secondary circular reaction is a repetitive action focused on an object in the external environment. The infant repeats the action (shaking) because it produces an interesting result (the noise from the rattle)."
    ),
    createQuestion(
        "A toddler points to a car and says, \"Go car!\" to indicate that he wants to go for a ride. This two-word utterance is an example of:",
        ["Holophrastic speech", "Telegraphic speech", "Overextension", "Babbling"],
        "Telegraphic speech",
        "Telegraphic speech is the two-word stage of language development, where children use short phrases that include only the most essential words to convey meaning, much like in an old-fashioned telegram."
    ),
    createQuestion(
        "The ability to understand and manage one's own feelings is a key psychosocial achievement during:",
        ["Infancy", "Early Childhood", "Middle Childhood", "Adolescence"],
        "Early Childhood",
        "Early childhood is a critical period for the development of emotional regulation. Preschoolers learn to understand, express, and manage their feelings in socially acceptable ways."
    ),
    createQuestion(
        "Emotions like pride, shame, and guilt, which require an awareness of self and social standards, are known as:",
        ["Primary emotions", "Self-conscious emotions", "Reflexive emotions", "Universal emotions"],
        "Self-conscious emotions",
        "Self-conscious emotions, such as pride, shame, guilt, and embarrassment, emerge after infancy because they require a sense of self and an awareness of social standards and expectations."
    ),
    createQuestion(
        "In Ainsworth's \"Strange Situation,\" a child shows little distress when their mother leaves and actively ignores her upon her return. This indicates which attachment style?",
        ["Secure", "Insecure-Avoidant", "Insecure-Ambivalent/Resistant", "Disorganized"],
        "Insecure-Avoidant",
        "In the Strange Situation, a child with an insecure-avoidant attachment style shows little distress when the mother leaves and ignores or avoids her when she returns, showing no preference for the mother over a stranger."
    ),
    createQuestion(
        "Which attachment style is considered the most problematic and is associated with the highest risk for later psychopathology?",
        ["Secure", "Insecure-Avoidant", "Insecure-Ambivalent/Resistant", "Disorganized"],
        "Disorganized",
        "The disorganized attachment style, characterized by confused and contradictory behaviors, is considered the most insecure pattern. It is often associated with a history of maltreatment and is a strong predictor of later psychopathology."
    ),
    createQuestion(
        "During which developmental period does body image become a central concern, often influenced by the onset of puberty and social comparisons?",
        ["Early childhood", "Middle childhood", "Adolescence", "Emerging adulthood"],
        "Adolescence",
        "The dramatic physical changes of puberty, combined with increased social comparison and media influence, make adolescence a key period when body image becomes a central concern for both boys and girls."
    ),
    createQuestion(
        "A preschooler who pushes another child to get a toy is demonstrating:",
        ["Hostile aggression", "Relational aggression", "Instrumental aggression", "Overt aggression"],
        "Instrumental aggression",
        "Instrumental aggression is proactive and goal-directed. The child's goal is to get the toy, and the aggression is the instrument used to achieve that goal. It is not primarily intended to harm the other child."
    ),
    createQuestion(
        "The transitional phase in middle childhood where parents and children jointly control the child's behavior, with parents exercising general supervision and children exercising moment-to-moment self-regulation, is called:",
        ["Coregulation", "Scaffolding", "Social referencing", "Recentering"],
        "Coregulation",
        "Coregulation is a stage of parental monitoring that emerges in middle childhood. Parents and children share control, with parents providing general oversight and children taking on more responsibility for their own moment-to-moment behavior."
    ),
    createQuestion(
        "The three-stage process of shifting power and autonomy from the family of origin to the independent young adult is known as:",
        ["Coregulation", "Recentering", "Identity achievement", "Disengagement"],
        "Recentering",
        "Recentering is the term for the primary psychosocial task of emerging adulthood. It is the three-stage process of gradually shifting from being a dependent member of one's family of origin to being an independent, self-reliant young adult."
    ),
    createQuestion(
        "For many couples, the \"empty nest\" transition when the last child leaves home:",
        ["Almost always leads to a decline in marital satisfaction.", "Can improve marital satisfaction by allowing the couple to reconnect.", "Has no significant impact on the marital relationship.", "Is more difficult for fathers than for mothers."],
        "Can improve marital satisfaction by allowing the couple to reconnect.",
        "Contrary to the myth that the \"empty nest\" is always a crisis, research shows that for many couples with good marriages, it leads to an increase in marital satisfaction as they have more time and energy to focus on their relationship."
    ),
    createQuestion(
        "Older adults tend to be more effective at managing their emotional responses to stress than younger adults. This suggests they more frequently use:",
        ["Problem-focused coping", "Emotion-focused coping", "Avoidant coping", "Confrontive coping"],
        "Emotion-focused coping",
        "Emotion-focused coping involves managing the emotional response to a stressor, rather than trying to change the stressor itself. Older adults are often more skilled at this, using strategies to regulate their feelings and maintain well-being."
    ),
    createQuestion(
        "A characteristic of emerging adulthood, as described by Jeffrey Arnett, is the feeling of being in-between adolescence and full adulthood. This is the feature of:",
        ["Instability", "Self-focus", "Feeling in-between", "Identity exploration"],
        "Feeling in-between",
        "Jeffrey Arnett proposed five features of emerging adulthood. The \"feeling in-between\" captures the subjective sense of no longer being an adolescent but not yet feeling like a full adult."
    ),
    createQuestion(
        "The theory that successful aging involves remaining active and maintaining social interactions is known as:",
        ["Disengagement theory", "Continuity theory", "Socioemotional selectivity theory", "Activity theory"],
        "Activity theory",
        "Activity theory argues that successful aging involves staying active and engaged. It proposes that older adults who maintain their activities, social roles, and relationships will have higher levels of satisfaction and well-being."
    ),
    createQuestion(
        "The prenatal period during which the major organs and body systems are formed, making it the most vulnerable time for teratogenic damage, is the:",
        ["Germinal period", "Embryonic period", "Fetal period", "Zygotic period"],
        "Embryonic period",
        "The embryonic period (weeks 2-8) is when all the major organs and body systems are formed (organogenesis). This makes it the most critical and vulnerable period for damage from teratogens (harmful substances)."
    ),
    createQuestion(
        "The principle that development proceeds from the center of the body outward is known as the:",
        ["Cephalocaudal principle", "Proximodistal principle", "Hierarchical integration principle", "Principle of independent systems"],
        "Proximodistal principle",
        "The proximodistal principle describes the pattern of development where growth proceeds from the center of the body outward. For example, an infant gains control over their torso before they can control their fingers."
    ),
    createQuestion(
        "In cases of sex-linked disorders like hemophilia or color blindness, the faulty gene is almost always:",
        ["Carried on the Y chromosome, passed from father to son.", "Carried on the X chromosome, making males more likely to be affected.", "An autosomal dominant trait.", "A result of a new mutation."],
        "Carried on the X chromosome, making males more likely to be affected.",
        "Most sex-linked disorders are caused by recessive genes on the X chromosome. Because males (XY) have only one X chromosome, a single faulty gene will cause the disorder. Females (XX) are often protected by their second, healthy X chromosome, making them carriers."
    ),
    createQuestion(
        "A chromosomal disorder in males caused by an extra X chromosome (XXY), characterized by underdeveloped testes and the development of female-like secondary sex characteristics, is:",
        ["Turner Syndrome", "Fragile X Syndrome", "Klinefelter Syndrome", "Jacob's Syndrome (XYY)"],
        "Klinefelter Syndrome",
        "Klinefelter Syndrome is a genetic condition in males caused by the presence of an extra X chromosome (XXY). It can lead to underdeveloped testes, reduced testosterone, and some female-like physical traits."
    ),
    createQuestion(
        "Which statement about Fragile X syndrome is FALSE?",
        ["It is a leading inherited cause of intellectual disability.", "It affects both males and females, though often more severely in males.", "It is caused by having an extra X chromosome.", "It is named for a constriction on the long arm of the X chromosome."],
        "It is caused by having an extra X chromosome.",
        "This statement is false. Fragile X syndrome is caused by a specific gene mutation on the X chromosome, not by having an entire extra X chromosome (which describes Klinefelter syndrome)."
    ),
    createQuestion(
        "Traits such as eye color are strongly programmed by genes with little room for environmental influence. These traits are considered to be:",
        ["Highly canalized", "Polygenic", "Multifactorial", "Lowly canalized"],
        "Highly canalized",
        "Canalization refers to the degree to which a trait is guided by genes versus being open to environmental influence. A highly canalized trait, like eye color, follows a strict genetic path and is not easily changed by the environment."
    ),
    createQuestion(
        "A child with a natural talent for drawing is noticed by her teachers, who then give her extra art supplies and praise her work, encouraging her to draw even more. This is an example of which type of gene-environment correlation?",
        ["Passive", "Evocative", "Active", "Canalized"],
        "Evocative",
        "Evocative gene-environment correlation occurs when a child's genetically influenced traits evoke or elicit certain responses from others in their environment. The child's artistic talent causes teachers to react by giving her praise and supplies."
    ),
    createQuestion(
        "A teenager who is genetically predisposed to risk-taking behavior actively seeks out friends who are also thrill-seekers and joins a skateboarding group. This is an example of which type of gene-environment correlation, also known as niche-picking?",
        ["Passive", "Evocative", "Active", "Proximodistal"],
        "Active",
        "Active gene-environment correlation, also known as niche-picking, occurs when individuals actively seek out environments that are compatible with their genetic tendencies. The risk-taking teen actively chooses to join a skateboarding group."
    ),
    createQuestion(
        "The Kübler-Ross stage of dying in which a person tries to make a deal with a higher power to postpone death is:",
        ["Denial", "Anger", "Bargaining", "Depression"],
        "Bargaining",
        "In Kübler-Ross's five stages of dying, bargaining is the stage where the individual attempts to negotiate with a higher power or with fate, often promising good behavior in exchange for an extension of life."
    ),
    createQuestion(
        "A family follows their terminally ill mother's living will, which requested that she not be placed on a ventilator. This is an example of:",
        ["Active euthanasia", "Passive euthanasia", "Assisted suicide", "Mercy killing"],
        "Passive euthanasia",
        "Passive euthanasia involves withdrawing or withholding life-sustaining treatment (like a ventilator), allowing the person to die from their underlying illness. It is letting death happen naturally."
    ),
    createQuestion(
        "The emotional response to a loss, characterized by feelings of sadness, anger, and guilt, is known as:",
        ["Bereavement", "Mourning", "Grief", "Disenfranchisement"],
        "Grief",
        "Grief is the internal emotional and psychological response to loss. Bereavement is the objective state of having lost someone, and mourning is the outward cultural expression of that loss."
    ),
    createQuestion(
        "A person who is grieving the death of an ex-spouse or a secret lover may experience a type of grief that is not openly acknowledged or socially supported. This is called:",
        ["Anticipatory grief", "Complicated grief", "Disenfranchised grief", "Chronic grief"],
        "Disenfranchised grief",
        "Disenfranchised grief is grief that is not socially sanctioned or recognized. It occurs when a person's loss is not seen as legitimate or when they are not seen as having a right to grieve (e.g., grieving an ex-spouse or a secret relationship)."
    ),
    createQuestion(
        "Which research design involves testing different age groups at one point in time?",
        ["Longitudinal", "Cross-sectional", "Sequential", "Correlational"],
        "Cross-sectional",
        "A cross-sectional design involves collecting data from different age groups at a single point in time to make age-based comparisons."
    ),
    createQuestion(
        "A one-year-old drops his spoon from his high chair over and over again, simply to watch it fall each time. According to Piaget, this is a:",
        ["Primary circular reaction", "Secondary circular reaction", "Tertiary circular reaction", "Mental representation"],
        "Secondary circular reaction",
        "A secondary circular reaction involves an infant repeating an action that produces an interesting effect on an external object. The infant is focused on the consequence of their action on the spoon, not on their own body."
    ),
    createQuestion(
        "A child's vocabulary expanding from single words to short phrases like \"more juice\" and \"go bye-bye\" represents a transition from:",
        ["Babbling to cooing", "Holophrastic to telegraphic speech", "Telegraphic to complex speech", "Cooing to telegraphic speech"],
        "Holophrastic to telegraphic speech",
        "Holophrastic speech is using a single word to convey a complete thought. Telegraphic speech is using two-word phrases that contain only the most essential words. This represents a key transition in language development."
    ),
    createQuestion(
        "According to Erikson, the central psychosocial conflict for a first-grader (age 6-7) is:",
        ["Autonomy vs. Shame and Doubt", "Initiative vs. Guilt", "Industry vs. Inferiority", "Identity vs. Role Confusion"],
        "Industry vs. Inferiority",
        "Industry vs. Inferiority is Erikson's fourth psychosocial stage, covering the elementary school years (around ages 6-12). The child's central task is to develop a sense of competence and industry by mastering new skills."
    ),
    createQuestion(
        "A child understands that a dog is a four-legged animal. When she sees a cat for the first time, she also calls it a \"dog.\" Piaget would say this is an example of:",
        ["Accommodation", "Assimilation", "Equilibration", "Organization"],
        "Assimilation",
        "Assimilation is Piaget's term for fitting new information into an existing schema. The child sees a new four-legged animal (a cat) and calls it a \"dog\" because it fits her existing schema for four-legged animals."
    ),
    createQuestion(
        "A father is more likely to pass a sex-linked disorder to his:",
        ["Daughter", "Son", "Both his son and daughter equally", "He cannot pass on sex-linked disorders."],
        "Daughter",
        "A father passes his Y chromosome to his sons and his X chromosome to his daughters. Since sex-linked disorders are typically carried on the X chromosome, he cannot pass it to his sons. He will, however, pass his X chromosome (and the faulty gene on it) to all of his daughters."
    ),
    createQuestion(
        "The single-cell organism formed at conception is known as a:",
        ["Gamete", "Zygote", "Embryo", "Fetus"],
        "Zygote",
        "The zygote is the single cell formed immediately after a sperm fertilizes an egg. It contains the complete set of genetic material for a new individual."
    ),
    createQuestion(
        "The \"visual cliff\" experiment was designed to test an infant's:",
        ["Object permanence", "Attachment", "Depth perception", "Self-awareness"],
        "Depth perception",
        "The visual cliff experiment was famously used to demonstrate that infants develop depth perception. An infant who can perceive depth will be reluctant to crawl over the \"cliff\" side of the apparatus."
    ),
    createQuestion(
        "A parenting style that is high in warmth but low in control and demands is known as:",
        ["Authoritarian", "Authoritative", "Permissive", "Uninvolved"],
        "Permissive",
        "The permissive parenting style is characterized by being high in warmth and responsiveness but low in control and demands. These parents are loving but set few rules or limits."
    ),
    createQuestion(
        "The shift to a two-party intimate relationship after the children have left home is a defining feature of the:",
        ["Sandwich generation", "Empty nest", "Cluttered nest", "Launching phase"],
        "Empty nest",
        "The empty nest is the period in a couple's life that begins after their last child has left home, requiring them to adjust to a home without children and focus again on their marital relationship."
    ),
    createQuestion(
        "In which type of play do children play alongside each other but do not interact or share materials?",
        ["Solitary play", "Onlooker play", "Parallel play", "Cooperative play"],
        "Parallel play",
        "Parallel play is common in toddlers. They play near each other with similar toys, but they do not interact or try to influence each other's play."
    ),
    createQuestion(
        "A researcher follows a single group of children from age 5 to age 25, testing them every five years. This is a _______ study.",
        ["Cross-sectional", "Sequential", "Longitudinal", "Correlational"],
        "Longitudinal",
        "A longitudinal study is a research design that repeatedly observes and tests the same group of individuals over a long period to track developmental changes."
    ),
    createQuestion(
        "After a long battle with cancer, Bianca's mother passed away. Bianca is now navigating the culturally-prescribed behaviors of wearing black and attending memorial services. This process is known as:",
        ["Grief", "Bereavement", "Mourning", "Loss-orientation"],
        "Mourning",
        "Mourning refers to the outward, socially prescribed behaviors and rituals that follow a death. Wearing black and attending services are culturally defined acts of mourning. Grief is the internal feeling, and bereavement is the state of loss."
    ),
    createQuestion(
        "Which of the following is a potential risk during the germinal period of prenatal development?",
        ["Development of spina bifida", "Failure of the zygote to implant in the uterine wall", "Damage to major organ systems from teratogens", "Stunted growth of limbs"],
        "Failure of the zygote to implant in the uterine wall",
        "The germinal period (the first two weeks) culminates in the zygote (now a blastocyst) implanting in the uterine wall. A primary risk during this stage is a failure of this implantation to occur, which ends the pregnancy."
    ),
    createQuestion(
        "Which theory suggests that as people age, they deliberately reduce their social contacts to focus on emotionally meaningful and fulfilling relationships?",
        ["Activity Theory", "Disengagement Theory", "Continuity Theory", "Socioemotional Selectivity Theory"],
        "Socioemotional Selectivity Theory",
        "Socioemotional Selectivity Theory suggests that as people age, they become more selective about their social partners. They prioritize emotionally meaningful, positive relationships and spend less time with casual acquaintances."
    ),
    createQuestion(
        "A young child who is asked to describe a doll from the perspective of someone sitting across the table will likely describe what they see from their own seat. This is an example of:",
        ["Centration", "Egocentrism", "Animism", "Lack of conservation"],
        "Egocentrism",
        "Egocentrism is a key feature of Piaget's preoperational stage. It is the inability to see a situation from another person's perspective. The child describes what they see because they assume everyone else sees the same thing."
    ),
];

export const devPsych1MarketplaceItem: MarketplaceItem = {
    id: 'dev-psych-1-100',
    title: 'Dev Psych 1 - BLEPP 2025 (100 Items)',
    description: '100-item BLEPP Test Bank for Developmental Psychology. Covers philosophical foundations, research designs, theories (Erikson, Piaget, Vygotsky), prenatal development, attachment, morality, and aging.',
    category: 'Education',
    author: 'Kid Asuncion / BLEPP 2025',
    downloads: 0,
    rating: 5.0,
    price: 'Free',
    content: devPsych1Questions
};
