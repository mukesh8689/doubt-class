import React, { Component } from 'react';
import { Footer, FooterTab, Button, Icon, Text} from 'native-base';


export default class FooterContent extends Component {

  state={
    home:false,
    doubt:false,
  }


  componentDidMount(){
    
    if(this.props.active == 'home')
    {
      this.setState({home:true});
    }
       if(this.props.active == 'doubt'){
        this.setState({doubt:true});
       }
  }

  render() {
    return (

        <Footer>
          <FooterTab>

            <Button  active={this.state.home} onPress={() => this.props.screen.replace('studentSubject',{
              sub_code:this.props.sub_code,
              faculty_email:this.props.faculty_email,
            })}>  
              <Icon name="apps" />
              <Text>Home</Text>
            </Button>

            <Button active={this.state.doubt} onPress={() => this.props.screen.replace('studentDoubt',{
              sub_code:this.props.sub_code,
              faculty_email:this.props.faculty_email,
            })}>
              <Icon name="camera" />
              <Text>Doubt</Text>
            </Button>

          </FooterTab>
        </Footer>
    );
  }
}