import { formatDate } from '../utils/taskUtils'

export default function TaskCard({ task, busy, onToggle, onEdit, onDelete }) {
  return (
    <article className={`task-card ${task.completed ? 'is-completed' : ''}`}>
      <div className="task-card-content">
        <h3>{task.name}</h3>
        <p className="task-description">{task.description || 'No description provided.'}</p>
        <p className="task-created">Created {formatDate(task.createdAt)}</p>
      </div>

      <div className="task-card-side">
        <span className={`task-status ${task.completed ? 'status-completed' : 'status-pending'}`}>
          {task.completed ? 'Completed' : 'Pending'}
        </span>
        <div className="task-actions">
          <button type="button" className="text-button" onClick={() => onToggle(task)} disabled={busy}>
            {task.completed ? 'Mark pending' : 'Mark completed'}
          </button>
          <button type="button" className="text-button" onClick={() => onEdit(task)} disabled={busy}>
            Edit
          </button>
          <button type="button" className="text-button text-button-danger" onClick={() => onDelete(task)} disabled={busy}>
            Delete
          </button>
        </div>
      </div>
    </article>
  )
}
