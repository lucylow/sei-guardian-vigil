// =============================================================================
// JWT AUTHENTICATION MIDDLEWARE
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/environment.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
}

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens and adds user information to the request
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid JWT token in the Authorization header'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || []
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ 
        error: 'Token expired',
        message: 'Your access token has expired. Please login again.'
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or malformed.'
      });
    } else {
      res.status(500).json({ 
        error: 'Authentication error',
        message: 'An error occurred during authentication.'
      });
    }
  }
}

/**
 * Role-based Access Control Middleware
 * Checks if the user has the required role
 */
export function requireRole(requiredRole: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please login to access this resource.'
      });
      return;
    }

    if (req.user.role !== requiredRole && req.user.role !== 'admin') {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `Role '${requiredRole}' is required to access this resource.`
      });
      return;
    }

    next();
  };
}

/**
 * Permission-based Access Control Middleware
 * Checks if the user has the required permission
 */
export function requirePermission(requiredPermission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please login to access this resource.'
      });
      return;
    }

    if (!req.user.permissions.includes(requiredPermission) && req.user.role !== 'admin') {
      res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `Permission '${requiredPermission}' is required to access this resource.`
      });
      return;
    }

    next();
  };
}

/**
 * Generate JWT Token
 * Creates a new JWT token for a user
 */
export function generateToken(user: {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
  };

  return jwt.sign(payload, env.jwtSecret);
}

/**
 * Verify JWT Token (without middleware)
 * Useful for verifying tokens in other parts of the application
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw error;
  }
}

/**
 * Refresh Token Middleware
 * Allows users to refresh their expired tokens
 */
export function refreshToken(req: Request, res: Response): void {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400).json({ 
      error: 'Refresh token required',
      message: 'Please provide a refresh token.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, env.jwtSecret) as any;
    
    // Generate new access token
    const newToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions
    });

    res.json({
      accessToken: newToken,
      expiresIn: 24 * 60 * 60 // 24 hours in seconds
    });
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid refresh token',
      message: 'The provided refresh token is invalid or expired.'
    });
  }
}

/**
 * Optional Authentication Middleware
 * Adds user information if token is present, but doesn't require it
 */
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, env.jwtSecret) as any;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        permissions: decoded.permissions || []
      };
    } catch (error) {
      // Token is invalid, but we don't fail the request
      console.warn('Invalid token provided in optional auth:', error);
    }
  }

  next();
}

/**
 * API Key Authentication Middleware
 * Alternative authentication method for API access
 */
export function authenticateApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;

  if (!apiKey) {
    res.status(401).json({ 
      error: 'API key required',
      message: 'Please provide a valid API key in the X-API-Key header.'
    });
    return;
  }

  // Validate API key (you can implement your own validation logic here)
  // For now, we'll check if it matches any of the expected API keys
  const validApiKeys = [
    env.crossmintServerApiKey,
    env.crossmintClientApiKey,
    env.hiveIntelligenceMcpApiKey
  ].filter(key => key && key.length > 0);

  if (!validApiKeys.includes(apiKey)) {
    res.status(401).json({ 
      error: 'Invalid API key',
      message: 'The provided API key is invalid or expired.'
    });
    return;
  }

  next();
}
