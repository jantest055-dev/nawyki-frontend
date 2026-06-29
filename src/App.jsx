import { useState, useEffect, useRef } from "react";

const LESSONS = [
  { id:1,  title:"Fundament Dyscypliny",    icon:"⚡", xp:20, tag:"PODSTAWY",
    content:"Dyscyplina to nie motywacja. Motywacja to uczucie — pojawia się i znika. Dyscyplina to system, który działa nawet gdy nie masz ochoty. Wojownik nie pyta siebie czy chce trenować. On po prostu trenuje.",
    question:"Czym różni się dyscyplina od motywacji?",
    answers:[{text:"Motywacja jest trwała, dyscyplina chwilowa",correct:false},{text:"Dyscyplina to system, motywacja to uczucie",correct:true},{text:"Są tym samym",correct:false},{text:"Dyscyplina wymaga motywacji",correct:false}]},
  { id:2,  title:"Zasada 1%",               icon:"📈", xp:20, tag:"WZROST",
    content:"Poprawa o 1% dziennie to 37× lepszy wynik po roku. Nie szukaj wielkich skoków. Szukaj małych, konsekwentnych działań. Codziennie trochę lepiej — to jedyna strategia, która naprawdę działa długoterminowo.",
    question:"O ile jesteś lepszy po roku poprawiając się o 1% dziennie?",
    answers:[{text:"3,65×",correct:false},{text:"10×",correct:false},{text:"37×",correct:true},{text:"100×",correct:false}]},
  { id:3,  title:"Zimny Prysznic",          icon:"🧊", xp:25, tag:"HARTOWANIE",
    content:"Zimny prysznic to codzienna walka z własnym komfortem. Twój umysł krzyczy 'nie' — a Ty wchodzisz. To trenuje wolę. Każde zwycięstwo nad sobą rano ustawia mentalność na cały dzień.",
    question:"Jaki jest główny cel zimnego prysznica?",
    answers:[{text:"Poprawa metabolizmu",correct:false},{text:"Trening woli przez dyskomfort",correct:true},{text:"Oszczędność wody",correct:false},{text:"Lepszy sen",correct:false}]},
  { id:4,  title:"System vs Cel",           icon:"🎯", xp:30, tag:"STRATEGIA",
    content:"Cele mówią gdzie chcesz być. Systemy mówią jak tam dotrzeć. Skupianie się tylko na celu prowadzi do frustracji. Skupianie się na systemie — na codziennych działaniach — prowadzi do wyniku.",
    question:"Na czym powinien skupiać się wojownik?",
    answers:[{text:"Na wielkich celach",correct:false},{text:"Na codziennym systemie działań",correct:true},{text:"Na motywacji",correct:false},{text:"Na rezultatach innych",correct:false}]},
  { id:5,  title:"Tożsamość Wojownika",     icon:"🔥", xp:35, tag:"MINDSET",
    content:"Nie mówisz 'próbuję ćwiczyć'. Mówisz 'jestem osobą która ćwiczy'. Tożsamość kształtuje zachowanie. Zacznij myśleć o sobie jak o wojowniku — a zaczniesz działać jak wojownik.",
    question:"Dlaczego tożsamość jest kluczowa?",
    answers:[{text:"Wpływa jak nas widzą inni",correct:false},{text:"Tożsamość kształtuje zachowanie",correct:true},{text:"Pomaga wyznaczać cele",correct:false},{text:"Nie jest ważna",correct:false}]},
  { id:6,  title:"Poranny Rytuał",          icon:"🌅", xp:30, tag:"RUTYNA",
    content:"Pierwsze 60 minut dnia to fundament wszystkiego. Nie sprawdzaj telefonu. Wstań, wytrzyj twarz zimną wodą, rozciągnij się, zaplanuj 3 priorytety. Kto kontroluje ranek — kontroluje dzień.",
    question:"Co powinno być pierwszą czynnością po przebudzeniu?",
    answers:[{text:"Sprawdzenie telefonu",correct:false},{text:"Budowanie ciała i planu — nie ekran",correct:true},{text:"Zjedzenie śniadania",correct:false},{text:"Sprawdzenie powiadomień",correct:false}]},
  { id:7,  title:"Sen jako Broń",           icon:"😴", xp:25, tag:"REGENERACJA",
    content:"Sen to nie lenistwo — to broń. 7-9 godzin snu zwiększa siłę, koncentrację i odporność na stres. Wojownicy historycznie sypiali przed bitwą. Twoja 'bitwa' to każdy dzień. Dbaj o sen jak o trening.",
    question:"Ile godzin snu optymalizuje wydajność?",
    answers:[{text:"4-5h",correct:false},{text:"6h",correct:false},{text:"7-9h",correct:true},{text:"10h+",correct:false}]},
  { id:8,  title:"Eliminacja Rozproszenia", icon:"📵", xp:35, tag:"FOKUS",
    content:"Twoja uwaga to waluta. Aplikacje, powiadomienia, social media — kradną ją bez pytania. Wyłącz powiadomienia, usuń aplikacje z ekranu głównego, wyznacz konkretne godziny na telefon.",
    question:"Czym jest Twoja uwaga w kontekście produktywności?",
    answers:[{text:"Czymś co możesz dzielić",correct:false},{text:"Walutą — ograniczonym zasobem",correct:true},{text:"Nieograniczonym zasobem",correct:false},{text:"Czymś mało ważnym",correct:false}]},
  { id:9,  title:"Zasada 2 Minut",          icon:"⏱️", xp:20, tag:"PRODUKTYWNOŚĆ",
    content:"Jeśli coś zajmuje mniej niż 2 minuty — zrób to teraz. Odkładanie małych zadań tworzy mentalny bałagan. Każde niewykonane zadanie zajmuje przestrzeń w głowie. Czyść bieżąco.",
    question:"Co robić z zadaniem które zajmie mniej niż 2 minuty?",
    answers:[{text:"Dodać do listy TODO",correct:false},{text:"Zrobić natychmiast",correct:true},{text:"Zaplanować na jutro",correct:false},{text:"Ocenić czy warto",correct:false}]},
  { id:10, title:"Prawo Momentum",          icon:"🚀", xp:40, tag:"MOMENTUM",
    content:"Ciało w spoczynku pozostaje w spoczynku. Ciało w ruchu pozostaje w ruchu. Najtrudniejszy moment to start. Gdy już zaczniesz — momentum pracuje za Ciebie. Kluczem jest pierwsze działanie, nie perfekcja.",
    question:"Co jest najtrudniejsze według zasady momentum?",
    answers:[{text:"Utrzymanie tempa",correct:false},{text:"Sam start — pierwsze działanie",correct:true},{text:"Zakończenie zadania",correct:false},{text:"Planowanie",correct:false}]},
  { id:11, title:"Siła Nawyku",             icon:"🔗", xp:25, tag:"NAWYKI",
    content:"Nawyk składa się z trzech elementów: wskazówki, rutyny i nagrody. Chcesz zbudować nowy nawyk? Przypisz go do istniejącego działania. 'Po porannej kawie — 10 pompek.' Ta metoda skraca czas budowania nawyku o połowę.",
    question:"Z jakich trzech elementów składa się nawyk?",
    answers:[{text:"Cel, plan, wykonanie",correct:false},{text:"Wskazówka, rutyna, nagroda",correct:true},{text:"Motywacja, działanie, wynik",correct:false},{text:"Myśl, emocja, czyn",correct:false}]},
  { id:12, title:"Głęboka Praca",           icon:"🧠", xp:35, tag:"FOKUS",
    content:"Cal Newport udowodnił, że głęboka praca — skupiona, bez rozproszenia, przez 90+ minut — to najpotężniejsza umiejętność XXI wieku. Większość ludzi jej nie praktykuje. Ci którzy ją opanują — wygrają.",
    question:"Jak długo powinna trwać sesja głębokiej pracy?",
    answers:[{text:"15-30 minut",correct:false},{text:"45-60 minut",correct:false},{text:"90+ minut",correct:true},{text:"Dowolnie długo",correct:false}]},
  { id:13, title:"Oddech Wojownika",        icon:"💨", xp:20, tag:"HARTOWANIE",
    content:"Technika oddechowa Wima Hofa: 30 głębokich oddechów, zatrzymanie oddechu, powolny wydech. Obniża kortyzol, zwiększa koncentrację i odporność na zimno. 5 minut dziennie zmienia biochemię ciała.",
    question:"Jaki jest główny efekt technik oddechowych stosowanych regularnie?",
    answers:[{text:"Szybszy metabolizm",correct:false},{text:"Obniżenie kortyzolu i poprawa koncentracji",correct:true},{text:"Lepszy wzrok",correct:false},{text:"Więcej energii wyłącznie podczas ćwiczeń",correct:false}]},
  { id:14, title:"Stoicyzm w Działaniu",    icon:"🏛️", xp:30, tag:"MINDSET",
    content:"Marek Aureliusz, cesarz Rzymu, codziennie rano pytał siebie: 'Co jest w mojej kontroli?' Pogoda — nie. Opinie innych — nie. Twoje działania — TAK. Stoicy nie tracili energii na to czego nie mogli zmienić. Ty też nie powinieneś.",
    question:"Na czym skupiali się stoicy według ich filozofii?",
    answers:[{text:"Na przyszłych celach",correct:false},{text:"Na opiniach innych",correct:false},{text:"Wyłącznie na tym co jest w ich kontroli",correct:true},{text:"Na unikaniu trudnych emocji",correct:false}]},
  { id:15, title:"Wdzięczność jako Siła",   icon:"🙏", xp:20, tag:"UMYSŁ",
    content:"Badania Harvarda pokazują, że codzienne zapisywanie 3 rzeczy za które jesteś wdzięczny — przez 21 dni — trwale zmienia chemię mózgu. Wdzięczność nie jest słabością. To strategia przeprogramowania głowy na sukces.",
    question:"Ile dni codziennej wdzięczności potrzeba do trwałej zmiany nastawienia?",
    answers:[{text:"7 dni",correct:false},{text:"14 dni",correct:false},{text:"21 dni",correct:true},{text:"90 dni",correct:false}]},
  { id:16, title:"Zasada Pareto",           icon:"📊", xp:30, tag:"STRATEGIA",
    content:"20% działań przynosi 80% wyników. Które 20% Twoich zadań tworzy 80% wartości? Wiesz co to jest — i wiesz też że unikasz tego bo jest trudne. Wojownik robi trudne rzeczy najpierw. Reszta to szum.",
    question:"Co mówi zasada Pareto w kontekście produktywności?",
    answers:[{text:"Wszystkie zadania są równie ważne",correct:false},{text:"20% działań przynosi 80% wyników",correct:true},{text:"Należy pracować 20% więcej",correct:false},{text:"80% czasu poświęcać na planowanie",correct:false}]},
  { id:17, title:"Ból jako Informacja",     icon:"⚔️", xp:35, tag:"HARTOWANIE",
    content:"Ból fizyczny podczas treningu to sygnał — nie wróg. Informuje o granicy możliwości. Przekraczanie jej stopniowo to jedyna droga do wzrostu. Diskomfort psychiczny — strach, wstyd, niepewność — też jest informacją. Nie uciekaj. Stań twarzą w twarz.",
    question:"Jak wojownik powinien traktować dyskomfort?",
    answers:[{text:"Unikać go w każdej sytuacji",correct:false},{text:"Jako informację i sygnał do wzrostu",correct:true},{text:"Ignorować go całkowicie",correct:false},{text:"Uznać za znak że coś jest nie tak",correct:false}]},
  { id:18, title:"Zarządzanie Energią",     icon:"🔋", xp:25, tag:"PRODUKTYWNOŚĆ",
    content:"Zarządzaj energią, nie czasem. Masz 24 godziny jak wszyscy — ale Twoja energia jest falująca. Rano — praca kreatywna i ważne decyzje. Po południu — spotkania i rutyna. Wieczór — regeneracja. Ignorowanie rytmu biologicznego kosztuje Cię 30% wydajności.",
    question:"Kiedy najlepiej wykonywać pracę kreatywną i ważne decyzje?",
    answers:[{text:"Wieczorem gdy jest cisza",correct:false},{text:"Rano, gdy energia jest najwyższa",correct:true},{text:"Po południu po przerwie obiadowej",correct:false},{text:"Nie ma znaczenia — energia jest stała",correct:false}]},
  { id:19, title:"Siła Nie",               icon:"🚫", xp:30, tag:"STRATEGIA",
    content:"Warren Buffett powiedział: 'Różnica między ludźmi sukcesu a bardzo dużymi sukcesami polega na tym, że ci drudzy mówią NIE niemal na wszystko.' Każde TAK to NIE dla czegoś ważniejszego. Chroń swój czas jak skarb.",
    question:"Co Warren Buffett uważa za cechę wyróżniającą największe sukcesy?",
    answers:[{text:"Ciężką pracę 24/7",correct:false},{text:"Umiejętność mówienia NIE niemal na wszystko",correct:true},{text:"Inwestowanie od młodości",correct:false},{text:"Szeroką sieć kontaktów",correct:false}]},
  { id:20, title:"Wizualizacja Wyników",    icon:"🎬", xp:25, tag:"MINDSET",
    content:"Olimpijczycy wizualizują każdy ruch zanim wejdą na arenę. Mózg nie rozróżnia wyraźnie między vivid wizualizacją a rzeczywistością — aktywuje te same obszary. 5 minut dziennie mentalnego treningu realnie poprawia wyniki fizyczne i psychiczne.",
    question:"Dlaczego wizualizacja działa na mózg?",
    answers:[{text:"Bo jest formą modlitwy",correct:false},{text:"Mózg aktywuje te same obszary co przy realnym działaniu",correct:true},{text:"Bo poprawia wzrok",correct:false},{text:"Nie działa — to mit",correct:false}]},
  { id:21, title:"Reguła 5 Sekund",        icon:"5️⃣", xp:20, tag:"DZIAŁANIE",
    content:"Mel Robbins odkryła: gdy masz impuls do działania — odlicz 5-4-3-2-1 i działaj zanim mózg zacznie sabotaż. Mózg ma 5 sekund zanim uruchomi mechanizmy obronne. Ta prosta technika pokonuje prokrastynację, lęk i paraliż decyzji.",
    question:"Na czym polega reguła 5 sekund Mel Robbins?",
    answers:[{text:"Na 5 minutach planowania przed działaniem",correct:false},{text:"Na odliczeniu 5-4-3-2-1 i natychmiastowym działaniu",correct:true},{text:"Na robieniu 5 zadań rano",correct:false},{text:"Na 5 głębokich oddechach",correct:false}]},
  { id:22, title:"Żelazna Wola",           icon:"🦾", xp:40, tag:"SIŁA",
    content:"David Goggins — Navy SEAL, ultramaratończyk — twierdzi że docieramy do 40% możliwości gdy myślimy że jesteśmy skończeni. Reszta 60% to rezerwa chroniona przez umysł. Gdy ciało mówi stop — to jest dopiero połowa drogi.",
    question:"Ile procent swoich możliwości według Gogginsa używamy gdy myślimy że jesteśmy skończeni?",
    answers:[{text:"100%",correct:false},{text:"70%",correct:false},{text:"40%",correct:true},{text:"20%",correct:false}]},
  { id:23, title:"Cierpliwość Wojownika",  icon:"⏳", xp:30, tag:"MINDSET",
    content:"Bambus przez 5 lat rośnie pod ziemią, niewidoczny. Potem w 6 tygodni wyrasta 30 metrów. Twoja praca też tak wygląda. Kiedy nic nie widać — korzeń rośnie. Nie porzucaj procesu tylko dlatego że nie widzisz jeszcze efektów.",
    question:"Co symbolizuje bambus w kontekście budowania dyscypliny?",
    answers:[{text:"Elastyczność pod presją",correct:false},{text:"Wzrost niewidoczny na początku, potem gwałtowny",correct:true},{text:"Siłę przy małej masie",correct:false},{text:"Zdolność do szybkiej regeneracji",correct:false}]},
  { id:24, title:"Moc Środowiska",         icon:"🏠", xp:25, tag:"NAWYKI",
    content:"James Clear udowodnił: łatwiej zmienić środowisko niż wolę. Chcesz jeść zdrowiej — wyrzuć śmieciowe jedzenie. Chcesz ćwiczyć rano — przygotuj strój wieczorem. Projektuj otoczenie tak by dobre wybory były najłatwiejszą opcją.",
    question:"Co jest skuteczniejsze według Jamesa Cleara — zmiana woli czy środowiska?",
    answers:[{text:"Zmiana woli przez afirmacje",correct:false},{text:"Zmiana środowiska — projektowanie otoczenia",correct:true},{text:"Obie są równie skuteczne",correct:false},{text:"Żadna — liczy się tylko motywacja",correct:false}]},
  { id:25, title:"Protokół Zimna",         icon:"❄️", xp:30, tag:"HARTOWANIE",
    content:"Andrew Huberman zaleca 11 minut zimnej ekspozycji tygodniowo — podzielonych na 2-4 sesje. Efekty: wzrost dopaminy o 250%, poprawa nastroju, zwiększona odporność na stres. Nie chodzi o rekord — chodzi o regularność.",
    question:"Ile minut zimnej ekspozycji tygodniowo zaleca protokół Hubermana?",
    answers:[{text:"5 minut",correct:false},{text:"11 minut",correct:true},{text:"20 minut",correct:false},{text:"30 minut",correct:false}]},
  { id:26, title:"Błąd Perfekcjonizmu",    icon:"🎯", xp:25, tag:"DZIAŁANIE",
    content:"Perfekcjonizm to prokrastynacja w przebraniu. Czekasz na idealny moment, idealny plan, idealne warunki — które nigdy nie nadejdą. 80% zrobione i wysłane bije 100% zaplanowane i niewykonane zawsze. Zacznij niedoskonale. Poprawiaj w ruchu.",
    question:"Czym jest perfekcjonizm w kontekście działania?",
    answers:[{text:"Standardem jakości",correct:false},{text:"Prokrastynacją w przebraniu",correct:true},{text:"Cechą najlepszych",correct:false},{text:"Narzędziem sukcesu",correct:false}]},
  { id:27, title:"Moc Rytuałów",           icon:"🕯️", xp:30, tag:"RUTYNA",
    content:"Rituały sygnalizują mózgowi zmianę stanu. Przed treningiem — ta sama muzyka. Przed pracą — ta sama kawa, ta sama pozycja. Rituał nie jest przesądem — to wyzwalacz neurochemiczny który aktywuje fokus i gotowość na automatycznym pilocie.",
    question:"Jaką rolę pełnią rytuały przed działaniem?",
    answers:[{text:"Są tylko przyzwyczajeniem bez wartości",correct:false},{text:"Są wyzwalaczem neurochemicznym aktywującym fokus",correct:true},{text:"Zmniejszają lęk przez relaksację",correct:false},{text:"Pomagają wyłącznie w sporcie",correct:false}]},
  { id:28, title:"Cztery Umowy",           icon:"📜", xp:25, tag:"MINDSET",
    content:"Don Miguel Ruiz: 1. Bądź nieskazitelny w słowach. 2. Nic nie bierz do siebie. 3. Nie zakładaj z góry. 4. Zawsze rób co w Twojej mocy. Te cztery zasady, stosowane codziennie, eliminują 90% wewnętrznych konfliktów i zewnętrznych dramatów.",
    question:"Która z Czterech Umów mówi o niebraniu rzeczy personalnie?",
    answers:[{text:"Pierwsza",correct:false},{text:"Druga",correct:true},{text:"Trzecia",correct:false},{text:"Czwarta",correct:false}]},
  { id:29, title:"Zasada Kontrastu",       icon:"☯️", xp:30, tag:"WZROST",
    content:"Wzrost wymaga dyskomfortu — ale też regeneracji. Trening bez odpoczynku to przetrenowanie. Praca bez snu to wypalenie. Wojownik wie kiedy atakować i kiedy się wycofać. Równowaga między wysiłkiem a regeneracją to sekret długoterminowego postępu.",
    question:"Co decyduje o długoterminowym postępie według zasady kontrastu?",
    answers:[{text:"Maksymalny wysiłek bez przerw",correct:false},{text:"Równowaga między wysiłkiem a regeneracją",correct:true},{text:"Wyłącznie intensywny trening",correct:false},{text:"Unikanie stresu w każdej formie",correct:false}]},
  { id:30, title:"Misja Wojownika",        icon:"🌟", xp:50, tag:"MISJA",
    content:"Viktor Frankl przeżył obozy koncentracyjne dlatego że miał misję — dokończyć swoją książkę. Człowiek może przetrwać prawie każde 'jak' jeśli ma swoje 'dlaczego'. Twoja misja nie musi być wielka — musi być TWOJA. Znajdź ją. Zapisz. Wróć do niej gdy będzie ciężko.",
    question:"Co według Viktora Frankla pozwala człowiekowi przetrwać najtrudniejsze chwile?",
    answers:[{text:"Fizyczna siła",correct:false},{text:"Silne 'dlaczego' — własna misja i cel",correct:true},{text:"Wsparcie innych ludzi",correct:false},{text:"Ignorowanie bólu",correct:false}]},
];

