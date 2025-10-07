import React, { useState, useCallback, ChangeEvent } from 'react';
import { LANGUAGES } from './constants';
import { translateText } from './services/geminiService';
import Spinner from './components/Spinner';
import SwapIcon from './components/SwapIcon';

const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<string>(LANGUAGES[0].value);
  const [targetLang, setTargetLang] = useState<string>(LANGUAGES[1].value);
  const [sourceText, setSourceText] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSwapLanguages = useCallback(() => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  }, [sourceLang, targetLang, sourceText, translatedText]);

  const handleTranslate = useCallback(async () => {
    if (!sourceText.trim()) return;

    setIsLoading(true);
    setError(null);
    setTranslatedText('');

    try {
      const result = await translateText(sourceText, sourceLang, targetLang);
      setTranslatedText(result);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [sourceText, sourceLang, targetLang]);
  
  const handleSourceTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
    if(translatedText) setTranslatedText('');
    if(error) setError(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200 flex flex-col items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            وەرگێر
          </h1>
          <p className="text-lg text-gray-400 mt-2">وەرگێرانەکا بسانەهی و بلەز د ناڤبەرا زماناندا</p>
        </header>

        <main className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-gray-700">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 md:gap-4 mb-4">
            {/* Source Language Selector */}
            <div className="text-center">
              <label htmlFor="source-lang" className="block text-sm font-medium text-gray-400 mb-1">ژ زمانێ</label>
              <select
                id="source-lang"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
              </select>
            </div>
            
            {/* Swap Button */}
            <div className="mt-6">
               <button
                  onClick={handleSwapLanguages}
                  className="p-3 bg-gray-700 hover:bg-blue-600 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="گوهورینا زمانان"
                >
                  <SwapIcon className="w-5 h-5 text-gray-300" />
                </button>
            </div>

            {/* Target Language Selector */}
            <div className="text-center">
               <label htmlFor="target-lang" className="block text-sm font-medium text-gray-400 mb-1">بۆ زمانێ</label>
               <select
                id="target-lang"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {LANGUAGES.map(lang => <option key={lang.value} value={lang.value}>{lang.label}</option>)}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Source Text Area */}
            <div>
              <textarea
                value={sourceText}
                onChange={handleSourceTextChange}
                placeholder="ل ڤێرە دەقێ خو بنڤیسە..."
                className="w-full h-48 p-4 bg-gray-900/70 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                dir="auto"
                maxLength={1000000}
              />
              <div className="text-xs text-gray-500 text-left mt-1 px-1">
                {sourceText.length} / 1,000,000
              </div>
            </div>
            {/* Translated Text Area */}
            <div className="relative w-full h-48 p-4 bg-gray-900/70 border border-gray-700 rounded-xl overflow-y-auto mt-[22px] md:mt-0">
              {isLoading && <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center"><Spinner/></div>}
              {error && <div className="text-red-400 flex items-center justify-center h-full text-center">{error}</div>}
              {!isLoading && !error && (
                <p className="whitespace-pre-wrap text-lg" dir="auto">
                  {translatedText || <span className="text-gray-500">ئەنجام...</span>}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={handleTranslate}
              disabled={isLoading || !sourceText.trim()}
              className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-12 rounded-lg hover:opacity-90 transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 text-xl"
            >
              {isLoading ? '...چاوەرێ بە' : 'وەرگێران'}
            </button>
          </div>
        </main>

        <footer className="text-center mt-8">
          <p className="text-sm text-gray-500">Powered by Gemini API</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
