const prisma = require('../utils/prismaClient');
const { uploadToDrive } = require('../utils/driveService');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { documents: true, applications: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      'name',
      'email',
      'state',
      'major',
      'academicLevel',
      'gpa',
      'familyIncome',
      'category',
      'gender',
      'expectedGraduationYear',
      'isCAPFWard',
      'careerGoals',
      'profilePicture',
    ];

    const data = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        data[field] = req.body[field];
      }
    }

    // Defensive type casting for multipart/form-data inputs
    if (data.gpa !== undefined && data.gpa !== '') {
      data.gpa = parseFloat(data.gpa);
    }
    if (data.familyIncome !== undefined && data.familyIncome !== '') {
      data.familyIncome = parseInt(String(data.familyIncome).replace(/[^0-9]/g, ''), 10) || 0;
    }
    if (data.expectedGraduationYear !== undefined && data.expectedGraduationYear !== '') {
      data.expectedGraduationYear = parseInt(data.expectedGraduationYear, 10);
    }
    if (data.isCAPFWard !== undefined) {
      data.isCAPFWard = data.isCAPFWard === 'true' || data.isCAPFWard === true;
    }

    // Handle Google Drive file upload if profile picture file was attached
    if (req.file) {
      try {
        const uploadResult = await uploadToDrive(req.file);
        // Save direct CDN URL or webViewLink
        data.profilePicture = uploadResult.directUrl || uploadResult.webViewLink;
      } catch (uploadError) {
        return res.status(500).json({ message: 'Failed to upload profile picture to Google Drive: ' + uploadError.message });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data,
    });

    const { password: _, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (err) {
    next(err);
  }
};

exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No document file provided' });
    }

    const title = req.body.title || req.file.originalname;
    const type = req.body.type || 'Certificate';

    const uploadResult = await uploadToDrive(req.file);

    const document = await prisma.document.create({
      data: {
        userId: req.user.id,
        title,
        type,
        fileUrl: uploadResult.webViewLink || uploadResult.directUrl,
        fileId: uploadResult.fileId,
        mimeType: req.file.mimetype,
        sizeBytes: req.file.size,
        verified: true,
      },
    });

    res.status(201).json(document);
  } catch (err) {
    next(err);
  }
};
