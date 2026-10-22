import mongoose from 'mongoose';
import { Project } from '../models/Project.js';
import { AuditLog } from '../models/AuditLog.js';

// Helper to generate guaranteed unique URL slug
const generateUniqueSlug = async (text, currentId = null) => {
  const baseSlug = (text || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '') || 'project';

  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await Project.findOne({ slug, ...(currentId ? { _id: { $ne: currentId } } : {}) });
    if (!existing) break;
    slug = `${baseSlug}-${counter++}`;
  }
  return slug;
};

// Helper to normalize array fields (technologies, features)
const normalizeStringArray = (input, fallback = []) => {
  if (Array.isArray(input)) return input.map((s) => String(s).trim()).filter(Boolean);
  if (typeof input === 'string') {
    return input
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return fallback;
};

// Public: Get all published projects (optional category filter)
export const getAllProjects = async (req, res, next) => {
  try {
    const { category, featured } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const projects = await Project.find(query).sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all projects
export const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get single project by slug or ID
export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let query = { slug, isPublished: true };

    // Support querying by direct MongoDB _id as well
    if (mongoose.isValidObjectId(slug)) {
      query = { $or: [{ slug }, { _id: slug }], isPublished: true };
    }

    let project = await Project.findOne(query);

    // Fallback: If not found and slug contains hyphens, try partial regex search on slug
    if (!project) {
      project = await Project.findOne({
        slug: new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        isPublished: true,
      });
    }

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }
    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create project
export const createProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };

    // Auto-generate unique slug
    if (!projectData.slug && projectData.title) {
      projectData.slug = await generateUniqueSlug(projectData.title);
    } else if (projectData.slug) {
      projectData.slug = await generateUniqueSlug(projectData.slug);
    }

    if (projectData.technologies) {
      projectData.technologies = normalizeStringArray(projectData.technologies, ['React', 'Node.js', 'MongoDB']);
    }
    if (projectData.features) {
      projectData.features = normalizeStringArray(projectData.features);
    }

    const project = await Project.create(projectData);

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'CREATE',
      resource: 'Project',
      resourceId: project._id,
      details: `Created project: ${project.title}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update project
export const updateProject = async (req, res, next) => {
  try {
    const updateData = { ...req.body };

    // If slug is explicitly changed or provided, ensure uniqueness
    if (updateData.slug) {
      updateData.slug = await generateUniqueSlug(updateData.slug, req.params.id);
    }

    if (updateData.technologies !== undefined) {
      updateData.technologies = normalizeStringArray(updateData.technologies, ['React', 'Node.js', 'MongoDB']);
    }
    if (updateData.features !== undefined) {
      updateData.features = normalizeStringArray(updateData.features);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'UPDATE',
      resource: 'Project',
      resourceId: project._id,
      details: `Updated project: ${project.title}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    await project.deleteOne();

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'DELETE',
      resource: 'Project',
      resourceId: req.params.id,
      details: `Deleted project: ${project.title}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
