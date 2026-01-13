const editor = document.getElementById("editor");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");

const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const resetFormatBtn = document.getElementById("resetFormatBtn");

const upperBtn = document.getElementById("upperBtn");
const lowerBtn = document.getElementById("lowerBtn");
const capWordsBtn = document.getElementById("capWordsBtn");
const capSentBtn = document.getElementById("capSentBtn");

const darkToggle = document.getElementById("darkToggle");

const saveDocBtn = document.getElementById("saveDocBtn");
const pdfBtn = document.getElementById("pdfBtn");

const copyHtmlBtn = document.getElementById("copyHtmlBtn");
const copySocialBtn = document.getElementById("copySocialBtn");
const copyBtn = document.getElementById("copyBtn");

const fontUpBtn = document.getElementById("fontUp");
const fontDownBtn = document.getElementById("fontDown");
const fontSizeLabel = document.getElementById("fontSizeLabel");

// Storage keys
const STORAGE_KEY = "duvofs_text_content";
const DARK_KEY = "duvofs_dark";
const FONT_SIZE_KEY = "duvofs_font_size";

const MIN_FONT = 10;
const MAX_FONT = 32;

/* =====================================================
   LOAD SAVED CONTENT FIRST
===================================================== */
editor.innerHTML = localStorage.getItem(STORAGE_KEY) || "";

/* =====================================================
   FONT SIZE HANDLING
===================================================== */
let fontSize =
  parseInt(localStorage.getItem(FONT_SIZE_KEY), 10) ||
  parseInt(window.getComputedStyle(editor).fontSize, 10);

fontSize = Math.min(Math.max(fontSize, MIN_FONT), MAX_FONT);
applyFontSize();

fontUpBtn.onclick = () => {
  if (fontSize < MAX_FONT) {
    fontSize++;
    applyFontSize();
  }
};

fontDownBtn.onclick = () => {
  if (fontSize > MIN_FONT) {
    fontSize--;
    applyFontSize();
  }
};

function applyFontSize() {
  editor.style.fontSize = fontSize + "px";
  fontSizeLabel.textContent = fontSize + "px";
  localStorage.setItem(FONT_SIZE_KEY, fontSize);
}

/* =====================================================
   COUNT & AUTOSAVE
===================================================== */
function updateCounts() {
  const text = editor.innerText;
  charCount.textContent = text.length;
  wordCount.textContent = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;
  localStorage.setItem(STORAGE_KEY, editor.innerHTML);
}

editor.addEventListener("input", updateCounts);
updateCounts();

/* =====================================================
   FORMAT APPLY (selection or entire)
===================================================== */
function applyFormat(cmd, tagName) {
  const sel = window.getSelection();
  if (sel && sel.toString()) {
    // execCommand auto wraps into <b>/<i>/<u>
    document.execCommand(cmd);
  } else {
    // Wrap entire content
    editor.innerHTML = `<${tagName}>${editor.innerHTML}</${tagName}>`;
  }
  updateCounts();
  editor.focus();
}

// Convert execCommand tags to <strong>/<em>/<u>
function normalizeTags() {
  editor.innerHTML = editor.innerHTML
    .replace(/<b>/gi, "<strong>")
    .replace(/<\/b>/gi, "</strong>")
    .replace(/<i>/gi, "<em>")
    .replace(/<\/i>/gi, "</em>");
}

boldBtn.onclick = () => {
  applyFormat("bold", "strong");
  normalizeTags();
};

italicBtn.onclick = () => {
  applyFormat("italic", "em");
  normalizeTags();
};

underlineBtn.onclick = () => {
  applyFormat("underline", "u");
  normalizeTags();
};

/* =====================================================
   RESET FORMATTING
===================================================== */
resetFormatBtn.onclick = () => {
  editor.innerText = editor.innerText;
  updateCounts();
};

/* =====================================================
   TEXT TRANSFORMERS
===================================================== */
function transformText(fn) {
  const sel = window.getSelection();
  if (sel && sel.toString()) {
    const range = sel.getRangeAt(0);
    const span = document.createElement("span");
    span.textContent = fn(sel.toString());
    range.deleteContents();
    range.insertNode(span);
  } else {
    editor.innerText = fn(editor.innerText);
  }
  updateCounts();
}

upperBtn.onclick = () => transformText(t => t.toUpperCase());
lowerBtn.onclick = () => transformText(t => t.toLowerCase());
capWordsBtn.onclick = () =>
  transformText(t => t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()));
capSentBtn.onclick = () =>
  transformText(t =>
    t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
  );

