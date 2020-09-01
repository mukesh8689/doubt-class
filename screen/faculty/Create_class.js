
import React ,{Component} from 'react';
import { Text,Container,Button,Separator,Item,Header,Content,Input} from 'native-base';
import { AsyncStorage } from 'react-native';
import firebase from 'firebase';
  

class  CreateClass extends Component{

state = {
    subject:'',
    code:'',
    email:'',
}

componentDidMount(){
        this.setemail();
}

setemail = async () => this.setState({email:await AsyncStorage.getItem('email')})


onCreate = () => {

  if(this.state.subject != '' && this.state.code != ''){
    firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code')
    .child(this.state.code)
    .push({
        code:this.state.code,
        subject:this.state.subject
    });
    
    this.props.navigation.navigate('teacherHome');
  }else{
    alert('Incomplete Info');
  }
}

render(){
return(

    <Container>
    <Header />

 

    <Content>

    <Separator>
        <Text>Enter the Subject</Text>
    </Separator>

      <Item>
        <Input placeholder='Subject' onChangeText={(text) => this.setState({subject:text})} />
      </Item>

      <Separator>
          <Text>Enter Code</Text>
    </Separator>

      <Item >
        <Input placeholder='Code' onChangeText={(text) => this.setState({code:text})} />
      </Item>

    <Separator></Separator>

    <Button  block success  onPress = {() => this.onCreate()}>
        <Text>Create</Text>
    </Button>
      
    </Content>
  </Container>


);

}

}

export default CreateClass
