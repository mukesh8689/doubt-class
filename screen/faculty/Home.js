import Drawer from 'react-native-drawer'
import React, { Component } from 'react';
import { Header,Title,Container,Left,Body,Button,Icon,Card,CardItem,Text} from 'native-base';

import DrawerContent from './Drawer.js';
import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

 
export default class Application extends Component {  

    state={
        drawer:false,
        email:'',
        sub_code:[],
    }
    
componentDidMount(){
  this.getEmail();

  setInterval(() => {
      this.start();
  },1000);
  
}




getEmail = async  () => this.setState({email:await AsyncStorage.getItem('email')})



start = () => {

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code')
  .on('value',data => {
      if(data.val()){
          var x = Object.keys(data.val());
          this.setState({sub_code:x});
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

getParticipant = (code) => {
  let y = '';
  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + code + '/Participants')  
  .on('value',data => {
      if(data.val()){
      var x = Object.keys(data.val());
        y = x.length;
      }
  })

  if(y != '')
  return y;
}



getRequest = (code) => {
  let y = '';
  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + code + '/Request')  
  .on('value',data => {
      if(data.val()){
      var x = Object.keys(data.val());
        y = x.length;
      }
  })

  if(y != '')
  return y;
}


getdoubt = (code) => {
  let y = '';
  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + code + '/comment')  
  .on('value',data => {
      if(data.val()){
      var x = Object.keys(data.val());
        y = x.length;
      }
  })

  if(y != '')
  return y;
}



ControlPanel = () => {
  if(!this.state.drawer)
    this.setState({drawer:true})
    else
        this.setState({drawer:false})
}

  render () {
    return (

        <Container>

        <Header>
        <Left>
          <Button transparent onPress={() => this.ControlPanel()}>
            <Icon name='menu' />
            <Title style={{marginLeft:20}}>Home</Title>
          </Button>
        </Left>
        <Body>
        </Body>
       </Header> 


      <Drawer
        content={<DrawerContent screen={this.props.navigation} close={() => this.ControlPanel()} />}
        open={this.state.drawer}
        openDrawerOffset={0.3}
        >

<ScrollView>

{
  this.state.sub_code.map((data) => {

    return(
      <Card>

      <CardItem header bordered>
    <Text>{this.getsubject(data)}</Text>
      </CardItem>
      <CardItem bordered>
        <Body>
    <Text note >code:    {data}</Text>
    <Text note >Participant Number: {this.getParticipant(data)}</Text>
    <Text note >Request Number: {this.getRequest(data)}</Text>
    <Text note >Total Doubt: {this.getdoubt(data)}</Text>
        </Body>
      </CardItem>

      </Card>
    );
  })
}

</ScrollView>

      </Drawer>

      </Container>
    )
  }
}




function MainView(){
  return(
null
  )
}
