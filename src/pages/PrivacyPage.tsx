import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ROUTES } from '../lib/routes'
import { Heading } from '../components/ui'

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-label text-sm font-bold uppercase tracking-[0.2em] text-gold">{title}</h2>
      <div className="flex flex-col gap-2 text-sm leading-relaxed">{children}</div>
    </section>
  )
}

// UWAGA: treść jest SZKICEM (placeholder) i wymaga uzupełnienia oraz weryfikacji prawnej.
export function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10">
      <Link to={ROUTES.home} className="text-sm text-muted hover:text-white">
        ← Wróć
      </Link>
      <Heading>Polityka prywatności</Heading>
      <p className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-pale">
        Wersja robocza. Treść wymaga uzupełnienia danych administratora i weryfikacji prawnej przed publikacją.
      </p>

      <Section title="1. Administrator danych">
        <p>[UZUPEŁNIJ: nazwa firmy / imię i nazwisko, adres, NIP, e-mail kontaktowy w sprawach danych osobowych].</p>
      </Section>

      <Section title="2. Jakie dane przetwarzamy">
        <p>Adres e-mail, nazwa użytkownika, zaszyfrowane (hashowane) hasło, daty aktywacji i wygaśnięcia dostępu.</p>
        <p>
          Dane, które wprowadzasz w aplikacji: ukończone zadania i lekcje, nawyki i ich odhaczenia, wpisy dziennika
          wdzięczności, punkty XP, odznaki, zakupy w sklepie aplikacji, wiadomości do asystenta AI.
        </p>
        <p>Dane techniczne niezbędne do działania i bezpieczeństwa (np. logi logowania, próby aktywacji kodu).</p>
      </Section>

      <Section title="3. Cel i podstawa prawna">
        <p>
          Świadczenie usługi, w tym prowadzenie konta i realizacja programu — art. 6 ust. 1 lit. b RODO (umowa).
          Bezpieczeństwo i zapobieganie nadużyciom — art. 6 ust. 1 lit. f RODO (prawnie uzasadniony interes).
          [UZUPEŁNIJ: obowiązki księgowe/podatkowe, jeśli dotyczy].
        </p>
      </Section>

      <Section title="4. Odbiorcy danych">
        <p>
          Dostawca infrastruktury: Supabase (baza danych, uwierzytelnianie) — [UZUPEŁNIJ: region hostingu, umowa
          powierzenia]. Dostawca hostingu aplikacji — [UZUPEŁNIJ]. Dostawca modelu AI (jeśli korzystasz z asystenta) —
          [UZUPEŁNIJ].
        </p>
      </Section>

      <Section title="5. Okres przechowywania">
        <p>Do czasu usunięcia konta. [UZUPEŁNIJ: okresy wynikające z przepisów, kopie zapasowe].</p>
      </Section>

      <Section title="6. Twoje prawa">
        <p>
          Masz prawo dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz
          sprzeciwu. Masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych.
        </p>
        <p>
          W ustawieniach aplikacji możesz samodzielnie <strong className="text-white">pobrać swoje dane</strong> (plik
          JSON) oraz <strong className="text-white">usunąć konto wraz ze wszystkimi danymi</strong>.
        </p>
      </Section>

      <Section title="7. Pliki cookies i pamięć urządzenia">
        <p>
          Aplikacja nie używa cookies reklamowych ani analitycznych. W pamięci przeglądarki przechowywana jest sesja
          logowania oraz pliki aplikacji (tryb offline PWA). Czcionki są serwowane z naszego serwera.
        </p>
      </Section>

      <Section title="8. Kontakt">
        <p>[UZUPEŁNIJ: adres e-mail do kontaktu w sprawach prywatności].</p>
      </Section>
    </main>
  )
}
