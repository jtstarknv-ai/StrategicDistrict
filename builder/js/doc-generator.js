/**
 * Document Generator for Strategic Planning Toolkit
 * Generates PDFs, PowerPoint slides, and Word documents client-side
 * Uses: jsPDF, jsPDF AutoTable, PptxGenJS, docx.js
 */

// Alias jsPDF from the UMD namespace (jspdf.jsPDF)
var jsPDF = jspdf.jsPDF;

var DocumentGenerator = (function() {
  'use strict';

  // Brand colors
  var COLORS = {
    navy: '#22333B',
    cream: '#EAE0D5',
    tan: '#C6AC8F',
    brown: '#5E503F',
    teal: '#00B4CC',
    gold: '#D4A537',
    green: '#6ECF6E',
    lightGray: '#F5F5F5',
    darkGray: '#333333',
    white: '#FFFFFF'
  };

  // Download history
  var downloadHistory = [];

  /**
   * Get brand colors
   */
  function getBrandColors() {
    return COLORS;
  }

  /**
   * Get document header with district and plan info
   */
  function getDocumentHeader(planState) {
    return {
      districtName: planState.districtName || 'School District',
      planName: planState.planName || 'Strategic Plan',
      schoolYear: planState.schoolYear || new Date().getFullYear(),
      generatedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  }

  /**
   * Format metric values
   */
  function formatMetric(value, type) {
    if (type === 'percentage') {
      return Math.round(value) + '%';
    }
    if (type === 'decimal') {
      return parseFloat(value).toFixed(2);
    }
    if (type === 'count') {
      return parseInt(value).toLocaleString();
    }
    return value;
  }

  /**
   * Add cover page to PDF
   */
  function addCoverPage(doc, title, subtitle, planState) {
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();
    var header = getDocumentHeader(planState);

    // Navy background rectangle
    doc.setFillColor(34, 51, 59);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Teal accent stripe
    doc.setFillColor(0, 180, 204);
    doc.rect(0, 75, pageWidth, 4, 'F');

    // Gold thin accent
    doc.setFillColor(212, 165, 55);
    doc.rect(20, 130, 60, 2, 'F');

    // Cream accent bar
    doc.setFillColor(234, 224, 213);
    doc.rect(0, pageHeight - 80, pageWidth, 80, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(32);
    doc.setFont('Helvetica', 'bold');
    doc.text(title, 20, 100, { maxWidth: pageWidth - 40 });

    // Subtitle
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'normal');
    doc.text(subtitle, 20, 150, { maxWidth: pageWidth - 40 });

    // District info in cream section
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text(header.districtName, 20, pageHeight - 60);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text(header.planName + ' | ' + header.schoolYear, 20, pageHeight - 45);
    doc.text('Generated: ' + header.generatedDate, 20, pageHeight - 30);

    // Add page number
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Page ' + doc.internal.getNumberOfPages(), pageWidth - 30, pageHeight - 15);

    doc.addPage();
  }

  /**
   * Add table of contents to PDF
   */
  function addTableOfContents(doc, sections) {
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(18);
    doc.setFont('Helvetica', 'bold');
    doc.text('Table of Contents', 20, 30);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    var yPos = 50;

    for (var i = 0; i < sections.length; i++) {
      doc.text((i + 1) + '. ' + sections[i], 20, yPos);
      yPos += 10;
    }

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Page ' + doc.internal.getNumberOfPages(), pageWidth - 30, pageHeight - 15);

    doc.addPage();
  }

  /**
   * Add header and footer to all pages
   */
  function addHeadersAndFooters(doc, planState) {
    var pageCount = doc.internal.getNumberOfPages();
    var pageWidth = doc.internal.pageSize.getWidth();
    var pageHeight = doc.internal.pageSize.getHeight();
    var header = getDocumentHeader(planState);

    for (var i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Header
      doc.setFontSize(9);
      doc.setTextColor(94, 80, 63); // Brown
      doc.text(header.districtName, 20, 10);
      doc.text(header.planName, pageWidth - 60, 10);

      // Teal accent line under header
      doc.setDrawColor(0, 180, 204); // Teal
      doc.setLineWidth(0.5);
      doc.line(20, 13, pageWidth - 20, 13);

      // Footer with teal accent
      doc.setDrawColor(0, 180, 204);
      doc.setLineWidth(0.3);
      doc.line(20, pageHeight - 16, pageWidth - 20, pageHeight - 16);
      doc.setTextColor(94, 80, 63);
      doc.setFontSize(8);
      doc.text(header.districtName + ' | Strategic Plan', 20, pageHeight - 10);
      doc.setTextColor(150, 150, 150);
      doc.text('Page ' + i + ' of ' + pageCount, pageWidth - 30, pageHeight - 10);
    }
  }

  /**
   * Add PPTX title slide
   */
  function addPPTXTitleSlide(pres, title, subtitle, planState) {
    var header = getDocumentHeader(planState);
    var slide = pres.addSlide();

    // Navy background
    slide.background = { color: COLORS.navy };

    // Cream accent
    slide.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 5,
      w: 10,
      h: 2,
      fill: { color: COLORS.cream }
    });

    // Title
    slide.addText(title, {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1.5,
      fontSize: 54,
      bold: true,
      color: COLORS.cream,
      align: 'left',
      fontFace: 'Arial'
    });

    // Subtitle
    slide.addText(subtitle, {
      x: 0.5,
      y: 3.5,
      w: 9,
      h: 1,
      fontSize: 28,
      color: COLORS.tan,
      align: 'left',
      fontFace: 'Arial'
    });

    // Teal accent stripe
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 4.8, w: 10, h: 0.06,
      fill: { color: COLORS.teal }
    });

    // Gold accent dot
    slide.addShape(pres.ShapeType.rect, {
      x: 0.5, y: 4.5, w: 1, h: 0.04,
      fill: { color: COLORS.gold }
    });

    // District info
    slide.addText(header.districtName, {
      x: 0.5,
      y: 5.1,
      w: 9,
      h: 0.4,
      fontSize: 14,
      color: COLORS.cream,
      align: 'left',
      fontFace: 'Arial'
    });

    slide.addText(header.planName + ' | ' + header.schoolYear, {
      x: 0.5,
      y: 5.5,
      w: 9,
      h: 0.4,
      fontSize: 12,
      color: COLORS.tan,
      align: 'left',
      fontFace: 'Arial'
    });

    return slide;
  }

  /**
   * Add branded content slide to PPTX
   */
  function addPPTXContentSlide(pres, slideTitle) {
    var slide = pres.addSlide();
    slide.background = { color: COLORS.white };

    // Navy header bar
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 0.8,
      fill: { color: COLORS.navy }
    });

    // Teal accent under header
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0.8, w: 10, h: 0.04,
      fill: { color: COLORS.teal }
    });

    // Slide title
    slide.addText(slideTitle, {
      x: 0.4, y: 0.1, w: 9.2, h: 0.6,
      fontSize: 22, bold: true,
      color: COLORS.cream,
      fontFace: 'Arial'
    });

    return slide;
  }

  /**
   * Track document download
   */
  function trackDownload(stageId, docType, docName) {
    downloadHistory.push({
      timestamp: new Date(),
      stageId: stageId,
      docType: docType,
      docName: docName
    });
  }

  /**
   * Get download history
   */
  function getDownloadHistory() {
    return downloadHistory;
  }

  /**
   * Save a docx.Document to file and trigger download
   */
  function saveDocx(document, filename) {
    docx.Packer.toBlob(document).then(function(blob) {
      var url = URL.createObjectURL(blob);
      var a = window.document.createElement('a');
      a.href = url;
      a.download = filename;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  }

  /**
   * Create a branded heading paragraph
   */
  function docxHeading(text, level) {
    return new docx.Paragraph({
      text: text,
      heading: level || docx.HeadingLevel.HEADING_1,
      spacing: { before: 240, after: 120 },
      color: '22333B',
      border: {
        bottom: { color: '00B4CC', space: 1, style: docx.BorderStyle.SINGLE, size: 6 }
      }
    });
  }

  /**
   * Create a body paragraph
   */
  function docxPara(text, opts) {
    opts = opts || {};
    return new docx.Paragraph({
      children: [new docx.TextRun({ text: text, bold: opts.bold || false, italics: opts.italics || false, size: opts.size || 22, color: opts.color || '333333', font: 'Arial' })],
      spacing: { after: opts.after || 120 }
    });
  }

  /**
   * Create a bullet point
   */
  function docxBullet(text) {
    return new docx.Paragraph({
      children: [new docx.TextRun({ text: text, size: 22, font: 'Arial', color: '333333' })],
      bullet: { level: 0 },
      spacing: { after: 60 }
    });
  }

  /**
   * Create a simple table with header row
   */
  function docxTable(headers, rows) {
    var headerCells = headers.map(function(h) {
      return new docx.TableCell({
        children: [new docx.Paragraph({ children: [new docx.TextRun({ text: h, bold: true, size: 20, font: 'Arial', color: 'FFFFFF' })], alignment: docx.AlignmentType.CENTER })],
        shading: { fill: '22333B' },
        verticalAlign: docx.VerticalAlign.CENTER
      });
    });
    var headerRow = new docx.TableRow({ children: headerCells, tableHeader: true });

    var bodyRows = rows.map(function(row, rowIndex) {
      var cells = row.map(function(cellText) {
        return new docx.TableCell({
          children: [new docx.Paragraph({ children: [new docx.TextRun({ text: String(cellText || ''), size: 20, font: 'Arial' })], spacing: { before: 40, after: 40 } })],
          shading: { fill: rowIndex % 2 === 0 ? 'F5F5F5' : 'FFFFFF' }
        });
      });
      return new docx.TableRow({ children: cells });
    });

    return new docx.Table({
      rows: [headerRow].concat(bodyRows),
      width: { size: 100, type: docx.WidthType.PERCENTAGE }
    });
  }

  // ===========================================================================
  // STAGE 2: VISION & MISSION
  // ===========================================================================

  /**
   * Generate Vision & Mission PDF Report
   */
  function generateVisionMissionPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    // Cover page
    addCoverPage(doc, 'Vision & Mission Report', 'Clarity and Alignment Assessment', planState);

    // Table of contents
    var sections = [
      'Executive Summary',
      'Vision Statement Analysis',
      'Mission Statement Analysis',
      'Clarity Assessment Results',
      'Stakeholder Input Summary',
      'Recommendations'
    ];
    addTableOfContents(doc, sections);

    // Executive Summary
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Executive Summary', 20, 30);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    var summaryText = 'This report provides a comprehensive analysis of the district\'s vision and mission statements, including clarity assessments and stakeholder feedback.';
    doc.text(summaryText, 20, 50, { maxWidth: 170 });

    // Vision Statement
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(34, 51, 59);
    doc.text('Vision Statement', 20, 85);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    var visionText = planState.visionStatement || 'Vision statement to be developed';
    doc.text(visionText, 20, 100, { maxWidth: 170 });

    // Mission Statement
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(34, 51, 59);
    doc.text('Mission Statement', 20, 140);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    var missionText = planState.missionStatement || 'Mission statement to be developed';
    doc.text(missionText, 20, 155, { maxWidth: 170 });

    // Clarity Scores
    doc.addPage();
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Clarity Assessment Results', 20, 30);

    var clarityData = [
      ['Criterion', 'Vision Score', 'Mission Score'],
      ['Clarity', formatMetric(planState.visionClarity || 75, 'percentage'), formatMetric(planState.missionClarity || 78, 'percentage')],
      ['Alignment', formatMetric(planState.visionAlignment || 82, 'percentage'), formatMetric(planState.missionAlignment || 80, 'percentage')],
      ['Inspirational Value', formatMetric(planState.visionInspiration || 85, 'percentage'), formatMetric(planState.missionInspiration || 79, 'percentage')]
    ];

    doc.autoTable({
      startY: 50,
      head: [clarityData[0]],
      body: clarityData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10
      },
      margin: { left: 20, right: 20 }
    });

    // Add headers and footers to all pages
    addHeadersAndFooters(doc, planState);

    // Save
    var filename = header.districtName.replace(/\s+/g, '_') + '_Vision_Mission_Report.pdf';
    doc.save(filename);
    trackDownload('stage-2', 'PDF', filename);
  }

  /**
   * Generate Vision Workshop PPTX
   */
  function generateVisionWorkshopPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    // Slide 1: Title
    addPPTXTitleSlide(pres, 'Vision & Mission Workshop', 'Building Our Shared Future', planState);

    // Slide 2: Agenda
    var slide2 = pres.addSlide();
    slide2.background = { color: COLORS.cream };
    slide2.addText('Workshop Agenda', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: COLORS.navy,
      fontFace: 'Arial'
    });

    var agendaItems = [
      'Welcome & Context',
      'District Journey & Current State',
      'Vision & Mission Exploration',
      'Small Group Discussions',
      'Feedback & Synthesis',
      'Next Steps'
    ];

    var agendaY = 1.5;
    for (var i = 0; i < agendaItems.length; i++) {
      slide2.addText((i + 1) + '. ' + agendaItems[i], {
        x: 1,
        y: agendaY,
        w: 8,
        h: 0.4,
        fontSize: 16,
        color: COLORS.navy,
        fontFace: 'Arial'
      });
      agendaY += 0.6;
    }

    // Slide 3: Current Vision
    var slide3 = pres.addSlide();
    slide3.background = { color: COLORS.white };
    slide3.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.8,
      fill: { color: COLORS.navy }
    });

    slide3.addText('Our Current Vision', {
      x: 0.5,
      y: 0.2,
      w: 9,
      h: 0.4,
      fontSize: 28,
      bold: true,
      color: COLORS.cream,
      fontFace: 'Arial'
    });

    var visionText = planState.visionStatement || 'To develop the vision statement collaboratively';
    slide3.addText(visionText, {
      x: 0.75,
      y: 1.5,
      w: 8.5,
      h: 4,
      fontSize: 18,
      color: COLORS.navy,
      fontFace: 'Arial',
      align: 'center'
    });

    // Slide 4-10: Discussion Topics
    var topics = [
      { title: 'What do we stand for?', description: 'Core values that define our district' },
      { title: 'Who do we serve?', description: 'Our students, families, and community' },
      { title: 'What impact do we want?', description: 'Measurable outcomes and achievements' },
      { title: 'How do we innovate?', description: 'Continuous improvement and adaptation' },
      { title: 'What barriers exist?', description: 'Challenges to realizing our vision' },
      { title: 'How are we accountable?', description: 'Transparency and results orientation' }
    ];

    for (var i = 0; i < topics.length; i++) {
      var slide = pres.addSlide();
      slide.background = { color: COLORS.white };

      // Header bar
      slide.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 0.8,
        fill: { color: COLORS.teal }
      });

      slide.addText(topics[i].title, {
        x: 0.5,
        y: 0.2,
        w: 9,
        h: 0.4,
        fontSize: 28,
        bold: true,
        color: COLORS.white,
        fontFace: 'Arial'
      });

      // Content
      slide.addText(topics[i].description, {
        x: 1,
        y: 1.5,
        w: 8,
        h: 1,
        fontSize: 18,
        color: COLORS.navy,
        fontFace: 'Arial'
      });

      // Bullet points for reflection
      var bullets = [
        'Small group discussion (15 minutes)',
        'Capture key themes and insights',
        'Report back to larger group'
      ];

      var bulletY = 3;
      for (var j = 0; j < bullets.length; j++) {
        slide.addText(bullets[j], {
          x: 1.5,
          y: bulletY,
          w: 7.5,
          h: 0.4,
          fontSize: 14,
          color: COLORS.brown,
          fontFace: 'Arial'
        });
        bulletY += 0.6;
      }
    }

    // Closing slide
    var closeSlide = pres.addSlide();
    closeSlide.background = { color: COLORS.navy };
    closeSlide.addText('Thank You', {
      x: 0.5,
      y: 2.5,
      w: 9,
      h: 1,
      fontSize: 48,
      bold: true,
      color: COLORS.cream,
      align: 'center',
      fontFace: 'Arial'
    });
    closeSlide.addText('Your voice shapes our future', {
      x: 0.5,
      y: 3.8,
      w: 9,
      h: 0.5,
      fontSize: 20,
      color: COLORS.tan,
      align: 'center',
      fontFace: 'Arial'
    });

    // Save
    var filename = header.districtName.replace(/\s+/g, '_') + '_Vision_Workshop.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-2', 'PPTX', filename);
  }

  /**
   * Generate Stakeholder Survey DOCX
   */
  function generateStakeholderSurveyDOCX(planState, type) {
    var header = getDocumentHeader(planState);
    var topic = type === 'vision-mission' ? 'Vision & Mission' : (type || 'Strategic Planning');
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Stakeholder Survey'));
    sections.push(docxPara(topic + ' Input Survey', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxHeading('Instructions', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Thank you for participating in ' + header.districtName + '\'s strategic planning process. Your input helps shape the future direction of our schools. Please answer each question thoughtfully. All responses are confidential.'));
    sections.push(docxPara(''));
    sections.push(docxHeading('Section 1: Your Role', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('1. What is your role in the district community?'));
    sections.push(docxBullet('Parent/Guardian'));
    sections.push(docxBullet('Teacher/Staff'));
    sections.push(docxBullet('Administrator'));
    sections.push(docxBullet('Student'));
    sections.push(docxBullet('Community Member'));
    sections.push(docxBullet('Board Member'));
    sections.push(docxPara(''));
    sections.push(docxHeading('Section 2: ' + topic, docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('2. What do you believe should be the primary focus of ' + header.districtName + ' over the next 3-5 years?'));
    sections.push(docxPara('_______________________________________________________________'));
    sections.push(docxPara('3. What are the greatest strengths of our district?'));
    sections.push(docxPara('_______________________________________________________________'));
    sections.push(docxPara('4. What areas need the most improvement?'));
    sections.push(docxPara('_______________________________________________________________'));
    sections.push(docxPara('5. Rate the following priorities (1=Low, 5=High):'));
    sections.push(docxTable(
      ['Priority Area', '1', '2', '3', '4', '5'],
      [
        ['Academic Achievement', '', '', '', '', ''],
        ['Student Well-Being & Safety', '', '', '', '', ''],
        ['Teacher Quality & Retention', '', '', '', '', ''],
        ['Community Engagement', '', '', '', '', ''],
        ['Equity & Access', '', '', '', '', ''],
        ['Operational Efficiency', '', '', '', '', ''],
        ['Innovation & Technology', '', '', '', '', '']
      ]
    ));
    sections.push(docxPara(''));
    sections.push(docxPara('6. What does success look like for our students?'));
    sections.push(docxPara('_______________________________________________________________'));
    sections.push(docxPara('7. Is there anything else you would like to share?'));
    sections.push(docxPara('_______________________________________________________________'));
    sections.push(docxPara(''));
    sections.push(docxPara('Thank you for your input. Results will be shared with the strategic planning committee.', { italics: true }));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Stakeholder_Survey_' + (type || 'General') + '.docx';
    saveDocx(document, filename);
    trackDownload('stage-2', 'DOCX', filename);
  }

  /**
   * Generate Focus Group Guide DOCX
   */
  function generateFocusGroupGuideDOCX(planState) {
    var header = getDocumentHeader(planState);
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Focus Group Discussion Guide'));
    sections.push(docxPara('Strategic Planning Stakeholder Engagement', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));

    sections.push(docxHeading('Facilitator Instructions', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('This guide provides a structured format for conducting focus group sessions as part of the strategic planning process. Each session should last 60-90 minutes with 8-12 participants.'));
    sections.push(docxPara(''));

    sections.push(docxHeading('Pre-Session Preparation (15 minutes)', docx.HeadingLevel.HEADING_2));
    sections.push(docxBullet('Arrange seating in a circle or U-shape'));
    sections.push(docxBullet('Prepare name tags and sign-in sheet'));
    sections.push(docxBullet('Set up recording device (with permission)'));
    sections.push(docxBullet('Print copies of any reference materials'));
    sections.push(docxBullet('Have markers, sticky notes, and chart paper ready'));
    sections.push(docxPara(''));

    sections.push(docxHeading('Session Agenda', docx.HeadingLevel.HEADING_2));
    sections.push(docxTable(
      ['Time', 'Activity', 'Notes'],
      [
        ['0:00-0:10', 'Welcome and introductions', 'Set ground rules: respect, confidentiality, equal voice'],
        ['0:10-0:20', 'Context setting', 'Share district data and current strategic direction'],
        ['0:20-0:40', 'Vision and mission discussion', 'Use prompts below'],
        ['0:40-0:55', 'Strengths, challenges, and opportunities', 'Small group breakouts if needed'],
        ['0:55-1:10', 'Priorities and values exercise', 'Dot voting on sticky notes'],
        ['1:10-1:20', 'Wrap-up and next steps', 'Thank participants, explain how input will be used']
      ]
    ));
    sections.push(docxPara(''));

    sections.push(docxHeading('Discussion Prompts', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Opening Question:', { bold: true }));
    sections.push(docxPara('"What is one word that describes what you want for every student in ' + header.districtName + '?"'));
    sections.push(docxPara(''));
    sections.push(docxPara('Vision Questions:', { bold: true }));
    sections.push(docxBullet('What should ' + header.districtName + ' look like in 5 years?'));
    sections.push(docxBullet('What would make you proud to say your children attend schools here?'));
    sections.push(docxBullet('What does a successful graduate of our district look like?'));
    sections.push(docxPara(''));
    sections.push(docxPara('Challenge Questions:', { bold: true }));
    sections.push(docxBullet('What are the biggest barriers to student success right now?'));
    sections.push(docxBullet('Where do we need to improve most urgently?'));
    sections.push(docxBullet('What resources or support are missing?'));
    sections.push(docxPara(''));
    sections.push(docxPara('Priority Questions:', { bold: true }));
    sections.push(docxBullet('If you could change one thing about our schools, what would it be?'));
    sections.push(docxBullet('What values should guide every decision in our district?'));
    sections.push(docxPara(''));

    sections.push(docxHeading('Note-Taking Template', docx.HeadingLevel.HEADING_2));
    sections.push(docxTable(
      ['Theme', 'Key Points Raised', 'Frequency/Emphasis'],
      [
        ['Vision/Aspirations', '', ''],
        ['Academic Priorities', '', ''],
        ['Student Support', '', ''],
        ['Community Connection', '', ''],
        ['Equity Concerns', '', ''],
        ['Resource Needs', '', ''],
        ['Other', '', '']
      ]
    ));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Focus_Group_Guide.docx';
    saveDocx(document, filename);
    trackDownload('stage-2', 'DOCX', filename);
  }

  /**
   * Generate Board Vision PPTX
   */
  function generateBoardVisionPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    // Title slide
    addPPTXTitleSlide(pres, 'Strategic Vision Alignment', 'Board Presentation', planState);

    // Vision slide
    var slide2 = pres.addSlide();
    slide2.background = { color: COLORS.white };
    slide2.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.8,
      fill: { color: COLORS.navy }
    });

    slide2.addText('Proposed Vision', {
      x: 0.5,
      y: 0.2,
      w: 9,
      h: 0.4,
      fontSize: 28,
      bold: true,
      color: COLORS.cream,
      fontFace: 'Arial'
    });

    var visionText = planState.visionStatement || 'Our collective vision for student success';
    slide2.addText(visionText, {
      x: 1,
      y: 1.8,
      w: 8,
      h: 3.5,
      fontSize: 20,
      color: COLORS.navy,
      fontFace: 'Arial',
      align: 'center'
    });

    // Closing
    var closeSlide = pres.addSlide();
    closeSlide.background = { color: COLORS.teal };
    closeSlide.addText('Discussion & Feedback', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 44,
      bold: true,
      color: COLORS.white,
      align: 'center',
      fontFace: 'Arial'
    });

    var filename = header.districtName.replace(/\s+/g, '_') + '_Board_Vision.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-2', 'PPTX', filename);
  }

  // ===========================================================================
  // STAGE 3: CORE VALUES
  // ===========================================================================

  /**
   * Generate Values Report PDF
   */
  function generateValuesReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Core Values Report', 'Identifying What Matters Most', planState);

    var sections = [
      'Introduction',
      'Values Discovery Process',
      'Core Values Identified',
      'Values-Behaviors Mapping',
      'Implementation Roadmap'
    ];
    addTableOfContents(doc, sections);

    // Introduction
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Core Values Overview', 20, 30);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    var introText = 'Our core values define who we are and how we work. They guide decision-making and shape our organizational culture.';
    doc.text(introText, 20, 50, { maxWidth: 170 });

    // Values table
    var valuesData = [
      ['Value', 'Definition', 'Evidence'],
      ['Value 1', 'Commitment to excellence', 'High-quality instruction and outcomes'],
      ['Value 2', 'Equity and inclusion', 'Access for all students'],
      ['Value 3', 'Continuous improvement', 'Data-driven decision making'],
      ['Value 4', 'Community partnership', 'Strong family and community engagement']
    ];

    if (planState.values && planState.values.length > 0) {
      valuesData = [['Value', 'Definition', 'Evidence']];
      for (var i = 0; i < planState.values.length; i++) {
        valuesData.push([
          planState.values[i].name || 'Value ' + (i + 1),
          planState.values[i].definition || '',
          planState.values[i].evidence || ''
        ]);
      }
    }

    doc.autoTable({
      startY: 85,
      head: [valuesData[0]],
      body: valuesData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 }
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Values_Report.pdf';
    doc.save(filename);
    trackDownload('stage-3', 'PDF', filename);
  }

  /**
   * Generate Values Workshop PPTX
   */
  function generateValuesWorkshopPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Core Values Workshop', 'Defining Our Identity', planState);

    // Agenda
    var slide2 = pres.addSlide();
    slide2.background = { color: COLORS.cream };
    slide2.addText('Workshop Overview', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: COLORS.navy,
      fontFace: 'Arial'
    });

    var agendaY = 1.5;
    var agenda = ['Values Discovery Exercise', 'Brainstorming & Prioritization', 'Definition Development', 'Evidence & Examples', 'Commitment & Action'];
    for (var i = 0; i < agenda.length; i++) {
      slide2.addText((i + 1) + '. ' + agenda[i], {
        x: 1,
        y: agendaY,
        w: 8,
        h: 0.4,
        fontSize: 16,
        color: COLORS.navy,
        fontFace: 'Arial'
      });
      agendaY += 0.6;
    }

    // Sample values slides
    var sampleValues = [
      { name: 'Excellence', desc: 'Commitment to high-quality teaching and learning' },
      { name: 'Equity', desc: 'Fair access and support for all students' },
      { name: 'Innovation', desc: 'Continuous improvement and adaptation' },
      { name: 'Community', desc: 'Strong partnerships and collaboration' }
    ];

    for (var i = 0; i < sampleValues.length; i++) {
      var slide = pres.addSlide();
      slide.background = { color: COLORS.white };

      slide.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 0.8,
        fill: { color: COLORS.gold }
      });

      slide.addText(sampleValues[i].name, {
        x: 0.5,
        y: 0.2,
        w: 9,
        h: 0.4,
        fontSize: 32,
        bold: true,
        color: COLORS.navy,
        fontFace: 'Arial'
      });

      slide.addText(sampleValues[i].desc, {
        x: 1.5,
        y: 1.5,
        w: 7,
        h: 3,
        fontSize: 20,
        color: COLORS.navy,
        fontFace: 'Arial',
        align: 'center'
      });
    }

    var filename = header.districtName.replace(/\s+/g, '_') + '_Values_Workshop.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-3', 'PPTX', filename);
  }

  /**
   * Generate Values-to-Behaviors DOCX
   */
  function generateValuesBehaviorsDOCX(planState) {
    var header = getDocumentHeader(planState);
    var values = planState.coreValues || ['Excellence', 'Equity', 'Integrity', 'Innovation', 'Collaboration'];
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Values-to-Behaviors Guide'));
    sections.push(docxPara('Translating Core Values into Daily Practice', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('This guide maps each core value to observable behaviors for leaders, teachers, and staff. Use this as a reference for professional development, hiring, and performance conversations.'));
    sections.push(docxPara(''));

    values.forEach(function(value) {
      sections.push(docxHeading(value, docx.HeadingLevel.HEADING_2));
      sections.push(docxTable(
        ['Role', 'What This Looks Like', 'What This Does NOT Look Like'],
        [
          ['District Leaders', 'Model ' + value.toLowerCase() + ' in decision-making; communicate expectations clearly; allocate resources accordingly', 'Making decisions without considering this value; inconsistent messaging'],
          ['Principals', 'Build school culture around ' + value.toLowerCase() + '; recognize staff who exemplify it; include in school improvement plans', 'Treating values as wall decorations; not connecting to daily work'],
          ['Teachers', 'Demonstrate ' + value.toLowerCase() + ' in classroom practices; build student understanding; integrate into instruction', 'Operating independently of district values; ignoring connection to students'],
          ['Support Staff', 'Apply ' + value.toLowerCase() + ' in every interaction; contribute to positive culture; support student needs', 'Disconnecting from the school community; going through the motions']
        ]
      ));
      sections.push(docxPara(''));
      sections.push(docxPara('Reflection prompt: How will we know when ' + value.toLowerCase() + ' is truly lived across our district?', { italics: true }));
      sections.push(docxPara(''));
    });

    sections.push(docxHeading('Implementation Notes', docx.HeadingLevel.HEADING_2));
    sections.push(docxBullet('Share this guide during opening-of-school professional development'));
    sections.push(docxBullet('Reference specific behaviors during observations and evaluations'));
    sections.push(docxBullet('Revisit quarterly to assess progress and adjust'));
    sections.push(docxBullet('Include in new employee onboarding materials'));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Values_Behaviors_Map.docx';
    saveDocx(document, filename);
    trackDownload('stage-3', 'DOCX', filename);
  }

  /**
   * Generate Staff Communications DOCX
   */
  function generateStaffCommsDOCX(planState) {
    var header = getDocumentHeader(planState);
    var values = planState.coreValues || ['Excellence', 'Equity', 'Integrity'];
    var valuesList = values.join(', ');
    var sections = [];

    sections.push(docxHeading('Staff Communication: Our Core Values'));
    sections.push(docxPara(header.districtName, { bold: true, size: 28 }));
    sections.push(docxPara(''));

    sections.push(docxHeading('Letter to Staff', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Dear ' + header.districtName + ' Team,'));
    sections.push(docxPara(''));
    sections.push(docxPara('As part of our strategic planning process, we have worked together with students, families, staff, and community members to identify the core values that will guide our district for the years ahead.'));
    sections.push(docxPara(''));
    sections.push(docxPara('Our core values are: ' + valuesList + '.', { bold: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('These values were not created in a boardroom. They came from hundreds of conversations, surveys, and focus groups with the people who make this district what it is. They reflect who we are at our best and who we are committed to becoming.'));
    sections.push(docxPara(''));
    sections.push(docxPara('In the coming weeks, your building leaders will share more about what these values look like in practice. We will be asking each school to identify concrete ways to bring these values to life for students every day.'));
    sections.push(docxPara(''));
    sections.push(docxPara('Thank you for your continued dedication to our students and community.'));
    sections.push(docxPara(''));
    sections.push(docxPara('[Superintendent Name]'));
    sections.push(docxPara(header.districtName));
    sections.push(docxPara(''));

    sections.push(docxHeading('Talking Points for Building Leaders', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Use these points when introducing core values at staff meetings:'));
    sections.push(docxBullet('Our strategic planning process included input from [number] stakeholders'));
    sections.push(docxBullet('The values chosen reflect what our community believes in most deeply'));
    values.forEach(function(v) {
      sections.push(docxBullet(v + ': [add 1-2 sentence description of what this means for daily work]'));
    });
    sections.push(docxBullet('We are not asking you to do something new. We are naming what our best teachers already do.'));
    sections.push(docxBullet('Over the next month, each team will identify one action they can take to live these values'));
    sections.push(docxPara(''));

    sections.push(docxHeading('FAQ for Staff', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Q: How were these values selected?', { bold: true }));
    sections.push(docxPara('A: Through surveys, focus groups, and committee review involving hundreds of stakeholders.'));
    sections.push(docxPara('Q: How will these values be used?', { bold: true }));
    sections.push(docxPara('A: They will guide strategic decisions, inform professional development, and shape our culture.'));
    sections.push(docxPara('Q: Will I be evaluated on these values?', { bold: true }));
    sections.push(docxPara('A: These values will inform our shared expectations, but they are about culture, not compliance.'));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Staff_Values_Communications.docx';
    saveDocx(document, filename);
    trackDownload('stage-3', 'DOCX', filename);
  }

  /**
   * Generate Board Values PPTX
   */
  function generateBoardValuesPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Our Core Values', 'Board Alignment Review', planState);

    // Values overview slide
    var slide2 = pres.addSlide();
    slide2.background = { color: COLORS.white };

    slide2.addShape(pres.ShapeType.rect, {
      x: 0,
      y: 0,
      w: 10,
      h: 0.8,
      fill: { color: COLORS.green }
    });

    slide2.addText('Proposed Core Values', {
      x: 0.5,
      y: 0.2,
      w: 9,
      h: 0.4,
      fontSize: 28,
      bold: true,
      color: COLORS.white,
      fontFace: 'Arial'
    });

    var closeSlide = pres.addSlide();
    closeSlide.background = { color: COLORS.navy };
    closeSlide.addText('What Do You Think?', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 40,
      bold: true,
      color: COLORS.cream,
      align: 'center',
      fontFace: 'Arial'
    });

    var filename = header.districtName.replace(/\s+/g, '_') + '_Board_Values.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-3', 'PPTX', filename);
  }

  // ===========================================================================
  // STAGE 4: COMPETENCIES
  // ===========================================================================

  /**
   * Generate Competency Report PDF
   */
  function generateCompetencyReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Competency Assessment Report', 'Capability & Gap Analysis', planState);

    var sections = [
      'Assessment Overview',
      'Current Competencies',
      'Gap Analysis',
      'Development Priorities',
      'Implementation Timeline'
    ];
    addTableOfContents(doc, sections);

    // Competencies section
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Leadership Competencies', 20, 30);

    var competencyData = [
      ['Competency', 'Current Level', 'Target Level', 'Gap'],
      ['Strategic Planning', '3.2', '4.5', 'High'],
      ['Data-Driven Decision Making', '3.7', '4.5', 'Medium'],
      ['Change Management', '3.0', '4.5', 'High'],
      ['Stakeholder Communication', '3.9', '4.5', 'Low'],
      ['Budget & Resource Management', '3.5', '4.5', 'Medium']
    ];

    doc.autoTable({
      startY: 50,
      head: [competencyData[0]],
      body: competencyData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Competency_Report.pdf';
    doc.save(filename);
    trackDownload('stage-4', 'PDF', filename);
  }

  /**
   * Generate Competency Mapping DOCX
   */
  function generateCompetencyMapDOCX(planState) {
    var header = getDocumentHeader(planState);
    var competencies = planState.competencies || {};
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Competency Map'));
    sections.push(docxPara('Organizational Capabilities Aligned to Strategy', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('This document maps selected organizational competencies to strategic domains and identifies current capability levels.'));
    sections.push(docxPara(''));

    var categories = Object.keys(competencies);
    if (categories.length === 0) {
      categories = ['Teaching & Learning', 'Leadership', 'Operations'];
      competencies = { 'Teaching & Learning': ['Data-driven instruction', 'Differentiation'], 'Leadership': ['Strategic thinking', 'Change management'], 'Operations': ['Resource optimization', 'Process improvement'] };
    }

    categories.forEach(function(cat) {
      var items = competencies[cat] || [];
      sections.push(docxHeading(cat, docx.HeadingLevel.HEADING_2));
      var rows = items.map(function(item) {
        return [item, '1  2  3  4  5', '1  2  3  4  5', ''];
      });
      if (rows.length > 0) {
        sections.push(docxTable(['Competency', 'Current Level', 'Target Level', 'Gap Analysis Notes'], rows));
      }
      sections.push(docxPara(''));
    });

    sections.push(docxHeading('Rating Scale', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('1 = Beginning: No formal processes; inconsistent application'));
    sections.push(docxPara('2 = Developing: Some processes in place; limited consistency'));
    sections.push(docxPara('3 = Proficient: Established processes; mostly consistent'));
    sections.push(docxPara('4 = Advanced: Strong processes; high consistency across the district'));
    sections.push(docxPara('5 = Exemplary: Best-in-class; model for other districts'));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Competency_Map.docx';
    saveDocx(document, filename);
    trackDownload('stage-4', 'DOCX', filename);
  }

  /**
   * Generate Leadership Assessment DOCX
   */
  function generateLeadershipAssessmentDOCX(planState) {
    var header = getDocumentHeader(planState);
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Leadership Self-Assessment'));
    sections.push(docxPara('Strategic Capability Readiness Tool', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('This self-assessment helps leaders evaluate their readiness to implement the strategic plan. Complete honestly. Results are for professional growth, not evaluation.'));
    sections.push(docxPara(''));
    sections.push(docxPara('Name: ________________________   Role: ________________________   Date: ____________'));
    sections.push(docxPara(''));

    var domains = [
      { name: 'Strategic Thinking', items: ['I can articulate how my work connects to the district strategic plan', 'I make decisions with the 3-5 year vision in mind', 'I can explain our strategic priorities to staff and families', 'I regularly review data to assess progress toward strategic goals'] },
      { name: 'Change Leadership', items: ['I communicate the "why" behind changes effectively', 'I build buy-in before implementing new initiatives', 'I support staff through transitions with empathy and clarity', 'I can manage resistance constructively'] },
      { name: 'Data-Driven Decision Making', items: ['I regularly use student outcome data to inform practice', 'I can identify trends and patterns in performance data', 'I share data transparently with stakeholders', 'I use data to set and monitor goals'] },
      { name: 'Collaborative Leadership', items: ['I actively seek input from diverse stakeholders', 'I build cross-functional teams to solve problems', 'I share leadership opportunities with others', 'I create structures for meaningful collaboration'] },
      { name: 'Equity Leadership', items: ['I examine policies and practices for equitable impact', 'I allocate resources based on student need', 'I amplify underrepresented voices in decision-making', 'I hold myself and others accountable for equitable outcomes'] }
    ];

    domains.forEach(function(domain) {
      sections.push(docxHeading(domain.name, docx.HeadingLevel.HEADING_2));
      var rows = domain.items.map(function(item) {
        return [item, '', '', '', ''];
      });
      sections.push(docxTable(['Statement', 'Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree'], rows));
      sections.push(docxPara('Reflection: What is one action I can take to grow in ' + domain.name.toLowerCase() + '?', { italics: true }));
      sections.push(docxPara('_______________________________________________________________'));
      sections.push(docxPara(''));
    });

    sections.push(docxHeading('Summary & Action Plan', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('My top strength area: ________________________________________________'));
    sections.push(docxPara('My primary growth area: _______________________________________________'));
    sections.push(docxPara('One professional development goal: ______________________________________'));
    sections.push(docxPara('Support I need: _______________________________________________________'));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Leadership_Assessment.docx';
    saveDocx(document, filename);
    trackDownload('stage-4', 'DOCX', filename);
  }

  // ===========================================================================
  // STAGE 5: STRATEGIC DOMAINS
  // ===========================================================================

  /**
   * Generate Domains Report PDF
   */
  function generateDomainsReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Strategic Domains Analysis', 'Priority Focus Areas', planState);

    var sections = [
      'Domain Framework',
      'Current State Assessment',
      'Opportunities & Challenges',
      'Domain Recommendations',
      'Implementation Considerations'
    ];
    addTableOfContents(doc, sections);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Strategic Domains', 20, 30);

    var domainsData = [
      ['Domain', 'Focus', 'Priority Level'],
      ['Instruction & Curriculum', 'Teaching and learning excellence', 'High'],
      ['Student Support Services', 'Wraparound support for learners', 'High'],
      ['Operational Excellence', 'Efficient, effective operations', 'Medium'],
      ['Community Partnerships', 'Family and community engagement', 'Medium'],
      ['Professional Development', 'Staff growth and capacity', 'High']
    ];

    doc.autoTable({
      startY: 50,
      head: [domainsData[0]],
      body: domainsData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Domains_Report.pdf';
    doc.save(filename);
    trackDownload('stage-5', 'PDF', filename);
  }

  /**
   * Generate Domains PPTX
   */
  function generateDomainsPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Strategic Domains', 'Priority Focus Areas', planState);

    var domains = [
      { name: 'Instruction & Curriculum', color: COLORS.teal },
      { name: 'Student Support', color: COLORS.green },
      { name: 'Operations', color: COLORS.gold },
      { name: 'Community Partnerships', color: COLORS.tan },
      { name: 'Professional Development', color: COLORS.brown }
    ];

    for (var i = 0; i < domains.length; i++) {
      var slide = pres.addSlide();
      slide.background = { color: COLORS.white };

      slide.addShape(pres.ShapeType.rect, {
        x: 0,
        y: 0,
        w: 10,
        h: 1,
        fill: { color: domains[i].color }
      });

      slide.addText(domains[i].name, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 0.4,
        fontSize: 32,
        bold: true,
        color: COLORS.white,
        fontFace: 'Arial'
      });

      slide.addText('Strategic focus and implications', {
        x: 1.5,
        y: 2,
        w: 7,
        h: 3,
        fontSize: 16,
        color: COLORS.navy,
        fontFace: 'Arial'
      });
    }

    var filename = header.districtName.replace(/\s+/g, '_') + '_Domains.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-5', 'PPTX', filename);
  }

  /**
   * Generate Prioritization Matrix DOCX
   */
  function generatePrioritizationMatrixDOCX(planState) {
    var header = getDocumentHeader(planState);
    var domains = planState.strategicDomains || ['Academic Excellence', 'Student Well-Being', 'Operational Efficiency', 'Community Engagement'];
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Domain Prioritization Worksheet'));
    sections.push(docxPara('Strategic Domains Evaluation Exercise', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('Use this worksheet to evaluate and prioritize your strategic domains. Each domain should be rated on impact, urgency, feasibility, and alignment with your vision.'));
    sections.push(docxPara(''));

    sections.push(docxHeading('Domain Scoring', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Rate each domain 1-5 on each criterion:'));
    var rows = domains.map(function(d) { return [d, '', '', '', '', '']; });
    sections.push(docxTable(['Domain', 'Impact (1-5)', 'Urgency (1-5)', 'Feasibility (1-5)', 'Vision Alignment (1-5)', 'Total'], rows));
    sections.push(docxPara(''));

    sections.push(docxHeading('Impact vs. Effort Matrix', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Place each domain in the appropriate quadrant:'));
    sections.push(docxTable(
      ['', 'Low Effort', 'High Effort'],
      [
        ['High Impact', '[Quick Wins]', '[Strategic Investments]'],
        ['Low Impact', '[Fill-ins]', '[Deprioritize]']
      ]
    ));
    sections.push(docxPara(''));

    sections.push(docxHeading('Prioritization Discussion Questions', docx.HeadingLevel.HEADING_2));
    sections.push(docxBullet('Which domains are most critical for student outcomes in the next 3 years?'));
    sections.push(docxBullet('Do we have the capacity and resources to pursue all selected domains simultaneously?'));
    sections.push(docxBullet('Are there domains that depend on others being addressed first?'));
    sections.push(docxBullet('How does each domain connect to our vision and core values?'));
    sections.push(docxBullet('What would happen if we deprioritized a domain for one year?'));
    sections.push(docxPara(''));

    sections.push(docxHeading('Final Priority Ranking', docx.HeadingLevel.HEADING_2));
    for (var i = 0; i < Math.max(domains.length, 6); i++) {
      sections.push(docxPara((i + 1) + '. ________________________________________'));
    }

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Prioritization_Matrix.docx';
    saveDocx(document, filename);
    trackDownload('stage-5', 'DOCX', filename);
  }

  // ===========================================================================
  // STAGE 6: GOAL SETTING
  // ===========================================================================

  /**
   * Generate Goals Report PDF
   */
  function generateGoalsReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Strategic Goals Report', 'SMART Goals & Targets', planState);

    var sections = [
      'Goals Overview',
      'Detailed Goals',
      'Success Metrics',
      'Resource Requirements',
      'Timeline & Milestones'
    ];
    addTableOfContents(doc, sections);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Strategic Goals', 20, 30);

    var goalsData = [
      ['Goal #', 'Goal', 'Target Year', 'Owner'],
      ['1', 'Increase graduation rate to 95%', '2027', 'Instruction & Support'],
      ['2', 'Improve proficiency in Math/ELA to 85%', '2027', 'Curriculum & Teaching'],
      ['3', 'Reduce chronic absenteeism by 30%', '2026', 'Student Services'],
      ['4', 'Achieve 100% teacher certification', '2025', 'HR & Development']
    ];

    doc.autoTable({
      startY: 50,
      head: [goalsData[0]],
      body: goalsData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Goals_Report.pdf';
    doc.save(filename);
    trackDownload('stage-6', 'PDF', filename);
  }

  /**
   * Generate Goal Workshop PPTX
   */
  function generateGoalWorkshopPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Strategic Goals Workshop', 'Setting Ambitious Targets', planState);

    var slide2 = pres.addSlide();
    slide2.background = { color: COLORS.cream };
    slide2.addText('SMART Goal Framework', {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: COLORS.navy,
      fontFace: 'Arial'
    });

    var smartFramework = [
      'S - Specific and Strategic',
      'M - Measurable with Data',
      'A - Achievable yet Ambitious',
      'R - Results-Oriented',
      'T - Time-Bound with Targets'
    ];

    var smartY = 1.5;
    for (var i = 0; i < smartFramework.length; i++) {
      slide2.addText(smartFramework[i], {
        x: 1,
        y: smartY,
        w: 8,
        h: 0.4,
        fontSize: 16,
        color: COLORS.navy,
        fontFace: 'Arial'
      });
      smartY += 0.8;
    }

    var filename = header.districtName.replace(/\s+/g, '_') + '_Goal_Workshop.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-6', 'PPTX', filename);
  }

  /**
   * Generate Goal Alignment DOCX
   */
  function generateGoalAlignmentDOCX(planState) {
    var header = getDocumentHeader(planState);
    var goals = planState.goals || [];
    var domains = planState.strategicDomains || [];
    var values = planState.coreValues || [];
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Goal Alignment Matrix'));
    sections.push(docxPara('Mapping Goals to Vision, Domains, Values, and Metrics', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('This matrix helps verify that every strategic goal connects to your vision, aligns with at least one domain, reflects your core values, and has measurable indicators.'));
    sections.push(docxPara(''));

    sections.push(docxHeading('Alignment Matrix', docx.HeadingLevel.HEADING_2));
    var goalRows = [];
    if (goals.length > 0) {
      goals.forEach(function(g) {
        var goalText = (typeof g === 'string') ? g : (g.title || g.text || g.goal || 'Goal');
        goalRows.push([goalText.substring(0, 60), '', '', '', '']);
      });
    } else {
      goalRows = [['Goal 1', '', '', '', ''], ['Goal 2', '', '', '', ''], ['Goal 3', '', '', '', '']];
    }
    sections.push(docxTable(['Strategic Goal', 'Domain', 'Core Value', 'Key Metric', 'Baseline/Target'], goalRows));
    sections.push(docxPara(''));

    sections.push(docxHeading('Vertical Alignment Check', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('For each domain, verify at least one goal exists:'));
    var domainCheckRows = domains.length > 0
      ? domains.map(function(d) { return [d, '', '']; })
      : [['Domain 1', '', ''], ['Domain 2', '', ''], ['Domain 3', '', '']];
    sections.push(docxTable(['Strategic Domain', 'Associated Goals', 'Coverage Status'], domainCheckRows));
    sections.push(docxPara(''));

    sections.push(docxHeading('Values Alignment Check', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('For each core value, identify which goals reflect it:'));
    var valueCheckRows = values.length > 0
      ? values.map(function(v) { return [v, '', '']; })
      : [['Value 1', '', ''], ['Value 2', '', ''], ['Value 3', '', '']];
    sections.push(docxTable(['Core Value', 'Reflected in Goals', 'Strength of Connection'], valueCheckRows));
    sections.push(docxPara(''));

    sections.push(docxHeading('Gap Analysis', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Domains without goals: _____________________________________________'));
    sections.push(docxPara('Values not reflected in any goal: _____________________________________'));
    sections.push(docxPara('Goals without clear metrics: _________________________________________'));
    sections.push(docxPara('Recommended adjustments: __________________________________________'));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Goal_Alignment_Matrix.docx';
    saveDocx(document, filename);
    trackDownload('stage-6', 'DOCX', filename);
  }

  /**
   * Generate Board Goals PPTX
   */
  function generateBoardGoalsPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Strategic Goals', 'Board Review & Adoption', planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Board_Goals.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-6', 'PPTX', filename);
  }

  // ===========================================================================
  // STAGE 7: GOAL FORECASTING
  // ===========================================================================

  /**
   * Generate Forecast Report PDF
   */
  function generateForecastReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Goal Forecasting Report', 'Trajectory & Projections', planState);

    var sections = [
      'Forecast Methodology',
      'Current Performance Baseline',
      'Projected Performance Trajectories',
      'Confidence Levels & Risks',
      'Recommendations'
    ];
    addTableOfContents(doc, sections);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Performance Projections', 20, 30);

    var forecastData = [
      ['Metric', '2024', '2025', '2026', '2027 Target'],
      ['Graduation Rate', '87%', '89%', '92%', '95%'],
      ['Math Proficiency', '72%', '76%', '81%', '85%'],
      ['Attendance Rate', '92%', '93%', '94%', '95%']
    ];

    doc.autoTable({
      startY: 50,
      head: [forecastData[0]],
      body: forecastData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Forecast_Report.pdf';
    doc.save(filename);
    trackDownload('stage-7', 'PDF', filename);
  }

  /**
   * Generate Scenario Analysis PDF
   */
  function generateScenarioAnalysisPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Scenario Analysis', 'Multiple Futures & Contingencies', planState);

    var sections = [
      'Scenario Framework',
      'Base Case Scenario',
      'Optimistic Scenario',
      'Pessimistic Scenario',
      'Strategic Implications'
    ];
    addTableOfContents(doc, sections);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Scenario Comparison', 20, 30);

    var scenarioData = [
      ['Metric', 'Base Case', 'Optimistic', 'Pessimistic'],
      ['2027 Graduation Rate', '94%', '97%', '90%'],
      ['Implementation Fidelity', '85%', '95%', '70%'],
      ['Funding Stability', 'Flat', 'Growing', 'Declining']
    ];

    doc.autoTable({
      startY: 50,
      head: [scenarioData[0]],
      body: scenarioData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Scenario_Analysis.pdf';
    doc.save(filename);
    trackDownload('stage-7', 'PDF', filename);
  }

  /**
   * Generate Board Forecast PPTX
   */
  function generateBoardForecastPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Performance Forecasting', 'Board Accountability Review', planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Board_Forecast.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-7', 'PPTX', filename);
  }

  // ===========================================================================
  // STAGE 8: CENTRAL OFFICE ALIGNMENT
  // ===========================================================================

  /**
   * Generate Alignment Report PDF
   */
  function generateAlignmentReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Alignment Report', 'Department Integration & Coordination', planState);

    var sections = [
      'Alignment Framework',
      'Department Assessments',
      'Gap Analysis',
      'Coordination Plan',
      'Success Metrics'
    ];
    addTableOfContents(doc, sections);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Department Alignment', 20, 30);

    var alignmentData = [
      ['Department', 'Strategic Alignment', 'Resource Support', 'Priority'],
      ['Instruction', 'Strong', 'Good', 'High'],
      ['Student Services', 'Strong', 'Adequate', 'High'],
      ['Operations', 'Moderate', 'Good', 'Medium'],
      ['Communications', 'Moderate', 'Adequate', 'Medium'],
      ['Finance', 'Strong', 'Good', 'High']
    ];

    doc.autoTable({
      startY: 50,
      head: [alignmentData[0]],
      body: alignmentData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Alignment_Report.pdf';
    doc.save(filename);
    trackDownload('stage-8', 'PDF', filename);
  }

  /**
   * Generate Responsibility Chart DOCX
   */
  function generateResponsibilityChartDOCX(planState) {
    var header = getDocumentHeader(planState);
    var departments = planState.selectedDepartments || ['Curriculum & Instruction', 'Student Services', 'Human Resources', 'Operations', 'Finance'];
    var goals = planState.goals || [];
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Responsibility Chart'));
    sections.push(docxPara('RACI Accountability Matrix for Strategic Plan Implementation', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('R = Responsible (does the work) | A = Accountable (owns the outcome) | C = Consulted (provides input) | I = Informed (kept updated)'));
    sections.push(docxPara(''));

    var goalLabels = goals.length > 0
      ? goals.map(function(g, i) { var t = (typeof g === 'string') ? g : (g.title || g.text || ''); return 'Goal ' + (i+1) + ': ' + t.substring(0, 40); })
      : ['Goal 1', 'Goal 2', 'Goal 3'];

    goalLabels.forEach(function(goalLabel) {
      sections.push(docxHeading(goalLabel, docx.HeadingLevel.HEADING_2));
      var rows = departments.map(function(dept) { return [dept, '', '', '', '']; });
      sections.push(docxTable(['Department', 'R', 'A', 'C', 'I'], rows));
      sections.push(docxPara('Lead department: ____________________  Timeline: ____________________', { italics: true }));
      sections.push(docxPara(''));
    });

    sections.push(docxHeading('Cross-Department Coordination', docx.HeadingLevel.HEADING_2));
    sections.push(docxPara('Goals requiring multi-department collaboration:'));
    sections.push(docxPara('_______________________________________________________________'));
    sections.push(docxPara('Coordination mechanism (meetings, shared dashboards, etc.):'));
    sections.push(docxPara('_______________________________________________________________'));
    sections.push(docxPara('Escalation path for cross-department issues:'));
    sections.push(docxPara('_______________________________________________________________'));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Responsibility_Chart.docx';
    saveDocx(document, filename);
    trackDownload('stage-8', 'DOCX', filename);
  }

  /**
   * Generate Department Communications DOCX
   */
  function generateDeptCommsTemplateDOCX(planState, department) {
    var header = getDocumentHeader(planState);
    var departments = planState.selectedDepartments || ['Curriculum & Instruction', 'Student Services', 'Operations'];
    var alignment = planState.departmentAlignment || {};
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Department Communication Templates'));
    sections.push(docxPara('Strategic Plan Rollout Communications', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));

    departments.forEach(function(dept) {
      var deptGoals = alignment[dept] || [];
      sections.push(docxHeading(dept, docx.HeadingLevel.HEADING_2));
      sections.push(docxPara(''));
      sections.push(docxPara('TO: ' + dept + ' Staff'));
      sections.push(docxPara('FROM: [Department Lead]'));
      sections.push(docxPara('RE: Strategic Plan Implementation - Your Role'));
      sections.push(docxPara(''));
      sections.push(docxPara('Team,'));
      sections.push(docxPara(''));
      sections.push(docxPara('Our district has adopted a new strategic plan, and ' + dept + ' plays a critical role in making it a reality. Here is what this means for our department:'));
      sections.push(docxPara(''));
      if (deptGoals.length > 0) {
        sections.push(docxPara('Our department is aligned to these strategic goals:', { bold: true }));
        deptGoals.forEach(function(g) { sections.push(docxBullet(g)); });
      } else {
        sections.push(docxPara('Our department is aligned to the following strategic goals:', { bold: true }));
        sections.push(docxBullet('[Insert goals assigned to this department]'));
      }
      sections.push(docxPara(''));
      sections.push(docxPara('What this means for you:', { bold: true }));
      sections.push(docxBullet('Your daily work directly supports these goals'));
      sections.push(docxBullet('We will be tracking progress through [metrics]'));
      sections.push(docxBullet('Expect updates at monthly department meetings'));
      sections.push(docxPara(''));
      sections.push(docxPara('Questions? Reach out to me directly or attend the Q&A session on [date].'));
      sections.push(docxPara(''));
      sections.push(docxPara('[Department Lead Name]'));
      sections.push(docxPara(''));
    });

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Department_Communications.docx';
    saveDocx(document, filename);
    trackDownload('stage-8', 'DOCX', filename);
  }

  // ===========================================================================
  // STAGE 9: ACTION INITIATIVES
  // ===========================================================================

  /**
   * Generate Initiatives Report PDF
   */
  function generateInitiativesReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Strategic Initiatives Portfolio', 'Action Plans & Implementation', planState);

    var sections = [
      'Initiatives Overview',
      'Initiative Descriptions',
      'Resource Requirements',
      'Risk Assessment',
      'Implementation Timeline'
    ];
    addTableOfContents(doc, sections);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Strategic Initiatives', 20, 30);

    var initiativesData = [
      ['Initiative', 'Focus Area', 'Lead', 'Timeline'],
      ['Literacy Intervention Program', 'Instruction', 'Elementary Dir.', '2025-2027'],
      ['Attendance Improvement Campaign', 'Student Support', 'Social Workers', '2025-2026'],
      ['Staff Professional Learning', 'Development', 'HR & Instruction', '2025-2028'],
      ['Community Engagement Initiative', 'Partnerships', 'Communications', '2025-2026']
    ];

    doc.autoTable({
      startY: 50,
      head: [initiativesData[0]],
      body: initiativesData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Initiatives_Report.pdf';
    doc.save(filename);
    trackDownload('stage-9', 'PDF', filename);
  }

  /**
   * Generate Initiative Proposal DOCX
   */
  function generateInitiativeProposalDOCX(planState, initiativeId) {
    var header = getDocumentHeader(planState);
    var initiatives = planState.initiatives || [];
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Initiative Proposal Template'));
    sections.push(docxPara('Action Initiative Planning Document', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('Complete one proposal for each major initiative. This template ensures each initiative has clear ownership, resources, timeline, and success criteria.'));
    sections.push(docxPara(''));

    var templateCount = Math.max(initiatives.length, 3);
    for (var i = 0; i < templateCount; i++) {
      var init = initiatives[i] || {};
      var initTitle = init.title || init.name || 'Initiative ' + (i + 1);
      sections.push(docxHeading('Initiative: ' + initTitle, docx.HeadingLevel.HEADING_2));
      sections.push(docxTable(
        ['Field', 'Details'],
        [
          ['Initiative Name', initTitle],
          ['Strategic Goal Supported', init.goal || ''],
          ['Initiative Owner', init.owner || ''],
          ['Department(s) Involved', init.department || ''],
          ['Start Date', init.startDate || ''],
          ['Target Completion', init.endDate || ''],
          ['Estimated Budget', init.resources || ''],
          ['Priority Level', init.priority || 'High / Medium / Low']
        ]
      ));
      sections.push(docxPara(''));
      sections.push(docxPara('Problem Statement:', { bold: true }));
      sections.push(docxPara('What specific problem or opportunity does this initiative address?'));
      sections.push(docxPara('_______________________________________________________________'));
      sections.push(docxPara(''));
      sections.push(docxPara('Expected Outcomes:', { bold: true }));
      sections.push(docxBullet('Short-term (Year 1): '));
      sections.push(docxBullet('Medium-term (Year 2-3): '));
      sections.push(docxBullet('Long-term (Year 3-5): '));
      sections.push(docxPara(''));
      sections.push(docxPara('Success Metrics:', { bold: true }));
      sections.push(docxTable(
        ['Metric', 'Baseline', 'Year 1 Target', 'Year 3 Target'],
        [['', '', '', ''], ['', '', '', ''], ['', '', '', '']]
      ));
      sections.push(docxPara(''));
      sections.push(docxPara('Key Milestones:', { bold: true }));
      sections.push(docxTable(
        ['Milestone', 'Target Date', 'Owner', 'Status'],
        [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']]
      ));
      sections.push(docxPara(''));
      sections.push(docxPara('Risks and Mitigation:', { bold: true }));
      sections.push(docxTable(
        ['Risk', 'Likelihood', 'Impact', 'Mitigation Strategy'],
        [['', '', '', ''], ['', '', '', '']]
      ));
      sections.push(docxPara(''));
    }

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Initiative_Proposals.docx';
    saveDocx(document, filename);
    trackDownload('stage-9', 'DOCX', filename);
  }

  /**
   * Generate Prioritization Matrix PDF
   */
  function generatePrioritizationMatrixPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Initiative Prioritization Matrix', 'Impact vs. Effort Analysis', planState);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Priority Matrix', 20, 30);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    var matrixText = 'Initiatives are assessed on impact potential and implementation effort. High-impact, low-effort initiatives are prioritized for immediate action.';
    doc.text(matrixText, 20, 50, { maxWidth: 170 });

    // Simple matrix visualization
    doc.setDrawColor(0);
    doc.rect(30, 80, 100, 100);

    // Quadrant labels
    doc.setFontSize(10);
    doc.text('Quick Wins', 50, 75);
    doc.text('Strategic', 115, 75);
    doc.text('Fill-ins', 50, 190);
    doc.text('Reconsider', 115, 190);

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Prioritization_Matrix.pdf';
    doc.save(filename);
    trackDownload('stage-9', 'PDF', filename);
  }

  // ===========================================================================
  // STAGE 10: IMPLEMENTATION CALENDAR
  // ===========================================================================

  /**
   * Generate Roadmap PDF
   */
  function generateRoadmapPDF(planState) {
    var doc = new jsPDF('landscape');
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Strategic Roadmap', 'Multi-Year Implementation Timeline', planState);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('3-Year Implementation Roadmap (2025-2028)', 20, 30);

    var roadmapData = [
      ['Year', 'Key Initiatives', 'Milestones', 'Expected Outcomes'],
      ['2025', 'Program Launch, Staff Training', 'Q1: Planning, Q2: Training, Q3: Launch', 'Programs operational, 80% staff trained'],
      ['2026', 'Expansion, Refinement', 'Q1: Scale, Q2: Review, Q3: Adjust', 'All schools participating, improvements evident'],
      ['2027', 'Sustainability, Full Implementation', 'Q1-Q4: Monitor & Support', 'Target goals achieved, sustainable practices']
    ];

    doc.autoTable({
      startY: 50,
      head: [roadmapData[0]],
      body: roadmapData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 45 },
        2: { cellWidth: 55 },
        3: { cellWidth: 55 }
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Roadmap.pdf';
    doc.save(filename);
    trackDownload('stage-10', 'PDF', filename);
  }

  /**
   * Generate Milestone Plan DOCX
   */
  function generateMilestonePlanDOCX(planState) {
    var header = getDocumentHeader(planState);
    var initiatives = planState.initiatives || [];
    var sections = [];

    sections.push(docxHeading(header.districtName + ' Milestone Tracking Plan'));
    sections.push(docxPara('Implementation Milestone Document', { bold: true, size: 28 }));
    sections.push(docxPara('Generated: ' + header.generatedDate, { italics: true }));
    sections.push(docxPara(''));
    sections.push(docxPara('This document tracks key milestones for each strategic initiative across the implementation timeline. Update quarterly.'));
    sections.push(docxPara(''));

    var quarters = ['Q1 (Jul-Sep)', 'Q2 (Oct-Dec)', 'Q3 (Jan-Mar)', 'Q4 (Apr-Jun)'];

    sections.push(docxHeading('Year 1 Milestone Overview', docx.HeadingLevel.HEADING_2));
    var overviewRows = [];
    if (initiatives.length > 0) {
      initiatives.forEach(function(init) {
        var title = init.title || init.name || 'Initiative';
        overviewRows.push([title.substring(0, 30), '', '', '', '']);
      });
    } else {
      overviewRows = [['Initiative 1', '', '', '', ''], ['Initiative 2', '', '', '', ''], ['Initiative 3', '', '', '', '']];
    }
    sections.push(docxTable(['Initiative'].concat(quarters), overviewRows));
    sections.push(docxPara(''));

    sections.push(docxHeading('Detailed Milestone Tracking', docx.HeadingLevel.HEADING_2));
    var trackingCount = Math.max(initiatives.length, 3);
    for (var i = 0; i < trackingCount; i++) {
      var init = initiatives[i] || {};
      var title = init.title || init.name || 'Initiative ' + (i + 1);
      sections.push(docxPara(title, { bold: true, size: 24 }));
      sections.push(docxTable(
        ['Milestone', 'Target Date', 'Owner', 'Status', 'Notes'],
        [
          ['Planning complete', '', '', 'Not Started / In Progress / Complete', ''],
          ['Pilot launch', '', '', '', ''],
          ['Mid-point review', '', '', '', ''],
          ['Full implementation', '', '', '', ''],
          ['Year 1 evaluation', '', '', '', '']
        ]
      ));
      sections.push(docxPara(''));
    }

    sections.push(docxHeading('Board Reporting Schedule', docx.HeadingLevel.HEADING_2));
    sections.push(docxTable(
      ['Report Date', 'Report Type', 'Audience', 'Key Content'],
      [
        ['[Month]', 'Progress Update', 'School Board', 'Q1 milestone status, early wins, adjustments'],
        ['[Month]', 'Mid-Year Review', 'School Board', 'Q2 data, budget status, barrier analysis'],
        ['[Month]', 'Progress Update', 'School Board + Community', 'Q3 outcomes, stakeholder feedback'],
        ['[Month]', 'Annual Report', 'School Board + Community', 'Full year results, Year 2 adjustments']
      ]
    ));

    var document = new docx.Document({ sections: [{ children: sections }] });
    var filename = header.districtName.replace(/\s+/g, '_') + '_Milestone_Plan.docx';
    saveDocx(document, filename);
    trackDownload('stage-10', 'DOCX', filename);
  }

  /**
   * Generate Board Timeline PPTX
   */
  function generateBoardTimelinePPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Implementation Timeline', 'Board Governance & Reporting', planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Board_Timeline.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-10', 'PPTX', filename);
  }

  // ===========================================================================
  // STAGE 11: REVIEW & FINALIZE
  // ===========================================================================

  /**
   * Generate Full Strategic Plan PDF (The Big Deliverable)
   */
  function generateStrategicPlanPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    // Cover
    addCoverPage(doc, 'Strategic Plan', header.schoolYear + ' - ' + (parseInt(header.schoolYear) + 3), planState);

    // TOC
    var sections = [
      'Executive Summary',
      'Vision & Mission',
      'Core Values',
      'Strategic Competencies',
      'Strategic Domains',
      'Strategic Goals',
      'Goal Forecasting & Scenarios',
      'Central Office Alignment',
      'Strategic Initiatives',
      'Implementation Calendar',
      'Monitoring & Accountability'
    ];
    addTableOfContents(doc, sections);

    // Executive Summary
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Executive Summary', 20, 30);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    var summaryText = 'This strategic plan outlines ' + header.districtName + '\'s priorities, goals, and initiatives for the ' + header.schoolYear + ' school year and beyond. Developed through extensive stakeholder engagement, this plan reflects our commitment to educational excellence and equity.';
    doc.text(summaryText, 20, 50, { maxWidth: 170 });

    // Vision section
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('Our Vision', 20, 100);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    var visionText = planState.visionStatement || 'Our vision statement';
    doc.text(visionText, 20, 115, { maxWidth: 170 });

    // Mission section
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('Our Mission', 20, 150);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    var missionText = planState.missionStatement || 'Our mission statement';
    doc.text(missionText, 20, 165, { maxWidth: 170 });

    // Goals summary page
    doc.addPage();
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Strategic Goals', 20, 30);

    var goalsData = [
      ['Goal', 'Target Year', 'Owner'],
      ['Increase graduation rate to 95%', '2027', 'Instruction & Support'],
      ['Improve proficiency in Math/ELA to 85%', '2027', 'Curriculum'],
      ['Reduce chronic absenteeism by 30%', '2026', 'Student Services'],
      ['Achieve 100% teacher certification', '2025', 'HR']
    ];

    doc.autoTable({
      startY: 50,
      head: [goalsData[0]],
      body: goalsData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    // Initiatives summary page
    doc.addPage();
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Strategic Initiatives', 20, 30);

    var initiativesData = [
      ['Initiative', 'Timeline', 'Lead'],
      ['Literacy Intervention Program', '2025-2027', 'Elementary Dir.'],
      ['Attendance Improvement', '2025-2026', 'Social Workers'],
      ['Professional Learning', '2025-2028', 'HR & Instruction']
    ];

    doc.autoTable({
      startY: 50,
      head: [initiativesData[0]],
      body: initiativesData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Strategic_Plan_' + header.schoolYear + '.pdf';
    doc.save(filename);
    trackDownload('stage-11', 'PDF', filename);
  }

  /**
   * Generate Executive Summary PDF
   */
  function generateExecutiveSummaryPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Executive Summary', 'Strategic Plan Overview', planState);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('Plan Overview', 20, 30);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    var overviewText = 'This executive summary provides a high-level overview of ' + header.districtName + '\'s strategic priorities and goals. The full strategic plan provides detailed analysis and implementation guidance.';
    doc.text(overviewText, 20, 50, { maxWidth: 170 });

    // Key goals
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Key Strategic Goals:', 20, 85);

    var bullets = [
      'Graduation Rate: 87% to 95% by 2027',
      'Math/ELA Proficiency: 72% to 85% by 2027',
      'Chronic Absenteeism: Reduce 30% by 2026'
    ];

    var bulletY = 100;
    for (var i = 0; i < bullets.length; i++) {
      doc.setFontSize(10);
      doc.text(bullets[i], 25, bulletY);
      bulletY += 8;
    }

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Executive_Summary.pdf';
    doc.save(filename);
    trackDownload('stage-11', 'PDF', filename);
  }

  /**
   * Generate Board Adoption PPTX
   */
  function generateBoardAdoptionPPTX(planState) {
    var pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT1', width: 10, height: 7.5 });
    pres.layout = 'LAYOUT1';

    var header = getDocumentHeader(planState);

    addPPTXTitleSlide(pres, 'Strategic Plan', 'Board Adoption Resolution', planState);

    // Proposed vote slide
    var slide2 = pres.addSlide();
    slide2.background = { color: COLORS.cream };
    slide2.addText('Resolution for Adoption', {
      x: 0.5,
      y: 1,
      w: 9,
      h: 0.6,
      fontSize: 32,
      bold: true,
      color: COLORS.navy,
      fontFace: 'Arial'
    });

    var resolutionText = 'The Board of Education hereby adopts the ' + header.schoolYear + ' Strategic Plan as the guiding document for district operations and resource allocation.';
    slide2.addText(resolutionText, {
      x: 1,
      y: 2.5,
      w: 8,
      h: 2,
      fontSize: 16,
      color: COLORS.navy,
      fontFace: 'Arial',
      align: 'center'
    });

    // Vote slide
    var voteSlide = pres.addSlide();
    voteSlide.background = { color: COLORS.navy };
    voteSlide.addText('All in Favor?', {
      x: 0.5,
      y: 3,
      w: 9,
      h: 1,
      fontSize: 48,
      bold: true,
      color: COLORS.gold,
      align: 'center',
      fontFace: 'Arial'
    });

    var filename = header.districtName.replace(/\s+/g, '_') + '_Board_Adoption.pptx';
    pres.writeFile({ fileName: filename });
    trackDownload('stage-11', 'PPTX', filename);
  }

  /**
   * Generate Community Plan PDF
   */
  function generateCommunityPlanPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Our Strategic Direction', 'A Plan for Community Partnership', planState);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(14);
    doc.setFont('Helvetica', 'bold');
    doc.text('What We Believe', 20, 30);

    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    var beliefText = 'All students can succeed with high-quality instruction, supportive relationships, and equitable resources.';
    doc.text(beliefText, 20, 50, { maxWidth: 170 });

    // Vision and mission for community
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Our Vision:', 20, 85);

    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    var communityVision = planState.visionStatement || 'Vision for community';
    doc.text(communityVision, 20, 100, { maxWidth: 170 });

    // How families can help
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('How You Can Help:', 20, 140);

    var communityBullets = [
      'Engage regularly with teachers and school',
      'Support learning at home',
      'Provide feedback on school programs',
      'Volunteer in schools and classrooms'
    ];

    var communityY = 155;
    for (var i = 0; i < communityBullets.length; i++) {
      doc.setFontSize(10);
      doc.text(communityBullets[i], 25, communityY);
      communityY += 8;
    }

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Community_Plan.pdf';
    doc.save(filename);
    trackDownload('stage-11', 'PDF', filename);
  }

  /**
   * Generate Feasibility Report PDF
   */
  function generateFeasibilityReportPDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Feasibility Assessment', 'Implementation Readiness Analysis', planState);

    var sections = [
      'Feasibility Framework',
      'Resource Assessment',
      'Timeline Feasibility',
      'Organizational Capacity',
      'Risk Mitigation',
      'Recommendations'
    ];
    addTableOfContents(doc, sections);

    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Feasibility Assessment', 20, 30);

    var feasibilityData = [
      ['Dimension', 'Assessment', 'Confidence Level'],
      ['Financial Resources', 'Adequate with slight stretch', 'High'],
      ['Staffing & Capacity', 'Requires professional development', 'Medium'],
      ['Timeline', 'Realistic with proper sequencing', 'High'],
      ['Technology Infrastructure', 'Ready for most initiatives', 'High'],
      ['Community Support', 'Strong alignment and support', 'High']
    ];

    doc.autoTable({
      startY: 50,
      head: [feasibilityData[0]],
      body: feasibilityData.slice(1),
      headStyles: {
        fillColor: [34, 51, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      bodyStyles: {
        textColor: [0, 0, 0]
      },
      margin: { left: 20, right: 20 }
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Feasibility_Report.pdf';
    doc.save(filename);
    trackDownload('stage-11', 'PDF', filename);
  }

  // ===========================================================================
  // STAKEHOLDER ENGAGEMENT PLAYBOOK
  // ===========================================================================

  function generateStakeholderEngagementGuidePDF(planState) {
    var doc = new jsPDF();
    var header = getDocumentHeader(planState);

    addCoverPage(doc, 'Stakeholder Engagement Playbook', 'A Stage-by-Stage Guide to Meaningful Community Input', planState);

    // TOC
    addTableOfContents(doc, [
      'Why Stakeholder Engagement Matters',
      'Engagement by Stage',
      'Stage 2: Vision & Mission',
      'Stage 3: Core Values',
      'Stage 5: Strategic Domains',
      'Stage 6: Goals',
      'Stage 8: Central Office Alignment',
      'Stage 11: Review & Finalize',
      'Tools and Templates',
      'Tips for Effective Engagement'
    ]);

    // Why it matters
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Why Stakeholder Engagement Matters', 20, 30);
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    doc.text('Strategic plans that are built with community input are more likely to be implemented, supported, and sustained. Research shows that districts with strong stakeholder engagement see higher plan adoption rates and better outcomes for students.', 20, 45, { maxWidth: 170 });
    doc.text('This playbook maps exactly where in the strategic planning process you should engage stakeholders, who to include, and what tools to use.', 20, 75, { maxWidth: 170 });

    // Engagement map table
    doc.addPage();
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('When to Engage Stakeholders', 20, 30);

    doc.autoTable({
      startY: 45,
      head: [['Stage', 'Engagement Type', 'Who to Include', 'Tool Available']],
      body: [
        ['2. Vision & Mission', 'Surveys, Focus Groups', 'All stakeholders', 'Survey Generator, Focus Group Guide'],
        ['3. Core Values', 'Values Survey, Workshops', 'Staff, Families, Community', 'Values Survey, Workshop Slides'],
        ['5. Strategic Domains', 'Brainstorming Workshop', 'Leadership, Staff, Board', 'Workshop Guide, Prioritization Matrix'],
        ['6. Goal Setting', 'Goal Review Sessions', 'Staff, Community Leaders', 'Workshop Slides, Goal Alignment Doc'],
        ['8. Central Office', 'Department Town Halls', 'Department Leaders, Staff', 'Comms Templates, RACI Chart'],
        ['11. Review & Finalize', 'Community Presentation', 'All stakeholders, Board', 'Board Adoption Slides, Community Plan']
      ],
      headStyles: { fillColor: [34, 51, 59], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { textColor: [0, 0, 0], fontSize: 9 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 }
    });

    // Stage-by-stage details
    var stages = [
      { num: '2', name: 'Vision & Mission', who: 'Staff, families, students (secondary), community members, board members', how: 'Distribute the Stakeholder Survey to all groups. Conduct at least 2 focus groups with different audiences. Allow 2-3 weeks for survey responses. Synthesize results before drafting statements.', output: 'Stakeholder Survey (DOCX), Focus Group Guide (DOCX)', tip: 'Start here. This is your largest engagement window. Cast a wide net.' },
      { num: '3', name: 'Core Values', who: 'Staff, families, community leaders', how: 'Use the Values Survey to gather input on which values resonate most. Host a values workshop with diverse stakeholders. Share draft values for feedback before finalizing.', output: 'Values Survey, Values Workshop Slides (PPTX)', tip: 'Values must feel authentic. If stakeholders did not help choose them, they will not own them.' },
      { num: '5', name: 'Strategic Domains', who: 'Leadership team, department heads, board', how: 'Facilitate a domain brainstorming session. Use the Prioritization Matrix worksheet to rank domains. Share proposed domains with broader staff for feedback.', output: 'Workshop Guide, Prioritization Matrix (DOCX)', tip: 'This is a leadership engagement moment. Include principals and department leads.' },
      { num: '6', name: 'Goal Setting', who: 'Staff teams, community advisory group', how: 'Host goal-setting workshops by domain area. Use SMART goal criteria. Share draft goals for staff feedback. Present to community advisory group.', output: 'Workshop Slides (PPTX), Goal Alignment Matrix (DOCX)', tip: 'Goals should be informed by the people who will implement them.' },
      { num: '8', name: 'Central Office Alignment', who: 'Department leaders, all staff', how: 'Hold department town halls to share how each department connects to the plan. Use communication templates for consistent messaging. Gather department feedback.', output: 'Dept Comms Template (DOCX), RACI Chart (DOCX)', tip: 'Every employee should know how their work connects to the strategic plan.' },
      { num: '11', name: 'Review & Finalize', who: 'All stakeholders, school board, community', how: 'Present the full plan to the board for adoption. Host community information sessions. Distribute the Community Plan Summary.', output: 'Board Adoption Slides (PPTX), Community Plan (PDF)', tip: 'Close the loop. Share what you heard and how it shaped the plan.' }
    ];

    stages.forEach(function(stage) {
      doc.addPage();
      doc.setTextColor(34, 51, 59);
      doc.setFontSize(16);
      doc.setFont('Helvetica', 'bold');
      doc.text('Stage ' + stage.num + ': ' + stage.name, 20, 30);

      doc.setFontSize(12);
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 180, 204);
      doc.text('Who to engage:', 20, 50);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(stage.who, 20, 60, { maxWidth: 170 });

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 180, 204);
      doc.text('How to engage:', 20, 85);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(stage.how, 20, 95, { maxWidth: 170 });

      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(0, 180, 204);
      doc.text('Tools available:', 20, 135);
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(stage.output, 20, 145, { maxWidth: 170 });

      doc.setFillColor(234, 224, 213);
      doc.roundedRect(20, 165, 170, 25, 3, 3, 'F');
      doc.setFont('Helvetica', 'bold');
      doc.setTextColor(94, 80, 63);
      doc.text('Pro Tip:', 25, 178);
      doc.setFont('Helvetica', 'normal');
      doc.text(stage.tip, 55, 178, { maxWidth: 130 });
    });

    // Tips
    doc.addPage();
    doc.setTextColor(34, 51, 59);
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'bold');
    doc.text('Tips for Effective Engagement', 20, 30);
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'normal');
    var tips = [
      'Meet people where they are. Offer virtual and in-person options.',
      'Provide childcare and food at evening events.',
      'Translate materials into community languages.',
      'Share back what you heard. Stakeholders need to see their input reflected.',
      'Use multiple channels: surveys, focus groups, town halls, school visits.',
      'Set realistic timelines. Rushing engagement undermines trust.',
      'Track participation demographics to ensure diverse representation.',
      'Follow up with participants about how their input shaped decisions.'
    ];
    var tipY = 50;
    tips.forEach(function(tip, i) {
      doc.text((i + 1) + '. ' + tip, 20, tipY, { maxWidth: 170 });
      tipY += 18;
    });

    addHeadersAndFooters(doc, planState);

    var filename = header.districtName.replace(/\s+/g, '_') + '_Stakeholder_Engagement_Playbook.pdf';
    doc.save(filename);
    trackDownload('general', 'PDF', filename);
  }

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  return {
    getBrandColors: getBrandColors,
    getDocumentHeader: getDocumentHeader,
    formatMetric: formatMetric,
    trackDownload: trackDownload,
    getDownloadHistory: getDownloadHistory,

    // Stage 2
    generateVisionMissionPDF: generateVisionMissionPDF,
    generateVisionWorkshopPPTX: generateVisionWorkshopPPTX,
    generateStakeholderSurveyDOCX: generateStakeholderSurveyDOCX,
    generateFocusGroupGuideDOCX: generateFocusGroupGuideDOCX,
    generateBoardVisionPPTX: generateBoardVisionPPTX,

    // Stage 3
    generateValuesReportPDF: generateValuesReportPDF,
    generateValuesWorkshopPPTX: generateValuesWorkshopPPTX,
    generateValuesBehaviorsDOCX: generateValuesBehaviorsDOCX,
    generateStaffCommsDOCX: generateStaffCommsDOCX,
    generateBoardValuesPPTX: generateBoardValuesPPTX,

    // Stage 4
    generateCompetencyReportPDF: generateCompetencyReportPDF,
    generateCompetencyMapDOCX: generateCompetencyMapDOCX,
    generateLeadershipAssessmentDOCX: generateLeadershipAssessmentDOCX,

    // Stage 5
    generateDomainsReportPDF: generateDomainsReportPDF,
    generateDomainsPPTX: generateDomainsPPTX,
    generatePrioritizationMatrixDOCX: generatePrioritizationMatrixDOCX,

    // Stage 6
    generateGoalsReportPDF: generateGoalsReportPDF,
    generateGoalWorkshopPPTX: generateGoalWorkshopPPTX,
    generateGoalAlignmentDOCX: generateGoalAlignmentDOCX,
    generateBoardGoalsPPTX: generateBoardGoalsPPTX,

    // Stage 7
    generateForecastReportPDF: generateForecastReportPDF,
    generateScenarioAnalysisPDF: generateScenarioAnalysisPDF,
    generateBoardForecastPPTX: generateBoardForecastPPTX,

    // Stage 8
    generateAlignmentReportPDF: generateAlignmentReportPDF,
    generateResponsibilityChartDOCX: generateResponsibilityChartDOCX,
    generateDeptCommsTemplateDOCX: generateDeptCommsTemplateDOCX,

    // Stage 9
    generateInitiativesReportPDF: generateInitiativesReportPDF,
    generateInitiativeProposalDOCX: generateInitiativeProposalDOCX,
    generatePrioritizationMatrixPDF: generatePrioritizationMatrixPDF,

    // Stage 10
    generateRoadmapPDF: generateRoadmapPDF,
    generateMilestonePlanDOCX: generateMilestonePlanDOCX,
    generateBoardTimelinePPTX: generateBoardTimelinePPTX,

    // Stage 11
    generateStrategicPlanPDF: generateStrategicPlanPDF,
    generateExecutiveSummaryPDF: generateExecutiveSummaryPDF,
    generateBoardAdoptionPPTX: generateBoardAdoptionPPTX,
    generateCommunityPlanPDF: generateCommunityPlanPDF,
    generateFeasibilityReportPDF: generateFeasibilityReportPDF,

    // Stakeholder Engagement
    generateStakeholderEngagementGuidePDF: generateStakeholderEngagementGuidePDF
  };

})();

// ===========================================================================
// GLOBAL ALIASES - Expose DocumentGenerator methods as globals for HTML onclick
// ===========================================================================

// Stage 2
function generateVisionMissionPDF(ps) { DocumentGenerator.generateVisionMissionPDF(ps); }
function generateVisionWorkshopPPTX(ps) { DocumentGenerator.generateVisionWorkshopPPTX(ps); }
function generateStakeholderSurveyDOCX(ps, topic) { DocumentGenerator.generateStakeholderSurveyDOCX(ps, topic); }
function generateFocusGroupGuideDOCX(ps) { DocumentGenerator.generateFocusGroupGuideDOCX(ps); }
function generateBoardVisionPPTX(ps) { DocumentGenerator.generateBoardVisionPPTX(ps); }

// Stage 3
function generateValuesReportPDF(ps) { DocumentGenerator.generateValuesReportPDF(ps); }
function generateValuesWorkshopPPTX(ps) { DocumentGenerator.generateValuesWorkshopPPTX(ps); }
function generateValuesBehaviorsDOCX(ps) { DocumentGenerator.generateValuesBehaviorsDOCX(ps); }
function generateStaffCommsDOCX(ps) { DocumentGenerator.generateStaffCommsDOCX(ps); }
function generateBoardValuesPPTX(ps) { DocumentGenerator.generateBoardValuesPPTX(ps); }

// Stage 4
function generateCompetencyReportPDF(ps) { DocumentGenerator.generateCompetencyReportPDF(ps); }
function generateCompetencyMapDOCX(ps) { DocumentGenerator.generateCompetencyMapDOCX(ps); }
function generateLeadershipAssessmentDOCX(ps) { DocumentGenerator.generateLeadershipAssessmentDOCX(ps); }

// Stage 5
function generateDomainsReportPDF(ps) { DocumentGenerator.generateDomainsReportPDF(ps); }
function generateDomainsPPTX(ps) { DocumentGenerator.generateDomainsPPTX(ps); }
function generatePrioritizationMatrixDOCX(ps) { DocumentGenerator.generatePrioritizationMatrixDOCX(ps); }

// Stage 6
function generateGoalsReportPDF(ps) { DocumentGenerator.generateGoalsReportPDF(ps); }
function generateGoalWorkshopPPTX(ps) { DocumentGenerator.generateGoalWorkshopPPTX(ps); }
function generateGoalAlignmentDOCX(ps) { DocumentGenerator.generateGoalAlignmentDOCX(ps); }
function generateBoardGoalsPPTX(ps) { DocumentGenerator.generateBoardGoalsPPTX(ps); }

// Stage 7
function generateForecastReportPDF(ps) { DocumentGenerator.generateForecastReportPDF(ps); }
function generateScenarioAnalysisPDF(ps) { DocumentGenerator.generateScenarioAnalysisPDF(ps); }
function generateBoardForecastPPTX(ps) { DocumentGenerator.generateBoardForecastPPTX(ps); }

// Stage 8
function generateAlignmentReportPDF(ps) { DocumentGenerator.generateAlignmentReportPDF(ps); }
function generateResponsibilityChartDOCX(ps) { DocumentGenerator.generateResponsibilityChartDOCX(ps); }
function generateDeptCommsTemplateDOCX(ps, scope) { DocumentGenerator.generateDeptCommsTemplateDOCX(ps, scope); }

// Stage 9
function generateInitiativesReportPDF(ps) { DocumentGenerator.generateInitiativesReportPDF(ps); }
function generateInitiativeProposalDOCX(ps, scope) { DocumentGenerator.generateInitiativeProposalDOCX(ps, scope); }
function generatePrioritizationMatrixPDF(ps) { DocumentGenerator.generatePrioritizationMatrixPDF(ps); }

// Stage 10
function generateRoadmapPDF(ps) { DocumentGenerator.generateRoadmapPDF(ps); }
function generateMilestonePlanDOCX(ps) { DocumentGenerator.generateMilestonePlanDOCX(ps); }
function generateBoardTimelinePPTX(ps) { DocumentGenerator.generateBoardTimelinePPTX(ps); }

// Stage 11
function generateStrategicPlanPDF(ps) { DocumentGenerator.generateStrategicPlanPDF(ps); }
function generateExecutiveSummaryPDF(ps) { DocumentGenerator.generateExecutiveSummaryPDF(ps); }
function generateBoardAdoptionPPTX(ps) { DocumentGenerator.generateBoardAdoptionPPTX(ps); }
function generateCommunityPlanPDF(ps) { DocumentGenerator.generateCommunityPlanPDF(ps); }
function generateFeasibilityReportPDF(ps) { DocumentGenerator.generateFeasibilityReportPDF(ps); }

// Stakeholder Engagement
function generateStakeholderEngagementGuidePDF(ps) { DocumentGenerator.generateStakeholderEngagementGuidePDF(ps); }
