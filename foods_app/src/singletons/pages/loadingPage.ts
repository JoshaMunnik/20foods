import {PageBase} from "../../classes/ui/PageBase";

class LoadingPage extends PageBase {
  // region public methods

  constructor() {
    super('loading-page', 'loading');
  }
}

export const loadingPage = new LoadingPage();
