const mongoose = require('mongoose');

// Schema for Audit Logs (Security requirement)
const auditLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    method: String,
    path: String,
    ip: String,
    userId: String, // Optional, if authenticated
    action: String,
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
