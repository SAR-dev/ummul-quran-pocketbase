// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBskbVftQ1IZhJraIn1yPnDeJ5TraJ_10Y",
  authDomain: "notify-80486.firebaseapp.com",
  projectId: "notify-80486",
  storageBucket: "notify-80486.firebasestorage.app",
  messagingSenderId: "872246094847",
  appId: "1:872246094847:web:8934b937900d2cca4855ca",
  measurementId: "G-80YFMES3Q5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const generateNotificationToken = async () => {
  const permission = await Notification.requestPermission()
  if(permission == "granted"){
    const token = await getToken(messaging, {
      vapidKey: "BN6RS95xnBaqqczxiv4Js5EG24eQsVFuk6l8vjWCzyljHlfwutHk6C6tZcdb8iGiQ57Y4jueT5J_xRYHCo1Bgbs"
    })
    console.log(token)
  }
}