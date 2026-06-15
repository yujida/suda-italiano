/**
 * useProgress - 학습 진도 로컬스토리지 훅
 * 완료한 카드 ID, 즐겨찾기 카드 ID를 저장/불러오기
 */
import { useState, useCallback } from "react";

const COMPLETED_KEY = "suda_completed_cards";
const BOOKMARKED_KEY = "suda_bookmarked_cards";

function loadSet(key: string): Set<string> {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function saveSet(key: string, set: Set<string>) {
  localStorage.setItem(key, JSON.stringify(Array.from(set)));
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<string>>(() => loadSet(COMPLETED_KEY));
  const [bookmarked, setBookmarked] = useState<Set<string>>(() => loadSet(BOOKMARKED_KEY));

  const markCompleted = useCallback((cardId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.add(cardId);
      saveSet(COMPLETED_KEY, next);
      return next;
    });
  }, []);

  const unmarkCompleted = useCallback((cardId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.delete(cardId);
      saveSet(COMPLETED_KEY, next);
      return next;
    });
  }, []);

  const toggleCompleted = useCallback((cardId: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      saveSet(COMPLETED_KEY, next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((cardId: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      saveSet(BOOKMARKED_KEY, next);
      return next;
    });
  }, []);

  const isCompleted = useCallback((cardId: string) => completed.has(cardId), [completed]);
  const isBookmarked = useCallback((cardId: string) => bookmarked.has(cardId), [bookmarked]);

  const resetProgress = useCallback(() => {
    const empty = new Set<string>();
    setCompleted(empty);
    saveSet(COMPLETED_KEY, empty);
  }, []);

  return {
    completed,
    bookmarked,
    markCompleted,
    unmarkCompleted,
    toggleCompleted,
    toggleBookmark,
    isCompleted,
    isBookmarked,
    resetProgress,
    completedCount: completed.size,
    bookmarkedCount: bookmarked.size,
  };
}
