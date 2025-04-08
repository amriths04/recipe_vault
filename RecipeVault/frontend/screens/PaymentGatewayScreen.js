import React, { useState } from "react";
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,TextInput,KeyboardAvoidingView,Platform,TouchableWithoutFeedback,Keyboard,} from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";

const promoCodes = new Map([
  ["SAVE50", 50],
  ["WELCOME30", 30],
  ["FOODIE10", 10],
  ["DISCOUNT20", 20],
]);

export default function PaymentGatewayScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { price = 0 } = route.params || {};

  const [selectedMethod, setSelectedMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCode, setAppliedCode] = useState("");

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const deliveryFee = 20;
  const codFee = selectedMethod === "cod" ? 15 : 0;
  const subtotal = price;
  const total = subtotal + deliveryFee + codFee - discountAmount;

  const handleBack = () => {
    navigation.goBack();
  };

  const handlePayNow = () => {
    alert(`Proceeding to payment of ₹${total}...`);
  };

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

  const handleRemovePromo = () => {
    setDiscountAmount(0);
    setDiscountApplied(false);
    setAppliedCode("");
    setPromoCode("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
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
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.applyButton} onPress={handleApplyPromo}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          )}

          {discountApplied && (
            <TouchableOpacity
              style={styles.removePromoButton}
              onPress={handleRemovePromo}
            >
              <Text style={styles.removePromoText}>✖ Remove Promo Code</Text>
            </TouchableOpacity>
          )}

          {/* Price Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Summary 🧾</Text>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>₹{subtotal}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Income Tax</Text>
              <Text>₹{deliveryFee}</Text>
            </View>
            {selectedMethod === "cod" && (
              <View style={styles.summaryRow}>
                <Text>Cash on Delivery Charge</Text>
                <Text>₹{codFee}</Text>
              </View>
            )}
            {discountApplied && (
              <View style={styles.summaryRow}>
                <Text style={{ color: "green" }}>
                  Code Applied: {appliedCode}
                </Text>
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    marginBottom: 10,
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
  removePromoButton: {
    alignItems: "center",
    marginBottom: 10,
  },
  removePromoText: {
    color: "red",
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
