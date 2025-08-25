
import React from 'react';
import { useState } from 'react';
import PromptBuilder from './components/PromptBuilder';
import { WandSparklesIcon } from './components/icons';

type View = 'home' | 'builder' | 'examples' | 'tips';

const HomePage = ({ setView }: { setView: (view: View) => void }) => (
  <div className="text-center">
    <div className="flex justify-center items-center gap-4 mb-6">
      <WandSparklesIcon className="w-12 h-12 text-purple-400" />
      <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        PhotoPrompt Guru
      </h1>
    </div>
    <p className="text-slate-400 mb-10 max-w-2xl mx-auto">
      Assemble professional-quality photography prompts with an interactive, step-by-step builder. Turn your creative vision into perfectly crafted prompts.
    </p>
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
      <button
        onClick={() => setView('builder')}
        className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20"
      >
        Build New Prompt
      </button>
      <button
        onClick={() => setView('examples')}
        className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
      >
        See Examples
      </button>
      <button
        onClick={() => setView('tips')}
        className="w-full sm:w-auto bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
      >
        Tips & Best Practices
      </button>
    </div>
  </div>
);

const PlaceholderPage = ({ title, setView }: { title: string; setView: (view: View) => void }) => (
  <div className="text-center">
    <h1 className="text-4xl font-bold text-slate-200 mb-6">{title}</h1>
    <p className="text-slate-400 mb-8">This page is currently under construction. Check back soon!</p>
    <button
      onClick={() => setView('home')}
      className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-6 rounded-full transition-all duration-300"
    >
      Back to Home
    </button>
  </div>
);

const App = () => {
  const [view, setView] = useState<View>('home');

  const renderContent = () => {
    switch (view) {
      case 'builder':
        return <PromptBuilder setView={setView} />;
      case 'examples':
        return <PlaceholderPage title="Examples" setView={setView} />;
      case 'tips':
        return <PlaceholderPage title="Tips & Best Practices" setView={setView} />;
      case 'home':
      default:
        return <HomePage setView={setView} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
