// Import modules
import * as user from './modules/user.js';
import * as log from './modules/log.js';

jQuery(function ($) {
    $('#theme-switch').click(function () {
        if ($(this).is(':checked')) {
            $("#theme-set").removeClass('chiller-theme');
        } else {
            $("#theme-set").addClass('chiller-theme');
        }
    });

    $(".page-row").click(function () {
        window.location = $(this).data("href");
    });

    $(".sidebar-dropdown > a").hover(function () {
        $(".sidebar-submenu").slideUp(200);
        if (
            $(this)
            .parent()
            .hasClass("active")
        ) {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .parent()
                .removeClass("active");
        } else {
            $(".sidebar-dropdown").removeClass("active");
            $(this)
                .next(".sidebar-submenu")
                .slideDown(200);
            $(this)
                .parent()
                .addClass("active");
        }
    });

    $("#close-sidebar").click(function () {
        $(".page-wrapper").removeClass("toggled");
    });
    $("#show-sidebar").click(function () {
        $(".page-wrapper").addClass("toggled");
    });
});

// General functions
// Convert string to 32bit integer 
function Hash(string) {
    var hash = 0;

    if (string.length == 0) return hash;

    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return hash;
}

async function add_log_data(id, name, action, value) {
    if(id === null) {
        log.addLogData(name, action, value);
    } else if (name === null) {
        var userData = await user.selectUserById(id);
        console.log(userData);

        log.addLogData(userData.name, action, value);
    }
}



export function add_user() {
    // Get values
    var name = $("#name").val();
    var password = $("#password").val();
    var money = $("#money").val();

    // Check if input is empty
    if (name !== "" && password !== "" && money !== 0) {
        if (password.length >= 5) {
            user.addUser(name, Hash(password), money);
            add_log_data(null, name, 1, money);
            $(location).attr('href', '/pages/entity_list.html');
        } else {
            alert("Wachtwoord moet minimaal 5 tekens lang!");
        }
    } else {
        alert("Laat de textboxen niet leeg!");
    }
}

export async function show_user_list() {
    var list = await user.SelectAllUsers();

    if (!list) {
        alert("Geen Gebruikers gevonden!");
    } else {
        for (var i = 0; i < list.length; i++) {
            var Payed = list[i].money_total;

            var moneyLeft = list[i].money_total - (list[i].beer_total / 2);
            var beerLeft = moneyLeft * 2;


            var name = "<td>" + list[i].name + "</td>";
            var money_total = "<td>" + Payed + "</td>";
            var money_left = "<td>" + moneyLeft + "</td>";
            var beer_total = "<td>" + list[i].beer_total + "</td>";
            var beer_left = "<td>" + beerLeft + "</td>";
            var present = "<td>" + list[i].times_present + "</td>";

            var takeBeerBtn = $('<button type="button" class="btn btn-success" id="' + list[i].id + '">Pak</button>').click(function () {
                take_beer($(this).attr('id'));
            });

            var loginBtn = $('<button type="button" class="btn btn-primary" id="' + list[i].id + '">Login</button>').click(function () {
                login($(this).attr('id'));
            });

            var tr = $('<tr>').append(name + money_total + money_left + beer_total + beer_left + present);
            $('<td>').append(takeBeerBtn).appendTo(tr);
            $('<td>').append(loginBtn).appendTo(tr);
            $('#user_list').append(tr);
        }
    }
}

export async function login(id) {
    // Get password
    var password = prompt("Voer hier uw wachtwoord in: ");
    
    // Check if prompt is canceld
    if (password !== null) {
        // Await response
        var response = await user.selectUserByIdPassword(id, Hash(password));
        
        // Check if response is false
        if (!response) {
            alert('Wachtwoord verkeerd');
        } else {
            // Set data in session and go to entity_info page
            sessionStorage.setItem('user', JSON.stringify(response));
            $(location).attr('href', '/pages/entity_info.html');
        }
    }
}

export function show_user_info() {
    // Get data previously stored in session
    var data = JSON.parse(sessionStorage.getItem("user"));

    // Check if data is empty
    if (data !== null) {
        var moneyLeft = data.money_total - (data.beer_total / 2);
        var beerLeft = moneyLeft * 2;

        $("#id").val(data.id);
        $("#name").val(data.name);
        $("#money").val(data.money_total);
        $("#moneyLeft").val(moneyLeft);
        $("#beerTaken").val(data.beer_total);
        $("#beerLeft").val(beerLeft);
    } else {
        $(location).attr('href', '/index.html');
    }

    // Before going away delete session
    window.addEventListener("beforeunload", function () {
        sessionStorage.removeItem("user");
    });
}

export function add_money() {
    // Get values
    var id = $("#id").val();
    var amount = $("#moneyInsert").val();

    // Add values and go back
    user.addMoneyToUser(id, amount);
    add_log_data(id, null, 2, amount);
    $(location).attr('href', '/pages/entity_list.html');
}

export function present() {
    // Get value
    var id = $("#id").val();

    // Add value and go back
    user.userPresent(id);
    add_log_data(id, null, 4, 0);
    $(location).attr('href', '/pages/entity_list.html');
}

export function take_beer(id) {
    // Take beer
    user.takeBeer(id);
    
    // Add to log table and reload page;
    add_log_data(id, null, 3, 1);
    location.reload();
}

export async function show_log_data() {
    // Await log data an actions
    var action = await log.getLogAction();
    var data = await log.getLogData();

    if (!data) {
        alert("Geen Gebruikers gevonden!");
    } else {
        // Loop trough rows
        for (var i = 0; i < data.length; i++) {
            switch(data[i].action) {
                case action[0].id:
                    var actiontd = "<td>" + action[0].action + "</td>";
                    break;
                case action[1].id:
                    var actiontd = "<td>" + action[1].action + "</td>";
                    break;
                case action[2].id:
                    var actiontd = "<td>" + action[2].action + "</td>";
                    break;
            }

            // Set results in variables
            var timestamp = "<td> [" + data[i].datetime + "] </td>";
            var name = "<td>" + data[i].name + "</td>";
            var value = "<td>" + data[i].value + "</td>";

            // Set message
            var msg = "<tr>" + timestamp + name + actiontd + value + "</tr>";
            $('#log').append(msg);
        }
    }
}
