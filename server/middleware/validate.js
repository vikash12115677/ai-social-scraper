const { body, query, param, validationResult } = require('express-validator');

// Helper to handle validation results
const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      await validation.run(req);
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map(e => ({ field: e.path, message: e.msg })),
      });
    }
    next();
  };
};

const registerValidation = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

const postQueryValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('platform').optional().isIn(['twitter', 'reddit', 'youtube', 'linkedin', 'instagram', 'facebook', 'tiktok']),
  query('sentiment').optional().isIn(['positive', 'negative', 'neutral']),
];

module.exports = { validate, registerValidation, loginValidation, postQueryValidation };
