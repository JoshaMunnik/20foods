// region imports

import {PageBase} from "../../classes/ui/PageBase";
import {loadingPage} from "../pages/loadingPage";
import {homePage} from "../pages/homePage";
import {WeekEntry} from "../../classes/data/WeekEntry";
import {applicationData} from "../data/applicationData";
import {weekPage} from "../pages/weekPage";
import {settingsPage} from "../pages/settingsPage";
import {historyPage} from "../pages/historyPage";
import {dictationPage} from "../pages/dictationPage";
import {confirmPage} from "../pages/confirmPage";
import {addPage} from "../pages/addPage";

// endregion

// region local type

class MainController {
  // region private variables

  private m_pageStack: PageBase[] = [];

  // endregion

  // region public methods

  start() {
    loadingPage.hide();
    //this.showPage(confirmPage);
    this.showPage(homePage);
  }

  back(): void {
    const currentPage = this.m_pageStack.pop();
    if (currentPage) {
      currentPage.hide();
    }
    if (this.m_pageStack.length > 0) {
      this.m_pageStack.at(-1)!.show();
    }
  }

  showAdd(): void {
     this.showPage(addPage);
  }

  showConfirm(): void {
    // do not go back to dictation page but go back to page before that
    this.showPage(confirmPage, this.m_pageStack.at(-1) === dictationPage);
  }

  showDictation(): void {
    this.showPage(dictationPage);
  }

  showHistory(): void {
    this.showPage(historyPage);
  }

  showSettings(): void {
    this.showPage(settingsPage);
  }

  showWeek(week: WeekEntry): void {
    applicationData.selectedWeek = week;
    this.showPage(weekPage);
  }

  // endregion

  // region private methods

  /**
   * Shows the given page.
   *
   * @param page
   * @param replace
   *   When true, the current page at the top of the stack is replaced by the new page. Else the new
   *   page is added on top of the stack.
   *
   * @private
   */
  private showPage(page: PageBase, replace: boolean = false): void {
    if (this.m_pageStack.length > 0) {
      this.m_pageStack.at(-1)!.hide();
    }
    if (replace) {
      this.m_pageStack.pop();
    }
    this.m_pageStack.push(page);
    page.show();
  }

  // endregion
}

// endregion

// region exports

export const mainController = new MainController();

// endregion
