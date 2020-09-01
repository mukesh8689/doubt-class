import {createStackNavigator} from 'react-navigation-stack';
import {createAppContainer} from 'react-navigation';

import Login from './screen/Login.js';
import Home from './screen/Home.js';

import TeacherHome from './screen/faculty/Home.js';
import TeacherSubject from './screen/faculty/Subject.js';
import TeacherDrawer from './screen/faculty/Drawer.js';
import CreateClass from './screen/faculty/Create_class.js';
import Participants from './screen/faculty/Participants.js';
import Doubt from './screen/faculty/Doubt.js';
import TeacherReply from './screen/faculty/Reply.js';
import TeacherReply2 from './screen/faculty/Reply2.js';
import TeacherSetting from './screen/faculty/Setting.js';
import TeacherPassword from './screen/faculty/Password.js';

import StudentHome from './screen/student/Home.js';
import StudentSubject from './screen/student/Subject.js';
import StudentDrawer from './screen/student/Drawer.js';
import JoinClass from './screen/student/Join_class.js';
import StudentDoubt from './screen/student/Doubt.js';
import DoubtForm from './screen/student/Doubt_form.js';
import StudentReply from './screen/student/Reply.js';
import StudentReply2 from './screen/student/Reply2.js';
import StudentSetting from './screen/student/Setting.js';

const AppNavigator = createStackNavigator({
login:Login,
home:Home, 
teacherHome:TeacherHome,
teacherSubject:TeacherSubject,
teacherDrawer:TeacherDrawer,
studentHome:StudentHome,
studentSubject:StudentSubject,
studentDrawer:StudentDrawer,
createClass:CreateClass,
joinClass:JoinClass,
participants:Participants,
doubt:Doubt,
studentDoubt:StudentDoubt,
doubtForm:DoubtForm,
studentReply:StudentReply,
teacherReply:TeacherReply,
studentReply2:StudentReply2,
teacherReply2:TeacherReply2,
teacherSetting:TeacherSetting,
studentSetting:StudentSetting,
teacherPassword:TeacherPassword,
},
{
  initialRouteName:'home',
  defaultNavigationOptions:{
    header:null
  }
}
);

export default createAppContainer(AppNavigator);
