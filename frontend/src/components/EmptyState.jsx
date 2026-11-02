export default function EmptyState({ onCreateTask }) {
  return (
    <div className="empty-state">
      <h3>No tasks yet</h3>
      <p>Add your first task and it will show up here.</p>
      <button className="button button-secondary" type="button" onClick={onCreateTask}>
        Create a task
      </button>
    </div>
  )
}
