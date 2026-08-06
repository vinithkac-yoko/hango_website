"use client";

import { useEffect, useState, type RefObject } from "react";
import SplitType from "split-type";

/**
 * Splits an element's text into word spans for scroll-scrubbed reveals.
 * Returns null until the split has run (and after unmount), so callers
 * should guard on that before building a GSAP timeline against it.
 */
export function useSplitWords(ref: RefObject<HTMLElement | null>, text: string) {
  const [words, setWords] = useState<HTMLElement[] | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const split = new SplitType(el, { types: "words", tagName: "span" });
    setWords(split.words ?? []);
    return () => {
      split.revert();
      setWords(null);
    };
  }, [ref, text]);

  return words;
}
