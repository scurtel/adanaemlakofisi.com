import { SERVICES } from "@/lib/constants";
import styles from "./Services.module.css";

export default function Services() {
  return (
    <section className="section section-alt" aria-labelledby="services-title">
      <div className="container">
        <h2 id="services-title" className="section-title">
          Hizmetlerimiz
        </h2>
        <p className="section-subtitle">
          Konut, ticari gayrimenkul ve yatırım süreçlerinde şeffaf danışmanlık hizmeti.
        </p>
        <div className={`grid-3 ${styles.grid}`}>
          {SERVICES.map((service) => (
            <article key={service.title} className={styles.card}>
              <div className={styles.icon} aria-hidden="true" />
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
