import React, { useState } from 'react';
import { EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export const PanicScreen = ({ onExitPanic }) => {
  const [calcInput, setCalcInput] = useState('');

  return (
    <div
      id="panicDisguiseContainer"
      className="fixed inset-0 z-[100] bg-white text-slate-900 font-sans select-text overflow-y-auto"
    >
      {/* Google Docs / Classroom Header Disguise */}
      <div className="border-b border-gray-200 bg-white sticky top-0 px-6 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-800">
                AP World History — Unit 5: Industrial Revolution & Global Economy Notes
              </span>
              <span className="text-[11px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" /> Saved to Drive
              </span>
            </div>
            <div className="flex gap-3 text-xs text-gray-500 mt-0.5">
              <span className="hover:underline cursor-pointer">File</span>
              <span className="hover:underline cursor-pointer">Edit</span>
              <span className="hover:underline cursor-pointer">View</span>
              <span className="hover:underline cursor-pointer">Insert</span>
              <span className="hover:underline cursor-pointer">Format</span>
              <span className="hover:underline cursor-pointer">Tools</span>
            </div>
          </div>
        </div>

        {/* Discreet Return Button */}
        <button
          onClick={onExitPanic}
          title="Return to semagdekcolbnu.co.uk (or press ESC)"
          className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition flex items-center gap-1.5 cursor-pointer"
        >
          <EyeOff className="w-3.5 h-3.5" />
          <span>Exit Stealth (Esc)</span>
        </button>
      </div>

      {/* Realistic Document Paper Page */}
      <div className="max-w-4xl mx-auto my-8 bg-white border border-gray-300 shadow-md p-12 min-h-[90vh]">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Unit 5 Study Guide: Technological Innovations & Economic Systems (1750–1900)
        </h1>
        <p className="text-xs text-gray-500 mb-6">
          Student Name: Jordan M. • Date: September 2026 • Class: AP European & World History Period 4
        </p>

        <hr className="border-gray-200 my-4" />

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
          1. Key Catalysts of the First Industrial Revolution in Great Britain
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          The transformation from agrarian handicraft economies to machine-driven manufacturing began predominantly in Britain during the mid-18th century due to a confluence of environmental and socio-economic factors:
        </p>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1.5 mb-6 pl-2">
          <li><strong>Abundant Natural Resources:</strong> Geographically accessible deposits of high-grade coal and iron ore.</li>
          <li><strong>Waterway Networks:</strong> Extensive navigable rivers and canal networks facilitating low-cost bulk transportation.</li>
          <li><strong>Agricultural Revolution:</strong> Innovations like crop rotation and the seed drill increased yields, releasing surplus rural labor toward burgeoning urban textile mills.</li>
          <li><strong>Financial Infrastructure:</strong> Stable banking systems, protective patent laws, and robust merchant capital networks.</li>
        </ul>

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
          2. Theoretical Comparisons: Capitalism vs. Socialism
        </h2>
        <div className="border border-gray-300 rounded overflow-hidden my-4 text-xs">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="p-2.5 font-semibold text-gray-800">Criterion</th>
                <th className="p-2.5 font-semibold text-gray-800">Free-Market Capitalism (Adam Smith)</th>
                <th className="p-2.5 font-semibold text-gray-800">Scientific Socialism (Karl Marx)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-2.5 font-medium text-gray-700">Ownership of Means</td>
                <td className="p-2.5 text-gray-600">Private individuals & corporations</td>
                <td className="p-2.5 text-gray-600">Collective / Public ownership by proletariat</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-gray-700">Price Determination</td>
                <td className="p-2.5 text-gray-600">Supply and demand market forces (&ldquo;Invisible Hand&rdquo;)</td>
                <td className="p-2.5 text-gray-600">Central coordination based on human need</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium text-gray-700">Primary Driving Force</td>
                <td className="p-2.5 text-gray-600">Self-interest, profit incentive, competition</td>
                <td className="p-2.5 text-gray-600">Egalitarian distribution, classless society</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-2">
          3. Quick Scratchpad & Calculations
        </h2>
        <div className="flex gap-2 items-center my-3 max-w-sm">
          <input
            type="text"
            placeholder="Type quick math formula..."
            value={calcInput}
            onChange={(e) => setCalcInput(e.target.value)}
            className="border border-gray-300 px-3 py-1.5 rounded text-xs w-full text-gray-800"
          />
          <button
            onClick={() => {
              try {
                // eslint-disable-next-line no-eval
                setCalcInput(String(Function(`'use strict'; return (${calcInput})`)()));
              } catch(e) {}
            }}
            className="bg-gray-200 hover:bg-gray-300 text-xs px-3 py-1.5 rounded font-medium text-gray-700 cursor-pointer"
          >
            Calc
          </button>
        </div>
      </div>
    </div>
  );
};
