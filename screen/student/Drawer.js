
import React,{Component} from 'react';
import { Text,Container,Left,Body,Button,Icon,ListItem,Thumbnail,Separator} from 'native-base';
import {AsyncStorage,ScrollView, Alert} from 'react-native';
import firebase from 'firebase';

class DrawerContent extends Component{

  state={
    subject:[],
    email:'',
  }

    componentDidMount(){
      var user = firebase.auth().currentUser;
      if(!user){
          this.props.screen.replace('home');
          alert('Login Again');
      }

      this.getEmail();
      AsyncStorage.setItem('type','participant');

        setInterval(() => {
          this.getSubject();
        },1000) ;

   
    }

    getEmail =async () => this.setState({email: await AsyncStorage.getItem('email')})


    getSubject = () => {

      firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject')
      .on('value',data => {
        if(data.val()){
            let x = Object.keys(data.val());
            this.setState({subject:x});
        }
      })
    }



    getcode = (sub) => {

      var y = '';
      firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject/' + sub)
      .on('value' , data => {
        if(data.val()){
            let x = Object.values(data.val());
            y = x['0'].code;
        }
      })

      if(y != '')
        return y;
    }


    getemail = (sub) => {

      var y='';
      firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject/' + sub)
      .on('value' , data => {
        if(data.val()){
            let x = Object.values(data.val());
            y=x['0'].faculty_mail;
        }
      })

      if(y != '')
        return y;   
    }


    LogOut = () => {
      AsyncStorage.setItem('email','');
      AsyncStorage.setItem('type','');
      firebase.auth().signOut();
      this.props.screen.navigate('home');
      alert('Logged Out');
    }


    render(){
    return(
        <Container>
         
        <Thumbnail style={{width:'100%',height:'30%'}} source={require('./../student.jpg')} />

        <ScrollView showsVerticalScrollIndicator={false}>


          <ListItem icon onPress={() => this.props.screen.navigate('studentHome')}>
            <Left>
            <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="home"/>
                </Button>
            </Left>
            <Body>
              <Text>Home</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={() => this.props.screen.navigate('joinClass')}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="add" />
              </Button>
            </Left>
            <Body>
              <Text>Join Class</Text>
            </Body>
          </ListItem>

      {
        this.state.subject.map((data) => {
          return(
            <ListItem icon 
              onPress={() => {
              this.props.screen.navigate('studentSubject',{sub_code:this.getcode(data) , faculty_email: this.getemail(data)});
              this.props.close();
              }}>
            <Left>
                <Icon active name="star" />
            </Left>
            <Body>
              <Text>{data}</Text> 
            </Body>
          </ListItem>
          );
        })
      }

      </ScrollView>

          <Separator bordered>
          </Separator>

          <ListItem icon onPress={() => this.props.screen.navigate('studentSetting')}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="settings" />
              </Button>
            </Left>
            <Body>
              <Text>Settings</Text>
            </Body>
          </ListItem>

          <ListItem icon onPress={() => {
            Alert.alert('Alert','LogOut !!',[
              {
                text:'Ok',
                onPress:() => this.LogOut()
              },
              {
                text:'Cancel',
                style:'cancel'
              }
            ])
            
            }}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="log-out" />
              </Button>
            </Left>
            <Body>
              <Text>Log Out</Text>
            </Body>
          </ListItem>

      </Container>  
       );
    }
}

export default DrawerContent