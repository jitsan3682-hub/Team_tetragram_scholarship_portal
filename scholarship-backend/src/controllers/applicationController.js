const prisma = require('../utils/prismaClient');

exports.submitApplication = async (req, res, next) => {
  try {
    const { scholarshipId, sopText, lorUrl, documents } = req.body;

    if (!scholarshipId) {
      return res.status(400).json({ message: 'scholarshipId is required' });
    }

    // Check if scholarship exists
    const scholarship = await prisma.scholarship.findUnique({
      where: { id: scholarshipId },
    });

    if (!scholarship) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }

    // Check if student already applied
    const existing = await prisma.application.findFirst({
      where: {
        userId: req.user.id,
        scholarshipId,
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'You have already applied for this scholarship' });
    }

    const application = await prisma.application.create({
      data: {
        userId: req.user.id,
        scholarshipId,
        sopText: sopText || '',
        lorUrl: lorUrl || '',
        documents: Array.isArray(documents) ? JSON.stringify(documents) : String(documents || ''),
        status: 'Submitted',
      },
      include: {
        scholarship: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            state: true,
            major: true,
            gpa: true,
          },
        },
      },
    });

    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { scholarship: true },
      orderBy: { appliedDate: 'desc' },
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await prisma.application.findMany({
      include: {
        scholarship: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            state: true,
            major: true,
            gpa: true,
            familyIncome: true,
            category: true,
            gender: true,
          },
        },
      },
      orderBy: { appliedDate: 'desc' },
    });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Awarded', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const application = await prisma.application.update({
      where: { id },
      data: { status },
      include: { scholarship: true, user: true },
    });

    res.json(application);
  } catch (err) {
    next(err);
  }
};

exports.withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id },
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Only owner or admin can delete
    if (application.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to withdraw this application' });
    }

    await prisma.application.delete({
      where: { id },
    });

    res.json({ message: 'Application successfully withdrawn', id });
  } catch (err) {
    next(err);
  }
};
