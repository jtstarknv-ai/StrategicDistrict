/**
 * Assistant Panel Component
 * Hybrid panel: curated best practices + resources per step, plus dynamic "Ask the Assistant" chat
 * Used in both District and School builders
 */

// Curated content database
const ASSISTANT_CONTENT = {
  district: [
    {
      stepNum: 1,
      title: 'District Profile',
      description: 'Establish a baseline understanding of your district\'s current state, trends, and context.',
      why: 'Understanding your current state is the foundation of strategic planning',
      bestPractices: [
        'Use the most recent data available',
        'Include demographic trends not just snapshots',
        'Compare to state averages',
        'Consider community context beyond just numbers'
      ],
      research: [
        { text: 'Districts that ground plans in data are 2.3x more likely to achieve goals', source: 'McREL, 2020' },
        { text: 'Comprehensive needs assessments improve plan implementation fidelity', source: 'WestEd, 2019' }
      ],
      proTip: 'Don\'t just list numbers. Tell the story behind your data.',
      resources: [
        { name: 'Data Collection Template', file: 'district-profile-template.xlsx' },
        { name: 'Demographic Trends Worksheet', file: 'demographic-trends.pdf' }
      ],
      assistantResponses: {
        'How do I collect demographic data?': 'Start with your state department of education website—they publish demographic breakdowns by district. Cross-reference with your student information system (SIS) for accuracy. Include at least 3 years of trend data to spot patterns.',
        'What should I compare my data to?': 'Compare to your state average first, then to demographically similar districts. Your state education agency can provide peer districts. Also benchmark against national averages from NCES.',
        'How do I present data to stakeholders?': 'Lead with the human story, not the numbers. "We serve 15,000 students from 42 countries" is more powerful than a pie chart. Use visuals—heat maps work well for showing disparities across school levels.'
      }
    },
    {
      stepNum: 2,
      title: 'Strategic Planning Budget',
      description: 'Identify and align resources dedicated to the strategic planning process itself.',
      why: 'Strategic plans fail when they aren\'t resourced. This step is about the strategic planning process budget, not the whole district budget.',
      bestPractices: [
        'Identify all funding streams that support the planning process',
        'Account for staff time as a real cost',
        'Include community engagement costs',
        'Plan for monitoring and evaluation costs'
      ],
      research: [
        { text: 'Under-resourced strategic plans have a 67% failure rate', source: 'RAND, 2021' }
      ],
      proTip: 'Include the cost of NOT having a plan—reactive spending typically costs 30% more.',
      resources: [
        { name: 'Planning Budget Template', file: 'planning-budget.xlsx' },
        { name: 'Staffing Cost Calculator', file: 'staffing-costs.xlsx' }
      ],
      assistantResponses: {
        'How much should we budget for planning?': 'A typical district spends 1-2% of its annual operational budget on strategic planning and implementation support. For a $200M district, that\'s $2-4M over 3 years.',
        'What\'s included in planning costs?': 'Staff time (biggest line item), community engagement (facilitators, materials, events), data analysis and tools, external consultants if needed, and ongoing monitoring infrastructure.',
        'How do I justify planning costs to the board?': 'Show the ROI: "Plans without dedicated resources fail 67% of the time. One failed year wastes millions in scattered initiatives. Planning costs are insurance."'
      }
    },
    {
      stepNum: 3,
      title: 'Stakeholder Engagement',
      description: 'Design and execute a comprehensive engagement strategy for families, staff, and community.',
      why: 'Plans built without community voice lack legitimacy and sustainability',
      bestPractices: [
        'Engage families in their preferred language',
        'Use multiple engagement formats (surveys, focus groups, community events)',
        'Include student voice at secondary level',
        'Document engagement thoroughly for ESSA compliance'
      ],
      research: [
        { text: 'Meaningful family engagement increases plan implementation success by 40%', source: 'Harvard Family Research Project' },
        { text: 'Diverse stakeholder input leads to more equitable resource allocation', source: 'NSBA, 2022' }
      ],
      proTip: 'Don\'t just survey. Host at least one in-person engagement event in each attendance zone.',
      resources: [
        { name: 'Engagement Timeline & Toolkit', file: 'engagement-timeline.pdf' },
        { name: 'Survey Template (Multilingual)', file: 'survey-template.docx' },
        { name: 'Focus Group Facilitation Guide', file: 'focus-group-guide.pdf' }
      ],
      assistantResponses: {
        'How do we engage families who don\'t typically participate?': 'Meet them where they are. Partner with trusted community organizations, translate materials into home languages, offer childcare and meals at events, hold meetings at accessible times and locations.',
        'What\'s the minimum engagement we need for ESSA?': 'ESSA requires documented meaningful engagement with families on school improvement. That means more than surveys—you need evidence of two-way communication and how you acted on feedback.',
        'How many stakeholders should we involve?': 'Aim for at least 200-300 people across all stakeholder groups in a mid-sized district. Quality of input matters more than quantity. You need deep engagement, not just numbers.'
      }
    },
    {
      stepNum: 4,
      title: 'Vision & Mission',
      description: 'Craft a compelling vision for your district\'s future and a clear mission statement.',
      why: 'A compelling vision aligns the entire district toward a shared future',
      bestPractices: [
        'Keep vision aspirational but achievable within 3-5 years',
        'Mission should answer WHO you serve, WHAT you do, HOW you do it',
        'Avoid jargon—test with diverse audiences',
        'Vision should be memorable and repeatable'
      ],
      research: [
        { text: 'Organizations with clear vision statements outperform peers by 33%', source: 'Collins & Porras' }
      ],
      proTip: 'If people can\'t remember your vision after hearing it once, it\'s too complicated.',
      resources: [
        { name: 'Vision & Mission Workbook', file: 'vision-mission-workbook.pdf' }
      ],
      assistantResponses: {
        'What\'s the difference between vision and mission?': 'Vision is the aspirational future state: "Every child graduates college-ready and emotionally resilient." Mission is how you operate: "We inspire, challenge, and support every student to achieve their potential through equitable, culturally responsive teaching and learning."',
        'How do we test if our vision is clear?': 'Read it aloud to someone outside education. Can they explain it back to you without jargon? If not, simplify it.',
        'Should our vision be specific or broad?': 'Broad enough to be inspiring, specific enough to guide decisions. "Excellence in education" is too broad. "Every student graduates with a post-secondary plan" is better.'
      }
    },
    {
      stepNum: 5,
      title: 'Core Values',
      description: 'Define the values that guide daily decisions and organizational culture.',
      why: 'Values guide daily decisions when the plan isn\'t in hand',
      bestPractices: [
        'Limit to 3-5 values maximum',
        'Each value needs observable behavioral indicators',
        'Values should be visible in action, not just on paper',
        'Involve all stakeholder groups in value selection'
      ],
      research: [
        { text: 'Value-driven organizations see 25% higher employee engagement', source: 'Gallup, 2023' }
      ],
      proTip: 'For each value, write down: "We know we\'re living this value when people see us..."',
      resources: [
        { name: 'Values Definition Template', file: 'values-template.pdf' },
        { name: 'Behavioral Indicators Worksheet', file: 'behavioral-indicators.xlsx' }
      ],
      assistantResponses: {
        'How many values is too many?': 'More than 5 values dilutes focus. Stick to 3-5 core values that truly differentiate how you operate. Quality over quantity.',
        'What if we can\'t agree on values?': 'That\'s actually good—it surfaces real differences. Facilitate conversation: "Which of these values is non-negotiable for our kids?" Work toward consensus on the essentials.',
        'How do we make values stick?': 'Embed them in hiring, evaluation, and budget decisions. When you deny a budget request because it contradicts your values, people believe. When you hire and fire based on values alignment, people notice.'
      }
    },
    {
      stepNum: 6,
      title: 'Competencies',
      description: 'Define the knowledge, skills, and dispositions graduates will demonstrate.',
      why: 'Competencies define what students will be able to do as graduates',
      bestPractices: [
        'Align to Portrait of a Graduate frameworks',
        'Include cognitive and non-cognitive skills',
        'Make competencies measurable and observable',
        'Connect to real-world application and post-secondary readiness'
      ],
      research: [
        { text: 'Competency-based frameworks improve post-secondary readiness by 18%', source: 'RAND, 2022' }
      ],
      proTip: 'Start with "A graduate of our district will be able to..." instead of "will know..."',
      resources: [
        { name: 'Competency Framework Template', file: 'competencies-template.xlsx' },
        { name: 'Portrait of a Graduate Examples', file: 'portrait-examples.pdf' }
      ],
      assistantResponses: {
        'What\'s the difference between competencies and standards?': 'Standards are what we teach (content). Competencies are what students can do (demonstration of learning). A student might meet the standard but not demonstrate the competency in application.',
        'How do we make competencies measurable?': 'Use performance-based tasks, not just tests. "Students can analyze primary documents" is vague. "Students can read a primary document, identify bias, and explain how it affects historical interpretation" is measurable.',
        'How many competencies should we define?': 'Start with 5-8 cross-curricular competencies (critical thinking, collaboration, etc.) then layer in subject-specific competencies. Too many becomes unwieldy.'
      }
    },
    {
      stepNum: 7,
      title: 'Strategic Domains',
      description: 'Organize strategic work into 3-5 interconnected focus areas.',
      why: 'Domains organize your work into manageable focus areas',
      bestPractices: [
        'Limit to 3-5 domains—more than that loses focus',
        'Each domain should be distinct but interconnected',
        'Name domains clearly using plain language',
        'Every goal should map to exactly one domain'
      ],
      research: [
        { text: 'Districts with 3-5 focused priority areas outperform those with 6+', source: 'McREL' }
      ],
      proTip: 'If you can\'t name your domains in a way that a 5th grader understands, they\'re too vague.',
      resources: [
        { name: 'Domain Planning Worksheet', file: 'domains-worksheet.pdf' }
      ],
      assistantResponses: {
        'What makes a good domain?': 'A domain is a major category of work that connects multiple goals and initiatives. Example: "Academic Excellence" might include elementary reading, high school graduation, and STEM pathways—all connected by the competency of critical thinking.',
        'How do we know if our domains overlap?': 'Map each goal to its domain. If a goal could fit in two domains equally, your domains aren\'t distinct enough. Refine and rename.',
        'Should we include equity as a domain?': 'Equity is better as a lens across all domains rather than a separate domain. Every domain should ask "How does this advance or undermine equity?"'
      }
    },
    {
      stepNum: 8,
      title: 'Strategic Goal Setting',
      description: 'Develop SMART goals that turn vision into measurable commitments.',
      why: 'Goals turn vision into measurable commitments',
      bestPractices: [
        'Use SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)',
        'Set both leading and lagging indicators',
        'Include at least one equity-focused goal',
        'Set ambitious but achievable targets'
      ],
      research: [
        { text: 'Specific, measurable goals increase achievement probability by 42%', source: 'Locke & Latham' }
      ],
      proTip: 'A goal without a baseline is just a guess. Always include your current state.',
      resources: [
        { name: 'SMART Goals Template', file: 'smart-goals-template.xlsx' },
        { name: 'Goal Writing Guide', file: 'goal-writing-guide.pdf' }
      ],
      assistantResponses: {
        'What\'s a good goal vs. a vague goal?': 'Vague: "Improve reading achievement." Good: "By 2027, increase percentage of 3rd graders scoring proficient in reading from 62% to 80%, with emphasis on reducing disparities (current gap: 22 points)."',
        'How many goals should we have?': 'Aim for 5-8 district-level goals. Each goal can have 2-3 supporting objectives. More than 8 goals dilutes focus and resources.',
        'What are leading vs. lagging indicators?': 'Lagging indicator: the goal itself (proficiency rate next year). Leading indicator: early warning signs (reading level at fall benchmark, attendance, classroom assessment performance). Track both.'
      }
    },
    {
      stepNum: 9,
      title: 'Goal Forecasting',
      description: 'Analyze trends and set realistic performance targets based on data.',
      why: 'Forecasting helps set realistic targets and identify early warning signs',
      bestPractices: [
        'Use 3+ years of historical trend data',
        'Account for implementation lag (change takes time)',
        'Set interim benchmarks (not just year-3 targets)',
        'Build in adjustment triggers (if X happens, we pivot)'
      ],
      research: [
        { text: 'Data-informed goal setting reduces off-track performance by 35%', source: 'CGCS, 2023' }
      ],
      proTip: 'If your trend is flat or declining, a 3-year goal might be unrealistic. Be honest.',
      resources: [
        { name: 'Forecasting Tool (Excel)', file: 'forecasting-tool.xlsx' },
        { name: 'Trend Analysis Template', file: 'trend-analysis.xlsx' }
      ],
      assistantResponses: {
        'How do we account for implementation lag?': 'New initiatives typically show small gains in year 1, larger gains in years 2-3 as they mature. If reading is at 62% now and you\'re implementing a new curriculum, expect 64-66% in year 1, 72% in year 2, 80% in year 3.',
        'What if our trend is getting worse?': 'That\'s crucial information. Your goal target might need to be more modest for year 1 (stabilize), year 2 (pivot), year 3 (grow). Set interim benchmarks—if you don\'t see improvement by spring benchmark, you change strategy.',
        'How do we forecast when we\'re trying something new?': 'Use research on similar initiatives in similar districts. Published implementation research shows typical trajectories. Your forecast is a hypothesis—monitor closely and adjust.'
      }
    },
    {
      stepNum: 10,
      title: 'Central Office Alignment',
      description: 'Organize central office departments to support strategic goals.',
      why: 'Central office must be organized to support the plan, not just monitor it',
      bestPractices: [
        'Map each goal to a responsible department',
        'Eliminate duplicative initiatives across departments',
        'Create clear accountability chains (who owns this? who reports?)',
        'Align professional development to plan priorities'
      ],
      research: [
        { text: 'Central office alignment is the #1 predictor of plan implementation success', source: 'AASA, 2022' }
      ],
      proTip: 'Central office exists to serve schools. If your central office structure doesn\'t support the plan, redesign it.',
      resources: [
        { name: 'Department Accountability Matrix', file: 'accountability-matrix.xlsx' },
        { name: 'Org Design Worksheet', file: 'org-design.pdf' }
      ],
      assistantResponses: {
        'How do we eliminate silos between departments?': 'Start with the goals. For each goal, identify all departments touching it. Create cross-functional teams, not separate initiatives. One reading goal might involve instruction, assessment, and family engagement working as one team.',
        'What does "central office alignment" actually mean?': 'It means every department can articulate how their work supports your 3-5 strategic goals. No one does work that contradicts the plan. Resources flow to plan priorities, not pet projects.',
        'How do we accountability when multiple departments own a goal?': 'Designate one department as the lead with clear governance. Weekly alignment meetings. Monthly progress reports. Everyone knows who has the final say if there\'s a conflict.'
      }
    },
    {
      stepNum: 11,
      title: 'Action Initiatives',
      description: 'Define specific actions that drive goal achievement.',
      why: 'Initiatives are the specific actions that make goals achievable',
      bestPractices: [
        'Each initiative needs an owner, timeline, and budget',
        'Limit initiatives per goal to 3-5',
        'Build in quick wins alongside long-term work',
        'Use evidence-based strategies where available'
      ],
      research: [
        { text: 'Plans with specific action steps are 2.5x more likely to be implemented', source: 'Fullan, 2021' }
      ],
      proTip: 'Don\'t confuse activity with impact. "Offer PD on literacy" is activity. "Implement guided reading groups in all K-2 classrooms and measure fidelity monthly" is an initiative.',
      resources: [
        { name: 'Initiative Template', file: 'initiative-template.xlsx' },
        { name: 'Evidence-Based Practices Library', file: 'evidence-based-practices.pdf' }
      ],
      assistantResponses: {
        'How many initiatives per goal?': '3-5 is the sweet spot. Fewer than 3 might not move the needle. More than 5 spreads resources too thin. Each initiative should have meaningful budget and staff time.',
        'How do we choose evidence-based strategies?': 'Start with What Works Clearinghouse (wwc.ed.gov) and state education agency lists. Look for research from your demographics and context. "Evidence-based" doesn\'t mean perfect—it means research shows it works better than the status quo.',
        'What\'s the difference between an initiative and a project?': 'An initiative is part of your strategic plan—it\'s tied to a goal and has long-term funding. A project is one-off work. Initiatives drive your strategy; projects might support it.'
      }
    },
    {
      stepNum: 12,
      title: 'Stakeholder Review',
      description: 'Share the near-final plan with stakeholders for feedback and alignment.',
      why: 'Review ensures the plan reflects community priorities before finalization',
      bestPractices: [
        'Share plan summary in accessible format (2-page one-pager, not full document)',
        'Provide clear feedback mechanism (survey, comment form, town hall)',
        'Document all feedback received (you need this for records)',
        'Show how feedback was incorporated in final version'
      ],
      proTip: 'A 2-page executive summary is more effective than sharing the full plan.',
      resources: [
        { name: 'One-Pager Template', file: 'one-pager-template.docx' },
        { name: 'Feedback Survey Template', file: 'feedback-survey.pdf' }
      ],
      assistantResponses: {
        'How do we get meaningful feedback?': 'Ask specific questions: "Which goals matter most for your child?" "What barriers do you foresee?" "What support do you need?" Open-ended questions get better feedback than yes/no.',
        'Who should review the draft plan?': 'Your engagement stakeholders from Step 3. Unions, school board, cabinet, teacher leaders, family groups, student council, community partners. Cast a wide net.',
        'What if we get feedback that contradicts the plan?': 'Document it. Discuss with cabinet. You don\'t have to incorporate every comment, but you do need to show you heard people and made intentional choices. Transparency builds trust.'
      }
    },
    {
      stepNum: 13,
      title: 'Implementation Calendar',
      description: 'Create a timeline that sequences work and creates accountability.',
      why: 'A timeline creates urgency and accountability',
      bestPractices: [
        'Map milestones quarterly, not just annually',
        'Include board presentation dates and decision points',
        'Build in review cycles (monthly minimum)',
        'Account for seasonal factors (testing windows, budget cycles, staff availability)'
      ],
      research: [
        { text: 'Time-bound plans with milestones are 3x more likely to stay on track', source: 'PMI, 2023' }
      ],
      proTip: 'A calendar without deadlines is a wish list. Make milestones concrete and visible.',
      resources: [
        { name: 'Implementation Calendar Template', file: 'calendar-template.xlsx' },
        { name: 'Monthly Review Checklist', file: 'monthly-checklist.pdf' }
      ],
      assistantResponses: {
        'How detailed should our calendar be?': 'Show quarterly milestones for the full 3-year plan, then monthly detail for year 1. Adjust as you learn. Too detailed too far out is noise.',
        'What should our calendar include?': 'Initiative start/end dates, decision points (board approvals), major meetings/events, assessment windows (SBAC, benchmark assessments), professional development, and review cycles.',
        'How do we keep the calendar current?': 'Monthly review. What\'s on track? What\'s not? Adjust next month\'s priorities. A calendar that never changes isn\'t helpful—it\'s theater.'
      }
    },
    {
      stepNum: 14,
      title: 'Preview and Finalize',
      description: 'Final compliance check and prepare for Year Zero launch.',
      why: 'Final review ensures quality, completeness, and compliance',
      bestPractices: [
        'Use a compliance checklist (ESSA requirements, alignment to state frameworks)',
        'Have external reviewer if possible (fresh eyes catch things)',
        'Ensure all ESSA requirements are met',
        'Plan for the first 90 days post-adoption'
      ],
      proTip: 'The best plans include a "Year Zero" implementation launch strategy.',
      resources: [
        { name: 'Compliance Checklist', file: 'compliance-checklist.pdf' },
        { name: 'Year Zero Launch Guide', file: 'year-zero-guide.pdf' }
      ],
      assistantResponses: {
        'What ESSA requirements do we need to meet?': 'Meaningful engagement (documented), alignment to school improvement/support needs, annual review with board, goals tied to measurable outcomes, connection to post-secondary readiness.',
        'Why do we need an external reviewer?': 'You\'ve been living in the weeds for months. External eyes spot inconsistencies, gaps, and unclear language. Someone who reads it fresh will catch what you miss.',
        'What\'s a "Year Zero" launch?': 'It\'s the 90 days after board adoption. Announce it, celebrate it, create quick wins, train leadership, set up systems for tracking progress. Year One starts on a strong foundation, not scrambling.'
      }
    }
  ],
  school: [
    {
      stepNum: 1,
      title: 'District Connection',
      description: 'Align your school plan to district strategic goals and priorities.',
      why: 'School plans should align to and support the district strategic plan',
      bestPractices: [
        'Reference specific district goals your school supports',
        'Show how school priorities map to district priorities',
        'Identify how school initiatives feed into district goals'
      ],
      research: [
        { text: 'Aligned school plans improve system coherence and resource efficiency', source: 'Honig, 2013' }
      ],
      proTip: 'Use the district plan as your starting scaffold, not a constraint.',
      resources: [
        { name: 'District-School Alignment Template', file: 'alignment-template.pdf' }
      ],
      assistantResponses: {
        'How do we show alignment without just copying the district plan?': 'District goal: "Increase reading proficiency to 80%." Your school-specific version: "All K-2 classrooms implement daily guided reading, with weekly walkthroughs to ensure fidelity." Same goal, tailored to your context.',
        'What if our school priorities don\'t align to district goals?': 'They should. But if you identify something urgent (like attendance at your school is 8 points below district), you can add a school-specific goal and show how it addresses a root cause the district cares about.',
        'Who owns alignment—principal or central office?': 'Principal with support from central office. Principal knows the school; CO provides district context. Partner, don\'t defer.'
      }
    },
    {
      stepNum: 2,
      title: 'School Profile',
      description: 'Create a comprehensive snapshot of your school\'s demographics, performance, and context.',
      why: 'Your school\'s unique context shapes every decision in the plan',
      bestPractices: [
        'Include trend data (3+ years) not just a snapshot',
        'Compare to demographically similar schools in your district and state',
        'Note community assets not just challenges',
        'Include staff capacity and experience data'
      ],
      proTip: 'A profile is not an excuse. It\'s context. Use it to make smart decisions.',
      resources: [
        { name: 'School Profile Template', file: 'profile-template.xlsx' },
        { name: 'Data Dashboard Worksheet', file: 'dashboard-worksheet.pdf' }
      ],
      assistantResponses: {
        'Where do we get comparison data?': 'State education agency dashboards show district and state comparisons. Your district office has peer schools. NCES (nces.ed.gov) has national data. All free.',
        'What data do we include in the profile?': 'Demographics (enrollment, ELL, special ed, FRL), attendance, discipline, academic performance (reading, math, graduation if HS), staffing (experience, certifications), and survey data (climate, culture).',
        'What are community assets?': 'Businesses that partner with your school, community organizations, parent expertise, school traditions, strong sports/arts programs. Every school has assets. Find them.'
      }
    },
    {
      stepNum: 3,
      title: 'Needs Assessment',
      description: 'Analyze root causes of performance gaps and barriers to student success.',
      why: 'Root cause analysis prevents symptom-chasing',
      bestPractices: [
        'Use multiple data sources (academic, behavioral, survey, observational)',
        'Disaggregate data by student group to surface disparities',
        'Involve teachers in analysis—they see patterns you won\'t in data',
        'Focus on alterable factors (things you can change), not excuses'
      ],
      proTip: 'Ask "why?" five times before you settle on the problem.',
      resources: [
        { name: 'Root Cause Analysis Template', file: 'root-cause-template.pdf' },
        { name: 'Data Disaggregation Worksheet', file: 'disaggregation.xlsx' }
      ],
      assistantResponses: {
        'How do we disaggregate data?': 'Break down overall results by subgroup: race/ethnicity, ELL status, special ed, FRL status, grade level. If 65% are proficient overall but only 40% of ELL students are, ELL support is a priority.',
        'What if teachers disagree with the data?': 'That\'s valuable. "I see kids struggling with comprehension, but the test shows 70% proficient." Dig deeper. Could be test-taking skills, not comprehension. Use teacher insight to interpret data correctly.',
        'How do we know if it\'s a root cause?': 'Ask: Can we change this? If we fix it, will it improve student outcomes? Is it a cause, not a symptom? Example: "Lack of guided reading" is root cause. "Low reading scores" is the symptom.'
      }
    },
    {
      stepNum: 4,
      title: 'Vision & Mission',
      description: 'Develop a school-specific vision that creates local identity and ownership.',
      why: 'School-level vision creates local ownership and identity',
      bestPractices: [
        'Align to district vision but be school-specific',
        'Include student and family voice',
        'Make it memorable—can students and families say it?',
        'Tie to your school\'s unique assets and community'
      ],
      proTip: 'Your vision should be aspirational for YOUR school, not a generic copy-paste.',
      resources: [
        { name: 'School Vision Workbook', file: 'vision-workbook.pdf' }
      ],
      assistantResponses: {
        'How is school vision different from district vision?': 'District vision is system-wide. School vision is your school\'s identity within that system. District: "College-ready graduates." School: "Every [School Name] student graduates with a post-secondary plan and the skills to succeed."',
        'Should students help write the vision?': 'Absolutely, especially at secondary. Even elementary students can contribute. "I want to feel safe," "I want teachers to believe in me," "I want to try new things." That\'s vision language.',
        'What if our vision sounds cheesy?': 'Test it with staff and families. If they cringe, it\'s too corporate. Simplify and make it personal.'
      }
    },
    {
      stepNum: 5,
      title: 'Values & Culture',
      description: 'Define the values and culture that underpin daily interactions and decisions.',
      why: 'Culture eats strategy for breakfast',
      bestPractices: [
        'Values should be visible in hallways and classrooms',
        'Connect values to behavioral expectations (what respect looks like)',
        'Involve students in defining culture, not just adults',
        'Hold everyone accountable to values, including leadership'
      ],
      proTip: 'Culture is not a poster. It\'s lived every day. Model it.',
      resources: [
        { name: 'School Culture Audit', file: 'culture-audit.pdf' },
        { name: 'Values to Behaviors Template', file: 'values-behaviors.xlsx' }
      ],
      assistantResponses: {
        'How do we create strong culture?': 'Be intentional. Define your core values (typically 3-4 for a school). For each value, create observable behaviors. Then model, reinforce, and hold people accountable.',
        'What if culture is negative right now?': 'Culture change takes 2-3 years. Start with quick wins: staff gratitude rituals, student recognition, consistent consequences. Get wins on the board. Build momentum.',
        'How do we involve students in culture?': 'Student leadership groups, advisory groups, class meetings. Ask: "What does belonging feel like here? What barriers do you experience?" Student voice drives authentic culture change.'
      }
    },
    {
      stepNum: 6,
      title: 'School Goals',
      description: 'Set 3-5 SMART goals that focus limited resources on what matters most.',
      why: 'Goals focus limited resources on what matters most',
      bestPractices: [
        'Limit to 3-5 goals maximum',
        'Include at least one equity-focused goal',
        'Set annual performance objectives (not just 3-year targets)',
        'Goals should be ambitious but achievable'
      ],
      proTip: 'Every goal should tie back to your needs assessment. No goal without evidence.',
      resources: [
        { name: 'SMART Goals Template', file: 'goals-template.xlsx' }
      ],
      assistantResponses: {
        'What makes a good school-level goal?': 'It\'s SMART (Specific, Measurable, Achievable, Relevant, Time-bound) and data-driven. "Improve reading" is vague. "Increase percentage of 2nd graders scoring proficient in reading from 58% to 70% by spring 2027" is a goal.',
        'Should we have one equity goal or multiple?': 'Look at your data. If disparities exist in multiple areas, multiple goals. If reading is the main equity gap, one goal with a focus on closing the gap for priority groups.',
        'How do we set the bar?': 'Use your trend data and comparable schools as guides. Stretch, but don\'t set impossible targets. A 12-point gain in 1 year is ambitious. A 30-point gain is fantasy.'
      }
    },
    {
      stepNum: 7,
      title: 'Action Planning',
      description: 'Define specific actions that drive goal achievement.',
      why: 'Actions bridge the gap between goals and results',
      bestPractices: [
        'Each action needs an owner and timeline',
        'Identify professional development needs upfront',
        'Build in formative checkpoints (monthly/quarterly progress checks)',
        'Use evidence-based practices where available'
      ],
      proTip: 'Action plans without owners are hope, not plans. Name names.',
      resources: [
        { name: 'Action Plan Template', file: 'action-plan-template.xlsx' },
        { name: 'Evidence-Based Practices Guide', file: 'practices-guide.pdf' }
      ],
      assistantResponses: {
        'How many actions per goal?': '2-4 per goal is typical. Each action should be meaningful and resourced. Fewer actions executed well beats many actions done halfway.',
        'What counts as an action?': 'A concrete thing you\'re going to do, with a person responsible and a timeline. "Implement guided reading in K-2" is an action. "Provide PD" is an action. "Monitor fidelity monthly" is an action.',
        'What if we don\'t have PD time?': 'Build it into early dismissal days, faculty meetings, or professional learning communities. If your plan requires PD and you don\'t budget time, the plan fails. Budget it.'
      }
    },
    {
      stepNum: 8,
      title: 'Stakeholder Engagement',
      description: 'Document meaningful engagement with families and community.',
      why: 'ESSA requires meaningful family engagement documentation',
      bestPractices: [
        'Engage families beyond surveys—hold real conversations',
        'Include student voice in planning',
        'Provide feedback in accessible formats',
        'Document engagement (you need this for compliance and records)'
      ],
      proTip: 'Engagement isn\'t a checkbox. It\'s a relationship you\'re building.',
      resources: [
        { name: 'Engagement Plan Template', file: 'engagement-plan.pdf' },
        { name: 'Family Survey Template', file: 'survey-template.docx' }
      ],
      assistantResponses: {
        'How do we engage families who don\'t typically participate?': 'Meet them where they are. Partner with community centers, translate materials, offer meetings at accessible times, provide childcare and food. Go to them—don\'t just wait for them to come to you.',
        'What\'s the minimum engagement we need for ESSA?': 'ESSA requires meaningful engagement in school improvement planning. That means more than surveys. You need evidence that you asked families what matters, listened, and acted on feedback.',
        'How do we document engagement?': 'Keep sign-in sheets, record survey results, document feedback received, show how you incorporated input. Simple records, but you need them.'
      }
    },
    {
      stepNum: 9,
      title: 'Resource Allocation',
      description: 'Align budget and staffing to strategic goals.',
      why: 'Resources must be aligned to priority goals',
      bestPractices: [
        'Map every initiative to a funding source',
        'Account for staff time costs (your biggest resource)',
        'Fund quick wins and long-term work',
        'Build in flexibility for in-year adjustments'
      ],
      proTip: 'Your budget should be a mirror of your priorities. If it\'s not, your priorities aren\'t really priorities.',
      resources: [
        { name: 'Budget Alignment Template', file: 'budget-template.xlsx' }
      ],
      assistantResponses: {
        'Where does our school budget come from?': 'Base allocation from the district (per-pupil funding), plus categorical funding (Title I, Title II, SPED, ELL, etc.), plus grants if you have them. Know where your money comes from—it affects what you can do.',
        'How do we fund initiatives without more money?': 'Reallocate existing resources. Stop doing things that don\'t move the needle. Redirect staff time from low-impact to high-impact work. Create efficiencies (shared PD across grades, not isolated).',
        'What if our categorical dollars restrict how we spend?': 'Learn the compliance rules. Many categorical programs have flexibility built in. Title I can fund instruction in any subject if it\'s serving eligible students. Work with your district office.'
      }
    },
    {
      stepNum: 10,
      title: 'Implementation Calendar',
      description: 'Create a realistic timeline that sequences actions and builds accountability.',
      why: 'Timing matters—sequence actions strategically',
      bestPractices: [
        'Front-load quick wins (build momentum)',
        'Align to assessment windows (you can\'t assess what you haven\'t taught)',
        'Build in PD time before you roll out new initiatives',
        'Plan for transitions (summer, winter break)'
      ],
      proTip: 'A calendar without deadlines is a wish list. Make it real.',
      resources: [
        { name: 'Implementation Calendar Template', file: 'calendar-template.xlsx' }
      ],
      assistantResponses: {
        'Should we start all initiatives at once or stagger them?': 'Stagger. Too many changes at once overwhelm staff and students. Start with 1-2 high-impact initiatives in fall, add more as previous ones stabilize. Pace matters.',
        'How do we plan around testing windows?': 'Testing windows are typically 2-3 months. Don\'t roll out major curriculum changes during testing. Plan your launch and implementation to avoid bottlenecks.',
        'What\'s in a good calendar?': 'Initiative start dates, milestone dates, PD dates, assessment windows, review meetings, and decision points. Visible, realistic, and referenced regularly.'
      }
    },
    {
      stepNum: 11,
      title: 'Monitoring & Accountability',
      description: 'Track progress using leading and lagging indicators.',
      why: 'What gets measured gets done',
      bestPractices: [
        'Use both leading indicators (early warning signs) and lagging indicators (end results)',
        'Review data monthly minimum',
        'Assign a data lead or team',
        'Have a protocol for responding to off-track work'
      ],
      proTip: 'Data without response is just bookkeeping. See something? Do something.',
      resources: [
        { name: 'Monitoring Dashboard Template', file: 'monitoring-dashboard.xlsx' },
        { name: 'Data Review Meeting Protocol', file: 'data-protocol.pdf' }
      ],
      assistantResponses: {
        'What\'s the difference between leading and lagging indicators?': 'Lagging indicator: students\' spring reading scores (the result). Leading indicators: fall benchmark scores, guided reading level progress, classroom assessment performance, attendance. Leading indicators predict where lagging indicators will end up.',
        'How often should we review data?': 'Monthly minimum. Weekly is better for high-priority goals. Monthly gives you time to respond and adjust. Quarterly is too slow—you miss critical windows.',
        'What do we do if we\'re off track?': 'Don\'t panic. Diagnose: Is it an implementation issue? A strategy issue? A resource issue? Adjust your approach. You might intensify the current action, switch strategies, or add resources.'
      }
    },
    {
      stepNum: 12,
      title: 'Preview and Finalize',
      description: 'Final review for compliance and quality before adoption.',
      why: 'Final review ensures compliance and quality',
      bestPractices: [
        'Check all ESSA requirements (alignment, engagement, measurable outcomes)',
        'Get principal and school committee sign-off',
        'Have an external reviewer if possible',
        'Plan a formal adoption process (board approval or equivalent)'
      ],
      proTip: 'The best plans include a 90-day launch strategy post-adoption.',
      resources: [
        { name: 'ESSA Compliance Checklist', file: 'compliance-checklist.pdf' },
        { name: 'Plan Launch Guide', file: 'launch-guide.pdf' }
      ],
      assistantResponses: {
        'What ESSA requirements do school plans need?': 'Meaningful family engagement (documented), clear goals tied to measurable outcomes, alignment to school improvement needs, connection to post-secondary readiness if secondary school.',
        'Who signs off on the school plan?': 'Principal and school planning committee. Check your district—some require board approval, some don\'t. Know your process.',
        'What\'s a plan launch?': 'The first 90 days after adoption. Celebrate the plan, train staff, communicate with families, set up systems for tracking progress, and deliver quick wins. Strong launch = stronger implementation.'
      }
    }
  ]
};

