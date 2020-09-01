import React, { Component } from 'react';
import { Container, Header, Button, Icon, Text,Body ,Title ,Left,Drawer,Card, CardItem,Tab,Tabs} from 'native-base';
import DrawerContent from './Drawer.js';
import FooterContent from './Footer.js';
import firebase from 'firebase';
import { AsyncStorage } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

export default class Doubt extends Component {

    state={
        drawer:false,
        email:'',
        faculty_email:this.props.navigation.state.params.faculty_email,
        sub_code:this.props.navigation.state.params.sub_code,
        data:[],
    }

  componentDidMount(){
    AsyncStorage.setItem('type','participants');
      this.getemail();
      this.fetch();
    }

    fetch = () => {

    firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
  .on('value',data => {
      if(data.val()){
        var x = Object.values(data.val());
        this.setState({data:x});
      }
  })
    }

    getemail=async () => this.setState({email:await AsyncStorage.getItem('email')})


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
        ref={(ref) => this._drawer = ref}
        content={<DrawerContent screen={this.props.navigation} close={() => this.setState({drawer:false})}/>}
        open={this.state.drawer}
        tapToClose={true}
        openDrawerOffset={0.3}
        >

<Tabs>

  <Tab heading="Open">
    <ScrollView>

  {this.state.data.map((data) => {

    if(data.email != this.state.email && data.closed == false){
return(
  <Card style={{flex: 0}}>
  <CardItem>
    <Left>
      <Body>
        <Text>{data.topic}</Text>
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
    <Button transparent onPress={() => this.props.navigation.navigate('studentReply2',{
              sub_code:this.props.navigation.state.params.sub_code, 
              faculty_email:this.props.navigation.state.params.faculty_email,
              time:data.time,
              topic:data.topic,
              doubt:data.doubt,
    })} >
        <Icon active name="chatbubbles" />
        <Text>{this.reply(data.Reply)} Comment</Text>
      </Button>
    </Left>
  </CardItem>
</Card>
);
  }

})
      
}

</ScrollView>
  </Tab>

  <Tab heading="Closed">

<ScrollView>
  {this.state.data.map((data) => {

if(data.email != this.state.email && data.closed == true){
return(
<Card style={{flex: 0}}>
<CardItem>
<Left>
  <Body>
    <Text>{data.topic}</Text>
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
<Button transparent onPress={() => this.props.navigation.navigate('studentReply2',{
          sub_code:this.props.navigation.state.params.sub_code, 
          faculty_email:this.props.navigation.state.params.faculty_email,
          time:data.time,
          topic:data.topic,
          doubt:data.doubt,
})} >
    <Icon active name="chatbubbles" />
    <Text>{this.reply(data.Reply)} Comment</Text>
  </Button>
</Left>
</CardItem>
</Card>
);
}

})
  
}
</ScrollView>
  </Tab>
</Tabs>


      </Drawer>

      <FooterContent 
        sub_code={this.props.navigation.state.params.sub_code} 
        faculty_email={this.props.navigation.state.params.faculty_email} 
        screen={this.props.navigation}
        active='doubt'
        />
      </Container>
    );
  }
}


