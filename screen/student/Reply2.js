import React, { Component } from 'react';
import { Text,Container,Left,Body,Content, Card, CardItem, Separator} from 'native-base';
import {AsyncStorage } from 'react-native';
import firebase from 'firebase';
import { ScrollView } from 'react-native-gesture-handler';

 
export default class Reply2 extends Component {  

    state={
        drawer:false,
        time: this.props.navigation.state.params.time,
        doubt: this.props.navigation.state.params.doubt,
        sub_code: this.props.navigation.state.params.sub_code,
        topic:this.props.navigation.state.params.topic,
        data:[],
        faculty_email:this.props.navigation.state.params.faculty_email,
        faculty_name:'',
    }
    

    componentDidMount(){
      this.getEmail();
      this.getfacultyname();
      setTimeout(() => {
        this.fetch();
      },0)
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




  render () {
    return (

        <Container>

<Content>

       <Card>
            <CardItem header bordered>
    <Text>{this.state.topic}</Text>
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

if(data.email != this.state.faculty_email){
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
    <Text>{this.state.faculty_name}</Text>
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
</Content>

      </Container>
    )
  }
}


