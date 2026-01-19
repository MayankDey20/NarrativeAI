import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import passport from '../config/passport';

const router = Router();

router.post('/register', authController.register.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/logout', authenticate, authController.logout.bind(authController));
router.get('/me', authenticate, authController.getMe.bind(authController));

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  session: false 
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.CORS_ORIGIN || 'http://localhost:5173'}?error=auth_failed`
  }),
  authController.googleCallback.bind(authController)
);

export default router;
