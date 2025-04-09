import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { fetchAllOrders } from "../services/orderService";

export default function OngoingOrdersScreen() {
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const ordersData = await fetchAllOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color={isDarkMode ? "white" : "black"} />
      </View>
    );
  }

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderCard, isDarkMode && styles.darkCard]}>
      <Text style={[styles.orderTitle, isDarkMode && styles.darkText]}>Order #{item._id}</Text>
      <Text style={[styles.orderDetails, isDarkMode && styles.darkText]}>Total Price: ${item.totalPrice}</Text>
      <Text style={[styles.orderDetails, isDarkMode && styles.darkText]}>Status: {item.status}</Text>
    </View>
  );

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Ongoing Orders 🚚</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>Your orders are on the way!</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.ordersList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingTop: 30,
    paddingBottom: 20,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    color: "gray",
  },
  darkText: {
    color: "white",
  },
  ordersList: {
    width: "100%",
    padding: 10,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: "#333",
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  orderDetails: {
    fontSize: 14,
    color: "gray",
  },
});
