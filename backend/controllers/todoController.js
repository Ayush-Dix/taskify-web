import Todo from '../models/Todo.js';
import { validationResult } from 'express-validator';

// @desc    Get all todos for authenticated user
// @route   GET /api/todos
// @access  Private
export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: todos.length,
            data: todos
        });
    } catch (error) {
        console.error('Get todos error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get single todo
// @route   GET /api/todos/:id
// @access  Private
export const getTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            data: todo
        });
    } catch (error) {
        console.error('Get todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Create new todo
// @route   POST /api/todos
// @access  Private
export const createTodo = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { title, description, priority, dueDate, category } = req.body;

        const todo = await Todo.create({
            title,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            category,
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Todo created successfully',
            data: todo
        });
    } catch (error) {
        console.error('Create todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Update todo
// @route   PUT /api/todos/:id
// @access  Private
export const updateTodo = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { title, description, completed, priority, dueDate, category } = req.body;

        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            {
                title,
                description,
                completed,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                category
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            message: 'Todo updated successfully',
            data: todo
        });
    } catch (error) {
        console.error('Update todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Delete todo
// @route   DELETE /api/todos/:id
// @access  Private
export const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        res.json({
            success: true,
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        console.error('Delete todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Toggle todo completion
// @route   PATCH /api/todos/:id/toggle
// @access  Private
export const toggleTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: 'Todo not found'
            });
        }

        todo.completed = !todo.completed;
        await todo.save();

        res.json({
            success: true,
            message: `Todo marked as ${todo.completed ? 'completed' : 'pending'}`,
            data: todo
        });
    } catch (error) {
        console.error('Toggle todo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// @desc    Get todo statistics
// @route   GET /api/todos/stats
// @access  Private
export const getTodoStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await Todo.aggregate([
            { $match: { user: userId } },
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$completed', true] }, 1, 0] }
                    },
                    pending: {
                        $sum: { $cond: [{ $eq: ['$completed', false] }, 1, 0] }
                    },
                    highPriority: {
                        $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] }
                    },
                    mediumPriority: {
                        $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] }
                    },
                    lowPriority: {
                        $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] }
                    }
                }
            }
        ]);

        const result = stats[0] || {
            total: 0,
            completed: 0,
            pending: 0,
            highPriority: 0,
            mediumPriority: 0,
            lowPriority: 0
        };

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get todo stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
