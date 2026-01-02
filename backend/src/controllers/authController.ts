import { Request, Response } from 'express';
import { PrismaClient, AuditAction } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 */

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id, user.role.name);

    // Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        entityTable: 'users',
        entityId: 0, // 0 or some indicator for login
        action: AuditAction.ACCESS,
        newValues: { event: 'LOGIN_SUCCESS', ip: req.ip },
      },
    });

    res.json({ token, user: { id: user.id, username: user.username, role: user.role.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
