import React from "react";
import { motion } from "motion/react";
import heroImage from "./assets/foto-portada.png";
import patriImage from "./assets/bige-1-1.webp";
import heroBg from "./assets/fondo-secc-1.jpg";
import { 
  ArrowRight, 
  Sparkles, 
  Quote, 
  Droplets, 
  Flame, 
  Moon, 
  CheckCircle2, 
  ArrowRightIcon, 
  ClipboardList, 
  Brain, 
  MessagesSquare,
  Instagram,
  Smartphone
} from "lucide-react";

import QuizWizard from "./components/QuizWizard";
import QAInterface from "./components/QAInterface";
import { QuizState } from "./types";

export type AppState = 'landing' | 'quiz';

const revealVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.2, 0.7, 0.3, 1] }
  }
};

const SectionHead = ({ eyebrow, title, lead, center = false }: { eyebrow?: string, title: string, lead?: string, center?: boolean }) => (
  <motion.div 
    variants={revealVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    className={`mb-8 md:mb-12 ${center ? "text-center mx-auto" : ""}`}
  >
    {eyebrow && (
      <span className="text-[12px] font-medium uppercase tracking-[1.2px] text-bronce mb-4 block">
        {eyebrow}
      </span>
    )}
    <h2 className={`italic-serif text-[clamp(28px,4.5vw,44px)] leading-[1.15] text-vino mb-4 max-w-[720px] ${center ? "mx-auto" : ""}`}>
      {title}
    </h2>
    {lead && (
      <p className={`text-[clamp(15px,1.4vw,17px)] leading-[1.7] text-text-body max-w-[620px] ${center ? "mx-auto" : ""}`}>
        {lead}
      </p>
    )}
  </motion.div>
);

export default function App() {
  const [appState, setAppState] = React.useState<AppState>('landing');
  const [simulationState, setSimulationState] = React.useState<Partial<QuizState> | undefined>(undefined);

  const handleSimulatePulse = (overrides: Partial<QuizState>) => {
    setSimulationState(overrides);
  };

  const handleStartQuiz = () => {
    setAppState('quiz');
    setSimulationState(undefined); // Reset overrides
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToLanding = () => {
    setAppState('landing');
    setSimulationState(undefined);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden selection:bg-lima/30 flex flex-col justify-between">
      
      {/* QA Verification Panel at the top of the viewport for Julian's testing */}
      <QAInterface 
        onSimulate={handleSimulatePulse}
        appState={appState}
        setAppState={setAppState}
      />

      <div className="flex-grow">
        {appState === 'landing' ? (
          /* ================= LANDING SCREEN ================= */
          <>
            {/* Hero Section */}
            <section className="bg-crema pt-12 md:pt-20 lg:pt-24 pb-12 md:pb-20 lg:pb-0 relative overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img 
                  src={heroBg} 
                  alt="fondo" 
                  className="w-full h-full object-cover opacity-20"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              {/* Glow effect */}
              <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(184,153,104,0.15),transparent_70%)] pointer-events-none z-0" />
              
              <div className="container-custom relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
                  <motion.div
                    variants={revealVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-[720px] order-2 lg:order-1 lg:pb-32 flex flex-col items-center lg:items-start text-center lg:text-left"
                  >
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.6px] bg-vino-dk text-lima mb-5">
                      <Sparkles size={13} />
                      Quiz gratuito · 2 minutos
                    </div>
                    
                    <h1 className="italic-serif text-[clamp(34px,6vw,64px)] leading-[1.05] text-vino my-5 tracking-[-0.5px] lg:max-w-[600px]">
                      Tu sobrepeso no es <br /> siempre lo que crees
                    </h1>
                    
                    <p className="text-[clamp(16px,1.6vw,19px)] leading-[1.6] text-text-body mb-7 max-w-[480px]">
                      ¿Tu peso es grasa, inflamación o retención? Descúbrelo en 2 minutos.
                    </p>
                    
                    {/* Mobile Image - Above Button */}
                    <div className="lg:hidden -mx-4 mb-0">
                      <img 
                        src={heroImage} 
                        alt="Patri López" 
                        className="w-full h-auto"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                    
                    <button 
                      id="btn-hero-cta"
                      onClick={handleStartQuiz} 
                      className="cta-primary relative z-10 -mt-12 lg:mt-0 mx-auto flex lg:mx-0 lg:inline-flex cursor-pointer shadow-soft"
                    >
                      <span>Hacer el quiz ahora</span>
                      <ArrowRight size={18} />
                    </button>
                    
                    <p className="text-[13px] text-text-muted mt-2.5 max-w-[420px]">
                      Gratis · Sin registro previo · Recomendaciones e informe detallado al final
                    </p>
                  </motion.div>

                  <motion.div
                    variants={revealVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.2 }}
                    className="hidden lg:flex relative w-full max-w-[540px] mx-auto lg:ml-auto items-end order-1 lg:order-2"
                  >
                    <img 
                      src={heroImage} 
                      alt="Patri López" 
                      className="w-full h-auto block relative z-10"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Problem Section */}
            <section className="py-14 md:py-24 bg-white">
              <div className="container-custom">
                <SectionHead 
                  center
                  eyebrow="El problema"
                  title="El número que ves no te está diciendo la verdad"
                  lead="Llevas semanas sintiéndote diferente. La ropa ya no cierra igual, la energía no vuelve, y la balanza sube sin razón. Pero nadie te dice por qué. Aquí te lo decimos."
                />

                <div className="max-w-[880px] mx-auto flex flex-col gap-14 md:gap-20">
                  <div className="hidden md:grid grid-cols-[1fr_60px_1fr] gap-4 px-2 text-[11px] uppercase tracking-[1.2px]">
                    <span className="text-text-muted">Lo que sientes</span>
                    <span></span>
                    <span className="text-vino font-semibold">Probablemente es</span>
                  </div>

                  {[
                    { 
                      sientes: "Subí 2 kilos en una semana sin comer distinto.", 
                      es: "Retención de líquidos", 
                      desc: "Sodio, hormonas, calor. No es grasa nueva.",
                      icon: Droplets
                    },
                    { 
                      sientes: "Mi abdomen está hinchado al final del día.", 
                      es: "Inflamación digestiva", 
                      desc: "Lo que comes hoy te inflama mañana.",
                      icon: Flame
                    },
                    { 
                      sientes: "La energía no vuelve, ni durmiendo bien.", 
                      es: "Cambio hormonal", 
                      desc: "Tu metabolismo cambió de reglas a los 45.",
                      icon: Moon
                    }
                  ].map((row, idx) => (
                    <motion.div 
                      key={idx}
                      variants={revealVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 md:grid-cols-[1fr_60px_1fr] md:gap-4 items-stretch"
                    >
                      <div className="bg-crema rounded-sm p-5 md:p-[18px_22px] italic-serif text-[17px] leading-[1.5] flex gap-3">
                        <Quote size={20} className="text-bronce shrink-0 rotate-180" />
                        <span>{row.sientes}</span>
                      </div>
                      
                      <div className="flex md:hidden items-center justify-center -my-3 z-10">
                        <div className="bg-bronce text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[1.5px] shadow-sm">
                          VS
                        </div>
                      </div>

                      <div className="hidden md:flex items-center justify-center text-bronce">
                        <ArrowRight size={32} strokeWidth={1} />
                      </div>
                      
                      <div className="bg-vino text-white rounded-sm p-6 md:p-[20px_22px] flex gap-3.5 items-start shadow-soft">
                        <row.icon size={28} className="text-lima shrink-0" />
                        <div>
                          <div className="font-medium text-[17px] mb-1">{row.es}</div>
                          <div className="text-[14px] leading-[1.55] text-white/75">{row.desc}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.p 
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="italic-serif text-[clamp(20px,2.4vw,26px)] leading-[1.4] text-vino text-center max-w-[560px] mx-auto mt-12"
                >
                  Tres cosas distintas. <em className="not-italic font-medium">Tres soluciones distintas.</em>
                </motion.p>
              </div>
            </section>

            {/* Author Section */}
            <section className="bg-vino text-white py-14 md:py-24">
              <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-7 md:gap-16 items-center">
                  <motion.div 
                    variants={revealVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex flex-col items-center md:items-start"
                  >
                    <div className="w-[280px] h-[280px] rounded-card bg-[rgba(255,255,255,0.1)] overflow-hidden shadow-[0_18px_38px_rgba(0,0,0,0.25)] flex items-center justify-center">
                      <img 
                        src={patriImage} 
                        alt="Patri López" 
                        className="w-full h-full object-cover object-top"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600";
                        }}
                      />
                    </div>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.6px] bg-lima text-vino-dk mt-5">
                      Patri López
                    </span>
                  </motion.div>
                  
                  <motion.div 
                    variants={revealVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <span className="text-[12px] uppercase tracking-[1.2px] text-white/60 mb-4 block">La Reina Keto</span>
                    <h2 className="italic-serif text-[clamp(28px,4.5vw,44px)] leading-[1.15] text-white mb-5 max-w-[720px]">
                      Fui Señorita Colombia. Hoy ayudo a mujeres a entender su cuerpo después de los 45.
                    </h2>
                    <p className="text-[15px] leading-[1.75] text-white/85 mb-6 max-w-[560px]">
                      A los 50 viví en carne propia lo que tú estás viviendo: el cuerpo que no responde,
                      la energía que no vuelve, el número que no baja. No me resigné. Encontré un método.
                      Y hoy lo comparto con mujeres como tú — de igual a igual, no desde un pedestal.
                    </p>
                    <div className="w-11 h-[2px] rounded bg-bronce my-6" />
                    <div className="flex flex-wrap gap-2">
                      {[
                        { icon: CheckCircle2, text: 'Autora · "Mi Versión Keto"' },
                        { icon: Smartphone, text: 'Casa Blu · Blu Radio' },
                        { icon: CheckCircle2, text: 'Podcast "Cómo Como"' },
                        { icon: CheckCircle2, text: '+10 años de práctica' }
                      ].map((item, idx) => (
                        <span key={idx} className="bg-white/12 text-white/90 border border-white/18 rounded-full px-3 py-1.5 text-[12px] flex items-center gap-2">
                          <item.icon size={14} className="text-lima" />
                          {item.text}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Steps Section */}
            <section className="bg-crema py-14 md:py-24">
              <div className="container-custom">
                <SectionHead 
                  center
                  eyebrow="Cómo funciona"
                  title="Tres pasos, dos minutos"
                />
                
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_28px_1fr_28px_1fr] gap-6 lg:gap-0">
                  {[
                    { num: '01', title: 'Responde 7 preguntas', desc: 'Sobre cómo se comporta tu cuerpo, tu energía y tu alimentación. Sin tecnicismos.', icon: ClipboardList },
                    { num: '02', title: 'Descubre tu perfil', desc: 'El quiz analiza tus respuestas y te dice si apunta a retención, inflamación, grasa o mezcla.', icon: Brain },
                    { num: '03', title: 'Descarga tu guía', desc: 'Recomendaciones en PDF para convertirlo. Y si quieres, conversación directa con Patri por WhatsApp.', icon: MessagesSquare }
                  ].map((step, idx) => (
                    <React.Fragment key={step.num}>
                      <motion.div 
                        variants={revealVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="bg-white border-[0.5px] border-vino/10 shadow-soft rounded-card p-8 flex flex-col gap-4 h-full"
                      >
                        <div className="flex items-end justify-between gap-3 border-b border-vino/10 pb-4 mb-1">
                          <span className="italic-serif text-[clamp(64px,7vw,88px)] leading-[0.85] text-vino tracking-[-2px]">{step.num}</span>
                          <div className="p-3 bg-vino text-lima rounded-[14px]">
                            <step.icon size={36} />
                          </div>
                        </div>
                        <h3 className="font-medium text-lg text-vino leading-tight">{step.title}</h3>
                        <p className="text-sm leading-[1.65] text-text-body">{step.desc}</p>
                      </motion.div>
                      {idx < 2 && (
                        <div className="hidden lg:flex items-center justify-center text-bronce">
                          <ArrowRight size={24} />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </section>

            {/* Insights Section */}
            <section className="py-14 md:py-24 bg-white">
              <div className="container-custom">
                <SectionHead 
                  center
                  eyebrow="Qué vas a descubrir"
                  title="En dos minutos vas a saber"
                  lead="Tres cosas que la balanza nunca te dijo."
                />
                
                <ol className="max-w-[720px] mx-auto space-y-0">
                  {[
                    { title: 'Si lo que sube es grasa, inflamación o retención', desc: 'Cada uno tiene una causa distinta y una solución distinta. Mezclar las tres en un mismo plan es por qué nada te ha funcionado.' },
                    { title: 'Qué cambió en tu cuerpo después de los 45', desc: 'Tu metabolismo y tus hormonas cambiaron de reglas. El quiz identifica cuál de esos cambios está afectando tu peso.' },
                    { title: 'Por dónde empezar — en tu cuerpo, no en general', desc: 'Recomendaciones basadas en tus respuestas, no en un plan genérico que le sirve a cualquiera.' }
                  ].map((item, idx) => (
                    <motion.li 
                      key={idx}
                      variants={revealVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className={`flex items-start gap-5 py-7 ${idx < 2 ? "border-b border-vino/8" : ""}`}
                    >
                      <span className="grid place-items-center w-11 h-11 rounded-xl bg-lima text-vino-dk font-semibold text-sm tracking-widest shrink-0">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h3 className="font-medium text-[17px] text-vino mb-1.5 leading-snug">{item.title}</h3>
                        <p className="text-sm leading-[1.7] text-text-body">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Testimonial Section */}
            <section className="bg-vino text-white py-16 md:py-28">
              <div className="container-custom">
                <motion.div 
                  variants={revealVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="max-w-[720px] mx-auto text-center"
                >
                  <div className="font-serif text-[120px] leading-[0.6] text-lima/60 mb-[-1rem] pointer-events-none" aria-hidden="true">"</div>
                  <p className="italic-serif text-[clamp(20px,2.6vw,26px)] leading-[1.5] text-white mb-6">
                    Llevaba 3 años con la balanza saltando 2 o 3 kilos de un día a otro. El quiz me explicó
                    en 2 minutos lo que ningún médico me había dicho claro.
                  </p>
                  <footer className="text-[14px] text-white/65">— Marcela R., 52 años · Bogotá</footer>
                </motion.div>
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 md:py-28 bg-white">
              <div className="container-custom">
                <div className="max-w-[580px] mx-auto flex flex-col items-center text-center">
                  <SectionHead 
                    center
                    eyebrow="Tu siguiente paso"
                    title="¿Lista para entender lo que está pasando?"
                    lead="El quiz es gratuito, tarda 2 minutos, y al final sabes exactamente por dónde empezar — con un PDF descargable que puedes guardar y consultar."
                  />
                  
                  <button 
                    id="btn-final-cta"
                    onClick={handleStartQuiz} 
                    className="cta-primary cursor-pointer shadow-soft"
                  >
                    <span>Empezar el quiz ahora</span>
                    <ArrowRightIcon size={18} />
                  </button>
                  
                  <p className="text-[13px] text-text-muted mt-3">
                    Gratis · Sin registro previo · Resultado inmediato
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* ================= INTERACTIVE QUIZ METABÓLICO ================= */
          <div className="bg-white py-8 md:py-16">
            <QuizWizard 
              onBackToLanding={handleBackToLanding}
              overrideState={simulationState}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-vino-dk text-white py-10 md:py-16">
        <div className="container-custom">
          <div className="italic-serif text-2xl mb-4">Patri López Keto</div>
          <p className="text-[12px] leading-[1.7] text-white/50 max-w-[560px] mb-6">
            Este quiz es una herramienta de auto-observación pensada para ayudarte a entender mejor
            lo que está pasando con tu cuerpo. No es una valoración médica, no diagnostica
            condiciones de salud, y no reemplaza la consulta con tu médico o nutricionista de confianza.
          </p>
          
          <div className="flex flex-wrap gap-2.5 mb-5">
            <a href="https://www.instagram.com/patrilopezruiz/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/6 border border-white/10 text-white/85 text-[13px] hover:bg-white/12 transition-colors">
              <Instagram size={18} />
              <span>@patrilopezruiz</span>
            </a>
            {/* Direct replacement of the old number with the new one at +57 315 170 2772 (C1) */}
            <a href="https://wa.me/573151702772" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/6 border border-white/10 text-white/85 text-[13px] hover:bg-white/12 transition-colors">
              <MessagesSquare size={18} />
              <span>WhatsApp Directo (+57 315 170 2772)</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-white/35 pt-6 border-t border-white/5 mt-6">
            <span>© {new Date().getFullYear()} Patri López Keto. Todos los derechos reservados.</span>
            {/* Explicit metadata version & date inclusion as dictated in C6 */}
            <span className="font-mono uppercase tracking-[0.5px]">Fase 1 · Q 1/6</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
