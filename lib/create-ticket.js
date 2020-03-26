/*
module for ticket creation on zendesk via telerivet
*/

var country_opts{
    'rw' : "../dat/rw-config"
    'ke' : "../dat/ke-config"

};

module.exports = function (account_number, country, call_category){
    var opts = require(country_opts[country]);
    var response = httpClient.request(opts.url + '/tickets.json', {
        method : "POST",
        data : {
            "ticket" : {

            },
        },
        basicAuth : project.vars.zd_user + '/token:' + project.vars.zd_api_key
    });
    if(response.status < 200){
        console.log('okay!');
        //add code to log to database
    }
    if(response.status > 400){
        console.log(response.status);
        return 'error, error, error!';
    }
};
