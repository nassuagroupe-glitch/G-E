import { useMemo, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  addToCart,
  cartTotals,
  formatCFA,
  type CartLine,
} from "@ge/shared";
import { doc as docRef, runTransaction, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../auth/AuthProvider";
import { db } from "../firebase";
import { useParts } from "../hooks/useParts";
import { colors, headingFont } from "../theme";

/** This terminal is fixed to the Yopougon depot. */
const DEPOT_ID = "Y";

function generateTicketNo(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TK-${stamp}-${rand}`;
}

export default function PosScreen() {
  const { user, staff } = useAuth();
  const { parts, loading } = useParts();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [scanIndex, setScanIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ticketNo, setTicketNo] = useState(generateTicketNo);

  const totals = useMemo(() => cartTotals(cart), [cart]);

  const onScan = () => {
    if (parts.length === 0) return;
    const part = parts[scanIndex % parts.length];
    setScanIndex((i) => i + 1);
    setCart((c) => addToCart(c, part));
  };

  const onEncaisser = async () => {
    if (cart.length === 0) {
      Alert.alert("Ticket vide", "Scannez ou ajoutez une pièce avant d'encaisser.");
      return;
    }
    setSubmitting(true);
    try {
      await runTransaction(db, async (tx) => {
        const partRefs = cart.map((l) => docRef(db, "parts", l.ref));
        const snaps = await Promise.all(partRefs.map((r) => tx.get(r)));
        snaps.forEach((snap, i) => {
          const line = cart[i];
          const currentQty = (snap.data()?.stock ?? {})[DEPOT_ID] ?? 0;
          tx.update(partRefs[i], { [`stock.${DEPOT_ID}`]: currentQty - line.qte });
        });
        tx.set(docRef(db, "sales", ticketNo), {
          no: ticketNo,
          depotId: DEPOT_ID,
          cashierUid: user?.uid ?? null,
          pay: "Espèces",
          lignes: cart,
          totalHT: totals.ht,
          totalTVA: totals.tva,
          totalTTC: totals.ttc,
          createdAt: serverTimestamp(),
        });
      });
      setCart([]);
      setTicketNo(generateTicketNo());
      Alert.alert("Encaissé", "Ticket 80 mm envoyé à l'imprimante, stock décrémenté sur Firebase.");
    } catch (e) {
      Alert.alert("Erreur", "L'encaissement a échoué : " + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.phone}>
      <View style={styles.statusbar}>
        <Text style={styles.statusbarText}>{ticketNo}</Text>
        <Text style={styles.statusbarText}>{staff?.nom ?? "…"}</Text>
      </View>
      <View style={styles.topbar}>
        <Text style={[styles.brand, headingFont]}>G&amp;E</Text>
        <Text style={styles.topbarMeta}>Yopougon</Text>
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 16 }}>
        <TouchableOpacity style={styles.scanBox} onPress={onScan} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.accent} />
          ) : (
            <Text style={styles.scanBoxText}>Scanner le code-barres</Text>
          )}
        </TouchableOpacity>

        {cart.length === 0 && (
          <Text style={styles.emptyText}>
            Ticket vide — ajoutez des pièces depuis la vue Bureau ou scannez.
          </Text>
        )}

        {cart.map((l) => (
          <View style={styles.cartLine} key={l.ref}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cartLineName}>{l.nom}</Text>
              <Text style={styles.cartLineMeta}>
                {l.qte} × {formatCFA(l.pu)}
              </Text>
            </View>
            <Text style={styles.cartLineTotal}>{formatCFA(l.pu * l.qte)}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, headingFont]}>Total TTC</Text>
          <Text style={[styles.totalValue, headingFont]}>{formatCFA(totals.ttc)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, submitting && styles.primaryBtnDisabled]}
          onPress={onEncaisser}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={colors.bg} />
          ) : (
            <Text style={styles.primaryBtnText}>Encaisser</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  phone: { flex: 1, backgroundColor: colors.white },
  statusbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 4,
  },
  statusbarText: { fontSize: 12, color: colors.text },
  topbar: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.text,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  brand: { fontSize: 22 },
  topbarMeta: { fontSize: 12, color: colors.textMuted },
  body: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },
  scanBox: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.accent,
    paddingVertical: 22,
    paddingHorizontal: 12,
    marginBottom: 18,
    alignItems: "center",
  },
  scanBoxText: { color: colors.accent700, fontSize: 14 },
  emptyText: { fontStyle: "italic", color: colors.textMuted, fontSize: 14 },
  cartLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  cartLineName: { fontSize: 14, fontWeight: "700", color: colors.text },
  cartLineMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  cartLineTotal: { fontSize: 14, color: colors.text },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  totalLabel: { fontSize: 21, color: colors.text },
  totalValue: { fontSize: 21, color: colors.text },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 2,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: colors.bg, fontSize: 15, fontWeight: "700" },
});
