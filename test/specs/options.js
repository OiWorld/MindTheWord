import { OptionCtrl } from '/lib/scripts/controllers/options'

describe('options page testing', () => {
  var ctrl,
    scope,
    chrome;

  beforeEach(() => {
    ctrl = new OptionCtrl(scope);
    chrome = global.chrome;
  });

  describe('helper function tests', () => {
    it('should set data to default', () => {
      expect(ctrl.percentage).toEqual('15')
      expect(ctrl.translator).toEqual('Yandex')
      // check more
    });

    it('should call chrome.storage.local.set storage on save', () => {
      ctrl.save({data: 'check'}, 'message');
      expect(chrome.storage.local.set).toHaveBeenCalled();
    });
  })

  describe('pattern functions tests', ()  => {

    it('should call save on createPattern', () => {

    });

    it('should activate the selected pattern', () => {

    });

    it('should delete the selected pattern', () => {

    });

    it('should switch the key according to the translator', () => {

    });

    it('should update API key', () => {

    });

  })

  describe('blacklist functions tests', () => {
    it('should add a word to the blacklist', () => {

    });

    it('should add a website to the blacklist', () => {

    });
  });
});
