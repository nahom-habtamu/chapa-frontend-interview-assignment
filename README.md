## Chapa Frontend Interview Assignment

A full-featured demo app showcasing payments and transfers using Chapa APIs with a clean, scalable frontend architecture.

### Tech Stack
- Next.js (App Router)
- TypeScript
- React Hook Form + Zod (forms + validation)
- TanStack Query (server state)
- Tailwind CSS (UI)

### Environment Setup
Create a `.env` file in project root:

```
INTERNAL_CHAPA_PROXY_URL=chapaurl
CHAPA_SECRET_KEY=testsecretkey

```

- `CHAPA_SECRET_KEY`: toggles mocked data in some areas
- `INTERNAL_CHAPA_PROXY_URL`: server-side proxy base for Chapa requests

Install dependencies and run:
```
npm install
npm run dev
```
Visit `http://localhost:3000`.

### Project Structure

```
src/
  data/        # Data layer: API clients, hooks, schemas, types, localStorage
  feature/     # Feature layer: page-level logic and compositions
  ui/          # UI layer: atoms, molecules, organisms (pure presentational)
```

- `data/`
  - `common/`: API client, config
  - `auth/`: login/current-user hooks
  - `user/`: payment initialize/verify, transactions
  - `admin/`: banks, transfers (initiate/verify), admins
- `feature/`
  - `auth/`, `user/`, `admin/`: screen containers
- `ui/`
  - `atoms/`, `molecules/`, `organisms/`: reusable presentational components

### Mocked vs Integrated APIs

Mocked/Simulated (in dev):
- Admin list, Users list, Transactions list (localStorage-backed)
- Some initial dataset seeds via `mock-data`

Integrated via Chapa proxy:
- getBanks: GET `/v1/banks`
- initiateTransaction: POST `/v1/transaction/initialize`
- verifyTransaction: GET `/v1/transaction/verify/{txRef}`
- initiateTransfer: POST `/v1/transfers`
- verifyTransfer: GET `/v1/transfers/verify/{reference}`

Proxy location: `src/app/api/chapa/[...slug]/route.ts`
Client: `src/data/common/chapa-api-client.ts`

### Where to Test in the UI

Login credentials (mocked):
- Super Admin: `superadmin@chapa.co` / `super123`
- Admin: `admin@chapa.co` / `admin123`

1) Banks (getBanks)
- Login as Super Admin or Admin
- Navigate: Admin > Banks
- See list fetched via Chapa

2) Payments
- Navigate: User > Dashboard
- Initialize Payment: fill the form and submit
- Verify Payment: User > Transactions → click Verify on a row

3) Transfers (initiateTransfer, verifyTransfer)
- Login as Super Admin (`superadmin@chapa.co` / `super123`)
- Navigate: Admin > Transfers
- Click “Initiate Transfer”
  - Amount: e.g. 1
  - Currency: ETB or USD
  - Recipient: e.g. Abebe
  - Account Number: e.g. 1000472713888
  - Bank: select from dropdown (names shown, IDs submitted)
  - Reason: optional (e.g. Test)
- Submit → a reference is displayed; the row gets added and persisted (localStorage)
- Click "Verify" on a row to check transfer status

### Notes
- Transfers and Transactions are persisted in localStorage for demo purposes.
- Error handling surfaces nested API error messages when available.
