import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface JwtPayload {
  userId: string;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: '인증이 필요합니다.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'default-secret';

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ error: '유효하지 않은 토큰입니다.' });
  }
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const secret = process.env.JWT_SECRET || 'default-secret';
      const decoded = jwt.verify(token, secret) as JwtPayload;
      req.userId = decoded.userId;
    }

    next();
  } catch {
    next();
  }
}
