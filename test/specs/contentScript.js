import { ContentScript } from 'lib/scripts/mtw'

describe('content script testing', function() {
  var chrome,
    contentScript;

  beforeEach(function(){
    chrome = global.chrome;
    contentScript = new ContentScript();
  })

  it('should return true for illegal characters', () => {
    expect(contentScript.containsIllegalCharacters('123')).toBe(true);
  });

});
