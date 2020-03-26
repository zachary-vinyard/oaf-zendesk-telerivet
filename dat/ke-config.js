/*
config file for Kenya Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
*/

module.exports = opts;

var opts = {
    'url' : null,
    'data_packer' : data_packer,
    'ticket_table' : 'CallBackUSSD', // placeholder for now - needs update
    'update_table' : true,
    'table_updater' : table_updater
};

var data_packer = function(account_number, call_category, phone_number){
    try{
        return {
            'ticket' : {
                'subject' : call_category,
                'raw_subject' : call_category,
                'requester_id' : find_user(account_number),
                'status' : 'open',
                'custom_fields' : [
                    {'id' : 360010566873, 'value' : phone_number},
                ],
            }
        };
    }
    catch(error){
        console.log(error) // placeholder for now so that we don't crash things when it happens
    }
};

var find_user = function(account_number){
    var response = httpClient.request(opts.url + '/users.json?query=account_number:' + account_number, {
        method : "GET",
        basicAuth : project.vars.zd_user + '/token:' + project.vars.zd_api_key
    });
    if(response.status < 200){
        console.log('got a user!!' + response.status);
        return response.content.users[0].id;
    }
    else if(response.status > 400){
        console.log(response.status);
        return null;
    }
};

var table_updater = function(account_number, call_category, phone_number){
    var ticket_table = getOrCreateDataTable(opts.ticket_table);
    ticket_table.createRow({vars : {'account_number' : account_number, 'call_category' : call_category, 'phone_number' : phone_number}});
};
