"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { DISTRICTS } from "@/lib/constants";
import styles from "./SearchBox.module.css";

interface SearchBoxProps {
  defaultType?: "satilik" | "kiralik" | "";
  compact?: boolean;
}

export default function SearchBox({ defaultType = "", compact = false }: SearchBoxProps) {
  const router = useRouter();
  const [district, setDistrict] = useState("");
  const [type, setType] = useState(defaultType);
  const [propertyType, setPropertyType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (district) params.set("ilce", district);
    if (propertyType) params.set("tip", propertyType);
    if (minPrice) params.set("min", minPrice);
    if (maxPrice) params.set("max", maxPrice);

    const basePath = type === "kiralik" ? "/kiralik" : "/satilik";
    const query = params.toString();
    router.push(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <form
      className={`${styles.form} ${compact ? styles.compact : ""}`}
      onSubmit={handleSubmit}
      role="search"
      aria-label="İlan arama"
    >
      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="search-district">İlçe</label>
          <select
            id="search-district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          >
            <option value="">Tüm İlçeler</option>
            {DISTRICTS.map((d) => (
              <option key={d.slug} value={d.name}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="search-type">İlan Tipi</label>
          <select
            id="search-type"
            value={type}
            onChange={(e) => setType(e.target.value as "" | "satilik" | "kiralik")}
          >
            <option value="">Tümü</option>
            <option value="satilik">Satılık</option>
            <option value="kiralik">Kiralık</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="search-property">Emlak Tipi</label>
          <select
            id="search-property"
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option value="">Tümü</option>
            <option value="daire">Daire</option>
            <option value="villa">Villa</option>
            <option value="arsa">Arsa</option>
            <option value="is-yeri">İş Yeri</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="search-min">Min Fiyat (₺)</label>
          <input
            id="search-min"
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            min={0}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="search-max">Max Fiyat (₺)</label>
          <input
            id="search-max"
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            min={0}
          />
        </div>
      </div>

      <button type="submit" className={`btn btn-primary ${styles.submit}`}>
        İlan Ara
      </button>
    </form>
  );
}
