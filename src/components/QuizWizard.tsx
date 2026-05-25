import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Send, 
  RefreshCw, 
  ShieldAlert, 
  ClipboardList, 
  Smartphone, 
  Moon, 
  Droplets, 
  Flame, 
  MessagesSquare,
  Network
} from "lucide-react";
import { QuizState, PreQuizData, MainPain, QuizScoringResult } from "../types";
import { QUESTIONS, P7_OPTIONS, BUCKETS, getAdjustedBucket, P7_EMAIL_PARAGRAPHS, adjustTextForGender } from "../data";
import EmailPreview from "./EmailPreview";

interface QuizWizardProps {
  onBackToLanding: () => void;
  overrideState?: Partial<QuizState>; // For QA simulation overrides
}

export default function QuizWizard({ onBackToLanding, overrideState }: QuizWizardProps) {
  const [state, setState] = React.useState<QuizState>({
    currentStep: 'pre_welcome',
    preQuiz: {
      first_name: '',
      gender: '',
      age_range: '',
      hormonal_stage: ''
    },
    answers: {},
    main_pain: '',
    email: '',
    isSubmitting: false
  });

  // Track patient geo-location for clinical statistics & sheet storage
  const [geoInfo, setGeoInfo] = React.useState<{ ip: string; country: string; city: string }>({
    ip: "No detectado",
    country: "No detectado",
    city: "No detectado"
  });

  React.useEffect(() => {
    const fetchGeo = async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (res.ok) {
          const data = await res.json();
          setGeoInfo({
            ip: data.ip || "No detectado",
            country: data.country_name || "No detectado",
            city: data.city || "No detectado"
          });
        } else {
          throw new Error("Ipapi falló");
        }
      } catch (err) {
        // Fallback to second service
        try {
          const res2 = await fetch("https://api.db-ip.com/v2/free/self");
          if (res2.ok) {
            const data2 = await res2.json();
            setGeoInfo({
              ip: data2.ipAddress || "No detectado",
              country: data2.countryName || "No detectado",
              city: data2.city || "No detectado"
            });
          }
        } catch (err2) {
          console.warn("No se pudo obtener la IP/geolocalización:", err2);
        }
      }
    };
    fetchGeo();
  }, []);

  // Track the configuration of custom CRM/ESP webhook in localStorage for local testing
  const [webhookUrl, setWebhookUrl] = React.useState<string>(() => {
    const saved = localStorage.getItem("patri_quiz_webhook_url");
    // If it's an old google scripts URL or empty, default to the newly requested URL
    if (!saved || !saved.includes("AKfycbz1QzlOPZF7oclt6usTSnNb4HC1OX0JKdQO0DGa4O9xY7mZByz_xQkbjAsWwFw0IJGH")) {
      const defaultUrl = "https://script.google.com/macros/s/AKfycbz1QzlOPZF7oclt6usTSnNb4HC1OX0JKdQO0DGa4O9xY7mZByz_xQkbjAsWwFw0IJGH/exec";
      localStorage.setItem("patri_quiz_webhook_url", defaultUrl);
      return defaultUrl;
    }
    return saved;
  });
  const [webhookStatus, setWebhookStatus] = React.useState<'idle' | 'sending' | 'success' | 'failed'>('idle');
  const [webhookResponse, setWebhookResponse] = React.useState<string>("");
  const [emailSendStatus, setEmailSendStatus] = React.useState<'idle' | 'sending' | 'success' | 'failed'>('idle');
  const [emailSendError, setEmailSendError] = React.useState<string>("");

  // Scoring Logic Implementation (C4 + C5)
  const calculateResult = (currentState: QuizState = state): QuizScoringResult => {
    // 1. Calculate base score (sum of points from P1-P6)
    let scoreBaseA = 0; // Retención
    let scoreBaseB = 0; // Inflamación
    let scoreBaseC = 0; // Grasa

    QUESTIONS.forEach((q) => {
      const selectedIndex = currentState.answers[q.id];
      if (selectedIndex !== undefined) {
        const option = q.options[selectedIndex];
        if (option.bucket === 'A') scoreBaseA += 1;
        if (option.bucket === 'B') scoreBaseB += 1;
        if (option.bucket === 'C') scoreBaseC += 1;
      }
    });

    // 2. Calculate sesgo automático (Clinically-calibrated demographical automatic bias)
    let biasA = 0;
    let biasB = 0;
    let biasC = 0;

    if (currentState.preQuiz.gender === 'female') {
      // Age group bias (metabolism slowdown begins around 35 and intensifies after 45)
      if (currentState.preQuiz.age_range === '45-54' || currentState.preQuiz.age_range === '55_plus') {
        biasB += 2; // severe silent inflammation common after 45
        biasC += 1; // metabolic baseline slows
      } else if (currentState.preQuiz.age_range === '35-44') {
        biasB += 1;
      }

      // Hormonal stage bias (Perimenopause and Menopause drastically slow estrogen)
      if (currentState.preQuiz.hormonal_stage === 'perimenopause' || currentState.preQuiz.hormonal_stage === 'menopause') {
        biasB += 1;
        biasC += 2; // triggers stubborn visceral/abdominal fat storage
      }
    }

    // 3. Totals
    const totalA = scoreBaseA + biasA;
    const totalB = scoreBaseB + biasB;
    const totalC = scoreBaseC + biasC;

    // 4. Determining highest bucket & Tiebreak Logic (C4 & C5)
    // Rule: "si la diferencia entre el bucket con mayor puntaje y el segundo es de 1 punto o menos, el sistema asigna automáticamente Bucket D (Mezcla) en lugar de forzar una decisión arbitraria."
    const candidates = [
      { bucket: 'A' as const, value: totalA },
      { bucket: 'B' as const, value: totalB },
      { bucket: 'C' as const, value: totalC }
    ];

    // Sort descending
    candidates.sort((x, y) => y.value - x.value);

    let finalBucket: 'A' | 'B' | 'C' | 'D' = candidates[0].bucket;
    const secondHighest = candidates[1];

    if (candidates[0].value - secondHighest.value <= 1) {
      finalBucket = 'D'; // TIEBREAK TRIGGER to Mezcla de factores
    }

    // Lead Priority Rule: "leads masculinos entran a Kommo con lead_priority=low, no se les muestra el CTA de WhatsApp con Patri sino Recibir contenido educativo"
    const lead_priority = currentState.preQuiz.gender === 'male' ? 'low' : 'high';

    return {
      scoreBase: { A: scoreBaseA, B: scoreBaseB, C: scoreBaseC },
      sesgo: { A: biasA, B: biasB, C: biasC },
      total: { A: totalA, B: totalB, C: totalC },
      finalBucket,
      lead_priority,
      whatsappUrl: BUCKETS[finalBucket].whatsappUrlTemplate
    };
  };

  // Handle overrides for QA simulation
  React.useEffect(() => {
    if (overrideState) {
      setState(prev => {
        const tempState = {
          ...prev,
          ...overrideState,
          preQuiz: { ...prev.preQuiz, ...overrideState.preQuiz },
          answers: { ...prev.answers, ...overrideState.answers }
        };
        if (tempState.currentStep === 'results') {
          tempState.scoringResult = calculateResult(tempState);
        }
        return tempState;
      });
    }
  }, [overrideState]);

  const updatePreQuiz = (fields: Partial<PreQuizData>) => {
    setState(prev => ({
      ...prev,
      preQuiz: { ...prev.preQuiz, ...fields }
    }));
  };

  const currentStep = state.currentStep;

  // Navigation handlers
  const handlePreWelcomeNext = () => {
    setState(prev => ({ ...prev, currentStep: 'pre_name' }));
  };

  const handleNameNext = () => {
    if (!state.preQuiz.first_name.trim()) return;
    setState(prev => ({ ...prev, currentStep: 'pre_gender' }));
  };

  const handleGenderSelect = (gender: 'female' | 'male') => {
    updatePreQuiz({ 
      gender,
      // If male, hormonal stage is automatically not_applicable
      hormonal_stage: gender === 'male' ? 'not_applicable' : ''
    });
    setState(prev => ({ ...prev, currentStep: 'pre_age' }));
  };

  const handleAgeSelect = (age_range: 'under_35' | '35-44' | '45-54' | '55_plus') => {
    updatePreQuiz({ age_range });
    
    // Check if female to ask hormonal stage, else skip to P1
    if (state.preQuiz.gender === 'female') {
      setState(prev => ({ ...prev, currentStep: 'pre_hormonal' }));
    } else {
      setState(prev => ({ ...prev, currentStep: 'p1' }));
    }
  };

  const handleHhormonalSelect = (hormonal_stage: 'regular' | 'perimenopause' | 'menopause') => {
    updatePreQuiz({ hormonal_stage });
    setState(prev => ({ ...prev, currentStep: 'p1' }));
  };

  const handlePAnswer = (questionId: string, bucketIdx: number, bucket: 'A' | 'B' | 'C') => {
    setState(prev => {
      const newAnswers = { ...prev.answers, [questionId]: bucketIdx };
      
      // Determine what the next step should be
      let nextStep: QuizState['currentStep'] = 'p1';
      if (questionId === 'p1') nextStep = 'p2';
      else if (questionId === 'p2') nextStep = 'p3';
      else if (questionId === 'p3') nextStep = 'p4';
      else if (questionId === 'p4') nextStep = 'p5';
      else if (questionId === 'p5') nextStep = 'p6';
      else if (questionId === 'p6') nextStep = 'p7';

      return {
        ...prev,
        answers: newAnswers,
        currentStep: nextStep
      };
    });
  };

  const handleP7Select = (value: MainPain) => {
    setState(prev => ({
      ...prev,
      main_pain: value,
      currentStep: 'lead_capture'
    }));
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.email.trim() || !state.email.includes("@")) return;

    setState(prev => ({ ...prev, isSubmitting: true }));
    const result = calculateResult();

    // Map age range, hormonal stage and main pain to human-friendly Spanish values for Google Sheets columns
    const ageLabels: Record<string, string> = {
      under_35: "Menos de 35 años",
      "35-44": "Entre 35 y 44 años",
      "45-54": "Entre 45 y 54 años",
      "55_plus": "55 años o más"
    };

    const hormonalLabels: Record<string, string> = {
      regular: "Ciclo regular",
      perimenopause: "Perimenopausia",
      menopause: "Menopausia",
      not_applicable: "No aplica"
    };

    const selectedP7 = P7_OPTIONS.find(opt => opt.value === state.main_pain);
    const mainPainText = selectedP7 ? selectedP7.text : state.main_pain;

    // Get exact Spanish texts for P1 - P6 selected options
    const formattedAnswers: Record<string, string> = {};
    QUESTIONS.forEach((q) => {
      const selectedIndex = state.answers[q.id];
      if (selectedIndex !== undefined) {
        const option = q.options[selectedIndex];
        formattedAnswers[`respuesta_${q.id}`] = option.text;
      } else {
        formattedAnswers[`respuesta_${q.id}`] = "";
      }
    });

    // CRM/ESP Webhook payload structure (Glosario - C5):
    // email, bucket, gender, age_range, hormonal_stage, main_pain, lead_priority plus full answers
    const webhookPayload = {
      timestamp: new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" }) || new Date().toISOString(),
      first_name: state.preQuiz.first_name,
      email: state.email.trim(),
      gender: state.preQuiz.gender === 'female' ? 'Femenino' : 'Masculino',
      age_range: ageLabels[state.preQuiz.age_range] || state.preQuiz.age_range,
      hormonal_stage: hormonalLabels[state.preQuiz.hormonal_stage || ''] || state.preQuiz.hormonal_stage || 'No aplica',
      main_pain: mainPainText,
      bucket: result.finalBucket,
      bucket_name: BUCKETS[result.finalBucket]?.name || result.finalBucket,
      lead_priority: result.lead_priority,
      ip: geoInfo.ip,
      country: geoInfo.country,
      city: geoInfo.city,
      answers: state.answers,
      ...formattedAnswers,
      app_version: "Fase 1 · Q 1/6"
    };

    // Attempt real webhook post if URL is present.
    // For Google Apps Script, we use 'no-cors' mode with 'text/plain' to avoid preflight issues in sandboxed iframes.
    if (webhookUrl) {
      setWebhookStatus('sending');
      setWebhookResponse("");
      try {
        const res = await fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors', // Bypasses iframe sandboxing and CORS limitations
          headers: {
            'Content-Type': 'text/plain'
          },
          body: JSON.stringify(webhookPayload)
        });
        setWebhookStatus('success');
        setWebhookResponse("Datos enviados con éxito a Google Sheets.");
      } catch (err) {
        setWebhookStatus('failed');
        setWebhookResponse(`Error de red: ${err instanceof Error ? err.message : String(err)}`);
      }
    } else {
      // Simulate webhook locally if none configured in order to show QA transparency
      setWebhookStatus('idle');
      setWebhookResponse("Simulado localmente (Configura la URL para testear en vivo)");
    }

    // Send email using Resend API dynamically through our secure backend
    const resolvedBucketForMail = getAdjustedBucket(BUCKETS[result.finalBucket], state.preQuiz.age_range);
    
    // Apply gender adaptation to outgoing emails
    const mailSubject = adjustTextForGender(
      resolvedBucketForMail.emailSubject.replace("{{first_name}}", state.preQuiz.first_name || "Amiga"),
      state.preQuiz.gender
    );
    const p7Paragraph = adjustTextForGender(
      state.main_pain ? P7_EMAIL_PARAGRAPHS[state.main_pain] : "",
      state.preQuiz.gender
    );
    
    const emailBodyAdjusted = {
      pasando: adjustTextForGender(resolvedBucketForMail.emailBody.pasando, state.preQuiz.gender),
      hacer: adjustTextForGender(resolvedBucketForMail.emailBody.hacer, state.preQuiz.gender),
      importante: adjustTextForGender(resolvedBucketForMail.emailBody.importante, state.preQuiz.gender),
      cta: adjustTextForGender(resolvedBucketForMail.emailBody.cta, state.preQuiz.gender)
    };

    try {
      console.log("📨 [Resend] Iniciando envío de correo...");
      setEmailSendStatus('sending');
      setEmailSendError('');
      
      const emailRes = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: state.preQuiz.first_name,
          email: state.email.trim(),
          gender: state.preQuiz.gender === 'female' ? 'Femenino' : 'Masculino',
          age_range: ageLabels[state.preQuiz.age_range] || state.preQuiz.age_range,
          hormonal_stage: hormonalLabels[state.preQuiz.hormonal_stage || ''] || state.preQuiz.hormonal_stage || 'No aplica',
          main_pain: mainPainText,
          bucket: result.finalBucket,
          bucket_name: resolvedBucketForMail.name,
          emailSubject: mailSubject,
          emailBody: emailBodyAdjusted,
          painParagraph: p7Paragraph,
          whatsappUrl: resolvedBucketForMail.whatsappUrlTemplate
        })
      });

      if (!emailRes.ok) {
        const errJson = await emailRes.json().catch(() => ({}));
        const errMsg = errJson.error || "Error desconocido al procesar la petición.";
        console.error("❌ Fallo al procesar correo en el backend:", errMsg);
        setEmailSendStatus('failed');
        setEmailSendError(errMsg);
      } else {
        const mailData = await emailRes.json();
        console.log("✅ Correo enviado/simulado con éxito desde el backend:", mailData);
        if (mailData.simulated) {
          setEmailSendStatus('failed');
          setEmailSendError(mailData.message);
        } else {
          setEmailSendStatus('success');
        }
      }
    } catch (mailErr: any) {
      console.error("❌ Error de red enviando correo al backend:", mailErr);
      setEmailSendStatus('failed');
      setEmailSendError(mailErr?.message || String(mailErr));
    }

    setState(prev => ({
      ...prev,
      isSubmitting: false,
      scoringResult: result,
      currentStep: 'results'
    }));

    // Scroll to top of results screen smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setState({
      currentStep: 'pre_welcome',
      preQuiz: {
        first_name: '',
        gender: '',
        age_range: '',
        hormonal_stage: ''
      },
      answers: {},
      main_pain: '',
      email: '',
      isSubmitting: false
    });
    setWebhookStatus('idle');
    setWebhookResponse("");
  };

  const stepBackMap: Record<QuizState['currentStep'], QuizState['currentStep']> = {
    landing: 'landing',
    pre_welcome: 'landing',
    pre_name: 'pre_welcome',
    pre_gender: 'pre_name',
    pre_age: 'pre_gender',
    pre_hormonal: 'pre_age',
    p1: state.preQuiz.gender === 'female' ? 'pre_hormonal' : 'pre_age',
    p2: 'p1',
    p3: 'p2',
    p4: 'p3',
    p5: 'p4',
    p6: 'p5',
    p7: 'p6',
    lead_capture: 'p7',
    results: 'landing'
  };

  const handleBack = () => {
    const prev = stepBackMap[state.currentStep];
    if (prev === 'landing') {
      onBackToLanding();
    } else {
      setState(p => ({ ...p, currentStep: prev }));
    }
  };

  // Progress Bar percentage calculation
  const getProgressPercentage = (): number => {
    const steps: QuizState['currentStep'][] = [
      'pre_welcome', 'pre_name', 'pre_gender', 'pre_age', 'pre_hormonal', 
      'p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'lead_capture', 'results'
    ];
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex <= 0) return 3;
    if (state.currentStep === 'results') return 100;
    return Math.round((currentIndex / (steps.length - 1)) * 100);
  };

  const slideVariants = {
    enter: { opacity: 0, x: 25 },
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, x: -25, transition: { duration: 0.25, ease: "easeIn" } }
  };

  // Helper to determine the phase of the quiz and the question/step number dynamically
  const getPhaseAndQuestionInfo = (): string => {
    switch (currentStep) {
      case 'pre_welcome':
        return "F1 · INICIO";
      case 'pre_name':
        return "F1 · P1/4";
      case 'pre_gender':
        return "F1 · P2/4";
      case 'pre_age': {
        const total = state.preQuiz.gender === 'female' ? 4 : 3;
        return `F1 · P3/${total}`;
      }
      case 'pre_hormonal':
        return "F1 · P4/4";
      case 'p1':
        return "F2 · P1/7";
      case 'p2':
        return "F2 · P2/7";
      case 'p3':
        return "F2 · P3/7";
      case 'p4':
        return "F2 · P4/7";
      case 'p5':
        return "F2 · P5/7";
      case 'p6':
        return "F2 · P6/7";
      case 'p7':
        return "F2 · P7/7";
      case 'lead_capture':
        return "F3 · REG";
      default:
        return "F2 · DIA";
    }
  };

  // Helper info for current question
  const currentQuestionIdx = QUESTIONS.findIndex(q => q.id === currentStep);
  const currentQuestion = currentQuestionIdx !== -1 ? QUESTIONS[currentQuestionIdx] : null;

  const resolvedBucket = state.scoringResult
    ? getAdjustedBucket(BUCKETS[state.scoringResult.finalBucket], state.preQuiz.age_range)
    : null;

  return (
    <div className="w-full max-w-[800px] mx-auto px-4 md:px-6 py-6 min-h-[580px] flex flex-col justify-between">
      
      {/* Quiz Top bar with metadata, Back button & progress bar */}
      {currentStep !== 'results' && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <button 
              onClick={handleBack}
              className="flex items-center gap-1 hover:text-vino transition-colors py-1.5 focus:outline-none"
            >
              <ArrowLeft size={14} />
              <span>Atrás</span>
            </button>
            <span className="font-mono text-[10px] tracking-[1px] uppercase text-bronce">
              {getPhaseAndQuestionInfo()}
            </span>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-vino/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-lima rounded-full transition-all duration-300" 
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>
      )}

      {/* Slide Transition Zone */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full"
          >
            
            {/* SCREEN: Welcome */}
            {currentStep === 'pre_welcome' && (
              <div id="welcome-step" className="text-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-crema text-bronce flex items-center justify-center mx-auto shadow-sm">
                  <Sparkles size={28} />
                </div>
                <h2 className="italic-serif text-[clamp(26px,4vw,36px)] text-vino leading-tight">
                  Hola, soy Patri López Keto
                </h2>
                <p className="text-[15px] leading-relaxed text-text-body max-w-[500px] mx-auto">
                  He diseñado este quiz clínico para ayudarte a descifrar si tu peso actual es
                  grasa acumulada, retención silenciosa o inflamación digestiva activa.
                </p>
                <div className="bg-crema p-4 rounded-xl border border-vino/5 text-xs text-text-muted leading-relaxed max-w-[460px] mx-auto">
                  *Toma menos de 2 minutos. Asegúrate de responder con honestidad basándote en cómo se siente tu cuerpo habitualmente.
                </div>
                <button
                  id="btn-start-pre"
                  onClick={handlePreWelcomeNext}
                  className="cta-primary mx-auto flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span className="font-semibold">Iniciar cuestionario</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* SCREEN: Name Input */}
            {currentStep === 'pre_name' && (
              <div id="step-name" className="space-y-6 max-w-[480px] mx-auto">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[11px] font-bold text-bronce uppercase tracking-[1.5px]">Paso Inicial</span>
                  <h2 className="italic-serif text-[clamp(26px,3.8vw,34px)] text-vino leading-tight">
                    Para empezar, ¿cómo te llamas?
                  </h2>
                  <p className="text-sm text-text-muted">
                    Usaremos tu nombre para personalizar tu diagnóstico y el informe clínico descargable.
                  </p>
                </div>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleNameNext(); }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    required
                    id="input-name"
                    placeholder="Escribe tu primer nombre..."
                    value={state.preQuiz.first_name}
                    onChange={(e) => updatePreQuiz({ first_name: e.target.value })}
                    className="w-full bg-white text-vino-dk border border-vino/15 rounded-xl px-5 py-4 focus:ring-2 focus:ring-lima focus:border-transparent text-base outline-none transition-shadow"
                    autoFocus
                  />
                  <button
                    type="submit"
                    id="btn-name-next"
                    disabled={!state.preQuiz.first_name.trim()}
                    className={`cta-primary w-full flex items-center justify-center gap-2 ${!state.preQuiz.first_name.trim() ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <span>Continuar</span>
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {/* SCREEN: Gender Select */}
            {currentStep === 'pre_gender' && (
              <div id="step-gender" className="space-y-6 max-w-[480px] mx-auto">
                <div className="space-y-2 text-center">
                  <span className="text-[11px] font-bold text-bronce uppercase tracking-[1.5px]">Identidad</span>
                  <h2 className="italic-serif text-[30px] text-vino leading-tight">
                    Hola {state.preQuiz.first_name}, selecciona tu género
                  </h2>
                  <p className="text-sm text-text-muted">
                    La fisiología masculina y femenina reaccionan de manera distinta a nivel metabólico y hormonal.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    id="gender-female"
                    onClick={() => handleGenderSelect('female')}
                    className="flex flex-col items-center gap-3 p-6 bg-white border border-vino/10 hover:border-vino hover:bg-crema/40 rounded-xl transition-all shadow-sm focus:outline-none"
                  >
                    <span className="text-2xl">👩</span>
                    <span className="font-semibold text-vino">Femenino</span>
                  </button>
                  <button
                    id="gender-male"
                    onClick={() => handleGenderSelect('male')}
                    className="flex flex-col items-center gap-3 p-6 bg-white border border-vino/10 hover:border-vino hover:bg-crema/40 rounded-xl transition-all shadow-sm focus:outline-none"
                  >
                    <span className="text-2xl">👨</span>
                    <span className="font-semibold text-vino">Masculino</span>
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN: Age Range */}
            {currentStep === 'pre_age' && (
              <div id="step-age" className="space-y-6 max-w-[480px] mx-auto">
                <div className="space-y-2 text-center">
                  <span className="text-[11px] font-bold text-bronce uppercase tracking-[1.5px]">Edad</span>
                  <h2 className="italic-serif text-[30px] text-vino leading-tight">
                    ¿Cuál es tu rango de edad?
                  </h2>
                  <p className="text-sm text-text-muted">
                    El metabolismo basal cambia drásticamente. A los 45, la inflamación sistémica toma nuevas reglas en el cuerpo.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'under_35', label: "Menos de 35 años" },
                    { value: '35-44', label: "Entre 35 y 44 años" },
                    { value: '45-54', label: "Entre 45 y 54 años" },
                    { value: '55_plus', label: "55 años o más" }
                  ].map((age) => (
                    <button
                      key={age.value}
                      onClick={() => handleAgeSelect(age.value as any)}
                      className="w-full text-left p-4 bg-white border border-vino/10 hover:border-vino hover:bg-crema/40 rounded-xl transition-all text-sm font-medium text-vino flex justify-between items-center group shadow-sm"
                    >
                      <span>{age.label}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: Hormonal Stage (Female Only!) */}
            {currentStep === 'pre_hormonal' && (
              <div id="step-hormonal" className="space-y-6 max-w-[480px] mx-auto">
                <div className="space-y-2 text-center">
                  <span className="text-[11px] font-bold text-bronce uppercase tracking-[1.5px]">Etapa Biológica</span>
                  <h2 className="italic-serif text-[30px] text-vino leading-tight">
                    ¿En qué etapa hormonal te encuentras?
                  </h2>
                  <p className="text-sm text-text-muted">
                    Durante la perimenopausia o menopausia, la caída de estrógeno da órdenes clínicas al cuerpo de acumular grasa visceral y retener agua.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { value: 'regular', label: "Menstruación regular / Ciclo estable" },
                    { value: 'perimenopause', label: "Perimenopausia (Ciclos irregulares, primeros sofocos o cambios)" },
                    { value: 'menopause', label: "Menopausia / Postmenopausia (Ausencia de periodo por un año o más)" }
                  ].map((stage) => (
                    <button
                      key={stage.value}
                      onClick={() => handleHhormonalSelect(stage.value as any)}
                      className="w-full text-left p-4 bg-white border border-vino/10 hover:border-vino hover:bg-crema/40 rounded-xl transition-all text-sm font-medium text-vino flex justify-between items-center group shadow-sm"
                    >
                      <span>{stage.label}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: P1-P6 Questions */}
            {currentQuestion && (
              <div id={`step-question-${currentStep}`} className="space-y-6 max-w-[620px] mx-auto">
                <div className="space-y-2 text-center">
                  <span className="text-[10px] font-bold tracking-[2px] text-bronce uppercase">
                    Cuestionario Corporal ({currentQuestionIdx + 1} de 6)
                  </span>
                  <h2 className="italic-serif text-[clamp(22px,3.5vw,28px)] text-vino leading-tight px-2">
                    {currentQuestion.title}
                  </h2>
                </div>
                
                <div className="flex flex-col gap-3.5 mt-6">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      id={`opt-${currentStep}-${idx}`}
                      onClick={() => handlePAnswer(currentQuestion.id, idx, option.bucket)}
                      className="w-full text-left p-5 bg-white border border-vino/10 hover:border-vino hover:bg-crema/40 rounded-xl transition-all text-[14.5px] leading-relaxed text-text-body flex gap-3.5 items-start shadow-sm hover:shadow active:scale-[0.99]"
                    >
                      <span className="w-6 h-6 rounded-full bg-crema text-vino font-mono text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{adjustTextForGender(option.text, state.preQuiz.gender)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: P7 Post-Quiz Pain Point */}
            {currentStep === 'p7' && (
              <div id="step-p7" className="space-y-6 max-w-[560px] mx-auto">
                <div className="space-y-2 text-center">
                  <span className="text-[11px] font-bold text-bronce uppercase tracking-[1.5px]">Última Pregunta</span>
                  <h2 className="italic-serif text-[clamp(24px,4vw,30px)] text-vino leading-tight">
                    ¿Qué es lo que más te pesa hoy?
                  </h2>
                  <p className="text-sm text-text-muted">
                    Cuéntanos cuál de estos factores te genera mayor frustración diaria. Calibrará el informe final.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  {P7_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      id={`p7-${opt.value}`}
                      onClick={() => handleP7Select(opt.value)}
                      className="w-full text-left p-4.5 bg-white border border-vino/10 hover:border-vino hover:bg-crema/40 rounded-xl transition-all text-sm font-medium text-vino flex gap-3 items-center shadow-sm"
                    >
                      <span className="text-lima font-bold">•</span>
                      <span>{adjustTextForGender(opt.text, state.preQuiz.gender)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SCREEN: Lead Capture Form */}
            {currentStep === 'lead_capture' && (
              <div id="step-lead" className="space-y-6 max-w-[480px] mx-auto">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-lima/20 text-vino flex items-center justify-center mx-auto">
                    <Check size={24} className="text-vino" />
                  </div>
                  <h2 className="italic-serif text-[30px] text-vino leading-tight">
                    ¡Cuestionario completado!
                  </h2>
                  <p className="text-sm text-text-body">
                    <span className="font-semibold text-vino">{state.preQuiz.first_name}</span>, hemos calculado tu puntuación con los sesgos metabólicos y el tiebreak clínico. 
                  </p>
                  <p className="text-xs text-text-muted">
                    Ingresa tu correo abajo para desbloquear tu resultado en pantalla, recibir el informe clínico detallado y tu plan de acción descargable.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="lead-email" className="block text-xs font-semibold text-text-muted uppercase tracking-[1px] mb-1.5">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      id="lead-email"
                      placeholder="nombre@ejemplo.com"
                      value={state.email}
                      onChange={(e) => setState(p => ({ ...p, email: e.target.value }))}
                      className="w-full bg-white text-vino-dk border border-vino/15 rounded-xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-lima focus:border-transparent outline-none transition-shadow"
                    />
                  </div>

                  <button
                    type="submit"
                    id="btn-diagnosticar"
                    disabled={state.isSubmitting || !state.email.trim() || !state.email.includes("@")}
                    className={`cta-primary w-full flex items-center justify-center gap-2 font-semibold cursor-pointer ${
                      state.isSubmitting || !state.email.trim() || !state.email.includes("@") ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {state.isSubmitting ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        <span>Analizando tu metabolismo...</span>
                      </>
                    ) : (
                      <>
                        <span>Obtener mi Diagnóstico</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-center text-text-muted">
                  Respetamos tu privacidad. Recibirás solo contenido de Patri López Keto. Podrás darte de baja con un click.
                </p>
              </div>
            )}

            {/* SCREEN: Results Dashboard */}
            {currentStep === 'results' && state.scoringResult && (
              <div id="step-results" className="space-y-10 py-2">
                
                {/* Email Confirmation Banner detailing live Resend status */}
                <div className="max-w-[500px] mx-auto space-y-2">
                  {emailSendStatus === 'sending' && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-center gap-2.5 text-xs md:text-sm font-medium shadow-sm">
                      <span className="animate-spin text-amber-600 shrink-0">❖</span>
                      <span className="font-semibold">Enviando tu diagnóstico personalizado...</span>
                    </div>
                  )}
                  
                  {emailSendStatus === 'success' && (
                    <div className="bg-lima/20 border border-lima/30 text-vino-dk px-4 py-3 rounded-xl flex items-center justify-center gap-2.5 text-xs md:text-sm font-medium shadow-sm">
                      <span className="bg-lima text-vino flex items-center justify-center w-5 h-5 rounded-full shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="font-semibold">¡Diagnóstico enviado de forma exitosa por Resend!</span>
                    </div>
                  )}

                  {emailSendStatus === 'failed' && (
                    <div className="bg-red-50 border border-red-200 text-red-900 p-4 rounded-xl text-left space-y-2 text-xs md:text-sm shadow-sm">
                      <div className="flex items-center gap-2 font-semibold text-red-700">
                        <span>⚠️</span>
                        <span>Error al enviar correo (Resend)</span>
                      </div>
                      <p className="text-red-800/80 leading-relaxed text-xs">
                        {emailSendError.includes("domain is not verified") ? (
                          <>
                            <strong>El dominio de envío no está verificado aún.</strong> Para que los correos salgan de forma real desde tu dominio, debes configurar los registros DNS (SPF, DKIM) correspondientes en la pestaña de <strong>Domains</strong> de tu cuenta de Resend.
                          </>
                        ) : emailSendError.includes("You can only send testing emails to your own email address") ? (
                          <>
                            <strong>Restricción de cuenta de prueba (Sandbox):</strong> Como tu dominio no está verificado en Resend todavía, Resend solo te permite mandar correos de prueba hacia el correo de tu cuenta original (<code className="bg-red-100 px-1 rounded">diagnostico@patrilopezketo.com</code>). Para enviar a otros correos de prueba como <code className="bg-red-100 px-1 rounded">martinezjulian@hotmail.com</code>, es obligatorio verificar tu dominio en Resend.
                          </>
                        ) : (
                          emailSendError
                        )}
                      </p>
                      <div className="text-[10px] text-red-600/70 border-t border-red-200/50 pt-1.5 font-mono">
                        Respuesta técnica: {emailSendError}
                      </div>
                    </div>
                  )}
                </div>

                {/* Visual Header card identifying of Assigned Bucket */}
                <div className="bg-crema border border-vino/10 rounded-card p-6 md:p-10 text-center relative overflow-hidden shadow-soft">
                  <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] bg-lima/10 rounded-full" />
                  
                  <span className="text-[11px] font-bold text-bronce uppercase tracking-[2px] mb-2 block">
                    Tu Perfil de Resultado es
                  </span>
                  
                  <h2 className="italic-serif text-[clamp(28px,5vw,42px)] text-vino leading-tight mb-4">
                    {resolvedBucket?.name}
                  </h2>

                  {/* Dynamic teaser rendering incorporating exact texts of C2 */}
                  <div id="result-teaser-text" className="text-[15.5px] leading-relaxed text-text-body max-w-[620px] mx-auto mb-8 bg-white/70 backdrop-blur rounded-xl p-5 border border-vino/5 shadow-sm">
                    {resolvedBucket?.teaser}
                  </div>

                  {/* Action block incorporating WhatsApp CTA */}
                  <div className="space-y-4">
                    <div className="max-w-[440px] mx-auto space-y-3">
                      <div className="text-[11px] font-bold text-vino uppercase tracking-[1px]">
                        El siguiente paso lo damos {state.preQuiz.gender === 'male' ? 'juntos' : 'juntas'}
                      </div>
                      <a
                        id="whatsapp-cta-button"
                        href={resolvedBucket?.whatsappUrlTemplate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cta-primary relative w-full flex items-center justify-center gap-2 hover:bg-lima/90 active:scale-95 transition-transform"
                      >
                        <MessagesSquare size={18} />
                        <span>Escríbeme por WhatsApp</span>
                      </a>
                      <p className="text-[11px] text-text-muted leading-relaxed max-w-[360px] mx-auto">
                        Se abrirá una conversación segura donde recibiré las alertas de tu diagnóstico para ayudarte a armar un protocolo personalizado.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Email template rendered according to selected parameters & P7 inputs (C3 + C4 + C6) */}
                {resolvedBucket && (
                  <EmailPreview
                    first_name={state.preQuiz.first_name}
                    email={state.email}
                    bucket={resolvedBucket}
                    main_pain={state.main_pain as MainPain}
                    gender={state.preQuiz.gender}
                   />
                )}

                {/* Restart & metadata blocks */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-text-muted">
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 py-2 px-4 border border-vino/10 hover:border-vino hover:text-vino transition-colors rounded-full font-medium"
                  >
                    <RefreshCw size={13} />
                    <span>Hacer el quiz otra vez</span>
                  </button>
                  <button
                    onClick={onBackToLanding}
                    className="font-medium hover:text-vino transition-colors"
                  >
                    Volver al inicio de la web
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
