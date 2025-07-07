"use client"

import { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import CounterItem from "./CounterItem"

const GuestCounter = () => {
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)
  const [pets, setPets] = useState(0)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Number of guests</Text>

      <CounterItem
        title="Adult"
        subtitle="Ages 13 or above"
        count={adults}
        onDecrement={() => setAdults(Math.max(0, adults - 1))}
        onIncrement={() => setAdults(adults + 1)}
      />

      <CounterItem
        title="Children"
        subtitle="Ages 2-12"
        count={children}
        onDecrement={() => setChildren(Math.max(0, children - 1))}
        onIncrement={() => setChildren(children + 1)}
      />

      <CounterItem
        title="Infants"
        subtitle="Under 2"
        count={infants}
        onDecrement={() => setInfants(Math.max(0, infants - 1))}
        onIncrement={() => setInfants(infants + 1)}
      />

      <CounterItem
        title="Pets"
        count={pets}
        onDecrement={() => setPets(Math.max(0, pets - 1))}
        onIncrement={() => setPets(pets + 1)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
})

export default GuestCounter
