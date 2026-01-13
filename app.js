const editor = document.getElementById("editor");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const darkToggle = document.getElementById("darkToggle");

const copyBtn = document.getElementById("copyBtn");
const boldBtn = document.getElementById("boldBtn");
const italicBtn = document.getElementById("italicBtn");
const underlineBtn = document.getElementById("underlineBtn");
const resetFormatBtn = document.getElementById("resetFormatBtn");
const upperBtn = document.getElementById("upperBtn");
const lowerBtn = document.getElementById("lowerBtn");
const capWordsBtn = document.getElementById("capWordsBtn");
const capSentenceBtn = document.getElementById("capSentenceBtn");
const saveDocBtn = document.getElementById("saveDocBtn");
const pdfBtn = document.getElementById("pdfBtn");

const fontUpBtn = document.getElementById("fontUp");
const fontDownBtn = document.getElementById("fontDown");
const fontSizeLabel = document.getElementById("fontSizeLabel");

const STORAGE_KEY = "duvofs_text_makeover";
const DARK_KEY = "duvofs_dark_mode";
const FONT_SIZE_KEY = "duvofs_font_size";

const MIN_FONT = 10;
const MAX_FONT = 24;

/* =========================
   LOAD SAVED CONTENT FIRST
========================= */
editor.innerHTML = localStorage.getItem(STORAGE_KEY) || "";

/* =========================
   FONT SIZE CONTROLS
========================= */
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

/* =========================
   COUNT + AUTOSAVE
========================= */
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

/* =========================
   UNICODE STYLE MAPS
========================= */
const unicodeMaps = {
  bold: {
    a: "𝐚", b: "𝐛", c: "𝐜", d: "𝐝", e: "𝐞", f: "𝐟", g: "𝐠", h: "𝐡", i: "𝐢", j: "𝐣",
    k: "𝐤", l: "𝐥", m: "𝐦", n: "𝐧", o: "𝐨", p: "𝐩", q: "𝐪", r: "𝐫", s: "𝐬", t: "𝐭",
    u: "𝐮", v: "𝐯", w: "𝐰", x: "𝐱", y: "𝐲", z: "𝐳",
    A: "𝐀", B: "𝐁", C: "𝐂", D: "𝐃", E: "𝐄", F: "𝐅", G: "𝐆", H: "𝐇", I: "𝐈", J: "𝐉",
    K: "𝐊", L: "𝐋", M: "𝐌", N: "𝐍", O: "𝐎", P: "𝐏", Q: "𝐐", R: "𝐑", S: "𝐒", T: "𝐓",
    U: "𝐔", V: "𝐕", W: "𝐖", X: "𝐗", Y: "𝐘", Z: "𝐙"
  },
  italic: {
    a: "𝑎", b: "𝑏", c: "𝑐", d: "𝑑", e: "𝑒", f: "𝑓", g: "𝑔", h: "ℎ", i: "𝑖", j: "𝑗",
    k: "𝑘", l: "𝑙", m: "𝑚", n: "𝑛", o: "𝑜", p: "𝑝", q: "𝑞", r: "𝑟", s: "𝑠", t: "𝑡",
    u: "𝑢", v: "𝑣", w: "𝑤", x: "𝑥", y: "𝑦", z: "𝑧",
    A: "𝐴", B: "𝐵", C: "𝐶", D: "𝐷", E: "𝐸", F: "𝐹", G: "𝐺", H: "𝐻", I: "𝐼", J: "𝐽",
    K: "𝐾", L: "𝐿", M: "𝑀", N: "𝑁", O: "𝑂", P: "𝑃", Q: "𝑄", R: "𝑅", S: "𝑆", T: "𝑇",
    U: "𝑈", V: "𝑉", W: "𝑊", X: "𝑋", Y: "𝑌", Z: "𝑍"
  }
   unicodeMaps.boldItalic = {
  a: "𝒂", b: "𝒃", c: "𝒄", d: "𝒅", e: "𝒆", f: "𝒇", g: "𝒈", h: "𝒉", i: "𝒊", j: "𝒋",
  k: "𝒌", l: "𝒍", m: "𝒎", n: "𝒏", o: "𝒐", p: "𝒑", q: "𝒒", r: "𝒓", s: "𝒔", t: "𝒕",
  u: "𝒖", v: "𝒗", w: "𝒘", x: "𝒙", y: "𝒚", z: "𝒛",
  A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮", H: "𝑯", I: "𝑰", J: "𝑱",
  K: "𝑲", L: "𝑳", M: "𝑴", N: "𝑵", O: "𝑶", P: "𝑷", Q: "𝑸", R: "𝑹", S: "𝑺", T: "𝑻",
  U: "𝑼", V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁"
};

// Convert nodes to social text
function convertToUnicodeSocial(element) {
  let result = "";

  element.childNodes.forEach(node => {
    if (node.nodeType === 3) {
      result += node.nodeValue;
      return;
    }

    const tag = node.nodeName;
    const child = convertToUnicodeSocial(node);

    // Combined formatting (bold + italic)
    if ((tag === "B" || tag === "STRONG") && hasItalic(node)) {
      result += [...child].map(ch => unicodeMaps.boldItalic[ch] || ch).join("");
      return;
    }

    if ((tag === "I" || tag === "EM") && hasBold(node)) {
      result += [...child].map(ch => unicodeMaps.boldItalic[ch] || ch).join("");
      return;
    }

    // Bold only
    if (tag === "B" || tag === "STRONG") {
      result += [...child].map(ch => unicodeMaps.bold[ch] || ch).join("");
      return;
    }

    // Italic only
    if (tag === "I" || tag === "EM") {
      result += [...child].map(ch => unicodeMaps.italic[ch] || ch).join("");
      return;
    }

    result += child;
  });

  return result;
}

// Helpers to detect nested styles
function hasBold(node) {
  return node.closest("b, strong") !== null;
}

function hasItalic(node) {
  return node.closest("i, em") !== null;
}

/* =========================
   COPY TEXT
========================= */
/* =========================
   COPY HTML (keeps formatting)
========================= */
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
  setTimeout(() => (copyHtmlBtn.textContent = "Copy HTML"), 1000);
};

