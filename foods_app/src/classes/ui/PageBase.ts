// region local constants

const PAGE_HIDE_CLASS = 'tp-page--is-hidden';

// endregion

// region exports

export class PageBase {
  // region private variables

  private readonly m_id: string;

  private readonly m_title: string;

  private readonly m_pageElement: HTMLElement;

  // endregion

  // region public methods

  constructor(id: string, title: string) {
    this.m_id = id;
    this.m_title = title;
    this.m_pageElement = document.getElementById(id)!;
  }

  getPreviousPage(): PageBase | null {
    return null;
  }

  show(): void {
    this.onShowStart();
    this.m_pageElement.classList.remove(PAGE_HIDE_CLASS);
    document.title = `20 foods | ${this.m_title}`;
    this.onShowDone();
  }

  hide(): void {
    this.onHideStart();
    this.m_pageElement.classList.add(PAGE_HIDE_CLASS);
    this.onHideDone();
  }

  // region public methods

  /**
   * Scrolls the page to the top.
   */
  scrollToTop() {
    window.scrollTo(0, 0);
  }

  // endregion

  // region protected methods

  /**
   * Called when the page starts to show. The page is not yet visible at this point.
   *
   * The default implementation does nothing. Override this method to add custom behavior.
   *
   * @protected
   */
  protected onShowStart() {
  }

  /**
   * Called when the page has finished showing. The page is visible at this point.
   *
   * The default implementation does nothing. Override this method to add custom behavior.
   *
   * @protected
   */
  protected onShowDone() {
  }

  /**
   * Called when the page starts to hide. The page is still visible at this point.
   *
   * The default implementation does nothing. Override this method to add custom behavior.
   *
   * @protected
   */
  protected onHideStart(): void {
  }

  /**
   * Called when the page has finished hiding. The page is not visible at this point.
   *
   * The default implementation does nothing. Override this method to add custom behavior.
   *
   * @protected
   */
  protected onHideDone(): void {
  }

  // endregion
}

// endregion