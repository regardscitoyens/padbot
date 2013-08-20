var page = require('webpage').create();
var args = require('system').args;
phantom.cookiesEnabled = true;

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

page.open(args[1], function () {
	page.viewportSize = {width: 1024, height: 800};
	setTimeout(function(){
		if (args[2] == 'write') {
			write(args[3]);
		} else if (args[2] == 'chat') {
			chat(args[3]);
		} else if (args[2] == 'nick') {
			nick(args[3]);
		} else {
			console.log("Unknown command "+args[2]);
		}
		setTimeout(function(){phantom.exit()}, 500);
	}, 500);
});

