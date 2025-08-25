import React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import type { PromptData, PromptOptions } from '../types';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { CopyIcon, CheckIcon } from './icons';

type Step = {
  key: keyof PromptData;
  title: string;
  type: 'select' | 'freeform-select' | 'freeform' | 'multi-select-grouped';
  options?: string[] | Record<string, string[]>;
  optional?: boolean;
};

const FinalOutput = ({ prompt, onReset }: { prompt: Required<PromptData>; onReset: () => void }) => {
  const { isCopied: isStringCopied, copy: copyString } = useCopyToClipboard();
  const { isCopied: isJsonCopied, copy: copyJson } = useCopyToClipboard();

  const generatedString = [
    prompt.style ? `${prompt.style} photo of a` : 'Photo of a',
    prompt.subject,
    prompt.details,
    prompt.pose,
    prompt.framing,
    prompt.setting,
    prompt.lighting,
    prompt.camera_angle,
    prompt.camera_properties.join(', '),
    prompt.photographer ? `in style of ${prompt.photographer}` : ''
  ].filter(Boolean).join(', ') + '.';
  
  const generatedJson = JSON.stringify({
    style: prompt.style,
    subject: prompt.subject,
    details: prompt.details,
    pose: prompt.pose,
    framing: prompt.framing,
    setting: prompt.setting,
    lighting: prompt.lighting,
    camera_angle: prompt.camera_angle,
    camera_properties: prompt.camera_properties.join(', '),
    photographer: prompt.photographer
  }, null, 2);

  return (
    <div className="space-y-6 bg-slate-800/50 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">Your prompt is ready!</h2>
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-300">Generated Prompt String</h3>
        <div className="relative bg-slate-900 rounded-md p-4 pr-12 text-slate-300">
          <p>{generatedString}</p>
          <button onClick={() => copyString(generatedString)} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition">
            {isStringCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="font-semibold text-slate-300">JSON Output</h3>
        <div className="relative bg-slate-900 rounded-md p-4 pr-12 text-slate-300">
          <pre className="whitespace-pre-wrap break-all"><code>{generatedJson}</code></pre>
          <button onClick={() => copyJson(generatedJson)} className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition">
            {isJsonCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
       <div className="text-center pt-4">
        <button onClick={onReset} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-full transition-all duration-300">
          Start Over
        </button>
      </div>
    </div>
  );
};

const PromptBuilder = ({ setView }: { setView: (view: 'home') => void }) => {
  const [options, setOptions] = useState<PromptOptions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [promptData, setPromptData] = useState<PromptData>({});
  const [inputValue, setInputValue] = useState('');
  const [selectedCameraProps, setSelectedCameraProps] = useState<string[]>([]);
  const endOfStepsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/data/options.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PromptOptions = await response.json();
        setOptions(data);
      } catch (e) {
        console.error("Failed to fetch prompt options:", e);
        setError("Could not load prompt options. Please try refreshing the page.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOptions();
  }, []);

  const STEPS: Step[] = useMemo(() => {
    if (!options) return [];
    return [
      { key: 'style', title: 'Choose a photo style', type: 'select', options: options.styles },
      { key: 'subject', title: 'Describe your subject', type: 'freeform-select', options: options.subjects },
      { key: 'details', title: 'Add important features or details', type: 'freeform', optional: true },
      { key: 'pose', title: 'What is the pose or action?', type: 'select', options: options.poses },
      { key: 'framing', title: 'Select the framing', type: 'select', options: options.framing },
      { key: 'setting', title: 'Describe the setting/background', type: 'select', options: options.settings },
      { key: 'lighting', title: 'Choose the lighting style', type: 'select', options: options.lighting },
      { key: 'camera_angle', title: 'What is the camera angle?', type: 'select', options: options.camera_angles },
      { key: 'camera_properties', title: 'Select camera properties', type: 'multi-select-grouped', options: options.camera_properties },
      { key: 'photographer', title: 'Finally, choose a photographer\'s style', type: 'select', options: options.photographers },
    ];
  }, [options]);


  useEffect(() => {
    endOfStepsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep]);

  const handleSelect = (key: keyof PromptData, value: string) => {
    setPromptData(prev => ({ ...prev, [key]: value }));
    setCurrentStep(prev => prev + 1);
  };
  
  const handleFreeformSubmit = (key: keyof PromptData) => {
    if (STEPS[currentStep] && (inputValue.trim() || STEPS[currentStep].optional)) {
      setPromptData(prev => ({ ...prev, [key]: inputValue.trim() }));
      setInputValue('');
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleCameraPropsSubmit = () => {
    setPromptData(prev => ({...prev, camera_properties: selectedCameraProps }));
    setCurrentStep(prev => prev + 1);
  }

  const toggleCameraProp = (prop: string) => {
    setSelectedCameraProps(prev => 
      prev.includes(prop) ? prev.filter(p => p !== prop) : [...prev, prop]
    );
  };

  const resetBuilder = () => {
    setCurrentStep(0);
    setPromptData({});
    setInputValue('');
    setSelectedCameraProps([]);
  };

  const renderStepContent = (step: Step) => {
    switch (step.type) {
      case 'select':
        return (
          <div className="flex flex-wrap gap-2">
            {(step.options as string[]).map(option => (
              <button key={option} onClick={() => handleSelect(step.key, option)} className="bg-slate-700 text-slate-200 px-4 py-2 rounded-full hover:bg-purple-600 hover:text-white transition-colors duration-200">
                {option}
              </button>
            ))}
          </div>
        );
      case 'freeform-select':
        return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFreeformSubmit(step.key)}
                className="w-full bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type or select an option..."
              />
              <button onClick={() => handleFreeformSubmit(step.key)} className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition">Next</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(step.options as string[]).map(option => (
                <button key={option} onClick={() => setInputValue(option)} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-full text-sm hover:bg-slate-600 transition-colors">
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 'freeform':
         return (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleFreeformSubmit(step.key)}
                className="w-full bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe details (optional)..."
              />
               <button onClick={() => handleFreeformSubmit(step.key)} className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition">
                {inputValue.trim() ? 'Next' : 'Skip'}
              </button>
            </div>
          </div>
        );
      case 'multi-select-grouped':
        return (
          <div className="space-y-6">
            {Object.entries(step.options as Record<string, string[]>).map(([group, items]) => (
              <div key={group}>
                <h4 className="font-semibold text-slate-400 mb-2 capitalize">{group.replace(/_/g, ' ')}</h4>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <button key={item} onClick={() => toggleCameraProp(item)} className={`px-4 py-2 rounded-full transition-colors duration-200 ${selectedCameraProps.includes(item) ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-200 hover:bg-slate-600'}`}>
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="text-right">
              <button onClick={handleCameraPropsSubmit} className="bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition">Next</button>
            </div>
          </div>
        )
      default:
        return null;
    }
  };
  
  const getAnswerForStep = (step: Step, data: PromptData) => {
    const value = data[step.key];
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Skipped';
    }
    return value || 'Skipped';
  }

  if (isLoading) {
    return (
      <div className="text-center text-slate-400">
        <p>Loading prompt builder...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="text-center text-red-400 space-y-4">
        <p>{error}</p>
        <button onClick={() => setView('home')} className="bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-6 rounded-full transition-all duration-300">&larr; Back to Home</button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto space-y-8">
      <button onClick={() => setView('home')} className="text-slate-400 hover:text-white transition-colors">&larr; Back to Home</button>
      {STEPS.slice(0, currentStep).map((step) => (
        <div key={step.key} className="animate-fade-in">
          <div className="p-4 rounded-lg bg-slate-800/50 mb-2">
            <p className="font-semibold text-slate-400">{step.title}</p>
          </div>
           <div className="p-4 rounded-lg bg-purple-600/80 ml-auto max-w-max">
            <p className="font-medium text-white">{getAnswerForStep(step, promptData)}</p>
          </div>
        </div>
      ))}

      {currentStep < STEPS.length && (
         <div className="p-6 rounded-lg bg-slate-800/50 animate-fade-in">
            <h3 className="font-semibold text-lg text-slate-300 mb-4">{STEPS[currentStep].title}</h3>
            {renderStepContent(STEPS[currentStep])}
         </div>
      )}

      {currentStep >= STEPS.length && promptData && (
        <FinalOutput prompt={promptData as Required<PromptData>} onReset={resetBuilder} />
      )}
      <div ref={endOfStepsRef} />
    </div>
  );
};

export default PromptBuilder;
