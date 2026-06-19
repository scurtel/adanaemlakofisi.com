import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./BlogContent.module.css";

const INTERNAL_LINK_RE =
  /(\/(?:satilik|kiralik|iletisim|blog|hizmetler|adana\/[a-z0-9-]+|blog\/[a-z0-9-]+)[^\s)*]*)/g;

function renderInlineLinks(text: string) {
  const withMarkers = text.replace(INTERNAL_LINK_RE, (match) => `__LINK__${match}__LINK__`);
  const parts = withMarkers.split("__LINK__");
  return parts.map((part, j) => {
    if (part.startsWith("/")) {
      const href = part.split(/[\s,;.)]/)[0];
      return (
        <Link key={j} href={href}>
          {href}
        </Link>
      );
    }
    return <span key={j}>{part}</span>;
  });
}

function parseTableRow(line: string): string[] {
  return line
    .split("|")
    .map((c) => c.trim())
    .filter((c, i, arr) => !(i === 0 && c === "") && !(i === arr.length - 1 && c === ""));
}

function isTableSeparator(line: string): boolean {
  return /^\|[\s\-:|]+\|$/.test(line.trim());
}

function renderTable(lines: string[], key: number) {
  const rows = lines.filter((l) => !isTableSeparator(l)).map(parseTableRow);
  if (rows.length === 0) return null;
  const [header, ...body] = rows;
  return (
    <div key={key} className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <th key={i}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BlogContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: ReactNode[] = [];
  let i = 0;
  let blockIndex = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Markdown table block
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const table = renderTable(tableLines, blockIndex++);
      if (table) elements.push(table);
      continue;
    }

    if (trimmed.startsWith("## ")) {
      elements.push(<h2 key={blockIndex++}>{trimmed.replace(/^##\s+/, "")}</h2>);
      i++;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      elements.push(<h3 key={blockIndex++}>{trimmed.replace(/^###\s+/, "")}</h3>);
      i++;
      continue;
    }

    // Paragraph: collect consecutive non-empty, non-heading, non-table lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("## ") &&
      !lines[i].trim().startsWith("### ") &&
      !lines[i].trim().startsWith("|")
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    const para = paraLines.join(" ");
    elements.push(<p key={blockIndex++}>{renderInlineLinks(para)}</p>);
  }

  return <div className={styles.content}>{elements}</div>;
}
