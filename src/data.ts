import { MainPain } from "./types";

export interface QuestionOption {
  text: string;
  bucket: 'A' | 'B' | 'C'; // Maps to Retención (A), Inflamación (B), Grasa corporal (C)
}

export interface QuizQuestion {
  id: string; // p1, p2, p3, p4, p5, p6
  title: string;
  options: QuestionOption[];
}

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "p1",
    title: "¿Cómo cambia tu peso en el día a día o de una semana a otra?",
    options: [
      { text: "Subo o bajo de 1 a 2 kilos muy rápido, incluso de un día para otro o tras comer algo con más sal.", bucket: 'A' },
      { text: "Mi peso oscila un poco, pero lo que más noto es que me siento hinchada, pesada e inflamada de forma constante.", bucket: 'B' },
      { text: "Mi peso es muy estable o sube lentamente; no tengo variaciones rápidas, simplemente siento acumulación constante.", bucket: 'C' }
    ]
  },
  {
    id: "p2",
    title: "¿Cómo se siente tu abdomen a lo largo de las horas del día?",
    options: [
      { text: "Siento hinchazón general, no solo en el abdomen sino también en manos, tobillos o párpados al despertar.", bucket: 'A' },
      { text: "Me levanto con el abdomen plano, pero se va inflando como un globo tras las comidas y llega muy hinchado a la noche.", bucket: 'B' },
      { text: "Tengo volumen o grasa abdominal constante y firme, que no varía mucho entre la mañana y la noche.", bucket: 'C' }
    ]
  },
  {
    id: "p3",
    title: "¿Cómo reacciona tu cuerpo después de comer carbohidratos, procesados o lácteos?",
    options: [
      { text: "Al día siguiente amanezco muy pesada, hinchada, con los dedos rígidos o marcas de calcetines/anillos.", bucket: 'A' },
      { text: "Me da pesadez estomacal inmediata, gases, acidez o un cansancio/somnolencia muy fuerte poco después de comer.", bucket: 'B' },
      { text: "No noto molestias digestivas inmediatas, pero siento que cualquier exceso se acumula directo como grasa.", bucket: 'C' }
    ]
  },
  {
    id: "p4",
    title: "¿Cómo describirías tu nivel de energía habitual?",
    options: [
      { text: "Estable en general, aunque siento pereza o pesadez física si paso mucho tiempo de pie o hace calor.", bucket: 'A' },
      { text: "Muy inestable; amanezco cansada sin importar cuánto duerma y tengo 'bajones' severos de energía en la tarde.", bucket: 'B' },
      { text: "Bajo y aletargado constantemente, siento el metabolismo sumamente lento, como si estuviera bloqueado.", bucket: 'C' }
    ]
  },
  {
    id: "p5",
    title: "¿Dónde se localiza principalmente la molestia o acumulación física?",
    options: [
      { text: "En extremidades (piernas pesadas, tobillos hinchados, manos apretadas) y sensación de pesadez acuosa.", bucket: 'A' },
      { text: "En el abdomen (hinchazón digestiva incómoda, gases y sensación de distensión interna profunda).", bucket: 'B' },
      { text: "Grasa blanda o persistente acumulada en el abdomen, caderas, cintura o espalda alta.", bucket: 'C' }
    ]
  },
  {
    id: "p6",
    title: "¿Cómo ha sido tu experiencia intentando perder peso recientemente?",
    options: [
      { text: "Si hago dieta restrictiva pierdo volumen rápido en 3 días, pero lo recupero al primer descuido.", bucket: 'A' },
      { text: "Por más que recorto comidas, el estrés, las malas noches o el ejercicio intenso me inflaman y no bajo.", bucket: 'B' },
      { text: "Hago esfuerzo constante de restricción y voy al gimnasio, pero la balanza parece congelada y no baja nada.", bucket: 'C' }
    ]
  }
];

export interface P7Option {
  value: MainPain;
  text: string;
}

