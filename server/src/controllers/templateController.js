import { Template } from '../models/Template.js';
import { AuditLog } from '../models/AuditLog.js';

// Public: Get all published templates (with search & category filtering)
export const getAllTemplates = async (req, res, next) => {
  try {
    const { category, search, featured } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { technologies: { $regex: search, $options: 'i' } },
      ];
    }

    const templates = await Template.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all templates (published & draft)
export const getAllTemplatesAdmin = async (req, res, next) => {
  try {
    const templates = await Template.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: templates.length,
      templates,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get single template by slug
export const getTemplateBySlug = async (req, res, next) => {
  try {
    const template = await Template.findOne({ slug: req.params.slug, isPublished: true });
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }
    res.status(200).json({
      success: true,
      template,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create template
export const createTemplate = async (req, res, next) => {
  try {
    const templateData = req.body;
    if (!templateData.slug) {
      templateData.slug = templateData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const template = await Template.create(templateData);

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'CREATE',
      resource: 'Template',
      resourceId: template._id,
      details: `Created template: ${template.name}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      template,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update template
export const updateTemplate = async (req, res, next) => {
  try {
    const template = await Template.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'UPDATE',
      resource: 'Template',
      resourceId: template._id,
      details: `Updated template: ${template.name}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Template updated successfully',
      template,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete template
export const deleteTemplate = async (req, res, next) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).json({
        success: false,
        message: 'Template not found',
      });
    }

    await template.deleteOne();

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'DELETE',
      resource: 'Template',
      resourceId: req.params.id,
      details: `Deleted template: ${template.name}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Template deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
