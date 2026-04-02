import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDbT9PXXLn3xpeuPeb3dRlVO6aKroSqslo",
  authDomain: "todo-app-29822.firebaseapp.com",
  projectId: "todo-app-29822",
  storageBucket: "todo-app-29822.firebasestorage.app",
  messagingSenderId: "250040465413",
  appId: "1:250040465413:web:5b49d1ac5238607774046c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);