export const P7_OPTIONS: P7Option[] = [
  { value: 'belly', text: "Sentir el abdomen hinchado y distendido al final del día (Abdomen / Hinchazón)" },
  { value: 'scale', text: "La frustración con el número congelado de la balanza que no baja con nada (Balanza)" },
  { value: 'energy', text: "Llegar exhausta a la tarde, con falta de energía y cansancio crónico (Energía)" },
  { value: 'selfimage', text: "No sentirme cómoda con mi cuerpo ni con cómo me queda la ropa favorita (Autoimagen)" }
];

export interface BucketMetadata {
  id: 'A' | 'B' | 'C' | 'D';
  name: string;
  teaser: string;
  whatsappUrlTemplate: string;
  emailSubject: string;
  emailBody: {
    pasando: string;
    hacer: string;
    importante: string;
    cta: string;
  };
}

export const BUCKETS: Record<'A' | 'B' | 'C' | 'D', BucketMetadata> = {
  A: {
    id: 'A',
    name: "Retención de líquido",
    teaser: "La grasa no aparece de un jueves a un lunes — lo que ves en la balanza y sientes en la ropa es agua. Tu cuerpo la está reteniendo, y casi siempre hay una razón clara. De los cuatro perfiles, este es el que responde más rápido cuando le das las condiciones correctas.",
    whatsappUrlTemplate: "https://wa.me/573151702772?text=Hola%20Patri%2C%20acabo%20de%20hacer%20tu%20quiz%20y%20mi%20resultado%20fue%20retenci%C3%B3n%20de%20l%C3%ADquido.%20%C2%BFC%C3%B3mo%20me%20puedes%20ayudar%3F",
    emailSubject: "{{first_name}}, aqui esta tu diagnostico — Quiz El numero que miente",
    emailBody: {
      pasando: "La grasa no aparece de un jueves a un lunes — eso que ves en la balanza y sientes en la ropa es agua. Tu cuerpo la está reteniendo, y casi siempre hay una razón clara: la glucosa elevada y los carbohidratos generan inflamación y le indican al cuerpo que retenga líquido. A eso se suma el sodio oculto en los alimentos procesados y un sistema linfático que sin movimiento se estanca. La buena noticia es que de los cuatro perfiles, este es el que responde más rápido cuando le das las condiciones correctas.",
      hacer: "1. Elimina los procesados 5 días. No para siempre, solo 5 días. El sodio oculto en salsas, embutidos y snacks es la primera causa de retención que nadie asocia con el peso.\n2. Sube tu agua a 2.5 litros diarios. Sé que suena contradictorio tomar más agua cuando ya te sientes hinchada, pero tu cuerpo retiene cuando no recibe suficiente. El agua es la señal de que puede soltar.\n3. Camina 30 minutos al día. El sistema linfático no tiene bomba propia, el movimiento es su motor. No necesitas gym ni intensidad, necesitas constancia.",
      importante: "No uses la balanza esta semana. En retención, el número sube y baja 1, 2, hasta 3 kilos sin que hayas comido ni un gramo de más. Ese vaivén no es grasa, es líquido respondiendo a lo que comes, a cómo duermes, a dónde estás en tu ciclo. Mide mejor cómo te queda la ropa al final de los 5 días.",
      cta: "Si quieres que revisemos juntas qué está detrás de tu retención específicamente y armemos un protocolo a tu medida, escríbeme directo por WhatsApp."
    }
  },
  B: {
    id: 'B',
    name: "Inflamación metabólica y hormonal",
    teaser: "Esto no es flojera, no es falta de voluntad, y no es la edad. Es inflamación silenciosa: un estado en el que tu cuerpo redistribuye la grasa hacia el abdomen, bloquea las señales de saciedad y te roba la energía. A partir de los 45, esa inflamación se activa con mucha menos provocación que antes.",
    whatsappUrlTemplate: "https://wa.me/573151702772?text=Hola%20Patri%2C%20acabo%20de%20hacer%20tu%20quiz%20y%20mi%20resultado%20fue%20inflamaci%C3%B3n%20metab%C3%B3lica%20y%20hormonal.%20%C2%BFC%C3%B3mo%20me%20puedes%20ayudar%3F",
    emailSubject: "{{first_name}}, aqui esta tu diagnostico — Quiz El numero que miente",
    emailBody: {
      pasando: "Esto no es flojera, no es falta de voluntad, y no es la edad. Es inflamación silenciosa, un estado en el que tu sistema inmune libera sustancias que redistribuyen la grasa hacia el abdomen, bloquean las señales de saciedad y te roban la energía. La glucosa elevada y los carbohidratos son uno de los principales detonadores de esa inflamación, y también contribuyen a que el cuerpo retenga líquido como respuesta al estrés metabólico. A partir de los 45, cuando el estrógeno baja, esa inflamación se activa con mucha menos provocación que antes: una semana de azúcar y carbohidratos refinados, noches mal dormidas y cortisol elevado son suficientes para que el cuerpo entre en ese modo. Las reglas cambiaron. Lo que funcionaba a los 35 ya no aplica, y no porque tú hayas fallado, sino porque el cuerpo en perimenopausia y menopausia necesita un protocolo diferente.",
      hacer: "1. Saca el azúcar y los carbohidratos refinados 7 días. No para siempre, 7 días. Este es el gesto que más rápido baja la inflamación de base. El cuerpo inflamado no puede perder grasa aunque comas poco.\n2. Camina 20-30 minutos en la mañana, antes de desayunar si puedes. El movimiento matutino es una de las herramientas más efectivas para bajar el cortisol. No necesitas correr, necesitas mover el cuerpo cuando el cortisol está en su pico natural.\n3. Duerme antes de las 11pm y deja las pantallas 30 minutos antes. El cortisol y la insulina se regulan de noche. Una sola semana de sueño de calidad cambia los marcadores inflamatorios de forma medible.",
      importante: "La energía va a volver antes de que veas cambios en el espejo, eso es la señal de que el protocolo está funcionando. No desistas porque la balanza no se mueva en los primeros días. El cuerpo primero apaga el fuego, luego libera lo que sobra. Este es el perfil que más trabajo con mis estudiantes y el que más transforma cuando el protocolo es el correcto.",
      cta: "Si quieres que lo armemos juntas, descríbeme por WhatsApp."
    }
  },
  C: {
    id: 'C',
    name: "Grasa corporal acumulada",
    teaser: "Tu peso es estable y comes razonablemente bien — eso me dice que lo que cargas es tejido acumulado, no inflamación activa ni retención. Pero el protocolo que necesitas ahora no es el mismo que servía a los 30: más restricción calórica sin más músculo no solo no funciona, sino que empeora el problema.",
    whatsappUrlTemplate: "https://wa.me/573151702772?text=Hola%20Patri%2C%20acabo%20de%20hacer%20tu%20quiz%20y%20mi%20resultado%20fue%20grasa%20corporal%20acumulada.%20%C2%BFC%C3%B3mo%20me%20puedes%20ayudar%3F",
    emailSubject: "{{first_name}}, aqui esta tu diagnostico — Quiz El numero que miente",
    emailBody: {
      pasando: "Tu peso es estable, comes razonablemente bien y no tienes grandes fluctuaciones, eso me dice que lo que cargas es tejido acumulado, no inflamación aguda ni retención activa. Pero hay algo que vale la pena entender: la glucosa elevada y los carbohidratos, aunque no estén generando inflamación visible en tu caso, sí le indican al cuerpo que guarde energía como grasa, especialmente en el abdomen. Con los años, y en la transición hormonal, ese proceso se acelera porque el metabolismo basal baja y la masa muscular se reduce naturalmente. No es que hayas hecho algo mal. Es que el protocolo que necesitas ahora no es el mismo que servía a los 30, y más restricción calórica sin más músculo no es la solución, al contrario, empeora el problema.",
      hacer: "1. Calcula tu proteína y priorízala. El rango para preservar y recuperar músculo en mujeres de tu etapa es 1.2 a 1.6 gramos por kilo de peso corporal al día. Si pesas 65 kg, estás buscando entre 78 y 104 g de proteína diaria. Ese número cambia todo.\n2. Agrega trabajo de fuerza dos veces por semana. No necesitas pesas pesadas ni un gym elaborado, necesitas estímulo muscular consistente. El músculo es el órgano metabólico más importante que tienes después de los 45.\n3. Dale tiempo al proceso. Los cambios visibles en composición corporal toman entre 4 y 6 semanas en aparecer. La balanza puede no moverse, o incluso subir levemente al principio, mientras el cuerpo reorganiza su composición. Ese es progreso real, aunque no se vea todavía.",
      importante: "Este perfil responde muy bien al protocolo cetogénico bien diseñado, no porque sea una moda, sino porque baja la insulina, preserva el músculo y le da al cuerpo la señal correcta para usar grasa como combustible. Pero tiene que estar calibrado para tu etapa hormonal y tu punto de partida.",
      cta: "Si quieres que revisemos juntas cómo armar ese protocolo para ti específicamente, escríbeme por WhatsApp."
    }
  },
  D: {
    id: 'D',
    name: "Mezcla de factores",
    teaser: "Hay varias cosas pasando al mismo tiempo — y eso explica por qué lo que has intentado no termina de funcionar del todo. Cuando atacas solo una causa, las otras siguen activas. El orden de intervención importa más que el esfuerzo.",
    whatsappUrlTemplate: "https://wa.me/573151702772?text=Hola%20Patri%2C%20acabo%20de%20hacer%20tu%20quiz%20y%20mi%20resultado%20fue%20una%20mezcla%20de%20factores.%20%C2%BFC%C3%B3mo%20me%20puedes%20ayudar%3F",
    emailSubject: "{{first_name}}, aqui esta tu diagnostico — Quiz El numero que miente",
    emailBody: {
      pasando: "Hay varias cosas pasando al mismo tiempo — y eso explica exactamente por qué lo que has intentado no termina de funcionar del todo. La glucosa elevada y los carbohidratos refinados, el cortisol elevado y el estancamiento del sistema linfático pueden coexistir en el mismo cuerpo y amplificarse mutuamente. Cuando atacas solo una causa, las otras dos siguen activas. Es por eso que ves resultados parciales, o que mejoras unos días y vuelves al punto de partida: no es que el protocolo haya fallado, es que estaba incompleto. A partir de los 45, cuando el estrógeno baja y el metabolismo basal se reduce, ese estado mixto es más común de lo que parece. No porque hayas hecho algo mal, sino porque el cuerpo en esta etapa responde a más variables a la vez — y necesita un orden específico de intervención.",
      hacer: "1. Empieza bajando la inflamación primero. Siete días sin azúcar ni carbohidratos refinados, con 2.5 litros de agua al día. Esto no lo resuelve todo, pero establece la línea base: qué parte de lo que sientes es inflamación activa y qué es otra cosa.\n2. Prioriza el sueño por encima del ejercicio intenso esta semana. En un estado mixto, el cortisol elevado por falta de sueño puede anular el esfuerzo de cualquier otro cambio. Antes de las 11pm y sin pantallas 30 minutos antes.\n3. Observa y anota cómo amaneces cada mañana durante 7 días. No la balanza — energía, hinchazón, rigidez, humor. Esos patrones son la brújula para saber qué parte de la mezcla domina en tu caso específico.",
      importante: "Este perfil es el que más varía de persona a persona. Dos mujeres con el mismo resultado en el quiz pueden estar viviendo mezclas completamente distintas. Por eso el protocolo correcto aquí no se puede generalizar: el orden en que se intervienen las causas depende de tu historia, tus hormonas y cómo responde tu cuerpo. Una semana de observación te va a dar más información que meses de intentos sin dirección.",
      cta: "Si quieres que revisemos juntas qué está pasando en tu caso específico y armemos el protocolo en el orden correcto, escríbeme por WhatsApp."
    }
  }
};

