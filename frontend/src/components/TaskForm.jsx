import { useState } from 'react'

export default function TaskForm({ task, onSave, onCancel }) {
  const [name, setName] = useState(task?.name || '')
  const [description, setDescription] = useState(task?.description || '')
  const [completed, setCompleted] = useState(task?.completed || false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    const message = await onSave({
      name: name.trim(),
      description: description.trim(),
      completed,
    })
    if (message) setError(message)
    setSaving(false)
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{task ? 'Edit task' : 'Add a task'}</h2>

      <label htmlFor="task-name">Title</label>
      <input
        id="task-name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        maxLength={200}
        placeholder="What needs to be done?"
        required
      />

      <label htmlFor="task-description">Description</label>
      <textarea
        id="task-description"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Add a few details (optional)"
      />

      {task && (
        <label className="completed-option">
          <input
            type="checkbox"
            checked={completed}
            onChange={(event) => setCompleted(event.target.checked)}
          />
          Completed
        </label>
      )}

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={saving || !name.trim()}>
          {saving ? 'Saving...' : task ? 'Save changes' : 'Add task'}
        </button>
        <button className="button button-secondary" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
