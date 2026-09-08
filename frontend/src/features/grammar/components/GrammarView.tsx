import { useGrammar } from '../hooks/useGrammar'

export function GrammarView() {
  const { lessons, selected, completed, setSelectedId, toggleCompleted } = useGrammar()
  return (
    <div className="!mx-auto !max-w-6xl !space-y-7">
      <header>
        <p className="!mb-2 !font-mono !text-xs !uppercase !tracking-[0.18em] !text-emerald-700">
          Grammar library
        </p>
        <h1 className="!mb-2 !text-5xl !font-extrabold !tracking-[-0.07em] !text-slate-900">
          Make it <span className="!font-serif !font-normal !italic !text-orange-500">click.</span>
        </h1>
        <p className="!max-w-xl !text-sm !leading-6 !text-slate-500">
          Short lessons that turn rules into sentences you can actually use.
        </p>
      </header>
      <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
        <section className="!rounded-3xl !bg-[#173f39] !p-6 !text-white sm:!p-8">
          <div className="flex items-center justify-between">
            <p className="!mb-0 !font-mono !text-xs !uppercase !tracking-[0.16em] !text-emerald-200">
              Your path
            </p>
            <span className="!rounded-full !bg-orange-300 !px-3 !py-1 !text-xs !font-bold !text-emerald-950">
              {completed.length}/{lessons.length} done
            </span>
          </div>
          <h2 className="!mb-8 !mt-10 !text-3xl !font-bold !tracking-[-0.05em] !text-white">
            One clear rule
            <br />
            <span className="!font-serif !font-normal !italic !text-orange-300">at a time.</span>
          </h2>
          <div className="!h-2 !rounded-full !bg-white/15">
            <span
              className="block !h-full !rounded-full !bg-orange-300"
              style={{ width: `${(completed.length / lessons.length) * 100}%` }}
            />
          </div>
        </section>
        <section className="!rounded-3xl !border !border-slate-200 !bg-white !p-5 !shadow-sm sm:!p-7">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="!m-0 !text-xl !font-bold !text-slate-900">Lesson library</h2>
            <span className="!text-xs !font-bold !text-slate-400">{lessons.length} lessons</span>
          </div>
          <div className="space-y-2">
            {lessons.map((lesson) => (
              <button
                className={`flex w-full items-center gap-4 !rounded-xl !p-4 !text-left ${selected.id === lesson.id ? '!bg-emerald-50' : 'hover:!bg-slate-50'}`}
                key={lesson.id}
                onClick={() => setSelectedId(lesson.id)}
              >
                <span
                  className={`grid size-9 shrink-0 place-items-center !rounded-full !font-mono !text-xs ${completed.includes(lesson.id) ? '!bg-emerald-700 !text-white' : '!bg-slate-100 !text-slate-500'}`}
                >
                  {completed.includes(lesson.id) ? '✓' : lesson.id}
                </span>
                <span className="min-w-0 flex-1">
                  <strong className="block !text-sm !text-slate-900">{lesson.title}</strong>
                  <span className="block !mt-1 !truncate !text-xs !text-slate-500">
                    {lesson.summary}
                  </span>
                </span>
                <span className="!text-xs !font-bold !text-slate-400">{lesson.time}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
      <section className="!rounded-3xl !border !border-orange-200 !bg-[#fffdf8] !p-6 sm:!p-8">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
          <div>
            <p className="!mb-2 !font-mono !text-xs !uppercase !tracking-[0.16em] !text-orange-600">
              Selected lesson · {selected.level}
            </p>
            <h2 className="!mb-2 !text-3xl !font-bold !tracking-[-0.05em] !text-slate-900">
              {selected.title}
            </h2>
            <p className="!mb-0 !max-w-xl !text-sm !leading-6 !text-slate-600">
              {selected.summary} Learn the pattern, see it in context, then test yourself with a
              quick check.
            </p>
          </div>
          <button
            className="!rounded-xl !bg-emerald-700 !px-5 !py-3 !text-sm !font-bold !text-white"
            onClick={toggleCompleted}
          >
            {completed.includes(selected.id) ? 'Completed ✓' : 'Mark as learned'}
          </button>
        </div>
      </section>
    </div>
  )
}
