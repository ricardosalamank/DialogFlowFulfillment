// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  
  
  const ciudades = ['Bogotá','ciudad de mexico'];
  const tematicas = ['Inteligencia Artificial', 'React', 'Firebase Functions']
  const siguienteLive = {
  	dia: '20 de Febrero',
    hora: '7 PM',
    tema: 'Como convertirte en un desarrollador estrella'
  };
  
 
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  
  function obtenerCiudad(agent){
    if(ciudades.includes(agent.parameters.ciudad)){
      agent.add(`Genial te puedo ayudar a encontrar pláticas y talleres en tu ciudad o eventos en linea`);
      agent.add(new Suggestion('Pláticas'));
      agent.add(new Suggestion('Talleres'));
      agent.add(new Suggestion('Platzi Live'));
    } else {
      agent.add(`Oh ! Aun no hay meetups en tu ciudad, pero el siguiente Platzi Live es el dia ${siguienteLive.dia} a las 
				${siguienteLive.hora} y el tema es ${siguienteLive.tema}`);
    }
       
  }
  
  function detallePlatziLive(agent){
     agent.add(`Oh ! platzi live desde el fulfillment`);
  }
  
  
  function seleccionDeTelematica(agent){
    agent.add(`Super! A mi tambien me encantan los retos. 
				Estos son los temas que se van a cubrir proximamente en tu ciudad: ${tematicas.join(',')}. 
				¿Cual te interesa mas?`);
    agent.add(new Suggestion(tematicas[0]));
    agent.add(new Suggestion(tematicas[1]));
    agent.add(new Suggestion(tematicas[2]));
  }
  
  function detalleTaller(agent){
     agent.add(`El sabado 10 de febrero a las 7 PM en las oficinas de platzi 
				tendremos de React Hook.¿Te gustaria asistir?`);
     agent.add(new Suggestion('si'));
     agent.add(new Suggestion('no'));
  }
  
  function registroTaller(agent){
      agent.add(`Ok! Solo nos falta un detalle tecnico
				Para asistir debes registrarte en la plataforma de Meetup 
				¿Te gustaria explorar algo mas? Solo di: Quiero informacion de otra plática,
				taller o evento en linea`);
    
      agent.add(new Card({
      	title:'Registro en Meetup',
        imageUrl:'https://secure.meetupstatic.com/photos/event/3/9/3/f/600_481394655.jpeg',
        text:'Registrate en Meetup. Tambien puedes usar saltos de linea \n y hasta emojis !🙉🙉🙉',
        buttonText:'Registrarme',
        buttonUrl: 'https://www.meetup.com/es-ES/Berlin-React-Tech-Meetup-React-to-Pizza-and-Beer/events/261477450/'
      }));
  }
 
	


  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Obtener Ciudad',obtenerCiudad);
  intentMap.set('Live',detallePlatziLive);
  intentMap.set('Talleres',seleccionDeTelematica);
  intentMap.set('Seleccion de Taller',detalleTaller);
  intentMap.set('Seleccion de Taller - yes',registroTaller);
  agent.handleRequest(intentMap);
});
