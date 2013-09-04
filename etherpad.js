var page = require('webpage').create();
var args = require('system').args;
var system = require('system');
phantom.cookiesEnabled = true;

if (args.length < 3) {
	console.log("usage:");
	console.log("\tphantomjs --cookies-file=<file> etherpad.js <pad url> <command> <arg>\n");
	console.log("commands are :");
	console.log(" - nick : attribute a nickname, given as argument, to the cookie session.");
	console.log(" - write : write a message given as argument on the pad.");
	console.log(" - chat : write a message given as argument in the chat box.");
	console.log("\nwrite and chat messages should be passed as one argument. Thus, if it contains spaces, use quotes to protect them.");
	console.log("if no arguments are passed to write or chat, each line of the standard input is used.");
	phantom.exit();
}

function focusNick(){
	return page.evaluate(function(){e = document.getElementById('myusernameedit'); e.focus();return e;});
}

function focusChat(){
	return page.evaluate(function(){e = document.getElementById('chatentrybox'); e.focus(); return e;});
}

function focusPad() {
	focusNick();
        page.sendEvent('keypress', page.event.key.Tab, null, null, 0x02000000);
}

function write(msg) {
	focusChat();
	page.sendEvent('keypress', msg);
	page.sendEvent('keypress', page.event.key.Home, null, null, 0x04000000 | 0x02000000);
	page.sendEvent('keypress', 'x', null, null, 0x04000000);

	focusPad();
	page.sendEvent('keypress', page.event.key.End, null, null, 0x04000000);
	page.sendEvent('keypress', 'v', null, null, 0x04000000);
        if (!msg) {
               page.sendEvent('keypress', page.event.key.Enter);
	}
}

function chat(msg) {
	focusChat();
        page.sendEvent('keypress', page.event.key.Home, null, null, 0x04000000 | 0x02000000);
        page.sendEvent('keypress', msg);
	page.sendEvent('keypress', page.event.key.Enter);
}

function nick(name) {
	focusNick();
        page.sendEvent('keypress', page.event.key.Home, null, null, 0x04000000 | 0x02000000);
	page.sendEvent('keypress', name);
        page.sendEvent('keypress', page.event.key.Enter);
}

function stdinwrite(fh) {
    if (! system.stdin.AtEndOfStream) {
	line = system.stdin.readLine();
	write(line);
	setTimeout(stdinwrite, 500);
    } else
	phantom.exit();
}

function filechat(fh) {
    while(line = system.stdin.readLine()) {
	chat(line);
    }
}

page.open(args[1], function () {
    page.viewportSize = {width: 1024, height: 800};
    setTimeout(function(){
	var donotexit = 0;
	if (args[2] == 'write') {
	    if (args[3]) {
		write(args[3]);
	    }else{
		donotexit = 1;
		stdinwrite();
	    }
	} else if (args[2] == 'chat') {
	    if (args[3]) {
		chat(args[3]);
	    }else{
		stdinchat();
	    }
	} else if (args[2] == 'nick') {
	    nick(args[3]);
	} else {
	    console.log("Unknown command "+args[2]);
	}
	if (!donotexit) 
	    setTimeout(function(){phantom.exit()}, 500);
    }, 500);
});

