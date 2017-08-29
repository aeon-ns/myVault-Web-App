var parse = require('csv-parse');


var input = '"username","password","title"\n"ns","pass","paswword1"\n"ns1","pass1","paswword12"\n"ns3","pas3s","paswword13"';

parse(input, {}, function(err, output) {
    for(var i =0 ; i<output.length;i++)
        console.log(output[i]);

    console.log(output);    
});