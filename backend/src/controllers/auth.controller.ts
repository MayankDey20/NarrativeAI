import { Request, Response } from 'express';
import authService from '../services/auth.service';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          message: 'Email, password, and name are required',
        });
      }

      const result = await authService.register({ email, password, name });

      res.status(201).json({
        success: true,
        user: result.user,
        token: result.token,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const result = await authService.login({ email, password });

      res.json({
        success: true,
        user: result.user,
        token: result.token,
      });
    } catch (error: any) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getMe(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await authService.getUserById(userId);

      res.json({
        success: true,
        user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req: Request, res: Response) {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  async googleCallback(req: Request, res: Response) {
    try {
      const user = req.user as any;
      if (!user) {
        return res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}?error=auth_failed`);
      }

      const token = authService.generateToken(user.id);
      
      // Redirect to frontend with token
      res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: user.id, email: user.email, name: user.name }))}`);
    } catch (error: any) {
      res.redirect(`${process.env.CORS_ORIGIN || 'http://localhost:5173'}?error=auth_failed`);
    }
  }
}

export default new AuthController();
