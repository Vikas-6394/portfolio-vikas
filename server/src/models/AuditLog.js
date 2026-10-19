import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    adminEmail: {
      type: String,
      required: true,
      default: 'system',
    },
    action: {
      type: String,
      required: true, // e.g. CREATE, UPDATE, DELETE, LOGIN
    },
    resource: {
      type: String,
      required: true, // e.g. Service, Project, Template, Skill, Enquiry
    },
    resourceId: {
      type: String,
      default: '',
    },
    details: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
