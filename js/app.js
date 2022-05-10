var context;
var shape = new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var interval;

var current_user = "";



$(document).ready(function() 
{
	checkRegisteration();
	validateLoginInput();
	Welcome();
});

function Start() {

	board = new Array();
	score = 0;
	pac_color = "yellow";
	var cnt = 100;
	var food_remain = 50;
	var pacman_remain = 1;
	start_time = new Date();
	for (var i = 0; i < 10; i++) {
		board[i] = new Array();
		//put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
		for (var j = 0; j < 10; j++) {
			if (
				(i == 3 && j == 3) ||
				(i == 3 && j == 4) ||
				(i == 3 && j == 5) ||
				(i == 6 && j == 1) ||
				(i == 6 && j == 2)
			) {
				board[i][j] = 4;
			} else {
				var randomNum = Math.random();
				if (randomNum <= (1.0 * food_remain) / cnt) {
					food_remain--;
					board[i][j] = 1;
				} else if (randomNum < (1.0 * (pacman_remain + food_remain)) / cnt) {
					shape.i = i;
					shape.j = j;
					pacman_remain--;
					board[i][j] = 2;
				} else {
					board[i][j] = 0;
				}
				cnt--;
			}
		}
	}
	while (food_remain > 0) {
		var emptyCell = findRandomEmptyCell(board);
		board[emptyCell[0]][emptyCell[1]] = 1;
		food_remain--;
	}
	keysDown = {};
	addEventListener(
		"keydown",
		function(e) {
			keysDown[e.keyCode] = true;
		},
		false
	);
	addEventListener(
		"keyup",
		function(e) {
			keysDown[e.keyCode] = false;
		},
		false
	);
	interval = setInterval(UpdatePosition, 250);
}

function findRandomEmptyCell(board) {
	var i = Math.floor(Math.random() * 9 + 1);
	var j = Math.floor(Math.random() * 9 + 1);
	while (board[i][j] != 0) {
		i = Math.floor(Math.random() * 9 + 1);
		j = Math.floor(Math.random() * 9 + 1);
	}
	return [i, j];
}

function GetKeyPressed() {
	if (keysDown[38]) {
		return 1;
	}
	if (keysDown[40]) {
		return 2;
	}
	if (keysDown[37]) {
		return 3;
	}
	if (keysDown[39]) {
		return 4;
	}
}

function Draw() {
	canvas.width = canvas.width; //clean board
	lblScore.value = score;
	lblTime.value = time_elapsed;
	for (var i = 0; i < 10; i++) {
		for (var j = 0; j < 10; j++) {
			var center = new Object();
			center.x = i * 60 + 30;
			center.y = j * 60 + 30;
			if (board[i][j] == 2) {
				context.beginPath();
				context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
				context.lineTo(center.x, center.y);
				context.fillStyle = pac_color; //color
				context.fill();
				context.beginPath();
				context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 1) {
				context.beginPath();
				context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
				context.fillStyle = "black"; //color
				context.fill();
			} else if (board[i][j] == 4) {
				context.beginPath();
				context.rect(center.x - 30, center.y - 30, 60, 60);
				context.fillStyle = "grey"; //color
				context.fill();
			}
		}
	}
}

function UpdatePosition() {
	board[shape.i][shape.j] = 0;
	var x = GetKeyPressed();
	if (x == 1) {
		if (shape.j > 0 && board[shape.i][shape.j - 1] != 4) {
			shape.j--;
		}
	}
	if (x == 2) {
		if (shape.j < 9 && board[shape.i][shape.j + 1] != 4) {
			shape.j++;
		}
	}
	if (x == 3) {
		if (shape.i > 0 && board[shape.i - 1][shape.j] != 4) {
			shape.i--;
		}
	}
	if (x == 4) {
		if (shape.i < 9 && board[shape.i + 1][shape.j] != 4) {
			shape.i++;
		}
	}
	if (board[shape.i][shape.j] == 1) {
		score++;
	}
	board[shape.i][shape.j] = 2;
	var currentTime = new Date();
	time_elapsed = (currentTime - start_time) / 1000;
	if (score >= 20 && time_elapsed <= 10) {
		pac_color = "green";
	}
	if (score == 50) {
		window.clearInterval(interval);
		window.alert("Game completed");
	} else {
		Draw();
	}
}

