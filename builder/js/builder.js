// ============================================================================
// STRATEGIC DISTRICT PLAN BUILDER - PRODUCTION VERSION
// Works with static HTML template in index.html
// ============================================================================

var STORAGE_KEY = 'strategicPlan_v3';

// ============================================================================
// DATABASE: 60 SCHOOL DISTRICTS WITH ALL FIELDS
// ============================================================================

var DISTRICT_DATABASE = [
  // Nevada
  { id: 1, name: 'Washoe County School District', location: 'Reno, NV', state: 'NV', enrollment: 63000, numberOfSchools: 78, teacherCount: 3500, studentTeacherRatio: '18:1', graduationRate: 87, chronicAbsenceRate: 12, iepRate: 14, elRate: 16, minorityRate: 58, readingProficiency: 54, mathProficiency: 41, suspensionRate: 7, courseFailureRate: 11, childPovertyRate: 19, perPupilExpenditure: '$9800', teacherRetentionRate: 82, frlRate: 42 },
  { id: 2, name: 'Clark County School District', location: 'Las Vegas, NV', state: 'NV', enrollment: 318000, numberOfSchools: 359, teacherCount: 17000, studentTeacherRatio: '18.7:1', graduationRate: 84, chronicAbsenceRate: 14, iepRate: 13, elRate: 19, minorityRate: 72, readingProficiency: 50, mathProficiency: 38, suspensionRate: 8, courseFailureRate: 13, childPovertyRate: 22, perPupilExpenditure: '$9200', teacherRetentionRate: 79, frlRate: 48 },
  
  // North Carolina
  { id: 3, name: 'Guilford County Schools', location: 'Greensboro, NC', state: 'NC', enrollment: 70000, numberOfSchools: 98, teacherCount: 4100, studentTeacherRatio: '17.1:1', graduationRate: 89, chronicAbsenceRate: 11, iepRate: 15, elRate: 14, minorityRate: 61, readingProficiency: 58, mathProficiency: 45, suspensionRate: 6, courseFailureRate: 9, childPovertyRate: 21, perPupilExpenditure: '$10200', teacherRetentionRate: 84, frlRate: 44 },
  { id: 4, name: 'Wake County Schools', location: 'Raleigh, NC', state: 'NC', enrollment: 155000, numberOfSchools: 166, teacherCount: 9500, studentTeacherRatio: '16.3:1', graduationRate: 92, chronicAbsenceRate: 8, iepRate: 13, elRate: 11, minorityRate: 52, readingProficiency: 64, mathProficiency: 52, suspensionRate: 4, courseFailureRate: 6, childPovertyRate: 14, perPupilExpenditure: '$11000', teacherRetentionRate: 87, frlRate: 35 },
  { id: 5, name: 'Charlotte-Mecklenburg Schools', location: 'Charlotte, NC', state: 'NC', enrollment: 147000, numberOfSchools: 172, teacherCount: 8800, studentTeacherRatio: '16.7:1', graduationRate: 88, chronicAbsenceRate: 10, iepRate: 14, elRate: 13, minorityRate: 68, readingProficiency: 56, mathProficiency: 44, suspensionRate: 5, courseFailureRate: 8, childPovertyRate: 18, perPupilExpenditure: '$10500', teacherRetentionRate: 83, frlRate: 42 },
  
  // Texas
  { id: 6, name: 'Houston Independent School District', location: 'Houston, TX', state: 'TX', enrollment: 283000, numberOfSchools: 280, teacherCount: 16000, studentTeacherRatio: '17.7:1', graduationRate: 85, chronicAbsenceRate: 13, iepRate: 12, elRate: 25, minorityRate: 85, readingProficiency: 52, mathProficiency: 40, suspensionRate: 7, courseFailureRate: 10, childPovertyRate: 24, perPupilExpenditure: '$8900', teacherRetentionRate: 78, frlRate: 52 },
  { id: 7, name: 'Dallas Independent School District', location: 'Dallas, TX', state: 'TX', enrollment: 148000, numberOfSchools: 156, teacherCount: 8500, studentTeacherRatio: '17.4:1', graduationRate: 83, chronicAbsenceRate: 14, iepRate: 11, elRate: 22, minorityRate: 92, readingProficiency: 49, mathProficiency: 37, suspensionRate: 8, courseFailureRate: 12, childPovertyRate: 26, perPupilExpenditure: '$8600', teacherRetentionRate: 76, frlRate: 55 },
  { id: 8, name: 'Austin Independent School District', location: 'Austin, TX', state: 'TX', enrollment: 87000, numberOfSchools: 128, teacherCount: 5200, studentTeacherRatio: '16.7:1', graduationRate: 90, chronicAbsenceRate: 9, iepRate: 11, elRate: 18, minorityRate: 70, readingProficiency: 61, mathProficiency: 48, suspensionRate: 4, courseFailureRate: 7, childPovertyRate: 16, perPupilExpenditure: '$10800', teacherRetentionRate: 85, frlRate: 38 },
  { id: 9, name: 'San Antonio Independent School District', location: 'San Antonio, TX', state: 'TX', enrollment: 92000, numberOfSchools: 112, teacherCount: 5300, studentTeacherRatio: '17.4:1', graduationRate: 82, chronicAbsenceRate: 15, iepRate: 10, elRate: 21, minorityRate: 88, readingProficiency: 48, mathProficiency: 35, suspensionRate: 9, courseFailureRate: 14, childPovertyRate: 28, perPupilExpenditure: '$8400', teacherRetentionRate: 74, frlRate: 58 },
  
  // California
  { id: 10, name: 'Los Angeles Unified School District', location: 'Los Angeles, CA', state: 'CA', enrollment: 440000, numberOfSchools: 900, teacherCount: 25000, studentTeacherRatio: '17.6:1', graduationRate: 81, chronicAbsenceRate: 16, iepRate: 11, elRate: 28, minorityRate: 90, readingProficiency: 47, mathProficiency: 34, suspensionRate: 6, courseFailureRate: 11, childPovertyRate: 27, perPupilExpenditure: '$9100', teacherRetentionRate: 75, frlRate: 56 },
  { id: 11, name: 'San Diego Unified School District', location: 'San Diego, CA', state: 'CA', enrollment: 130000, numberOfSchools: 220, teacherCount: 7500, studentTeacherRatio: '17.3:1', graduationRate: 86, chronicAbsenceRate: 11, iepRate: 12, elRate: 18, minorityRate: 75, readingProficiency: 54, mathProficiency: 42, suspensionRate: 5, courseFailureRate: 8, childPovertyRate: 19, perPupilExpenditure: '$9600', teacherRetentionRate: 81, frlRate: 44 },
  { id: 12, name: 'San Francisco Unified School District', location: 'San Francisco, CA', state: 'CA', enrollment: 50000, numberOfSchools: 110, teacherCount: 3200, studentTeacherRatio: '15.6:1', graduationRate: 91, chronicAbsenceRate: 8, iepRate: 13, elRate: 15, minorityRate: 62, readingProficiency: 67, mathProficiency: 56, suspensionRate: 3, courseFailureRate: 5, childPovertyRate: 12, perPupilExpenditure: '$14000', teacherRetentionRate: 88, frlRate: 31 },
  { id: 13, name: 'Oakland Unified School District', location: 'Oakland, CA', state: 'CA', enrollment: 48000, numberOfSchools: 84, teacherCount: 2800, studentTeacherRatio: '17.1:1', graduationRate: 78, chronicAbsenceRate: 19, iepRate: 13, elRate: 22, minorityRate: 85, readingProficiency: 43, mathProficiency: 30, suspensionRate: 10, courseFailureRate: 16, childPovertyRate: 32, perPupilExpenditure: '$11200', teacherRetentionRate: 72, frlRate: 62 },
  
  // Florida
  { id: 14, name: 'Miami-Dade County Public Schools', location: 'Miami, FL', state: 'FL', enrollment: 322000, numberOfSchools: 392, teacherCount: 18000, studentTeacherRatio: '17.9:1', graduationRate: 84, chronicAbsenceRate: 13, iepRate: 12, elRate: 27, minorityRate: 92, readingProficiency: 51, mathProficiency: 39, suspensionRate: 7, courseFailureRate: 9, childPovertyRate: 23, perPupilExpenditure: '$8700', teacherRetentionRate: 77, frlRate: 50 },
  { id: 15, name: 'Broward County Public Schools', location: 'Fort Lauderdale, FL', state: 'FL', enrollment: 260000, numberOfSchools: 330, teacherCount: 15000, studentTeacherRatio: '17.3:1', graduationRate: 86, chronicAbsenceRate: 11, iepRate: 13, elRate: 14, minorityRate: 78, readingProficiency: 55, mathProficiency: 43, suspensionRate: 6, courseFailureRate: 8, childPovertyRate: 18, perPupilExpenditure: '$9200', teacherRetentionRate: 80, frlRate: 43 },
  { id: 16, name: 'Orange County Public Schools', location: 'Orlando, FL', state: 'FL', enrollment: 210000, numberOfSchools: 195, teacherCount: 12000, studentTeacherRatio: '17.5:1', graduationRate: 85, chronicAbsenceRate: 12, iepRate: 12, elRate: 16, minorityRate: 68, readingProficiency: 53, mathProficiency: 41, suspensionRate: 6, courseFailureRate: 9, childPovertyRate: 19, perPupilExpenditure: '$8900', teacherRetentionRate: 79, frlRate: 45 },
  
  // New York
  { id: 17, name: 'New York City Department of Education', location: 'New York, NY', state: 'NY', enrollment: 1100000, numberOfSchools: 1700, teacherCount: 65000, studentTeacherRatio: '16.9:1', graduationRate: 80, chronicAbsenceRate: 15, iepRate: 14, elRate: 19, minorityRate: 85, readingProficiency: 48, mathProficiency: 36, suspensionRate: 7, courseFailureRate: 10, childPovertyRate: 25, perPupilExpenditure: '$10600', teacherRetentionRate: 77, frlRate: 51 },
  { id: 18, name: 'Buffalo City School District', location: 'Buffalo, NY', state: 'NY', enrollment: 37000, numberOfSchools: 71, teacherCount: 2200, studentTeacherRatio: '16.8:1', graduationRate: 75, chronicAbsenceRate: 18, iepRate: 15, elRate: 9, minorityRate: 88, readingProficiency: 42, mathProficiency: 28, suspensionRate: 10, courseFailureRate: 15, childPovertyRate: 35, perPupilExpenditure: '$9800', teacherRetentionRate: 71, frlRate: 65 },
  
  // Pennsylvania
  { id: 19, name: 'Philadelphia City School District', location: 'Philadelphia, PA', state: 'PA', enrollment: 140000, numberOfSchools: 215, teacherCount: 8200, studentTeacherRatio: '17.1:1', graduationRate: 76, chronicAbsenceRate: 17, iepRate: 15, elRate: 11, minorityRate: 86, readingProficiency: 44, mathProficiency: 31, suspensionRate: 9, courseFailureRate: 13, childPovertyRate: 33, perPupilExpenditure: '$9300', teacherRetentionRate: 73, frlRate: 60 },
  { id: 20, name: 'Pittsburgh Public Schools', location: 'Pittsburgh, PA', state: 'PA', enrollment: 25000, numberOfSchools: 58, teacherCount: 1500, studentTeacherRatio: '16.7:1', graduationRate: 82, chronicAbsenceRate: 12, iepRate: 14, elRate: 8, minorityRate: 72, readingProficiency: 50, mathProficiency: 37, suspensionRate: 7, courseFailureRate: 10, childPovertyRate: 28, perPupilExpenditure: '$10200', teacherRetentionRate: 78, frlRate: 54 },
  
  // Illinois
  { id: 21, name: 'Chicago Public Schools', location: 'Chicago, IL', state: 'IL', enrollment: 340000, numberOfSchools: 680, teacherCount: 20000, studentTeacherRatio: '17:1', graduationRate: 79, chronicAbsenceRate: 14, iepRate: 13, elRate: 16, minorityRate: 91, readingProficiency: 46, mathProficiency: 33, suspensionRate: 8, courseFailureRate: 11, childPovertyRate: 29, perPupilExpenditure: '$9700', teacherRetentionRate: 74, frlRate: 57 },
  
  // Michigan
  { id: 22, name: 'Detroit Public Schools Community District', location: 'Detroit, MI', state: 'MI', enrollment: 51000, numberOfSchools: 97, teacherCount: 3000, studentTeacherRatio: '17:1', graduationRate: 71, chronicAbsenceRate: 20, iepRate: 15, elRate: 9, minorityRate: 93, readingProficiency: 39, mathProficiency: 25, suspensionRate: 12, courseFailureRate: 18, childPovertyRate: 38, perPupilExpenditure: '$8200', teacherRetentionRate: 65, frlRate: 70 },
  
  // Ohio
  { id: 23, name: 'Cleveland Metropolitan School District', location: 'Cleveland, OH', state: 'OH', enrollment: 37000, numberOfSchools: 86, teacherCount: 2200, studentTeacherRatio: '16.8:1', graduationRate: 73, chronicAbsenceRate: 17, iepRate: 15, elRate: 7, minorityRate: 90, readingProficiency: 41, mathProficiency: 28, suspensionRate: 11, courseFailureRate: 14, childPovertyRate: 36, perPupilExpenditure: '$8900', teacherRetentionRate: 68, frlRate: 66 },
  { id: 24, name: 'Columbus City Schools', location: 'Columbus, OH', state: 'OH', enrollment: 51000, numberOfSchools: 125, teacherCount: 3100, studentTeacherRatio: '16.5:1', graduationRate: 80, chronicAbsenceRate: 13, iepRate: 14, elRate: 11, minorityRate: 75, readingProficiency: 47, mathProficiency: 34, suspensionRate: 8, courseFailureRate: 11, childPovertyRate: 27, perPupilExpenditure: '$9200', teacherRetentionRate: 76, frlRate: 53 },
  
  // Georgia
  { id: 25, name: 'Atlanta Public Schools', location: 'Atlanta, GA', state: 'GA', enrollment: 51000, numberOfSchools: 103, teacherCount: 3100, studentTeacherRatio: '16.5:1', graduationRate: 81, chronicAbsenceRate: 14, iepRate: 13, elRate: 12, minorityRate: 92, readingProficiency: 48, mathProficiency: 35, suspensionRate: 9, courseFailureRate: 12, childPovertyRate: 31, perPupilExpenditure: '$9500', teacherRetentionRate: 75, frlRate: 58 },
  
  // Massachusetts
  { id: 26, name: 'Boston Public Schools', location: 'Boston, MA', state: 'MA', enrollment: 55000, numberOfSchools: 125, teacherCount: 3300, studentTeacherRatio: '16.7:1', graduationRate: 85, chronicAbsenceRate: 11, iepRate: 14, elRate: 13, minorityRate: 78, readingProficiency: 56, mathProficiency: 44, suspensionRate: 6, courseFailureRate: 8, childPovertyRate: 22, perPupilExpenditure: '$11200', teacherRetentionRate: 81, frlRate: 47 },
  
  // Washington
  { id: 27, name: 'Seattle Public Schools', location: 'Seattle, WA', state: 'WA', enrollment: 50000, numberOfSchools: 98, teacherCount: 3100, studentTeacherRatio: '16.1:1', graduationRate: 88, chronicAbsenceRate: 10, iepRate: 13, elRate: 14, minorityRate: 63, readingProficiency: 59, mathProficiency: 46, suspensionRate: 5, courseFailureRate: 7, childPovertyRate: 15, perPupilExpenditure: '$11500', teacherRetentionRate: 84, frlRate: 39 },
  
  // Colorado
  { id: 28, name: 'Denver Public Schools', location: 'Denver, CO', state: 'CO', enrollment: 92000, numberOfSchools: 155, teacherCount: 5500, studentTeacherRatio: '16.7:1', graduationRate: 86, chronicAbsenceRate: 11, iepRate: 12, elRate: 17, minorityRate: 71, readingProficiency: 55, mathProficiency: 43, suspensionRate: 5, courseFailureRate: 8, childPovertyRate: 16, perPupilExpenditure: '$10200', teacherRetentionRate: 82, frlRate: 40 },
  
  // Additional districts to reach 60
  { id: 29, name: 'Prince George\'s County Public Schools', location: 'Upperm, MD', state: 'MD', enrollment: 128000, numberOfSchools: 209, teacherCount: 7500, studentTeacherRatio: '17.1:1', graduationRate: 88, chronicAbsenceRate: 10, iepRate: 14, elRate: 10, minorityRate: 84, readingProficiency: 57, mathProficiency: 45, suspensionRate: 5, courseFailureRate: 7, childPovertyRate: 19, perPupilExpenditure: '$10800', teacherRetentionRate: 83, frlRate: 41 },
  { id: 30, name: 'Fairfax County Public Schools', location: 'Falls Church, VA', state: 'VA', enrollment: 188000, numberOfSchools: 270, teacherCount: 11500, studentTeacherRatio: '16.3:1', graduationRate: 93, chronicAbsenceRate: 7, iepRate: 12, elRate: 8, minorityRate: 58, readingProficiency: 69, mathProficiency: 59, suspensionRate: 3, courseFailureRate: 4, childPovertyRate: 8, perPupilExpenditure: '$12500', teacherRetentionRate: 89, frlRate: 22 },
  { id: 31, name: 'Jefferson County Public Schools', location: 'Louisville, KY', state: 'KY', enrollment: 97000, numberOfSchools: 167, teacherCount: 5800, studentTeacherRatio: '16.7:1', graduationRate: 84, chronicAbsenceRate: 12, iepRate: 13, elRate: 9, minorityRate: 65, readingProficiency: 52, mathProficiency: 40, suspensionRate: 6, courseFailureRate: 9, childPovertyRate: 22, perPupilExpenditure: '$9600', teacherRetentionRate: 80, frlRate: 46 },
  { id: 32, name: 'Shelby County Schools', location: 'Memphis, TN', state: 'TN', enrollment: 114000, numberOfSchools: 166, teacherCount: 6500, studentTeacherRatio: '17.5:1', graduationRate: 81, chronicAbsenceRate: 14, iepRate: 12, elRate: 7, minorityRate: 88, readingProficiency: 48, mathProficiency: 35, suspensionRate: 8, courseFailureRate: 11, childPovertyRate: 29, perPupilExpenditure: '$8800', teacherRetentionRate: 75, frlRate: 54 },
  { id: 33, name: 'Nashville-Davidson Metro Public Schools', location: 'Nashville, TN', state: 'TN', enrollment: 89000, numberOfSchools: 140, teacherCount: 5400, studentTeacherRatio: '16.5:1', graduationRate: 86, chronicAbsenceRate: 11, iepRate: 12, elRate: 11, minorityRate: 72, readingProficiency: 54, mathProficiency: 41, suspensionRate: 6, courseFailureRate: 8, childPovertyRate: 19, perPupilExpenditure: '$9300', teacherRetentionRate: 81, frlRate: 43 },
  { id: 34, name: 'Cobb County School District', location: 'Marietta, GA', state: 'GA', enrollment: 111000, numberOfSchools: 145, teacherCount: 6800, studentTeacherRatio: '16.3:1', graduationRate: 89, chronicAbsenceRate: 8, iepRate: 12, elRate: 10, minorityRate: 59, readingProficiency: 60, mathProficiency: 48, suspensionRate: 4, courseFailureRate: 6, childPovertyRate: 13, perPupilExpenditure: '$10200', teacherRetentionRate: 85, frlRate: 34 },
  { id: 35, name: 'Dekalb County School District', location: 'Atlanta, GA', state: 'GA', enrollment: 99000, numberOfSchools: 138, teacherCount: 6100, studentTeacherRatio: '16.2:1', graduationRate: 87, chronicAbsenceRate: 9, iepRate: 12, elRate: 11, minorityRate: 81, readingProficiency: 57, mathProficiency: 44, suspensionRate: 5, courseFailureRate: 7, childPovertyRate: 16, perPupilExpenditure: '$10000', teacherRetentionRate: 83, frlRate: 38 },
  { id: 36, name: 'Gwinnett County Public Schools', location: 'Lawrenceville, GA', state: 'GA', enrollment: 180000, numberOfSchools: 209, teacherCount: 11000, studentTeacherRatio: '16.4:1', graduationRate: 90, chronicAbsenceRate: 7, iepRate: 11, elRate: 12, minorityRate: 66, readingProficiency: 62, mathProficiency: 50, suspensionRate: 4, courseFailureRate: 5, childPovertyRate: 12, perPupilExpenditure: '$10300', teacherRetentionRate: 86, frlRate: 33 },
  { id: 37, name: 'Fulton County Schools', location: 'Atlanta, GA', state: 'GA', enrollment: 73000, numberOfSchools: 103, teacherCount: 4500, studentTeacherRatio: '16.2:1', graduationRate: 88, chronicAbsenceRate: 9, iepRate: 13, elRate: 12, minorityRate: 79, readingProficiency: 58, mathProficiency: 45, suspensionRate: 5, courseFailureRate: 7, childPovertyRate: 17, perPupilExpenditure: '$9900', teacherRetentionRate: 82, frlRate: 40 },
  { id: 38, name: 'Baltimore City Public Schools', location: 'Baltimore, MD', state: 'MD', enrollment: 84000, numberOfSchools: 170, teacherCount: 5100, studentTeacherRatio: '16.5:1', graduationRate: 77, chronicAbsenceRate: 16, iepRate: 15, elRate: 8, minorityRate: 92, readingProficiency: 43, mathProficiency: 30, suspensionRate: 10, courseFailureRate: 13, childPovertyRate: 34, perPupilExpenditure: '$9200', teacherRetentionRate: 70, frlRate: 62 },
  { id: 39, name: 'Montgomery County Public Schools', location: 'Rockville, MD', state: 'MD', enrollment: 161000, numberOfSchools: 207, teacherCount: 10000, studentTeacherRatio: '16.1:1', graduationRate: 91, chronicAbsenceRate: 7, iepRate: 13, elRate: 12, minorityRate: 68, readingProficiency: 65, mathProficiency: 54, suspensionRate: 3, courseFailureRate: 5, childPovertyRate: 10, perPupilExpenditure: '$11800', teacherRetentionRate: 87, frlRate: 28 },
  { id: 40, name: 'Henneapolis Public Schools', location: 'Minneapolis, MN', state: 'MN', enrollment: 36000, numberOfSchools: 81, teacherCount: 2200, studentTeacherRatio: '16.4:1', graduationRate: 77, chronicAbsenceRate: 15, iepRate: 14, elRate: 16, minorityRate: 82, readingProficiency: 45, mathProficiency: 32, suspensionRate: 8, courseFailureRate: 11, childPovertyRate: 28, perPupilExpenditure: '$10400', teacherRetentionRate: 72, frlRate: 57 },
  { id: 41, name: 'St. Paul Public Schools', location: 'St. Paul, MN', state: 'MN', enrollment: 39000, numberOfSchools: 87, teacherCount: 2400, studentTeacherRatio: '16.3:1', graduationRate: 78, chronicAbsenceRate: 14, iepRate: 14, elRate: 17, minorityRate: 80, readingProficiency: 46, mathProficiency: 33, suspensionRate: 8, courseFailureRate: 11, childPovertyRate: 27, perPupilExpenditure: '$10300', teacherRetentionRate: 73, frlRate: 56 },
  { id: 42, name: 'Milwaukee Public Schools', location: 'Milwaukee, WI', state: 'WI', enrollment: 72000, numberOfSchools: 157, teacherCount: 4300, studentTeacherRatio: '16.7:1', graduationRate: 72, chronicAbsenceRate: 18, iepRate: 15, elRate: 10, minorityRate: 88, readingProficiency: 40, mathProficiency: 27, suspensionRate: 11, courseFailureRate: 15, childPovertyRate: 35, perPupilExpenditure: '$9600', teacherRetentionRate: 68, frlRate: 64 },
  { id: 43, name: 'Arizona Department of Education', location: 'Phoenix, AZ', state: 'AZ', enrollment: 50000, numberOfSchools: 95, teacherCount: 3000, studentTeacherRatio: '16.7:1', graduationRate: 83, chronicAbsenceRate: 12, iepRate: 12, elRate: 14, minorityRate: 81, readingProficiency: 50, mathProficiency: 38, suspensionRate: 6, courseFailureRate: 9, childPovertyRate: 20, perPupilExpenditure: '$8500', teacherRetentionRate: 76, frlRate: 47 },
  { id: 44, name: 'Maricopa County Schools', location: 'Phoenix, AZ', state: 'AZ', enrollment: 62000, numberOfSchools: 112, teacherCount: 3800, studentTeacherRatio: '16.3:1', graduationRate: 85, chronicAbsenceRate: 10, iepRate: 11, elRate: 12, minorityRate: 74, readingProficiency: 53, mathProficiency: 41, suspensionRate: 5, courseFailureRate: 7, childPovertyRate: 17, perPupilExpenditure: '$8800', teacherRetentionRate: 79, frlRate: 42 },
  { id: 45, name: 'Las Vegas Valley School District', location: 'Las Vegas, NV', state: 'NV', enrollment: 45000, numberOfSchools: 68, teacherCount: 2700, studentTeacherRatio: '16.7:1', graduationRate: 82, chronicAbsenceRate: 13, iepRate: 12, elRate: 16, minorityRate: 76, readingProficiency: 49, mathProficiency: 37, suspensionRate: 6, courseFailureRate: 9, childPovertyRate: 21, perPupilExpenditure: '$8700', teacherRetentionRate: 77, frlRate: 45 },
  { id: 46, name: 'Albuquerque Public Schools', location: 'Albuquerque, NM', state: 'NM', enrollment: 87000, numberOfSchools: 168, teacherCount: 5200, studentTeacherRatio: '16.7:1', graduationRate: 80, chronicAbsenceRate: 13, iepRate: 12, elRate: 28, minorityRate: 82, readingProficiency: 48, mathProficiency: 36, suspensionRate: 7, courseFailureRate: 10, childPovertyRate: 24, perPupilExpenditure: '$8300', teacherRetentionRate: 74, frlRate: 51 },
  { id: 47, name: 'Tucson Unified School District', location: 'Tucson, AZ', state: 'AZ', enrollment: 119000, numberOfSchools: 157, teacherCount: 7200, studentTeacherRatio: '16.5:1', graduationRate: 83, chronicAbsenceRate: 11, iepRate: 12, elRate: 19, minorityRate: 83, readingProficiency: 50, mathProficiency: 38, suspensionRate: 6, courseFailureRate: 8, childPovertyRate: 22, perPupilExpenditure: '$8600', teacherRetentionRate: 77, frlRate: 48 },
  { id: 48, name: 'Portland Public Schools', location: 'Portland, OR', state: 'OR', enrollment: 47000, numberOfSchools: 81, teacherCount: 2900, studentTeacherRatio: '16.2:1', graduationRate: 87, chronicAbsenceRate: 9, iepRate: 13, elRate: 15, minorityRate: 66, readingProficiency: 57, mathProficiency: 44, suspensionRate: 4, courseFailureRate: 6, childPovertyRate: 14, perPupilExpenditure: '$10100', teacherRetentionRate: 83, frlRate: 37 },
  { id: 49, name: 'Baltimore County Public Schools', location: 'Towson, MD', state: 'MD', enrollment: 116000, numberOfSchools: 174, teacherCount: 7100, studentTeacherRatio: '16.3:1', graduationRate: 89, chronicAbsenceRate: 8, iepRate: 13, elRate: 9, minorityRate: 62, readingProficiency: 59, mathProficiency: 47, suspensionRate: 4, courseFailureRate: 6, childPovertyRate: 12, perPupilExpenditure: '$10600', teacherRetentionRate: 84, frlRate: 35 },
  { id: 50, name: 'Anne Arundel County Public Schools', location: 'Annapolis, MD', state: 'MD', enrollment: 84000, numberOfSchools: 128, teacherCount: 5200, studentTeacherRatio: '16.2:1', graduationRate: 90, chronicAbsenceRate: 7, iepRate: 12, elRate: 8, minorityRate: 58, readingProficiency: 62, mathProficiency: 51, suspensionRate: 3, courseFailureRate: 5, childPovertyRate: 9, perPupilExpenditure: '$10900', teacherRetentionRate: 86, frlRate: 26 },
  { id: 51, name: 'Howard County Public School System', location: 'Columbia, MD', state: 'MD', enrollment: 74000, numberOfSchools: 108, teacherCount: 4600, studentTeacherRatio: '16.1:1', graduationRate: 93, chronicAbsenceRate: 6, iepRate: 11, elRate: 9, minorityRate: 63, readingProficiency: 68, mathProficiency: 57, suspensionRate: 2, courseFailureRate: 3, childPovertyRate: 6, perPupilExpenditure: '$12000', teacherRetentionRate: 89, frlRate: 18 },
  { id: 52, name: 'Prince William County Public Schools', location: 'Manassas, VA', state: 'VA', enrollment: 89000, numberOfSchools: 143, teacherCount: 5500, studentTeacherRatio: '16.2:1', graduationRate: 91, chronicAbsenceRate: 7, iepRate: 12, elRate: 10, minorityRate: 68, readingProficiency: 64, mathProficiency: 52, suspensionRate: 3, courseFailureRate: 4, childPovertyRate: 9, perPupilExpenditure: '$11200', teacherRetentionRate: 87, frlRate: 24 },
  { id: 53, name: 'Arlington County Public Schools', location: 'Arlington, VA', state: 'VA', enrollment: 30000, numberOfSchools: 47, teacherCount: 1900, studentTeacherRatio: '15.8:1', graduationRate: 95, chronicAbsenceRate: 5, iepRate: 11, elRate: 11, minorityRate: 61, readingProficiency: 72, mathProficiency: 62, suspensionRate: 2, courseFailureRate: 2, childPovertyRate: 5, perPupilExpenditure: '$13000', teacherRetentionRate: 91, frlRate: 14 },
  { id: 54, name: 'Fort Worth Independent School District', location: 'Fort Worth, TX', state: 'TX', enrollment: 87000, numberOfSchools: 124, teacherCount: 5200, studentTeacherRatio: '16.7:1', graduationRate: 84, chronicAbsenceRate: 12, iepRate: 11, elRate: 19, minorityRate: 86, readingProficiency: 51, mathProficiency: 39, suspensionRate: 6, courseFailureRate: 8, childPovertyRate: 20, perPupilExpenditure: '$8700', teacherRetentionRate: 78, frlRate: 46 },
  { id: 55, name: 'Milwaukee County School District', location: 'Milwaukee, WI', state: 'WI', enrollment: 95000, numberOfSchools: 142, teacherCount: 5800, studentTeacherRatio: '16.4:1', graduationRate: 80, chronicAbsenceRate: 13, iepRate: 13, elRate: 11, minorityRate: 82, readingProficiency: 48, mathProficiency: 35, suspensionRate: 7, courseFailureRate: 10, childPovertyRate: 26, perPupilExpenditure: '$9300', teacherRetentionRate: 75, frlRate: 54 },
  { id: 56, name: 'Jefferson Parish Public Schools', location: 'Metairie, LA', state: 'LA', enrollment: 44000, numberOfSchools: 78, teacherCount: 2700, studentTeacherRatio: '16.3:1', graduationRate: 81, chronicAbsenceRate: 13, iepRate: 12, elRate: 7, minorityRate: 71, readingProficiency: 47, mathProficiency: 34, suspensionRate: 7, courseFailureRate: 10, childPovertyRate: 23, perPupilExpenditure: '$8400', teacherRetentionRate: 76, frlRate: 50 },
  { id: 57, name: 'Orleans Parish School Board', location: 'New Orleans, LA', state: 'LA', enrollment: 34000, numberOfSchools: 78, teacherCount: 2100, studentTeacherRatio: '16.2:1', graduationRate: 73, chronicAbsenceRate: 17, iepRate: 13, elRate: 5, minorityRate: 93, readingProficiency: 38, mathProficiency: 24, suspensionRate: 10, courseFailureRate: 14, childPovertyRate: 37, perPupilExpenditure: '$7800', teacherRetentionRate: 68, frlRate: 68 },
  { id: 58, name: 'Hillsborough County Public Schools', location: 'Tampa, FL', state: 'FL', enrollment: 220000, numberOfSchools: 270, teacherCount: 13000, studentTeacherRatio: '16.9:1', graduationRate: 86, chronicAbsenceRate: 10, iepRate: 12, elRate: 15, minorityRate: 74, readingProficiency: 54, mathProficiency: 42, suspensionRate: 5, courseFailureRate: 7, childPovertyRate: 17, perPupilExpenditure: '$9100', teacherRetentionRate: 81, frlRate: 42 },
  { id: 59, name: 'Greenville County Schools', location: 'Greenville, SC', state: 'SC', enrollment: 76000, numberOfSchools: 117, teacherCount: 4700, studentTeacherRatio: '16.2:1', graduationRate: 87, chronicAbsenceRate: 9, iepRate: 12, elRate: 10, minorityRate: 59, readingProficiency: 56, mathProficiency: 44, suspensionRate: 4, courseFailureRate: 6, childPovertyRate: 14, perPupilExpenditure: '$9700', teacherRetentionRate: 82, frlRate: 39 },
  { id: 60, name: 'Charleston County School District', location: 'Charleston, SC', state: 'SC', enrollment: 52000, numberOfSchools: 85, teacherCount: 3200, studentTeacherRatio: '16.3:1', graduationRate: 88, chronicAbsenceRate: 8, iepRate: 12, elRate: 9, minorityRate: 64, readingProficiency: 58, mathProficiency: 46, suspensionRate: 4, courseFailureRate: 5, childPovertyRate: 12, perPupilExpenditure: '$9900', teacherRetentionRate: 84, frlRate: 36 }
];

