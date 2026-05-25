export interface PreQuizData {
  first_name: string;
  gender: 'female' | 'male' | '';
  age_range: 'under_35' | '35-44' | '45-54' | '55_plus' | '';
  hormonal_stage: 'regular' | 'perimenopause' | 'menopause' | 'not_applicable' | '';
}

export type MainPain = 'belly' | 'scale' | 'energy' | 'selfimage';

export interface QuizState {
  currentStep: 'landing' | 'pre_welcome' | 'pre_name' | 'pre_gender' | 'pre_age' | 'pre_hormonal' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7' | 'lead_capture' | 'results';
  preQuiz: PreQuizData;
  answers: Record<string, number>; // 1, 2, or 3 for each P1-P6
  main_pain: MainPain | '';
  email: string;
  isSubmitting: boolean;
  scoringResult?: QuizScoringResult;
}

export interface QuizScoringResult {
  scoreBase: { A: number; B: number; C: number };
  sesgo: { A: number; B: number; C: number };
  total: { A: number; B: number; C: number };
  finalBucket: 'A' | 'B' | 'C' | 'D';
  lead_priority: 'high' | 'low';
  whatsappUrl: string;
}
