import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    ScrollView,
  } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';

const List = (props) => {
    const [id, setId] = useState();
  const [data, setData] = useState([]);
  const [matches, setMatches] = useState([]);
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();

    useEffect(async () => {
        let token = await AsyncStorage.getItem('token');
        if(token){
          axios.get(`https://dev.tuten.cl/TutenREST/rest/user/contacto%40tuten.cl/bookings?current=true`,{
              headers: {
                  adminemail: "testapis@tuten.cl",
                  app: "APP_BCK",
                  token: token
              }        
          })
          .then(function (response) {
              console.log(response)
              if(Array.isArray(response.data)){
                  setData(response.data)
                  setMatches(response.data)
              }else{
                  setData({error: true})
              }
          })
          .catch(function (error) {
          setData({error: true})
          });
        }else{
          Actions.login()
        }
    },[])
   
    const changeId = (e) => {
      setId(e);
      filter(e, minPrice, maxPrice);
    }
   
    const changeMinPrice = (e) => {
      setMinPrice(e);
      filter(id, e, maxPrice);
    }
   
    const changeMaxPrice = (e) => {
      setMaxPrice(e);
      filter(id, minPrice, e);
    }
  
    const filter = (id, minPrice, maxPrice) => {
      if(Array.isArray(data)){
        let matches = data.filter((item) => {
          let valid = true;
          if(id){
            valid = (item.bookingId.toString().indexOf(id) > -1);
          }
          if(minPrice && valid){
            valid = item.bookingPrice >= minPrice ? true : false;
          }
          if(maxPrice && valid){
            valid = item.bookingPrice <= maxPrice ? true : false;
          }
          return valid;
        })
  
        
  
        setMatches(matches);
      }
    }
  return (
    <ScrollView>
      <View  style={styles.banner}/>
      <View style={styles.form}>
        <View style={styles.card}>
          <Text style={styles.title}>Lista</Text>
          <TextInput placeholder="id" onChangeText={changeId} style={styles.input}/> 
          <TextInput keyboardType="number-pad" placeholder="Precio mínimo" onChangeText={changeMinPrice} style={styles.input}/> 
          <TextInput keyboardType="number-pad" placeholder="Precio máximo" onChangeText={changeMaxPrice} style={styles.input}/> 
          

        </View>
        <View style={styles.thead}>
            <View style={styles.th}>
                <Text style={{fontWeight: "bold"}}>BookingId</Text>
            </View>
            <View style={styles.th}>
                <Text style={{fontWeight: "bold"}}>Cliente</Text>
            </View>
            <View style={styles.th}>
                <Text style={{fontWeight: "bold"}}>Fecha de Creación</Text>
            </View>
            <View style={styles.th}>
                <Text style={{fontWeight: "bold"}}>Dirección</Text>
            </View>
            <View style={styles.th}>
                <Text style={{fontWeight: "bold"}}>Precio</Text>
            </View>
        </View>
        {Array.isArray(data) ? matches.map((item,key) => {
                    return(
                        <View style={styles.thead} key={key}>
            <View style={styles.th}>
                <Text>{item.bookingId}</Text>
            </View>
            <View style={styles.th}>
                <Text>{item.tutenUserClient.firstName} {item.tutenUserClient.lastName}</Text>
            </View>
            <View style={styles.th}>
                <Text>{item.bookingTime}</Text>
            </View>
            <View style={styles.th}>
                <Text>{item.locationId.streetAddress}</Text>
            </View>
            <View style={styles.th}>
                <Text>{item.bookingPrice}</Text>
            </View>
            
        </View>
                    )
                }) : null}
      </View> 

    </ScrollView>
  );
}

const styles = StyleSheet.create({
    thead: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#000"
    },
    th: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },  
    banner: {
        height: 200,
        backgroundColor: "#1A60CA"
    },
    form: {
        justifyContent: "center",
        alignItems: "center"
    },
    card: {
        borderColor: "#1A60CA",
        borderWidth: 1,
        borderRadius: 10,
        width: 300,
        marginTop: -50,
        backgroundColor: "#FFF",
        padding: 15
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center"
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginTop: 15
    },
    input: {
        borderBottomColor: "#1A60CA",
        borderBottomWidth: 1,
        width: "100%"
    },
    button: {
        backgroundColor:  "#1A60CA",
        width: "100%",
        height: 35,
        borderRadius: 5,
        marginTop: 15,
        color: "#FFF",
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center"
    }
})

export default List;