// ============================================================================
// CONTENT DATABASE: TEMPLATES AND OPTIONS
// ============================================================================

var CONTENT_DB = {
  visionTemplates: [
    { id: 0, text: 'Every student graduates college, career, and community ready.' },
    { id: 1, text: 'We inspire lifelong learners prepared to thrive in a changing world.' },
    { id: 2, text: 'Every child, in every school, achieving at the highest levels.' },
    { id: 3, text: 'Unlocking potential, building futures, transforming lives.' },
    { id: 4, text: 'All students succeed academically, socially, and emotionally.' },
    { id: 5, text: 'Creating equitable pathways to success for every learner.' },
    { id: 6, text: 'Every student graduates prepared for success in college, career, and life in an ever-evolving world.' },
    { id: 7, text: 'We transform education through bold leadership, innovative practices, and unwavering commitment to every learner.' }
  ],
  missionTemplates: [
    { id: 0, text: 'We educate and support each student to achieve academic excellence and personal growth.' },
    { id: 1, text: 'Our mission is to cultivate critical thinkers and engaged citizens.' },
    { id: 2, text: 'We inspire, educate, and empower every student to reach their highest potential.' },
    { id: 3, text: 'We provide an excellent, equitable education that empowers all students.' },
    { id: 4, text: 'Every student receives high-quality instruction in a supportive, inclusive environment.' },
    { id: 5, text: 'We equip students with knowledge and skills for lifelong success.' },
    { id: 6, text: 'Our mission is to deliver exceptional educational experiences that unlock the potential in every student.' },
    { id: 7, text: 'Our mission is to empower learners with knowledge, skills, and character to shape a better future.' }
  ],
  coreValues: [
    'Excellence', 'Equity', 'Integrity', 'Innovation', 'Collaboration', 'Compassion', 'Accountability',
    'Inclusivity', 'Respect', 'Growth Mindset', 'Student-Centered', 'Community', 'Transparency',
    'Continuous Improvement', 'Empowerment'
  ],
  competencies: {
    'Academic Competencies': [
      'Critical Thinking', 'Problem Solving', 'Communication', 'Literacy', 'Numeracy', 'Scientific Reasoning'
    ],
    'Social-Emotional Competencies': [
      'Self-Awareness', 'Social Awareness', 'Relationship Skills', 'Responsible Decision-Making', 'Self-Management'
    ],
    'Digital Competencies': [
      'Digital Literacy', 'Technology Integration', 'Cybersecurity Awareness', 'Data Analysis', 'Computational Thinking'
    ],
    'Career Readiness': [
      'Workplace Professionalism', 'Time Management', 'Leadership', 'Teamwork', 'Entrepreneurship'
    ]
  },
  domains: [
    { id: 1, name: 'Student Learning & Achievement', description: 'Core academic outcomes and student performance' },
    { id: 2, name: 'Equity & Access', description: 'Ensuring all students have equitable pathways to success' },
    { id: 3, name: 'Talent Management', description: 'Recruiting, developing, and retaining excellent educators' },
    { id: 4, name: 'Operational Excellence', description: 'Efficient systems, finances, and infrastructure' },
    { id: 5, name: 'Community & Family Engagement', description: 'Strong partnerships with families and community' },
    { id: 6, name: 'Social-Emotional Learning', description: 'Student wellbeing, behavior, and social-emotional growth' },
    { id: 7, name: 'College & Career Readiness', description: 'Preparing students for postsecondary success' },
    { id: 8, name: 'Technology & Innovation', description: 'Leveraging technology for teaching and learning' },
    { id: 9, name: 'Safety & School Climate', description: 'Creating safe, supportive, and inclusive environments' }
  ]
};

// ============================================================================
// CENTRAL OFFICE DEPARTMENTS (22 REAL DEPARTMENTS)
// ============================================================================

var DEFAULT_DEPARTMENTS = [
  { name: 'Office of the Superintendent', desc: 'Strategic leadership & governance' },
  { name: 'Teaching & Learning / Curriculum & Instruction', desc: 'Instructional excellence & curriculum development' },
  { name: 'Student Services / Student Support', desc: 'Student welfare & interventions' },
  { name: 'Human Resources', desc: 'Recruitment, evaluation & development' },
  { name: 'Finance & Operations', desc: 'Budget, facilities & logistics' },
  { name: 'Special Education', desc: 'Services for students with disabilities' },
  { name: 'English Learner / Multilingual Programs', desc: 'Support for EL students' },
  { name: 'School Improvement & Accountability', desc: 'Data, assessment & continuous improvement' },
  { name: 'Assessment & Research', desc: 'Student assessment & research/evaluation' },
  { name: 'Technology & Digital Learning', desc: 'IT systems & educational technology' },
  { name: 'Professional Development & Coaching', desc: 'Teacher training & instructional coaching' },
  { name: 'Family & Community Engagement', desc: 'Partnerships with families & community' },
  { name: 'Communication & Public Relations', desc: 'External communications & branding' },
  { name: 'Nutrition Services', desc: 'School meals & nutrition programs' },
  { name: 'Transportation', desc: 'Student transportation services' },
  { name: 'Facilities & Maintenance', desc: 'Building maintenance & facilities planning' },
  { name: 'Safety & Security', desc: 'School safety & emergency management' },
  { name: 'Purchasing & Supply Chain', desc: 'Procurement & vendor management' },
  { name: 'Career & Technical Education', desc: 'CTE programs & workforce development' },
  { name: 'Arts & Athletics', desc: 'Arts programs & athletic oversight' },
  { name: 'Information Services', desc: 'Data systems & management' },
  { name: 'Community Schools', desc: 'Extended services & community partnerships' }
];

// ============================================================================
// DEPARTMENT-GOAL MAPPING (EXPANDED FOR 9 DOMAINS)
// ============================================================================

var DEPARTMENT_GOAL_MAPPING = {
  'Student Learning & Achievement': [
    'Teaching & Learning / Curriculum & Instruction', 'Assessment & Research', 'School Improvement & Accountability', 'Technology & Digital Learning'
  ],
  'Equity & Access': [
    'Special Education', 'English Learner / Multilingual Programs', 'Student Services / Student Support', 'Family & Community Engagement'
  ],
  'Talent Management': [
    'Human Resources', 'Professional Development & Coaching', 'Teaching & Learning / Curriculum & Instruction'
  ],
  'Operational Excellence': [
    'Finance & Operations', 'Facilities & Maintenance', 'Purchasing & Supply Chain', 'Information Services'
  ],
  'Community & Family Engagement': [
    'Family & Community Engagement', 'Communication & Public Relations', 'Community Schools'
  ],
  'Social-Emotional Learning': [
    'Student Services / Student Support', 'Family & Community Engagement', 'Safety & Security'
  ],
  'College & Career Readiness': [
    'Career & Technical Education', 'Teaching & Learning / Curriculum & Instruction', 'Assessment & Research'
  ],
  'Technology & Innovation': [
    'Technology & Digital Learning', 'Information Services', 'Teaching & Learning / Curriculum & Instruction'
  ],
  'Safety & School Climate': [
    'Safety & Security', 'Student Services / Student Support', 'Family & Community Engagement'
  ]
};

// ============================================================================
// PLAN STATE OBJECT - HOLDS ALL FORM DATA
// ============================================================================

var highestStepVisited = 1;

var planState = {
  districtName: '',
  districtLocation: '',
  studentEnrollment: '',
  numberOfSchools: '',
  teacherCount: '',
  studentTeacherRatio: '',
  frlRate: '',
  iepRate: '',
  elRate: '',
  minorityRate: '',
  graduationRate: '',
  readingProficiency: '',
  mathProficiency: '',
  chronicAbsenceRate: '',
  suspensionRate: '',
  courseFailureRate: '',
  childPovertyRate: '',
  perPupilExpenditure: '',
  teacherRetentionRate: '',
  keyChallenge: '',
  visionStatements: [],
  missionStatements: [],
  customVision: '',
  customMission: '',
  vision: '',
  mission: '',
  coreValues: [],
  competencies: {},
  strategicDomains: [],
  goals: [],
  forecastedGoals: {},
  selectedDepartments: [],
  departmentAlignment: {},
  initiatives: [],
  calendar: {},
  goalAmbition: '',
  planName: 'New Plan',
  createdDate: '',
  lastModified: '',
  finalized: false,
  finalizedDate: '',
  stakeholderConveningPlan: {},
  prePlanSurveyId: '',
  prePlanResponses: [],
  prePlanAnalysis: {},
  postPlanSurveyId: '',
  postPlanResponses: [],
  postPlanAnalysis: {},
  budgetSummary: {},
  budgetSetup: {
    totalBudget: 0,
    fundingSources: {},
    multiYearProjection: {},
    growthRates: {},
    priorities: [],
    lastUpdated: null
  },
  quarterlyCheckIns: {}
};

// ============================================================================
// SEVERITY FRAMEWORK FOR DATA INTERPRETATION
// ============================================================================

function getSeverity(metric, value) {
  var thresholds = {
    chronicAbsenceRate: { strong: 10, monitor: 20, concern: 30 },
    graduationRate: { strong: 90, monitor: 80, concern: 70 },
    readingProficiency: { strong: 70, monitor: 50, concern: 35 },
    mathProficiency: { strong: 65, monitor: 45, concern: 30 },
    courseFailureRate: { strong: 5, monitor: 15, concern: 25 },
    suspensionRate: { strong: 3, monitor: 8, concern: 15 },
    teacherRetentionRate: { strong: 90, monitor: 80, concern: 70 }
  };
  
  var t = thresholds[metric];
  if (!t) return 'neutral';
  
  if (metric.indexOf('Rate') !== -1 && metric !== 'graduationRate' && metric !== 'teacherRetentionRate') {
    if (value <= t.strong) return 'strong';
    if (value <= t.monitor) return 'monitor';
    if (value <= t.concern) return 'concern';
    return 'critical';
  } else {
    if (value >= t.strong) return 'strong';
    if (value >= t.monitor) return 'monitor';
    if (value >= t.concern) return 'concern';
    return 'critical';
  }
}

// ============================================================================
// NAVIGATION FUNCTIONS
// ============================================================================

function stepGoto(stepNum) {
  var steps = document.querySelectorAll('.step-content');
  steps.forEach(function(step) {
    step.classList.remove('active');
  });

  if (stepNum > highestStepVisited) highestStepVisited = stepNum;
  saveFormState();
  
  var targetStep = document.querySelector('.step-content[data-step="' + stepNum + '"]');
  if (targetStep) {
    targetStep.classList.add('active');
  }
  
  // Scroll content panel to top
  var contentPanel = document.querySelector('.content-panel');
  if (contentPanel) contentPanel.scrollTop = 0;

  document.querySelectorAll('.step-item').forEach(function(item) {
    item.classList.remove('active');
  });
  var activeStepItem = document.querySelector('.step-item[data-step="' + stepNum + '"]');
  if (activeStepItem) {
    activeStepItem.classList.add('active');
  }
  
  // Refresh dynamic content for certain steps
  if (stepNum === 3 && typeof renderStakeholderConveningToolkit === 'function') renderStakeholderConveningToolkit();
  if (stepNum === 2 && typeof renderBudgetSetup === 'function') renderBudgetSetup();
  if (stepNum === 7) restoreGoalsFromState();
  if (stepNum === 8) { generateSuggestedGoals(); if (typeof renderGoalBudgetContext === 'function') renderGoalBudgetContext(); }
  if (stepNum === 9) renderDataProfile();
  if (stepNum === 10) { renderDepartmentAlignmentPage(); renderAlignmentMatrix(); renderDepartmentDetails(); if (typeof renderDepartmentBudgetView === 'function') renderDepartmentBudgetView(); }
  if (stepNum === 11) { generateSuggestedInitiatives(); renderBudgetAlignment(); if (typeof renderBudgetProgressSidebar === 'function') renderBudgetProgressSidebar(); if (typeof renderBudgetAllocationTracker === 'function') renderBudgetAllocationTracker(); }
  if (stepNum === 12 && typeof showPostPlanSurveySetup === 'function') showPostPlanSurveySetup();
  if (stepNum === 13) renderImplementationCalendar();
  if (stepNum === 14) { renderReviewPage(); if (typeof renderBudgetDashboard === 'function') renderBudgetDashboard('budgetDashboardContainer'); if (typeof renderFeasibilityCheck === 'function') renderFeasibilityCheck(); }

  // Update Assistant Panel for current step
  if (typeof updateAssistantStep === 'function') {
    updateAssistantStep(stepNum);
  }

  updatePreview();
}

function stepNext() {
  var current = document.querySelector('.step-content.active');
  if (!current) return;

  var currentStep = parseInt(current.getAttribute('data-step'));
  var nextStep = currentStep + 1;

  if (nextStep <= 14) {
    stepGoto(nextStep);
  }
}

function stepPrev() {
  var current = document.querySelector('.step-content.active');
  if (!current) return;
  
  var currentStep = parseInt(current.getAttribute('data-step'));
  var prevStep = currentStep - 1;
  
  if (prevStep >= 1) {
    stepGoto(prevStep);
  }
}

function clearStep(stepNum) {
  if (!confirm('Clear all fields and selections in this step?')) return;
  
  if (stepNum === 1) {
    // Clear all Step 1 inputs
    var fields = ['districtName','districtLocation','studentEnrollment','numberOfSchools','teacherCount','studentTeacherRatio','frlRate','iepRate','elRate','minorityRate','graduationRate','readingProficiency','mathProficiency','chronicAbsRate','suspensionRate','courseFailureRate','childPovertyRate','perPupilExpenditure','teacherRetentionRate','keyChallenge'];
    fields.forEach(function(id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    document.getElementById('districtSuggestions').innerHTML = '';
    document.getElementById('autoFillStatus').innerHTML = '';
  }
  if (stepNum === 2) {
    // Clear Budget & Funding Sources
    planState.budgetSetup = {
      totalBudget: 0,
      fundingSources: {},
      multiYearProjection: {},
      growthRates: {},
      priorities: [],
      lastUpdated: null
    };
  }
  if (stepNum === 3) {
    document.querySelectorAll('[data-type="vision"]').forEach(function(cb) { cb.checked = false; });
    document.querySelectorAll('[data-type="mission"]').forEach(function(cb) { cb.checked = false; });
    var cv = document.getElementById('customVision');
    var cm = document.getElementById('customMission');
    if (cv) cv.value = '';
    if (cm) cm.value = '';
    planState.vision = '';
    planState.mission = '';
    planState.customVision = '';
    planState.customMission = '';
    updateVisionCounter();
    updateMissionCounter();
    // Update selection card styles
    document.querySelectorAll('.step-content[data-step="3"] .selection-card input[type="checkbox"]').forEach(function(cb) {
      var card = cb.closest('.selection-card');
      if (card) { card.classList.remove('selected'); }
    });
  }
  if (stepNum === 4) {
    document.querySelectorAll('input[name="coreValue"]').forEach(function(cb) {
      cb.checked = false;
      var card = cb.nextElementSibling;
      if (card) { card.style.borderColor = '#e0e0e0'; card.style.backgroundColor = 'white'; }
    });
    planState.coreValues = [];
    updateValuesCounter();
  }
  if (stepNum === 5) {
    document.querySelectorAll('[name^="competency_"]').forEach(function(cb) {
      cb.checked = false;
      var chip = cb.closest('.competency-chip');
      if (chip) chip.classList.remove('selected');
    });
    planState.competencies = {};
  }
  if (stepNum === 6) {
    document.querySelectorAll('input[name="domain"]').forEach(function(cb) {
      cb.checked = false;
    });
    // Reset domain card styling
    document.querySelectorAll('.domain-card-inner').forEach(function(card) {
      card.style.borderColor = '#e0e0e0';
      card.style.backgroundColor = 'white';
      card.style.boxShadow = 'none';
    });
    planState.strategicDomains = [];
  }
  if (stepNum === 7) {
    document.getElementById('goalsContainer').innerHTML = '';
    planState.goals = [];
  }
  if (stepNum === 8) {
    // Clear Goal Forecasting - reset ambition level
    planState.goalAmbition = '';
    renderDataProfile();
  }
  if (stepNum === 9) {
    document.querySelectorAll('input[name="department"]').forEach(function(cb) {
      cb.checked = false;
      var card = cb.parentElement;
      if (card) { card.style.borderColor = '#e0e0e0'; card.style.backgroundColor = 'white'; }
    });
    planState.selectedDepartments = [];
    planState.departmentAlignment = {};
    renderAlignmentMatrix();
    renderDepartmentDetails();
  }
  if (stepNum === 10) {
    document.getElementById('initiativesContainer').innerHTML = '';
    planState.initiatives = [];
  }
  if (stepNum === 11) {
    // Clear Implementation Calendar
    var calContainer = document.getElementById('implementationCalendarContainer');
    if (calContainer) calContainer.innerHTML = '';
  }
  if (stepNum === 14) {
    // Unfinalize the plan
    planState.finalized = false;
    planState.finalizedDate = '';
    renderReviewPage();
  }
  
  saveFormState();
  updatePreview();
}

function clearEntirePlan() {
  if (!confirm('This will clear ALL data in every step. Are you sure?')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

function saveFormState() {
  var el;
  el = document.getElementById('districtName'); planState.districtName = el ? el.value : '';
  el = document.getElementById('districtLocation'); planState.districtLocation = el ? el.value : '';
  el = document.getElementById('studentEnrollment'); planState.studentEnrollment = el ? el.value : '';
  el = document.getElementById('numberOfSchools'); planState.numberOfSchools = el ? el.value : '';
  el = document.getElementById('teacherCount'); planState.teacherCount = el ? el.value : '';
  el = document.getElementById('studentTeacherRatio'); planState.studentTeacherRatio = el ? el.value : '';
  el = document.getElementById('frlRate'); planState.frlRate = el ? el.value : '';
  el = document.getElementById('iepRate'); planState.iepRate = el ? el.value : '';
  el = document.getElementById('elRate'); planState.elRate = el ? el.value : '';
  el = document.getElementById('minorityRate'); planState.minorityRate = el ? el.value : '';
  el = document.getElementById('graduationRate'); planState.graduationRate = el ? el.value : '';
  el = document.getElementById('readingProficiency'); planState.readingProficiency = el ? el.value : '';
  el = document.getElementById('mathProficiency'); planState.mathProficiency = el ? el.value : '';
  el = document.getElementById('chronicAbsRate'); planState.chronicAbsenceRate = el ? el.value : '';
  el = document.getElementById('suspensionRate'); planState.suspensionRate = el ? el.value : '';
  el = document.getElementById('courseFailureRate'); planState.courseFailureRate = el ? el.value : '';
  el = document.getElementById('childPovertyRate'); planState.childPovertyRate = el ? el.value : '';
  el = document.getElementById('perPupilExpenditure'); if (el) planState.perPupilExpenditure = el.value;
  el = document.getElementById('teacherRetentionRate'); planState.teacherRetentionRate = el ? el.value : '';
  el = document.getElementById('keyChallenge'); planState.keyChallenge = el ? el.value : '';

  planState.visionStatements = Array.from(document.querySelectorAll('[data-type="vision"]:checked')).map(function(cb) { return cb.getAttribute('data-value'); });
  planState.missionStatements = Array.from(document.querySelectorAll('[data-type="mission"]:checked')).map(function(cb) { return cb.getAttribute('data-value'); });
  var cvEl = document.getElementById('customVision');
  planState.customVision = cvEl ? cvEl.value : '';
  var cmEl = document.getElementById('customMission');
  planState.customMission = cmEl ? cmEl.value : '';

  planState.coreValues = Array.from(document.querySelectorAll('input[name="coreValue"]:checked')).map(function(cb) { return cb.value; });

  planState.competencies = {};
  Object.keys(CONTENT_DB.competencies).forEach(function(cat) {
    var catId = cat.replace(/\s+/g, '_');
    planState.competencies[cat] = Array.from(document.querySelectorAll('input[name="competency_' + catId + '"]:checked')).map(function(cb) { return cb.value; });
  });

  planState.strategicDomains = Array.from(document.querySelectorAll('input[name="domain"]:checked')).map(function(cb) { return cb.value; });

  // Goals - only overwrite if the step has been rendered (DOM elements exist)
  var goalItems = document.querySelectorAll('.goal-item');
  if (goalItems.length > 0 || document.querySelector('.step-content[data-step="6"].active')) {
    planState.goals = Array.from(goalItems).map(function(item) {
      return {
        title: item.querySelector('.goal-title') ? item.querySelector('.goal-title').value : '',
        measure: item.querySelector('.goal-measure') ? item.querySelector('.goal-measure').value : '',
        target: item.querySelector('.goal-target') ? item.querySelector('.goal-target').value : '',
        schoolLevelNotes: {
          elementary: item.querySelector('.goal-elem-notes') ? item.querySelector('.goal-elem-notes').value : '',
          middle: item.querySelector('.goal-middle-notes') ? item.querySelector('.goal-middle-notes').value : '',
          high: item.querySelector('.goal-high-notes') ? item.querySelector('.goal-high-notes').value : ''
        }
      };
    });
  }

  // Forecasted goals - only overwrite if step 7 has been visited
  var forecastItems = document.querySelectorAll('.forecasted-goal-item');
  if (forecastItems.length > 0 || document.querySelector('.step-content[data-step="7"].active')) {
    planState.forecastedGoals = {};
    Array.from(forecastItems).forEach(function(item) {
      var goalTitle = item.querySelector('.forecasted-goal-title') ? item.querySelector('.forecasted-goal-title').value : '';
      if (goalTitle) {
        planState.forecastedGoals[goalTitle] = {
          year1: item.querySelector('.forecast-year-1') ? item.querySelector('.forecast-year-1').value : '',
          year2: item.querySelector('.forecast-year-2') ? item.querySelector('.forecast-year-2').value : '',
          year3: item.querySelector('.forecast-year-3') ? item.querySelector('.forecast-year-3').value : ''
        };
      }
    });
  }

  // Departments - only overwrite if step 8 has been rendered
  var deptCheckboxes = document.querySelectorAll('input[name="department"]');
  if (deptCheckboxes.length > 0) {
    planState.selectedDepartments = Array.from(document.querySelectorAll('input[name="department"]:checked')).map(function(cb) { return cb.value; });

    planState.departmentAlignment = {};
    planState.selectedDepartments.forEach(function(dept) {
      planState.departmentAlignment[dept] = Array.from(document.querySelectorAll('input[name="align_' + dept.replace(/\s+/g, '_') + '"]:checked')).map(function(cb) { return cb.value; });
    });
  }

  // Initiatives - only overwrite if step 9 has been rendered
  var initItems = document.querySelectorAll('.initiative-item');
  if (initItems.length > 0 || document.querySelector('.step-content[data-step="9"].active')) {
    planState.initiatives = Array.from(initItems).map(function(item) {
      return {
        title: item.querySelector('.initiative-title') ? item.querySelector('.initiative-title').value : '',
        description: item.querySelector('.initiative-description') ? item.querySelector('.initiative-description').value : '',
        lead: item.querySelector('.initiative-lead') ? item.querySelector('.initiative-lead').value : ''
      };
    });
  }

  // Calendar - only overwrite if step 10 has been rendered
  var calItems = document.querySelectorAll('.calendar-quarter-item');
  if (calItems.length > 0) {
    planState.calendar = {};
    Array.from(calItems).forEach(function(item) {
      var quarter = item.getAttribute('data-quarter');
      if (quarter) {
        planState.calendar[quarter] = {
          focus: item.querySelector('.quarter-focus') ? item.querySelector('.quarter-focus').value : '',
          activities: Array.from(item.querySelectorAll('.quarter-activity')).map(function(act) { return act.value; })
        };
      }
    });
  }

  var planNameTopEl = document.getElementById('planNameTop');
  if (planNameTopEl && planNameTopEl.value) {
    planState.planName = planNameTopEl.value;
  }

  planState.lastModified = new Date().toISOString();

  // Save to localStorage (fast) + Supabase (permanent)
  if (window.planSync) {
    window.planSync.save('district', STORAGE_KEY, planState, planState.planName || 'My District Plan');
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planState));
  }

  // Render budget alignment if on step 9
  if (document.querySelector('.step-content[data-step="9"].active')) {
    if (typeof renderBudgetAlignment === 'function') {
      renderBudgetAlignment();
    }
  }
}

function loadState() {
  // Load from localStorage first for instant render
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    Object.assign(planState, JSON.parse(saved));
    applyStateToUI();
  }

  // Then try cloud load (may override with newer data)
  if (window.planSync) {
    window.planSync.load('district', STORAGE_KEY).then(function(cloudData) {
      if (cloudData && cloudData.lastModified) {
        var cloudTime = new Date(cloudData.lastModified).getTime();
        var localTime = planState.lastModified ? new Date(planState.lastModified).getTime() : 0;
        if (cloudTime > localTime) {
          Object.assign(planState, cloudData);
          applyStateToUI();
        }
      }
    });
  }
}

function applyStateToUI() {
  var planNameTopEl = document.getElementById('planNameTop');
  if (planNameTopEl) {
    planNameTopEl.value = planState.planName;
  }

  document.getElementById('districtName').value = planState.districtName;
  document.getElementById('districtLocation').value = planState.districtLocation;
  document.getElementById('studentEnrollment').value = planState.studentEnrollment;
  document.getElementById('numberOfSchools').value = planState.numberOfSchools;
  document.getElementById('teacherCount').value = planState.teacherCount;
  document.getElementById('studentTeacherRatio').value = planState.studentTeacherRatio;
  document.getElementById('frlRate').value = planState.frlRate;
  document.getElementById('iepRate').value = planState.iepRate;
  document.getElementById('elRate').value = planState.elRate;
  document.getElementById('minorityRate').value = planState.minorityRate;
  document.getElementById('graduationRate').value = planState.graduationRate;
  document.getElementById('readingProficiency').value = planState.readingProficiency;
  document.getElementById('mathProficiency').value = planState.mathProficiency;
  document.getElementById('chronicAbsRate').value = planState.chronicAbsenceRate;
  document.getElementById('suspensionRate').value = planState.suspensionRate;
  document.getElementById('courseFailureRate').value = planState.courseFailureRate;
  document.getElementById('childPovertyRate').value = planState.childPovertyRate;
  if (document.getElementById('perPupilExpenditure')) document.getElementById('perPupilExpenditure').value = planState.perPupilExpenditure;
  document.getElementById('teacherRetentionRate').value = planState.teacherRetentionRate;
  document.getElementById('keyChallenge').value = planState.keyChallenge;

  planState.visionStatements.forEach(function(val) {
    var cb = document.querySelector('[data-type="vision"][data-value="' + val + '"]');
    if (cb) cb.checked = true;
  });
  var customVisionEl = document.getElementById('customVision');
  if (customVisionEl) customVisionEl.value = planState.customVision || '';

  planState.missionStatements.forEach(function(val) {
    var cb = document.querySelector('[data-type="mission"][data-value="' + val + '"]');
    if (cb) cb.checked = true;
  });
  var customMissionEl = document.getElementById('customMission');
  if (customMissionEl) customMissionEl.value = planState.customMission || '';

  updateVisionCounter();
  updateMissionCounter();
}

function saveState() {
  saveFormState();
}

// ============================================================================
// DISTRICT SEARCH WITH URBAN INSTITUTE API & DEBOUNCE
// ============================================================================

var districtSearchTimeout;

function handleDistrictSearch(event) {
  var query = event.target.value.toLowerCase().trim();
  var suggestionsDiv = document.getElementById('districtSuggestions');

  clearTimeout(districtSearchTimeout);

  if (!query || query.length < 2) {
    suggestionsDiv.innerHTML = '';
    return;
  }

  districtSearchTimeout = setTimeout(function() {
    var localMatches = DISTRICT_DATABASE.filter(function(d) {
      return d.name.toLowerCase().indexOf(query) !== -1 || d.location.toLowerCase().indexOf(query) !== -1;
    });

    suggestionsDiv.innerHTML = '';
    localMatches.slice(0, 5).forEach(function(district) {
      var div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = district.name + ' (' + district.location + ')';
      div.onclick = function() { selectDistrict(district.id); };
      suggestionsDiv.appendChild(div);
    });

    if (localMatches.length === 0) {
      suggestionsDiv.innerHTML = '<div class="suggestion-item" style="color:#999">No local matches. Searching Urban Institute...</div>';
      
      var apiUrl = 'https://educationdata.urban.org/api/v1/school-districts/ccd/directory/2022/?district_name=' + encodeURIComponent(query) + '&limit=10';
      
      fetch(apiUrl)
        .then(function(r) { return r.json(); })
        .catch(function(e) {
          console.log('Urban Institute API error (expected in offline mode):', e);
        });
    }
  }, 300);
}

function selectDistrict(districtId) {
  var district = DISTRICT_DATABASE.find(function(d) { return d.id === districtId; });
  if (!district) return;

  document.getElementById('districtName').value = district.name;
  document.getElementById('districtLocation').value = district.location;
  document.getElementById('studentEnrollment').value = district.enrollment;
  document.getElementById('numberOfSchools').value = district.numberOfSchools;
  document.getElementById('teacherCount').value = district.teacherCount;
  document.getElementById('studentTeacherRatio').value = district.studentTeacherRatio;
  document.getElementById('frlRate').value = district.frlRate;
  document.getElementById('iepRate').value = district.iepRate;
  document.getElementById('elRate').value = district.elRate;
  document.getElementById('minorityRate').value = district.minorityRate;
  document.getElementById('graduationRate').value = district.graduationRate;
  document.getElementById('readingProficiency').value = district.readingProficiency;
  document.getElementById('mathProficiency').value = district.mathProficiency;
  document.getElementById('chronicAbsRate').value = district.chronicAbsenceRate;
  document.getElementById('suspensionRate').value = district.suspensionRate;
  document.getElementById('courseFailureRate').value = district.courseFailureRate;
  document.getElementById('childPovertyRate').value = district.childPovertyRate;
  if (document.getElementById('perPupilExpenditure')) document.getElementById('perPupilExpenditure').value = district.perPupilExpenditure;
  document.getElementById('teacherRetentionRate').value = district.teacherRetentionRate;

  document.getElementById('districtSuggestions').innerHTML = '';

  highlightUnfilledFields();
}

function highlightUnfilledFields() {
  var inputs = document.querySelectorAll('.step-content[data-step="1"] input[type="text"], .step-content[data-step="1"] input[type="number"]');
  inputs.forEach(function(input) {
    var label = input.closest('.form-group') ? input.closest('.form-group').querySelector('label') : null;
    if (input.value && input.value.trim()) {
      input.classList.remove('unfilled-field');
      if (label) label.classList.remove('unfilled-label');
    } else {
      input.classList.add('unfilled-field');
      if (label) label.classList.add('unfilled-label');
    }
  });
}

// ============================================================================
// CORE VALUES RENDERING - REDESIGNED PILL UI
// ============================================================================

function renderCoreValues() {
  var container = document.getElementById('coreValuesContainer');
  var colors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A', '#22333B', '#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A', '#22333B', '#6ECF6E', '#00B4CC', '#D4A537'];
  var icons = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><rect x="2" y="9" width="20" height="13" rx="2"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  ];
  
  var descriptions = {
    'Excellence': 'Pursuing the highest standards in everything we do.',
    'Equity': 'Ensuring every student gets what they need to succeed.',
    'Integrity': 'Acting with honesty, transparency, and ethical commitment.',
    'Innovation': 'Embracing creative solutions and continuous improvement.',
    'Collaboration': 'Working together across teams, schools, and community.',
    'Compassion': 'Leading with empathy, care, and understanding.',
    'Accountability': 'Owning outcomes and delivering on commitments.',
    'Inclusivity': 'Creating belonging for every student and family.',
    'Respect': 'Honoring the dignity and voice of every individual.',
    'Growth Mindset': 'Believing every person can learn, grow, and improve.',
    'Student-Centered': 'Putting students at the center of every decision.',
    'Community': 'Building strong partnerships beyond school walls.',
    'Transparency': 'Communicating openly and sharing data honestly.',
    'Continuous Improvement': 'Using data and feedback to get better every day.',
    'Empowerment': 'Giving people the tools and trust to lead.'
  };
  
  container.innerHTML = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;">' +
    CONTENT_DB.coreValues.map(function(value, i) {
      var color = colors[i % colors.length];
      var icon = icons[i % icons.length];
      var desc = descriptions[value] || '';
      var checked = (planState.coreValues && planState.coreValues.indexOf(value) !== -1) ? 'checked' : '';
      return '<label style="cursor:pointer;display:block;">' +
        '<input type="checkbox" name="coreValue" value="' + value + '" ' + checked + ' onchange="updateValuesCounter();updatePreview()" style="display:none" />' +
        '<div class="core-value-card" style="border-top:4px solid ' + color + ';padding:1.25rem;border-radius:6px;background:white;border:1px solid #e0e0e0;transition:all 0.2s;min-height:140px;">' +
        '<div style="width:36px;height:36px;background:' + color + '15;border-radius:8px;display:flex;align-items:center;justify-content:center;margin-bottom:0.75rem;color:' + color + '">' + icon + '</div>' +
        '<h4 style="margin:0 0 0.4rem 0;font-family:Source Serif Pro,serif;font-size:1rem;color:#22333B">' + value + '</h4>' +
        '<p style="margin:0;font-size:0.82rem;color:#888;line-height:1.4">' + desc + '</p>' +
        '</div>' +
        '</label>';
    }).join('') +
    '</div>';
  
  // Add "Add Your Own" section
  container.innerHTML += '<div style="margin-top:2rem;padding:1.5rem;background:#fafafa;border-radius:8px;border:2px dashed #ccc">' +
    '<h3 style="font-family:Source Serif Pro,serif;font-size:1.1rem;color:#22333B;margin:0 0 0.75rem 0">Add Your Own Core Value</h3>' +
    '<p style="font-size:0.85rem;color:#888;margin:0 0 1rem 0">Don\'t see what you need? Add a custom core value below.</p>' +
    '<div style="display:flex;gap:0.75rem;flex-wrap:wrap">' +
    '<input type="text" id="customCoreValue" placeholder="Core value name" style="flex:1;min-width:200px;padding:0.6rem 0.8rem;border:1px solid #ddd;border-radius:4px;font-size:0.9rem;font-family:Inter,sans-serif" />' +
    '<button onclick="addCustomCoreValue()" style="padding:0.6rem 1.2rem;background:#00B4CC;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.9rem;font-weight:600">Add</button>' +
    '</div></div>';

  // Add checked state styling
  container.querySelectorAll('input[name="coreValue"]').forEach(function(cb) {
    var card = cb.nextElementSibling;
    if (cb.checked) {
      card.style.borderColor = '#6ECF6E';
      card.style.backgroundColor = '#f0f8f0';
    }
    cb.addEventListener('change', function() {
      if (this.checked) {
        card.style.borderColor = '#6ECF6E';
        card.style.backgroundColor = '#f0f8f0';
      } else {
        card.style.borderColor = '#e0e0e0';
        card.style.backgroundColor = 'white';
      }
    });
  });
}

