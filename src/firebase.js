import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDe7tQwIh9Y8SqEbLLdwmk8sBJDGGrsOhs",
  authDomain: "user-964be.firebaseapp.com",
  databaseURL: "https://user-964be-default-rtdb.firebaseio.com",
  projectId: "user-964be",
  storageBucket: "user-964be.appspot.com",
  messagingSenderId: "484398959119",
  appId: "1:484398959119:web:43eaf21d047548f2a4b17a",
  measurementId: "G-YK7ZE4BDRG"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firebaseDb = getDatabase(app);

const logInWithEmailAndPassword = async (email, password, navigate) => {
  try {
    await signInWithEmailAndPassword(auth, email, password).then(async e => {
      localStorage.setItem('isAuth', 'true')
      localStorage.setItem('user', JSON.stringify(e?.user))

      const docRef = doc(db, "users", e.user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        localStorage.setItem('role',docSnap.data().role);
        if(docSnap.data().role == "admin"){
          navigate("/dashboard")
        }
        else{
          navigate("/dashboard")
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

      // const q = query(collection(db, "users"), where("role=admin", "===",true ));
      // const querySnapshot = await getDocs(q);
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, " => ", doc.data());
      // });


      
    }).catch(err => alert(err.message))
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerWithEmailAndPassword = async (name, email, password, navigate) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password).then(async (e) => {
      localStorage.setItem('isAuth', 'true')
      localStorage.setItem('user', JSON.stringify(e?.user))
      const user = e?.user;
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name,
        authProvider: "local",
        email,
        onlineState: "",
        role: "admin"
      });
      navigate('/dashboard')
    }).catch(err => alert(err.message))
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const sendPasswordReset = async (email, navigate) => {
  try {
    await sendPasswordResetEmail(auth, email).then(e => {
      alert("Password reset link sent!");
      navigate('/')
    }).catch(err => console.log("rest error", err))

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const logout = () => {
  return signOut(auth).then(e => {
    localStorage.clear()
  }).catch(err => console.log("signout error", err))
};
export {
  auth,
  db,
  firebaseDb,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};