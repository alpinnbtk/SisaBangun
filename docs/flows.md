# User Flows

Based on [`requirements.md`](requirements.md).

## 1. Buyer flow

```mermaid
flowchart TD
    A[Lands on homepage<br/>from Google / WA / FB link] --> B[Browses catalog]
    B --> C{Filter or search?}
    C -->|Category / keyword| B
    C -->|Picks an item| D[Item detail page:<br/>photos, condition, qty + unit,<br/>price per unit or 'Nego']
    D --> E{Status?}
    E -->|available| F[Taps 'Pesan via WhatsApp']
    E -->|reserved / sold| G[Sees badge, browses other items]
    G --> B
    F --> H[WhatsApp opens to the OWNER'S number<br/>with pre-filled message:<br/>item code + name + link]
    D -. primary unreachable .-> H2[Small 'Nomor cadangan' link<br/>→ backup number, same message]
    H --> I[Negotiation in chat:<br/>price + quantity wanted]
    H2 --> I
    I --> J[Payment: bank transfer<br/>or cash right before pickup]
    J --> K[Buyer picks up goods]
```

**Notes**

- Buyers never create an account; the site never handles money in v1.
- The pre-filled message lets the buyer state the quantity they want, since partial purchase is allowed.
- The backup number is deliberately less prominent so chats go to the owner first.
- Payment methods are shown as static info on the detail page (transfer / tunai saat ambil).

## 2. Admin flow (owner, on a phone)

```mermaid
flowchart TD
    A[Opens /admin] --> B{Logged in?}
    B -->|No| C[Login with email + password]
    C --> D
    B -->|Yes| D[Item list]
    D --> E[Add new item]
    E --> E1[Title, category, condition,<br/>quantity + unit, price per unit or blank = Nego]
    E1 --> E2[Upload photos from camera/gallery]
    E2 --> E3[Save → item is live as 'available']
    D --> F[Change status with one tap]
    D --> P[Record partial sale:<br/>reduce remaining quantity]
    D --> G[Edit or delete item]
```

## 3. Item status lifecycle (with partial sales)

```mermaid
stateDiagram-v2
    [*] --> available: admin creates item
    available --> available: partial sale<br/>(quantity reduced, still > 0)
    available --> reserved: buyer commits to the WHOLE remaining stock
    reserved --> available: deal cancelled
    reserved --> sold: payment + pickup done
    available --> sold: remaining quantity reaches 0
    sold --> [*]
```

**Rules**

- A partial sale only lowers `quantity`; the item stays `available`.
- `reserved` is used only when a buyer commits to everything that is left.
- When `quantity` reaches 0 the item becomes `sold` (enforced in the database later).

## 4. Open questions

See [`requirements.md`](requirements.md#open-questions).
