import React from "react";
import { BucketMetadata, P7_EMAIL_PARAGRAPHS, adjustTextForGender } from "../data";
import { MainPain } from "../types";
import { Mail, Check, Copy } from "lucide-react";

interface EmailPreviewProps {
  first_name: string;
  email: string;
  bucket: BucketMetadata;
  main_pain: MainPain | '';
  gender: string;
}

export default function EmailPreview({ first_name, email, bucket, main_pain, gender }: EmailPreviewProps) {
  const [copied, setCopied] = React.useState(false);

  const rawSubject = bucket.emailSubject.replace("{{first_name}}", first_name || "Amiga");
  const subject = adjustTextForGender(rawSubject, gender);
  
  const rawP7Paragraph = main_pain ? P7_EMAIL_PARAGRAPHS[main_pain] : "";
  const p7Paragraph = adjustTextForGender(rawP7Paragraph, gender);

  const passingText = adjustTextForGender(bucket.emailBody.pasando, gender);
  const hacerText = adjustTextForGender(bucket.emailBody.hacer, gender);
  const importanteText = adjustTextForGender(bucket.emailBody.importante, gender);
  const ctaText = adjustTextForGender(bucket.emailBody.cta, gender);
  const salutationDefault = adjustTextForGender(first_name || "Amiga", gender);

  const handleCopyText = () => {
    const fullText = `Asunto: ${subject}
De: Patri López Keto <soporte@patrilopezketo.com>
Para: ${first_name || salutationDefault} <${email || "correo@ejemplo.com"}>

Hola ${salutationDefault}, aquí está tu diagnóstico detallado:

--- LO QUE ESTÁ PASANDO EN TU CUERPO ---
${passingText}

${p7Paragraph ? `--- TU MAYOR PREOCUPACIÓN HOY ---\n${p7Paragraph}\n` : ""}
--- LO QUE PUEDES EMPEZAR A HACER ESTA SEMANA ---
${hacerText}

--- UNA COSA IMPORTANTE ---
${importanteText}

--- SIGUIENTE PASO ---
${ctaText}
Hablemos directo por WhatsApp: ${bucket.whatsappUrlTemplate}`;
    
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="email-preview-container" className="bg-white border border-vino/10 rounded-xl overflow-hidden shadow-soft mt-8">
      {/* Header bar resembling an email client */}
      <div className="bg-vino text-white p-4 flex items-center justify-between border-b border-vino-dk/30">
        <div className="flex items-center gap-2">
          <Mail size={18} className="text-lima" />
          <span className="text-[12px] font-medium tracking-wide uppercase">Vista previa del correo automático (Enviado al CRM/ESP)</span>
        </div>
        <button 
          onClick={handleCopyText}
          className="flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/18 rounded-full text-xs transition-colors"
        >
          {copied ? <Check size={13} className="text-lima" /> : <Copy size={13} />}
          <span>{copied ? "Copiado" : "Copiar correo"}</span>
        </button>
      </div>

      <div className="p-5 font-sans text-[14px] leading-[1.6] text-text-body space-y-4">
        {/* Email Metadata Headers */}
        <div className="space-y-1 pb-4 border-b border-gray-100 text-xs">
          <div><span className="font-semibold text-text-muted">De:</span> Patri López Keto &lt;soporte@patrilopezketo.com&gt;</div>
          <div><span className="font-semibold text-text-muted">Para:</span> {first_name || salutationDefault} &lt;{email || "correo@ejemplo.com"}&gt;</div>
          <div><span className="font-semibold text-text-muted">Asunto:</span> <span className="text-vino font-medium">{subject}</span></div>
        </div>

        {/* Email content */}
        <div className="space-y-4 pt-2">
          <p>Hola <span className="font-medium text-vino">{first_name || salutationDefault}</span>,</p>
          
          <p className="font-serif italic text-base text-vino leading-relaxed border-l-2 border-bronce/30 pl-4 py-1">
            Aquí tienes tu diagnóstico completo aprobado por mí tras analizar tus respuestas del quiz.
          </p>

          <div>
            <h4 className="text-[11px] font-bold text-bronce uppercase tracking-[1px] mb-1">LO QUE ESTÁ PASANDO EN TU CUERPO</h4>
            <p className="text-gray-700">{passingText}</p>
          </div>

          {p7Paragraph && (
            <div className="bg-crema/60 rounded-lg p-4 border-l-4 border-bronce py-3.5 my-4">
              <h4 className="text-[11px] font-bold text-vino uppercase tracking-[1px] mb-1.5">TU SITUACIÓN ESPECÍFICA (Lo que más te pesa hoy)</h4>
              <p className="text-vino/90 italic font-medium text-[13.5px] leading-relaxed">{p7Paragraph}</p>
            </div>
          )}

          <div>
            <h4 className="text-[11px] font-bold text-bronce uppercase tracking-[1px] mb-1">LO QUE PUEDES EMPEZAR A HACER ESTA SEMANA</h4>
            <div className="text-gray-700 whitespace-pre-line pl-3 border-l border-gray-100">{hacerText}</div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold text-bronce uppercase tracking-[1px] mb-1">UNA COSA IMPORTANTE</h4>
            <p className="text-gray-700">{importanteText}</p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-vino mb-2">¿Siguiente Paso? Lo damos {adjustTextForGender("juntas", gender)}</h4>
            <p className="text-gray-700 mb-3">{ctaText}</p>
            <a 
              href={bucket.whatsappUrlTemplate} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-lima hover:bg-lima/90 text-vino-dk font-semibold text-xs rounded-full uppercase tracking-wider transition-all hover:scale-[1.03] shadow-soft"
            >
              Contactar a Patri por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
