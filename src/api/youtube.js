import axios from "axios";
const KEY = "AIzaSyD8s5VgKTksUB9gZ0kQZ17q6lVu162FuOI";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResult: 1,
    key: KEY,
  },
  headers: {},
});
