import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'No authentication token, access denied' });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
      role: string;
    };

    (req as AuthRequest).user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token verification failed, authorization denied' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as AuthRequest).user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (!roles.includes((req as AuthRequest).user!.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}; 