function updateValuesCounter() {
  var selected = document.querySelectorAll('input[name="coreValue"]:checked').length;
  var counter = document.getElementById('valuesCounter');
  if (counter) {
    counter.textContent = selected;
  }
}

function updateDomainsCounter() {
  var selected = document.querySelectorAll('input[name="domain"]:checked').length;
  var counter = document.getElementById('domainsCounter');
  if (counter) {
    counter.textContent = selected;
  }
}

// ============================================================================
// COMPETENCIES RENDERING - REDESIGNED CARD UI
// ============================================================================

function renderCompetencies() {
  var container = document.getElementById('competenciesContainer');
  var catColors = {
    'Academic Competencies': '#00B4CC',
    'Social-Emotional Competencies': '#E07A5F',
    'Digital Competencies': '#6B4C9A',
    'Career Readiness': '#D4A537'
  };
  
  var html = '';
  
  Object.keys(CONTENT_DB.competencies).forEach(function(category) {
    var catId = category.replace(/\s+/g, '_');
    var skills = CONTENT_DB.competencies[category];
    var color = catColors[category] || '#22333B';
    
    html += '<div style="margin-bottom:2rem;padding:1.5rem;background:#fafafa;border-radius:8px;border-top:4px solid ' + color + '">';
    html += '<h3 style="font-family:Source Serif Pro,serif;font-size:1.2rem;color:#22333B;margin:0 0 0.5rem 0">' + category + '</h3>';
    html += '<p style="font-size:0.85rem;color:#888;margin:0 0 1rem 0">Pick two from this category</p>';
    html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem">';
    
    skills.forEach(function(skill) {
      var checked = (planState.competencies && planState.competencies[category] && planState.competencies[category].indexOf(skill) !== -1) ? 'checked' : '';
      html += '<label style="cursor:pointer;display:block">';
      html += '<input type="checkbox" name="competency_' + catId + '" value="' + skill + '" ' + checked + ' onchange="updateCompetencyCard(this);updatePreview()" style="display:none" />';
      html += '<div class="competency-card-item" style="padding:1rem;border-radius:6px;background:white;border:1px solid #e0e0e0;transition:all 0.2s;text-align:center;min-height:70px;display:flex;align-items:center;justify-content:center">';
      html += '<span style="font-size:0.9rem;font-weight:600;color:#22333B">' + skill + '</span>';
      html += '</div></label>';
    });
    
    html += '</div></div>';
  });
  
  html += '<div style="margin-top:2rem;padding:1.5rem;background:#fafafa;border-radius:8px;border:2px dashed #ccc">';
  html += '<h3 style="font-family:Source Serif Pro,serif;font-size:1.1rem;color:#22333B;margin:0 0 0.75rem 0">Add Your Own Competency</h3>';
  html += '<p style="font-size:0.85rem;color:#888;margin:0 0 1rem 0">Don\'t see what you need? Add a custom category and competency below.</p>';
  html += '<div style="display:flex;gap:0.75rem;flex-wrap:wrap">';
  html += '<input type="text" id="customCompCategory" placeholder="Category name" style="flex:1;min-width:180px;padding:0.6rem 0.8rem;border:1px solid #ddd;border-radius:4px;font-size:0.9rem;font-family:Inter,sans-serif" />';
  html += '<input type="text" id="customCompSkill" placeholder="Competency name" style="flex:1;min-width:180px;padding:0.6rem 0.8rem;border:1px solid #ddd;border-radius:4px;font-size:0.9rem;font-family:Inter,sans-serif" />';
  html += '<button onclick="addCustomCompetency()" style="padding:0.6rem 1.2rem;background:#00B4CC;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.9rem;font-weight:600">Add</button>';
  html += '</div></div>';
  
  container.innerHTML = html;
  
  // Apply checked state styling
  container.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    var card = cb.nextElementSibling;
    if (cb.checked && card) {
      card.style.borderColor = '#6ECF6E';
      card.style.backgroundColor = '#f0f8f0';
    }
  });
}

function updateCompetencyCard(checkbox) {
  var card = checkbox.nextElementSibling;
  if (!card) return;
  if (checkbox.checked) {
    card.style.borderColor = '#6ECF6E';
    card.style.backgroundColor = '#f0f8f0';
  } else {
    card.style.borderColor = '#e0e0e0';
    card.style.backgroundColor = 'white';
  }
}

function renderDomains() {
  var container = document.getElementById('domainsContainer');
  var popColors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A'];
  var icons = [
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
  ];

  var html = '<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;">';
  
  CONTENT_DB.domains.forEach(function(domain, index) {
    var color = popColors[index % popColors.length];
    var icon = icons[index];
    var domainId = 'domain_' + index;
    
    html += '<div style="cursor: pointer; display: block;">' +
      '<input type="checkbox" id="' + domainId + '" name="domain" value="' + domain.name + '" onchange="updateDomainsCounter();updatePreview()" style="display: none;" />' +
      '<div style="' +
        'border-top: 4px solid ' + color + '; ' +
        'border-radius: 6px; ' +
        'background: white; ' +
        'padding: 1.25rem; ' +
        'transition: all 0.2s ease; ' +
        'border: 1px solid #e0e0e0; ' +
        'border-top-width: 4px; ' +
      '" class="domain-card-inner" data-domain-id="' + domainId + '">' +
        '<div style="' +
          'width: 48px; ' +
          'height: 48px; ' +
          'background: ' + color + '; ' +
          'border-radius: 8px; ' +
          'display: flex; ' +
          'align-items: center; ' +
          'justify-content: center; ' +
          'margin-bottom: 1rem; ' +
          'color: white; ' +
        '">' +
          icon +
        '</div>' +
        '<h3 style="' +
          'font-family: \'Source Serif Pro\', serif; ' +
          'font-size: 1rem; ' +
          'font-weight: 700; ' +
          'color: #22333B; ' +
          'margin: 0 0 0.5rem 0; ' +
          'line-height: 1.3; ' +
        '">' + domain.name + '</h3>' +
        '<p style="' +
          'font-size: 0.85rem; ' +
          'color: #5E503F; ' +
          'margin: 0; ' +
          'line-height: 1.4; ' +
        '">' + domain.description + '</p>' +
      '</div>' +
      '</div>';
  });

  html += '</div>';

  html += '<div style="margin-top:2rem;padding:1.5rem;background:#fafafa;border-radius:8px;border:2px dashed #ccc">' +
    '<h3 style="font-family:Source Serif Pro,serif;font-size:1.1rem;color:#22333B;margin:0 0 0.75rem 0">Add Your Own Strategic Domain</h3>' +
    '<p style="font-size:0.85rem;color:#888;margin:0 0 1rem 0">Don\'t see what you need? Add a custom domain below.</p>' +
    '<div style="display:flex;gap:0.75rem;flex-wrap:wrap">' +
    '<input type="text" id="customDomainName" placeholder="Domain name" style="flex:1;min-width:180px;padding:0.6rem 0.8rem;border:1px solid #ddd;border-radius:4px;font-size:0.9rem;font-family:Inter,sans-serif" />' +
    '<input type="text" id="customDomainDesc" placeholder="Brief description" style="flex:1;min-width:180px;padding:0.6rem 0.8rem;border:1px solid #ddd;border-radius:4px;font-size:0.9rem;font-family:Inter,sans-serif" />' +
    '<button onclick="addCustomDomain()" style="padding:0.6rem 1.2rem;background:#00B4CC;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.9rem;font-weight:600">Add</button>' +
    '</div></div>';

  container.innerHTML = html;

  document.querySelectorAll('.domain-card-inner').forEach(function(card) {
    card.style.minHeight = '180px';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    var checkbox = document.getElementById(card.getAttribute('data-domain-id'));
    
    function updateCardStyle() {
      if (checkbox.checked) {
        card.style.borderColor = '#6ECF6E';
        card.style.backgroundColor = '#f0f8f0';
        card.style.boxShadow = '0 2px 8px rgba(110, 207, 110, 0.2)';
      } else {
        card.style.borderColor = '#e0e0e0';
        card.style.backgroundColor = 'white';
        card.style.boxShadow = 'none';
      }
    }
    
    card.addEventListener('click', function(e) {
      if (e.target.tagName !== 'INPUT') {
        checkbox.checked = !checkbox.checked;
        var event = new Event('change', { bubbles: true });
        checkbox.dispatchEvent(event);
        updateCardStyle();
      }
    });
    
    checkbox.addEventListener('change', updateCardStyle);
    updateCardStyle();
  });
}

// ============================================================================
// VISION & MISSION TEMPLATES
// ============================================================================

function updateVisionCounter() {
  var selected = document.querySelectorAll('[data-type="vision"]:checked').length;
  var counter = document.getElementById('visionCounter');
  if (counter) counter.textContent = selected;
}

function updateMissionCounter() {
  var selected = document.querySelectorAll('[data-type="mission"]:checked').length;
  var counter = document.getElementById('missionCounter');
  if (counter) counter.textContent = selected;
}

// Map vision card data-values to template indices
var VISION_VALUE_MAP = {
  'equity': 5, 'thriving': 1, 'empowered': 3, 'future-ready': 0,
  'healthy': 4, 'connected': 2, 'innovative': 7, 'inclusive': 6
};
var MISSION_VALUE_MAP = {
  'excellence': 0, 'access': 1, 'collaboration': 2, 'accountability': 3,
  'equity': 4, 'growth': 5, 'innovation': 6, 'sustainability': 7
};

function combineVisionStatements(fromCheckbox) {
  var selected = Array.from(document.querySelectorAll('[data-type="vision"]:checked')).map(function(cb) {
    var val = cb.getAttribute('data-value');
    var idx = VISION_VALUE_MAP[val];
    if (idx !== undefined && CONTENT_DB.visionTemplates[idx]) {
      return CONTENT_DB.visionTemplates[idx].text;
    }
    // Fallback: use the card title text
    var card = cb.closest('.selection-card');
    var title = card ? card.querySelector('.selection-card-title') : null;
    return title ? title.textContent : val;
  });

  var customEl = document.getElementById('customVision');

  // When triggered by a checkbox change, populate the textarea with selected text
  // so the user can edit it directly
  if (fromCheckbox && customEl) {
    customEl.value = selected.join(' ');
  }

  var custom = customEl ? customEl.value.trim() : '';

  // If textarea has content (user may have edited), use that as the vision
  // Otherwise fall back to selected cards
  var combined = custom || selected.join(' ');
  planState.vision = combined;
  saveFormState();
  updateVisionCounter();
  updatePreview();
}

function combineMissionStatements(fromCheckbox) {
  var selected = Array.from(document.querySelectorAll('[data-type="mission"]:checked')).map(function(cb) {
    var val = cb.getAttribute('data-value');
    var idx = MISSION_VALUE_MAP[val];
    if (idx !== undefined && CONTENT_DB.missionTemplates[idx]) {
      return CONTENT_DB.missionTemplates[idx].text;
    }
    var card = cb.closest('.selection-card');
    var title = card ? card.querySelector('.selection-card-title') : null;
    return title ? title.textContent : val;
  });

  var customEl = document.getElementById('customMission');

  if (fromCheckbox && customEl) {
    customEl.value = selected.join(' ');
  }

  var custom = customEl ? customEl.value.trim() : '';
  var combined = custom || selected.join(' ');
  planState.mission = combined;
  saveFormState();
  updateMissionCounter();
  updatePreview();
}

// ============================================================================
// SUGGESTED GOALS WITH SEVERITY BADGES
// ============================================================================

var DOMAIN_GOALS = {
  'Student Learning & Achievement': [
    'Increase the percentage of students meeting or exceeding grade-level standards in ELA and Math by 10 percentage points within 3 years',
    'Implement a multi-tiered system of supports (MTSS) across all schools to ensure every student receives targeted academic intervention',
    'Achieve 90%+ of schools meeting annual growth targets as measured by state accountability metrics',
    'Reduce achievement gaps between student subgroups by 15% over the strategic plan period',
    'Ensure 100% of students have access to rigorous, standards-aligned curriculum in every core subject'
  ],
  'Equity & Access': [
    'Eliminate disproportionality in discipline referrals across all student subgroups within 3 years',
    'Ensure 100% of schools offer advanced coursework, gifted programs, or honors pathways accessible to all students',
    'Reduce opportunity gaps in AP/IB enrollment for underrepresented students by 25%',
    'Implement culturally responsive teaching practices in 100% of classrooms, verified through walkthrough data',
    'Establish equity-focused resource allocation that directs additional funding to highest-need schools'
  ],
  'Talent Management': [
    'Achieve 90%+ teacher retention rate district-wide through competitive compensation and working conditions',
    'Ensure 100% of new teachers receive structured mentoring and induction support in their first 2 years',
    'Increase the diversity of the teaching workforce to better reflect the student population within 5 years',
    'Implement a career ladder program that provides growth pathways for high-performing educators',
    'Reduce hard-to-staff school vacancies by 50% through targeted recruitment and retention incentives'
  ],
  'Operational Excellence': [
    'Achieve a 95%+ satisfaction rate on facilities conditions across all schools through proactive maintenance',
    'Reduce operational costs by 10% through process improvement and strategic resource reallocation',
    'Implement a transparent, equity-weighted budget allocation model aligned to strategic priorities',
    'Achieve 100% on-time completion of capital improvement projects within approved budgets',
    'Establish real-time financial dashboards providing transparency to stakeholders at all levels'
  ],
  'Community & Family Engagement': [
    'Increase meaningful family engagement participation rates by 30% across all schools',
    'Establish active parent advisory councils in 100% of schools with regular two-way communication channels',
    'Launch a community schools model in at least 5 high-need schools, integrating wraparound services',
    'Achieve 90%+ family satisfaction rating on district communication and responsiveness surveys',
    'Develop strategic partnerships with at least 10 community organizations to support student and family needs'
  ],
  'Social-Emotional Learning': [
    'Implement a district-wide SEL framework with documented lessons in 100% of schools K-12',
    'Reduce chronic absenteeism by 25% through early warning systems and student engagement strategies',
    'Ensure every school has access to a counselor-to-student ratio meeting national recommendations',
    'Decrease exclusionary discipline incidents by 40% through restorative justice and PBIS implementation',
    'Achieve 80%+ of students reporting a sense of belonging and safety in annual climate surveys'
  ],
  'College & Career Readiness': [
    'Increase the percentage of graduates completing college or career-ready pathways to 85%+',
    'Ensure every student completes at least one career exploration or work-based learning experience by grade 12',
    'Expand CTE program offerings to cover high-demand career clusters in every comprehensive high school',
    'Increase FAFSA completion rates to 80%+ for all graduating seniors',
    'Establish dual enrollment partnerships allowing students to earn college credit at no cost'
  ],
  'Technology & Innovation': [
    'Achieve 1:1 student-to-device ratio with equitable access to high-speed internet for all students',
    'Ensure 100% of teachers demonstrate proficiency in integrating technology into instruction',
    'Implement a modern student information and data analytics platform accessible to all stakeholders',
    'Launch innovative learning models (blended, project-based, competency-based) in at least 25% of schools',
    'Establish a cybersecurity and digital citizenship curriculum integrated across all grade levels'
  ],
  'Safety & School Climate': [
    'Achieve 90%+ of students and staff reporting they feel safe at school in annual climate surveys',
    'Implement comprehensive threat assessment protocols and crisis response plans in 100% of schools',
    'Reduce bullying and harassment incidents by 35% through preventive programs and reporting systems',
    'Ensure 100% of schools have updated safety infrastructure including secure entry and emergency systems',
    'Establish restorative practices as the primary response to behavioral incidents in all schools'
  ]
};

function addDomainGoal(domainIdx, goalIdx, btn) {
  var domains = planState.strategicDomains || [];
  if (domainIdx < domains.length) {
    var domainName = domains[domainIdx];
    var goals = DOMAIN_GOALS[domainName];
    if (goals && goalIdx < goals.length) {
      addGoal(goals[goalIdx]);
      saveFormState();
      updatePreview();
    }
  }
  // Animate the button
  if (btn) {
    var origText = btn.textContent;
    var origBg = btn.style.background;
    btn.textContent = '✓ Added!';
    btn.style.background = '#6ECF6E';
    btn.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      btn.textContent = origText;
      btn.style.background = origBg;
    }, 1500);
  }
}

function generateSuggestedGoals() {
  var container = document.getElementById('suggestedGoalsContainer');
  var popColors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A'];
  var html = '';

  // SECTION 1: Domain-Based Goals
  var selectedDomains = planState.strategicDomains || [];
  if (selectedDomains.length > 0) {
    html += '<div style="margin-bottom:2rem">';
    html += '<p style="font-size:0.9rem;color:#666;margin:0 0 1.5rem 0">Based on your selected strategic domains, here are recommended goals. Click "Add to Plan" to include any that align with your priorities.</p>';
    
    selectedDomains.forEach(function(domainName, di) {
      var goals = DOMAIN_GOALS[domainName];
      if (!goals) return;
      
      var color = popColors[di % popColors.length];
      html += '<div style="background:white;border:1px solid #e0e0e0;border-left:5px solid ' + color + ';border-radius:8px;padding:1.5rem;margin-bottom:1.25rem">';
      html += '<h3 style="font-family:Source Serif Pro,serif;font-size:1.15rem;color:#22333B;margin:0 0 0.5rem 0;display:flex;align-items:center;gap:0.5rem"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:' + color + '"></span>' + domainName + '</h3>';
      html += '<p style="font-size:0.8rem;color:#888;margin:0 0 1rem 0">' + goals.length + ' recommended goals for this domain</p>';
      
      goals.forEach(function(goalText, gi) {
        html += '<div style="padding:0.75rem 1rem;margin-bottom:0.5rem;background:#fafafa;border-radius:6px;border:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;gap:1rem">';
        html += '<p style="margin:0;font-size:0.88rem;color:#22333B;line-height:1.5;flex:1">' + goalText + '</p>';
        html += '<button onclick="addDomainGoal(' + di + ',' + gi + ', this)" style="padding:0.4rem 0.8rem;background:' + color + ';color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.8rem;white-space:nowrap;flex-shrink:0">Add to Plan</button>';
        html += '</div>';
      });
      
      html += '</div>';
    });
    
    html += '</div>';
  } else {
    html += '<div style="padding:1.5rem;background:#f0f7f7;border-radius:8px;border-left:4px solid #00B4CC;margin-bottom:2rem;color:#22333B;font-size:0.9rem">';
    html += '<strong>Select Strategic Domains first.</strong> Go to Step 5 to choose your district\'s priority areas, then come back here to see tailored goal suggestions for each domain.';
    html += '</div>';
  }

  // SECTION 2: Data-Driven Goals (from metrics) - styled to match domain cards above
  var suggestedGoals = [];
  var severityColors = { strong: '#4caf50', monitor: '#ff9800', concern: '#f44336', critical: '#b71c1c' };
  var severityLabels = { strong: 'STRONG', monitor: 'MONITOR', concern: 'CONCERN', critical: 'CRITICAL' };

  var metrics = [
    { field: 'chronicAbsenceRate', label: 'Chronic Absence Rate', unit: '%' },
    { field: 'graduationRate', label: 'Graduation Rate', unit: '%' },
    { field: 'readingProficiency', label: 'Reading Proficiency', unit: '%' },
    { field: 'mathProficiency', label: 'Math Proficiency', unit: '%' },
    { field: 'courseFailureRate', label: 'Course Failure Rate', unit: '%' },
    { field: 'suspensionRate', label: 'Suspension Rate', unit: '%' },
    { field: 'teacherRetentionRate', label: 'Teacher Retention Rate', unit: '%' }
  ];

  metrics.forEach(function(m) {
    var value = parseInt(planState[m.field]);
    if (!isNaN(value)) {
      var severity = getSeverity(m.field, value);
      var goalText = '';
      if (m.field === 'chronicAbsenceRate') goalText = 'Reduce chronic absenteeism from ' + value + '% to 10% or below';
      else if (m.field === 'graduationRate') goalText = 'Increase graduation rate from ' + value + '% to 95%+';
      else if (m.field === 'readingProficiency') goalText = 'Increase reading proficiency from ' + value + '% to 75%+';
      else if (m.field === 'mathProficiency') goalText = 'Increase math proficiency from ' + value + '% to 70%+';
      else if (m.field === 'courseFailureRate') goalText = 'Reduce course failure rate from ' + value + '% to 5% or below';
      else if (m.field === 'suspensionRate') goalText = 'Reduce suspension rate from ' + value + '% to 3% or below';
      else if (m.field === 'teacherRetentionRate') goalText = 'Increase teacher retention from ' + value + '% to 90%+';
      if (goalText) {
        suggestedGoals.push({ text: goalText, severity: severity, metric: m.label, baseline: value + m.unit, field: m.field });
      }
    }
  });

  var goalCategories = {
    'Student Achievement': { fields: ['graduationRate', 'readingProficiency', 'mathProficiency', 'courseFailureRate'], color: '#D4A537' },
    'Student Engagement & Support': { fields: ['chronicAbsenceRate', 'suspensionRate'], color: '#E07A5F' },
    'Workforce & Talent': { fields: ['teacherRetentionRate'], color: '#6B4C9A' }
  };

  // Build the data-driven card (same style as domain-based cards above)
  html += '<div style="background:white;border:1px solid #e0e0e0;border-left:5px solid #00B4CC;border-radius:8px;padding:1.5rem;margin-top:2rem">';
  html += '<h3 style="font-family:Source Serif Pro,serif;font-size:1.15rem;color:#22333B;margin:0 0 0.25rem 0;display:flex;align-items:center;gap:0.5rem"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#00B4CC"></span>Data-Driven Goal Suggestions</h3>';
  html += '<p style="font-size:0.8rem;color:#888;margin:0 0 1.25rem 0">Generated from your district\'s performance data in Step 1</p>';

  if (suggestedGoals.length === 0) {
    html += '<div style="padding:1rem;background:#fafafa;border-radius:6px;color:#888;text-align:center;font-size:0.88rem">Enter district performance data in Step 1 to see data-driven goal suggestions.</div>';
  } else {
    Object.keys(goalCategories).forEach(function(catName) {
      var cat = goalCategories[catName];
      var catGoals = suggestedGoals.filter(function(g) { return cat.fields.indexOf(g.field) !== -1; });
      if (catGoals.length === 0) return;

      html += '<div style="margin-bottom:1rem">';
      html += '<div style="font-size:0.82rem;font-weight:700;color:' + cat.color + ';text-transform:uppercase;letter-spacing:0.5px;margin-bottom:0.5rem">' + catName + '</div>';
      catGoals.forEach(function(goal) {
        html += '<div style="padding:0.75rem 1rem;margin-bottom:0.5rem;background:#fafafa;border-radius:6px;border:1px solid #f0f0f0;display:flex;justify-content:space-between;align-items:center;gap:1rem">';
        html += '<div style="flex:1">';
        html += '<p style="margin:0;font-size:0.88rem;color:#22333B;line-height:1.5">' + goal.text + '</p>';
        html += '<p style="margin:0.25rem 0 0 0;font-size:0.78rem;color:#888">' + goal.metric + ' &middot; Baseline: ' + goal.baseline + ' &middot; <span style="color:' + severityColors[goal.severity] + ';font-weight:600">' + severityLabels[goal.severity] + '</span></p>';
        html += '</div>';
        html += '<button onclick="addGoalFromSuggestion(\'' + goal.field + '\', this)" style="padding:0.4rem 0.8rem;background:#00B4CC;color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.8rem;white-space:nowrap;flex-shrink:0">Add to Plan</button>';
        html += '</div>';
      });
      html += '</div>';
    });
  }
  html += '</div>';

  container.innerHTML = html;
}

function addGoalFromSuggestion(fieldName, btn) {
  var value = parseInt(planState[fieldName]);
  if (isNaN(value)) return;

  var goalTextMap = {
    chronicAbsenceRate: 'Reduce chronic absenteeism from ' + value + '% to 10% or below',
    graduationRate: 'Increase graduation rate from ' + value + '% to 95%+',
    readingProficiency: 'Increase reading proficiency from ' + value + '% to 75%+',
    mathProficiency: 'Increase math proficiency from ' + value + '% to 70%+',
    courseFailureRate: 'Reduce course failure rate from ' + value + '% to 5% or below',
    suspensionRate: 'Reduce suspension rate from ' + value + '% to 3% or below',
    teacherRetentionRate: 'Increase teacher retention from ' + value + '% to 90%+'
  };

  var goalText = goalTextMap[fieldName];
  if (goalText) {
    addGoal(goalText);
    saveFormState();
    updatePreview();
  }

  // Animate the button
  if (btn) {
    var origText = btn.textContent;
    var origBg = btn.style.background;
    btn.textContent = '✓ Added!';
    btn.style.background = '#6ECF6E';
    btn.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      btn.textContent = origText;
      btn.style.background = origBg;
    }, 1500);
  }
}

