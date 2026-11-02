import { useEffect, useState } from 'react'
import EmptyState from './components/EmptyState'
import Notice from './components/Notice'
import TaskCard from './components/TaskCard'
import TaskForm from './components/TaskForm'
import { createTask, deleteTask, getTasks, updateTask } from './services/taskApi'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [busyTaskId, setBusyTaskId] = useState(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true

    getTasks()
      .then((data) => {
        if (!active) return
        setTasks(data)
        setNotice('')
      })
      .catch((error) => {
        if (active) setNotice(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function openCreateForm() {
    setEditingTask(null)
    setFormOpen(true)
  }

  function openEditForm(task) {
    setEditingTask(task)
    setFormOpen(true)
  }

  function closeForm() {
    setEditingTask(null)
    setFormOpen(false)
  }

  async function saveTask(values) {
    try {
      const savedTask = editingTask
        ? await updateTask(editingTask._id, values)
        : await createTask(values)

      setTasks((current) => editingTask
        ? current.map((task) => task._id === savedTask._id ? savedTask : task)
        : [savedTask, ...current])
      setNotice('')
      closeForm()
      return ''
    } catch (error) {
      return error.message
    }
  }

  async function toggleTask(task) {
    setBusyTaskId(task._id)
    setNotice('')
    try {
      const updatedTask = await updateTask(task._id, { completed: !task.completed })
      setTasks((current) => current.map((item) => item._id === updatedTask._id ? updatedTask : item))
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusyTaskId(null)
    }
  }

  async function removeTask(task) {
    if (!window.confirm(`Delete "${task.name}"? This can't be undone.`)) return

    setBusyTaskId(task._id)
    setNotice('')
    try {
      await deleteTask(task._id)
      setTasks((current) => current.filter((item) => item._id !== task._id))
    } catch (error) {
      setNotice(error.message)
    } finally {
      setBusyTaskId(null)
    }
  }

  const completedCount = tasks.filter((task) => task.completed).length

  return (
    <main className="app">
      <header className="page-header">
        <div>
          <p className="page-kicker">TASK MANAGER</p>
          <h1>My tasks</h1>
          <p className="page-subtitle">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} · {completedCount} completed
          </p>
        </div>
        {!formOpen && (
          <button className="button button-primary" type="button" onClick={openCreateForm}>
            Add task
          </button>
        )}
      </header>

      <Notice message={notice} onDismiss={() => setNotice('')} />

      {formOpen && (
        <TaskForm
          key={editingTask?._id || 'new-task'}
          task={editingTask}
          onSave={saveTask}
          onCancel={closeForm}
        />
      )}

      <section className="task-section" aria-labelledby="task-list-heading">
        <div className="section-heading">
          <h2 id="task-list-heading">All tasks</h2>
          {!loading && <span className="task-count">{tasks.length}</span>}
        </div>

        {loading ? (
          <p className="loading-message" role="status">Loading tasks...</p>
        ) : tasks.length ? (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                busy={busyTaskId === task._id}
                onToggle={toggleTask}
                onEdit={openEditForm}
                onDelete={removeTask}
              />
            ))}
          </div>
        ) : (
          <EmptyState onCreateTask={openCreateForm} />
        )}
      </section>
    </main>
  )
}

export default App
