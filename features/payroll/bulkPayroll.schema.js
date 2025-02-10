import mongoose from "mongoose";

const bulkPayrollSchema = new mongoose.Schema({
    status: { type: String, enum: ["Pending", "Processing", "Generated", "Failed"], default: "Pending" },
    totalRecords: { type: Number, required: true },
    successCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    period:String,
    designation:{type:mongoose.Schema.Types.ObjectId, ref:"Designation"},
    successEntries: [
        {
            empId: { type: mongoose.Schema.ObjectId, ref: "Employee" },
            payrollId: { type: mongoose.Schema.ObjectId, ref: "Payroll" }
        }
    ],
    failedEntries: [
        {
            empId: { type: mongoose.Schema.ObjectId, ref: "Employee" },
            reason: { type: String }
        }
    ]
}, { timestamps: true });

// Auto-delete records after 6 months
bulkPayrollSchema.index({ createdAt: 1 }, { expireAfterSeconds: 15552000 });

export const BulkPayroll = mongoose.model("BulkPayroll", bulkPayrollSchema);