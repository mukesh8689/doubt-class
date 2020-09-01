
import React ,{Component} from 'react';
import { Text,Container,Button,Separator,Header,Input,Item, Content} from 'native-base';
import firebase from 'firebase';
import { AsyncStorage } from 'react-native';



class  Password extends Component{


    state={
        new_pass:'',
        conf_new_pass:'',
    }   

componentDidMount(){
    var user = firebase.auth().currentUser;
        if(!user){
            this.props.navigation.replace('home');
            alert('Login Again');
        }
}


change = () => {

    if(this.state.new_pass != '' && this.state.conf_new_pass != ''){
            if(this.state.new_pass == this.state.conf_new_pass){

                var user = firebase.auth().currentUser;
                user.updatePassword(this.state.new_pass)
                .then(() => {
                    AsyncStorage.setItem('email','');
                    AsyncStorage.setItem('type','');
                    firebase.auth().signOut()
                    .then(() => {
                        this.props.navigation.navigate('home');
                        alert('password updated!! Login Again');
                    })
                }).catch((e) => alert('error in updating password'))

            }else{
                alert('check new password');
            }
    }else{
        alert('fill all the info');
    }
}



render(){
    return(
        <Container>
        <Header />
    
         <Content>

    
          <Separator>
              <Text>New Password</Text>
        </Separator>
    
          <Item >
            <Input placeholder='new password' onChangeText={(text) => this.setState({new_pass:text})} />
          </Item>
    
        <Separator>
        <Text>Confirm New Password</Text>
        </Separator>
    
    
        <Item >
            <Input placeholder='new password' onChangeText={(text) => this.setState({conf_new_pass:text})} />
          </Item>

          <Separator></Separator>

        <Button  block success  onPress = {() => this.change()}>
            <Text>Join</Text>
        </Button>
          </Content>
      </Container>
       );
    }

}

export default Password