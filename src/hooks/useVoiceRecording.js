import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useVoiceRecording
 *
 * Manages voice-recording UI state including a running elapsed-time
 * counter. Does not access the MediaRecorder API – the recording flag
 * is toggled externally so the hook can remain testable without mic
 * permissions.
 *
 * @returns {{
 *   recording: boolean,
 *   recordTime: number,
 *   startRecording: () => void,
 *   stopRecording: () => void,
 *   cancelRecording: () => void
 * }}
 *
 * @example
 * const { recording, recordTime, startRecording, stopRecording, cancelRecording } =
 *   useVoiceRecording();
 *
 * // Start
 * <button onClick={startRecording}>🎤</button>
 *
 * // While recording – show elapsed time and controls
 * {recording && (
 *   <>
 *     <span>{recordTime}s</span>
 *     <button onClick={cancelRecording}>Cancel</button>
 *     <button onClick={() => { const dur = stopRecording(); sendVoice(dur); }}>Send</button>
 *   </>
 * )}
 */
export function useVoiceRecording() {
  const [recording, setRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef(null);

  // Start / stop the elapsed-time interval whenever `recording` changes.
  useEffect(() => {
    if (recording) {
      setRecordTime(0);
      timerRef.current = setInterval(
        () => setRecordTime((t) => t + 1),
        1000
      );
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [recording]);

  /** Begin recording and reset the timer. */
  const startRecording = useCallback(() => setRecording(true), []);

  /**
   * Finish recording.
   * @returns {number} The elapsed time in seconds at the moment of stopping.
   */
  const stopRecording = useCallback(() => {
    setRecording(false);
    return recordTime;
  }, [recordTime]);

  /** Discard the recording without returning a duration. */
  const cancelRecording = useCallback(() => setRecording(false), []);

  return { recording, recordTime, startRecording, stopRecording, cancelRecording };
}
