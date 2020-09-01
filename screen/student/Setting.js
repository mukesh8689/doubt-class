import React, { Component } from 'react';
import { Container, Header, Content,Button, Icon, Text,Left,Body,Title,ListItem, List, Right, Separator } from 'native-base';
import firebase from 'firebase';
import {AsyncStorage,Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class Setting extends Component {

 state={
     drawer:false,
     email:'',
     sub:[],
     name:'',
}

componentDidMount(){
  this.getEmail();
  setInterval(() => {this.fetch()},1000)
}


getEmail =async () => {
    this.setState({email:await AsyncStorage.getItem('email')});
    this.setState({name:await AsyncStorage.getItem('name')});
}


fetch = () => {

  firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject')
  .on('value',data => {
      if(data.val()){
          var x = Object.keys(data.val()); 
          this.setState({sub:x});
      }
  })

}



getcode = (sub) => {
    let y = '';
      firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject/' + sub)
      .on('value',data => {
          if(data.val()){
        var x = Object.values(data.val());
         y = x['0'].code;
          }
      })
    
      if(y != '')
      return y;
  
  }


  remove = (sub) => {

    firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject/' + sub)
    .remove()

  }


deleteAccount = () => {

  this.state.sub.map((data) => {
    this.remove(data);
  })

firebase.database().ref('Student/' + this.state.email.replace('.',''))
.remove()

  this.LogOut();
}


LogOut = () => {
  AsyncStorage.setItem('email','');
  AsyncStorage.setItem('type','');
  firebase.auth().signOut();
  this.props.screen.navigate('home');
  alert('Logged Out');
}


  render() {

    return (
      <Container>

    <Header>
        <Left>
          <Button transparent >
            <Title>Settings</Title>
          </Button>
        </Left>
        <Body>
        </Body>
       </Header> 
 
<Content>
<ScrollView>

<Separator>
    <Text>Subjects</Text>
</Separator>
<List>

        <ListItem >
            <Left>
                <Text style={{color:'purple'}}>Subjects</Text>
            </Left>
            <Body>
            <Text style={{color:'purple'}}>Code</Text>
            </Body>
            <Right></Right>
      </ListItem>

{this.state.sub.map((data) => {
    return(
        <ListItem >
            <Left>
                <Text>{data}</Text>
            </Left>
            <Body>
            <Text note>{this.getcode(data)}</Text>
            </Body>
            <Right>
                <Icon name='trash' onPress={() => {

             Alert.alert('Delete','Delete this Subject, You can join anytime !!',
             [{
               text:'Delete',
               onPress:() => this.remove(data)
             },
             {
             text: 'Cancel',
             style: 'cancel'
           }
             ]);                      
                }} />
            </Right>
      </ListItem>
    );
})}
</List>

<Separator style={{marginBottom:10}}>
    <Text>{this.state.email}</Text>
</Separator>

        <Button transparent onPress={() => this.props.navigation.navigate('teacherPassword')}>
            <Text>change password</Text>
          </Button>
    
          <Button bordered dark style={{marginTop:20,alignSelf:'center'}} onPress = {() => {
            Alert.alert('Deleting Account!!','Are you sure , delete account ',[
              {
                text:'Delete',
                onPress:() => this.deleteAccount()
              },
              {
                text:'Cancel',
                style:'cancel',
              }
            ])
          }}>
              <Icon name='sad' />
            <Text>Delete Account</Text>
          </Button>

</ScrollView>
</Content>
      </Container>
    );
  }
}



