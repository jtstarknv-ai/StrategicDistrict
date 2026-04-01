// Strategic School Plan Builder - school-data.js
// Comprehensive database of all pre-populated suggestion data
// All data constants for the 12-step builder
// Last updated: March 2026

// ============================================================================
// 1. DISTRICT DATABASE (15 districts)
// ============================================================================

var DISTRICT_DATABASE = [
    { id: 1, name: 'Washoe County School District', location: 'Reno, NV', state: 'NV', enrollment: 63000, vision: 'A community where students love learning and achieve academic and personal excellence.', mission: 'Provide every student with an excellent education that prepares them for college, career, and life success.', values: ['Excellence', 'Equity', 'Integrity', 'Collaboration'], goals: ['Improve reading proficiency by 10%', 'Increase graduation rate to 90%', 'Reduce chronic absenteeism by 15%'] },
    { id: 2, name: 'Clark County School District', location: 'Las Vegas, NV', state: 'NV', enrollment: 320000, vision: 'Every student will graduate college and career-ready.', mission: 'Inspire and prepare students to succeed in a changing world.', values: ['Student-Centered', 'Excellence', 'Accountability', 'Innovation'], goals: ['Close achievement gaps', 'Expand STEM opportunities', 'Increase parent engagement'] },
    { id: 3, name: 'Douglas County School District', location: 'Minden, NV', state: 'NV', enrollment: 8500, vision: 'Nurturing lifelong learners and contributing community members.', mission: 'Provide high-quality education in a safe, supportive environment.', values: ['Safety', 'Respect', 'Learning', 'Community'], goals: ['Maintain small class sizes', 'Enhance arts programs', 'Build community partnerships'] },
    { id: 4, name: 'Oakland Unified School District', location: 'Oakland, CA', state: 'CA', enrollment: 50000, vision: 'Oakland students graduate ready for college, career, and full participation in civic life.', mission: 'Provide every student with equitable access to excellent education.', values: ['Equity', 'Excellence', 'Belonging', 'Agency'], goals: ['Achieve 85% 4-year graduation rate', 'Close racial achievement gaps', 'Expand career pathways'] },
    { id: 5, name: 'San Francisco Unified School District', location: 'San Francisco, CA', state: 'CA', enrollment: 54000, vision: 'Every student thrives and contributes to society.', mission: 'Provide an excellent, equitable public education to all students.', values: ['Equity', 'Excellence', 'Community', 'Inclusivity'], goals: ['Improve math proficiency', 'Increase college enrollment', 'Support student wellness'] },
    { id: 6, name: 'Houston Independent School District', location: 'Houston, TX', state: 'TX', enrollment: 280000, vision: 'Every child succeeds.', mission: 'Serve all students with an excellent, innovative education.', values: ['Student Success', 'Excellence', 'Respect', 'Innovation'], goals: ['Increase graduation rates', 'Close achievement gaps', 'Expand STEM/career programs'] },
    { id: 7, name: 'Dallas Independent School District', location: 'Dallas, TX', state: 'TX', enrollment: 160000, vision: 'Students graduate college, career, and life-ready.', mission: 'Educate every student to achieve individual potential.', values: ['Student-Centered', 'Excellence', 'Accountability', 'Diversity'], goals: ['Increase college readiness', 'Improve elementary reading', 'Enhance teacher quality'] },
    { id: 8, name: 'New York City Department of Education', location: 'New York, NY', state: 'NY', enrollment: 1100000, vision: 'All students will graduate high school equipped with skills and knowledge needed for success.', mission: 'Provide a high-quality, free, public education to all students.', values: ['Excellence', 'Equity', 'Accountability', 'Collaboration'], goals: ['Improve graduation rates', 'Close racial/ethnic gaps', 'Expand advanced programs'] },
    { id: 9, name: 'Buffalo City School District', location: 'Buffalo, NY', state: 'NY', enrollment: 34000, vision: 'Each student will develop the skills, knowledge, and confidence to succeed.', mission: 'Ensure every student achieves academic excellence.', values: ['Excellence', 'Respect', 'Equity', 'Community'], goals: ['Increase reading proficiency', 'Improve school climate', 'Expand career prep'] },
    { id: 10, name: 'Chicago Public Schools', location: 'Chicago, IL', state: 'IL', enrollment: 335000, vision: 'Every student graduates prepared for college, career, and life.', mission: 'Provide an excellent education for all students.', values: ['Student-Centered', 'Excellence', 'Equity', 'Accountability'], goals: ['Improve graduation rate to 95%', 'Close achievement gaps', 'Expand STEM pathways'] },
    { id: 11, name: 'Evanston-Skokie School District 65', location: 'Evanston, IL', state: 'IL', enrollment: 10000, vision: 'All students thrive intellectually, socially, and emotionally.', mission: 'Ensure equitable, high-quality education for every student.', values: ['Equity', 'Excellence', 'Respect', 'Collaboration'], goals: ['Close achievement gaps', 'Support whole-child development', 'Build community partnerships'] },
    { id: 12, name: 'Los Angeles Unified School District', location: 'Los Angeles, CA', state: 'CA', enrollment: 440000, vision: 'Empower all students with the knowledge and skills to succeed.', mission: 'Provide an excellent, equitable, and inclusive education.', values: ['Equity', 'Excellence', 'Innovation', 'Community'], goals: ['Improve graduation rates', 'Expand advanced learning', 'Support English learners'] },
    { id: 13, name: 'Denver Public Schools', location: 'Denver, CO', state: 'CO', enrollment: 91000, vision: 'All students graduate prepared for college, career, and life.', mission: 'Ensure equitable, excellent outcomes for all students.', values: ['Excellence', 'Equity', 'Respect', 'Innovation'], goals: ['Improve literacy', 'Close achievement gaps', 'Expand postsecondary options'] },
    { id: 14, name: 'Seattle Public Schools', location: 'Seattle, WA', state: 'WA', enrollment: 49000, vision: 'Every student graduates ready for college, career, and communities.', mission: 'Provide every student with a high-quality public education.', values: ['Equity', 'Excellence', 'Community', 'Integrity'], goals: ['Close opportunity gaps', 'Improve graduation rates', 'Support student wellness'] },
    { id: 15, name: 'Miami-Dade County Public Schools', location: 'Miami, FL', state: 'FL', enrollment: 345000, vision: 'Every student has the opportunity to achieve academic excellence.', mission: 'Provide high-quality instruction in a safe, supportive environment.', values: ['Excellence', 'Equity', 'Respect', 'Accountability'], goals: ['Increase graduation rates', 'Support English learners', 'Expand career pathways'] }
];

// ============================================================================
// 2. VISION TEMPLATES (8 options)
// ============================================================================

var VISION_TEMPLATES = [
    'Every student succeeds and reaches their full potential.',
    'All students graduate college, career, and life-ready.',
    'Our school is a vibrant community where learning thrives.',
    'We inspire lifelong learners who make meaningful contributions.',
    'Students graduate equipped with skills for success.',
    'Excellence and equity drive every decision we make.',
    'All students have opportunities to grow academically and personally.',
    'Our school cultivates curiosity, creativity, and critical thinking.'
];

// ============================================================================
// 3. MISSION TEMPLATES (8 options)
// ============================================================================

var MISSION_TEMPLATES = [
    'Provide every student with an excellent, equitable education.',
    'Empower students to achieve their academic and personal goals.',
    'Create a supportive learning environment where all students thrive.',
    'Prepare students for college, career, and meaningful citizenship.',
    'Foster academic excellence through innovative, student-centered instruction.',
    'Ensure every student develops the skills needed for success.',
    'Inspire students to be thoughtful, engaged, responsible citizens.',
    'Provide equitable access to rigorous, engaging learning experiences.'
];

// ============================================================================
// 4. CORE VALUES (15 options)
// ============================================================================

var CORE_VALUES = [
    'Excellence', 'Equity', 'Respect', 'Collaboration', 'Innovation',
    'Integrity', 'Community', 'Accountability', 'Compassion', 'Growth',
    'Belonging', 'Transparency', 'Justice', 'Courage', 'Perseverance'
];

// ============================================================================
// 5. SCHOOL STRENGTHS DATABASE (12 options)
// ============================================================================

var SCHOOL_STRENGTHS_DB = [
    'Strong teacher collaboration and PLCs',
    'High parent engagement and volunteerism',
    'Effective MTSS/RTI implementation',
    'Strong school culture and positive climate',
    'Experienced and stable teaching staff',
    'Active extracurricular and enrichment programs',
    'Strong community partnerships',
    'Data-driven decision making practices',
    'Inclusive special education programming',
    'Effective student leadership opportunities',
    'High attendance rates',
    'Strong early literacy program'
];

// ============================================================================
// 6. SCHOOL CHALLENGES DATABASE (12 options)
// ============================================================================

var SCHOOL_CHALLENGES_DB = [
    'Achievement gaps between student subgroups',
    'High chronic absenteeism rates',
    'Teacher recruitment and retention difficulties',
    'Limited access to mental health supports',
    'Below-grade reading proficiency',
    'Below-grade math proficiency',
    'High student mobility/transience',
    'Insufficient technology infrastructure',
    'Low family engagement in underserved communities',
    'Disproportionate discipline practices',
    'Limited college/career readiness pathways',
    'Inadequate intervention resources'
];

// ============================================================================
// 7. ROOT CAUSES DATABASE (15+ options)
// ============================================================================

var ROOT_CAUSES_DB = [
    'Lack of differentiated instruction training',
    'Insufficient early warning system utilization',
    'Limited culturally responsive curriculum materials',
    'Inadequate social-emotional support staffing',
    'Inconsistent implementation of Tier 2/3 interventions',
    'Limited family outreach in home languages',
    'High teacher turnover disrupting instructional continuity',
    'Insufficient professional development time',
    'Lack of data literacy among staff',
    'Transportation barriers affecting attendance',
    'Economic instability in school community',
    'Unaddressed trauma and adverse childhood experiences',
    'Insufficient structured literacy instruction',
    'Inconsistent classroom management strategies',
    'Limited access to technology in home environments',
    'Inadequate staffing for special education services'
];

// ============================================================================
// 8. PRIORITY AREAS DATABASE (12 options)
// ============================================================================

var PRIORITY_AREAS_DB = [
    'Reading/ELA proficiency improvement',
    'Mathematics proficiency improvement',
    'Chronic absenteeism reduction',
    'Closing achievement/opportunity gaps',
    'School climate and culture improvement',
    'Social-emotional learning implementation',
    'Teacher effectiveness and development',
    'Family and community engagement',
    'College and career readiness',
    'English learner achievement',
    'Special education outcomes',
    'Student safety and wellness'
];

// ============================================================================
// 9. SCHOOL GOALS DATABASE (Restructured to SMART format by priority area)
// ============================================================================