/* =====================================================
   DARK MODE
===================================================== */
if (localStorage.getItem(DARK_KEY) === "on") {
  document.documentElement.classList.add("dark");
  darkToggle.textContent = "☀️";
}

darkToggle.onclick = () => {
  document.documentElement.classList.toggle("dark");
  const on = document.documentElement.classList.contains("dark");
  localStorage.setItem(DARK_KEY, on ? "on" : "off");
  darkToggle.textContent = on ? "☀️" : "🌙";
};

/* =====================================================
   COPY TEXT (plain)
===================================================== */
copyBtn.onclick = () => {
  navigator.clipboard.writeText(editor.innerText);
  copyBtn.textContent = "Copied!";
  setTimeout(() => (copyBtn.textContent = "Copy Text"), 900);
};

/* =====================================================
   COPY HTML (with <strong>/<em>/<u>)
===================================================== */
copyHtmlBtn.onclick = async () => {
  const html = editor.innerHTML;
  const text = editor.innerText;

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/html": new Blob([html], { type: "text/html" }),
        "text/plain": new Blob([text], { type: "text/plain" })
      })
    ]);
    copyHtmlBtn.textContent = "Copied!";
  } catch {
    editor.focus();
    document.execCommand("copy");
  }
  setTimeout(() => (copyHtmlBtn.textContent = "Copy HTML"), 900);
};

/* =====================================================
   UNICODE MAPS FOR SOCIAL COPY
===================================================== */
const unicodeMaps = {
  bold: {},
  italic: {},
  boldItalic: {}
};

// Fill maps
(function initMaps() {
  const boldStart = 0x1D400;      // A
  const italicStart = 0x1D434;
  const boldItalicStart = 0x1D468;

  for (let i = 0; i < 26; i++) {
    const upper = String.fromCharCode(65 + i);
    const lower = String.fromCharCode(97 + i);

    unicodeMaps.bold[upper] = String.fromCodePoint(boldStart + i);
    unicodeMaps.bold[lower] = String.fromCodePoint(boldStart + 26 + i);

    unicodeMaps.italic[upper] = String.fromCodePoint(italicStart + i);
    unicodeMaps.italic[lower] = String.fromCodePoint(italicStart + 26 + i);

    unicodeMaps.boldItalic[upper] = String.fromCodePoint(boldItalicStart + i);
    unicodeMaps.boldItalic[lower] = String.fromCodePoint(boldItalicStart + 26 + i);
  }
})();

/* =====================================================
   SOCIAL COPY (Unicode Bold/Italic/BoldItalic)
===================================================== */
function convertSocial(node) {
  let result = "";

  node.childNodes.forEach(n => {
    if (n.nodeType === 3) {
      result += n.nodeValue;
      return;
    }

    const tag = n.nodeName.toLowerCase();
    const inner = convertSocial(n);

    const hasStrong = n.closest("strong,b") !== null;
    const hasEm = n.closest("em,i") !== null;

    if (hasStrong && hasEm) {
      result += [...inner].map(ch => unicodeMaps.boldItalic[ch] || ch).join("");
    } else if (hasStrong) {
      result += [...inner].map(ch => unicodeMaps.bold[ch] || ch).join("");
    } else if (hasEm) {
      result += [...inner].map(ch => unicodeMaps.italic[ch] || ch).join("");
    } else {
      result += inner;
    }
  });

  return result;
}

copySocialBtn.onclick = () => {
  const styled = convertSocial(editor);
  navigator.clipboard.writeText(styled);
  copySocialBtn.textContent = "Copied!";
  setTimeout(() => (copySocialBtn.textContent = "Copy Social"), 900);
};

/* =====================================================
   EXPORT DOCX
===================================================== */
saveDocBtn.onclick = () => {
  const html = `<html><body>${editor.innerHTML}</body></html>`;
  const blob = window.htmlDocx.asBlob(html);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `duvofs-${Date.now()}.docx`;
  a.click();
};

/* =====================================================
   EXPORT PDF
===================================================== */
pdfBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(doc.splitTextToSize(editor.innerText || " ", 180), 10, 10);
  doc.save(`duvofs-${Date.now()}.pdf`);
};

/* =====================================================
   SHORTCUTS
===================================================== */
document.addEventListener("keydown", e => {
  if (!e.ctrlKey) return;
  if (e.key === "b") { e.preventDefault(); boldBtn.click(); }
  if (e.key === "i") { e.preventDefault(); italicBtn.click(); }
  if (e.key === "u") { e.preventDefault(); underlineBtn.click(); }
});
