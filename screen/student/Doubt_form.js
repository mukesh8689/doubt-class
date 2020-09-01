import React, { Component } from 'react';
import { Container, Header, Content, Item, Input,Form,Textarea, Button ,Text} from 'native-base';
import {AsyncStorage} from 'react-native';
import firebase from 'firebase';

export default class DoubtForm extends Component {

    state={
        topic:'',
        doubt:'', 
        email:'',
        name:'',
        faculty_email:this.props.navigation.state.params.faculty_email,
        sub_code:this.props.navigation.state.params.sub_code,
    }

    componentDidMount(){
        this.getmail();
        setInterval(() => {
            firebase.database().ref('Student/' + this.state.email.replace('.',''))
            .on('value',data => {
                if(data.val()){
                    var x = Object.values(data.val());
                    var y = x['0'].Name;
                    this.setState({name:y});
                }
            })
        },1000)
    }


  getmail = async () => this.setState({email:await AsyncStorage.getItem('email')});


sentComment = () => {

    if(this.state.topic != '' && this.state.doubt != ''){

        firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.sub_code + '/comment')
        .push({
            topic:this.state.topic,
            doubt:this.state.doubt,
            email:this.state.email,
            name:this.state.name,
            time:Date.now(),
            replied:false,
            closed:false,
        });

        this.props.navigation.navigate('studentSubject',{
            sub_code:this.state.sub_code,
            faculty_email:this.state.faculty_email,
        });
        
        alert('doubt sent');
    }else{
        alert('need to fill both');
    }

}


  render() {
    return (

      <Container>
        <Header />
        <Content padder>

          <Item rounded>
            <Input placeholder='Topic' onChangeText={(text) => this.setState({topic:text})} />
          </Item>

          <Form style={{marginTop:10 }}>
            <Textarea rowSpan={7} bordered  onChangeText={(text) => this.setState({doubt:text})} />
          </Form>
          
     
          <Button  block success style={{marginTop:20}}  onPress={() => this.sentComment()}>
            <Text>send</Text>
        </Button>

        </Content>
      </Container>
 
    );
  }
}