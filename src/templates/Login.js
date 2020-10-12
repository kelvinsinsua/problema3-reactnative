import React, {useState} from 'react';
import axios from 'axios';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
  } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';

const Login = (props) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();
  const [email, setEmail] = useState(__DEV__ ? "testapis@tuten.cl" : null);
  const [password, setPassword] = useState(__DEV__ ? "1234" : null);

  const _handleClick = () => {
    setLoading(true);
    axios.put(`https://dev.tuten.cl/TutenREST/rest/user/${email}`, {},{
        headers: {
            password: password,
            app: "APP_BCK"
        }        
    })
    .then(function (response) {
        console.log(response)
        setLoading(false);
        if(response.data && response.data.sessionTokenBck){
            //sessionStorage.setItem("token",response.data.sessionTokenBck);
            //Actions.list();
            AsyncStorage.setItem("token",response.data.sessionTokenBck, () => {
                Actions.list();
            });
            setResult({error: false});
        }else{
            setLoading(false);
            setResult({error: true});
        }
    })
    .catch(function (error) {
      setLoading(false);
      setResult({error: true});
    });
  }

  const changeEmail = (e) => {
    setEmail(e)
  }
  
  const changePassword = (e) => {
    setPassword(e)
  }

  return (
    <View>
      <View  style={styles.banner}/>
      <View style={styles.form}>
        <View style={styles.card}>
          <Text style={styles.title}>Iniciar sesión</Text>
          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput keyboardType="email-address" onChangeText={changeEmail} style={styles.input}/> 
          <Text style={styles.label}>Contraseña:</Text>
          <TextInput secureTextEntry onChangeText={changePassword} style={styles.input}/>
          {loading ? <ActivityIndicator color="#1A60CA" /> : <TouchableOpacity onPress={_handleClick} style={styles.button}><Text style={{color: "#FFF"}}>Iniciar sesión</Text></TouchableOpacity>}

          {!loading && result && result.error ? <Text>Usuario o contraseña incorrectos.</Text> : null}

        </View>
      </View> 

    </View>
  );
}

const styles = StyleSheet.create({
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

export default Login;
