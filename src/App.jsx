import { useEffect, useMemo, useState } from 'react'

const API_BASE = 'https://jsonplaceholder.typicode.com'

const createEmptyForm = () => ({ title: '', body: '' })

function App() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(createEmptyForm)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(createEmptyForm)
  const [isCreating, setIsCreating] = useState(false)
  const [savingId, setSavingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const postCount = useMemo(() => posts.length, [posts])

  const fetchPosts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_BASE}/posts?_limit=8`)
      if (!response.ok) {
        throw new Error('Could not load posts.')
      }
      const data = await response.json()
      setPosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleCreate = async (event) => {
    event.preventDefault()
    if (!form.title.trim() || !form.body.trim()) {
      setError('Please add a title and body before creating.')
      return
    }
    setError('')
    setIsCreating(true)
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, userId: 1 }),
      })
      if (!response.ok) {
        throw new Error('Could not create the post.')
      }
      const data = await response.json()
      const newPost = {
        ...data,
        id: data.id ?? Date.now(),
      }
      setPosts((prev) => [newPost, ...prev])
      setForm(createEmptyForm())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed.')
    } finally {
      setIsCreating(false)
    }
  }

  const startEdit = (post) => {
    setEditingId(post.id)
    setEditForm({ title: post.title, body: post.body })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(createEmptyForm())
  }

  const handleUpdate = async (postId) => {
    if (!editForm.title.trim() || !editForm.body.trim()) {
      setError('Please fill in both fields before saving.')
      return
    }
    setError('')
    setSavingId(postId)
    try {
      const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editForm, userId: 1, id: postId }),
      })
      if (!response.ok) {
        throw new Error('Could not update the post.')
      }
      const data = await response.json()
      setPosts((prev) =>
        prev.map((post) => (post.id === postId ? { ...post, ...data } : post)),
      )
      cancelEdit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
    } finally {
      setSavingId(null)
    }
  }

  const handleDelete = async (postId) => {
    setError('')
    setDeletingId(postId)
    try {
      const response = await fetch(`${API_BASE}/posts/${postId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Could not delete the post.')
      }
      setPosts((prev) => prev.filter((post) => post.id !== postId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen px-5 py-10 text-slate-900 md:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="glass rounded-3xl px-6 py-8 shadow-xl md:px-10">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            JSONPlaceholder Playground
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <h1 className="font-display text-4xl text-slate-900 md:text-5xl">
              Postboard CRUD Demo
            </h1>
            <span className="rounded-full border border-orange-200 bg-orange-100 px-4 py-1 text-sm font-semibold text-orange-700">
              {postCount} posts loaded
            </span>
          </div>
          <p className="mt-4 max-w-2xl text-base text-slate-600">
            Create, update, and delete sample posts using the
            JSONPlaceholder API. Changes are mocked, so refresh to reset.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={fetchPosts}
              disabled={loading}
              type="button"
            >
              {loading ? 'Refreshing...' : 'Refresh feed'}
            </button>
            <a
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              href="https://jsonplaceholder.typicode.com"
              target="_blank"
              rel="noreferrer"
            >
              Visit API docs
            </a>
          </div>
          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_1.6fr]">
          <form
            className="glass rounded-3xl px-6 py-7 md:px-8"
            onSubmit={handleCreate}
          >
            <h2 className="font-display text-2xl text-slate-900">
              Create a post
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              This uses <span className="font-semibold text-slate-700">POST</span>{' '}
              and updates the UI optimistically.
            </p>
            <label className="mt-6 block text-sm font-semibold text-slate-700">
              Title
              <input
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="Design a travel app"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </label>
            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Body
              <textarea
                className="mt-2 min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                placeholder="List the core features, then define the vibe."
                value={form.body}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, body: event.target.value }))
                }
              />
            </label>
            <button
              className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
              type="submit"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create post'}
            </button>
          </form>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-slate-900">
                  Latest posts
                </h2>
                <p className="text-sm text-slate-500">
                  Read + update + delete flows.
                </p>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                CRUD
              </div>
            </div>

            {loading ? (
              <div className="glass rounded-3xl px-6 py-10 text-center text-slate-500">
                Loading posts...
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => {
                  const isEditing = editingId === post.id
                  return (
                    <article
                      className="glass rounded-3xl px-5 py-5 md:px-6"
                      key={post.id}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex-1">
                          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                            Post #{post.id}
                          </p>
                          {isEditing ? (
                            <input
                              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-lg font-semibold text-slate-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                              value={editForm.title}
                              onChange={(event) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  title: event.target.value,
                                }))
                              }
                            />
                          ) : (
                            <h3 className="mt-2 text-lg font-semibold text-slate-900">
                              {post.title}
                            </h3>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {isEditing ? (
                            <>
                              <button
                                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:bg-slate-500"
                                onClick={() => handleUpdate(post.id)}
                                disabled={savingId === post.id}
                                type="button"
                              >
                                {savingId === post.id ? 'Saving...' : 'Save'}
                              </button>
                              <button
                                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
                                onClick={cancelEdit}
                                type="button"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300"
                                onClick={() => startEdit(post)}
                                type="button"
                              >
                                Edit
                              </button>
                              <button
                                className="rounded-full border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:text-rose-300"
                                onClick={() => handleDelete(post.id)}
                                disabled={deletingId === post.id}
                                type="button"
                              >
                                {deletingId === post.id ? 'Deleting...' : 'Delete'}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {isEditing ? (
                        <textarea
                          className="mt-4 min-h-[120px] w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                          value={editForm.body}
                          onChange={(event) =>
                            setEditForm((prev) => ({
                              ...prev,
                              body: event.target.value,
                            }))
                          }
                        />
                      ) : (
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">
                          {post.body}
                        </p>
                      )}
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
