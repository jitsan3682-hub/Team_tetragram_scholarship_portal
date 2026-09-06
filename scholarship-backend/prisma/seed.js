const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ScholarBridge database seed...');

  // Seed demo student
  const studentPassword = await bcrypt.hash('Student@1234', 10);
  const student = await prisma.user.upsert({
    where: { email: 'student@tezu.ac.in' },
    update: {},
    create: {
      email: 'student@tezu.ac.in',
      password: studentPassword,
      name: 'Priyanka Sarma',
      role: 'student',
      state: 'Assam',
      major: 'Computer Science',
      academicLevel: 'Undergraduate',
      gpa: 3.8,
      familyIncome: 250000,
      category: 'General',
      gender: 'Female (in STEM)',
      expectedGraduationYear: 2026,
      careerGoals: 'AI Research and Distributed Systems for Sustainable Education',
    },
  });
  console.log('✅ Seeded Student user:', student.email);

  // Seed demo admin
  const adminPassword = await bcrypt.hash('Admin@1234', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@scholarbridge.in' },
    update: {},
    create: {
      email: 'admin@scholarbridge.in',
      password: adminPassword,
      name: 'Dr. Debabrata Das',
      role: 'admin',
      state: 'Assam',
      major: 'Computer Science',
      academicLevel: 'Doctoral',
      gpa: 4.0,
      familyIncome: 1200000,
      category: 'General',
      gender: 'Male',
    },
  });
  console.log('✅ Seeded Admin user:', admin.email);

  // Seed initial flagship scholarships
  const scholarships = [
    {
      id: 'sch-aicte-pragati',
      title: 'AICTE Pragati Scholarship for Girl Students',
      provider: 'AICTE, Ministry of Education',
      category: 'AICTE',
      amount: '₹50,000 / annum',
      deadline: '2026-11-30',
      description: 'Provides scholarship of ₹50,000 per year towards tuition fees, computer, stationeries, books, equipment, softwares to female students entering technical degree programs.',
      awardType: 'Tuition Waiver',
      minGpa: 3.0,
      maxIncome: 800000,
      states: 'All',
      majors: 'Computer Science,Electrical,Mechanical,Civil Engineering,Chemical,Data Science',
      categories: 'All',
      genders: 'Female,Female (in STEM)',
      docsNeeded: 'Income Certificate,Admission Letter,12th Marksheet,Aadhaar Card,College Bonafide',
      link: 'https://www.aicte-pragati-saksham-gov.in/',
      isCustom: false,
    },
    {
      id: 'sch-assam-nec',
      title: 'North Eastern Council (NEC) Merit & Financial Assistance',
      provider: 'Department of Higher Education Assam & NEC',
      category: 'State',
      amount: '₹22,000 / annum',
      deadline: '2026-10-31',
      description: 'Financial assistance to permanent residents of North Eastern States pursuing professional technical degree courses.',
      awardType: 'Merit Award',
      minGpa: 3.2,
      maxIncome: 800000,
      states: 'Assam,Arunachal Pradesh,Manipur,Meghalaya,Mizoram,Nagaland,Sikkim,Tripura',
      majors: 'All',
      categories: 'All',
      genders: 'All',
      docsNeeded: 'PRC Assam/NE,Family Income Certificate,Institute Bonafide,Marksheets',
      link: 'https://dhe-assam.gov.in/',
      isCustom: false,
    },
    {
      id: 'sch-tata-merit',
      title: 'Tata Trusts Means Grant for Higher Education',
      provider: 'Tata Trusts',
      category: 'Corporate',
      amount: '₹75,000 / annum',
      deadline: '2026-12-15',
      description: 'Need-cum-merit financial support for underprivileged students enrolled in recognized Indian higher education institutions.',
      awardType: 'Full-Ride',
      minGpa: 3.4,
      maxIncome: 450000,
      states: 'All',
      majors: 'All',
      categories: 'All',
      genders: 'All',
      docsNeeded: 'IT Returns,Salary Slip,Latest Marksheets,Fee Receipt',
      link: 'https://www.tatatrusts.org/',
      isCustom: false,
    },
  ];

  for (const sch of scholarships) {
    await prisma.scholarship.upsert({
      where: { id: sch.id },
      update: sch,
      create: sch,
    });
  }
  console.log(`✅ Seeded ${scholarships.length} flagship scholarships`);

  // Seed sample application
  await prisma.application.upsert({
    where: { id: 'app-seed-001' },
    update: {},
    create: {
      id: 'app-seed-001',
      userId: student.id,
      scholarshipId: 'sch-aicte-pragati',
      status: 'Under Review',
      sopText: 'I am pursuing Computer Science at Tezpur University and aim to contribute to scalable educational systems in the North East region.',
      documents: JSON.stringify(['Income Certificate', '12th Marksheet', 'College Bonafide']),
    },
  });
  console.log('✅ Seeded demo application');

  console.log('✨ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
