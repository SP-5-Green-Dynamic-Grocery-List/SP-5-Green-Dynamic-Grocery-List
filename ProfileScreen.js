import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from './config/firebase';
import { updateEmail } from "firebase/auth";
import { ref, set, get } from 'firebase/database';

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigation = useNavigation();
  

  useEffect(() => {
    console.log('entered ProfileScreen');
    if (auth.currentUser) {
      const userProfileRef = ref(database, `users/${auth.currentUser.uid}`);
      console.log('userProfileRef: ', userProfileRef)
      get(userProfileRef).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log('firstName: ', data.firstName);
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setEmail(data.email || '');
          setZipCode(data.zipCode || '');
        }
      }).catch((error) => {
        console.error("Failed to retrieve data:", error);
      });
    }
  }, []);


  const handleSubmit = () => {
    if (auth.currentUser.email) {
      updateEmail(auth.currentUser, email).then(() => {
        const userProfileRef = ref(database, `users/${auth.currentUser.uid}`);
        set(userProfileRef, {
          firstName: firstName,
          lastName: lastName,
          email: email,  // Synchronize email with Firebase Auth
          zipCode: zipCode
        }).then(() => {
          alert('Profile Updated Successfully');
          setIsEditing(false);
        }).catch((error) => {
          alert('Failed to update profile in database');
          console.error("Error updating profile in database:", error);
        });
      }).catch((error) => {
        alert('Failed to update email in Firebase Auth');
        console.error("Error updating email in Firebase Auth:", error);
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };
  

  return (
    <View style={styles.container}>
      {!isEditing ? (
        <>
          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
          <Text style={styles.profileText}>Email: {email}</Text>
          <Text style={styles.profileText}>Zip Code: {zipCode}</Text>
          <Button title="Edit Profile" onPress={handleEdit} />
        </>
      ) : (
        <>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
          />
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
          />
          <Text style={styles.label}>Zip Code</Text>
          <TextInput
            style={styles.input}
            onChangeText={setZipCode}
            value={zipCode}
          />
          <Button title="Update Profile" onPress={handleSubmit} />
          <Button title="Cancel" onPress={handleEdit} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#cccccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  profileText: {
    fontSize: 16,
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ProfileScreen;
