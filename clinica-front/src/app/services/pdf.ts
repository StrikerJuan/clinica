import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Cliente } from './cliente';

const DOCTOR  = 'C.D. Martha Cristina Alvarado Vázquez';
const CEDULA  = 'Ced. Prof. (pendiente)';
const DIRECCION_CONSULTORIO = 'Calle División del Norte Mz.3 Lt.18 Col. Francisco Villa, Cuautitlán Izcalli, EdoMex. 54760';


@Injectable({
  providedIn: 'root',
})
export class PdfService {
  generar(tipo: string, datos: any, cliente: Cliente): void {
    switch (tipo) {
      case 'historia_general': this.historiaGeneral(datos, cliente); break;
      case 'historia_dental':  this.historiaDental(datos, cliente);  break;
      default: console.warn('Tipo de PDF no implementado aún:', tipo);
    }
  }

  private historiaGeneral(d: any, c: Cliente): void {
    const doc  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const W    = 216; // letter width mm
    const mg   = 15;
    let   y    = 15;
    const col  = W - mg * 2;
    const hoy  = new Date().toLocaleDateString('es-MX');

    const titulo = (txt: string) => {
      doc.setFontSize(13).setFont('helvetica', 'bold');
      doc.text(txt, W / 2, y, { align: 'center' });
      y += 7;
    };

    const seccion = (txt: string) => {
      y += 3;
      doc.setFillColor(123, 32, 32);
      doc.rect(mg, y, col, 6, 'F');
      doc.setTextColor(255, 255, 255).setFontSize(9).setFont('helvetica', 'bold');
      doc.text(txt.toUpperCase(), mg + 2, y + 4);
      doc.setTextColor(0, 0, 0);
      y += 9;
    };

    const campo = (label: string, valor: string, ancho = col) => {
      doc.setFontSize(8).setFont('helvetica', 'bold');
      doc.text(label + ':', mg, y);
      doc.setFont('helvetica', 'normal');
      doc.text(valor || '___________________________', mg + doc.getTextWidth(label + ': '), y);
      doc.line(mg + doc.getTextWidth(label + ': '), y + 0.5, mg + ancho, y + 0.5);
      y += 6;
    };

    const check = (label: string, valor: boolean) => {
      doc.setFontSize(8).setFont('helvetica', 'normal');
      doc.text(`${valor ? '☑' : '☐'} ${label}`, mg, y);
      y += 5;
    };

    const saltoSiNecesario = () => {
      if (y > 255) { doc.addPage(); y = 15; }
    };

    // ── ENCABEZADO ──
    doc.setFontSize(11).setFont('helvetica', 'bold');
    doc.text(DOCTOR, W / 2, y, { align: 'center' }); y += 5;
    doc.setFontSize(8).setFont('helvetica', 'normal');
    doc.text(CEDULA, W / 2, y, { align: 'center' }); y += 5;
    doc.text(DIRECCION_CONSULTORIO, W / 2, y, { align: 'center' }); y += 8;

    titulo('HISTORIA CLÍNICA');
    y += 2;

    // ── HIGIENE ──
    seccion('Higiene dental');
    campo('¿Padece dolor dental?', d.dolor_dental);
    doc.setFontSize(8);
    doc.text(`Cepillado: ${d.cepillado_veces || '—'} veces/día    `, mg, y);
    doc.text(`${d.hilo_dental ? '☑' : '☐'} Hilo dental    ${d.enjuague ? '☑' : '☐'} Enjuague`, mg + 50, y);
    y += 6;
    campo('Pasta dental', d.pasta_dental);
    campo('Tratamiento médico actual', d.tratamiento_medico);
    campo('Alergias', d.alergias);

    // ── ANTECEDENTES HEREDITARIOS ──
    saltoSiNecesario();
    seccion('Antecedentes hereditarios y familiares');
    const ahs = [
      ['Diabetes', d.ah_diabetes], ['Cardiopatías', d.ah_cardiopatias],
      ['Tuberculosis', d.ah_tuberculosis], ['Hemofilia', d.ah_hemofilia],
      ['Hipertensión', d.ah_hipertension], ['Cáncer', d.ah_cancer],
      ['Alergias', d.ah_alergias], ['Epilepsia', d.ah_epilepsia],
    ];
    for (let i = 0; i < ahs.length; i += 2) {
      doc.setFontSize(8).setFont('helvetica', 'bold');
      doc.text(`${ahs[i][0]}:`, mg, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(ahs[i][1] || '—'), mg + 25, y);
      if (ahs[i + 1]) {
        doc.setFont('helvetica', 'bold');
        doc.text(`${ahs[i + 1][0]}:`, mg + col / 2, y);
        doc.setFont('helvetica', 'normal');
        doc.text(String(ahs[i + 1][1] || '—'), mg + col / 2 + 25, y);
      }
      y += 6;
    }
    campo('Otras', d.ah_otras);

    // ── ANTECEDENTES PATOLÓGICOS ──
    saltoSiNecesario();
    seccion('Antecedentes personales patológicos');
    const aps = [
      ['Diabetes', d.ap_diabetes], ['Infarto', d.ap_infarto], ['Transfusiones', d.ap_transfusiones],
      ['Hepatitis', d.ap_hepatitis], ['Nefropatías', d.ap_nefropatias], ['Artritis', d.ap_artritis],
      ['Hipertensión', d.ap_hipertension], ['Acc. Cerebrovasculares', d.ap_acv], ['Nerviosismo', d.ap_nerviosismo],
      ['Enf. Cardiovascular', d.ap_cardiovascular], ['Anemia', d.ap_anemia], ['Asma', d.ap_asma],
      ['Adicciones', d.ap_adicciones], ['Alergias', d.ap_alergias], ['ETS', d.ap_ets],
      ['Hemofilia', d.ap_hemofilia], ['Quirúrgicos', d.ap_quirurgicos], ['Epilepsia', d.ap_epilepsia],
      ['Traumáticos', d.ap_traumaticos],
    ];
    for (let i = 0; i < aps.length; i += 3) {
      const x1 = mg, x2 = mg + col / 3, x3 = mg + (col / 3) * 2;
      doc.setFontSize(8);
      [[x1, aps[i]], [x2, aps[i+1]], [x3, aps[i+2]]].forEach(([x, ap]: any) => {
        if (!ap) return;
        doc.text(`${ap[1] ? '☑' : '☐'} ${ap[0]}`, x as number, y);
      });
      y += 5;
    }
    campo('Observaciones', d.ap_obs);

    // ── MOTIVO ──
    saltoSiNecesario();
    seccion('Motivo de consulta');
    campo('Motivo', d.motivo_consulta);

    // ── ODONTOGRAMA ──
    saltoSiNecesario();
    seccion('Estado bucal general');
    doc.setFontSize(8);
    doc.text(`${d.sarro ? '☑' : '☐'} Presencia de sarro    ${d.enf_periodontal ? '☑' : '☐'} Enfermedad Periodontal`, mg, y);
    y += 7;
    campo('Diagnóstico presuntivo', d.diagnostico);
    y += 2;
    campo('Plan de tratamiento', d.plan_tratamiento);
    y += 2;
    campo('Observaciones', d.observaciones);

    // ── DECLARATORIA ──
    saltoSiNecesario();
    seccion('Declaratoria');
    doc.setFontSize(7).setFont('helvetica', 'normal');
    const decl = 'Se me ha informado de manera verbal, libre y sin coerción alguna, de forma clara, sencilla y suficiente sobre el diagnóstico, pronóstico y las alternativas de tratamiento para mi padecimiento. Manifiesto también que he brindado información verídica sobre mi estado de salud actual, así como padecimientos anteriores e información relevante que se debe conocer para mi atención odontológica.';
    const lines = doc.splitTextToSize(decl, col);
    doc.text(lines, mg, y); y += lines.length * 4 + 8;

    // Firma
    doc.line(mg, y, mg + 80, y);
    doc.setFontSize(7);
    doc.text('Nombre y firma del paciente y/o representante legal', mg, y + 4);
    doc.text(`Fecha: ${hoy}`, mg + col - 30, y + 4);

    doc.save(`Historia_Clinica_${c.cli_apellido_pat}_${c.cli_nombre}.pdf`);
  }

