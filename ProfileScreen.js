// ProfileScreen.js
import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';

const ProfileScreen = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // State to store initial values
  const [initialValues, setInitialValues] = useState({ firstName: '', lastName: '', email: '' });

  const handleSubmit = () => {
    console.log('Submitting:', { firstName, lastName, email });
    alert('Profile Updated');
    setIsEditing(false); // Turn off edit mode after submitting
    // Update initial values to the new submitted values
    setInitialValues({ firstName, lastName, email });
  };

  const handleEdit = () => {
    if (!isEditing) { // If we're about to enter edit mode, store current values as initial
      setInitialValues({ firstName, lastName, email });
    } else { // If we're canceling edit mode, revert back to initial values
      setFirstName(initialValues.firstName);
      setLastName(initialValues.lastName);
      setEmail(initialValues.email);
    }
    setIsEditing(!isEditing); // Toggle edit mode
  };

  return (
    <View style={styles.container}>
      {!isEditing ? (
        <>
          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
          <Button title="Edit Profile" onPress={handleEdit} />
        </>
      ) : (
        <>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setFirstName}
            value={firstName}
            placeholder="Enter your first name"
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setLastName}
            value={lastName}
            placeholder="Enter your last name"
          />
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
            placeholder="Enter your email address"
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
