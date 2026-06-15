import { describe, expect, it } from "vitest";
import { itToHangul } from "./pronounce";

describe("itToHangul", () => {
  it("keeps soft c/e-i and apostrophe contractions close to actual Italian", () => {
    expect(itToHangul("cena ciao ci C'è C’era")).toBe("체나 차오 치 체 체라");
    expect(itToHangul("C'è il sole.")).toBe("체 일 솔레.");
  });

  it("uses tense Korean consonants for unaspirated Italian p/t/hard-c/k/q", () => {
    expect(itToHangul("casa chi perché")).toBe("까사 끼 뻬르께");
    expect(itToHangul("pasta tutto italiano")).toBe("빠스따 뚜또 이딸리아노");
    expect(itToHangul("quattro questo qui")).toBe("꽈뜨로 꿰스또 뀌");
  });

  it("handles core g/sc/gl/gn sounds without splitting the wrong letters", () => {
    expect(itToHangul("gatto gelato spaghetti")).toBe("가또 젤라또 스빠게띠");
    expect(itToHangul("scena scuola sciare schermo")).toBe("셰나 스꾸올라 샤레 스께르모");
    expect(itToHangul("gnocchi signore famiglia figlio")).toBe("뇨끼 시뇨레 파밀리아 필리오");
  });

  it("keeps common z and double-consonant words closer to Italian than Korean loanword spelling", () => {
    expect(itToHangul("pizza mezzo ragazzo")).toBe("삐짜 메쪼 라가쪼");
    expect(itToHangul("acqua arrivederci")).toBe("아꾸아 아리베데르치");
  });
});
