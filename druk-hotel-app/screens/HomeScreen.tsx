"use client"
// This file is part of the Supabase React Native example app.
// It is used to display a list of hotels fetched from the Supabase database.
// The code includes a HomeScreen component that fetches hotel data and displays it in a list.

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView } from "react-native"
import { supabase } from "../lib/supabase"
import type { Hotel } from "../types"

interface HomeScreenProps {
  onHotelSelect: (hotel: Hotel) => void
  onSignOut: () => void
}

export default function HomeScreen({ onHotelSelect, onSignOut }: HomeScreenProps) {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHotels()
  }, [])

  async function fetchHotels() {
    try {
      const { data, error } = await supabase.from("hotels").select("*").order("rating", { ascending: false })

      if (error) throw error
      setHotels(data || [])
    } catch (error) {
      console.error("Error fetching hotels:", error)
      setHotels([]) 
    } finally {
      setLoading(false)
    }
  }

  const renderHotel = ({ item }: { item: Hotel }) => (
    <TouchableOpacity style={styles.hotelCard} onPress={() => onHotelSelect(item)}>
      <Image source={{ uri: item.image_url }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <Text style={styles.hotelLocation}>{item.location}</Text>
        <Text style={styles.hotelDescription}>{item.description}</Text>
        <View style={styles.hotelFooter}>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
          <Text style={styles.price}>Nu.{item.price_per_night}/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hotels</Text>
        <TouchableOpacity onPress={onSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={hotels}
        renderItem={renderHotel}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
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
    paddingVertical: 30,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  signOutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#ff4444",
    borderRadius: 6,
  },
  signOutText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  listContainer: {
    padding: 20,
  },
  hotelCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  hotelLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  hotelDescription: {
    fontSize: 14,
    color: "#888",
    marginBottom: 10,
  },
  hotelFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
  },
})
