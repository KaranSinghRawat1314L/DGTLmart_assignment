import axios from 'axios'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

async function request(config) {
  try {
    const response = await api.request(config)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Could not reach the server. Check that the backend is running.', { cause: error })
      }
      throw new Error(error.response.data?.message || 'Something went wrong. Please try again.', { cause: error })
    }

    throw error
  }
}

export async function getTasks() {
  const tasks = await request({ method: 'GET', url: '/view' })
  if (!Array.isArray(tasks)) {
    throw new Error('The server returned an unexpected task list.')
  }
  return tasks
}

export function createTask(values) {
  return request({
    method: 'POST',
    url: '/add',
    data: values,
  })
}

export function updateTask(id, values) {
  return request({
    method: 'PUT',
    url: `/edit/${encodeURIComponent(id)}`,
    data: values,
  })
}

export function deleteTask(id) {
  return request({
    method: 'DELETE',
    url: `/delete/${encodeURIComponent(id)}`,
  })
}
