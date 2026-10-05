export function ConfigErrorScreen({ errors }: { errors: string[] }) {
  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-4 font-display text-3xl uppercase text-red">Błąd konfiguracji</h1>
      <p className="mb-4 text-sm text-muted">
        Aplikacja nie ma poprawnej konfiguracji środowiska. Uzupełnij plik .env.local (patrz .env.example).
      </p>
      <ul className="list-disc space-y-1 pl-5 text-sm text-text">
        {errors.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
    </main>
  )
}
