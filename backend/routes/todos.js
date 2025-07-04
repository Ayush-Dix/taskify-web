import express from 'express';
import { body } from 'express-validator';
import {
    getTodos,
    getTodo,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodoStats
} from '../controllers/todoController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const todoValidation = [
    body('title')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title is required and must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('category')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Category cannot be more than 50 characters'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date')
];

const updateTodoValidation = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('category')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('Category cannot be more than 50 characters'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date')
];

router.use(protect);

router.get('/stats', getTodoStats);
router.get('/', getTodos);
router.get('/:id', getTodo);
router.post('/', todoValidation, createTodo);
router.put('/:id', updateTodoValidation, updateTodo);
router.delete('/:id', deleteTodo);
router.patch('/:id/toggle', toggleTodo);

export default router;
