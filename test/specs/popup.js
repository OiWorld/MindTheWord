import { PopupCtrl } from '/lib/scripts/controllers/popup'

describe('popup page testing', () => {
  var ctrl,
    scope,
    chrome;

  beforeEach(() => {
    ctrl = new PopupCtrl(scope);
    chrome = global.chrome;
  });

  it('should get data on creation', () => {
    expect(chrome.storage.local.get).toHaveBeenCalled();
  });

  it('should set activation data', () => {

  });

  it('should open options page', () => {

  });

  it('should call options page toggle', () => {

  });

});
