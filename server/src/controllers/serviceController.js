import { Service } from '../models/Service.js';
import { AuditLog } from '../models/AuditLog.js';

// Public: Get all published services
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isPublished: true }).sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all services (published and unpublished)
export const getAllServicesAdmin = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ displayOrder: 1, createdAt: 1 });
    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
};

// Public: Get single service by slug
export const getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isPublished: true });
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }
    res.status(200).json({
      success: true,
      service,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create service
export const createService = async (req, res, next) => {
  try {
    const serviceData = req.body;
    if (!serviceData.slug) {
      serviceData.slug = serviceData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const service = await Service.create(serviceData);

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'CREATE',
      resource: 'Service',
      resourceId: service._id,
      details: `Created service: ${service.title}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update service
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'UPDATE',
      resource: 'Service',
      resourceId: service._id,
      details: `Updated service: ${service.title}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete service
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found',
      });
    }

    await service.deleteOne();

    await AuditLog.create({
      adminEmail: req.user.email,
      action: 'DELETE',
      resource: 'Service',
      resourceId: req.params.id,
      details: `Deleted service: ${service.title}`,
      ipAddress: req.ip,
    }).catch(() => {});

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
