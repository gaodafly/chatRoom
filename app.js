const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
// express创建网站服务器
const app = express();
// express 设置静态资源目录
app.use(express.static('public'))

const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

// 监听用户链接的事件 只要用户建立链接了就会触发该事件

let userArr = [];


io.on("connection", (socket) => {
    console.log('新用户链接了')

    socket.on('enterTo', (data) => {
        console.log('接收到了客户端发来的数据---', data)
        socket.currentUser = data;
        let res = userArr.find(function(item) {
            return item.name === data.name;
        })

        if (res) {
            // 更换名字
            socket.emit('enterErr', '有相同名字在聊天室')
        } else {
            io.emit('enterinner', data)
            userArr.push(data)
            io.emit('userList', userArr)
        }
    })

    socket.on('message', (data) => {
        console.log(data)
        io.emit('msg', data)
    })



    socket.on('disconnect', () => {
        console.log('有用户离开了', socket.currentUser.name)
        let index = userArr.findIndex((item) => {
            // console.log(item.name)
            return item.name === socket.currentUser.name;
        })
        userArr.splice(index, 1)
        io.emit('leave', socket.currentUser)
        io.emit('userList', userArr)
    })

});


httpServer.listen(3000, () => {
    console.log('监听和端口成功')
});