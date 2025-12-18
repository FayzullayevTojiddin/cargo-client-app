import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';

export default function CheckVerificationCodeScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [code, setCode] = useState('');
  const router = useRouter();

  const [error, setError] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 6,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const isValidCode = code.length === 6;

  const handleVerify = () => {
    if (code === '123456') {
      setError(false);
      router.replace('/screens/auth/CompleteProfileScreen');
      return;
    }

    setError(true);
    setCode('');
    Vibration.vibrate(100);
    triggerShake();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 24 }}
        >
          <Text style={{ color: '#2563eb', fontSize: 16 }}>
            ← Orqaga
          </Text>
        </TouchableOpacity>
      <Text style={styles.title}>Tasdiqlash kodi</Text>
      <Text style={styles.subtitle}>
        {phone} raqamiga yuborilgan kodni kiriting
      </Text>

      <Animated.View
        style={{
          transform: [{ translateX: shakeAnim }],
        }}
      >
        <TextInput
          caretHidden
          style={[
            styles.input,
            error && {
              borderColor: '#ef4444',
              backgroundColor: '#fff5f5',
            },
          ]}
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={(text) => {
            setCode(text);
            if (error) setError(false);
          }}
          placeholder="● ● ● ● ● ●"
          placeholderTextColor="#94a3b8"
          textAlign="center"
        />
        {error && (
          <Text style={{ color: '#ef4444', marginTop: 8, textAlign: 'center' }}>
            Tasdiqlash kodi xato
          </Text>
        )}
      </Animated.View>

      <TouchableOpacity
        style={[
          styles.button,
          code.length !== 6 && { opacity: 0.4 },
        ]}
        disabled={code.length !== 6}
        onPress={handleVerify}
      >
        <Text style={styles.buttonText}>Tasdiqlash</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },

  input: {
    height: 56,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 22,
    letterSpacing: 10,
    backgroundColor: '#fff',
    marginBottom: 24,
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});