export interface FaqItem {
  question: string;
  answer: string;
}

/** Blog içeriğindeki "## Sık Sorulan Sorular" bölümünden FAQ çıkarır. */
export function parseFaqsFromContent(content: string): FaqItem[] {
  const marker = "## Sık Sorulan Sorular";
  const idx = content.indexOf(marker);
  if (idx === -1) return [];

  const section = content.slice(idx + marker.length);
  const blocks = section.split("\n\n").map((b) => b.trim()).filter(Boolean);
  const faqs: FaqItem[] = [];
  let currentQuestion: string | null = null;
  let answerParts: string[] = [];

  for (const block of blocks) {
    if (block.startsWith("## ") && !block.startsWith("### ")) break;
    if (block.startsWith("### ")) {
      if (currentQuestion && answerParts.length > 0) {
        faqs.push({ question: currentQuestion, answer: answerParts.join("\n\n") });
      }
      currentQuestion = block.replace(/^###\s+/, "").trim();
      answerParts = [];
    } else if (currentQuestion) {
      answerParts.push(block);
    }
  }

  if (currentQuestion && answerParts.length > 0) {
    faqs.push({ question: currentQuestion, answer: answerParts.join("\n\n") });
  }

  return faqs;
}
