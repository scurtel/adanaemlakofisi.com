import Link from "next/link";
import styles from "./BlogContent.module.css";

export default function BlogContent({ content }: { content: string }) {
  const blocks = content.split("\n\n");

  return (
    <div className={styles.content}>
      {blocks.map((block, i) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("## ")) {
          return <h2 key={i}>{trimmed.replace(/^##\s+/, "")}</h2>;
        }
        if (trimmed.startsWith("### ")) {
          return <h3 key={i}>{trimmed.replace(/^###\s+/, "")}</h3>;
        }

        const withLinks = trimmed.replace(
          /(\/(?:satilik|kiralik|iletisim|blog|hizmetler)[^\s)*]*)/g,
          (match) => `__LINK__${match}__LINK__`
        );

        const parts = withLinks.split("__LINK__");
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith("/") ? (
                <Link key={j} href={part.split(/[\s,;.]/)[0]}>
                  {part.split(/[\s,;.]/)[0]}
                </Link>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}
