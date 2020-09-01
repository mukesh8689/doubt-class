import React, { Component } from 'react';
import { Container, Header,Card, CardItem,Right, Button, Icon, Text,Body ,Title ,Left,Drawer,Fab, Separator, Content} from 'native-base';
import DrawerContent from './Drawer.js';
import FooterContent from './Footer.js';
import firebase from 'firebase';
import {AsyncStorage,Alert} from 'react-native'; 
import { ScrollView } from 'react-native-gesture-handler';

export default class Subject extends Component {

    state={
        drawer:false,
        email:'',
        faculty_email:this.props.navigation.state.params.faculty_email,
        sub_code:this.props.navigation.state.params.sub_code,
        data:[],
    }

    componentDidMount(){
      this.getemail();
      setInterval(() => {
        this.fetch();
      },1000)
    }


    getemail = async () => this.setState({email:await AsyncStorage.getItem('email')})

    
    fetch = () => {
      firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
      .on('value',data => {
          if(data.val()){
            var x = Object.values(data.val());
            this.setState({data:x});
          }
      })
        }


        remove = (time) => {

          firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
          .orderByChild('time')
          .equalTo(time)
          .on('value',data => {
                if(data.val()){
                    var x = Object.keys(data.val());
                    firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment/' + x)
                    .remove()
                }
          })
        
        }


        reply = (data) => {
          if(data){
            return Object.keys(data).length
          }else{
            return 0 
          }
        }

    
  ControlPanel = () => {
      if(!this.state.drawer)
        this.setState({drawer:true})
        else
            this.setState({drawer:false})
  };


  render() {
    return (
      <Container>


<Header>
        <Left>
          <Button transparent onPress={() => this.ControlPanel()}>
            <Icon name='menu' />
            <Title style={{marginLeft:20}}>{this.props.navigation.state.params.sub_code}</Title>
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
<Content>

  <ScrollView>
     
<Separator>
  <Text>Open</Text>
</Separator>

{this.state.data.map((data) => {

if(data.email == this.state.email && data.closed == false){
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
    <Button transparent onPress={() => this.props.navigation.navigate('studentReply',{
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
      <Right>
              <Button transparent onPress={() => {
             Alert.alert('Delete','Delete this Doubt ?',
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
})     
}

<Separator>
  <Text>Closed</Text>
</Separator>

{this.state.data.map((data) => {

if(data.email == this.state.email && data.closed == true){
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
    <Button transparent onPress={() => this.props.navigation.navigate('studentReply',{
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
      <Right>
              <Button transparent onPress={() => this.remove(data.time)} >
                  <Icon active name="trash" />
                </Button>
     </Right>
  </CardItem>
</Card>
);
}
})     
}

</ScrollView>
</Content>

        <Fab
          active={false}
          direction="up"
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => this.props.navigation.navigate('doubtForm',{
            sub_code:this.props.navigation.state.params.sub_code,
            faculty_email:this.props.navigation.state.params.faculty_email
          })}>
          <Icon name="paper-plane" />
        </Fab>
   

      </Drawer>

      <FooterContent 
        sub_code={this.props.navigation.state.params.sub_code} 
        faculty_email={this.props.navigation.state.params.faculty_email} 
        screen={this.props.navigation}
        active='home'
        />
      </Container>
    );
  }
}

