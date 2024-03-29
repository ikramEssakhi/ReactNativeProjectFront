import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

const AddEventScreen = ({ navigation }) => {
    const [sport, setSport] = useState('');
    const [description, setDescription] = useState('');
    const [numPersonsNeeded, setNumPersonsNeeded] = useState('');
    const [dateTime, setDateTime] = useState('');
    const [location, setLocation] = useState(null);
    const [showDateTimePicker, setShowDateTimePicker] = useState(false);
    const handleDateTimeChange = (event, selectedDate) => {
      setShowDateTimePicker(false);
  
      // Format the selected date without the time component
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDateTime(formattedDate);
    };
    const showDateTimePickerModal = () => {
      setShowDateTimePicker(true);
    };
  
    const handleAddEvent = async () => {
      try {

        if (!sport || !description || !numPersonsNeeded || !dateTime || !location) {
          Alert.alert('Error', 'Please fill in all the fields before adding an event');
          return;
        }
  
        // Retrieve user email from AsyncStorage
        const userEmail = await AsyncStorage.getItem('user');
  
        const response = await fetch('http://192.168.43.193:3001/addEvent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sport,
            description,
            numPersonsNeeded,
            dateTime,
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            userEmail, // Include the user's email in the request
          }),
        });
  
        const result = await response.json();
  
        if (response.ok) {
          console.log('Event added successfully:', result);
          Alert.alert('Event added successfully', result.message);
          setLocation(null);

          // Handle successful event addition, e.g., navigate to another screen
          setTimeout(() => {
            navigation.navigate('Home'); // Assuming 'Login' is the name of your Login screen
          }, 1500);
        } else {
          console.error('Event addition failed:', result.message);
          // Handle event addition failure, e.g., display an error message
        }
      } catch (error) {
        console.error('Event addition error:', error);
        // Handle network or other errors
      }
    };
  
  
    const handleMapPress = (event) => {
      const { coordinate } = event.nativeEvent;
      setLocation({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
      });
    };
  
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Event</Text>
        <View style={styles.row}>
          <Picker
            selectedValue={sport}
            onValueChange={(itemValue) => setSport(itemValue)}
            dropdownIconColor="orange"
            style={styles.picker}
          >
            <Picker.Item label="Select Sport" value="" style={styles.pickerItem} />
            <Picker.Item label="Football" value="football" />
            <Picker.Item label="Basketball" value="basketball" />
            <Picker.Item label="Volleyball" value="volleyball" />
            <Picker.Item label="Cycling" value="cycling" />
          </Picker>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Description : Like the specific hour"
          value={description}
          onChangeText={setDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Number of Persons Needed"
          value={numPersonsNeeded}
          onChangeText={setNumPersonsNeeded}
          keyboardType="numeric"
        />
       <TextInput
        style={styles.input}
        placeholder="Date and Time"
        value={dateTime}
        onTouchStart={showDateTimePickerModal} // Open DateTimePicker on touch
      />
      {showDateTimePicker && (
        <DateTimePicker
          value={new Date()} // Set the initial value to the current date and time
          mode="date" // You can use "date" or "time" mode based on your requirement
          //is24Hour={true}
          display="default"
          onChange={handleDateTimeChange}
        />
      )}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            onPress={handleMapPress}
            showsUserLocation={true}
            followsUserLocation={true}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {location && <Marker coordinate={location} />}
          </MapView>
        </View>
        <Button title="Post" onPress={handleAddEvent} color="black" />
      </ScrollView>
    );
  };
  
  // ... (styles and export)
  
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  picker: {
    height: 30,
    marginBottom: 5,
    width: 200,
    fontWeight: '100',
    fontSize: 12,
  },
  pickerItem: {
    color: 'gray',
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
  },
  map: {
    flex: 1,
  },
});

export default AddEventScreen;
