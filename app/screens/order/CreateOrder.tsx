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

  const [from, setFrom] = useState<Location | null>(null)
  const [to, setTo] = useState<Location | null>(null)
  const [car, setCar] = useState<CarType | null>(null)
  const [isSelecting, setIsSelecting] = useState<'from' | 'to' | null>('from')

  // Markaziy koordinatani saqlaymiz
  const [centerCoord, setCenterCoord] = useState({
    latitude: 41.2995,
    longitude: 69.2401,
  })

  const handleRegionChangeComplete = (newRegion: any) => {
    // Faqat markaziy koordinatani yangilaymiz
    setCenterCoord({
      latitude: newRegion.latitude,
      longitude: newRegion.longitude,
    })
  }

  const handleSetFrom = () => {
    // Markaziy pin koordinatalarini ishlatamiz
    setFrom({
      title: 'Tanlangan joy',
      lat: centerCoord.latitude,
      lng: centerCoord.longitude,
    })
    setIsSelecting('to')
  }

  const handleSetTo = () => {
    // Markaziy pin koordinatalarini ishlatamiz
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

  const handleConfirmLocation = () => {
    if (isSelecting === 'from') {
      handleSetFrom()
    } else if (isSelecting === 'to') {
      handleSetTo()
    }
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
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.customMarkerFrom}>
              <View style={styles.markerCircle}>
                <View style={styles.markerInner} />
              </View>
              <View style={styles.markerPin} />
            </View>
          </Marker>
        )}

        {to && (
          <Marker
            coordinate={{ latitude: to.lat, longitude: to.lng }}
            title="Qayerga"
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.customMarkerTo}>
              <View style={styles.markerCircleTo}>
                <View style={styles.markerInnerTo} />
              </View>
              <View style={styles.markerPinTo} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Markaziy pin */}
      {isSelecting && (
        <View style={styles.centerPinContainer} pointerEvents="none">
          <View style={styles.centerPin}>
            <View style={styles.pinCircle}>
              <View style={styles.pinInner} />
            </View>
            <View style={styles.pinStick} />
          </View>
        </View>
      )}

      {/* Status indicator */}
      {isSelecting && (
        <View style={styles.statusBox}>
          <Text style={styles.statusText}>
            {isSelecting === 'from' 
              ? 'Qayerdan joyni tanlang' 
              : 'Qayerga joyni tanlang'}
          </Text>
        </View>
      )}

      {/* Tasdiqlash tugmasi */}
      {isSelecting && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
        >
          <Text style={styles.confirmButtonText}>✓ Tasdiqlash</Text>
        </TouchableOpacity>
      )}

      {/* Pastki panel */}
      <View style={styles.bottomPanel}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {/* FROM */}
            <TouchableOpacity
              style={[styles.input, from && styles.inputFilled]}
              onPress={handleEditFrom}
            >
              <View style={[styles.inputIcon, from && styles.inputIconActive]}>
                <View style={styles.miniMarkerFrom}>
                  <View style={styles.miniCircle} />
                  <View style={styles.miniPin} />
                </View>
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.label}>Qayerdan</Text>
                <Text style={styles.value}>
                  {from ? from.title : 'Xaritadan tanlang'}
                </Text>
              </View>
              {from && (
                <View style={styles.editButton}>
                  <Text style={styles.editIcon}>✏</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* TO */}
            <TouchableOpacity
              style={[styles.input, to && styles.inputFilled, !from && styles.inputDisabled]}
              onPress={handleEditTo}
              disabled={!from}
            >
              <View style={[styles.inputIcon, to && styles.inputIconActive]}>
                <View style={styles.miniMarkerTo}>
                  <View style={styles.miniCircleTo} />
                  <View style={styles.miniPinTo} />
                </View>
              </View>
              <View style={styles.inputContent}>
                <Text style={styles.label}>Qayerga</Text>
                <Text style={styles.value}>
                  {to ? to.title : 'Xaritadan tanlang'}
                </Text>
              </View>
              {to && (
                <View style={styles.editButton}>
                  <Text style={styles.editIcon}>✏</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* CAR TYPES */}
            {from && to && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mashina turi</Text>

                {CAR_TYPES.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.car, car?.id === item.id && styles.activeCar]}
                    onPress={() => setCar(item)}
                  >
                    <View style={styles.carLeft}>
                      <View style={styles.carIconContainer}>
                        {index === 0 && (
                          <View style={styles.carIconSmall}>
                            <View style={styles.carBody}>
                              <View style={styles.carWindow} />
                            </View>
                            <View style={styles.carWheels}>
                              <View style={styles.wheel} />
                              <View style={styles.wheel} />
                            </View>
                          </View>
                        )}
                        {index === 1 && (
                          <View style={styles.carIconMedium}>
                            <View style={styles.carBodyMedium}>
                              <View style={styles.carCabin} />
                              <View style={styles.carCargo} />
                            </View>
                            <View style={styles.carWheels}>
                              <View style={styles.wheel} />
                              <View style={styles.wheel} />
                            </View>
                          </View>
                        )}
                        {index === 2 && (
                          <View style={styles.carIconLarge}>
                            <View style={styles.carBodyLarge}>
                              <View style={styles.carCabinLarge} />
                              <View style={styles.carCargoLarge} />
                            </View>
                            <View style={styles.carWheelsLarge}>
                              <View style={styles.wheel} />
                              <View style={styles.wheel} />
                              <View style={styles.wheel} />
                            </View>
                          </View>
                        )}
                      </View>
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
                <Text style={styles.orderText}>Mashinani chaqirish</Text>
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

  // Markaziy pin yangi dizayn
  centerPinContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.15,
  },

  centerPin: {
    alignItems: 'center',
  },

  pinCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#facc15',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },

  pinInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#000',
  },

  pinStick: {
    width: 3,
    height: 24,
    backgroundColor: '#facc15',
    marginTop: -2,
  },

  // Marker dizayni - "from"
  customMarkerFrom: {
    alignItems: 'center',
  },

  markerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },

  markerInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  markerPin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#10b981',
    marginTop: -3,
  },

  // Marker dizayni - "to"
  customMarkerTo: {
    alignItems: 'center',
  },

  markerCircleTo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },

  markerInnerTo: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },

  markerPinTo: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ef4444',
    marginTop: -3,
  },

  // Mini markerlar inputlar uchun
  miniMarkerFrom: {
    alignItems: 'center',
  },

  miniCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },

  miniPin: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#10b981',
    marginTop: -2,
  },

  miniMarkerTo: {
    alignItems: 'center',
  },

  miniCircleTo: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#fff',
  },

  miniPinTo: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#ef4444',
    marginTop: -2,
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
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  statusText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '700',
  },

  confirmButton: {
    position: 'absolute',
    bottom: height * 0.65,
    left: '50%',
    marginLeft: -80,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
    borderWidth: 2,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
  },

  inputFilled: {
    backgroundColor: '#1f2937',
    borderColor: '#facc15',
  },

  inputDisabled: {
    opacity: 0.5,
  },

  inputIcon: {
    width: 44,
    height: 44,
    backgroundColor: '#3a3a3a',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  inputIconActive: {
    backgroundColor: '#2d3748',
  },

  inputContent: {
    flex: 1,
  },

  label: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },

  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  editButton: {
    width: 32,
    height: 32,
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  editIcon: {
    fontSize: 16,
    color: '#facc15',
  },

  section: {
    marginTop: 20,
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 16,
  },

  car: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
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

  carIconContainer: {
    width: 48,
    height: 32,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Kichik mashina (Labo)
  carIconSmall: {
    width: 40,
    height: 28,
  },

  carBody: {
    width: 40,
    height: 20,
    backgroundColor: '#fff',
    borderRadius: 6,
    position: 'relative',
  },

  carWindow: {
    width: 16,
    height: 10,
    backgroundColor: '#666',
    position: 'absolute',
    top: 2,
    left: 4,
    borderRadius: 3,
  },

  carWheels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginTop: -4,
  },

  wheel: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#666',
  },

  // O'rta mashina (Gazel)
  carIconMedium: {
    width: 44,
    height: 28,
  },

  carBodyMedium: {
    flexDirection: 'row',
    height: 20,
  },

  carCabin: {
    width: 14,
    height: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },

  carCargo: {
    width: 26,
    height: 20,
    backgroundColor: '#ddd',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    marginLeft: 2,
  },

  // Katta mashina (Fura)
  carIconLarge: {
    width: 48,
    height: 28,
  },

  carBodyLarge: {
    flexDirection: 'row',
    height: 20,
  },

  carCabinLarge: {
    width: 12,
    height: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },

  carCargoLarge: {
    width: 32,
    height: 20,
    backgroundColor: '#ddd',
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    marginLeft: 2,
  },

  carWheelsLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: -4,
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
    shadowColor: '#facc15',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  orderText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '800',
  },
})