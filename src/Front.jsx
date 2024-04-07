import aero from "./aero.png";
import "./Front.css";
import { io } from "socket.io-client";
import { createElement, useRef } from "react";
import { useEffect } from "react";

function App() {
  //pointer
  let cursor = `<img id='pointer' src=${aero} alt=""/>`;

  let Client = io("http://localhost:5000");

  //================on mouse over================================
  window.addEventListener("mouseover", () => {
    Client.emit("pointerEnter");
  });

  //===============on mouse out=======================================
  window.addEventListener("mouseout", () => {
    Client.emit("pointerOut");
  });
  //=================on write==========================================
  let txt = useRef();
  let input = () => {
    Client.emit("MonitorText")
    localStorage.setItem("Text", txt.current.value);
    Client.emit("SettingText");
  };

  window.onbeforeunload = function () {
    return "Data will be lost if you leave the page, are you sure?";
  };
  //-------------------On Select Text-------------------------------

  let getSelectedText = () => window.getSelection().toString();
  let text = document.getElementById("myText");

  function modernFontColor(str, color) {
    return '<span style="color: ' + color + '">' + str + "</span>";
  }

  window.addEventListener("select", () => {
    let text = modernFontColor(getSelectedText(), "Red");

    Client.emit("textSelect", text);
  });
  //-----------------TextSelected------------------------------
  Client.on("TextSelect", (getText) => {
    document.getElementById("h3").innerHTML = getText;
  });
  //----------------------------------------------------------

// TextChanging------------------------------------------------



// if(txt.current.value.length>1||txt.current.value.length>0){
// Client.emit("MonitorText")

// }
Client.on("Monitor-Text",async()=>{
  let h2=await document.createElement("h2")
await  h2.setAttribute("id","editor")
  let root= document. getElementById("root")
   h2.innerHTML = localStorage.getItem("TextEditor")
  root.appendChild(h2)

setTimeout(()=>{
  

root.removeChild(root.lastElementChild);
},2000)

})




  let User_List = [];
  var num = 0;
  localStorage.setItem("num", JSON.stringify(num));

  Client.on("ID", (UserName) => {
    User_List[+localStorage.getItem("num")] = UserName;

    num++;
    console.log(num);

    localStorage.setItem("userlist", JSON.stringify([...User_List]));
    loopName();

    function loopName() {
      let userLocal = localStorage.getItem("userlist");
      if (userLocal.length > 0) {
        var userlist = JSON.parse(userLocal);
      }

      let arr = [...userlist];

      for (let i = 0; i < arr.length; i++) {
        console.log("run");

        document
          .getElementById("user")
          .insertAdjacentHTML(
            "afterbegin",
            `<li>${arr[i]} is Joined the Meeting</li>`
          );
      }
    }
  });

  //---------------------------------------------------------------

  Client.on("SetText", () => {
    txt.current.value = localStorage.getItem("Text");
  });

  document.getElementById("body").insertAdjacentHTML("afterbegin", cursor);

  window.addEventListener("mousemove", (event) => {
    let x = event.clientX; //value 255...
    let y = event.clientY; //value 264..

    Client.emit("cursor", [x, y]); //sending
  });

  //================on mouse over================================

  let point2 = document.getElementById("pointer");
  Client.on("mouseEnter", () => {
    point2.style.display = "none";
  });
  //===============on mouse out=======================================
  let point3 = document.getElementById("pointer");
  Client.on("mouseOut", () => {
    point3.style.display = "list-item";
  });

  let point = document.getElementById("pointer");
  Client.on("pointer", (pointer) => {
    //receiving

    point.style.left = pointer[0] + "px";
    point.style.top = pointer[1] + "px";
  });

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let input = document.getElementById("name").value;
          Client.emit("UserJoined", input);
          
        }}
      >
        <label htmlFor="name">Name:</label>
        <input id="name" placeholder="Type Your Name" type="text" />
        <button type="submit"></button>
      </form>
      <textarea 
        id="myText"
        style={{
          fontSize: "25px",
          height: 500 + "px",
          width: 500 + "px",
          border: "5px solid black",
        }}
        ref={txt}
        onChange={()=>{input()
          let input2 = document.getElementById("name").value;
          localStorage.setItem("TextEditor",input2)
        }}
        
      ></textarea>
      <h3 id="h3"></h3>
      <ol type="number" id="user"></ol>

     
    </>
  );
}

export default App;
