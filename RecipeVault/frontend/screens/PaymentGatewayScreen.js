import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Pressable,
  Alert,
  Image
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const promoCodes = new Map([
  ["SAVE50", 50],
  ["WELCOME30", 30],
  ["FOODIE10", 10],
  ["DISCOUNT20", 20],
]);

export default function PaymentGatewayScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useContext(AuthContext);
  console.log(route.params);
  const userId = user?._id;

  const { calculatedIngredients, totalAmount, recipeIds } = route.params || {};


  const [selectedMethod, setSelectedMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const [showQRModal, setShowQRModal] = useState(false);

  const deliveryFee = 20;
  const codFee = selectedMethod === "cod" ? 15 : 0;  // COD fee if selected
  const subtotal = totalAmount;
  const total = subtotal + deliveryFee + codFee - discountAmount;

  const handleBack = () => {
    navigation.goBack();
  };
  const orderData = {
    ingredients: calculatedIngredients,  // Use it directly as it is
    totalAmount: totalAmount,
    recipeIds: recipeIds,
    userId: userId,  // Assuming userId is available from the useContext
    deliveryAddress: deliveryAddress,
  };
  if (!userId) {
    Alert.alert("Error", "User not logged in.");
    return;
  }
  
  console.log("Order data: ", orderData);

  const handlePayNow = async () => {
    const { userId, ingredients, totalAmount, recipeIds, deliveryAddress } = orderData;
    if (!userId || !deliveryAddress || !ingredients || !totalAmount || !recipeIds) {
      Alert.alert("Error", "Missing required fields in the order data.");
      return;
    }
  
    Alert.alert("Payment Successful", "Your payment was processed successfully.", [
      {
        text: "PAY DONE",
        onPress: async () => {
          try {
            // Prepare the data to send to the backend
            const orderPayload = {
              userId,
              deliveryAddress: deliveryAddress ,  // Default to empty string if not provided
              ingredients: ingredients,
              totalPrice: totalAmount,
              recipeIds: recipeIds,  // Ensure this is an array of valid recipe IDs
            };
  
            const response = await fetch('http://192.168.0.170:5000/api/orders/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(orderPayload),
            });
  
            const result = await response.json();
  
            // Handle the response
            if (response.ok) {
              Alert.alert("Order Placed", "Your order has been placed successfully.");
              navigation.navigate("Final");  // Navigate to the final screen if needed
            } else {
              Alert.alert("Error", result.message || "Failed to place order.");
            }
          } catch (err) {
            console.error("Order error:", err);
            Alert.alert("Error", err.message || "Failed to place order.");
          }
        },
      },
    ]);
  };
  

  // Apply promo code logic
  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();

    if (discountApplied) {
      alert("You’ve already applied a promo code.");
      return;
    }

    if (promoCodes.has(code)) {
      const discount = promoCodes.get(code);
      setDiscountAmount(discount);
      setDiscountApplied(true);
      setAppliedCode(code);
      alert(`Promo code "${code}" applied! You saved ₹${discount}`);
    } else {
      alert("Invalid promo code. Please try again.");
    }
  };

  // Remove promo code logic
  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setDiscountApplied(false);
    setAppliedCode("");
    setPromoCode("");
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Choose Payment Method 💳</Text>

          {/* UPI Payment Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UPI</Text>
            <RadioButton.Group
              onValueChange={(value) => {
                setSelectedMethod(value);
                if (value === "upi") setShowQRModal(true);
              }}
              value={selectedMethod}
            >
              <RadioButton.Item label="Pay by any UPI App (Google Pay, PhonePe, Paytm)" value="upi" />
            </RadioButton.Group>
          </View>

          {/* QR Modal for UPI */}
          <Modal animationType="fade" transparent={true} visible={showQRModal} onRequestClose={() => setShowQRModal(false)}>
            <Pressable style={styles.modalOverlay} onPress={() => setShowQRModal(false)}>
              <View style={styles.modalContainer}>
                {/* Display the QR image */}
                <Image
                  source={require("../assets/QR.png")}  // Make sure the image is placed inside the assets folder
                  style={styles.qrImage}
                />
              </View>
            </Pressable>
          </Modal>

          {/* Credit/Debit Card Payment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cards</Text>
            <TouchableOpacity style={styles.addCardButton} onPress={() => setShowCardForm(!showCardForm)}>
              <Text style={styles.addCardText}>
                {showCardForm ? "Hide Card Form" : "+ Add a new credit or debit card"}
              </Text>
            </TouchableOpacity>

            {showCardForm && (
              <View style={styles.cardForm}>
                <TextInput
                  placeholder="Card Number"
                  style={styles.input}
                  keyboardType="numeric"
                  maxLength={16}
                  value={cardDetails.cardNumber}
                  onChangeText={(text) => setCardDetails({ ...cardDetails, cardNumber: text })}
                />
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TextInput
                    placeholder="MM/YY"
                    style={[styles.input, { flex: 1 }]}
                    value={cardDetails.expiry}
                    onChangeText={(text) => setCardDetails({ ...cardDetails, expiry: text })}
                  />
                  <TextInput
                    placeholder="CVV"
                    style={[styles.input, { flex: 1 }]}
                    secureTextEntry
                    keyboardType="numeric"
                    maxLength={3}
                    value={cardDetails.cvv}
                    onChangeText={(text) => setCardDetails({ ...cardDetails, cvv: text })}
                  />
                </View>
                <TouchableOpacity
                  style={styles.saveCardButton}
                  onPress={() => {
                    alert("Card saved!");
                    setShowCardForm(false);
                  }}
                >
                  <Text style={styles.saveCardButtonText}>Save Card</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Other Payment Methods */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Ways to Pay</Text>
            <RadioButton.Group onValueChange={setSelectedMethod} value={selectedMethod}>
              <RadioButton.Item label="EMI" value="emi" />
              <RadioButton.Item label="Net Banking" value="netbanking" />
              <RadioButton.Item
                label="Cash on Delivery / Pay on Delivery (₹15 fee)"
                value="cod"
                description="Cash, UPI and Cards accepted"
              />
            </RadioButton.Group>
          </View>
          <View style={styles.section}>
  <Text style={styles.sectionTitle}>Delivery Address</Text>
  <TextInput
    placeholder="Enter your delivery address"
    style={styles.input}
    value={deliveryAddress}
    onChangeText={(text) => setDeliveryAddress(text)}
    multiline
    numberOfLines={4}
  />
</View>

          {/* Promo Code Section */}
          <TouchableOpacity onPress={() => setShowPromoInput(!showPromoInput)}>
            <Text style={styles.promoToggle}>
              {showPromoInput ? "Hide" : "Add"} Gift Card or Promo Code
            </Text>
          </TouchableOpacity>

          {showPromoInput && (
            <View style={styles.promoContainer}>
              <TextInput
                placeholder="Enter Code"
                style={styles.input}
                value={promoCode}
                onChangeText={setPromoCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyPromo}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Discount Info */}
          {discountApplied && (
            <View style={styles.discountInfo}>
              <Text style={styles.discountText}>Applied Code: {appliedCode}</Text>
              <Text style={styles.discountText}>Discount: ₹{discountAmount}</Text>
              <TouchableOpacity style={styles.removePromoButton} onPress={handleRemovePromo}>
                <Text style={styles.removePromoText}>Remove Promo</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Total Price and Payment Button */}
          <View style={styles.summary}>
            <Text style={styles.totalText}>Total: ₹{total}</Text>
            <TouchableOpacity style={styles.paymentButton} onPress={handlePayNow}>
              <Text style={styles.paymentButtonText}>Pay Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  qrImage: {
    width: 300,
    height: 350,
    alignSelf: "center",
    marginVertical: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "black",
    padding: 0,
    borderRadius: 8,
    alignItems: "center",
  },
  addCardButton: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  addCardText: {
    textAlign: "center",
    fontSize: 16,
  },
  cardForm: {
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  saveCardButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
  },
  saveCardButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  promoToggle: {
    color: "#007BFF",
    fontWeight: "600",
    textAlign: "center",
  },
  promoContainer: {
    marginTop: 10,
  },
  applyButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  discountInfo: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
  },
  discountText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  removePromoButton: {
    backgroundColor: "#DC3545",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
  },
  removePromoText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  summary: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  paymentButton: {
    backgroundColor: "#28A745",
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
  },
  paymentButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
