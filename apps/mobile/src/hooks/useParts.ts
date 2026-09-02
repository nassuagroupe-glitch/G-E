import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import type { Part } from "@ge/shared";
import { db } from "../firebase";

/** Live catalogue + stock, mirroring the web app's parts Firestore listener. */
export function useParts(): { parts: Part[]; loading: boolean } {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(
    () =>
      onSnapshot(
        collection(db, "parts"),
        (snap) => {
          setParts(snap.docs.map((d) => d.data() as Part));
          setLoading(false);
        },
        (err) => {
          console.error("Firestore listener failed for parts:", err);
          setLoading(false);
        }
      ),
    []
  );

  return { parts, loading };
}
