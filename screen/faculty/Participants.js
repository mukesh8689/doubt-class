
import React ,{Component} from 'react';
import { Text,Container,Left,Body,Button,Separator,Header,Drawer,Icon,Title,ListItem,Right,SwipeRow,View} from 'native-base';
import { AsyncStorage, Alert } from 'react-native';
import firebase from 'firebase';
import DrawerContent from './Drawer.js';
import FooterContent from './Footer.js';
import { ScrollView } from 'react-native-gesture-handler';

class  Participants extends Component{

state = {
    drawer:false,
    request:[],
    code:this.props.navigation.state.params.sub_code,
    subject:this.props.navigation.state.params.sub,
    email:'',   
    participant:[],
    faculty_name:'',
}

componentDidMount(){
        this.setemail();
        this.setName();

    setInterval(() => {
      this.fetch();
      this.fetch2()
    },1000);
}


ControlPanel = () => {
    if(!this.state.drawer)
      this.setState({drawer:true})
      else
          this.setState({drawer:false})
}


setemail = async () =>  this.setState({email:await AsyncStorage.getItem('email')});



setName = async () => this.setState({faculty_name:await AsyncStorage.getItem('name')})


fetch = () => {

    firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.code + '/Request')
    .on('value',data => {

      if(data.val())
        {
            var x = Object.values(data.val());
            this.setState({request:x});
        }else{
            let x=[];
            this.setState({request:x});
        }
    })
}



fetch2 = () => {


  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.code + '/Participants')
  .on('value',data => {
      if(data.val())
      {
      var x = Object.values(data.val());
      this.setState({participant:x});
      }else{
          var x = [];
          this.setState({participant:x});
      }
  });

}



add = (name,email) => {
    
    firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.code + '/Participants')
    .push({
        Name:name,
        Email:email,
    });

    this.reject(email);
    this.addStudent(email);
}


addStudent = (email) => {
  firebase.database().ref('Student/' + email.replace('.','') + '/Subject/' + this.state.subject)
  .push({
      faculty:this.state.faculty_name,
      faculty_mail:this.state.email,
      subject:this.state.subject,
      code:this.state.code,
  });
}

 

reject = (email) => {

    firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.code + '/Request')
    .orderByChild('email')
    .equalTo(email)
    .on('value',data => {
        if(data.val()){
        var x = Object.keys(data.val());
        firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.code + '/Request/' + x)
        .remove();
        }
    })

}

remove = (student_mail) => {

  firebase.database().ref('Student/' + student_mail.replace('.','') + '/Subject/' + this.state.subject)
  .remove();

  firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.code + '/Participants')
  .orderByChild('Email')
  .equalTo(student_mail)
  .on('value',data => {
        if(data.val()){
          var x = Object.keys(data.val());
          firebase.database().ref('Faculty/' + this.state.email.replace('.','') + '/code/' + this.state.code + '/Participants/' + x['0'])
          .remove()
        }
  })
}


render(){
return(

    <Container>
   

   <Header>
        <Left>
          <Button transparent onPress={() => this.ControlPanel()}>
            <Icon name='menu' />
            <Title style={{marginLeft:20}}>Participants</Title>
          </Button>
        </Left>
        <Body>
        </Body>
       </Header> 
       
    <Drawer
        content={<DrawerContent screen={this.props.navigation} close={() => this.setState({drawer:false})} />}
        open={this.state.drawer}
        tapToClose={true}
        openDrawerOffset={0.3}
        >


<ScrollView>

<Separator>
<Text>Request</Text>
</Separator>

{this.state.request.map(data => {
    return(

        <ListItem>
          <Left>
              <Text>{data.Name}</Text>
          </Left>
          <Right style={{flexDirection:'row',marginRight:10}}>
                 <Button style={{height:30,width:50,marginRight:7,borderRadius:10,backgroundColor:'green'}} onPress={() => this.add(data.Name,data.email)}>
                <Icon name='add' />
                </Button>

                <Button style={{height:30,width:50,marginRight:5,borderRadius:10,backgroundColor:'red'}} onPress={() => this.reject(data.email)}>
                <Icon name='remove' />
                </Button>
          </Right>
        

        </ListItem>
    );
})}

<Separator>
<Text>Participants</Text>
</Separator>


{this.state.participant.map(data => {

    return(

        <SwipeRow
        leftOpenValue={75}
        rightOpenValue={-75}
        left={
          <Button success onPress={() => {
            Alert.alert('Email',data.Email)
          }}>
            <Icon active name="information-circle" />
          </Button>
        }
        body={
          <View>
            <Text style={{marginLeft:30}}>{data.Name}</Text>
          </View>
        }
        right={
          <Button danger onPress={() => {
            Alert.alert('Remove','Participant no longer able to ask !!',[
              {
                text:'Remove',
                onPress:() => this.remove(data.Email),
              },
              {
                text:'Cancel',
                style:'cancel'
              }
            ])
            }}>
            <Icon active name="trash" />
          </Button>
        }
      />
    );
})}
</ScrollView>

<FooterContent 
        sub_code={this.props.navigation.state.params.sub_code} 
        sub={this.props.navigation.state.params.sub} 
        screen={this.props.navigation}
        active='part'
        />

</Drawer>


  </Container>


);

}
}


export default Participants


