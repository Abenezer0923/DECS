import { Request, Response } from 'express';
import { WorkflowService } from '../services/workflowService';
import { AuthRequest } from '../middlewares/authMiddleware';
import { AppError } from '../middlewares/errorHandler';

export const approveCommunication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approved, comments } = req.body;
    const userId = (req as AuthRequest).user?.id;
    const userRole = (req as AuthRequest).user?.role;

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    // Check if user has approval permission
    const approvalRoles = ['Admin', 'Board', 'Communication'];
    if (!approvalRoles.includes(userRole)) {
      throw new AppError(403, 'You do not have permission to approve communications');
    }

    const result = await WorkflowService.approveCommunicationAction(
      Number(id),
      userId,
      approved,
      comments
    );

    res.json({
      message: approved ? 'Communication approved' : 'Communication rejected',
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(400, error.message);
    }
    throw error;
  }
};

export const validateMilestoneTransition = async (req: Request, res: Response) => {
  try {
    const { currentStatus, newStatus } = req.body;

    const isValid = WorkflowService.isValidStatusTransition(currentStatus, newStatus);

    res.json({
      valid: isValid,
      message: isValid
        ? 'Status transition is valid'
        : `Cannot transition from ${currentStatus} to ${newStatus}`,
    });
  } catch (error) {
    throw new AppError(400, 'Invalid status values');
  }
};

export const checkCircularDependency = async (req: Request, res: Response) => {
  try {
    const { predecessorId, successorId } = req.body;

    const hasCircular = await WorkflowService.detectCircularDependency(
      Number(predecessorId),
      Number(successorId)
    );

    res.json({
      hasCircularDependency: hasCircular,
      message: hasCircular
        ? 'Circular dependency detected - this relationship would create a loop'
        : 'No circular dependency detected',
    });
  } catch (error) {
    throw new AppError(400, 'Failed to check circular dependency');
  }
};

export const validateStatutoryChange = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const userId = (req as AuthRequest).user?.id;
    const userRole = (req as AuthRequest).user?.role;

    if (!userId) {
      throw new AppError(401, 'Unauthorized');
    }

    const validation = await WorkflowService.validateStatutoryDateChange(
      Number(milestoneId),
      userId,
      userRole
    );

    res.json(validation);
  } catch (error) {
    throw new AppError(400, 'Failed to validate statutory change');
  }
};
