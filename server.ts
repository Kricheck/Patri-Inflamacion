import express from "express";
import path from "path";
import dns from "dns";
import { createServer as createViteServer } from "vite";

// Force DNS resolution to prefer IPv4 (helps resolve some Docker/Cloud Run sandbox issues)
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  // Ignore fallback issues if not supported
}

const app = express();
const PORT = 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// API: Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// API: Send Email via Resend
app.post("/api/send-email", async (req, res) => {
  const { 
    first_name, 
    email, 
    gender, 
    age_range, 
    hormonal_stage, 
    main_pain, 
    bucket, 
    bucket_name,
    emailSubject,
    emailBody,
    painParagraph,
    whatsappUrl
  } = req.body;

  // Protect keys: Lazy-check Resend API key
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("⚠️ [Resend Backend] RESEND_API_KEY variable is missing. Return simulated success for testing.");
    return res.status(200).json({ 
      success: true, 
      simulated: true, 
      message: "API Key de Resend no configurada. El correo ha sido simulado en consola de forma exitosa." 
    });
  }

  // Get sender details or use default
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = "Patri | El Número Que Miente";
  const finalFrom = `${fromName} <${fromEmail}>`;

  // Process multiline body items safely
  const formatList = (text: string) => {
    if (!text) return "";
    return text
      .split("\n")
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return "";
        // If it starts with a number, wrap beautifully
        if (/^\d+\./.test(trimmed)) {
          const match = trimmed.match(/^(\d+\.)(.*)/);
          return `<li style="margin-bottom: 12px; line-height: 1.6; color: #2C1A22;"><strong style="color: #3E1126;">${match ? match[1] : ""}</strong>${match ? match[2] : trimmed}</li>`;
        }
        return `<li style="margin-bottom: 8px; line-height: 1.6; color: #2C1A22;">${trimmed}</li>`;
      })
      .filter(Boolean)
      .join("");
  };

  const formattedHacer = formatList(emailBody?.hacer || "");

  // Beautiful responsive HTML template matching Patri's branding
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${emailSubject || "Tu Diagnóstico Personalizado"}</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #F5EEE3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #F5EEE3; padding: 40px 10px;">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(62, 17, 38, 0.05); border: 1px solid #EADFC9;">
            
            <!-- Branding Header (Wine Red) -->
            <tr>
              <td align="center" style="background-color: #3E1126; padding: 40px 30px; text-align: center;">
                <p style="margin: 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; color: #B89968;">Tu Diagnóstico Personalizado</p>
                <h1 style="margin: 5px 0 0 0; color: #ffffff; font-size: 26px; font-weight: 400; letter-spacing: -0.5px;">El Número Que Miente</h1>
              </td>
            </tr>

            <!-- Welcome Greeting -->
            <tr>
              <td style="padding: 40px 40px 20px 40px;">
                <h2 style="margin: 0 0 15px 0; font-size: 20px; font-weight: 600; color: #3E1126; line-height: 1.3;">¡Hola, ${first_name}!</h2>
                <p style="margin: 0 0 20px 0; font-size: 15px; color: #3E1126; font-weight: 500; font-style: italic;">
                  "El número de la balanza no cuenta toda tu historia. Es momento de entender tu fisiología, no de castigar tu cuerpo."
                </p>
                <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #2C1A22;">
                  Gracias por completar el diagnóstico. Basado en tus respuestas, hemos identificado tu perfil metabólico dominante. Aquí tienes tu reporte completo con los pasos clave para empezar a trabajar juntos a favor de tu metabolismo.
                </p>
              </td>
            </tr>

            <!-- Selected Pain Box -->
            ${painParagraph ? `
            <tr>
              <td style="padding: 0 40px;">
                <div style="background-color: #F5EEE3; border-left: 3px solid #B89968; padding: 18px 20px; border-radius: 0 6px 6px 0;">
                  <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: #3E1126; font-weight: 500;">
                    ${painParagraph}
                  </p>
                </div>
              </td>
            </tr>
            ` : ""}

            <!-- Core Profile Details -->
            <tr>
              <td style="padding: 30px 40px;">
                <div style="border-top: 1px solid #EADFC9; padding-top: 25px;">
                  <span style="font-size: 11px; font-weight: 700; color: #B89968; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Tu Perfil Dominante:</span>
                  <h3 style="margin: 0 0 15px 0; font-size: 22px; font-weight: 600; color: #3E1126;">${bucket_name} (Perfil ${bucket})</h3>
                  <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.6; color: #3E1126; background-color: #F5EEE3; padding: 20px; border-radius: 8px;">
                    ${emailBody?.pasando || ""}
                  </p>
                </div>
              </td>
            </tr>

            <!-- Formatted Action Items -->
            ${formattedHacer ? `
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <h4 style="margin: 0 0 12px 0; font-size: 15px; font-weight: 700; text-transform: uppercase; color: #3E1126; letter-spacing: 0.5px;">Tus 3 Acciones Clave para esta semana:</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 14.5px;">
                  ${formattedHacer}
                </ul>
              </td>
            </tr>
            ` : ""}

            <!-- Important / Non-negotiable Note -->
            ${emailBody?.importante ? `
            <tr>
              <td style="padding: 0 40px 30px 40px;">
                <div style="background-color: #F5EEE3; border-left: 3px solid #3E1126; padding: 20px; border-radius: 0 8px 8px 0;">
                  <span style="font-size: 11px; font-weight: 700; color: #3E1126; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">¡Atención importante!</span>
                  <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #3E1126;">
                    ${emailBody.importante}
                  </p>
                </div>
              </td>
            </tr>
            ` : ""}

            <!-- CTA Section -->
            <tr>
              <td align="center" style="padding: 20px 40px 40px 40px; text-align: center; border-top: 1px solid #EADFC9;">
                <p style="margin: 0 0 20px 0; font-size: 14.5px; line-height: 1.6; color: #2C1A22; font-weight: 500;">
                  El siguiente paso lo damos ${ (gender === 'Masculino' || gender === 'male' || gender === 'man') ? 'juntos' : 'juntas' }. Haz clic en el botón de abajo para escribirme directo por WhatsApp y revisar tu caso de forma cercana.
                </p>
                <p style="margin: 0 0 10px 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #B89968;">Conversación Segura con Patri</p>
                <a href="${whatsappUrl || "https://wa.me/573151702772"}" target="_blank" style="display: inline-block; background-color: #BDC739; color: #1F1119; text-decoration: none; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 16px 36px; border-radius: 50px; box-shadow: 0 4px 10px rgba(62, 17, 38, 0.15); transition: background-color 0.2s;">
                  💬 Escríbeme por WhatsApp
                </a>
                <p style="margin: 15px 0 0 0; font-size: 12px; color: #9A8A8E; font-style: italic;">
                  Recibiré una alerta segura de tu reporte para que podamos armar tu protocolo personalizado.
                </p>
              </td>
            </tr>

            <!-- Footer Details -->
            <tr>
              <td style="padding: 30px 40px; background-color: #F5EEE3; border-top: 1px solid #EADFC9; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #3E1126; font-weight: 600;">Patri | El Número Que Miente</p>
                <p style="margin: 0; font-size: 11px; color: #9A8A8E; line-height: 1.4;">
                  Este diagnóstico se generó el ${new Date().toLocaleDateString("es-ES")} basándose en el cuestionario de metabolismo y bienestar.<br>
                  © ${new Date().getFullYear()} Patri. Todos los derechos reservados.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: finalFrom,
        to: [email.trim()],
        subject: emailSubject || `${first_name}, aquí está tu diagnóstico — El número que miente`,
        html: htmlContent
      })
    });

    const resBody = await response.json() as any;

    if (response.ok) {
      console.log(`✅ [Resend Backend] Correo enviado de forma exitosa a ${email}. ID:`, resBody?.id);
      return res.status(200).json({ success: true, emailId: resBody?.id });
    } else {
      console.error("❌ [Resend Backend] Fallo al enviar correo mediante Resend API:", resBody);
      return res.status(response.status).json({ 
        success: false, 
        error: resBody?.message || "Error desconocido al enviar el correo." 
      });
    }
  } catch (error) {
    console.error("❌ [Resend Backend] Excepción atrapada al enviar con Resend:", error);
    return res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Vite server configuration as a middleware (Development Mode)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("⚙️ Starting Server in Development mode... Mount Vite Middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("🚀 Starting Server in Production mode... Serves build folder");
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files from the build output directory
    app.use(express.static(distPath));
    
    // Spa fallback to support modern visual routers
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`============================================`);
    console.log(`      Server running on port ${PORT}`);
    console.log(`      Development: http://localhost:${PORT}`);
    console.log(`============================================`);
  });
}

startServer();
