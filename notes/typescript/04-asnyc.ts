export {};

type Item = { code: string; title: string };

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function fetchItems(): Promise<Item[]> {
  await sleep(300);
  return [
    { code: "SB-0001", title: "Andang besi" },
    { code: "SB-0002", title: "Mesin molen" },
  ];
}

async function fetchCategories(): Promise<string[]> {
  await sleep(500);
  return ["Andang & Perancah", "Mesin & Alat Kerja"];
}

async function fetchBroken(): Promise<Item[]> {
  await sleep(100);
  throw new Error("Supabase sedang down");
}

async function main() {
  console.time("sequential");
  await fetchItems();
  await fetchCategories();
  console.timeEnd("sequential"); // ~800ms

  console.time("parallel");
  const [items, categories] = await Promise.all([fetchItems(), fetchCategories()]);
  console.timeEnd("parallel"); // ~500ms
  console.log(items.length, categories.length);

  try {
    await fetchBroken();
  } catch (err) {
    // In strict mode `err` is `unknown`, so narrow it first
    if (err instanceof Error) console.log("Tertangkap:", err.message);
  }
}

main().catch(console.error);
