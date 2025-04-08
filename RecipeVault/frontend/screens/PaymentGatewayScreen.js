import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function PaymentGatewayScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { price = 0 } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const deliveryFee = 20;
  const subtotal = price;
  const total = subtotal + deliveryFee - discountAmount;

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePayNow = () => {
    alert(`Proceeding to payment of ₹${total}...`);
  };

  const handleApplyPromo = () => {
    if (promoCode.trim() !== "") {
      setDiscountApplied(true);
      setDiscountAmount(50);
      alert("Promo code applied!");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose Payment Method 💳</Text>

      {/* UPI Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>UPI</Text>
        <RadioButton.Group
          onValueChange={(value) => setSelectedMethod(value)}
          value={selectedMethod}
        >
          <RadioButton.Item
            label="Pay by any UPI App (Google Pay, PhonePe, Paytm)"
            value="upi"
          />
        </RadioButton.Group>
      </View>

      {/* Cards Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cards</Text>
        <TouchableOpacity
          style={styles.addCardButton}
          onPress={() => setShowCardForm(!showCardForm)}
        >
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
              onChangeText={(text) =>
                setCardDetails({ ...cardDetails, cardNumber: text })
              }
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TextInput
                placeholder="MM/YY"
                style={[styles.input, { flex: 1 }]}
                value={cardDetails.expiry}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, expiry: text })
                }
              />
              <TextInput
                placeholder="CVV"
                style={[styles.input, { flex: 1 }]}
                secureTextEntry
                keyboardType="numeric"
                maxLength={3}
                value={cardDetails.cvv}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, cvv: text })
                }
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
        <RadioButton.Group
          onValueChange={(value) => setSelectedMethod(value)}
          value={selectedMethod}
        >
          <RadioButton.Item label="EMI" value="emi" />
          <RadioButton.Item label="Net Banking" value="netbanking" />
          <RadioButton.Item
            label="Cash on Delivery / Pay on Delivery (₹15 fee)"
            value="cod"
            description="Cash, UPI and Cards accepted"
          />
        </RadioButton.Group>
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
          />
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyPromo}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Price Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Summary 🧾</Text>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>₹{subtotal}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Delivery Charges</Text>
          <Text>₹{deliveryFee}</Text>
        </View>
        {discountApplied && (
          <View style={styles.summaryRow}>
            <Text style={{ color: "green" }}>Promo Discount</Text>
            <Text style={{ color: "green" }}>-₹{discountAmount}</Text>
          </View>
        )}
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalLabel}>₹{total}</Text>
        </View>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
        <Text style={styles.payText}>Pay Now</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Text style={styles.backText}>← Go Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f4f7",
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 16,
    textAlign: "center",
    color: "#007bff",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  addCardButton: {
    paddingVertical: 10,
  },
  addCardText: {
    color: "#007bff",
    fontWeight: "500",
  },
  cardForm: {
    marginTop: 10,
  },
  saveCardButton: {
    marginTop: 10,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveCardButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  promoToggle: {
    textAlign: "center",
    marginTop: 10,
    color: "#007bff",
    fontWeight: "bold",
  },
  promoContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  applyButton: {
    marginLeft: 10,
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  totalLabel: {
    fontWeight: "bold",
    fontSize: 16,
  },
  payButton: {
    backgroundColor: "#ffcc00",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  payText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#007bff",
    alignSelf: "center",
  },
  backText: {
    color: "white",
    fontWeight: "bold",
  },
});
