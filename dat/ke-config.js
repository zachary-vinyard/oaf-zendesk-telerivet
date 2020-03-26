/*
config file for Kenya Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
*/

module.exports = {
    'url' : null,
    'data_packer' : data_packer,
    'ticket_table' : 'ticket_table_name' // placeholder for now - needs update
};

var data_packer = function(account_number, call_category){ //placeholder for now - needs update once available
    return {
        'ticket' : {
            'account_number' : account_number,
            'call_category': call_category
        }
    };
};
