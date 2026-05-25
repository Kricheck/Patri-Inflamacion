/**
 * ESTE ES EL SCRIPT PARA GOOGLE APPS SCRIPT (Google Sheets)
 * 1. Ve a tu hoja de Google Sheets.
 * 2. Clic en Extensiones > Apps Script.
 * 3. Borra el código de ejemplo que haya, y copia y pega TODO este código.
 * 4. Clic en Implementar (Deploy) > Nueva implementación.
 * 5. Tipo: Aplicación web (Web app).
 * 6. Ejecutar como: "Yo" (tú).
 * 7. Quién tiene acceso: "Cualquier persona" (Anyone).
 * 8. Autorizar accesos. Copiar el URL que te den.
 */

const SHEET_NAME = 'Resultados_Quiz';

function setup() {
  const doc = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = doc.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = doc.insertSheet(SHEET_NAME);
    
    const headers = [
      'Fecha',
      'Nombre',
      'Email',
      'Género',
      'Rango Edad',
      'Etapa Hormonal',
      'Dolor Principal',
      'Bucket',
      'Nombre Bucket',
      'Prioridad Leads',
      'IP',
      'País',
      'Ciudad',
      'P1 (Indice)',
      'P2 (Indice)',
      'P3 (Indice)',
      'P4 (Indice)',
      'P5 (Indice)',
      'P6 (Indice)',
      'P7 (Indice)',
      'Respuesta P1',
      'Respuesta P2',
      'Respuesta P3',
      'Respuesta P4',
      'Respuesta P5',
      'Respuesta P6',
      'Respuesta P7',
      'Versión App'
    ];
    
    // Escribir los encabezados en la primera fila inferior de las herramientas
    sheet.appendRow(headers);
    
    // Poner en negrita y congelar la fila 1
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    
    // Ajustar el ancho de algunas columnas largas (opcional, para visualización sana)
    sheet.setColumnWidth(3, 200);   // Email
    sheet.setColumnWidth(7, 250);   // Dolor principal
    sheet.setColumnWidth(9, 200);   // Bucket name
    sheet.setColumnWidth(21, 280);  // Respuesta P1
    sheet.setColumnWidth(22, 280);
    sheet.setColumnWidth(23, 280);
    sheet.setColumnWidth(24, 280);
    sheet.setColumnWidth(25, 280);
    sheet.setColumnWidth(26, 280);
    sheet.setColumnWidth(27, 280);
  }
}

function doPost(e) {
  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName(SHEET_NAME);
    
    // Si borraron la hoja o no existe, la inicializamos mágicamente (o la primera vez que se lanza un registro)
    if (!sheet) {
      setup();
      sheet = doc.getSheetByName(SHEET_NAME);
    }
    
    // Parseo del body / payload que envía nuestra app en React (Formato JSON)
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    // Configurar e insertar los datos en el mismo orden de las columnas `headers` de arriba:
    const row = [
      payload.timestamp || new Date().toLocaleString("es-ES", { timeZone: "America/Bogota" }),
      payload.first_name || '',
      payload.email || '',
      payload.gender || '',
      payload.age_range || '',
      payload.hormonal_stage || '',
      payload.main_pain || '',
      payload.bucket || '',
      payload.bucket_name || '',
      payload.lead_priority || '',
      payload.ip || '',
      payload.country || '',
      payload.city || '',
      payload.answers?.p1 ?? '',
      payload.answers?.p2 ?? '',
      payload.answers?.p3 ?? '',
      payload.answers?.p4 ?? '',
      payload.answers?.p5 ?? '',
      payload.answers?.p6 ?? '',
      payload.answers?.p7 ?? '',
      payload.respuesta_p1 || '',
      payload.respuesta_p2 || '',
      payload.respuesta_p3 || '',
      payload.respuesta_p4 || '',
      payload.respuesta_p5 || '',
      payload.respuesta_p6 || '',
      payload.respuesta_p7 || '',
      payload.app_version || ''
    ];

    sheet.appendRow(row);

    // Responder OK con ContentService para que no reviente el try-catch de fetch de React
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Row inserted successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Si algo estalla, respondemos amablemente un texto plano/JSON
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Servicio desplegado correctamente. Por favor realiza peticiones POST desde la app.");
}
