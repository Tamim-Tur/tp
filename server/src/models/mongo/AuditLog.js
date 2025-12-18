const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    method: String,
    path: String,
    ip: String,
    userId: String, 
    action: String,
    severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
