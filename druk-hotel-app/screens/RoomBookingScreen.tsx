"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, SafeAreaView } from "react-native"
import { supabase } from "../lib/supabase"
import type { Hotel, Room } from "../types"

interface RoomBookingScreenProps {
  hotel: Hotel
  onRoomSelect: (room: Room) => void
  onBack: () => void
}

export default function RoomBookingScreen({ hotel, onRoomSelect, onBack }: RoomBookingScreenProps) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    try {
      const { data, error } = await supabase.from("rooms").select("*").eq("hotel_id", hotel.id).eq("available", true)

      if (error) throw error
      setRooms(data || [])
    } catch (error) {
      console.error("Error fetching rooms:", error)
      // Mock data for demo
      setRooms([
        {
          id: "1",
          hotel_id: hotel.id,
          room_type: "Standard Room",
          description: "Comfortable room with city view",
          price_per_night: hotel.price_per_night,
          available: true,
          image_url: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "2",
          hotel_id: hotel.id,
          room_type: "Deluxe Suite",
          description: "Spacious suite with premium amenities",
          price_per_night: hotel.price_per_night + 100,
          available: true,
          image_url: "/placeholder.svg?height=200&width=300",
        },
        {
          id: "3",
          hotel_id: hotel.id,
          room_type: "Presidential Suite",
          description: "Luxury suite with panoramic views",
          price_per_night: hotel.price_per_night + 300,
          available: true,
          image_url: "/placeholder.svg?height=200&width=300",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity style={styles.roomCard} onPress={() => onRoomSelect(item)}>
      <Image source={{ uri: item.image_url }} style={styles.roomImage} />
      <View style={styles.roomInfo}>
        <Text style={styles.roomType}>{item.room_type}</Text>
        <Text style={styles.roomDescription}>{item.description}</Text>
        <View style={styles.roomFooter}>
          <Text style={styles.price}>${item.price_per_night}/night</Text>
          <View style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{hotel.name}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.hotelInfo}>
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
        <Text style={styles.availableRooms}>Available Rooms</Text>
      </View>

      <FlatList
        data={rooms}
        renderItem={renderRoom}
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
  hotelInfo: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  hotelLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  availableRooms: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    padding: 20,
  },
  roomCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  roomInfo: {
    padding: 15,
  },
  roomType: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  roomDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  roomFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
  },
  bookButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
})
