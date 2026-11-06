import { describe, expect, it } from "vitest";
import { buildItemMessage, buildWhatsAppLink, itemUrl, normalizePhone } from "@/lib/whatsapp";

// Fake numbers only — this repo is public
describe("normalizePhone", () => {
  it("converts a leading 0 to the 62 country code", () => {
    expect(normalizePhone("081200000000")).toBe("6281200000000");
  });

  it("strips +, spaces and dashes", () => {
    expect(normalizePhone("+62 812-0000-0000")).toBe("6281200000000");
  });

  it("keeps a number that already starts with 62", () => {
    expect(normalizePhone("6281200000000")).toBe("6281200000000");
  });

  it("rejects numbers that are too short or not Indonesian", () => {
    expect(() => normalizePhone("12345")).toThrow();
    expect(() => normalizePhone("")).toThrow();
    expect(() => normalizePhone("+1 415 555 0100")).toThrow();
  });
});

describe("itemUrl", () => {
  it("builds an absolute item URL", () => {
    expect(itemUrl("pipa-pvc-3-inch-sb-0003", "https://sisabangun.id")).toBe(
      "https://sisabangun.id/barang/pipa-pvc-3-inch-sb-0003",
    );
  });

  it("does not double the slash when the site URL ends with one", () => {
    expect(itemUrl("pipa-pvc-3-inch-sb-0003", "https://sisabangun.id/")).toBe(
      "https://sisabangun.id/barang/pipa-pvc-3-inch-sb-0003",
    );
  });
});

describe("buildItemMessage", () => {
  it("includes the item code, title and link", () => {
    const message = buildItemMessage(
      { code: "SB-0003", title: "Pipa PVC 3 inch" },
      "https://sisabangun.id/barang/pipa-pvc-3-inch-sb-0003",
    );

    expect(message).toBe(
      [
        "Halo, saya tertarik dengan barang ini:",
        "[SB-0003] Pipa PVC 3 inch",
        "https://sisabangun.id/barang/pipa-pvc-3-inch-sb-0003",
        "",
        "Jumlah yang dibutuhkan: ",
        "Apakah masih tersedia?",
      ].join("\n"),
    );
  });
});

describe("buildWhatsAppLink", () => {
  it("points to wa.me with the normalized number", () => {
    const link = buildWhatsAppLink("081200000000", "Halo");
    expect(link.startsWith("https://wa.me/6281200000000?text=")).toBe(true);
  });

  it("encodes special characters so the message survives the URL round-trip", () => {
    const message = 'Pipa 3/4" & sambungan #2\nBaris kedua 100%';
    const link = buildWhatsAppLink("081200000000", message);

    // Decoding the URL must give back exactly the original text
    expect(new URL(link).searchParams.get("text")).toBe(message);
  });
});
