// region imports

import {PageBase} from "../../classes/ui/PageBase";
import {UFHtml} from "@ultraforce/ts-dom-lib";
import {CssClass} from "../../types/CssClass";
import {applicationData} from "../data/applicationData";
import {foodData} from "../data/foodData";
import {mainController} from "../main/mainController";
import {Text} from "../../classes/support/Text";
import {Tools} from "../../classes/support/Tools";

// endregion

// region local constants

const STOP_WORDS: string[] = ['stop', 'done', 'finish'];

// endregion

// region local types

class DictationPage extends PageBase {
  // region private variables

  private readonly m_status = UFHtml.getForId('dictation-status');

  private readonly m_pauseButton = UFHtml.getForId<HTMLButtonElement>(
    'dictation-pause-button'
  );

  private readonly m_recordButton = UFHtml.getForId<HTMLButtonElement>(
    'dictation-record-button'
  );

  private readonly m_stopButton = UFHtml.getForId<HTMLButtonElement>(
    'dictation-stop-button'
  );

  private readonly m_recordedText = UFHtml.getForId<HTMLDivElement>(
    'dictation-recorded-text'
  );

  private readonly m_recognition: SpeechRecognition | null = null;

  private m_active: boolean = false;

  // endregion

  // region public methods

  constructor() {
    super('dictation-page', 'dictate entries');
    if (Tools.hasSpeechRecognitionSupport()) {
      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.m_recognition = new SpeechRecognitionClass();
      this.m_recognition.lang = 'en-US';
      this.m_recognition.continuous = true;
      this.m_recognition.interimResults = true;
      this.m_recognition.maxAlternatives = 1;
      this.m_recognition.addEventListener(
        'result',
        (event: SpeechRecognitionEvent) => this.handleRecognitionResult(event)
      );
      this.m_recognition.addEventListener(
        'error',
        (event: SpeechRecognitionErrorEvent) => this.handleRecognitionError(event)
      );
      this.m_recognition.addEventListener('end', () => this.handleRecognitionEnd());
    }
    this.m_recordButton.addEventListener('click', () => this.handleRecordClick());
    this.m_pauseButton.addEventListener('click', () => this.handlePauseClick());
    this.m_stopButton.addEventListener('click', () => this.handleStopClick());
  }

  // endregion

  // region protected methods

  protected onShowStart(): void {
    this.m_active = true;
    this.m_recordedText.innerText = '';
    this.showPause();
    this.startRecording();
  }

  protected onHideDone() {
  }

  // endregion

  // region private methods

  private showPause(): void {
    this.m_pauseButton.classList.remove(CssClass.Hidden);
    this.m_recordButton.classList.add(CssClass.Hidden);
    this.m_status.innerText = 'Recording';
  }

  private showRecord(): void {
    this.m_pauseButton.classList.add(CssClass.Hidden);
    this.m_recordButton.classList.remove(CssClass.Hidden);
    this.m_status.innerText = 'Paused';
  }

  private startRecording(): void {
    try {
      this.m_recognition!.start();
    } catch (err) {
      // start() can throw if called while already running
      console.warn(err);
    }
  }

  private stop(): void {
    if (this.m_active) {
      this.m_active = false;
      this.m_recognition!.stop();
      this.processTranscript();
      mainController.showConfirm();
    }
  }

  private processTranscript(): void {
    applicationData.compareEntries = foodData.processText(this.m_recordedText.innerText);
  }

  private containsStopCommand(text: string): boolean {
    const normalizedText = Text.normalizeForComparison(text);
    return STOP_WORDS.some(stopWord => normalizedText.includes(stopWord));
  }

  // endregion

  // region event handlers

  private handleRecognitionResult(event: SpeechRecognitionEvent): void {
    let interimTranscript = '';
    for (let index = event.resultIndex; index < event.results.length; index++) {
      const transcript = event.results[index][0].transcript;
      if (event.results[index].isFinal) {
        this.m_recordedText.innerText += transcript + ' ';
      } else {
        interimTranscript += transcript;
      }
    }
    if (this.containsStopCommand(this.m_recordedText.innerText)) {
      this.stop();
    }
  }

  private handleRecognitionError(event: SpeechRecognitionErrorEvent): void {
    console.error('Recognition Error:', event);
    this.showRecord();
  }

  private handleRecognitionEnd(): void {
    this.showRecord();
  }

  private handleRecordClick(): void {
    this.m_recognition!.start();
    this.showPause();
  }

  private handlePauseClick(): void {
    this.m_recognition!.stop();
    this.showRecord();
  }

  private handleStopClick(): void {
    this.stop();
  }

  // endregion
}

// endregion

// region exports

export const dictationPage = new DictationPage();

// endregion