/**
 * Render the assistant panel into a container
 * @param {string} containerId - DOM element ID to render into
 * @param {string} builderType - 'district' or 'school'
 */
export function renderAssistantPanel(containerId, builderType) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container ${containerId} not found`);
    return;
  }

  const contentType = builderType === 'district' ? 'district' : 'school';

  // Create panel wrapper
  const panel = document.createElement('div');
  panel.className = 'assistant-panel';
  panel.id = 'assistant-panel-root';
  panel.setAttribute('data-builder-type', contentType);

  // Add HTML structure
  panel.innerHTML = `
    <div class="panel-header">
      <div class="header-content">
        <svg class="header-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 4 13.5 4 12 4.67 12 5.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 4 6.5 4 5 4.67 5 5.5 5.67 7 6.5 7zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="currentColor"/>
        </svg>
        <h3 class="panel-title">Strategic Assistant</h3>
      </div>
    </div>

    <div class="tab-bar">
      <button class="tab-button active" data-tab="guide">Guide & Resources</button>
      <button class="tab-button" data-tab="assistant">Ask Assistant</button>
    </div>

    <div class="panel-content">
      <div class="tab-content active" data-tab-content="guide">
        <div class="guide-container">
          <!-- Populated by updateAssistantStep -->
        </div>
      </div>

      <div class="tab-content" data-tab-content="assistant">
        <div class="chat-container">
          <div class="chat-messages"></div>
          <div class="suggested-questions"></div>
          <div class="chat-input-wrapper">
            <input type="text" class="chat-input" placeholder="Ask a question about this step..." />
            <button class="chat-send-button" aria-label="Send">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  container.appendChild(panel);

  // Initialize event listeners
  setupTabNavigation(panel);
  setupChatListeners(panel, contentType);

  // Load initial step
  updateAssistantStep(1);
}

