import { describe, expect, it } from "vitest";
import { itToHangul } from "./pronounce";

describe("itToHangul", () => {
  it("matches the beginner pronunciation guide for core c/g/sc/qu rules", () => {
    expect(itToHangul("casa cena ciao chi perché")).toBe("카사 체나 차오 키 페르케");
    expect(itToHangul("gatto gelato spaghetti")).toBe("가토 젤라토 스파게티");
    expect(itToHangul("scena scuola sciare schermo")).toBe("셰나 스쿠올라 샤레 스케르모");
    expect(itToHangul("quattro questo qui acqua")).toBe("콰트로 퀘스토 퀴 아쿠아");
  });

  it("avoids overly tense Korean readings for common double consonants", () => {
    expect(itToHangul("pizza mezzo ragazzo")).toBe("피차 메초 라가초");
    expect(itToHangul("italiano parliamo arrivederci")).toBe("이탈리아노 파를리아모 아리베데르치");
  });

  it("keeps Italian palatal sounds readable for Korean learners", () => {
    expect(itToHangul("gnocchi signore famiglia figlio")).toBe("뇨키 시뇨레 파밀리아 필리오");
  });
});
