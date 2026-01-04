import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the role
 *         name:
 *           type: string
 *           description: The name of the role
 *         description:
 *           type: string
 *           description: The description of the role
 *       example:
 *         id: 1
 *         name: Admin
 *         description: System Administrator
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management API
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: The role was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       400:
 *         description: Role already exists
 *       500:
 *         description: Server error
 */
export const createRole = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    const existingRole = await prisma.role.findUnique({ where: { name } });
    if (existingRole) {
      return res.status(400).json({ message: 'Role already exists' });
    }

    const role = await prisma.role.create({
      data: {
        name,
        description,
      },
    });

    res.status(201).json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Returns the list of all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The list of the roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       500:
 *         description: Server error
 */
export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Update a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The role id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The role was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Role'
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await prisma.role.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.json(role);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The role id
 *     responses:
 *       200:
 *         description: The role was deleted
 *       400:
 *         description: Cannot delete role assigned to users
 *       404:
 *         description: Role not found
 *       500:
 *         description: Server error
 */
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting the Admin role or roles in use could be a good check, 
    // but for now we'll stick to basic deletion.
    // Ideally check if users are assigned to this role first.
    const usersWithRole = await prisma.user.count({ where: { roleId: Number(id) } });
    if (usersWithRole > 0) {
        return res.status(400).json({ message: 'Cannot delete role assigned to users' });
    }

    await prisma.role.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
