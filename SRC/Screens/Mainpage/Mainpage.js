import { StyleSheet, View, StatusBar,Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Bottomnavbar from '../../Components/Bottomnavbar'
import TopNavbar from '../../Components/TopNavbar'
import FollowersRandomPost from '../../Components/FollowersRandomPost'
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { formHead2, formHead3 } from '../../CommonCss/formcss'

const Mainpage = ({ navigation }) => {
  
  const [userdata, setUserdata] = useState(null);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    async function getUserData() { 
      try {
        const userDataString = await AsyncStorage.getItem('user');
        const userData = JSON.parse(userDataString);
        setUserdata(userData);
      } catch (err) {
        alert(err);
      }
    }

    getUserData();
  }, []);

  useEffect(() => {
    async function getLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        let city = await Location.reverseGeocodeAsync(location.coords);
        setCity(city[0].city);
      } catch (err) {
        console.error(err);
      }
    }

    getLocation();
  }, []);

  useEffect(() => { 
    async function sendCity() {
       try {
        const response = await fetch('http://10.0.2.2:3000/updateCity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            city: city,
            username: userdata.user.username
          }),
        });
        const data = await response.json();
        console.log('Success:', data);
      } catch (err) {
        console.error('Error:', err);
      }
    }
    if (userdata && city) {
      sendCity();
    }
  }, [userdata, city]);

console.log(city)
  return (
    <View style={styles.container}>
      <StatusBar />
      <Bottomnavbar navigation={navigation} page={"MainPage"} />
      <Text style={formHead3}>MainPage</Text>
    </View>
  );
}


export default Mainpage   

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        paddingVertical: 50,
    }
})