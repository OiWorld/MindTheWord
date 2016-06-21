export var localData = {
  initialized: true,
  activation: true,
  blacklist: '(stackoverflow.com|github.com|code.google.com|developer.*.com|duolingo.com)',
  savedPatterns: JSON.stringify([
    [
      ['en', 'English'],
      ['it', 'Italian'], '25', true, 'Yandex'
    ],
    [
      ['en', 'English'],
      ['de', 'German'], '15', false, 'Yandex'
    ]
  ]),
  sourceLanguage: 'en',
  targetLanguage: 'it',
  translatedWordStyle: 'font-style: inherit;\ncolor: rgba(255,153,0,1);\nbackground-color: rgba(256, 100, 50, 0);',
  userBlacklistedWords: '(this|that)',
  translationProbability: 15,
  minimumSourceWordLength: 3,
  ngramMin: 1,
  ngramMax: 1,
  userDefinedTranslations: '{"the":"the", "a":"a"}',
  translatorService: 'Yandex',
  yandexTranslatorApiKey: '',
  googleTranslatorApiKey: '',
  bingTranslatorApiKey: '',
  playbackOptions: '{"volume": 1.0, "rate": 1.0, "voiceName": "Google US English", "pitch": 0.5 }',
  // format: {word1: E/N/H, word2: E/N/H}
  // E -> easy, N -> normal, H -> hard
  difficultyBuckets: '{}',
  learntWords:'()',
  savedTranslations: '{}',
  userDefinedOnly: false,
  doNotTranslate: false
};
