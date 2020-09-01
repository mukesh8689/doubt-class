import React, { Component } from 'react';
import {Footer, FooterTab, Button, Icon, Text} from 'native-base';


export default class FooterContent extends Component {

  state={
    home:false,
    doubt:false,
    part:false,
  }


 componentDidMount(){
   
   if(this.props.active == 'doubt')
    this.setState({doubt:true})
    else if (this.props.active == 'part')
        this.setState({part:true})
        else 
          this.setState({home:true})
 }


  render() {
    return (
        <Footer >
          <FooterTab tabBarTextColor="red" tabBarActiveColor="yellow" tabActiveBgColor="green"  >

            <Button  active={this.state.home} onPress={() => this.props.screen.replace('teacherSubject',{
              sub_code:this.props.sub_code,
              sub:this.props.sub,
            })}>
              <Icon name="apps" />
            </Button>

            <Button  active={this.state.doubt} onPress={() => this.props.screen.replace('doubt',{
              sub_code:this.props.sub_code,
              sub:this.props.sub,
            })}>
              <Icon name="help" />
              <Text>Doubt</Text>
            </Button>

            <Button active={this.state.part} onPress={() => this.props.screen.replace('participants',{
              sub_code:this.props.sub_code,
              sub:this.props.sub,
            })}>
              <Icon active name="people" />
              <Text>Participants</Text>
            </Button>


          </FooterTab>
        </Footer>
    );
  }
}

