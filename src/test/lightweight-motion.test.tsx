import { act, renderHook, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useLightweightMotion } from "@/hooks/use-lightweight-motion";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("decorative motion eligibility", () => {
  function mockScreen(matches: boolean) {
    vi.spyOn(window, "matchMedia").mockReturnValue({ matches, addEventListener: vi.fn(), removeEventListener: vi.fn() } as unknown as MediaQueryList);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
  }
  it("keeps small, touch or reduced-motion screens lightweight", () => {
    mockScreen(true);
    expect(renderHook(useLightweightMotion).result.current).toBe(true);
  });
  it("allows decorative playback on visible desktop screens", () => {
    mockScreen(false);
    expect(renderHook(useLightweightMotion).result.current).toBe(false);
  });
  it("stops decorative playback when the tab is hidden", () => {
    mockScreen(false);
    const { result } = renderHook(useLightweightMotion);
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    act(() => { document.dispatchEvent(new Event("visibilitychange")); });
    expect(result.current).toBe(true);
  });
});