const LESSONS_S2 = [
  { id:31, title:"Ego jest wrogiem",       icon:"🪞", xp:30, tag:"MINDSET",
    content:"Ryan Holiday udowodnił: ego sabotuje wzrost. Ludzie z dużym ego przestają się uczyć, bo myślą że już wiedzą wszystko. Wojownik traktuje siebie jak wiecznego ucznia. Im mniej ego — tym więcej miejsca na rozwój.",
    question:"Dlaczego ego hamuje wzrost?",
    answers:[{text:"Bo sprawia że jesteśmy zbyt pewni siebie",correct:false},{text:"Bo blokuje naukę — ego myśli że już wszystko wie",correct:true},{text:"Bo nie pozwala pracować z innymi",correct:false},{text:"Ego nie hamuje wzrostu",correct:false}]},
  { id:32, title:"Zasada Kaizen",           icon:"🔧", xp:25, tag:"WZROST",
    content:"Kaizen — japońska filozofia ciągłego doskonalenia. Nie rewolucja, lecz ewolucja. Każdego dnia ulepsz jeden element swojego życia o 1%. Fabryki Toyoty zbudowały dominację rynkową nie przez wielkie skoki, ale przez tysiące małych usprawnień.",
    question:"Na czym polega filozofia Kaizen?",
    answers:[{text:"Na jednej wielkiej zmianie rocznie",correct:false},{text:"Na ciągłym, małym doskonaleniu każdego dnia",correct:true},{text:"Na kopiowaniu najlepszych",correct:false},{text:"Na eliminacji wszystkiego co nie działa",correct:false}]},
  { id:33, title:"Moc Ciszy",               icon:"🤫", xp:20, tag:"FOKUS",
    content:"W ciszy rodzi się klarowność. Hałas informacyjny — social media, newsy, powiadomienia — zagłusza wewnętrzny głos. 10 minut ciszy dziennie bez telefonu, muzyki i rozmów obniża kortyzol i zwiększa kreatywność o 40%.",
    question:"Co daje regularna praktyka ciszy?",
    answers:[{text:"Nudę i brak bodźców",correct:false},{text:"Klarowność myśli i obniżenie kortyzolu",correct:true},{text:"Izolację od świata",correct:false},{text:"Nic mierzalnego",correct:false}]},
  { id:34, title:"Antykruchość",            icon:"💎", xp:35, tag:"SIŁA",
    content:"Nassim Taleb: nie chodzi o to żeby być odpornym na wstrząsy — chodzi o to żeby na nich zyskiwać. Kość jest antykrucha — złamana zrasta się mocniej. Wojownik nie unika trudnych sytuacji. On wychodzi z nich silniejszy.",
    question:"Czym różni się antykruchość od odporności?",
    answers:[{text:"Niczym — to synonimy",correct:false},{text:"Antykruchość oznacza zysk ze wstrząsów, nie tylko przetrwanie",correct:true},{text:"Odporność jest lepsza od antykruchości",correct:false},{text:"Antykruchość dotyczy tylko ciała",correct:false}]},
  { id:35, title:"Zasada Pierwszych Zasad", icon:"🔬", xp:35, tag:"STRATEGIA",
    content:"Elon Musk myśli od podstaw — rozkłada problem na fundamentalne prawdy i buduje rozwiązanie od zera. Większość ludzi myśli przez analogię: 'tak się to robi'. Pytaj: 'dlaczego tak się to robi?' Często okaże się, że można inaczej — i lepiej.",
    question:"Na czym polega myślenie od pierwszych zasad?",
    answers:[{text:"Na podążaniu za sprawdzonymi metodami",correct:false},{text:"Na rozkładaniu problemu do fundamentalnych prawd i budowaniu od zera",correct:true},{text:"Na uczeniu się od ekspertów",correct:false},{text:"Na eksperymentowaniu metodą prób i błędów",correct:false}]},
  { id:36, title:"Teoria Przepływu",        icon:"🌊", xp:30, tag:"FOKUS",
    content:"Mihaly Csikszentmihalyi odkrył stan flow — całkowite pochłonięcie zadaniem gdzie czas przestaje istnieć. Warunki: zadanie musi być trudniejsze niż Twoje umiejętności o 4%. Za łatwe = nuda. Za trudne = lęk. Szukaj tej krawędzi codziennie.",
    question:"Kiedy pojawia się stan flow?",
    answers:[{text:"Gdy zadanie jest bardzo łatwe",correct:false},{text:"Gdy trudność zadania nieznacznie przekracza umiejętności",correct:true},{text:"Gdy zadanie jest bardzo trudne",correct:false},{text:"Flow pojawia się losowo",correct:false}]},
  { id:37, title:"Mapa nie jest terenem",   icon:"🗺️", xp:25, tag:"MINDSET",
    content:"Alfred Korzybski: nasze przekonania o świecie to mapy — nie sam świat. Kiedy mówisz 'nie mogę tego zrobić' — to tylko mapa, nie fakt. Wojownik regularnie weryfikuje swoje mapy. Czy to co myślę to prawda, czy tylko przekonanie które przejąłem od innych?",
    question:"Co oznacza zasada 'mapa nie jest terenem'?",
    answers:[{text:"Że GPS jest zawodny",correct:false},{text:"Że nasze przekonania to modele rzeczywistości, nie sama rzeczywistość",correct:true},{text:"Że planowanie jest bezużyteczne",correct:false},{text:"Że należy podróżować bez map",correct:false}]},
  { id:38, title:"Prawo Parkinsona",        icon:"⏰", xp:25, tag:"PRODUKTYWNOŚĆ",
    content:"Praca wypełnia cały dostępny na nią czas. Dasz sobie tydzień na zadanie 2-godzinne — zajmie tydzień. Wyznacz sztuczne, krótkie deadliny. Presja czasu usuwa perfekcjonizm i zmusza do skupienia na tym co naprawdę ważne.",
    question:"Co mówi prawo Parkinsona?",
    answers:[{text:"Że praca z czasem staje się łatwiejsza",correct:false},{text:"Że praca wypełnia cały dostępny na nią czas",correct:true},{text:"Że im więcej pracujesz tym mniej produkujesz",correct:false},{text:"Że przerwy zwiększają wydajność",correct:false}]},
  { id:39, title:"Gra Nieskończona",        icon:"♟️", xp:30, tag:"STRATEGIA",
    content:"Simon Sinek: gry skończone mają zwycięzców. Gry nieskończone trwają. Życie to gra nieskończona — nie chodzi o wygranie z kimś, ale o pozostanie w grze jak najdłużej i bycie lepszą wersją siebie. Competitor focus niszczy. Focus na misji — buduje.",
    question:"Czym jest gra nieskończona?",
    answers:[{text:"Grą bez zasad",correct:false},{text:"Grą gdzie celem jest trwanie i postęp, nie pokonanie przeciwnika",correct:true},{text:"Grą komputerową bez końca",correct:false},{text:"Grą gdzie wszyscy wygrywają",correct:false}]},
  { id:40, title:"Kotwice Emocjonalne",     icon:"⚓", xp:20, tag:"UMYSŁ",
    content:"Kotwica to bodziec który wywołuje określony stan emocjonalny. Ściskasz pięść — przypominasz sobie najlepszy trening. Grasz określoną muzykę — wchodzisz w fokus. Świadomie zaprojektuj swoje kotwice. To piloty do własnych stanów wewnętrznych.",
    question:"Czym jest kotwica emocjonalna?",
    answers:[{text:"Negatywnym wspomnieniem",correct:false},{text:"Bodźcem który wywołuje określony stan emocjonalny",correct:true},{text:"Techniką oddychania",correct:false},{text:"Rodzajem afirmacji",correct:false}]},
  { id:41, title:"Paradoks Wyboru",         icon:"🔀", xp:25, tag:"STRATEGIA",
    content:"Barry Schwartz udowodnił: więcej opcji = mniej szczęścia. Restauracje z krótkim menu sprzedają więcej. Wojownik upraszcza. Standaryzuj codzienne decyzje (co jeść, co nosić) żeby zachować energię decyzyjną na to co naprawdę ważne.",
    question:"Co powoduje zbyt wiele opcji wyboru?",
    answers:[{text:"Więcej satysfakcji",correct:false},{text:"Paraliż decyzyjny i mniejsze szczęście",correct:true},{text:"Lepsze decyzje",correct:false},{text:"Większą wolność",correct:false}]},
  { id:42, title:"Zasada Ekspozycji",       icon:"😨", xp:30, tag:"HARTOWANIE",
    content:"Jedyna metoda pokonania lęku to konfrontacja z nim — nie unikanie. Unikanie wzmacnia lęk. Stopniowa ekspozycja go eliminuje. Boisz się wystąpień publicznych? Zacznij od jednej osoby. Potem dwóch. Mózg uczy się że zagrożenie jest fałszywe.",
    question:"Jak pokonać lęk według psychologii?",
    answers:[{text:"Przez unikanie sytuacji wywołujących lęk",correct:false},{text:"Przez stopniową konfrontację z tym czego się boimy",correct:true},{text:"Przez ignorowanie lęku",correct:false},{text:"Przez leki",correct:false}]},
  { id:43, title:"Efekt Złożonych Odsetek", icon:"📈", xp:30, tag:"WZROST",
    content:"Einstein nazwał procent składany ósmym cudem świata. Ten sam mechanizm działa w rozwoju. Wiedza buduje się na wiedzy. Sprawność na sprawności. Inwestuj w siebie systematycznie — efekty przyjdą wykładniczo, nie liniowo. Rok konsekwencji zmienia życie.",
    question:"Jak działa efekt złożonych odsetek w rozwoju osobistym?",
    answers:[{text:"Liniowo — każdy dzień dodaje tyle samo",correct:false},{text:"Wykładniczo — postęp buduje się na poprzednim postępie",correct:true},{text:"Losowo — nie ma reguły",correct:false},{text:"Nie działa poza finansami",correct:false}]},
  { id:44, title:"Protokół Snu 2.0",        icon:"🌙", xp:25, tag:"REGENERACJA",
    content:"Matthew Walker: temperatura ciała musi spaść o 1°C żeby zasnąć. Otwórz okno, weź chłodny prysznic przed snem, nie ćwicz 3h przed snem. Ciemność absolutna — zasłoń wszystkie światełka. Te czynniki poprawiają jakość snu o 30%.",
    question:"Co najbardziej pomaga zasnąć?",
    answers:[{text:"Ciepły pokój i aktywność przed snem",correct:false},{text:"Obniżenie temperatury ciała i absolutna ciemność",correct:true},{text:"Alkohol i ciepłe mleko",correct:false},{text:"Jasne światło i muzyka",correct:false}]},
  { id:45, title:"Misja 2.0",               icon:"🚀", xp:50, tag:"MISJA",
    content:"Przeszedłeś 30 lekcji. Zbudowałeś fundament. Teraz czas na kolejny poziom. Wróć do swojej misji z lekcji 30 — czy nadal jest aktualna? Wojownik co 90 dni weryfikuje kierunek. Wzrost zmienia perspektywę. Może Twoje 'dlaczego' ewoluowało. Zapisz Misję 2.0.",
    question:"Jak często weryfikować swoją misję?",
    answers:[{text:"Nigdy — misja powinna być stała",correct:false},{text:"Co 90 dni — wzrost zmienia perspektywę",correct:true},{text:"Codziennie",correct:false},{text:"Tylko gdy coś idzie źle",correct:false}]},
];

// ── DAILY LESSON ROTATION ─────────────────────────────────────────────────────
function getTodayLesson(){
  const start = new Date("2024-01-01");
  const today = new Date();
  const diff = Math.floor((today - start) / (1000*60*60*24));
  return LESSONS[diff % LESSONS.length];
}
function getTodayKey(){ return new Date().toISOString().split("T")[0]; }

const DAILY_TASKS = [
  {id:"shower",   label:"Zimny prysznic",            icon:"🧊", xp:15, category:"CIAŁO"},
  {id:"workout",  label:"Trening",                   icon:"💪", xp:20, category:"CIAŁO"},
  {id:"reading",  label:"Czytanie (20 min)",         icon:"📖", xp:10, category:"UMYSŁ"},
  {id:"nophone",  label:"Brak telefonu przed 10:00", icon:"📵", xp:10, category:"FOKUS"},
  {id:"sleep",    label:"Sen przed 23:00",           icon:"🌙", xp:10, category:"REGENERACJA"},
  {id:"meditate", label:"Medytacja (5 min)",         icon:"🧘", xp:10, category:"UMYSŁ"},
  {id:"journal",  label:"Dziennik (3 rzeczy)",       icon:"✍️", xp:10, category:"UMYSŁ"},
  {id:"water",    label:"2L wody",                   icon:"💧", xp:5,  category:"CIAŁO"},
  {id:"nosugar",  label:"Brak cukru",                icon:"🚫", xp:10, category:"CIAŁO"},
  {id:"walk",     label:"Spacer 20 min",             icon:"🚶", xp:8,  category:"CIAŁO"},
];

const CHALLENGES = [
  {id:"c1",title:"7 Dni Zimna",      days:7, icon:"🧊",xp:150,desc:"7 dni zimnego prysznica z rzędu",task:"shower"},
  {id:"c2",title:"30 Dni Treningu",  days:30,icon:"💪",xp:500,desc:"30 dni treningu bez przerwy",    task:"workout"},
  {id:"c3",title:"Tydzień Bez Cukru",days:7, icon:"🚫",xp:120,desc:"7 dni bez cukru",               task:"nosugar"},
  {id:"c4",title:"Miesięczny Fokus", days:30,icon:"📵",xp:400,desc:"30 dni bez telefonu przed 10",  task:"nophone"},
  {id:"c5",title:"Czytelnik",        days:14,icon:"📖",xp:200,desc:"14 dni czytania z rzędu",       task:"reading"},
  {id:"c6",title:"Wojownik Wody",    days:7, icon:"💧",xp:80, desc:"7 dni picia 2L wody",           task:"water"},
];

const LEVELS=[
  {level:1,name:"Rekrut",   min:0,   max:150},
  {level:2,name:"Żołnierz", min:150, max:400},
  {level:3,name:"Wojownik", min:400, max:800},
  {level:4,name:"Weteran",  min:800, max:1400},
  {level:5,name:"Mistrz",   min:1400,max:2200},
  {level:6,name:"Legenda",  min:2200,max:99999},
];

const MOCK_LB=[
  {name:"Marek K.",xp:1840,streak:22,avatar:"M"},
  {name:"Tomek W.",xp:1650,streak:18,avatar:"T"},
  {name:"Piotrek D.",xp:1420,streak:15,avatar:"P"},
  {name:"Kamil S.",xp:1200,streak:12,avatar:"K"},
  {name:"Bartek N.",xp:980,streak:9,avatar:"B"},
  {name:"Łukasz R.",xp:760,streak:7,avatar:"Ł"},
  {name:"Adrian M.",xp:540,streak:5,avatar:"A"},
  {name:"Dawid C.",xp:320,streak:3,avatar:"D"},
];

function getLvl(xp){return LEVELS.find(l=>xp>=l.min&&xp<l.max)||LEVELS[5];}

// ── API LAYER ─────────────────────────────────────────────────────────────────
// Podmień po deployu na Railway:
const API_URL="https://nawyki-backedn-1.onrender.com";

const getToken=()=>{try{return localStorage.getItem("nw_token")||null}catch{return null}};
const setToken=t=>{try{localStorage.setItem("nw_token",t||"")}catch{}};
const clearToken=()=>{try{localStorage.removeItem("nw_token")}catch{}};

async function api(path,method="GET",body=null){
  const headers={"Content-Type":"application/json"};
  const token=getToken();
  if(token) headers["Authorization"]=`Bearer ${token}`;
  const res=await fetch(`${API_URL}${path}`,{
    method,headers,
    body:body?JSON.stringify(body):null,
  });
  const data=await res.json();
  if(!res.ok) throw new Error(data.message||"Błąd serwera");
  return data;
}

const TODAY=()=>new Date().toISOString().split("T")[0];

// ── ODZNAKI ───────────────────────────────────────────────────────────────────
const BADGES=[
  {id:"first_day",    icon:"⚡", name:"Pierwszy krok",     desc:"Ukończ pierwszy dzień",         check:u=>(u.history&&Object.keys(u.history).length>=1)},
  {id:"streak7",      icon:"🔥", name:"Tydzień ognia",     desc:"7 dni streaka z rzędu",         check:u=>(u.streak||0)>=7},
  {id:"streak30",     icon:"💎", name:"Diamentowy wojownik",desc:"30 dni streaka z rzędu",       check:u=>(u.streak||0)>=30},
  {id:"streak100",    icon:"👑", name:"Legenda",            desc:"100 dni streaka z rzędu",      check:u=>(u.streak||0)>=100},
  {id:"all_tasks",    icon:"✅", name:"Dzień doskonały",   desc:"Ukończ wszystkie zadania w 1 dniu",check:u=>Object.values(u.history||{}).some(d=>d.tasksDone>=DAILY_TASKS.length)},
  {id:"lessons5",     icon:"📖", name:"Uczeń",             desc:"Ukończ 5 lekcji",              check:u=>(u.lessons||[]).filter(l=>typeof l==="number").length>=5},
  {id:"lessons_all",  icon:"🎓", name:"Mistrz wiedzy",     desc:"Ukończ wszystkie lekcje S1",   check:u=>(u.lessons||[]).filter(l=>typeof l==="number"&&l<=30).length>=30},
  {id:"xp500",        icon:"⚡", name:"Energetyk",         desc:"Zdobądź 500 XP",               check:u=>(u.xp||0)>=500},
  {id:"xp2000",       icon:"🚀", name:"Rakieta",           desc:"Zdobądź 2000 XP",              check:u=>(u.xp||0)>=2000},
  {id:"xp5000",       icon:"🌟", name:"Supernowa",         desc:"Zdobądź 5000 XP",             check:u=>(u.xp||0)>=5000},
  {id:"cold7",        icon:"🧊", name:"Lodowy wojownik",   desc:"7 dni zimnego prysznica",      check:u=>Object.values(u.history||{}).filter(d=>(d.tasks||[]).includes("shower")||(d.tasksDone>0&&u.streak>=7)).length>=7},
  {id:"gratitude7",   icon:"🙏", name:"Wdzięczny duch",   desc:"7 dni wdzięczności z rzędu",   check:u=>{const g=u.gratitude||{};let s=0;const d=new Date();for(let i=0;i<7;i++){const k=new Date(d);k.setDate(k.getDate()-i);if(g[k.toISOString().split("T")[0]]?.savedAt)s++;else break;}return s>=7;}},
  {id:"challenge1",   icon:"🏆", name:"Wyzywający",        desc:"Ukończ 1 wyzwanie",            check:u=>Object.values(u.challenges||{}).some(c=>c.progress>=c?.days||c?.completed)},
  {id:"freeze_used",  icon:"🛡️", name:"Tarcza wojownika",  desc:"Użyj streak freeze",           check:u=>(u.freezeUsed||0)>=1},
  {id:"perfect_week", icon:"🌈", name:"Idealny tydzień",   desc:"7 dni z kompletem zadań",      check:u=>{const h=u.history||{};let cnt=0;const d=new Date();for(let i=0;i<7;i++){const k=new Date(d);k.setDate(k.getDate()-i);const e=h[k.toISOString().split("T")[0]];if(e&&e.tasksDone>=DAILY_TASKS.length)cnt++;else break;}return cnt>=7;}},
];

function checkBadges(user){
  const earned=user.badges||[];
  const newBadges=BADGES.filter(b=>!earned.includes(b.id)&&b.check(user)).map(b=>b.id);
  if(!newBadges.length) return user;
  return{...user,badges:[...earned,...newBadges]};
}

// ── SKLEP XP ──────────────────────────────────────────────────────────────────
const SHOP_ITEMS=[
  {id:"freeze",   icon:"🛡️", name:"Streak Freeze",      desc:"Ochrona streaka na 1 dzień — jeśli pominiesz, streak zostaje.", cost:200, max:3},
  {id:"xp2x",    icon:"⚡", name:"Podwójne XP (24h)",   desc:"Przez kolejne 24h zdobywasz 2× więcej XP za zadania.",          cost:300, max:1},
  {id:"badge_s",  icon:"🎖️", name:"Odznaka Wojownika",  desc:"Specjalna złota odznaka w profilu — widoczna w rankingu.",      cost:500, max:1},
];

function checkDailyReset(user){
  const today=TODAY();
  if(user.lastDay===today) return user;
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);
  const yKey=yesterday.toISOString().split("T")[0];
  const activeYesterday=(user.lastDay===yKey)&&(user.tasks||[]).length>0;
  let newStreak;
  if(activeYesterday){
    newStreak=(user.streak||1)+1;
  } else if(user.lastDay){
    // Sprawdź streak freeze
    const freezes=user.freezes||0;
    if(freezes>0){
      newStreak=user.streak||1; // zachowaj streak
      return{...user,tasks:[],lastDay:today,streak:newStreak,freezes:freezes-1,freezeUsed:(user.freezeUsed||0)+1};
    }
    newStreak=1;
  } else {
    newStreak=user.streak||1;
  }
  return{...user,tasks:[],lastDay:today,streak:newStreak};
}

const GCSS=`
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&family=Inter:wght@400;500&family=Bebas+Neue&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --navy:  #0f1923;
    --navy1: #162130;
    --navy2: #1e2d3d;
    --navy3: #263646;
    --gold:  #f0a500;
    --gold2: #ffbe33;
    --gold3: #fff0c0;
    --white: #f0f4f8;
    --dim:   #8899aa;
    --red:   #e8394a;
    --green: #27c47a;
    --blue:  #3b9eff;
    --text:  #dce8f2;
  }
  body{background:var(--navy);color:var(--text);font-family:'Inter',sans-serif;-webkit-font-smoothing:antialiased;}
  input{font-family:'Inter',sans-serif;}
  input::placeholder{color:var(--dim);}
  input:focus{outline:none;}
  button{cursor:pointer;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-thumb{background:var(--navy3);border-radius:2px;}

  @keyframes fadeUp{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
  @keyframes goldShimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
  @keyframes xpBounce{0%{opacity:1;transform:translateY(0) scale(1);}50%{opacity:1;transform:translateY(-24px) scale(1.15);}100%{opacity:0;transform:translateY(-48px) scale(.9);}}
  @keyframes checkPop{0%{transform:scale(0);}60%{transform:scale(1.3);}100%{transform:scale(1);}}
  @keyframes confetti{0%{transform:translateY(0) rotate(0);opacity:1;}100%{transform:translateY(80px) rotate(720deg);opacity:0;}}
  @keyframes slideIn{from{transform:translateY(100%);opacity:0;}to{transform:translateY(0);opacity:1;}}
  @keyframes pulseGold{0%,100%{box-shadow:0 0 0 0 rgba(240,165,0,.4);}50%{box-shadow:0 0 0 8px rgba(240,165,0,0);}}

  .au {animation:fadeUp .3s ease both;}
  .au1{animation:fadeUp .3s .04s ease both;}
  .au2{animation:fadeUp .3s .08s ease both;}
  .au3{animation:fadeUp .3s .12s ease both;}
  .au4{animation:fadeUp .3s .16s ease both;}
  .au5{animation:fadeUp .3s .20s ease both;}
`;

// ── DECORATIVE LINES BG ───────────────────────────────────────────────────────
function NavyBg(){
  return(
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,transparent,var(--gold),transparent)",opacity:.6}}/>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style={{position:"absolute",inset:0,opacity:.15}}>
        <defs>
          <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(240,165,0,0.3)"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)"/>
      </svg>
      <div style={{position:"absolute",top:-300,right:-200,width:700,height:700,borderRadius:"50%",background:"radial-gradient(circle,rgba(59,158,255,.06) 0%,transparent 65%)"}}/>
      <div style={{position:"absolute",bottom:-200,left:-150,width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(240,165,0,.04) 0%,transparent 65%)"}}/>
    </div>
  );
}

// ── XP BAR ────────────────────────────────────────────────────────────────────
function XPBar({xp}){
  const info=getLvl(xp);
  const pct=Math.min(((xp-info.min)/(info.max-info.min))*100,100);
  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:6,height:6,borderRadius:"50%",background:"var(--gold)"}}/>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2,color:"var(--gold)",fontWeight:700}}>
            LVL {info.level} · {info.name.toUpperCase()}
          </span>
        </div>
        <span style={{fontFamily:"'Inter',sans-serif",fontSize:12,color:"var(--dim)"}}>
          <span style={{color:"var(--text)",fontWeight:500}}>{xp}</span> / {info.max} XP
        </span>
      </div>
      <div style={{height:6,background:"var(--navy3)",borderRadius:3,overflow:"hidden",border:"1px solid rgba(255,255,255,.06)"}}>
        <div style={{width:`${pct}%`,height:"100%",background:"linear-gradient(90deg,var(--gold),var(--gold2))",borderRadius:3,transition:"width .9s cubic-bezier(.22,1,.36,1)",boxShadow:"0 0 10px rgba(240,165,0,.5)"}}/>
      </div>
    </div>
  );
}

// ── AUTH FIELD — poza AuthScreen żeby nie tracić focusu ──────────────────────
const inpStyle={width:"100%",padding:"14px 16px 14px 48px",background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:10,color:"var(--white)",fontSize:15,fontFamily:"'Inter',sans-serif",transition:"border-color .2s, box-shadow .2s"};

function Field({icon,placeholder,type,value,onChange,onKeyDown}){
  return(
    <div style={{position:"relative"}}>
      <span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:17,pointerEvents:"none",zIndex:1}}>{icon}</span>
      <input
        placeholder={placeholder}
        type={type||"text"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={inpStyle}
        onFocus={e=>{e.target.style.borderColor="var(--gold)";e.target.style.boxShadow="0 0 0 3px rgba(240,165,0,.15)";}}
        onBlur={e=>{e.target.style.borderColor="var(--navy3)";e.target.style.boxShadow="none";}}
      />
    </div>
  );
}

// ── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen({onAuth}){
  const [mode,setMode]=useState(()=>{
    // Sprawdź czy w URL jest token resetu
    const p=new URLSearchParams(window.location.search);
    return p.get("reset")?"reset":"welcome";
  });
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  const [pass2,setPass2]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [registered,setRegistered]=useState(false);
  const [forgotSent,setForgotSent]=useState(false);
  const [resetDone,setResetDone]=useState(false);
  const resetToken=new URLSearchParams(window.location.search).get("reset")||"";

  async function doLogin(){
    setLoading(true);setErr("");
    try{
      const data=await api("/login","POST",{email,password:pass});
      setToken(data.token);
      const me=await api("/me");
      onAuth(email,me);
    }catch(e){setErr(e.message);}
    finally{setLoading(false);}
  }

  async function doReg(){
    if(!name.trim()){setErr("Wpisz imię.");return;}
    if(!email.includes("@")){setErr("Niepoprawny email.");return;}
    if(pass.length<6){setErr("Hasło min. 6 znaków.");return;}
    setLoading(true);setErr("");
    try{
      await api("/register","POST",{name:name.trim(),email,password:pass});
      setRegistered(true);
    }catch(e){setErr(e.message);}
    finally{setLoading(false);}
  }

  async function doForgot(){
    if(!email.includes("@")){setErr("Wpisz poprawny email.");return;}
    setLoading(true);setErr("");
    try{
      await api("/forgot-password","POST",{email});
      setForgotSent(true);
    }catch(e){setErr(e.message);}
    finally{setLoading(false);}
  }

  async function doReset(){
    if(pass.length<6){setErr("Hasło min. 6 znaków.");return;}
    if(pass!==pass2){setErr("Hasła nie są takie same.");return;}
    setLoading(true);setErr("");
    try{
      await api("/reset-password","POST",{token:resetToken,password:pass});
      setResetDone(true);
      // Wyczyść token z URL
      window.history.replaceState({},"","/");
    }catch(e){setErr(e.message);}
    finally{setLoading(false);}
  }

  // ── EKRAN RESET HASŁA (z linku email) ──
  if(mode==="reset") return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:24,position:"relative",overflow:"hidden"}}>
      <NavyBg/>
      <div style={{position:"relative",zIndex:1,maxWidth:380,width:"100%",margin:"0 auto",flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
        {resetDone?(
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:20}}>✅</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",marginBottom:10,fontWeight:700}}>GOTOWE</div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:3,color:"var(--white)",marginBottom:12}}>Hasło zmienione</h2>
            <p style={{color:"var(--dim)",fontSize:15,lineHeight:1.7,marginBottom:32}}>Możesz się teraz zalogować nowym hasłem.</p>
            <button onClick={()=>setMode("login")} style={{width:"100%",padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:3,fontWeight:700}}>
              ZALOGUJ SIĘ →
            </button>
          </div>
        ):(
          <>
            <div style={{marginBottom:32}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",fontWeight:700,marginBottom:10}}>NOWE HASŁO</div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:40,letterSpacing:3,color:"var(--white)",lineHeight:1}}>Ustaw hasło</h2>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              <Field icon="🔒" placeholder="Nowe hasło (min. 6 znaków)" type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}}/>
              <Field icon="🔒" placeholder="Powtórz hasło" type="password" value={pass2} onChange={e=>{setPass2(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&doReset()}/>
            </div>
            {err&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:10,marginBottom:14,background:"rgba(232,57,74,.08)",border:"1px solid rgba(232,57,74,.3)"}}>
              <span>❌</span><span style={{color:"#ff8090",fontSize:14,fontWeight:500}}>{err}</span>
            </div>}
            <button onClick={doReset} disabled={loading} style={{padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",background:loading?"var(--navy2)":"linear-gradient(135deg,var(--gold),var(--gold2))",color:loading?"var(--dim)":"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:18,letterSpacing:3,fontWeight:700}}>
              {loading?"ZAPISUJĘ...":"ZMIEŃ HASŁO"}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ── EKRAN ZAPOMNIAŁEM HASŁA ──
  if(mode==="forgot") return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:24,position:"relative",overflow:"hidden"}}>
      <NavyBg/>
      <div style={{position:"relative",zIndex:1,maxWidth:380,width:"100%",margin:"0 auto",flex:1,display:"flex",flexDirection:"column"}}>
        <button onClick={()=>{setMode("login");setErr("");setForgotSent(false);}} style={{background:"none",border:"none",color:"var(--dim)",fontSize:14,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,alignSelf:"flex-start",marginBottom:36,padding:0,marginTop:16}}>← WRÓĆ</button>
        {forgotSent?(
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
            <div style={{fontSize:64,marginBottom:20}}>📧</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",marginBottom:10,fontWeight:700}}>SPRAWDŹ EMAIL</div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:3,color:"var(--white)",marginBottom:12,lineHeight:1}}>Link wysłany</h2>
            <p style={{color:"var(--dim)",fontSize:15,lineHeight:1.7,marginBottom:32}}>
              Jeśli konto istnieje, wysłaliśmy link na <strong style={{color:"var(--white)"}}>{email}</strong>.<br/>Sprawdź też folder spam.
            </p>
            <button onClick={()=>{setMode("login");setForgotSent(false);}} style={{width:"100%",padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:3,fontWeight:700}}>
              WRÓĆ DO LOGOWANIA
            </button>
          </div>
        ):(
          <>
            <div style={{marginBottom:32}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",fontWeight:700,marginBottom:10}}>ODZYSKIWANIE KONTA</div>
              <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:40,letterSpacing:3,color:"var(--white)",lineHeight:1}}>Zapomniałem hasła</h2>
              <p style={{color:"var(--dim)",fontSize:14,marginTop:10,lineHeight:1.6}}>Wpisz email — wyślemy link do zresetowania hasła.</p>
            </div>
            <div style={{marginBottom:16}}>
              <Field icon="✉️" placeholder="Twój email" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&doForgot()}/>
            </div>
            {err&&<div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:10,marginBottom:14,background:"rgba(232,57,74,.08)",border:"1px solid rgba(232,57,74,.3)"}}>
              <span>❌</span><span style={{color:"#ff8090",fontSize:14,fontWeight:500}}>{err}</span>
            </div>}
            <button onClick={doForgot} disabled={loading} style={{padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",background:loading?"var(--navy2)":"linear-gradient(135deg,var(--gold),var(--gold2))",color:loading?"var(--dim)":"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:18,letterSpacing:3,fontWeight:700}}>
              {loading?"WYSYŁAM...":"WYŚLIJ LINK →"}
            </button>
          </>
        )}
      </div>
    </div>
  );

  if(mode==="welcome") return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,position:"relative",overflow:"hidden"}}>
      <NavyBg/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380,display:"flex",flexDirection:"column",alignItems:"center"}}>

        {/* Emblem */}
        <div className="au" style={{width:80,height:80,borderRadius:24,marginBottom:28,background:"var(--navy2)",border:"2px solid var(--gold)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,boxShadow:"0 0 40px rgba(240,165,0,.2), inset 0 1px 0 rgba(255,255,255,.07)"}}>⚔️</div>

        <div className="au1" style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:6,color:"var(--dim)",marginBottom:12,textTransform:"uppercase",textAlign:"center"}}>
          dyscyplinawojownika.pl
        </div>

        <h1 className="au2" style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:58,letterSpacing:5,textAlign:"center",lineHeight:.9,marginBottom:18,color:"var(--white)"}}>
          Nawyki<br/>
          <span style={{background:"linear-gradient(90deg,var(--gold),var(--gold2),var(--gold))",backgroundSize:"200% auto",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"goldShimmer 3s linear infinite"}}>
            Wojownika
          </span>
        </h1>

        <p className="au3" style={{color:"var(--dim)",fontSize:15,lineHeight:1.65,textAlign:"center",marginBottom:48,maxWidth:290}}>
          Codzienny system budowania dyscypliny. Zadania, lekcje, wyzwania, poziomy.
        </p>

        <div className="au4" style={{width:"100%",display:"flex",flexDirection:"column",gap:12}}>
          <button onClick={()=>setMode("register")} style={{
            padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",
            background:"linear-gradient(135deg,var(--gold),var(--gold2))",
            color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:3,fontWeight:700,
            boxShadow:"0 6px 28px rgba(240,165,0,.3)",transition:"transform .15s,box-shadow .15s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 36px rgba(240,165,0,.4)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 28px rgba(240,165,0,.3)";}}>
            ZACZNIJ ZA DARMO
          </button>
          <button onClick={()=>setMode("login")} style={{
            padding:"16px 0",borderRadius:12,border:"1px solid var(--navy3)",
            background:"var(--navy1)",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:3,fontWeight:600,
          }}>
            MAM JUŻ KONTO
          </button>
        </div>
        <a className="au5" href="https://dyscyplinawojownika.pl" target="_blank" rel="noreferrer"
          style={{color:"var(--navy3)",fontSize:11,marginTop:36,textDecoration:"none",letterSpacing:2,fontFamily:"'Rajdhani',sans-serif"}}>
          ↗ DYSCYPLINAWOJOWNIKA.PL
        </a>
      </div>
    </div>
  );

  const isLogin=mode==="login";

  // Ekran po rejestracji — czeka na weryfikację emaila
  if(registered) return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,position:"relative",overflow:"hidden"}}>
      <NavyBg/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380,textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:20}}>📧</div>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",marginBottom:10,fontWeight:700}}>SPRAWDŹ EMAIL</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:3,color:"var(--white)",marginBottom:12,lineHeight:1}}>Link aktywacyjny wysłany</h2>
        <p style={{color:"var(--dim)",fontSize:15,lineHeight:1.7,marginBottom:32,fontWeight:300}}>
          Wysłaliśmy link na <strong style={{color:"var(--white)"}}>{email}</strong>.<br/>
          Kliknij go żeby aktywować konto — potem wróć i się zaloguj.
        </p>
        <button onClick={()=>{setMode("login");setRegistered(false);}} style={{
          width:"100%",padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",
          background:"linear-gradient(135deg,var(--gold),var(--gold2))",
          color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:3,fontWeight:700,
        }}>ZALOGUJ SIĘ →</button>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:24,position:"relative",overflow:"hidden"}}>
      <NavyBg/>
      <div style={{position:"relative",zIndex:1,maxWidth:380,width:"100%",margin:"0 auto",flex:1,display:"flex",flexDirection:"column"}}>
        <button onClick={()=>{setMode("welcome");setErr("");}} style={{background:"none",border:"none",color:"var(--dim)",fontSize:14,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,alignSelf:"flex-start",marginBottom:36,padding:0,marginTop:16}}>← WRÓĆ</button>

        <div className="au" style={{marginBottom:32}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",fontWeight:700,marginBottom:10}}>{isLogin?"LOGOWANIE":"REJESTRACJA"}</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:40,letterSpacing:3,color:"var(--white)",lineHeight:1}}>
            {isLogin?"Witaj z powrotem":"Dołącz do wojowników"}
          </h2>
        </div>

        <div className="au1" style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
          {!isLogin&&<Field icon="👤" placeholder="Twoje imię" value={name} onChange={e=>{setName(e.target.value);setErr("");}}/>}
          <Field icon="✉️" placeholder="Email" type="email" value={email} onChange={e=>{setEmail(e.target.value);setErr("");}}/>
          <Field icon="🔒" placeholder="Hasło (min. 6 znaków)" type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&(isLogin?doLogin():doReg())}/>
        </div>

        {err&&(
          <div className="au" style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:10,marginBottom:14,background:"rgba(232,57,74,.08)",border:"1px solid rgba(232,57,74,.3)"}}>
            <span style={{fontSize:16,flexShrink:0}}>❌</span>
            <span style={{color:"#ff8090",fontSize:14,fontWeight:500}}>{err}</span>
          </div>
        )}

        <button className="au2" onClick={isLogin?doLogin:doReg} disabled={loading} style={{
          padding:"16px 0",borderRadius:12,border:"2px solid",
          borderColor:loading?"var(--navy3)":"var(--gold)",
          background:loading?"var(--navy2)":"linear-gradient(135deg,var(--gold),var(--gold2))",
          color:loading?"var(--dim)":"var(--navy)",
          fontFamily:"'Rajdhani',sans-serif",fontSize:18,letterSpacing:3,fontWeight:700,
          marginBottom:20,transition:"all .2s",
          boxShadow:loading?"none":"0 6px 24px rgba(240,165,0,.25)",
        }}>
          {loading?"ŁĄCZENIE...":(isLogin?"ZALOGUJ SIĘ":"UTWÓRZ KONTO")}
        </button>

        <div style={{textAlign:"center"}}>
          <span style={{color:"var(--dim)",fontSize:14}}>{isLogin?"Nie masz konta? ":"Masz już konto? "}</span>
          <button onClick={()=>{setMode(isLogin?"register":"login");setErr("");}} style={{background:"none",border:"none",color:"var(--gold)",fontSize:14,fontFamily:"'Inter',sans-serif",fontWeight:500,padding:0}}>
            {isLogin?"Zarejestruj się":"Zaloguj się"}
          </button>
        </div>

        {isLogin&&(
          <div style={{textAlign:"center",marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={()=>{setMode("forgot");setErr("");}} style={{background:"none",border:"none",color:"var(--dim)",fontSize:13,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:2,padding:0,cursor:"pointer"}}>
              🔑 ZAPOMNIAŁEM HASŁA
            </button>
            <div>
              <span style={{color:"var(--dim)",fontSize:12,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>
                Problem z kontem? </span>
              <a href="mailto:apkawojownika@gmail.com" style={{color:"var(--gold)",fontSize:12,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>
                apkawojownika@gmail.com
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// ── LESSON OVERLAY ────────────────────────────────────────────────────────────
function LessonOverlay({lesson,onComplete,onClose}){
  const [phase,setPhase]=useState("read");
  const [sel,setSel]=useState(null);
  const [ok,setOk]=useState(null);
  return(
    <div style={{position:"fixed",inset:0,zIndex:200,background:"var(--navy)",overflowY:"auto",padding:24}}>
      <NavyBg/>
      <div style={{position:"relative",zIndex:1,maxWidth:480,margin:"0 auto"}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:"var(--dim)",fontSize:14,letterSpacing:2,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,padding:0,marginBottom:28,marginTop:8}}>← WRÓĆ</button>

        {/* progress */}
        <div style={{display:"flex",gap:6,marginBottom:28}}>
          {["read","quiz"].map((p,i)=>(
            <div key={p} style={{flex:1,height:4,borderRadius:2,background:phase==="quiz"&&i===0||phase===p?"var(--gold)":"var(--navy3)",transition:"background .3s"}}/>
          ))}
        </div>

        {phase==="read"&&(
          <div className="au">
            <div style={{display:"inline-block",padding:"3px 12px",borderRadius:20,background:"rgba(240,165,0,.12)",border:"1px solid rgba(240,165,0,.3)",fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--gold)",marginBottom:16,fontWeight:700}}>{lesson.tag}</div>
            <div style={{fontSize:48,marginBottom:14}}>{lesson.icon}</div>
            <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,letterSpacing:3,color:"var(--white)",marginBottom:24,lineHeight:1}}>{lesson.title}</h2>
            <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderLeft:"4px solid var(--gold)",borderRadius:14,padding:24,color:"var(--text)",fontSize:16,lineHeight:1.8,marginBottom:28,fontWeight:400}}>{lesson.content}</div>
            <button onClick={()=>setPhase("quiz")} style={{width:"100%",padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:18,letterSpacing:3,fontWeight:700,boxShadow:"0 6px 24px rgba(240,165,0,.25)"}}>DALEJ → QUIZ</button>
          </div>
        )}
        {phase==="quiz"&&(
          <div className="au">
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--blue)",marginBottom:18,fontWeight:700}}>SPRAWDŹ WIEDZĘ</div>
            <h3 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,letterSpacing:2,color:"var(--white)",marginBottom:24,lineHeight:1.2}}>{lesson.question}</h3>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:22}}>
              {lesson.answers.map((ans,i)=>{
                const chosen=sel===i;
                return(
                  <div key={i} onClick={()=>{if(sel!==null)return;setSel(i);setOk(ans.correct);}} style={{
                    padding:"14px 18px",borderRadius:12,cursor:sel!==null?"default":"pointer",fontSize:15,lineHeight:1.4,
                    transition:"all .2s",userSelect:"none",display:"flex",alignItems:"center",gap:12,
                    background:chosen?(ok?"rgba(39,196,122,.12)":"rgba(232,57,74,.12)"):"var(--navy1)",
                    border:chosen?(ok?"2px solid var(--green)":"2px solid var(--red)"):"1px solid var(--navy3)",
                    color:chosen?(ok?"var(--green)":"var(--red)"):"var(--text)",
                  }}>
                    <span style={{width:28,height:28,borderRadius:8,background:"var(--navy2)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:13,fontWeight:700,flexShrink:0,color:"var(--dim)"}}>
                      {String.fromCharCode(65+i)}
                    </span>
                    {ans.text}
                  </div>
                );
              })}
            </div>
            {sel!==null&&(
              <div className="au">
                <div style={{padding:"12px 18px",borderRadius:12,marginBottom:16,background:ok?"rgba(39,196,122,.1)":"rgba(232,57,74,.1)",border:ok?"1px solid rgba(39,196,122,.3)":"1px solid rgba(232,57,74,.3)",color:ok?"var(--green)":"var(--red)",fontSize:15,fontWeight:600}}>
                  {ok?`✓ Dobrze! +${lesson.xp} XP zdobyte`:"✗ Błędna odpowiedź — spróbuj jeszcze raz"}
                </div>
                <button onClick={()=>{if(ok)onComplete();else{setSel(null);setOk(null);}}} style={{width:"100%",padding:"16px 0",borderRadius:12,border:"2px solid",borderColor:ok?"var(--gold)":"var(--navy3)",background:ok?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",color:ok?"var(--navy)":"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:18,letterSpacing:3,fontWeight:700}}>
                  {ok?"UKOŃCZ LEKCJĘ":"SPRÓBUJ JESZCZE RAZ"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── TASKS TAB ─────────────────────────────────────────────────────────────────
function TasksTab({tasks,onToggle,checkAnim}){
  const tasksDone=tasks.length;
  const cats=["CIAŁO","UMYSŁ","FOKUS","REGENERACJA"];
  const catColors={"CIAŁO":"var(--green)","UMYSŁ":"var(--blue)","FOKUS":"var(--gold)","REGENERACJA":"#a78bfa"};
  return(
    <div style={{padding:"0 18px"}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",marginBottom:16,fontWeight:600}}>
        DZIŚ — {tasksDone===DAILY_TASKS.length?"✓ WSZYSTKO GOTOWE":`${DAILY_TASKS.length-tasksDone} POZOSTAŁO`}
      </div>
      {cats.map(cat=>{
        const catTasks=DAILY_TASKS.filter(t=>t.category===cat);
        const catColor=catColors[cat];
        return(
          <div key={cat} style={{marginBottom:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
              <div style={{width:3,height:14,borderRadius:2,background:catColor}}/>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:catColor,fontWeight:700}}>{cat}</span>
            </div>
            {catTasks.map((task,i)=>{
              const done=tasks.includes(task.id);
              return(
                <div key={task.id} onClick={()=>onToggle(task.id,task.xp)} style={{
                  display:"flex",alignItems:"center",gap:14,padding:"14px 16px",
                  borderRadius:12,marginBottom:8,cursor:"pointer",userSelect:"none",
                  background:done?"rgba(39,196,122,.07)":"var(--navy1)",
                  border:done?"1px solid rgba(39,196,122,.25)":"1px solid var(--navy3)",
                  transition:"all .2s",
                }}>
                  <div style={{
                    width:26,height:26,borderRadius:8,flexShrink:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    background:done?"var(--green)":"transparent",
                    border:done?"none":"2px solid var(--navy3)",
                    transition:"all .25s",
                  }}>
                    {done&&<span style={{fontSize:14,color:"var(--navy)",fontWeight:900,animation:"checkPop .25s ease"}}>✓</span>}
                  </div>
                  <span style={{fontSize:21}}>{task.icon}</span>
                  <span style={{flex:1,fontSize:15,color:done?"var(--dim)":"var(--white)",textDecoration:done?"line-through":"none",fontWeight:done?400:500}}>{task.label}</span>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:done?"var(--navy3)":"var(--gold)",letterSpacing:1,fontWeight:700}}>+{task.xp}</span>
                </div>
              );
            })}
          </div>
        );
      })}
      {tasksDone===DAILY_TASKS.length&&(
        <div className="au" style={{padding:24,borderRadius:16,textAlign:"center",background:"rgba(39,196,122,.07)",border:"1px solid rgba(39,196,122,.2)",marginTop:4}}>
          <div style={{fontSize:40,marginBottom:10}}>🔥</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"var(--green)",letterSpacing:3}}>DZIEŃ OPANOWANY</div>
          <div style={{color:"var(--dim)",fontSize:14,marginTop:6}}>Wróć jutro aby utrzymać streak</div>
        </div>
      )}
    </div>
  );
}

// ── LESSONS TAB ───────────────────────────────────────────────────────────────
function LessonsTab({lessons,onStart}){
  const [showAll,setShowAll]=useState(false);
  const tagColors={"PODSTAWY":"var(--gold)","WZROST":"var(--green)","HARTOWANIE":"var(--blue)","STRATEGIA":"#f472b6","MINDSET":"var(--gold)","RUTYNA":"var(--green)","REGENERACJA":"#a78bfa","FOKUS":"var(--blue)","PRODUKTYWNOŚĆ":"var(--green)","MOMENTUM":"var(--gold)","NAWYKI":"var(--blue)","DZIAŁANIE":"var(--green)","SIŁA":"var(--gold)","UMYSŁ":"#a78bfa","MISJA":"var(--gold)"};

  const todayLesson=getTodayLesson();
  const todayKey=getTodayKey();
  const todayDone=lessons.includes(`daily_${todayLesson.id}_${todayKey}`);

  // Handle daily lesson completion — uses a special key with date
  function startDailyLesson(){
    onStart({...todayLesson, dailyKey:`daily_${todayLesson.id}_${todayKey}`});
  }

  const LessonRow=({lesson,done,onStartFn})=>{
    const tc=tagColors[lesson.tag]||"var(--gold)";
    return(
      <div onClick={done?undefined:onStartFn} style={{
        padding:"14px 16px",borderRadius:12,marginBottom:8,cursor:done?"default":"pointer",
        background:done?"rgba(255,255,255,.02)":"var(--navy1)",
        border:done?"1px solid var(--navy3)":"1px solid var(--navy2)",
        transition:"all .2s",borderLeft:done?`3px solid var(--navy3)`:`3px solid ${tc}`,
      }}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:44,height:44,borderRadius:12,background:"var(--navy2)",border:done?"1px solid var(--navy3)":`1px solid ${tc}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{lesson.icon}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,letterSpacing:3,color:done?"var(--navy3)":tc,fontWeight:700,marginBottom:2}}>{lesson.tag}</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:1,fontWeight:700,color:done?"var(--dim)":"var(--white)"}}>{lesson.title}</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:done?"var(--navy3)":"var(--gold)",letterSpacing:1,marginTop:2,fontWeight:600}}>+{lesson.xp} XP</div>
          </div>
          {done
            ?<div style={{width:30,height:30,borderRadius:9,background:"rgba(39,196,122,.1)",border:"1px solid rgba(39,196,122,.2)",display:"flex",alignItems:"center",justifyContent:"center",color:"var(--green)",fontSize:15}}>✓</div>
            :<div style={{padding:"7px 14px",borderRadius:9,border:"1px solid var(--gold)",background:"rgba(240,165,0,.1)",color:"var(--gold)",fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:2,fontWeight:700}}>START</div>
          }
        </div>
      </div>
    );
  };

  const donePerm=lessons.filter(l=>typeof l==="number"&&l<=30).length;
  const donePerm2=lessons.filter(l=>typeof l==="number"&&l>30).length;
  const s1Complete=donePerm>=LESSONS.length;
  const [showAll2,setShowAll2]=useState(false);

  return(
    <div style={{padding:"0 18px"}}>

      {/* ── LEKCJA DNIA ── */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{width:4,height:16,borderRadius:2,background:"linear-gradient(180deg,var(--gold),var(--gold2))"}}/>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:4,color:"var(--gold)",fontWeight:700}}>LEKCJA DNIA</span>
          <div style={{flex:1,height:1,background:"var(--navy3)",marginLeft:4}}/>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:600,letterSpacing:1}}>
            {new Date().toLocaleDateString("pl-PL",{weekday:"short",day:"numeric",month:"short"}).toUpperCase()}
          </span>
        </div>

        <div style={{
          borderRadius:16,overflow:"hidden",
          border:todayDone?"1px solid rgba(39,196,122,.3)":"1px solid rgba(240,165,0,.3)",
          background:todayDone?"rgba(39,196,122,.04)":"rgba(240,165,0,.04)",
          position:"relative",
        }}>
          {/* accent top bar */}
          <div style={{height:3,background:todayDone?"linear-gradient(90deg,var(--green),var(--blue))":"linear-gradient(90deg,var(--gold),var(--gold2))"}}/>
          <div style={{padding:"18px 18px 16px"}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:14}}>
              <div style={{
                width:56,height:56,borderRadius:16,flexShrink:0,
                background:todayDone?"rgba(39,196,122,.1)":"rgba(240,165,0,.1)",
                border:todayDone?"1px solid rgba(39,196,122,.25)":"1px solid rgba(240,165,0,.3)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,
              }}>{todayLesson.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"inline-block",padding:"2px 10px",borderRadius:20,background:todayDone?"rgba(39,196,122,.12)":"rgba(240,165,0,.12)",fontFamily:"'Rajdhani',sans-serif",fontSize:10,letterSpacing:3,color:todayDone?"var(--green)":"var(--gold)",fontWeight:700,marginBottom:6}}>{todayLesson.tag}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:20,letterSpacing:1,fontWeight:700,color:"var(--white)",lineHeight:1.2}}>{todayLesson.title}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--gold)",letterSpacing:1,marginTop:4,fontWeight:600}}>+{todayLesson.xp} XP</div>
              </div>
            </div>
            <p style={{color:"var(--dim)",fontSize:13,lineHeight:1.6,marginBottom:14,fontWeight:400}}>
              {todayLesson.content.slice(0,120)}...
            </p>
            {todayDone
              ? <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",borderRadius:10,background:"rgba(39,196,122,.08)",border:"1px solid rgba(39,196,122,.2)"}}>
                  <span style={{fontSize:18}}>✅</span>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--green)",letterSpacing:1,fontWeight:700}}>UKOŃCZONA DZIŚ — wróć jutro</span>
                </div>
              : <button onClick={startDailyLesson} style={{
                  width:"100%",padding:"14px 0",borderRadius:10,border:"2px solid var(--gold)",
                  background:"linear-gradient(135deg,var(--gold),var(--gold2))",
                  color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:3,fontWeight:700,
                  boxShadow:"0 4px 20px rgba(240,165,0,.25)",
                }}>ZACZNIJ LEKCJĘ DNIA</button>
            }
          </div>
        </div>
      </div>

      {/* ── SEZON 1 ── */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
        <div style={{width:4,height:16,borderRadius:2,background:"var(--blue)"}}/>
        <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:4,color:"var(--dim)",fontWeight:700}}>SEZON 1 — {donePerm}/{LESSONS.length}</span>
        <div style={{flex:1,height:1,background:"var(--navy3)",marginLeft:4}}/>
        <button onClick={()=>setShowAll(v=>!v)} style={{background:"none",border:"1px solid var(--navy3)",borderRadius:8,padding:"4px 12px",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:2,fontWeight:600}}>
          {showAll?"ZWIŃ":"ROZWIŃ"}
        </button>
      </div>

      {(showAll?LESSONS:LESSONS.slice(0,5)).map(lesson=>{
        const done=lessons.includes(lesson.id);
        return <LessonRow key={lesson.id} lesson={lesson} done={done} onStartFn={()=>onStart(lesson)}/>;
      })}

      {!showAll&&LESSONS.length>5&&(
        <button onClick={()=>setShowAll(true)} style={{
          width:"100%",padding:"12px 0",borderRadius:10,border:"1px solid var(--navy3)",
          background:"var(--navy1)",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",
          fontSize:13,letterSpacing:2,fontWeight:600,marginTop:4,
        }}>
          POKAŻ WSZYSTKIE ({LESSONS.length}) →
        </button>
      )}

      {/* ── SEZON 2 ── */}
      <div style={{marginTop:28}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <div style={{width:4,height:16,borderRadius:2,background:s1Complete?"var(--gold)":"var(--navy3)"}}/>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:4,color:s1Complete?"var(--gold)":"var(--dim)",fontWeight:700}}>
            SEZON 2 — {s1Complete?`${donePerm2}/${LESSONS_S2.length}`:"ZABLOKOWANY"}
          </span>
          <div style={{flex:1,height:1,background:"var(--navy3)",marginLeft:4}}/>
          {s1Complete&&<button onClick={()=>setShowAll2(v=>!v)} style={{background:"none",border:"1px solid var(--navy3)",borderRadius:8,padding:"4px 12px",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:2,fontWeight:600}}>
            {showAll2?"ZWIŃ":"ROZWIŃ"}
          </button>}
        </div>

        {!s1Complete?(
          <div style={{padding:20,borderRadius:14,textAlign:"center",background:"var(--navy1)",border:"1px solid var(--navy3)"}}>
            <div style={{fontSize:36,marginBottom:10}}>🔒</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--dim)",letterSpacing:2,fontWeight:700}}>UKOŃCZ SEZON 1 ABY ODBLOKOWAĆ</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--navy3)",marginTop:6,fontWeight:600}}>{LESSONS.length-donePerm} lekcji pozostało</div>
          </div>
        ):(
          <>
            {(showAll2?LESSONS_S2:LESSONS_S2.slice(0,3)).map(lesson=>{
              const done=lessons.includes(lesson.id);
              return <LessonRow key={lesson.id} lesson={lesson} done={done} onStartFn={()=>onStart(lesson)}/>;
            })}
            {!showAll2&&LESSONS_S2.length>3&&(
              <button onClick={()=>setShowAll2(true)} style={{
                width:"100%",padding:"12px 0",borderRadius:10,border:"1px solid var(--navy3)",
                background:"var(--navy1)",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",
                fontSize:13,letterSpacing:2,fontWeight:600,marginTop:4,
              }}>
                POKAŻ WSZYSTKIE ({LESSONS_S2.length}) →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── CHALLENGES TAB ────────────────────────────────────────────────────────────
function ChallengesTab({challenges,tasks,onJoin,onAbandon}){
  return(
    <div style={{padding:"0 18px"}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",marginBottom:16,fontWeight:600}}>AKTYWNE WYZWANIA</div>
      {CHALLENGES.map((ch,i)=>{
        const data=challenges[ch.id];
        const active=data&&data.active;
        const progress=data?data.progress||0:0;
        const pct=(progress/ch.days)*100;
        const todayTask=tasks.includes(ch.task);
        return(
          <div key={ch.id} style={{background:active?"rgba(240,165,0,.05)":"var(--navy1)",border:active?"1px solid rgba(240,165,0,.25)":"1px solid var(--navy3)",borderRadius:14,padding:18,marginBottom:10}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14,marginBottom:active?14:0}}>
              <div style={{width:48,height:48,borderRadius:14,background:active?"rgba(240,165,0,.12)":"var(--navy2)",border:active?"1px solid rgba(240,165,0,.3)":"1px solid var(--navy3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{ch.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:1,fontWeight:700,color:"var(--white)",marginBottom:4}}>{ch.title}</div>
                <div style={{color:"var(--dim)",fontSize:13,marginBottom:8}}>{ch.desc}</div>
                <div style={{display:"flex",gap:12}}>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--blue)",letterSpacing:1,fontWeight:700,background:"rgba(59,158,255,.1)",padding:"2px 8px",borderRadius:6}}>{ch.days} DNI</span>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--gold)",letterSpacing:1,fontWeight:700,background:"rgba(240,165,0,.1)",padding:"2px 8px",borderRadius:6}}>+{ch.xp} XP</span>
                </div>
              </div>
              {!active
                ?<button onClick={()=>onJoin(ch.id)} style={{padding:"9px 16px",borderRadius:10,border:"1px solid var(--gold)",background:"rgba(240,165,0,.1)",color:"var(--gold)",fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:2,fontWeight:700,flexShrink:0}}>DOŁĄCZ</button>
                :<button onClick={()=>onAbandon(ch.id)} style={{padding:"9px 12px",borderRadius:10,border:"1px solid rgba(232,57,74,.3)",background:"rgba(232,57,74,.07)",color:"#ff8090",fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:1,fontWeight:600,flexShrink:0}}>PORZUĆ</button>
              }
            </div>
            {active&&(
              <>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--dim)",letterSpacing:1,fontWeight:600}}>POSTĘP</span>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--gold)",letterSpacing:1,fontWeight:700}}>{progress}/{ch.days} DNI</span>
                </div>
                <div style={{height:5,background:"var(--navy3)",borderRadius:3,overflow:"hidden",marginBottom:12}}>
                  <div style={{width:`${Math.min(pct,100)}%`,height:"100%",background:"linear-gradient(90deg,var(--gold),var(--gold2))",borderRadius:3,transition:"width .6s ease"}}/>
                </div>
                <div style={{padding:"10px 14px",borderRadius:10,background:todayTask?"rgba(39,196,122,.08)":"rgba(255,153,0,.06)",border:todayTask?"1px solid rgba(39,196,122,.2)":"1px solid rgba(255,153,0,.2)",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:16}}>{todayTask?"✅":"⏳"}</span>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1,color:todayTask?"var(--green)":"#ffa040",fontWeight:600}}>
                    {todayTask?"DZIŚ ZALICZONE":"WYKONAJ ZADANIE DZIŚ"}
                  </span>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── PROGRESS TAB — wykresy SVG ────────────────────────────────────────────────
function CalendarTab({history,xp,streak,lessons,tasks}){
  const [view,setView]=useState("week"); // week | month
  const today=new Date();
  const todayKey=today.toISOString().split("T")[0];

  // Buduj dane z historii
  const days=[];
  const n=view==="week"?14:30;
  for(let i=n-1;i>=0;i--){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    const data=history[key]||null;
    days.push({
      key,d,
      tasksDone:data?data.tasksDone:0,
      xp:data?data.xp||0:0,
      label:d.getDate()+"",
      dayName:["Nd","Pn","Wt","Śr","Cz","Pt","Sb"][d.getDay()],
    });
  }

  const entries=Object.values(history||{});
  const activeDays=entries.filter(e=>e.tasksDone>0).length;
  const perfectDays=entries.filter(e=>e.tasksDone>=DAILY_TASKS.length).length;
  const totalXP=entries.reduce((s,e)=>s+(e.xp||0),0);
  const avgTasks=activeDays>0?(entries.reduce((s,e)=>s+(e.tasksDone||0),0)/activeDays).toFixed(1):0;
  const consistency=Math.round((activeDays/Math.max(Object.keys(history||{}).length,1))*100);

  // ── WYKRES SŁUPKOWY — aktywność dzienna ──
  function BarChart(){
    const W=320,H=100,PAD=4;
    const maxVal=Math.max(...days.map(d=>d.tasksDone),DAILY_TASKS.length);
    const barW=(W-(days.length-1)*PAD)/days.length;
    return(
      <svg width="100%" viewBox={`0 0 ${W} ${H+24}`} style={{overflow:"visible"}}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0a500"/>
            <stop offset="100%" stopColor="#ffbe33" stopOpacity=".6"/>
          </linearGradient>
          <linearGradient id="barGradG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#27c47a"/>
            <stop offset="100%" stopColor="#27c47a" stopOpacity=".5"/>
          </linearGradient>
        </defs>
        {/* grid lines */}
        {[0,.5,1].map(r=>(
          <line key={r} x1={0} y1={H*(1-r)} x2={W} y2={H*(1-r)}
            stroke="rgba(255,255,255,.05)" strokeWidth="1"/>
        ))}
        {/* bars */}
        {days.map((d,i)=>{
          const h=maxVal>0?(d.tasksDone/maxVal)*H:0;
          const x=i*(barW+PAD);
          const isToday=d.key===todayKey;
          const perfect=d.tasksDone>=DAILY_TASKS.length;
          return(
            <g key={d.key}>
              {/* bg bar */}
              <rect x={x} y={0} width={barW} height={H} rx={3}
                fill="rgba(255,255,255,.03)"/>
              {/* value bar */}
              <rect x={x} y={H-h} width={barW} height={h} rx={3}
                fill={perfect?"url(#barGradG)":isToday?"url(#barGrad)":"rgba(240,165,0,.35)"}/>
              {/* today indicator */}
              {isToday&&<rect x={x} y={H+4} width={barW} height={3} rx={1.5} fill="#f0a500"/>}
              {/* label every 2nd */}
              {i%2===0&&(
                <text x={x+barW/2} y={H+18} textAnchor="middle"
                  fill={isToday?"#f0a500":"#44556a"} fontSize="9"
                  fontFamily="'Rajdhani',sans-serif" fontWeight="700">
                  {view==="week"?d.dayName:d.label}
                </text>
              )}
            </g>
          );
        })}
        {/* max line */}
        <line x1={0} y1={0} x2={W} y2={0}
          stroke="rgba(39,196,122,.3)" strokeWidth="1" strokeDasharray="4,3"/>
        <text x={W+4} y={4} fill="#27c47a" fontSize="8"
          fontFamily="'Rajdhani',sans-serif" fontWeight="700">MAX</text>
      </svg>
    );
  }

  // ── WYKRES LINIOWY — XP w czasie ──
  function LineChart(){
    const W=320,H=80;
    // Kumulatywne XP
    let cum=0;
    const points=days.map((d,i)=>{
      cum+=d.xp;
      return{x:i,y:cum,raw:d.xp};
    });
    const maxY=Math.max(...points.map(p=>p.y),1);
    const toSVG=(p)=>({
      x:(p.x/(days.length-1))*W,
      y:H-(p.y/maxY)*H,
    });
    const coords=points.map(toSVG);
    const pathD=coords.map((c,i)=>`${i===0?"M":"L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(" ");
    const areaD=`${pathD} L${W},${H} L0,${H} Z`;
    return(
      <svg width="100%" viewBox={`0 0 ${W} ${H+4}`} style={{overflow:"visible"}}>
        <defs>
          <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b9eff" stopOpacity=".25"/>
            <stop offset="100%" stopColor="#3b9eff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0,.5,1].map(r=>(
          <line key={r} x1={0} y1={H*(1-r)} x2={W} y2={H*(1-r)}
            stroke="rgba(255,255,255,.04)" strokeWidth="1"/>
        ))}
        <path d={areaD} fill="url(#lineArea)"/>
        <path d={pathD} fill="none" stroke="#3b9eff" strokeWidth="2"
          strokeLinejoin="round" strokeLinecap="round"/>
        {/* dots at non-zero points */}
        {coords.filter((_,i)=>points[i].raw>0).map((c,i)=>(
          <circle key={i} cx={c.x} cy={c.y} r="3"
            fill="#3b9eff" stroke="#162130" strokeWidth="1.5"/>
        ))}
        {/* last dot */}
        {coords.length>0&&(
          <circle cx={coords[coords.length-1].x} cy={coords[coords.length-1].y} r="4"
            fill="#f0a500" stroke="#162130" strokeWidth="2"/>
        )}
      </svg>
    );
  }

  // ── WYKRES KOŁOWY — nawyki ──
  function DonutChart({pct,color,size=72}){
    const r=28,cx=36,cy=36;
    const circ=2*Math.PI*r;
    const dash=circ*(pct/100);
    return(
      <svg width={size} height={size} viewBox="0 0 72 72">
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke="rgba(255,255,255,.06)" strokeWidth="8"/>
        <circle cx={cx} cy={cy} r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{transition:"stroke-dasharray .8s ease"}}/>
        <text x={cx} y={cy+1} textAnchor="middle" dominantBaseline="middle"
          fill={color} fontSize="13" fontFamily="'Bebas Neue',sans-serif"
          letterSpacing="1">{pct}%</text>
      </svg>
    );
  }

  const lessonsDonePct=Math.round((lessons.filter(l=>typeof l==="number").length/LESSONS.length)*100);
  const tasksTodayPct=Math.round((tasks.length/DAILY_TASKS.length)*100);
  const consistencyPct=consistency||0;

  return(
    <div style={{padding:"0 18px 24px"}}>

      {/* ── HEADER ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:600}}>TWÓJ PROGRES</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"var(--white)"}}>DASHBOARD</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["week","month"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{
              padding:"6px 14px",borderRadius:8,border:"none",
              background:view===v?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",
              color:view===v?"var(--navy)":"var(--dim)",
              fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,
            }}>
              {v==="week"?"14 DNI":"30 DNI"}
            </button>
          ))}
        </div>
      </div>

      {/* ── KLUCZOWE METRYKI ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:16}}>
        {[
          {label:"Łączne XP",value:xp.toLocaleString(),sub:"zdobyte",color:"var(--gold)",icon:"⚡"},
          {label:"Streak",value:`${streak} dni`,sub:"z rzędu",color:"#f87171",icon:"🔥"},
          {label:"Aktywne dni",value:activeDays,sub:`z ${Object.keys(history||{}).length||0} dni`,color:"var(--green)",icon:"📅"},
          {label:"Konsekwencja",value:`${consistencyPct}%`,sub:"aktywności",color:"var(--blue)",icon:"🎯"},
        ].map(m=>(
          <div key={m.label} style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:"14px 16px",borderTop:`2px solid ${m.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
              <span style={{fontSize:16}}>{m.icon}</span>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",letterSpacing:2,fontWeight:700}}>{m.label.toUpperCase()}</span>
            </div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:m.color,letterSpacing:2,lineHeight:1}}>{m.value}</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",marginTop:2}}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* ── WYKRES SŁUPKOWY ── */}
      <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:"18px 16px",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:3,color:"var(--dim)",fontWeight:700}}>AKTYWNOŚĆ DZIENNA</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--gold)",fontWeight:600,marginTop:2}}>Średnio {avgTasks} zadań/dzień</div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:10,height:10,borderRadius:2,background:"#27c47a"}}/>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:600}}>Komplet</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:4}}>
              <div style={{width:10,height:10,borderRadius:2,background:"rgba(240,165,0,.35)"}}/>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:600}}>Częściowo</span>
            </div>
          </div>
        </div>
        <BarChart/>
      </div>

      {/* ── WYKRES LINIOWY XP ── */}
      <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:"18px 16px",marginBottom:12}}>
        <div style={{marginBottom:14}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:3,color:"var(--dim)",fontWeight:700}}>WZROST XP W CZASIE</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--blue)",fontWeight:600,marginTop:2}}>Łącznie {totalXP} XP w tym okresie</div>
        </div>
        <LineChart/>
      </div>

      {/* ── WYKRESY KOŁOWE ── */}
      <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:"18px 16px",marginBottom:12}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:3,color:"var(--dim)",fontWeight:700,marginBottom:16}}>UKOŃCZENIE</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
          {[
            {label:"Dziś",pct:tasksTodayPct,color:"var(--gold)"},
            {label:"Lekcje",pct:lessonsDonePct,color:"var(--blue)"},
            {label:"Konsekwencja",pct:consistencyPct,color:"var(--green)"},
          ].map(d=>(
            <div key={d.label} style={{textAlign:"center"}}>
              <DonutChart pct={d.pct} color={d.color}/>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",letterSpacing:1,fontWeight:700,marginTop:6}}>{d.label.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HEATMAP KALENDARZA ── */}
      <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:"18px 16px"}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:3,color:"var(--dim)",fontWeight:700,marginBottom:12}}>MAPA AKTYWNOŚCI — 30 DNI</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>
          {["Pn","Wt","Śr","Cz","Pt","Sb","Nd"].map(d=>(
            <div key={d} style={{textAlign:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:600}}>{d}</div>
          ))}
        </div>
        {(()=>{
          const cal=[];
          for(let i=29;i>=0;i--){
            const d=new Date(today);d.setDate(d.getDate()-i);
            const key=d.toISOString().split("T")[0];
            const data=history[key]||null;
            const done=data?data.tasksDone:0;
            const pct=done/DAILY_TASKS.length;
            const isToday=key===todayKey;
            let bg="var(--navy2)";
            if(pct>=1) bg="var(--gold)";
            else if(pct>=.6) bg="rgba(240,165,0,.45)";
            else if(pct>=.3) bg="rgba(240,165,0,.2)";
            cal.push(
              <div key={key} title={`${d.getDate()}/${d.getMonth()+1}: ${done}/${DAILY_TASKS.length} zadań`}
                style={{aspectRatio:"1",borderRadius:6,background:bg,
                  border:isToday?"2px solid var(--gold)":"1px solid transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"default",
                }}>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,
                  color:pct>=1?"var(--navy)":pct>0?"rgba(240,165,0,.9)":"var(--navy3)",fontWeight:700}}>
                  {d.getDate()}
                </span>
              </div>
            );
          }
          return<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>{cal}</div>;
        })()}
        <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
          {[
            {c:"var(--gold)",l:"Komplet"},
            {c:"rgba(240,165,0,.45)",l:"60%+"},
            {c:"rgba(240,165,0,.2)",l:"30%+"},
            {c:"var(--navy2)",l:"Brak"},
          ].map(l=>(
            <div key={l.l} style={{display:"flex",alignItems:"center",gap:5}}>
              <div style={{width:12,height:12,borderRadius:3,background:l.c}}/>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:600}}>{l.l}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ── LEADERBOARD TAB ───────────────────────────────────────────────────────────
function LeaderboardTab({userEmail}){
  const [realUsers,setRealUsers]=useState([]);
  useEffect(()=>{
    api("/leaderboard").then(list=>{
      setRealUsers(list.map(u=>({...u,isMe:u.email===userEmail})));
    }).catch(()=>{});
  },[]);
  const combined=[...MOCK_LB,...realUsers].sort((a,b)=>b.xp-a.xp).slice(0,12);
  const medals=["🥇","🥈","🥉"];
  return(
    <div style={{padding:"0 18px"}}>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",marginBottom:16,fontWeight:600}}>TOP WOJOWNICY</div>
      {combined.map((u,i)=>(
        <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:12,marginBottom:8,background:u.isMe?"rgba(240,165,0,.07)":"var(--navy1)",border:u.isMe?"1px solid rgba(240,165,0,.3)":"1px solid var(--navy3)"}}>
          <div style={{width:30,textAlign:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:i<3?22:16,color:i<3?"var(--gold)":"var(--dim)",flexShrink:0,letterSpacing:1}}>
            {i<3?medals[i]:i+1}
          </div>
          <div style={{width:38,height:38,borderRadius:12,background:u.isMe?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Rajdhani',sans-serif",fontSize:17,fontWeight:700,color:u.isMe?"var(--navy)":"var(--dim)",flexShrink:0,border:u.isMe?"none":"1px solid var(--navy3)"}}>
            {u.avatar}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:1,fontWeight:700,color:u.isMe?"var(--gold)":"var(--white)"}}>{u.name}{u.isMe?" (TY)":""}</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--dim)",letterSpacing:1,marginTop:2,fontWeight:600}}>🔥 {u.streak} dni</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:i<3?"var(--gold)":"var(--text)",letterSpacing:2}}>{u.xp.toLocaleString()}</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",letterSpacing:2,fontWeight:600}}>XP</div>
          </div>
        </div>
      ))}
      <div style={{padding:18,borderRadius:12,background:"var(--navy1)",border:"1px solid var(--navy3)",textAlign:"center",marginTop:6}}>
        <a href="https://dyscyplinawojownika.pl" target="_blank" rel="noreferrer" style={{color:"var(--gold)",fontSize:13,textDecoration:"none",fontFamily:"'Rajdhani',sans-serif",letterSpacing:3,fontWeight:700}}>↗ DYSCYPLINAWOJOWNIKA.PL</a>
      </div>
    </div>
  );
}

