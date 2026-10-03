# TypeScript review (Day 4)

## Mental model coming from Go / Python

| Concept          | Go / Python                 | TypeScript                                   |
| ---------------- | --------------------------- | -------------------------------------------- |
| Typing           | Nominal (Go) / dynamic (Py) | Structural: shape matters, not name          |
| Enums            | `const` + `iota` / `Enum`   | Literal unions: `"available" \| "sold"`      |
| Error handling   | `(val, err)` / exceptions   | Exceptions + `Result<T>` unions              |
| Concurrency      | goroutines / asyncio        | single-threaded `async/await`, `Promise.all` |
| Types at runtime | yes (Go)                    | **no** — erased after compile                |

## type vs interface

- My rule: Type is used as the general, while Interface is used if you wanna apply Inheritance ?

## Unions & narrowing

- ...
- Exhaustiveness with `never`: what happened when I added "archived": ...

## Generics

- ...

## async/await

- Sequential vs parallel timing

## Strict mode

- `??` vs `||`: Value checking

## Gotchas

- Files need `export {};` under `isolatedModules`.
- `catch (err)` gives `unknown`, narrow with `instanceof Error`.

## Where this shows up in SisaBangun

- `ItemStatus` / `ItemUnit` unions → mirror the Postgres enums (Day 13)
- `Result<T>` → Server Action responses (Day 22)
- `Promise.all` → fetch items + categories together on the catalog page (Day 16)
