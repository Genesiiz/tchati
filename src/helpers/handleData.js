import axios from "axios";

export async function getData(url) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error(error);
  }
}

// Want to use async/await? Add the `async` keyword to your outer function/method.
export async function postData(url) {
  try {
    const response = await axios.post(url);
    return response;
  } catch (error) {
    console.error(error);
  }
}
