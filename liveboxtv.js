// Base code du plugins freebox
exports.action = function(data, callback, config, SARAH){
  // On récupère la config
  config = config.modules.liveboxtv;
  if (!config.adress_ip){
    callback({ 'tts': 'Vous devez configurer le plugin Lavebox avec le adresse I.P du decodeur' });
    return;
  }
  
  // Si aucune "key" n'est passée, ça veut dire qu'on n'a pas reçu d'ordre
  if (!data.key){
    callback({ 'tts': 'Aucun ordre' });
    return;
  }

  // URL qui permet de discuter avec la livebox
  // si chaine et inferieur a 3 cela veux dire que c une chaine si egal 3 action telecommande
  var chaine = data.key.length ;
  // egale 3 commande 	 
	 if (chaine==3){		
					var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=01&key='+data.key+'&mode=0';
					var request = require('request');
					request({ 'uri' : url }, function (err, response, body){
							  	if (err || response.statusCode != 200) {
												callback({'tts': "Impossible de communiqué lavebox"});
												console.log('err :'+err);
												return;
												}
										callback({'tts' : " Voilà"});
								}); 
                   }
  // egale 2 programe
  // tableau pour les touche 0-9
  var mychain=new Array("512","513","514","515","516","517","518","519","520","521");
     if (chaine==2){
	                var ch1 = data.key.substring(0,1);
					var ch2 = data.key.substring(1,2);
					if (ch1==""){ch1="0";}
					console.log('ch1 :'+ch1);
					console.log('ch2 :'+ch2);
					ch1 = mychain[ch1];
					ch2 = mychain[ch2];
					console.log('ch1 :'+ch1);
					console.log('ch2 :'+ch2);
					// ch1 ne pas faire la requet si egal a zero
					if (ch1!="512"){
							var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=01&key='+ch1+'&mode=0';
							var request = require('request');
							request({ 'uri' : url }, function (err, response, body){//console.log(body);
							});
							}						
					// ch2
					var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=01&key='+ch2+'&mode=0';
					var request = require('request');
						request({ 'uri' : url }, function (err, response, body){//console.log(body);
						}); 
					callback({'tts': data.msg });
					}
	               
  
}


