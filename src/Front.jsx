import aero from "./aero.png";
import "./Front.css";
import { io } from "socket.io-client";
import { createElement, useRef } from "react";
import { useEffect } from "react";
import deleteSlide from './icons/delete-slide.png';
import Slide from './icons/slide.png';
import fontSize from './icons/font-size.png';
import fontWeight from './icons/font-weight.png' ;
import textTransform from './icons/text-transform.png';

function App() {
  //pointer
  let cursor = `<img id='pointer' src=${aero} alt=""/>`;

  let Client = io("https://text-editor-server-oaxm.vercel.app/");
  
  //================on mouse over================================
  window.addEventListener("mouseover", () => {
    Client.emit("pointerEnter");
  });

  //===============on mouse out=======================================
  window.addEventListener("mouseout", () => {
    Client.emit("pointerOut");
  });
  //=================on write==========================================
  //////////////////////////////////////////////////////////////////////
 
  
  
  ///////////////////////////////////////////////////////////////////////
  window.onbeforeunload = function () {
   return "Data will be lost if you leave the page, are you sure?";
  };
  //-------------------On Select Text-------------------------------
  
  let getSelectedText = () => window.getSelection().toString();
  let text = document.getElementById("myText");
  
  function modernFontColor(str, color) {
    return '<h6 style="margin: 0.5%;  overflow-wrap:break-word;width: 50vw;color: ' + color + '">' + str + "</h6>";
  }

  window.addEventListener("select", () => {
    let text = modernFontColor(getSelectedText(), "Red");
    
    Client.emit("textSelect", text);
  });
  //-----------------TextSelected------------------------------
  Client.on("TextSelect", (getText) => {
    document.getElementById("Textselect").innerHTML = getText;
  });
  //----------------------------------------------------------

  // TextChanging------------------------------------------------
  
  Client.on("Monitor-text", async () => {
    console.log("start")
    let span = await document.createElement("span")
    await span.setAttribute("id", "editor");
    let editor = document.getElementById("editor-container");
    
   
   editor.innerHTML=localStorage.getItem("TextEditor");
   console.log(editor.value)
    console.log("Monitor text")
    setTimeout(() => {
      editor.innerHTML=null
    }, 5000);
    
  });
  
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

  
  
 
  
  function Input(){
    Client.emit("MonitorText");
    localStorage.setItem("Text", document.getElementById(`myText`).value);
    Client.emit("SettingText");
    console.log("Input")
  };
  

  
  ///Event listner for changing text in each Slide---------------------------------------


   
    
    
    //------------------------------------------------------------------------------------------------------
    Client.on("SetText", () => {
      document.getElementById(`myText`).value = localStorage.getItem("Text");
      
    });
   
    
    let number=useRef('')
    
    let fontNum=document.getElementsByClassName("slide")
    Client.on("fontSize",()=>{
      
      fontNum[0].style.fontSize=+number.current.value+30+"px"
      
    })
    
  




useEffect(()=>{
  
 
  
  
  FontSize()
})
function FontSize() {
  Client.emit("FontSize")
}

return (
  <>
    <div id="nav-bar">
      
      
        <img style={{display:"block",marginRight: -27.7+"%"}} src={fontSize} alt="FontSize" />
        <input onClick={FontSize} ref={number}    style={{  fontSize:1.9+"vw", width:2.5+"vw",height:2.5+"vw"}} type="number" />
        <img  style={{display:"block", marginLeft:-2+"%" }} src={fontWeight} alt="FontWeight" />
     
        <img style={{display:"block",}} src={textTransform} alt="textTransform" />
        </div>

        <div id="nav-bar-name" >
       
    
        <h6 id="some-margin" >Font Size</h6>
        <h6 >Font Bold</h6>
        <h6 >FontStyle</h6>
        </div>
      
     <div  id="slide-box">
       <ol style={{position:"absolute",marginLeft:-26+"%"}} type="number" id="user">
    {/* joined user name in li */}
       </ol>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let input = document.getElementById("name").value;
          Client.emit("UserJoined", input);
        }}
      >
       
        <input style={{height:1.5+"vw",border:1+"px solid green",marginRight:1+"%",width: 10+"vw",fontSize:1+"vw"}} id="name" placeholder="Type Your Name" type="text" />
        <button type="submit" id="button-29" >Join</button>
      </form>
      <div style={{display:"flex",fontSize:1.5+"vw"}}>
     Selected Text:<p id="Textselect" style={{marginTop:0+"px",textWrap:"wrap" }}></p>
     
     </div>
     <div style={{  position:"fixed",display:"flex",justifyContent:"flex-end",right:10+"%",marginTop:-1.1+'%',fontSize:1.5+"vw"}}><span style={{color:"grey"}}>Current Editor:</span> <span style={{color:"lightgreen"}} id="editor-container"></span>  </div>
   <textarea   id={`myText` }
         onChange={()=>{
           
           Input()
            let input2 = document.getElementById("name").value;
           localStorage.setItem("TextEditor", input2);
           console.log("Onchange")
         }}
       
       
        className="slide" placeholder="Write Your Text.."  ></textarea> 
     </div>
    
    </>
  );
}

export default App;
