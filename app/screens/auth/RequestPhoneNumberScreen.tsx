import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

export default function RequestPhoneNumberScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState('+998');
  const normalizePhone = (value: string) => value.replace(/\s/g, '');
  const isValidPhone = (value: string) => /^\+998\d{9}$/.test(normalizePhone(value));

  const handlePhoneChange = (text: string) => {
    if (!text.startsWith('+998')) {
      setPhone('+998');
      return;
    }

    setPhone(text);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.wrapper}>
          <View style={styles.card}>
            <View style={styles.iconWrapper}>
              <Ionicons name="call-outline" size={28} color="#2563eb" />
            </View>

            <Text style={styles.title}>Telefon raqamni kiriting</Text>
            <Text style={styles.subtitle}>
              Hisobga kirish uchun telefon raqamingiz kerak
            </Text>

            <View style={styles.inputWrapper}>
              <Ionicons
                name="phone-portrait-outline"
                size={20}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                  placeholder="+998 90 123 45 67"
                  keyboardType="phone-pad"
                  placeholderTextColor="#94a3b8"
                  style={styles.input}
                  value={phone}
                  onChangeText={handlePhoneChange}
                />
            </View>

            {isValidPhone(phone) && (
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPress={() =>
                  router.push({
                    pathname: '/screens/auth/CheckVerificationCodeScreen',
                    params: { phone: normalizePhone(phone) },
                  })
                }
              >
                <Text style={styles.buttonText}>Davom etish</Text>
                <Ionicons
                  name="arrow-forward-outline"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 8 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#eef2ff',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#0f172a',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 24,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    backgroundColor: '#f8fafc',
    marginBottom: 20,
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#0f172a',
  },

  button: {
    height: 54,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});