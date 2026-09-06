const prisma = require('../utils/prismaClient');

exports.getAllScholarships = async (req, res, next) => {
  try {
    const scholarships = await prisma.scholarship.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(scholarships);
  } catch (err) {
    next(err);
  }
};

exports.getScholarshipById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
      include: { applications: true },
    });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    res.json(scholarship);
  } catch (err) {
    next(err);
  }
};

exports.createScholarship = async (req, res, next) => {
  try {
    const {
      title,
      provider,
      category = 'Central',
      amount,
      deadline,
      description,
      awardType = 'Merit Award',
      minGpa = 0,
      maxIncome = 999999999,
      states = 'All',
      majors = 'All',
      categories = 'All',
      genders = 'All',
      docsNeeded = '',
      link = '',
      country = '',
      nationality = '',
    } = req.body;

    if (!title || !provider || !deadline) {
      return res.status(400).json({ message: 'Title, provider, and deadline are required' });
    }

    const scholarship = await prisma.scholarship.create({
      data: {
        title,
        provider,
        category,
        amount: String(amount || 'Variable'),
        deadline,
        description: description || '',
        awardType,
        minGpa: parseFloat(minGpa) || 0,
        maxIncome: parseInt(maxIncome, 10) || 999999999,
        states: Array.isArray(states) ? states.join(',') : String(states),
        majors: Array.isArray(majors) ? majors.join(',') : String(majors),
        categories: Array.isArray(categories) ? categories.join(',') : String(categories),
        genders: Array.isArray(genders) ? genders.join(',') : String(genders),
        docsNeeded: Array.isArray(docsNeeded) ? docsNeeded.join(',') : String(docsNeeded),
        link,
        country,
        nationality,
        isCustom: true,
      },
    });

    res.status(201).json(scholarship);
  } catch (err) {
    next(err);
  }
};

exports.deleteScholarship = async (req, res, next) => {
  try {
    const { id } = req.params;

    const scholarship = await prisma.scholarship.findUnique({
      where: { id },
    });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    await prisma.scholarship.delete({
      where: { id },
    });

    res.json({ message: 'Scholarship deleted successfully', id });
  } catch (err) {
    next(err);
  }
};