// ── PROFILE SHEET ─────────────────────────────────────────────────────────────
function ProfileSheet({user,email,xp,streak,lessonsDone,isPremium,onClose,onLogout,onShare,onActivatePremium}){
  const lvl=getLvl(xp);
  return(
    <div style={{position:"fixed",inset:0,zIndex:150,display:"flex",alignItems:"flex-end",background:"rgba(0,0,0,.7)"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",background:"var(--navy1)",borderRadius:"20px 20px 0 0",border:"1px solid var(--navy3)",borderBottom:"none",padding:28,animation:"fadeUp .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"var(--navy3)",borderRadius:2,margin:"0 auto 24px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:24}}>
          <div style={{width:56,height:56,borderRadius:18,flexShrink:0,background:"linear-gradient(135deg,var(--gold),var(--gold2))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:"var(--navy)",letterSpacing:2}}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:"var(--white)"}}>{user.name.toUpperCase()}</div>
              {isPremium&&<div style={{background:"rgba(240,165,0,.15)",border:"1px solid rgba(240,165,0,.4)",borderRadius:6,padding:"2px 8px",fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--gold)",letterSpacing:2,fontWeight:700}}>PRO</div>}
            </div>
            <div style={{color:"var(--dim)",fontSize:12,marginTop:2}}>{email}</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:16}}>
          {[{l:"POZIOM",v:`${lvl.level}`,c:"var(--gold)"},{l:"XP",v:xp,c:"var(--blue)"},{l:"STREAK",v:`${streak}d`,c:"var(--green)"},{l:"LEKCJE",v:`${lessonsDone}/${LESSONS.length}`,c:"#a78bfa"}].map(s=>(
            <div key={s.l} style={{background:"var(--navy2)",border:"1px solid var(--navy3)",borderRadius:12,padding:"12px 8px",textAlign:"center",borderTop:`2px solid ${s.c}`}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:s.c,letterSpacing:2}}>{s.v}</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",letterSpacing:1,marginTop:2,fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>
        <button onClick={onShare} style={{width:"100%",padding:"13px 0",borderRadius:12,border:"1px solid rgba(240,165,0,.3)",background:"rgba(240,165,0,.07)",color:"var(--gold)",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:3,fontWeight:700,marginBottom:10}}>
          📤 UDOSTĘPNIJ STREAK
        </button>
        {!isPremium&&(
          <button onClick={onActivatePremium} style={{width:"100%",padding:"13px 0",borderRadius:12,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:3,fontWeight:700,marginBottom:10,boxShadow:"0 4px 20px rgba(240,165,0,.2)"}}>
            ⚔️ AKTYWUJ PREMIUM
          </button>
        )}
        <a href="https://dyscyplinawojownika.pl" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"12px 0",borderRadius:12,background:"var(--navy2)",border:"1px solid var(--navy3)",color:"var(--dim)",fontSize:13,fontFamily:"'Rajdhani',sans-serif",letterSpacing:3,textDecoration:"none",marginBottom:10,fontWeight:700}}>↗ DYSCYPLINAWOJOWNIKA.PL</a>
        <button onClick={onLogout} style={{width:"100%",padding:"13px 0",borderRadius:12,background:"rgba(232,57,74,.08)",border:"1px solid rgba(232,57,74,.25)",color:"#ff8090",fontFamily:"'Rajdhani',sans-serif",fontSize:15,letterSpacing:3,fontWeight:700}}>WYLOGUJ SIĘ</button>
      </div>
    </div>
  );
}

// ── ONBOARDING ────────────────────────────────────────────────────────────────
function Onboarding({name,onDone}){
  const [step,setStep]=useState(0);
  const slides=[
    {icon:"⚔️",title:`Witaj, ${name}`,sub:"Pierwsza polska apka do budowania dyscypliny. Gotowy na zmianę?"},
    {icon:"⚡",title:"Codzienne zadania",sub:"10 nawyków dziennie. Odhaczasz każde — zdobywasz XP i budujesz streak."},
    {icon:"📚",title:"Lekcja każdego dnia",sub:"Każdy dzień inna lekcja z wiedzy o dyscyplinie, mindset i sile woli."},
    {icon:"🔥",title:"Streak to wszystko",sub:"Nie przerwij serii. Im dłuższy streak — tym wyższy poziom i ranking."},
  ];
  const s=slides[step];
  return(
    <div style={{position:"fixed",inset:0,zIndex:500,background:"var(--navy)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32}}>
      <NavyBg/>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380,textAlign:"center"}}>
        <div style={{fontSize:72,marginBottom:24,animation:"fadeUp .4s ease"}}>{s.icon}</div>
        <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:40,letterSpacing:3,color:"var(--white)",marginBottom:12,animation:"fadeUp .4s .05s ease both"}}>{s.title}</h2>
        <p style={{color:"var(--dim)",fontSize:16,lineHeight:1.65,marginBottom:48,animation:"fadeUp .4s .1s ease both"}}>{s.sub}</p>
        {/* dots */}
        <div style={{display:"flex",justifyContent:"center",gap:8,marginBottom:36}}>
          {slides.map((_,i)=>(
            <div key={i} style={{width:i===step?24:8,height:8,borderRadius:4,background:i===step?"var(--gold)":"var(--navy3)",transition:"all .3s"}}/>
          ))}
        </div>
        <button onClick={()=>step<slides.length-1?setStep(step+1):onDone()} style={{
          width:"100%",padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",
          background:"linear-gradient(135deg,var(--gold),var(--gold2))",
          color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:18,letterSpacing:3,fontWeight:700,
          boxShadow:"0 6px 24px rgba(240,165,0,.3)",animation:"pulseGold 2s infinite",
        }}>
          {step<slides.length-1?"DALEJ →":"ZACZYNAM ⚔️"}
        </button>
        {step>0&&<button onClick={()=>setStep(step-1)} style={{background:"none",border:"none",color:"var(--dim)",fontSize:13,marginTop:16,fontFamily:"'Rajdhani',sans-serif",letterSpacing:2,fontWeight:600}}>← WRÓĆ</button>}
      </div>
    </div>
  );
}

// ── PAYWALL ───────────────────────────────────────────────────────────────────
function Paywall({onUnlock,onClose}){
  const [code,setCode]=useState("");
  const [err,setErr]=useState("");
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  const [planLoading,setPlanLoading]=useState(null);

  async function buyPlan(planId){
    setPlanLoading(planId);
    try{
      const data=await api("/create-checkout-session","POST",{planId});
      if(data.url) window.location.href=data.url;
    }catch(e){
      alert("Błąd płatności: "+e.message);
    }finally{
      setPlanLoading(null);
    }
  }

  async function tryCode(){
    if(!code.trim()) return;
    setLoading(true);
    setErr("");
    try{
      await api("/activate-premium","POST",{code:code.trim().toUpperCase()});
      setSuccess(true);
      setTimeout(()=>onUnlock(code.trim().toUpperCase()),800);
    }catch(e){
      setErr(e.message||"Nieprawidłowy kod.");
    }finally{
      setLoading(false);
    }
  }

  return(
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(6,6,12,.97)",display:"flex",flexDirection:"column",overflowY:"auto"}}>
      <NavyBg/>

      {/* ── X BUTTON — zawsze widoczny na górze ── */}
      <div style={{
        position:"sticky",top:0,zIndex:10,
        display:"flex",justifyContent:"flex-end",
        padding:"16px 20px",
        background:"rgba(6,6,12,.8)",
        backdropFilter:"blur(10px)",
        borderBottom:"1px solid rgba(255,255,255,.04)",
      }}>
        <button onClick={onClose} style={{
          display:"flex",alignItems:"center",gap:8,
          background:"var(--navy2)",border:"1px solid var(--navy3)",
          borderRadius:10,padding:"8px 16px",
          color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",
          fontSize:13,letterSpacing:2,fontWeight:700,cursor:"pointer",
          transition:"all .2s",
        }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--dim)";e.currentTarget.style.color="var(--white)";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--navy3)";e.currentTarget.style.color="var(--dim)";}}>
          ✕ ZAMKNIJ
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px 20px 40px"}}>
        <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:380,textAlign:"center"}}>

          <div style={{fontSize:52,marginBottom:16}}>🔒</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",marginBottom:10,fontWeight:700}}>DOSTĘP PREMIUM</div>
          <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:34,letterSpacing:3,color:"var(--white)",marginBottom:8,lineHeight:1}}>
            Ta funkcja wymaga<br/>dostępu premium
          </h2>
          <p style={{color:"var(--dim)",fontSize:14,lineHeight:1.6,marginBottom:28,fontWeight:300}}>
            Wybierz plan i odbierz pełny dostęp.<br/>Już od <strong style={{color:"var(--gold)"}}>29 zł/miesiąc</strong> przy planie rocznym.
          </p>

          {/* Perks */}
          <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:"4px 16px",marginBottom:20,textAlign:"left"}}>
            {[
              {icon:"📚",text:"30 lekcji dyscypliny"},
              {icon:"🏆",text:"Wyzwania 7 i 30-dniowe"},
              {icon:"📅",text:"Kalendarz nawyków"},
              {icon:"👑",text:"Pełny ranking wojowników"},
              {icon:"🔥",text:"Ochrona streaka"},
            ].map((f,i,arr)=>(
              <div key={f.text} style={{
                display:"flex",alignItems:"center",gap:12,
                padding:"12px 0",
                borderBottom:i<arr.length-1?"1px solid var(--navy3)":"none",
              }}>
                <span style={{fontSize:18,flexShrink:0}}>{f.icon}</span>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--text)",fontWeight:600,letterSpacing:.5}}>{f.text}</span>
                <span style={{marginLeft:"auto",color:"var(--green)",fontSize:14}}>✓</span>
              </div>
            ))}
          </div>

          {/* Plany cenowe */}
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>

            {/* Plan 3-miesięczny — NAJPOPULARNIEJSZY */}
            <div onClick={()=>buyPlan("quarterly")} style={{borderRadius:14,border:"2px solid #3b9eff",background:"linear-gradient(135deg,rgba(59,158,255,.12),rgba(59,158,255,.06))",padding:"16px 18px",position:"relative",overflow:"hidden",cursor:"pointer",opacity:planLoading==="quarterly"?.7:1,transition:"opacity .2s"}}>
              <div style={{position:"absolute",top:10,right:10,background:"#3b9eff",color:"#fff",fontFamily:"'Rajdhani',sans-serif",fontSize:10,fontWeight:700,letterSpacing:2,padding:"3px 8px",borderRadius:6}}>NAJPOPULARNIEJSZY</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"#3b9eff",letterSpacing:3,fontWeight:700,marginBottom:4}}>PLAN 3-MIESIĘCZNY</div>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"var(--white)",letterSpacing:2}}>97 ZŁ</span>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",fontWeight:600,textDecoration:"line-through"}}>141 ZŁ</span>
              </div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#3b9eff",fontWeight:700,letterSpacing:1}}>
                {planLoading==="quarterly"?"PRZEKIEROWUJĘ...":"✓ OSZCZĘDZASZ 44 ZŁ · tylko 32 zł/mies"}
              </div>
            </div>

            {/* Plan roczny */}
            <div onClick={()=>buyPlan("yearly")} style={{borderRadius:14,border:"1px solid rgba(240,165,0,.4)",background:"rgba(240,165,0,.05)",padding:"16px 18px",position:"relative",overflow:"hidden",cursor:"pointer",opacity:planLoading==="yearly"?.7:1,transition:"opacity .2s"}}>
              <div style={{position:"absolute",top:10,right:10,background:"rgba(240,165,0,.2)",border:"1px solid rgba(240,165,0,.4)",color:"var(--gold)",fontFamily:"'Rajdhani',sans-serif",fontSize:10,fontWeight:700,letterSpacing:2,padding:"3px 8px",borderRadius:6}}>NAJLEPSZA CENA</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--gold)",letterSpacing:3,fontWeight:700,marginBottom:4}}>PLAN ROCZNY</div>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"var(--white)",letterSpacing:2}}>349 ZŁ</span>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",fontWeight:600,textDecoration:"line-through"}}>564 ZŁ</span>
              </div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--green)",fontWeight:700,letterSpacing:1}}>
                {planLoading==="yearly"?"PRZEKIEROWUJĘ...":"✓ OSZCZĘDZASZ 215 ZŁ · tylko 29 zł/mies"}
              </div>
            </div>

            {/* Plan miesięczny */}
            <div onClick={()=>buyPlan("monthly")} style={{borderRadius:14,border:"1px solid var(--navy3)",background:"var(--navy1)",padding:"16px 18px",cursor:"pointer",opacity:planLoading==="monthly"?.7:1,transition:"opacity .2s"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",letterSpacing:3,fontWeight:700,marginBottom:4}}>PLAN MIESIĘCZNY</div>
              <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:4}}>
                <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"var(--white)",letterSpacing:2}}>47 ZŁ</span>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",fontWeight:600}}>/miesiąc</span>
              </div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",fontWeight:600,letterSpacing:1}}>
                {planLoading==="monthly"?"PRZEKIEROWUJĘ...":"Bez zobowiązań — anuluj kiedy chcesz"}
              </div>
            </div>

          </div>

          {/* Divider */}
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <div style={{flex:1,height:1,background:"var(--navy3)"}}/>
            <span style={{color:"var(--dim)",fontSize:11,fontFamily:"'Rajdhani',sans-serif",letterSpacing:3,fontWeight:700,whiteSpace:"nowrap"}}>MAM JUŻ KOD</span>
            <div style={{flex:1,height:1,background:"var(--navy3)"}}/>
          </div>

          {/* Kod input — poprawiony */}
          {success ? (
            <div style={{padding:"16px",borderRadius:12,background:"rgba(39,196,122,.1)",border:"1px solid rgba(39,196,122,.3)",textAlign:"center"}}>
              <div style={{fontSize:28,marginBottom:6}}>✅</div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"var(--green)",letterSpacing:2}}>DOSTĘP AKTYWOWANY</div>
            </div>
          ) : (
            <div>
              <div style={{
                background:"var(--navy1)",
                border:`1px solid ${err?"rgba(232,57,74,.5)":"var(--navy3)"}`,
                borderRadius:12,overflow:"hidden",
                transition:"border-color .2s",
                boxShadow:err?"0 0 0 3px rgba(232,57,74,.1)":"none",
              }}>
                <input
                  value={code}
                  onChange={e=>{setCode(e.target.value.toUpperCase());setErr("");}}
                  placeholder="WPISZ KOD DOSTĘPU"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck="false"
                  style={{
                    width:"100%",
                    padding:"16px 18px",
                    background:"transparent",
                    border:"none",
                    color:"var(--white)",
                    fontSize:16,
                    fontFamily:"'Rajdhani',sans-serif",
                    letterSpacing:3,
                    fontWeight:700,
                    textAlign:"center",
                  }}
                  onKeyDown={e=>e.key==="Enter"&&tryCode()}
                />
                <div style={{height:1,background:"var(--navy3)"}}/>
                <button
                  onClick={tryCode}
                  disabled={loading||!code.trim()}
                  style={{
                    width:"100%",padding:"14px",border:"none",
                    background:code.trim()
                      ? loading ? "var(--navy3)" : "linear-gradient(135deg,var(--gold),var(--gold2))"
                      : "var(--navy2)",
                    color:code.trim()&&!loading?"var(--navy)":"var(--dim)",
                    fontFamily:"'Rajdhani',sans-serif",fontSize:15,
                    letterSpacing:3,fontWeight:700,cursor:code.trim()?"pointer":"default",
                    transition:"all .2s",
                  }}
                >
                  {loading ? "SPRAWDZAM..." : "AKTYWUJ DOSTĘP →"}
                </button>
              </div>

              {err&&(
                <div style={{
                  display:"flex",alignItems:"center",gap:8,
                  marginTop:10,padding:"10px 14px",
                  borderRadius:10,
                  background:"rgba(232,57,74,.08)",
                  border:"1px solid rgba(232,57,74,.25)",
                }}>
                  <span style={{fontSize:16}}>❌</span>
                  <div>
                    <div style={{color:"#ff8090",fontSize:13,fontFamily:"'Rajdhani',sans-serif",fontWeight:700,letterSpacing:.5}}>{err}</div>
                    <a href="https://dyscyplinawojownika.pl" target="_blank" rel="noreferrer"
                      style={{color:"var(--gold)",fontSize:12,fontFamily:"'Rajdhani',sans-serif",fontWeight:600,letterSpacing:1}}>
                      Kup dostęp →
                    </a>
                  </div>
                </div>
              )}

              <p style={{color:"var(--dim)",fontSize:11,marginTop:12,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1,fontWeight:600}}>
                Kod dostaniesz emailem po zakupie na dyscyplinawojownika.pl
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── SHARE STREAK ──────────────────────────────────────────────────────────────
function ShareStreakModal({streak,name,xp,onClose}){
  const lvl=getLvl(xp);
  const text=`🔥 Dzień ${streak} z rzędu!\n⚔️ ${name} — poziom ${lvl.level} ${lvl.name}\n💪 ${xp} XP zdobyte\n\nDyscyplina Wojownika — dyscyplinawojownika.pl`;
  function share(){
    if(navigator.share){navigator.share({title:"Dyscyplina Wojownika",text});}
    else{navigator.clipboard.writeText(text).then(()=>alert("Skopiowano do schowka!"));}
  }
  return(
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex",alignItems:"flex-end",background:"rgba(0,0,0,.7)"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",background:"var(--navy1)",borderRadius:"20px 20px 0 0",border:"1px solid var(--navy3)",borderBottom:"none",padding:28,animation:"slideIn .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"var(--navy3)",borderRadius:2,margin:"0 auto 24px"}}/>

        {/* Streak card preview */}
        <div style={{background:"linear-gradient(135deg,var(--navy2),var(--navy3))",border:"2px solid rgba(240,165,0,.3)",borderRadius:16,padding:24,textAlign:"center",marginBottom:20}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:64,color:"var(--gold)",lineHeight:1,letterSpacing:2}}>🔥 {streak}</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--dim)",letterSpacing:3,marginTop:4,fontWeight:600}}>DNI Z RZĘDU</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"var(--white)",letterSpacing:2,marginTop:8}}>{name.toUpperCase()}</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--gold)",letterSpacing:2,marginTop:4,fontWeight:700}}>LVL {lvl.level} {lvl.name.toUpperCase()} · {xp} XP</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",letterSpacing:3,marginTop:12,fontWeight:600}}>DYSCYPLINA WOJOWNIKA · DYSCYPLINAWOJOWNIKA.PL</div>
        </div>

        <button onClick={share} style={{
          width:"100%",padding:"16px 0",borderRadius:12,border:"2px solid var(--gold)",
          background:"linear-gradient(135deg,var(--gold),var(--gold2))",
          color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:3,fontWeight:700,
          marginBottom:10,boxShadow:"0 6px 24px rgba(240,165,0,.25)",
        }}>
          📤 UDOSTĘPNIJ STREAK
        </button>
        <button onClick={onClose} style={{width:"100%",padding:"12px 0",borderRadius:12,border:"1px solid var(--navy3)",background:"transparent",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2,fontWeight:600}}>ZAMKNIJ</button>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function App(){
  const [userEmail,setUserEmail]=useState(null);
  const [userData,setUserData]=useState(null);
  const [tab,setTab]=useState("tasks");
  const [activeLesson,setActiveLesson]=useState(null);
  const [xpFlash,setXpFlash]=useState(null);
  const [showProfile,setShowProfile]=useState(false);
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [showPaywall,setShowPaywall]=useState(false);
  const [paywallFeature,setPaywallFeature]=useState("");
  const [showShare,setShowShare]=useState(false);
  const [checkAnim,setCheckAnim]=useState(null);
  const [appLoading,setAppLoading]=useState(true);
  const [newBadge,setNewBadge]=useState(null);
  const [showWeeklyReport,setShowWeeklyReport]=useState(false);

  // Przy starcie sprawdź token i załaduj dane
  useEffect(()=>{
    // Obsługa ?verified=1 — potwierdzenie emaila
    if(new URLSearchParams(window.location.search).get("verified")==="1"){
      window.history.replaceState({},"","/");
      alert("✅ Konto aktywowane! Możesz się teraz zalogować.");
    }
    const token=getToken();
    if(!token){setAppLoading(false);return;}
    api("/me").then(me=>{
      const reset=checkDailyReset(me);
      setUserData(reset);
      setUserEmail(me.email);
      if(!me.onboarded) setShowOnboarding(true);
      if(reset!==me) syncToServer(reset); // zapisz reset jeśli był
    }).catch(()=>{
      clearToken();
    }).finally(()=>setAppLoading(false));
  },[]);

  // Automatyczny reset dokładnie o północy
  useEffect(()=>{
    if(!userData) return;

    function scheduleReset(){
      const now=new Date();
      const midnight=new Date();
      midnight.setHours(24,0,0,500); // jutro 00:00:00.5
      const msUntilMidnight=midnight-now;

      const timer=setTimeout(()=>{
        // Północ nastąpiła — wykonaj reset
        setUserData(prev=>{
          if(!prev) return prev;
          const reset=checkDailyReset(prev);
          syncToServer(reset);
          return reset;
        });
        // Zaplanuj kolejny reset za 24h
        scheduleReset();
      },msUntilMidnight);

      return timer;
    }

    const timer=scheduleReset();
    return()=>clearTimeout(timer);
  },[!!userData]);

  // Sync danych z serwerem
  async function syncToServer(data){
    try{ await api("/sync","POST",data); }catch(e){ console.warn("Sync failed:",e.message); }
  }

  function persist(updated){
    // Sprawdź odznaki
    const withBadges=checkBadges(updated);
    const earned=withBadges.badges||[];
    const prev=updated.badges||[];
    const justEarned=earned.filter(id=>!prev.includes(id));
    if(justEarned.length){
      const badge=BADGES.find(b=>b.id===justEarned[0]);
      if(badge) setNewBadge(badge);
    }
    setUserData(withBadges);
    syncToServer(withBadges);
  }

  const flash=amt=>{setXpFlash(`+${amt} XP`);setTimeout(()=>setXpFlash(null),1600);};

  function requirePremium(feature,fn){
    if(userData?.is_premium){fn();}
    else{setPaywallFeature(feature);setShowPaywall(true);}
  }

  function toggleTask(id,xp){
    const tasks=userData.tasks||[];
    const done=tasks.includes(id);
    if(!done){setCheckAnim(id);setTimeout(()=>setCheckAnim(null),400);}
    const xp2x=userData.xp2xUntil&&new Date(userData.xp2xUntil)>new Date();
    const earnedXp=(!done&&xp2x)?xp*2:xp;
    const updated={
      ...userData,
      tasks:done?tasks.filter(t=>t!==id):[...tasks,id],
      xp:done?Math.max(0,(userData.xp||0)-xp):(userData.xp||0)+earnedXp,
    };
    // Zapis historii
    const today=TODAY();
    const newTasks=updated.tasks;
    const todayXp=newTasks.reduce((s,tid)=>{const t=DAILY_TASKS.find(t=>t.id===tid);return s+(t?t.xp:0);},0);
    updated.history={...(userData.history||{}),[today]:{tasksDone:newTasks.length,xp:todayXp}};
    persist(updated);
    if(!done)flash(earnedXp);
  }

  function completeLesson(lesson){
    const lessons=userData.lessons||[];
    const key=lesson.dailyKey||lesson.id;
    if(!lessons.includes(key)){
      persist({...userData,lessons:[...lessons,key],xp:(userData.xp||0)+lesson.xp});
      flash(lesson.xp);
    }
    setActiveLesson(null);
  }

  async function unlockPremium(code){
    try{
      await api("/activate-premium","POST",{code});
      persist({...userData,is_premium:true});
      setShowPaywall(false);
      flash(100);
    }catch(e){
      // fallback lokalny
      persist({...userData,is_premium:true});
      setShowPaywall(false);
      flash(100);
    }
  }

  const joinChallenge=id=>requirePremium("wyzwania",()=>{
    const c={...(userData.challenges||{}),[id]:{active:true,progress:0,startDate:TODAY()}};
    persist({...userData,challenges:c});
  });
  const abandonChallenge=id=>{
    const c={...(userData.challenges||{})};
    delete c[id];
    persist({...userData,challenges:c});
  };
  const logout=()=>{
    clearToken();
    setUserEmail(null);
    setUserData(null);
    setShowProfile(false);
  };

  // Ekran ładowania
  if(appLoading) return(
    <>
      <style>{GCSS}</style>
      <div style={{minHeight:"100vh",background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
        <NavyBg/>
        <div style={{fontSize:48,animation:"fadeUp .5s ease"}}>⚔️</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:4,color:"var(--gold)"}}>ŁADOWANIE...</div>
      </div>
    </>
  );

  if(!userEmail||!userData) return(
    <>
      <style>{GCSS}</style>
      <AuthScreen onAuth={(email,data)=>{
        const reset=checkDailyReset(data);
        setUserEmail(email);
        setUserData(reset);
        if(!data.onboarded) setShowOnboarding(true);
      }}/>
    </>
  );

  const xp=userData.xp||0;
  const tasks=userData.tasks||[];
  const lessons=userData.lessons||[];
  const streak=userData.streak||1;
  const challenges=userData.challenges||{};
  const history=userData.history||{};
  const isPremium=userData.is_premium||false;
  const activeChallenges=Object.values(challenges).filter(c=>c.active).length;
  const tasksDone=tasks.length;
  const allDone=tasksDone===DAILY_TASKS.length;

  const TABS=[
    {id:"tasks",     icon:"⚡",  label:"ZADANIA"},
    {id:"lessons",   icon:"📚",  label:"LEKCJE"},
    {id:"myhabits",  icon:"🌱",  label:"NAWYKI"},
    {id:"gratitude", icon:"🙏",  label:"DZIĘKUJĘ"},
    {id:"routine",   icon:"🗓️",  label:"RUTYNA"},
    {id:"goals",      icon:"🎯",  label:"CELE"},
    {id:"ai",        icon:"🤖",  label:"AI"},
    {id:"badges",    icon:"🎖️",  label:"ODZNAKI"},
    {id:"shop",      icon:"🛒",  label:"SKLEP"},
  ];

  return(
    <>
      <style>{GCSS}</style>

      {showOnboarding&&(
        <Onboarding name={userData.name} onDone={()=>{
          persist({...userData,onboarded:true});
          setShowOnboarding(false);
        }}/>
      )}

      {showPaywall&&(
        <Paywall onUnlock={unlockPremium} onClose={()=>setShowPaywall(false)}/>
      )}

      {showShare&&(
        <ShareStreakModal streak={streak} name={userData.name} xp={xp} onClose={()=>setShowShare(false)}/>
      )}

      {activeLesson&&<LessonOverlay lesson={activeLesson} onComplete={()=>completeLesson(activeLesson)} onClose={()=>setActiveLesson(null)}/>}

      {showProfile&&(
        <ProfileSheet
          user={userData} email={userEmail} xp={xp} streak={streak}
          lessonsDone={lessons.filter(l=>typeof l==="number").length}
          isPremium={isPremium}
          onClose={()=>setShowProfile(false)}
          onLogout={logout}
          onShare={()=>{setShowProfile(false);setShowShare(true);}}
          onActivatePremium={()=>{setShowProfile(false);setShowPaywall(true);}}
        />
      )}

      {newBadge&&<BadgeToast badge={newBadge} onClose={()=>setNewBadge(null)}/>}
      {showWeeklyReport&&<WeeklyReport userData={userData} onClose={()=>setShowWeeklyReport(false)}/>}

      {xpFlash&&(
        <div style={{position:"fixed",top:20,right:20,zIndex:350,padding:"10px 20px",borderRadius:10,pointerEvents:"none",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Bebas Neue',sans-serif",fontSize:22,fontWeight:700,letterSpacing:3,animation:"xpBounce 1.6s ease forwards",boxShadow:"0 4px 24px rgba(240,165,0,.4)"}}>
          {xpFlash}
        </div>
      )}

      <div style={{background:"var(--navy)",minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:88,position:"relative"}}>
        <NavyBg/>

        {/* HEADER */}
        <div style={{position:"sticky",top:0,zIndex:40,background:"var(--navy)",borderBottom:"1px solid var(--navy2)"}}>
          <div style={{height:2,background:"linear-gradient(90deg,transparent,var(--gold),transparent)"}}/>
          <div style={{padding:"14px 18px 12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <a href="https://dyscyplinawojownika.pl" target="_blank" rel="noreferrer" style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,letterSpacing:4,color:"var(--dim)",textDecoration:"none",display:"block",marginBottom:3,fontWeight:600}}>DYSCYPLINAWOJOWNIKA.PL ↗</a>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:4,lineHeight:1}}>
                  Nawyki <span style={{background:"linear-gradient(90deg,var(--gold),var(--gold2))",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Wojownika</span>
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                {/* Raport tygodniowy */}
                <div onClick={()=>setShowWeeklyReport(true)} style={{background:"var(--navy2)",border:"1px solid var(--navy3)",borderRadius:10,padding:"6px 10px",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:15}}>📊</span>
                </div>
                {/* Streak — klikalny */}
                <div onClick={()=>setShowShare(true)} style={{background:"var(--navy2)",border:"1px solid var(--navy3)",borderRadius:10,padding:"6px 12px",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
                  <span style={{fontSize:16}}>🔥</span>
                  <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,color:"var(--gold)",fontWeight:700}}>{streak}{(userData.freezes||0)>0&&<span style={{fontSize:11,marginLeft:2}}>🛡️</span>}</span>
                </div>
                {/* Premium badge */}
                {isPremium&&<div style={{background:"rgba(240,165,0,.15)",border:"1px solid rgba(240,165,0,.4)",borderRadius:8,padding:"4px 8px",fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--gold)",letterSpacing:2,fontWeight:700}}>PRO</div>}
                <div onClick={()=>setShowProfile(true)} style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,var(--gold),var(--gold2))",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"var(--navy)",cursor:"pointer",letterSpacing:1}}>
                  {userData.name?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
            <XPBar xp={xp}/>
          </div>
        </div>

        {/* STATS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,padding:"12px 18px"}}>
          {[
            {l:"ZADANIA",v:`${tasksDone}/${DAILY_TASKS.length}`,c:"var(--green)"},
            {l:"LEKCJE", v:`${lessons.filter(l=>typeof l==="number").length}/${LESSONS.length}`,c:"var(--blue)"},
            {l:"WYZWANIA",v:activeChallenges,c:"var(--gold)"},
            {l:"STREAK",  v:`${streak}d`,c:"#f87171"},
          ].map(s=>(
            <div key={s.l} style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:10,padding:"10px 6px",textAlign:"center",borderTop:`2px solid ${s.c}`}}>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:s.c,letterSpacing:2}}>{s.v}</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:9,color:"var(--dim)",letterSpacing:1,marginTop:2,fontWeight:600}}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ALL DONE BANNER */}
        {allDone&&tab==="tasks"&&(
          <div className="au" style={{margin:"0 18px 16px",padding:"16px 20px",borderRadius:14,background:"rgba(39,196,122,.07)",border:"1px solid rgba(39,196,122,.2)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"var(--green)",letterSpacing:2}}>🔥 DZIEŃ OPANOWANY</div>
              <div style={{color:"var(--dim)",fontSize:12,marginTop:2}}>Wróć jutro · streak {streak} dni</div>
            </div>
            <button onClick={()=>setShowShare(true)} style={{padding:"8px 14px",borderRadius:9,border:"1px solid rgba(39,196,122,.3)",background:"rgba(39,196,122,.1)",color:"var(--green)",fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:2,fontWeight:700}}>
              📤 SHARE
            </button>
          </div>
        )}

        {/* 2× XP banner */}
        {userData.xp2xUntil&&new Date(userData.xp2xUntil)>new Date()&&(
          <div style={{margin:"0 18px 10px",padding:"10px 16px",borderRadius:10,background:"rgba(240,165,0,.08)",border:"1px solid rgba(240,165,0,.3)",display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>⚡</span>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--gold)",fontWeight:700,letterSpacing:1}}>2× XP AKTYWNE — korzystaj!</span>
          </div>
        )}

        {/* CONTENT */}
        <div style={{paddingTop:4}}>
          {tab==="tasks"&&<TasksTab tasks={tasks} onToggle={toggleTask} checkAnim={checkAnim}/>}
          {tab==="lessons"&&<LessonsTab lessons={lessons} onStart={lesson=>{
            if(lesson.id>5&&!isPremium){requirePremium("lekcje",()=>setActiveLesson(lesson));}
            else setActiveLesson(lesson);
          }}/>}
          {tab==="challenges"&&<ChallengesTab challenges={challenges} tasks={tasks} onJoin={joinChallenge} onAbandon={abandonChallenge} isPremium={isPremium} onPaywall={()=>setShowPaywall(true)}/>}
          {tab==="myhabits"&&<MyHabitsTab myHabits={userData.myHabits||[]} onSave={h=>persist({...userData,myHabits:h})}/>}
          {tab==="goals"&&(isPremium?<GoalsTab goals={userData.goals||[]} onSave={g=>persist({...userData,goals:g})}/>:<LockedFeature label="CELE AI" onUnlock={()=>setShowPaywall(true)}/>)}
          {tab==="ai"&&<AiChatTab isPremium={isPremium} userData={userData} onPaywall={()=>setShowPaywall(true)}/>}
          {tab==="badges"&&<BadgesTab userData={userData}/>}
          {tab==="shop"&&<ShopTab xp={xp} userData={userData} onBuy={updates=>persist({...userData,...updates})}/>}
          {tab==="routine"&&<RoutineTab routine={userData.routine||{}} onSave={r=>persist({...userData,routine:r})}/>}
          {tab==="gratitude"&&<GratitudeTab gratitude={userData.gratitude||{}} onSave={g=>persist({...userData,gratitude:g})} flash={flash}/>}
          {tab==="calendar"&&(isPremium
            ?<CalendarTab history={history} xp={xp} streak={streak} lessons={lessons} tasks={tasks}/>
            :<LockedFeature label="DASHBOARD PROGRESU" onUnlock={()=>setShowPaywall(true)}/>
          )}
        </div>
      </div>

      {/* BOTTOM NAV — scrollowany */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"var(--navy1)",borderTop:"2px solid var(--navy2)",zIndex:50,paddingBottom:18}}>
        <div style={{display:"flex",overflowX:"auto",scrollbarWidth:"none",WebkitOverflowScrolling:"touch",paddingTop:8,paddingLeft:4,paddingRight:4}}>
          <style>{`::-webkit-scrollbar{display:none}`}</style>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{
              flexShrink:0,minWidth:64,background:"none",border:"none",
              display:"flex",flexDirection:"column",alignItems:"center",gap:3,
              cursor:"pointer",position:"relative",padding:"0 6px",
            }}>
              <span style={{fontSize:20,filter:tab===t.id?"none":"grayscale(1) opacity(.3)",transition:"filter .2s"}}>{t.icon}</span>
              <span style={{
                fontFamily:"'Rajdhani',sans-serif",fontSize:9,letterSpacing:.5,
                color:tab===t.id?"var(--gold)":"var(--dim)",
                transition:"color .2s",fontWeight:700,whiteSpace:"nowrap",
              }}>{t.label}</span>
              {tab===t.id&&<div style={{width:20,height:2,borderRadius:1,background:"linear-gradient(90deg,var(--gold),var(--gold2))",boxShadow:"0 0 8px rgba(240,165,0,.6)"}}/>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// ── ROUTINE TAB ───────────────────────────────────────────────────────────────
const BLOCKS=[
  {id:"morning",  label:"PORANEK",  icon:"🌅", color:"var(--gold)",  hint:"6:00 – 10:00"},
  {id:"day",      label:"DZIEŃ",    icon:"☀️",  color:"var(--blue)",  hint:"10:00 – 18:00"},
  {id:"evening",  label:"WIECZÓR",  icon:"🌙",  color:"#a78bfa",     hint:"18:00 – 23:00"},
];
const ROUTINE_ICONS=["⚡","💪","📖","🧊","🧘","✍️","💧","🥗","🏃","🎯","🔥","🛌","📵","🎶","🧠","⏱️","🥶","🌿","📞","🙏"];

function RoutineTab({routine,onSave}){
  const [items,setItems]=useState(routine||{morning:[],day:[],evening:[]});
  const [adding,setAdding]=useState(null); // block id
  const [newText,setNewText]=useState("");
  const [newTime,setNewTime]=useState("");
  const [newIcon,setNewIcon]=useState("⚡");
  const [dirty,setDirty]=useState(false);
  const [saved,setSaved]=useState(false);

  function addItem(blockId){
    if(!newText.trim()) return;
    const item={id:Date.now(),text:newText.trim(),time:newTime,icon:newIcon};
    const updated={...items,[blockId]:[...(items[blockId]||[]),item]};
    setItems(updated);setAdding(null);setNewText("");setNewTime("");setNewIcon("⚡");setDirty(true);
  }
  function removeItem(blockId,id){
    const updated={...items,[blockId]:items[blockId].filter(i=>i.id!==id)};
    setItems(updated);setDirty(true);
  }
  function moveItem(blockId,idx,dir){
    const arr=[...items[blockId]];
    const to=idx+dir;
    if(to<0||to>=arr.length) return;
    [arr[idx],arr[to]]=[arr[to],arr[idx]];
    setItems({...items,[blockId]:arr});setDirty(true);
  }
  function save(){
    onSave(items);setDirty(false);setSaved(true);setTimeout(()=>setSaved(false),2000);
  }

  return(
    <div style={{padding:"0 18px 24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:600}}>TWOJA RUTYNA</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"var(--white)"}}>ZAPROJEKTUJ DZIEŃ</div>
        </div>
        {dirty&&(
          <button onClick={save} style={{padding:"9px 18px",borderRadius:10,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:2,fontWeight:700}}>
            ZAPISZ
          </button>
        )}
        {saved&&!dirty&&(
          <div style={{padding:"9px 18px",borderRadius:10,background:"rgba(39,196,122,.1)",border:"1px solid rgba(39,196,122,.3)",color:"var(--green)",fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:2,fontWeight:700}}>
            ✓ ZAPISANO
          </div>
        )}
      </div>

      {/* Tip */}
      <div style={{padding:"12px 16px",borderRadius:12,background:"rgba(240,165,0,.06)",border:"1px solid rgba(240,165,0,.2)",marginBottom:20,display:"flex",gap:10,alignItems:"flex-start"}}>
        <span style={{fontSize:18,flexShrink:0}}>💡</span>
        <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",lineHeight:1.6,fontWeight:600}}>
          Zaprojektuj idealny dzień. Dodaj nawyki do każdego bloku czasowego — poranek, dzień i wieczór.
        </span>
      </div>

      {BLOCKS.map(block=>{
        const blockItems=items[block.id]||[];
        const isAdding=adding===block.id;
        return(
          <div key={block.id} style={{marginBottom:24}}>
            {/* Block header */}
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
              <div style={{width:36,height:36,borderRadius:10,background:`${block.color}18`,border:`1px solid ${block.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{block.icon}</div>
              <div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:3,color:block.color,fontWeight:700}}>{block.label}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",fontWeight:600}}>{block.hint}</div>
              </div>
              <div style={{flex:1,height:1,background:"var(--navy3)",marginLeft:4}}/>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",fontWeight:700}}>{blockItems.length} nawyków</span>
            </div>

            {/* Items */}
            {blockItems.length===0&&!isAdding&&(
              <div style={{padding:"16px",borderRadius:12,border:"1px dashed var(--navy3)",textAlign:"center",color:"var(--navy3)",fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:2,fontWeight:600,marginBottom:8}}>
                BRAK NAWYKÓW — DODAJ PIERWSZY
              </div>
            )}
            {blockItems.map((item,idx)=>(
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",borderRadius:12,marginBottom:6,background:"var(--navy1)",border:`1px solid var(--navy3)`,borderLeft:`3px solid ${block.color}`}}>
                <span style={{fontSize:20,flexShrink:0}}>{item.icon}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:"var(--white)",letterSpacing:.5}}>{item.text}</div>
                  {item.time&&<div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:block.color,fontWeight:600,marginTop:2,letterSpacing:1}}>⏰ {item.time}</div>}
                </div>
                <div style={{display:"flex",gap:4}}>
                  <button onClick={()=>moveItem(block.id,idx,-1)} style={{background:"none",border:"none",color:"var(--dim)",fontSize:14,padding:"2px 6px",cursor:"pointer"}}>▲</button>
                  <button onClick={()=>moveItem(block.id,idx,1)} style={{background:"none",border:"none",color:"var(--dim)",fontSize:14,padding:"2px 6px",cursor:"pointer"}}>▼</button>
                  <button onClick={()=>removeItem(block.id,item.id)} style={{background:"none",border:"1px solid rgba(232,57,74,.3)",borderRadius:6,color:"#ff8090",fontSize:12,padding:"2px 8px",cursor:"pointer"}}>✕</button>
                </div>
              </div>
            ))}

            {/* Add form */}
            {isAdding?(
              <div style={{background:"var(--navy1)",border:`1px solid ${block.color}44`,borderRadius:14,padding:16,marginBottom:6}}>
                {/* Icon picker */}
                <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:12}}>
                  {ROUTINE_ICONS.map(ic=>(
                    <button key={ic} onClick={()=>setNewIcon(ic)} style={{
                      width:34,height:34,borderRadius:8,border:newIcon===ic?`2px solid ${block.color}`:"1px solid var(--navy3)",
                      background:newIcon===ic?`${block.color}22`:"var(--navy2)",fontSize:16,cursor:"pointer",
                    }}>{ic}</button>
                  ))}
                </div>
                <input
                  autoFocus
                  value={newText}
                  onChange={e=>setNewText(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&addItem(block.id)}
                  placeholder="Nazwa nawyku..."
                  style={{width:"100%",padding:"11px 14px",background:"var(--navy2)",border:"1px solid var(--navy3)",borderRadius:10,color:"var(--white)",fontSize:14,fontFamily:"'Inter',sans-serif",marginBottom:8,outline:"none"}}
                />
                <input
                  value={newTime}
                  onChange={e=>setNewTime(e.target.value)}
                  placeholder="Godzina (np. 6:30) — opcjonalnie"
                  style={{width:"100%",padding:"11px 14px",background:"var(--navy2)",border:"1px solid var(--navy3)",borderRadius:10,color:"var(--white)",fontSize:14,fontFamily:"'Inter',sans-serif",marginBottom:12,outline:"none"}}
                />
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>addItem(block.id)} style={{flex:1,padding:"11px 0",borderRadius:10,border:`2px solid ${block.color}`,background:`${block.color}22`,color:block.color,fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2,fontWeight:700}}>DODAJ</button>
                  <button onClick={()=>{setAdding(null);setNewText("");setNewTime("");}} style={{padding:"11px 16px",borderRadius:10,border:"1px solid var(--navy3)",background:"transparent",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1,fontWeight:600}}>ANULUJ</button>
                </div>
              </div>
            ):(
              <button onClick={()=>setAdding(block.id)} style={{width:"100%",padding:"11px 0",borderRadius:10,border:`1px dashed ${block.color}44`,background:"transparent",color:block.color,fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:2,fontWeight:700,marginBottom:4}}>
                + DODAJ NAWYK
              </button>
            )}
          </div>
        );
      })}

      {/* Podgląd — pełny plan dnia */}
      {(items.morning?.length>0||items.day?.length>0||items.evening?.length>0)&&(
        <div style={{marginTop:8,padding:20,borderRadius:16,background:"var(--navy1)",border:"1px solid var(--navy3)"}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:700,marginBottom:16}}>TWÓJ PLAN DNIA</div>
          {BLOCKS.map(block=>{
            const blockItems=items[block.id]||[];
            if(!blockItems.length) return null;
            return(
              <div key={block.id} style={{marginBottom:16}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,letterSpacing:3,color:block.color,fontWeight:700,marginBottom:8}}>{block.icon} {block.label} · {block.hint}</div>
                {blockItems.map((item,i)=>(
                  <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                    <div style={{width:20,height:20,borderRadius:6,background:`${block.color}22`,border:`1px solid ${block.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>{item.icon}</div>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--text)",fontWeight:600,flex:1}}>{item.text}</span>
                    {item.time&&<span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",fontWeight:600}}>{item.time}</span>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── GRATITUDE TAB ─────────────────────────────────────────────────────────────
function GratitudeTab({gratitude,onSave,flash}){
  const today=TODAY();
  const todayEntry=gratitude?.[today]||{items:["","",""],note:""};
  const [items,setItems]=useState(todayEntry.items||["","",""]);
  const [note,setNote]=useState(todayEntry.note||"");
  const [saved,setSaved]=useState(false);
  const [view,setView]=useState("today"); // today | history

  const history=Object.entries(gratitude||{})
    .filter(([d])=>d!==today)
    .sort(([a],[b])=>b.localeCompare(a))
    .slice(0,30);

  const filled=items.filter(i=>i.trim()).length;
  const allFilled=filled===3;

  function save(){
    if(!allFilled) return;
    const updated={...(gratitude||{}),[today]:{items,note,savedAt:new Date().toISOString()}};
    onSave(updated);
    setSaved(true);
    flash&&flash(15);
    setTimeout(()=>setSaved(false),2500);
  }

  function formatDate(key){
    const d=new Date(key);
    return d.toLocaleDateString("pl-PL",{weekday:"short",day:"numeric",month:"short"});
  }

  const alreadySaved=!!gratitude?.[today]?.savedAt;

  return(
    <div style={{padding:"0 18px 32px"}}>

      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:600}}>PRAKTYKA</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"var(--white)"}}>WDZIĘCZNOŚĆ</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["today","history"].map(v=>(
            <button key={v} onClick={()=>setView(v)} style={{
              padding:"6px 14px",borderRadius:8,border:"none",
              background:view===v?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",
              color:view===v?"var(--navy)":"var(--dim)",
              fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:2,fontWeight:700,
            }}>{v==="today"?"DZIŚ":"HISTORIA"}</button>
          ))}
        </div>
      </div>

      {view==="today"&&(
        <>
          {/* Inspiracja */}
          <div style={{padding:"14px 16px",borderRadius:14,background:"rgba(240,165,0,.06)",border:"1px solid rgba(240,165,0,.2)",marginBottom:24,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:22,flexShrink:0}}>🙏</span>
            <div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--gold)",letterSpacing:2,fontWeight:700,marginBottom:4}}>BADANIA HARVARDA</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",lineHeight:1.6,fontWeight:600}}>
                21 dni codziennej wdzięczności trwale zmienia chemię mózgu. Pisz szczerze — nie ogólnie.
              </div>
            </div>
          </div>

          {/* Streak wdzięczności */}
          {(()=>{
            let streak=0;
            const d=new Date();
            while(true){
              const key=d.toISOString().split("T")[0];
              if(gratitude?.[key]?.savedAt) streak++;
              else break;
              d.setDate(d.getDate()-1);
            }
            return streak>0?(
              <div style={{padding:"12px 16px",borderRadius:12,background:"rgba(168,139,250,.08)",border:"1px solid rgba(168,139,250,.25)",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:24}}>✨</span>
                <div>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#a78bfa",letterSpacing:2}}>{streak} DNI Z RZĘDU</div>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",fontWeight:600}}>Kontynuuj praktykę wdzięczności</div>
                </div>
              </div>
            ):null;
          })()}

          {/* 3 rzeczy */}
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:700,marginBottom:12}}>
            ZA CO JESTEŚ DZIŚ WDZIĘCZNY?
          </div>
          {items.map((item,i)=>(
            <div key={i} style={{position:"relative",marginBottom:10}}>
              <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:item.trim()?"var(--gold)":"var(--navy3)",letterSpacing:1,pointerEvents:"none",zIndex:1}}>
                {i+1}
              </div>
              <input
                value={item}
                onChange={e=>{const a=[...items];a[i]=e.target.value;setItems(a);setSaved(false);}}
                placeholder={["Jestem wdzięczny za...","Doceniam że...","Cieszę mnie..."][i]}
                disabled={alreadySaved}
                style={{
                  width:"100%",padding:"14px 14px 14px 36px",
                  background:item.trim()?"rgba(240,165,0,.06)":"var(--navy1)",
                  border:item.trim()?"1px solid rgba(240,165,0,.3)":"1px solid var(--navy3)",
                  borderRadius:12,color:"var(--white)",fontSize:14,
                  fontFamily:"'Inter',sans-serif",outline:"none",
                  transition:"all .2s",
                  opacity:alreadySaved?.7:1,
                }}
                onFocus={e=>{e.target.style.borderColor="var(--gold)";e.target.style.boxShadow="0 0 0 3px rgba(240,165,0,.12)";}}
                onBlur={e=>{e.target.style.borderColor=item.trim()?"rgba(240,165,0,.3)":"var(--navy3)";e.target.style.boxShadow="none";}}
              />
              {item.trim()&&<span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",color:"var(--green)",fontSize:14,pointerEvents:"none"}}>✓</span>}
            </div>
          ))}

          {/* Notatka */}
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:700,marginBottom:10,marginTop:20}}>
            MYŚL DNIA <span style={{color:"var(--navy3)"}}>— OPCJONALNIE</span>
          </div>
          <textarea
            value={note}
            onChange={e=>{setNote(e.target.value);setSaved(false);}}
            placeholder="Refleksja, cytat, intencja na dziś..."
            disabled={alreadySaved}
            rows={3}
            style={{
              width:"100%",padding:"14px",background:"var(--navy1)",border:"1px solid var(--navy3)",
              borderRadius:12,color:"var(--white)",fontSize:14,fontFamily:"'Inter',sans-serif",
              outline:"none",resize:"none",lineHeight:1.6,
              opacity:alreadySaved?.7:1,
            }}
            onFocus={e=>{e.target.style.borderColor="var(--gold)";}}
            onBlur={e=>{e.target.style.borderColor="var(--navy3)";}}
          />

          {/* Postęp */}
          <div style={{display:"flex",alignItems:"center",gap:10,marginTop:14,marginBottom:18}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{flex:1,height:4,borderRadius:2,background:items[i].trim()?"var(--gold)":"var(--navy3)",transition:"background .3s"}}/>
            ))}
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:allFilled?"var(--gold)":"var(--dim)",fontWeight:700,letterSpacing:1,flexShrink:0}}>{filled}/3</span>
          </div>

          {alreadySaved?(
            <div style={{padding:"14px 20px",borderRadius:12,background:"rgba(39,196,122,.08)",border:"1px solid rgba(39,196,122,.25)",textAlign:"center"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--green)",letterSpacing:2,fontWeight:700}}>✅ ZAPISANE DZIŚ — wróć jutro</div>
            </div>
          ):(
            <button onClick={save} disabled={!allFilled} style={{
              width:"100%",padding:"16px 0",borderRadius:12,
              border:`2px solid ${allFilled?"var(--gold)":"var(--navy3)"}`,
              background:allFilled?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",
              color:allFilled?"var(--navy)":"var(--dim)",
              fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:3,fontWeight:700,
              boxShadow:allFilled?"0 6px 24px rgba(240,165,0,.25)":"none",
              transition:"all .2s",
            }}>
              {saved?"✅ ZAPISANO!":"ZAPISZ WDZIĘCZNOŚĆ"}
            </button>
          )}
        </>
      )}

      {view==="history"&&(
        <>
          {history.length===0?(
            <div style={{padding:"48px 0",textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:16}}>📖</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--dim)",letterSpacing:2,fontWeight:700}}>BRAK WPISÓW</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--navy3)",marginTop:6}}>Zacznij pisać dziś</div>
            </div>
          ):history.map(([date,entry])=>(
            <div key={date} style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:16,marginBottom:10,borderLeft:"3px solid var(--gold)"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--gold)",letterSpacing:3,fontWeight:700,marginBottom:12}}>
                {formatDate(date).toUpperCase()}
              </div>
              {(entry.items||[]).filter(i=>i.trim()).map((item,i)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:8}}>
                  <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"var(--gold)",flexShrink:0,marginTop:1}}>{i+1}</span>
                  <span style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"var(--text)",lineHeight:1.5}}>{item}</span>
                </div>
              ))}
              {entry.note&&(
                <div style={{marginTop:10,padding:"10px 12px",borderRadius:10,background:"rgba(255,255,255,.03)",border:"1px solid var(--navy3)"}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",letterSpacing:3,fontWeight:700,marginBottom:4}}>MYŚL DNIA</div>
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"var(--dim)",lineHeight:1.6,fontStyle:"italic"}}>{entry.note}</div>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ── MY HABITS TAB ─────────────────────────────────────────────────────────────
const HABIT_TIPS={
  "zimny prysznic":    {tip:"Zacznij od 10 sekund zimnej wody na koniec ciepłego prysznica. Każdego dnia dodaj 5 sekund.",                   strategy:"Zasada stopniowej ekspozycji — mózg oswaja się z dyskomfortem powoli.",icon:"🧊"},
  "trening":           {tip:"Połóż ubrania sportowe wieczorem przy łóżku. Rano masz zero wymówek — już się 'przygotowałeś'.",               strategy:"Projektowanie środowiska (James Clear) — usuń tarcie między tobą a nawykiem.",icon:"💪"},
  "czytanie":          {tip:"Połącz czytanie z kawą. Zanim dotkniesz telefonu rano — przeczytaj 10 stron.",                                  strategy:"Habit stacking — nowy nawyk przypięty do istniejącego rytuału.",icon:"📖"},
  "medytacja":         {tip:"Zacznij od 2 minut, nie 20. Usiądź, zamknij oczy, licz oddechy do 10. Powtarzaj.",                             strategy:"Zasada 2 minut (James Clear) — każdy nawyk zaczyna się od wersji mniejszej niż myślisz.",icon:"🧘"},
  "sen":               {tip:"Ustaw alarm NA SEN, nie tylko na budzenie. O 22:30 — odkładasz telefon. Zero negocjacji.",                      strategy:"Rytuał wieczorny jako sygnał dla mózgu że czas zwalniać.",icon:"🌙"},
  "dieta":             {tip:"Wyrzuć śmieciowe jedzenie z domu. Nie możesz zjeść tego czego nie masz. Zrób to dziś.",                        strategy:"Projektowanie środowiska — łatwiejsze niż poleganie na silnej woli.",icon:"🥗"},
  "telefon":           {tip:"Ładuj telefon w innym pokoju niż sypialnia. Kup zwykły budzik za 20 zł.",                                      strategy:"Eliminacja bodźca — bez telefonu przy łóżku budzisz się wolnym człowiekiem.",icon:"📵"},
  "woda":              {tip:"Postaw 2-litrową butelkę na biurku rano. Widoczność = przypomnienie. Nie chowaj jej.",                          strategy:"Zasada widoczności — to co widzisz, robisz częściej.",icon:"💧"},
  "wstawanie":         {tip:"Alarm na drugi koniec pokoju. Wstaniesz żeby go wyłączyć — jesteś już na nogach.",                             strategy:"Momentum — najtrudniejszy moment to start. Reszta idzie sama.",icon:"🌅"},
  "prokrastynacja":    {tip:"Reguła 5 sekund Mel Robbins: 5-4-3-2-1 i zacznij. Liczenie przerywa paraliż decyzji.",                        strategy:"Odliczanie aktywuje korę przedczołową zanim mózg uruchomi mechanizmy obronne.",icon:"⏱️"},
  "skupienie":         {tip:"Telefon do szuflady, słuchawki z muzyką bez słów, timer na 25 minut. Zacznij od jednej sesji.",                strategy:"Technika Pomodoro + eliminacja rozproszenia = głęboka praca.",icon:"🧠"},
  "cukier":            {tip:"Nie kupuj słodyczy. Jeśli masz ochotę — musisz wyjść po nie. To wystarczający bufor.",                         strategy:"Zwiększenie kosztu złego wyboru jest skuteczniejsze niż silna wola.",icon:"🚫"},
  "ćwiczenia":         {tip:"Zacznij od 5 pompek rano. Dosłownie 5. Za tydzień 10. Nie zaczynaj od 'idealnego planu'.",                    strategy:"Zasada minimalnej dawki — mały nawyk który ROBISZ bije wielki plan który odkładasz.",icon:"🏃"},
  "dziennik":          {tip:"Połóż notes na poduszce wieczorem. Zanim zgasisz światło — 3 zdania. Tyle wystarczy.",                         strategy:"Redukcja tarcia — narzędzie musi być w zasięgu ręki żeby nawyk się kleił.",icon:"✍️"},
  "spacer":            {tip:"Zaplanuj spacer jako meeting z samym sobą. Wpisz go do kalendarza. Traktuj poważnie.",                         strategy:"Harmonogramowanie — to co zaplanowane ma 3× większą szansę na realizację.",icon:"🚶"},
};

function getHabitTip(habitName){
  const lower=habitName.toLowerCase();
  for(const [key,val] of Object.entries(HABIT_TIPS)){
    if(lower.includes(key)) return val;
  }
  return{
    tip:"Zacznij od wersji nano tego nawyku — tak małej żeby było głupio jej nie zrobić. Stopniowo zwiększaj.",
    strategy:"Zasada 2 minut — każdy nawyk ma swoją wersję 2-minutową. Znajdź ją.",
    icon:"⚡",
  };
}

function MyHabitsTab({myHabits,onSave}){
  const [habits,setHabits]=useState(myHabits||[]);
  const [input,setInput]=useState("");
  const [expanded,setExpanded]=useState(null);
  const [saved,setSaved]=useState(false);
  const MAX=5;

  function add(){
    if(!input.trim()||habits.length>=MAX) return;
    const h={id:Date.now(),name:input.trim(),addedAt:TODAY(),doneToday:false};
    const updated=[...habits,h];
    setHabits(updated);
    onSave(updated);
    setInput("");
  }

  function remove(id){
    const updated=habits.filter(h=>h.id!==id);
    setHabits(updated);
    onSave(updated);
    if(expanded===id) setExpanded(null);
  }

  function toggleDone(id){
    const updated=habits.map(h=>h.id===id?{...h,doneToday:!h.doneToday,lastDone:!h.doneToday?TODAY():h.lastDone}:h);
    setHabits(updated);
    onSave(updated);
  }

  const todayKey=TODAY();

  return(
    <div style={{padding:"0 18px 32px"}}>

      {/* Header */}
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:600}}>PRACA NAD SOBĄ</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"var(--white)"}}>MOJE NAWYKI</div>
      </div>

      {/* Info */}
      <div style={{padding:"14px 16px",borderRadius:14,background:"rgba(240,165,0,.06)",border:"1px solid rgba(240,165,0,.2)",marginBottom:24,display:"flex",gap:12,alignItems:"flex-start"}}>
        <span style={{fontSize:22,flexShrink:0}}>🎯</span>
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--gold)",letterSpacing:2,fontWeight:700,marginBottom:4}}>JAK TO DZIAŁA</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",lineHeight:1.6,fontWeight:600}}>
            Wpisz nawyki z którymi masz problem (max {MAX}). Dostaniesz konkretną strategię i tip jak zacząć. Odhaczaj postęp każdego dnia.
          </div>
        </div>
      </div>

      {/* Input */}
      {habits.length<MAX?(
        <div style={{marginBottom:20}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:700,marginBottom:10}}>
            DODAJ NAWYK ({habits.length}/{MAX})
          </div>
          <div style={{display:"flex",gap:8}}>
            <input
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&add()}
              placeholder="np. zimny prysznic, trening, czytanie..."
              style={{
                flex:1,padding:"13px 16px",background:"var(--navy1)",border:"1px solid var(--navy3)",
                borderRadius:12,color:"var(--white)",fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",
              }}
              onFocus={e=>{e.target.style.borderColor="var(--gold)";e.target.style.boxShadow="0 0 0 3px rgba(240,165,0,.12)";}}
              onBlur={e=>{e.target.style.borderColor="var(--navy3)";e.target.style.boxShadow="none";}}
            />
            <button onClick={add} disabled={!input.trim()} style={{
              padding:"13px 18px",borderRadius:12,border:`2px solid ${input.trim()?"var(--gold)":"var(--navy3)"}`,
              background:input.trim()?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",
              color:input.trim()?"var(--navy)":"var(--dim)",
              fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2,fontWeight:700,
            }}>DODAJ</button>
          </div>
        </div>
      ):(
        <div style={{padding:"12px 16px",borderRadius:12,background:"rgba(232,57,74,.06)",border:"1px solid rgba(232,57,74,.2)",marginBottom:20}}>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"#ff8090",fontWeight:700,letterSpacing:1}}>
            ⚠️ Maksimum {MAX} nawyków — skup się na tym co masz
          </span>
        </div>
      )}

      {/* Lista nawyków */}
      {habits.length===0?(
        <div style={{padding:"48px 0",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:16}}>🌱</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--dim)",letterSpacing:2,fontWeight:700}}>BRAK NAWYKÓW</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--navy3)",marginTop:6,lineHeight:1.6}}>
            Wpisz nawyk z którym masz problem.<br/>Dostaniesz konkretny plan działania.
          </div>
        </div>
      ):habits.map((habit,i)=>{
        const tip=getHabitTip(habit.name);
        const isExpanded=expanded===habit.id;
        const doneToday=habit.lastDone===todayKey;

        return(
          <div key={habit.id} style={{
            borderRadius:16,marginBottom:12,overflow:"hidden",
            border:doneToday?"1px solid rgba(39,196,122,.3)":"1px solid var(--navy3)",
            background:doneToday?"rgba(39,196,122,.04)":"var(--navy1)",
            transition:"all .2s",
          }}>
            {/* Top bar */}
            <div style={{height:3,background:doneToday?"linear-gradient(90deg,var(--green),var(--blue))":"linear-gradient(90deg,var(--gold),var(--gold2))"}}/>

            {/* Main row */}
            <div style={{padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
              {/* Numer */}
              <div style={{
                width:32,height:32,borderRadius:10,flexShrink:0,
                background:doneToday?"rgba(39,196,122,.15)":"rgba(240,165,0,.1)",
                border:doneToday?"1px solid rgba(39,196,122,.3)":"1px solid rgba(240,165,0,.3)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontFamily:"'Bebas Neue',sans-serif",fontSize:18,
                color:doneToday?"var(--green)":"var(--gold)",letterSpacing:1,
              }}>{tip.icon}</div>

              {/* Nazwa */}
              <div style={{flex:1}} onClick={()=>setExpanded(isExpanded?null:habit.id)}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:16,fontWeight:700,color:doneToday?"var(--dim)":"var(--white)",letterSpacing:.5,textDecoration:doneToday?"line-through":"none"}}>
                  {habit.name}
                </div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",fontWeight:600,marginTop:2,letterSpacing:1}}>
                  {doneToday?"✓ ZROBIONE DZIŚ":"TAP ABY ZOBACZYĆ STRATEGIĘ"} · {isExpanded?"▲":"▼"}
                </div>
              </div>

              {/* Checkmark */}
              <div onClick={()=>toggleDone(habit.id)} style={{
                width:36,height:36,borderRadius:10,flexShrink:0,cursor:"pointer",
                background:doneToday?"var(--green)":"transparent",
                border:doneToday?"none":"2px solid var(--navy3)",
                display:"flex",alignItems:"center",justifyContent:"center",
                transition:"all .2s",
              }}>
                {doneToday&&<span style={{fontSize:18,color:"var(--navy)",fontWeight:900}}>✓</span>}
              </div>

              {/* Usuń */}
              <button onClick={()=>remove(habit.id)} style={{
                background:"none",border:"none",color:"var(--navy3)",fontSize:18,cursor:"pointer",
                padding:"4px",flexShrink:0,lineHeight:1,
              }}>✕</button>
            </div>

            {/* Rozwinięta strategia */}
            {isExpanded&&(
              <div style={{borderTop:"1px solid var(--navy3)",padding:"16px"}}>
                {/* Tip */}
                <div style={{padding:"12px 14px",borderRadius:12,background:"rgba(240,165,0,.06)",border:"1px solid rgba(240,165,0,.2)",marginBottom:10}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--gold)",letterSpacing:3,fontWeight:700,marginBottom:6}}>💡 JAK ZACZĄĆ</div>
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"var(--text)",lineHeight:1.65}}>{tip.tip}</div>
                </div>
                {/* Strategia */}
                <div style={{padding:"12px 14px",borderRadius:12,background:"rgba(59,158,255,.06)",border:"1px solid rgba(59,158,255,.2)"}}>
                  <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--blue)",letterSpacing:3,fontWeight:700,marginBottom:6}}>🧠 DLACZEGO TO DZIAŁA</div>
                  <div style={{fontFamily:"'Inter',sans-serif",fontSize:13,color:"var(--dim)",lineHeight:1.65,fontStyle:"italic"}}>{tip.strategy}</div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Dzienny progres */}
      {habits.length>0&&(
        <div style={{marginTop:16,padding:"16px 20px",borderRadius:14,background:"var(--navy1)",border:"1px solid var(--navy3)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:3,color:"var(--dim)",fontWeight:700}}>DZIŚ</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--gold)",fontWeight:700,letterSpacing:1}}>
              {habits.filter(h=>h.lastDone===todayKey).length}/{habits.length}
            </div>
          </div>
          <div style={{height:6,background:"var(--navy3)",borderRadius:3,overflow:"hidden"}}>
            <div style={{
              width:`${habits.length?(habits.filter(h=>h.lastDone===todayKey).length/habits.length)*100:0}%`,
              height:"100%",background:"linear-gradient(90deg,var(--gold),var(--gold2))",
              borderRadius:3,transition:"width .5s ease",
            }}/>
          </div>
          {habits.every(h=>h.lastDone===todayKey)&&(
            <div style={{textAlign:"center",marginTop:12,fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"var(--green)",letterSpacing:2}}>
              🔥 WSZYSTKIE NAWYKI DZIŚ WYKONANE!
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AI CHAT TAB ───────────────────────────────────────────────────────────────
const QUICK_QUESTIONS=[
  "Jak przełamać prokrastynację?",
  "Mam słaby dzień — co robić?",
  "Jak zbudować nawyk treningu?",
  "Oceń mój obecny postęp",
  "Daj mi motywację na dziś",
];

function AiChatTab({isPremium,userData,onPaywall}){
  const [messages,setMessages]=useState([
    {role:"assistant",content:`Cześć ${userData?.name||"Wojowniku"}! Jestem Wojownik AI — Twój osobisty asystent dyscypliny. Streak ${userData?.streak||0} dni — niezłe. Jak mogę Ci dziś pomóc?`}
  ]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);

  function scrollDown(){
    try{document.getElementById("chat-bottom")?.scrollIntoView({behavior:"smooth"});}catch{}
  }

  async function send(text){
    const msg=text||input.trim();
    if(!msg||loading) return;
    setInput("");

    const newMessages=[...messages,{role:"user",content:msg}];
    setMessages(newMessages);
    setLoading(true);
    setTimeout(scrollDown,100);

    try{
      const data=await api("/ai-chat","POST",{
        messages:newMessages.map(m=>({role:m.role,content:m.content})),
        userData:{
          streak:userData?.streak||0,
          xp:userData?.xp||0,
          tasks:userData?.tasks||[],
          lessons:userData?.lessons||[],
          challenges:userData?.challenges||{},
        }
      });
      setMessages(prev=>[...prev,{role:"assistant",content:data.reply}]);
    }catch(e){
      setMessages(prev=>[...prev,{role:"assistant",content:"Przepraszam, coś poszło nie tak. Spróbuj ponownie."}]);
    }finally{
      setLoading(false);
      setTimeout(scrollDown,100);
    }
  }

  if(!isPremium) return(
    <div style={{padding:"48px 18px",textAlign:"center"}}>
      <div style={{fontSize:56,marginBottom:16}}>🤖</div>
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:5,color:"var(--gold)",marginBottom:10,fontWeight:700}}>PREMIUM</div>
      <h2 style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,letterSpacing:3,color:"var(--white)",marginBottom:12,lineHeight:1}}>Wojownik AI</h2>
      <p style={{color:"var(--dim)",fontSize:14,lineHeight:1.7,marginBottom:28,maxWidth:280,margin:"0 auto 28px"}}>
        Twój osobisty asystent dyscypliny. Analizuje Twój progress i daje spersonalizowane porady.
      </p>
      <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:"4px 16px",marginBottom:24,textAlign:"left",maxWidth:320,margin:"0 auto 24px"}}>
        {["Spersonalizowane porady na podstawie Twojego streaka","Strategie pokonania konkretnych nawyków","Motywacja gdy masz słaby dzień","Analiza Twojego progresu XP","Dostępny 24/7"].map((f,i,arr)=>(
          <div key={f} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:i<arr.length-1?"1px solid var(--navy3)":"none"}}>
            <span style={{color:"var(--green)"}}>✓</span>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--text)",fontWeight:600}}>{f}</span>
          </div>
        ))}
      </div>
      <button onClick={onPaywall} style={{padding:"14px 32px",borderRadius:12,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:3,fontWeight:700,boxShadow:"0 6px 24px rgba(240,165,0,.25)"}}>
        ⚔️ ODBLOKUJ PREMIUM
      </button>
    </div>
  );

  return(
    <div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 160px)"}}>

      {/* Header */}
      <div style={{padding:"0 18px 12px",flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderRadius:14,background:"var(--navy1)",border:"1px solid var(--navy3)"}}>
          <div style={{width:40,height:40,borderRadius:12,background:"linear-gradient(135deg,var(--gold),var(--gold2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🤖</div>
          <div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:15,fontWeight:700,color:"var(--white)",letterSpacing:1}}>WOJOWNIK AI</div>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"var(--green)"}}/>
              <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--green)",fontWeight:600,letterSpacing:1}}>ONLINE</span>
            </div>
          </div>
          <button onClick={()=>setMessages([{role:"assistant",content:`Nowa rozmowa. Streak ${userData?.streak||0} dni. Jak mogę pomóc?`}])} style={{marginLeft:"auto",background:"none",border:"1px solid var(--navy3)",borderRadius:8,padding:"6px 12px",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:2,fontWeight:600,cursor:"pointer"}}>
            WYCZYŚĆ
          </button>
        </div>
      </div>

      {/* Wiadomości */}
      <div style={{flex:1,overflowY:"auto",padding:"0 18px",display:"flex",flexDirection:"column",gap:10}}>

        {/* Quick questions — tylko na początku */}
        {messages.length<=1&&(
          <div style={{marginBottom:8}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",letterSpacing:3,fontWeight:700,marginBottom:8}}>SZYBKIE PYTANIA</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {QUICK_QUESTIONS.map(q=>(
                <button key={q} onClick={()=>send(q)} style={{
                  padding:"8px 12px",borderRadius:20,border:"1px solid var(--navy3)",
                  background:"var(--navy1)",color:"var(--dim)",
                  fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:.5,fontWeight:600,
                  cursor:"pointer",textAlign:"left",
                }}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",gap:8,alignItems:"flex-end"}}>
            {m.role==="assistant"&&(
              <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,var(--gold),var(--gold2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0,marginBottom:2}}>🤖</div>
            )}
            <div style={{
              maxWidth:"78%",padding:"12px 14px",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",
              background:m.role==="user"?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy1)",
              border:m.role==="user"?"none":"1px solid var(--navy3)",
              color:m.role==="user"?"var(--navy)":"var(--text)",
              fontFamily:"'Inter',sans-serif",fontSize:14,lineHeight:1.6,
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {loading&&(
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,var(--gold),var(--gold2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>🤖</div>
            <div style={{padding:"12px 16px",borderRadius:"16px 16px 16px 4px",background:"var(--navy1)",border:"1px solid var(--navy3)"}}>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                {[0,1,2].map(i=>(
                  <div key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--dim)",animation:`fadeUp .6s ${i*0.2}s ease infinite alternate`}}/>
                ))}
              </div>
            </div>
          </div>
        )}
        <div id="chat-bottom"/>
      </div>

      {/* Input */}
      <div style={{padding:"12px 18px",flexShrink:0,borderTop:"1px solid var(--navy2)"}}>
        <div style={{display:"flex",gap:8}}>
          <input
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
            placeholder="Zapytaj Wojownika AI..."
            disabled={loading}
            style={{
              flex:1,padding:"13px 16px",background:"var(--navy1)",border:"1px solid var(--navy3)",
              borderRadius:12,color:"var(--white)",fontSize:14,fontFamily:"'Inter',sans-serif",outline:"none",
            }}
            onFocus={e=>{e.target.style.borderColor="var(--gold)";}}
            onBlur={e=>{e.target.style.borderColor="var(--navy3)";}}
          />
          <button onClick={()=>send()} disabled={!input.trim()||loading} style={{
            width:48,height:48,borderRadius:12,border:"none",flexShrink:0,
            background:input.trim()&&!loading?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",
            color:input.trim()&&!loading?"var(--navy)":"var(--dim)",
            fontSize:20,cursor:input.trim()?"pointer":"default",
          }}>➤</button>
        </div>
      </div>
    </div>
  );
}

// ── SHOP TAB ──────────────────────────────────────────────────────────────────
function ShopTab({xp,userData,onBuy}){
  const freezes=userData.freezes||0;
  const xp2xActive=userData.xp2xUntil&&new Date(userData.xp2xUntil)>new Date();
  const hasBadgeS=userData.shopBadge;
  const [bought,setBought]=useState(null);

  function buy(item){
    if(xp<item.cost){setBought({id:item.id,fail:true});setTimeout(()=>setBought(null),1500);return;}
    if(item.id==="freeze"&&freezes>=item.max){setBought({id:item.id,fail:true});setTimeout(()=>setBought(null),1500);return;}
    if(item.id==="xp2x"&&xp2xActive){setBought({id:item.id,fail:true});setTimeout(()=>setBought(null),1500);return;}
    if(item.id==="badge_s"&&hasBadgeS){setBought({id:item.id,fail:true});setTimeout(()=>setBought(null),1500);return;}

    let updates={xp:xp-item.cost};
    if(item.id==="freeze") updates.freezes=(freezes+1);
    if(item.id==="xp2x") updates.xp2xUntil=new Date(Date.now()+24*60*60*1000).toISOString();
    if(item.id==="badge_s") updates.shopBadge=true;
    onBuy(updates);
    setBought({id:item.id,fail:false});
    setTimeout(()=>setBought(null),1500);
  }

  return(
    <div style={{padding:"0 18px 32px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:600}}>WYDAJ XP</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"var(--white)"}}>SKLEP WOJOWNIKA</div>
      </div>

      {/* Saldo */}
      <div style={{padding:"16px 20px",borderRadius:14,background:"linear-gradient(135deg,rgba(240,165,0,.1),rgba(240,165,0,.05))",border:"1px solid rgba(240,165,0,.3)",marginBottom:24,display:"flex",alignItems:"center",gap:14}}>
        <span style={{fontSize:32}}>⚡</span>
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--dim)",letterSpacing:3,fontWeight:700}}>TWOJE SALDO</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:32,color:"var(--gold)",letterSpacing:3,lineHeight:1}}>{xp.toLocaleString()} XP</div>
        </div>
      </div>

      {/* Status */}
      {freezes>0&&(
        <div style={{padding:"12px 16px",borderRadius:12,background:"rgba(59,158,255,.08)",border:"1px solid rgba(59,158,255,.25)",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>🛡️</span>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--blue)",letterSpacing:1,fontWeight:700}}>MASZ {freezes} STREAK FREEZE {freezes===1?"":"'y"}</span>
        </div>
      )}
      {xp2xActive&&(
        <div style={{padding:"12px 16px",borderRadius:12,background:"rgba(240,165,0,.08)",border:"1px solid rgba(240,165,0,.25)",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>⚡</span>
          <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--gold)",letterSpacing:1,fontWeight:700}}>2× XP AKTYWNE do {new Date(userData.xp2xUntil).toLocaleTimeString("pl-PL",{hour:"2-digit",minute:"2-digit"})}</span>
        </div>
      )}

      {/* Items */}
      <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:700,marginBottom:12}}>DOSTĘPNE</div>
      {SHOP_ITEMS.map(item=>{
        const canBuy=xp>=item.cost;
        const owned=(item.id==="freeze"&&freezes>=item.max)||(item.id==="xp2x"&&xp2xActive)||(item.id==="badge_s"&&hasBadgeS);
        const wasBought=bought?.id===item.id;
        return(
          <div key={item.id} style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:18,marginBottom:10,opacity:owned?.6:1}}>
            <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
              <div style={{width:52,height:52,borderRadius:14,background:"rgba(240,165,0,.1)",border:"1px solid rgba(240,165,0,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{item.icon}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:17,letterSpacing:1,fontWeight:700,color:"var(--white)",marginBottom:4}}>{item.name}</div>
                <div style={{color:"var(--dim)",fontSize:13,lineHeight:1.5,marginBottom:10}}>{item.desc}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"var(--gold)",letterSpacing:2}}>{item.cost}</span>
                    <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--dim)",fontWeight:700}}>XP</span>
                  </div>
                  {owned?(
                    <div style={{padding:"8px 16px",borderRadius:10,background:"rgba(39,196,122,.1)",border:"1px solid rgba(39,196,122,.3)",color:"var(--green)",fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:2,fontWeight:700}}>POSIADASZ</div>
                  ):wasBought?(
                    <div style={{padding:"8px 16px",borderRadius:10,background:bought.fail?"rgba(232,57,74,.1)":"rgba(39,196,122,.1)",border:bought.fail?"1px solid rgba(232,57,74,.3)":"1px solid rgba(39,196,122,.3)",color:bought.fail?"#ff8090":"var(--green)",fontFamily:"'Rajdhani',sans-serif",fontSize:12,letterSpacing:2,fontWeight:700}}>
                      {bought.fail?"ZA MAŁO XP":"✓ KUPIONO"}
                    </div>
                  ):(
                    <button onClick={()=>buy(item)} style={{padding:"9px 20px",borderRadius:10,border:`2px solid ${canBuy?"var(--gold)":"var(--navy3)"}`,background:canBuy?"linear-gradient(135deg,var(--gold),var(--gold2))":"var(--navy2)",color:canBuy?"var(--navy)":"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:2,fontWeight:700}}>
                      KUP
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── BADGES TAB ────────────────────────────────────────────────────────────────
function BadgesTab({userData}){
  const earned=userData.badges||[];
  const earnedSet=new Set(earned);
  const done=BADGES.filter(b=>earnedSet.has(b.id));
  const todo=BADGES.filter(b=>!earnedSet.has(b.id));

  return(
    <div style={{padding:"0 18px 32px"}}>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:600}}>TWOJE OSIĄGNIĘCIA</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,letterSpacing:2,color:"var(--white)"}}>ODZNAKI</div>
      </div>

      {/* Postęp */}
      <div style={{padding:"16px 20px",borderRadius:14,background:"var(--navy1)",border:"1px solid var(--navy3)",marginBottom:24,display:"flex",alignItems:"center",gap:16}}>
        <div style={{textAlign:"center",flexShrink:0}}>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:36,color:"var(--gold)",letterSpacing:2,lineHeight:1}}>{done.length}</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:700,letterSpacing:2}}>ZDOBYTE</div>
        </div>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",fontWeight:700,letterSpacing:2}}>POSTĘP</span>
            <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--gold)",fontWeight:700}}>{done.length}/{BADGES.length}</span>
          </div>
          <div style={{height:6,background:"var(--navy3)",borderRadius:3,overflow:"hidden"}}>
            <div style={{width:`${(done.length/BADGES.length)*100}%`,height:"100%",background:"linear-gradient(90deg,var(--gold),var(--gold2))",borderRadius:3,transition:"width .6s ease"}}/>
          </div>
        </div>
      </div>

      {done.length>0&&(
        <>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--green)",fontWeight:700,marginBottom:12}}>✓ ZDOBYTE ({done.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:24}}>
            {done.map(b=>(
              <div key={b.id} style={{background:"rgba(240,165,0,.06)",border:"1px solid rgba(240,165,0,.25)",borderRadius:14,padding:14,textAlign:"center"}}>
                <div style={{fontSize:36,marginBottom:6}}>{b.icon}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1,fontWeight:700,color:"var(--white)",marginBottom:4}}>{b.name}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:600,lineHeight:1.4}}>{b.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {todo.length>0&&(
        <>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--dim)",fontWeight:700,marginBottom:12}}>🔒 DO ZDOBYCIA ({todo.length})</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            {todo.map(b=>(
              <div key={b.id} style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:14,textAlign:"center",opacity:.5}}>
                <div style={{fontSize:36,marginBottom:6,filter:"grayscale(1)"}}>{b.icon}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,letterSpacing:1,fontWeight:700,color:"var(--dim)",marginBottom:4}}>{b.name}</div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--navy3)",fontWeight:600,lineHeight:1.4}}>{b.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── WEEKLY REPORT MODAL ───────────────────────────────────────────────────────
