# WMS — Warehouse Management System

Fullstack aplikacija za upravljanje skladištem, razvijena sa potencijalom za SaaS primenu.

---

## Sadržaj

- [Pregled projekta](#pregled-projekta)
- [Tech Stack](#tech-stack)
- [Pokretanje lokalno](#pokretanje-lokalno)
- [Environment varijable](#environment-varijable)
- [API Dokumentacija](#api-dokumentacija)
- [Autentifikacija](#autentifikacija)
- [Uloge korisnika](#uloge-korisnika)
- [Funkcionalnosti](#funkcionalnosti)
- [Deployment](#deployment)
- [Struktura projekta](#struktura-projekta)

---

## Pregled projekta

WMS (Warehouse Management System) je web aplikacija koja omogućava upravljanje skladištima, praćenje proizvoda, upravljanje zalihama i generisanje izveštaja. 

Sistem podržava više korisničkih uloga i pruža administratorima i menadžerima pregled nad celokupnim poslovanjem skladišta.

---

## Tech Stack

### Frontend
| Tehnologija | Verzija | Namena |
|---|---|---|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| TailwindCSS | 4.2.1 | Stilizacija |
| Axios | 1.13.6 | HTTP klijent + JWT interceptori |
| React Router | 7.13.1 | Rutiranje |
| Vite | 7.3.1 | Build tool |
| ExcelJS | 4.4.0 | Export u Excel |
| Recharts | 3.8.1 | Grafikoni |

### Backend
| Tehnologija | Verzija | Namena |
|---|---|---|
| Python | 3.11+ | Jezik |
| Django | Latest | Web framework |
| Django REST Framework | Latest | REST API |
| djangorestframework-simplejwt | Latest | JWT autentifikacija |
| django-cors-headers | Latest | CORS podrška |
| django-filter | Latest | Filtriranje QuerySeta |
| PostgreSQL | 14+ | Baza podataka |
| psycopg2-binary | Latest | PostgreSQL adapter |
| Gunicorn | Latest | WSGI server |
| python-decouple | Latest | Environment varijable |

### Infrastruktura
- **Server:** Ubuntu VPS (slavisadev.com/wms/)
- **Web server:** Nginx + Gunicorn
- **Baza:** PostgreSQL 14+ 

---

## Pokretanje lokalno

### Preduslovi
- Python 3.11+
- Node.js 18+
- PostgreSQL

### Backend

```bash
# Kloniranje repozitorijuma
git clone https://github.com/tvoj-username/wms.git
cd wms/backend

# Kreiranje virtualnog okruženja
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalacija zavisnosti
pip install -r requirements.txt

# Podešavanje environment varijabli (vidi sekciju ispod)
cp .env.example .env

# Migracije
python manage.py migrate

# Kreiranje superusera
python manage.py createsuperuser

# Pokretanje razvojnog servera
python manage.py runserver
```

### Frontend

```bash
cd wms/frontend

# Instalacija zavisnosti
npm install

# Pokretanje razvojnog servera
npm run dev
```

Frontend je dostupan na `http://localhost:5173`, backend na `http://localhost:8000`.

---

## Environment varijable

Kreiraj `.env.development` ili `.env.production` fajl u `backend/` direktorijumu:

```env
# PostgreSQL Database Configuration
DENGINE=django.db.backends.postgresql
DB_NAME=wms_db
DB_USER=wms_user
DB_PASSWORD=tvoja-lozinka
DB_HOST=localhost
DB_PORT=5432

# Django
SECRET_KEY=tvoj-tajni-kljuc
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,185.241.214.245
```

Koristi `python-decouple` za čitanje varijabli. Nikad ne commit-uj `.env*` fajlove.

---

## API Dokumentacija

Svi endpointi su prefixovani sa `/api/`.

### Autentifikacija
| Metoda | Endpoint | Opis |
|---|---|---|
| `POST` | `/api/token/` | Dobijanje access i refresh tokena |
| `POST` | `/api/token/refresh/` | Obnavljanje access tokena |

### Skladišta (Warehouse)
| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/warehouse/skladista/` | Lista skladišta |
| `POST` | `/api/warehouse/skladista/` | Kreiranje novog skladišta |
| `GET` | `/api/warehouse/sektori/` | Lista sektora |
| `GET` | `/api/warehouse/slotovi/` | Lista slotova |

### Inventar (Inventory)
| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/inventory/proizvodi/` | Lista proizvoda |
| `POST` | `/api/inventory/proizvodi/` | Kreiranje novog proizvoda |
| `GET` | `/api/inventory/kategorije/` | Lista kategorija |
| `GET` | `/api/inventory/zalihe/` | Pregled zaliha |

### Zaposleni (Accounts)
| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/accounts/zaposleni/` | Lista zaposlenih |
| `POST` | `/api/accounts/zaposleni/` | Kreiranje novog zaposlenog |
| `GET` | `/api/accounts/pozicije/` | Lista pozicija |

### Partneri (Partners)
| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/partners/` | Lista partnera |
| `POST` | `/api/partners/` | Kreiranje novog partnera |

### Transport
| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/transport/` | Lista transportnih zahteva |
| `POST` | `/api/transport/` | Kreiranje novog zahteva |

### Dokumenta (Documents)
| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/documentss/` | Lista dokumenata |
| `POST` | `/api/documentss/` | Kreiranje nove dokumentacije |

### Izveštaji (Reports)
| Metoda | Endpoint | Opis |
|---|---|---|
| `GET` | `/api/reports/` | Generisanje izveštaja |
| `GET` | `/api/reports/?od=2024-01-01&do=2024-12-31` | Filtriranje po periodu |

Svi zaštićeni endpointi zahtevaju `Authorization: Bearer <access_token>` header.

---

## Autentifikacija

Sistem koristi JWT (JSON Web Token) autentifikaciju putem `djangorestframework-simplejwt`.

Na frontendu, Axios instanca automatski:
- Dodaje `Authorization` header na svaki zahtev
- Tiho obnavlja access token koristeći refresh token (silent refresh)
- Redirektuje na login stranicu ako refresh token istekne

---

## Uloge korisnika

Sistem koristi Django User model i permission sistem:
- Admin pristup preko Django admin panela
- Menadžer - puni pristup API-u
- Radnik - ograničen pristup određenim endpointima

Dozvole se proveravaju na backendu putem DRF `permissions`.

---

## Funkcionalnosti

- [x] JWT autentifikacija sa silent refresh
- [x] Upravljanje skladištima (CRUD)
- [x] Upravljanje proizvodima i kategorijama
- [x] Praćenje zaliha
- [x] Upravljanje zaposlenim i pozicijama
- [x] Upravljanje partnerima
- [x] Upravljanje transportom
- [x] Dokumentacija i izveštaji
- [x] Filtriranje i pretraga (backend-side)
- [x] Paginacija
- [x] Export izveštaja u Excel

---

## Deployment

Aplikacija je deployovana na **Ubuntu VPS** serveru (slavisadev.com/wms/).

### Backend (Gunicorn + Nginx)

```bash
pip install gunicorn
gunicorn wms_backend.wsgi:application --bind 0.0.0.0:8000
```

Nginx reverse proxy prosleđuje zahteve ka Gunicornu. SSL se konfiguriše putem Let's Encrypt / Certbot.

### Frontend

```bash
npm run build
```

`dist/` direktorijum se servira putem Nginxa.

---

## Struktura projekta

```
wms/
├── backend/
│   ├── wms_backend/          # Django projekat (settings, urls, wsgi)
│   ├── accounts/              # Zaposleni i autentifikacija
│   ├── warehouse/             # Skladišta, sektori, slotovi
│   ├── inventory/             # Proizvodi, kategorije, zalihe
│   ├── partners/              # Upravljanje partnerima
│   ├── transport/             # Upravljanje transportom
│   ├── documentss/            # Dokumentacija
│   ├── reports/               # Izveštaji
│   ├── core/                  # BaseModel i zajedničke klase
│   ├── requirements.txt
│   ├── manage.py
│   └── .env.development / .env.production
│
└── frontend/
    ├── src/
    │   ├── api/               # Axios instanca i API pozivi
    │   ├── context/           # AuthContext i ostali konteksti
    │   ├── hooks/             # Custom React hookovi
    │   ├── pages/             # Stranice aplikacije
    │   ├── components/        # Reusable komponente
    │   ├── layouts/           # Layout komponente
    │   └── types/             # TypeScript tipovi
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.ts
    └── tsconfig.json
```