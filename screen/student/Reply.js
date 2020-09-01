import React, { Component } from 'react';
import { Text,Header,Title,Container,Body,Button,Content, Card, CardItem, Right,Footer,Item,Input, Separator} from 'native-base';
import {AsyncStorage ,Alert} from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

 
export default class Reply extends Component {  

    state={
        drawer:false,
        time: this.props.navigation.state.params.time,
        doubt: this.props.navigation.state.params.doubt,
        sub_code: this.props.navigation.state.params.sub_code,
        data:[],
        reply:'',
        faculty_email:this.props.navigation.state.params.faculty_email,
        faculty_name:'',
        email:'',
        key:'',
        button_close:'Close',
    }
    

    componentDidMount(){
      this.getEmail();
      this.getfacultyname();
      setInterval(() => {
        this.fetch();
      },1000)
    }


getEmail =async () => this.setState({email:await AsyncStorage.getItem('email')})


getfacultyname  = () => {

    firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.',''))
    .orderByChild('Name')
    .on('value',data => {
        if(data.val()){
            var x = Object.values(data.val());
            var y = x['0'].Name;
            this.setState({faculty_name:y});
        }
    })
}


fetch = () => {

  firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
  .orderByChild('time')
  .equalTo(this.state.time)
  .on('value',data => {
      if(data.val()){
        var x = Object.keys(data.val());
        var y = x['0']; 
        this.setState({key:y});
        firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment/' + y + '/Reply')
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

  if(this.state.reply != ''){

  firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment/' + this.state.key + '/Reply')
  .push({
    reply:this.state.reply,
    email:this.state.email,
    time:Date.now(),
  });

  this.props.navigation.replace('studentSubject',{
    sub_code:this.state.sub_code,
    faculty_email:this.state.faculty_email,
  });

}else{
  alert('Nothing to reply');
}

}


close = () => {
    firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
    .child(this.state.key)
    .update({closed:true});
  
      this.setState({button_close:'Closed'});

      this.props.navigation.replace('studentSubject',{
        sub_code:this.state.sub_code,
        faculty_email:this.state.faculty_email,
      });
  }
  



  render () {
    return (

        <Container>

<Content>
          <Header>
        <Body>
          <Title>Header</Title>
        </Body>
        <Right>
          <Button  onPress={() => {
             Alert.alert('Close','No Reply after Closed!!',
             [{
               text:'Close',
               onPress:() => this.close()
             },
             {
             text: 'Cancel',
             style: 'cancel'
           }
             ]);            
            
          }}>
    <Text style={{color:'red'}}>{this.state.button_close}</Text>
          </Button>
        </Right>
       </Header> 

       <Card>
            <CardItem header bordered>
    <Text>You</Text>
            </CardItem>
            <CardItem bordered>
              <Body>
                <Text>
                 {this.state.doubt}
                </Text>
              </Body>
            </CardItem>
            <CardItem footer bordered>
    <Text>{new Date(this.state.time).toUTCString().replace('GMT','')}</Text>
            </CardItem>
          </Card>
          <Separator><Text>Replies</Text></Separator>

<ScrollView>

          {this.state.data.map((data) => {

if(data.email != this.state.email){
return(

<Card>

 <CardItem header bordered>
    <Text>{this.state.faculty_name}</Text>
   </CardItem>

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

            <Text style={{marginRight:20,color:'blue',fontWeight:'bold',marginLeft:5}} onPress={() => this.sendReply()}>Send</Text>

          </Item>
        </Content>

      </Container>
    )
  }
}


