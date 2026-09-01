import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { DEPOTS, PARTS, filterParts, formatCFA } from "@ge/shared";
import { colors } from "../theme";

export default function StockScreen() {
  const [q, setQ] = useState("");
  const parts = useMemo(() => filterParts(PARTS, { q }), [q]);

  return (
    <View style={styles.phone}>
      <View style={styles.statusbar}>
        <Text style={styles.statusbarText}>08:42</Text>
        <Text style={styles.statusbarText}>Hors-ligne · file 3</Text>
      </View>
      <View style={styles.topbar}>
        <TextInput
          style={styles.search}
          placeholder="Réf., OEM, désignation"
          placeholderTextColor={colors.textMuted}
          value={q}
          onChangeText={setQ}
        />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 20 }}>
        {parts.map((p) => (
          <View style={styles.row} key={p.ref}>
            <View style={styles.rowTop}>
              <Text style={styles.rowName}>{p.nom}</Text>
              <Text style={styles.rowPrice}>{formatCFA(p.pv)}</Text>
            </View>
            <Text style={styles.rowMeta}>
              {p.ref} · {DEPOTS.map((d) => d.short + " " + p.stock[d.id]).join(" · ")}
            </Text>
          </View>
        ))}
      </ScrollView>
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
  },
  search: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 2,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
  },
  body: { flex: 1, paddingHorizontal: 18, paddingTop: 8 },
  row: { paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowTop: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  rowName: { fontSize: 14, fontWeight: "700", color: colors.text, flexShrink: 1 },
  rowPrice: { fontSize: 14, color: colors.text },
  rowMeta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
