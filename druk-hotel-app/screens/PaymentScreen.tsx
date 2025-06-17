"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, ScrollView } from "react-native"
import { supabase } from "../lib/supabase"
import type { Hotel, Room } from "../types"

interface PaymentScreenProps {
  hotel: Hotel
  room: Room
  onBack: () => void
  onPaymentComplete: () => void
}

export default function PaymentScreen({ hotel, room, onBack, onPaymentComplete }: PaymentScreenProps) {
  const [selectedPayment, setSelectedPayment] = useState<"card" | "paypal" | "apple">("card")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [loading, setLoading] = useState(false)

  const nights = 2 // Mock data - in real app, calculate from check-in/out dates
  const totalAmount = room.price_per_night * nights

  async function processPayment() {
    setLoading(true)

    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        Alert.alert("Error", "Please log in to continue")
        return
      }

      // Create booking record
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        hotel_id: hotel.id,
        room_id: room.id,
        check_in_date: new Date().toISOString(),
        check_out_date: new Date(Date.now() + nights * 24 * 60 * 60 * 1000).toISOString(),
        total_amount: totalAmount,
        status: "confirmed",
      })

      if (error) throw error

      Alert.alert("Payment Successful!", `Your booking at ${hotel.name} has been confirmed.`, [
        { text: "OK", onPress: onPaymentComplete },
      ])
    } catch (error) {
      console.error("Payment error:", error)
      Alert.alert("Payment Failed", "Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const PaymentMethod = ({
    type,
    title,
    selected,
    onSelect,
  }: {
    type: "card" | "paypal" | "apple"
    title: string
    selected: boolean
    onSelect: () => void
  }) => (
    <TouchableOpacity style={[styles.paymentMethod, selected && styles.paymentMethodSelected]} onPress={onSelect}>
      <View style={styles.radioButton}>{selected && <View style={styles.radioButtonInner} />}</View>
      <Text style={styles.paymentMethodText}>{title}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.bookingSummary}>
          <Text style={styles.sectionTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Hotel:</Text>
            <Text style={styles.summaryValue}>{hotel.name}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Room:</Text>
            <Text style={styles.summaryValue}>{room.room_type}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nights:</Text>
            <Text style={styles.summaryValue}>{nights}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price per night:</Text>
            <Text style={styles.summaryValue}>${room.price_per_night}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>${totalAmount}</Text>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <PaymentMethod
            type="card"
            title="Credit/Debit Card"
            selected={selectedPayment === "card"}
            onSelect={() => setSelectedPayment("card")}
          />

          <PaymentMethod
            type="paypal"
            title="BoB(BankOfBhutan)"
            selected={selectedPayment === "paypal"}
            onSelect={() => setSelectedPayment("paypal")}
          />

          <PaymentMethod
            type="apple"
            title="BNB(BhutanNationBank)"
            selected={selectedPayment === "apple"}
            onSelect={() => setSelectedPayment("apple")}
          />

          {selectedPayment === "card" && (
            <View style={styles.cardForm}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                maxLength={19}
              />
              <View style={styles.cardRow}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  keyboardType="numeric"
                  maxLength={5}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={processPayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>{loading ? "Processing..." : `Pay $${totalAmount}`}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    paddingVertical: 5,
  },
  backText: {
    fontSize: 16,
    color: "#007AFF",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    textAlign: "center",
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  bookingSummary: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
  paymentSection: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  paymentMethodSelected: {
    backgroundColor: "#f0f8ff",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  paymentMethodText: {
    fontSize: 16,
    color: "#333",
  },
  cardForm: {
    marginTop: 20,
  },
  input: {
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  payButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})
