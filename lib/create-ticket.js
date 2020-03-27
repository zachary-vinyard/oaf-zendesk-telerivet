/*
module for ticket creation on zendesk via telerivet
*/

var country_opts = {
    'rw' : "../dat/rw-config",
    'ke' : "../dat/ke-config"

};

module.exports = function (account_number, call_category, phone_number){
    console.log(country_opts[project.vars.country]);
    var opts = require(country_opts[project.vars.country]);
    var dat = opts.data_packer(account_number, call_category, phone_number);
    console.log(dat);
    var response = httpClient.request(opts.url + '/tickets.json', {
        method : "POST",
        data : dat,
        headers : {'Content-Type': 'application/json'},
        basicAuth : project.vars.zd_user + '/token:' + project.vars.zd_api_key
    });
    if(response.status < 300){
        console.log('okay!' + response.status);
        if(opts.update_table){
            //console.log(response.content)
            opts.table_updater(account_number, call_category, phone_number, JSON.parse(response.content).ticket.id);
        }
        return true;
    }
    else if(response.status > 300){
        console.log('ticket create failed ' + response.status);
        //console.log(response.content)
        return false;
    }
};