export const P7_EMAIL_PARAGRAPHS: Record<MainPain, string> = {
  belly: "Sobre lo que me contaste de que tu foco principal hoy es sentar el abdomen deshinchado: Sé lo incómodo que es sentir la barriga hinchada todo el día, pareciendo embarazada al caer la noche. Te confirmo que esto no es grasa, es inflamación digestiva pura obstruyendo tu bienestar y bloqueando tu metabolismo.",
  scale: "Sobre lo que me contaste de tu foco con la balanza congelada: La obsesión con el peso en la balanza nos ciega. Ese número oscilante te genera un estrés tremendo que eleva el cortisol, ordenándole a tus células atrapar líquido y saboteando tus mejores intenciones de alimentación.",
  energy: "Sobre lo que me comentas de tu bajo nivel de energía: Vivir con la energía por el piso y depender del café para llegar a la tarde es señal de que tus mitocondrias están exhaustas y tus hormonas fuera de sintonía. El cuerpo cansado interpreta el cansancio como emergencia y se aferra a la grasa acumulada.",
  selfimage: "Sobre lo que sientes con respecto a tu cuerpo y tu ropa: No reconocerte en el espejo y sentir que tu ropa favorita ya no te queda es sumamente doloroso e interfiere con tu seguridad diaria. Vamos a recuperar tu tranquilidad trabajando favor de tu fisiología y tu etapa hormonal, nunca en su contra."
};

