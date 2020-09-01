import React from 'react';
import { Container, Tab, Tabs, TabHeading, Icon, Text , Form, Item, Input, Label ,Button } from 'native-base'; 
import {AsyncStorage} from 'react-native';
import * as firebase from 'firebase';



export default class  Login extends React.Component{

state={
    email:'',
    password:'',
    first_name:'',
    last_name:'',
    new_email:'',
    new_password:'',
    confirm_password:'',
    hide_password:true,
    pass_icon:'eye-off',
    signin_icon:'eye-off',
    signin_password:true,
} 

componentDidMount(){
}

signup(email,password) {

  if(this.state.first_name != '' && this.state.last_name != '' )
  {
    if(password === this.state.confirm_password)
    {
      firebase.auth().createUserWithEmailAndPassword(email,password)
      .then(() => this.props.navigation.replace('home'))
      .then(() => { 
        alert('account created');
          this.database_entry(email);
      })
      .catch(e => alert(e))  
    }else{ 
      alert('error in confirming password');
    }
  }else{
    alert('fill complete info');
  }
}


database_entry = (email) => {

  if(this.props.navigation.state.params.go == 'teacherHome')
  {
    firebase.database().ref('Faculty/').child(email.replace('.','')).push({
      Name : this.state.first_name + ' ' + this.state.last_name,
      email:email,
    })
  }else if(this.props.navigation.state.params.go == 'studentHome')
    {
      firebase.database().ref('Student/').child(email.replace('.','')).push({
        Name : this.state.first_name + ' ' + this.state.last_name,
        email:email,
      })
    }
}

signIn(email,password){

  firebase.auth().signInWithEmailAndPassword(email,password)
  .then(() => {
    this.checkMail(email);
  }
  )
  .catch(e => alert(e))

}


checkMail(email){

  if(this.props.navigation.state.params.go == 'teacherHome'){
    firebase.database().ref('Faculty/' + email.replace('.',''))
    .on('value',data => {
          if(data.val()){
            AsyncStorage.setItem('email',email);
            this.props.navigation.replace(this.props.navigation.state.params.go)
          }else{
            alert('Not included in Faculty Login');
          }
    })
  }else{

    firebase.database().ref('Student/' + email.replace('.',''))
    .on('value',data => {
          if(data.val()){
            AsyncStorage.setItem('email',email);
            this.props.navigation.replace(this.props.navigation.state.params.go)
          }else{
            alert('Not included in Student Login');
          }
    })
  }
  
}



hidePass(){
  if(!this.state.hide_password)
  {
    this.setState({hide_password:true});
    this.setState({pass_icon:'eye-off'});
  }else{
    this.setState({hide_password:false});
    this.setState({pass_icon:'eye'});
  }
}


signINPass(){
  if(!this.state.signin_password)
  {
    this.setState({signin_password:true});
    this.setState({signin_icon:'eye-off'});
  }else{
    this.setState({signin_password:false});
    this.setState({signin_icon:'eye'});
  }
}


  
render(){  

  return ( 

    <Container padder>
    <Tabs >
      <Tab heading={ <TabHeading><Icon name="camera" /><Text>Sign In</Text></TabHeading>}>

      <Form style={{margin:20}}>
            <Item floatingLabel>
              <Label>Email Id</Label>
              <Input onChangeText={(text) => this.setState({email:text})} />
            </Item>
            <Item floatingLabel last>
            <Icon name={this.state.signin_icon} onPress={() => this.signINPass()} />
              <Label>Password</Label>
              <Input onChangeText={(text) => this.setState({password:text})} secureTextEntry = {this.state.signin_password}/>
            </Item>
          </Form>

          <Button style={{marginTop:20,alignSelf:'center',width:200,justifyContent:'center'}} onPress={() => this.signIn(this.state.email,this.state.password)} >
              <Text>Login</Text>
          </Button>

      </Tab>


      <Tab heading={ <TabHeading><Icon name="apps" /><Text>Sign Up</Text></TabHeading>}>

      <Form style={{margin:20}}>
            <Item floatingLabel>
              <Label>First Name</Label>
              <Input onChangeText={(text) => this.setState({first_name:text})}/>
            </Item>
            <Item floatingLabel>
              <Label>Last Name</Label>
              <Input onChangeText={(text) => this.setState({last_name:text})}/>
            </Item>
            <Item floatingLabel>
              <Label>Email Id</Label>
              <Input onChangeText={(text) => this.setState({new_email:text})}/>
            </Item>
            <Item floatingLabel last>
              <Icon name={this.state.pass_icon} onPress={() => this.hidePass()} />
              <Label>Password</Label>
              <Input onChangeText={(text) => this.setState({new_password:text})} secureTextEntry = {this.state.hide_password}/>
            </Item>
            <Item floatingLabel>
              <Label>Confirm Password</Label>
              <Input onChangeText={(text) => this.setState({confirm_password:text})} secureTextEntry = {this.state.hide_password}/>
            </Item>
            
          </Form>

          <Button style={{marginTop:20,alignSelf:'center',width:200,justifyContent:'center'}} onPress={() => this.signup(this.state.new_email,this.state.new_password)}>
              <Text>Sign Up</Text>
          </Button>

      </Tab>
    </Tabs>
  </Container>

  );
}

}
