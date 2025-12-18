import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import MapView, { Marker, Polyline } from 'react-native-maps'

const { height, width } = Dimensions.get('window')

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

export default function ActiveOrder() {
  const params = useLocalSearchParams()
  const router = useRouter()
  const mapRef = useRef<MapView>(null)
  
  const [from, setFrom] = useState<Location | null>(null)
  const [to, setTo] = useState<Location | null>(null)
  const [car, setCar] = useState<CarType | null>(null)
  const [driverLocation, setDriverLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [status, setStatus] = useState<'searching' | 'found' | 'arriving' | 'arrived'>('searching')
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([])
  const [driverRouteCoordinates, setDriverRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([])
  
  const pulseAnim = useRef(new Animated.Value(1)).current
  const fadeAnim = useRef(new Animated.Value(0)).current

  const decodePolyline = (encoded: string) => {
    const points: Array<{ latitude: number; longitude: number }> = []
    let index = 0
    let lat = 0
    let lng = 0

    while (index < encoded.length) {
      let b
      let shift = 0
      let result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lat += dlat

      shift = 0
      result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lng += dlng

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      })
    }
    return points
  }

  const fetchRoute = async (origin: Location, destination: Location) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`

    const res = await fetch(url)
    const data = await res.json()

    if (data.routes?.length) {
      setRouteCoordinates(
        data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          })
        )
      )
    }
  }

  const fetchDriverRoute = async (
    driverLoc: { latitude: number; longitude: number },
    fromLoc: Location
  ) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${driverLoc.longitude},${driverLoc.latitude};${fromLoc.lng},${fromLoc.lat}?overview=full&geometries=geojson`

    const res = await fetch(url)
    const data = await res.json()

    if (data.routes?.length) {
      setDriverRouteCoordinates(
        data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => ({
            latitude: lat,
            longitude: lng,
          })
        )
      )
    }
  }

  useEffect(() => {
  // Pulse animation for searching
    if (status === 'searching') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }

    const searchTimer = setTimeout(() => {
      setStatus('found')
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()

      if (from) {
        const initialDriverLoc = {
          latitude: from.lat - 0.005,
          longitude: from.lng + 0.003,
        }
        setDriverLocation(initialDriverLoc)
        fetchDriverRoute(initialDriverLoc, from)
      }
    }, 3000)

    return () => clearTimeout(searchTimer)
  }, [status, from, pulseAnim, fadeAnim])

  useEffect(() => {
    // Pulse animation for searching
    if (status === 'searching') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start()
    }

    // Simulate driver search
    const searchTimer = setTimeout(() => {
      setStatus('found')
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
      
      // Set initial driver location
      if (from) {
        const initialDriverLoc = {
          latitude: from.lat - 0.005,
          longitude: from.lng + 0.003,
        }
        setDriverLocation(initialDriverLoc)
        
        // Fetch driver route
        fetchDriverRoute(initialDriverLoc, from)
      }
    }, 3000)

    return () => clearTimeout(searchTimer)
  }, [status, from, pulseAnim, fadeAnim])

  useEffect(() => {
    // Simulate driver movement along route
    if (status !== 'found' || !driverRouteCoordinates.length || !from) return

    let currentIndex = 0

    const moveTimer = setInterval(() => {
      if (currentIndex >= driverRouteCoordinates.length - 1) {
        setStatus('arrived')
        clearInterval(moveTimer)
        return
      }

      currentIndex++
      setDriverLocation(driverRouteCoordinates[currentIndex])
    }, 1000)

    return () => clearInterval(moveTimer)
  }, [status, driverRouteCoordinates, from])

  useEffect(() => {
    console.log('PARAMS:', params)
    console.log('FROM:', from)
    console.log('TO:', to)
    console.log('DRIVER:', driverLocation)

    // map va asosiy nuqtalar tayyor bo‘lsa
    if (!mapRef.current || !from || !to) return

    const coordinates: Array<{ latitude: number; longitude: number }> = [
      { latitude: from.lat, longitude: from.lng },
      { latitude: to.lat, longitude: to.lng },
    ]

    // haydovchi bo‘lsa, uni ham qo‘shamiz
    if (driverLocation) {
      coordinates.push(driverLocation)
    }

    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 100,
          right: 50,
          bottom: 350,
          left: 50,
        },
        animated: true,
      })
    }, 500)

    return () => clearTimeout(timeout)
  }, [from, to, driverLocation])

  const handleCancel = () => {
    router.back()
  }

  const getStatusInfo = () => {
    switch (status) {
      case 'searching':
        return {
          icon: '🔍',
          title: 'Haydovchi izlanmoqda...',
          subtitle: 'Iltimos kuting',
          color: '#facc15',
        }
      case 'found':
        return {
          icon: '✅',
          title: 'Haydovchi topildi!',
          subtitle: '3 daqiqada yetib keladi',
          color: '#22c55e',
        }
      case 'arrived':
        return {
          icon: '🎉',
          title: 'Haydovchi yetib keldi!',
          subtitle: 'Mashinaga chiqing',
          color: '#3b82f6',
        }
      default:
        return {
          icon: '🚚',
          title: 'Yo\'lda...',
          subtitle: '',
          color: '#facc15',
        }
    }
  }

  const statusInfo = getStatusInfo()

  if (!from || !to || !car) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Ma'lumotlar yuklanmoqda...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        customMapStyle={darkMapStyle}
        initialRegion={{
          latitude: from.lat,
          longitude: from.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* From marker */}
        <Marker
          coordinate={{ latitude: from.lat, longitude: from.lng }}
          title="Qayerdan"
        >
          <Text style={styles.markerText}>📍</Text>
        </Marker>

        {/* To marker */}
        <Marker
          coordinate={{ latitude: to.lat, longitude: to.lng }}
          title="Qayerga"
        >
          <Text style={styles.markerText}>🏁</Text>
        </Marker>

        {/* Driver marker */}
        {driverLocation && (
          <Marker
            coordinate={driverLocation}
            title="Haydovchi"
          >
            <Animated.View style={{ transform: [{ scale: fadeAnim }] }}>
              <Text style={styles.driverMarker}>
                {car.id === '1' ? '🚐' : car.id === '2' ? '🚚' : '🚛'}
              </Text>
            </Animated.View>
          </Marker>
        )}

        {/* Driver to pickup route (yellow dashed) */}
        {driverRouteCoordinates.length > 0 && status !== 'arrived' && (
          <Polyline
            coordinates={driverRouteCoordinates}
            strokeColor="#facc15"
            strokeWidth={4}
            lineDashPattern={[10, 5]}
          />
        )}

        {/* Main route (blue solid) */}
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#3b82f6"
            strokeWidth={4}
          />
        )}
      </MapView>

      {/* Status card */}
      <View style={styles.statusCard}>
        <Animated.View
          style={[
            styles.statusIconContainer,
            {
              backgroundColor: statusInfo.color,
              transform: [{ scale: status === 'searching' ? pulseAnim : 1 }],
            },
          ]}
        >
          <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
        </Animated.View>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusTitle}>{statusInfo.title}</Text>
          <Text style={styles.statusSubtitle}>{statusInfo.subtitle}</Text>
        </View>
      </View>

      {/* Bottom panel */}
      <View style={styles.bottomPanel}>
        <View style={styles.content}>
          {/* Driver info */}
          {status !== 'searching' && (
            <Animated.View style={[styles.driverCard, { opacity: fadeAnim }]}>
              <View style={styles.driverAvatar}>
                <Text style={styles.driverAvatarText}>👨‍✈️</Text>
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>Alisher Karimov</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingStar}>⭐</Text>
                  <Text style={styles.ratingText}>4.9</Text>
                </View>
              </View>
              <View style={styles.carBadge}>
                <Text style={styles.carBadgeText}>{car.name}</Text>
              </View>
            </Animated.View>
          )}

          {/* Route info */}
          <View style={styles.routeCard}>
            <View style={styles.routeRow}>
              <Text style={styles.routeIcon}>📍</Text>
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>Qayerdan</Text>
                <Text style={styles.routeValue}>{from.title}</Text>
              </View>
            </View>

            <View style={styles.routeDivider} />

            <View style={styles.routeRow}>
              <Text style={styles.routeIcon}>🏁</Text>
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>Qayerga</Text>
                <Text style={styles.routeValue}>{to.title}</Text>
              </View>
            </View>
          </View>

          {/* Price info */}
          <View style={styles.priceCard}>
            <Text style={styles.priceLabel}>Narx</Text>
            <Text style={styles.priceValue}>
              {car.price.toLocaleString()} so'm
            </Text>
          </View>

          {/* Cancel button */}
          {status === 'searching' && (
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelText}>❌ Bekor qilish</Text>
            </TouchableOpacity>
          )}

          {/* Contact buttons */}
          {status !== 'searching' && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.callBtn}>
                <Text style={styles.callBtnText}>📞 Qo'ng'iroq</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageBtn}>
                <Text style={styles.messageBtnText}>💬 Xabar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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

  markerText: {
    fontSize: 32,
  },

  driverMarker: {
    fontSize: 40,
  },

  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },

  statusCard: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  statusIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },

  statusIcon: {
    fontSize: 28,
  },

  statusTextContainer: {
    flex: 1,
  },

  statusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },

  statusSubtitle: {
    color: '#9ca3af',
    fontSize: 14,
  },

  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.55,
    paddingTop: 8,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  driverCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#facc15',
  },

  driverAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  driverAvatarText: {
    fontSize: 28,
  },

  driverInfo: {
    flex: 1,
  },

  driverName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  ratingStar: {
    fontSize: 14,
    marginRight: 4,
  },

  ratingText: {
    color: '#facc15',
    fontSize: 14,
    fontWeight: '600',
  },

  carBadge: {
    backgroundColor: '#facc15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  carBadgeText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '700',
  },

  routeCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },

  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  routeIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  routeTextContainer: {
    flex: 1,
  },

  routeLabel: {
    color: '#9ca3af',
    fontSize: 13,
    marginBottom: 4,
  },

  routeValue: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  routeDivider: {
    height: 1,
    backgroundColor: '#3a3a3a',
    marginVertical: 12,
  },

  priceCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  priceLabel: {
    color: '#9ca3af',
    fontSize: 15,
  },

  priceValue: {
    color: '#facc15',
    fontSize: 20,
    fontWeight: '800',
  },

  cancelBtn: {
    backgroundColor: '#dc2626',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  cancelText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },

  callBtn: {
    flex: 1,
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  callBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  messageBtn: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  messageBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
})