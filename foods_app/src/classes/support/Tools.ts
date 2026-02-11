// region imports

import {UFText} from "@ultraforce/ts-general-lib";

// endregion

// region local constants

const MILLISECONDS_PER_DAY: number = 24 * 60 * 60 * 1000;

// endregion

// region export

/**
 * IO support methods
 */
export class Tools {
  /**
   * Loads a CSV file from the specified URL and parses it into an array of rows, where each row is
   * an array of cell values.
   *
   * @param url
   *
   * @returns A promise that resolves to a 2D array of strings representing the CSV data.
   */
  static async loadCSV(url: string): Promise<string[][]> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load CSV: ${response.status}`);
    const text = await response.text();
    return UFText.parseCSV(text);
  }

  /**
   * Calculates the number of full days between two dates, ignoring time components.
   * The result is always non-negative, regardless of the order of the input dates.
   *
   * @param first
   * @param second
   *
   * @return The number of full days between the two dates.
   */
  static daysBetween(first: Date, second: Date): number {
    const utcFirst = Date.UTC(first.getFullYear(), first.getMonth(), first.getDate());
    const utcSecond = Date.UTC(second.getFullYear(), second.getMonth(), second.getDate());
    return Math.abs(Math.floor((utcSecond - utcFirst) / MILLISECONDS_PER_DAY));
  }

  /**
   * Checks if the browser supports the Web Speech API for speech recognition.
   *
   * @returns `true` if speech recognition is supported, otherwise `false`.
   */
  static hasSpeechRecognitionSupport(): boolean {
    return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
  }
}

// endregion
