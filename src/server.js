import express from "express";
import SocketIO from "socket.io";
// import WebSocket from "ws";
import http from "http";
//import { instrument } from "@socket.io/admin-ui";
 
const app = express();  
app.set("view engine","pug");
app.set("views",__dirname+"/views");
app.use("/public", express.static(__dirname+ "/public"));
app.get("/",(_, res) => res.render("home")); 
app.get("/*", (_,res) => res.redirect("/"));
const handleListen =() => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);
const wsServer = SocketIO(server);

wsServer.on("connection", (socket) => {
   socket.on("join_room",(roomName) => {
      socket.join(roomName);
      socket.to(roomName).emit("welcome");
   });
   socket.on("offer", (offer, roomName) => {
      socket.to(roomName).emit("offer", offer);
   });
   socket.on("answer", (answer, roomName) => {
      socket.to(roomName).emit("answer", answer);
   });
   socket.on("ice", (ice,roomName) => {
      socket.to(roomName).emit("ice", ice);
   })
});



/* 채팅 파트
 const wsServer = new Server(httpServer, {
   cors: {
   origin: ["https://admin.socket.io"],
   credentials: true,
   },
   });

   instrument(wsServer, {
      auth: false,
      });

function publicRooms(){
   const {sockets: { adapter : {sids, rooms}}} = wsServer;
   const publicRooms = [];
   rooms.forEach((_, key) => {
      if(sids.get(key) === undefined){
         publicRooms.push(key);
      }
      return publicRooms;
   });
}

function countRoom(){
    return wsServer.adapter.sockets.rooms.get(roomName)?.size;
}

wsServer.on("connection", (socket) => {
   socket.onAny((event) => {
     console.log(`Socket Event: ${event}`);
   });
   socket.onAny((event) => {
      console.log(`Socket Event: ${event}`);
    });
   socket.on("enter_room", (roomName,nickname, done) => {
     socket.join(roomName);
     socket["nickname"] = nickname;
     done();
     socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
     wsServer.sockets.emit("room_change",publicRooms());
   });
   
   socket.on("disconnecting", () => {
     socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room)-1));
   });
   
   socket.on("disconnect", () => {
     wsServer.sockets.emit("room_change", publicRooms());
   });

   socket.on("new_message", (msg, room, done) => {
     socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
     done();
   });
   socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
 });


// function onSocketClose(){
//    console.log("Disconnected the browser");
// }

// const sockets = [];

//const wss =  new WebSocket.Server({ server });
// wss.on("connection",(socket) => { 
//    sockets.push(socket);
//    socket["nickname"] = "Anon";
//    socket.on("close", onSocketClose);
//    socket.on("message", (msg) => {
//       const message = JSON.parse(msg);
//       switch (message.type){
//          case "new_message":
//             sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
//          case "nickname":
//             socket["nickname"] = message.payload;

//       }


//    });
// });
*/

server.listen(3000,handleListen); 