/**
 * Update assistant panel content when user navigates to a new step
 * @param {number} stepNumber - The step number to load content for
 */
export function updateAssistantStep(stepNumber) {
  const panel = document.getElementById('assistant-panel-root');
  if (!panel) return;

  const builderType = panel.getAttribute('data-builder-type');
  const contentDb = ASSISTANT_CONTENT[builderType];
  const stepContent = contentDb.find(s => s.stepNum === stepNumber);

  if (!stepContent) {
    console.warn(`No content found for step ${stepNumber}`);
    return;
  }

  // Update guide tab
  const guideContainer = panel.querySelector('.guide-container');
  guideContainer.innerHTML = renderGuideContent(stepContent);

  // Update suggested questions in assistant tab
  updateSuggestedQuestions(panel, stepContent);

  // Clear chat messages when switching steps
  const chatMessages = panel.querySelector('.chat-messages');
  chatMessages.innerHTML = '';
}

/**
 * Render the guide content HTML
 */
function renderGuideContent(content) {
  return `
    <div class="step-header">
      <h2 class="step-title">${content.title}</h2>
      <p class="step-description">${content.description}</p>
    </div>

    <div class="why-section">
      <div class="why-label">Why This Matters</div>
      <p class="why-text">${content.why}</p>
    </div>

    <div class="best-practices-section">
      <h4 class="section-title">Best Practices</h4>
      <ul class="practices-list">
        ${content.bestPractices.map(practice => `<li>${practice}</li>`).join('')}
      </ul>
    </div>

    <div class="research-section">
      <h4 class="section-title">Research Highlights</h4>
      <div class="research-list">
        ${content.research.map(item => `
          <div class="research-item">
            <p class="research-text">"${item.text}"</p>
            <p class="research-source">— ${item.source}</p>
          </div>
        `).join('')}
      </div>
    </div>

    ${content.resources && content.resources.length > 0 ? `
      <div class="resources-section">
        <h4 class="section-title">Downloadable Resources</h4>
        <div class="resources-list">
          ${content.resources.map(resource => `
            <button class="download-button" data-resource="${resource.file}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              ${resource.name}
            </button>
          `).join('')}
        </div>
      </div>
    ` : ''}

    <div class="pro-tip-section">
      <div class="pro-tip-label">Pro Tip</div>
      <p class="pro-tip-text">${content.proTip}</p>
    </div>
  `;
}

