import { describe, expect, it } from "vitest";
import { itToHangul } from "./pronounce";

describe("itToHangul", () => {
  it("keeps apostrophe contractions connected so C'è is pronounced 체", () => {
    expect(itToHangul("C'è il sole.")).toBe("체 일 솔레.");
    expect(itToHangul("C’era")).toBe("체라");
  });

  it("keeps hard c/ch/q/p/t close to unaspirated Italian", () => {
    expect(itToHangul("casa chi perché pasta tutto")).toBe("까사 끼 뻬르께 빠스따 뚜또");
  });
});
