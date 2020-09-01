import React, { Component } from 'react';
import { Text,Header,Title,Container,Body,Button,Content, Card, CardItem, Right,Footer,Item,Input, Separator} from 'native-base';
import {AsyncStorage,Alert} from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

 
export default class Reply extends Component {  

    state={
        drawer:false,
        name: this.props.navigation.state.params.name,
        time: this.props.navigation.state.params.time,
        doubt: this.props.navigation.state.params.doubt,
        sub_code: this.props.navigation.state.params.sub_code,
        data:[],
        email:'',
        reply:'',
        key:'',
        button_close:'Close',
    }
    

    componentDidMount(){
      this.getEmail();
      setInterval(() => {
        this.fetch();
      },1000)
    }


getEmail = async () => this.setState({email:await AsyncStorage.getItem('email')})


fetch = () => {

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
  .orderByChild('time')
  .equalTo(this.state.time)
  .on('value',data => {
      if(data.val()){
        var x = Object.keys(data.val());
        var y = x['0']; 
        this.setState({key:y});
        firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment/' + y + '/Reply')
        .on('value',data => {
            if(data.val()){
                var x1 = Object.values(data.val());
                this.setState({data:x1});
            }
        })
      }
  })
}


sendReply = () => {

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment/' + this.state.key + '/Reply')
  .push({
    reply:this.state.reply,
    email:this.state.email,
    time:Date.now(),
  });

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
  .child(this.state.key)
  .update({replied:true});

    if(this.props.navigation.state.params.go == 'sub'){
        this.props.navigation.navigate('teacherSubject',{
        sub_code:this.state.sub_code,
        sub: this.getsubject(this.state.sub_code),
  })
}else{
  this.props.navigation.navigate('doubt',{
    sub_code:this.state.sub_code,
    sub: this.getsubject(this.state.sub_code),
})
}

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

 



close = () => {
  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
  .child(this.state.key)
  .update({closed:true});

    this.setState({button_close:'Closed'});

    if(this.props.navigation.state.params.go == 'sub'){
      this.props.navigation.navigate('teacherSubject',{
      sub_code:this.state.sub_code,
      sub: this.getsubject(this.state.sub_code),
})
}else{
this.props.navigation.navigate('doubt',{
  sub_code:this.state.sub_code,
  sub: this.getsubject(this.state.sub_code),
})
}

}


  render () {
    return (

        <Container>

<Content >
          <Header>

        <Body>
          <Title>Header</Title> 
        </Body>
        <Right>
          <Button onPress={() => { 
             Alert.alert('Close','No Reply after closed !!',
             [{
               text:'Close',
               onPress:() => this.close()
             },
             {
             text: 'Cancel',
             style: 'cancel'
           }
             ]);            
            
          }} >
            <Text style={{color:'red'}}>{this.state.button_close}</Text>
          </Button>
        </Right>
       </Header> 

       <Card>
            <CardItem header bordered>
    <Text>{this.state.name}</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                 {this.state.doubt}
                </Text>
              </Body>
            </CardItem>
            <CardItem footer bordered>
    <Text note >{new Date(this.state.time).toUTCString().replace('GMT','')}</Text>
            </CardItem>
          </Card>

          <Separator><Text>Replies</Text></Separator>

<ScrollView>

  {this.state.data.map((data) => {

    if(data.email != this.state.email){
  return(

    <Card>

    <CardItem >
      <Body>
        <Text>
         {data.reply}
        </Text>
      </Body>
    </CardItem>
    <CardItem footer >
   <Text note >{new Date(data.time).toUTCString().replace('GMT','')}</Text>
    </CardItem>
  </Card>   

  );
    }else {
      return(
        <Card>

        <CardItem header bordered>
        <Text>You</Text>
       </CardItem>

       <CardItem bordered>
         
         <Body>
           <Text>
            {data.reply}
           </Text>
         </Body>
       </CardItem>
       <CardItem footer >
      <Text note >{new Date(data.time).toUTCString().replace('GMT','')}</Text>
       </CardItem>
     </Card>  
      );
    }
})}
       
</ScrollView>
  
          <Item rounded > 

            <Input placeholder='Reply' onChangeText={(text) => this.setState({reply:text})} />

            <Text style={{marginRight:20,color:'blue',fontWeight:'bold',marginLeft:5}} onPress={() => {
              if(this.state.reply != '')
              this.sendReply();
              else
                alert('Nothing to reply');
              
              }}>Send</Text>

          </Item>
        </Content>
        
      </Container>
    )
  }
}


