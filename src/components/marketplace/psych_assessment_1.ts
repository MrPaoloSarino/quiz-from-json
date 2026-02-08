import { MarketplaceItem } from './data';
import { QuizQuestion } from '@/types/quiz';

const createQuestion = (q: string, opts: string[], ans: string, explanation?: string): QuizQuestion => ({
    question: q,
    options: opts,
    answer: ans,
    type: 'multiple',
    explanation,
});

const psychAssessment1Questions: QuizQuestion[] = [
    createQuestion(
        "Validity is primarily concerned with:",
        ["The consistency and stability of test scores over time.", "The degree to which test scores are free from measurement error.", "The appropriateness of the inferences made from test scores.", "The practicality and cost-effectiveness of a test."],
        "The appropriateness of the inferences made from test scores.",
        "Validity is about the meaning of test scores. It asks, 'Are the conclusions I draw from this score appropriate and accurate?' It's not about the test itself, but how the results are used."
    ),
    createQuestion(
        "A new digital thermometer consistently reads 2°C higher than a person's actual body temperature. We can describe this thermometer as being:",
        ["Valid but not reliable.", "Neither reliable nor valid.", "Both reliable and valid.", "Reliable but not valid."],
        "Reliable but not valid.",
        "The thermometer is reliable because it consistently gives the same result every time (always 2°C higher). However, it is not valid because it is not accurately measuring the real temperature."
    ),
    createQuestion(
        "Which psychometric theory views reliability as the proportion of total variance that is attributable to true score variance?",
        ["Generalizability Theory", "Item Response Theory (IRT)", "Classical Test Theory (CTT)", "Factor Analysis"],
        "Classical Test Theory (CTT)",
        "Classical Test Theory is built on the simple idea that your observed score is a combination of your true ability plus some random error. Reliability, in this theory, is the proportion of the score that is due to your true ability rather than error."
    ),
    createQuestion(
        "Item Response Theory (IRT) differs from Classical Test Theory (CTT) in that IRT:",
        ["Focuses on the characteristics of the test as a whole rather than individual items.", "Has assumptions that are generally easier to meet in practice.", "Provides sample-invariant item parameters.", "Favors longer tests to achieve higher reliability."],
        "Provides sample-invariant item parameters.",
        "A major advantage of Item Response Theory (IRT) is that an item's difficulty is considered an inherent property of the item itself and doesn't change depending on who takes the test. In Classical Test Theory (CTT), an item's difficulty is defined by the percentage of a specific group that got it right."
    ),
    createQuestion(
        "Within the framework of Generalizability Theory, the different conditions under which a test is taken (e.g., different scorers, occasions, or item sets) are referred to as:",
        ["Universes of generalization", "Facets", "G studies", "True scores"],
        "Facets",
        "In Generalizability Theory, 'facets' are all the different conditions that could introduce error, such as different scorers, different testing days, or different sets of items."
    ),
    createQuestion(
        "What is the fundamental relationship between reliability and standard error of measurement (SEM)?",
        ["As reliability increases, SEM also increases.", "As reliability decreases, SEM also decreases.", "As reliability increases, SEM decreases.", "There is no direct mathematical relationship between reliability and SEM."],
        "As reliability increases, SEM decreases.",
        "The Standard Error of Measurement (SEM) is an estimate of the 'fuzziness' of a test score. If a test is highly reliable (not fuzzy), the SEM is small. If a test is unreliable (very fuzzy), the SEM is large. They have an inverse relationship."
    ),
    createQuestion(
        "This statistic is used to compare the scores of two different individuals on the same test to see if the difference between their scores is statistically significant.",
        ["Standard Error of Measurement (SEM)", "Standard Error of the Mean", "Standard Error of Estimate", "Standard Error of the Difference (SED)"],
        "Standard Error of the Difference (SED)",
        "The Standard Error of the Difference (SED) is a specific statistic used to determine if the difference between two people's scores on the same test is a real, meaningful difference or if it's likely just due to random measurement error."
    ),
    createQuestion(
        "Kyungsoo obtained a score of 110 on an IQ test with a standard deviation of 15 and a reliability coefficient of .91. What is the Standard Error of Measurement (SEM) for this test?",
        ["3.0", "4.5", "5.0", "1.5"],
        "4.5",
        "SEM = SD × √(1 - reliability) = 15 × √(1 - 0.91) = 15 × √0.09 = 15 × 0.3 = 4.5"
    ),
    createQuestion(
        "Based on the previous item, what is the 95% confidence interval for Kyungsoo's true score? (z for 95% CI ≈ 1.96)",
        ["101.2 to 118.8", "105.5 to 114.5", "95.0 to 125.0", "107.0 to 113.0"],
        "101.2 to 118.8",
        "To find the 95% confidence interval, you take the person's score and add/subtract the SEM multiplied by 1.96 (the z-score for 95% confidence). The calculation is 110 ± (1.96 × 4.5), which is approximately 110 ± 8.8. This gives a range of about 101.2 to 118.8."
    ),
    createQuestion(
        "A researcher developed a new scale to measure current mood states. He decided to use test-retest reliability with a 6-month interval. Why might this be an inappropriate choice?",
        ["Mood is a stable trait, so the interval is too short.", "Test-retest reliability is only for speed tests.", "The construct being measured (mood) is dynamic and expected to change over time.", "The sample size would need to be extremely large."],
        "The construct being measured (mood) is dynamic and expected to change over time.",
        "Test-retest reliability is used for things that are supposed to be stable. A person's mood naturally changes over time. Using a 6-month interval is inappropriate because a different score later on likely reflects a real change in mood, not that the test is unreliable."
    ),
    createQuestion(
        "A psychometrician wants to assess the reliability of a test measuring clerical speed and accuracy, where every item is easy but the time limit is very strict. Which method of reliability is LEAST appropriate?",
        ["Test-retest reliability", "Alternate forms reliability (administered immediately)", "Split-half reliability", "Scorer reliability"],
        "Split-half reliability",
        "In a speed test, most items are easy. If you split the test in half, people would likely get near-perfect scores on both halves. This would create an artificially high and inaccurate reliability estimate."
    ),
    createQuestion(
        "To estimate the reliability of a test with dichotomous items (right/wrong), which formula is most suitable?",
        ["Cronbach's Alpha", "Spearman-Brown formula", "Kuder-Richardson 20 (KR-20)", "Pearson's r"],
        "Kuder-Richardson 20 (KR-20)",
        "The Kuder-Richardson 20 (KR-20) is a formula specifically designed to measure the internal consistency (how well items hang together) for tests that have dichotomous items, meaning they are scored as simply right or wrong."
    ),
    createQuestion(
        "Measuring the internal consistency of a multidimensional test like the NEO-PI-3 by calculating a single Cronbach's alpha for all items combined will likely result in:",
        ["An artificially inflated reliability estimate.", "An underestimation of the true reliability of the underlying dimensions.", "A perfectly accurate reliability estimate.", "A validity coefficient instead of a reliability coefficient."],
        "An underestimation of the true reliability of the underlying dimensions.",
        "Cronbach's alpha assumes a test measures one single thing. The NEO-PI-3 measures multiple personality dimensions. Calculating one alpha for all items mixes different constructs together, violating the assumption and resulting in a lower, underestimated reliability score."
    ),
    createQuestion(
        "For a high-stakes certification exam like the Board Licensure Examination for Psychologists and Psychometricians (BLEPP), relying solely on traditional reliability estimates can be problematic. A more modern approach that focuses on the consistency of pass/fail decisions is:",
        ["Test-retest reliability", "Decision consistency theory", "Scorer reliability", "Content validity ratios"],
        "Decision consistency theory",
        "For a pass/fail exam like the BLEPP, what matters most is the consistency of the final decision. Decision consistency theory focuses on this, asking: 'If someone took this test again, would they get the same result (pass or fail)?'"
    ),
    createQuestion(
        "I. In split-half reliability, correlating the scores from the first half of the test with the second half is the best way to split the items.\nII. The Spearman-Brown prophecy formula is used to correct for the artificially shortened length of the test in split-half reliability.",
        ["Only I is true.", "Only II is true.", "Both are true.", "Both are false."],
        "Only II is true.",
        "Statement I is false because simply splitting a test in the middle can be biased (e.g., due to fatigue or item difficulty). An odd-even split is better. Statement II is true because split-half reliability is calculated on half the test, so the Spearman-Brown formula is needed to estimate the reliability for the full-length test."
    ),
    createQuestion(
        "Which statement about alternate forms reliability is ACCURATE?",
        ["It is considered the most practical and widely used method of estimating reliability.", "If the two forms are administered on different occasions, it measures both consistency of content and temporal stability.", "It completely eliminates the problem of motivation and fatigue effects.", "It requires calculating an item-total correlation for each form."],
        "If the two forms are administered on different occasions, it measures both consistency of content and temporal stability.",
        "Alternate forms reliability involves creating two different but equivalent versions of a test. When these two forms are given at different times, the resulting correlation measures both the consistency of the content between the forms and the stability of the trait over time."
    ),
    createQuestion(
        "A test developer is creating a 50-item measure of 'Grit.' After writing an initial pool of 100 items and pilot testing them, the next logical step in the test development process is:",
        ["Test revision", "Test construction", "Item analysis", "Norming the test"],
        "Item analysis",
        "After a test is conceptualized and the initial items are constructed and tried out (pilot tested), the next step is to perform an item analysis. This involves statistically examining each item's performance to see how difficult and effective it is."
    ),
    createQuestion(
        "What is a common rule-of-thumb for the sample size during the test tryout or pilot testing phase?",
        ["A minimum of 50 participants, regardless of test length.", "At least 5 to 10 participants for every item on the test.", "A fixed number of 100 participants for all types of tests.", "As many participants as will be in the final norm group."],
        "At least 5 to 10 participants for every item on the test.",
        "A common guideline for pilot testing is to have a large enough sample to get stable statistics for each item. The rule of thumb of having 5 to 10 participants for every single item on the test helps ensure this stability."
    ),
    createQuestion(
        "After conducting an item analysis, the developer of the 'Grit' scale finds several items with poor discrimination indices and extreme difficulty values. What is the next phase of the test development process?",
        ["Conceptualization", "Construction", "Tryout", "Revision"],
        "Revision",
        "The test development process is cyclical. After the tryout and item analysis phase reveals poor items, the process moves to the revision phase, where those items are either improved or discarded."
    ),
    createQuestion(
        "What is the most appropriate method for establishing the internal consistency reliability of a newly developed 'Social Anxiety Scale' that uses a 5-point Likert scale format?",
        ["KR-20", "KR-21", "Cronbach's Alpha", "Test-retest"],
        "Cronbach's Alpha",
        "Cronbach's Alpha is the standard method for measuring the internal consistency of a test that uses a scale with multiple response options, like a 5-point Likert scale. KR-20 is for right/wrong items."
    ),
    createQuestion(
        "A test where respondents must choose between two equally desirable statements (e.g., 'I like parties' vs. 'I enjoy quiet evenings') to determine their personality profile is using a(n) ________ format with ________ scoring.",
        ["selected-response; cumulative", "constructed-response; ipsative", "selected-response; ipsative", "constructed-response; cumulative"],
        "selected-response; ipsative",
        "It is a selected-response format because the test-taker chooses from the provided options. The scoring is ipsative because it forces a choice between two equally desirable options, measuring the relative strength of traits within the individual rather than against an external standard."
    ),
    createQuestion(
        "An item on a final exam was answered correctly by every single student. From a psychometric standpoint, this item is considered:",
        ["A very good item because it was easy.", "A poor item because it does not differentiate among students.", "A good item for assessing content validity.", "A good item for establishing test-retest reliability."],
        "A poor item because it does not differentiate among students.",
        "The purpose of a test item is to differentiate among test-takers based on their knowledge or ability. If everyone gets an item right, it provides no information about who knows the material better, making it a psychometrically poor item."
    ),
    createQuestion(
        "In a 100-person sample, 35 people answered item #10 correctly. The item difficulty index (p-value) for this item is:",
        [".65", ".35", "3.5", "Insufficient data to determine."],
        ".35",
        "The item difficulty index (p) is simply the proportion of people who answered the item correctly. Here, 35 out of 100 people answered correctly, so the difficulty is 35/100 = 0.35."
    ),
    createQuestion(
        "An item with a difficulty index of 0.15 is considered:",
        ["Very easy", "Very difficult", "Moderately difficult", "Optimal for most tests"],
        "Very difficult",
        "The item difficulty index represents the percentage of people who got the item right. A value of 0.15 means only 15% of test-takers answered correctly, making it a very difficult item."
    ),
    createQuestion(
        "The item discrimination index (d-value) for item #15 is calculated to be +0.45. This indicates that:",
        ["The item is flawed and should be discarded.", "More low-scorers than high-scorers got the item correct.", "The item is discriminating well between high-scorers and low-scorers.", "The item difficulty is too high."],
        "The item is discriminating well between high-scorers and low-scorers.",
        "The item discrimination index tells us if high-scorers on the test overall are getting the item right more often than low-scorers. A positive value (especially one as high as +0.45) indicates that the item is doing a good job of discriminating between these two groups."
    ),
    createQuestion(
        "For a five-option multiple-choice item, what is the optimal item difficulty level after correcting for chance?",
        ["0.50", "0.60", "0.75", "0.80"],
        "0.60",
        "The optimal difficulty for an item is the midpoint between a perfect score (1.0) and the probability of guessing correctly. For a five-option item, the chance of guessing is 1/5 or 0.20. The midpoint is (1.0 + 0.20) / 2 = 0.60."
    ),
    createQuestion(
        "An item analysis reveals a discrimination index of -0.30. What is the most likely interpretation?",
        ["The item is functioning well.", "The item is not discriminating at all.", "The item may be miskeyed, or the content is confusing, leading high-scorers to answer it incorrectly.", "The item is too easy."],
        "The item may be miskeyed, or the content is confusing, leading high-scorers to answer it incorrectly.",
        "A negative discrimination index is a major red flag. It means that the low-scoring group on the test actually did better on that specific item than the high-scoring group. This usually happens if the item is confusing or if the wrong answer has been marked as the correct one in the answer key."
    ),
    createQuestion(
        "Face validity refers to:",
        ["Whether the test adequately samples the content domain.", "Whether the test items logically relate to the underlying construct.", "Whether the test appears to measure what it purports to measure to the test-taker.", "Whether the test can predict a future outcome."],
        "Whether the test appears to measure what it purports to measure to the test-taker.",
        "Face validity is not a technical type of validity. It simply refers to whether the test appears to be measuring what it's supposed to measure, from the perspective of the person taking it."
    ),
    createQuestion(
        "Which statement about validity is CORRECT?",
        ["A test can be valid without being reliable.", "Validity is an inherent property of a test itself.", "Validity refers to the interpretation of scores from a test for a specific purpose.", "High face validity guarantees high construct validity."],
        "Validity refers to the interpretation of scores from a test for a specific purpose.",
        "Validity is not a fixed property of a test. It refers to the evidence supporting a specific interpretation of the test scores for a particular purpose. A test can be valid for one use but invalid for another."
    ),
    createQuestion(
        "A psychologist adapts the Thematic Apperception Test (TAT) for use with a remote Filipino indigenous community, changing the images to reflect their culture and lifestyle. This entire process is a form of:",
        ["Co-validation", "Cross-validation", "Local adaptation and validation", "Co-norming"],
        "Local adaptation and validation",
        "This process is a form of local adaptation and validation. It involves not just translating a test, but modifying its content to be culturally appropriate for a specific local group and then conducting studies to ensure it is valid and reliable for that population."
    ),
    createQuestion(
        "A test publisher decides to develop norms for its new scholastic aptitude test and a new vocational interest inventory at the same time, using the same large sample of high school students. This process is called:",
        ["Co-validation", "Cross-validation", "Concurrent validation", "Co-norming"],
        "Co-norming",
        "Co-norming is the process of standardizing two or more tests on the same sample of people. This is efficient and allows for the direct comparison of a person's scores across the different tests."
    ),
    createQuestion(
        "A high school history teacher creates a final exam. She ensures that the proportion of questions about World War I, World War II, and the Cold War matches the proportion of time spent teaching each topic. She is primarily concerned with establishing ________ validity.",
        ["Content", "Construct", "Predictive", "Concurrent"],
        "Content",
        "The teacher is demonstrating concern for content validity. She is making sure that the content of her exam is a representative sample of the content she taught, with the proportion of questions matching the proportion of time spent on each topic."
    ),
    createQuestion(
        "To provide evidence of the ________ validity of a new test for anxiety, a researcher shows that the test scores correlate highly with an established anxiety test (convergent evidence) and have a low correlation with a test of social desirability (discriminant evidence).",
        ["Content", "Criterion-related", "Face", "Construct"],
        "Construct",
        "Construct validity is the evidence that a test measures the theoretical idea it claims to measure. It is demonstrated by showing that the test scores correlate with other measures of the same construct (convergent evidence) and do not correlate with measures of unrelated constructs (discriminant evidence)."
    ),
    createQuestion(
        "A newly developed scale for 'mindfulness' is administered to a group of Zen Buddhist monks and a group of college students. The monks score significantly higher on the scale. This provides what kind of validity evidence?",
        ["Evidence from distinct groups", "Predictive evidence", "Content validity evidence", "Factorial validity"],
        "Evidence from distinct groups",
        "This is known as evidence from distinct groups (or contrasted groups). It's a way to show construct validity. If a test of mindfulness is valid, it should be able to differentiate between a group known to be high in mindfulness (Zen monks) and a typical group (college students)."
    ),
    createQuestion(
        "A test developer correlates scores on a new 'Sales Aptitude Test' with the actual sales performance of a group of employees six months after they were hired. This is an example of establishing:",
        ["Concurrent validity", "Predictive validity", "Content validity", "Convergent validity"],
        "Predictive validity",
        "This is a classic example of a predictive validity study. The test (predictor) is given at one point in time, and the outcome (criterion, in this case, sales performance) is measured at a later point in time to see how well the test predicted future job success."
    ),
    createQuestion(
        "An applicant taking a pre-employment test feels that the questions are irrelevant and do not relate to the job she is applying for. This could lead to lower motivation and skewed results. This is a problem related to:",
        ["Poor construct validity", "Poor content validity", "Poor predictive validity", "Poor face validity"],
        "Poor face validity",
        "The applicant's feeling that the questions are irrelevant relates to poor face validity. While it's not a technical measure of validity, low face validity can harm rapport and motivation, potentially leading the applicant to not take the test seriously, which can skew the results."
    ),
    createQuestion(
        "A researcher finds that her new depression scale has a validity coefficient of .98 with the Beck Depression Inventory (BDI-II). A potential concern with this finding is that:",
        ["The new test has excellent convergent validity.", "The new test may be an unnecessary duplication of the BDI-II.", "The criterion used is likely contaminated.", "The evidence for validity is too weak."],
        "The new test may be an unnecessary duplication of the BDI-II.",
        "A validity coefficient of .98 is extremely high, indicating that the new scale and the BDI-II are measuring almost the exact same thing. This suggests the new scale may lack incremental validity, meaning it's a redundant test that doesn't provide any new or useful information beyond what the existing test already does."
    ),
    createQuestion(
        "Criterion contamination occurs when:",
        ["The criterion measure is not relevant to the construct.", "The test scores are influenced by the test administrator's knowledge.", "The predictor scores influence the data obtained on the criterion.", "The test is administered in a non-standardized way."],
        "The predictor scores influence the data obtained on the criterion.",
        "Criterion contamination occurs when the person who is rating the criterion (e.g., a supervisor rating job performance) is aware of the person's scores on the predictor test. This knowledge can bias the supervisor's rating, artificially inflating the apparent validity of the test."
    ),
    createQuestion(
        "Which of the following statements is INCORRECT?",
        ["Factor analysis can be used to provide evidence of a test's construct validity.", "Showing that test scores change after a targeted intervention can be a source of validity evidence.", "A test's homogeneity provides evidence for its content validity.", "Both convergent and discriminant evidence are crucial for establishing construct validity."],
        "A test's homogeneity provides evidence for its content validity.",
        "A test's homogeneity, or internal consistency, shows that all its items are measuring the same underlying trait. This is a source of evidence for construct validity, not content validity. Content validity is about how well the items represent the entire domain of the topic."
    ),
    createQuestion(
        "In a class of 50 students, the distribution of scores on an exam is positively skewed. This means:",
        ["The exam was likely very easy for most students.", "The exam was likely very difficult for most students.", "Most students scored near the average.", "The mean, median, and mode are all the same."],
        "The exam was likely very difficult for most students.",
        "In a positively skewed distribution, the majority of scores are clustered at the low end, with a few very high scores creating a 'tail' to the right. This pattern indicates that the exam was difficult for most of the students."
    ),
    createQuestion(
        "In a positively skewed distribution, which order of central tendency measures is correct?",
        ["Mean > Median > Mode", "Mode > Median > Mean", "Mean = Median = Mode", "Median > Mean > Mode"],
        "Mean > Median > Mode",
        "In a positively skewed distribution, the few high scores pull the mean (the average) to the right. The mode (most frequent score) will be at the peak of the cluster of low scores, and the median will be in between. So the order is Mode < Median < Mean."
    ),
    createQuestion(
        "The 'peakedness' or 'flatness' of a distribution of scores is referred to as its:",
        ["Skewness", "Modality", "Variability", "Kurtosis"],
        "Kurtosis",
        "Kurtosis is the statistical term that describes the shape of a distribution, specifically its 'peakedness' or 'flatness' compared to a normal curve."
    ),
    createQuestion(
        "A distribution that is relatively flat compared to a normal distribution, indicating a high degree of score variability, is called:",
        ["Mesokurtic", "Leptokurtic", "Platykurtic", "Skewkurtic"],
        "Platykurtic",
        "A platykurtic distribution is flatter and more spread out than a normal distribution. The 'platy' prefix can be remembered by thinking of a plateau. This flatness indicates a high degree of variability in the scores."
    ),
    createQuestion(
        "In a normal distribution, what percentage of scores falls between -1 and +1 standard deviations from the mean?",
        ["Approximately 34%", "Approximately 50%", "Approximately 68%", "Approximately 95%"],
        "Approximately 68%",
        "In a standard normal distribution, it is a known property that approximately 68% of all scores will fall within the range of one standard deviation below the mean to one standard deviation above the mean."
    ),
    createQuestion(
        "If a test has a mean of 100 and a standard deviation of 15, approximately 95% of all scores will lie between:",
        ["85 and 115", "70 and 130", "55 and 145", "100 and 115"],
        "70 and 130",
        "In a normal distribution, approximately 95% of scores fall within two standard deviations of the mean. With a mean of 100 and a standard deviation (SD) of 15, two SDs is 30. Therefore, the range is 100 ± 30, which is 70 to 130."
    ),
    createQuestion(
        "In a race with 100 participants, Pia finished in 10th place. Her percentile rank is:",
        ["10th", "89th", "90th", "91st"],
        "90th",
        "Percentile rank represents the percentage of scores at or below a particular score. If Pia finished 10th out of 100, it means 90 people finished behind her (i.e., had a 'lower' score). Therefore, she is at the 90th percentile."
    ),
    createQuestion(
        "On a standardized test, Gelu's raw score was converted to a T-score of 70. This means her performance was:",
        ["One standard deviation above the mean.", "One standard deviation below the mean.", "Two standard deviations above the mean.", "Two standard deviations below the mean."],
        "Two standard deviations above the mean.",
        "T-scores are standardized scores with a mean of 50 and a standard deviation of 10. A T-score of 70 is 20 points above the mean of 50. Since the standard deviation is 10, this is exactly two standard deviations above the mean."
    ),
    createQuestion(
        "If Jayps has a z-score of -1.5, what is his equivalent T-score? (T-score mean = 50, SD = 10)",
        ["35", "45", "65", "55"],
        "35",
        "The formula to convert a z-score to a T-score is T = (z × 10) + 50. The calculation is T = (-1.5 × 10) + 50 = -15 + 50 = 35."
    ),
    createQuestion(
        "An industrial psychologist wants to determine if there is a statistically significant relationship between scores on a pre-employment spatial reasoning test and a measure of job performance for architects. The most appropriate statistical tool is:",
        ["t-test", "ANOVA", "Pearson's r", "Chi-square"],
        "Pearson's r",
        "Pearson's r (correlation coefficient) is the appropriate statistic to determine the strength and direction of the relationship between two continuous variables, in this case, scores on a reasoning test and a measure of job performance."
    ),
    createQuestion(
        "A researcher wants to examine the relationship between birth order (1st, 2nd, 3rd, etc.) and a continuous measure of academic achievement. Because one variable is ordinal and the other is interval, the appropriate correlation coefficient to use is:",
        ["Pearson's r", "Phi coefficient", "Point-biserial correlation", "Spearman's Rho"],
        "Spearman's Rho",
        "Spearman's Rho is the correct correlation coefficient to use when at least one of the variables is ordinal (ranked), like birth order. The other variable (academic achievement) is interval."
    ),
    createQuestion(
        "What statistical tool should be used to determine the relationship between a true dichotomous variable (e.g., passing vs. failing the bar exam) and a continuous variable (e.g., IQ score)?",
        ["Biserial correlation", "Point-biserial correlation", "Tetrachoric correlation", "Phi coefficient"],
        "Point-biserial correlation",
        "Point-biserial correlation is the specific type of correlation used when one variable is continuous (like an IQ score) and the other variable is a true dichotomy (like passing or failing an exam)."
    ),
    createQuestion(
        "A researcher wants to know if there is a significant difference in job satisfaction scores among employees in three different departments (Sales, Marketing, and HR). The correct statistical test is:",
        ["Independent t-test", "Dependent t-test", "Analysis of Variance (ANOVA)", "Correlation"],
        "Analysis of Variance (ANOVA)",
        "Analysis of Variance (ANOVA) is the correct statistical test to use when you want to compare the mean scores of three or more independent groups (in this case, Sales, Marketing, and HR) to see if there is a significant difference among them."
    ),
    createQuestion(
        "If the data in the previous question (comparing three departments) violated the assumption of normality, what non-parametric alternative to ANOVA should be used?",
        ["Mann-Whitney U test", "Wilcoxon signed-rank test", "Kruskal-Wallis H test", "Friedman test"],
        "Kruskal-Wallis H test",
        "The Kruskal-Wallis H test is the non-parametric alternative to a one-way ANOVA. It is used to compare the central tendency of three or more independent groups when the data does not meet the assumption of normality."
    ),
    createQuestion(
        "A clinician wants to screen an adult client for a wide range of potential psychopathologies like depression, paranoia, and psychopathy. A comprehensive, objective personality test she might use is the:",
        ["TAT", "WISC-V", "MMPI-2", "SDS"],
        "MMPI-2",
        "The MMPI-2 (Minnesota Multiphasic Personality Inventory-2) is a widely used, comprehensive, and objective personality test designed to screen for a broad range of psychological disorders and pathological traits in adults."
    ),
    createQuestion(
        "If the primary referral question is to assess for the presence of long-standing, ingrained personality disorders (e.g., Borderline, Narcissistic), the most appropriate instrument is the:",
        ["MCMI-IV", "BPI", "WAIS-IV", "16PF"],
        "MCMI-IV",
        "The MCMI-IV (Millon Clinical Multiaxial Inventory-IV) is an objective personality test specifically designed to assess and diagnose long-standing personality disorders (like Borderline and Narcissistic) as well as other clinical syndromes."
    ),
    createQuestion(
        "To assess the general intellectual ability of a 25-year-old client, a psychologist would most appropriately use the:",
        ["WISC-V", "WPPSI-IV", "WAIS-IV", "SB-5"],
        "WAIS-IV",
        "The WAIS-IV (Wechsler Adult Intelligence Scale, Fourth Edition) is the most appropriate and widely used individual intelligence test for assessing the cognitive ability of adults, including a 25-year-old. The WISC is for children, and the WPPSI is for preschoolers."
    ),
    createQuestion(
        "An MMPI-2 profile with a significant elevation on the F (Infrequency) scale (e.g., T-score > 100) suggests that the individual:",
        ["Is attempting to present themselves in an overly favorable light.", "May be 'faking bad,' exaggerating symptoms, or responded randomly.", "Is being defensive and guarded.", "Did not answer a large number of items."],
        "May be 'faking bad,' exaggerating symptoms, or responded randomly.",
        "The F (Infrequency) scale on the MMPI-2 is a validity scale that detects atypical responding. A very high score suggests the person may be exaggerating their symptoms ('faking bad'), not understanding the items, or responding randomly."
    ),
    createQuestion(
        "According to Holland's RIASEC model, a person who enjoys working with data, has clerical skills, and prefers structured, orderly tasks would likely score high on the ________ type.",
        ["Realistic", "Investigative", "Artistic", "Conventional"],
        "Conventional",
        "In Holland's RIASEC model, the Conventional type is described as orderly, practical, and detail-oriented. They prefer structured tasks and enjoy working with data, which aligns with clerical skills."
    ),
    createQuestion(
        "A person who is talkative, assertive, and energetic would likely score high on which Big Five personality trait?",
        ["Agreeableness", "Conscientiousness", "Extraversion", "Openness to Experience"],
        "Extraversion",
        "Extraversion is the Big Five personality trait that encompasses characteristics such as being talkative, outgoing, assertive, and energetic."
    ),
    createQuestion(
        "Someone who scores low on Agreeableness is likely to be described as:",
        ["Anxious and insecure.", "Critical, uncooperative, and suspicious.", "Disorganized and careless.", "Imaginative and independent."],
        "Critical, uncooperative, and suspicious.",
        "Agreeableness is the trait associated with being cooperative, warm, and trusting. A person who scores low on agreeableness is more likely to be antagonistic, skeptical, critical, and suspicious of others."
    ),
    createQuestion(
        "Which of these is a measure of vocational interests based on the Holland Codes?",
        ["NEO-PI-3", "Self-Directed Search (SDS)", "Millon Clinical Multiaxial Inventory (MCMI)", "Rorschach Inkblot Method"],
        "Self-Directed Search (SDS)",
        "The Self-Directed Search (SDS) is a vocational interest inventory developed by John Holland himself. It is designed to help individuals identify their Holland Codes (RIASEC type) and explore matching careers."
    ),
    createQuestion(
        "A school psychologist needs to conduct a comprehensive intellectual and cognitive assessment for a 10-year-old student referred for learning difficulties. Which test(s) would be appropriate?",
        ["WAIS-IV only", "SB-5 and/or WISC-V", "MCMI-IV only", "RPM and/or CFIT"],
        "SB-5 and/or WISC-V",
        "For a comprehensive intellectual assessment of a 10-year-old, the two most appropriate and widely used tests are the Stanford-Binet, Fifth Edition (SB-5) and the Wechsler Intelligence Scale for Children, Fifth Edition (WISC-V)."
    ),
    createQuestion(
        "Which Filipino-developed personality inventory is based on Filipino proverbs and cultural concepts?",
        ["Panukat ng Pagkataong Pilipino (PPP)", "Panukat ng Ugali at Pagkatao (PUP)", "Masaklaw na Panukat ng Loob (MAPA)", "Philippine Indigenized Personality Test (PIPPIT)"],
        "Panukat ng Ugali at Pagkatao (PUP)",
        "The Panukat ng Ugali at Pagkatao (PUP) is a well-known Filipino-developed personality test that was specifically constructed based on Filipino concepts, values, and proverbs to be culturally relevant."
    ),
    createQuestion(
        "The 'Pagkukunwari' scale on the PUP is a validity scale designed to detect:",
        ["Inconsistent responding.", "Socially desirable responding or faking good.", "Faking bad or malingering.", "Random responding."],
        "Socially desirable responding or faking good.",
        "The 'Pagkukunwari' scale on the PUP is a validity scale. Its purpose is to detect a specific response style where the test-taker is trying to present themselves in an overly positive or socially desirable way ('faking good')."
    ),
    createQuestion(
        "The Porma K of the Panukat ng Pagkataong Pilipino (PPP) measures personality dimensions relevant to:",
        ["Interpersonal relations", "Personal competence and integrity", "Intelligence and aptitude", "Vocational interests"],
        "Interpersonal relations",
        "The PPP (Panukat ng Pagkataong Pilipino) measures various dimensions of Filipino personality. Porma K specifically assesses traits related to interpersonal relations, or how a person interacts with others."
    ),
    createQuestion(
        "What locally developed test is designed to measure the cognitive abilities and aptitude of Filipino high school students to help with career and academic track decisions?",
        ["PACT (Philippine Aptitude Classification Test)", "PKP (Panukat ng Katalinuhang Pilipino)", "PPP (Panukat ng Pagkataong Pilipino)", "NAT (National Achievement Test)"],
        "PKP (Panukat ng Katalinuhang Pilipino)",
        "The PKP (Panukat ng Katalinuhang Pilipino) is a locally developed cognitive ability test designed to measure the intelligence and aptitude of Filipino individuals, often used for academic and career guidance."
    ),
    createQuestion(
        "Friedman and Rosenman's concept of a 'Type A' personality is characterized by:",
        ["Patience, relaxation, and an easy-going attitude.", "Competitiveness, impatience, and a sense of time urgency.", "Social inhibition and negative affectivity.", "A tendency to suppress emotions, particularly anger."],
        "Competitiveness, impatience, and a sense of time urgency.",
        "The Type A behavior pattern, identified by Friedman and Rosenman, is characterized by a trio of traits: competitiveness, a chronic sense of time urgency, and impatience or hostility."
    ),
    createQuestion(
        "Projective tests like the Rorschach and TAT are based on which theoretical approach?",
        ["Trait theory", "Behavioral theory", "Cognitive theory", "Psychodynamic theory"],
        "Psychodynamic theory",
        "Projective tests are founded on the 'projective hypothesis,' which comes from psychodynamic theory. The idea is that when a person is presented with an ambiguous stimulus (like an inkblot), they will project their unconscious needs, conflicts, and desires onto it."
    ),
    createQuestion(
        "According to the PAP Code of Ethics, who is qualified to administer, score, AND interpret a Level C test like the WAIS-IV?",
        ["A Registered Psychometrician with 2 years of experience.", "A Registered Psychologist.", "A graduate student in psychology under supervision.", "A Registered Guidance Counselor."],
        "A Registered Psychologist.",
        "According to the PAP Code of Ethics, Level C tests are the most complex instruments (like the WAIS-IV) and require advanced training to use properly. Only a Registered Psychologist is qualified to administer, score, and interpret them."
    ),
    createQuestion(
        "A psychometrician is asked to use the Philippine Non-verbal Language Test (PNLT). This is appropriate because the PNLT is classified as a:",
        ["Level A test", "Level B test", "Level C test", "Level D test"],
        "Level B test",
        "The PNLT is classified as a Level B test, which means it requires specific training in psychological assessment but not the advanced doctoral-level training required for Level C tests. Registered Psychometricians are qualified to use Level B tests."
    ),
    createQuestion(
        "A company validates its selection test using only the performance data of employees who were hired and successfully passed their probationary period. This is an example of:",
        ["Range restriction, which can lead to an underestimation of the validity coefficient.", "Range inflation, which can lead to an overestimation of the validity coefficient.", "A perfect validation strategy.", "Criterion contamination."],
        "Range restriction, which can lead to an underestimation of the validity coefficient.",
        "This situation describes range restriction. By only including successful employees, the company is limiting the range of scores on both the test and the job performance measure. This makes the correlation between the two appear weaker than it actually is, leading to an underestimation of the test's validity."
    ),
    createQuestion(
        "A test of American history is administered to a group of new immigrants. The test may be biased against this group because they have not had the same opportunity to learn the material. This is an example of what kind of bias?",
        ["Intercept bias", "Slope bias", "Content bias", "Predictive bias"],
        "Content bias",
        "This is an example of content bias. The test is biased because its content (American history) is something that one group (immigrants) has not had the same opportunity to learn as another group. The test is unfairly measuring cultural knowledge rather than the intended construct."
    ),
    createQuestion(
        "A test user is using the norms from the original 1955 Wechsler Adult Intelligence Scale (WAIS) to interpret scores today. This is problematic due to:",
        ["The Flynn Effect, which suggests the norms are now too lenient.", "The Flynn Effect, which suggests the norms are now too stringent.", "The lack of reliability in the original test.", "The lack of validity in the original test."],
        "The Flynn Effect, which suggests the norms are now too lenient.",
        "The Flynn Effect is the observed phenomenon of IQ scores increasing from one generation to the next. Using outdated norms from 1955 would mean comparing a modern test-taker to a much lower-scoring population. This would artificially inflate the modern score, making the norms too lenient or easy."
    ),
    createQuestion(
        "I. Rapport is the working relationship between the examiner and the examinee.\nII. It is essential to build rapport to ensure the test scores are valid.",
        ["Only I is true.", "Only II is true.", "Both statements are true.", "Both statements are false."],
        "Both statements are true.",
        "Statement I correctly defines rapport as the working relationship. Statement II is also true because good rapport is essential for getting a test-taker's best and most accurate performance, which is necessary for the resulting scores to be valid."
    ),
    createQuestion(
        "During group administration of a standardized test, a test-taker asks if the proctor can clarify the meaning of a word in a question. The proctor should:",
        ["Provide a dictionary definition to be fair.", "Politely decline and advise the test-taker to do their best.", "Announce the clarification to the entire group.", "Ignore the question to avoid disturbance."],
        "Politely decline and advise the test-taker to do their best.",
        "In standardized testing, it is crucial to maintain uniform conditions for all test-takers. The proctor cannot define a word for one person because it would violate standardization and give that person an unfair advantage."
    ),
    createQuestion(
        "The standardized instructions for a test must be read verbatim to the test-takers. This is done to:",
        ["Make the test more difficult.", "Ensure that all test-takers are being assessed under the same conditions.", "Save time during administration.", "Test the reading comprehension of the administrator."],
        "Ensure that all test-takers are being assessed under the same conditions.",
        "Standardized instructions are read verbatim to ensure that every single test-taker receives the exact same directions and works under the exact same conditions. This is fundamental to making fair and accurate comparisons between scores."
    ),
    createQuestion(
        "Which of the following is NOT a responsibility of the test user before testing begins?",
        ["Familiarizing oneself with the test manual and procedures.", "Ensuring all test materials are complete and ready.", "Scoring the test and interpreting the results.", "Preparing a comfortable and distraction-free testing environment."],
        "Scoring the test and interpreting the results.",
        "Scoring and interpreting results are tasks that happen after the testing session is complete. The other three options are all crucial responsibilities of the test user before testing begins to ensure a proper and standardized administration."
    ),
    createQuestion(
        "The ethical principle of 'Respect for People's Rights and Dignity' most directly underpins the practice of:",
        ["Using only the most reliable tests available.", "Charging reasonable fees for assessment services.", "Obtaining informed consent from participants.", "Constantly updating one's professional knowledge."],
        "Obtaining informed consent from participants.",
        "The ethical principle of 'Respect for People's Rights and Dignity' emphasizes individual autonomy. Obtaining informed consent is a direct application of this principle, as it ensures people have the right to freely choose whether or not to participate in an assessment after being fully informed."
    ),
    createQuestion(
        "A psychologist learns in a therapy session that another psychologist is practicing outside their area of competence. According to the PAP Code of Ethics, the first step should be:",
        ["Immediately report the colleague to the ethics committee.", "Anonymously post about the situation online to warn others.", "Attempt an informal resolution by discussing the concern with the colleague directly, if appropriate.", "Do nothing, as it is a confidential matter."],
        "Attempt an informal resolution by discussing the concern with the colleague directly, if appropriate.",
        "The PAP Code of Ethics, like many others, recommends that when appropriate, the first step should be to attempt an informal resolution by speaking directly with the colleague. A formal report to an ethics committee is typically a later step if the informal attempt is unsuccessful or inappropriate for the situation."
    ),
    createQuestion(
        "A psychometrician is feeling overwhelmed by personal problems, which are affecting his concentration and judgment. The most ethical course of action would be to:",
        ["Continue working but try to be extra careful.", "Seek personal therapy but continue all professional duties as normal.", "Temporarily refrain from professional activities that could be impacted by his personal problems.", "Take a vacation without informing his clients or superiors."],
        "Temporarily refrain from professional activities that could be impacted by his personal problems.",
        "Ethical competence requires practitioners to recognize when their own personal problems could harm their work and their clients. The most ethical course of action is to refrain from professional activities until they can perform their duties competently and without risk of harm to others."
    ),
    createQuestion(
        "A psychologist receives a court order (subpoena duces tecum) to produce a client's therapy records for a legal proceeding. The most ethical action is to:",
        ["Ignore the subpoena to protect client confidentiality.", "Immediately send all records to the court as requested.", "Appear in court with the records, but assert privilege and refuse to turn them over unless ordered by the judge or with client consent.", "Contact the client and ask them to retrieve the records themselves."],
        "Appear in court with the records, but assert privilege and refuse to turn them over unless ordered by the judge or with client consent.",
        "A psychologist must respond to a court order, but also has an ethical duty to protect client confidentiality. The correct procedure is to appear as required but to assert psychotherapist-patient privilege, and only release the records if the client consents or if the judge makes a final order to do so."
    ),
    createQuestion(
        "A psychologist is asked to provide a personality assessment of an individual she has not personally examined, based only on reviewing their social media profile. The psychologist should:",
        ["Agree to do it, as long as she has enough data.", "Agree to do it, but include a disclaimer that the assessment is limited.", "Decline, as conducting an assessment without a proper examination is unethical.", "Refer the request to a qualified psychometrician."],
        "Decline, as conducting an assessment without a proper examination is unethical.",
        "It is unethical for a psychologist to provide a formal assessment or professional opinion about an individual whom they have not personally and properly examined. Reviewing a social media profile is not a valid basis for a psychological assessment."
    ),
    createQuestion(
        "A psychologist is assessing a 17-year-old client. The client's parents demand to see the raw test data, including the answer sheets. The psychologist should:",
        ["Provide the data immediately, as the client is a minor.", "Refuse completely, as test data is always confidential.", "Discuss the request with the client to seek their assent and explain the results to the parents in an understandable manner, while generally refraining from releasing raw data to unqualified individuals to prevent misuse.", "Tell the parents they need a court order."],
        "Discuss the request with the client to seek their assent and explain the results to the parents in an understandable manner, while generally refraining from releasing raw data to unqualified individuals to prevent misuse.",
        "The psychologist's primary duties are to protect the client's welfare and the security of the test materials. The best course of action is to explain the results to the parents in an understandable way, while also respecting the 17-year-old client's assent, and refusing to release raw data to unqualified individuals to prevent misuse."
    ),
    createQuestion(
        "Can a registered psychometrician undergoing a master's program in psychology administer and score a Level C test like the Rorschach under the direct supervision of a registered psychologist for training purposes?",
        ["No, only psychologists can ever handle Level C tests.", "No, because the Rorschach is not a real test.", "Yes, this is an acceptable part of supervised training as stipulated by ethical guidelines.", "Yes, but they cannot score it, only administer it."],
        "Yes, this is an acceptable part of supervised training as stipulated by ethical guidelines.",
        "Ethical codes allow for trainees, such as a registered psychometrician in a master's program, to administer and score advanced (Level C) tests for training purposes, provided they are under the direct and competent supervision of a registered psychologist."
    ),
    createQuestion(
        "In a normal distribution of scores, a z-score of 0 is equivalent to a percentile rank of:",
        ["0", "100", "50", "1"],
        "50",
        "In a normal distribution, a z-score of 0 is exactly at the mean. The mean of a normal distribution is also the median, which by definition is the 50th percentile."
    ),
    createQuestion(
        "A test is considered a 'power test' when:",
        ["The time limit is so strict that no one is expected to finish.", "It measures the upper limits of a person's knowledge or ability.", "The items are very easy.", "It is administered by computer."],
        "It measures the upper limits of a person's knowledge or ability.",
        "A power test is designed to measure the upper limit of a person's ability or knowledge, without the pressure of a strict time limit. The items typically get progressively more difficult, and the challenge lies in the content itself, not in speed."
    ),
    createQuestion(
        "The finding that IQ scores have been steadily increasing over the last few decades is known as:",
        ["The G-factor", "The Halo Effect", "The Flynn Effect", "The Barnum Effect"],
        "The Flynn Effect",
        "The Flynn Effect is the name given to the sustained increase in scores on intelligence tests observed throughout the 20th century in many parts of the world."
    ),
    createQuestion(
        "A test item has a difficulty index of .95 and a discrimination index of .05. This item is likely:",
        ["An excellent item for a norm-referenced test.", "Too difficult and not discriminating well.", "Too easy and not discriminating well.", "Moderately difficult but discriminating well."],
        "Too easy and not discriminating well.",
        "An item difficulty of .95 means 95% of people got it right, making it extremely easy. An item discrimination of .05 is very low, meaning it does a poor job of separating high-scorers from low-scorers. It is a weak item."
    ),
    createQuestion(
        "A 'ceiling effect' occurs when:",
        ["A test is too easy, and many test-takers achieve the highest possible score.", "A test is too difficult, and many test-takers score near the bottom.", "The test has a very high reliability coefficient.", "The test is administered in a room with a low ceiling."],
        "A test is too easy, and many test-takers achieve the highest possible score.",
        "A ceiling effect happens when a test is too easy for the group taking it. As a result, many test-takers get the highest possible score, and the test is unable to accurately measure the true ability of the top performers."
    ),
    createQuestion(
        "I. The primary purpose of a validity scale is to assess the test's own validity.\nII. Validity scales help the clinician judge the validity of the test-taker's approach to the test.",
        ["Only I is true.", "Only II is true.", "Both are true.", "Both are false."],
        "Only II is true.",
        "Statement I is false; validity scales don't measure the test's validity. Statement II is true; validity scales (like those on the MMPI) are designed to help the clinician evaluate the test-taker's approach to the test—for example, to see if they were being defensive, exaggerating, or responding randomly."
    ),
    createQuestion(
        "Which of these is a projective test?",
        ["BPI (Basic Personality Inventory)", "MCMI (Millon Clinical Multiaxial Inventory)", "DAP (Draw-A-Person)", "16PF (Sixteen Personality Factor Questionnaire)"],
        "DAP (Draw-A-Person)",
        "The Draw-A-Person (DAP) test is a projective technique where interpretations about personality are made based on the person's drawings. The other options are all objective, structured personality inventories."
    ),
    createQuestion(
        "The 'g' factor in intelligence refers to:",
        ["Group-specific abilities.", "General intelligence that underlies all cognitive tasks.", "Genetic influences on intelligence.", "Giftedness."],
        "General intelligence that underlies all cognitive tasks.",
        "The 'g' factor, or general intelligence, is a concept proposed by Charles Spearman. It refers to a common underlying mental ability that influences performance on all measures of cognitive ability."
    ),
    createQuestion(
        "A psychologist wants to see if a new therapy reduces anxiety. She measures anxiety before the therapy and again after. To see if the change is significant, she should use:",
        ["An independent-samples t-test.", "A dependent-samples t-test (paired t-test).", "A Pearson correlation.", "A one-way ANOVA."],
        "A dependent-samples t-test (paired t-test).",
        "A dependent-samples t-test (also called a paired-samples t-test) is the correct statistic to use when you are comparing the mean scores of the same group of individuals measured at two different times (e.g., before and after therapy)."
    ),
    createQuestion(
        "The concept of 'utility' in psychological testing refers to:",
        ["The reliability of the test.", "The validity of the test.", "The usefulness or practical value of testing to improve decision-making.", "The number of items on the test."],
        "The usefulness or practical value of testing to improve decision-making.",
        "In psychometrics, utility refers to the practical value and usefulness of a test. A test has high utility if using it leads to better outcomes and more effective decision-making than would be possible without it."
    ),
    createQuestion(
        "In the context of the Big Five, 'Conscientiousness' is most associated with traits like:",
        ["Curiosity and creativity.", "Sociability and assertiveness.", "Kindness and empathy.", "Organization, self-discipline, and responsibility."],
        "Organization, self-discipline, and responsibility.",
        "Conscientiousness is one of the Big Five personality traits. It describes the tendency to be organized, responsible, dependable, self-disciplined, and achievement-oriented."
    ),
    createQuestion(
        "A test score that is reported as '8/10 correct' is an example of:",
        ["A norm-referenced score.", "A criterion-referenced score.", "A standard score.", "A percentile rank."],
        "A criterion-referenced score.",
        "A criterion-referenced score compares an individual's performance to a fixed standard or criterion of mastery (e.g., '8 out of 10 correct'). This is different from a norm-referenced score, which compares an individual's performance to that of other people."
    ),
    createQuestion(
        "An individual with a T-score of 30 on a neuroticism scale would be interpreted as being:",
        ["Average in neuroticism.", "Very high in neuroticism.", "Very low in neuroticism.", "Slightly above average in neuroticism."],
        "Very low in neuroticism.",
        "T-scores have a mean of 50 and a standard deviation of 10. A T-score of 30 is two full standard deviations below the average, which would be interpreted as a very low level of the trait being measured."
    ),
    createQuestion(
        "The first step in the process of test development is:",
        ["Test construction.", "Test tryout.", "Item analysis.", "Test conceptualization."],
        "Test conceptualization.",
        "The first step in developing any new test is test conceptualization. This is the 'idea' phase where the purpose of the test is defined, the construct is identified, and initial decisions about the format and target audience are made."
    ),
    createQuestion(
        "An applicant seems highly qualified, but the HR officer notices he scored very high on the Lie (L) scale and the Correction (K) scale of the MMPI-2. This suggests the applicant was likely:",
        ["Exaggerating his problems.", "Responding randomly to items.", "Being highly defensive and attempting to present an unrealistically positive image.", "Open and honest in his responses."],
        "Being highly defensive and attempting to present an unrealistically positive image.",
        "The Lie (L) and Correction (K) scales of the MMPI-2 are validity scales that detect 'faking good.' High scores on these scales suggest that the applicant was being defensive and trying to present themselves in an unrealistically positive and virtuous light."
    ),
    createQuestion(
        "The ethical principle of 'Fidelity and Responsibility' means that a psychologist:",
        ["Strives to benefit those with whom they work and takes care to do no harm.", "Upholds professional standards of conduct and accepts responsibility for their behavior.", "Promotes accuracy, honesty, and truthfulness in the science and practice of psychology.", "Recognizes that all persons are entitled to equal access to the contributions of psychology."],
        "Upholds professional standards of conduct and accepts responsibility for their behavior.",
        "The ethical principle of Fidelity and Responsibility involves creating relationships of trust, being aware of professional and scientific responsibilities to society, and upholding professional standards of conduct."
    ),
];

export const psychAssessment1MarketplaceItem: MarketplaceItem = {
    id: 'psych-assess-set-a-100',
    title: 'Psych Assessment 1 - BLEPP 2025 (100 Items)',
    description: 'Comprehensive 100-item BLEPP Test Bank for Psychological Assessment (Set A). Covers Validity, Reliability, CTT, IRT, Statistics, Test Development, Personality Assessment, Filipino Tests (PUP, PPP, PKP), Ethics, and more. Includes detailed explanations.',
    category: 'Education',
    author: 'Kid Asuncion / BLEPP 2025',
    downloads: 0,
    rating: 5.0,
    price: 'Free',
    content: psychAssessment1Questions
};
