import { Project } from '../models/Project.js';
import { AuditLog } from '../models/AuditLog.js';

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

// Public: Get single project by slug
export const getProjectBySlug = async (req, res, next) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, isPublished: true });
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
    const projectData = req.body;
    if (!projectData.slug) {
      projectData.slug = projectData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
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
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
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