function addGoal(prefillText) {
  var goalText = prefillText || 'Custom Goal';
  var goalsContainer = document.getElementById('goalsContainer');

  var goalId = 'goal-' + Date.now();
  var div = document.createElement('div');
  div.className = 'goal-item';
  div.id = goalId;
  div.style.cssText = 'display:flex;flex-direction:column;gap:0.75rem;padding:0.75rem 1rem;background:white;border:1px solid #e0e0e0;border-left:3px solid #00B4CC;border-radius:6px;margin-bottom:0.5rem';

  var headerHtml = '<div style="display:flex;align-items:center;gap:0.75rem;width:100%">' +
    '<span style="flex:1;font-size:0.9rem;font-weight:600;color:#22333B">' + goalText + '</span>' +
    '<input type="hidden" class="goal-title" value="' + goalText.replace(/"/g, '&quot;') + '">' +
    '<button onclick="document.getElementById(\'' + goalId + '\').remove();saveFormState();updatePreview()" style="padding:0.3rem 0.6rem;background:none;color:#999;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.78rem">Remove</button>' +
    '</div>';

  var notesHtml = '<div style="border-top:1px solid #e0e0e0;padding-top:0.75rem;display:none" class="school-level-notes" id="' + goalId + '-notes">' +
    '<div style="font-size:0.75rem;font-weight:700;color:#666;margin-bottom:0.5rem">School Level Differentiation (Optional)</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem">' +
    '<div>' +
    '<label style="font-size:0.7rem;font-weight:600;color:#555;display:block;margin-bottom:0.25rem">Elementary</label>' +
    '<textarea class="goal-elem-notes" placeholder="Specific considerations for elementary schools" style="width:100%;min-height:60px;padding:0.5rem;font-size:0.8rem;border:1px solid #ddd;border-radius:4px;font-family:Inter,sans-serif;resize:vertical"></textarea>' +
    '</div>' +
    '<div>' +
    '<label style="font-size:0.7rem;font-weight:600;color:#555;display:block;margin-bottom:0.25rem">Middle School</label>' +
    '<textarea class="goal-middle-notes" placeholder="Specific considerations for middle schools" style="width:100%;min-height:60px;padding:0.5rem;font-size:0.8rem;border:1px solid #ddd;border-radius:4px;font-family:Inter,sans-serif;resize:vertical"></textarea>' +
    '</div>' +
    '<div>' +
    '<label style="font-size:0.7rem;font-weight:600;color:#555;display:block;margin-bottom:0.25rem">High School</label>' +
    '<textarea class="goal-high-notes" placeholder="Specific considerations for high schools" style="width:100%;min-height:60px;padding:0.5rem;font-size:0.8rem;border:1px solid #ddd;border-radius:4px;font-family:Inter,sans-serif;resize:vertical"></textarea>' +
    '</div>' +
    '</div>' +
    '</div>';

  var toggleHtml = '<div style="border-top:1px solid #e0e0e0;padding-top:0.75rem">' +
    '<button type="button" onclick="document.getElementById(\'' + goalId + '-notes\').style.display=document.getElementById(\'' + goalId + '-notes\').style.display===\'none\'?\'block\':\'none\';saveFormState()" style="padding:0.3rem 0.6rem;background:#f0f0f0;color:#666;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.75rem;font-weight:600">+ Add School Level Notes</button>' +
    '</div>';

  div.innerHTML = headerHtml + notesHtml + toggleHtml;

  goalsContainer.appendChild(div);
}

function restoreGoalsFromState() {
  var goalsContainer = document.getElementById('goalsContainer');
  if (!goalsContainer) return;
  goalsContainer.innerHTML = '';

  if (!planState.goals || planState.goals.length === 0) return;

  planState.goals.forEach(function(goal, idx) {
    var goalId = 'goal-restored-' + idx + '-' + Date.now();
    var div = document.createElement('div');
    div.className = 'goal-item';
    div.id = goalId;
    div.style.cssText = 'display:flex;flex-direction:column;gap:0.75rem;padding:0.75rem 1rem;background:white;border:1px solid #e0e0e0;border-left:3px solid #00B4CC;border-radius:6px;margin-bottom:0.5rem';

    var headerHtml = '<div style="display:flex;align-items:center;gap:0.75rem;width:100%">' +
      '<span style="flex:1;font-size:0.9rem;font-weight:600;color:#22333B">' + (goal.title || 'Untitled Goal') + '</span>' +
      '<input type="hidden" class="goal-title" value="' + (goal.title || '').replace(/"/g, '&quot;') + '">' +
      '<button onclick="document.getElementById(\'' + goalId + '\').remove();saveFormState();updatePreview()" style="padding:0.3rem 0.6rem;background:none;color:#999;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.78rem">Remove</button>' +
      '</div>';

    var slNotes = goal.schoolLevelNotes || {};
    var notesDisplay = (slNotes.elementary || slNotes.middle || slNotes.high) ? 'block' : 'none';
    var notesHtml = '<div style="border-top:1px solid #e0e0e0;padding-top:0.75rem;display:' + notesDisplay + '" class="school-level-notes" id="' + goalId + '-notes">' +
      '<div style="font-size:0.75rem;font-weight:700;color:#666;margin-bottom:0.5rem">School Level Differentiation (Optional)</div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.5rem">' +
      '<div>' +
      '<label style="font-size:0.7rem;font-weight:600;color:#555;display:block;margin-bottom:0.25rem">Elementary</label>' +
      '<textarea class="goal-elem-notes" placeholder="Specific considerations for elementary schools" style="width:100%;min-height:60px;padding:0.5rem;font-size:0.8rem;border:1px solid #ddd;border-radius:4px;font-family:Inter,sans-serif;resize:vertical">' + (slNotes.elementary || '') + '</textarea>' +
      '</div>' +
      '<div>' +
      '<label style="font-size:0.7rem;font-weight:600;color:#555;display:block;margin-bottom:0.25rem">Middle School</label>' +
      '<textarea class="goal-middle-notes" placeholder="Specific considerations for middle schools" style="width:100%;min-height:60px;padding:0.5rem;font-size:0.8rem;border:1px solid #ddd;border-radius:4px;font-family:Inter,sans-serif;resize:vertical">' + (slNotes.middle || '') + '</textarea>' +
      '</div>' +
      '<div>' +
      '<label style="font-size:0.7rem;font-weight:600;color:#555;display:block;margin-bottom:0.25rem">High School</label>' +
      '<textarea class="goal-high-notes" placeholder="Specific considerations for high schools" style="width:100%;min-height:60px;padding:0.5rem;font-size:0.8rem;border:1px solid #ddd;border-radius:4px;font-family:Inter,sans-serif;resize:vertical">' + (slNotes.high || '') + '</textarea>' +
      '</div>' +
      '</div>' +
      '</div>';

    var toggleHtml = '<div style="border-top:1px solid #e0e0e0;padding-top:0.75rem">' +
      '<button type="button" onclick="document.getElementById(\'' + goalId + '-notes\').style.display=document.getElementById(\'' + goalId + '-notes\').style.display===\'none\'?\'block\':\'none\';saveFormState()" style="padding:0.3rem 0.6rem;background:#f0f0f0;color:#666;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.75rem;font-weight:600">' + (notesDisplay === 'block' ? '- Hide' : '+ Add') + ' School Level Notes</button>' +
      '</div>';

    div.innerHTML = headerHtml + notesHtml + toggleHtml;
    goalsContainer.appendChild(div);
  });
}

// ============================================================================
// DEPARTMENT ALIGNMENT
// ============================================================================

function renderDepartmentAlignmentPage() {
  var container = document.getElementById('departmentSelectionContainer');
  if (!container) return;

  container.innerHTML = '<div class="dept-grid-5">' +
    DEFAULT_DEPARTMENTS.map(function(dept) {
      var checked = planState.selectedDepartments.indexOf(dept.name) !== -1 ? 'checked' : '';
      return '<label class="dept-checkbox" style="display:block;padding:0.75rem;border:1px solid #e0e0e0;border-radius:6px;background:white;cursor:pointer;transition:all 0.2s;text-align:center;min-height:80px;">' +
        '<input type="checkbox" name="department" value="' + dept.name + '" ' + checked + ' onchange="onDepartmentChange()" style="display:none" />' +
        '<div style="font-weight:700;font-size:0.8rem;color:#22333B;margin-bottom:0.3rem;line-height:1.3">' + dept.name + '</div>' +
        '<div style="font-size:0.7rem;color:#888;line-height:1.3">' + dept.desc + '</div>' +
        '</label>';
    }).join('') +
    '</div>';
  
  // Add checked styling
  container.querySelectorAll('input[name="department"]').forEach(function(cb) {
    var card = cb.parentElement;
    if (cb.checked) {
      card.style.borderColor = '#6ECF6E';
      card.style.backgroundColor = '#f0f8f0';
    }
    cb.addEventListener('change', function() {
      if (this.checked) {
        card.style.borderColor = '#6ECF6E';
        card.style.backgroundColor = '#f0f8f0';
      } else {
        card.style.borderColor = '#e0e0e0';
        card.style.backgroundColor = 'white';
      }
    });
  });
}

function onDepartmentChange() {
  planState.selectedDepartments = Array.from(document.querySelectorAll('input[name="department"]:checked')).map(function(cb) { return cb.value; });
  renderAlignmentMatrix();
  renderDepartmentDetails();
  updatePreview();
}

function renderDepartmentDetails() {
  var container = document.getElementById('departmentDetailsContainer');
  if (!container) return;
  
  var selectedDepts = planState.selectedDepartments || [];
  if (selectedDepts.length === 0) {
    container.innerHTML = '<p style="color:#999;font-size:0.9rem">Select departments to see details.</p>';
    return;
  }
  
  var html = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">';
  selectedDepts.forEach(function(deptName) {
    var dept = DEFAULT_DEPARTMENTS.find(function(d) { return d.name === deptName; });
    var desc = dept ? dept.desc : '';
    
    // Find which domains this dept is mapped to
    var alignedDomains = [];
    Object.keys(DEPARTMENT_GOAL_MAPPING).forEach(function(domain) {
      if (DEPARTMENT_GOAL_MAPPING[domain].indexOf(deptName) !== -1) {
        alignedDomains.push(domain);
      }
    });
    
    html += '<div style="padding:1rem;border:1px solid #e0e0e0;border-radius:6px;background:white">';
    html += '<h4 style="margin:0 0 0.5rem 0;font-size:0.9rem;color:#22333B">' + deptName + '</h4>';
    html += '<p style="margin:0 0 0.5rem 0;font-size:0.82rem;color:#888">' + desc + '</p>';
    if (alignedDomains.length) {
      html += '<p style="margin:0;font-size:0.8rem;color:#6B4C9A"><strong>Aligned to:</strong> ' + alignedDomains.join(', ') + '</p>';
    }
    html += '</div>';
  });
  html += '</div>';
  container.innerHTML = html;
}

function autoSelectDepartments() {
  var selectedDomains = planState.strategicDomains || [];
  var recommendedDepts = new Set();
  
  selectedDomains.forEach(function(domain) {
    var deptList = DEPARTMENT_GOAL_MAPPING[domain];
    if (deptList) {
      deptList.forEach(function(dept) {
        recommendedDepts.add(dept);
      });
    }
  });

  Array.from(recommendedDepts).forEach(function(deptName) {
    var checkbox = document.querySelector('input[name="department"][value="' + deptName + '"]');
    if (checkbox) {
      checkbox.checked = true;
      var card = checkbox.parentElement;
      if (card) { card.style.borderColor = '#6ECF6E'; card.style.backgroundColor = '#f0f8f0'; }
    }
  });

  planState.selectedDepartments = Array.from(document.querySelectorAll('input[name="department"]:checked')).map(function(cb) { return cb.value; });
  renderAlignmentMatrix();
  renderDepartmentDetails();
  updatePreview();
}

function renderAlignmentMatrix() {
  var container = document.getElementById('alignmentMatrixContainer');
  if (!container) return;

  var goals = planState.goals || [];
  var selectedDepts = planState.selectedDepartments || [];
  
  if (selectedDepts.length === 0) {
    container.innerHTML = '<p style="color:#999;font-size:0.9rem;padding:1rem;background:#f9f7f4;border-radius:4px">Select departments above to build the alignment matrix.</p>';
    return;
  }
  if (goals.length === 0) {
    container.innerHTML = '<p style="color:#999;font-size:0.9rem;padding:1rem;background:#f9f7f4;border-radius:4px">Add goals in Step 6 first, then come back to align departments.</p>';
    return;
  }

  // Build recommended alignments from domain mapping
  var deptDomains = {};
  Object.keys(DEPARTMENT_GOAL_MAPPING).forEach(function(domain) {
    DEPARTMENT_GOAL_MAPPING[domain].forEach(function(dept) {
      if (!deptDomains[dept]) deptDomains[dept] = [];
      deptDomains[dept].push(domain);
    });
  });

  var html = '<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;background:white;border-radius:6px;overflow:hidden">';
  html += '<thead><tr><th style="padding:0.75rem;text-align:left;background:#22333B;color:white;font-size:0.85rem;min-width:180px">Department</th>';
  goals.forEach(function(g, i) {
    var shortTitle = (g.title || 'Goal ' + (i+1));
    if (shortTitle.length > 35) shortTitle = shortTitle.substring(0, 35) + '...';
    html += '<th style="padding:0.75rem;text-align:center;background:#22333B;color:white;font-size:0.8rem;min-width:90px">' + shortTitle + '</th>';
  });
  html += '</tr></thead><tbody>';

  selectedDepts.forEach(function(dept, di) {
    var bgColor = di % 2 === 0 ? 'white' : '#f9f7f4';
    var deptId = dept.replace(/[^a-zA-Z0-9]/g, '_');
    html += '<tr style="background:' + bgColor + '"><td style="padding:0.6rem 0.75rem;border-bottom:1px solid #eee;font-size:0.82rem;font-weight:600;color:#22333B">' + dept + '</td>';
    
    goals.forEach(function(g, gi) {
      // Smart auto-recommend: only align dept to goals that match its domain
      var recommended = false;
      var myDomains = deptDomains[dept] || [];
      
      // Map goal keywords to domains
      var goalTitle = (g.title || '').toLowerCase();
      var goalDomainMatches = [];
      
      var domainKeywords = {
        'Student Learning & Achievement': ['graduation', 'reading', 'math', 'proficiency', 'academic', 'achievement', 'course failure', 'learning'],
        'Equity & Access': ['equity', 'access', 'english learner', 'special education', 'underserved', 'gap'],
        'Talent Management': ['teacher', 'retention', 'recruit', 'staff', 'talent', 'workforce'],
        'Operational Excellence': ['budget', 'facilities', 'operations', 'efficiency', 'expenditure'],
        'Community & Family Engagement': ['family', 'community', 'engagement', 'partnership', 'parent'],
        'Social-Emotional Learning': ['social', 'emotional', 'sel', 'wellness', 'behavior', 'suspension'],
        'College & Career Readiness': ['college', 'career', 'readiness', 'postsecondary', 'cte'],
        'Technology & Innovation': ['technology', 'digital', 'innovation', 'data', 'tech'],
        'Safety & School Climate': ['safety', 'climate', 'discipline', 'suspension', 'restorative']
      };
      
      Object.keys(domainKeywords).forEach(function(domain) {
        domainKeywords[domain].forEach(function(keyword) {
          if (goalTitle.indexOf(keyword) !== -1 && goalDomainMatches.indexOf(domain) === -1) {
            goalDomainMatches.push(domain);
          }
        });
      });
      
      // Only recommend if dept's domain matches the goal's domain
      myDomains.forEach(function(d) {
        if (goalDomainMatches.indexOf(d) !== -1) recommended = true;
      });
      
      var isAligned = planState.departmentAlignment && planState.departmentAlignment[dept] && planState.departmentAlignment[dept].indexOf(String(gi)) !== -1;
      var checkedAttr = (isAligned || recommended) ? ' checked' : '';
      html += '<td style="padding:0.6rem;text-align:center;border-bottom:1px solid #eee"><input type="checkbox" name="align_' + deptId + '" value="' + gi + '"' + checkedAttr + ' style="width:18px;height:18px;cursor:pointer;accent-color:#6ECF6E" /></td>';
    });
    html += '</tr>';
  });

  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// ============================================================================
// SUGGESTED INITIATIVES
// ============================================================================

function generateSuggestedInitiatives() {
  saveFormState();
  var container = document.getElementById('suggestedInitiativesContainer');
  var initiatives = [];

  var selectedDomains = planState.strategicDomains || [];
  

  if (selectedDomains.length === 0) {
    container.innerHTML = '<div style="padding:1.5rem;background:#f9f7f4;border-radius:6px;color:#888;text-align:center"><p style="margin:0">Select Strategic Domains in Step 5 first to see suggested initiatives.</p></div>';
    return;
  }
  selectedDomains.forEach(function(domain) {
    var initiativeTexts = {
      'Student Learning & Achievement': ['Implement data-driven instruction in all classrooms', 'Launch comprehensive literacy intervention program', 'Expand STEM curriculum and partnerships'],
      'Equity & Access': ['Create multi-tiered support system for underserved students', 'Establish English Learner achievement targets', 'Implement special education inclusive practices'],
      'Talent Management': ['Launch teacher recruitment and retention initiative', 'Establish professional learning communities', 'Create leadership development pipeline'],
      'Operational Excellence': ['Streamline central office processes', 'Invest in facility improvements', 'Optimize budget allocation for student outcomes'],
      'Community & Family Engagement': ['Expand family engagement in school decisions', 'Create community partnerships for student support', 'Launch bi-directional communication strategy'],
      'Social-Emotional Learning': ['Implement school-wide SEL curriculum', 'Create student wellness centers', 'Establish peer support networks'],
      'College & Career Readiness': ['Expand dual enrollment and CTE programs', 'Create college/career navigation support', 'Launch internship and apprenticeship partnerships'],
      'Technology & Innovation': ['Upgrade technology infrastructure', 'Provide digital literacy training for all staff', 'Implement innovative teaching tools and platforms'],
      'Safety & School Climate': ['Establish restorative practices in all schools', 'Create threat assessment and prevention protocols', 'Build positive school culture initiatives']
    };
    
    var domainInitiatives = initiativeTexts[domain] || [];
    domainInitiatives.forEach(function(text) {
      initiatives.push({ text: text, domain: domain });
    });
  });

  var initHtml = '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1rem">';
  initHtml += initiatives.map(function(init, i) {
    var popColors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A'];
    var domainIdx = (planState.strategicDomains || []).indexOf(init.domain);
    var color = popColors[domainIdx >= 0 ? domainIdx % popColors.length : i % popColors.length];
    return '<div style="background:white;border:1px solid #e0e0e0;border-top:3px solid ' + color + ';border-radius:6px;padding:1rem;display:flex;flex-direction:column;justify-content:space-between">' +
      '<div>' +
      '<p style="margin:0 0 0.5rem 0;font-size:0.9rem;font-weight:600;color:#22333B;line-height:1.4">' + init.text + '</p>' +
      '<p style="font-size:0.78rem;color:#888;margin:0 0 0.75rem 0"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + color + ';margin-right:0.3rem;vertical-align:middle"></span>' + init.domain + '</p>' +
      '</div>' +
      '<button onclick="addInitiativeFromSuggestion(' + i + ', this)" style="padding:0.4rem 0.8rem;background:' + color + ';color:white;border:none;border-radius:4px;cursor:pointer;font-size:0.82rem;font-weight:600;align-self:flex-start">Add to Plan</button>' +
      '</div>';
  }).join('');
  initHtml += '</div>';
  container.innerHTML = initHtml;
}

function addInitiativeFromSuggestion(index, btn) {
  var selectedDomains = planState.strategicDomains || [];
  var initiatives = [];

  var initiativeTexts = {
    'Student Learning & Achievement': ['Implement data-driven instruction in all classrooms', 'Launch comprehensive literacy intervention program', 'Expand STEM curriculum and partnerships'],
    'Equity & Access': ['Create multi-tiered support system for underserved students', 'Establish English Learner achievement targets', 'Implement special education inclusive practices'],
    'Talent Management': ['Launch teacher recruitment and retention initiative', 'Establish professional learning communities', 'Create leadership development pipeline'],
    'Operational Excellence': ['Streamline central office processes', 'Invest in facility improvements', 'Optimize budget allocation for student outcomes'],
    'Community & Family Engagement': ['Expand family engagement in school decisions', 'Create community partnerships for student support', 'Launch bi-directional communication strategy'],
    'Social-Emotional Learning': ['Implement school-wide SEL curriculum', 'Create student wellness centers', 'Establish peer support networks'],
    'College & Career Readiness': ['Expand dual enrollment and CTE programs', 'Create college/career navigation support', 'Launch internship and apprenticeship partnerships'],
    'Technology & Innovation': ['Upgrade technology infrastructure', 'Provide digital literacy training for all staff', 'Implement innovative teaching tools and platforms'],
    'Safety & School Climate': ['Establish restorative practices in all schools', 'Create threat assessment and prevention protocols', 'Build positive school culture initiatives']
  };

  selectedDomains.forEach(function(domain) {
    var domainInitiatives = initiativeTexts[domain] || [];
    domainInitiatives.forEach(function(text) {
      initiatives.push({ text: text, domain: domain });
    });
  });

  if (index >= 0 && index < initiatives.length) {
    addInitiative(initiatives[index].text);
    saveFormState();
    updatePreview();
  }

  // Animate the button
  if (btn) {
    var origText = btn.textContent;
    var origBg = btn.style.background;
    btn.textContent = '✓ Added!';
    btn.style.background = '#6ECF6E';
    btn.style.transition = 'all 0.3s ease';
    setTimeout(function() {
      btn.textContent = origText;
      btn.style.background = origBg;
    }, 1500);
  }
}

function addInitiative(prefillText) {
  var initText = prefillText || '';
  var initiativesContainer = document.getElementById('initiativesContainer');

  var initId = 'init-' + Date.now();
  var div = document.createElement('div');
  div.className = 'initiative-item';
  div.id = initId;
  div.style.cssText = 'display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;background:white;border:1px solid #e0e0e0;border-left:3px solid #6ECF6E;border-radius:6px;margin-bottom:0.5rem';
  div.innerHTML = '<span style="flex:1;font-size:0.9rem;font-weight:600;color:#22333B">' + (initText || 'Custom Initiative') + '</span>' +
    '<input type="hidden" class="initiative-title" value="' + (initText ? initText.replace(/"/g, '&quot;') : '') + '">' +
    '<button onclick="document.getElementById(\'' + initId + '\').remove();updateInitiativeCounter();saveFormState();updatePreview()" style="padding:0.3rem 0.6rem;background:none;color:#999;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-size:0.78rem">Remove</button>';

  initiativesContainer.appendChild(div);
  updateInitiativeCounter();
}

function updateInitiativeCounter() {
  var count = document.querySelectorAll('#initiativesContainer .initiative-item').length;
  var counter = document.getElementById('initiativeCounter');
  if (counter) counter.textContent = count;
}

// ============================================================================
// FILE UPLOAD
// ============================================================================

function handleFileUpload(event) {
  var file = event.target.files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var data = JSON.parse(e.target.result);
      Object.assign(planState, data);
      applyStateToUI();
      renderCoreValues();
      renderCompetencies();
      renderDomains();
      renderDepartmentAlignmentPage();
      generateSuggestedGoals();
      generateSuggestedInitiatives();
      updatePreview();
      alert('Plan loaded successfully!');
    } catch (err) {
      alert('Error loading plan: ' + err.message);
    }
  };
  reader.readAsText(file);
}

// ============================================================================
// REVIEW PAGE & PREVIEW
// ============================================================================

function renderDataProfile() {
  var container = document.getElementById('dataProfileContainer');
  if (!container) return;
  
  saveFormState();
  
  var html = '';
  var currentAmbition = planState.goalAmbition || '';
  
  // Ambition Level Selector - Temperature Gauge
  html += '<div style="background:white;border:1px solid #e0e0e0;border-radius:10px;padding:2rem;margin-bottom:2rem">';
  html += '<h3 style="font-family:Source Serif Pro,serif;font-size:1.3rem;color:#22333B;margin:0 0 0.5rem 0">Strategic Ambition Level</h3>';
  html += '<p style="font-size:0.85rem;color:#888;margin:0 0 1.5rem 0">Choose how aggressively your district will pursue improvement. Select a level to see growth projections below.</p>';
  
  var ambitionLevels = [
    { key: 'conservative', label: 'Conservative', desc: 'Steady, sustainable growth', color: '#00B4CC', multiplier: 0.6, explanation: 'Your targets will be 60% of research-based improvement rates. Realistic, achievable growth.' },
    { key: 'moderate', label: 'Moderate', desc: 'Research-based targets', color: '#D4A537', multiplier: 1.0, explanation: 'Your targets match proven research-based improvement rates. Ambitious yet evidence-based.' },
    { key: 'aggressive', label: 'Aggressive', desc: 'Bold, stretch goals', color: '#E07A5F', multiplier: 1.5, explanation: 'Your targets will be 150% of research rates. Transformational goals require bold action.' }
  ];
  
  // Three distinct clickable cards for ambition levels
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem">';
  ambitionLevels.forEach(function(level) {
    var isActive = planState.goalAmbition === level.key;
    var borderStyle = isActive ? 'border:2px solid ' + level.color + ';box-shadow:0 0 0 3px rgba(0,0,0,0.05), 0 4px 12px ' + level.color + '33' : 'border:2px solid #e0e0e0;box-shadow:0 2px 4px rgba(0,0,0,0.05)';
    html += '<div style="' + borderStyle + ';background:' + level.color + '08;border-radius:10px;padding:1.25rem;cursor:pointer;transition:all 0.2s ease" onclick="setGoalAmbition(\'' + level.key + '\')">';
    html += '<div style="background:' + level.color + ';color:white;width:100%;padding:0.75rem;border-radius:6px;text-align:center;margin-bottom:0.75rem">';
    html += '<div style="font-size:0.85rem;text-transform:uppercase;letter-spacing:1px;font-weight:700">' + level.label + '</div>';
    html += '<div style="font-size:1.5rem;font-weight:700;margin-top:0.25rem">' + level.multiplier.toFixed(2) + 'x</div>';
    html += '</div>';
    html += '<div style="font-size:0.85rem;color:#22333B;line-height:1.4;margin-bottom:0.5rem">' + level.desc + '</div>';
    html += '<div style="font-size:0.75rem;color:#888">' + level.key.charAt(0).toUpperCase() + level.key.slice(1) + ' approach</div>';
    html += '</div>';
  });
  html += '</div></div>';
  
  var popColors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A'];
  var dn = planState.districtName || 'Your District';
  

  // Performance Metrics Deep Dive
  html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.4rem;color:#22333B;margin:2rem 0 1rem 0;padding-bottom:0.5rem;border-bottom:3px solid #00B4CC">Performance Metrics Deep Dive</h2>';
  
  var metrics = [
    {
      field: 'graduationRate', label: 'Graduation Rate', unit: '%', target: 95, direction: 'higher',
      national: 87, improvementRate: 1.5,
      why: 'Graduation rate is the single most important indicator of a district\'s long-term impact on students. Every percentage point represents real students who will have dramatically better lifetime earning potential and health outcomes.',
      noble: 'A 95%+ graduation rate means your district is delivering on its fundamental promise to prepare every student for life after high school.'
    },
    {
      field: 'chronicAbsenceRate', label: 'Chronic Absenteeism Rate', unit: '%', target: 10, direction: 'lower',
      national: 16, improvementRate: 2.0,
      why: 'Students who miss 10% or more of school days are significantly less likely to read on grade level by 3rd grade and graduate on time. Chronic absence is the strongest early warning indicator.',
      noble: 'Getting below 10% means your systems are working to keep students connected, supported, and present every day.'
    },
    {
      field: 'readingProficiency', label: 'Reading Proficiency', unit: '%', target: 75, direction: 'higher',
      national: 33, improvementRate: 2.5,
      why: 'Literacy is the foundation of all academic achievement. Students who read proficiently by 3rd grade are 4x more likely to graduate on time.',
      noble: 'Reaching 75%+ proficiency means the vast majority of your students can access grade-level content across all subjects.'
    },
    {
      field: 'mathProficiency', label: 'Math Proficiency', unit: '%', target: 70, direction: 'higher',
      national: 26, improvementRate: 2.0,
      why: 'Math proficiency predicts college readiness and access to STEM careers. Districts with strong math outcomes open doors for students in the highest-growth sectors.',
      noble: 'A 70%+ math proficiency rate signals a district building quantitative thinkers who can compete in the modern economy.'
    },
    {
      field: 'courseFailureRate', label: 'Course Failure Rate', unit: '%', target: 5, direction: 'lower',
      national: 10, improvementRate: 1.5,
      why: 'Course failures are one of the strongest predictors of dropout. Each failed course reduces the probability of on-time graduation by up to 20%.',
      noble: 'Getting to 5% or below means your intervention systems catch students before they fall behind.'
    },
    {
      field: 'suspensionRate', label: 'Suspension Rate', unit: '%', target: 3, direction: 'lower',
      national: 5, improvementRate: 1.0,
      why: 'Suspensions remove students from learning and disproportionately affect students of color and students with disabilities. Research shows suspended students are 3x more likely to drop out.',
      noble: 'A rate below 3% indicates a district using restorative and preventative practices instead of exclusionary discipline.'
    },
    {
      field: 'teacherRetentionRate', label: 'Teacher Retention Rate', unit: '%', target: 92, direction: 'higher',
      national: 84, improvementRate: 1.5,
      why: 'Teacher turnover costs districts up to $20,000 per teacher and disrupts student learning. Retention is a proxy for school culture, leadership, and working conditions.',
      noble: 'A 92%+ retention rate reflects a district where teachers feel valued, supported, and committed to the mission.'
    }
  ];
  
  var severityColors = { strong: '#4caf50', monitor: '#ff9800', concern: '#f44336', critical: '#b71c1c' };
  var severityLabels = { strong: 'STRONG', monitor: 'MONITOR', concern: 'CONCERN', critical: 'CRITICAL' };
  var severityBgs = { strong: '#e8f5e9', monitor: '#fff8e1', concern: '#fff3e0', critical: '#fbe9e7' };
  
  var hasAnyData = false;
  
  metrics.forEach(function(m, mi) {
    var value = parseInt(planState[m.field]);
    if (isNaN(value)) return;
    hasAnyData = true;
    
    var severity = getSeverity(m.field, value);
    var color = popColors[mi % popColors.length];
    
    // Get per-metric ambition (falls back to global)
    if (!planState.metricAmbitions) planState.metricAmbitions = {};
    var metricAmbition = planState.metricAmbitions[m.field] || currentAmbition || 'moderate';
    var ambitionMultipliers = { conservative: 0.6, moderate: 1.0, aggressive: 1.5 };
    var ambitionMultiplier = ambitionMultipliers[metricAmbition] || 1.0;
    var adjustedImproveRate = m.improvementRate * ambitionMultiplier;
    
    // Calculate projections
    var yr1, yr3, yr5;
    if (m.direction === 'higher') {
      yr1 = Math.min(value + adjustedImproveRate, m.target);
      yr3 = Math.min(value + (adjustedImproveRate * 3), m.target);
      yr5 = Math.min(value + (adjustedImproveRate * 5), m.target);
    } else {
      yr1 = Math.max(value - adjustedImproveRate, m.target);
      yr3 = Math.max(value - (adjustedImproveRate * 3), m.target);
      yr5 = Math.max(value - (adjustedImproveRate * 5), m.target);
    }
    yr1 = Math.round(yr1 * 10) / 10;
    yr3 = Math.round(yr3 * 10) / 10;
    yr5 = Math.round(yr5 * 10) / 10;
    
    // Comparison to national
    var vsNational = '';
    if (m.direction === 'higher') {
      var diff = value - m.national;
      vsNational = diff >= 0 ? ('+' + diff + ' pts above national avg') : (Math.abs(diff) + ' pts below national avg');
    } else {
      var diff2 = m.national - value;
      vsNational = diff2 >= 0 ? (diff2 + ' pts better than national avg') : (Math.abs(diff2) + ' pts worse than national avg');
    }
    
    // Progress bar percentage
    var barPct;
    if (m.direction === 'higher') {
      barPct = Math.min(100, Math.round((value / m.target) * 100));
    } else {
      barPct = Math.min(100, Math.round(((m.target + (100 - value)) / (m.target + (100 - m.target))) * 100));
      // Simpler: for "lower is better" metrics, invert
      barPct = Math.max(0, Math.min(100, Math.round(100 - ((value - m.target) / (100 - m.target)) * 100)));
    }
    
    html += '<div style="background:white;border:1px solid #e0e0e0;border-radius:10px;margin-bottom:1.5rem;overflow:hidden">';
    
    // Header
    html += '<div style="background:' + severityBgs[severity] + ';padding:1.25rem 1.5rem;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center">';
    html += '<div>';
    html += '<h3 style="font-family:Source Serif Pro,serif;font-size:1.15rem;color:#22333B;margin:0">' + dn + ' - ' + m.label + '</h3>';
    html += '<p style="font-size:0.82rem;color:#888;margin:0.25rem 0 0 0">National Average: ' + m.national + m.unit + ' &middot; ' + vsNational + '</p>';
    html += '</div>';
    html += '<div style="text-align:right">';
    html += '<div style="font-size:2rem;font-weight:700;color:#22333B">' + value + '<span style="font-size:1rem">' + m.unit + '</span></div>';
    html += '<span style="display:inline-block;padding:0.2rem 0.6rem;border-radius:4px;font-size:0.75rem;font-weight:600;background:' + severityColors[severity] + ';color:white">' + severityLabels[severity] + '</span>';
    html += '</div></div>';
    
    // Progress bar
    html += '<div style="padding:1rem 1.5rem">';
    html += '<div style="display:flex;justify-content:space-between;font-size:0.78rem;color:#888;margin-bottom:0.3rem"><span>Current: ' + value + m.unit + '</span><span>Target: ' + m.target + m.unit + '</span></div>';
    html += '<div style="height:10px;background:#e0e0e0;border-radius:5px;overflow:hidden;position:relative">';
    html += '<div style="height:100%;width:' + barPct + '%;background:' + severityColors[severity] + ';border-radius:5px;transition:width 0.5s"></div>';
    html += '</div>';
    
    // Per-metric ambition picker
    html += '<div style="margin-top:1rem;display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:#f7f5f2;border-radius:8px;">';
    html += '<span style="font-size:0.8rem;font-weight:600;color:#22333B;">Ambition Level:</span>';
    var ambLevels = ['conservative', 'moderate', 'aggressive'];
    var ambLabels = { conservative: 'Conservative (0.6x)', moderate: 'Moderate (1.0x)', aggressive: 'Aggressive (1.5x)' };
    var ambColors = { conservative: '#00B4CC', moderate: '#D4A537', aggressive: '#E07A5F' };
    ambLevels.forEach(function(lvl) {
        var isActive = metricAmbition === lvl;
        var btnStyle = isActive
            ? 'background:' + ambColors[lvl] + ';color:white;border:2px solid ' + ambColors[lvl]
            : 'background:white;color:#5E503F;border:2px solid #e0e0e0';
        html += '<button style="' + btnStyle + ';padding:0.35rem 0.75rem;border-radius:6px;font-size:0.75rem;font-weight:600;cursor:pointer;transition:all 0.2s;font-family:Inter,sans-serif;" onclick="setMetricAmbition(\'' + m.field + '\',\'' + lvl + '\')">' + ambLabels[lvl] + '</button>';
    });
    html += '</div>';

    // YOY Projections
    html += '<div style="margin-top:1rem;display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem">';
    html += '<div style="text-align:center;padding:0.6rem;background:#f0f7f7;border-radius:6px;border-top:3px solid #00B4CC">';
    html += '<div style="font-size:0.7rem;color:#888;text-transform:uppercase;font-weight:600;letter-spacing:0.5px">Year 1</div>';
    html += '<div style="font-size:1.3rem;font-weight:700;color:#22333B">' + yr1 + m.unit + '</div>';
    html += '</div>';
    html += '<div style="text-align:center;padding:0.6rem;background:#f7f5f0;border-radius:6px;border-top:3px solid #D4A537">';
    html += '<div style="font-size:0.7rem;color:#888;text-transform:uppercase;font-weight:600;letter-spacing:0.5px">Year 3</div>';
    html += '<div style="font-size:1.3rem;font-weight:700;color:#22333B">' + yr3 + m.unit + '</div>';
    html += '</div>';
    html += '<div style="text-align:center;padding:0.6rem;background:#f0f8f0;border-radius:6px;border-top:3px solid #6ECF6E">';
    html += '<div style="font-size:0.7rem;color:#888;text-transform:uppercase;font-weight:600;letter-spacing:0.5px">Year 5</div>';
    html += '<div style="font-size:1.3rem;font-weight:700;color:#22333B">' + yr5 + m.unit + '</div>';
    html += '</div>';
    html += '</div>';
    
    // Why it matters
    html += '<div style="margin-top:1rem;padding:1rem;background:#fafafa;border-radius:6px;border-left:4px solid ' + color + '">';
    html += '<p style="font-size:0.85rem;color:#5E503F;margin:0 0 0.5rem 0;font-weight:600">Why This Matters</p>';
    html += '<p style="font-size:0.85rem;color:#666;margin:0 0 0.5rem 0;line-height:1.5">' + m.why + '</p>';
    html += '<p style="font-size:0.85rem;color:#22333B;margin:0;line-height:1.5;font-style:italic">' + m.noble + '</p>';
    html += '</div>';
    
    html += '</div></div>';
  });
  
  if (!hasAnyData) {
    html += '<div style="padding:2rem;background:#f9f7f4;border-radius:8px;text-align:center;color:#888">';
    html += '<p style="font-size:1.1rem;margin:0 0 0.5rem 0">No performance data available yet.</p>';
    html += '<p style="font-size:0.9rem;margin:0">Go back to Step 1: District Profile and enter your performance indicators to see your Strategic Data Profile.</p>';
    html += '</div>';
  }
  
  container.innerHTML = html;
}

function renderReviewPage() {
  var container = document.getElementById('reviewContainer');
  var checklistEl = document.getElementById('reviewChecklist');
  if (!container) return;

  saveFormState();

  var popColors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A'];
  var catColors = { 'Academic Competencies': '#00B4CC', 'Social-Emotional Competencies': '#E07A5F', 'Digital Competencies': '#6B4C9A', 'Career Readiness': '#D4A537' };
  var dn = planState.districtName || 'Your District';
  var year = new Date().getFullYear();

  // ---- Completion checks ----
  var compCount = 0;
  if (planState.competencies) {
    Object.keys(planState.competencies).forEach(function(cat) {
      if (planState.competencies[cat] && planState.competencies[cat].length) compCount += planState.competencies[cat].length;
    });
  }
  var checks = [
    { label: 'District Profile', done: !!planState.districtName, step: 1 },
    { label: 'Stakeholder Engagement', done: !!(planState.stakeholderConveningPlan && Object.keys(planState.stakeholderConveningPlan).length), step: 2 },
    { label: 'Vision & Mission', done: !!(planState.vision || planState.mission), step: 3 },
    { label: 'Core Values', done: !!(planState.coreValues && planState.coreValues.length), step: 4 },
    { label: 'Competencies', done: compCount > 0, step: 5 },
    { label: 'Strategic Domains', done: !!(planState.strategicDomains && planState.strategicDomains.length), step: 6 },
    { label: 'Strategic Goals', done: !!(planState.goals && planState.goals.length), step: 7 },
    { label: 'Goal Forecasting', done: !!planState.goalAmbition, step: 8 },
    { label: 'Central Office Alignment', done: !!(planState.selectedDepartments && planState.selectedDepartments.length), step: 9 },
    { label: 'Action Initiatives', done: !!(planState.initiatives && planState.initiatives.length), step: 10 },
    { label: 'Stakeholder Review', done: !!(planState.postPlanAnalysis && Object.keys(planState.postPlanAnalysis).length), step: 11 },
    { label: 'Implementation Calendar', done: !!(planState.calendar && Object.keys(planState.calendar).length), step: 12 }
  ];
  var doneCount = checks.filter(function(c) { return c.done; }).length;
  var pct = Math.round((doneCount / checks.length) * 100);

  // ---- CHECKLIST (compact, at top) ----
  var clHtml = '';
  clHtml += '<div style="background:white;border:1px solid #e0d5c7;border-radius:8px;padding:1rem 1.25rem;margin-bottom:2rem">';
  clHtml += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem">';
  clHtml += '<div style="font-family:Inter,sans-serif;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#5E503F">Plan Completion</div>';
  clHtml += '<div style="font-family:Inter,sans-serif;font-size:0.85rem;font-weight:700;color:' + (pct === 100 ? '#2e7d32' : '#D4A537') + '">' + pct + '%</div>';
  clHtml += '</div>';
  clHtml += '<div style="height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden;margin-bottom:0.75rem"><div style="height:100%;width:' + pct + '%;background:' + (pct === 100 ? 'linear-gradient(to right,#6ECF6E,#2e7d32)' : 'linear-gradient(to right,#D4A537,#E07A5F)') + ';border-radius:3px;transition:width 0.3s"></div></div>';
  clHtml += '<div style="display:flex;flex-wrap:wrap;gap:0.4rem">';
  checks.forEach(function(c) {
    if (c.done) {
      clHtml += '<span onclick="stepGoto(' + c.step + ')" style="cursor:pointer;display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border-radius:4px;font-size:0.75rem;font-weight:600;background:#e8f5e9;color:#2e7d32;border:1px solid #c8e6c9"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>' + c.label + '</span>';
    } else {
      clHtml += '<span onclick="stepGoto(' + c.step + ')" style="cursor:pointer;display:inline-flex;align-items:center;gap:0.3rem;padding:0.25rem 0.6rem;border-radius:4px;font-size:0.75rem;font-weight:600;background:#fff3e0;color:#e65100;border:1px solid #ffe0b2"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#e65100" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' + c.label + '</span>';
    }
  });
  clHtml += '</div></div>';
  if (checklistEl) checklistEl.innerHTML = clHtml;

  // ---- SHOWCASE-QUALITY PLAN REVIEW ----
  var html = '';

  // Hero Banner (showcase style)
  html += '<div style="background:linear-gradient(135deg,#EAE0D5 0%,#E8DCC9 100%);padding:2rem 2.5rem;border-bottom:3px solid transparent;border-image:linear-gradient(to right,#6ECF6E,#00B4CC,#D4A537,#E07A5F,#6B4C9A) 1;margin-bottom:0">';
  html += '<h1 style="font-family:Source Serif Pro,serif;font-size:1.8rem;font-weight:700;color:#22333B;margin:0 0 0.25rem 0">' + dn + '</h1>';
  html += '<div style="font-family:Inter,sans-serif;font-size:1rem;color:#D4A537;font-weight:600">Strategic Plan ' + year + ' - ' + (year + 3) + '</div>';
  html += '</div>';

  // ---- Section: District at a Glance ----
  if (planState.districtName) {
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">District at a Glance</h2>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-top:1.25rem">';
    var statCards = [
      { label: 'Enrollment', value: planState.studentEnrollment, color: '#00B4CC' },
      { label: 'Schools', value: planState.numberOfSchools, color: '#6ECF6E' },
      { label: 'Teachers', value: planState.teacherCount, color: '#D4A537' },
      { label: 'Grad Rate', value: planState.graduationRate ? planState.graduationRate + '%' : '', color: '#6ECF6E', sev: planState.graduationRate ? getSeverity('graduationRate', parseInt(planState.graduationRate)) : '' },
      { label: 'Chronic Absence', value: planState.chronicAbsenceRate ? planState.chronicAbsenceRate + '%' : '', color: '#E07A5F', sev: planState.chronicAbsenceRate ? getSeverity('chronicAbsenceRate', parseInt(planState.chronicAbsenceRate)) : '' },
      { label: 'Reading Prof.', value: planState.readingProficiency ? planState.readingProficiency + '%' : '', color: '#00B4CC', sev: planState.readingProficiency ? getSeverity('readingProficiency', parseInt(planState.readingProficiency)) : '' },
      { label: 'Math Prof.', value: planState.mathProficiency ? planState.mathProficiency + '%' : '', color: '#6B4C9A', sev: planState.mathProficiency ? getSeverity('mathProficiency', parseInt(planState.mathProficiency)) : '' }
    ];
    var sevColorMap = { strong: '#6ECF6E', monitor: '#D4A537', concern: '#E07A5F', critical: '#b71c1c' };
    statCards.forEach(function(sc) {
      if (!sc.value) return;
      var borderColor = sc.sev ? (sevColorMap[sc.sev] || sc.color) : sc.color;
      var valColor = sc.sev ? (sevColorMap[sc.sev] || '#22333B') : '#22333B';
      html += '<div style="background:white;border:1px solid #e0d5c7;border-top:4px solid ' + borderColor + ';border-radius:8px;padding:1rem;text-align:center">';
      html += '<div style="font-family:Source Serif Pro,serif;font-size:1.5rem;font-weight:700;color:' + valColor + ';margin-bottom:0.25rem">' + sc.value + '</div>';
      html += '<div style="font-family:Inter,sans-serif;font-size:0.7rem;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;color:#5E503F">' + sc.label + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  // ---- Section: Vision & Mission ----
  if (planState.vision || planState.mission) {
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7;background:#FAFAF8">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Vision & Mission</h2>';
    html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-top:1.25rem">';
    // Vision card
    html += '<div style="background:white;border:1px solid #e0d5c7;border-top:4px solid #00B4CC;border-radius:8px;padding:1.5rem">';
    html += '<div style="font-family:Inter,sans-serif;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#00B4CC;margin-bottom:0.75rem">Vision</div>';
    html += '<p style="font-family:Source Serif Pro,serif;font-size:1rem;font-style:italic;line-height:1.7;color:#22333B;margin:0">' + (planState.vision || '<span style="color:#ccc">Not yet defined</span>') + '</p>';
    html += '</div>';
    // Mission card
    html += '<div style="background:white;border:1px solid #e0d5c7;border-top:4px solid #D4A537;border-radius:8px;padding:1.5rem">';
    html += '<div style="font-family:Inter,sans-serif;font-size:0.6875rem;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#D4A537;margin-bottom:0.75rem">Mission</div>';
    html += '<p style="font-family:Source Serif Pro,serif;font-size:1rem;font-style:italic;line-height:1.7;color:#22333B;margin:0">' + (planState.mission || '<span style="color:#ccc">Not yet defined</span>') + '</p>';
    html += '</div>';
    html += '</div></div>';
  }

  // ---- Section: Core Values ----
  if (planState.coreValues && planState.coreValues.length) {
    var valueDescs = { 'Excellence': 'Pursuing the highest standards in everything we do.', 'Equity': 'Ensuring every student gets what they need to succeed.', 'Integrity': 'Acting with honesty, transparency, and ethical commitment.', 'Innovation': 'Embracing creative solutions and continuous improvement.', 'Collaboration': 'Working together across teams, schools, and community.', 'Compassion': 'Leading with empathy, care, and understanding.', 'Accountability': 'Owning outcomes and delivering on commitments.', 'Inclusivity': 'Creating belonging for every student and family.', 'Respect': 'Honoring the dignity and voice of every individual.', 'Growth Mindset': 'Believing every person can learn, grow, and improve.', 'Student-Centered': 'Putting students at the center of every decision.', 'Community': 'Building strong partnerships beyond school walls.', 'Transparency': 'Communicating openly and sharing data honestly.', 'Continuous Improvement': 'Using data and feedback to get better every day.', 'Empowerment': 'Giving people the tools and trust to lead.' };
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Core Values</h2>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-top:1.25rem">';
    planState.coreValues.forEach(function(v, i) {
      var color = popColors[i % popColors.length];
      html += '<div style="background:white;border:1px solid #e0d5c7;border-left:4px solid ' + color + ';padding:1rem;border-radius:4px">';
      html += '<h4 style="font-family:Inter,sans-serif;font-size:0.8rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#22333B;margin:0 0 0.4rem 0">' + v + '</h4>';
      html += '<p style="font-size:0.82rem;line-height:1.5;color:#5E503F;margin:0">' + (valueDescs[v] || '') + '</p>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  // ---- Section: Competencies ----
  if (compCount > 0) {
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7;background:#FAFAF8">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Graduate Competencies</h2>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:1.25rem">';
    Object.keys(planState.competencies).forEach(function(cat) {
      if (!planState.competencies[cat] || !planState.competencies[cat].length) return;
      var color = catColors[cat] || '#00B4CC';
      html += '<div style="background:white;border:1px solid #e0d5c7;border-top:4px solid ' + color + ';border-radius:8px;padding:1.25rem">';
      html += '<h4 style="font-family:Inter,sans-serif;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:' + color + ';margin:0 0 0.75rem 0">' + cat + '</h4>';
      planState.competencies[cat].forEach(function(skill) {
        html += '<div style="padding:0.4rem 0;font-size:0.85rem;color:#5E503F;border-bottom:1px solid #f0ebe3">&#x25B8; ' + skill + '</div>';
      });
      html += '</div>';
    });
    html += '</div></div>';
  }

  // ---- Section: Strategic Domains ----
  if (planState.strategicDomains && planState.strategicDomains.length) {
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Strategic Domains</h2>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:16px;margin-top:1.25rem">';
    var domainIcons = { 'Student Learning & Achievement': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', 'Equity & Access': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>', 'Talent Management': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' };
    planState.strategicDomains.forEach(function(d, i) {
      var color = popColors[i % popColors.length];
      var icon = domainIcons[d] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      html += '<div style="background:white;border:2px solid ' + color + ';border-radius:8px;padding:1.25rem;text-align:center">';
      html += '<div style="color:' + color + ';margin-bottom:0.5rem">' + icon + '</div>';
      html += '<h4 style="font-family:Source Serif Pro,serif;font-size:0.85rem;font-weight:700;color:#22333B;margin:0">' + d + '</h4>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  // ---- Section: Strategic Goals ----
  if (planState.goals && planState.goals.length) {
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7;background:#FAFAF8">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Strategic Goals</h2>';
    html += '<div style="margin-top:1.25rem">';
    planState.goals.forEach(function(g, i) {
      var color = popColors[i % popColors.length];
      html += '<div style="margin-bottom:1rem;padding-bottom:1rem;border-bottom:1px solid #e0d5c7">';
      html += '<div style="display:flex;align-items:start;gap:0.75rem">';
      html += '<div style="width:28px;height:28px;border-radius:50%;background:' + color + ';color:white;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:700;flex-shrink:0">' + (i+1) + '</div>';
      html += '<div style="flex:1">';
      html += '<h4 style="font-family:Source Serif Pro,serif;font-size:0.95rem;font-weight:700;color:#22333B;margin:0;line-height:1.5">' + (g.title || 'Untitled Goal') + '</h4>';
      html += '</div></div></div>';
    });
    html += '</div></div>';
  }

  // ---- Section: Goal Forecasting ----
  if (planState.goalAmbition) {
    var ambitionLabel = { conservative: 'Conservative', moderate: 'Moderate', aggressive: 'Aggressive' }[planState.goalAmbition] || '';
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Goal Forecasting</h2>';
    html += '<p style="font-family:Inter,sans-serif;font-size:0.85rem;color:#5E503F;margin:0.5rem 0 1rem 0">Ambition Level: <strong style="color:#D4A537">' + ambitionLabel + '</strong></p>';

    var reviewMetrics = [
      { field: 'graduationRate', label: 'Graduation Rate', unit: '%', target: 95, direction: 'higher', rate: 1.5 },
      { field: 'chronicAbsenceRate', label: 'Chronic Absenteeism', unit: '%', target: 10, direction: 'lower', rate: 2.0 },
      { field: 'readingProficiency', label: 'Reading Proficiency', unit: '%', target: 75, direction: 'higher', rate: 2.5 },
      { field: 'mathProficiency', label: 'Math Proficiency', unit: '%', target: 70, direction: 'higher', rate: 2.0 },
      { field: 'courseFailureRate', label: 'Course Failure Rate', unit: '%', target: 5, direction: 'lower', rate: 1.5 },
      { field: 'suspensionRate', label: 'Suspension Rate', unit: '%', target: 3, direction: 'lower', rate: 1.0 },
      { field: 'teacherRetentionRate', label: 'Teacher Retention', unit: '%', target: 92, direction: 'higher', rate: 1.5 }
    ];
    var reviewAmbMult = { conservative: 0.6, moderate: 1.0, aggressive: 1.5 }[planState.goalAmbition] || 1.0;
    var hasData = false;

    html += '<table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif;font-size:0.8125rem;background:white;border-radius:6px;overflow:hidden">';
    html += '<thead><tr style="background:#22333B;color:white"><th style="padding:10px 14px;text-align:left;font-weight:700">Metric</th><th style="padding:10px 14px;text-align:center">Current</th><th style="padding:10px 14px;text-align:center">Year 3</th><th style="padding:10px 14px;text-align:center">Year 5</th><th style="padding:10px 14px;text-align:center">Target</th></tr></thead><tbody>';
    reviewMetrics.forEach(function(rm) {
      var val = parseInt(planState[rm.field]);
      if (isNaN(val)) return;
      hasData = true;
      var adjRate = rm.rate * reviewAmbMult;
      var yr3 = rm.direction === 'higher' ? Math.min(val + (adjRate * 3), rm.target) : Math.max(val - (adjRate * 3), rm.target);
      var yr5 = rm.direction === 'higher' ? Math.min(val + (adjRate * 5), rm.target) : Math.max(val - (adjRate * 5), rm.target);
      yr3 = Math.round(yr3 * 10) / 10;
      yr5 = Math.round(yr5 * 10) / 10;
      html += '<tr style="border-bottom:1px solid #e0d5c7">';
      html += '<td style="padding:10px 14px;font-weight:600;color:#22333B">' + rm.label + '</td>';
      html += '<td style="padding:10px 14px;text-align:center;color:#5E503F">' + val + rm.unit + '</td>';
      html += '<td style="padding:10px 14px;text-align:center;color:#2e7d32;font-weight:600">' + yr3 + rm.unit + '</td>';
      html += '<td style="padding:10px 14px;text-align:center;color:#2e7d32;font-weight:600">' + yr5 + rm.unit + '</td>';
      html += '<td style="padding:10px 14px;text-align:center;color:#D4A537;font-weight:600">' + rm.target + rm.unit + '</td>';
      html += '</tr>';
    });
    html += '</tbody></table>';
    if (!hasData) html += '<p style="font-size:0.85rem;color:#888;margin-top:0.5rem">Enter performance data in Step 1 to see metric projections.</p>';
    html += '</div>';
  }

  // ---- Section: Central Office Alignment ----
  if (planState.selectedDepartments && planState.selectedDepartments.length) {
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7;background:#FAFAF8">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Central Office Alignment</h2>';

    if (planState.strategicDomains && planState.strategicDomains.length) {
      html += '<table style="width:100%;border-collapse:collapse;font-family:Inter,sans-serif;font-size:0.8125rem;background:white;border-radius:6px;overflow:hidden;margin-top:1.25rem">';
      html += '<thead><tr style="background:#22333B;color:white"><th style="padding:12px 14px;text-align:left;font-weight:700">Department</th><th style="padding:12px 14px;text-align:left;font-weight:700">Aligned Domains</th></tr></thead><tbody>';
      planState.selectedDepartments.forEach(function(dept) {
        var alignedDomains = [];
        if (typeof DEPARTMENT_GOAL_MAPPING !== 'undefined') {
          planState.strategicDomains.forEach(function(domain) {
            if (DEPARTMENT_GOAL_MAPPING[domain] && DEPARTMENT_GOAL_MAPPING[domain].indexOf(dept) !== -1) {
              alignedDomains.push(domain);
            }
          });
        }
        html += '<tr style="border-bottom:1px solid #e0d5c7">';
        html += '<td style="padding:12px 14px;font-weight:600;color:#22333B">' + dept + '</td>';
        html += '<td style="padding:12px 14px"><div style="display:flex;gap:4px;flex-wrap:wrap">';
        if (alignedDomains.length) {
          alignedDomains.forEach(function(dom, di) {
            html += '<span style="display:inline-block;padding:2px 8px;border-radius:3px;font-size:0.7rem;font-weight:600;background:' + (di === 0 ? '#22333B' : '#D4A537') + ';color:white">' + dom + '</span>';
          });
        } else {
          html += '<span style="color:#ccc;font-size:0.8rem">No direct alignment</span>';
        }
        html += '</div></td></tr>';
      });
      html += '</tbody></table>';
    } else {
      html += '<p style="font-family:Inter,sans-serif;font-size:0.9rem;color:#5E503F;margin-top:1rem">' + planState.selectedDepartments.join(' &middot; ') + '</p>';
    }
    html += '</div>';
  }

  // ---- Section: Action Initiatives ----
  if (planState.initiatives && planState.initiatives.length) {
    html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7">';
    html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Action Initiatives</h2>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-top:1.25rem">';
    planState.initiatives.forEach(function(init, i) {
      var color = popColors[i % popColors.length];
      html += '<div style="background:white;border:1px solid #e0d5c7;border-top:4px solid ' + color + ';border-radius:8px;padding:1.25rem">';
      html += '<h4 style="font-family:Source Serif Pro,serif;font-size:0.9rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;line-height:1.4">' + (init.title || 'Untitled') + '</h4>';
      html += '<div style="font-family:Inter,sans-serif;font-size:0.75rem;color:#D4A537;font-weight:600">Initiative ' + (i+1) + '</div>';
      html += '</div>';
    });
    html += '</div></div>';
  }

  // ---- Section: Implementation Timeline ----
  html += '<div style="padding:2rem 2.5rem;border-bottom:1px solid #e0d5c7;background:#FAFAF8">';
  html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Implementation Timeline</h2>';
  var timelineYears = [
    { label: 'Year 1: Foundation', color: '#6ECF6E', items: ['Strategic plan launch and communication', 'Stakeholder engagement sessions', 'Baseline data collection', 'Initial resource allocation', 'Quick-win initiative launch'] },
    { label: 'Year 2: Implementation', color: '#00B4CC', items: ['Full initiative rollout', 'First progress monitoring cycle', 'Professional development ramp-up', 'Mid-course corrections', 'Board progress presentation'] },
    { label: 'Year 3: Acceleration', color: '#D4A537', items: ['Scale successful programs', 'Deepen data-driven practices', 'Expand community partnerships', 'Comprehensive progress review', 'Sustainability planning'] },
    { label: 'Year 4+: Sustainability', color: '#6B4C9A', items: ['Sustain and institutionalize gains', 'Next-cycle strategic planning', 'Legacy documentation', 'Transition planning', 'Celebrate achievements'] }
  ];
  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:1.25rem">';
  timelineYears.forEach(function(ty) {
    html += '<div style="border:2px solid ' + ty.color + ';border-radius:8px;padding:1.25rem;background:' + ty.color + '0F">';
    html += '<h4 style="font-family:Inter,sans-serif;font-size:0.75rem;font-weight:700;text-transform:uppercase;color:' + ty.color + ';margin:0 0 0.75rem 0;text-align:center">' + ty.label + '</h4>';
    html += '<ul style="list-style:none;padding:0;margin:0;font-family:Inter,sans-serif;font-size:0.78rem;text-align:left">';
    ty.items.forEach(function(item) {
      html += '<li style="padding:4px 0 4px 14px;color:#5E503F;position:relative"><span style="position:absolute;left:0;color:' + ty.color + ';font-weight:bold">&#x25B8;</span>' + item + '</li>';
    });
    html += '</ul></div>';
  });
  html += '</div></div>';

  // ---- Section: Accountability Structure ----
  html += '<div style="padding:2rem 2.5rem;border-bottom:3px solid transparent;border-image:linear-gradient(to right,#6ECF6E,#00B4CC,#D4A537,#E07A5F,#6B4C9A) 1">';
  html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.35rem;font-weight:700;color:#22333B;margin:0 0 0.5rem 0;padding-bottom:0.5rem;border-bottom:4px solid #D4A537;display:inline-block">Accountability Structure</h2>';
  var acctRoles = [
    { title: 'Superintendent', color: '#6B4C9A', items: ['Plan implementation leadership', 'Quarterly progress monitoring', 'Annual community presentations', 'Budget and resource alignment', 'Cabinet accountability'] },
    { title: 'Cabinet & Directors', color: '#00B4CC', items: ['Department goal achievement', 'Cross-departmental coordination', 'Monthly progress reviews', 'Resource management', 'Initiative oversight'] },
    { title: 'School Principals', color: '#D4A537', items: ['School-level plan alignment', 'Teacher support and development', 'Data-driven decision making', 'Family engagement', 'Culture and climate building'] },
    { title: 'Teachers & Staff', color: '#E07A5F', items: ['Classroom strategy implementation', 'Professional learning participation', 'Student data monitoring', 'Collaborative team engagement', 'Continuous improvement practices'] },
    { title: 'School Board', color: '#6ECF6E', items: ['Policy adoption and approval', 'Budget allocation oversight', 'Semi-annual progress review', 'Community accountability', 'Strategic governance'] },
    { title: 'Families & Community', color: '#22333B', items: ['Participation in engagement events', 'Feedback through surveys and forums', 'Support for student learning at home', 'Advocacy for district priorities', 'Partnership and volunteerism'] }
  ];
  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:1.25rem">';
  acctRoles.forEach(function(role) {
    html += '<div style="background:white;border:1px solid #e0d5c7;border-left:4px solid ' + role.color + ';padding:1rem;border-radius:4px">';
    html += '<h4 style="font-family:Inter,sans-serif;font-size:0.78rem;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;color:#22333B;margin:0 0 0.5rem 0">' + role.title + '</h4>';
    html += '<ul style="list-style:none;padding:0;margin:0">';
    role.items.forEach(function(item) {
      html += '<li style="font-size:0.78rem;color:#5E503F;padding:3px 0;line-height:1.4">&#x2022; ' + item + '</li>';
    });
    html += '</ul></div>';
  });
  html += '</div></div>';

  container.innerHTML = html;

  // Show/hide finalize based on completion
  var finalizeEl = document.getElementById('finalizeSection');
  if (finalizeEl) {
    finalizeEl.style.display = (pct === 100) ? 'block' : 'none';
  }
}


function updatePreview() {
  var previewContainer = document.getElementById('previewContent');
  if (!previewContainer) return;

  saveFormState();

  var popColors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A'];
  var html = '';

  // District Profile Card
  html += '<h4>District Profile</h4>';
  if (planState.districtName) {
    html += '<p style="font-size:1rem;font-weight:700;color:#22333B;margin-bottom:0.25rem">' + planState.districtName + '</p>';
    if (planState.districtLocation) html += '<p style="font-size:0.85rem;color:#5E503F;margin-top:0">' + planState.districtLocation + '</p>';
    var stats = [];
    if (planState.studentEnrollment) stats.push('<strong>' + Number(planState.studentEnrollment).toLocaleString() + '</strong> students');
    if (planState.numberOfSchools) stats.push('<strong>' + planState.numberOfSchools + '</strong> schools');
    if (planState.teacherCount) stats.push('<strong>' + planState.teacherCount + '</strong> teachers');
    if (stats.length) html += '<p style="font-size:0.82rem;color:#5E503F">' + stats.join(' &middot; ') + '</p>';

    // Key metrics with severity colors
    var metricFields = [
      { key: 'graduationRate', label: 'Grad Rate', suffix: '%', good: 'high' },
      { key: 'chronicAbsenceRate', label: 'Chronic Abs', suffix: '%', good: 'low' },
      { key: 'readingProficiency', label: 'Reading', suffix: '%', good: 'high' },
      { key: 'mathProficiency', label: 'Math', suffix: '%', good: 'high' }
    ];
    var metricHtml = '';
    metricFields.forEach(function(m) {
      var val = planState[m.key];
      if (val) {
        var severity = getSeverity(m.key, parseInt(val));
        var sevColors = { strong: '#4caf50', monitor: '#ff9800', concern: '#f44336', critical: '#b71c1c' };
        var color = sevColors[severity] || '#888';
        metricHtml += '<span style="display:inline-block;padding:0.2rem 0.5rem;margin:0.15rem;border-radius:3px;font-size:0.75rem;font-weight:600;background:' + color + '15;color:' + color + ';border:1px solid ' + color + '30">' + m.label + ': ' + val + m.suffix + '</span>';
      }
    });
    if (metricHtml) html += '<div style="margin-top:0.5rem">' + metricHtml + '</div>';
  } else {
    html += '<p style="color:#999;font-size:0.85rem">No district selected yet</p>';
  }

  // Vision & Mission
  if (planState.vision || planState.mission) {
    html += '<h4>Vision & Mission</h4>';
    if (planState.vision) html += '<div style="font-size:0.85rem;font-style:italic;color:#5E503F;padding:0.6rem;background:#f0f7f7;border-left:3px solid #00B4CC;border-radius:0 4px 4px 0;margin-bottom:0.5rem">' + planState.vision + '</div>';
    if (planState.mission) html += '<div style="font-size:0.85rem;font-style:italic;color:#5E503F;padding:0.6rem;background:#f7f5f0;border-left:3px solid #D4A537;border-radius:0 4px 4px 0">' + planState.mission + '</div>';
  }

  // Core Values
  if (planState.coreValues && planState.coreValues.length) {
    html += '<h4>Core Values (' + planState.coreValues.length + ')</h4>';
    html += '<div style="display:flex;flex-wrap:wrap;gap:0.3rem">';
    planState.coreValues.forEach(function(v, i) {
      var color = popColors[i % popColors.length];
      html += '<span style="display:inline-block;padding:0.2rem 0.6rem;border-radius:12px;font-size:0.78rem;font-weight:500;background:' + color + '15;color:' + color + ';border:1px solid ' + color + '40">' + v + '</span>';
    });
    html += '</div>';
  }

  // Competencies - with category-matched colors
  var catColorsPreview = {
    'Academic Competencies': '#00B4CC',
    'Social-Emotional Competencies': '#E07A5F',
    'Digital Competencies': '#6B4C9A',
    'Career Readiness': '#D4A537'
  };
  var compCount = 0;
  if (planState.competencies) {
    Object.keys(planState.competencies).forEach(function(cat) {
      if (planState.competencies[cat] && planState.competencies[cat].length) compCount += planState.competencies[cat].length;
    });
  }
  if (compCount > 0) {
    html += '<h4>Competencies (' + compCount + ')</h4>';
    Object.keys(planState.competencies).forEach(function(cat) {
      if (planState.competencies[cat] && planState.competencies[cat].length) {
        var catColor = catColorsPreview[cat] || '#22333B';
        html += '<p style="font-size:0.82rem;margin-bottom:0.3rem"><strong style="color:' + catColor + '">' + cat + '</strong> <span style="color:#888">(' + planState.competencies[cat].length + ')</span></p>';
        html += '<p style="font-size:0.8rem;color:#5E503F;margin-top:0;padding-left:0.5rem">' + planState.competencies[cat].join(', ') + '</p>';
      }
    });
  }

  // Strategic Domains
  if (planState.strategicDomains && planState.strategicDomains.length) {
    html += '<h4>Strategic Domains (' + planState.strategicDomains.length + ')</h4>';
    planState.strategicDomains.forEach(function(d, i) {
      var color = popColors[i % popColors.length];
      html += '<div style="font-size:0.82rem;padding:0.4rem 0.6rem;border-left:3px solid ' + color + ';margin-bottom:0.4rem;background:#fafafa;border-radius:0 4px 4px 0">' + d + '</div>';
    });
  }

  // Goals
  if (planState.goals && planState.goals.length) {
    html += '<h4>Goals (' + planState.goals.length + ')</h4>';
    planState.goals.forEach(function(g, i) {
      html += '<div style="font-size:0.82rem;padding:0.4rem 0.6rem;border-left:3px solid #D4A537;margin-bottom:0.3rem;background:#fffbf5;border-radius:0 4px 4px 0"><strong>' + (i+1) + '.</strong> ' + (g.title || 'Untitled') + '</div>';
    });
  }

  // Departments
  if (planState.selectedDepartments && planState.selectedDepartments.length) {
    html += '<h4>Departments (' + planState.selectedDepartments.length + ')</h4>';
    html += '<p style="font-size:0.8rem;color:#5E503F;line-height:1.5">' + planState.selectedDepartments.join(' &middot; ') + '</p>';
  }

  // Action Initiatives
  if (planState.initiatives && planState.initiatives.length) {
    html += '<h4>Action Initiatives (' + planState.initiatives.length + ')</h4>';
    planState.initiatives.forEach(function(init, i) {
      var color = popColors[i % popColors.length];
      html += '<div style="font-size:0.82rem;padding:0.4rem 0.6rem;border-left:3px solid ' + color + ';margin-bottom:0.3rem;background:#fafafa;border-radius:0 4px 4px 0"><strong>' + (i+1) + '.</strong> ' + (init.title || init || 'Untitled Initiative') + '</div>';
    });
  }

  // Goal Forecasting - only show after user has visited step 7
  if (planState.goalAmbition) {
  var ambitionLabel = { conservative: 'Conservative (0.6x)', moderate: 'Moderate (1.0x)', aggressive: 'Aggressive (1.5x)' }[planState.goalAmbition] || 'Moderate (1.0x)';
  html += '<h4>Goal Forecasting</h4>';
  html += '<div style="font-size:0.82rem;color:#5E503F;margin-bottom:0.5rem"><strong>Ambition:</strong> ' + ambitionLabel + '</div>';

  var previewMetrics = [
    { field: 'graduationRate', label: 'Grad Rate', target: 95, direction: 'higher', rate: 1.5 },
    { field: 'chronicAbsenceRate', label: 'Chronic Abs', target: 10, direction: 'lower', rate: 2.0 },
    { field: 'readingProficiency', label: 'Reading', target: 75, direction: 'higher', rate: 2.5 },
    { field: 'mathProficiency', label: 'Math', target: 70, direction: 'higher', rate: 2.0 }
  ];
  var ambMult = { conservative: 0.6, moderate: 1.0, aggressive: 1.5 }[planState.goalAmbition] || 1.0;
  var hasForecasting = false;
  previewMetrics.forEach(function(pm) {
    var val = parseInt(planState[pm.field]);
    if (!isNaN(val)) {
      hasForecasting = true;
      var adjRate = pm.rate * ambMult;
      var yr3;
      if (pm.direction === 'higher') {
        yr3 = Math.min(val + (adjRate * 3), pm.target);
      } else {
        yr3 = Math.max(val - (adjRate * 3), pm.target);
      }
      yr3 = Math.round(yr3 * 10) / 10;
      var severity = getSeverity(pm.field, val);
      var sevColor = { strong: '#4caf50', monitor: '#ff9800', concern: '#f44336', critical: '#b71c1c' }[severity] || '#888';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:0.3rem 0.5rem;margin-bottom:0.25rem;background:#fafafa;border-radius:4px;font-size:0.8rem">';
      html += '<span style="color:#22333B"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:' + sevColor + ';margin-right:0.3rem"></span>' + pm.label + ': ' + val + '%</span>';
      html += '<span style="color:#888">3yr: <strong style="color:#22333B">' + yr3 + '%</strong></span>';
      html += '</div>';
    }
  });
  if (!hasForecasting) {
    html += '<p style="color:#999;font-size:0.82rem">Enter performance data in Step 1 to see projections</p>';
  }
  } // end goalAmbition gate

  // Central Office Alignment Summary
  if (planState.selectedDepartments && planState.selectedDepartments.length && planState.strategicDomains && planState.strategicDomains.length) {
    html += '<h4>Alignment Summary</h4>';
    planState.strategicDomains.forEach(function(domain, di) {
      var color = popColors[di % popColors.length];
      var mappedDepts = [];
      if (typeof DEPARTMENT_GOAL_MAPPING !== 'undefined' && DEPARTMENT_GOAL_MAPPING[domain]) {
        DEPARTMENT_GOAL_MAPPING[domain].forEach(function(dept) {
          if (planState.selectedDepartments.indexOf(dept) !== -1) {
            mappedDepts.push(dept.split('/')[0].split(' ').slice(0, 2).join(' '));
          }
        });
      }
      if (mappedDepts.length > 0) {
        html += '<div style="font-size:0.78rem;padding:0.3rem 0.5rem;border-left:2px solid ' + color + ';margin-bottom:0.3rem">';
        html += '<span style="color:#22333B;font-weight:600">' + domain.split(' ').slice(0, 2).join(' ') + ':</span> ';
        html += '<span style="color:#888">' + mappedDepts.join(', ') + '</span>';
        html += '</div>';
      }
    });
  }

  // Implementation Calendar - only show once user has visited step 10
  if (highestStepVisited >= 10 && planState.strategicDomains && planState.strategicDomains.length) {
    var calYear = document.getElementById('calendarYear');
    var yearLabel = calYear ? calYear.value : '2025-26';
    html += '<h4>Implementation Timeline</h4>';
    html += '<p style="font-size:0.78rem;color:#888;margin-bottom:0.5rem">School Year: ' + yearLabel + '</p>';

    var calPhases = [
      { label: 'Foundation & Planning', period: 'Q1 (Jul-Sep)', color: '#00B4CC', desc: 'Baseline data, team alignment, resource allocation' },
      { label: 'Early Implementation', period: 'Q2 (Oct-Dec)', color: '#D4A537', desc: 'Launch initiatives, first progress checks' },
      { label: 'Mid-Year Acceleration', period: 'Q3 (Jan-Mar)', color: '#E07A5F', desc: 'Adjust strategies, deepen implementation' },
      { label: 'Review & Sustain', period: 'Q4 (Apr-Jun)', color: '#6ECF6E', desc: 'Evaluate outcomes, plan for next year' }
    ];
    calPhases.forEach(function(p) {
      html += '<div style="padding:0.4rem 0.6rem;margin-bottom:0.4rem;border-left:3px solid ' + p.color + ';background:#fafafa;border-radius:0 4px 4px 0">';
      html += '<div style="font-size:0.8rem;font-weight:600;color:#22333B">' + p.label + ' <span style="font-weight:400;color:#888">' + p.period + '</span></div>';
      html += '<div style="font-size:0.75rem;color:#5E503F;margin-top:0.15rem">' + p.desc + '</div>';
      html += '</div>';
    });
  }

  // Plan completeness indicator
  var sections = 0;
  var total = 9;
  if (planState.districtName) sections++;
  if (planState.vision || planState.mission) sections++;
  if (planState.coreValues && planState.coreValues.length) sections++;
  if (planState.strategicDomains && planState.strategicDomains.length) sections++;
  if (planState.goals && planState.goals.length) sections++;
  if (planState.goalAmbition) sections++;
  if (planState.selectedDepartments && planState.selectedDepartments.length) sections++;
  if (planState.initiatives && planState.initiatives.length) sections++;
  if (planState.calendar && Object.keys(planState.calendar).length) sections++;
  var pct = Math.round((sections / total) * 100);
  html += '<div style="margin-top:1.5rem;padding:0.75rem;background:#f9f7f4;border-radius:6px;text-align:center">';
  html += '<div style="font-size:0.8rem;font-weight:600;color:#22333B;margin-bottom:0.4rem">Plan Completion: ' + pct + '%</div>';
  html += '<div style="height:6px;background:#e0e0e0;border-radius:3px;overflow:hidden"><div style="height:100%;width:' + pct + '%;background:linear-gradient(to right,#6ECF6E,#00B4CC);border-radius:3px;transition:width 0.3s"></div></div>';
  html += '</div>';

  previewContainer.innerHTML = html;

  // Auto-scroll preview to bottom so user sees latest content building
  var previewPanel = previewContainer.parentElement;
  if (previewPanel) {
    setTimeout(function() {
      previewPanel.scrollTop = previewPanel.scrollHeight;
    }, 50);
  }
}

function addCustomVision() {
  var customEl = document.getElementById('customVision');
  if (!customEl) return;
  var text = customEl.value.trim();
  if (!text) { alert('Please enter a custom vision concept first.'); return; }
  combineVisionStatements();
}

function addCustomMission() {
  var customEl = document.getElementById('customMission');
  if (!customEl) return;
  var text = customEl.value.trim();
  if (!text) { alert('Please enter a custom mission element first.'); return; }
  combineMissionStatements();
}

function addCustomDepartment() {
  var nameInput = document.getElementById('customDeptName');
  var descInput = document.getElementById('customDeptDesc');
  if (!nameInput) return;
  var name = nameInput.value.trim();
  var desc = descInput ? descInput.value.trim() : '';
  if (!name) { alert('Please enter a department name.'); return; }
  // Check if already exists
  var exists = DEFAULT_DEPARTMENTS.some(function(d) { return d.name === name; });
  if (!exists) {
    DEFAULT_DEPARTMENTS.push({ name: name, desc: desc || 'Custom department' });
  }
  // Auto-select the new department
  if (planState.selectedDepartments.indexOf(name) === -1) {
    planState.selectedDepartments.push(name);
  }
  nameInput.value = '';
  if (descInput) descInput.value = '';
  renderDepartmentAlignmentPage();
  renderAlignmentMatrix();
  renderDepartmentDetails();
  updatePreview();
}

function addCustomDomain() {
  var nameInput = document.getElementById('customDomainName');
  var descInput = document.getElementById('customDomainDesc');
  if (!nameInput) return;
  var name = nameInput.value.trim();
  var desc = descInput ? descInput.value.trim() : '';
  if (!name) { alert('Please enter a domain name.'); return; }
  var newId = CONTENT_DB.domains.length + 1;
  CONTENT_DB.domains.push({ id: newId, name: name, description: desc || 'Custom strategic domain' });
  if (!planState.strategicDomains) planState.strategicDomains = [];
  planState.strategicDomains.push(name);
  nameInput.value = '';
  if (descInput) descInput.value = '';
  renderDomains();
  updateDomainsCounter();
  updatePreview();
}

function addCustomCoreValue() {
  var input = document.getElementById('customCoreValue');
  if (!input) return;
  var value = input.value.trim();
  if (!value) { alert('Please enter a core value name.'); return; }
  if (CONTENT_DB.coreValues.indexOf(value) === -1) {
    CONTENT_DB.coreValues.push(value);
  }
  if (!planState.coreValues) planState.coreValues = [];
  if (planState.coreValues.indexOf(value) === -1) {
    planState.coreValues.push(value);
  }
  input.value = '';
  renderCoreValues();
  updateValuesCounter();
  updatePreview();
}

function addCustomCompetency() {
  var catInput = document.getElementById('customCompCategory');
  var skillInput = document.getElementById('customCompSkill');
  if (!catInput || !skillInput) return;
  var cat = catInput.value.trim();
  var skill = skillInput.value.trim();
  if (!cat || !skill) { alert('Please enter both a category name and a competency name.'); return; }
  if (!planState.competencies[cat]) planState.competencies[cat] = [];
  planState.competencies[cat].push(skill);
  catInput.value = '';
  skillInput.value = '';
  renderCompetencies();
  updatePreview();
}

function finishPlan() {
  saveFormState();
  saveState();
  alert('Your strategic plan has been saved! Use the export buttons to download your reports.');
}

// ============================================================================
// SAVE AND CONFIRM - Shows brief confirmation when saving
// ============================================================================

function saveAndConfirm(btn) {
  saveFormState();
  var origText = btn.textContent;
  btn.textContent = 'Saved!';
  btn.style.background = '#6ECF6E';
  btn.style.color = 'white';
  setTimeout(function() {
    btn.textContent = origText;
    btn.style.background = '';
    btn.style.color = '';
  }, 1500);
}

// ============================================================================
// PLAN NAME SUBMISSION
// ============================================================================

function submitPlanName() {
  var planNameTopEl = document.getElementById('planNameTop');
  if (planNameTopEl && planNameTopEl.value.trim()) {
    planState.planName = planNameTopEl.value.trim();
  }
  saveFormState();
  updatePreview();

  var feedback = document.getElementById('planNameFeedback');
  if (feedback) {
    feedback.textContent = 'Plan saved as "' + planState.planName + '"';
    feedback.style.color = '#6ECF6E';
    setTimeout(function() {
      feedback.textContent = '';
    }, 3000);
  }
}

function updatePlanNameDisplay() {
  updatePreview();
}

// ============================================================================
// FINALIZE PLAN - LOCKS PLAN AND ENABLES EXPORTS
// ============================================================================

function finalizePlan() {
  saveFormState();
  var nameInput = document.getElementById('planNameInput');
  var planName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : (planState.districtName ? planState.districtName + ' Strategic Plan' : 'Untitled Plan');
  planState.planName = planName;
  planState.finalized = true;
  planState.finalizedDate = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(planState));
  saveFinalizedPlan();

  var exportSection = document.getElementById('exportSection');
  var finalizeSection = document.getElementById('finalizeSection');
  if (exportSection) exportSection.style.display = 'block';
  if (finalizeSection) finalizeSection.style.display = 'none';

  updatePreview();
}

// ============================================================================
// UPDATE COMPLETION CHECKLIST FOR STEP 11
// ============================================================================

function updateCompletionChecklist() {
  var checklistItems = document.querySelectorAll('.checklist-item');
  if (!checklistItems) return;
  
  checklistItems.forEach(function(item) {
    var stepNum = parseInt(item.getAttribute('data-step'));
    var hasData = isStepComplete(stepNum);
    var icon = item.querySelector('.check-icon');
    
    if (icon) {
      if (hasData) {
        icon.textContent = '✓';
        icon.style.color = '#6ECF6E';
        icon.style.fontWeight = 'bold';
      } else {
        icon.textContent = '✕';
        icon.style.color = '#e74c3c';
        icon.style.fontWeight = 'bold';
      }
    }
  });
}

function isStepComplete(stepNum) {
  switch(stepNum) {
    case 1: return planState.districtName && Object.keys(planState).filter(function(k) { return k.startsWith('student') || k.startsWith('teacher') || k.startsWith('graduation'); }).length > 0;
    case 2: return planState.budgetSetup && planState.budgetSetup.totalBudget > 0;
    case 3: return planState.stakeholderConveningPlan && Object.keys(planState.stakeholderConveningPlan).length > 0;
    case 4: return planState.vision || planState.mission;
    case 5: return planState.coreValues && planState.coreValues.length > 0;
    case 6: return planState.competencies && Object.keys(planState.competencies).some(function(k) { return planState.competencies[k] && planState.competencies[k].length > 0; });
    case 7: return planState.strategicDomains && planState.strategicDomains.length > 0;
    case 8: return planState.goals && planState.goals.length > 0;
    case 9: return planState.forecastedGoals && Object.keys(planState.forecastedGoals).length > 0;
    case 10: return planState.selectedDepartments && planState.selectedDepartments.length > 0;
    case 11: return planState.initiatives && planState.initiatives.length > 0;
    case 12: return planState.postPlanAnalysis && Object.keys(planState.postPlanAnalysis).length > 0;
    case 13: return planState.calendar && Object.keys(planState.calendar).length > 0;
    case 14: return planState.finalized === true;
    default: return false;
  }
}

function saveFinalizedPlan() {
  var saved = localStorage.getItem('strategicPlans_saved');
  var plans = [];
  if (saved) {
    try { plans = JSON.parse(saved); } catch(e) { plans = []; }
  }
  // Update or add
  var found = false;
  for (var i = 0; i < plans.length; i++) {
    if (plans[i].planName === planState.planName) {
      plans[i] = JSON.parse(JSON.stringify(planState));
      found = true;
      break;
    }
  }
  if (!found) {
    plans.push(JSON.parse(JSON.stringify(planState)));
  }
  localStorage.setItem('strategicPlans_saved', JSON.stringify(plans));
}

function loadSavedPlan() {
  var select = document.getElementById('savedPlanSelect');
  if (!select || !select.value) return;
  var saved = localStorage.getItem('strategicPlans_saved');
  if (!saved) return;
  try {
    var plans = JSON.parse(saved);
    var idx = parseInt(select.value);
    if (plans[idx]) {
      Object.assign(planState, plans[idx]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(planState));
      renderCoreValues();
      renderCompetencies();
      renderDomains();
      applyStateToUI();
      updateValuesCounter();
      updateVisionCounter();
      updateMissionCounter();
      updatePreview();
    }
  } catch(e) { /* ignore */ }
}

// ============================================================================
// GOAL AMBITION LEVEL
// ============================================================================

function setGoalAmbition(level) {
  planState.goalAmbition = level;
  saveFormState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(planState));
  renderDataProfile();
  updatePreview();
}

function setMetricAmbition(field, level) {
  if (!planState.metricAmbitions) planState.metricAmbitions = {};
  planState.metricAmbitions[field] = level;
  saveFormState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(planState));
  renderDataProfile();
  updatePreview();
}

// ============================================================================
// IMPLEMENTATION CALENDAR
// ============================================================================

function renderImplementationCalendar() {
  var container = document.getElementById('implementationCalendarContainer');
  if (!container) return;

  saveFormState();

  var domains = planState.strategicDomains || [];
  var goals = planState.goals || [];
  var initiatives = planState.initiatives || [];
  var departments = planState.selectedDepartments || [];
  var year = new Date().getFullYear();

  if (domains.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:3rem;color:#999;font-style:italic">Complete earlier steps first. Your implementation calendar will be generated from your domains, goals, and initiatives.</div>';
    return;
  }

  var popColors = ['#6ECF6E', '#00B4CC', '#D4A537', '#E07A5F', '#6B4C9A'];
  var quarters = [
    { label: 'Q1 (Jul-Sep)', months: ['July', 'August', 'September'], focus: 'Launch & Foundation' },
    { label: 'Q2 (Oct-Dec)', months: ['October', 'November', 'December'], focus: 'Implementation & Early Monitoring' },
    { label: 'Q3 (Jan-Mar)', months: ['January', 'February', 'March'], focus: 'Mid-Year Review & Adjustment' },
    { label: 'Q4 (Apr-Jun)', months: ['April', 'May', 'June'], focus: 'Assessment & Year-End Review' }
  ];

  var html = '';

  // Calendar view toggle
  html += '<div style="display:flex;gap:0.75rem;margin-bottom:1.5rem">';
  html += '<button onclick="toggleCalendarView(\'timeline\')" id="calViewTimeline" style="padding:0.5rem 1.25rem;border-radius:6px;font-size:0.85rem;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:#22333B;color:white">Timeline View</button>';
  html += '<button onclick="toggleCalendarView(\'quarterly\')" id="calViewQuarterly" style="padding:0.5rem 1.25rem;border-radius:6px;font-size:0.85rem;font-weight:600;cursor:pointer;border:1px solid #e0e0e0;background:white;color:#22333B">Quarterly View</button>';
  html += '</div>';

  // Timeline View
  html += '<div id="calendarTimeline">';
  domains.forEach(function(domain, di) {
    var color = popColors[di % popColors.length];
    var domainGoals = goals.filter(function(g) { return g.domain === domain; });
    var domainInitiatives = initiatives.filter(function(init) { return init.domain === domain; });

    html += '<div style="margin-bottom:2rem;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">';
    html += '<div style="background:' + color + ';color:white;padding:1rem 1.25rem;font-family:Source Serif Pro,serif;font-size:1.1rem;font-weight:600">' + domain + '</div>';
    html += '<div style="padding:1.25rem">';

    // Quarter-by-quarter milestones
    quarters.forEach(function(q, qi) {
      html += '<div style="margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid #f0f0f0">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem">';
      html += '<div style="font-weight:700;color:#22333B;font-size:0.95rem">' + q.label + ' (' + (year + Math.floor(qi / 4)) + ')</div>';
      html += '<div style="font-size:0.75rem;background:' + color + '15;color:' + color + ';padding:0.25rem 0.75rem;border-radius:12px;font-weight:600">' + q.focus + '</div>';
      html += '</div>';

      // Auto-generate milestones based on goals and initiatives
      html += '<div style="padding-left:1rem;border-left:3px solid ' + color + '40">';
      if (qi === 0) {
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Kick-off strategic plan communication to all stakeholders</div>';
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Establish baseline metrics and data collection protocols</div>';
        if (domainGoals.length > 0) {
          html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Set Year 1 targets for ' + domainGoals.length + ' goal(s) in this domain</div>';
        }
      } else if (qi === 1) {
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; First progress monitoring checkpoint</div>';
        domainInitiatives.slice(0, 2).forEach(function(init) {
          html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Initiative progress review: ' + (init.text || init.name || 'Unnamed') + '</div>';
        });
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Board update presentation on early implementation</div>';
      } else if (qi === 2) {
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Mid-year data review and strategy adjustment</div>';
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Department accountability workshops</div>';
        if (domainGoals.length > 0) {
          html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Compare progress to Year 1 targets (' + domainGoals.length + ' goals)</div>';
        }
      } else {
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; End-of-year assessment and outcome review</div>';
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Celebrate wins and document lessons learned</div>';
        html += '<div style="font-size:0.85rem;color:#5E503F;margin-bottom:0.4rem">&#x2022; Plan Year 2 adjustments based on data</div>';
      }
      html += '</div></div>';
    });

    html += '</div></div>';
  });
  html += '</div>';

  // Quarterly View (hidden by default)
  html += '<div id="calendarQuarterly" style="display:none">';
  quarters.forEach(function(q, qi) {
    html += '<div style="margin-bottom:2rem;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden">';
    html += '<div style="background:linear-gradient(135deg,#22333B,#14213D);color:white;padding:1rem 1.25rem">';
    html += '<div style="font-family:Source Serif Pro,serif;font-size:1.1rem;font-weight:600">' + q.label + ' (' + year + ')</div>';
    html += '<div style="font-size:0.8rem;opacity:0.8;margin-top:0.25rem">' + q.focus + '</div>';
    html += '</div>';
    html += '<div style="padding:1.25rem">';

    domains.forEach(function(domain, di) {
      var color = popColors[di % popColors.length];
      html += '<div style="margin-bottom:1rem;padding:0.75rem;background:' + color + '08;border-left:4px solid ' + color + ';border-radius:0 6px 6px 0">';
      html += '<div style="font-weight:600;color:#22333B;font-size:0.9rem;margin-bottom:0.25rem">' + domain + '</div>';

      var domainGoals = goals.filter(function(g) { return g.domain === domain; });
      if (qi === 0) {
        html += '<div style="font-size:0.82rem;color:#5E503F">Launch initiatives, establish baselines' + (domainGoals.length > 0 ? ', set targets for ' + domainGoals.length + ' goals' : '') + '</div>';
      } else if (qi === 1) {
        html += '<div style="font-size:0.82rem;color:#5E503F">Monitor progress, first data checkpoint, board update</div>';
      } else if (qi === 2) {
        html += '<div style="font-size:0.82rem;color:#5E503F">Mid-year review, adjust strategies, department workshops</div>';
      } else {
        html += '<div style="font-size:0.82rem;color:#5E503F">Year-end assessment, celebrate wins, plan Year 2</div>';
      }
      html += '</div>';
    });

    html += '</div></div>';
  });
  html += '</div>';

  // Accountability & Governance section
  html += '<div style="margin-top:2.5rem">';
  html += '<h2 style="font-family:Source Serif Pro,serif;font-size:1.5rem;color:#22333B;margin:0 0 0.25rem 0">Accountability &amp; Governance</h2>';
  html += '<div style="width:40px;height:3px;background:#D4A537;margin-bottom:1rem"></div>';
  html += '<p style="font-size:0.9rem;color:#5E503F;margin:0 0 1.5rem 0;line-height:1.5">Clear roles, responsibilities, and accountability structures ensure transparent implementation and shared ownership at all levels.</p>';

  html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1.25rem">';

  var accountabilityRoles = [
    {
      title: 'SUPERINTENDENT',
      color: '#D4A537',
      items: ['Plan implementation leadership', 'Quarterly progress monitoring', 'Annual community presentations', 'Budget and resource alignment', 'Cabinet accountability']
    },
    {
      title: 'CABINET & DIRECTORS',
      color: '#00B4CC',
      items: ['Department goal achievement', 'Cross-departmental coordination', 'Monthly progress reviews', 'Resource management', 'Initiative oversight']
    },
    {
      title: 'SCHOOL PRINCIPALS',
      color: '#D4A537',
      items: ['School-level goal cascading', 'Teacher evaluation and support', 'Student achievement accountability', 'Family engagement leadership', 'Continuous improvement cycles']
    },
    {
      title: 'TEACHERS & STAFF',
      color: '#E07A5F',
      items: ['Classroom instruction quality', 'Student learning outcomes', 'Data-informed practices', 'Professional learning engagement', 'Collaborative improvement']
    },
    {
      title: 'SCHOOL BOARD',
      color: '#6ECF6E',
      items: ['Policy adoption and approval', 'Budget allocation oversight', 'Semi-annual progress review', 'Community accountability', 'Strategic governance']
    },
    {
      title: 'FAMILIES & COMMUNITY',
      color: '#6B4C9A',
      items: ['Co-implementation partnership', 'Student support at home', 'Feedback and input', 'Advocacy and celebration', 'Community voice']
    }
  ];

  accountabilityRoles.forEach(function(role) {
    html += '<div style="padding:1.25rem;background:white;border-radius:8px;border-left:4px solid ' + role.color + ';border:1px solid #e0e0e0;border-left:4px solid ' + role.color + '">';
    html += '<div style="font-weight:700;font-size:0.85rem;color:#22333B;margin-bottom:0.75rem;letter-spacing:0.5px">' + role.title + '</div>';
    html += '<ul style="margin:0;padding:0 0 0 1.1rem;list-style:disc">';
    role.items.forEach(function(item) {
      html += '<li style="font-size:0.82rem;color:#5E503F;line-height:1.8">' + item + '</li>';
    });
    html += '</ul></div>';
  });

  html += '</div></div>';

  container.innerHTML = html;

  // Auto-populate planState.calendar so completeness check passes
  // The calendar is auto-generated from domains/goals/initiatives, not user-editable
  if (domains.length > 0) {
    planState.calendar = {};
    quarters.forEach(function(q, qi) {
      planState.calendar['Q' + (qi + 1)] = {
        focus: q.focus,
        activities: domains.map(function(domain) { return domain + ' - ' + q.focus; })
      };
    });
    savePlanState();
  }
}

function toggleCalendarView(view) {
  var timeline = document.getElementById('calendarTimeline');
  var quarterly = document.getElementById('calendarQuarterly');
  var btnTimeline = document.getElementById('calViewTimeline');
  var btnQuarterly = document.getElementById('calViewQuarterly');

  if (view === 'timeline') {
    if (timeline) timeline.style.display = 'block';
    if (quarterly) quarterly.style.display = 'none';
    if (btnTimeline) { btnTimeline.style.background = '#22333B'; btnTimeline.style.color = 'white'; }
    if (btnQuarterly) { btnQuarterly.style.background = 'white'; btnQuarterly.style.color = '#22333B'; }
  } else {
    if (timeline) timeline.style.display = 'none';
    if (quarterly) quarterly.style.display = 'block';
    if (btnTimeline) { btnTimeline.style.background = 'white'; btnTimeline.style.color = '#22333B'; }
    if (btnQuarterly) { btnQuarterly.style.background = '#22333B'; btnQuarterly.style.color = 'white'; }
  }
}

function togglePreviewPanel() {
  var panel = document.querySelector('.preview-panel');
  if (panel) {
    panel.classList.toggle('collapsed');
  }
}


// ============================================================================
// EXPORT FUNCTIONS - NEW VERSION
// ============================================================================

function exportDashboardHTML() {
  saveFormState();
  var w = window.open('', '_blank');
  if (!w) { alert('Please allow pop-ups to export your dashboard.'); return; }

  var dn = planState.districtName || 'Strategic District';
  var year = new Date().getFullYear();
  var endYear = year + 3;

  var c = {
    navy: '#22333B', darkBlue: '#14213D', teal: '#00B4CC', gold: '#D4A537',
    cream: '#EAE0D5', green: '#6ECF6E', coral: '#E07A5F', purple: '#6B4C9A',
    brown: '#5E503F', tan: '#C6AC8F'
  };

  var gradientBar = 'background:linear-gradient(to right,#6ECF6E,#00B4CC,#D4A537,#E07A5F,#6B4C9A);height:6px;';

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>' + dn + ' Strategic Plan Dashboard</title>';
  html += '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';
  html += '<style>';
  html += 'body { font-family: "Inter", sans-serif; margin: 0; padding: 0; color: #333; background: #f5f5f5; }';
  html += 'h1, h2, h3, h4 { font-family: "Source Serif Pro", serif; font-weight: 600; }';
  html += '.gradient-bar { ' + gradientBar + ' }';
  html += '.header { padding: 2rem; background: linear-gradient(135deg, ' + c.navy + ' 0%, ' + c.darkBlue + ' 100%); color: white; }';
  html += '.header h1 { margin: 0; font-size: 2.5rem; }';
  html += '.header p { margin: 0.5rem 0 0 0; font-size: 1.1rem; opacity: 0.9; }';
  html += '.sidebar { position: fixed; left: 0; top: 0; width: 240px; height: 100vh; background: ' + c.navy + '; color: white; overflow-y: auto; padding-top: 0; }';
  html += '.sidebar h3 { color: ' + c.gold + '; padding: 1rem; margin: 0; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }';
  html += '.sidebar a { display: block; padding: 0.75rem 1rem; color: white; text-decoration: none; border-left: 3px solid transparent; }';
  html += '.sidebar a:hover { background: rgba(255,255,255,0.1); }';
  html += '.sidebar a.active { background: rgba(255,255,255,0.15); border-left-color: ' + c.gold + '; }';
  html += '.content { margin-left: 240px; padding: 2rem; }';
  html += '.section { background: white; margin-bottom: 2rem; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }';
  html += '.section h2 { margin-top: 0; padding-bottom: 1rem; border-bottom: 2px solid ' + c.gold + '; }';
  html += '.stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin: 1rem 0; }';
  html += '.stat-card { background: ' + c.cream + '; padding: 1rem; border-radius: 6px; text-align: center; }';
  html += '.stat-value { font-size: 1.8rem; font-weight: bold; color: ' + c.navy + '; }';
  html += '.stat-label { font-size: 0.85rem; color: ' + c.brown + '; margin-top: 0.5rem; }';
  html += '.card { background: ' + c.cream + '; padding: 1.5rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid ' + c.gold + '; }';
  html += '.card h3 { margin-top: 0; color: ' + c.navy + '; }';
  html += '.severity { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }';
  html += '.severity.strong { background: #4caf50; color: white; }';
  html += '.severity.monitor { background: #ff9800; color: white; }';
  html += '.severity.concern { background: #f44336; color: white; }';
  html += '.severity.critical { background: #b71c1c; color: white; }';
  html += '.goal-card { background: white; border: 1px solid #ddd; padding: 1.5rem; margin-bottom: 1rem; border-radius: 6px; }';
  html += '.goal-title { font-size: 1.1rem; font-weight: 600; color: ' + c.navy + '; margin: 0; }';
  html += '.progress-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 4px; margin: 0.5rem 0; overflow: hidden; }';
  html += '.progress-fill { height: 100%; background: ' + c.gold + '; transition: width 0.3s; }';
  html += '.table { width: 100%; border-collapse: collapse; margin: 1rem 0; }';
  html += '.table th { background: ' + c.navy + '; color: white; padding: 0.75rem; text-align: left; }';
  html += '.table td { padding: 0.75rem; border-bottom: 1px solid #ddd; }';
  html += '.table tr:nth-child(even) { background: #f9f9f9; }';
  html += '.print-bar { position: fixed; top: 0; right: 0; left: 240px; background: ' + c.navy + '; color: white; padding: 0.75rem 2rem; display: flex; justify-content: space-between; align-items: center; z-index: 1000; }';
  html += '.print-bar button { background: ' + c.gold + '; color: ' + c.navy + '; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600; margin-left: 1rem; }';
  html += '.content { margin-top: 60px; }';
  html += '@media print { .print-bar { display: none; } .sidebar { display: none; } .content { margin-left: 0; } }';
  html += '@media (max-width: 768px) { .sidebar { width: 100%; height: auto; position: relative; } .print-bar { left: 0; } .content { margin-left: 0; margin-top: 0; } }';
  html += '</style></head><body>';

  // Gradient bar
  html += '<div class="gradient-bar"></div>';

  // Print bar
  html += '<div class="print-bar">';
  html += '<span>Strategic District Plan</span>';
  html += '<div><button onclick="window.print()">Print / Save PDF</button><button onclick="window.close()">Close</button></div>';
  html += '</div>';

  // Sidebar navigation
  html += '<div class="sidebar">';
  html += '<h3>Navigation</h3>';
  html += '<a href="#hero" class="nav-link active">Dashboard</a>';
  html += '<a href="#executive" class="nav-link">Executive Summary</a>';
  html += '<a href="#vision" class="nav-link">Vision & Mission</a>';
  html += '<a href="#competencies" class="nav-link">Competencies</a>';
  html += '<a href="#domains" class="nav-link">Strategic Domains</a>';
  html += '<a href="#goals" class="nav-link">Goals</a>';
  html += '<a href="#forecasting" class="nav-link">Forecasting</a>';
  html += '<a href="#alignment" class="nav-link">Alignment</a>';
  html += '<a href="#initiatives" class="nav-link">Initiatives</a>';
  html += '<a href="#timeline" class="nav-link">Timeline</a>';
  html += '<a href="#accountability" class="nav-link">Accountability</a>';
  html += '</div>';

  html += '<div class="content">';

  // Hero Section
  html += '<div id="hero" class="section">';
  html += '<div class="header">';
  html += '<h1>' + dn + '</h1>';
  html += '<p>Strategic Plan ' + year + ' - ' + endYear + '</p>';
  html += '<p style="font-size: 0.9rem; opacity: 0.8;">Strategic District Planning Dashboard</p>';
  html += '</div>';
  html += '</div>';

  // Executive Summary
  html += '<div id="executive" class="section">';
  html += '<h2>Executive Summary</h2>';
  html += '<div class="stat-grid">';
  
  if (planState.studentEnrollment) html += '<div class="stat-card"><div class="stat-value">' + Number(planState.studentEnrollment).toLocaleString() + '</div><div class="stat-label">Student Enrollment</div></div>';
  if (planState.numberOfSchools) html += '<div class="stat-card"><div class="stat-value">' + planState.numberOfSchools + '</div><div class="stat-label">Schools</div></div>';
  if (planState.teacherCount) html += '<div class="stat-card"><div class="stat-value">' + planState.teacherCount + '</div><div class="stat-label">Teachers</div></div>';
  if (planState.graduationRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.graduationRate || 0).toFixed(1) + '%</div><div class="stat-label">Graduation Rate</div></div>';
  if (planState.readingProficiency) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.readingProficiency || 0).toFixed(1) + '%</div><div class="stat-label">Reading Proficiency</div></div>';
  if (planState.mathProficiency) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.mathProficiency || 0).toFixed(1) + '%</div><div class="stat-label">Math Proficiency</div></div>';

  html += '</div>';
  html += '<p><strong>Strategic Focus:</strong> ' + (planState.keyChallenge || 'Improving student outcomes through data-driven decision making.') + '</p>';
  html += '</div>';

  // Vision, Mission & Values
  html += '<div id="vision" class="section">';
  html += '<h2>Vision, Mission & Values</h2>';
  
  html += '<div class="card">';
  html += '<h3>Vision</h3>';
  html += '<p>' + (planState.customVision || planState.vision || 'To provide every student with an equitable, world-class education.') + '</p>';
  html += '</div>';

  html += '<div class="card">';
  html += '<h3>Mission</h3>';
  html += '<p>' + (planState.customMission || planState.mission || 'We are committed to fostering a culture of continuous improvement and student success.') + '</p>';
  html += '</div>';

  if (planState.coreValues && planState.coreValues.length > 0) {
    html += '<div class="card">';
    html += '<h3>Core Values</h3>';
    html += '<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">';
    for (var i = 0; i < planState.coreValues.length; i++) {
      html += '<span class="severity strong" style="background: ' + c.purple + ';">' + planState.coreValues[i] + '</span>';
    }
    html += '</div>';
    html += '</div>';
  }

  html += '</div>';

  // Competencies
  if (planState.competencies && Object.keys(planState.competencies).length > 0) {
    html += '<div id="competencies" class="section">';
    html += '<h2>Competencies</h2>';
    for (var cat in planState.competencies) {
      html += '<div class="card">';
      html += '<h3>' + cat + '</h3>';
      html += '<ul>';
      for (var j = 0; j < planState.competencies[cat].length; j++) {
        html += '<li>' + planState.competencies[cat][j] + '</li>';
      }
      html += '</ul>';
      html += '</div>';
    }
    html += '</div>';
  }

  // Strategic Domains
  if (planState.strategicDomains && planState.strategicDomains.length > 0) {
    html += '<div id="domains" class="section">';
    html += '<h2>Strategic Domains</h2>';
    var domainColors = [c.green, c.teal, c.gold, c.coral, c.purple];
    for (var d = 0; d < planState.strategicDomains.length; d++) {
      var dname = planState.strategicDomains[d];
      var domainDesc = '';
      for (var dd = 0; dd < CONTENT_DB.domains.length; dd++) {
        if (CONTENT_DB.domains[dd].name === dname) {
          domainDesc = CONTENT_DB.domains[dd].description;
          break;
        }
      }
      html += '<div class="card" style="border-left-color: ' + domainColors[d % domainColors.length] + ';">';
      html += '<h3>' + dname + '</h3>';
      html += '<p>' + domainDesc + '</p>';
      html += '</div>';
    }
    html += '</div>';
  }

  // Strategic Goals
  if (planState.goals && planState.goals.length > 0) {
    html += '<div id="goals" class="section">';
    html += '<h2>Strategic Goals</h2>';
    for (var g = 0; g < planState.goals.length; g++) {
      var goal = planState.goals[g];
      var severity = getSeverity(goal.measure, parseInt(goal.target) || 0);
      var sevLabel = severity.charAt(0).toUpperCase() + severity.slice(1);
      html += '<div class="goal-card">';
      html += '<p class="goal-title">' + (goal.title || 'Untitled Goal') + '</p>';
      if (goal.measure) html += '<p><strong>Measure:</strong> ' + goal.measure + '</p>';
      if (goal.target) html += '<p><strong>Target:</strong> ' + goal.target + '</p>';
      html += '<span class="severity ' + severity + '">' + sevLabel + '</span>';
      html += '</div>';
    }
    html += '</div>';
  }

  // Goal Forecasting
  if (planState.goals && planState.goals.length > 0) {
    html += '<div id="forecasting" class="section">';
    html += '<h2>Goal Forecasting & Projections</h2>';
    html += '<p><strong>Ambition Level:</strong> ' + (planState.goalAmbition || 'Not Selected').charAt(0).toUpperCase() + (planState.goalAmbition || 'Not Selected').slice(1) + '</p>';

    var ambitionMultipliers = { conservative: 0.6, moderate: 1.0, aggressive: 1.5 };
    var multiplier = ambitionMultipliers[planState.goalAmbition] || 1.0;

    html += '<table class="table">';
    html += '<thead><tr><th>Goal</th><th>Current</th><th>Year 1</th><th>Year 3</th><th>Year 5</th></tr></thead>';
    html += '<tbody>';
    for (var gf = 0; gf < planState.goals.length; gf++) {
      var gf_goal = planState.goals[gf];
      var targetVal = parseFloat(gf_goal.target) || 0;
      html += '<tr>';
      html += '<td>' + (gf_goal.title || 'Untitled') + '</td>';
      html += '<td>' + (gf_goal.target || 'N/A') + '</td>';
      html += '<td>' + (targetVal > 0 ? (targetVal * (1 + 0.05 * multiplier)).toFixed(1) : 'N/A') + '</td>';
      html += '<td>' + (targetVal > 0 ? (targetVal * (1 + 0.15 * multiplier)).toFixed(1) : 'N/A') + '</td>';
      html += '<td>' + (targetVal > 0 ? (targetVal * (1 + 0.25 * multiplier)).toFixed(1) : 'N/A') + '</td>';
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div>';
  }

  // Central Office Alignment
  if (planState.selectedDepartments && planState.selectedDepartments.length > 0) {
    html += '<div id="alignment" class="section">';
    html += '<h2>Department & Domain Alignment</h2>';
    html += '<table class="table">';
    html += '<thead><tr><th>Department</th><th>Supporting Domains</th></tr></thead>';
    html += '<tbody>';
    for (var sd = 0; sd < planState.selectedDepartments.length; sd++) {
      var dept = planState.selectedDepartments[sd];
      var alignedDomains = planState.departmentAlignment ? planState.departmentAlignment[dept] : [];
      html += '<tr>';
      html += '<td>' + dept + '</td>';
      html += '<td>' + (alignedDomains ? alignedDomains.join(', ') : 'All domains') + '</td>';
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';
    html += '</div>';
  }

  // Action Initiatives
  if (planState.initiatives && planState.initiatives.length > 0) {
    html += '<div id="initiatives" class="section">';
    html += '<h2>Action Initiatives</h2>';
    for (var init = 0; init < planState.initiatives.length; init++) {
      var initiative = planState.initiatives[init];
      html += '<div class="card">';
      html += '<h3>' + initiative.title + '</h3>';
      html += '<p>' + initiative.description + '</p>';
      html += '<p><strong>Lead:</strong> ' + initiative.lead + '</p>';
      html += '</div>';
    }
    html += '</div>';
  }

  // Implementation Timeline
  html += '<div id="timeline" class="section">';
  html += '<h2>Implementation Timeline</h2>';
  html += '<div class="card"><h3>Foundation Year (' + year + ')</h3><p>Establish governance, finalize plans, secure resources, and begin stakeholder engagement.</p></div>';
  html += '<div class="card"><h3>Implementation Years (' + (year + 1) + ' - ' + (year + 2) + ')</h3><p>Execute initiatives, monitor progress, and adjust as needed based on quarterly reviews.</p></div>';
  html += '<div class="card"><h3>Acceleration Year (' + (year + 3) + ')</h3><p>Scale successful initiatives, celebrate progress, and plan for next cycle.</p></div>';
  html += '</div>';

  // Monitoring & Accountability
  html += '<div id="accountability" class="section">';
  html += '<h2>Monitoring & Accountability</h2>';
  html += '<div class="card">';
  html += '<h3>Review Cadence</h3>';
  html += '<ul>';
  html += '<li><strong>Monthly:</strong> Department leadership reviews progress on assigned initiatives</li>';
  html += '<li><strong>Quarterly:</strong> District leadership reviews overall progress, adjusts tactics</li>';
  html += '<li><strong>Annually:</strong> Full plan review, assess goal progress, celebrate wins</li>';
  html += '</ul>';
  html += '</div>';
  html += '</div>';

  html += '</div>';
  html += '</body></html>';

  w.document.write(html);
  w.document.close();
}

function exportQuickSummary() {
  saveFormState();
  var w = window.open('', '_blank');
  if (!w) { alert('Please allow pop-ups to export your summary.'); return; }

  var dn = planState.districtName || 'Strategic District';
  var dl = planState.districtLocation || '';
  var year = new Date().getFullYear();
  var endYear = year + 3;

  var colors = {
    navy: '#22333B',
    darkBlue: '#14213D',
    cream: '#EAE0D5',
    tan: '#C6AC8F',
    brown: '#5E503F',
    green: '#6ECF6E',
    teal: '#00B4CC',
    gold: '#D4A537',
    coral: '#E07A5F',
    purple: '#6B4C9A',
    strong: '#4caf50',
    monitor: '#ff9800',
    concern: '#f44336',
    critical: '#b71c1c'
  };

  var gradBar = 'linear-gradient(to right,#6ECF6E,#00B4CC,#D4A537,#E07A5F,#6B4C9A)';

  var html = '<!DOCTYPE html>' + '\n';
  html += '<html>' + '\n';
  html += '<head>' + '\n';
  html += '<meta charset="UTF-8">' + '\n';
  html += '<meta name="viewport" content="width=device-width, initial-scale=1">' + '\n';
  html += '<title>' + dn + ' Strategic Plan Summary - ' + year + '</title>' + '\n';
  html += '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">' + '\n';
  html += '<style>' + '\n';

  // Base styles
  html += '*{box-sizing:border-box}' + '\n';
  html += 'body{margin:0;padding:0;background:#fff;color:#333;font-family:"Inter",sans-serif;line-height:1.6;font-size:11pt}' + '\n';
  html += 'h1,h2,h3,h4{font-family:"Source Serif Pro",serif;font-weight:600}' + '\n';
  html += 'h1{font-size:2.4rem;margin:0 0 0.5rem 0;color:' + colors.navy + '}' + '\n';
  html += 'h2{font-size:1.5rem;margin:1.5rem 0 0.75rem 0;color:' + colors.navy + ';border-bottom:3px solid ' + colors.gold + ';padding-bottom:0.5rem}' + '\n';
  html += 'h3{font-size:1.1rem;margin:1rem 0 0.5rem 0;color:' + colors.navy + ';font-weight:600}' + '\n';
  html += 'p{margin:0.5rem 0;font-size:11pt}' + '\n';

  // Print bar
  html += '.print-bar{background:' + colors.navy + ';color:#fff;padding:0.8rem 1rem;text-align:right;position:sticky;top:0;z-index:1000;box-shadow:0 2px 4px rgba(0,0,0,0.1)}' + '\n';
  html += '.print-bar button{background:' + colors.gold + ';color:' + colors.navy + ';border:none;padding:0.5rem 1rem;border-radius:3px;cursor:pointer;font-weight:600;margin-left:0.8rem;font-size:10pt;transition:all 0.2s}' + '\n';
  html += '.print-bar button:hover{opacity:0.9;transform:translateY(-1px)}' + '\n';

  // Gradient bar
  html += '.gradient-bar{height:6px;background:' + gradBar + ';width:100%}' + '\n';

  // Container & layout
  html += '.document{max-width:8.5in;margin:0 auto;padding:0.5in;background:#fff;line-height:1.5}' + '\n';
  html += '.page{page-break-after:always;margin-bottom:0.5in}' + '\n';

  // Hero/Header
  html += '.hero{background:linear-gradient(135deg,' + colors.navy + ' 0%,' + colors.darkBlue + ' 100%);color:#fff;padding:1.2in 0.5in;margin-bottom:0.4in;border-radius:4px}' + '\n';
  html += '.hero h1{color:#fff;margin:0 0 0.3rem 0;font-size:2rem}' + '\n';
  html += '.hero .subheader{font-size:12pt;opacity:0.95;margin:0.2rem 0}' + '\n';

  // Stat grid
  html += '.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(1.8in,1fr));gap:0.3in;margin:0.5in 0}' + '\n';
  html += '.stat-card{background:' + colors.cream + ';padding:0.4in;border-radius:4px;border-left:4px solid ' + colors.gold + ';text-align:center}' + '\n';
  html += '.stat-card.severity-strong{border-left-color:' + colors.strong + '}' + '\n';
  html += '.stat-card.severity-monitor{border-left-color:' + colors.monitor + '}' + '\n';
  html += '.stat-card.severity-concern{border-left-color:' + colors.concern + '}' + '\n';
  html += '.stat-card.severity-critical{border-left-color:' + colors.critical + '}' + '\n';
  html += '.stat-value{font-size:1.6rem;font-weight:700;color:' + colors.navy + ';margin:0.2rem 0}' + '\n';
  html += '.stat-label{font-size:9pt;color:' + colors.brown + ';margin-top:0.2rem;font-weight:500}' + '\n';

  // Card styles
  html += '.card{background:#f9f9f9;padding:0.35in;margin:0.4in 0;border-left:4px solid ' + colors.gold + ';border-radius:3px}' + '\n';
  html += '.card h3{margin:0 0 0.3rem 0;color:' + colors.navy + '}' + '\n';
  html += '.card p{margin:0.3rem 0;font-size:10.5pt}' + '\n';

  // Values pills
  html += '.values{display:flex;flex-wrap:wrap;gap:0.3rem;margin:0.4rem 0}' + '\n';
  html += '.value-pill{display:inline-block;background:' + colors.purple + ';color:#fff;padding:0.25rem 0.7rem;border-radius:20px;font-size:9pt;font-weight:600}' + '\n';

  // Domain grid
  html += '.domain-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:0.4in;margin:0.5in 0}' + '\n';
  html += '.domain-card{background:' + colors.cream + ';padding:0.35in;border-radius:4px;border-left:3px solid ' + colors.teal + '}' + '\n';
  html += '.domain-card h3{margin:0 0 0.2rem 0;color:' + colors.navy + ';font-size:1rem}' + '\n';
  html += '.domain-card p{margin:0;font-size:9.5pt;color:' + colors.brown + '}' + '\n';

  // Table styles
  html += '.table{width:100%;border-collapse:collapse;margin:0.4in 0;font-size:9.5pt}' + '\n';
  html += '.table th{background:' + colors.navy + ';color:#fff;padding:0.3rem;text-align:left;font-weight:600;border:1px solid ' + colors.navy + '}' + '\n';
  html += '.table td{padding:0.25rem 0.3rem;border:1px solid #ddd;vertical-align:top}' + '\n';
  html += '.table tr:nth-child(even){background:#fafafa}' + '\n';
  html += '.table .num-col{text-align:center;font-weight:600}' + '\n';

  // Goal cards with severity
  html += '.goal-card{background:#fff;border:1px solid #ddd;padding:0.3in;margin:0.3in 0;border-left:4px solid ' + colors.gold + ';border-radius:3px}' + '\n';
  html += '.goal-card.severity-strong{border-left-color:' + colors.strong + '}' + '\n';
  html += '.goal-card.severity-monitor{border-left-color:' + colors.monitor + '}' + '\n';
  html += '.goal-card.severity-concern{border-left-color:' + colors.concern + '}' + '\n';
  html += '.goal-card.severity-critical{border-left-color:' + colors.critical + '}' + '\n';
  html += '.goal-title{font-weight:600;color:' + colors.navy + ';font-size:10pt;margin:0 0 0.2rem 0}' + '\n';
  html += '.goal-meta{font-size:9pt;color:' + colors.brown + ';margin:0.2rem 0}' + '\n';
  html += '.severity-badge{display:inline-block;padding:0.2rem 0.5rem;border-radius:3px;font-size:8.5pt;font-weight:600;color:#fff;margin-top:0.2rem}' + '\n';
  html += '.severity-badge.strong{background:' + colors.strong + '}' + '\n';
  html += '.severity-badge.monitor{background:' + colors.monitor + '}' + '\n';
  html += '.severity-badge.concern{background:' + colors.concern + '}' + '\n';
  html += '.severity-badge.critical{background:' + colors.critical + '}' + '\n';

  // Initiative list
  html += '.initiative{background:#f9f9f9;padding:0.3in;margin:0.3in 0;border-left:4px solid ' + colors.teal + ';border-radius:3px}' + '\n';
  html += '.initiative h4{margin:0 0 0.2rem 0;color:' + colors.navy + ';font-size:10pt}' + '\n';
  html += '.initiative p{margin:0.2rem 0;font-size:9.5pt}' + '\n';

  // Timeline
  html += '.timeline-item{background:' + colors.cream + ';padding:0.3in;margin:0.25in 0;border-left:4px solid ' + colors.gold + ';border-radius:3px}' + '\n';
  html += '.timeline-item h4{margin:0 0 0.15rem 0;color:' + colors.navy + ';font-size:10pt}' + '\n';
  html += '.timeline-item ul{margin:0.15rem 0 0 1rem;padding:0;font-size:9.5pt}' + '\n';
  html += '.timeline-item li{margin:0.1rem 0}' + '\n';

  // Print styles
  html += '@media print{' + '\n';
  html += '.print-bar{display:none}' + '\n';
  html += 'body{margin:0;padding:0}' + '\n';
  html += '.document{padding:0.4in;margin:0}' + '\n';
  html += '.page{page-break-after:always;margin:0}' + '\n';
  html += '}' + '\n';

  html += '</style>' + '\n';
  html += '</head>' + '\n';
  html += '<body>' + '\n';

  // Print controls
  html += '<div class="print-bar"><button onclick="window.print()">Print / Save PDF</button><button onclick="window.close()">Close</button></div>' + '\n';
  html += '<div class="gradient-bar"></div>' + '\n';

  html += '<div class="document">' + '\n';

  // ===== PAGE 1: COVER & KEY STATS =====
  html += '<div class="page">' + '\n';

  // Hero section
  html += '<div class="hero">' + '\n';
  html += '<h1>' + dn + '</h1>' + '\n';
  html += '<div class="subheader">Strategic Plan ' + year + ' - ' + endYear + '</div>' + '\n';
  if (dl) html += '<div class="subheader" style="font-size:10pt;opacity:0.85">' + dl + '</div>' + '\n';
  html += '</div>' + '\n';

  // Key stats in grid (severity-colored)
  var statsShown = 0;
  html += '<h2>District Snapshot</h2>' + '\n';
  html += '<div class="stat-grid">' + '\n';

  if (planState.studentEnrollment) {
    html += '<div class="stat-card">' + '\n';
    html += '<div class="stat-value">' + Number(planState.studentEnrollment).toLocaleString() + '</div>' + '\n';
    html += '<div class="stat-label">Students</div>' + '\n';
    html += '</div>' + '\n';
    statsShown++;
  }
  if (planState.numberOfSchools) {
    html += '<div class="stat-card">' + '\n';
    html += '<div class="stat-value">' + planState.numberOfSchools + '</div>' + '\n';
    html += '<div class="stat-label">Schools</div>' + '\n';
    html += '</div>' + '\n';
    statsShown++;
  }
  if (planState.teacherCount) {
    html += '<div class="stat-card">' + '\n';
    html += '<div class="stat-value">' + planState.teacherCount + '</div>' + '\n';
    html += '<div class="stat-label">Teachers</div>' + '\n';
    html += '</div>' + '\n';
    statsShown++;
  }
  if (planState.graduationRate) {
    var gradRate = parseFloat(planState.graduationRate || 0);
    var gradSev = getSeverity('graduationRate', gradRate);
    html += '<div class="stat-card severity-' + gradSev + '">' + '\n';
    html += '<div class="stat-value">' + gradRate.toFixed(1) + '%</div>' + '\n';
    html += '<div class="stat-label">Graduation Rate</div>' + '\n';
    html += '</div>' + '\n';
    statsShown++;
  }

  html += '</div>' + '\n';

  // Vision & Mission
  html += '<div class="card">' + '\n';
  html += '<h3>Vision</h3>' + '\n';
  html += '<p>' + (planState.customVision || planState.vision || 'To provide every student with an equitable, world-class education.') + '</p>' + '\n';
  html += '</div>' + '\n';

  html += '<div class="card">' + '\n';
  html += '<h3>Mission</h3>' + '\n';
  html += '<p>' + (planState.customMission || planState.mission || 'We are committed to continuous improvement and student success.') + '</p>' + '\n';
  html += '</div>' + '\n';

  // Core Values
  if (planState.coreValues && planState.coreValues.length > 0) {
    html += '<div class="card">' + '\n';
    html += '<h3>Core Values</h3>' + '\n';
    html += '<div class="values">' + '\n';
    for (var v = 0; v < planState.coreValues.length; v++) {
      html += '<span class="value-pill">' + planState.coreValues[v] + '</span>' + '\n';
    }
    html += '</div>' + '\n';
    html += '</div>' + '\n';
  }

  html += '</div>' + '\n';

  // ===== PAGE 2: STRATEGY & GOALS =====
  html += '<div class="page">' + '\n';

  html += '<h2>Strategic Priorities</h2>' + '\n';

  // Strategic Domains as compact grid
  if (planState.strategicDomains && planState.strategicDomains.length > 0) {
    html += '<h3>Strategic Domains</h3>' + '\n';
    html += '<div class="domain-grid">' + '\n';
    for (var d = 0; d < planState.strategicDomains.length; d++) {
      var domName = planState.strategicDomains[d];
      var domDesc = '';
      if (typeof CONTENT_DB !== 'undefined' && CONTENT_DB.domains) {
        for (var dd = 0; dd < CONTENT_DB.domains.length; dd++) {
          if (CONTENT_DB.domains[dd].name === domName) {
            domDesc = CONTENT_DB.domains[dd].description || '';
            break;
          }
        }
      }
      html += '<div class="domain-card">' + '\n';
      html += '<h3>' + domName + '</h3>' + '\n';
      if (domDesc) html += '<p>' + domDesc.substring(0, 80) + '...</p>' + '\n';
      html += '</div>' + '\n';
    }
    html += '</div>' + '\n';
  }

  // Goals with severity colors
  if (planState.goals && planState.goals.length > 0) {
    html += '<h3>Strategic Goals</h3>' + '\n';
    for (var g = 0; g < planState.goals.length; g++) {
      var goal = planState.goals[g];
      var goalSev = getSeverity(goal.measure || '', parseInt(goal.target) || 0);
      html += '<div class="goal-card severity-' + goalSev + '">' + '\n';
      html += '<div class="goal-title">' + (goal.title || 'Untitled Goal') + '</div>' + '\n';
      html += '<div class="goal-meta"><strong>Measure:</strong> ' + (goal.measure || 'TBD') + ' | <strong>Target:</strong> ' + (goal.target || 'TBD') + '</div>' + '\n';
      html += '<span class="severity-badge ' + goalSev + '">' + (goalSev.charAt(0).toUpperCase() + goalSev.slice(1)) + '</span>' + '\n';
      html += '</div>' + '\n';
    }
  }

  // Goal Ambition summary
  if (planState.goalAmbition) {
    html += '<div class="card">' + '\n';
    html += '<h3>Implementation Ambition</h3>' + '\n';
    html += '<p><strong>' + (planState.goalAmbition.charAt(0).toUpperCase() + planState.goalAmbition.slice(1)) + '</strong> - Our goals balance aspiration with realistic capacity.</p>' + '\n';
    html += '</div>' + '\n';
  }

  html += '</div>' + '\n';

  // ===== PAGE 3: INITIATIVES & TIMELINE =====
  html += '<div class="page">' + '\n';

  html += '<h2>Implementation Roadmap</h2>' + '\n';

  // Key Initiatives (top 4)
  if (planState.initiatives && planState.initiatives.length > 0) {
    html += '<h3>Key Initiatives</h3>' + '\n';
    for (var i = 0; i < Math.min(4, planState.initiatives.length); i++) {
      var init = planState.initiatives[i];
      html += '<div class="initiative">' + '\n';
      html += '<h4>' + init.title + '</h4>' + '\n';
      html += '<p>' + (init.description || 'TBD').substring(0, 120) + '</p>' + '\n';
      if (init.lead) html += '<p><strong>Lead:</strong> ' + init.lead + '</p>' + '\n';
      html += '</div>' + '\n';
    }
  }

  // Implementation Timeline
  html += '<h3>Three-Year Timeline</h3>' + '\n';

  html += '<div class="timeline-item">' + '\n';
  html += '<h4>Year 1: Foundation (' + year + ')</h4>' + '\n';
  html += '<ul>' + '\n';
  html += '<li>Establish governance & decision structures</li>' + '\n';
  html += '<li>Finalize implementation plans</li>' + '\n';
  html += '<li>Staff professional development</li>' + '\n';
  html += '<li>Baseline assessments</li>' + '\n';
  html += '</ul>' + '\n';
  html += '</div>' + '\n';

  html += '<div class="timeline-item">' + '\n';
  html += '<h4>Years 2-3: Implementation (' + (year + 1) + ' - ' + (year + 2) + ')</h4>' + '\n';
  html += '<ul>' + '\n';
  html += '<li>Execute initiatives with fidelity</li>' + '\n';
  html += '<li>Quarterly progress monitoring</li>' + '\n';
  html += '<li>Adjust strategies based on data</li>' + '\n';
  html += '<li>Ongoing coaching & support</li>' + '\n';
  html += '</ul>' + '\n';
  html += '</div>' + '\n';

  html += '<div class="timeline-item">' + '\n';
  html += '<h4>Year 4: Acceleration (' + (year + 3) + ')</h4>' + '\n';
  html += '<ul>' + '\n';
  html += '<li>Scale successful initiatives</li>' + '\n';
  html += '<li>Comprehensive plan review</li>' + '\n';
  html += '<li>Plan next cycle</li>' + '\n';
  html += '<li>Celebrate achievements</li>' + '\n';
  html += '</ul>' + '\n';
  html += '</div>' + '\n';

  // Department alignment summary
  if (planState.selectedDepartments && planState.selectedDepartments.length > 0) {
    html += '<h3>Department Alignment</h3>' + '\n';
    html += '<table class="table">' + '\n';
    html += '<thead><tr><th>Department</th><th>Strategic Focus</th></tr></thead>' + '\n';
    html += '<tbody>' + '\n';
    for (var sd = 0; sd < planState.selectedDepartments.length; sd++) {
      var dept = planState.selectedDepartments[sd];
      var depts = planState.departmentAlignment ? (planState.departmentAlignment[dept] || []) : [];
      html += '<tr><td>' + dept + '</td><td>' + (depts.length > 0 ? depts.join(', ') : 'All domains') + '</td></tr>' + '\n';
    }
    html += '</tbody>' + '\n';
    html += '</table>' + '\n';
  }

  // Footer with plan metadata
  html += '<div style="margin-top:0.5in;padding-top:0.3in;border-top:1px solid #ddd;font-size:9pt;color:' + colors.brown + '">' + '\n';
  html += '<p>' + dn + ' | Strategic Plan ' + year + ' - ' + endYear + ' | Generated ' + new Date().toLocaleDateString() + '</p>' + '\n';
  html += '</div>' + '\n';

  html += '</div>' + '\n';

  html += '</div>' + '\n';
  html += '</body>' + '\n';
  html += '</html>' + '\n';

  w.document.write(html);
  w.document.close();
}

function exportFullPlan() {
  saveFormState();
  var w = window.open('', '_blank');
  if (!w) { alert('Please allow pop-ups to export your full plan.'); return; }

  var dn = planState.districtName || 'Strategic District';
  var dl = planState.districtLocation || 'District Location';
  var year = new Date().getFullYear();
  var endYear = year + 3;

  var c = {
    navy: '#22333B', darkBlue: '#14213D', teal: '#00B4CC', gold: '#D4A537',
    cream: '#EAE0D5', green: '#6ECF6E', coral: '#E07A5F', purple: '#6B4C9A',
    brown: '#5E503F'
  };

  var gradientBar = 'background:linear-gradient(to right,#6ECF6E,#00B4CC,#D4A537,#E07A5F,#6B4C9A);height:6px;';

  var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>' + dn + ' Strategic Plan</title>';
  html += '<link href="https://fonts.googleapis.com/css2?family=Source+Serif+Pro:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';
  html += '<style>';
  html += 'body { font-family: "Inter", sans-serif; margin: 0; padding: 0; color: #333; line-height: 1.6; }';
  html += 'h1, h2, h3 { font-family: "Source Serif Pro", serif; }';
  html += '.gradient-bar { ' + gradientBar + ' }';
  html += '.print-bar { background: ' + c.navy + '; color: white; padding: 1rem; text-align: right; position: sticky; top: 0; z-index: 100; }';
  html += '.print-bar button { background: ' + c.gold + '; color: ' + c.navy + '; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-weight: 600; margin-left: 1rem; }';
  html += '.document { max-width: 8.5in; margin: 0 auto; padding: 2rem; background: white; }';
  html += '.cover { page-break-after: always; text-align: center; padding: 4rem 0; background: linear-gradient(135deg, ' + c.navy + ' 0%, ' + c.darkBlue + ' 100%); color: white; }';
  html += '.cover h1 { font-size: 3rem; margin: 0; }';
  html += '.cover h2 { font-size: 1.8rem; margin-top: 2rem; font-weight: normal; }';
  html += '.cover p { font-size: 1.1rem; margin: 1rem 0; }';
  html += '.toc { page-break-after: always; }';
  html += '.toc h2 { border-bottom: 2px solid ' + c.gold + '; padding-bottom: 1rem; }';
  html += '.toc ul { list-style: none; padding: 0; }';
  html += '.toc li { padding: 0.5rem 0; }';
  html += '.toc a { color: ' + c.navy + '; text-decoration: none; border-bottom: dotted 1px ' + c.gold + '; }';
  html += '.section { page-break-before: always; margin-top: 2rem; }';
  html += '.section h2 { color: ' + c.navy + '; border-bottom: 3px solid ' + c.gold + '; padding-bottom: 1rem; margin-top: 0; }';
  html += '.letter { font-style: italic; line-height: 1.8; margin: 2rem 0; padding: 2rem; background: ' + c.cream + '; border-radius: 6px; }';
  html += '.stat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0; }';
  html += '.stat-card { background: ' + c.cream + '; padding: 1rem; border-radius: 6px; }';
  html += '.stat-value { font-size: 1.5rem; font-weight: bold; color: ' + c.navy + '; }';
  html += '.stat-label { font-size: 0.9rem; color: ' + c.brown + '; margin-top: 0.5rem; }';
  html += '.card { background: #f9f9f9; padding: 1.5rem; margin: 1.5rem 0; border-left: 5px solid ' + c.gold + '; border-radius: 4px; }';
  html += '.card h3 { margin-top: 0; color: ' + c.navy + '; }';
  html += '.values { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1rem 0; }';
  html += '.value-pill { background: ' + c.purple + '; color: white; padding: 0.4rem 0.9rem; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }';
  html += '.domain-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin: 1.5rem 0; }';
  html += '.domain-item { background: ' + c.cream + '; padding: 1.5rem; border-radius: 6px; }';
  html += '.domain-item h3 { margin-top: 0; color: ' + c.navy + '; }';
  html += '.goal-card { background: white; border: 1px solid #ddd; padding: 1.5rem; margin: 1rem 0; border-left: 4px solid ' + c.gold + '; }';
  html += '.goal-title { font-size: 1.1rem; font-weight: 600; color: ' + c.navy + '; margin: 0; }';
  html += '.severity { display: inline-block; padding: 0.3rem 0.8rem; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-top: 0.5rem; }';
  html += '.severity.strong { background: #4caf50; color: white; }';
  html += '.severity.monitor { background: #ff9800; color: white; }';
  html += '.severity.concern { background: #f44336; color: white; }';
  html += '.severity.critical { background: #b71c1c; color: white; }';
  html += '.table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }';
  html += '.table th { background: ' + c.navy + '; color: white; padding: 0.75rem; text-align: left; }';
  html += '.table td { padding: 0.75rem; border-bottom: 1px solid #ddd; }';
  html += '.table tr:nth-child(even) { background: #f9f9f9; }';
  html += '.timeline { margin: 2rem 0; }';
  html += '.timeline-phase { margin: 1.5rem 0; padding: 1.5rem; background: ' + c.cream + '; border-left: 4px solid ' + c.gold + '; }';
  html += '.timeline-phase h3 { margin-top: 0; color: ' + c.navy + '; }';
  html += '.initiative-card { background: white; border: 1px solid #ddd; padding: 1.5rem; margin: 1rem 0; border-radius: 6px; }';
  html += '.initiative-card h3 { margin-top: 0; color: ' + c.navy + '; }';
  html += '.footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #ddd; font-size: 0.9rem; color: #666; text-align: center; }';
  html += '@media print { .print-bar { display: none; } .section { page-break-before: always; } body { margin: 0; padding: 0; } .document { padding: 1rem; } }';
  html += '</style></head><body>';

  html += '<div class="gradient-bar"></div>';
  html += '<div class="print-bar"><button onclick="window.print()">Print / Save PDF</button><button onclick="window.close()">Close</button></div>';

  html += '<div class="document">';

  // Cover Page
  html += '<div class="cover">';
  html += '<h1>' + dn + '</h1>';
  html += '<h2>Strategic Plan</h2>';
  html += '<p>' + year + ' - ' + endYear + '</p>';
  html += '<p style="margin-top: 3rem; font-size: 0.95rem; opacity: 0.8;">Strategic District<br>' + dl + '</p>';
  html += '<p style="margin-top: 4rem; font-size: 0.9rem;">Plan Developed: ' + new Date().toLocaleDateString() + '</p>';
  html += '</div>';

  // Table of Contents
  html += '<div class="toc">';
  html += '<h2>Table of Contents</h2>';
  html += '<ul>';
  html += '<li><a href="#leadership">Letter from Leadership</a></li>';
  html += '<li><a href="#executive">Executive Summary</a></li>';
  html += '<li><a href="#profile">District Profile</a></li>';
  html += '<li><a href="#foundation">Our Foundation: Vision, Mission & Values</a></li>';
  html += '<li><a href="#domains">Strategic Domains</a></li>';
  html += '<li><a href="#goals">Strategic Goals & Forecasting</a></li>';
  html += '<li><a href="#alignment">Central Office Alignment</a></li>';
  html += '<li><a href="#initiatives">Action Initiatives</a></li>';
  html += '<li><a href="#implementation">Implementation Calendar</a></li>';
  html += '<li><a href="#accountability">Monitoring & Accountability</a></li>';
  html += '</ul>';
  html += '</div>';

  // Letter from Leadership
  html += '<div id="leadership" class="section">';
  html += '<h2>Letter from Leadership</h2>';
  html += '<div class="letter">';
  html += '<p>Dear Colleagues and Community Members,</p>';
  html += '<p>We are pleased to present the Strategic Plan for ' + dn + ' for ' + year + ' through ' + endYear + '. This comprehensive plan represents months of collaboration, thoughtful analysis, and a shared commitment to excellence.</p>';
  html += '<p>Our strategic priorities reflect our unwavering commitment to ensuring that every student receives an equitable, world-class education. We are focused on continuous improvement, data-driven decision-making, and building a culture where all students can thrive.</p>';
  html += '<p>This plan will guide our work and serve as a roadmap for achieving our vision. We invite you to join us on this exciting journey.</p>';
  html += '<p>Sincerely,<br>District Leadership</p>';
  html += '</div>';
  html += '</div>';

  // Executive Summary
  html += '<div id="executive" class="section">';
  html += '<h2>Executive Summary</h2>';
  html += '<p>' + dn + ' serves a diverse student population with a commitment to equity and excellence. This strategic plan outlines our priorities, goals, and initiatives for ' + year + ' through ' + endYear + '.</p>';

  html += '<h3>Key Statistics</h3>';
  html += '<div class="stat-grid">';
  if (planState.studentEnrollment) html += '<div class="stat-card"><div class="stat-value">' + Number(planState.studentEnrollment).toLocaleString() + '</div><div class="stat-label">Students</div></div>';
  if (planState.numberOfSchools) html += '<div class="stat-card"><div class="stat-value">' + planState.numberOfSchools + '</div><div class="stat-label">Schools</div></div>';
  if (planState.teacherCount) html += '<div class="stat-card"><div class="stat-value">' + planState.teacherCount + '</div><div class="stat-label">Teachers</div></div>';
  if (planState.graduationRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.graduationRate || 0).toFixed(1) + '%</div><div class="stat-label">Graduation Rate</div></div>';
  html += '</div>';

  html += '<h3>Strategic Priorities</h3>';
  html += '<p>This plan focuses on six strategic domains that reflect our commitment to student success:</p>';
  if (planState.strategicDomains && planState.strategicDomains.length > 0) {
    html += '<ul>';
    for (var d = 0; d < planState.strategicDomains.length; d++) {
      html += '<li>' + planState.strategicDomains[d] + '</li>';
    }
    html += '</ul>';
  }

  html += '</div>';

  // District Profile
  html += '<div id="profile" class="section">';
  html += '<h2>District Profile</h2>';
  html += '<p>' + dn + ' is located in ' + dl + ' and serves ' + (planState.studentEnrollment ? Number(planState.studentEnrollment).toLocaleString() + ' students' : 'a diverse student population') + ' across ' + (planState.numberOfSchools || 'multiple') + ' schools.</p>';

  html += '<h3>Student Demographics</h3>';
  html += '<div class="stat-grid">';
  if (planState.frlRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.frlRate || 0).toFixed(1) + '%</div><div class="stat-label">Free/Reduced Lunch</div></div>';
  if (planState.elRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.elRate || 0).toFixed(1) + '%</div><div class="stat-label">English Learners</div></div>';
  if (planState.iepRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.iepRate || 0).toFixed(1) + '%</div><div class="stat-label">Special Education</div></div>';
  if (planState.minorityRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.minorityRate || 0).toFixed(1) + '%</div><div class="stat-label">Students of Color</div></div>';
  html += '</div>';

  html += '<h3>Academic Performance</h3>';
  html += '<div class="stat-grid">';
  if (planState.readingProficiency) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.readingProficiency || 0).toFixed(1) + '%</div><div class="stat-label">Reading Proficiency</div></div>';
  if (planState.mathProficiency) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.mathProficiency || 0).toFixed(1) + '%</div><div class="stat-label">Math Proficiency</div></div>';
  if (planState.chronicAbsenceRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.chronicAbsenceRate || 0).toFixed(1) + '%</div><div class="stat-label">Chronic Absenteeism</div></div>';
  if (planState.suspensionRate) html += '<div class="stat-card"><div class="stat-value">' + parseFloat(planState.suspensionRate || 0).toFixed(1) + '%</div><div class="stat-label">Suspension Rate</div></div>';
  html += '</div>';

  html += '</div>';

  // Foundation
  html += '<div id="foundation" class="section">';
  html += '<h2>Our Foundation: Vision, Mission & Values</h2>';

  html += '<div class="card">';
  html += '<h3>Vision</h3>';
  html += '<p>' + (planState.customVision || planState.vision || 'To provide every student with an equitable, world-class education that prepares them for success in college, career, and life.') + '</p>';
  html += '</div>';

  html += '<div class="card">';
  html += '<h3>Mission</h3>';
  html += '<p>' + (planState.customMission || planState.mission || 'We are committed to continuous improvement, equity, and student success through data-driven decision-making and collaborative partnerships.') + '</p>';
  html += '</div>';

  if (planState.coreValues && planState.coreValues.length > 0) {
    html += '<div class="card">';
    html += '<h3>Core Values</h3>';
    html += '<div class="values">';
    for (var i = 0; i < planState.coreValues.length; i++) {
      html += '<span class="value-pill">' + planState.coreValues[i] + '</span>';
    }
    html += '</div>';
    html += '</div>';
  }

  if (planState.competencies && Object.keys(planState.competencies).length > 0) {
    html += '<h3>Competencies</h3>';
    for (var cat in planState.competencies) {
      html += '<h4>' + cat + '</h4>';
      html += '<ul>';
      for (var j = 0; j < planState.competencies[cat].length; j++) {
        html += '<li>' + planState.competencies[cat][j] + '</li>';
      }
      html += '</ul>';
    }
  }

  html += '</div>';

  // Strategic Domains
  html += '<div id="domains" class="section">';
  html += '<h2>Strategic Domains</h2>';
  html += '<p>Our strategic plan is organized around six key domains that guide our work and ensure comprehensive improvement across the district.</p>';

  if (planState.strategicDomains && planState.strategicDomains.length > 0) {
    html += '<div class="domain-list">';
    for (var d = 0; d < planState.strategicDomains.length; d++) {
      var dname = planState.strategicDomains[d];
      var domainDesc = '';
      for (var dd = 0; dd < CONTENT_DB.domains.length; dd++) {
        if (CONTENT_DB.domains[dd].name === dname) {
          domainDesc = CONTENT_DB.domains[dd].description;
          break;
        }
      }
      html += '<div class="domain-item">';
      html += '<h3>' + dname + '</h3>';
      html += '<p>' + domainDesc + '</p>';
      html += '</div>';
    }
    html += '</div>';
  }

  html += '</div>';

  // Strategic Goals
  html += '<div id="goals" class="section">';
  html += '<h2>Strategic Goals & Forecasting</h2>';
  html += '<p>We have established clear, measurable goals to guide our work and track progress.</p>';

  if (planState.goals && planState.goals.length > 0) {
    for (var g = 0; g < planState.goals.length; g++) {
      var goal = planState.goals[g];
      var severity = getSeverity(goal.measure, parseInt(goal.target) || 0);
      var sevLabel = severity.charAt(0).toUpperCase() + severity.slice(1);

      html += '<div class="goal-card">';
      html += '<p class="goal-title">' + (goal.title || 'Untitled Goal') + '</p>';
      html += '<p><strong>Measure:</strong> ' + (goal.measure || 'TBD') + '<br><strong>Target:</strong> ' + (goal.target || 'TBD') + '</p>';
      html += '<span class="severity ' + severity + '">' + sevLabel + '</span>';
      html += '</div>';
    }
  }

  html += '<h3>Goal Ambition: ' + (planState.goalAmbition || 'Not Selected').charAt(0).toUpperCase() + (planState.goalAmbition || 'Not Selected').slice(1) + '</h3>';
  html += '<p>Our goals reflect a ' + (planState.goalAmbition || 'Not Selected') + ' ambition level, balancing aspirational targets with realistic capacity.</p>';

  html += '<h3>Forecasting Analysis</h3>';
  var ambitionMultipliers = { conservative: 0.6, moderate: 1.0, aggressive: 1.5 };
  var multiplier = ambitionMultipliers[planState.goalAmbition] || 1.0;

  html += '<table class="table">';
  html += '<thead><tr><th>Goal</th><th>Current</th><th>Year 1</th><th>Year 3</th><th>Year 5</th></tr></thead>';
  html += '<tbody>';
  for (var gf = 0; gf < planState.goals.length; gf++) {
    var gf_goal = planState.goals[gf];
    var tVal = parseFloat(gf_goal.target) || 0;
    html += '<tr>';
    html += '<td>' + (gf_goal.title || 'Untitled') + '</td>';
    html += '<td>' + (gf_goal.target || 'N/A') + '</td>';
    html += '<td>' + (tVal > 0 ? (tVal * (1 + 0.05 * multiplier)).toFixed(1) : 'N/A') + '</td>';
    html += '<td>' + (tVal > 0 ? (tVal * (1 + 0.15 * multiplier)).toFixed(1) : 'N/A') + '</td>';
    html += '<td>' + (tVal > 0 ? (tVal * (1 + 0.25 * multiplier)).toFixed(1) : 'N/A') + '</td>';
    html += '</tr>';
  }
  html += '</tbody>';
  html += '</table>';

  html += '</div>';

  // Alignment
  if (planState.selectedDepartments && planState.selectedDepartments.length > 0) {
    html += '<div id="alignment" class="section">';
    html += '<h2>Central Office Alignment</h2>';
    html += '<p>Our central office departments are aligned with strategic domains to ensure coordination and accountability across the organization.</p>';

    html += '<table class="table">';
    html += '<thead><tr><th>Department</th><th>Strategic Domains</th></tr></thead>';
    html += '<tbody>';
    for (var sd = 0; sd < planState.selectedDepartments.length; sd++) {
      var dept = planState.selectedDepartments[sd];
      var alignedDomains = planState.departmentAlignment ? planState.departmentAlignment[dept] : [];
      html += '<tr>';
      html += '<td>' + dept + '</td>';
      html += '<td>' + (alignedDomains ? alignedDomains.join(', ') : 'All domains') + '</td>';
      html += '</tr>';
    }
    html += '</tbody>';
    html += '</table>';

    for (var sd2 = 0; sd2 < planState.selectedDepartments.length; sd2++) {
      var dept2 = planState.selectedDepartments[sd2];
      var alignedDomains2 = planState.departmentAlignment ? planState.departmentAlignment[dept2] : [];
      html += '<div class="card">';
      html += '<h3>' + dept2 + '</h3>';
      html += '<p><strong>Aligned Domains:</strong> ' + (alignedDomains2 ? alignedDomains2.join(', ') : 'All strategic domains') + '</p>';
      html += '<p>This department is responsible for advancing our strategic goals in the above domains through coordinated action and accountability.</p>';
      html += '</div>';
    }

    html += '</div>';
  }

  // Initiatives
  if (planState.initiatives && planState.initiatives.length > 0) {
    html += '<div id="initiatives" class="section">';
    html += '<h2>Action Initiatives</h2>';
    html += '<p>The following action initiatives will drive progress toward our strategic goals.</p>';

    for (var init = 0; init < planState.initiatives.length; init++) {
      var initiative = planState.initiatives[init];
      html += '<div class="initiative-card">';
      html += '<h3>' + initiative.title + '</h3>';
      html += '<p>' + initiative.description + '</p>';
      html += '<p><strong>Lead:</strong> ' + initiative.lead + '</p>';
      html += '</div>';
    }

    html += '</div>';
  }

  // Implementation Calendar
  html += '<div id="implementation" class="section">';
  html += '<h2>Implementation Calendar</h2>';
  html += '<p>Our implementation plan spans three phases over three years, with clear milestones and accountability checkpoints.</p>';

  html += '<div class="timeline">';
  html += '<div class="timeline-phase">';
  html += '<h3>Foundation Year (' + year + ')</h3>';
  html += '<ul>';
  html += '<li>Establish governance and decision-making structures</li>';
  html += '<li>Finalize implementation plans for all initiatives</li>';
  html += '<li>Secure resources and conduct staff professional development</li>';
  html += '<li>Launch stakeholder engagement and communication plan</li>';
  html += '<li>Conduct baseline assessments</li>';
  html += '</ul>';
  html += '</div>';

  html += '<div class="timeline-phase">';
  html += '<h3>Implementation Years (' + (year + 1) + ' - ' + (year + 2) + ')</h3>';
  html += '<ul>';
  html += '<li>Execute initiatives with fidelity</li>';
  html += '<li>Conduct quarterly progress monitoring</li>';
  html += '<li>Adjust strategies based on data and feedback</li>';
  html += '<li>Provide ongoing professional development and coaching</li>';
  html += '<li>Celebrate progress and share lessons learned</li>';
  html += '</ul>';
  html += '</div>';

  html += '<div class="timeline-phase">';
  html += '<h3>Acceleration Year (' + (year + 3) + ')</h3>';
  html += '<ul>';
  html += '<li>Scale successful initiatives district-wide</li>';
  html += '<li>Conduct comprehensive plan review</li>';
  html += '<li>Celebrate significant progress and achievements</li>';
  html += '<li>Prepare for next strategic planning cycle</li>';
  html += '<li>Ensure sustainability of improvements</li>';
  html += '</ul>';
  html += '</div>';
  html += '</div>';

  html += '<h3>Quarterly Milestones</h3>';
  html += '<table class="table">';
  html += '<thead><tr><th>Quarter</th><th>Key Activities</th></tr></thead>';
  html += '<tbody>';
  html += '<tr><td>Q1</td><td>Planning, resource allocation, initial implementation</td></tr>';
  html += '<tr><td>Q2</td><td>Monitor progress, gather feedback, adjust as needed</td></tr>';
  html += '<tr><td>Q3</td><td>Mid-year review, professional development, celebrate wins</td></tr>';
  html += '<tr><td>Q4</td><td>Year-end assessment, plan next year, stakeholder communication</td></tr>';
  html += '</tbody>';
  html += '</table>';

  html += '</div>';

  // Monitoring & Accountability
  html += '<div id="accountability" class="section">';
  html += '<h2>Monitoring & Accountability Framework</h2>';
  html += '<p>Effective implementation requires regular monitoring, transparent reporting, and accountability at all levels.</p>';

  html += '<div class="card">';
  html += '<h3>Review Cadence</h3>';
  html += '<ul>';
  html += '<li><strong>Monthly:</strong> Department leadership reviews progress on assigned initiatives and goals</li>';
  html += '<li><strong>Quarterly:</strong> District leadership reviews overall progress, analyzes data, and adjusts tactics</li>';
  html += '<li><strong>Bi-Annual:</strong> Board of Education briefing on progress and challenges</li>';
  html += '<li><strong>Annually:</strong> Comprehensive plan review, goal achievement assessment, and stakeholder communication</li>';
  html += '</ul>';
  html += '</div>';

  html += '<div class="card">';
  html += '<h3>Accountability Structure</h3>';
  html += '<ul>';
  html += '<li>District leadership owns overall plan execution</li>';
  html += '<li>Department heads own specific goals and initiatives</li>';
  html += '<li>Building principals own school-level implementation</li>';
  html += '<li>Teachers own classroom-level instruction and student engagement</li>';
  html += '</ul>';
  html += '</div>';

  html += '</div>';

  // Conclusion
  html += '<div class="section">';
  html += '<h2>Conclusion</h2>';
  html += '<p>' + dn + ' is committed to continuous improvement and ensuring that every student succeeds. This strategic plan provides a clear roadmap for our collective work and reflects our shared values and vision for the future.</p>';
  html += '<p>We are excited about the opportunities ahead and grateful for the collaborative spirit that made this plan possible. Together, we will make a meaningful difference in the lives of our students and families.</p>';
  html += '</div>';

  html += '<div class="footer">';
  html += '<p>Strategic District | ' + dn + ' | ' + year + ' - ' + endYear + '</p>';
  html += '</div>';

  html += '</div>';
  html += '</body></html>';

  w.document.write(html);
  w.document.close();
}

window.exportDashboardHTML = exportDashboardHTML;
window.exportQuickSummary = exportQuickSummary;
window.exportFullPlan = exportFullPlan;
window.finishPlan = finishPlan;
window.setGoalAmbition = setGoalAmbition;
window.renderImplementationCalendar = renderImplementationCalendar;
window.toggleCalendarView = toggleCalendarView;
window.submitPlanName = submitPlanName;
window.updatePlanNameDisplay = updatePlanNameDisplay;
window.finalizePlan = finalizePlan;
window.saveAndConfirm = saveAndConfirm;
window.addCustomVision = addCustomVision;
window.addCustomMission = addCustomMission;
window.selectDistrict = selectDistrict;
window.handleDistrictSearch = handleDistrictSearch;
window.handleFileUpload = handleFileUpload;
window.onDepartmentChange = onDepartmentChange;
window.autoSelectDepartments = autoSelectDepartments;
window.renderAlignmentMatrix = renderAlignmentMatrix;
window.renderDepartmentDetails = renderDepartmentDetails;
window.updateVisionCounter = updateVisionCounter;
window.updateMissionCounter = updateMissionCounter;
window.updateValuesCounter = updateValuesCounter;
window.updateDomainsCounter = updateDomainsCounter;
window.highlightUnfilledFields = highlightUnfilledFields;
window.generateSuggestedGoals = generateSuggestedGoals;
window.generateSuggestedInitiatives = generateSuggestedInitiatives;
window.renderDataProfile = renderDataProfile;
window.saveFinalizedPlan = saveFinalizedPlan;
window.updateInitiativeCounter = updateInitiativeCounter;
window.addCustomDepartment = addCustomDepartment;
window.addCustomDomain = addCustomDomain;
window.addCustomCoreValue = addCustomCoreValue;
window.addCustomCompetency = addCustomCompetency;
window.loadSavedPlan = loadSavedPlan;
window.addDomainGoal = addDomainGoal;
window.addGoalFromSuggestion = addGoalFromSuggestion;
window.addInitiativeFromSuggestion = addInitiativeFromSuggestion;
window.addGoal = addGoal;
window.addInitiative = addInitiative;
window.togglePreviewPanel = togglePreviewPanel;

// ============================================================================
// INITIALIZATION - RUNS ON PAGE LOAD
// ============================================================================

(function() {
  // 1. Restore planState from localStorage FIRST so render functions have data
  var saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      Object.assign(planState, JSON.parse(saved));
    } catch(e) {
      // Corrupted state, start fresh
    }
  }

  // 2. Render dynamic content (uses planState for checked states)
  renderCoreValues();
  renderCompetencies();
  renderDomains();

  // 2b. Wire up vision/mission checkbox handlers (static HTML, need event listeners)
  document.querySelectorAll('[data-type="vision"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      combineVisionStatements(true);
    });
  });
  document.querySelectorAll('[data-type="mission"]').forEach(function(cb) {
    cb.addEventListener('change', function() {
      combineMissionStatements(true);
    });
  });

  // 3. Restore domain checked states from planState
  if (planState.strategicDomains && planState.strategicDomains.length > 0) {
    planState.strategicDomains.forEach(function(domainName) {
      var checkboxes = document.querySelectorAll('input[name="domain"]');
      checkboxes.forEach(function(cb) {
        if (cb.value === domainName) {
          cb.checked = true;
          var card = cb.nextElementSibling;
          if (card) {
            card.style.borderColor = '#6ECF6E';
            card.style.backgroundColor = '#f0f8f0';
            card.style.boxShadow = '0 2px 8px rgba(110, 207, 110, 0.2)';
          }
        }
      });
    });
  }

  // 3b. Rebuild goals from planState
  if (planState.goals && planState.goals.length > 0) {
    planState.goals.forEach(function(g) {
      if (g.title) addGoal(g.title);
    });
  }

  // 3c. Rebuild initiatives from planState
  if (planState.initiatives && planState.initiatives.length > 0) {
    planState.initiatives.forEach(function(init) {
      if (init.title) addInitiative(init.title);
    });
    updateInitiativeCounter();
  }

  // 3d. Restore highestStepVisited from planState
  if (planState.goalAmbition) highestStepVisited = Math.max(highestStepVisited, 7);
  if (planState.selectedDepartments && planState.selectedDepartments.length) highestStepVisited = Math.max(highestStepVisited, 8);
  if (planState.initiatives && planState.initiatives.length) highestStepVisited = Math.max(highestStepVisited, 9);
  if (planState.calendar && Object.keys(planState.calendar).length) highestStepVisited = Math.max(highestStepVisited, 10);

  // 4. Apply UI state for district fields, vision, mission
  applyStateToUI();

  // 4b. Rebuild combined vision/mission text if checkboxes are checked
  if (document.querySelectorAll('[data-type="vision"]:checked').length > 0) {
    combineVisionStatements();
  }
  if (document.querySelectorAll('[data-type="mission"]:checked').length > 0) {
    combineMissionStatements();
  }

  // 5. Update counters and preview
  updateValuesCounter();
  updateDomainsCounter();
  updateVisionCounter();
  updateMissionCounter();
  updatePreview();

  // 6. Show export section if already finalized
  if (planState.finalized) {
    var exportSection = document.getElementById('exportSection');
    var finalizeSection = document.getElementById('finalizeSection');
    if (exportSection) exportSection.style.display = 'block';
    if (finalizeSection) finalizeSection.style.display = 'none';
    var nameInput = document.getElementById('planNameInput');
    if (nameInput && planState.planName) nameInput.value = planState.planName;
  }

  // 7. Populate saved plans dropdown if any exist
  var savedPlansRaw = localStorage.getItem('strategicPlans_saved');
  if (savedPlansRaw) {
    try {
      var savedPlans = JSON.parse(savedPlansRaw);
      if (savedPlans.length > 0) {
        var dropdown = document.getElementById('savedPlansDropdown');
        var select = document.getElementById('savedPlanSelect');
        if (dropdown && select) {
          dropdown.style.display = 'block';
          savedPlans.forEach(function(plan, idx) {
            var option = document.createElement('option');
            option.value = idx;
            option.textContent = plan.planName || plan.districtName || ('Plan ' + (idx + 1));
            select.appendChild(option);
          });
        }
      }
    } catch(e) { /* ignore */ }
  }
})();
