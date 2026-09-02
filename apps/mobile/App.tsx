import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AuthProvider, useAuth } from "./src/auth/AuthProvider";
import LoginScreen from "./src/screens/LoginScreen";
import PosScreen from "./src/screens/PosScreen";
import StockScreen from "./src/screens/StockScreen";
import { colors } from "./src/theme";

type Tab = "pos" | "stock";

function MainApp() {
  const { user, staff, loading, missingStaffDoc, signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("pos");

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </SafeAreaView>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (missingStaffDoc) {
    return (
      <SafeAreaView style={[styles.container, styles.centered]}>
        <Text style={styles.missingStaffText}>
          Compte connecté mais aucune fiche employé associée. Contactez la direction.
        </Text>
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutBtnText}>Se déconnecter</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
        <TouchableOpacity
          style={styles.signOutIcon}
          onPress={() =>
            Alert.alert("Déconnexion", "Se déconnecter de la caisse ?", [
              { text: "Annuler", style: "cancel" },
              { text: "Se déconnecter", style: "destructive", onPress: signOut },
            ])
          }
        >
          <Text style={styles.signOutIconText}>{staff?.nom?.[0] ?? "?"}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.screen}>{tab === "pos" ? <PosScreen /> : <StockScreen />}</View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  centered: { alignItems: "center", justifyContent: "center", padding: 24, gap: 16 },
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
  signOutIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  signOutIconText: { fontSize: 14, fontWeight: "700", color: colors.text },
  screen: { flex: 1, margin: 10, marginTop: 0, borderRadius: 22, overflow: "hidden" },
  missingStaffText: { fontSize: 15, color: colors.text, textAlign: "center" },
  signOutBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
  },
  signOutBtnText: { color: colors.bg, fontSize: 14, fontWeight: "700" },
});
