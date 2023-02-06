import axios from 'axios';
import { initializeApp } from "firebase/app";
// eslint-disable-next-line
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import { api } from '../constants';
import useAuth from '../hooks/useAuth';

const firebaseConfig = {
  apiKey: "AIzaSyDfajswjeDVGFnJ_upvhQWr6lrO2E1FLGw",
  authDomain: "itjobmatching.firebaseapp.com",
  projectId: "itjobmatching",
  storageBucket: "itjobmatching.appspot.com",
  messagingSenderId: "908502804981",
  appId: "1:908502804981:web:09ce0a6187950403b418bc",
  measurementId: "G-E498V9XVJS"
};

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);



export const subscribeToTopic = (topicName) => {
  getToken(messaging, { vapidKey: 'BMzTceLBUaJyznH-J0D34wQIkBeoieNFWXZMkNNsYj3kbVvY7Qp9-edlS1NRn6_Y9scZdG2ru35q21wjTfAtel0' }).then((currentToken) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_SUBSCRIBE_TOPIC}?topic=${topicName}`,
      method: 'POST',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // },
      data: [currentToken]
    }).then(() => console.log(`subscribe to ${topicName} topic successfully`))
      .catch((error) => console.log(error));
  }).catch(error => console.log(error));
};



export const unSubscribeToTopic = (topicName) => {
  getToken(messaging, { vapidKey: 'BMzTceLBUaJyznH-J0D34wQIkBeoieNFWXZMkNNsYj3kbVvY7Qp9-edlS1NRn6_Y9scZdG2ru35q21wjTfAtel0' }).then((currentToken) => {
    axios({
      url: `${api.baseUrl}/${api.configPathType.api}/${api.versionType.v1}/${api.POST_UNSUBSCRIBE_TOPIC}?topic=${topicName}`,
      method: 'POST',
      // headers: {
      //   Authorization: `Bearer ${token}`
      // },
      data: [currentToken]
    }).then(() => console.log(`unsubscribe to ${topicName} topic successfully`))
      .catch((error) => console.log(error));
  }).catch(error => console.log(error));
};

// export const onMessageListener = () => {
//   onMessage(messaging, (payload) => {
//     console.log('Message received: ', payload);
//     return payload;
//   });
// };

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received: ", payload);
      resolve(payload);
    });
  });