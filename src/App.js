import logo from './logo.svg';
import './App.css';
import React, { useEffect, useRef, useState } from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyDRoYLcbNA7AudMEt3R0IFGBgS62me6n9c",
    authDomain: "bhaicharafc.firebaseapp.com",
    databaseURL: "https://bhaicharafc.firebaseio.com",
    projectId: "bhaicharafc",
    storageBucket: "bhaicharafc.appspot.com",
    messagingSenderId: "329196853880",
    appId: "1:329196853880:web:ef1dadbdebe6e7e1242b8d",
    measurementId: "G-SCP9SMBVDX"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [user] = useAuthState(auth);

  const [createdDate, setCreatedDate] = useState(1);

  return (
    <div className="App">
      <header>
        <h1><center>With &#10084;&#65039; from BhaicharaFC🔥</center></h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  /*const signInWithEmail = () => {
    const provider = new firebase.auth.signInWithEmailAndPassword();
    auth.signInWithPopup(provider);
  }*/
  return (
      <div>
      <button onClick={signInWithGoogle} style={{marginLeft: "200px",marginRight : "200px"}}>Sign in with Google</button>
      </div>
  )
}
function SignOut() {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}
function ChatRoom() {

  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt');

  
  const [messages] = useCollectionData(query, { idField: 'id' , createdAt : 'createdAt'});
  console.log(messages);
  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Enter Message" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)

}

function dateConvert(creadtedAt){
  var d = new Date(creadtedAt * 1000);
  return (d.toDateString("in").slice(4) + " @ "+ d.toLocaleTimeString().slice(0,4) + d.toLocaleTimeString().slice(7));
}
function ChatMessage(props) {
  const { text, uid, photoURL, createdAt} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  const messageside = messageClass === "sent" ? "right" : "left";

  
  return (<>

    <div className="ui container comments">
            <div className={`message ${messageClass}`}>
                <a href="/" className="avatar">
                    <img alt="avatar" src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}/>
                </a>
                <div className="content">
                    <p>
                      <div className="text">{text}</div>
                    </p>
                    
                </div>
            </div>
            <div className="metadata">
                <span style={{float:messageside, color: "darkgray"}}>{dateConvert(createdAt === null ? 1 : createdAt.seconds)}</span>
            </div>
    </div>


  </>)
}

export default App;
