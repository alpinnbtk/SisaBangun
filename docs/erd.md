# Data Model (draft)

## ER diagram

```mermaid
erDiagram
    categories ||--o{ items : contains
    items ||--o{ item_photos : has

    categories {
        smallint id PK
        text name
        text slug UK
        smallint sort_order
        timestamptz created_at
    }

    items {
        uuid id PK
        text code UK "human-readable, e.g. SB-0012"
        text slug UK
        text title
        text description
        smallint category_id FK
        item_condition condition
        numeric quantity
        text unit "batang, lembar, m2, kg, unit"
        bigint price "rupiah; NULL = negotiable"
        text location_area "area only, not full address"
        item_status status "default: available"
        timestamptz created_at
        timestamptz updated_at
        timestamptz sold_at "nullable"
        timestamptz deleted_at "nullable = soft delete"
    }

    item_photos {
        uuid id PK
        uuid item_id FK
        text storage_path
        smallint sort_order "0 = cover photo"
        timestamptz created_at
    }
```

## Enums
- `item_status`: `available`, `reserved`, `sold`
- `item_condition`: `good`, `usable`, `needs_repair`

## Design decisions
| Decision | Reason |
|---|---|
| `price` is `bigint` rupiah, not float | Money must be exact; floats cause rounding errors |
| `price` NULL means "Nego" | Avoids a separate boolean that could contradict the price |
| Separate `code` besides `uuid` | UUIDs are unreadable in WhatsApp chats; `SB-0012` is easy to say and search |
| `quantity` is `numeric` + `unit` | Materials come in fractional amounts (2.5 m³) and mixed units |
| `location_area` instead of full address | Privacy: client project addresses are not published |
| Soft delete via `deleted_at` | Accidental deletes are recoverable; history stays intact |
| Photos store `storage_path`, not full URL | URLs change if the bucket or domain changes; paths don't |
| `item_photos.item_id` uses `ON DELETE CASCADE` | No orphaned photo rows |
| No `users` / `buyers` table | Admin lives in Supabase Auth; buyers have no accounts in v1 |

## Deferred (not in v1)
- Partial sales history (pending owner's answer)
- `inquiries` table for WhatsApp-click tracking (stretch goal)