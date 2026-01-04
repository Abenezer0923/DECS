import { Router } from 'express';
import { createRole, getRoles, updateRole, deleteRole } from '../controllers/roleController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Only Admins can manage roles
router.post('/', authenticate, authorize(['Admin']), createRole);
router.get('/', authenticate, authorize(['Admin']), getRoles);
router.put('/:id', authenticate, authorize(['Admin']), updateRole);
router.delete('/:id', authenticate, authorize(['Admin']), deleteRole);

export default router;
