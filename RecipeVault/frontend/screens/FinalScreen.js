import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as Print from 'expo-print';

const FinalScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { order } = route.params;

  const handlePrint = async () => {
    const statusColor = order.status === 'Completed' ? 'green' : 'orange';

    const html = `
      <html>
        <head>
          <style>
            body {
              font-family: monospace;
              padding: 40px;
              max-width: 700px;
              margin: auto;
              background-color: #ffffff;
              font-size: 14px;
              color: #000;
            }
            .company {
              font-size: 28px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 0;
            }
            .order-id {
              text-align: center;
              font-size: 16px;
              margin-top: 2px;
              margin-bottom: 20px;
            }
            .header-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 15px;
            }
            .status {
              font-size: 18px;
              font-weight: bold;
              color: ${statusColor};
              text-transform: uppercase;
            }
            .label {
              font-weight: bold;
            }
            .ingredients-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            .ingredients-table th, .ingredients-table td {
              border: 1px solid #000;
              padding: 8px;
              text-align: left;
            }
            .ingredients-table th {
              background-color: #f0f0f0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              font-style: italic;
            }
            .line {
              border-top: 1px dashed #000;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="company">🧾 RecipeVault</div>
          <div class="order-id">Order ID: ${order._id}</div>

          <div class="header-row">
            <div><span class="label">Customer ID:</span> ${order.user}</div>
            <div class="status">${order.status}</div>
          </div>

          <div><span class="label">Delivery Address:</span> ${order.deliveryAddress}</div>
          <div><span class="label">Total Price:</span> ₹${order.totalPrice}</div>

          <div class="line"></div>
          <h3>Items Summary</h3>
          <table class="ingredients-table">
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
            </tr>
            ${order.ingredients.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
              </tr>
            `).join('')}
          </table>

          <div class="line"></div>
          <div class="footer">Thank you for ordering from RecipeVault!</div>
        </body>
      </html>
    `;

    try {
      await Print.printAsync({ html });
    } catch (error) {
      console.error("Print error:", error);
      Alert.alert('❌ Print Error', 'Could not generate PDF.');
    }
  };

  const handleGoToLanding = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Landing' }],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.printButton} onPress={handlePrint}>
          <Text style={styles.printText}>🖨️ Generate Printable PDF Receipt</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={handleGoToLanding}>
        <Text style={styles.homeIcon}>🏠</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FinalScreen;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginBottom: 30,
    width: '100%',
  },
  printButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  printText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  homeButton: {
    backgroundColor: '#2ecc71',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 4,
  },
  homeIcon: {
    fontSize: 34,
  },
});
