/**
 * STATE_ESSA_CONFIG
 * Comprehensive ESSA School Improvement Plan Configuration for All 50 US States + DC
 *
 * This configuration file defines state-specific school improvement plan (SIP) requirements
 * for the Strategic School Plan Builder, including:
 * - Designation frameworks (CSI, TSI, ATSI)
 * - Required and optional SIP components
 * - State-specific terminology and processes
 * - Evidence-level definitions
 * - Performance goals and timelines
 *
 * Data structured for use by the Strategic School Plan Builder UI/logic layer.
 * Last Updated: March 2026
 */

const STATE_ESSA_CONFIG = {

  // ==========================================================================
  // FEDERAL BASELINE - Applies to ALL states unless overridden
  // ==========================================================================
  federal: {
    designations: ['CSI', 'TSI', 'ATSI'],

    requiredComponents: [
      'comprehensive_needs_assessment',
      'root_cause_analysis',
      'evidence_based_interventions',
      'resource_equity_review',
      'stakeholder_engagement',
      'implementation_monitoring',
      'progress_tracking',
      'parent_community_engagement'
    ],

    implementationCycle: {
      csi: 3,      // years
      tsi: 1,      // years (annual)
      atsi: 3      // years
    },

    evidenceLevels: [
      {
        tier: 1,
        label: 'Strong Evidence',
        description: 'Evidence that a statistically significant effect on improving student outcomes has been demonstrated in at least one well-designed and well-implemented randomized controlled trial.'
      },
      {
        tier: 2,
        label: 'Moderate Evidence',
        description: 'Evidence that a meaningful effect on improving student outcomes has been demonstrated in at least one well-designed and well-implemented quasi-experimental study or multiple correlational studies with statistical controls for selection bias.'
      },
      {
        tier: 3,
        label: 'Promising Evidence',
        description: 'Evidence that a meaningful effect on improving student outcomes has been demonstrated in at least one well-designed and well-implemented experimental or quasi-experimental study.'
      },
      {
        tier: 4,
        label: 'Demonstrates Rationale',
        description: 'A logic model or program theory that is informed by research or an evaluation that suggests the program or practice is likely to improve student outcomes.'
      }
    ],

    designationDefinitions: {
      CSI: {
        fullName: 'Comprehensive Support and Improvement',
        criteria: [
          'Bottom 5% of Title I schools (overall performance)',
          'Graduation rate of 67% or lower',
          'High schools failing to graduate one-third or more of students'
        ],
        planRequired: true,
        strIctestRequirements: true,
        exitCriteria: 'Three-year improvement to exit designation',
        determinationCycle: 'Three-year cycle'
      },
      TSI: {
        fullName: 'Targeted Support and Improvement',
        criteria: [
          'Any student subgroup performing at bottom threshold',
          'Consistently underperforming subgroup for 2-3 consecutive years'
        ],
        planRequired: true,
        annualDetermination: true,
        exitCriteria: 'Subgroup no longer meets TSI entry criteria',
        determinationCycle: 'Annual'
      },
      ATSI: {
        fullName: 'Additional Targeted Support and Improvement',
        criteria: [
          'Student subgroup(s) performing as low as bottom 5% of schools',
          'NOT eligible for CSI',
          'Subgroup-specific underperformance'
        ],
        planRequired: true,
        determinationCycle: 'Three-year cycle'
      }
    }
  },

  // ==========================================================================
  // PER-STATE CONFIGURATIONS
  // All 50 states + DC (51 total jurisdictions), alphabetically organized
  // ==========================================================================

  states: {

    // ALABAMA
    'AL': {
      name: 'Alabama',
      abbreviation: 'AL',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools or graduation rate 67% or lower' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5% of schools' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Alabama School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District-level approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'Graduation rates', 'Chronic absenteeism', 'English language learners'],
      assessmentName: 'Alabama Standardized Tests (AST)',
      accountabilityMeasures: ['State assessment proficiency', 'Graduation rates', 'Academic growth', 'College and career readiness'],
      parentEngagementRequirements: 'Meaningful parent involvement in plan development and progress monitoring',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // ALASKA
    'AK': {
      name: 'Alaska',
      abbreviation: 'AK',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: '1-3 star schools (low performing)' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        universal: { name: 'Universal Support', fullName: 'Universal Support and Improvement', criteria: 'All schools eligible' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Alaska School Performance Rating System (1-5 stars)',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District-level approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'Early literacy', 'Alaska Native education', 'Rural school support'],
      assessmentName: 'Alaska Measure of Progress (AMP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'Chronic absenteeism'],
      parentEngagementRequirements: 'Required community partnerships and parent engagement',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // ARIZONA
    'AZ': {
      name: 'Arizona',
      abbreviation: 'AZ',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Arizona Department of Education Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District-level approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'Math and reading proficiency', 'Graduation rates'],
      assessmentName: 'Arizona Assessment Program (AAP)',
      accountabilityMeasures: ['State assessment proficiency', 'Academic growth', 'Graduation rates', 'College readiness'],
      parentEngagementRequirements: 'Meaningful parent involvement required',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // ARKANSAS
    'AR': {
      name: 'Arkansas',
      abbreviation: 'AR',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Arkansas School Accountability Index',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District-level approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Early literacy', 'Mathematics proficiency', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Arkansas Assessment of Student Performance (AASP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'Postsecondary readiness'],
      parentEngagementRequirements: 'Required parent notification and engagement',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // CALIFORNIA
    'CA': {
      name: 'California',
      abbreviation: 'CA',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools on California School Dashboard' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup performing poorly' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'California School Dashboard',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'state_indicators_alignment'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and school board approval',
      submissionDeadline: 'Varies by district; integrated with LCAP timeline',
      planTemplate: 'School Plan for Student Achievement (SPSA) or Local Control and Accountability Plan (LCAP)',
      focusAreas: ['Academic achievement', 'English learners', 'Low-income students', 'Foster youth', 'Homeless youth'],
      exitCriteria: 'ATSI schools can exit annually if criteria no longer met (more flexible than federal minimum)',
      determinationCycle: 'Three-year cycle (began 2023-24)',
      assessmentName: 'California Assessment of Student Performance and Progress (CAASPP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career indicators'],
      parentEngagementRequirements: 'Meaningful parent participation required; community engagement emphasized',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required - integrated with LCAP community engagement'
    },

    // COLORADO
    'CO': {
      name: 'Colorado',
      abbreviation: 'CO',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Colorado Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and school board approval',
      submissionDeadline: 'Varies by district',
      planTemplate: 'Unified Improvement Plan',
      focusAreas: ['Academic achievement', 'English language learners', 'Math and reading proficiency', 'Graduation rates'],
      assessmentName: 'Colorado Measures of Academic Performance (CMAP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College readiness'],
      parentEngagementRequirements: 'Required stakeholder involvement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // CONNECTICUT
    'CT': {
      name: 'Connecticut',
      abbreviation: 'CT',
      designations: {
        csi: { name: 'CSI (Turnaround Schools)', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools in state' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Connecticut Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'regular_progress_sharing'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval required; state oversight',
      submissionDeadline: 'Varies by district',
      planTemplate: 'Comprehensive Support and Improvement Plan (CSIP)',
      focusAreas: ['Academic achievement', 'English learners', 'Special education', 'Chronic absenteeism'],
      assessmentName: 'Connecticut Mastery Test (CMT) / SBAC (Smarter Balanced Assessment Consortium)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'Attendance'],
      parentEngagementRequirements: 'Meaningful stakeholder input required; partnership approach emphasized',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required - strong emphasis on partnership'
    },

    // DELAWARE
    'DE': {
      name: 'Delaware',
      abbreviation: 'DE',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Delaware School Improvement Framework',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and state approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Delaware Assessment of Student Performance (DASP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'Career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout plan development and implementation',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // DISTRICT OF COLUMBIA
    'DC': {
      name: 'District of Columbia',
      abbreviation: 'DC',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'DC ESSA Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'LEA approval; OSSE oversight',
      submissionDeadline: 'Varies by LEA',
      planTemplate: 'School Improvement Plan (available from OSSE)',
      focusAreas: ['Academic achievement', 'English learners', 'Students experiencing homelessness', 'College access'],
      assessmentName: 'DC PARCC / SBAC (Smarter Balanced)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College enrollment'],
      parentEngagementRequirements: 'Required meaningful engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // FLORIDA
    'FL': {
      name: 'Florida',
      abbreviation: 'FL',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'D/F school grades (exceeds federal)' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'all_schools',
      performanceFramework: 'Florida School Grades System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'data_driven_improvement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval',
      submissionDeadline: 'Varies by district',
      planTemplate: 'Florida Continuous Improvement Management System (CIMS) - floridacims.org',
      focusAreas: ['Academic achievement', 'Reading proficiency', 'Mathematics proficiency', 'Graduation rates', 'College readiness'],
      uniQueLimitation: 'Requires SIPs for ALL schools with D/F grades, not just federally designated schools',
      assessmentName: 'Florida Assessment of Student Thinking (FAST)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College readiness'],
      parentEngagementRequirements: 'Required parent notification and engagement',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // GEORGIA
    'GA': {
      name: 'Georgia',
      abbreviation: 'GA',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Georgia School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and local board approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Georgia Milestone Assessment System',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent involvement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // HAWAII
    'HI': {
      name: 'Hawaii',
      abbreviation: 'HI',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools identified for support and improvement' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Hawaii Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'at_risk_student_focus'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and state approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'Native Hawaiian education', 'English learners', 'College and career readiness'],
      assessmentName: 'Smarter Balanced Assessment Consortium (SBAC)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College enrollment'],
      parentEngagementRequirements: 'Community partnerships and parent focus required',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required - emphasis on community partnerships'
    },

    // IDAHO
    'ID': {
      name: 'Idaho',
      abbreviation: 'ID',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Idaho School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'Mathematics and reading proficiency', 'Graduation rates', 'College readiness'],
      assessmentName: 'Idaho Standards Achievement Test (ISAT)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // ILLINOIS
    'IL': {
      name: 'Illinois',
      abbreviation: 'IL',
      designations: {
        exemplary: { name: 'Exemplary', fullName: 'Exemplary Performance', criteria: 'Highest performing schools' },
        commendable: { name: 'Commendable', fullName: 'Commendable Performance', criteria: 'Above average performing schools' },
        targeted: { name: 'Targeted', fullName: 'Targeted Support', criteria: 'Below average performing schools' },
        comprehensive: { name: 'Comprehensive', fullName: 'Comprehensive Support', criteria: 'Lowest performing schools' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Illinois School Accountability System (Tier system)',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic growth', 'Academic proficiency', 'Chronic absenteeism', 'English language learners'],
      evaluationIndicators: 8,
      assessmentName: 'Illinois Assessment of Student Performance (IASP)',
      accountabilityMeasures: ['Academic growth', 'Academic proficiency', 'Chronic absenteeism', 'Other achievement indicators'],
      parentEngagementRequirements: 'Required stakeholder engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // INDIANA
    'IN': {
      name: 'Indiana',
      abbreviation: 'IN',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'all_schools',
      performanceFramework: 'Indiana School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'attendance_objectives',
        'proficiency_objectives',
        'graduation_rate_objectives'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; more rigorous for designated schools',
      submissionDeadline: 'Varies by district',
      planTemplate: 'Consolidated Comprehensive Needs Assessment (CNA) / School Improvement Plan (SIP)',
      focusAreas: ['Academic achievement', 'Attendance', 'ILEARN proficiency', 'Graduation rates', 'Immediate improvement areas'],
      uniQueFeature: 'Three-year strategic improvement plan required for ALL schools; formal SIP only for designated schools',
      assessmentName: 'ILEARN (Indiana Learning Evaluation Assessment Readiness for the Next Generation)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'Postsecondary readiness'],
      parentEngagementRequirements: 'Required parent notification and engagement',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // IOWA
    'IA': {
      name: 'Iowa',
      abbreviation: 'IA',
      designations: {
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools identified for improvement from Iowa profiles' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Iowa School Performance Profiles',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and state approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['ELA and math proficiency', 'Science', 'Academic growth', 'Chronic absenteeism', 'Graduation rates', 'Postsecondary readiness'],
      assessmentName: 'Iowa Assessments',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Chronic absenteeism', 'Graduation rates', 'Postsecondary readiness'],
      parentEngagementRequirements: 'Required stakeholder involvement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // KANSAS
    'KS': {
      name: 'Kansas',
      abbreviation: 'KS',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Kansas Accountability and School Finance System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval',
      submissionDeadline: 'Varies by district',
      performanceGoal: '75% proficiency for all students and subgroups by 2029-30',
      focusAreas: ['Academic achievement', 'ELA and math proficiency', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Kansas Assessment Program (KAP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout implementation',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // KENTUCKY
    'KY': {
      name: 'Kentucky',
      abbreviation: 'KY',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Kentucky School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and state approval',
      submissionDeadline: 'Varies by district',
      focusAreas: ['4th-grade reading proficiency', '4th-grade mathematics proficiency', 'Graduation rates', 'College and career readiness'],
      recentAchievement: 'Sustained 4th-grade reading and math improvements through 2024',
      assessmentName: 'Kentucky State Assessment (KSA)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // LOUISIANA
    'LA': {
      name: 'Louisiana',
      abbreviation: 'LA',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Louisiana School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'ELA and math proficiency', 'Graduation rates', 'College and career readiness'],
      recentAchievement: 'Sustained 4th-grade reading and math improvements through 2024',
      assessmentName: 'Louisiana State Assessment (LEAP 2025)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout planning and implementation',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MAINE
    'ME': {
      name: 'Maine',
      abbreviation: 'ME',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Maine School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Maine State Assessment (Smarter Balanced)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career indicators'],
      parentEngagementRequirements: 'Required meaningful parent engagement',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MARYLAND
    'MD': {
      name: 'Maryland',
      abbreviation: 'MD',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Overall bottom 5%, graduation <67%, or non-improving TSI after 3 years' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Individual student group at bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Maryland School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state approval',
      submissionDeadline: 'October 15 annually',
      planTemplate: 'Local ESSA Consolidated Strategic Plan',
      focusAreas: ['Academic achievement', 'English language learners', 'Graduation rates', 'College and career readiness'],
      tsiCriteria: 'Individual student group performs as low as bottom 5%',
      csiCriteria: ['Overall bottom 5%', 'Graduation rate <67%', 'TSI school not improving after 3 years'],
      assessmentName: 'Maryland Assessment Program (MAP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement and notification',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MASSACHUSETTS
    'MA': {
      name: 'Massachusetts',
      abbreviation: 'MA',
      designations: {
        comprehensive: { name: 'Comprehensive Support', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        targeted: { name: 'Targeted Support', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Massachusetts School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'annual_plan_requirement',
        'inequity_analysis'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies; consistent with district plan',
      planTemplate: 'Annual School Improvement Plan consistent with district plan',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      turnaroundFocus: 'Turnaround plans include inequity analysis',
      assessmentName: 'MCAS (Massachusetts Comprehensive Assessment System) / SBAC',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College enrollment'],
      parentEngagementRequirements: 'Required parent engagement throughout planning and implementation',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MICHIGAN
    'MI': {
      name: 'Michigan',
      abbreviation: 'MI',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Michigan School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'September 1 annually',
      legalRequirement: 'Michigan Revised School Code MCL 380.1277',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Michigan Assessment Program (M-STEP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MINNESOTA
    'MN': {
      name: 'Minnesota',
      abbreviation: 'MN',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Minnesota School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District/charter in partnership with stakeholders',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Equity focus'],
      assessmentName: 'Minnesota Comprehensive Assessment (MCA)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'District/charter must develop SIP in partnership with stakeholders',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MISSISSIPPI
    'MS': {
      name: 'Mississippi',
      abbreviation: 'MS',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Mississippi School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'technical_assistance'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      statePlan: 'Mississippi Succeeds Plan',
      approach: 'Technical assistance and interventions for struggling schools',
      recentAchievement: 'Sustained 4th-grade reading and math improvements through 2024',
      assessmentName: 'Mississippi Assessment Program (MAP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent notification and engagement',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MISSOURI
    'MO': {
      name: 'Missouri',
      abbreviation: 'MO',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Missouri School Improvement Plan (MSIP)',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      csiIdentification: 'Bottom 5% of Title I schools',
      assessmentName: 'Missouri Assessment Program (MAP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // MONTANA
    'MT': {
      name: 'Montana',
      abbreviation: 'MT',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Montana School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Rural school support'],
      assessmentName: 'Montana Assessment of Student Performance (MASP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // NEBRASKA
    'NE': {
      name: 'Nebraska',
      abbreviation: 'NE',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Nebraska School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      performanceGoal: 'Half the percent of students below proficient by 2029-30',
      focusAreas: ['Academic achievement', 'ELA and math proficiency', 'Graduation rates', 'College and career readiness'],
      assessmentName: 'Nebraska State Accountability (NeSA)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout implementation',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // NEVADA - MOST DETAILED (JT's home state)
    'NV': {
      name: 'Nevada',
      abbreviation: 'NV',
      designations: {
        csi: {
          name: 'CSI',
          fullName: 'Comprehensive Support and Improvement',
          criteria: 'Bottom 5% of Title I schools, graduation rate 67% or lower, or high schools failing to graduate 1/3+ of students',
          planRequired: true,
          strictestRequirements: true
        },
        tsi: {
          name: 'TSI',
          fullName: 'Targeted Support and Improvement',
          criteria: 'Any student subgroup performing at bottom threshold for 2-3 consecutive years',
          planRequired: true,
          annualDetermination: true
        },
        atsi: {
          name: 'ATSI',
          fullName: 'Additional Targeted Support and Improvement',
          criteria: 'Student subgroup(s) performing as low as bottom 5% of schools, NOT CSI-eligible',
          planRequired: true,
          determinationCycle: 'Three-year cycle'
        }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Nevada School Performance Framework (NSPF)',
      implementationTimeline: 'Three-year implementation period',
      development: 'School works with LEA during designation year',
      csiFunding: 'Eligible for federal improvement funds',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'essa_evidence_level_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'quarterly_progress_updates',
        'parent_community_engagement',
        'literacy_focus',
        'el_skills_development',
        'discipline_management',
        'attendance_improvement',
        'curriculum_alignment',
        'assessment_strategies',
        'instructional_practices',
        'professional_learning',
        'technology_integration',
        'graduation_rate_improvement',
        'resource_allocation_equity'
      ],
      optionalComponents: ['extended_school_year', 'summer_programs', 'tutoring_services', 'mentoring_programs'],
      approvalAuthority: 'District-level approval; Nevada DOE oversight and technical assistance',
      submissionDeadline: 'District timeline varies; state monitoring',
      planNames: ['CSI Plan', 'School Improvement Plan (SIP)', 'TSI Plan', 'Strategic Improvement Plan (SPP)'],
      focusAreas: [
        'Literacy and reading instruction',
        'English language learner (EL) skill development',
        'School discipline and student conduct',
        'Student attendance and chronic absenteeism',
        'Curriculum alignment and standards',
        'Assessment strategies and data use',
        'Instructional practices and classroom management',
        'Professional learning and teacher development',
        'Technology access and integration',
        'Graduation rates and student progression',
        'Resource allocation and budget equity'
      ],
      gradeLevels: {
        ela: ['3', '4', '5', '6', '7', '8', '11'],
        math: ['3', '4', '5', '6', '7', '8', '11'],
        science: ['5', '8', '11']
      },
      assessmentName: 'Smarter Balanced Assessment Consortium (SBAC) / Nevada State Assessments',
      accountabilityMeasures: [
        'Academic proficiency in ELA and Mathematics',
        'Academic growth',
        'Graduation rates (4-year, 5-year, 6-year)',
        'English learner progress',
        'Chronic absenteeism',
        'College and career readiness'
      ],
      parentEngagementRequirements: 'Meaningful parent and community engagement throughout plan development and implementation; quarterly updates to parents',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required - quarterly progress updates and parent communication',
      keyResource: 'Nevada Department of Education School Improvement Office',
      evidenceLevelDefinitions: {
        strong: 'Statistically significant effect demonstrated in well-designed randomized controlled trial',
        moderate: 'Meaningful effect demonstrated in quasi-experimental study with controls',
        promising: 'Meaningful effect demonstrated in experimental or quasi-experimental study',
        rationale: 'Logic model or program theory informed by research suggesting improvement likelihood'
      },
      additionalRequirements: [
        'Annual plan review and update',
        'Quarterly progress monitoring against performance targets',
        'Monthly or quarterly School Improvement Team (SIT) meetings',
        'Data-informed decision making throughout implementation',
        'Fidelity monitoring and adjustment as needed'
      ]
    },

    // NEW HAMPSHIRE
    'NH': {
      name: 'New Hampshire',
      abbreviation: 'NH',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'New Hampshire School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'New Hampshire State Assessment (NHSA)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // NEW JERSEY
    'NJ': {
      name: 'New Jersey',
      abbreviation: 'NJ',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'New Jersey School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'NJSLA (New Jersey Student Learning Assessment)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // NEW MEXICO
    'NM': {
      name: 'New Mexico',
      abbreviation: 'NM',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'New Mexico School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'Bilingual education', 'College and career readiness'],
      assessmentName: 'NMSA Plus (New Mexico Standards Assessment)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // NEW YORK
    'NY': {
      name: 'New York',
      abbreviation: 'NY',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'New York State Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'job_embedded_professional_development',
        'specific_initiatives_targeting_accountability_areas'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and NYSED approval required',
      submissionDeadline: 'Varies by district',
      planTemplate: 'School Comprehensive Education Plan',
      accountabilityIndicators: '5 (elementary/middle), 6 (high school)',
      planRequirement: 'Based on needs assessment with meaningful parent, staff, and student participation',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'New York State Assessment (NYSED assessments including REGENTS)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Meaningful parent, staff, and student participation required',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // NORTH CAROLINA
    'NC': {
      name: 'North Carolina',
      abbreviation: 'NC',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'North Carolina School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'abbreviated_needs_assessment',
        'multi_year_improvement_plan',
        'csi_comprehensive_interventions',
        'monthly_sit_meetings',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and state approval required',
      submissionDeadline: 'Twice per year to state education agency',
      planTemplate: 'Comprehensive or Abbreviated Needs Assessment framework',
      planComponents: [
        'Multi-year improvement plan',
        'CSI comprehensive plan interventions',
        'Monthly SIT meetings with documentation',
        'Annual parent notification by November 30'
      ],
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'North Carolina EOG/EOC (End of Grade/Course)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Annual parent notification by November 30; regular progress communication',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // NORTH DAKOTA
    'ND': {
      name: 'North Dakota',
      abbreviation: 'ND',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Highest proportion of struggling students' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Annual selection from 3-year consecutive underperformers (bottom 10-20%)' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'North Dakota School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      csiSelection: 'Every 3 years; identifies highest proportion of struggling students',
      tsiSelection: 'Annually from 3-year consecutive underperformers (bottom 10-20%)',
      focusAreas: ['Student achievement', 'Choice readiness', 'Graduation rates', 'EL achievement', 'Academic growth'],
      indicators: ['Student achievement', 'Choice readiness', 'Graduation rate', 'EL achievement', 'Composite growth model'],
      assessmentName: 'North Dakota State Assessment (NDSA)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'EL progress'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // OHIO
    'OH': {
      name: 'Ohio',
      abbreviation: 'OH',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest-performing schools identified per ESSA' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Ohio School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Ohio Assessment for Improvement and Accountability (OAIA)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // OKLAHOMA
    'OK': {
      name: 'Oklahoma',
      abbreviation: 'OK',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Oklahoma School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Oklahoma School Testing Program (OSTP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // OREGON
    'OR': {
      name: 'Oregon',
      abbreviation: 'OR',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Oregon School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'local_data_driven_improvement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      approach: 'Local data and context-driven improvement; schools receive support addressing local problems they face',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Oregon Assessment of Student Performance and Progress (OASPP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development and implementation',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // PENNSYLVANIA
    'PA': {
      name: 'Pennsylvania',
      abbreviation: 'PA',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Pennsylvania School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'collaborative_root_cause_analysis'
      ],
      optionalComponents: [],
      approvalAuthority: 'Board of School Directors or Charter School approval; LEA level',
      submissionDeadline: 'Varies by district',
      tsiRequirement: 'Building-level SIPs with LEA Board approval',
      approach: 'Collaboration to identify root causes and implement evidence-based actions',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Pennsylvania Standardized Assessment System (PSAS)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout planning process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // RHODE ISLAND
    'RI': {
      name: 'Rhode Island',
      abbreviation: 'RI',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Rhode Island School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement',
        'community_advisory_boards'
      ],
      optionalComponents: [],
      approvalAuthority: 'District and state approval required',
      submissionDeadline: 'Varies by district',
      planTemplate: 'Comprehensive Support and Improvement Plans (CSIPs)',
      planComponents: [
        'Needs assessment',
        'Root cause analysis',
        'Community Advisory Boards (CAB)',
        'RI Regulation and General Law requirements compliance',
        'ESSA federal requirements compliance'
      ],
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Rhode Island Assessment System (RIAS)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Community Advisory Boards required for meaningful engagement',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required - CAB involvement emphasized'
    },

    // SOUTH CAROLINA
    'SC': {
      name: 'South Carolina',
      abbreviation: 'SC',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'South Carolina School Improvement Designation Framework',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      determination: 'Every 3 years minimum',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'South Carolina Assessment Program (SCAP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // SOUTH DAKOTA
    'SD': {
      name: 'South Dakota',
      abbreviation: 'SD',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'South Dakota School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Over one year with stakeholder input',
      planDevelopment: 'Over one year with stakeholder input (educators, parents, students, legislators, tribal representatives, higher ed)',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Tribal education partnerships'],
      assessmentName: 'South Dakota State Assessment (SDSA)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required stakeholder input including educators, parents, students, legislators, tribal representatives',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required - broad stakeholder inclusion'
    },

    // TENNESSEE
    'TN': {
      name: 'Tennessee',
      abbreviation: 'TN',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Tennessee School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'Early literacy (grades K-4)', 'College and career readiness', 'Chronic absenteeism'],
      recentAchievement: 'Notable improvement in lower grades',
      assessmentName: 'Tennessee Assessment System (TNReady)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // TEXAS
    'TX': {
      name: 'Texas',
      abbreviation: 'TX',
      designations: {
        csi: { name: 'CSI (Comprehensive Support)', fullName: 'Comprehensive Support and Improvement', criteria: 'First unacceptable rating' },
        tsi: { name: 'TS (Targeted Support)', fullName: 'Targeted Support', criteria: 'Underperforming subgroup' },
        atsi: { name: 'ATS (Additional Targeted Support)', fullName: 'Additional Targeted Support', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Texas A-F Accountability System',
      requiredComponents: [
        'root_cause_analysis',
        'focused_priorities',
        'clear_timelines_and_milestones',
        'metrics_and_task_owners',
        'data_sources_for_progress_monitoring'
      ],
      optionalComponents: [],
      approvalAuthority: 'Superintendent approval only; no public hearing required',
      submissionDeadline: 'November 14 (for preliminary 2025 A-F ratings)',
      planTemplate: 'Local Improvement Plan (LIP) - can be any format; typically Campus Improvement Plan with remedial action steps',
      formatFlexibility: 'Can be any format; typically Campus Improvement Plan',
      submissionRequirement: 'Not required to TEA unless requested',
      tsiAtsRequirement: 'Required for TSI and ATS campuses',
      csiRequirement: 'First unacceptable count must develop and submit by deadline',
      planComponents: [
        'Root cause analysis',
        'Few focused priorities',
        'Clear timelines and milestones',
        'Metrics and task owners',
        'Data sources for progress monitoring'
      ],
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Texas Assessment of Student Performance (TASP) / STAAR (State of Texas Assessments of Academic Readiness)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Parent notification and engagement required',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // UTAH
    'UT': {
      name: 'Utah',
      abbreviation: 'UT',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Utah School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Utah Assessment System (UAS)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // VERMONT
    'VT': {
      name: 'Vermont',
      abbreviation: 'VT',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Vermont School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Vermont Assessment of Student Performance and Progress (VASPP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // VIRGINIA
    'VA': {
      name: 'Virginia',
      abbreviation: 'VA',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Consistently underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Virginia School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      methodologyChanges: 'Recent revisions to identify consistently underperforming subgroups',
      recentFocus: 'Highest chronic absenteeism rates identification',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism', 'Equity'],
      assessmentName: 'Virginia Standards of Learning (SOL) Tests',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // WASHINGTON
    'WA': {
      name: 'Washington',
      abbreviation: 'WA',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Washington School Improvement Framework (WSIF)',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      planTemplate: 'Consolidated School Improvement Plan Template (2025-2026)',
      scoring: '1-10 scale combining multiple indicators',
      focusAreas: ['Graduation rates', 'Attendance', 'Math and ELA proficiency', 'College and career readiness'],
      indicators: ['Graduation rates', 'Attendance', 'Math and ELA proficiency'],
      assessmentName: 'Washington State Assessment System (Smarter Balanced / Science)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'Attendance', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement throughout process',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // WEST VIRGINIA
    'WV': {
      name: 'West Virginia',
      abbreviation: 'WV',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'West Virginia School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'Varies by district',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'West Virginia Assessment System (WVSS)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // WISCONSIN
    'WI': {
      name: 'Wisconsin',
      abbreviation: 'WI',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Bottom 5% of Title I schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Student subgroup at bottom threshold' },
        atsi: { name: 'ATSI', fullName: 'Additional Targeted Support and Improvement', criteria: 'Subgroup performing as low as bottom 5%' }
      },
      sipScope: 'designated_only',
      performanceFramework: 'Wisconsin School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; state oversight',
      submissionDeadline: 'May 23, 2025 (plan approval deadline)',
      integration: 'Aligns with State Systemic Improvement Plan (SSIP) under IDEA',
      focusAreas: ['Academic achievement', 'English language learners', 'College and career readiness', 'Chronic absenteeism'],
      assessmentName: 'Wisconsin Assessment of Student Performance (WASP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    },

    // WYOMING
    'WY': {
      name: 'Wyoming',
      abbreviation: 'WY',
      designations: {
        csi: { name: 'CSI', fullName: 'Comprehensive Support and Improvement', criteria: 'Below average and lowest performing schools' },
        tsi: { name: 'TSI', fullName: 'Targeted Support and Improvement', criteria: 'Schools with underperforming subgroups' }
      },
      sipScope: 'all_schools',
      performanceFramework: 'Wyoming School Accountability System',
      requiredComponents: [
        'comprehensive_needs_assessment',
        'schoolwide_improvement_plan_alignment',
        'root_cause_analysis',
        'evidence_based_interventions',
        'resource_equity_review',
        'stakeholder_engagement',
        'implementation_monitoring',
        'progress_tracking',
        'parent_community_engagement'
      ],
      optionalComponents: [],
      approvalAuthority: 'District board approval; annual requirement',
      submissionDeadline: 'Annual',
      planRequirement: 'Annual School Improvement Plan required for ALL schools',
      sipRequirement: 'Required for all schools annually based on CSI/TSI designation status',
      scoring: 'Normative category scores (1=below average, 2=average, 3=above average) per indicator',
      indicators: ['Academic performance', 'Readiness', 'Overall equity (traditional schools)', 'Other indicators (alternative schools)'],
      focusAreas: ['Academic achievement', 'College and career readiness', 'Equity focus', 'Chronic absenteeism'],
      uniQueFeature: 'Requires annual School Improvement Plans for ALL schools, not just designated',
      assessmentName: 'Wyoming Assessment of Student Performance and Progress (W-ASPP)',
      accountabilityMeasures: ['Academic proficiency', 'Academic growth', 'Graduation rates', 'College/career readiness'],
      parentEngagementRequirements: 'Required parent engagement in plan development',
      resourceEquityReview: true,
      communityEngagementLevel: 'Required'
    }
  },

  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================

  /**
   * Get configuration for a specific state
   * @param {string} stateAbbreviation - Two-letter state code (e.g., 'NV', 'CA')
   * @returns {object} State configuration object or null if not found
   */
  getStateConfig: function(stateAbbreviation) {
    const uppercaseAbbr = stateAbbreviation ? stateAbbreviation.toUpperCase() : null;
    return this.states[uppercaseAbbr] || null;
  },

  /**
   * Get required components for a specific state and designation type
   * @param {string} stateAbbreviation - Two-letter state code
   * @param {string} designation - 'CSI', 'TSI', or 'ATSI'
   * @returns {array} Array of required component keys
   */
  getRequiredComponents: function(stateAbbreviation, designation) {
    const stateConfig = this.getStateConfig(stateAbbreviation);
    if (!stateConfig) return null;

    // For now, return the state's required components
    // In future, could be differentiated by designation type
    return stateConfig.requiredComponents || this.federal.requiredComponents;
  },

  /**
   * Get designation information for a specific state
   * @param {string} stateAbbreviation - Two-letter state code
   * @returns {object} Designations object with CSI, TSI, ATSI definitions
   */
  getDesignationInfo: function(stateAbbreviation) {
    const stateConfig = this.getStateConfig(stateAbbreviation);
    if (!stateConfig) return null;
    return stateConfig.designations || null;
  },

  /**
   * Get all states as a sorted array
   * @returns {array} Array of objects with {abbr, name} for all 51 jurisdictions
   */
  getAllStates: function() {
    const statesList = [];
    for (const abbr in this.states) {
      if (this.states.hasOwnProperty(abbr)) {
        statesList.push({
          abbr: abbr,
          name: this.states[abbr].name
        });
      }
    }
    // Sort alphabetically by state name
    return statesList.sort((a, b) => a.name.localeCompare(b.name));
  },

  /**
   * Get all states that exceed federal requirements (all schools)
   * @returns {array} Array of state abbreviations that require SIPs for all schools
   */
  getStatesWithAllSchoolRequirement: function() {
    const allSchoolStates = [];
    for (const abbr in this.states) {
      if (this.states.hasOwnProperty(abbr) && this.states[abbr].sipScope === 'all_schools') {
        allSchoolStates.push(abbr);
      }
    }
    return allSchoolStates.sort();
  },

  /**
   * Get federal evidence level definition by tier
   * @param {number} tier - Evidence tier (1-4)
   * @returns {object} Evidence level definition with label and description
   */
  getEvidenceLevel: function(tier) {
    const level = this.federal.evidenceLevels.find(el => el.tier === tier);
    return level || null;
  },

  /**
   * Get all evidence levels
   * @returns {array} Array of all evidence level definitions
   */
  getAllEvidenceLevels: function() {
    return this.federal.evidenceLevels;
  },

  /**
   * Check if a state requires SIPs for all schools or only designated schools
   * @param {string} stateAbbreviation - Two-letter state code
   * @returns {boolean} True if all schools; false if designated only
   */
  isAllSchoolsSIPRequirement: function(stateAbbreviation) {
    const stateConfig = this.getStateConfig(stateAbbreviation);
    if (!stateConfig) return null;
    return stateConfig.sipScope === 'all_schools';
  },

  /**
   * Get count of total states and those with all-school requirements
   * @returns {object} Statistics object
   */
  getStatisticsCount: function() {
    const allSchools = this.getStatesWithAllSchoolRequirement();
    return {
      totalJurisdictions: Object.keys(this.states).length,
      designatedOnlyStates: Object.keys(this.states).length - allSchools.length,
      allSchoolsRequirementStates: allSchools.length,
      allSchoolsStates: allSchools
    };
  }

};

// Export for use in browser and Node environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = STATE_ESSA_CONFIG;
}
