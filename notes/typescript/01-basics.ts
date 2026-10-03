export {};

// Inference: no annotation needed for simple values
const title = "Andang besi"; // string
const quantity = 12.5; // number — no int/float split, unlike Go
const tags = ["besi", "perancah"]; // string[]

// Annotate function params and return types explicitly
function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// type alias
type Category = {
  id: number;
  name: string;
  slug: string;
};

// interface
interface ItemPhoto {
  id: string;
  storagePath: string;
  sortOrder: number;
}

// Extending: interface uses `extends`, type uses `&`
interface ItemPhotoWithUrl extends ItemPhoto {
  url: string;
}
type CategoryWithCount = Category & { itemCount: number };

const category: CategoryWithCount = {
  id: 1,
  name: "Andang & Perancah",
  slug: "andang-perancah",
  itemCount: 4,
};
const photo: ItemPhotoWithUrl = {
  id: "p1",
  storagePath: "items/sb-0001/1.jpg",
  sortOrder: 0,
  url: "https://...",
};

console.log(title, quantity, tags, formatRupiah(125000));
console.log(category, photo);