var SCHOOL_GOALS_DB = {
    'Reading/ELA proficiency improvement': [
        {
            need: 'Reading proficiency below state benchmarks',
            rootCause: 'Insufficient structured literacy instruction',
            goalStatement: 'By June 2027, increase the percentage of students meeting grade-level ELA standards from 62% to 75%.',
            strategies: ['Implement science of reading curriculum', 'Deploy high-dosage tutoring', 'Establish reading intervention tiers'],
            metric: 'ELA Proficiency Rate',
            target: '75%',
            targetDate: 'June 2027'
        },
        {
            need: 'Achievement gap in ELA between White students and students of color',
            rootCause: 'Limited culturally responsive curriculum and differentiation',
            goalStatement: 'By June 2027, reduce the ELA proficiency gap between highest and lowest performing subgroups from 18% to 12%.',
            strategies: ['Adopt culturally responsive curriculum', 'Provide differentiation training', 'Monitor subgroup progress monthly'],
            metric: 'Subgroup Proficiency Gap',
            target: '12 percentage points',
            targetDate: 'June 2027'
        },
        {
            need: 'K-2 students not reaching reading benchmarks',
            rootCause: 'Lack of structured phonics and phonemic awareness instruction',
            goalStatement: 'By June 2027, ensure 80% of K-2 students are reading at or above grade level on fall benchmark.',
            strategies: ['Implement Fountas & Pinnell or similar', 'Daily guided reading groups', 'Parent literacy support program'],
            metric: 'K-2 Reading Level Benchmark',
            target: '80% at/above level',
            targetDate: 'June 2027'
        },
        {
            need: 'Insufficient foundational reading skills in grades 3-5',
            rootCause: 'Inconsistent phonics instruction in K-2',
            goalStatement: 'By June 2027, increase grades 3-5 fluency from 58% to 72% on curriculum-based measurement.',
            strategies: ['Implement fluency-focused instruction', 'Weekly progress monitoring', 'Parent engagement in home reading'],
            metric: 'Fluency Assessment Rate',
            target: '72%',
            targetDate: 'June 2027'
        }
    ],
    'Mathematics proficiency improvement': [
        {
            need: 'Math proficiency below state benchmarks',
            rootCause: 'Insufficient focus on number sense and procedural fluency',
            goalStatement: 'By June 2027, increase the percentage of students meeting grade-level math standards from 58% to 70%.',
            strategies: ['Adopt Singapore Math or similar', 'Weekly diagnostic assessments', 'Small group intervention instruction'],
            metric: 'Math Proficiency Rate',
            target: '70%',
            targetDate: 'June 2027'
        },
        {
            need: 'Significant gap between White students and students of color in math',
            rootCause: 'Limited access to advanced math tracks and limited representation in advanced courses',
            goalStatement: 'By June 2027, reduce the math proficiency gap between highest and lowest performing subgroups from 16% to 10%.',
            strategies: ['Increase access to Algebra I in grade 8', 'Provide summer math bridge program', 'Monitor subgroup progress bi-weekly'],
            metric: 'Subgroup Math Gap',
            target: '10 percentage points',
            targetDate: 'June 2027'
        },
        {
            need: 'Students lacking foundational number sense skills',
            rootCause: 'Insufficient early intervention in K-2',
            goalStatement: 'By June 2027, increase percentage of K-2 students demonstrating grade-level number sense from 64% to 85%.',
            strategies: ['Daily number sense practice', 'Implement Math Expressions', 'Parent number sense activities'],
            metric: 'Number Sense Assessment',
            target: '85% proficient',
            targetDate: 'June 2027'
        },
        {
            need: 'Algebra readiness gaps affecting secondary success',
            rootCause: 'Insufficient fluency with whole number operations',
            goalStatement: 'By June 2027, ensure 78% of grade 7 students are algebra-ready by end of year.',
            strategies: ['Intensive pre-algebra intervention', 'Weekly progress monitoring', 'High-dosage tutoring for at-risk'],
            metric: 'Algebra Readiness Rate',
            target: '78%',
            targetDate: 'June 2027'
        }
    ],
    'Chronic absenteeism reduction': [
        {
            need: 'High chronic absenteeism impacting learning continuity',
            rootCause: 'Transportation barriers and family economic instability',
            goalStatement: 'By June 2027, reduce the chronic absenteeism rate from 18% to 10%.',
            strategies: ['Home visit program for chronically absent', 'Attendance incentive program', 'Partner with community agencies'],
            metric: 'Chronic Absence Rate',
            target: '10%',
            targetDate: 'June 2027'
        },
        {
            need: 'Inconsistent daily attendance',
            rootCause: 'Lack of systematic monitoring and early intervention',
            goalStatement: 'By June 2027, achieve and maintain a 96% or higher average daily attendance rate.',
            strategies: ['Deploy automated absence alerts', 'Weekly attendance monitoring', 'Rapid intervention protocol'],
            metric: 'Average Daily Attendance',
            target: '96%',
            targetDate: 'June 2027'
        },
        {
            need: 'Chronic absenteeism concentrated in low-income and minority students',
            rootCause: 'Economic barriers and limited family support services',
            goalStatement: 'By June 2027, reduce chronic absenteeism disparity across subgroups by 20%.',
            strategies: ['Targeted outreach in home languages', 'Remove barriers (uniforms, supplies)', 'Mentoring for at-risk students'],
            metric: 'Subgroup Absence Equity Gap',
            target: 'Reduce by 20%',
            targetDate: 'June 2027'
        }
    ],
    'Closing achievement/opportunity gaps': [
        {
            need: 'Significant racial achievement gap affecting school performance rating',
            rootCause: 'Systemic inequities in access to advanced courses and quality instruction',
            goalStatement: 'By June 2027, reduce the achievement gap between White students and students of color from 16% to 10%.',
            strategies: ['Implement equitable placement practices', 'Professional development on implicit bias', 'Monitor acceleration rates by race'],
            metric: 'Racial Achievement Gap',
            target: '10 percentage points',
            targetDate: 'June 2027'
        },
        {
            need: 'Low-income students performing significantly below non-FRL peers',
            rootCause: 'Limited access to resources and limited enrichment opportunities',
            goalStatement: 'By June 2027, reduce the proficiency gap between FRL and non-FRL students from 14% to 8%.',
            strategies: ['Increase Title I funding for low-income schools', 'Summer bridge programs', 'Evening tutoring for FRL families'],
            metric: 'Income Achievement Gap',
            target: '8 percentage points',
            targetDate: 'June 2027'
        },
        {
            need: 'English learners not progressing to English proficiency fast enough',
            rootCause: 'Insufficient bilingual instruction and EL teacher training',
            goalStatement: 'By June 2027, increase the English Learner reclassification rate from 8% to 13% annually.',
            strategies: ['Expand dual immersion programs', 'Professional development for EL teachers', 'Intensive English support classes'],
            metric: 'EL Reclassification Rate',
            target: '13% annually',
            targetDate: 'June 2027'
        }
    ],
    'School climate and culture improvement': [
        {
            need: 'Negative school climate affecting teacher retention and student achievement',
            rootCause: 'Lack of structured systems for building positive relationships',
            goalStatement: 'By June 2027, increase positive responses on school climate survey from 58% to 75%.',
            strategies: ['Implement school-wide greeting protocol', 'Monthly celebration activities', 'Student voice in decision-making'],
            metric: 'Climate Survey Score',
            target: '75% positive',
            targetDate: 'June 2027'
        },
        {
            need: 'High suspension rate indicating punitive rather than restorative practices',
            rootCause: 'Insufficient training in restorative justice and trauma-informed practices',
            goalStatement: 'By June 2027, reduce out-of-school suspensions by 40% through restorative practices.',
            strategies: ['Implement school-wide restorative practices', 'Peer mediation program', 'Restorative conference training'],
            metric: 'Out-of-School Suspension Rate',
            target: 'Reduce by 40%',
            targetDate: 'June 2027'
        },
        {
            need: 'Students report not feeling a sense of belonging or safety',
            rootCause: 'Limited adult-student relationships and inclusive structures',
            goalStatement: 'By June 2027, achieve 85%+ of students reporting a strong sense of belonging.',
            strategies: ['Student advisory program', 'Inclusivity training for staff', 'Anti-bullying protocol'],
            metric: 'Student Belonging Index',
            target: '85%+',
            targetDate: 'June 2027'
        }
    ],
    'Social-emotional learning implementation': [
        {
            need: 'Students struggling with emotional regulation and social skills',
            rootCause: 'No systematic SEL instruction or minimal SEL exposure',
            goalStatement: 'By June 2027, implement evidence-based SEL curriculum in 100% of classrooms.',
            strategies: ['Adopt CASEL-aligned SEL program', 'Teacher training on SEL instruction', 'Monthly implementation checks'],
            metric: 'SEL Implementation Rate',
            target: '100% of classrooms',
            targetDate: 'June 2027'
        },
        {
            need: 'Low student competency in self-awareness and relationship management',
            rootCause: 'Insufficient explicit SEL instruction and modeling',
            goalStatement: 'By June 2027, increase student SEL competency scores by 18% on validated assessment.',
            strategies: ['Daily SEL instruction', 'School-wide SEL norms', 'Student self-monitoring tools'],
            metric: 'SEL Competency Assessment',
            target: '+18%',
            targetDate: 'June 2027'
        },
        {
            need: 'High behavioral incidents driven by lack of emotional regulation',
            rootCause: 'Reactive rather than preventive approach to behavior',
            goalStatement: 'By June 2027, decrease office discipline referrals by 30% through proactive SEL.',
            strategies: ['SEL-infused PBIS framework', 'Emotion recognition training', 'Student mindfulness program'],
            metric: 'Office Discipline Referral Rate',
            target: 'Reduce by 30%',
            targetDate: 'June 2027'
        }
    ],
    'Teacher effectiveness and development': [
        {
            need: 'Inconsistent instructional quality affecting student achievement',
            rootCause: 'Limited high-quality coaching and professional development',
            goalStatement: 'By June 2027, increase percentage of teachers rated effective/highly effective to 92%.',
            strategies: ['Implement instructional coaching model', 'Monthly walkthroughs with feedback', 'Professional learning communities'],
            metric: 'Teacher Effectiveness Rating',
            target: '92%+ effective',
            targetDate: 'June 2027'
        },
        {
            need: 'High teacher turnover disrupting instructional continuity',
            rootCause: 'Limited support for new teachers and unclear advancement pathways',
            goalStatement: 'By June 2027, achieve 92%+ teacher retention rate.',
            strategies: ['Mentor program for new teachers', 'Instructional coaching system', 'Clear career pathways'],
            metric: 'Teacher Retention Rate',
            target: '92%+',
            targetDate: 'June 2027'
        },
        {
            need: 'Professional development not perceived as useful or applicable',
            rootCause: 'Disconnected PD from classroom needs and limited follow-up support',
            goalStatement: 'By June 2027, ensure 85% of teachers report PD as useful and applicable.',
            strategies: ['Job-embedded professional development', 'Classroom application follow-up', 'Teacher-selected PD topics'],
            metric: 'PD Satisfaction and Applicability',
            target: '85%+ satisfied',
            targetDate: 'June 2027'
        }
    ],
    'Family and community engagement': [
        {
            need: 'Low family participation in school events and decisions',
            rootCause: 'Limited accessibility and culturally responsive engagement approaches',
            goalStatement: 'By June 2027, increase family engagement event participation by 35%.',
            strategies: ['Multilingual communication', 'Evening and weekend events', 'Childcare and transportation support'],
            metric: 'Family Event Participation Rate',
            target: '+35%',
            targetDate: 'June 2027'
        },
        {
            need: 'Families report not feeling heard or valued in school decisions',
            rootCause: 'Limited two-way communication and limited voice in decision-making',
            goalStatement: 'By June 2027, achieve 90%+ family satisfaction on communication surveys.',
            strategies: ['Monthly family cafes', 'Parent representation on committees', 'Transparent communication about decisions'],
            metric: 'Family Communication Satisfaction',
            target: '90%+',
            targetDate: 'June 2027'
        },
        {
            need: 'Limited community resources supporting school and student goals',
            rootCause: 'Lack of intentional partnership development',
            goalStatement: 'By June 2027, establish 6+ active community partnerships providing direct student support.',
            strategies: ['Identify community partners aligned with goals', 'Formalize partnership agreements', 'Quarterly partnership meetings'],
            metric: 'Active Community Partnerships',
            target: '6+ partnerships',
            targetDate: 'June 2027'
        }
    ],
    'College and career readiness': [
        {
            need: 'Low percentage of graduates meeting college readiness benchmarks',
            rootCause: 'Limited advanced course access and college prep support',
            goalStatement: 'By June 2027, increase percentage of graduates meeting college readiness to 75%.',
            strategies: ['Expand AP/honors enrollment', 'College readiness workshops', 'Career exploration in grades 6-8'],
            metric: 'College Ready Graduates',
            target: '75%',
            targetDate: 'June 2027'
        },
        {
            need: 'Limited participation in career and technical education programs',
            rootCause: 'Insufficient career pathways and low awareness of CTE options',
            goalStatement: 'By June 2027, increase CTE pathway completion rate by 22%.',
            strategies: ['Launch 2+ new CTE pathways', 'Career exploration fairs', 'Work-based learning programs'],
            metric: 'CTE Pathway Completion Rate',
            target: '+22%',
            targetDate: 'June 2027'
        },
        {
            need: 'Low FAFSA completion rates limiting college access',
            rootCause: 'Lack of college financial aid support and navigation assistance',
            goalStatement: 'By June 2027, achieve 82%+ FAFSA completion rate for graduating seniors.',
            strategies: ['College financial aid nights', 'FAFSA completion parties', 'One-on-one advising'],
            metric: 'FAFSA Completion Rate',
            target: '82%+',
            targetDate: 'June 2027'
        }
    ],
    'English learner achievement': [
        {
            need: 'English learners not making adequate progress toward English proficiency',
            rootCause: 'Insufficient intensive English instruction and program services',
            goalStatement: 'By June 2027, increase EL students making progress toward proficiency by 18%.',
            strategies: ['Intensive English support program', 'Sheltered content instruction', 'Monthly progress monitoring'],
            metric: 'EL Progress Toward Proficiency',
            target: '+18%',
            targetDate: 'June 2027'
        },
        {
            need: 'Long-term English learners not progressing to reclassification',
            rootCause: 'Limited accelerated English instruction for LTELs',
            goalStatement: 'By June 2027, increase annual EL reclassification rate from 9% to 15%.',
            strategies: ['LTEL-focused intervention', 'Peer mentoring in English', 'Integrated content/language instruction'],
            metric: 'EL Reclassification Rate',
            target: '15% annually',
            targetDate: 'June 2027'
        }
    ],
    'Special education outcomes': [
        {
            need: 'Students with IEPs not meeting state achievement standards',
            rootCause: 'Insufficient access to grade-level content and differentiation',
            goalStatement: 'By June 2027, increase proficiency rates for students with IEPs by 12 percentage points.',
            strategies: ['Grade-level content access', 'UDL principles in all classrooms', 'Specialized staff support'],
            metric: 'SPED Proficiency Rate',
            target: '+12 percentage points',
            targetDate: 'June 2027'
        },
        {
            need: 'Students with IEPs spending too much time in separate settings',
            rootCause: 'Limited inclusive classroom structures and support',
            goalStatement: 'By June 2027, increase time in general education settings for students with IEPs to 82%+.',
            strategies: ['Inclusive classroom models', 'Co-teaching partnerships', 'Peer support systems'],
            metric: 'Least Restrictive Environment Placement',
            target: '82%+',
            targetDate: 'June 2027'
        }
    ],
    'Student safety and wellness': [
        {
            need: 'Students report not feeling safe at school',
            rootCause: 'Insufficient safety protocols and positive adult relationships',
            goalStatement: 'By June 2027, achieve 91%+ of students reporting they feel safe at school.',
            strategies: ['School safety audit and improvement', 'Mental health screening protocols', 'Adult-student mentoring'],
            metric: 'Student Safety Survey Score',
            target: '91%+',
            targetDate: 'June 2027'
        },
        {
            need: 'Limited mental health and wellness supports for students',
            rootCause: 'Insufficient school counselors, psychologists, and community partnerships',
            goalStatement: 'By June 2027, ensure every student has access to mental health support within 48 hours of referral.',
            strategies: ['Hire additional counselors', 'Community mental health partnerships', 'Crisis response protocols'],
            metric: 'Mental Health Referral Response Time',
            target: 'Within 48 hours',
            targetDate: 'June 2027'
        }
    ]
};

