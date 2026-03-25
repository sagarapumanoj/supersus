import React, { useState, useEffect } from "react";
import html2pdf from "html2pdf.js";
import "./Letter.css"; // rename CSS file accordingly

const Letter = () => {
  const [form, setForm] = useState({
    recipient: "",
    college: "",
    name: "",
    rollno: "",
    phone: "",
    department: "",
    subject: "",
    fromDate: "",
    toDate: "",
    reason: ""
  });

  const [preview, setPreview] = useState("");
  const [toast, setToast] = useState({ message: "", type: "" });
  const [disableDownload, setDisableDownload] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setForm(f => ({ ...f, fromDate: today, toDate: today }));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm({ ...form, [id]: value });
  };

  const capitalize = (str) => str.replace(/\b\w/g, c => c.toUpperCase());

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const generateLetter = () => {
    const { recipient, college, name, rollno, phone, department, subject, fromDate, toDate, reason } = form;

    if (!recipient || !college || !name || !rollno || !phone || !department || !subject || !fromDate || !toDate || !reason) {
      showToast("⚠ Please fill all required fields", "error");
      return;
    }

    if (new Date(toDate) < new Date(fromDate)) {
      showToast("⚠ To Date cannot be earlier than From Date", "error");
      return;
    }

    const recipientTitle = recipient === "hod" ? "Head of Department" : "Warden";

    const letterContent = `
      <div class="letter-header">
        <p>Date: ${formatDate(new Date())}</p>
      </div>
      <div>
        <p>To,<br>The ${recipientTitle}<br>${department}<br>${college}</p>
        <p style="margin-top: 15px;"><strong>Subject: ${capitalize(subject)}</strong></p>
        <p style="margin-top: 25px;">Respected Sir/Madam,</p>
        <p style="margin-top: 15px; text-align: justify;">
          I, <strong>${capitalize(name)}</strong>, Roll No: <strong>${rollno}</strong>, from the Department of ${department}, would like to bring to your kind attention that ${reason}.
        </p>
        <p style="margin-top: 15px; text-align: justify;">
          I request your permission for the period from <strong>${formatDate(fromDate)}</strong> to <strong>${formatDate(toDate)}</strong>. I assure you that I will complete all pending work responsibly.
        </p>
        <p style="margin-top: 15px;">I kindly request you to grant me permission. Thank you.</p>
      </div>
      <div class="letter-footer">
        <p>Yours faithfully,</p>
        <p><strong>${capitalize(name)}</strong></p>
        <p>Roll No: ${rollno}</p>
        <p>Department of ${department}</p>
        <p>Contact: ${phone}</p>
      </div>
    `;

    setPreview(letterContent);
    setDisableDownload(false);
    showToast("✅ Letter generated successfully!");
  };

  const downloadLetter = () => {
    const element = document.getElementById("letterPreview");
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: "FormalLetter.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
      })
      .save()
      .then(() => showToast("📄 Letter downloaded!"));
  };

  return (
    <div className="container">
      <header>
        <h1>Formal Letter Generator</h1>
        <p className="subtitle">Create professional letters for college authorities</p>
      </header>

      <section className="form-section">
        <h2>Enter Letter Details</h2>

        <div className="form-group">
          <label htmlFor="recipient">Recipient <span className="required">*</span></label>
          <select id="recipient" value={form.recipient} onChange={handleChange}>
            <option value="">Select Recipient</option>
            <option value="hod">Head of Department (HOD)</option>
            <option value="warden">Warden</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="college">College/Hostel Name <span className="required">*</span></label>
          <input type="text" id="college" value={form.college} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="name">Your Full Name <span className="required">*</span></label>
          <input type="text" id="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="rollno">Roll Number <span className="required">*</span></label>
          <input type="text" id="rollno" value={form.rollno} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number <span className="required">*</span></label>
          <input type="tel" id="phone" value={form.phone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department/Course <span className="required">*</span></label>
          <input type="text" id="department" value={form.department} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject of Letter <span className="required">*</span></label>
          <input type="text" id="subject" value={form.subject} onChange={handleChange} />
        </div>

        <div className="form-group date-range">
          <div>
            <label htmlFor="fromDate">From Date <span className="required">*</span></label>
            <input type="date" id="fromDate" value={form.fromDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} />
          </div>
          <div>
            <label htmlFor="toDate">To Date <span className="required">*</span></label>
            <input type="date" id="toDate" value={form.toDate} onChange={handleChange} min={form.fromDate} />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="reason">Reason <span className="required">*</span></label>
          <textarea id="reason" rows="4" value={form.reason} onChange={handleChange}></textarea>
        </div>

        <div className="buttons">
          <button onClick={generateLetter}>Generate Letter</button>
          <button onClick={downloadLetter} className="btn-download" disabled={disableDownload}>
            Download PDF
          </button>
        </div>
      </section>

      <section className="preview-section">
        <h2>Letter Preview</h2>
        <div className="letter-preview" id="letterPreview" dangerouslySetInnerHTML={{ __html: preview || "<p>Your letter will appear here after you click 'Generate Letter'.</p>" }}></div>
      </section>

      {toast.message && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
};

export default Letter;