/**
 * Setup tab navigation
 */
function setupTabNavigation(panel) {
  const tabButtons = panel.querySelectorAll('.tab-button');
  const tabContents = panel.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');

      // Remove active from all buttons and contents
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active to clicked button and corresponding content
      button.classList.add('active');
      panel.querySelector(`[data-tab-content="${tabName}"]`).classList.add('active');

      // Clear chat input focus when switching away from assistant tab
      if (tabName !== 'assistant') {
        const chatInput = panel.querySelector('.chat-input');
        if (chatInput) chatInput.blur();
      }
    });
  });
}

/**
 * Update suggested questions based on current step
 */
function updateSuggestedQuestions(panel, stepContent) {
  const suggestedContainer = panel.querySelector('.suggested-questions');
  const responses = stepContent.assistantResponses || {};
  const questions = Object.keys(responses).slice(0, 4);

  suggestedContainer.innerHTML = `
    <div class="suggested-label">Suggested Questions</div>
    <div class="question-chips">
      ${questions.map(question => `
        <button class="question-chip" data-question="${question}">
          ${question}
        </button>
      `).join('')}
    </div>
  `;

  // Add click handlers to question chips
  suggestedContainer.querySelectorAll('.question-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question');
      handleChatQuestion(panel, question, stepContent);
    });
  });
}