function Welcome()
{
	if(current_user === "")
	{
		$(".screen").hide();
		$("#welcome_menu").show();
	}
	else
	{
		$(".screen").hide();
		$("#after_login").show();
	}

}

/////////////////////// register section ///////////////////////////
function Register()
{
	$(".screen").hide();
	$("#register_menu").show();
}

// register user to game
function NewUser()
{
	var username = document.querySelector("#reg_username").value;
	if (users.some(user => user.username === username))
	{
		alert("username exist in the system");
	}
	else
	{
		addUser();
		$(".screen").hide();
		$("#welcome_menu").show();
	}

	//clear the inputs after submit
	$('#register_form').each(function()
	{
		this.reset();
	});
}


// register user to game
function addUser()
{
    var user = document.querySelector("#reg_username").value;
    var pass = document.querySelector("#reg_password").value;
    var first_name = document.querySelector("#first_name").value;
    var last_name = document.querySelector("#last_name").value;
    var email = document.querySelector("#email").value;
    var birthdate = document.querySelector("#date").value;
    fullName = first_name.concat(" ", last_name);
    var user = {
        username: user, 
        password: pass, 
        full_name: fullName, 
        email: email, 
        birthdate: birthdate,
    };
    users.push(user);
    alert("User added to game");
}



/////////////////////////////////////////////////////////////


/////////////////////// login section ///////////////////////////
function Login()
{
	$(".screen").hide();
	$("#login_menu").show();
}

function CheckLogin()
{
	//clear the inputs after submit
	var username = document.querySelector("#username").value;
	var password = document.querySelector("#password").value;
	var user = users.find(u => u.username === username);
	if (user != undefined)
	{
		if(user.password === password)
		{
			current_user = user.username;
			alert("success to login");
			$(".screen").hide();
			$("#after_login").show();
			document.getElementById("userToPut").innerHTML = "User: " + current_user;
		}
	}
	else
	{
		alert("username or passowrd not correct");
	}
	$('#login_form').each(function()
	{
		this.reset();
	});
}


////////////////////////////////////////////////////////////////////


/////////////////////// logout section ///////////////////////////

function Logout()
{
	current_user = "";
	$(".screen").hide();
	$("#welcome_menu").show();
}


////////////////////////////////////////////////////////////////////



/////////////////////// setting section ///////////////////////////
function Setting()
{
	document.getElementById("up_button").innerHTML = key_play[0].up;
	document.getElementById("down_button").innerHTML = key_play[0].down;
	document.getElementById("right_button").innerHTML = key_play[0].right;
	document.getElementById("left_button").innerHTML = key_play[0].left;
	$(".screen").hide();
	$("#setting_menu").show();
}

function UpButton()
{
	key_play[0].up = "w";
	document.getElementById("up_button").innerHTML = key_play[0].up;
}

function DownButton()
{
	key_play[0].down = "s";
	document.getElementById("down_button").innerHTML = key_play[0].down;
}

function RightButton()
{
	key_play[0].right = "d";
	document.getElementById("right_button").innerHTML = key_play[0].right;
}

function LeftButton()
{
	key_play[0].left = "a"
	document.getElementById("left_button").innerHTML = key_play[0].left;
}

///////////////////////////////////////////////////////////////////



/////////////////////// about section ///////////////////////////
function About()
{
		$("#about_menu").dialog({
			model: true,
			// autoOpen: false,
			title: "test",
			hight: 600,
			width: 800,
			draggable: false,
			resizable: false,
			closeOnEscape: true,
			show: 
			{
			effect: "blind",
			duration: 500
			},
			hide: 
			{
			effect: "explode",
			duration: 700
			},
			clickOutside: false,
			// clickOutsideTrigger: ""
		});

}
////////////////////////////////////////////////////////////////


/////////////////////// game section ///////////////////////////
function Game_page()
{
	$(".screen").hide();
	$("#game_page").show();
	context = canvas.getContext("2d");
	Start();
}

///////////////////////////////////////////////////////////////