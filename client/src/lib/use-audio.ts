import { useCallback, useEffect, useRef } from "react";

export function useAudio(url: string) {
  const audio = useRef<HTMLAudioElement>();

  useEffect(() => {
    audio.current = new Audio("https://cdn.freesound.org/previews/683/683749_12504086-lq.mp3");
    return () => {
      if (audio.current) {
        audio.current.pause();
        audio.current = undefined;
      }
    };
  }, [url]);

  const play = useCallback(() => {
    if (audio.current) {
      audio.current.currentTime = 0;
      audio.current.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }, []);

  return play;
}