/* =========================
   COPY SOCIAL (unicode style)
========================= */
copySocialBtn.onclick = () => {
  const socialText = convertToUnicodeSocial(editor);
  navigator.clipboard.writeText(socialText);
  copySocialBtn.textContent = "Copied!";
  setTimeout(() => (copySocialBtn.textContent = "Copy Social"), 1000);
};

/* =========================
   FORMAT (SELECTION OR ALL)
========================= */
function applyFormat(command) {
  const selection = window.getSelection();

  if (selection && selection.toString()) {
    document.execCommand(command);
  } else {
    const range = document.createRange();
    range.selectNodeContents(editor);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand(command);
    selection.removeAllRanges();
  }

  editor.focus();
}

boldBtn.onclick = () => applyFormat("bold");
italicBtn.onclick = () => applyFormat("italic");
underlineBtn.onclick = () => applyFormat("underline");

/* =========================
   RESET FORMAT
========================= */
resetFormatBtn.onclick = () => {
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    document.execCommand("removeFormat");
  } else {
    editor.innerText = editor.innerText;
  }
  updateCounts();
};

/* =========================
   TEXT TRANSFORM
========================= */
function transformText(fn) {
  const selection = window.getSelection();
  if (selection && selection.toString()) {
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.textContent = fn(selection.toString());
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
capSentenceBtn.onclick = () =>
  transformText(t =>
    t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase())
  );

/* =========================
   EXPORTS
========================= */
saveDocBtn.onclick = () => {
  const html = `<html><body>${editor.innerHTML}</body></html>`;
  const blob = window.htmlDocx.asBlob(html);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `duvofs-notepad-${Date.now()}.docx`;
  a.click();
};

pdfBtn.onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text(doc.splitTextToSize(editor.innerText || " ", 180), 10, 10);
  doc.save(`duvofs-notepad-${Date.now()}.pdf`);
};

/* =========================
   DARK MODE
========================= */
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

/* =========================
   SHORTCUTS
========================= */
document.addEventListener("keydown", e => {
  if (!e.ctrlKey) return;
  if (e.key === "b") { e.preventDefault(); applyFormat("bold"); }
  if (e.key === "i") { e.preventDefault(); applyFormat("italic"); }
  if (e.key === "u") { e.preventDefault(); applyFormat("underline"); }
});

/* =========================
   SERVICE WORKER
========================= */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
