Vytvořte portál online knihovny "BookHub" s komplětní funkcionalitou:
Backend požadavky:

REST API pro správu knih, uživatelů a výpůjček
Databáze s tabulkami: users, books, loans, categories
Autentifikace pomocí JWT tokenů
Middleware pro autorizaci (admin/user role)
Validace dat a error handling

Frontend funkcionalita:

Registrace a přihlášení uživatelů
Dashboard pro přihlášené uživatele
Katalog knih s vyhledáváním a filtrováním
Systém výpůjček (půjčit/vrátit knihu)
Profil uživatele s historií výpůjček
Admin panel pro správu knih a uživatelů

Databázové entity:

Users: id, email, password, name, role, created_at
Books: id, title, author, isbn, category_id, available_copies, description
Categories: id, name
Loans: id, user_id, book_id, loan_date, return_date, status

Technické požadavky:

Backend: Node.js/Express nebo Python/FastAPI
Databáze: PostgreSQL nebo MySQL
Frontend: React/Vue.js nebo vanilla JS
Responzivní design
API dokumentace

Hodnotící kritéria pro oba projekty:

Kvalita a čistota kódu
Funkcionalita a uživatelská přívětivost
Designové řešení a kreativita (zadání 1)
Architektura a bezpečnost (zadání 2)
Rychlost implementace
Handling edge cases a error states
