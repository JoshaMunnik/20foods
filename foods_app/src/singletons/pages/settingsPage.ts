// region imports

import {PageBase} from "../../classes/ui/PageBase";
import {UFHtml} from "@ultraforce/ts-dom-lib";
import {settings} from "../main/settings";
import {historyData} from "../data/historyData";

// endregion

// region local types

class SettingsPage extends PageBase {
  // region private variables

  private readonly m_weekStartSelect = UFHtml.getForId<HTMLSelectElement>(
    'week-start-select'
  );

  private readonly m_clearHistoryButton = UFHtml.getForId<HTMLButtonElement>(
    'clear-history-button'
  );

  // endregion

  // region public methods

  constructor() {
    super('settings-page', 'settings');
    this.m_weekStartSelect.addEventListener('change', () => this.handleWeekStartChange());
    this.m_clearHistoryButton.addEventListener('click', () => this.handleClearHistory());
  }

  // endregion

  // region protected methods

  protected onShowStart(): void {
    this.m_weekStartSelect.value = String(settings.startDayOfWeek);
  }

  // endregion

  // region event handlers

  private handleWeekStartChange() {
    const value = parseInt(this.m_weekStartSelect.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 6) {
      settings.startDayOfWeek = value;
    }
  }

  private handleClearHistory() {
    if (confirm('Are you sure you want to clear your history? This action cannot be undone.')) {
      historyData.clear();
    }
  }

  // endregion
}

// endregion

// region exports

export const settingsPage = new SettingsPage();

// endregion
