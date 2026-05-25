import React from "react";
import { QuizState } from "../types";
import { AppState } from "../App";
import { BUCKETS } from "../data";
import { ShieldCheck, RefreshCw, Smartphone, ListTodo, UserCheck, HelpCircle } from "lucide-react";

interface QAInterfaceProps {
  onSimulate: (overrides: Partial<QuizState>) => void;
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function QAInterface({ onSimulate, appState, setAppState }: QAInterfaceProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [forceYoung, setForceYoung] = React.useState(false);

  const simulateScenario = (scenario: 'A' | 'B' | 'C' | 'D' | 'male') => {
    // Navigate app to 'quiz' if not there
    setAppState('quiz');

    if (scenario === 'A') {
      // Simulate Bucket A (Retención)
      onSimulate({
        currentStep: 'results',
        preQuiz: {
          first_name: "Silvia",
          gender: "female",
          age_range: "35-44",
          hormonal_stage: "regular"
        },
        // Answers favoring A: P1:0, P2:0, P3:0, P4:0, P5:0, P6:0
        answers: { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0 },
        main_pain: "scale",
        email: "silvia.reten@ejemplo.com"
      });
    } else if (scenario === 'B') {
      // Simulate Bucket B (Inflamación)
      onSimulate({
        currentStep: 'results',
        preQuiz: {
          first_name: "Carla",
          gender: "female",
          age_range: forceYoung ? "under_35" : "45-54",
          hormonal_stage: forceYoung ? "regular" : "regular"
        },
        // Answers favoring B: P1:1, P2:1, P3:1, P4:1, P5:1, P6:1
        answers: { p1: 1, p2: 1, p3: 1, p4: 1, p5: 1, p6: 1 },
        main_pain: "belly",
        email: "carla.inflam@ejemplo.com"
      });
    } else if (scenario === 'C') {
      // Simulate Bucket C (Grasa)
      onSimulate({
        currentStep: 'results',
        preQuiz: {
          first_name: "Estela",
          gender: "female",
          age_range: forceYoung ? "35-44" : "55_plus",
          hormonal_stage: forceYoung ? "regular" : "menopause"
        },
        // Answers favoring C: P1:2, P2:2, P3:2, P4:2, P5:2, P6:2
        answers: { p1: 2, p2: 2, p3: 2, p4: 2, p5: 2, p6: 2 },
        main_pain: "selfimage",
        email: "estela.grasa@ejemplo.com"
      });
    } else if (scenario === 'D') {
      // Simulate Bucket D (Tiebreak: A=3, B=3, C=0 -> Tie break triggers Bucket D)
      onSimulate({
        currentStep: 'results',
        preQuiz: {
          first_name: "Virginia",
          gender: "female",
          age_range: forceYoung ? "under_35" : "under_35",
          hormonal_stage: "regular"
        },
        answers: { p1: 0, p2: 0, p3: 0, p4: 1, p5: 1, p6: 1 },
        main_pain: "energy",
        email: "virginia.mezcla@ejemplo.com"
      });
    } else if (scenario === 'male') {
      // Simulate Male Case (no WhatsApp CTA shown, receives educational CRM priority low)
      onSimulate({
        currentStep: 'results',
        preQuiz: {
          first_name: "Arturo",
          gender: "male",
          age_range: forceYoung ? "under_35" : "45-54",
          hormonal_stage: "not_applicable"
        },
        answers: { p1: 1, p2: 1, p3: 2, p4: 2, p5: 2, p6: 1 },
        main_pain: "energy",
        email: "arturo.masc@ejemplo.com"
      });
    }
  };

  return (
    <div className="bg-crema/90 backdrop-blur border-y border-vino/15 shadow-md w-full z-40 text-vino">
      <div className="max-w-[1120px] mx-auto px-6 py-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Title / Toggle */}
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-vino" />
          <div>
            <span className="font-mono text-[10px] tracking-[1.5px] uppercase font-bold text-bronce">
              Fase 3 & Testing QA Panel
            </span>
            <h3 className="text-xs font-semibold text-vino -mt-0.5">
              Consola de Verificación para Patri
            </h3>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="ml-3 px-2 py-0.5 bg-vino/5 hover:bg-vino/10 text-[10px] rounded transition-colors uppercase font-mono font-bold"
          >
            {isOpen ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        {isOpen && (
          <div className="flex flex-wrap gap-2 items-center">
            
            {/* Force young user checkbox */}
            <label className="flex items-center gap-1.5 px-2 py-1 bg-white border border-vino/15 rounded-lg text-[11px] font-bold select-none cursor-pointer text-vino/80 hover:bg-crema/40 hover:text-vino transition-colors mr-2">
              <input 
                type="checkbox" 
                checked={forceYoung} 
                onChange={(e) => setForceYoung(e.target.checked)} 
                className="rounded border-vino/30 text-vino focus:ring-vino"
              />
              <span>Simular Menor de 45 años (&lt;45)</span>
            </label>

            <span className="text-[10px] font-bold uppercase text-text-muted mr-1">Simular escenario:</span>
            
            <button
              onClick={() => simulateScenario('A')}
              className="bg-white hover:bg-vino hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-vino/10 transition-colors shadow-sm"
            >
              💧 Bucket A (Retención)
            </button>
            <button
              onClick={() => simulateScenario('B')}
              className="bg-white hover:bg-vino hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-vino/10 transition-colors shadow-sm"
            >
              🔥 Bucket B (Inflamación)
            </button>
            <button
              onClick={() => simulateScenario('C')}
              className="bg-white hover:bg-vino hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-vino/10 transition-colors shadow-sm"
            >
              🥩 Bucket C (Grasa)
            </button>
            <button
              onClick={() => simulateScenario('D')}
              className="bg-white hover:bg-vino hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-medium border border-vino/10 transition-colors shadow-sm"
            >
              🌀 Bucket D (Mezcla - Tiebreak)
            </button>

            {appState === 'quiz' && (
              <button 
                onClick={() => {
                  setAppState('landing');
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="bg-lima/20 text-vino-dk hover:bg-lima/35 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-lima/20 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <RefreshCw size={11} />
                <span>Reiniciar Cuestionario</span>
              </button>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
}
