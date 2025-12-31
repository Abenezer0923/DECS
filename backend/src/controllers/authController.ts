import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
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
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - roleName
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         roleName:
 *           type: string
 *         department:
 *           type: string
 */

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, roleName, department } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Find role
    const role = await prisma.role.findUnique({
      where: { name: roleName },
    });

    if (!role) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        roleId: role.id,
        department,
      },
    });

    const token = generateToken(user.id, role.name);

    res.status(201).json({ token, user: { id: user.id, username: user.username, role: role.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

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

    res.json({ token, user: { id: user.id, username: user.username, role: user.role.name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
