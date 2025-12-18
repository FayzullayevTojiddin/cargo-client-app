import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import MapView, { Marker } from 'react-native-maps'

const { height } = Dimensions.get('window')

type Location = {
  title: string
  lat: number
  lng: number
}

type CarType = {
  id: string
  name: string
  price: number
}

const CAR_TYPES: CarType[] = [
  { id: '1', name: 'Labo', price: 50000 },
  { id: '2', name: 'Gazel', price: 90000 },
  { id: '3', name: 'Fura', price: 180000 },
]

// Dark mode xarita stili
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#212121' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#212121' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#757575' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#181818' }] },
  { featureType: 'road', elementType: 'geometry.fill', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8a8a' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#373737' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c3c3c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#000000' }] },
]

export default function CreateOrder() {
  const router = useRouter()
  const mapRef = useRef<MapView>(null)

  const [region] = useState({
    latitude: 41.2995,
    longitude: 69.2401,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })

  const [centerCoord, setCenterCoord] = useState({
    latitude: 41.2995,
    longitude: 69.2401,
  })

  const [from, setFrom] = useState<Location | null>(null)
  const [to, setTo] = useState<Location | null>(null)
  const [car, setCar] = useState<CarType | null>(null)
  const [isSelecting, setIsSelecting] = useState<'from' | 'to' | null>('from')

  const handleRegionChangeComplete = (newRegion: any) => {
    setCenterCoord({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    })

    // Auto tanlash
    if (isSelecting === 'from' && !from) {
      setFrom({
        title: 'Tanlangan joy',
        lat: newRegion.latitude,
        lng: newRegion.longitude,
      })
      setIsSelecting('to')
    } else if (isSelecting === 'to' && from && !to) {
      setTo({
        title: 'Manzil',
        lat: newRegion.latitude,
        lng: newRegion.longitude,
      })
      setIsSelecting(null)
    }
  }

  const handleSetFrom = () => {
    setFrom({
      title: 'Tanlangan joy',
      lat: centerCoord.latitude,
      lng: centerCoord.longitude,
    })
    setIsSelecting('to')
  }

  const handleSetTo = () => {
    setTo({
      title: 'Manzil',
      lat: centerCoord.latitude,
      lng: centerCoord.longitude,
    })
    setIsSelecting(null)
  }

  const handleEditFrom = () => {
    setFrom(null)
    setTo(null)
    setCar(null)
    setIsSelecting('from')
  }

  const handleEditTo = () => {
    setTo(null)
    setCar(null)
    setIsSelecting('to')
  }

  return (
    <View style={styles.container}>
      {/* Xarita */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        customMapStyle={darkMapStyle}
        onRegionChangeComplete={handleRegionChangeComplete}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {from && (
          <Marker
            coordinate={{ latitude: from.lat, longitude: from.lng }}
            title="Qayerdan"
          >
            <Text style={styles.markerText}>📍</Text>
          </Marker>
        )}

        {to && (
          <Marker
            coordinate={{ latitude: to.lat, longitude: to.lng }}
            title="Qayerga"
          >
            <Text style={styles.markerText}>🏁</Text>
          </Marker>
        )}
      </MapView>

      {/* Markaziy pin */}
      <View style={styles.centerPin} pointerEvents="none">
        <Text style={styles.pinEmoji}>📍</Text>
        <View style={styles.pinShadow} />
      </View>

      {/* Status indicator */}
      {isSelecting && (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            {isSelecting === 'from' 
              ? '📍 Qayerdan joyni tanlang' 
              : '🏁 Qayerga joyni tanlang'}
          </Text>
        </View>
      )}

      {/* Pastki panel */}
      <View style={styles.bottomPanel}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* FROM */}
            <TouchableOpacity
              style={[styles.input, from && styles.inputFilled]}
              onPress={from ? handleEditFrom : handleSetFrom}
            >
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>📍</Text>
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.label}>Qayerdan</Text>
                <Text style={styles.value}>
                  {from ? from.title : 'Xaritadan tanlang'}
                </Text>
              </View>
              {from && (
                <Text style={styles.editIcon}>✏️</Text>
              )}
            </TouchableOpacity>

            {/* TO */}
            <TouchableOpacity
              style={[styles.input, to && styles.inputFilled]}
              onPress={to ? handleEditTo : handleSetTo}
              disabled={!from}
            >
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>🏁</Text>
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.label}>Qayerga</Text>
                <Text style={styles.value}>
                  {to ? to.title : 'Xaritadan tanlang'}
                </Text>
              </View>
              {to && (
                <Text style={styles.editIcon}>✏️</Text>
              )}
            </TouchableOpacity>

            {/* CAR TYPES */}
            {from && to && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mashina turi</Text>

                {CAR_TYPES.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.car, car?.id === item.id && styles.activeCar]}
                    onPress={() => setCar(item)}
                  >
                    <View style={styles.carLeft}>
                      <Text style={styles.carEmoji}>
                        {item.id === '1' ? '🚐' : item.id === '2' ? '🚚' : '🚛'}
                      </Text>
                      <Text style={styles.carName}>{item.name}</Text>
                    </View>
                    <Text style={styles.carPrice}>
                      {item.price.toLocaleString()} so'm
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* ORDER BUTTON */}
            {from && to && car && (
              <TouchableOpacity
                style={styles.orderBtn}
                onPress={() =>
                  router.push({
                    pathname: '/screens/order/ActiveOrder',
                    params: {
                      from: JSON.stringify(from),
                      to: JSON.stringify(to),
                      car: JSON.stringify(car),
                    },
                  })
                }
              >
                <Text style={styles.orderText}>🚚 Mashinani chaqirish</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  map: {
    ...StyleSheet.absoluteFillObject,
  },

  centerPin: {
    position: 'absolute',
    top: height * 0.3,
    left: '50%',
    marginLeft: -20,
    zIndex: 1,
    alignItems: 'center',
  },

  pinEmoji: {
    fontSize: 40,
  },

  pinShadow: {
    width: 20,
    height: 8,
    backgroundColor: '#000',
    opacity: 0.3,
    borderRadius: 10,
    marginTop: 4,
  },

  markerText: {
    fontSize: 32,
  },

  statusBox: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#facc15',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  statusText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },

  editIcon: {
    fontSize: 20,
  },

  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.6,
    paddingTop: 8,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputFilled: {
    backgroundColor: '#1f2937',
    borderColor: '#facc15',
  },

  inputIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  iconText: {
    fontSize: 20,
  },

  inputContent: {
    flex: 1,
  },

  label: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },

  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 14,
  },

  car: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#333',
  },

  activeCar: {
    borderColor: '#facc15',
    backgroundColor: '#2a2510',
  },

  carLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  carEmoji: {
    fontSize: 24,
    marginRight: 12,
  },

  carName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },

  carPrice: {
    color: '#facc15',
    fontWeight: '700',
    fontSize: 15,
  },

  orderBtn: {
    marginTop: 24,
    backgroundColor: '#facc15',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },

  orderText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '800',
  },
})