  private historiaDental(d: any, c: Cliente): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });
    const W   = 216;
    const mg  = 15;
    let   y   = 15;
    const col = W - mg * 2;
    const hoy = new Date().toLocaleDateString('es-MX');

    const salto = () => { if (y > 250) { doc.addPage(); y = 15; } };

    const encabezado = () => {
      doc.setFontSize(10).setFont('helvetica', 'bold');
      doc.text(DOCTOR, W / 2, y, { align: 'center' }); y += 5;
      doc.setFontSize(8).setFont('helvetica', 'normal');
      doc.text(CEDULA, W / 2, y, { align: 'center' }); y += 4;
      doc.text(DIRECCION_CONSULTORIO, W / 2, y, { align: 'center' }); y += 8;
    };

    const titulo = (txt: string) => {
      doc.setFontSize(12).setFont('helvetica', 'bold');
      doc.text(txt, W / 2, y, { align: 'center' }); y += 7;
    };

    const seccion = (txt: string) => {
      salto();
      doc.setFillColor(123, 32, 32);
      doc.rect(mg, y, col, 6, 'F');
      doc.setTextColor(255, 255, 255).setFontSize(9).setFont('helvetica', 'bold');
      doc.text(txt, mg + 2, y + 4);
      doc.setTextColor(0, 0, 0); y += 9;
    };

    const campo = (label: string, valor: string, w = col) => {
      doc.setFontSize(8).setFont('helvetica', 'bold');
      doc.text(label + ':', mg, y);
      doc.setFont('helvetica', 'normal');
      const lw = doc.getTextWidth(label + ': ');
      doc.text(valor || '', mg + lw, y);
      doc.line(mg + lw, y + 0.5, mg + w, y + 0.5);
      y += 6;
    };

    const p = (num: number, txt: string, val: boolean, x = mg) => {
      doc.setFontSize(8).setFont('helvetica', 'normal');
      doc.text(`${val ? '☑' : '☐'} ${num}. ${txt}`, x, y);
    };

    const pregunta2col = (
      n1: number, t1: string, v1: boolean,
      n2: number, t2: string, v2: boolean
    ) => {
      salto();
      p(n1, t1, v1, mg);
      p(n2, t2, v2, mg + col / 2);
      y += 5;
    };

    // ── PÁGINA 1 ──
    encabezado();
    titulo('HISTORIA CLÍNICA DENTAL');

    // NHC y fecha
    doc.setFontSize(8).setFont('helvetica', 'bold');
    doc.text(`N.H.C.: ${d.nhc || '___________'}`, mg, y);
    doc.text(`Fecha: ${hoy}`, W - mg - 50, y); y += 7;

    campo('Nombre del paciente', d.paciente_nombre);
    campo('Representante legal', d.representante);
    campo('Dirección', d.paciente_direccion);

    // Fila de datos clínicos
    doc.setFontSize(8).setFont('helvetica', 'bold');
    const datos = [
      ['Ocupación', d.ocupacion], ['Tel.', d.paciente_telefono],
      ['F. Nac.', d.fecha_nac], ['Edad', d.edad], ['Sexo', d.sexo],
    ];
    let xd = mg;
    datos.forEach(([lbl, val]) => {
      doc.text(`${lbl}: `, xd, y);
      doc.setFont('helvetica', 'normal');
      const lw = doc.getTextWidth(`${lbl}: `);
      doc.text(String(val || ''), xd + lw, y);
      xd += col / datos.length;
      doc.setFont('helvetica', 'bold');
    });
    y += 7;

    const datos2 = [
      ['Talla', d.talla], ['Peso', d.peso], ['P.A.', d.pa],
      ['F.C.', d.fc], ['F.R.', d.fr],
    ];
    xd = mg;
    datos2.forEach(([lbl, val]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${lbl}: `, xd, y);
      doc.setFont('helvetica', 'normal');
      doc.text(String(val || ''), xd + doc.getTextWidth(`${lbl}: `), y);
      xd += col / datos2.length;
    });
    y += 7;

    campo('Motivo de consulta', d.motivo_consulta);

    // ── SECCIÓN I ──
    seccion('I. MARQUE LA RESPUESTA CORRECTA');
    pregunta2col(1, '¿Es buena su salud en general?', d.p1,
                4, '¿Se encuentra en tratamiento médico?', d.p4);
    pregunta2col(2, '¿Ha existido algún cambio en su salud?', d.p2,
                5, '¿Ha tenido problema con algún tratamiento dental?', d.p5);
    pregunta2col(3, '¿Ha estado hospitalizado en los últimos 3 años?', d.p3,
                6, '¿Tiene algún dolor ahora?', d.p6);

    if (d.p3_cual) campo('  Motivo hospitalización', d.p3_cual);
    if (d.p4_cual) campo('  Motivo tratamiento médico', d.p4_cual);
    if (d.p4_fecha_medico) {
      doc.setFontSize(8);
      doc.text(`Fecha último examen médico: ${d.p4_fecha_medico}    Fecha última cita dental: ${d.p4_fecha_dental || '—'}`, mg, y);
      y += 6;
    }
    if (d.p5_cual) campo('  Motivo problema dental', d.p5_cual);

    // ── SECCIÓN II ──
    salto();
    seccion('II. ¿HA NOTADO?');
    pregunta2col(7,  '¿Dolor en el pecho (Angina)?',             d.p7,  18, '¿Mareos?',                               d.p18);
    pregunta2col(8,  '¿Los tobillos hinchados?',                  d.p8,  19, '¿Ruidos o zumbidos en los oídos?',       d.p19);
    pregunta2col(9,  '¿Falta de aliento?',                        d.p9,  20, '¿Dolores de cabeza?',                    d.p20);
    pregunta2col(10, '¿Pérdida de peso, fiebre, sudor nocturno?', d.p10, 21, '¿Desmayos?',                            d.p21);
    pregunta2col(11, '¿Tos persistente o con sangre?',            d.p11, 22, '¿Vista borrosa?',                        d.p22);
    pregunta2col(12, '¿Problemas de sangrado, moretones?',        d.p12, 23, '¿Convulsiones?',                         d.p23);
    pregunta2col(13, '¿Problemas nasales (sinusitis)?',           d.p13, 24, '¿Sed excesiva?',                         d.p24);
    pregunta2col(14, '¿Dificultad al tragar?',                    d.p14, 25, '¿Orina con frecuencia?',                 d.p25);
    pregunta2col(15, '¿Diarrea, estreñimiento, sangre en heces?', d.p15, 26, '¿Boca seca?',                            d.p26);
    pregunta2col(16, '¿Vómitos frecuentes, náuseas?',             d.p16, 27, '¿Ictericia?',                            d.p27);
    pregunta2col(17, '¿Dificultad para orinar, sangre en orina?', d.p17, 28, '¿Dolor o rigidez en las articulaciones?',d.p28);

    // ── SECCIÓN III ──
    salto();
    seccion('III. ¿TIENE O HA TENIDO?');
    pregunta2col(29, '¿Enfermedades del corazón?',                  d.p29, 40, '¿SIDA?',                                         d.p40);
    pregunta2col(30, '¿Infarto o defectos en el corazón?',          d.p30, 41, '¿Tumores, cáncer?',                               d.p41);
    pregunta2col(31, '¿Soplos en el corazón?',                      d.p31, 42, '¿Artritis, reumas?',                              d.p42);
    pregunta2col(32, '¿Fiebre reumática?',                          d.p32, 43, '¿Enfermedades de los ojos?',                      d.p43);
    pregunta2col(33, '¿Apoplejía, endurecimiento de arterias?',     d.p33, 44, '¿Enfermedades de la piel?',                       d.p44);
    pregunta2col(34, '¿Presión sanguínea alta?',                    d.p34, 45, '¿Anemia?',                                        d.p45);
    pregunta2col(35, '¿Asma, tuberculosis, enf. pulmonares?',       d.p35, 46, '¿Enfermedades venéreas (sífilis, gonorrea)?',      d.p46);
    pregunta2col(36, '¿Hepatitis u otras enf. del hígado?',         d.p36, 47, '¿Herpes?',                                        d.p47);
    pregunta2col(37, '¿Problemas de estómago, úlceras?',            d.p37, 48, '¿Enfermedades renales, vejiga?',                   d.p48);
    pregunta2col(38, '¿Alergias a remedios, comidas, látex?',       d.p38, 49, '¿Enf. de tiroides o glándulas suprarrenales?',     d.p49);
    pregunta2col(39, '¿Familiares con diabetes, corazón, tumores?', d.p39, 50, '¿Diabetes?',                                      d.p50);

    // ── SECCIÓN IV ──
    salto();
    seccion('IV. ¿TIENE O HA TENIDO?');
    pregunta2col(51, '¿Tratamiento psiquiátrico?',        d.p51, 56, '¿Hospitalizaciones?',         d.p56);
    pregunta2col(52, '¿Tratamientos de radiación?',       d.p52, 57, '¿Transfusiones de sangre?',   d.p57);
    pregunta2col(53, '¿Quimioterapia?',                   d.p53, 58, '¿Cirugías?',                  d.p58);
    pregunta2col(54, '¿Válvula artificial del corazón?',  d.p54, 59, '¿Marcapasos?',                d.p59);
    pregunta2col(55, '¿Articulación artificial?',         d.p55, 60, '¿Lentes de contacto?',        d.p60);

    // ── SECCIÓN V ──
    salto();
    seccion('V. ¿ESTÁ TOMANDO?');
    pregunta2col(61, '¿Drogas de uso recreativo?',              d.p61, 63, '¿Tabaco de cualquier tipo?',    d.p63);
    pregunta2col(62, '¿Remedios o medicamentos sin receta?',    d.p62, 64, '¿Alcohol (bebidas alcohólicas)?', d.p64);
    y += 2;
    campo('Medicamento o sustancia que desee mencionar', d.medicamentos_extra);

    // ── SOLO MUJERES ──
    salto();
    seccion('SOLO PARA MUJERES');
    [
      [65, '¿Está o podría estar embarazada o dando pecho?', d.p65],
      [66, '¿Está tomando pastillas anticonceptivas?', d.p66],
    ].forEach(([n, t, v]: any) => { p(n, t, v); y += 5; });

    // ── SECCIÓN VI ──
    salto();
    seccion('VI. PARA TODOS LOS PACIENTES');
    p(67, '¿Tiene o ha tenido alguna enfermedad o problema médico no mencionado?', d.p67);
    y += 5;
    if (d.p67_cual) campo('  Explique', d.p67_cual);

    // ── DECLARATORIA ──
    salto();
    y += 4;
    doc.setFontSize(7).setFont('helvetica', 'normal');
    const decl = 'En mi calidad de Paciente y/o representante legal, he respondido completamente y correctamente todas las preguntas, informaré a mi dentista si hay cambios en mi salud y/o en los medicamentos que tomo.';
    const lines = doc.splitTextToSize(decl, col);
    doc.text(lines, mg, y); y += lines.length * 4 + 10;

    doc.line(mg, y, mg + 85, y);
    doc.setFontSize(7);
    doc.text('Nombre y firma del paciente y/o representante legal', mg, y + 4);
    doc.line(mg + col - 85, y, mg + col, y);
    doc.text(`Nombre y firma C.D.`, mg + col - 85, y + 4);

    doc.save(`Historia_Dental_${c.cli_apellido_pat}_${c.cli_nombre}.pdf`);
  }
}
