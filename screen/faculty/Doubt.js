import React, { Component } from 'react';
import { Container, Header, Button, Icon, Text ,Left,Body,Title,Drawer,Card, CardItem,Right,Tab,Tabs } from 'native-base';
import DrawerContent from './Drawer.js';
import FooterContent from './Footer.js';
import {AsyncStorage, Alert} from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

export default class Doubt extends Component {

 state={
     drawer:false,
     email:'',
     sub_code:this.props.navigation.state.params.sub_code,
     data:[],
}

componentDidMount(){
  this.getEmail();
  setInterval(() => {this.fetch()},1000)
}

getEmail =async () => this.setState({email:await AsyncStorage.getItem('email')})


fetch = () => {

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
  .on('value',data => {
      if(data.val()){
        var x = Object.values(data.val());
        this.setState({data:x});
      }
  })
}

remove = (time) => {

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
  .orderByChild('time')
  .equalTo(time)
  .on('value',data => {
        if(data.val()){
            var x = Object.keys(data.val());
            firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment/' + x)
            .remove()
        }
  });

}

  ControlPanel = () => {
      if(!this.state.drawer)
        this.setState({drawer:true})
        else
            this.setState({drawer:false})
  };


  reply = (data) => {
    if(data){
      return Object.keys(data).length
    }else{
      return 0 
    }
  }

  render() {

    return (
      <Container>

    <Header>
        <Left>
          <Button transparent onPress={() => this.ControlPanel()}>
            <Icon name='menu' />
            <Title style={{marginLeft:20}}>Doubts</Title>
          </Button>
        </Left>
        <Body>
        </Body>
       </Header>  


       <Drawer
        content={<DrawerContent screen={this.props.navigation} close={() => this.setState({drawer:false})} />}
        open={this.state.drawer}
        tapToClose={true}
        openDrawerOffset={0.3}
        >

    <Tabs>
          <Tab heading="Open">
    <ScrollView>
          {this.state.data.map((data) => {

        if(data.closed == false && data.replied == true){
          return(
            <Card>
            <CardItem>
              <Left>
                <Body>
                  <Text>{data.topic}</Text>
                  <Text note>{data.name}</Text>
                  <Text note>{new Date(data.time).toUTCString().replace('GMT','')}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  {data.doubt}
                </Text>
              </Body>

            </CardItem>
            <CardItem>
              <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('teacherReply',{
                sub_code:this.state.sub_code,
                name:data.name,
                time:data.time,
                doubt:data.doubt,
                go:'doubt',
              })} >
                  <Icon active name="chatbubbles" />
                  <Text>{this.reply(data.Reply)} Comment</Text>
                </Button>
              </Left>
              <Right>
              <Button transparent  onPress={() => this.remove(data.time)} >
                  <Icon active name="trash" />
                </Button>
                </Right>
            </CardItem>
          </Card>
          );
            }
      })}

      </ScrollView>
          </Tab>

          <Tab heading="Closed">
           <ScrollView>

{this.state.data.map((data) => {

        if(data.closed == true && data.replied == true){
          return(
            <Card>
            <CardItem>
              <Left>
                <Body>
                  <Text>{data.topic}</Text>
                  <Text note>{data.name}</Text>
                  <Text note>{new Date(data.time).toUTCString().replace('GMT','')}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
                <Text>
                  {data.doubt}
                </Text>
              </Body>

            </CardItem>
            <CardItem>
              <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('teacherReply2',{
                sub_code:this.state.sub_code,
                name:data.name,
                time:data.time,
                doubt:data.doubt,
                student_name:data.name,
                topic:data.topic,
              })} >
                  <Icon active name="chatbubbles" />
                  <Text>{this.reply(data.Reply)} Comment</Text>
                </Button>
              </Left>
              <Right>
              <Button transparent  onPress={() => {
             Alert.alert('Delete','Delete this doubt ?',
                  [{
                    text:'Delete',
                    onPress:() => this.remove(data.time)
                  },
                  {
                  text: 'Cancel',
                  style: 'cancel'
                }
                  ]);     
               }} >
                  <Icon active name="trash" />
                </Button>
                </Right>
            </CardItem>
          </Card>
          );
            }
      })} 
      </ScrollView>
          </Tab>
  
        </Tabs>


      </Drawer>

        <FooterContent 
        sub_code={this.props.navigation.state.params.sub_code} 
        sub={this.props.navigation.state.params.sub} 
        screen={this.props.navigation}
        active='doubt'
        />

      </Container>
    );
  }
}



