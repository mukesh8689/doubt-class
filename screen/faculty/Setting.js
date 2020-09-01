import React, { Component } from 'react';
import { Container, Header, Content, Button, Icon, Text,Left,Body,Title,ListItem, List, Right, Separator } from 'native-base';
import firebase from 'firebase';
import {AsyncStorage,Alert} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class Setting extends Component {

 state={
     drawer:false,
     email:'',
     code:[],
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

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code')
  .on('value',data => {
      if(data.val()){
          var x = Object.keys(data.val()); 
          this.setState({code:x});
      }
  })

}



getsubject = (code) => {
    let y = '';
      firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + code)
      .on('value',data => {
          if(data.val()){
        var x = Object.values(data.val());
         y = x[0].subject;
          }
      })
    
      if(y != '')
      return y;
  
  }


  remove = (sub,sub_code) => {

    firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + sub_code + '/Participants') 
    .on('value',data => {
            if(data.val()){
                var x  = Object.values(data.val());
                this.participantArray(x,sub);
            }
    });
    
      firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + sub_code)
      .remove();

  }


  participantArray = (x,sub) => {

    x.forEach(element => {
          firebase.database().ref('Student/' + element.Email.replace('.','') + '/Subject/' + sub)
          .remove()
    });
 }


  deleteAccount = () => {

    this.state.code.map((data) => {
      this.remove(this.getsubject(data),data);
    })

firebase.database().ref('Faculty/' + this.state.email.replace('.',''))
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

{this.state.code.map((data) => {
    return(
        <ListItem >
            <Left>
                <Text>{this.getsubject(data)}</Text>
            </Left>
            <Body>
            <Text note>{data}</Text>
            </Body>
            <Right>
                <Icon name='trash' onPress={() => {
            Alert.alert('Delete','Whole Data will get deleted !!',
            [{
              text:'Delete',
              onPress:() => this.remove(this.getsubject(data),data)
            },
            {
            text: 'Cancel',
            style: 'cancel'
          }
            ]);                       
                }}
                     />
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
    
          <Button bordered dark style={{marginTop:20,alignSelf:'center'}} onPress={() => {
            Alert.alert('Delete Account','Are You Sure , delete your account!!',[
              {
                text:'Delete',
                onPress:() => deleteAccount(data),
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



