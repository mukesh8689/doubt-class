
import React ,{Component} from 'react';
import { Text,Container,Left,Body,Button,Icon,ListItem,Thumbnail,Separator} from 'native-base';
import {AsyncStorage,ScrollView, Alert} from 'react-native';
import firebase from 'firebase';

class  DrawerContent extends Component{

state={
  sub_code:[],
  email:'',
  subject:[],
}


componentDidMount(){
   
  var user = firebase.auth().currentUser;
  if(!user){
      this.props.screen.replace('home');
      alert('Login Again');
  }

  this.setemail();
  AsyncStorage.setItem('type','faculty');
  setInterval(() => {
    this.sub_codeList(); 
  },1000);

}


setemail = async () => {
  this.setState({email:await AsyncStorage.getItem('email')});
}



sub_codeList = () => {

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code')
  .on('value',data => {
    if(data.val())
    {
      this.setState({sub_code:Object.keys(data.val())});
    }
});

  firebase.database().ref('Faculty/' + this.state.email.replace('.',''))
  .on('value',data => {
      if(data.val()){
        var x = Object.values(data.val())
        var y =x['0'].Name;
        AsyncStorage.setItem('name',y);
      }
  })
}


getsubject = (code) => {
      
  let y = '';
    firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + code)
    .on('value',data => {
      var x = Object.values(data.val());
       y = x[0].subject;
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

        <Thumbnail style={{width:'100%',height:'30%',borderRadius:0}} source={require('./../faculty.png')} />

<ScrollView showsVerticalScrollIndicator={false}>

            <ListItem icon onPress={() => this.props.screen.navigate('teacherHome')} >
            <Left>
            <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="home"/>
                </Button>
            </Left>
            <Body>
              <Text>Home</Text>
            </Body>
          </ListItem>


          <ListItem icon onPress={() => this.props.screen.navigate('createClass')}>
            <Left>
              <Button style={{ backgroundColor: "#007AFF" }}>
                <Icon active name="add" />
              </Button>
            </Left>
            <Body>
              <Text>Create Class</Text>
            </Body>
          </ListItem>

          {this.state.sub_code.map(data => {

            return(

              <ListItem icon  onPress={() => {
                this.props.screen.navigate('teacherSubject',{sub_code:data , sub: this.getsubject(data)});
                this.props.close();
                }}>
              <Left>
                  <Icon active name="star" />
              </Left>
              <Body>
                <Text>{this.getsubject(data)}</Text> 
              </Body>
            </ListItem>

            );
          })}

</ScrollView>


          <Separator bordered>
          </Separator>

          <ListItem icon onPress={() => {
            this.props.screen.navigate('teacherSetting');
          }}>
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
                text:'OK',
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