function WeeklyReport({userData,onClose}){
  const history=userData.history||{};
  const today=new Date();
  const days=[];
  for(let i=6;i>=0;i--){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    days.push({key,d,data:history[key]||null,name:["Nd","Pn","Wt","Śr","Cz","Pt","Sb"][d.getDay()]});
  }
  const activeDays=days.filter(d=>d.data&&d.data.tasksDone>0).length;
  const perfectDays=days.filter(d=>d.data&&d.data.tasksDone>=DAILY_TASKS.length).length;
  const totalXP=days.reduce((s,d)=>s+(d.data?.xp||0),0);
  const totalTasks=days.reduce((s,d)=>s+(d.data?.tasksDone||0),0);
  const consistency=Math.round((activeDays/7)*100);

  // Poprzedni tydzień
  const prevDays=[];
  for(let i=13;i>=7;i--){
    const d=new Date(today);d.setDate(d.getDate()-i);
    const key=d.toISOString().split("T")[0];
    prevDays.push(history[key]||null);
  }
  const prevXP=prevDays.reduce((s,d)=>s+(d?.xp||0),0);
  const xpDiff=totalXP-prevXP;

  return(
    <div style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end"}} onClick={onClose}>
      <div style={{width:"100%",maxWidth:480,margin:"0 auto",background:"var(--navy1)",borderRadius:"20px 20px 0 0",border:"1px solid var(--navy3)",borderBottom:"none",padding:28,maxHeight:"90vh",overflowY:"auto",animation:"slideIn .3s ease"}} onClick={e=>e.stopPropagation()}>
        <div style={{width:40,height:4,background:"var(--navy3)",borderRadius:2,margin:"0 auto 20px"}}/>

        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,letterSpacing:4,color:"var(--gold)",fontWeight:700,marginBottom:4}}>PODSUMOWANIE</div>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:3,color:"var(--white)",marginBottom:20}}>RAPORT TYGODNIOWY</div>

        {/* Dni tygodnia */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:20}}>
          {days.map(d=>{
            const pct=d.data?(d.data.tasksDone/DAILY_TASKS.length):0;
            const perfect=pct>=1;
            const isToday=d.key===TODAY();
            return(
              <div key={d.key} style={{textAlign:"center"}}>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",fontWeight:700,marginBottom:4}}>{d.name}</div>
                <div style={{
                  height:48,borderRadius:10,
                  background:perfect?"var(--gold)":pct>0?"rgba(240,165,0,.3)":"var(--navy2)",
                  border:isToday?"2px solid var(--gold)":"1px solid var(--navy3)",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:18,
                }}>
                  {perfect?"🔥":pct>0?"⚡":"·"}
                </div>
                <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:9,color:perfect?"var(--gold)":"var(--dim)",fontWeight:700,marginTop:3}}>{d.d.getDate()}</div>
              </div>
            );
          })}
        </div>

        {/* Statystyki */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
          {[
            {l:"Aktywne dni",v:`${activeDays}/7`,c:"var(--green)",i:"📅"},
            {l:"Idealne dni",v:perfectDays,c:"var(--gold)",i:"🔥"},
            {l:"XP zdobyte",v:totalXP,c:"var(--blue)",i:"⚡"},
            {l:"Zadań ukończono",v:totalTasks,c:"#a78bfa",i:"✅"},
          ].map(s=>(
            <div key={s.l} style={{background:"var(--navy2)",border:"1px solid var(--navy3)",borderRadius:12,padding:"14px 16px",borderTop:`2px solid ${s.c}`}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                <span style={{fontSize:14}}>{s.i}</span>
                <span style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--dim)",letterSpacing:2,fontWeight:700}}>{s.l.toUpperCase()}</span>
              </div>
              <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:s.c,letterSpacing:2}}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Porównanie z poprzednim tygodniem */}
        <div style={{padding:"14px 16px",borderRadius:12,background:"var(--navy2)",border:"1px solid var(--navy3)",marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:22}}>{xpDiff>=0?"📈":"📉"}</span>
          <div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",letterSpacing:3,fontWeight:700}}>VS POPRZEDNI TYDZIEŃ</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:xpDiff>=0?"var(--green)":"#ff8090",letterSpacing:2}}>
              {xpDiff>=0?"+":""}{xpDiff} XP
            </div>
          </div>
          <div style={{marginLeft:"auto",textAlign:"right"}}>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",letterSpacing:2,fontWeight:700}}>KONSEKWENCJA</div>
            <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"var(--gold)",letterSpacing:2}}>{consistency}%</div>
          </div>
        </div>

        {/* Motywacja */}
        <div style={{padding:"14px 16px",borderRadius:12,background:"rgba(240,165,0,.06)",border:"1px solid rgba(240,165,0,.2)",marginBottom:20,textAlign:"center"}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,color:"var(--gold)",fontWeight:700,letterSpacing:1}}>
            {perfectDays>=5?"🏆 Niesamowity tydzień! Jesteś wojownikiem.":
             perfectDays>=3?"💪 Dobry tydzień. Następny będzie lepszy.":
             activeDays>=3?"⚡ Dobry start. Buduj konsekwencję.":
             "🔥 Nowy tydzień — nowa szansa. Zacznij dziś."}
          </div>
        </div>

        <button onClick={onClose} style={{width:"100%",padding:"14px 0",borderRadius:12,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:3,fontWeight:700}}>
          ZAMKNIJ
        </button>
      </div>
    </div>
  );
}

