import React from 'react';
import { StyleSheet,Dimensions,AsyncStorage } from 'react-native';
import { Container, Content, Button, Text,Icon, Body } from 'native-base';
import * as firebase from 'firebase';
import * as Font from 'expo-font';
import firebaseConfig from './Firebase.js'; 

if (!firebase.apps.length) {
firebase.initializeApp(firebaseConfig);
}

 



export default class  App extends React.Component{

  state = {
    load:false,
    width: Dimensions.get('window').width,
    height:Dimensions.get('screen').height/2,
    data:[],
    type:''
  }

  async componentWillMount() {
    this.gettype();

    setInterval(() => {
      this.verify();
    },500);

    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
    });
    this.setState({load:true});

  }

  gettype = async () => this.setState({type:await AsyncStorage.getItem('type')});

  
verify = () => {

    var user = firebase.auth().currentUser;
      if(user){
          if(this.state.type == 'faculty'){

            AsyncStorage.setItem('email' , user.email);
            this.props.navigation.replace('teacherHome');

          }else if(this.state.type == 'participant'){

            AsyncStorage.setItem('email' , user.email);
            this.props.navigation.replace('studentHome');

          }
      }

}


render(){  

if(this.state.load){
  return (
   <Container> 
        <Content>
 
    <Body style={{justifyContent:'center',marginTop:this.state.height - 70}}>

        <Button iconLeft style={{marginBottom:15 ,alignSelf:'center'}} onPress={() => this.props.navigation.navigate('login',{
          go:'teacherHome',
        })}>
            <Icon name='school' />
            <Text>Faculty Login</Text>
          </Button>
         
          <Button iconLeft transparent primary style={{marginTop:15,alignSelf:'center'}} onPress={() => this.props.navigation.navigate('login',{
            go:'studentHome',
          })}>
            <Icon name='people' />
            <Text>Participants Login</Text>
          </Button>
          </Body>   

        </Content>
      </Container>   
  );
}else{ 
  return null;
}

}
}

const styles = StyleSheet.create({

});
