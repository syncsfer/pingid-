import { useState, useEffect, useRef, useCallback } from "react";

/**
 * useQRScanner
 *
 * Simulates a QR-code scanner viewport:
 * - Runs a rAF-driven animation frame counter while scanning.
 * - Accepts a wallet address string to "simulate" a scan (real camera
 *   integration would call `handleScanResult` from a decode callback).
 *
 * @param {number} [scanDelay=2000] - Ms to wait before resolving a simulated scan.
 * @returns {{
 *   scannerActive: boolean,
 *   scanAnimFrame: number,
 *   scanInput: string,
 *   scanResult: string | null,
 *   setScanInput: (v: string) => void,
 *   startScanner: () => void,
 *   stopScanner: () => void,
 *   simulateScan: () => void,
 *   resetScan: () => void
 * }}
 *
 * @example
 * const { scannerActive, scanAnimFrame, scanInput, setScanInput,
 *         simulateScan, scanResult } = useQRScanner();
 *
 * // Drive the scanning line position with `scanAnimFrame`
 * <div className="scanner-line" style={{ top: `${(scanAnimFrame * 1.5) % 100}%` }} />
 *
 * // Let the user paste an address and press "Scan"
 * <input value={scanInput} onChange={e => setScanInput(e.target.value)} />
 * <button onClick={simulateScan}>Scan</button>
 */
export function useQRScanner(scanDelay = 2000) {
  const [scannerActive, setScannerActive] = useState(false);
  const [scanAnimFrame, setScanAnimFrame] = useState(0);
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const timerRef = useRef(null);

  // Drive the animation-frame counter whenever the scanner is active.
  useEffect(() => {
    if (scannerActive) {
      let frame = 0;
      timerRef.current = setInterval(() => {
        frame++;
        setScanAnimFrame(frame);
      }, 50);
    } else {
      clearInterval(timerRef.current);
      setScanAnimFrame(0);
    }
    return () => clearInterval(timerRef.current);
  }, [scannerActive]);

  /** Activate the scanner viewport (e.g. open camera). */
  const startScanner = useCallback(() => setScannerActive(true), []);

  /** Deactivate the scanner and clear animation frames. */
  const stopScanner = useCallback(() => setScannerActive(false), []);

  /**
   * Simulate scanning the current `scanInput` value.
   * After `scanDelay` ms the result is set and the scanner stops.
   */
  const simulateScan = useCallback(() => {
    if (!scanInput.trim()) return;
    setScannerActive(true);
    setTimeout(() => {
      setScanResult(scanInput.trim());
      setScannerActive(false);
    }, scanDelay);
  }, [scanInput, scanDelay]);

  /** Dismiss the scan result and re-enable the input UI. */
  const resetScan = useCallback(() => {
    setScanResult(null);
    setScanInput("");
    setScannerActive(false);
  }, []);

  return {
    scannerActive,
    scanAnimFrame,
    scanInput,
    scanResult,
    setScanInput,
    startScanner,
    stopScanner,
    simulateScan,
    resetScan,
  };
}
