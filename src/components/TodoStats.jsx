import React from 'react';
import { useTodos } from '../context/TodoContext';

const TodoStats = () => {
    const { stats } = useTodos();

    const getCompletionPercentage = () => {
        if (stats.total === 0) return 0;
        return Math.round((stats.completed / stats.total) * 100);
    };

    return (
        <div className="todo-stats">
            <div className="stats-header">
                <h3>📊 Your Todo Statistics</h3>
            </div>

            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">📋</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.total}</div>
                        <div className="stat-label">Total Todos</div>
                    </div>
                </div>

                <div className="stat-card completed">
                    <div className="stat-icon">✅</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.completed}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                </div>

                <div className="stat-card pending">
                    <div className="stat-icon">📝</div>
                    <div className="stat-content">
                        <div className="stat-number">{stats.pending}</div>
                        <div className="stat-label">Pending</div>
                    </div>
                </div>

                <div className="stat-card progress">
                    <div className="stat-icon">📈</div>
                    <div className="stat-content">
                        <div className="stat-number">{getCompletionPercentage()}%</div>
                        <div className="stat-label">Progress</div>
                    </div>
                </div>
            </div>

            <div className="priority-stats">
                <h4>Priority Breakdown</h4>
                <div className="priority-grid">
                    <div className="priority-item high">
                        <span className="priority-icon">🔴</span>
                        <span className="priority-count">{stats.highPriority}</span>
                        <span className="priority-label">High</span>
                    </div>
                    <div className="priority-item medium">
                        <span className="priority-icon">🟡</span>
                        <span className="priority-count">{stats.mediumPriority}</span>
                        <span className="priority-label">Medium</span>
                    </div>
                    <div className="priority-item low">
                        <span className="priority-icon">🟢</span>
                        <span className="priority-count">{stats.lowPriority}</span>
                        <span className="priority-label">Low</span>
                    </div>
                </div>
            </div>

            {stats.total > 0 && (
                <div className="progress-bar-container">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${getCompletionPercentage()}%` }}
                        ></div>
                    </div>
                    <div className="progress-text">
                        {stats.completed} of {stats.total} todos completed
                    </div>
                </div>
            )}
        </div>
    );
};

export default TodoStats;
