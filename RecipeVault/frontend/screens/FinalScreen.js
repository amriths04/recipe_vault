import React from 'react';
import { View, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import * as Print from 'expo-print';

const FinalScreen = () => {
  const route = useRoute();
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="🖨️ Generate Printable PDF Receipt" onPress={handlePrint} />
      </View>
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
  },
  buttonContainer: {
    marginTop: 20,
  },
});
