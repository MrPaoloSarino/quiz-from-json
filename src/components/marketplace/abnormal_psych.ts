import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';


const createQuestion = (q: string, opts: string[], ans: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
});

const abnormalPsychQuestions: QuizQuestion[] = [
    // 1. DSM-5-TR General & Neurodevelopmental (Approx 15)
    createQuestion("Which of the following is a NEW disorder added to Section II of the DSM-5-TR?", ["Prolonged Grief Disorder", "Hoarding Disorder", "Disruptive Mood Dysregulation Disorder", "Binge Eating Disorder"], "Prolonged Grief Disorder"),
    createQuestion("In DSM-5-TR, the term 'Intellectual Retardation' is replaced fully by:", ["Intellectual Disability (Intellectual Developmental Disorder)", "Cognitive Development Disorder", "General Learning Disability", "Mental Handicap"], "Intellectual Disability (Intellectual Developmental Disorder)"),
    createQuestion("DSM-5-TR updated the terminology for 'Neuroleptic medications' to:", ["Antipsychotic medications or other dopamine receptor blocking agents", "Psychotropic medications", "Anxiolytics", "Mood stabilizers"], "Antipsychotic medications or other dopamine receptor blocking agents"),
    createQuestion("Which disorder is characterized by persistent deficits in social communication and social interaction across multiple contexts?", ["Autism Spectrum Disorder", "Social Anxiety Disorder", "ADHD", "Reactive Attachment Disorder"], "Autism Spectrum Disorder"),
    createQuestion("Symptoms of ADHD must be present before age:", ["12", "7", "5", "18"], "12"),
    createQuestion("A key update in DSM-5-TR regarding Gender Dysphoria is replacing 'desired gender' with:", ["Experienced gender", "Preferred gender", "Target gender", "Biological gender"], "Experienced gender"),
    createQuestion("Which is NOT a specifier for ADHD in DSM-5-TR?", ["Predominantly Inattentive", "Predominantly Hyperactive/Impulsive", "Combined", "Predominantly Aggressive"], "Predominantly Aggressive"),
    createQuestion("Tic disorders like Tourette's are classified under:", ["Neurodevelopmental Disorders", "Anxiety Disorders", "Obsessive-Compulsive Disorders", "Disruptive Disorders"], "Neurodevelopmental Disorders"),
    createQuestion("Specific Learning Disorder with impairment in reading is commonly called:", ["Dyslexia", "Dysgraphia", "Dyscalculia", "Dyspraxia"], "Dyslexia"),
    createQuestion("The DSM-5-TR added codes for what specific behavior without requiring a diagnosis?", ["Suicidal behavior and Nonsuicidal self-injury", "Aggressive behavior", "Running away", "Truancy"], "Suicidal behavior and Nonsuicidal self-injury"),
    createQuestion("Intellectual Disability severity is based on:", ["Adaptive functioning", "IQ score alone", "Academic grades", "Physical appearance"], "Adaptive functioning"),
    createQuestion("Stereotypic Movement Disorder involves:", ["Repetitive, seemingly driven, and apparently purposeless motor behavior", "Sudden vocal tics", "Tremors due to medication", "Paralysis"], "Repetitive, seemingly driven, and apparently purposeless motor behavior"),
    createQuestion("To diagnose Autism Spectrum Disorder, symptoms must cause significant impairment in:", ["Social, occupational, or other important areas of functioning", "Only academic areas", "Only home life", "Cognitive testing measures"], "Social, occupational, or other important areas of functioning"),
    createQuestion("Global Developmental Delay is reserved for children under the age of:", ["5", "3", "7", "10"], "5"),
    createQuestion("Communication Disorders include all EXCEPT:", ["Social (Pragmatic) Communication Disorder", "Childhood-Onset Fluency Disorder (Stuttering)", "Language Disorder", "Selective Mutism"], "Selective Mutism"), // Selective Mutism is an Anxiety Disorder

    // 2. Schizophrenia Spectrum & Psychotic Disorders (Approx 15)
    createQuestion("Which symptom is considered a 'negative' symptom of Schizophrenia?", ["Avolition", "Hallucinations", "Delusions", "Disorganized thinking"], "Avolition"),
    createQuestion("The duration requirement for Schizophrenia diagnosis is:", ["At least 6 months", "1 month", "2 weeks", "1 year"], "At least 6 months"),
    createQuestion("Schizophreniform Disorder lasts:", ["Between 1 month and 6 months", "Less than 1 month", "More than 6 months", "2 days"], "Between 1 month and 6 months"),
    createQuestion("Brief Psychotic Disorder lasts:", ["Less than 1 month", "Less than 1 week", "1 to 6 months", "More than 6 months"], "Less than 1 month"),
    createQuestion("Schizoaffective Disorder requires the presence of:", ["A major mood episode concurrent with Criterion A of Schizophrenia", "Two distinct personalities", "Only delusions", "Substance abuse"], "A major mood episode concurrent with Criterion A of Schizophrenia"),
    createQuestion("A delusion where one believes a famous person is in love with them:", ["Erotomanic", "Grandiose", "Persecutory", "Somatic"], "Erotomanic"),
    createQuestion("Waxy flexibility is associated with:", ["Catatonia", "Paranoia", "Disorganized speech", "Residual symptoms"], "Catatonia"),
    createQuestion("The 'Dopamine Hypothesis' suggests schizophrenia is caused by:", ["Excess dopamine activity", "Low dopamine", "High serotonin", "Low GABA"], "Excess dopamine activity"),
    createQuestion("Hallucinations are disturbances in:", ["Perception", "Thinking", "Memory", "Consciousness"], "Perception"),
    createQuestion("Delusions are disturbances in:", ["Thought content", "Perception", "Emotion", "Behavior"], "Thought content"),
    createQuestion("Which is NOT a key feature of psychotic disorders?", ["Obsessions", "Delusions", "Hallucinations", "Disorganized motor behavior"], "Obsessions"),
    createQuestion("'Word Salad' is an example of:", ["Disorganized speech", "Hallucination", "Delusion", "Negative symptom"], "Disorganized speech"),
    createQuestion("Delusional Disorder differs from Schizophrenia because:", ["Functioning is not markedly impaired outside the delusion", "Hallucinations are prominent", "It lasts less than a month", "It always involves hearing voices"], "Functioning is not markedly impaired outside the delusion"),
    createQuestion("Capgras Syndrome is the belief that:", ["A familiar person has been replaced by an imposter", "One is dead", "One has superpowers", "Strangers are friends"], "A familiar person has been replaced by an imposter"),
    createQuestion("Folie à deux is now referred to in DSM-5 contexts as:", ["Shared Psychotic Disorder (though not a separate category)", "Double Depression", "Bipolar I", "Cyclothymia"], "Shared Psychotic Disorder (though not a separate category)"),

    // 3. Bipolar & Depressive Disorders (Approx 15)
    createQuestion("Bipolar I Disorder requires:", ["At least one Manic Episode", "Only Hypomanic episodes", "Major Depressive Episode only", "Rapid cycling"], "At least one Manic Episode"),
    createQuestion("Bipolar II Disorder is characterized by:", ["Hypomanic episodes and Major Depressive Episodes", "Manic episodes only", "Psychotic features", "No depression"], "Hypomanic episodes and Major Depressive Episodes"),
    createQuestion("Cyclothymic Disorder involves symptoms for at least:", ["2 years", "1 year", "6 months", "2 weeks"], "2 years"),
    createQuestion("Disruptive Mood Dysregulation Disorder (DMDD) was added to address concerns about overdiagnosis of _____ in children.", ["Bipolar Disorder", "ADHD", "Autism", "Conduct Disorder"], "Bipolar Disorder"),
    createQuestion("Major Depressive Disorder requires symptoms for at least:", ["2 weeks", "1 week", "1 month", "6 months"], "2 weeks"),
    createQuestion("Persistent Depressive Disorder (Dysthymia) requires symptoms for:", ["2 years", "1 year", "6 months", "1 week"], "2 years"),
    createQuestion("A distinct period of abnormally and persistently elevated mood lasting at least 1 week is a:", ["Manic Episode", "Hypomanic Episode", "Depressive Episode", "Mixed Episode"], "Manic Episode"),
    createQuestion("Hypomania differs from Mania because:", ["It is not severe enough to cause marked impairment", "It lasts longer", "It is more severe", "It always requires hospitalization"], "It is not severe enough to cause marked impairment"),
    createQuestion("Premenstrual Dysphoric Disorder (PMDD) is now a full diagnosis in:", ["Depressive Disorders", "Anxiety Disorders", "Personality Disorders", "Somatic Disorders"], "Depressive Disorders"),
    createQuestion("Beck's Cognitive Triad key components:", ["Negative view of Self, World, Future", "Past, Present, Future", "Family, Friends, Self", "Work, Home, School"], "Negative view of Self, World, Future"),
    createQuestion("Anhedonia refers to:", ["Loss of interest or pleasure", "Excessive sleep", "Weight gain", "Guilt"], "Loss of interest or pleasure"),
    createQuestion("Rapid Cycling specifier in Bipolar involves how many episodes per year?", ["4 or more", "2", "12", "Continuous"], "4 or more"),
    createQuestion("Postpartum onset specifier is now referred to as:", ["With peripartum onset", "With lactation issues", "Baby blues", "Post-natal depression"], "With peripartum onset"),
    createQuestion("Which neurotransmitter is most commonly linked to Depression?", ["Serotonin", "Dopamine", "GABA", "Glutamate"], "Serotonin"),
    createQuestion("Seasonal Affective Disorder is now a specifier called:", ["With seasonal pattern", "Winter depression", "Light sensitive", "Climate mood disorder"], "With seasonal pattern"),

    // 4. Anxiety, OCD, & Trauma (Approx 15)
    createQuestion("Agoraphobia is best defined as fear of:", ["Situations where escape might be difficult", "Open spaces only", "Closed spaces only", "Public speaking"], "Situations where escape might be difficult"),
    createQuestion("Generalized Anxiety Disorder (GAD) involves excessive worry occurring more days than not for:", ["6 months", "3 months", "1 month", "2 weeks"], "6 months"),
    createQuestion("Panic Disorder involves:", ["Recurrent unexpected panic attacks", "A single panic attack", "Fear of panic", "Social anxiety"], "Recurrent unexpected panic attacks"),
    createQuestion("Selective Mutism is classified as a/an:", ["Anxiety Disorder", "Communication Disorder", "Depressive Disorder", "Personality Disorder"], "Anxiety Disorder"), // Note: DSM-5 moved it to Anxiety
    createQuestion("Which is NOT an Anxiety Disorder?", ["Obsessive-Compulsive Disorder", "Social Anxiety Disorder", "Specific Phobia", "Panic Disorder"], "Obsessive-Compulsive Disorder"), // Moved to OCD & Related
    createQuestion("Trichotillomania involves:", ["Hair pulling", "Skin picking", "Hoarding", "Mirror checking"], "Hair pulling"),
    createQuestion("Excoriation Disorder is:", ["Skin picking", "Hair pulling", "Nail biting", "Thumb sucking"], "Skin picking"),
    createQuestion("Body Dysmorphic Disorder involves preoccupation with:", ["Perceived defects in physical appearance", "Weight gain", "Illness", "Cleanliness"], "Perceived defects in physical appearance"),
    createQuestion("Hoarding Disorder is characterized by:", ["Persistent difficulty discarding possessions", "Compulsive shopping only", "Cleaning excessively", "Organizing perfectly"], "Persistent difficulty discarding possessions"),
    createQuestion("PTSD symptoms must last for more than:", ["1 month", "3 days", "6 months", "1 year"], "1 month"),
    createQuestion("Acute Stress Disorder lasts:", ["3 days to 1 month", "Less than 3 days", "More than 1 month", "6 months"], "3 days to 1 month"),
    createQuestion("Adjustment Disorders occur in response to a stressor within:", ["3 months", "6 months", "1 year", "1 week"], "3 months"),
    createQuestion("Which is NOT a symptom cluster of PTSD?", ["Manic episodes", "Intrusion", "Avoidance", "Negative alterations in cognition/mood"], "Manic episodes"),
    createQuestion("Reactive Attachment Disorder is caused by:", ["Pathogenic care/Severe neglect", "Genetics", "Trauma in adulthood", "Bullying"], "Pathogenic care/Severe neglect"),
    createQuestion("Disinhibited Social Engagement Disorder involves:", ["Overly familiar behavior with strangers", "Extreme shyness", "Aggression", "Fear of strangers"], "Overly familiar behavior with strangers"),

    // 5. Feeding, Eating, Sleep, Sexual (Approx 15)
    createQuestion("Pica involves eating:", ["Non-nutritive, non-food substances", "Too much food", "Only at night", "Regurgitated food"], "Non-nutritive, non-food substances"),
    createQuestion("The key difference between Bulimia and Binge-Eating Disorder is:", ["Compensatory behaviors (purging, exercise)", "Amount of food eaten", "Guilt", "Body image distortion"], "Compensatory behaviors (purging, exercise)"),
    createQuestion("Anorexia Nervosa requires:", ["Restriction of energy intake leading to significantly low body weight", "Binging", "Normal weight", "Vomiting"], "Restriction of energy intake leading to significantly low body weight"),
    createQuestion("Narcolepsy involves:", ["Irrepressible need to sleep", "Insomnia", "Sleep walking", "Nightmares"], "Irrepressible need to sleep"),
    createQuestion("Sleep Apnea is a:", ["Breathing-Related Sleep Disorder", "Parasomnia", "Circadian Rhythm Disorder", "Insomnia Disorder"], "Breathing-Related Sleep Disorder"),
    createQuestion("Parasomnias include:", ["Sleepwalking and Sleep Terrors", "Insomnia", "Hypersomnolence", "Narcolepsy"], "Sleepwalking and Sleep Terrors"),
    createQuestion("Genito-Pelvic Pain/Penetration Disorder combined:", ["Vaginismus and Dyspareunia", "Female Orgasmic Disorder and Arousal Disorder", "ED and Premature Ejaculation", "FSIAD and Desire Disorder"], "Vaginismus and Dyspareunia"),
    createQuestion("Gender Dysphoria differs from Transvestic Disorder because:", ["It involves distress about gender incongruence, not sexual arousal from cross-dressing", "It is a paraphilia", "It is only in adults", "It involves fetishes"], "It involves distress about gender incongruence, not sexual arousal from cross-dressing"),
    createQuestion("Frotteuristic Disorder involves:", ["Touching/rubbing against a non-consenting person", "Watching unsuspecting people", "Exposing genitals", "Using non-living objects"], "Touching/rubbing against a non-consenting person"),
    createQuestion("Voyeuristic Disorder involves:", ["Observing an unsuspecting person naked/undressing", "Exposing self", "Making obscene calls", "Rubbing against others"], "Observing an unsuspecting person naked/undressing"),
    createQuestion("Which is a Paraphilic Disorder?", ["Pedophilic Disorder", "Erectile Disorder", "Gender Dysphoria", "Premature Ejaculation"], "Pedophilic Disorder"),
    createQuestion("Encopresis involves passage of:", ["Feces involving inappropriate places", "Urine", "Vomit", "Objects"], "Feces involving inappropriate places"),
    createQuestion("Enuresis is:", ["Bedwetting/Urination into clothes", "Fecal soiling", "Sleep talking", "Teeth grinding"], "Bedwetting/Urination into clothes"),
    createQuestion("Rumination Disorder involves:", ["Regurgitation of food", "Binging", "Starving", "Eating dirt"], "Regurgitation of food"),
    createQuestion("Female Sexual Interest/Arousal Disorder combines:", ["Hypoactive desire and arousal disorders", "Orgasmic and pain disorders", "Vaginismus and Dyspareunia", "None of the above"], "Hypoactive desire and arousal disorders"),

    // 6. Personality Disorders & Neurocognitive (Approx 25)
    createQuestion("Cluster A Personality Disorders are described as:", ["Odd or Eccentric", "Dramatic or Erratic", "Anxious or Fearful", "Sad or Depressed"], "Odd or Eccentric"),
    createQuestion("Cluster B Personality Disorders are described as:", ["Dramatic, Emotional, or Erratic", "Odd or Eccentric", "Anxious or Fearful", "Psychotic"], "Dramatic, Emotional, or Erratic"),
    createQuestion("Cluster C Personality Disorders are described as:", ["Anxious or Fearful", "Odd or Eccentric", "Dramatic or Erratic", "Aggressive"], "Anxious or Fearful"),
    createQuestion("Paranoid Personality Disorder involves:", ["Pervasive distrust and suspiciousness", "Social detachment", "Grandiosity", "Instability"], "Pervasive distrust and suspiciousness"),
    createQuestion("Schizoid Personality Disorder involves:", ["Detachment from social relationships and restricted emotion", "Cognitive distortions", "Excessive emotionality", "Criminal behavior"], "Detachment from social relationships and restricted emotion"),
    createQuestion("Schizotypal Personality Disorder involves:", ["Acute discomfort in relationships and eccentricities/distortions", "No desire for relationships", "Mania", "Obsession with order"], "Acute discomfort in relationships and eccentricities/distortions"),
    createQuestion("Antisocial Personality Disorder requires evidence of Conduct Disorder before age:", ["15", "18", "12", "7"], "15"),
    createQuestion("Borderline Personality Disorder is characterized by:", ["Instability in interpersonal relationships, self-image, and affects", "Grandiosity", "Social inhibition", "Excessive orderliness"], "Instability in interpersonal relationships, self-image, and affects"),
    createQuestion("Histrionic Personality Disorder involves:", ["Excessive emotionality and attention seeking", "Arrogance", "Avoidance of people", "Fear of abandonment"], "Excessive emotionality and attention seeking"),
    createQuestion("Narcissistic Personality Disorder involves:", ["Grandiosity, need for admiration, and lack of empathy", "Self-harm", "Clinging behavior", "Suspicion"], "Grandiosity, need for admiration, and lack of empathy"),
    createQuestion("Avoidant Personality Disorder involves:", ["Social inhibition, feelings of inadequacy, hypersensitivity to evaluation", "Preference for being alone", "Fear of open spaces", "Paranoia"], "Social inhibition, feelings of inadequacy, hypersensitivity to evaluation"),
    createQuestion("Dependent Personality Disorder involves:", ["Excessive need to be taken care of", "Fear of rejection", "Perfectionism", "Arrogance"], "Excessive need to be taken care of"),
    createQuestion("Obsessive-Compulsive Personality Disorder (OCPD) differs from OCD because:", ["OCPD lacks true obsessions/compulsions and is ego-syntonic", "OCPD is milder", "OCPD is anxiety-based", "They are the same"], "OCPD lacks true obsessions/compulsions and is ego-syntonic"),
    createQuestion("Delirium is characterized by:", ["Disturbance in attention and awareness that develops acutely", "Slow memory loss", "Personality change only", "Genetic cause"], "Disturbance in attention and awareness that develops acutely"),
    createQuestion("Major Neurocognitive Disorder is the new term for:", ["Dementia", "Delirium", "Amnesia", "Retardation"], "Dementia"),
    createQuestion("Alzheimer's Disease is characterized by:", ["Insidious onset and gradual progression of impairment", "Sudden onset", "Steps-wise decline", "Motor tremors first"], "Insidious onset and gradual progression of impairment"),
    createQuestion("Vascular Neurocognitive Disorder is caused by:", ["Cerebrovascular disease (stroke)", "Prions", "Parkinson's", "HIV"], "Cerebrovascular disease (stroke)"),
    createQuestion("Frontotemporal NCD often presents with:", ["Behavioral/personality changes or language impairment", "Memory loss first", "Tremors", "Visual hallucinations"], "Behavioral/personality changes or language impairment"),
    createQuestion("Lewy Body Disease core feature:", ["Visual hallucinations and parkinsonism", "Chorea", "Personality change", "Language loss"], "Visual hallucinations and parkinsonism"),
    createQuestion("Somatic Symptom Disorder involves:", ["Excessive thoughts/feelings/behaviors related to somatic symptoms", "Faking symptoms", "Neurological symptoms", "Worry about having an illness without symptoms"], "Excessive thoughts/feelings/behaviors related to somatic symptoms"),
    createQuestion("Illness Anxiety Disorder involves:", ["Preoccupation with having a serious illness with mild/no symptoms", "Actual pain", "Faking for gain", "Motor deficits"], "Preoccupation with having a serious illness with mild/no symptoms"),
    createQuestion("Conversion Disorder (Functional Neurological Symptom Disorder) involves:", ["Altered voluntary motor or sensory function incompatible with medical conditions", "Worry about health", "Faking weakness", "Pain"], "Altered voluntary motor or sensory function incompatible with medical conditions"),
    createQuestion("Factitious Disorder Imposed on Self (Munchausen) is:", ["Falsification of signs/symptoms associated with identified deception", "Malingering", "Hypochondriasis", "Somatic Symptom Disorder"], "Falsification of signs/symptoms associated with identified deception"),
    createQuestion("Malingering is:", ["Intentional production of false symptoms for external incentives", "A mental disorder", "Factitious Disorder", "Conversion"], "Intentional production of false symptoms for external incentives"),
    createQuestion("Disassociative Identity Disorder (DID) was formerly:", ["Multiple Personality Disorder", "Schizophrenia", "Bipolar", "Fugue"], "Multiple Personality Disorder"),
];

export const abnormalPsychMarketplaceItem: MarketplaceItem = {
    id: 'abnormal-psych-100',
    title: 'Abnormal Psychology Mastery (DSM-5-TR)',
    description: '100-item practice test updated for DSM-5-TR. Covers Anxiety, Mood, Psychotic, Personality Disorders, and new additions like Prolonged Grief Disorder.',
    category: 'Education',
    author: 'Cerebrum Master',
    downloads: 95,
    rating: 4.9,
    price: 'Premium',
    content: abnormalPsychQuestions
};
