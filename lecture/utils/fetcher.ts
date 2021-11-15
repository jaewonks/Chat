import axios from 'axios';

const fetcher = (url: string) => 
  axios
    .get(url, {
      withCredentials: true, //cookie info
    })
    .then((response) => response.data);

export default fetcher;
