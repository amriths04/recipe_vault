import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { AuthContext } from "../context/AuthContext";
import { fetchUserOrders } from "../services/orderService";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function OngoingOrdersScreen() {
  const { token } = useContext(AuthContext);
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const ordersData = await fetchUserOrders(token);
        setOrders(ordersData);
      } catch (error) {
        // console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  const toggleExpand = (orderId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrderId(orderId === expandedOrderId ? null : orderId);
  };

  const renderOrderItem = ({ item }) => {
    const isExpanded = expandedOrderId === item._id;

    return (
      <TouchableOpacity onPress={() => toggleExpand(item._id)} activeOpacity={0.8}>
        <View style={[styles.orderCard, isDarkMode && styles.darkCard]}>
          <Text style={[styles.orderTitle, isDarkMode && styles.darkText]}>
            Order #{item._id.slice(-6).toUpperCase()}
          </Text>
          <Text style={[styles.orderDetails, isDarkMode && styles.darkText]}>
            Total: ${item.totalPrice} |{" "}
            <Text style={[styles.statusBadge, { color: getStatusColor(item.status) }]}>
              {item.status}
            </Text>
          </Text>

          {isExpanded && (
            <View style={styles.expandedSection}>
              <Text style={[styles.expandedTitle, isDarkMode && styles.darkText]}>Items:</Text>

              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, styles.cellName, isDarkMode && styles.darkText]}>
                  Name
                </Text>
                <Text style={[styles.tableCell, styles.cellQty, isDarkMode && styles.darkText]}>
                  Qty
                </Text>
                <Text style={[styles.tableCell, styles.cellRate, isDarkMode && styles.darkText]}>
                  Rate
                </Text>
              </View>

              {item.ingredients?.map((ingredient, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={[styles.tableCell, styles.cellName, isDarkMode && styles.darkText]}>
                    {ingredient.name}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellQty, isDarkMode && styles.darkText]}>
                    {ingredient.quantity || "-"}
                  </Text>
                  <Text style={[styles.tableCell, styles.cellRate, isDarkMode && styles.darkText]}>
                    ₹{ingredient.price || "-"}
                  </Text>
                </View>
              ))}

              <Text style={[styles.deliveryText, isDarkMode && styles.darkText]}>
                📍 Delivering to: {item.deliveryAddress || "N/A"}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#e67e22";
      case "Shipped":
        return "#3498db";
      case "Delivered":
        return "#2ecc71";
      case "Cancelled":
        return "#e74c3c";
      default:
        return "gray";
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <ActivityIndicator size="large" color={isDarkMode ? "white" : "black"} />
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.title, isDarkMode && styles.darkText]}>Ongoing Orders 🚚</Text>
      <Text style={[styles.subtitle, isDarkMode && styles.darkText]}>Your orders are on the way!</Text>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>🛒 No orders found</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 30,
    paddingHorizontal: 16,
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: "gray",
  },
  darkText: {
    color: "white",
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 5,
  },
  darkCard: {
    backgroundColor: "#2c2c2c",
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  orderDetails: {
    fontSize: 14,
    color: "gray",
  },
  statusBadge: {
    fontWeight: "bold",
  },
  expandedSection: {
    marginTop: 12,
  },
  expandedTitle: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 15,
  },
  tableHeader: {
    flexDirection: "row",
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  tableCell: {
    fontSize: 13,
  },
  cellName: {
    flex: 2,
  },
  cellQty: {
    flex: 1,
  },
  cellRate: {
    flex: 1,
  },
  cellTotal: {
    flex: 1,
  },
  deliveryText: {
    marginTop: 10,
    fontStyle: "italic",
    fontSize: 13,
  },
  emptyState: {
    marginTop: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
  },
});
