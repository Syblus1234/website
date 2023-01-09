import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchUserPage = () => {

  const [userData, setUserData] = useState([]);
  const [username, setUsername] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const userDataString = await AsyncStorage.getItem('user');
      const data = await JSON.parse(userDataString);
      console.log(data)
      setUsername(data.user.username)
      fetch('http://10.0.2.2:3000/user', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: data.user.username }),
      }).then(response => {
        return response.text();
      }).then(json => {
        setUserData(JSON.parse(json));
      }).catch(err => {
        console.log(err)
      });
    } catch (err) {
      alert(err);
    }
  }

  return (
    <View style={styles.container}>
      {
        userData.map(user => {
              console.log(user.profilepic)
          return <View style={styles.userSection}>
            <View style={styles.imageContainer}>
              <Image
                style={styles.image}
                source={{ uri: user.profilepic }}
                resizeMode="contain"
                overflow="hidden"
                />
            </View>
            <Text style={styles.text}>Username: {user.username}</Text>
          </View>
        })
      }
    </View>
  )
}

export default SearchUserPage


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 15,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white'
  },
});
