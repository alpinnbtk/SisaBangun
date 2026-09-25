# User Flows

## 1. Buyer flow

```mermaid
flowchart TD
    A[Lands on homepage<br/>from Google / WA / FB link] --> B[Browses catalog]
    B --> C{Filter or search?}
    C -->|Category / keyword| B
    C -->|Picks an item| D[Item detail page]
    D --> E{Status?}
    E -->|available| F[Taps 'Pesan via WhatsApp']
    E -->|reserved / sold| G[Sees badge, browses other items]
    G --> B
    F --> H[WhatsApp opens with pre-filled message:<br/>item code + name + link]
    H --> I[Negotiation, inspection, payment,<br/>pickup — all offline in chat]
```

**Notes**
- Buyers never create an account.
- The site never handles money in v1.
- Sold items stay visible (greyed out) for a while as social proof, then are hidden.

## 2. Admin flow (owner, on a phone)

```mermaid
flowchart TD
    A[Opens /admin] --> B{Logged in?}
    B -->|No| C[Login with email + password]
    C --> D
    B -->|Yes| D[Item list]
    D --> E[Add new item]
    E --> E1[Fill title, category, condition,<br/>quantity + unit, price or 'nego', location]
    E1 --> E2[Upload photos from camera/gallery]
    E2 --> E3[Save → item is live as 'available']
    D --> F[Change status with one tap]
    D --> G[Edit or delete item]
```

## 3. Item status lifecycle

```mermaid
stateDiagram-v2
    [*] --> available: admin creates item
    available --> reserved: buyer agrees in chat
    reserved --> available: deal cancelled
    reserved --> sold: payment + pickup done
    available --> sold: direct sale
    sold --> [*]
```

## 4. Open questions for the owner
- [ ] Can an item be sold partially (e.g. 10 of 50 steel bars)?
- [ ] How long should sold items stay visible?
- [ ] Is there more than one person who will update listings?