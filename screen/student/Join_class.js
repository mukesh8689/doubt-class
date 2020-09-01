
import React ,{Component} from 'react';
import { Text,Container,Button,Separator,Header,Input,Item, Content} from 'native-base';
import {AsyncStorage} from 'react-native';
import firebase from 'firebase';


class  JoinClass extends Component{


    state={
        faculty_email:'',
        email:'',
        code:'',
        Name:'',
    }   

componentDidMount(){
    setInterval(() => {
        this.setemail();
    },1000);
}

setemail =async () => {

    this.setState({email:await AsyncStorage.getItem('email')});

    firebase.database().ref('Student/' + this.state.email.replace('.',''))
    .on('value' , data => {
        if(data.val()){
        var x = Object.values(data.val());
        this.setState({Name:x['0'].Name});
        }
    })
}


onJoin = () => {

if(this.state.faculty_email != '' && this.state.code != ''){

        firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.',''))
        .once('value',data => {
                if(!data.val()){
                    alert('incorrect email');
                }else{
                    firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.code)
                    .once('value',data => {
                            if(!data.val()){
                                alert('incorrect code');
                            }else{
                                this.checkDublicate();
                            }
                    })
                }
        })
    }else{
        alert('Incomplete info');
    }
}


checkDublicate = () => {

    firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.code + '/Participants')
    .orderByChild('Email')
    .equalTo(this.state.email)
    .once('value',data => {
            if(data.val()){
                alert('already a participant');
            }else{

                firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.code + '/Request')
                .orderByChild('email')
                .equalTo(this.state.email)
                .once('value',data => {
                        if(data.val()){
                            alert('already requested');
                        }else{
                            this.sendReq();
                        }

                })
            }
    })
}


sendReq(){
    firebase.database().ref('Faculty/' + this.state.faculty_email.replace('.','') + '/code/' + this.state.code)
    .child('Request')
    .push({
        Name:this.state.Name,
        email:this.state.email,
    })

    this.props.navigation.navigate('studentHome');
    alert('Join Request Sent');
}



render(){
    return(
        <Container>
        <Header />
    
         <Content>
        <Separator>
            <Text>Enter the faculty's email</Text>
        </Separator>
    
          <Item>
            <Input placeholder='email id' onChangeText={(text) => this.setState({faculty_email:text})} />
          </Item>
    
          <Separator>
              <Text>Enter Code</Text>
        </Separator>
    
          <Item >
            <Input placeholder='Code' onChangeText={(text) => this.setState({code:text})} />
          </Item>
    
        <Separator></Separator>
    
        <Button  block success  onPress = {() => this.onJoin()}>
            <Text>Join</Text>
        </Button>
          </Content>
      </Container>
       );
    }

}

export default JoinClass