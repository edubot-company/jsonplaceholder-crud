import { useEffect, useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import PostsPage from './pages/PostsPage.jsx'

const normalizeHashPath = (hash) => {
  const value = typeof hash === 'string' ? hash : ''
  const cleaned = value.replace(/^#/, '')
  if (!cleaned) return '/'
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

const getCurrentPath = () => normalizeHashPath(window.location.hash)

const NavLink = ({ href, isActive, children }) => (
  <a
    className={[
      'rounded-full px-4 py-2 text-sm font-semibold transition',
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-white hover:text-slate-900',
    ].join(' ')}
    href={href}
  >
    {children}
  </a>
)

function App() {
  const [path, setPath] = useState(getCurrentPath)
  useHashRouting(setPath)

  return (
    <div className="min-h-screen px-5 py-8 text-slate-900 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <SiteHeader path={path} />
        <main className="mt-8">
          <RoutedContent path={path} />
        </main>
      </div>
    </div>
  )
}

export default App

function SiteHeader({ path }) {
  const isHome = path === '/'
  const isPosts = path === '/posts'

  return (
    <header className="glass flex flex-wrap items-center justify-between gap-4 rounded-3xl px-6 py-5 shadow-xl md:px-10">
      <a className="font-display text-xl text-slate-900" href="#/">
        JSONPlaceholder CRUD
      </a>
      <nav className="flex items-center gap-2 rounded-full bg-slate-50 p-1">
        <NavLink href="#/" isActive={isHome}>
          Home
        </NavLink>
        <NavLink href="#/posts" isActive={isPosts}>
          Posts
        </NavLink>
      </nav>
    </header>
  )
}

function RoutedContent({ path }) {
  if (path === '/') return <HomePage />
  if (path === '/posts') return <PostsPage />

  return (
    <div className="glass rounded-3xl px-6 py-10 shadow-xl md:px-10">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">404</p>
      <h1 className="mt-3 font-display text-3xl text-slate-900">Page not found</h1>
      <p className="mt-4 text-base text-slate-600">
        Try going back to the Posts page.
      </p>
      <a
        className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        href="#/posts"
      >
        Go to posts
      </a>
    </div>
  )
}

function useHashRouting(setPath) {
  useEffect(() => {
    if (!window.location.hash) {
      window.location.hash = '#/'
    }

    const onChange = () => setPath(getCurrentPath())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [setPath])
}
