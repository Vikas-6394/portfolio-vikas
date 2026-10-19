import { Skill } from '../models/Skill.js';
import { AuditLog } from '../models/AuditLog.js';

// Public: Get all skills (optionally filter by category)
export const getAllSkills = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }

    const skills = await Skill.find(query).sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: skills.length,
      skills,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create skill
export const createSkill = async (req, res, next) => {
  try {
    const skill = await Skill.create(req.body);

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'CREATE',
      resource: 'Skill',
      resourceId: skill._id,
      details: `Created skill: ${skill.name}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update skill
export const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'UPDATE',
      resource: 'Skill',
      resourceId: skill._id,
      details: `Updated skill: ${skill.name}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      skill,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete skill
export const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    await skill.deleteOne();

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'DELETE',
      resource: 'Skill',
      resourceId: req.params.id,
      details: `Deleted skill: ${skill.name}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
