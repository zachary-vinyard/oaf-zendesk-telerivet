/*
config file for Kenya Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
*/

//finds a user on KE zendesk. now should create if one is not there
var find_user = function(account_number){
    console.log(opts.url)
    var response = httpClient.request(opts.url + '/users.json?query=account_number:' + account_number, {
        method : "GET",
        basicAuth : project.vars.zd_user + '/token:' + project.vars.zd_api_key
    });
    if(response.status < 300){
        console.log('got a user!!' + response.status);
        console.log(JSON.stringify(response.content.users));
        return response.content.users[0].id;
    }
    else if(response.status > 300){
        console.log('failed at find user ' + response.status +'/ncreating blank user');
        var id = create_user(account_number);
        return id;
    }
};

var create_user = function(account_number){
    console.log("createing a user");
    var response = httpClient.request(opts.url + '/users.json', {
        method : "POST",
        data : {
            'name' : 'UNIDENTIFIED AN PLEASE UPDATE',
            'user_fields' : {
                'account_number' : account_number
            }
        },
        basicAuth : project.vars.zd_user + '/token:' + project.vars.zd_api_key
    });
    if(response.status < 300){
        console.log('created a user!!' + response.status);
        console.log(JSON.stringify(response));
        return response.content.user.id;
    }
    else if(response.status > 300){
        console.log('failed at create user ' + response.status);
        return null;
    }
}

var data_packer = function(account_number, call_category, phone_number){
    try{
        return JSON.stringify({
            'ticket' : {
                'subject' : call_category,
                'raw_subject' : call_category,
                'requester_id' : find_user(account_number),
                'status' : 'open',
                'custom_fields' : [
                    {'id' : 360010566873, 'value' : phone_number},
                ],
            }
        });
    }
    catch(error){
        console.log(error) // placeholder for now so that we don't crash things when it happens
    }
};

var table_updater = function(account_number, call_category, phone_number, ticket_id){
    var ticket_table = getOrCreateDataTable(opts.ticket_table);
    ticket_table.createRow({vars : {'account_number' : account_number, 'call_category' : call_category, 'phone_number' : phone_number, 'ticket_id' : ticket_id}});
};

var opts = {
    'url' : "https://oneacrefund-ke.zendesk.com/api/v2",
    'data_packer' : data_packer,
    'ticket_table' : 'CallBackUSSD', //true as of 26 mar 2020
    'update_table' : true,
    'table_updater' : table_updater
};

module.exports = opts;
