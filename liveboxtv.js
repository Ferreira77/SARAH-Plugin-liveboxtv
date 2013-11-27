// Liveboxtv.js
// Base code Java du plugins freebox de Jeam-Philipe Encausse
// Base code Java Pascal Linssen. 
// Modification Ferreira Agostinho.
//
// Version 1.2
// ======================================================
// Vérification que l'adresse ip soie bien une box orange
// Demande avant allumé la box tv.
// Limite de chaine de 99 a 999.
// 
exports.action = function(data, callback, config, SARAH){
  // On récupère la config
  config = config.modules.liveboxtv;
  if (!config.adress_ip){
    callback({ 'tts': 'Vous devez configurer le plugin Livebox avec le adresse I.P du décodeur Orange' });
    return;
  }
  // Si aucune "key" n'est passée, ça veut dire qu'on n'a pas reçu d'ordre
  if (!data.key){
    callback({ 'tts': 'Aucun ordre' });
    return;
  }
  // Si chaine et inferieur a 3 cela veux dire que c une chaine si egal 3 action telecommande
   var chaine = data.key.length ;
    // action telecommande
  //------------ verifie que l'ip et bien une box Orange TV
  if (data.key=="O999"){
			//------------ verifie que l'ip et bien une box Orange
			var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=10';
			var request = require('request');
				request({ 'uri' : url }, function (err, response, body){
				// récupération du fichier json
					var Orange= body;
					var Boxe = JSON.parse(Orange);
				// --- traitement des données Json	
				if (Boxe.result.data.friendlyName != "décodeur TV d'Orange") {
							callback({ 'tts': 'cette adresse I.P nes pas un décodeur Orange' });
							return;
							}
						else
						{
							SARAH.speak('Oui, Veux tu que jallume la box tv ? ');
							//------------------ ASKME ---------------------------
							var json={"request":{}};
							json.request.question = "?";
							json.request.answer = ["oui" , "non"];
							json.request.answervalue = ["http://" +config.adress_ip+ ":8080/remoteControl/cmd?operation=01&key=116&mode=0","http://127.0.0.1:8888/?tts= Daccord je la laisse éteinte."];
							json.request.no_answervalue = "http://127.0.0.1:8888/?tts=Daccord je la laisse éteinte.";
							json.request.answercallback=[true,true];
							json.request.TTSanswer=["Ok.","Ok."];
							json.request.recall = false;
							json.request.timeout =15;
							var url='http://127.0.0.1:8080/Sarah/askme';
							var request = require('request');
							request({ 
								'uri': url,
								'method': 'POST',
								'json': json,
								'timeout': 5000,
								}, 	function (err, response, body){
											// si pas de retour d'un code http 200 de la requête => arrêt du module
											if (err || response.statusCode != 200) {
														callback({'tts':' error '});
														return;}	
													
									});
							//-----	FIN ASKME
						}
				//--- fin traitement des données JSON 		
				});
			}		
  //-----	
  // Code de Pascal Linssen
  // pharse aléatoire pour la réponces  a la commande vocale
   var phrase_success = new Array();
        phrase_success[1] = ' Si tu veux !';
        phrase_success[2] = ' Comme tu la demander !';
        phrase_success[3] = ' Avec plaisir !';
		phrase_success[4] = ' Daccor !';
		phrase_success[5] = ' Je le fais de suite !';
  random = Math.floor((Math.random()*(phrase_success.length-1))+1);
  phrase_select = phrase_success[random]; 		
  // fin P.L
  
  if (chaine==4 && data.key!="O999" ){
				var OrdreDeco = data.key.substring(1,4);	
				// URL qui permet de discuter avec la livebox	 
				var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=01&key='+OrdreDeco+'&mode=0';
				var request = require('request');
					request({ 'uri' : url }, function (err, response, body){
										if (err || response.statusCode != 200) {
												callback({'tts': "Impossible de communiqué lavebox"});
												console.log('err :'+err);
												return;
												}
												// Code de Pascal Linssen
												// pharse aleratoire
												callback({'tts': phrase_select});
												//----------------------------- fin P.L
					}); 
				return; 
				}
  // Mis en forme pour le touche
  // tableau pour les touche 0-9
  var mychain=new Array("512","513","514","515","516","517","518","519","520","521");
  var ch1 = data.key.substring(0,1);
  var ch2 = data.key.substring(1,2);
  var ch3 = data.key.substring(2,3);
				// ch1 .
				if (ch1!=""){ 
							ch1 = mychain[ch1];
							var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=01&key='+ch1+'&mode=0';
							var request = require('request');
							request({ 'uri' : url }, function (err, response, body){//console.log(body);
									});
							}						
				// ch2
				if (ch2!=""){
							ch2 = mychain[ch2];
							var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=01&key='+ch2+'&mode=0';
							var request = require('request');
							request({ 'uri' : url }, function (err, response, body){//console.log(body);
									});
				}	
				// ch3
				if (ch3!=""){
							ch3 = mychain[ch3];
							var url = 'http://' +config.adress_ip+ ':8080/remoteControl/cmd?operation=01&key='+ch3+'&mode=0';
							var request = require('request');
							request({ 'uri' : url }, function (err, response, body){//console.log(body);
									});
				}	
	// retour de commande vocale				
	callback({'tts': data.msg });
				    
	               
  
}


