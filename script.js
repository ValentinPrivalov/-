var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function User() {
    this.status = ""; // "NEW", "WAIT", "SERVICE" "GOOD", "BAD"
    this.x = 0;
    this.y = 0;
    this.width = 40;
    this.height = 40;
    this.img = "";
    this.waitTime = 3000; //3 sec
    this.startWaitTime = 0;
    this.serviceTime = 2000; //2 sec
    this.startServiceTime = 0;
    this.queuePosY = 200;
}

var users = []; // collections of users
var queue = [];

var countUsers = 0;
var countUsersGood = 0;
var countUsersBad = 0;
var maxQueueLength = 10;

var startQueuePosY = 180;
var timeNow = 0;
var minWaitTime = 10000;
var maxWaitTime = 20000;
var minServiceTime = 2000;
var maxServiceTime = 5000;
var animationStep = 5;
var animationSpeed = 30; // 10 - 0.01 sec by step

var imgDefault = "user.png";
var imgWait = "user-wait.png";
var imgService = "user-service.png";
var imgGood = "user-good.png";
var imgBad = "user-bad.png";


window.addEventListener("load", Refreshing, true);
document.getElementById("addUser").addEventListener("click", addUser, true);
document.getElementById("addUsers").addEventListener("click", addUsers, true);
document.getElementById("repeating").addEventListener("click", Repeating, true);

//____________________________________________________________________________
var refresh = null;
function Refreshing() {
    refresh = setInterval(function() {

        timeNow = Math.floor(Date.now() / 100) * 100;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        calcCount();
        drawMarket();
        drawUsers();

        if (queue.length !== maxQueueLength) {
            document.getElementById("addUser").style.display = "block";
            document.getElementById("addUsers").style.display = "block";
        } else {
            document.getElementById("addUser").style.display = "none";
            document.getElementById("addUsers").style.display = "none";
        }
    }, animationSpeed);
}
//____________________________________________________________________________

function calcCount() {
    document.getElementById("countUsers").innerHTML = String(countUsers);
    document.getElementById("countUsersGood").innerHTML = String(countUsersGood);
    document.getElementById("countUsersBad").innerHTML = String(countUsersBad);
}

function drawMarket() {
    var market = new Image();
    market.src = "market.png";
    ctx.drawImage(market, 300, 0);
}

function Repeating() { //todo

}

function addUsers() {
    var count = maxQueueLength - queue.length;
    console.log(count);
    for (var i = 0; i < count; i++) {
        addUser();
        /*var addOneUser = setInterval(function() { //todo
            addUser();
            clearInterval(addOneUser);
        }, animationSpeed);*/
    }
}

function addUser() {
    var user = new User();
    user.img = imgDefault;
    user.status = "NEW";
    user.x = (canvas.width - user.width) / 2;
    user.y = canvas.height - user.height;
    user.queuePosY = startQueuePosY + users.length * user.height;
    user.waitTime = Math.floor(Math.random() * (maxWaitTime - minWaitTime + 1) / 100) * 100 + minWaitTime;
    user.serviceTime = Math.floor(Math.random() * (maxServiceTime - minServiceTime + 1) / 100) * 100 + minServiceTime;
    countUsers++;
    users.push(user); // add user to collection
    queue.push(user); // add user to queue
}

function drawUsers() {
    for (var i = 0; i < users.length; i++) {

        switch (users[i].status) {

            case "NEW":
                if (users[i].y === startQueuePosY + queue.indexOf(users[i]) * users[i].height) {
                    if (queue.indexOf(users[i]) === 0) {
                        users[i].startServiceTime = timeNow;
                        users[i].img = imgService;
                        users[i].status = "SERVICE";
                    } else {
                        users[i].startWaitTime = timeNow;
                        users[i].img = imgWait;
                        users[i].status = "WAIT";
                    }
                } else {
                    users[i].y -= animationStep;
                }
                break;

            case "WAIT":
                if (users[i].y !== startQueuePosY + queue.indexOf(users[i]) * users[i].height) {
                    users[i].y -= animationStep;
                }
                if (queue.indexOf(users[i]) === 0 && users[i].y === startQueuePosY + queue.indexOf(users[i]) * users[i].height) {
                    users[i].startServiceTime = timeNow;
                    users[i].img = imgService;
                    users[i].status = "SERVICE";
                }
                if (users[i].waitTime === timeNow - users[i].startWaitTime && queue.indexOf(users[i]) > 4) {
                    queue.splice(queue.indexOf(users[i]), 1);
                    countUsersBad++;
                    users[i].img = imgBad;
                    users[i].status = "BAD";
                }
                break;

            case "SERVICE":
                if (users[i].serviceTime === timeNow - users[i].startServiceTime) {
                    queue.splice(queue.indexOf(users[i]), 1);
                    countUsersGood++;
                    users[i].img = imgGood;
                    users[i].status = "GOOD";
                }
                break;

            case "GOOD":
                if (users[i].x > -50) {
                    users[i].x -= animationStep;
                }
                break;

            case "BAD":
                if (users[i].x < 850) {
                    users[i].x += animationStep;
                }
                break;

        }

        var img = new Image();
        img.src = users[i].img;
        ctx.drawImage(img, users[i].x, users[i].y);
        ctx.font = "bold 10px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.fillText(String(i + 1), users[i].x + 20, users[i].y + 35);
    }
}