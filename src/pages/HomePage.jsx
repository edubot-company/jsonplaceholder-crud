export default function HomePage() {
  return (
    <div className="glass rounded-3xl px-6 py-10 shadow-xl md:px-10">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
        JSONPlaceholder Playground
      </p>
      <h1 className="mt-3 font-display text-4xl text-slate-900 md:text-5xl">
        Welcome
      </h1>
      <p className="mt-4 max-w-2xl text-base text-slate-600">
        Use the navigation to open the Posts page and try the CRUD demo.
      </p>
      <a
        className="mt-6 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        href="#/posts"
      >
        Go to posts
      </a>
    </div>
  )
}

