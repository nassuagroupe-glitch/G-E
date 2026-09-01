import { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PosScreen from "./src/screens/PosScreen";
import StockScreen from "./src/screens/StockScreen";
import { colors } from "./src/theme";

type Tab = "pos" | "stock";

export default function App() {
  const [tab, setTab] = useState<Tab>("pos");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "pos" && styles.tabBtnActive]}
          onPress={() => setTab("pos")}
        >
          <Text style={[styles.tabLabel, tab === "pos" && styles.tabLabelActive]}>
            Vente comptoir
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "stock" && styles.tabBtnActive]}
          onPress={() => setTab("stock")}
        >
          <Text style={[styles.tabLabel, tab === "stock" && styles.tabLabelActive]}>
            Stock
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.screen}>{tab === "pos" ? <PosScreen /> : <StockScreen />}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: "row", padding: 10, gap: 8 },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.divider,
  },
  tabBtnActive: { backgroundColor: colors.accent700, borderColor: colors.accent700 },
  tabLabel: { fontSize: 13, color: colors.text },
  tabLabelActive: { color: colors.white, fontWeight: "700" },
  screen: { flex: 1, margin: 10, marginTop: 0, borderRadius: 22, overflow: "hidden" },
});
