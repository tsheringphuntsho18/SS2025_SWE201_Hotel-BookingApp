"use client"

import { useState, useEffect } from "react"
import { View, StyleSheet } from "react-native"
import type { Session } from "@supabase/supabase-js"
import { supabase } from "./lib/supabase"
import Auth from "./components/Auth"
import HomeScreen from "./screens/HomeScreen"
import RoomBookingScreen from "./screens/RoomBookingScreen"
import PaymentScreen from "./screens/PaymentScreen"
import type { Hotel, Room } from "./types"

type Screen = "home" | "rooms" | "payment"

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setCurrentScreen("home")
    setSelectedHotel(null)
    setSelectedRoom(null)
  }

  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel)
    setCurrentScreen("rooms")
  }

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room)
    setCurrentScreen("payment")
  }

  const handleBackToHome = () => {
    setCurrentScreen("home")
    setSelectedHotel(null)
    setSelectedRoom(null)
  }

  const handleBackToRooms = () => {
    setCurrentScreen("rooms")
    setSelectedRoom(null)
  }

  const handlePaymentComplete = () => {
    setCurrentScreen("home")
    setSelectedHotel(null)
    setSelectedRoom(null)
  }

  if (!session) {
    return <Auth />
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen onHotelSelect={handleHotelSelect} onSignOut={handleSignOut} />
      case "rooms":
        return selectedHotel ? (
          <RoomBookingScreen hotel={selectedHotel} onRoomSelect={handleRoomSelect} onBack={handleBackToHome} />
        ) : null
      case "payment":
        return selectedHotel && selectedRoom ? (
          <PaymentScreen
            hotel={selectedHotel}
            room={selectedRoom}
            onBack={handleBackToRooms}
            onPaymentComplete={handlePaymentComplete}
          />
        ) : null
      default:
        return null
    }
  }

  return <View style={styles.container}>{renderScreen()}</View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