// ── NEW BADGE TOAST ───────────────────────────────────────────────────────────
function BadgeToast({badge,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);
  return(
    <div style={{position:"fixed",top:80,left:"50%",transform:"translateX(-50%)",zIndex:400,animation:"fadeUp .4s ease",whiteSpace:"nowrap"}}>
      <div style={{background:"linear-gradient(135deg,var(--navy1),var(--navy2))",border:"2px solid var(--gold)",borderRadius:16,padding:"14px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:"0 8px 32px rgba(240,165,0,.3)"}}>
        <span style={{fontSize:28}}>{badge.icon}</span>
        <div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:10,color:"var(--gold)",letterSpacing:3,fontWeight:700}}>NOWA ODZNAKA!</div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"var(--white)",letterSpacing:2}}>{badge.name}</div>
        </div>
      </div>
    </div>
  );
}

// ── LOCKED FEATURE ────────────────────────────────────────────────────────────
function LockedFeature({label,onUnlock}){
  return(
    <div style={{padding:"40px 18px",textAlign:"center"}}>
      <div style={{fontSize:48,marginBottom:16}}>🔒</div>
      <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:3,color:"var(--dim)",marginBottom:8}}>{label}</div>
      <p style={{color:"var(--dim)",fontSize:14,marginBottom:24,lineHeight:1.6}}>Ta funkcja dostępna jest w wersji premium.</p>
      <button onClick={onUnlock} style={{padding:"14px 32px",borderRadius:12,border:"2px solid var(--gold)",background:"linear-gradient(135deg,var(--gold),var(--gold2))",color:"var(--navy)",fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:3,fontWeight:700,boxShadow:"0 6px 24px rgba(240,165,0,.25)"}}>
        ODBLOKUJ PREMIUM
      </button>
    </div>
  );
}

