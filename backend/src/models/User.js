/* ===================================
   JANVOICE — USER MODEL
   =================================== */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    // Personal Info
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name must be at least 3 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit mobile number']
    },
    profileImage: {
      type: String,
      default: null
    },
    profileImagePublicId: {
      type: String,
      default: null
    },

    // Role & Permissions
    role: {
      type: String,
      enum: ['citizen', 'officer', 'department_admin', 'higher_authority', 'system_admin'],
      default: 'citizen'
    },
    department: {
      type: String,
      default: null
    },
    zone: {
      type: String,
      default: null
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date,
      default: null
    },

    // ✅ Two-Factor Authentication
    twoFactorEnabled: {
      type: Boolean,
      default: false
    },
    twoFactorSecret: {
      type: String,
      select: false // Hidden by default; use .select('+twoFactorSecret') to access
    },
    twoFactorBackupCodes: {
      type: [String],
      select: false
    },

    // Address (optional)
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },

    // Password Reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Email Verification
    verificationToken: String,
    verificationExpire: Date,

    // Preferences
    preferences: {
      language: { type: String, default: 'en' },
      theme: { type: String, default: 'light' },
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

// ===================================
// INDEXES
// ===================================
userSchema.index({ email: 1 })
userSchema.index({ role: 1 })
userSchema.index({ department: 1 })
userSchema.index({ isActive: 1 })

// ===================================
// VIRTUALS
// ===================================
userSchema.virtual('initials').get(function () {
  if (!this.name) return 'U'
  return this.name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
})

// ===================================
// METHODS
// ===================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    phone: this.phone,
    department: this.department,
    profileImage: this.profileImage,
    isVerified: this.isVerified,
    twoFactorEnabled: this.twoFactorEnabled,
    createdAt: this.createdAt
  }
}

// ===================================
// STATICS
// ===================================
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() })
}

userSchema.statics.countByRole = function () {
  return this.aggregate([
    { $group: { _id: '$role', count: { $sum: 1 } } }
  ])
}

module.exports = mongoose.model('User', userSchema)