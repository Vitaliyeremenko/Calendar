import axios from 'axios';

const instance = axios.create({
  baseURL : 'https://calendar-c3184.firebaseio.com/'
});

export default instance;