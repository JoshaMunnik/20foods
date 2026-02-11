// region imports

import {PageBase} from "../../classes/ui/PageBase";
import {historyData} from "../data/historyData";
import {UFHtml} from "@ultraforce/ts-dom-lib";
import {mainController} from "../main/mainController";
import {Text} from "../../classes/support/Text";
import {Tools} from "../../classes/support/Tools";
import {applicationData} from "../data/applicationData";
import {CssClass} from "../../types/CssClass";

// endregion

class HomePage extends PageBase {
  // region private variables

  private readonly m_foodCount = UFHtml.getForId('food-count');

  private readonly m_dayCount = UFHtml.getForId('day-count');

  private readonly m_weekStart = UFHtml.getForId('week-start');

  private readonly m_today = UFHtml.getForId('today');

  private readonly m_settingsButton = UFHtml.getForId<HTMLButtonElement>(
    'settings-button'
  );

  private readonly m_historyButton = UFHtml.getForId<HTMLButtonElement>(
    'history-button'
  );

  private readonly m_dictateButton = UFHtml.getForId<HTMLButtonElement>(
    'dictate-button'
  );

  private readonly m_manualButton = UFHtml.getForId<HTMLButtonElement>(
    'manual-button'
  );

  private readonly m_missingSpeechRecognition = UFHtml.getForId(
    'missing-speech-recognition'
  );

  // endregion

  // region public methods

  constructor() {
    super('home-page', 'home');
    this.m_settingsButton.addEventListener('click', () => this.handleSettingsButtonClick());
    this.m_historyButton.addEventListener('click', () => this.handleHistoryButtonClick());
    this.m_manualButton.addEventListener('click', () => this.handleManualButtonClick());
    if (Tools.hasSpeechRecognitionSupport()) {
      this.m_missingSpeechRecognition.classList.add(CssClass.Hidden);
      this.m_dictateButton.addEventListener('click', () => this.handleDictateButtonClick());
    }
    else {
      this.m_dictateButton.disabled = true;
      this.m_dictateButton.classList.add(CssClass.Hidden);
    }
  }

  // endregion

  // region protected methods

  protected onShowStart() {
    const current = historyData.getCountForToday();
    this.m_weekStart.innerText = Text.formatDate(current.startDate);
    this.m_today.innerText = Text.formatDate(new Date());
    this.m_dayCount.innerText = (7 - Tools.daysBetween(current.startDate, new Date())).toString();
    this.m_foodCount.innerText = current.foods.length.toString();
    this.m_foodCount.classList.toggle(CssClass.TextSuccess, current.foods.length >= 20);
  }

  // endregion

  // region event handlers

  private handleSettingsButtonClick() {
    mainController.showSettings();
  }

  private handleHistoryButtonClick() {
    mainController.showHistory();
  }

  private handleDictateButtonClick() {
    mainController.showDictation();
  }

  private handleManualButtonClick() {
    applicationData.compareEntries = [];
    mainController.showConfirm();
  }

  // endregion
}

export const homePage = new HomePage();