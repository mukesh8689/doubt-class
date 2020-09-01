import Drawer from 'react-native-drawer'
import React, { Component } from 'react';
import {Text,Header,Title,Container,Left,Body,Button,Icon, Content, Card, CardItem, Thumbnail, Right} from 'native-base';
import {ScrollView,AsyncStorage} from 'react-native'; 
import firebase from 'firebase';

import DrawerContent from './Drawer.js';



export default class Application extends Component {  

    state={
        drawer:false,
        email:'',
        sub:[],
    }

    componentDidMount(){
      this.getEmail();
    
      setInterval(() => {
          this.start();
      },1000);
      
    }
    

    
    
    getEmail = async  () => this.setState({email:await AsyncStorage.getItem('email')})
    
    
    
    start = () => {
    
      firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject')
      .on('value',data => {
          if(data.val()){
              var x = Object.keys(data.val());
              this.setState({sub:x});
          }
      })
    }



  ControlPanel = () => {
      if(!this.state.drawer)
        this.setState({drawer:true})
        else
            this.setState({drawer:false})
  };
  

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


  get_fac_name = (sub) => {
    let y = '';
      firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject/' + sub)
      .on('value',data => {
          if(data.val()){
        var x = Object.values(data.val());
         y = x['0'].faculty;
          }
      })
    
      if(y != '')
      return y;
  
  }


  get_fac_mail = (sub) => {
    let y = '';
      firebase.database().ref('Student/' + this.state.email.replace('.','') + '/Subject/' + sub)
      .on('value',data => {
          if(data.val()){
        var x = Object.values(data.val());
         y = x['0'].faculty_mail;
          }
      })
    
      if(y != '')
      return y;
  
  }


  part_num = (code,fac_email) => {
      let y = '';

      firebase.database().ref('Faculty/' + fac_email.replace('.','') + '/code/' + code + '/Participants')  
      .on('value',data => {
          if(data.val()){
          var x = Object.keys(data.val());
            y = x.length;
          }
      })
    
      if(y != '')
      return y;
    
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
        openDrawerOffset={0.4}
        >


<ScrollView>

{
  this.state.sub.map((data) => {

    return(
      <Card key={data}>

      <CardItem header bordered>
    <Text>{data}</Text>
      </CardItem>
      <CardItem bordered>
        <Body>
     <Text note >code:    {this.getcode(data)}</Text>
    <Text note >Faculty Name: {this.get_fac_name(data)}</Text>
    <Text note >Participant Number : {this.part_num(this.getcode(data),this.get_fac_mail(data))}</Text>
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

