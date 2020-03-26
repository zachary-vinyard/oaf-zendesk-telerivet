/*
config file for Kenya Zendesk set up
**Store API key as project variable in Telerivet. do no store here.**
*/

module.exports = {
    'url' : null,
    'data_packer' : data_packer
};

var data_packer = function(account_number, call_category){ //placeholder for now - needs update once available
    return {
        'ticket' : {
            'account_number' : account_number,
            'call_category': call_category
        }
    };
};