// ============================================================================
// 10. ACTION STRATEGIES DATABASE (Expanded and organized by category)
// ============================================================================

var ACTION_STRATEGIES_DB = [
    // READING/LITERACY STRATEGIES
    { name: 'Implement structured literacy program (Science of Reading)', description: 'Comprehensive phonics, phonemic awareness, fluency, vocabulary, and comprehension instruction', category: 'Reading/Literacy', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Deploy guided reading groups', description: 'Small group reading instruction at appropriate instructional level with teacher support', category: 'Reading/Literacy', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'High-dosage reading tutoring', description: '30+ minutes daily individual or small group tutoring for struggling readers', category: 'Reading/Literacy', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Daily phonemic awareness instruction (K-1)', description: 'Explicit, systematic phonemic awareness lesson 15-20 minutes daily', category: 'Reading/Literacy', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Systematic phonics instruction', description: 'Explicit phonics scope and sequence taught daily with decodable text', category: 'Reading/Literacy', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Fluency-focused reading instruction', description: 'Repeated reading, echo reading, and choral reading to build fluency', category: 'Reading/Literacy', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Vocabulary instruction program', description: 'Explicit vocabulary teaching with multiple exposures in context', category: 'Reading/Literacy', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Comprehension strategy instruction', description: 'Explicit teaching of comprehension strategies (visualization, prediction, etc.)', category: 'Reading/Literacy', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Parent literacy engagement program', description: 'Family night events and home activities to support reading development', category: 'Reading/Literacy', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Family and community engagement'] },
    { name: 'Leveled reading libraries and independent reading', description: 'Classroom libraries with books at multiple reading levels', category: 'Reading/Literacy', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },

    // MATHEMATICS STRATEGIES
    { name: 'Implement number sense and numeracy program', description: 'Systematic instruction in place value, counting, and number relationships', category: 'Mathematics', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'High-dosage math tutoring', description: '30+ minutes daily individual or small group math tutoring', category: 'Mathematics', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Daily procedural fluency practice', description: 'Timed basic facts and operations practice 10-15 minutes daily', category: 'Mathematics', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Problem-solving and reasoning instruction', description: 'Emphasis on mathematical thinking, discourse, and multiple solution strategies', category: 'Mathematics', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Algebra readiness interventions (Grade 7)', description: 'Intensive pre-algebra instruction for students not meeting algebra readiness', category: 'Mathematics', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Math workshop/stations model', description: 'Differentiated math instruction using guided practice, independent, and partner work', category: 'Mathematics', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Concrete-representational-abstract (CRA) instruction', description: 'Use of manipulatives, models, and visual representations before symbols', category: 'Mathematics', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Parent math engagement program', description: 'Family math nights and home activities to support math development', category: 'Mathematics', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement', 'Family and community engagement'] },
    { name: 'Growth mindset instruction in math', description: 'Teaching students that math ability develops through effort and practice', category: 'Mathematics', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Acceleration and advanced math pathways', description: 'Early Algebra I access and advanced math course options for capable students', category: 'Mathematics', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Mathematics proficiency improvement', 'Closing achievement/opportunity gaps'] },

    // ATTENDANCE AND ABSENTEEISM STRATEGIES
    { name: 'Home visit program for chronically absent students', description: 'In-person home visits to understand barriers and build relationships', category: 'Attendance', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Automated absence alert system', description: 'Real-time notifications to families of absences and early intervention', category: 'Attendance', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Attendance incentive program', description: 'Recognition and rewards for perfect or improved attendance', category: 'Attendance', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Mentoring program for chronically absent students', description: 'Adult mentoring focused on building relationships and identifying barriers', category: 'Attendance', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Partnerships with community agencies for services', description: 'Partnerships to address underlying causes (health, transportation, etc.)', category: 'Attendance', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Remove barriers (uniforms, supplies, technology)', description: 'Provide free supplies, uniforms, devices to remove attendance barriers', category: 'Attendance', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Transportation solutions', description: 'Partnerships or programs to address transportation barriers to attendance', category: 'Attendance', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Early warning system (EWS) for attendance flags', description: 'Systematic identification of students at risk of chronic absence', category: 'Attendance', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Rapid response team for chronic absence', description: 'Quick team response when student reaches chronic absence threshold', category: 'Attendance', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Chronic absenteeism reduction'] },

    // BEHAVIOR AND CLIMATE STRATEGIES
    { name: 'School-wide PBIS (Positive Behavioral Interventions and Supports)', description: 'Positive behavioral expectations, acknowledgment, and tiered interventions', category: 'Behavior/Climate', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['School climate and culture improvement', 'Social-emotional learning implementation'] },
    { name: 'Restorative justice practices school-wide', description: 'Conferences, circles, and mediation focused on relationships and accountability', category: 'Behavior/Climate', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['School climate and culture improvement'] },
    { name: 'Peer mediation and conflict resolution program', description: 'Student-led peer mediation and conflict resolution training', category: 'Behavior/Climate', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['School climate and culture improvement'] },
    { name: 'Anti-bullying and harassment program', description: 'Comprehensive anti-bullying curriculum and reporting protocols', category: 'Behavior/Climate', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['School climate and culture improvement', 'Student safety and wellness'] },
    { name: 'School-wide greeting and relationship-building protocol', description: 'Systematic adult greeting of every student by name every day', category: 'Behavior/Climate', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['School climate and culture improvement'] },
    { name: 'Student-led meetings and voice structures', description: 'Student representation in decision-making committees and governance', category: 'Behavior/Climate', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['School climate and culture improvement'] },
    { name: 'Monthly student celebration assemblies', description: 'Regular celebrations of student achievement and recognition', category: 'Behavior/Climate', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['School climate and culture improvement'] },
    { name: 'Classroom management training and coaching', description: 'Professional development and coaching on evidence-based classroom management', category: 'Behavior/Climate', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['School climate and culture improvement'] },

    // SOCIAL-EMOTIONAL LEARNING STRATEGIES
    { name: 'Implement CASEL-aligned SEL curriculum', description: 'Evidence-based social-emotional learning curriculum with explicit instruction', category: 'SEL', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Social-emotional learning implementation'] },
    { name: 'Trauma-informed care professional development', description: 'Training for all staff on trauma-informed approaches and de-escalation', category: 'SEL', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Social-emotional learning implementation'] },
    { name: 'Student mindfulness and meditation program', description: 'Daily mindfulness and meditation practices for emotional regulation', category: 'SEL', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Social-emotional learning implementation'] },
    { name: 'Student emotion recognition and coping strategies training', description: 'Explicit teaching of emotion identification and healthy coping', category: 'SEL', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Social-emotional learning implementation'] },
    { name: 'School-wide SEL norms and expectations', description: 'Clear, taught SEL expectations consistently reinforced across all settings', category: 'SEL', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Social-emotional learning implementation'] },
    { name: 'Student self-monitoring and goal-setting tools', description: 'Tools for students to track their own emotional and behavioral growth', category: 'SEL', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Social-emotional learning implementation'] },

    // TEACHER EFFECTIVENESS AND DEVELOPMENT STRATEGIES
    { name: 'Implement instructional coaching model', description: 'Professional coaches provide one-on-one feedback and support to teachers', category: 'Teacher Development', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Establish weekly PLC collaboration time', description: 'Protected time for professional learning communities to analyze data and plan', category: 'Teacher Development', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Monthly classroom walkthroughs with feedback', description: 'Regular instructional observations with timely feedback to teachers', category: 'Teacher Development', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Mentoring program for new teachers', description: 'Dedicated mentoring and support for teachers in first 3 years', category: 'Teacher Development', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Job-embedded professional development', description: 'Professional development directly tied to classroom practice and student needs', category: 'Teacher Development', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Teacher-selected professional development topics', description: 'Allow teachers choice in PD focus areas aligned to school goals', category: 'Teacher Development', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Peer observation and collaborative learning', description: 'Teachers observe and learn from peers demonstrating best practices', category: 'Teacher Development', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Clear career advancement pathways', description: 'Transparent opportunities for advancement without leaving classroom', category: 'Teacher Development', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Professional development on implicit bias and culturally responsive teaching', description: 'Training on recognizing bias and implementing culturally responsive instruction', category: 'Teacher Development', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Teacher effectiveness and development', 'Closing achievement/opportunity gaps'] },
    { name: 'Data literacy and use professional development', description: 'Training teachers to understand and use data for instructional decisions', category: 'Teacher Development', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Teacher effectiveness and development'] },

    // FAMILY AND COMMUNITY ENGAGEMENT STRATEGIES
    { name: 'Home visit program (general)', description: 'In-person home visits to build relationships and understand student contexts', category: 'Family Engagement', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Multilingual family communication', description: 'Communication in families\' home languages for accessibility and inclusivity', category: 'Family Engagement', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Evening and weekend family events', description: 'Family events scheduled outside work hours with transportation/childcare', category: 'Family Engagement', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Monthly family cafes or forums', description: 'Regular informal gatherings for families to connect and share', category: 'Family Engagement', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Parent representation on school committees', description: 'Meaningful parent voice in decisions on school committees and governance', category: 'Family Engagement', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Transparent communication about school decisions', description: 'Clear explanation of how decisions are made and how families can influence them', category: 'Family Engagement', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Parent leadership development program', description: 'Training to develop parent leaders and advocates for school', category: 'Family Engagement', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Community partnership development', description: 'Intentional outreach to establish partnerships aligned with school goals', category: 'Family Engagement', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Family and community engagement'] },
    { name: 'Community school wraparound services', description: 'On-site services (health, mental health, food, etc.) provided through partnerships', category: 'Family Engagement', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Family and community engagement', 'Student safety and wellness'] },

    // ENGLISH LEARNER STRATEGIES
    { name: 'Intensive English language development program', description: 'Structured English language development instruction for EL students', category: 'English Learners', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['English learner achievement'] },
    { name: 'Sheltered/SDAIE content instruction', description: 'Content instruction with language supports for English learners', category: 'English Learners', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['English learner achievement'] },
    { name: 'EL peer mentoring and buddy systems', description: 'Matching new EL students with proficient English-speaking peers', category: 'English Learners', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['English learner achievement'] },
    { name: 'Long-term EL (LTEL) intensive intervention', description: 'Targeted intensive instruction for EL students not progressing to reclassification', category: 'English Learners', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['English learner achievement'] },
    { name: 'Dual immersion or bilingual programs', description: 'Programs maintaining and developing native language while developing English', category: 'English Learners', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['English learner achievement'] },
    { name: 'EL teacher professional development', description: 'Specialized professional development for teachers of English learners', category: 'English Learners', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['English learner achievement'] },

    // SPECIAL EDUCATION STRATEGIES
    { name: 'Co-teaching partnerships (inclusive model)', description: 'Special ed and general ed teachers collaborating in inclusive classrooms', category: 'Special Education', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Special education outcomes'] },
    { name: 'Universal Design for Learning (UDL) implementation', description: 'Curriculum and instruction designed to be accessible to all learners', category: 'Special Education', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Special education outcomes'] },
    { name: 'Peer support and buddy systems', description: 'General ed students supporting students with IEPs in inclusive settings', category: 'Special Education', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Special education outcomes'] },
    { name: 'Grade-level content access for SPED students', description: 'Ensuring students with IEPs have access to grade-level standards and content', category: 'Special Education', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Special education outcomes'] },

    // COLLEGE/CAREER READINESS STRATEGIES
    { name: 'Expand AP/honors course enrollment', description: 'Increase access to and enrollment in advanced placement courses', category: 'College/Career Readiness', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['College and career readiness'] },
    { name: 'College readiness workshops and seminars', description: 'Instruction on college application, financial aid, and readiness skills', category: 'College/Career Readiness', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['College and career readiness'] },
    { name: 'Career exploration and awareness program', description: 'Career field trips, speaker series, and exploration opportunities', category: 'College/Career Readiness', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['College and career readiness'] },
    { name: 'Work-based learning and internship programs', description: 'Partnerships providing student internships and work experience', category: 'College/Career Readiness', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['College and career readiness'] },
    { name: 'College financial aid night program', description: 'Family event teaching about FAFSA, financial aid, and college affordability', category: 'College/Career Readiness', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['College and career readiness'] },
    { name: 'FAFSA completion support and parties', description: 'Dedicated support and events to increase FAFSA completion rates', category: 'College/Career Readiness', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['College and career readiness'] },
    { name: 'Career and technical education (CTE) pathways', description: 'Work-relevant skills and industry credentials aligned to careers', category: 'College/Career Readiness', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['College and career readiness'] },
    { name: 'One-on-one college advising', description: 'Individual meetings with counselors focused on college planning', category: 'College/Career Readiness', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['College and career readiness'] },

    // INTERVENTION AND SUPPORT STRATEGIES
    { name: 'MTSS/RTI framework implementation', description: 'Multi-tiered system of supports with Tier 1, 2, 3 interventions', category: 'Intervention Systems', evidenceLevel: 'Tier 1 (Strong Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'] },
    { name: 'Early warning intervention system (EWS)', description: 'Data-driven identification of at-risk students with rapid response', category: 'Intervention Systems', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement', 'Chronic absenteeism reduction'] },
    { name: 'Extended learning time / afterschool program', description: 'Additional instructional time after school or during summers', category: 'Intervention Systems', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'] },
    { name: 'Saturday school or extended day programs', description: 'Additional instructional opportunities on Saturdays or extended school days', category: 'Intervention Systems', evidenceLevel: 'Tier 3 (Promising Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'] },
    { name: 'Summer bridge or learning loss programs', description: 'Summer programs to address learning loss and prepare for next level', category: 'Intervention Systems', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'] },
    { name: 'Tier 2/3 student progress monitoring system', description: 'Regular assessment of progress for students in targeted interventions', category: 'Intervention Systems', evidenceLevel: 'Tier 2 (Moderate Evidence)', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'] }
];

// ============================================================================
// 11. LEADING INDICATORS DATABASE (Expanded and organized by goal area)
// ============================================================================

var LEADING_INDICATORS_DB = [
    // ATTENDANCE LEADING INDICATORS
    { name: 'Weekly attendance rate by grade and subgroup', description: 'Percentage of students present daily tracked weekly', frequency: 'Weekly', category: 'Attendance', relatedGoalAreas: ['Chronic absenteeism reduction'], source: 'Student Information System' },
    { name: 'Tardy rate by student and subgroup', description: 'Percentage of students arriving late tracked weekly', frequency: 'Weekly', category: 'Attendance', relatedGoalAreas: ['Chronic absenteeism reduction'], source: 'Student Information System' },
    { name: 'Chronic absence flags and at-risk count', description: 'Count of students at risk of chronic absence based on early warning threshold', frequency: 'Weekly', category: 'Attendance', relatedGoalAreas: ['Chronic absenteeism reduction'], source: 'Early Warning System' },
    { name: 'Attendance intervention participation rate', description: 'Percentage of flagged students enrolled in attendance interventions', frequency: 'Monthly', category: 'Attendance', relatedGoalAreas: ['Chronic absenteeism reduction'], source: 'Intervention Tracking System' },
    { name: 'Absence reason tracking', description: 'Categorized absence reasons (illness, family, transportation, etc.)', frequency: 'Monthly', category: 'Attendance', relatedGoalAreas: ['Chronic absenteeism reduction'], source: 'Student Information System' },

    // ACADEMIC LEADING INDICATORS - READING/ELA
    { name: 'iReady Reading Diagnostic scores', description: 'Monthly diagnostic scores tracking reading growth', frequency: 'Monthly', category: 'Academic - Reading', relatedGoalAreas: ['Reading/ELA proficiency improvement'], source: 'iReady Platform' },
    { name: 'MAP Reading scores', description: 'NWEA Measures of Academic Progress reading benchmarks', frequency: 'Quarterly', category: 'Academic - Reading', relatedGoalAreas: ['Reading/ELA proficiency improvement'], source: 'NWEA MAP' },
    { name: 'Curriculum benchmark reading scores', description: 'Monthly or quarterly reading assessments aligned to curriculum', frequency: 'Monthly', category: 'Academic - Reading', relatedGoalAreas: ['Reading/ELA proficiency improvement'], source: 'Curriculum Assessment System' },
    { name: 'Unit test pass rates (ELA)', description: 'Percentage of students meeting proficiency on unit assessments', frequency: 'Monthly', category: 'Academic - Reading', relatedGoalAreas: ['Reading/ELA proficiency improvement'], source: 'Classroom Assessments' },
    { name: 'Guided reading level progress (K-3)', description: 'Percentage of students progressing to next reading level', frequency: 'Monthly', category: 'Academic - Reading', relatedGoalAreas: ['Reading/ELA proficiency improvement'], source: 'Fountas & Pinnell Benchmark System' },
    { name: 'Phonics/phonemic awareness assessment scores', description: 'Monthly assessments of foundational reading skills (K-2)', frequency: 'Monthly', category: 'Academic - Reading', relatedGoalAreas: ['Reading/ELA proficiency improvement'], source: 'DIBELS or similar' },
    { name: 'Reading fluency progress (oral reading)', description: 'Words correct per minute and fluency measured monthly', frequency: 'Monthly', category: 'Academic - Reading', relatedGoalAreas: ['Reading/ELA proficiency improvement'], source: 'CBM/Fluency Assessments' },

    // ACADEMIC LEADING INDICATORS - MATH
    { name: 'iReady Math Diagnostic scores', description: 'Monthly diagnostic scores tracking math growth', frequency: 'Monthly', category: 'Academic - Math', relatedGoalAreas: ['Mathematics proficiency improvement'], source: 'iReady Platform' },
    { name: 'MAP Math scores', description: 'NWEA Measures of Academic Progress math benchmarks', frequency: 'Quarterly', category: 'Academic - Math', relatedGoalAreas: ['Mathematics proficiency improvement'], source: 'NWEA MAP' },
    { name: 'Curriculum benchmark math scores', description: 'Monthly or quarterly math assessments aligned to curriculum', frequency: 'Monthly', category: 'Academic - Math', relatedGoalAreas: ['Mathematics proficiency improvement'], source: 'Curriculum Assessment System' },
    { name: 'Unit test pass rates (Math)', description: 'Percentage of students meeting proficiency on unit assessments', frequency: 'Monthly', category: 'Academic - Math', relatedGoalAreas: ['Mathematics proficiency improvement'], source: 'Classroom Assessments' },
    { name: 'Number sense and fact fluency assessments', description: 'Timed assessments of basic facts and number sense (K-3)', frequency: 'Monthly', category: 'Academic - Math', relatedGoalAreas: ['Mathematics proficiency improvement'], source: 'Math Fact Fluency Assessments' },
    { name: 'Math intervention progress monitoring', description: 'Regular progress monitoring for students in math intervention tiers', frequency: 'Bi-weekly', category: 'Academic - Math', relatedGoalAreas: ['Mathematics proficiency improvement'], source: 'Intervention Progress Monitoring' },

    // BEHAVIOR AND CLIMATE LEADING INDICATORS
    { name: 'Office discipline referrals (ODRs) trends', description: 'Weekly count of discipline referrals by student and infraction type', frequency: 'Weekly', category: 'Behavior/Climate', relatedGoalAreas: ['School climate and culture improvement', 'Social-emotional learning implementation'], source: 'Discipline Management System' },
    { name: 'PBIS positive reinforcement events', description: 'Count of positive acknowledgments given to students', frequency: 'Weekly', category: 'Behavior/Climate', relatedGoalAreas: ['School climate and culture improvement'], source: 'PBIS Tracking System' },
    { name: 'Student behavior incident tracking by location', description: 'Incidents tracked by location to identify patterns', frequency: 'Weekly', category: 'Behavior/Climate', relatedGoalAreas: ['School climate and culture improvement'], source: 'Incident Tracking System' },
    { name: 'SEL competency assessments', description: 'Student self-assessments of social-emotional competencies', frequency: 'Monthly', category: 'Behavior/Climate', relatedGoalAreas: ['Social-emotional learning implementation'], source: 'SEL Assessment Tool' },
    { name: 'Classroom walkthrough instructional quality scores', description: 'Scores from regular teacher walkthroughs on instructional practices', frequency: 'Monthly', category: 'Teacher Effectiveness', relatedGoalAreas: ['Teacher effectiveness and development'], source: 'Walkthrough Tool' },

    // TEACHER EFFECTIVENESS LEADING INDICATORS
    { name: 'Teacher PLC meeting frequency and quality', description: 'Number and quality of professional learning community meetings', frequency: 'Monthly', category: 'Teacher Effectiveness', relatedGoalAreas: ['Teacher effectiveness and development'], source: 'PLC Meeting Logs' },
    { name: 'Professional development participation and feedback', description: 'Attendance and satisfaction surveys from PD sessions', frequency: 'Ongoing', category: 'Teacher Effectiveness', relatedGoalAreas: ['Teacher effectiveness and development'], source: 'PD Registration and Surveys' },
    { name: 'Coaching cycle completion', description: 'Number of teachers completing instructional coaching cycles', frequency: 'Monthly', category: 'Teacher Effectiveness', relatedGoalAreas: ['Teacher effectiveness and development'], source: 'Coaching Logs' },
    { name: 'Data team meeting participation', description: 'Regular meetings where teams analyze data and plan improvements', frequency: 'Monthly', category: 'Teacher Effectiveness', relatedGoalAreas: ['Teacher effectiveness and development'], source: 'Meeting Logs' },

    // FAMILY ENGAGEMENT LEADING INDICATORS
    { name: 'Family engagement event attendance', description: 'Participation rates at school-sponsored family events', frequency: 'Each event', category: 'Family Engagement', relatedGoalAreas: ['Family and community engagement'], source: 'Event Sign-in Sheets' },
    { name: 'Parent communication response rates', description: 'Percentage of families responding to school communications', frequency: 'Monthly', category: 'Family Engagement', relatedGoalAreas: ['Family and community engagement'], source: 'Communication Log' },
    { name: 'Parent volunteering hours', description: 'Total volunteer hours contributed by families', frequency: 'Monthly', category: 'Family Engagement', relatedGoalAreas: ['Family and community engagement'], source: 'Volunteer Tracking' },
    { name: 'Home visit completion rate', description: 'Percentage of targeted families receiving home visits', frequency: 'Monthly', category: 'Family Engagement', relatedGoalAreas: ['Family and community engagement'], source: 'Home Visit Logs' },

    // INTERVENTION AND SUPPORT INDICATORS
    { name: 'Tier 2/3 student identification and enrollment', description: 'Count of students identified for Tier 2 and 3 interventions', frequency: 'Monthly', category: 'Intervention', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'], source: 'Intervention Tracking System' },
    { name: 'Tier 2/3 student progress monitoring data', description: 'Progress of students in intervention tiers toward goals', frequency: 'Bi-weekly', category: 'Intervention', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'], source: 'Progress Monitoring Data' },
    { name: 'Intervention participation rate', description: 'Percentage of identified students actively participating in interventions', frequency: 'Monthly', category: 'Intervention', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'], source: 'Intervention Tracking System' },
    { name: 'Program lesson usage and minutes', description: 'Tracking usage of intervention programs and time-on-task', frequency: 'Weekly', category: 'Intervention', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'], source: 'Program Analytics' },

    // EL LEADING INDICATORS
    { name: 'EL oral language development scores', description: 'Monthly assessment of English oral language proficiency', frequency: 'Monthly', category: 'English Learners', relatedGoalAreas: ['English learner achievement'], source: 'ORAL or similar assessment' },
    { name: 'EL progress toward reclassification', description: 'Percentage of EL students making progress on reclassification criteria', frequency: 'Monthly', category: 'English Learners', relatedGoalAreas: ['English learner achievement'], source: 'EL Assessment System' },
    { name: 'WIDA ACCESS interim scores', description: 'WIDA interim growth scores tracking English language development', frequency: 'Quarterly', category: 'English Learners', relatedGoalAreas: ['English learner achievement'], source: 'WIDA Platform' },

    // SPECIAL EDUCATION LEADING INDICATORS
    { name: 'IEP goal progress monitoring', description: 'Tracking progress on IEP goals for students with disabilities', frequency: 'Monthly', category: 'Special Education', relatedGoalAreas: ['Special education outcomes'], source: 'IEP Progress Monitoring System' },
    { name: 'Special education student academic benchmark scores', description: 'Benchmark and unit assessment scores for SPED students', frequency: 'Monthly', category: 'Special Education', relatedGoalAreas: ['Special education outcomes'], source: 'Assessment Systems' },
    { name: 'Inclusive classroom placement rate', description: 'Percentage of time students with IEPs spend in general education settings', frequency: 'Monthly', category: 'Special Education', relatedGoalAreas: ['Special education outcomes'], source: 'Scheduling System' },

    // CREDIT AND GRADUATION LEADING INDICATORS
    { name: 'Credit attainment by grade level', description: 'Percentage of students earning credits on pace for graduation', frequency: 'Monthly', category: 'Graduation', relatedGoalAreas: ['College and career readiness'], source: 'Transcript System' },
    { name: 'Progress grades and GPA trends', description: 'Grade trends to identify students at risk of failure', frequency: 'Every grading period', category: 'Graduation', relatedGoalAreas: ['College and career readiness'], source: 'Gradebook' },
    { name: 'MTSS Tier Movement (retention/promotion)', description: 'Students moving between MTSS tiers based on progress', frequency: 'Monthly', category: 'Intervention', relatedGoalAreas: ['Reading/ELA proficiency improvement', 'Mathematics proficiency improvement'], source: 'MTSS Tracking System' }
];

// ============================================================================
// 12. LAGGING INDICATORS DATABASE (Expanded with Nevada/federal measures)
// ============================================================================

var LAGGING_MEASURES_DB = [
    // STATE ASSESSMENT LAGGING INDICATORS
    { name: 'ELA proficiency rate (NAA)', description: 'Nevada Academic Achievement test proficiency percentage in ELA', source: 'Nevada Department of Education / State Assessment', category: 'Academic', relatedGoalAreas: ['Reading/ELA proficiency improvement'] },
    { name: 'Math proficiency rate (NAA)', description: 'Nevada Academic Achievement test proficiency percentage in Math', source: 'Nevada Department of Education / State Assessment', category: 'Academic', relatedGoalAreas: ['Mathematics proficiency improvement'] },
    { name: 'Science proficiency rate', description: 'State science assessment proficiency percentage', source: 'Nevada Department of Education / State Assessment', category: 'Academic', relatedGoalAreas: [] },
    { name: 'ELA proficiency by subgroup (gap)', description: 'Proficiency rates disaggregated by race, income, EL status', source: 'Nevada Department of Education', category: 'Academic', relatedGoalAreas: ['Closing achievement/opportunity gaps'] },
    { name: 'Math proficiency by subgroup (gap)', description: 'Math proficiency rates disaggregated by race, income, EL status', source: 'Nevada Department of Education', category: 'Academic', relatedGoalAreas: ['Closing achievement/opportunity gaps'] },

    // ATTENDANCE LAGGING INDICATORS
    { name: 'Chronic absenteeism rate (end of year)', description: 'Percentage of students absent 10% or more of school days', source: 'Student Information System / State Reporting', category: 'Attendance', relatedGoalAreas: ['Chronic absenteeism reduction'] },
    { name: 'Average Daily Attendance (ADA)', description: 'End-of-year average daily attendance percentage', source: 'Student Information System', category: 'Attendance', relatedGoalAreas: ['Chronic absenteeism reduction'] },

    // GRADUATION AND COMPLETION INDICATORS
    { name: 'Graduation rate (4-year cohort)', description: '4-year graduation rate reported to state', source: 'Nevada Department of Education / State Reporting', category: 'Graduation', relatedGoalAreas: ['College and career readiness'] },
    { name: 'Graduation rate by subgroup', description: 'Graduation rates disaggregated by race, income, EL, SPED', source: 'State Reporting', category: 'Graduation', relatedGoalAreas: ['Closing achievement/opportunity gaps'] },

    // DISCIPLINE AND CLIMATE LAGGING INDICATORS
    { name: 'Out-of-school suspension rate', description: 'Percentage of students with at least one out-of-school suspension', source: 'Discipline System / State Reporting', category: 'Climate', relatedGoalAreas: ['School climate and culture improvement'] },
    { name: 'Out-of-school suspension rate by subgroup', description: 'Suspension rates disaggregated by race and demographics', source: 'Discipline System', category: 'Climate', relatedGoalAreas: ['Closing achievement/opportunity gaps', 'School climate and culture improvement'] },
    { name: 'Annual school climate survey results', description: 'Overall climate survey scores from students, teachers, families', source: 'Survey Platform', category: 'Climate', relatedGoalAreas: ['School climate and culture improvement'] },
    { name: 'School climate survey by subgroup', description: 'Climate survey results disaggregated by student groups', source: 'Survey Platform', category: 'Climate', relatedGoalAreas: ['School climate and culture improvement'] },

    // TEACHER INDICATORS
    { name: 'Teacher retention rate', description: 'Percentage of teachers returning the following school year', source: 'HR System', category: 'Teacher', relatedGoalAreas: ['Teacher effectiveness and development'] },
    { name: 'Classroom walkthrough performance rating', description: 'Aggregate instructional quality rating from walkthroughs', source: 'Walkthrough System', category: 'Teacher', relatedGoalAreas: ['Teacher effectiveness and development'] },

    // ENGLISH LEARNER LAGGING INDICATORS
    { name: 'EL reclassification rate', description: 'Percentage of EL students meeting reclassification criteria annually', source: 'EL System / State Reporting', category: 'EL', relatedGoalAreas: ['English learner achievement'] },
    { name: 'WIDA ACCESS growth year-over-year', description: 'Growth in WIDA ACCESS scores from year to year', source: 'WIDA Platform / State Reporting', category: 'EL', relatedGoalAreas: ['English learner achievement'] },
    { name: 'EL academic proficiency rate', description: 'Percentage of EL students meeting academic standards', source: 'State Assessment', category: 'EL', relatedGoalAreas: ['English learner achievement'] },

    // SPECIAL EDUCATION LAGGING INDICATORS
    { name: 'IEP goal attainment rate', description: 'Percentage of IEP goals met annually', source: 'IEP System', category: 'SPED', relatedGoalAreas: ['Special education outcomes'] },
    { name: 'SPED proficiency rate', description: 'Percentage of students with IEPs meeting state academic standards', source: 'State Assessment', category: 'SPED', relatedGoalAreas: ['Special education outcomes'] },
    { name: 'Least Restrictive Environment (LRE) placement rate', description: 'Percentage of time SPED students spend in general education', source: 'IEP System / State Reporting', category: 'SPED', relatedGoalAreas: ['Special education outcomes'] },
    { name: 'SPED graduation rate', description: 'Graduation rate for students with IEPs', source: 'State Reporting', category: 'SPED', relatedGoalAreas: ['Special education outcomes'] },

    // COLLEGE/CAREER READINESS LAGGING INDICATORS
    { name: 'College and Career readiness performance', description: 'Percentage of students deemed college/career ready by state measures', source: 'State Reporting / Transcript Analysis', category: 'CCR', relatedGoalAreas: ['College and career readiness'] },
    { name: 'SAT/ACT participation and scores', description: 'Percentage taking tests and average scores', source: 'College Board / ACT', category: 'CCR', relatedGoalAreas: ['College and career readiness'] },
    { name: 'College acceptance rate', description: 'Percentage of graduates accepted to 4-year and 2-year institutions', source: 'College Acceptance Tracking', category: 'CCR', relatedGoalAreas: ['College and career readiness'] },
    { name: 'College enrollment rate', description: 'Percentage of graduates enrolling in post-secondary (1st fall)', source: 'Post-Secondary Enrollment Tracking', category: 'CCR', relatedGoalAreas: ['College and career readiness'] },
    { name: 'College persistence rate', description: 'Percentage of graduates persisting in college year 2', source: 'NSC Data / State Data', category: 'CCR', relatedGoalAreas: ['College and career readiness'] },
    { name: 'CTE program completion rate', description: 'Percentage of students completing CTE pathway', source: 'Transcript System', category: 'CCR', relatedGoalAreas: ['College and career readiness'] }
];

// ============================================================================
// 13. STAKEHOLDER THEMES DATABASE (15+ authentic themes)
// ============================================================================

var STAKEHOLDER_THEMES_DB = [
    'Teachers do not have sufficient time/resources to implement new initiatives',
    'Staff unclear about how their role supports the school goal',
    'Competing or conflicting priorities make focus difficult',
    'Limited buy-in or resistance to change from some staff members',
    'Students need more social-emotional and mental health support',
    'Families want better and more frequent communication',
    'Parents request more involvement in school decisions',
    'Community wants expanded afterschool and enrichment programs',
    'Students want more diverse course offerings and electives',
    'Staff needs stronger professional development on equity and cultural responsiveness',
    'Families want improved school safety measures',
    'Community partners want better coordination with school',
    'Students report needing more college/career guidance',
    'Insufficient funding to implement all needed strategies',
    'Accountability pressures limiting flexibility and innovation',
    'Technology gaps (devices, connectivity) affecting student learning',
    'Family economic barriers limiting participation and engagement',
    'Transportation barriers affecting attendance and engagement'
];

// ============================================================================
// 14. FUNDING SOURCES DATABASE (12 options)
// ============================================================================

var FUNDING_SOURCES_DB = [
    { name: 'Title I, Part A', type: 'Federal', description: 'Improving academic achievement of disadvantaged students' },
    { name: 'Title II, Part A', type: 'Federal', description: 'Teacher and principal quality and professional development' },
    { name: 'Title III', type: 'Federal', description: 'English learner programs and support' },
    { name: 'Title IV, Part A', type: 'Federal', description: 'Student support and academic enrichment' },
    { name: 'IDEA (Special Education)', type: 'Federal', description: 'Students with disabilities' },
    { name: 'State Per-Pupil Funding', type: 'State', description: 'Base allocation per student' },
    { name: 'State Weighted Funding', type: 'State', description: 'At-risk, EL, SPED weighted factors' },
    { name: 'Local Levy / Bond', type: 'Local', description: 'Local tax revenue' },
    { name: 'ESSER / ARP Funds', type: 'Federal', description: 'COVID recovery and learning loss' },
    { name: '21st Century Community Learning', type: 'Federal', description: 'Afterschool and enrichment' },
    { name: 'Private Grants / Foundation', type: 'Grant', description: 'Competitive grant funding' },
    { name: 'PTA/PTO Fundraising', type: 'Local', description: 'Parent organization contributions' }
];

// ============================================================================
// 15. CULTURE COMMITMENTS DATABASE (10 options)
// ============================================================================

var CULTURE_COMMITMENTS_DB = [
    'Every adult greets every student by name every day',
    'We celebrate growth, not just achievement',
    'We use restorative conversations before punitive consequences',
    'Our classrooms reflect the diversity of our community',
    'We make decisions through a lens of equity',
    'We communicate with families in their home language',
    'We invest in relationships before we invest in rules',
    'Student voice drives school improvement decisions',
    'We practice radical transparency with our data',
    'Every student has at least one trusted adult in the building'
];

// ============================================================================
// 16. GUIDANCE CONTENT (Tips and resources for each step)
// ============================================================================

var GUIDANCE_CONTENT = {
    1: {
        title: 'District Connection',
        tips: [
            'Select the district that operates your school',
            'This helps provide context and benchmarks for planning',
            'If your district is not listed, you can create a custom entry'
        ],
        resources: []
    },
    2: {
        title: 'School Profile',
        tips: [
            'Be as accurate as possible with enrollment and demographic data',
            'Use your most recent student information system data',
            'These profiles help calculate weighted funding allocations',
            'Round percentages to nearest whole number'
        ],
        resources: [
            'School Information Portal',
            'DataQuest (if in California)',
            'Nevada Department of Education'
        ]
    },
    3: {
        title: 'Data Analysis',
        tips: [
            'Use at least 2-3 data sources for credibility',
            'Include both quantitative (test scores) and qualitative (surveys) data',
            'Involve staff in data discussions to build ownership',
            'Look for patterns across multiple years',
            'Disaggregate data by student subgroups (race, income, EL, SPED)'
        ],
        resources: [
            'State Assessment Data Portals',
            'School Climate Surveys',
            'Attendance Data',
            'Discipline Records'
        ]
    },
    4: {
        title: 'Vision & Mission',
        tips: [
            'Vision should describe your ideal future state (2-3 years)',
            'Mission describes what you do daily to achieve the vision',
            'Involve students and families in crafting these statements',
            'Keep them concise (1-2 sentences each)',
            'Make them aspirational but achievable'
        ],
        resources: [
            'Vision/Mission Workshop Facilitation Guide',
            'Community Engagement Templates',
            'Sample Visions and Missions from High-Performing Schools'
        ]
    },
    5: {
        title: 'Values & Culture',
        tips: [
            'Select 3-5 core values that truly reflect your school',
            'Make sure values are lived, not just posted',
            'Culture commitments should be specific, observable behaviors',
            'Revisit and reinforce culture monthly',
            'Make sure values and commitments are anti-racist and inclusive'
        ],
        resources: [
            'Values Definition Framework',
            'Culture Building Toolkit',
            'Anti-Racism in Schools Resources'
        ]
    },
    6: {
        title: 'SMART Goals',
        tips: [
            'Focus on changing ADULT behaviors, not blaming students',
            'Each goal should have 3-4 aligned action strategies',
            'Set targets that are ambitious but achievable',
            'Goals should address root causes, not just symptoms',
            'Engage teachers in setting targets (builds accountability)',
            'Consider who can influence each outcome',
            'Break large goals into component pieces',
            'Include both academic and non-academic goals'
        ],
        guidance: {
            smartComponents: 'Specific (clear who/what), Measurable (quantified), Achievable (realistic with effort), Relevant (aligned to school needs), Time-bound (clear deadline)',
            exampleGood: 'By June 2027, increase ELA proficiency from 62% to 75% by implementing structured literacy in 100% of primary classrooms.',
            exampleBad: 'Improve reading skills' ,
            rootCauseConnection: 'Each goal must link to specific root causes identified in Step 3',
            targetSetting: 'Consult state benchmarks, district expectations, and peer school data when setting targets',
            whoToEngage: 'Teachers, instructional coaches, special educators, EL specialists, families'
        },
        resources: [
            'SMART Goal Writing Guide',
            'Root Cause Analysis Template',
            'Goal Setting Webinar',
            'Examples from State-Improving Schools'
        ]
    },
    7: {
        title: 'Action Strategies',
        tips: [
            'Select 3-4 evidence-based strategies per goal',
            'Prioritize Tier 1 and Tier 2 evidence-based practices',
            'Make sure strategies address the identified root causes',
            'Consider staff capacity and training needs',
            'Include professional development required for implementation',
            'Budget implications matter - align to funding sources',
            'Don\'t try to do too many things at once'
        ],
        resources: [
            'ESSA Evidence Clearinghouse',
            'What Works Clearinghouse',
            'Johns Hopkins Handbook of Effective Education Practices'
        ]
    },
    8: {
        title: 'Stakeholder Engagement',
        tips: [
            'Identify who needs to be engaged for success',
            'Listen to concerns and barriers',
            'Address competing priorities explicitly',
            'Create structures for ongoing two-way communication',
            'Celebrate early wins and progress',
            'Build leadership capacity among staff and families',
            'Don\'t skip the engagement piece - it\'s critical to success'
        ],
        resources: [
            'Stakeholder Engagement Toolkit',
            'Feedback Loop Templates',
            'Building Leadership Capacity Guide'
        ]
    },
    9: {
        title: 'Budget & Resources',
        tips: [
            'Align spending to your highest priority goals',
            'Consider both direct costs (programs, materials) and indirect (staff time, PD)',
            'Build in sustainability - don\'t just spend one-time money',
            'Review budget quarterly and adjust as needed',
            'Make sure Title I dollars are being used effectively',
            'Track spending and outcomes together'
        ],
        resources: [
            'Budget Alignment Worksheet',
            'Funding Source Matching Tool',
            'Cost-Benefit Analysis Template'
        ]
    },
    10: {
        title: 'Implementation Timeline',
        tips: [
            'Build in ramp-up time for new initiatives',
            'Start with staff willing to try something new (early adopters)',
            'Plan for professional development before implementation',
            'Schedule regular check-ins and adjustments',
            'Celebrate milestones and quick wins',
            'Don\'t try to implement everything at once'
        ],
        resources: [
            'Implementation Timeline Template',
            'Change Management Framework',
            'Fidelity Checklist Examples'
        ]
    },
    11: {
        title: 'Data Monitoring',
        tips: [
            'Use leading indicators to monitor progress monthly',
            'Look at both achievement data AND implementation data',
            'Disaggregate by subgroup to check for equity',
            'Make data visible (dashboards, displays)',
            'Use data to make mid-course corrections',
            'Celebrate progress, analyze setbacks',
            'Connect leading indicators to lagging outcomes'
        ],
        resources: [
            'Data Dashboard Examples',
            'Leading/Lagging Indicator Guide',
            'Data Interpretation Toolkit'
        ]
    },
    12: {
        title: 'Plan Adoption & Communication',
        tips: [
            'Get formal approval from leadership and governance',
            'Share plan with entire school community',
            'Create a one-page summary for quick reference',
            'Post goals and commitments visibly throughout school',
            'Reference plan regularly in meetings and decisions',
            'Make this a living document - revisit and adjust as needed',
            'Celebrate adoption and build momentum'
        ],
        resources: [
            'Plan Summary Template',
            'Communication Toolkit',
            'School Community Presentation Slides'
        ]
    }
};

// ============================================================================
// 17. COMMITTEE ROLES (Common roles on planning committee)
// ============================================================================

var COMMITTEE_ROLES = [
    'Principal',
    'Assistant Principal',
    'Teacher (Elementary)',
    'Teacher (Secondary)',
    'Counselor/Social Worker',
    'Parent/Family Member',
    'Student (High School)',
    'Community Member',
    'District Representative',
    'Special Education Coordinator',
    'Title I Coordinator',
    'EL Coordinator',
    'School Board Member',
    'Business Partner',
    'Union Representative',
    'Other'
];

// ============================================================================
// 18. SMART GOAL COMPONENTS (Detailed guidance on SMART elements)
// ============================================================================

var SMART_GOAL_COMPONENTS = {
    S: {
        label: 'Specific',
        description: 'Clearly identify WHO will achieve WHAT and under what conditions. Avoid vague language.',
        example: 'Implement structured literacy in 100% of primary classrooms' ,
        badExample: 'Improve reading'
    },
    M: {
        label: 'Measurable',
        description: 'Include a quantifiable metric with a specific target number. You must be able to measure progress.',
        example: 'Increase ELA proficiency from 62% to 75%',
        badExample: 'Students will read better'
    },
    A: {
        label: 'Achievable',
        description: 'Set targets that are challenging but realistic with concerted effort. Consult benchmarks from similar schools.',
        example: 'Increase by 13 percentage points (industry standard is 10-15% annually)',
        badExample: 'Increase from 62% to 95% in one year'
    },
    R: {
        label: 'Relevant',
        description: 'The goal directly addresses identified needs and root causes from your data analysis. It aligns to school priorities.',
        example: 'ELA proficiency is a priority area; low structured literacy is a root cause',
        badExample: 'Setting a goal on a topic that isn\'t in your data'
    },
    T: {
        label: 'Time-bound',
        description: 'Include a specific end date. Usually 1-3 years depending on magnitude of change.',
        example: 'By June 2027',
        badExample: 'Sometime this year'
    }
};

// ============================================================================
// ESSE TIERS AND DATA SOURCES (For reference throughout)
// ============================================================================

var ESSA_TIERS = ['Tier 1 (Strongest Evidence)', 'Tier 2 (Strong Evidence)', 'Tier 3 (Moderate Evidence)', 'Tier 4 (Promising Evidence)'];

var DATA_SOURCES = [
    'State Assessment Data', 'School Climate Survey', 'Teacher/Staff Input', 'Student Data',
    'Parent Feedback', 'Attendance Records', 'Discipline Data', 'College/Career Readiness Data',
    'Classroom Observations', 'Other'
];

// ============================================================================
// 19. NAMED PROGRAMS DATABASE (26 real programs used in school improvement plans)
// ============================================================================

var NAMED_PROGRAMS_DB = [
  { key: 'iready', name: 'iReady', description: 'Adaptive diagnostic and instructional platform for reading and math. Includes Personalized Path lessons, diagnostic assessments, and teacher-facing data dashboards.', goalAreas: ['student_success'], essaTier: 3, frequency: 84 },
  { key: 'plcs', name: 'Professional Learning Communities (PLCs)', description: 'Structured collaborative teams of educators who meet regularly to analyze student data, discuss instructional practices, and develop common assessments.', goalAreas: ['adult_learning_culture', 'student_success'], essaTier: 2, frequency: 98 },
  { key: 'teacher_clarity', name: 'Teacher Clarity / Teacher Clarity Playbook', description: 'Framework for making learning intentions and success criteria explicit. Includes the Teacher Clarity Playbook with protocols for lesson planning, formative assessment, and student-facing clarity.', goalAreas: ['adult_learning_culture', 'student_success'], essaTier: 2, frequency: 43 },
  { key: 'pbis', name: 'PBIS (Positive Behavioral Interventions and Supports)', description: 'Multi-tiered framework for establishing social culture and behavioral supports. Includes school-wide expectations, recognition systems, and tiered intervention.', goalAreas: ['connectedness', 'student_success'], essaTier: 1, frequency: 32 },
  { key: 'mtss', name: 'MTSS (Multi-Tiered Systems of Support)', description: 'Framework for providing tiered levels of support (Tier 1, 2, 3) to students based on need. Includes universal screening, progress monitoring, and data-based decision making.', goalAreas: ['student_success'], essaTier: 2, frequency: 31 },
  { key: 'second_step', name: 'Second Step', description: 'Evidence-based SEL curriculum teaching empathy, emotion management, problem-solving, and relationship skills. Includes grade-banded lessons and family engagement components.', goalAreas: ['connectedness'], essaTier: 1, frequency: 20 },
  { key: 'sel_curriculum', name: 'SEL Curriculum (General)', description: 'Social-emotional learning programs and curricula focused on self-awareness, self-management, social awareness, relationship skills, and responsible decision-making.', goalAreas: ['connectedness'], essaTier: 2, frequency: 25 },
  { key: 'pthv', name: 'Parent Teacher Home Visits (PTHV)', description: 'Structured program where educators make voluntary, relationship-building home visits to families. Focuses on building trust and understanding family strengths.', goalAreas: ['connectedness'], essaTier: 2, frequency: 18 },
  { key: 'ellevation', name: 'ELLevation', description: 'Platform for managing and supporting English Learners. Includes strategies, progress monitoring, reclassification tracking, and instructional resources for EL support.', goalAreas: ['student_success'], essaTier: 3, frequency: 15 },
  { key: 'letrs', name: 'LETRS (Language Essentials for Teachers of Reading and Spelling)', description: 'Professional development program grounded in the science of reading. Trains teachers in phonological awareness, phonics, fluency, vocabulary, and comprehension.', goalAreas: ['adult_learning_culture', 'student_success'], essaTier: 2, frequency: 12 },
  { key: 'glad', name: 'GLAD (Guided Language Acquisition Design)', description: 'Instructional model for academic language and literacy development, particularly effective for English Learners. Uses strategies like pictorial input, cognitive content dictionary, and expert groups.', goalAreas: ['student_success'], essaTier: 3, frequency: 10 },
  { key: 'solution_tree', name: 'Solution Tree', description: 'Professional development and consulting organization specializing in PLCs, RTI, and school improvement. Provides training, coaching, and resources for collaborative teams.', goalAreas: ['adult_learning_culture'], essaTier: 3, frequency: 8 },
  { key: 'tntp', name: 'TNTP (The New Teacher Project)', description: 'Organization providing teacher training, leadership development, and school improvement consulting. Known for Insight instructional framework and teacher effectiveness research.', goalAreas: ['adult_learning_culture'], essaTier: 3, frequency: 5 },
  { key: 'bst', name: 'BST (Behavioral Skills Training)', description: 'Evidence-based approach to teaching new skills through instruction, modeling, rehearsal, and feedback. Used for both student behavior and staff professional development.', goalAreas: ['adult_learning_culture', 'connectedness'], essaTier: 2, frequency: 6 },
  { key: 'parent_university', name: 'Parent University', description: 'District-organized educational workshops and resources for families. Topics include supporting learning at home, navigating school systems, college readiness, and digital literacy.', goalAreas: ['connectedness'], essaTier: 4, frequency: 10 },
  { key: 'restorative_practices', name: 'Restorative Practices', description: 'Approach to discipline that focuses on repairing harm and restoring relationships rather than punishment. Includes restorative circles, peer mediation, and community conferences.', goalAreas: ['connectedness'], essaTier: 2, frequency: 15 },
  { key: 'gomath', name: 'GoMath', description: 'Standards-aligned K-8 math curriculum with digital and print resources. Includes differentiated instruction, intervention materials, and formative assessment tools.', goalAreas: ['student_success'], essaTier: 3, frequency: 8 },
  { key: 'envision_math', name: 'enVision Mathematics', description: 'K-8 math curriculum focusing on conceptual understanding and problem-solving. Includes visual learning, interactive tools, and personalized learning paths.', goalAreas: ['student_success'], essaTier: 2, frequency: 6 },
  { key: 'eureka_math', name: 'Eureka Math / EngageNY', description: 'Comprehensive K-12 math curriculum emphasizing coherence and rigor. Includes detailed lesson plans, problem sets, and exit tickets.', goalAreas: ['student_success'], essaTier: 2, frequency: 5 },
  { key: 'wonders', name: 'Wonders (McGraw-Hill)', description: 'Core ELA curriculum with integrated reading, writing, and grammar instruction. Includes leveled readers, digital resources, and EL support.', goalAreas: ['student_success'], essaTier: 3, frequency: 7 },
  { key: 'amplify', name: 'Amplify', description: 'K-12 curriculum and assessment programs including Amplify ELA, Amplify Science (NGSS-aligned), and mCLASS/DIBELS reading assessment tools.', goalAreas: ['student_success'], essaTier: 2, frequency: 5 },
  { key: 'achieve3000', name: 'Achieve3000 / Actively Learn', description: 'Adaptive literacy platform providing differentiated nonfiction content at each student\'s reading level. Includes Lexile-based assessment and progress monitoring.', goalAreas: ['student_success'], essaTier: 2, frequency: 4 },
  { key: 'kagan', name: 'Kagan Cooperative Learning', description: 'Structured cooperative learning strategies (think-pair-share, round robin, rally coach) designed to increase engagement and academic achievement through peer interaction.', goalAreas: ['student_success', 'adult_learning_culture'], essaTier: 2, frequency: 6 },
  { key: 'avid', name: 'AVID (Advancement Via Individual Determination)', description: 'College readiness system using WICOR strategies (Writing, Inquiry, Collaboration, Organization, Reading). Targets students in the academic middle with rigorous support.', goalAreas: ['student_success'], essaTier: 2, frequency: 8 },
  { key: 'high_dosage_tutoring', name: 'High-Dosage Tutoring', description: 'Intensive, frequent (3+ times per week) tutoring in small groups. Research shows significant impact on math and reading achievement, particularly for historically underserved students.', goalAreas: ['student_success'], essaTier: 1, frequency: 12 },
  { key: 'wrap_around_services', name: 'Wrap-Around Services', description: 'Comprehensive support services addressing non-academic barriers to learning. Includes mental health counseling, food/clothing assistance, housing support, and community resource referrals.', goalAreas: ['connectedness'], essaTier: 3, frequency: 10 }
];

// ============================================================================
// 20. GOAL AREAS DATABASE (Standard goal areas for school plans)
// ============================================================================

var GOAL_AREAS_DB = [
  { key: 'student_success', name: 'Student Success', description: 'Goals focused on academic achievement, proficiency, and student learning outcomes.', isDefault: true },
  { key: 'adult_learning_culture', name: 'Adult Learning Culture', description: 'Goals focused on professional learning, collaborative practices, teacher development, and instructional improvement.', isDefault: true },
  { key: 'connectedness', name: 'Connectedness', description: 'Goals focused on school climate, family engagement, student well-being, attendance, and community partnerships.', isDefault: true },
  { key: 'instructional_practices', name: 'Instructional Practices and Supports', description: 'Goals focused on instructional quality, curriculum alignment, and academic program access.', isDefault: false },
  { key: 'stakeholder_engagement', name: 'Stakeholder Engagement', description: 'Goals focused on meaningful engagement of families, community members, and partners in school improvement.', isDefault: false },
  { key: 'equity_access', name: 'Equity and Access', description: 'Goals focused on closing opportunity and achievement gaps, ensuring equitable resource distribution, and culturally responsive practices.', isDefault: false },
  { key: 'college_career', name: 'College and Career Readiness', description: 'Goals focused on graduation rates, post-secondary preparation, CTE pathways, and advanced coursework access.', isDefault: false },
  { key: 'safety_climate', name: 'Safety and Climate', description: 'Goals focused on physical and emotional safety, positive school culture, behavior systems, and mental health supports.', isDefault: false }
];

// ============================================================================
// 21. ESSA EVIDENCE TIERS (Evidence-based practice framework)
// ============================================================================

var ESSA_EVIDENCE_TIERS = [
  { tier: 1, label: 'Strong Evidence', shortLabel: 'ESSA Tier 1', color: '#6ECF6E', description: 'At least one well-designed and well-implemented randomized controlled trial.' },
  { tier: 2, label: 'Moderate Evidence', shortLabel: 'ESSA Tier 2', color: '#00B4CC', description: 'At least one well-designed quasi-experimental study.' },
  { tier: 3, label: 'Promising Evidence', shortLabel: 'ESSA Tier 3', color: '#D4A537', description: 'At least one correlational study with statistical controls.' },
  { tier: 4, label: 'Demonstrates Rationale', shortLabel: 'ESSA Tier 4', color: '#E07A5F', description: 'Well-defined logic model informed by research or evaluation.' }
];

// ============================================================================
// 22. IMPROVEMENT STRATEGY THEMES DATABASE (38 coded themes from content analysis)
// ============================================================================

var IMPROVEMENT_STRATEGY_THEMES_DB = [
  { key: 'standards_curriculum', name: 'Standards-Based Curriculum', description: 'Using pre-determined standards to plan and deliver instruction.', goalAreas: ['student_success'] },
  { key: 'bst', name: 'Behavioral Skills Training', description: 'Teaching new skills through instruction, modeling, rehearsal, and feedback.', goalAreas: ['adult_learning_culture'] },
  { key: 'data_review', name: 'Data Review', description: 'Reviewing data to inform action, planning, instruction, and decision-making.', goalAreas: ['student_success', 'adult_learning_culture', 'connectedness'] },
  { key: 'data_tracking', name: 'Data Tracking', description: 'Changes to improve data tracking processes and systems.', goalAreas: ['student_success', 'adult_learning_culture'] },
  { key: 'el_support', name: 'English Learner Support', description: 'Strategies aimed at improving instruction for English Learners.', goalAreas: ['student_success'] },
  { key: 'ela_support', name: 'ELA Support', description: 'Strategies to improve English Language Arts instruction.', goalAreas: ['student_success'] },
  { key: 'ellevation', name: 'ELLevation Platform', description: 'Using ELLevation for English learner instructional services.', goalAreas: ['student_success'] },
  { key: 'family_communication', name: 'Family Communication', description: 'Specific communication strategies to involve families (newsletters, apps, calls, translation).', goalAreas: ['connectedness'] },
  { key: 'family_education', name: 'Family Education', description: 'Educating families or providing resources aimed at informing parents.', goalAreas: ['connectedness'] },
  { key: 'family_engagement', name: 'Family Engagement', description: 'General engagement of families as part of improvement strategies.', goalAreas: ['connectedness'] },
  { key: 'family_events', name: 'Family Engagement Events', description: 'Planned events directed at engaging families (volunteer days, literacy nights, cultural events).', goalAreas: ['connectedness'] },
  { key: 'glad', name: 'GLAD Strategies', description: 'Guided Language Acquisition Design for academic language development.', goalAreas: ['student_success'] },
  { key: 'home_visits', name: 'Home Visits', description: 'Home visit programs for families of students.', goalAreas: ['connectedness'] },
  { key: 'incentives', name: 'Incentives', description: 'Incentivizing improvement at student, classroom, or school level.', goalAreas: ['connectedness', 'student_success'] },
  { key: 'iready', name: 'iReady', description: 'Using iReady as a source of data, instruction support, monitoring, or intervention.', goalAreas: ['student_success'] },
  { key: 'letrs', name: 'LETRS Training', description: 'Language Essentials for Teachers of Reading and Spelling professional development.', goalAreas: ['adult_learning_culture'] },
  { key: 'math_support', name: 'Math Support', description: 'Strategies to improve math instruction.', goalAreas: ['student_success'] },
  { key: 'mtss', name: 'MTSS/RTI', description: 'Multi-Tiered Systems of Support or tiered/differentiated support systems.', goalAreas: ['student_success'] },
  { key: 'nvacss', name: 'NVACSS', description: 'Nevada Academic Content Standards for Science.', goalAreas: ['student_success'] },
  { key: 'observation', name: 'Observation', description: 'Classroom observation, walkthroughs, learning walks, or peer observations.', goalAreas: ['adult_learning_culture'] },
  { key: 'parent_university', name: 'Parent University', description: 'District-organized educational workshops for families.', goalAreas: ['connectedness'] },
  { key: 'pbis', name: 'PBIS', description: 'Positive Behavioral Interventions and Supports.', goalAreas: ['connectedness'] },
  { key: 'professional_development', name: 'Professional Development', description: 'Planned professional development or learning opportunities for staff.', goalAreas: ['adult_learning_culture', 'student_success'] },
  { key: 'plcs', name: 'Professional Learning Communities', description: 'Structured collaborative groups for instructional improvement.', goalAreas: ['adult_learning_culture'] },
  { key: 'process_management', name: 'Process Management', description: 'Changes to processes aimed at successful implementation.', goalAreas: ['adult_learning_culture'] },
  { key: 'pthv', name: 'Parent Teacher Home Visits', description: 'PTHV program by name.', goalAreas: ['connectedness'] },
  { key: 'restorative_practices', name: 'Restorative Practices', description: 'Restorative approaches to discipline and community building.', goalAreas: ['connectedness'] },
  { key: 'scheduling', name: 'Scheduling', description: 'Strategic changes to the master schedule to support improvement goals.', goalAreas: ['student_success'] },
  { key: 'sel', name: 'Social-Emotional Learning', description: 'SEL strategies, curricula, or programs.', goalAreas: ['connectedness'] },
  { key: 'solution_tree', name: 'Solution Tree', description: 'Solution Tree PLC and RTI frameworks and training.', goalAreas: ['adult_learning_culture'] },
  { key: 'student_engagement', name: 'Student Engagement', description: 'Actively involving students in learning, leadership, or decision-making.', goalAreas: ['connectedness', 'student_success'] },
  { key: 'student_mentors', name: 'Student Mentors', description: 'Involving student mentors in improvement activities.', goalAreas: ['connectedness'] },
  { key: 'teacher_clarity', name: 'Teacher Clarity', description: 'Using teacher clarity or the Teacher Clarity Playbook strategies.', goalAreas: ['adult_learning_culture'] },
  { key: 'teacher_instruction', name: 'Teacher Instruction', description: 'Activities related to teacher instructional practices and quality.', goalAreas: ['adult_learning_culture', 'student_success'] },
  { key: 'technology', name: 'Technology', description: 'Technology access or resources as part of improvement.', goalAreas: ['student_success'] },
  { key: 'tntp', name: 'TNTP Partnership', description: 'Using or partnering with The New Teacher Project.', goalAreas: ['adult_learning_culture'] },
  { key: 'wrap_around', name: 'Wrap-Around Services', description: 'Wrap-around support or services for students and families.', goalAreas: ['connectedness'] }
];

// ============================================================================
// 23. ROOT CAUSES BY GOAL AREA (Expanded from real school performance plans)
// ============================================================================

var ROOT_CAUSES_BY_GOAL_AREA = {
  student_success: [
    'Lack of complimentary support system for curriculum (e.g., iReady)',
    'Inconsistent comprehensive early literacy and language instruction',
    'Need for high quality curriculum for ELA and Science',
    'Lack of focused PLCs based on content areas and professional growth needs',
    'Resource inequities across schools and classrooms',
    'Lack of calibration tools for principals to ensure consistent high quality instruction',
    'Slower than expected returns to pre-pandemic student performance',
    'Chronic absenteeism rates above state/district targets',
    'Lack of fluid and consistent academic intervention and data-monitoring system',
    'Need for equitable experience for increasingly diverse student population',
    'Lack of access to advanced coursework, CTE programs, and dual credit options',
    'Weaknesses in transitional supports for incoming freshmen',
    'Inconsistent dedicated time for intervention programs',
    'Interrupted time on personalized learning paths',
    'Lack of buy-in from staff and students on assessment platforms',
    'No dedicated time in master schedule for intervention',
    'Students at or above grade level outgrow peers not meeting standards',
    'Writing and math application identified as lowest performance areas'
  ],
  adult_learning_culture: [
    'Lack of uniformity in expectations for common assessments across teams and grade levels',
    'PLC procedures not aligned across teams, grade levels, and departments',
    'Uneven progress in PLC practices resulting in instructional coherence gaps',
    'Misalignment in development and use of common formative assessments',
    'Scheduling constraints limiting teacher collaborative planning time',
    'Insufficient focus and clear expectations for collaborative teams',
    'Need for consistent observation and feedback cycles',
    'Limited professional development aligned to improvement goals',
    'Teacher turnover disrupting instructional continuity',
    'Lack of shared instructional vision across staff'
  ],
  connectedness: [
    'Student mental health not recognized the way students feel it should be',
    'Lack of community among students at schools regardless of unique differences',
    'Students feel unprepared for college admissions and post-high school plans',
    'Decreased staff-student relationships and social-emotional learning',
    'Rising work stress among staff impacting relationships',
    'Student challenges in respect, bullying, and SEL relationship skills',
    'Gaps in social-emotional learning and insufficient resources for addressing bullying',
    'Changing educational demands straining both staff and students',
    'Need for students and families to recognize importance of attendance',
    'Insufficient family engagement strategies in home languages',
    'Lack of diverse family engagement opportunities beyond traditional events'
  ]
};