// -- GOALS TAB ----------------------------------------------------------------
function GoalsTab({goals,onSave}){
  const [goalText,setGoalText]=useState("");
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [activePlan,setActivePlan]=useState(null);

  async function generate(){
    if(!goalText.trim()) return setErr("Wpisz cel.");
    setErr("");
    setLoading(true);
    try{
      const res=await api("/generate-goal","POST",{goal:goalText.trim()});
      const newGoals=[...goals,{id:res.plan.goal+Date.now(),createdAt:new Date().toISOString(),plan:res.plan}];
      onSave(newGoals);
      setActivePlan(res.plan);
      setGoalText("");
    }catch(e){
      setErr(e.message||"Blad serwera.");
    }finally{
      setLoading(false);
    }
  }

  if(activePlan) return(
    <div style={{padding:"0 0 120px"}}>
      <div style={{background:"linear-gradient(135deg,var(--navy2),var(--navy3))",border:"2px solid rgba(240,165,0,.3)",borderRadius:16,padding:20,marginBottom:16}}>
        <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"var(--gold)",letterSpacing:2,marginBottom:4}}>{activePlan.goal}</div>
        <div style={{color:"var(--dim)",fontSize:13,lineHeight:1.5}}>{activePlan.summary}</div>
      </div>
      {(activePlan.stages||[]).map(s=>(
        <div key={s.stage} style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:16,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:32,height:32,borderRadius:8,background:"rgba(240,165,0,.15)",border:"1px solid rgba(240,165,0,.3)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:"var(--gold)"}}>{s.stage}</div>
            <div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:"var(--white)",letterSpacing:1}}>{s.name}</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--dim)",letterSpacing:2}}>DNI {s.days}</div>
            </div>
          </div>
          {(s.tasks||[]).map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 0",borderTop:"1px solid rgba(255,255,255,.04)"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:"var(--gold)",flexShrink:0}}/>
              <div style={{color:"var(--text)",fontSize:13,lineHeight:1.4}}>{t}</div>
            </div>
          ))}
        </div>
      ))}
      <button onClick={()=>setActivePlan(null)} style={{width:"100%",padding:"14px 0",borderRadius:12,border:"1px solid var(--navy3)",background:"transparent",color:"var(--dim)",fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2,fontWeight:600,marginTop:8}}>
        WRÓC DO LISTY CELÓW
      </button>
    </div>
  );

  return(
    <div style={{padding:"0 0 120px"}}>
      <div style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:16,padding:18,marginBottom:20}}>
        <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:13,color:"var(--dim)",letterSpacing:2,fontWeight:600,marginBottom:10}}>TWÓJ CEL</div>
        <textarea
          value={goalText}
          onChange={e=>setGoalText(e.target.value)}
          placeholder="np. Chcę biegać 10km, Chcę nauczyć się programować..."
          rows={3}
          style={{width:"100%",padding:"12px 14px",background:"var(--navy2)",border:"1px solid var(--navy3)",borderRadius:10,color:"var(--white)",fontSize:14,fontFamily:"'Inter',sans-serif",resize:"none",boxSizing:"border-box",lineHeight:1.5}}
        />
        {err&&<div style={{color:"#ff8090",fontSize:12,marginTop:6,fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>{err}</div>}
        <button onClick={generate} disabled={loading} style={{
          width:"100%",marginTop:12,padding:"14px 0",borderRadius:12,
          border:"2px solid var(--gold)",
          background:loading?"var(--navy2)":"linear-gradient(135deg,var(--gold),var(--gold2))",
          color:loading?"var(--dim)":"var(--navy)",
          fontFamily:"'Rajdhani',sans-serif",fontSize:16,letterSpacing:3,fontWeight:700,
        }}>
          {loading?"GENERUJĘ PLAN...":"WYGENERUJ PLAN 30 DNI"}
        </button>
      </div>
      {goals.length>0&&(
        <>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:12,color:"var(--dim)",letterSpacing:3,fontWeight:600,marginBottom:10}}>TWOJE CELE</div>
          {[...goals].reverse().map(g=>(
            <div key={g.id} onClick={()=>setActivePlan(g.plan)} style={{background:"var(--navy1)",border:"1px solid var(--navy3)",borderRadius:14,padding:16,marginBottom:10,cursor:"pointer"}}>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:15,color:"var(--white)",letterSpacing:1,marginBottom:4}}>{g.plan.goal}</div>
              <div style={{color:"var(--dim)",fontSize:12,lineHeight:1.4,marginBottom:8}}>{g.plan.summary}</div>
              <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:11,color:"var(--gold)",letterSpacing:2,fontWeight:600}}>{(g.plan.stages||[]).length} ETAPÓW · 30 DNI</div>
            </div>
          ))}
        </>
      )}
      {goals.length===0&&(
        <div style={{textAlign:"center",padding:"40px 0",color:"var(--dim)"}}>
          <div style={{fontSize:48,marginBottom:12}}>🎯</div>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontSize:14,letterSpacing:2}}>Wpisz cel i AI rozpisze go na 30 dni</div>
        </div>
      )}
    </div>
  );
}