export function getAdjustedBucket(bucket: BucketMetadata, ageRange: string): BucketMetadata {
  const isYoung = ageRange === 'under_35' || ageRange === '35-44' || ageRange === '35_44' || ageRange === 'under-35';
  if (!isYoung) {
    return bucket;
  }

  // Clone bucket to avoid mutating the original exported CONSTANT
  const adjusted: BucketMetadata = {
    ...bucket,
    emailBody: {
      ...bucket.emailBody
    }
  };

  if (bucket.id === 'B') {
    adjusted.name = "Inflamación metabólica";
    adjusted.whatsappUrlTemplate = adjusted.whatsappUrlTemplate.replace("inflamaci%C3%B3n%20metab%C3%B3lica%20y%20hormonal", "inflamaci%C3%B3n%20metab%C3%B3lica");
    adjusted.teaser = "Esto no es flojera, no es falta de voluntad, y no es algo que simplemente \"te pase a ti\". Es inflamación silenciosa: un estado en el que tu cuerpo redistribuye la grasa hacia el abdomen, bloquea las señales de saciedad y te roba la energía. Y puede activarse con mucha menos provocación de la que imaginas — el estrés, el sueño y la alimentación son suficientes.";
    
    adjusted.emailBody.pasando = "Esto no es flojera, no es falta de voluntad, y no es algo que simplemente \"te pase a ti\". Es inflamación silenciosa, un estado en el que tu sistema inmune libera sustancias que redistribuyen la grasa hacia el abdomen, bloquean las señales de saciedad y te roban la energía. La glucosa elevada y los carbohidratos son uno de los principales detonadores de esa inflamación, y también contribuyen a que el cuerpo retenga líquido como respuesta al estrés metabólico. El cortisol elevado, el sueño corto y los carbohidratos refinados son suficientes para que el cuerpo entre en ese modo — no hace falta ningún cambio hormonal mayor para que la inflamación se instale.\nNo es que hayas fallado. Es que el protocolo que intentaste no estaba diseñado para este tipo de inflamación.";
  }

  if (bucket.id === 'C') {
    adjusted.name = "Grasa corporal";
    adjusted.whatsappUrlTemplate = adjusted.whatsappUrlTemplate.replace("grasa%20corporal%20acumulada", "grasa%20corporal");
    adjusted.teaser = "Tu peso es estable y comes razonablemente bien — eso me dice que lo que cargas es tejido acumulado, no inflamación activa ni retención. Pero el protocolo que necesitas no es el que imaginas: más restricción calórica sin más músculo no solo no funciona, sino que empeora el problema.";
    
    adjusted.emailBody.pasando = "Tu peso es estable, comes razonablemente bien y no tienes grandes fluctuaciones, eso me dice que lo que cargas es tejido acumulado, no inflamación aguda ni retención activa. Pero hay algo que vale la pena entender: la glucosa elevada y los carbohidratos, aunque no estén generando inflamación visible en tu caso, sí le indican al cuerpo que guarde energía como grasa, especialmente en el abdomen. Con el tiempo, si la alimentación no apoya la masa muscular, ese proceso se va acentuando — y es más fácil ajustarlo ahora que revertirlo después.\nNo es que hayas hecho algo mal. Es que el protocolo que necesitas no es el mismo que crees, y más restricción calórica sin más músculo no es la solución, al contrario, empeora el problema.";
    
    adjusted.emailBody.hacer = "1. Calcula tu proteína y priorízala. El rango para preservar y desarrollar músculo es 1.2 a 1.6 gramos por kilo de peso corporal al día. Si pesas 65 kg, estás buscando entre 78 y 104 g de proteína diaria. Ese número cambia todo.\n2. Agrega trabajo de fuerza dos veces por semana. No necesitas pesas pesadas ni un gym elaborado, necesitas estímulo muscular consistente. El músculo es el órgano metabólico más importante que tienes — a cualquier edad.\n3. Dale tiempo al proceso. Los cambios visibles en composición corporal toman entre 4 y 6 semanas en aparecer. La balanza puede no moverse, o incluso subir levemente al principio, mientras el cuerpo reorganiza su composición. Ese es progreso real, aunque no se vea todavía.";
    
    adjusted.emailBody.importante = "Este perfil responde muy bien al protocolo cetogénico bien diseñado, no porque sea una moda, sino porque baja la insulina, preserva el músculo y le da al cuerpo la señal correcta para usar grasa como combustible. Pero tiene que estar calibrado para tu metabolismo actual y tu punto de partida.";
  }

  if (bucket.id === 'D') {
    adjusted.emailBody.pasando = "Hay varias cosas pasando al mismo tiempo — y eso explica exactamente por qué lo que has intentado no termina de funcionar del todo. La glucosa elevada y los carbohidratos refinados, el cortisol elevado y el estancamiento del sistema linfático pueden coexistir en el mismo cuerpo y amplificarse mutuamente. Cuando atacas solo una causa, las otras dos siguen activas. Es por eso que ves resultados parciales, o que mejoras unos días y vuelves al punto de partida: no es que el protocolo haya fallado, es que estaba incompleto.\nEse estado mixto es más común de lo que parece, y el estrés, el sueño y la alimentación son suficientes para mantenerlo activo. No porque hayas hecho algo mal, sino porque el cuerpo responde a más variables a la vez de lo que solemos considerar — y necesita un orden específico de intervención.";
  }

  return adjusted;
}

export function adjustTextForGender(text: string, gender: 'female' | 'male' | string): string {
  if (gender !== 'male' && gender !== 'Masculino') return text;
  if (!text) return text;
  
  return text
    .replace(/\bAmiga\b/g, "Amigo")
    .replace(/\bamiga\b/g, "amigo")
    .replace(/\bhinchada\b/g, "hinchado")
    .replace(/\bhinchadas\b/g, "hinchados")
    .replace(/\bpesada\b/g, "pesado")
    .replace(/\bpesadas\b/g, "pesados")
    .replace(/\binflamada\b/g, "inflamado")
    .replace(/\binflamadas\b/g, "inflamados")
    .replace(/\bcansada\b/g, "cansado")
    .replace(/\bcansadas\b/g, "cansados")
    .replace(/\bexhausta\b/g, "exhausto")
    .replace(/\bexhaustas\b/g, "exhaustos")
    .replace(/\bjuntas\b/g, "juntos")
    .replace(/pareciendo embarazada al caer la noche/g, "muy distendido al caer la noche")
    .replace(/mujeres de tu etapa/g, "hombres de tu etapa");
}

