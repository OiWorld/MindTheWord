import '/lib/scripts/eventPage'

/**
 * All chrome function calls should be mocked here.
 * To spy on chrome API calls, you need to mock them
 * out to global scope.
 * All these functions are spied by Jasmine to test
 * various functionalities
 */
global.chrome =  {
  storage: {
    local: {
      get: jasmine.createSpy('get'),
      set: jasmine.createSpy('set')
    }
  },
  contextMenus: {
    onClicked: {
      addListener: jasmine.createSpy('addListener')
    }
  },
  runtime: {
    onMessage: {
      addListener: jasmine.createSpy('addListener')
    },
    onInstalled: {
      addListener: jasmine.createSpy('addListener')
    }
  }
}

describe('event page (background page) testing', () => {

  var chrome;

  beforeEach(() => {
    chrome = global.chrome;
  });

  it('should add context menu click listeners', () => {
    expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
  });

  it('should check on Install condition', () => {
    // find a way to test
  });

  it('should setup default data', () => {
    // find a way to test
  });
});