/**
 * Setup chat-related event listeners
 */
function setupChatListeners(panel, contentType) {
  const chatInput = panel.querySelector('.chat-input');
  const sendButton = panel.querySelector('.chat-send-button');

  if (!chatInput || !sendButton) return;

  const handleSend = () => {
    const question = chatInput.value.trim();
    if (!question) return;

    const builderType = panel.getAttribute('data-builder-type');
    const contentDb = ASSISTANT_CONTENT[builderType];

    // Find current step content
    const guideContainer = panel.querySelector('.guide-container');
    const stepTitle = guideContainer.querySelector('.step-title')?.textContent;
    const stepContent = contentDb.find(s => s.title === stepTitle);

    if (stepContent) {
      handleChatQuestion(panel, question, stepContent);
    }

    chatInput.value = '';
  };

  sendButton.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  });
}

/**
 * Handle a chat question and display response
 */
function handleChatQuestion(panel, question, stepContent) {
  const chatMessages = panel.querySelector('.chat-messages');
  const responses = stepContent.assistantResponses || {};

  // Add user message
  const userMessage = document.createElement('div');
  userMessage.className = 'chat-message user-message';
  userMessage.innerHTML = `<p>${escapeHtml(question)}</p>`;
  chatMessages.appendChild(userMessage);

  // Get response (either matched or generic)
  let response = responses[question] || generateGenericResponse(question, stepContent);

  // Add assistant message
  const assistantMessage = document.createElement('div');
  assistantMessage.className = 'chat-message assistant-message';
  assistantMessage.innerHTML = `<p>${escapeHtml(response)}</p>`;
  chatMessages.appendChild(assistantMessage);

  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/**
 * Generate a generic response when exact question isn't found
 */
function generateGenericResponse(question, stepContent) {
  const responses = [
    `Great question about ${stepContent.title}! This relates to one of our best practices: ${stepContent.bestPractices[0] || 'planning carefully'}. Research shows that ${stepContent.research[0]?.text || 'thoughtful planning improves outcomes'}.`,
    `That's a key consideration at the ${stepContent.title} step. Our pro tip is: ${stepContent.proTip}`,
    `Excellent question! This is exactly why ${stepContent.why.toLowerCase()} You might find our downloadable resources helpful for diving deeper into this topic.`
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
