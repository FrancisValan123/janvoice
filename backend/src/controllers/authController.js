/* ===================================
   JANVOICE — AUTH CONTROLLER
   =================================== */

const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const speakeasy = require('speakeasy')
const QRCode = require('qrcode')
const User = require('../models/User')
const { generateAccessToken } = require('../config/jwt')
const { sendEmail, emailTemplates } = require('../config/email')
const { HTTP_STATUS } = require('../config/constants')

// ===================================
// REGISTER
// ===================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'citizen' } = req.body

    if (!name || !email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide name, email, and password'
      })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'An account with this email already exists'
      })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone: phone || '',
      role,
      isActive: true,
      isVerified: false
    })

    const token = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role
    })

    sendEmail({
      to: user.email,
      subject: 'Welcome to JanVoice! 🇮🇳',
      html: emailTemplates.welcome(user.name)
    }).catch((err) => console.error('Welcome email failed:', err.message))

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isVerified: user.isVerified,
        twoFactorEnabled: false,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Registration failed. Please try again.'
    })
  }
}

// ===================================
// LOGIN (Now checks for 2FA)
// ===================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide email and password'
      })
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password')

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    if (!user.isActive) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Your account has been deactivated.'
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid email or password'
      })
    }

    // ✅ If 2FA is enabled, DON'T issue token yet — ask for the code
    if (user.twoFactorEnabled) {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        requiresTwoFA: true,
        userId: user._id,
        email: user.email,
        message: 'Please enter the 6-digit code from your authenticator app'
      })
    }

    // Otherwise, proceed with normal login
    user.lastLogin = new Date()
    await user.save()

    const token = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Login failed. Please try again.'
    })
  }
}

// ===================================
// VERIFY 2FA DURING LOGIN (Completes the login)
// POST /api/auth/2fa/login
// Body: { userId, token }
// ===================================
exports.verifyTwoFALogin = async (req, res) => {
  try {
    const { userId, token: code, backupCode } = req.body

    if (!userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'User ID is required'
      })
    }

    const user = await User.findById(userId)
      .select('+twoFactorSecret +twoFactorBackupCodes')

    if (!user || !user.twoFactorEnabled) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid 2FA request'
      })
    }

    let verified = false

    // ✅ Check if user provided a backup code
    if (backupCode) {
      const codeUpper = backupCode.trim().toUpperCase()
      const codeIndex = user.twoFactorBackupCodes.indexOf(codeUpper)
      if (codeIndex !== -1) {
        verified = true
        // Remove used backup code
        user.twoFactorBackupCodes.splice(codeIndex, 1)
      }
    } else if (code) {
      // ✅ Verify TOTP code
      verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: code,
        window: 1
      })
    }

    if (!verified) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Invalid or expired code. Please try again.'
      })
    }

    user.lastLogin = new Date()
    await user.save()

    const accessToken = generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role
    })

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Login successful',
      token: accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled
      }
    })
  } catch (error) {
    console.error('Verify 2FA login error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to verify 2FA'
    })
  }
}

// ===================================
// 2FA — SETUP (Generate QR code + secret)
// GET /api/auth/2fa/setup
// ===================================
exports.setupTwoFA = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    if (user.twoFactorEnabled) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: '2FA is already enabled. Disable it first to reconfigure.'
      })
    }

    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `JanVoice (${user.email})`,
      issuer: 'JanVoice',
      length: 32
    })

    // Save secret temporarily (not yet enabled)
    user.twoFactorSecret = secret.base32
    await user.save()

    // Generate QR code as a data URL
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url)

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Scan the QR code with Google Authenticator',
      qrCode: qrCodeUrl,
      secret: secret.base32
    })
  } catch (error) {
    console.error('Setup 2FA error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to set up 2FA'
    })
  }
}

// ===================================
// 2FA — VERIFY & ENABLE
// POST /api/auth/2fa/verify
// Body: { token: '123456' }
// ===================================
exports.verifyTwoFA = async (req, res) => {
  try {
    const { token } = req.body

    if (!token || token.length !== 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please provide a valid 6-digit code'
      })
    }

    const userId = req.user._id || req.user.id
    const user = await User.findById(userId).select('+twoFactorSecret')

    if (!user || !user.twoFactorSecret) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Please set up 2FA first'
      })
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
      window: 1
    })

    if (!verified) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired code. Please try again.'
      })
    }

    // Generate 8 backup codes
    const backupCodes = []
    for (let i = 0; i < 8; i++) {
      backupCodes.push(
        Math.random().toString(36).substring(2, 10).toUpperCase()
      )
    }

    user.twoFactorEnabled = true
    user.twoFactorBackupCodes = backupCodes
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes
    })
  } catch (error) {
    console.error('Verify 2FA error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to verify 2FA'
    })
  }
}

// ===================================
// 2FA — DISABLE
// POST /api/auth/2fa/disable
// ===================================
exports.disableTwoFA = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id
    const user = await User.findById(userId)

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    user.twoFactorEnabled = false
    user.twoFactorSecret = undefined
    user.twoFactorBackupCodes = undefined
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: '2FA disabled successfully'
    })
  } catch (error) {
    console.error('Disable 2FA error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to disable 2FA'
    })
  }
}

// ===================================
// GET ME
// ===================================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Get me error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Failed to fetch user'
    })
  }
}

// ===================================
// LOGOUT
// ===================================
exports.logout = async (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully'
  })
}

// ===================================
// FORGOT PASSWORD
// ===================================
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Email is required'
      })
    }

    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'If this email is registered, you will receive a reset link'
      })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')

    user.resetPasswordToken = hashedToken
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000
    await user.save()

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`

    try {
      await sendEmail({
        to: user.email,
        subject: '🔑 Reset Your JanVoice Password',
        html: emailTemplates.passwordReset(user.name, resetLink)
      })

      res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Password reset link sent to your email'
      })
    } catch (emailError) {
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined
      await user.save()

      console.error('Email send failed:', emailError.message)
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        success: false,
        message: 'Email could not be sent. Please try again later.'
      })
    }
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Request failed. Please try again.'
    })
  }
}

// ===================================
// VERIFY RESET TOKEN
// ===================================
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      email: user.email
    })
  } catch (error) {
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Verification failed'
    })
  }
}

// ===================================
// RESET PASSWORD
// ===================================
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Token and new password are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password reset successful. You can now login.'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Reset failed. Please try again.'
    })
  }
}

// ===================================
// UPDATE PROFILE
// ===================================
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body

    const updates = {}
    if (name) updates.name = name.trim()
    if (phone) updates.phone = phone
    if (address) updates.address = address

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true
    }).select('-password')

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: 'User not found'
      })
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Update failed. Please try again.'
    })
  }
}

// ===================================
// CHANGE PASSWORD
// ===================================
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Current and new passwords are required'
      })
    }

    if (newPassword.length < 6) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'New password must be at least 6 characters'
      })
    }

    const user = await User.findById(req.user.id).select('+password')

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: 'Current password is incorrect'
      })
    }

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(newPassword, salt)
    await user.save()

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password changed successfully'
    })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(HTTP_STATUS.SERVER_ERROR).json({
      success: false,
      message: 'Password change failed'
    })
  }
}