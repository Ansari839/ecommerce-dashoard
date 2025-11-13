import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission {
  module: string;
  actions: string[];
}

export interface IRole extends Document {
  name: string;
  permissions: IPermission[];
  createdAt: Date;
  updatedAt: Date;
}

const PermissionSchema: Schema = new Schema({
  module: {
    type: String,
    required: [true, 'Module is required'],
    trim: true
  },
  actions: [{
    type: String,
    required: [true, 'Action is required'],
    trim: true
  }]
});

const RoleSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Role name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Role name cannot exceed 50 characters']
  },
  permissions: [PermissionSchema]
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Index for faster queries by name
RoleSchema.index({ name: 1 });

export default mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);