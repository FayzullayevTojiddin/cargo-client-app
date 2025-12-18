import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function CompleteProfileScreen() {
  const [fullName, setFullName] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const router = useRouter();

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const onPressContinue = () => {
    router.push('/screens/order/CreateOrder');
  };

  const isValid = fullName.trim().length > 3;

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <TouchableOpacity style={styles.avatarWrapper} onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <Ionicons name="camera-outline" size={28} color="#2563eb" />
          )}
        </TouchableOpacity>

        <Text style={styles.avatarText}>Profil rasmi</Text>

        <Text style={styles.title}>Profilni to‘ldiring</Text>
        <Text style={styles.subtitle}>
          Ism va familiyangizni kiriting
        </Text>

        <View style={styles.inputWrapper}>
          <Ionicons
            name="person-outline"
            size={20}
            color="#64748b"
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="Ism va familiya"
            placeholderTextColor="#94a3b8"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, !isValid && { opacity: 0.4 }]}
          disabled={!isValid}
          onPress={onPressContinue}
        >
          <Text style={styles.buttonText}>Davom etish</Text>
        </TouchableOpacity>
      </View>
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

  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#e0e7ff',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },

  avatarText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#64748b',
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
    marginBottom: 16,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});